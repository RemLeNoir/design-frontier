import { describe, expect, it } from 'vitest';
import { loadCatalog } from './catalog.js';
import { composeProject } from './compose.js';
import { makeProject } from './test-helpers.js';

describe('executable catalog recipes', () => {
  it('turns table references into concrete implementation rules', async () => {
    const catalog = await loadCatalog();
    const project = makeProject({ reference_overrides: { tables: { primary: 'airtable', secondary: 'carbon' } } });
    const composition = composeProject(project, catalog.archetypes, catalog.references, catalog.compatibility);
    expect(composition.layer_rules.tables?.requirements.join(' ')).toContain('sticky header');
    expect(composition.layer_rules.tables?.requirements.join(' ')).toContain('bulk actions');
    expect(composition.layer_rules.tables?.metrics.default_row_height).toBe('40px');
  });
});
