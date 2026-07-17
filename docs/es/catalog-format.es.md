<!-- [🇬🇧 English](../catalog-format.md) · 🇪🇸 Español -->
# Formato del catálogo

El catálogo es un mapa de decisiones revisado, no una galería de estilos.

## Entrada de referencia

```yaml
id: linear
name: Linear
kind: brand
status: reviewed
official_design_system: false
last_reviewed: 2026-07-16
summary: Restrained product UI with controlled density.
covers_layers:
  navigation: 0.90
  density: 0.85
recommended_for:
  - developer-tool
avoid_for:
  - public-service-form
boundaries:
  - Do not transfer marketing typography into operational screens.
implementation_notes:
  - Prefer existing repository components over visual imitation.
traits:
  visual_noise: low
evidence:
  - title: Linear product site
    url: https://linear.app/
    type: primary
```

Las puntuaciones indican la idoneidad de una capa de `0` a `1`. No representan propiedad, fidelidad ni permiso para copiar.

## Entrada de arquetipo

Un arquetipo declara las señales de producto, los valores por defecto, las referencias, los requisitos y las prohibiciones. Toda referencia por defecto debe dar soporte a la capa que tiene asignada.

## Reglas de compatibilidad

`catalog/compatibility.yml` informa de las combinaciones que necesitan rechazo o atención explícita.

## Lista de comprobación de revisión

- Al menos una fuente primaria.
- Valor de `official_design_system` correcto.
- Fecha de `last_reviewed` actual.
- Toda capa reclamada respaldada por material de origen observable.
- Los límites impiden el uso indebido entre capas.
- Sin capturas de pantalla, logotipos, archivos de fuentes ni código copiado.
- El lenguaje editorial no da a entender un respaldo.
