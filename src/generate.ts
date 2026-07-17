import path from 'node:path';
import type { AgentTarget, Composition, ExportContext, InspectResult, LoadedCatalog, ProjectInput } from './types.js';
import { createTokens } from './tokens.js';
import { pathExists, writeJson, writeText, writeYaml } from './io.js';
import { renderAppDesign, renderChecklist, renderDesign, renderDesignSystemSpec, renderLandingDesign, renderSources } from './templates.js';
import { runBuiltInExporter } from './exporters.js';
import { installAgentAdapters } from './agent.js';
import { writeManifest } from './manifest.js';

export async function generateProject(
  directory: string,
  project: ProjectInput,
  composition: Composition,
  catalog: LoadedCatalog,
  inspect?: InspectResult
): Promise<string[]> {
  const root = path.resolve(directory);
  const canonical = path.join(root, '.design-frontier');
  const tokens = createTokens(project);
  const selectedReferences = Object.fromEntries(Object.entries(composition.references));

  await writeYaml(path.join(canonical, 'project.yml'), project);
  await writeYaml(path.join(canonical, 'decisions.yml'), {
    format_version: 2,
    archetype: composition.archetype,
    requirements: composition.requirements,
    prohibitions: composition.prohibitions,
    boundaries: composition.boundaries
  });
  await writeYaml(path.join(canonical, 'references.yml'), { format_version: 2, references: selectedReferences });
  const unresolvedPath = path.join(canonical, 'unresolved.yml');
  if (!(await pathExists(unresolvedPath))) await writeYaml(unresolvedPath, { format_version: 2, decisions: [] });
  await writeJson(path.join(canonical, 'tokens.json'), tokens);
  if (inspect) await writeJson(path.join(canonical, 'inspection.json'), { ...inspect, directory: '.' });

  const files: Array<[string, string]> = [
    ['DESIGN.md', renderDesign(project, composition, catalog.references)],
    ['DESIGN-CHECKLIST.md', renderChecklist(project)],
    ['DESIGN-SOURCES.md', renderSources(composition, catalog.references)]
  ];
  if (project.surfaces === 'app' || project.surfaces === 'app-and-landing') files.push(['APP-DESIGN.md', renderAppDesign(project, composition)]);
  if (project.surfaces === 'landing' || project.surfaces === 'app-and-landing') files.push(['LANDING-DESIGN.md', renderLandingDesign(project, composition)]);
  if (project.outputs?.design_system_spec !== false) files.push([path.join('docs', 'design-system.md'), renderDesignSystemSpec(project, composition, tokens)]);

  for (const [name, content] of files) await writeText(path.join(root, name), content);

  const context: ExportContext = { root, project, composition, tokens };
  const exporterFiles: string[] = [];
  const exporterFlags = {
    css: project.outputs?.css !== false,
    typescript: project.outputs?.typescript !== false,
    tailwind: project.outputs?.tailwind === true
  } as const;
  for (const [name, enabled] of Object.entries(exporterFlags)) {
    if (!enabled) continue;
    const generated = runBuiltInExporter(name as keyof typeof exporterFlags, context);
    for (const [relative, content] of Object.entries(generated)) {
      await writeText(path.join(root, relative), content);
      exporterFiles.push(relative);
    }
  }
  for (const plugin of catalog.plugins) {
    for (const exporter of Object.values(plugin.exporters ?? {})) {
      const generated = await exporter(context);
      if (!generated) continue;
      for (const [relative, content] of Object.entries(generated)) {
        await writeText(path.join(root, relative), content);
        exporterFiles.push(relative);
      }
    }
  }

  const agentTargets: Exclude<AgentTarget, 'all'>[] = project.agents?.length
    ? project.agents
    : ['claude', 'codex', 'gemini', 'cursor', 'copilot'];
  const agentFiles: string[] = [];
  for (const target of agentTargets) agentFiles.push(...await installAgentAdapters(root, target, project));

  const canonicalFiles = [
    '.design-frontier/project.yml',
    '.design-frontier/decisions.yml',
    '.design-frontier/references.yml',
    '.design-frontier/unresolved.yml',
    '.design-frontier/tokens.json',
    ...(inspect ? ['.design-frontier/inspection.json'] : [])
  ];
  const generatedFiles = [...files.map(([name]) => name), ...exporterFiles];
  await writeManifest(root, generatedFiles);

  return [...new Set([...canonicalFiles, '.design-frontier/manifest.json', ...generatedFiles, ...agentFiles])];
}
