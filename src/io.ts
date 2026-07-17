import { access, cp, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';

export async function pathExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function readYaml<T>(filePath: string): Promise<T> {
  return YAML.parse(await readFile(filePath, 'utf8')) as T;
}

export async function writeYaml(filePath: string, data: unknown): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, YAML.stringify(data, { lineWidth: 0 }), 'utf8');
}

export async function readJson<T>(filePath: string): Promise<T> {
  return JSON.parse(await readFile(filePath, 'utf8')) as T;
}

export async function writeJson(filePath: string, data: unknown): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

export async function writeText(filePath: string, content: string): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content.endsWith('\n') ? content : `${content}\n`, 'utf8');
}

export async function readText(filePath: string): Promise<string> {
  return readFile(filePath, 'utf8');
}

export async function upsertManagedBlock(filePath: string, blockId: string, content: string): Promise<void> {
  const start = `<!-- design-frontier:${blockId}:start -->`;
  const end = `<!-- design-frontier:${blockId}:end -->`;
  const block = `${start}\n${content.trim()}\n${end}`;
  const existing = (await pathExists(filePath)) ? await readFile(filePath, 'utf8') : '';
  const pattern = new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`, 'm');
  const next = pattern.test(existing)
    ? existing.replace(pattern, block)
    : `${existing.trim()}${existing.trim() ? '\n\n' : ''}${block}\n`;
  await writeText(filePath, next);
}

export async function copyDirectory(source: string, destination: string): Promise<void> {
  await mkdir(path.dirname(destination), { recursive: true });
  await cp(source, destination, { recursive: true, force: true });
}

export async function walkFiles(
  root: string,
  options: { ignore?: string[]; extensions?: string[]; maxFiles?: number } = {}
): Promise<string[]> {
  const ignore = new Set(options.ignore ?? []);
  const extensions = options.extensions ? new Set(options.extensions.map((item) => item.toLowerCase())) : undefined;
  const maxFiles = options.maxFiles ?? 5000;
  const files: string[] = [];

  async function walk(directory: string): Promise<void> {
    if (files.length >= maxFiles) return;
    let entries;
    try {
      entries = await readdir(directory, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (files.length >= maxFiles) break;
      if (ignore.has(entry.name)) continue;
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) await walk(absolute);
      else if (entry.isFile()) {
        if (!extensions || extensions.has(path.extname(entry.name).toLowerCase())) files.push(absolute);
      }
    }
  }

  await walk(root);
  return files;
}

export async function copyPathIfExists(source: string, destination: string): Promise<boolean> {
  if (!(await pathExists(source))) return false;
  const info = await stat(source);
  await mkdir(path.dirname(destination), { recursive: true });
  if (info.isDirectory()) await cp(source, destination, { recursive: true, force: true });
  else await cp(source, destination, { force: true });
  return true;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
