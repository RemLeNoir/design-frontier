<!-- [🇬🇧 English](../DESIGN-GENERATOR.md) · 🇪🇸 Español -->
# Contrato del generador de Design Frontier

## Entradas

- configuración de proyecto en formato 2 validada;
- evidencia de inspección del repositorio;
- datos de catálogo integrados y de plugins;
- composición determinista;
- configuración de tokens semánticos;
- exportadores y validadores de plugins de confianza.

## Salidas canónicas

```text
.design-frontier/project.yml
.design-frontier/decisions.yml
.design-frontier/references.yml
.design-frontier/unresolved.yml
.design-frontier/tokens.json
.design-frontier/inspection.json
.design-frontier/manifest.json
```

## Proyecciones para personas y agentes

```text
DESIGN.md
APP-DESIGN.md
LANDING-DESIGN.md
DESIGN-CHECKLIST.md
DESIGN-SOURCES.md
docs/design-system.md
```

## Proyecciones de implementación

```text
.design-frontier/generated/tokens.css
.design-frontier/generated/tokens.ts
.design-frontier/generated/tailwind.preset.mjs
```

## Garantías

- Las referencias solo afectan a las capas asignadas.
- La composición de aplicación y la de landing permanecen separadas.
- La accesibilidad y las restricciones explícitas sobrescriben las fuentes estéticas.
- Los cambios de token persistentes se representan en `project.yml.token_overrides`.
- `unresolved.yml` sobrevive a la regeneración.
- Las instrucciones de agente existentes fuera de los bloques gestionados sobreviven a las actualizaciones del adaptador.
- Los artefactos generados se hashean para comprobaciones de integridad.
- Nunca se copian activos de terceros, código fuente ni composiciones exactas.
- Los adjetivos vagos se convierten en reglas observables o se dejan sin resolver.

## Reglas generadas no válidas

El generador no debe apoyarse en frases como «moderno», «limpio», «premium» o «intuitivo» sin consecuencias medibles. Las reglas válidas nombran tokens, límites, estados, jerarquía, densidad, interacción o comportamiento responsive.
