import path from 'node:path';
import { loadCatalog, loadReferences, loadArchetypes, loadCompatibility } from './catalog.js';
import { pathExists, readJson, readYaml } from './io.js';
import { decisionsFileSchema, manifestSchema, projectInputSchema, referencesFileSchema, unresolvedFileSchema } from './schemas.js';
import { createTokens } from './tokens.js';
import { PACKAGE_VERSION, validateManifest } from './manifest.js';
import { composeProject } from './compose.js';
import type { AgentTarget, DesignFrontierManifest, ExportContext, LoadedCatalog, ProjectInput, ValidationIssue } from './types.js';

function zodMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

function requiredGeneratedFiles(project: ProjectInput): string[] {
  const files = ['DESIGN.md', 'DESIGN-CHECKLIST.md', 'DESIGN-SOURCES.md', 'AGENTS.md'];
  if (project.surfaces === 'app' || project.surfaces === 'app-and-landing') files.push('APP-DESIGN.md');
  if (project.surfaces === 'landing' || project.surfaces === 'app-and-landing') files.push('LANDING-DESIGN.md');
  if (project.outputs?.design_system_spec !== false) files.push(path.join('docs', 'design-system.md'));
  if (project.outputs?.css !== false) files.push(path.join('.design-frontier', 'generated', 'tokens.css'));
  if (project.outputs?.typescript !== false) files.push(path.join('.design-frontier', 'generated', 'tokens.ts'));
  if (project.outputs?.tailwind === true) files.push(path.join('.design-frontier', 'generated', 'tailwind.preset.mjs'));
  return files;
}

function requiredAgentFiles(project: ProjectInput): string[] {
  const targets: Exclude<AgentTarget, 'all'>[] = project.agents?.length ? project.agents : ['claude', 'codex', 'gemini', 'cursor', 'copilot'];
  const files = new Set<string>(['AGENTS.md']);
  for (const target of targets) {
    if (target === 'claude') {
      files.add('CLAUDE.md');
      files.add(path.join('.claude', 'skills', 'design-frontier', 'SKILL.md'));
    }
    if (target === 'codex' || target === 'gemini') files.add(path.join('.agents', 'skills', 'design-frontier', 'SKILL.md'));
    if (target === 'gemini') files.add('GEMINI.md');
    if (target === 'cursor') files.add(path.join('.cursor', 'rules', 'design-frontier.mdc'));
    if (target === 'copilot') files.add(path.join('.github', 'copilot-instructions.md'));
  }
  return [...files];
}

function validateTokenNode(value: unknown, pathName: string, issues: ValidationIssue[]): void {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return;
  const node = value as Record<string, unknown>;
  if ('$value' in node) {
    if (!('$type' in node)) issues.push({ code: 'DES034', severity: 'error', message: 'Token has $value but no $type.', path: pathName });
    return;
  }
  for (const [key, child] of Object.entries(node)) if (!key.startsWith('$')) validateTokenNode(child, pathName ? `${pathName}.${key}` : key, issues);
}

function stable(value: unknown): string {
  const normalize = (item: unknown): unknown => {
    if (Array.isArray(item)) return item.map(normalize);
    if (item && typeof item === 'object') return Object.fromEntries(Object.entries(item as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, child]) => [key, normalize(child)]));
    return item;
  };
  return JSON.stringify(normalize(value));
}

export async function validateCatalog(catalog?: LoadedCatalog): Promise<ValidationIssue[]> {
  const loaded = catalog ?? { references: await loadReferences(), archetypes: await loadArchetypes(), compatibility: await loadCompatibility(), plugins: [] };
  const issues: ValidationIssue[] = [];
  const referenceIds = new Set(loaded.references.map((item) => item.id));
  const archetypeIds = new Set(loaded.archetypes.map((item) => item.id));

  if (loaded.references.length < 20) issues.push({ code: 'CAT001', severity: 'error', message: `The stable catalog requires at least 20 references; found ${loaded.references.length}.` });
  if (loaded.archetypes.length < 10) issues.push({ code: 'CAT002', severity: 'error', message: `The stable catalog requires at least 10 archetypes; found ${loaded.archetypes.length}.` });

  const now = Date.now();
  for (const reference of loaded.references) {
    if (!Object.keys(reference.covers_layers).length) issues.push({ code: 'CAT003', severity: 'error', message: `${reference.id} supports no layers.`, path: reference.id });
    if (!reference.evidence.some((item) => item.type === 'primary')) issues.push({ code: 'CAT004', severity: 'error', message: `${reference.id} has no primary evidence.`, path: reference.id });
    const reviewed = new Date(`${reference.last_reviewed}T00:00:00Z`).getTime();
    if (!Number.isFinite(reviewed)) issues.push({ code: 'CAT010', severity: 'error', message: `${reference.id} has an invalid last_reviewed date.`, path: reference.id });
    else if ((now - reviewed) / 86_400_000 > 550) issues.push({ code: 'CAT005', severity: 'warning', message: `${reference.id} has not been reviewed for more than 550 days.`, path: reference.id });
    if (reference.status === 'draft') issues.push({ code: 'CAT006', severity: 'info', message: `${reference.id} is still a draft reference.`, path: reference.id });
  }
  for (const archetype of loaded.archetypes) {
    for (const [layer, reference] of Object.entries(archetype.defaults.references)) {
      if (!referenceIds.has(reference)) issues.push({ code: 'CAT007', severity: 'error', message: `${archetype.id} uses unknown reference ${reference}.`, path: `${archetype.id}.defaults.references.${layer}` });
      const ref = loaded.references.find((item) => item.id === reference);
      if (ref && !(layer in ref.covers_layers)) issues.push({ code: 'CAT011', severity: 'error', message: `${archetype.id} assigns ${reference} to unsupported layer ${layer}.`, path: `${archetype.id}.defaults.references.${layer}` });
    }
  }
  for (const rule of loaded.compatibility) for (const reference of rule.references) if (!referenceIds.has(reference)) issues.push({ code: 'CAT008', severity: 'error', message: `${rule.id} uses unknown reference ${reference}.`, path: rule.id });
  if (!archetypeIds.size) issues.push({ code: 'CAT009', severity: 'error', message: 'No archetypes are available.' });
  if (!issues.length) issues.push({ code: 'CAT000', severity: 'info', message: 'Catalog validation passed.' });
  return issues;
}

export async function validateProject(directory: string): Promise<ValidationIssue[]> {
  const root = path.resolve(directory);
  const canonical = path.join(root, '.design-frontier');
  const issues: ValidationIssue[] = [];
  const projectPath = path.join(canonical, 'project.yml');
  const refsPath = path.join(canonical, 'references.yml');
  const decisionsPath = path.join(canonical, 'decisions.yml');
  const unresolvedPath = path.join(canonical, 'unresolved.yml');
  const tokensPath = path.join(canonical, 'tokens.json');
  const manifestPath = path.join(canonical, 'manifest.json');

  if (!(await pathExists(projectPath))) return [{ code: 'DES001', severity: 'error', message: 'Missing .design-frontier/project.yml.' }];
  let rawProject: unknown;
  try { rawProject = await readYaml<unknown>(projectPath); } catch (error) { return [{ code: 'DES002', severity: 'error', message: `Cannot read project.yml: ${zodMessage(error)}` }]; }
  if ((rawProject as { format_version?: number })?.format_version === 1) return [{ code: 'DES005', severity: 'error', message: 'Project uses format version 1. Run design-frontier migrate .' }];

  let project: ProjectInput;
  try { project = projectInputSchema.parse(rawProject); } catch (error) { return [{ code: 'DES002', severity: 'error', message: `Invalid project.yml: ${zodMessage(error)}` }]; }

  let catalog: LoadedCatalog;
  try { catalog = await loadCatalog({ pluginSpecifiers: project.plugins, cwd: root }); }
  catch (error) { return [{ code: 'DES090', severity: 'error', message: `Plugin or catalog loading failed: ${zodMessage(error)}` }]; }

  const catalogIssues = await validateCatalog(catalog);
  issues.push(...catalogIssues.filter((issue) => issue.severity === 'error'));
  const composition = composeProject(project, catalog.archetypes, catalog.references, catalog.compatibility);
  issues.push(...composition.warnings);

  for (const [file, code] of [[refsPath, 'DES003'], [decisionsPath, 'DES006'], [unresolvedPath, 'DES007'], [tokensPath, 'DES004'], [manifestPath, 'DES081']] as const) {
    if (!(await pathExists(file))) issues.push({ code, severity: 'error', message: `Missing ${path.relative(root, file)}.` });
  }
  for (const file of [...requiredGeneratedFiles(project), ...requiredAgentFiles(project)]) if (!(await pathExists(path.join(root, file)))) issues.push({ code: 'DES042', severity: 'error', message: `Missing generated artifact ${file}.`, path: file });

  let referencesFile: ReturnType<typeof referencesFileSchema.parse> | undefined;
  if (await pathExists(refsPath)) {
    try { referencesFile = referencesFileSchema.parse(await readYaml<unknown>(refsPath)); }
    catch (error) { issues.push({ code: 'DES012', severity: 'error', message: `Invalid references.yml: ${zodMessage(error)}` }); }
  }
  if (referencesFile && stable(referencesFile.references) !== stable(composition.references)) issues.push({ code: 'DES017', severity: 'error', message: 'references.yml does not match the current project composition. Run design-frontier generate .', path: '.design-frontier/references.yml' });

  if (await pathExists(decisionsPath)) {
    try {
      const decisions = decisionsFileSchema.parse(await readYaml<unknown>(decisionsPath));
      if (!catalog.archetypes.some((item) => item.id === decisions.archetype)) issues.push({ code: 'DES071', severity: 'error', message: `Unknown archetype ${decisions.archetype}.` });
      if (stable(decisions) !== stable({ format_version: 2, archetype: composition.archetype, requirements: composition.requirements, prohibitions: composition.prohibitions, boundaries: composition.boundaries })) issues.push({ code: 'DES073', severity: 'error', message: 'decisions.yml does not match project.yml and catalog composition. Run design-frontier generate .', path: '.design-frontier/decisions.yml' });
    } catch (error) { issues.push({ code: 'DES072', severity: 'error', message: `Invalid decisions.yml: ${zodMessage(error)}` }); }
  }

  if (await pathExists(unresolvedPath)) {
    try {
      const unresolved = unresolvedFileSchema.parse(await readYaml<unknown>(unresolvedPath));
      const open = unresolved.decisions.filter((item) => item.status === 'open');
      if (open.length) issues.push({ code: 'DES074', severity: 'warning', message: `${open.length} design decision(s) remain unresolved.`, path: '.design-frontier/unresolved.yml' });
    } catch (error) { issues.push({ code: 'DES075', severity: 'error', message: `Invalid unresolved.yml: ${zodMessage(error)}` }); }
  }

  let tokens: Record<string, unknown> = createTokens(project);
  if (await pathExists(tokensPath)) {
    try {
      tokens = await readJson<Record<string, unknown>>(tokensPath);
      for (const group of ['color', 'space', 'size', 'radius', 'border', 'shadow', 'typography', 'motion']) if (!(group in tokens)) issues.push({ code: 'DES033', severity: 'error', message: `tokens.json must define ${group}.`, path: group });
      validateTokenNode(tokens, '', issues);
      if (stable(tokens) !== stable(createTokens(project))) issues.push({ code: 'DES035', severity: 'error', message: 'tokens.json differs from project token configuration. Put custom values in project.yml token_overrides and regenerate.', path: '.design-frontier/tokens.json' });
    } catch (error) { issues.push({ code: 'DES032', severity: 'error', message: `Invalid tokens.json: ${zodMessage(error)}` }); }
  }

  if (await pathExists(manifestPath)) {
    try {
      const manifest = manifestSchema.parse(await readJson<unknown>(manifestPath)) as DesignFrontierManifest;
      if (manifest.package_version !== PACKAGE_VERSION) issues.push({ code: 'DES085', severity: 'warning', message: `Artifacts were generated by Design Frontier ${manifest.package_version}; installed version is ${PACKAGE_VERSION}. Regenerate to confirm compatibility.` });
      issues.push(...await validateManifest(root, manifest));
    } catch (error) { issues.push({ code: 'DES084', severity: 'error', message: `Invalid manifest.json: ${zodMessage(error)}` }); }
  }

  const context: ExportContext = { root, project, composition, tokens };
  for (const plugin of catalog.plugins) for (const validator of plugin.validators ?? []) {
    try { const result = await validator(context); if (result) issues.push(...result); }
    catch (error) { issues.push({ code: 'DES091', severity: 'error', message: `Plugin validator ${plugin.name} failed: ${zodMessage(error)}` }); }
  }

  if (project.brand?.logoPath && !(await pathExists(path.join(root, project.brand.logoPath)))) issues.push({ code: 'DES065', severity: 'warning', message: `Configured logo does not exist: ${project.brand.logoPath}.`, path: project.brand.logoPath });
  if (!issues.length) issues.push({ code: 'DES000', severity: 'info', message: 'Design Frontier validation passed.' });
  return issues;
}
