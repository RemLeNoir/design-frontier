import { expect, it } from 'vitest';
import { exportCss, exportTailwind, exportTypeScript } from './exporters.js';
import { createTokens, flattenTokens } from './tokens.js';
import { makeProject } from './test-helpers.js';

it('creates light and dark semantic tokens and applies deep overrides', () => {
  const project = makeProject({ token_overrides: { radius: { control: { $type: 'dimension', $value: '6px', $description: 'Override' } } } });
  const tokens = createTokens(project);
  const flat = flattenTokens(tokens);
  expect(flat['radius.control']).toBe('6px');
  expect(flat['themes.light.color.surface.page']).toBeTruthy();
  expect(flat['themes.dark.color.surface.page']).toBeTruthy();
  expect(flat['color.action.primaryHover']).not.toBe(flat['color.action.primary']);
});

it('exports CSS, TypeScript, and Tailwind files', () => {
  const project = makeProject();
  const context = { root: '.', project, composition: { archetype: 'x', references: {}, requirements: [], prohibitions: [], boundaries: [], warnings: [] }, tokens: createTokens(project) };
  expect(Object.values(exportCss(context))[0]).toContain('[data-theme="dark"]');
  expect(Object.values(exportTypeScript(context))[0]).toContain('designTokens');
  expect(Object.values(exportTailwind(context))[0]).toContain('borderRadius');
});
