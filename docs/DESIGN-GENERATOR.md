# Design Frontier generator contract

## Inputs

- validated format 2 project configuration;
- repository inspection evidence;
- built-in and plugin catalog data;
- deterministic composition;
- semantic token configuration;
- trusted plugin exporters and validators.

## Canonical outputs

```text
.design-frontier/project.yml
.design-frontier/decisions.yml
.design-frontier/references.yml
.design-frontier/unresolved.yml
.design-frontier/tokens.json
.design-frontier/inspection.json
.design-frontier/manifest.json
```

## Human and agent projections

```text
DESIGN.md
APP-DESIGN.md
LANDING-DESIGN.md
DESIGN-CHECKLIST.md
DESIGN-SOURCES.md
docs/design-system.md
```

## Implementation projections

```text
.design-frontier/generated/tokens.css
.design-frontier/generated/tokens.ts
.design-frontier/generated/tailwind.preset.mjs
```

## Guarantees

- References affect only assigned layers.
- Application and landing composition remain separate.
- Accessibility and explicit constraints override aesthetic sources.
- Persistent token changes are represented in `project.yml.token_overrides`.
- `unresolved.yml` survives regeneration.
- Existing agent instructions outside managed blocks survive adapter updates.
- Generated artifacts are hashed for integrity checks.
- Third-party assets, source code, and exact compositions are never copied.
- Vague adjectives are converted into observable rules or left unresolved.

## Invalid generated rules

The generator must not rely on phrases such as “modern”, “clean”, “premium”, or “intuitive” without measurable consequences. Valid rules name tokens, limits, states, hierarchy, density, interaction, or responsive behavior.
