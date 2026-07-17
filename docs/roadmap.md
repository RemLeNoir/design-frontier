# Roadmap after 1.0

Design Frontier 1.0 establishes the versioned format, catalog, composition engine, plugins, migrations, agent adapters, exporters, integrity checks, drift linting, and conformance suite.

## 1.1

- configurable source include/exclude rules for drift scans;
- richer token formats for Android and iOS;
- JSON output for every command;
- catalog provenance report generation;
- component inventory export.

## 1.2

- optional Storybook documentation adapter;
- optional Playwright visual-baseline plugin;
- pull-request annotations for validation and drift;
- catalog aliases and deprecation migrations.

## 2.0 research

- package-signed catalog snapshots;
- language-neutral canonical implementation specification;
- visual evidence adapters that remain copyright-safe;
- organization policy packs;
- bidirectional token synchronization with selected external tools.

The core will remain framework-neutral and offline-capable.
