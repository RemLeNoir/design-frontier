import path from 'node:path';
import { packageRoot } from './catalog.js';
import { copyDirectory, upsertManagedBlock, writeText } from './io.js';
import type { AgentTarget, ProjectInput } from './types.js';

function agentBlock(project?: ProjectInput): string {
  const surfaceFiles = project
    ? [
        ...(project.surfaces === 'app' || project.surfaces === 'app-and-landing' ? ['- Read `APP-DESIGN.md` before changing product UI.'] : []),
        ...(project.surfaces === 'landing' || project.surfaces === 'app-and-landing' ? ['- Read `LANDING-DESIGN.md` before changing public marketing UI.'] : [])
      ]
    : ['- Read `APP-DESIGN.md` and `LANDING-DESIGN.md` when present and relevant to the surface being changed.'];
  return `## Design Frontier

- Read \`DESIGN.md\` and \`DESIGN-CHECKLIST.md\` before editing frontend code.
${surfaceFiles.join('\n')}
- Treat \`.design-frontier/\` as the canonical source of decisions and tokens.
- Reuse existing components and semantic tokens before adding variants.
- Put lasting token changes in \`.design-frontier/project.yml\` under \`token_overrides\`, then regenerate.
- Run \`npx design-frontier generate .\`, \`validate .\`, \`lint .\`, and \`diff .\` after visual changes.`;
}

export async function installAgentAdapters(directory: string, target: AgentTarget, project?: ProjectInput): Promise<string[]> {
  const root = path.resolve(directory);
  const packageDirectory = packageRoot();
  const installed: string[] = [];
  const wants = (name: Exclude<AgentTarget, 'all'>) => target === 'all' || target === name;
  const block = agentBlock(project);

  if (wants('claude')) {
    await copyDirectory(path.join(packageDirectory, 'skills', 'claude', 'design-frontier'), path.join(root, '.claude', 'skills', 'design-frontier'));
    await upsertManagedBlock(path.join(root, 'CLAUDE.md'), 'claude', `@AGENTS.md\n\n${block}`);
    installed.push('.claude/skills/design-frontier', 'CLAUDE.md');
  }
  if (wants('codex') || wants('gemini')) {
    await copyDirectory(path.join(packageDirectory, 'skills', 'open', 'design-frontier'), path.join(root, '.agents', 'skills', 'design-frontier'));
    installed.push('.agents/skills/design-frontier');
  }
  if (wants('gemini')) {
    await upsertManagedBlock(path.join(root, 'GEMINI.md'), 'gemini', `@./AGENTS.md\n\n${block}`);
    installed.push('GEMINI.md');
  }
  if (wants('cursor')) {
    const cursorRule = `---\ndescription: Enforce the Design Frontier contract for frontend work\nalwaysApply: true\n---\n\n${block}\n`;
    await writeText(path.join(root, '.cursor', 'rules', 'design-frontier.mdc'), cursorRule);
    installed.push('.cursor/rules/design-frontier.mdc');
  }
  if (wants('copilot')) {
    await upsertManagedBlock(path.join(root, '.github', 'copilot-instructions.md'), 'copilot', block);
    installed.push('.github/copilot-instructions.md');
  }

  await upsertManagedBlock(path.join(root, 'AGENTS.md'), 'agents', `${block}\n\nProject: ${project?.name ?? 'See .design-frontier/project.yml'}`);
  if (!installed.includes('AGENTS.md')) installed.push('AGENTS.md');
  return [...new Set(installed)];
}

export { type AgentTarget } from './types.js';
