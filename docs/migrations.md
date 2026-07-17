# Migrations

## Commands

```bash
design-frontier migrate . --dry-run
design-frontier migrate .
design-frontier update .
```

`update` migrates when needed and then regenerates.

## Backup behavior

Before an on-disk migration, Design Frontier copies existing canonical files into:

```text
.design-frontier/backups/<ISO timestamp>/
```

The migration does not delete backups.

## Format 1 to format 2

The migration adds:

- theme mode;
- device priority;
- locales;
- output configuration;
- plugin configuration;
- agent targets;
- object-form reference overrides.

Existing product, stack, brand, density, accessibility, and string reference overrides are preserved.

## Policy

A breaking canonical change must include:

- a new format version;
- object-level migration tests;
- an on-disk migration path;
- a backup step;
- public legacy fixtures;
- release notes.
