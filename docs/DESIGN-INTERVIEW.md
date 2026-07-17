# Design Frontier interview protocol

The interview converts unknown product decisions into `project.yml`. Repository inspection happens first.

## Rules

1. Do not ask for evidence already found safely in the repository.
2. Ask no more than five questions in one block.
3. Ask what a reference should influence, not merely what website someone likes.
4. Keep application and marketing decisions separate.
5. Expose contradictions instead of resolving them silently.
6. Do not invent brand assets, regulatory requirements, users, or workflows.
7. Put lasting values into structured configuration.
8. Keep genuinely open decisions in `unresolved.yml`.

## Current blocks

### Product

Project name, product type, users, goals, and surfaces.

### Interface

Dominant patterns, density, navigation, device priority, and theme.

### Brand and compliance

Accessibility target, locales, brand colors, and prohibited patterns.

### Composition and integrations

Optional archetype, layer-specific reference overrides, agent targets, and implementation outputs.

## Reference question pattern

Avoid:

> What website should this look like?

Use:

> Which source should inform the table behavior, and which parts are relevant: density, filtering, selection, bulk actions, hierarchy, or only visual treatment?

## Evidence labels

- observed;
- declared;
- inferred;
- unresolved.

Agents may conduct a richer interview, but they must finish by creating valid structured input and running `design-frontier plan` before generation.
