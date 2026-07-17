import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { expect, it } from 'vitest';
import { lintDesignDrift } from './drift.js';
import { createTokens } from './tokens.js';
import { makeProject } from './test-helpers.js';

it('reports raw colors and non-token dimensions with source locations', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'design-frontier-drift-'));
  await mkdir(path.join(dir, 'src'), { recursive: true });
  await writeFile(path.join(dir, 'src', 'Card.css'), '.card { color: #ABCDEF; padding: 37px; border: 1px solid #000000; }');
  const issues = await lintDesignDrift(dir, createTokens(makeProject()));
  expect(issues).toContainEqual(expect.objectContaining({ code: 'DES101', path: path.join('src', 'Card.css'), line: 1 }));
  expect(issues).toContainEqual(expect.objectContaining({ code: 'DES102' }));
});
