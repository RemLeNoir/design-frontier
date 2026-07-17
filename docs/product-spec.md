# Design Frontier product specification

## Definition

Design Frontier is an open, repository-native design orchestration system for teams building frontends with coding agents. It converts product context and scoped references into a structured contract that can be regenerated, validated, migrated, and consumed across agent environments.

## Problem

Agent-built interfaces often optimize one request at a time. The result can contain valid code and acceptable isolated screens while the product accumulates duplicate components, inconsistent density, page-local tokens, reference leakage, and incompatible app and landing patterns.

Large prompts do not solve persistence. A session-specific instruction is not a durable design system.

## Product promise

A project can run one command and obtain:

- repository evidence;
- a declared or inferred interface archetype;
- references assigned by layer;
- semantic theme-aware tokens;
- separate application and landing rules;
- adapter instructions for major coding agents;
- a validation and drift report;
- versioned design memory stored with the code.

## Primary users

- consultancies starting multiple client products;
- product and design engineers;
- SaaS teams using coding agents;
- organizations maintaining internal frontend policy;
- non-design specialists who need a bounded decision process.

## Core workflows

### New project

Inspect, interview or load configuration, compose, generate, install adapters, validate.

### Existing project

Inspect current evidence, preserve working behavior, add explicit boundaries, generate a contract, then report drift rather than replacing the UI blindly.

### Catalog contribution

Add evidence-backed scoped data, validate, document boundaries, and submit editorial rationale.

### Organization extension

Load a trusted plugin containing private references, archetypes, exports, or policy validators.

## Functional scope in 1.0

- interactive and non-interactive CLI;
- framework-neutral repository inspection;
- 15-layer composition model;
- 20 references and 12 archetypes;
- compatibility rules and explicit precedence;
- DTCG-style semantic tokens with light/dark themes;
- deep token overrides;
- CSS, TypeScript, and Tailwind exporters;
- Markdown contracts for app and landing surfaces;
- Claude, Codex, Gemini, Cursor, and Copilot adapters;
- format migration with backups;
- plugin API;
- cross-file validation;
- manifest integrity checking;
- code-level token drift linting;
- public schemas and conformance fixtures.

## Non-goals

- pixel-perfect cloning;
- redistribution of third-party assets;
- automatic design approval based on visual similarity;
- replacing product discovery or professional design review;
- requiring a particular framework, component library, or hosted service.

## Non-functional requirements

- Node.js 20 or later;
- local-first core operation;
- deterministic generated content;
- no network dependency for normal execution;
- migration path for canonical breaking changes;
- package suitable for npm installation;
- reviewed plain-text agent instructions;
- no hidden write locations.

## 1.0 release criteria

- [x] stable versioned canonical schema;
- [x] migration command with backups;
- [x] plugin interface for catalogs, exporters, and validators;
- [x] public conformance fixtures;
- [x] maintained adapters for five agent environments;
- [x] code-level token drift detection;
- [x] documented governance and deprecation policy;
- [x] at least 20 reviewed references and 10 tested archetypes;
- [x] clean package installation smoke test;
- [x] generated-artifact integrity manifest.
