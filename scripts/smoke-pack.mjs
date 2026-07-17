import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const run = (command, args, cwd, env = process.env) => {
  const result = spawnSync(command, args, { cwd, env, encoding: 'utf8', stdio: 'pipe' });
  if (result.status !== 0) throw new Error(`${command} ${args.join(' ')} failed\n${result.stdout}\n${result.stderr}`);
  return result.stdout.trim();
};

const packed = JSON.parse(run('npm', ['pack', '--json', '--ignore-scripts'], root));
const filename = packed[0]?.filename;
if (!filename) throw new Error('npm pack did not return a filename.');
const tarball = path.join(root, filename);
const temp = await mkdtemp(path.join(os.tmpdir(), 'design-frontier-pack-'));
try {
  run('npm', ['init', '-y'], temp);
  run('npm', ['install', tarball, '--ignore-scripts'], temp);
  const version = run(path.join(temp, 'node_modules', '.bin', 'design-frontier'), ['--version'], temp);
  if (version !== '1.0.0') throw new Error(`Unexpected packed CLI version ${version}.`);
  run(path.join(temp, 'node_modules', '.bin', 'design-frontier'), ['catalog', 'validate'], temp);
  const config = path.join(temp, 'project.yml');
  await writeFile(config, await readFile(path.join(root, 'conformance', 'valid-project.yml'), 'utf8'));
  run(path.join(temp, 'node_modules', '.bin', 'design-frontier'), ['init', temp, '--config', config], temp);
  run(path.join(temp, 'node_modules', '.bin', 'design-frontier'), ['validate', temp], temp);
  console.log(`Packed installation smoke test passed: ${filename}`);
} finally {
  await rm(temp, { recursive: true, force: true });
  await rm(tarball, { force: true });
}
