# Design Frontier

**A repository-native design orchestration standard and CLI for frontends built with AI agents.**

Design Frontier turns product context, existing frontend evidence, scoped design references, brand constraints, and accessibility requirements into a project-specific design contract that agents can read and machines can validate.

It does not clone websites and it does not replace design work with a brand selector. It prevents a common failure in agent-built products: every new page quietly inventing its own spacing, density, components, navigation, and visual language.

## What it does

Design Frontier provides one deterministic workflow:

```text
inspect repository
      +
collect unresolved product decisions
      +
compose references by layer
      ↓
versioned canonical data
      ↓
generated design contracts, tokens, agent adapters, and validation
```

The design model is stored under `.design-frontier/`. Human-readable Markdown, token exports, and agent instructions are generated from that model.

## Install

```bash
npm install --save-dev design-frontier
npx design-frontier init .
```

Run without installing permanently:

```bash
npx design-frontier@latest init .
```

Requirements: Node.js 20 or later.

## Main workflow

### 1. Inspect the repository

```bash
design-frontier inspect .
```

The inspector detects common frameworks, styling systems, component libraries, test tools, component files, CSS variables, and frequently repeated colors. It does not send repository data to a remote service.

### 2. Plan without writing

```bash
design-frontier plan . --config project-input.yml
```

This resolves:

- the interface archetype;
- one primary and optional secondary reference per layer;
- reference boundaries;
- requirements and prohibitions;
- composition conflicts.

Use `--json` for automation.

### 3. Initialize or generate

```bash
design-frontier init . --config project-input.yml
design-frontier generate .
```

Without `--config`, `init` runs an adaptive four-block interview. Existing repository evidence is collected first so the interview does not ask for facts that can be detected safely.

### 4. Validate implementation and generated state

```bash
design-frontier validate . --strict
design-frontier lint .
design-frontier diff .
```

`validate` checks the full design model. `lint` scans frontend files for raw colors and dimensions outside the canonical token set. `diff` detects generated artifacts edited outside Design Frontier.

## Commands

```text
design-frontier init [directory] [--config file] [--force]
design-frontier plan [directory] [--config file] [--json]
design-frontier inspect [directory] [--json]
design-frontier generate [directory]
design-frontier update [directory]
design-frontier migrate [directory] [--dry-run]
design-frontier validate [directory] [--json] [--strict]
design-frontier lint [directory] [--json] [--strict]
design-frontier diff [directory] [--json]
design-frontier export <css|typescript|tailwind|all> [directory]
design-frontier doctor [directory] [--json]
design-frontier catalog list [--kind references|archetypes] [--layer layer]
design-frontier catalog show <id>
design-frontier catalog validate [--json]
design-frontier agent install <claude|codex|gemini|cursor|copilot|all> [directory]
```

The shorter `df` binary is also included.

## Canonical format

```text
.design-frontier/
├── project.yml          Declared product context and configuration
├── decisions.yml        Resolved archetype, requirements, boundaries
├── references.yml       References assigned to explicit layers
├── unresolved.yml       Open decisions that must remain visible
├── tokens.json          Generated semantic token graph
├── inspection.json      Last repository inspection
├── manifest.json        SHA-256 hashes for generated artifacts
├── backups/             Automatic migration backups
└── generated/
    ├── tokens.css
    ├── tokens.ts
    └── tailwind.preset.mjs
```

`project.yml` is the editable control file. Lasting token changes belong under `token_overrides` in that file. `tokens.json` is regenerated and checked against the configuration.

## Generated contracts

Depending on the selected surfaces, Design Frontier creates:

```text
DESIGN.md
APP-DESIGN.md
LANDING-DESIGN.md
DESIGN-CHECKLIST.md
DESIGN-SOURCES.md
docs/design-system.md
```

The generated documents contain concrete rules for:

- design principles and visual personality;
- semantic surfaces and color roles;
- typography and density;
- layout and navigation;
- tables, forms, data visualization, and feedback;
- component states;
- responsive behavior;
- accessibility;
- motion;
- permitted and prohibited patterns;
- source boundaries.

## Layered references

References are not whole-project themes. Each reference is allowed to influence only the layer where it is selected.

```yaml
reference_overrides:
  application_shell:
    primary: metronic
    weight: 0.75
  navigation:
    primary: linear
    weight: 0.75
  tables:
    primary: airtable
    secondary: carbon
    weight: 0.85
  forms:
    primary: stripe
    secondary: govuk
    weight: 0.75
  marketing_site:
    primary: apple
    secondary: stripe
    weight: 0.55
```

This permits combinations such as an operational shell inspired by Metronic, restrained navigation informed by Linear, Airtable-style data operations, GOV.UK-style error clarity, and an Apple-influenced marketing rhythm without transferring landing spacing into the application.

Supported layers:

```text
brand                  typography             layout
application_shell      navigation             density
tables                 forms                  data_visualization
feedback               marketing_site         documentation
accessibility          motion                 mobile
```

Accessibility and explicit project constraints take precedence over aesthetic references.

## Catalog

Version 1.0 ships with 20 reviewed references and 12 tested archetypes.

Reference families include:

- application and administrative structure;
- dense data operations;
- enterprise design systems;
- form and service clarity;
- developer products and documentation;
- commerce operations;
- public-service interfaces;
- mobile interaction;
- marketing and product storytelling.

The catalog stores suitability scores, supported layers, unsuitable contexts, primary evidence, review dates, implementation notes, and boundaries. It contains no third-party assets or source code.

Browse it with:

```bash
design-frontier catalog list
design-frontier catalog list --layer tables
design-frontier catalog show govuk
```

See [DESIGN-CATALOG.md](DESIGN-CATALOG.md) and [docs/catalog-format.md](docs/catalog-format.md).

## Semantic tokens and themes

The token engine emits DTCG-style token objects using `$type`, `$value`, and `$description`. It includes:

- light and dark semantic color sets;
- page, panel, raised, and overlay surfaces;
- text, borders, actions, and status roles;
- density-aware control and layout sizes;
- spacing, radius, border, shadow, typography, and motion scales;
- deep project-specific overrides.

Example override:

```yaml
token_overrides:
  radius:
    control:
      $type: dimension
      $value: 6px
      $description: Product control radius
```

Exporters are available for CSS variables, TypeScript, and Tailwind presets.

## Agent integrations

Design Frontier installs repository-scoped adapters without replacing existing instructions.

```bash
design-frontier agent install all .
```

Generated integration points:

```text
AGENTS.md
CLAUDE.md
GEMINI.md
.claude/skills/design-frontier/SKILL.md
.agents/skills/design-frontier/SKILL.md
.cursor/rules/design-frontier.mdc
.github/copilot-instructions.md
```

Managed blocks are updated in place. Existing content outside those blocks is preserved.

All adapters point to the same canonical contract. They do not maintain separate copies of the design system.

## Existing projects

Design Frontier is designed to enter an existing repository without replacing working components.

```bash
design-frontier inspect . --json
design-frontier init . --config adoption.yml
design-frontier lint .
```

Repository evidence informs the initial model. The generator then records boundaries such as “existing component behavior overrides purely visual inspiration unless a migration is explicit.”

## Migrations

The canonical format is versioned independently from the npm package. Version 1.0 uses format version `2`.

```bash
design-frontier migrate . --dry-run
design-frontier migrate .
```

A migration writes a timestamped backup under `.design-frontier/backups/` before changing canonical files. See [docs/migrations.md](docs/migrations.md).

## Plugins

A plugin can add:

- references;
- archetypes;
- compatibility rules;
- exporters;
- validators.

```yaml
plugins:
  - ./design-frontier-plugin.mjs
  - '@company/design-frontier-catalog'
```

Plugins are JavaScript modules and execute with the same local permissions as the CLI. Only install or configure trusted plugins. See [docs/plugin-api.md](docs/plugin-api.md).

## Validation model

Validation is cross-file, not merely syntactic. It checks that:

- catalog entries and archetypes are internally valid;
- selected references exist and support their assigned layers;
- compatibility rules are respected;
- `decisions.yml` and `references.yml` match the current composition;
- token output matches `project.yml` and its overrides;
- expected surface documents and agent adapters exist;
- unresolved decisions remain visible;
- generated artifacts match the SHA-256 manifest;
- plugin validators pass.

See [docs/validation-codes.md](docs/validation-codes.md).

## Public API

The package exports the core engine for integration in other tools:

```ts
import {
  loadCatalog,
  inspectRepository,
  composeProject,
  createTokens,
  generateProject,
  validateProject,
  lintDesignDrift
} from 'design-frontier';
```

The public format is documented in [docs/format-spec.md](docs/format-spec.md). Conformance fixtures live under `conformance/`.

## Repository structure

```text
catalog/        Reviewed references, archetypes, layers, compatibility
conformance/    Valid, invalid, and legacy public fixtures
docs/           Format, architecture, integrations, governance, security
examples/       Project input, plugin, generated project
schemas/        Public JSON Schemas
skills/         Claude and open agent skill packages
src/            CLI and public TypeScript engine
.github/        CI, release workflow, issue templates
```

## Development

```bash
npm ci
npm run check
npm run smoke:pack
```

`npm run check` performs type checking, 18 automated tests, a production build, and catalog validation. `npm run smoke:pack` installs the packed tarball in a clean temporary project and executes the published binary.

## Project policy

- The catalog is comparative and editorial. It does not claim third-party endorsement.
- No third-party logos, screenshots, font files, source code, or proprietary assets are distributed.
- A reference must state what it may influence and what it must not influence.
- Format-breaking changes require a migration path.
- Generated output must remain deterministic apart from manifest timestamps.
- Plugins and agent instructions are reviewed as executable supply-chain inputs.

Read [CONTRIBUTING.md](CONTRIBUTING.md), [SECURITY.md](SECURITY.md), and [docs/governance.md](docs/governance.md).

## License

MIT. Third-party names are used only to identify comparative reference sources. See [NOTICE.md](NOTICE.md).


## Release-readiness audit

```bash
design-frontier audit .
design-frontier audit . --strict
```

The audit combines canonical validation, generated-file integrity, repository inspection, token drift and visual-harness readiness. It writes `DESIGN-AUDIT.md` and `.design-frontier/audit.json`. Source analysis cannot prove visual quality, so a complete gate also requires Storybook or Playwright and rendered review of representative pages.

## What “complete” means here

Design Frontier closes the repeatable engineering loop: discovery, interview, composition, generation, agent installation, implementation exports, validation, drift detection and release audit. It does not claim that any static tool can guarantee good taste or replace rendered review. The release gate makes that limitation explicit instead of hiding it.
