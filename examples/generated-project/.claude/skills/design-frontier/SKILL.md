---
name: design-frontier
description: Plan, generate, apply, and validate a repository-specific frontend design contract with Design Frontier. Use before creating or revising product UI, landing pages, components, tokens, or visual patterns.
---

# Design Frontier

Use Design Frontier as the repository's design control plane.

## Before frontend work

1. Read `AGENTS.md`, `DESIGN.md`, and `DESIGN-CHECKLIST.md`.
2. Read `APP-DESIGN.md` for application UI and `LANDING-DESIGN.md` for marketing UI when present.
3. Treat `.design-frontier/project.yml`, `decisions.yml`, `references.yml`, and `tokens.json` as canonical.
4. Run `npx design-frontier inspect .` when the repository has changed materially.
5. Run `npx design-frontier plan .` before changing reference scopes, archetype, density, or navigation.

## While implementing

- Reuse existing components and semantic tokens before creating variants.
- Keep marketing references out of operational application layers unless the canonical composition explicitly assigns them.
- Do not copy proprietary assets, source code, or exact branded compositions from catalog references.
- Record lasting changes in canonical data, then regenerate. Do not hand-edit generated files and leave canonical data stale.

## Before completion

Run:

```bash
npx design-frontier generate .
npx design-frontier validate . --strict
npx design-frontier lint .
npx design-frontier diff .
```

Report unresolved decisions, warnings accepted deliberately, and files changed.
