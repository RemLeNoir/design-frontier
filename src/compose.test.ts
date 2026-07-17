import { describe, expect, it } from 'vitest';
import { loadCatalog } from './catalog.js';
import { composeProject } from './compose.js';
import { makeProject } from './test-helpers.js';

describe('composeProject', () => {
  it('selects a dense operational SaaS composition by signals', async () => {
    const catalog = await loadCatalog();
    const result = composeProject(makeProject(), catalog.archetypes, catalog.references, catalog.compatibility);
    expect(result.archetype).toBe('saas-operational-dense');
    expect(result.references.tables?.primary).toBe('airtable');
    expect(result.references.application_shell?.primary).toBe('metronic');
  });

  it('rejects a reference outside its supported layer', async () => {
    const catalog = await loadCatalog();
    const result = composeProject(makeProject({ reference_overrides: { tables: 'apple' } }), catalog.archetypes, catalog.references, catalog.compatibility);
    expect(result.warnings).toContainEqual(expect.objectContaining({ code: 'DES014', severity: 'error' }));
  });

  it('keeps landing references out of an app-only composition', async () => {
    const catalog = await loadCatalog();
    const result = composeProject(makeProject({ surfaces: 'app' }), catalog.archetypes, catalog.references, catalog.compatibility);
    expect(result.references.marketing_site).toBeUndefined();
  });
});
