import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { expect, it } from 'vitest';
import { loadCatalog } from './catalog.js';
import { composeProject } from './compose.js';
import { generateProject } from './generate.js';
import { pathExists, readJson, readYaml } from './io.js';
import { validateProject } from './validate.js';
import { makeProject } from './test-helpers.js';

it('generates a complete, valid project and preserves unresolved decisions', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'design-frontier-generate-'));
  const project = makeProject();
  const catalog = await loadCatalog();
  const composition = composeProject(project, catalog.archetypes, catalog.references, catalog.compatibility);
  await generateProject(dir, project, composition, catalog);
  expect(await pathExists(path.join(dir, 'DESIGN.md'))).toBe(true);
  expect(await pathExists(path.join(dir, '.design-frontier', 'generated', 'tailwind.preset.mjs'))).toBe(true);
  await writeFile(path.join(dir, '.design-frontier', 'unresolved.yml'), 'format_version: 2\ndecisions:\n  - id: nav\n    question: Which navigation?\n    status: open\n');
  await generateProject(dir, project, composition, catalog);
  const unresolved = await readYaml<{ decisions: unknown[] }>(path.join(dir, '.design-frontier', 'unresolved.yml'));
  expect(unresolved.decisions).toHaveLength(1);
  const issues = await validateProject(dir);
  expect(issues.some((issue) => issue.severity === 'error')).toBe(false);
  expect(issues).toContainEqual(expect.objectContaining({ code: 'DES074', severity: 'warning' }));
});

it('detects edits to generated artifacts through the manifest', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'design-frontier-manifest-'));
  const project = makeProject({ agents: [] });
  const catalog = await loadCatalog();
  await generateProject(dir, project, composeProject(project, catalog.archetypes, catalog.references, catalog.compatibility), catalog);
  await writeFile(path.join(dir, 'DESIGN.md'), `${await readFile(path.join(dir, 'DESIGN.md'), 'utf8')}\nmanual change\n`);
  const issues = await validateProject(dir);
  expect(issues).toContainEqual(expect.objectContaining({ code: 'DES083', severity: 'warning', path: 'DESIGN.md' }));
});

it('stores repository inspection without leaking an absolute machine path', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'design-frontier-portable-inspection-'));
  const project = makeProject({ agents: [] });
  const catalog = await loadCatalog();
  const inspection = {
    directory: dir,
    packageJsonFound: false,
    stack: {},
    evidence: [],
    componentFiles: [],
    styleFiles: [],
    detectedCssVariables: [],
    detectedColors: []
  };
  await generateProject(
    dir,
    project,
    composeProject(project, catalog.archetypes, catalog.references, catalog.compatibility),
    catalog,
    inspection
  );
  const stored = await readJson<{ directory: string }>(path.join(dir, '.design-frontier', 'inspection.json'));
  expect(stored.directory).toBe('.');
});
