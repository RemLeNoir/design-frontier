# Canonical format specification

## Versioning

The canonical format uses `format_version`. Design Frontier 1.0 reads format `2` and migrates format `1`.

Package version and format version are independent. A package release may change without changing the canonical format.

## `project.yml`

Required fields:

```yaml
format_version: 2
name: Product name
product_type: b2b-saas
surfaces: app-and-landing
dominant_patterns: [tables, forms]
density: medium-high
accessibility: wcag-aa
theme: both
device_priority: desktop
locales: [en]
```

Optional groups:

- users and goals;
- explicit archetype;
- navigation model;
- detected or declared stack;
- brand values;
- requirements, prohibitions, and regulatory constraints;
- reference overrides by layer;
- output controls;
- token overrides;
- plugin specifiers;
- agent targets.

The public JSON Schema is `schemas/project.schema.json`.

## `decisions.yml`

A generated representation of the chosen archetype and accumulated rules:

```yaml
format_version: 2
archetype: saas-operational-dense
requirements: []
prohibitions: []
boundaries: []
```

Manual edits are rejected when they no longer match composition.

## `references.yml`

```yaml
format_version: 2
references:
  tables:
    primary: airtable
    secondary: carbon
    weight: 0.85
    source: override
```

`source` is `archetype` or `override`. Weight is between `0` and `1`. It resolves precedence within a layer; it is not a percentage of visual copying.

## `unresolved.yml`

```yaml
format_version: 2
decisions:
  - id: mobile-table-strategy
    question: Should dense tables stack, scroll, or switch to cards on narrow screens?
    status: open
```

Status values are `open`, `accepted`, and `rejected`. Generation preserves this file.

## `tokens.json`

Token leaves use:

```json
{
  "$type": "dimension",
  "$value": "8px",
  "$description": "Inputs and buttons"
}
```

The file includes default semantic tokens plus `themes.light` and `themes.dark`. Custom values are declared in `project.yml.token_overrides` and merged deeply.

## `manifest.json`

The manifest records SHA-256 hashes of generated documents and exports. It enables `design-frontier diff` and protects against silent divergence.

## Compatibility promise

Within format version 2:

- fields are not removed;
- enum values are not redefined;
- new optional fields may be added;
- generated prose may improve without changing canonical meaning;
- new validation warnings may be introduced;
- new errors require either invalid existing data or a documented security/integrity reason.
