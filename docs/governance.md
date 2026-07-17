# Governance

## Roles

- **Maintainers** approve releases, format changes, security fixes, and catalog policy.
- **Catalog reviewers** verify evidence, scopes, boundaries, and review dates.
- **Contributors** submit code, schemas, documentation, fixtures, and references.

One person may hold several roles while the project is small.

## Decision classes

### Routine changes

Bug fixes, documentation, new tests, and non-breaking catalog improvements use normal pull-request review.

### Catalog additions

A reference or archetype requires:

- schema validation;
- primary evidence;
- explicit supported layers;
- unsuitable contexts;
- boundaries;
- a current review date;
- no proprietary assets.

### Format changes

Format changes require a design proposal in an issue, migration impact, conformance fixtures, and maintainer approval. Breaking changes increment `format_version`.

### Security changes

Security fixes may be merged privately and released before full public discussion. See `SECURITY.md`.

## Deprecation

Catalog entries may be marked `deprecated` before removal. Removal from a stable format is avoided when existing projects depend on the ID. Aliases or migrations should be preferred.

Public API deprecations are documented for at least one minor release before removal in the next major package version.

## Release policy

- patch: compatible fixes and editorial corrections;
- minor: compatible features, optional fields, new catalog entries;
- major: public API breaks or policy changes that cannot remain compatible;
- canonical format changes follow their own `format_version` sequence.

## Trademark neutrality

Third-party names identify comparative sources. Catalog inclusion does not imply endorsement, partnership, or official status.
