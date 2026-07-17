import path from 'node:path';
import { pathToFileURL } from 'node:url';
import type { DesignFrontierPlugin } from './types.js';

function assertPlugin(value: unknown, source: string): DesignFrontierPlugin {
  if (!value || typeof value !== 'object') throw new Error(`Plugin ${source} did not export an object.`);
  const candidate = value as Partial<DesignFrontierPlugin>;
  if (!candidate.name || !candidate.version) throw new Error(`Plugin ${source} must declare name and version.`);
  return candidate as DesignFrontierPlugin;
}

export async function loadPlugins(specifiers: string[] = [], cwd = process.cwd()): Promise<DesignFrontierPlugin[]> {
  const plugins: DesignFrontierPlugin[] = [];
  for (const specifier of specifiers) {
    const isPath = specifier.startsWith('.') || specifier.startsWith('/') || specifier.startsWith('file:');
    const target = isPath
      ? (specifier.startsWith('file:') ? specifier : pathToFileURL(path.resolve(cwd, specifier)).href)
      : specifier;
    const module = await import(target);
    const plugin = assertPlugin(module.designFrontierPlugin ?? module.default ?? module, specifier);
    plugins.push(plugin);
  }
  return plugins;
}
