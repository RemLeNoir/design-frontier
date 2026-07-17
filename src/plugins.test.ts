import { mkdtemp, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { expect, it } from 'vitest';
import { loadCatalog } from './catalog.js';

it('loads a local plugin and merges exporters and validators', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'design-frontier-plugin-'));
  const plugin = path.join(dir, 'plugin.mjs');
  await writeFile(plugin, `export default { name: 'fixture', version: '1.0.0', exporters: { fixture: () => ({ '.design-frontier/generated/fixture.txt': 'ok' }) }, validators: [() => [{ code: 'PLG001', severity: 'info', message: 'plugin ran' }]] };`);
  const catalog = await loadCatalog({ pluginSpecifiers: [plugin], cwd: dir });
  expect(catalog.plugins).toHaveLength(1);
  expect(catalog.plugins[0]?.exporters?.fixture).toBeTypeOf('function');
});
