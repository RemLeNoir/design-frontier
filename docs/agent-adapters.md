# Agent adapters

Design Frontier keeps one neutral contract and installs thin repository-scoped adapters.

## Neutral contract

`AGENTS.md` contains a managed block instructing agents to read the design files, use canonical tokens, preserve layer boundaries, and run validation.

## Claude Code

```text
CLAUDE.md
.claude/skills/design-frontier/SKILL.md
```

`CLAUDE.md` imports `AGENTS.md` and adds the managed Design Frontier block.

## Codex

```text
AGENTS.md
.agents/skills/design-frontier/SKILL.md
```

## Gemini CLI

```text
GEMINI.md
.agents/skills/design-frontier/SKILL.md
```

`GEMINI.md` imports `AGENTS.md`. The open skill is shared with environments that support the Agent Skills convention.

## Cursor

```text
.cursor/rules/design-frontier.mdc
```

The rule is always applied and points to the canonical contract.

## GitHub Copilot

```text
.github/copilot-instructions.md
```

The Design Frontier section is inserted as a managed block.

## Non-destructive updates

Managed sections use markers:

```html
<!-- design-frontier:<adapter>:start -->
...
<!-- design-frontier:<adapter>:end -->
```

Reinstallation updates only the managed section. Existing instructions remain intact.
