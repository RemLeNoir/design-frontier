<!-- [🇬🇧 English](../product-spec.md) · 🇪🇸 Español -->
# Especificación de producto de Design Frontier

## Definición

Design Frontier es un sistema de orquestación de diseño abierto y nativo del repositorio para equipos que construyen frontends con agentes de codificación. Convierte el contexto de producto y las referencias delimitadas en un contrato estructurado que puede regenerarse, validarse, migrarse y consumirse en distintos entornos de agente.

## Problema

Las interfaces construidas por agentes suelen optimizar una petición cada vez. El resultado puede contener código válido y pantallas aisladas aceptables, mientras que el producto acumula componentes duplicados, densidad inconsistente, tokens locales de página, filtraciones de referencia y patrones de aplicación y landing incompatibles.

Los prompts grandes no resuelven la persistencia. Una instrucción específica de una sesión no es un sistema de diseño duradero.

## Promesa de producto

Un proyecto puede ejecutar un solo comando y obtener:

- evidencia del repositorio;
- un arquetipo de interfaz declarado o inferido;
- referencias asignadas por capa;
- tokens semánticos con conciencia de tema;
- reglas separadas de aplicación y landing;
- instrucciones de adaptador para los principales agentes de codificación;
- un informe de validación y deriva;
- memoria de diseño versionada almacenada junto al código.

## Usuarios principales

- consultorías que inician múltiples productos de cliente;
- ingenieros de producto y de diseño;
- equipos SaaS que usan agentes de codificación;
- organizaciones que mantienen una política interna de frontend;
- especialistas no dedicados al diseño que necesitan un proceso de decisión acotado.

## Flujos de trabajo principales

### Proyecto nuevo

Inspeccionar, entrevistar o cargar configuración, componer, generar, instalar adaptadores, validar.

### Proyecto existente

Inspeccionar la evidencia actual, preservar el comportamiento en funcionamiento, añadir límites explícitos, generar un contrato y luego informar de la deriva en lugar de reemplazar la interfaz a ciegas.

### Contribución al catálogo

Añadir datos delimitados respaldados por evidencia, validar, documentar los límites y enviar la justificación editorial.

### Extensión de la organización

Cargar un plugin de confianza que contenga referencias, arquetipos, exportaciones o validadores de política privados.

## Alcance funcional en 1.0

- CLI interactiva y no interactiva;
- inspección de repositorio neutral respecto al framework;
- modelo de composición de 15 capas;
- 20 referencias y 12 arquetipos;
- reglas de compatibilidad y precedencia explícita;
- tokens semánticos estilo DTCG con temas claro/oscuro;
- sobrescrituras profundas de tokens;
- exportadores de CSS, TypeScript y Tailwind;
- contratos Markdown para superficies de aplicación y landing;
- adaptadores de Claude, Codex, Gemini, Cursor y Copilot;
- migración de formato con copias de seguridad;
- API de plugins;
- validación entre archivos;
- comprobación de integridad del manifiesto;
- linting de deriva de tokens a nivel de código;
- esquemas públicos y fixtures de conformidad.

## No objetivos

- clonación píxel a píxel;
- redistribución de activos de terceros;
- aprobación automática de diseño basada en similitud visual;
- sustitución del descubrimiento de producto o de la revisión de diseño profesional;
- exigir un framework, biblioteca de componentes o servicio alojado concretos.

## Requisitos no funcionales

- Node.js 20 o posterior;
- operación del núcleo local-first;
- contenido generado determinista;
- sin dependencia de red para la ejecución normal;
- ruta de migración para cambios canónicos incompatibles;
- paquete apto para instalación con npm;
- instrucciones de agente en texto plano revisadas;
- sin ubicaciones de escritura ocultas.

## Criterios de publicación de 1.0

- [x] esquema canónico versionado y estable;
- [x] comando de migración con copias de seguridad;
- [x] interfaz de plugins para catálogos, exportadores y validadores;
- [x] fixtures de conformidad públicos;
- [x] adaptadores mantenidos para cinco entornos de agente;
- [x] detección de deriva de tokens a nivel de código;
- [x] política de gobernanza y deprecación documentada;
- [x] al menos 20 referencias revisadas y 10 arquetipos probados;
- [x] prueba de humo de instalación limpia del paquete;
- [x] manifiesto de integridad de artefactos generados.
