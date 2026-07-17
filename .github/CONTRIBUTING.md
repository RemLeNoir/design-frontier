<!-- 🇬🇧 English · [🇪🇸 Español](../docs/es/CONTRIBUTING.es.md) -->

# Contributing

Thanks for your interest in Design Frontier. Please read this before opening a
pull request.

## Licensing of contributions

Design Frontier is source-available and dual-licensed: free for noncommercial
use under the [PolyForm Noncommercial License](../LICENSE), and available for
commercial use under a separate license.

By contributing you agree to the [Contributor License Agreement](CLA.md), which
lets the project offer your contribution under both licenses. **Every commit must
be signed off** under the [Developer Certificate of Origin](DCO.txt):

```bash
git commit -s -m "your message"
```

The sign-off line (`Signed-off-by: Name <email>`) certifies you have the right to
contribute the work. Pull requests without sign-off cannot be merged.

## Setup

```bash
npm ci
npm run check
npm run smoke:pack
```

Node.js 20 or later is required.

## Code changes

- Add or update tests for behavior changes.
- Keep strict TypeScript enabled.
- Preserve deterministic output.
- Update public schemas and documentation with format changes.
- Add migration and conformance fixtures for canonical breaking changes.
- Do not write outside documented repository paths.

## Catalog changes

A reference contribution must declare:

- supported layers and suitability scores;
- recommended and unsuitable contexts;
- explicit boundaries;
- at least one primary source;
- a review date;
- whether it is an official design system;
- no third-party screenshots, logos, fonts, source code, or bundled assets.

An archetype contribution must include product signals, defaults, requirements,
prohibitions, and only references that support their assigned layers.

Run:

```bash
npm run catalog:validate
```

## Plugin changes

Plugin API changes require tests using a real dynamically loaded module. Security
implications must be documented.

## Pull requests

Explain:

- what changed;
- why it belongs in the core or catalog;
- compatibility impact;
- migration impact;
- checks run.

Focused commits are preferred. Generated `dist/` changes should correspond to
source changes.

## Documentation and translations

Authored documentation is bilingual (English + Spanish). When you change an
English document, update its `*.es.md` companion in the same pull request, or
note that a translation is pending. Do not translate generated fixtures under
`examples/` or `conformance/`; those must match the tool's deterministic output.
