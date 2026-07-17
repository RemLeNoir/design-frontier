import path from 'node:path';
import { mkdir, cp } from 'node:fs/promises';
import { legacyProjectInputSchema, projectInputSchema } from './schemas.js';
import { FORMAT_VERSION, type ProjectInput } from './types.js';
import { pathExists, readYaml, writeYaml } from './io.js';

export function migrateProjectObject(raw: unknown): { project: ProjectInput; changed: boolean; from: number } {
  const value = raw as { format_version?: number };
  if (value?.format_version === FORMAT_VERSION) {
    return { project: projectInputSchema.parse(raw), changed: false, from: FORMAT_VERSION };
  }
  const legacy = legacyProjectInputSchema.parse(raw);
  const project = projectInputSchema.parse({
    ...legacy,
    format_version: FORMAT_VERSION,
    theme: 'light',
    device_priority: legacy.surfaces === 'landing' ? 'balanced' : 'desktop',
    locales: ['en'],
    outputs: { css: true, typescript: true, tailwind: false, design_system_spec: true },
    plugins: [],
    agents: ['claude', 'codex', 'gemini', 'cursor', 'copilot']
  });
  return { project, changed: true, from: 1 };
}

export async function migrateProject(directory: string, dryRun = false): Promise<{ changed: boolean; from: number; backup?: string }> {
  const root = path.resolve(directory);
  const canonical = path.join(root, '.design-frontier');
  const projectPath = path.join(canonical, 'project.yml');
  if (!(await pathExists(projectPath))) throw new Error('Missing .design-frontier/project.yml.');
  const result = migrateProjectObject(await readYaml<unknown>(projectPath));
  if (!result.changed || dryRun) return { changed: result.changed, from: result.from };

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backup = path.join(canonical, 'backups', stamp);
  await mkdir(backup, { recursive: true });
  for (const name of ['project.yml', 'decisions.yml', 'references.yml', 'tokens.json', 'manifest.json']) {
    const source = path.join(canonical, name);
    if (await pathExists(source)) await cp(source, path.join(backup, name), { force: true });
  }
  await writeYaml(projectPath, result.project);
  return { changed: true, from: result.from, backup: path.relative(root, backup) };
}
