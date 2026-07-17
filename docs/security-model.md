# Security model

## Local-first operation

Core commands read and write local repository files. Normal generation and validation do not upload code, prompts, tokens, or product information.

## Plugins

Plugins are executable and are the largest extension risk. They may access files, environment variables, and the network under the current process permissions. Use trusted, pinned plugins and review updates.

## Agent skills and instructions

Skill files and repository instructions can influence agent actions. They are plain text committed to the repository so teams can inspect them. Design Frontier does not embed hidden executable payloads in its bundled skills.

## Generated paths

Built-in exporters write only inside `.design-frontier/generated/`. Agent adapters write to documented repository instruction locations. Plugin exporters choose their own paths and must be reviewed.

## Supply chain

Recommended controls:

- commit the lockfile;
- use `npm ci` in CI;
- review plugin package provenance;
- pin plugin versions;
- run `npm audit` according to organization policy;
- protect release workflows and npm tokens;
- use `design-frontier diff` to detect manual generated-file changes.

## Catalog content

Catalog files contain descriptions and URLs, not executable code or third-party assets.
