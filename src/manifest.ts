import { createHash } from 'node:crypto';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { pathExists, writeJson } from './io.js';
import { FORMAT_VERSION, type DesignFrontierManifest, type ValidationIssue } from './types.js';
import { VERSION } from './version.js';

export const PACKAGE_VERSION = VERSION;

export function hashContent(content: string | Buffer): string {
  return createHash('sha256').update(content).digest('hex');
}

export async function writeManifest(root: string, files: string[]): Promise<DesignFrontierManifest> {
  const hashes: Record<string, string> = {};
  for (const relative of [...new Set(files)].sort()) {
    const absolute = path.join(root, relative);
    if (await pathExists(absolute)) hashes[relative] = hashContent(await readFile(absolute));
  }
  const manifest: DesignFrontierManifest = {
    format_version: FORMAT_VERSION,
    package_version: PACKAGE_VERSION,
    generated_at: new Date().toISOString(),
    files: hashes
  };
  await writeJson(path.join(root, '.design-frontier', 'manifest.json'), manifest);
  return manifest;
}

export async function validateManifest(root: string, manifest: DesignFrontierManifest): Promise<ValidationIssue[]> {
  const issues: ValidationIssue[] = [];
  for (const [relative, expected] of Object.entries(manifest.files)) {
    const absolute = path.join(root, relative);
    if (!(await pathExists(absolute))) {
      issues.push({ code: 'DES082', severity: 'error', message: `Generated file is missing: ${relative}.`, path: relative });
      continue;
    }
    const actual = hashContent(await readFile(absolute));
    if (actual !== expected) issues.push({ code: 'DES083', severity: 'warning', message: `Generated file changed outside Design Frontier: ${relative}. Regenerate or accept the change in canonical data.`, path: relative });
  }
  return issues;
}
