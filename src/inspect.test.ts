import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { expect, it } from 'vitest';
import { inspectRepository } from './inspect.js';

it('detects stack, CSS variables, components, and frequent colors', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'design-frontier-inspect-'));
  await mkdir(path.join(dir, 'src', 'components'), { recursive: true });
  await writeFile(path.join(dir, 'package.json'), JSON.stringify({ dependencies: { next: '^16', react: '^19', tailwindcss: '^4', typescript: '^7', '@radix-ui/react-dialog': '^1' }, devDependencies: { vitest: '^4' } }));
  await writeFile(path.join(dir, 'src', 'components', 'Button.tsx'), 'export const Button = () => <button />;');
  await writeFile(path.join(dir, 'src', 'app.css'), ':root { --brand: #123456; } .x { color: #123456; }');
  const result = await inspectRepository(dir);
  expect(result.stack.framework).toBe('next');
  expect(result.stack.styling).toBe('tailwind');
  expect(result.stack.language).toBe('typescript');
  expect(result.stack.componentLibrary).toContain('radix');
  expect(result.detectedCssVariables).toContain('--brand');
  expect(result.detectedColors[0]).toEqual({ value: '#123456', count: 2 });
});
