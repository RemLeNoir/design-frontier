<!-- [🇬🇧 English](../DESIGN-INTERVIEW.md) · 🇪🇸 Español -->
# Protocolo de entrevista de Design Frontier

La entrevista convierte decisiones de producto desconocidas en `project.yml`. La inspección del repositorio ocurre primero.

## Reglas

1. No pidas evidencia que ya se ha encontrado de forma segura en el repositorio.
2. No hagas más de cinco preguntas en un mismo bloque.
3. Pregunta en qué debe influir una referencia, no meramente qué sitio web le gusta a alguien.
4. Mantén separadas las decisiones de aplicación y las de marketing.
5. Expón las contradicciones en lugar de resolverlas en silencio.
6. No inventes activos de marca, requisitos normativos, usuarios ni flujos de trabajo.
7. Traslada los valores duraderos a configuración estructurada.
8. Mantén las decisiones genuinamente abiertas en `unresolved.yml`.

## Bloques actuales

### Producto

Nombre del proyecto, tipo de producto, usuarios, objetivos y superficies.

### Interfaz

Patrones dominantes, densidad, navegación, prioridad de dispositivo y tema.

### Marca y cumplimiento

Objetivo de accesibilidad, locales, colores de marca y patrones prohibidos.

### Composición e integraciones

Arquetipo opcional, sobrescrituras de referencia por capa, destinos de agente y salidas de implementación.

## Patrón de pregunta sobre referencias

Evita:

> ¿A qué sitio web debería parecerse esto?

Usa:

> ¿Qué fuente debería informar el comportamiento de la tabla y qué partes son relevantes: densidad, filtrado, selección, acciones masivas, jerarquía o solo el tratamiento visual?

## Etiquetas de evidencia

- observado;
- declarado;
- inferido;
- sin resolver.

Los agentes pueden llevar a cabo una entrevista más rica, pero deben terminar creando una entrada estructurada válida y ejecutando `design-frontier plan` antes de la generación.
