import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { expect, it } from 'vitest';
import { installAgentAdapters } from './agent.js';
import { pathExists } from './io.js';
import { makeProject } from './test-helpers.js';

it('installs all adapters without destroying existing instructions', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'design-frontier-agent-'));
  await writeFile(path.join(dir, 'AGENTS.md'), '# Existing instructions\n');
  const installed = await installAgentAdapters(dir, 'all', makeProject());
  expect(installed).toContain('.claude/skills/design-frontier');
  expect(await pathExists(path.join(dir, '.claude', 'skills', 'design-frontier', 'SKILL.md'))).toBe(true);
  expect(await pathExists(path.join(dir, '.agents', 'skills', 'design-frontier', 'SKILL.md'))).toBe(true);
  expect(await pathExists(path.join(dir, '.cursor', 'rules', 'design-frontier.mdc'))).toBe(true);
  expect(await pathExists(path.join(dir, '.github', 'copilot-instructions.md'))).toBe(true);
  expect(await pathExists(path.join(dir, 'GEMINI.md'))).toBe(true);
  expect(await readFile(path.join(dir, 'AGENTS.md'), 'utf8')).toContain('# Existing instructions');
  await installAgentAdapters(dir, 'all', makeProject());
  const agents = await readFile(path.join(dir, 'AGENTS.md'), 'utf8');
  expect(agents.match(/design-frontier:agents:start/g)).toHaveLength(1);
});
