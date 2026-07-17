import { FORMAT_VERSION, type ProjectInput } from './types.js';

export function makeProject(overrides: Partial<ProjectInput> = {}): ProjectInput {
  return {
    format_version: FORMAT_VERSION,
    name: 'Example',
    product_type: 'b2b-saas',
    users: 'Professional operations teams',
    goals: ['find records', 'complete work', 'track status'],
    surfaces: 'app-and-landing',
    dominant_patterns: ['tables', 'forms', 'filters'],
    density: 'medium-high',
    accessibility: 'wcag-aa',
    theme: 'both',
    device_priority: 'desktop',
    locales: ['en'],
    navigation: 'sidebar',
    outputs: { css: true, typescript: true, tailwind: true, design_system_spec: true },
    plugins: [],
    agents: ['claude', 'codex', 'gemini', 'cursor', 'copilot'],
    ...overrides
  };
}
