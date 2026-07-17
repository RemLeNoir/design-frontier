# Catalog format

The catalog is a reviewed decision map, not a style gallery.

## Reference entry

```yaml
id: linear
name: Linear
kind: brand
status: reviewed
official_design_system: false
last_reviewed: 2026-07-16
summary: Restrained product UI with controlled density.
covers_layers:
  navigation: 0.90
  density: 0.85
recommended_for:
  - developer-tool
avoid_for:
  - public-service-form
boundaries:
  - Do not transfer marketing typography into operational screens.
implementation_notes:
  - Prefer existing repository components over visual imitation.
traits:
  visual_noise: low
evidence:
  - title: Linear product site
    url: https://linear.app/
    type: primary
```

Scores indicate suitability for a layer from `0` to `1`. They do not represent ownership, fidelity, or permission to copy.

## Archetype entry

An archetype declares product signals, defaults, references, requirements, and prohibitions. Every default reference must support its assigned layer.

## Compatibility rules

`catalog/compatibility.yml` reports combinations that need rejection or explicit attention.

## Review checklist

- At least one primary source.
- Accurate `official_design_system` value.
- Current `last_reviewed` date.
- Every claimed layer supported by observable source material.
- Boundaries prevent cross-layer misuse.
- No screenshots, logos, font files, or copied source.
- Editorial language does not imply endorsement.
