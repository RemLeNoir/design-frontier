# Architecture

## Design boundary

Design Frontier separates evidence, declared intent, deterministic composition, generated projections, and implementation checks.

```text
repository evidence ─┐
                     ├─> project.yml ─> composition engine
interview/config ────┘                     │
                                           ├─> decisions.yml
catalog + plugins ─────────────────────────┤
                                           ├─> references.yml
                                           └─> token engine
                                                   │
                                                   ├─> tokens.json
                                                   ├─> Markdown contracts
                                                   ├─> implementation exports
                                                   ├─> agent adapters
                                                   └─> manifest.json
```

The agent may help answer questions, but the agent is not part of deterministic generation.

## Modules

| Module | Responsibility |
|---|---|
| `inspect.ts` | Detect frontend stack, components, style files, CSS variables, and repeated colors |
| `interview.ts` | Collect missing product decisions in bounded blocks |
| `schemas.ts` | Validate versioned project and catalog data |
| `catalog.ts` | Load built-in and plugin references, archetypes, and compatibility rules |
| `compose.ts` | Infer an archetype, apply overrides, enforce scopes, and resolve conflicts |
| `tokens.ts` | Produce semantic, theme-aware tokens and apply deep overrides |
| `templates.ts` | Generate human and agent-readable contracts |
| `exporters.ts` | Produce CSS, TypeScript, and Tailwind implementation files |
| `agent.ts` | Install non-destructive agent adapters and skills |
| `manifest.ts` | Hash generated artifacts and detect manual divergence |
| `drift.ts` | Scan frontend source for unregistered colors and dimensions |
| `migrate.ts` | Upgrade canonical formats with backups |
| `plugins.ts` | Load trusted local or npm extension modules |
| `validate.ts` | Check cross-file consistency, catalog rules, artifacts, and plugins |

## Source-of-truth model

`project.yml` is the editable root configuration. `decisions.yml`, `references.yml`, and `tokens.json` are deterministic canonical projections used for transparency and validation. Persistent custom token values are represented in `project.yml` under `token_overrides`.

Generated Markdown and implementation exports are not edited as hidden sources. The manifest reports when they diverge.

## Determinism

For equal project input, catalog content, plugin versions, and package version, generated file content is deterministic. `manifest.json.generated_at` is intentionally time-dependent.

## Extension boundary

Plugins may add data and behavior but cannot replace built-in validation silently. Duplicate reference and archetype IDs are rejected. Plugin errors become validation errors rather than being ignored.

## Offline behavior

Generation, composition, migration, validation, linting, and catalog browsing require no network. Catalog source URLs are metadata and are not fetched during normal CLI execution.
