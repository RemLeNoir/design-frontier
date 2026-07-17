import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { archetypeSchema, catalogReferenceSchema, compatibilityFileSchema } from './schemas.js';
import { readYaml } from './io.js';
import { loadPlugins } from './plugins.js';
import type { Archetype, CatalogReference, CompatibilityRule, LoadedCatalog } from './types.js';

export function packageRoot(): string {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(here, '..');
}

async function loadYamlDirectory<T>(directory: string, parse: (value: unknown) => T): Promise<T[]> {
  const files = (await readdir(directory)).filter((file) => file.endsWith('.yml') || file.endsWith('.yaml')).sort();
  const values: T[] = [];
  for (const file of files) values.push(parse(await readYaml<unknown>(path.join(directory, file))));
  return values;
}

export async function loadReferences(root = packageRoot()): Promise<CatalogReference[]> {
  return loadYamlDirectory(path.join(root, 'catalog', 'references'), (value) => catalogReferenceSchema.parse(value));
}

export async function loadArchetypes(root = packageRoot()): Promise<Archetype[]> {
  return loadYamlDirectory(path.join(root, 'catalog', 'archetypes'), (value) => archetypeSchema.parse(value));
}

export async function loadCompatibility(root = packageRoot()): Promise<CompatibilityRule[]> {
  const file = await readYaml<unknown>(path.join(root, 'catalog', 'compatibility.yml'));
  return compatibilityFileSchema.parse(file).rules;
}

function uniqueById<T extends { id: string }>(items: T[], kind: string): T[] {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const item of items) {
    if (seen.has(item.id)) throw new Error(`Duplicate ${kind} id: ${item.id}`);
    seen.add(item.id);
    result.push(item);
  }
  return result;
}

export async function loadCatalog(options: { pluginSpecifiers?: string[]; cwd?: string; root?: string } = {}): Promise<LoadedCatalog> {
  const root = options.root ?? packageRoot();
  const plugins = await loadPlugins(options.pluginSpecifiers ?? [], options.cwd ?? process.cwd());
  const [builtInReferences, builtInArchetypes, builtInCompatibility] = await Promise.all([
    loadReferences(root),
    loadArchetypes(root),
    loadCompatibility(root)
  ]);

  const references = uniqueById([
    ...builtInReferences,
    ...plugins.flatMap((plugin) => plugin.references ?? []).map((item) => catalogReferenceSchema.parse(item))
  ], 'reference');
  const archetypes = uniqueById([
    ...builtInArchetypes,
    ...plugins.flatMap((plugin) => plugin.archetypes ?? []).map((item) => archetypeSchema.parse(item))
  ], 'archetype');
  const compatibility = [
    ...builtInCompatibility,
    ...plugins.flatMap((plugin) => plugin.compatibility ?? [])
  ];

  return { references, archetypes, compatibility, plugins };
}

export async function getReference(id: string, root = packageRoot()): Promise<CatalogReference | undefined> {
  return (await loadReferences(root)).find((reference) => reference.id === id);
}

export async function getArchetype(id: string, root = packageRoot()): Promise<Archetype | undefined> {
  return (await loadArchetypes(root)).find((archetype) => archetype.id === id);
}
