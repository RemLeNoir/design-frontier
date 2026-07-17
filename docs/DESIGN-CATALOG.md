# Design Frontier catalog

Design Frontier composes frontends from scoped references and product archetypes. The catalog is executable configuration, validated by the CLI.

## Layers

| Layer | What it controls |
|---|---|
| `brand` | Shared identity and semantic brand roles |
| `typography` | Type families, hierarchy, reading behavior |
| `layout` | Grid, widths, page rhythm, containment |
| `application_shell` | Persistent frame, sidebar, header, work area |
| `navigation` | Wayfinding, hierarchy, tabs, workspace switching |
| `density` | Control sizing, information compression, visual noise |
| `tables` | Comparison, sorting, filtering, selection, bulk actions |
| `forms` | Input, validation, progress, trust-sensitive workflows |
| `data_visualization` | Metrics, charts, analytical composition |
| `feedback` | Loading, empty, success, warning, failure, offline states |
| `marketing_site` | Public narrative, proof, product presentation, conversion |
| `documentation` | Technical reading, examples, code and reference content |
| `accessibility` | Inclusive interaction and service clarity |
| `motion` | Duration, easing, transition purpose |
| `mobile` | Narrow viewport and touch interaction strategy |

## Bundled references

### Structure and product UI

- `metronic`: modular administrative shells and multi-area backoffice structure;
- `linear`: restrained workflow navigation and low visual noise;
- `atlassian`: collaborative product patterns and structured navigation;
- `primer`: developer-facing application patterns and repository workflows;
- `ant-design`: enterprise data entry and dense component coverage;
- `elastic-eui`: operational search, observability, and data-heavy controls.

### Enterprise and public systems

- `carbon`: enterprise components and data visualization;
- `fluent2`: productivity applications and adaptive Microsoft-style patterns;
- `fiori`: enterprise process applications;
- `lightning`: CRM and record-centric workflows;
- `spectrum`: creative/professional tool behavior;
- `govuk`: public-service forms, error handling, and content clarity;
- `uswds`: accessible public digital-service foundations;
- `material3`: cross-device and mobile interaction.

### Components and implementation primitives

- `radix`: accessible unstyled interaction primitives;
- `shadcn`: composable application components built from local source.

### Data, commerce, forms, and marketing

- `airtable`: tables, views, filters, and flexible data operations;
- `polaris`: commerce operations, resource lists, and feedback;
- `stripe`: forms, trust-sensitive flows, technical communication;
- `apple`: editorial product storytelling and low-density marketing rhythm.

## Bundled archetypes

- `saas-operational-dense`
- `crm-commercial`
- `document-portal`
- `executive-dashboard`
- `developer-tool`
- `technical-b2b-landing`
- `commerce-operations`
- `public-service`
- `analytics-platform`
- `content-management`
- `marketplace`
- `mobile-product`

## Selection rule

A reference may influence only its assigned layer. Accessibility and explicit project constraints override every reference. Scores express suitability, not permission to copy or a percentage of visual similarity.

Canonical entries live under `catalog/`. Run:

```bash
design-frontier catalog validate
design-frontier catalog list --layer forms
design-frontier catalog show stripe
```
