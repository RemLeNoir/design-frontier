# Conformance suite

The `conformance/` directory is the public interoperability contract.

## Fixtures

- `valid-project.yml`: a valid format 2 project;
- `legacy-v1.yml`: a migratable format 1 project;
- `invalid/reference-layer.yml`: syntactically valid input with an invalid scoped reference.

## Requirements for another implementation

A conforming implementation should:

1. parse the valid fixture;
2. reject or report the invalid layer assignment;
3. migrate the legacy fixture without losing declared fields;
4. preserve unknown optional metadata only when its policy says so;
5. emit semantic tokens with typed leaves;
6. maintain app and landing reference boundaries;
7. report unresolved decisions;
8. detect generated artifact divergence.

Run:

```bash
npm run conformance
```
