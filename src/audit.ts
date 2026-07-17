import path from 'node:path';
import { inspectRepository } from './inspect.js';
import { lintDesignDrift } from './drift.js';
import { readJson, writeJson, writeText, pathExists } from './io.js';
import { validateProject } from './validate.js';
import type { ValidationIssue } from './types.js';

export interface AuditReport {
  generated_at: string;
  readiness_score: number;
  inspection: Awaited<ReturnType<typeof inspectRepository>>;
  validation: ValidationIssue[];
  drift: ValidationIssue[];
  gates: Array<{ id: string; passed: boolean; detail: string }>;
}

export async function auditProject(directory: string): Promise<AuditReport> {
  const root = path.resolve(directory);
  const inspection = await inspectRepository(root);
  const validation = await validateProject(root);
  const tokenPath = path.join(root, '.design-frontier', 'tokens.json');
  const drift = await pathExists(tokenPath) ? await lintDesignDrift(root, await readJson<Record<string, unknown>>(tokenPath)) : [];
  const gates = [
    { id: 'canonical-contract', passed: !validation.some((i) => i.severity === 'error'), detail: 'Canonical files and generated artifacts agree.' },
    { id: 'no-open-decisions', passed: !validation.some((i) => i.code === 'DES074'), detail: 'No unresolved design decisions remain.' },
    { id: 'token-drift', passed: !drift.some((i) => i.severity === 'error' || i.severity === 'warning'), detail: 'Frontend code uses registered semantic values.' },
    { id: 'component-inventory', passed: inspection.componentInventory.length > 0, detail: inspection.componentInventory.length > 0 ? `${inspection.componentInventory.length} reusable frontend component(s) were detected.` : 'No reusable frontend components were detected yet.' },
    { id: 'visual-harness', passed: Boolean(inspection.stack.storybook || inspection.stack.testRunner === 'playwright'), detail: inspection.stack.storybook || inspection.stack.testRunner === 'playwright' ? 'Storybook or Playwright is available for rendered review.' : 'Add Storybook or Playwright before declaring rendered visual acceptance.' }
  ];
  const readiness_score = Math.round((gates.filter((g) => g.passed).length / gates.length) * 100);
  return { generated_at: new Date().toISOString(), readiness_score, inspection, validation, drift, gates };
}

export async function writeAudit(directory: string): Promise<AuditReport> {
  const root = path.resolve(directory);
  const report = await auditProject(root);
  await writeJson(path.join(root, '.design-frontier', 'audit.json'), report);
  const rows = report.gates.map((g) => `| ${g.id} | ${g.passed ? 'PASS' : 'FAIL'} | ${g.detail} |`).join('\n');
  const risks = report.inspection.risks.length ? report.inspection.risks.map((r) => `- ${r}`).join('\n') : '- None detected.';
  await writeText(path.join(root, 'DESIGN-AUDIT.md'), `# Design Frontier audit\n\n- **Generated:** ${report.generated_at}\n- **Readiness score:** ${report.readiness_score}/100\n\n## Release gates\n\n| Gate | Result | Meaning |\n|---|---|---|\n${rows}\n\n## Repository risks\n\n${risks}\n\n## Validation findings\n\n${report.validation.map((i) => `- ${i.severity.toUpperCase()} ${i.code}: ${i.message}`).join('\n') || '- None.'}\n\n## Code drift findings\n\n${report.drift.map((i) => `- ${i.severity.toUpperCase()} ${i.code}: ${i.message}${i.path ? ` (${i.path}${i.line ? `:${i.line}` : ''})` : ''}`).join('\n') || '- None.'}\n\n## Visual acceptance protocol\n\nBefore release, render at least one representative page for each dominant pattern and verify desktop, narrow desktop and mobile widths. Compare navigation, typography, form states, empty states, loading, errors and destructive actions against DESIGN.md and DESIGN-CHECKLIST.md. Storybook or Playwright is recommended because static source inspection cannot prove rendered consistency.\n`);
  return report;
}
