import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { readJson, pathExists, walkFiles } from './io.js';
import type { InspectResult, StackInfo } from './types.js';

interface PackageJson {
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

function has(deps: Record<string, string>, name: string): boolean {
  return Object.prototype.hasOwnProperty.call(deps, name);
}

function detectFramework(deps: Record<string, string>): string | undefined {
  if (has(deps, 'next')) return 'next';
  if (has(deps, 'nuxt')) return 'nuxt';
  if (has(deps, '@remix-run/react')) return 'remix';
  if (has(deps, 'astro')) return 'astro';
  if (has(deps, '@angular/core')) return 'angular';
  if (has(deps, '@sveltejs/kit')) return 'sveltekit';
  if (has(deps, 'svelte')) return 'svelte';
  if (has(deps, 'vue')) return 'vue';
  if (has(deps, 'react')) return 'react';
  return undefined;
}

function detectComponentLibrary(deps: Record<string, string>): string | undefined {
  if (has(deps, '@mui/material')) return 'material-ui';
  if (has(deps, 'antd')) return 'ant-design';
  if (has(deps, '@chakra-ui/react')) return 'chakra-ui';
  if (has(deps, '@mantine/core')) return 'mantine';
  if (has(deps, 'primereact')) return 'primereact';
  if (Object.keys(deps).some((name) => name.startsWith('@radix-ui/'))) return 'radix-ui';
  if (has(deps, '@headlessui/react') || has(deps, '@headlessui/vue')) return 'headless-ui';
  return undefined;
}

function detectStyling(deps: Record<string, string>): string {
  if (has(deps, 'tailwindcss')) return 'tailwind';
  if (has(deps, 'styled-components')) return 'styled-components';
  if (has(deps, '@emotion/react')) return 'emotion';
  if (has(deps, 'bootstrap')) return 'bootstrap';
  if (has(deps, 'sass')) return 'sass';
  if (has(deps, 'less')) return 'less';
  return 'css';
}

export async function inspectRepository(directory: string): Promise<InspectResult> {
  const absolute = path.resolve(directory);
  const packagePath = path.join(absolute, 'package.json');
  const stack: StackInfo = {};
  const evidence: string[] = [];
  let pkg: PackageJson = {};

  if (await pathExists(packagePath)) {
    pkg = await readJson<PackageJson>(packagePath);
    const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
    stack.framework = detectFramework(deps);
    stack.language = has(deps, 'typescript') ? 'typescript' : 'javascript';
    stack.styling = detectStyling(deps);
    stack.componentLibrary = detectComponentLibrary(deps);
    if (!stack.componentLibrary && await pathExists(path.join(absolute, 'components.json'))) stack.componentLibrary = 'shadcn';
    stack.storybook = Object.keys(deps).some((name) => name.startsWith('@storybook/'));
    if (has(deps, 'vitest')) stack.testRunner = 'vitest';
    else if (has(deps, 'jest')) stack.testRunner = 'jest';
    else if (has(deps, '@playwright/test')) stack.testRunner = 'playwright';
    if (has(deps, 'vite')) stack.bundler = 'vite';
    else if (has(deps, 'webpack')) stack.bundler = 'webpack';
    else if (stack.framework === 'next') stack.bundler = 'next';

    if (await pathExists(path.join(absolute, 'pnpm-lock.yaml'))) stack.packageManager = 'pnpm';
    else if (await pathExists(path.join(absolute, 'yarn.lock'))) stack.packageManager = 'yarn';
    else if (await pathExists(path.join(absolute, 'bun.lock')) || await pathExists(path.join(absolute, 'bun.lockb'))) stack.packageManager = 'bun';
    else stack.packageManager = 'npm';
  }

  const files = await walkFiles(absolute, {
    ignore: ['node_modules', '.git', 'dist', 'build', '.next', '.nuxt', '.svelte-kit', 'coverage', '.design-frontier'],
    extensions: ['.tsx', '.jsx', '.vue', '.svelte', '.css', '.scss', '.sass', '.less'],
    maxFiles: 3000
  });
  const componentFiles = files.filter((file) => /(?:components?|ui)[/\\]|\.(tsx|jsx|vue|svelte)$/.test(file)).slice(0, 200).map((file) => path.relative(absolute, file));
  const styleFiles = files.filter((file) => /\.(css|scss|sass|less)$/.test(file)).slice(0, 200).map((file) => path.relative(absolute, file));
  const variables = new Set<string>();
  const colors = new Map<string, number>();
  const stylingSignals = new Map<string, number>();
  const routeFiles = files.filter((file) => /(?:^|[\\/])(app|pages|routes)[\\/]/.test(path.relative(absolute, file))).slice(0, 250).map((file) => path.relative(absolute, file));
  const componentInventory = componentFiles.map((relative) => {
    const base = path.basename(relative).replace(/\.(tsx|jsx|vue|svelte)$/i, '');
    const lower = relative.toLowerCase();
    const category = /button|input|select|dialog|modal|table|card|badge|tabs|nav|sidebar/.test(lower) ? 'ui-primitive' : /layout|shell|header|footer/.test(lower) ? 'layout' : 'feature';
    return { name: base, path: relative, category };
  });

  for (const relative of [...new Set([...styleFiles.slice(0, 150), ...componentFiles.slice(0, 250)])]) {
    let content = '';
    try { content = await readFile(path.join(absolute, relative), 'utf8'); } catch { continue; }
    for (const match of content.matchAll(/(--[a-zA-Z0-9-_]+)\s*:/g)) {
      const variable = match[1];
      if (variable) variables.add(variable);
    }
    for (const [signal, regex] of Object.entries({ 'tailwind-arbitrary': /\[[^\]]+\]/g, 'inline-style': /style\s*=\s*[{"']/g, 'rounded-large': /rounded-(2xl|3xl|full)/g, 'gradient': /(bg-gradient|linear-gradient|radial-gradient)/g, 'important': /!important/g })) { const count = [...content.matchAll(regex)].length; if (count) stylingSignals.set(signal, (stylingSignals.get(signal) ?? 0) + count); }
    for (const match of content.matchAll(/(?:#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)|oklch\([^)]*\))/g)) {
      const value = match[0]?.replace(/\s+/g, ' ').toUpperCase();
      if (!value) continue;
      colors.set(value, (colors.get(value) ?? 0) + 1);
    }
  }

  for (const [key, value] of Object.entries(stack)) if (value !== undefined && value !== false) evidence.push(`${key}: ${String(value)}`);
  if (componentFiles.length) evidence.push(`component files: ${componentFiles.length}${componentFiles.length === 200 ? '+' : ''}`);
  if (styleFiles.length) evidence.push(`style files: ${styleFiles.length}${styleFiles.length === 200 ? '+' : ''}`);
  if (variables.size) evidence.push(`CSS variables: ${variables.size}`);

  const risks: string[] = [];
  if (!variables.size && styleFiles.length) risks.push('No CSS custom properties were detected; the project may rely on raw values.');
  if ((stylingSignals.get('inline-style') ?? 0) > 10) risks.push('Frequent inline styles may bypass shared tokens and component variants.');
  if ((stylingSignals.get('tailwind-arbitrary') ?? 0) > 20) risks.push('Frequent Tailwind arbitrary values may create visual drift.');
  if (!stack.storybook && componentInventory.length > 20) risks.push('A sizeable component inventory exists without Storybook detection.');
  if (!routeFiles.length && stack.framework) risks.push('No conventional route files were detected; route inspection may be incomplete.');

  return {
    directory: absolute,
    packageJsonFound: await pathExists(packagePath),
    stack,
    evidence,
    componentFiles,
    styleFiles,
    detectedCssVariables: [...variables].sort(),
    detectedColors: [...colors.entries()].sort((a, b) => b[1] - a[1]).slice(0, 30).map(([value, count]) => ({ value, count })),
    routeFiles,
    componentInventory,
    stylingSignals: [...stylingSignals.entries()].sort((a,b) => b[1]-a[1]).map(([signal,count]) => ({ signal, count })),
    risks
  };
}
