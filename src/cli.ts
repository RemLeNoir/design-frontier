#!/usr/bin/env node
import { Command } from 'commander';
import {
  commandAgentInstall,
  commandAudit,
  commandCatalogList,
  commandCatalogShow,
  commandCatalogValidate,
  commandDiff,
  commandDoctor,
  commandExport,
  commandGenerate,
  commandInit,
  commandInspect,
  commandLint,
  commandMigrate,
  commandPlan,
  commandUpdate,
  commandValidate
} from './commands.js';
import { VERSION } from './version.js';

const program = new Command();
program.name('design-frontier').description('Design orchestration and validation for agent-built frontends.').version(VERSION);

program.command('init')
  .argument('[directory]', 'Project directory', '.')
  .option('-c, --config <file>', 'Non-interactive YAML input file')
  .option('-f, --force', 'Replace the existing canonical Design Frontier project')
  .description('Inspect, interview, compose and generate a project design contract.')
  .action(async (directory, options) => commandInit(directory, options.config, options.force));

program.command('plan')
  .argument('[directory]', 'Project directory', '.')
  .option('-c, --config <file>', 'Plan from a YAML input without writing files')
  .option('--json', 'Print machine-readable JSON')
  .description('Resolve archetype, references, boundaries and conflicts without writing files.')
  .action(async (directory, options) => commandPlan(directory, options.config, options.json));

program.command('inspect')
  .argument('[directory]', 'Project directory', '.')
  .option('--json', 'Print machine-readable JSON')
  .description('Inspect frontend stack, components, styles, variables and frequent colors.')
  .action(async (directory, options) => commandInspect(directory, options.json));

program.command('generate').argument('[directory]', 'Project directory', '.').description('Regenerate all artifacts from canonical files.').action(commandGenerate);
program.command('update').argument('[directory]', 'Project directory', '.').description('Migrate when necessary, then regenerate all artifacts.').action(commandUpdate);
program.command('migrate').argument('[directory]', 'Project directory', '.').option('--dry-run', 'Report migration without writing').description('Migrate canonical project data to the current format.').action(async (directory, options) => commandMigrate(directory, options.dryRun));

program.command('validate')
  .argument('[directory]', 'Project directory', '.')
  .option('--json', 'Print machine-readable JSON')
  .option('--strict', 'Treat warnings as failures')
  .description('Validate canonical files, catalog use, plugins, tokens, adapters and generated artifacts.')
  .action(async (directory, options) => commandValidate(directory, options.json, options.strict));

program.command('lint')
  .argument('[directory]', 'Project directory', '.')
  .option('--json', 'Print machine-readable JSON')
  .option('--strict', 'Treat raw token drift warnings as failures')
  .description('Scan frontend code for raw colors and dimensions outside the canonical token set.')
  .action(async (directory, options) => commandLint(directory, options.json, options.strict));

program.command('diff').argument('[directory]', 'Project directory', '.').option('--json', 'Print machine-readable JSON').description('Detect generated files edited outside Design Frontier.').action(async (directory, options) => commandDiff(directory, options.json));
program.command('export').argument('<format>', 'css, typescript, tailwind, or all').argument('[directory]', 'Project directory', '.').description('Export canonical tokens for implementation.').action(async (format, directory) => commandExport(directory, format));

const agent = program.command('agent').description('Install repository-scoped skills and instruction adapters.');
agent.command('install').argument('<target>', 'claude, codex, gemini, cursor, copilot, or all').argument('[directory]', 'Project directory', '.').action(async (target, directory) => {
  if (!['claude', 'codex', 'gemini', 'cursor', 'copilot', 'all'].includes(target)) throw new Error('Unsupported agent target.');
  await commandAgentInstall(directory, target);
});

const catalog = program.command('catalog').description('Browse and validate the bundled catalog.');
catalog.command('list').option('-k, --kind <kind>', 'references or archetypes').option('-l, --layer <layer>', 'Filter references by layer').action(async (options) => commandCatalogList(options.kind, options.layer));
catalog.command('show').argument('<id>').action(commandCatalogShow);
catalog.command('validate').option('--json', 'Print machine-readable JSON').action(async (options) => commandCatalogValidate(options.json));


program.command('audit')
  .argument('[directory]', 'Project directory', '.')
  .option('--json', 'Print machine-readable JSON')
  .option('--strict', 'Fail unless all release gates pass')
  .description('Create a release-readiness report from canonical validation, code drift and repository evidence.')
  .action(async (directory, options) => commandAudit(directory, options.json, options.strict));

program.command('doctor').argument('[directory]', 'Project directory', '.').option('--json', 'Print machine-readable JSON').description('Run repository inspection, catalog validation, project validation and drift checks.').action(async (directory, options) => commandDoctor(directory, options.json));

program.parseAsync().catch((error: unknown) => {
  console.error(`Design Frontier error: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
