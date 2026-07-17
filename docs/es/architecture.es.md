<!-- [🇬🇧 English](../architecture.md) · 🇪🇸 Español -->
# Arquitectura

## Límite de diseño

Design Frontier separa la evidencia, la intención declarada, la composición determinista, las proyecciones generadas y las comprobaciones de implementación.

```text
repository evidence ─┐
                     ├─> project.yml ─> composition engine
interview/config ────┘                     │
                                           ├─> decisions.yml
catalog + plugins ─────────────────────────┤
                                           ├─> references.yml
                                           └─> token engine
                                                   │
                                                   ├─> tokens.json
                                                   ├─> Markdown contracts
                                                   ├─> implementation exports
                                                   ├─> agent adapters
                                                   └─> manifest.json
```

El agente puede ayudar a responder preguntas, pero el agente no forma parte de la generación determinista.

## Módulos

| Módulo | Responsabilidad |
|---|---|
| `inspect.ts` | Detectar el stack de frontend, componentes, archivos de estilo, variables CSS y colores repetidos |
| `interview.ts` | Recopilar las decisiones de producto pendientes en bloques acotados |
| `schemas.ts` | Validar los datos versionados de proyecto y catálogo |
| `catalog.ts` | Cargar las referencias integradas y de plugins, los arquetipos y las reglas de compatibilidad |
| `compose.ts` | Inferir un arquetipo, aplicar sobrescrituras, imponer alcances y resolver conflictos |
| `tokens.ts` | Producir tokens semánticos con conciencia de tema y aplicar sobrescrituras profundas |
| `templates.ts` | Generar contratos legibles por humanos y por agentes |
| `exporters.ts` | Producir archivos de implementación en CSS, TypeScript y Tailwind |
| `agent.ts` | Instalar adaptadores de agentes y skills de forma no destructiva |
| `manifest.ts` | Calcular hashes de los artefactos generados y detectar divergencias manuales |
| `drift.ts` | Escanear el código fuente de frontend en busca de colores y dimensiones no registrados |
| `migrate.ts` | Actualizar los formatos canónicos con copias de seguridad |
| `plugins.ts` | Cargar módulos de extensión de confianza locales o de npm |
| `validate.ts` | Comprobar la consistencia entre archivos, las reglas del catálogo, los artefactos y los plugins |

## Modelo de fuente de la verdad

`project.yml` es la configuración raíz editable. `decisions.yml`, `references.yml` y `tokens.json` son proyecciones canónicas deterministas que se usan para transparencia y validación. Los valores de token personalizados persistentes se representan en `project.yml` bajo `token_overrides`.

El Markdown generado y los exports de implementación no se editan como fuentes ocultas. El manifiesto informa cuando divergen.

## Determinismo

Para una misma entrada de proyecto, contenido de catálogo, versiones de plugins y versión de paquete, el contenido de los archivos generados es determinista. `manifest.json.generated_at` depende intencionadamente del tiempo.

## Límite de extensión

Los plugins pueden añadir datos y comportamiento, pero no pueden reemplazar silenciosamente la validación integrada. Los ID de referencia y arquetipo duplicados se rechazan. Los errores de plugin se convierten en errores de validación en lugar de ser ignorados.

## Comportamiento sin conexión

La generación, composición, migración, validación, linting y navegación del catálogo no requieren red. Las URL de origen del catálogo son metadatos y no se descargan durante la ejecución normal de la CLI.
