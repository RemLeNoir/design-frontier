import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { flattenTokens } from './tokens.js';
import { walkFiles } from './io.js';
import type { ValidationIssue } from './types.js';

const CODE_EXTENSIONS = ['.css', '.scss', '.sass', '.less', '.tsx', '.ts', '.jsx', '.js', '.vue', '.svelte', '.html'];
const IGNORED_DIRECTORIES = ['node_modules', '.git', 'dist', 'build', '.next', '.nuxt', '.svelte-kit', 'coverage', '.design-frontier'];

function normalizeHex(value: string): string {
  const v = value.toUpperCase();
  if (/^#[0-9A-F]{3}$/.test(v)) return `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}`;
  return v;
}

function lineNumberAt(content: string, index: number): number {
  return content.slice(0, index).split('\n').length;
}

function tokenAllowedValues(tokens: Record<string, unknown>): { colors: Set<string>; dimensions: Set<string> } {
  const flat = flattenTokens(tokens);
  const colors = new Set<string>();
  const dimensions = new Set<string>();
  for (const value of Object.values(flat)) {
    if (typeof value !== 'string') continue;
    if (/^#[0-9a-fA-F]{3,8}$/.test(value)) colors.add(normalizeHex(value));
    if (/^-?\d+(\.\d+)?(px|rem|em|ms)$/.test(value)) dimensions.add(value);
  }
  return { colors, dimensions };
}

export async function lintDesignDrift(root: string, tokens: Record<string, unknown>): Promise<ValidationIssue[]> {
  const absolute = path.resolve(root);
  const files = await walkFiles(absolute, { ignore: IGNORED_DIRECTORIES, extensions: CODE_EXTENSIONS, maxFiles: 8000 });
  const allowed = tokenAllowedValues(tokens);
  const issues: ValidationIssue[] = [];

  for (const file of files) {
    const relative = path.relative(absolute, file);
    let content: string;
    try {
      content = await readFile(file, 'utf8');
    } catch {
      continue;
    }

    const colorRegex = /#[0-9a-fA-F]{3,8}\b/g;
    for (const match of content.matchAll(colorRegex)) {
      const value = normalizeHex(match[0]);
      if (allowed.colors.has(value)) continue;
      if (value === '#FFFFFF' || value === '#000000') continue;
      issues.push({
        code: 'DES101',
        severity: 'warning',
        message: `Raw color ${match[0]} is not represented by a canonical semantic token.`,
        path: relative,
        line: lineNumberAt(content, match.index ?? 0)
      });
    }

    const dimensionRegex = /(?<![\w-])(-?\d+(?:\.\d+)?(?:px|rem|em|ms))\b/g;
    for (const match of content.matchAll(dimensionRegex)) {
      const value = match[1];
      if (!value) continue;
      if (allowed.dimensions.has(value)) continue;
      const numeric = Number.parseFloat(value);
      if (value.endsWith('px') && numeric === 1) continue;
      issues.push({
        code: 'DES102',
        severity: 'info',
        message: `Literal dimension ${value} is outside the canonical token set.`,
        path: relative,
        line: lineNumberAt(content, match.index ?? 0)
      });
    }
  }

  if (issues.length === 0) issues.push({ code: 'DES100', severity: 'info', message: 'No code-level design token drift detected.' });
  return issues;
}
