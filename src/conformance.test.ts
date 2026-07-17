import { readFile } from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';
import { describe, expect, it } from 'vitest';
import { loadCatalog, packageRoot } from './catalog.js';
import { composeProject } from './compose.js';
import { migrateProjectObject } from './migrate.js';
import { projectInputSchema } from './schemas.js';

const root = packageRoot();

describe('public conformance fixtures', () => {
  it('accepts the valid v2 project fixture and composes it without errors', async () => {
    const raw = YAML.parse(await readFile(path.join(root, 'conformance', 'valid-project.yml'), 'utf8'));
    const project = projectInputSchema.parse(raw);
    const catalog = await loadCatalog();
    expect(composeProject(project, catalog.archetypes, catalog.references, catalog.compatibility).warnings.filter((item) => item.severity === 'error')).toEqual([]);
  });

  it('rejects an invalid reference layer fixture', async () => {
    const raw = YAML.parse(await readFile(path.join(root, 'conformance', 'invalid', 'reference-layer.yml'), 'utf8'));
    const project = projectInputSchema.parse(raw);
    const catalog = await loadCatalog();
    expect(composeProject(project, catalog.archetypes, catalog.references, catalog.compatibility).warnings).toContainEqual(expect.objectContaining({ code: 'DES014', severity: 'error' }));
  });

  it('migrates the public v1 fixture', async () => {
    const raw = YAML.parse(await readFile(path.join(root, 'conformance', 'legacy-v1.yml'), 'utf8'));
    expect(migrateProjectObject(raw).project.format_version).toBe(2);
  });
});
