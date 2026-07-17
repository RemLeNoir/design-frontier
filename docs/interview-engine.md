# Interview engine

The interview runs after repository inspection and groups questions into four bounded blocks.

## Block 1: product

- project and product type;
- primary users and context;
- user goals;
- app, landing, or both.

## Block 2: interface

- dominant patterns;
- density;
- navigation where applicable;
- device priority;
- theme support.

## Block 3: brand and compliance

- accessibility target;
- locales;
- existing brand colors;
- prohibited visual or interaction patterns.

## Block 4: composition and integrations

- optional explicit archetype;
- reference overrides as `layer=id`;
- agent adapters;
- implementation outputs inferred from the detected stack.

## Evidence states

- observed: detected in the repository;
- declared: supplied by the project owner;
- inferred: produced by deterministic rules;
- unresolved: retained in `unresolved.yml`.

An agent conducting a richer interview should ask no more than five questions at once and should not ask for facts already established by repository evidence.
