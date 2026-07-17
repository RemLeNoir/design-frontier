# AGENTS.md

## Repository purpose

Design Frontier is a deterministic design orchestration CLI. Preserve the separation between canonical structured data and generated Markdown.

## Before changing code

- Read `README.md` and `docs/architecture.md`.
- Read the relevant schema before changing a data format.
- Catalog entries are editorial data and must remain source-backed.

## Commands

```bash
npm install
npm run typecheck
npm test
npm run build
npm run check
```

## Constraints

- Do not move canonical decisions into prompts or generated Markdown.
- Do not add a brand reference without supported layers and boundaries.
- Do not duplicate agent-specific copies of the full design contract.
- Do not silently change schema semantics.
- Keep generated outputs deterministic for identical inputs.

## Verification

Run `npm run check` after code changes. When generator output changes, update or add a fixture test.
