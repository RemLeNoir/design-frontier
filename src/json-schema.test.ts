import { mkdtemp, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import YAML from 'yaml';
import { describe, expect, it } from 'vitest';
import { loadCatalog, packageRoot } from './catalog.js';
import { composeProject } from './compose.js';
import { generateProject } from './generate.js';
import { readJson } from './io.js';
import { makeProject } from './test-helpers.js';

const root = packageRoot();

async function schema(name: string): Promise<Record<string, unknown>> {
  return JSON.parse(await readFile(path.join(root, 'schemas', name), 'utf8')) as Record<string, unknown>;
}

async function validator(name: string) {
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  return ajv.compile(await schema(name));
}

describe('public JSON Schemas', () => {
  it('validate the public project fixture and every built-in reference', async () => {
    const projectValidate = await validator('project.schema.json');
    const project = YAML.parse(await readFile(path.join(root, 'conformance', 'valid-project.yml'), 'utf8'));
    expect(projectValidate(project), JSON.stringify(projectValidate.errors)).toBe(true);

    const referenceValidate = await validator('reference.schema.json');
    const catalog = await loadCatalog();
    for (const reference of catalog.references) expect(referenceValidate(reference), `${reference.id}: ${JSON.stringify(referenceValidate.errors)}`).toBe(true);
  });

  it('validates generated tokens and manifest', async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), 'design-frontier-schema-'));
    const project = makeProject();
    const catalog = await loadCatalog();
    await generateProject(dir, project, composeProject(project, catalog.archetypes, catalog.references, catalog.compatibility), catalog);
    const tokensValidate = await validator('tokens.schema.json');
    const manifestValidate = await validator('manifest.schema.json');
    const tokens = await readJson(path.join(dir, '.design-frontier', 'tokens.json'));
    const manifest = await readJson(path.join(dir, '.design-frontier', 'manifest.json'));
    expect(tokensValidate(tokens), JSON.stringify(tokensValidate.errors)).toBe(true);
    expect(manifestValidate(manifest), JSON.stringify(manifestValidate.errors)).toBe(true);
  });
});
