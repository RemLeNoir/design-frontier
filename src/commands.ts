import path from 'node:path';
import { writeAudit } from './audit.js';
import { readFile } from 'node:fs/promises';
import YAML from 'yaml';
import { composeProject } from './compose.js';
import { generateProject } from './generate.js';
import { inspectRepository } from './inspect.js';
import { runInterview } from './interview.js';
import { loadCatalog, loadArchetypes, loadReferences } from './catalog.js';
import { projectInputSchema } from './schemas.js';
import { pathExists, readJson, readYaml, writeText } from './io.js';
import { validateCatalog, validateProject } from './validate.js';
import { installAgentAdapters } from './agent.js';
import { migrateProject, migrateProjectObject } from './migrate.js';
import { createTokens } from './tokens.js';
import { lintDesignDrift } from './drift.js';
import { exportCss, exportTailwind, exportTypeScript } from './exporters.js';
import { validateManifest, writeManifest } from './manifest.js';
import { LAYERS, type AgentTarget, type DesignFrontierManifest, type ExportContext, type ProjectInput, type ValidationIssue } from './types.js';

export function printIssues(issues: ValidationIssue[]): void {
  for (const issue of issues) {
    const location = issue.path ? ` (${issue.path}${issue.line ? `:${issue.line}` : ''})` : '';
    console.log(`${issue.severity.toUpperCase()} ${issue.code}${location}: ${issue.message}`);
  }
}

function failed(issues: ValidationIssue[], strict = false): boolean {
  return issues.some((issue) => issue.severity === 'error' || (strict && issue.severity === 'warning'));
}

export async function commandInspect(directory: string, json = false): Promise<void> {
  const result = await inspectRepository(directory);
  if (json) console.log(JSON.stringify(result, null, 2));
  else {
    console.log(`Directory: ${result.directory}`);
    console.log(`package.json: ${result.packageJsonFound ? 'found' : 'not found'}`);
    if (result.evidence.length) result.evidence.forEach((item) => console.log(`- ${item}`));
    else console.log('- No frontend stack evidence detected.');
    if (result.detectedColors.length) console.log(`- frequent colors: ${result.detectedColors.slice(0, 5).map((item) => `${item.value} (${item.count})`).join(', ')}`);
  }
}

async function readConfig(configPath: string): Promise<ProjectInput> {
  const raw = YAML.parse(await readFile(path.resolve(configPath), 'utf8')) as unknown;
  return migrateProjectObject({ format_version: 2, ...(raw as object) }).project;
}

async function readProject(root: string): Promise<ProjectInput> {
  const projectPath = path.join(root, '.design-frontier', 'project.yml');
  if (!(await pathExists(projectPath))) throw new Error('Missing .design-frontier/project.yml. Run design-frontier init first.');
  const raw = await readYaml<unknown>(projectPath);
  if ((raw as { format_version?: number })?.format_version === 1) throw new Error('Project uses format version 1. Run design-frontier migrate first.');
  return projectInputSchema.parse(raw);
}

async function buildContext(root: string, project: ProjectInput) {
  const catalog = await loadCatalog({ pluginSpecifiers: project.plugins, cwd: root });
  const composition = composeProject(project, catalog.archetypes, catalog.references, catalog.compatibility);
  return { catalog, composition };
}

export async function commandInit(directory: string, configPath?: string, force = false): Promise<void> {
  const root = path.resolve(directory);
  const projectPath = path.join(root, '.design-frontier', 'project.yml');
  if (!force && await pathExists(projectPath)) throw new Error('Design Frontier is already initialized. Use generate, update, or init --force.');
  const inspect = await inspectRepository(root);
  const collected = configPath ? await readConfig(configPath) : await runInterview(inspect);
  const project = projectInputSchema.parse({ ...collected, stack: { ...inspect.stack, ...(collected.stack ?? {}) } });
  const { catalog, composition } = await buildContext(root, project);
  const files = await generateProject(root, project, composition, catalog, inspect);
  console.log(`\nDesign Frontier initialized ${project.name}.`);
  files.forEach((file) => console.log(`- ${file}`));
  if (composition.warnings.length) {
    console.log('\nComposition warnings:');
    printIssues(composition.warnings);
  }
  const validation = await validateProject(root);
  console.log('\nValidation:');
  printIssues(validation);
  if (failed([...composition.warnings, ...validation])) process.exitCode = 1;
}

export async function commandPlan(directory: string, configPath?: string, json = false): Promise<void> {
  const root = path.resolve(directory);
  const project = configPath ? await readConfig(configPath) : await readProject(root);
  const { composition } = await buildContext(root, project);
  const result = { project, composition };
  console.log(json ? JSON.stringify(result, null, 2) : YAML.stringify(result, { lineWidth: 0 }));
  if (failed(composition.warnings)) process.exitCode = 1;
}

export async function commandGenerate(directory: string): Promise<void> {
  const root = path.resolve(directory);
  const project = await readProject(root);
  const inspect = await inspectRepository(root);
  const { catalog, composition } = await buildContext(root, project);
  if (failed(composition.warnings)) {
    printIssues(composition.warnings);
    throw new Error('Generation stopped because the composition has errors.');
  }
  const files = await generateProject(root, project, composition, catalog, inspect);
  console.log(`Generated ${files.length} files.`);
}

export async function commandUpdate(directory: string): Promise<void> {
  const root = path.resolve(directory);
  const projectPath = path.join(root, '.design-frontier', 'project.yml');
  if (!(await pathExists(projectPath))) throw new Error('Missing .design-frontier/project.yml.');
  const raw = await readYaml<unknown>(projectPath);
  if ((raw as { format_version?: number })?.format_version === 1) {
    const result = await migrateProject(root, false);
    console.log(`Migrated format ${result.from} to 2. Backup: ${result.backup}`);
  }
  await commandGenerate(root);
}

export async function commandMigrate(directory: string, dryRun = false): Promise<void> {
  const result = await migrateProject(directory, dryRun);
  if (!result.changed) console.log('Project already uses the current format.');
  else if (dryRun) console.log(`Migration available from format ${result.from} to 2.`);
  else {
    console.log(`Migrated format ${result.from} to 2. Backup: ${result.backup}`);
    await commandGenerate(directory);
  }
}

export async function commandValidate(directory: string, json = false, strict = false): Promise<void> {
  const issues = await validateProject(directory);
  if (json) console.log(JSON.stringify(issues, null, 2));
  else printIssues(issues);
  if (failed(issues, strict)) process.exitCode = 1;
}

export async function commandLint(directory: string, json = false, strict = false): Promise<void> {
  const root = path.resolve(directory);
  const tokensPath = path.join(root, '.design-frontier', 'tokens.json');
  if (!(await pathExists(tokensPath))) throw new Error('Missing .design-frontier/tokens.json.');
  const issues = await lintDesignDrift(root, await readJson<Record<string, unknown>>(tokensPath));
  if (json) console.log(JSON.stringify(issues, null, 2));
  else printIssues(issues);
  if (failed(issues, strict)) process.exitCode = 1;
}

export async function commandExport(directory: string, format: string): Promise<void> {
  const root = path.resolve(directory);
  const project = await readProject(root);
  const { catalog, composition } = await buildContext(root, project);
  const context: ExportContext = { root, project, composition, tokens: createTokens(project) };
  const formats = format === 'all' ? ['css', 'typescript', 'tailwind'] : [format];
  const written: string[] = [];
  for (const item of formats) {
    const output = item === 'css' ? exportCss(context) : item === 'typescript' ? exportTypeScript(context) : item === 'tailwind' ? exportTailwind(context) : undefined;
    if (!output) throw new Error('Format must be css, typescript, tailwind, or all.');
    for (const [relative, content] of Object.entries(output)) {
      await writeText(path.join(root, relative), content);
      written.push(relative);
      console.log(`- ${relative}`);
    }
  }
  for (const plugin of catalog.plugins) {
    const entries = format === 'all' ? Object.entries(plugin.exporters ?? {}) : Object.entries(plugin.exporters ?? {}).filter(([name]) => name === format);
    for (const [, exporter] of entries) {
      const output = await exporter(context);
      for (const [relative, content] of Object.entries(output ?? {})) {
        await writeText(path.join(root, relative), content);
        written.push(relative);
        console.log(`- ${relative}`);
      }
    }
  }
  const manifestPath = path.join(root, '.design-frontier', 'manifest.json');
  const existing = await pathExists(manifestPath) ? await readJson<DesignFrontierManifest>(manifestPath) : undefined;
  await writeManifest(root, [...Object.keys(existing?.files ?? {}), ...written]);
}

export async function commandCatalogList(kind?: string, layer?: string): Promise<void> {
  if (kind && !['references', 'archetypes'].includes(kind)) throw new Error('Catalog kind must be references or archetypes.');
  if (layer && !LAYERS.includes(layer as typeof LAYERS[number])) throw new Error(`Unknown design layer ${layer}.`);
  const [references, archetypes] = await Promise.all([loadReferences(), loadArchetypes()]);
  if (!kind || kind === 'references') {
    console.log('References:');
    for (const item of references.filter((reference) => !layer || layer in reference.covers_layers)) console.log(`- ${item.id}: ${item.name} [${Object.keys(item.covers_layers).join(', ')}]`);
  }
  if (!kind || kind === 'archetypes') {
    console.log('Archetypes:');
    for (const item of archetypes) console.log(`- ${item.id}: ${item.name}`);
  }
}

export async function commandCatalogShow(id: string): Promise<void> {
  const [references, archetypes] = await Promise.all([loadReferences(), loadArchetypes()]);
  const item = references.find((reference) => reference.id === id) ?? archetypes.find((archetype) => archetype.id === id);
  if (!item) throw new Error(`Catalog item ${id} not found.`);
  console.log(YAML.stringify(item, { lineWidth: 0 }));
}

export async function commandCatalogValidate(json = false): Promise<void> {
  const issues = await validateCatalog();
  if (json) console.log(JSON.stringify(issues, null, 2));
  else printIssues(issues);
  if (failed(issues)) process.exitCode = 1;
}

export async function commandDoctor(directory: string, json = false): Promise<void> {
  if (json) {
    const root = path.resolve(directory);
    const inspect = await inspectRepository(root);
    const catalog = await validateCatalog();
    const project = await validateProject(root);
    let drift: ValidationIssue[] = [];
    const tokensPath = path.join(root, '.design-frontier', 'tokens.json');
    if (await pathExists(tokensPath)) drift = await lintDesignDrift(root, await readJson<Record<string, unknown>>(tokensPath));
    console.log(JSON.stringify({ inspect, catalog, project, drift }, null, 2));
    if (failed([...catalog, ...project, ...drift])) process.exitCode = 1;
    return;
  }
  await commandInspect(directory);
  console.log('\nCatalog:');
  await commandCatalogValidate();
  console.log('\nProject validation:');
  await commandValidate(directory);
  const tokensPath = path.join(path.resolve(directory), '.design-frontier', 'tokens.json');
  console.log('\nCode drift:');
  if (await pathExists(tokensPath)) await commandLint(directory);
  else console.log('INFO DES100: Drift scan skipped because the project is not initialized.');
}

export async function commandAgentInstall(directory: string, target: AgentTarget): Promise<void> {
  let project: ProjectInput | undefined;
  try { project = await readProject(path.resolve(directory)); } catch { /* adapter can be installed before init */ }
  const installed = await installAgentAdapters(directory, target, project);
  console.log('Installed Design Frontier agent adapters:');
  installed.forEach((item) => console.log(`- ${item}`));
}

export async function commandDiff(directory: string, json = false): Promise<void> {
  const root = path.resolve(directory);
  const manifestPath = path.join(root, '.design-frontier', 'manifest.json');
  if (!(await pathExists(manifestPath))) throw new Error('Missing .design-frontier/manifest.json.');
  const issues = await validateManifest(root, await readJson<DesignFrontierManifest>(manifestPath));
  if (json) console.log(JSON.stringify(issues, null, 2));
  else printIssues(issues.length ? issues : [{ code: 'DES080', severity: 'info', message: 'Generated files match the manifest.' }]);
  if (issues.length > 0) process.exitCode = 1;
}

export async function commandAudit(directory: string, json = false, strict = false): Promise<void> {
  const report = await writeAudit(directory);
  if (json) console.log(JSON.stringify(report, null, 2));
  else { console.log(`Design readiness: ${report.readiness_score}/100`); for (const gate of report.gates) console.log(`${gate.passed ? 'PASS' : 'FAIL'} ${gate.id}: ${gate.detail}`); console.log('- DESIGN-AUDIT.md'); }
  if (strict && report.readiness_score < 100) process.exitCode = 1;
}
