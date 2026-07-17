---
name: design-frontier
description: Use the repository's Design Frontier contract to plan, implement, and validate frontend changes consistently across agents.
---

# Design Frontier workflow

1. Read `AGENTS.md`, `DESIGN.md`, and `DESIGN-CHECKLIST.md` before frontend work.
2. Use `APP-DESIGN.md` only for product UI and `LANDING-DESIGN.md` only for marketing UI.
3. Treat `.design-frontier/` as canonical. Generated Markdown and token exports are projections of those files.
4. Inspect and plan before changing the design model:

```bash
npx design-frontier inspect .
npx design-frontier plan .
```

5. Reuse existing components and semantic tokens. Do not invent page-local colors, spacing scales, radii, or component variants.
6. Apply catalog references only to their assigned layers. A named brand is not permission to copy assets, code, or exact compositions.
7. After changes, run:

```bash
npx design-frontier generate .
npx design-frontier validate . --strict
npx design-frontier lint .
npx design-frontier diff .
```

Keep unresolved choices visible instead of silently inventing them.
