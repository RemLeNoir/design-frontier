<!-- [🇬🇧 English](../agent-adapters.md) · 🇪🇸 Español -->
# Adaptadores de agentes

Design Frontier mantiene un único contrato neutral e instala adaptadores finos con alcance de repositorio.

## Contrato neutral

`AGENTS.md` contiene un bloque gestionado que instruye a los agentes a leer los archivos de diseño, usar tokens canónicos, preservar los límites entre capas y ejecutar la validación.

## Claude Code

```text
CLAUDE.md
.claude/skills/design-frontier/SKILL.md
```

`CLAUDE.md` importa `AGENTS.md` y añade el bloque gestionado de Design Frontier.

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

`GEMINI.md` importa `AGENTS.md`. La skill abierta se comparte con entornos que admiten la convención Agent Skills.

## Cursor

```text
.cursor/rules/design-frontier.mdc
```

La regla se aplica siempre y apunta al contrato canónico.

## GitHub Copilot

```text
.github/copilot-instructions.md
```

La sección de Design Frontier se inserta como un bloque gestionado.

## Actualizaciones no destructivas

Las secciones gestionadas usan marcadores:

```html
<!-- design-frontier:<adapter>:start -->
...
<!-- design-frontier:<adapter>:end -->
```

La reinstalación actualiza únicamente la sección gestionada. Las instrucciones existentes permanecen intactas.
