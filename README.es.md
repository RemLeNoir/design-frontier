<!-- [🇬🇧 English](README.md) · 🇪🇸 Español -->

# Design Frontier

**Un estándar de orquestación de diseño nativo del repositorio y una CLI para frontends construidos con agentes de IA.**

> **Licencia:** source-available (código disponible) bajo la [PolyForm Noncommercial License 1.0.0](./docs/es/LICENSE.es.md).
> Gratis para uso no comercial. **El uso comercial requiere una licencia aparte** — consulta
> [COMMERCIAL-LICENSE.es.md](./docs/es/COMMERCIAL-LICENSE.es.md). Esta no es una licencia open source OSI.

Design Frontier convierte el contexto de producto, la evidencia frontend existente, las referencias de diseño acotadas, las restricciones de marca y los requisitos de accesibilidad en un contrato de diseño específico del proyecto que los agentes pueden leer y las máquinas pueden validar.

No clona sitios web y no sustituye el trabajo de diseño por un selector de marca. Previene un fallo habitual en los productos construidos con agentes: que cada página nueva invente en silencio su propio espaciado, densidad, componentes, navegación y lenguaje visual.

## Qué hace

Design Frontier proporciona un único flujo de trabajo determinista:

```text
inspect repository
      +
collect unresolved product decisions
      +
compose references by layer
      ↓
versioned canonical data
      ↓
generated design contracts, tokens, agent adapters, and validation
```

El modelo de diseño se almacena bajo `.design-frontier/`. El Markdown legible por humanos, las exportaciones de tokens y las instrucciones para agentes se generan a partir de ese modelo.

## Instalación

```bash
npm install --save-dev design-frontier
npx design-frontier init .
```

Ejecútalo sin instalarlo de forma permanente:

```bash
npx design-frontier@latest init .
```

Requisitos: Node.js 20 o posterior.

## Flujo de trabajo principal

### 1. Inspecciona el repositorio

```bash
design-frontier inspect .
```

El inspector detecta frameworks comunes, sistemas de estilos, bibliotecas de componentes, herramientas de test, archivos de componentes, variables CSS y colores repetidos con frecuencia. No envía datos del repositorio a ningún servicio remoto.

### 2. Planifica sin escribir

```bash
design-frontier plan . --config project-input.yml
```

Esto resuelve:

- el arquetipo de interfaz;
- una referencia primaria y una secundaria opcional por capa;
- los límites de las referencias;
- requisitos y prohibiciones;
- conflictos de composición.

Usa `--json` para automatización.

### 3. Inicializa o genera

```bash
design-frontier init . --config project-input.yml
design-frontier generate .
```

Sin `--config`, `init` ejecuta una entrevista adaptativa de cuatro bloques. La evidencia del repositorio existente se recopila primero, de modo que la entrevista no pregunte por hechos que se pueden detectar de forma segura.

### 4. Valida la implementación y el estado generado

```bash
design-frontier validate . --strict
design-frontier lint .
design-frontier diff .
```

`validate` comprueba el modelo de diseño completo. `lint` escanea los archivos frontend en busca de colores y dimensiones en crudo fuera del conjunto canónico de tokens. `diff` detecta artefactos generados que se han editado fuera de Design Frontier.

## Comandos

```text
design-frontier init [directory] [--config file] [--force]
design-frontier plan [directory] [--config file] [--json]
design-frontier inspect [directory] [--json]
design-frontier generate [directory]
design-frontier update [directory]
design-frontier migrate [directory] [--dry-run]
design-frontier validate [directory] [--json] [--strict]
design-frontier lint [directory] [--json] [--strict]
design-frontier diff [directory] [--json]
design-frontier export <css|typescript|tailwind|all> [directory]
design-frontier doctor [directory] [--json]
design-frontier catalog list [--kind references|archetypes] [--layer layer]
design-frontier catalog show <id>
design-frontier catalog validate [--json]
design-frontier agent install <claude|codex|gemini|cursor|copilot|all> [directory]
```

También se incluye el binario más corto `df`.

## Formato canónico

```text
.design-frontier/
├── project.yml          Contexto de producto y configuración declarados
├── decisions.yml        Arquetipo, requisitos y límites resueltos
├── references.yml       Referencias asignadas a capas explícitas
├── unresolved.yml       Decisiones abiertas que deben permanecer visibles
├── tokens.json          Grafo de tokens semánticos generado
├── inspection.json      Última inspección del repositorio
├── manifest.json        Hashes SHA-256 de los artefactos generados
├── backups/             Copias de seguridad automáticas de migración
└── generated/
    ├── tokens.css
    ├── tokens.ts
    └── tailwind.preset.mjs
```

`project.yml` es el archivo de control editable. Los cambios de tokens duraderos van bajo `token_overrides` en ese archivo. `tokens.json` se regenera y se contrasta con la configuración.

## Contratos generados

Según las superficies seleccionadas, Design Frontier crea:

```text
DESIGN.md
APP-DESIGN.md
LANDING-DESIGN.md
DESIGN-CHECKLIST.md
DESIGN-SOURCES.md
docs/design-system.md
```

Los documentos generados contienen reglas concretas para:

- principios de diseño y personalidad visual;
- superficies semánticas y roles de color;
- tipografía y densidad;
- layout y navegación;
- tablas, formularios, visualización de datos y feedback;
- estados de los componentes;
- comportamiento responsive;
- accesibilidad;
- movimiento;
- patrones permitidos y prohibidos;
- límites de las fuentes.

## Referencias por capas

Las referencias no son temas de proyecto completos. A cada referencia solo se le permite influir en la capa donde se selecciona.

```yaml
reference_overrides:
  application_shell:
    primary: metronic
    weight: 0.75
  navigation:
    primary: linear
    weight: 0.75
  tables:
    primary: airtable
    secondary: carbon
    weight: 0.85
  forms:
    primary: stripe
    secondary: govuk
    weight: 0.75
  marketing_site:
    primary: apple
    secondary: stripe
    weight: 0.55
```

Esto permite combinaciones como un shell operativo inspirado en Metronic, una navegación contenida informada por Linear, operaciones de datos al estilo Airtable, claridad de errores al estilo GOV.UK y un ritmo de marketing influido por Apple, sin trasladar el espaciado de la landing a la aplicación.

Capas soportadas:

```text
brand                  typography             layout
application_shell      navigation             density
tables                 forms                  data_visualization
feedback               marketing_site         documentation
accessibility          motion                 mobile
```

La accesibilidad y las restricciones explícitas del proyecto tienen prioridad sobre las referencias estéticas.

## Catálogo

La versión 1.0 incluye 20 referencias revisadas y 12 arquetipos probados.

Las familias de referencias incluyen:

- estructura de aplicaciones y administrativa;
- operaciones densas de datos;
- sistemas de diseño empresariales;
- claridad de formularios y servicios;
- productos para desarrolladores y documentación;
- operaciones de comercio;
- interfaces de servicio público;
- interacción móvil;
- marketing y narrativa de producto.

El catálogo almacena puntuaciones de idoneidad, capas soportadas, contextos no adecuados, evidencia primaria, fechas de revisión, notas de implementación y límites. No contiene activos ni código fuente de terceros.

Explóralo con:

```bash
design-frontier catalog list
design-frontier catalog list --layer tables
design-frontier catalog show govuk
```

Consulta [DESIGN-CATALOG.md](./docs/DESIGN-CATALOG.md) y [docs/catalog-format.es.md](./docs/es/catalog-format.es.md).

## Tokens semánticos y temas

El motor de tokens emite objetos de token al estilo DTCG usando `$type`, `$value` y `$description`. Incluye:

- conjuntos de color semántico claro y oscuro;
- superficies de página, panel, elevadas y de overlay;
- roles de texto, bordes, acciones y estado;
- tamaños de control y layout sensibles a la densidad;
- escalas de espaciado, radio, borde, sombra, tipografía y movimiento;
- sobrescrituras profundas específicas del proyecto.

Ejemplo de sobrescritura:

```yaml
token_overrides:
  radius:
    control:
      $type: dimension
      $value: 6px
      $description: Product control radius
```

Hay exportadores disponibles para variables CSS, TypeScript y presets de Tailwind.

## Integraciones con agentes

Design Frontier instala adaptadores acotados al repositorio sin sustituir las instrucciones existentes.

```bash
design-frontier agent install all .
```

Puntos de integración generados:

```text
AGENTS.md
CLAUDE.md
GEMINI.md
.claude/skills/design-frontier/SKILL.md
.agents/skills/design-frontier/SKILL.md
.cursor/rules/design-frontier.mdc
.github/copilot-instructions.md
```

Los bloques gestionados se actualizan in situ. El contenido existente fuera de esos bloques se conserva.

Todos los adaptadores apuntan al mismo contrato canónico. No mantienen copias separadas del sistema de diseño.

## Proyectos existentes

Design Frontier está diseñado para entrar en un repositorio existente sin sustituir los componentes que funcionan.

```bash
design-frontier inspect . --json
design-frontier init . --config adoption.yml
design-frontier lint .
```

La evidencia del repositorio nutre el modelo inicial. El generador registra entonces límites como «el comportamiento de los componentes existentes prevalece sobre la inspiración puramente visual salvo que una migración sea explícita».

## Migraciones

El formato canónico se versiona de forma independiente del paquete npm. La versión 1.0 usa la versión de formato `2`.

```bash
design-frontier migrate . --dry-run
design-frontier migrate .
```

Una migración escribe una copia de seguridad con marca de tiempo bajo `.design-frontier/backups/` antes de cambiar los archivos canónicos. Consulta [docs/migrations.es.md](./docs/es/migrations.es.md).

## Plugins

Un plugin puede añadir:

- referencias;
- arquetipos;
- reglas de compatibilidad;
- exportadores;
- validadores.

```yaml
plugins:
  - ./design-frontier-plugin.mjs
  - '@company/design-frontier-catalog'
```

Los plugins son módulos JavaScript y se ejecutan con los mismos permisos locales que la CLI. Instala o configura solo plugins de confianza. Consulta [docs/plugin-api.es.md](./docs/es/plugin-api.es.md).

## Modelo de validación

La validación es entre archivos, no meramente sintáctica. Comprueba que:

- las entradas del catálogo y los arquetipos son internamente válidos;
- las referencias seleccionadas existen y soportan las capas que se les asignan;
- se respetan las reglas de compatibilidad;
- `decisions.yml` y `references.yml` coinciden con la composición actual;
- la salida de tokens coincide con `project.yml` y sus sobrescrituras;
- existen los documentos de superficie y los adaptadores de agente esperados;
- las decisiones sin resolver permanecen visibles;
- los artefactos generados coinciden con el manifiesto SHA-256;
- los validadores de plugins pasan.

Consulta [docs/validation-codes.es.md](./docs/es/validation-codes.es.md).

## API pública

El paquete exporta el motor central para su integración en otras herramientas:

```ts
import {
  loadCatalog,
  inspectRepository,
  composeProject,
  createTokens,
  generateProject,
  validateProject,
  lintDesignDrift
} from 'design-frontier';
```

El formato público está documentado en [docs/format-spec.es.md](./docs/es/format-spec.es.md). Los fixtures de conformidad viven bajo `conformance/`.

## Estructura del repositorio

```text
catalog/        Referencias revisadas, arquetipos, capas, compatibilidad
conformance/    Fixtures públicos válidos, inválidos y heredados
docs/           Formato, arquitectura, integraciones, gobernanza, seguridad
examples/       Entrada de proyecto, plugin, proyecto generado
schemas/        JSON Schemas públicos
skills/         Paquetes de skills para Claude y agentes abiertos
src/            CLI y motor público en TypeScript
.github/        CI, flujo de release, plantillas de issues
```

## Desarrollo

```bash
npm ci
npm run check
npm run smoke:pack
```

`npm run check` realiza comprobación de tipos, 18 tests automatizados, una build de producción y validación del catálogo. `npm run smoke:pack` instala el tarball empaquetado en un proyecto temporal limpio y ejecuta el binario publicado.

## Política del proyecto

- El catálogo es comparativo y editorial. No reclama respaldo de terceros.
- No se distribuyen logotipos, capturas de pantalla, archivos de fuentes, código fuente ni activos propietarios de terceros.
- Una referencia debe indicar en qué puede influir y en qué no debe influir.
- Los cambios que rompen el formato requieren una ruta de migración.
- La salida generada debe seguir siendo determinista, salvo las marcas de tiempo del manifiesto.
- Los plugins y las instrucciones para agentes se revisan como entradas ejecutables de la cadena de suministro.

Lee [CONTRIBUTING.es.md](./docs/es/CONTRIBUTING.es.md), [SECURITY.md](.github/SECURITY.md) y [docs/governance.es.md](./docs/es/governance.es.md).

## Licencia

Design Frontier es **source-available** (código disponible), no open source.

- **Uso no comercial:** gratis bajo la [PolyForm Noncommercial License 1.0.0](./docs/es/LICENSE.es.md) (traducción informativa al español: [LICENSE.es.md](./docs/es/LICENSE.es.md)).
- **Uso comercial:** requiere una licencia aparte — consulta [COMMERCIAL-LICENSE.es.md](./docs/es/COMMERCIAL-LICENSE.es.md).
- **Contribuciones:** regidas por el [CLA](.github/CLA.md) y el sign-off [DCO](.github/DCO.txt); consulta [CONTRIBUTING.es.md](./docs/es/CONTRIBUTING.es.md).
- **Nombre y logotipo:** protegidos por [TRADEMARK.es.md](./docs/es/TRADEMARK.es.md); la licencia de software no otorga derechos sobre las Marcas.

Los nombres de terceros se usan únicamente para identificar fuentes de referencia comparativas. Consulta [NOTICE.md](NOTICE.md).


## Auditoría de preparación para release

```bash
design-frontier audit .
design-frontier audit . --strict
```

La auditoría combina la validación canónica, la integridad de los archivos generados, la inspección del repositorio, la deriva de tokens y la preparación del harness visual. Escribe `DESIGN-AUDIT.md` y `.design-frontier/audit.json`. El análisis del código fuente no puede demostrar la calidad visual, así que una puerta completa también requiere Storybook o Playwright y una revisión renderizada de páginas representativas.

## Qué significa aquí «completo»

Design Frontier cierra el bucle de ingeniería repetible: descubrimiento, entrevista, composición, generación, instalación de agentes, exportaciones de implementación, validación, detección de deriva y auditoría de release. No afirma que ninguna herramienta estática pueda garantizar el buen gusto ni sustituir la revisión renderizada. La puerta de release hace explícita esa limitación en lugar de ocultarla.
