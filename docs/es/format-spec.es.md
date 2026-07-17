<!-- [🇬🇧 English](../format-spec.md) · 🇪🇸 Español -->
# Especificación del formato canónico

## Versionado

El formato canónico usa `format_version`. Design Frontier 1.0 lee el formato `2` y migra el formato `1`.

La versión del paquete y la versión del formato son independientes. Una publicación de paquete puede cambiar sin cambiar el formato canónico.

## `project.yml`

Campos requeridos:

```yaml
format_version: 2
name: Product name
product_type: b2b-saas
surfaces: app-and-landing
dominant_patterns: [tables, forms]
density: medium-high
accessibility: wcag-aa
theme: both
device_priority: desktop
locales: [en]
```

Grupos opcionales:

- usuarios y objetivos;
- arquetipo explícito;
- modelo de navegación;
- stack detectado o declarado;
- valores de marca;
- requisitos, prohibiciones y restricciones regulatorias;
- sobrescrituras de referencia por capa;
- controles de salida;
- sobrescrituras de token;
- especificadores de plugins;
- destinos de agentes.

El JSON Schema público es `schemas/project.schema.json`.

## `decisions.yml`

Una representación generada del arquetipo elegido y las reglas acumuladas:

```yaml
format_version: 2
archetype: saas-operational-dense
requirements: []
prohibitions: []
boundaries: []
```

Las ediciones manuales se rechazan cuando dejan de coincidir con la composición.

## `references.yml`

```yaml
format_version: 2
references:
  tables:
    primary: airtable
    secondary: carbon
    weight: 0.85
    source: override
```

`source` es `archetype` u `override`. El peso está entre `0` y `1`. Resuelve la precedencia dentro de una capa; no es un porcentaje de copia visual.

## `unresolved.yml`

```yaml
format_version: 2
decisions:
  - id: mobile-table-strategy
    question: Should dense tables stack, scroll, or switch to cards on narrow screens?
    status: open
```

Los valores de estado son `open`, `accepted` y `rejected`. La generación preserva este archivo.

## `tokens.json`

Las hojas de token usan:

```json
{
  "$type": "dimension",
  "$value": "8px",
  "$description": "Inputs and buttons"
}
```

El archivo incluye los tokens semánticos por defecto más `themes.light` y `themes.dark`. Los valores personalizados se declaran en `project.yml.token_overrides` y se fusionan en profundidad.

## `manifest.json`

El manifiesto registra hashes SHA-256 de los documentos generados y los exports. Habilita `design-frontier diff` y protege contra la divergencia silenciosa.

## Promesa de compatibilidad

Dentro de la versión de formato 2:

- no se eliminan campos;
- no se redefinen los valores de enum;
- pueden añadirse nuevos campos opcionales;
- la prosa generada puede mejorar sin cambiar el significado canónico;
- pueden introducirse nuevas advertencias de validación;
- los nuevos errores requieren o bien datos existentes inválidos o bien una razón documentada de seguridad/integridad.
