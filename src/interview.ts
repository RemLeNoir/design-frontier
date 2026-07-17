import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { FORMAT_VERSION } from './types.js';
import type { AccessibilityTarget, Density, DevicePriority, InspectResult, ProjectInput, SurfaceMode, ThemeMode } from './types.js';

async function ask(rl: ReturnType<typeof createInterface>, question: string, fallback?: string): Promise<string> {
  const suffix = fallback !== undefined ? ` [${fallback}]` : '';
  const answer = (await rl.question(`${question}${suffix}: `)).trim();
  return answer || fallback || '';
}

function oneOf<T extends string>(value: string, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? value as T : fallback;
}

function csv(value: string): string[] {
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

function parseOverrides(value: string): ProjectInput['reference_overrides'] {
  if (!value.trim()) return undefined;
  const result: NonNullable<ProjectInput['reference_overrides']> = {};
  for (const pair of csv(value)) {
    const [layer, reference] = pair.split('=').map((item) => item.trim());
    if (layer && reference) (result as Record<string, string>)[layer] = reference;
  }
  return result;
}

export async function runInterview(inspect: InspectResult): Promise<ProjectInput> {
  const rl = createInterface({ input, output });
  try {
    console.log('\nDesign Frontier asks only questions that cannot be inferred safely from the repository.\n');
    console.log('Block 1 of 4: product');
    const name = await ask(rl, 'Project name', 'Untitled product');
    const productType = await ask(rl, 'Product type (b2b-saas, crm, portal, marketplace, public-service, developer-tool...)', 'b2b-saas');
    const users = await ask(rl, 'Primary users and usage context', 'Professional users working repeatedly');
    const goals = csv(await ask(rl, 'Main user goals, comma separated', 'find information,complete work,track status'));
    const surfaces = oneOf(await ask(rl, 'Surfaces: app, landing, or app-and-landing', 'app-and-landing'), ['app', 'landing', 'app-and-landing'] as const, 'app-and-landing') as SurfaceMode;

    console.log('\nBlock 2 of 4: interface');
    const patterns = csv(await ask(rl, 'Dominant patterns, comma separated', surfaces === 'landing' ? 'product-story,proof,conversion' : 'tables,forms,filters'));
    const adaptiveMust: string[] = [];
    const adaptiveMustNot: string[] = [];
    if (surfaces !== 'landing') {
      const repeatedWork = await ask(rl, 'Describe the most repeated workflow', goals[0] ?? 'review records and update status');
      if (repeatedWork) adaptiveMust.push(`Optimize the repeated workflow: ${repeatedWork}.`);
    }
    if (patterns.some((item) => /table|grid|record|list/i.test(item))) {
      const comparison = await ask(rl, 'Which fields must users compare without opening a record', 'status, owner, amount, deadline');
      adaptiveMust.push(`Keep these comparison fields visible in record collections: ${comparison}.`);
      const bulk = await ask(rl, 'Which bulk actions are required, or none', 'none');
      if (bulk.toLowerCase() !== 'none') adaptiveMust.push(`Provide explicit bulk actions for: ${bulk}.`);
    }
    if (patterns.some((item) => /form|wizard|checkout|application/i.test(item))) {
      const failureCost = await ask(rl, 'What is the consequence of incorrect form input', 'rework');
      adaptiveMust.push(`Form validation must reduce this failure cost: ${failureCost}.`);
    }
    if (surfaces !== 'app') {
      const proof = await ask(rl, 'What evidence should make the landing credible', 'product demonstration and specific outcomes');
      adaptiveMust.push(`The marketing narrative must prove value with: ${proof}.`);
    }
    const density = oneOf(await ask(rl, 'Density: low, medium, medium-high, or high', surfaces === 'landing' ? 'low' : 'medium-high'), ['low', 'medium', 'medium-high', 'high'] as const, 'medium-high') as Density;
    const navigation = surfaces === 'landing' ? undefined : await ask(rl, 'Navigation model (sidebar, top-nav, workspace, tabs, master-detail)', 'sidebar');
    const devicePriority = oneOf(await ask(rl, 'Device priority: desktop, mobile, or balanced', surfaces === 'landing' ? 'balanced' : 'desktop'), ['desktop', 'mobile', 'balanced'] as const, 'desktop') as DevicePriority;
    const theme = oneOf(await ask(rl, 'Theme: light, dark, or both', 'light'), ['light', 'dark', 'both'] as const, 'light') as ThemeMode;

    console.log('\nBlock 3 of 4: brand and compliance');
    const accessibility = oneOf(await ask(rl, 'Accessibility: wcag-aa or wcag-aaa-where-practical', 'wcag-aa'), ['wcag-aa', 'wcag-aaa-where-practical'] as const, 'wcag-aa') as AccessibilityTarget;
    const locales = csv(await ask(rl, 'Locales, comma separated', 'en'));
    const primary = await ask(rl, 'Primary brand color in 6-digit hex, or blank', '');
    const secondary = await ask(rl, 'Secondary brand color in 6-digit hex, or blank', '');
    const mustNot = csv(await ask(rl, 'Visual or interaction patterns that are forbidden, comma separated', ''));

    console.log('\nBlock 4 of 4: composition and integrations');
    const autoArchetype = await ask(rl, 'Archetype id, or blank for automatic selection', '');
    const overrides = parseOverrides(await ask(rl, 'Reference overrides as layer=id pairs, comma separated, or blank', ''));
    const agents = csv(await ask(rl, 'Agent adapters: claude,codex,gemini,cursor,copilot', 'claude,codex,gemini,cursor,copilot')) as ProjectInput['agents'];
    const tailwind = (inspect.stack.styling === 'tailwind');

    return {
      format_version: FORMAT_VERSION,
      name,
      product_type: productType,
      users,
      goals,
      ...(autoArchetype ? { auto_archetype: autoArchetype } : {}),
      surfaces,
      dominant_patterns: patterns,
      density,
      accessibility,
      theme,
      device_priority: devicePriority,
      locales,
      ...(navigation ? { navigation } : {}),
      stack: inspect.stack,
      brand: {
        ...(primary ? { primary } : {}),
        ...(secondary ? { secondary } : {})
      },
      constraints: { ...(adaptiveMust.length ? { must: adaptiveMust } : {}), ...((mustNot.length || adaptiveMustNot.length) ? { must_not: [...mustNot, ...adaptiveMustNot] } : {}) },
      ...(overrides ? { reference_overrides: overrides } : {}),
      outputs: { css: true, typescript: true, tailwind, design_system_spec: true },
      plugins: [],
      agents
    };
  } finally {
    rl.close();
  }
}
