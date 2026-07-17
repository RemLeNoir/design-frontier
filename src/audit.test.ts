import { describe, expect, it } from 'vitest';
import path from 'node:path';
import { mkdtemp } from 'node:fs/promises';
import os from 'node:os';
import { loadCatalog } from './catalog.js';
import { composeProject } from './compose.js';
import { generateProject } from './generate.js';
import { makeProject } from './test-helpers.js';
import { inspectRepository } from './inspect.js';
import { writeAudit } from './audit.js';
import { pathExists } from './io.js';

describe('release audit', () => {
  it('writes a persistent audit report with explicit gates', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'df-audit-'));
    const project = makeProject();
    const catalog = await loadCatalog();
    const composition = composeProject(project, catalog.archetypes, catalog.references, catalog.compatibility);
    await generateProject(root, project, composition, catalog, await inspectRepository(root));
    const report = await writeAudit(root);
    expect(report.gates.length).toBeGreaterThanOrEqual(5);
    expect(await pathExists(path.join(root, 'DESIGN-AUDIT.md'))).toBe(true);
    expect(await pathExists(path.join(root, '.design-frontier', 'audit.json'))).toBe(true);
  });
});
