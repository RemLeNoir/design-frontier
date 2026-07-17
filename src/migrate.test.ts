import { mkdir, mkdtemp } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { expect, it } from 'vitest';
import { migrateProject, migrateProjectObject } from './migrate.js';
import { pathExists, readYaml, writeYaml } from './io.js';
import type { ProjectInput } from './types.js';

const legacy = { format_version: 1, name: 'Legacy', product_type: 'crm', surfaces: 'app', dominant_patterns: ['tables'], density: 'high', accessibility: 'wcag-aa' };

it('migrates v1 objects with stable v2 defaults', () => {
  const result = migrateProjectObject(legacy);
  expect(result.changed).toBe(true);
  expect(result.project.format_version).toBe(2);
  expect(result.project.locales).toEqual(['en']);
  expect(result.project.agents).toContain('gemini');
});

it('backs up canonical files before an on-disk migration', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'design-frontier-migrate-'));
  await mkdir(path.join(dir, '.design-frontier'), { recursive: true });
  await writeYaml(path.join(dir, '.design-frontier', 'project.yml'), legacy);
  const result = await migrateProject(dir);
  expect(result.changed).toBe(true);
  expect(result.backup).toBeTruthy();
  expect(await pathExists(path.join(dir, result.backup!, 'project.yml'))).toBe(true);
  const project = await readYaml<ProjectInput>(path.join(dir, '.design-frontier', 'project.yml'));
  expect(project.format_version).toBe(2);
});
