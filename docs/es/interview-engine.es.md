<!-- [🇬🇧 English](../interview-engine.md) · 🇪🇸 Español -->
# Motor de entrevista

La entrevista se ejecuta después de la inspección del repositorio y agrupa las preguntas en cuatro bloques acotados.

## Bloque 1: producto

- tipo de proyecto y de producto;
- usuarios principales y contexto;
- objetivos del usuario;
- app, landing o ambos.

## Bloque 2: interfaz

- patrones dominantes;
- densidad;
- navegación cuando proceda;
- prioridad de dispositivo;
- soporte de tema.

## Bloque 3: marca y cumplimiento

- objetivo de accesibilidad;
- locales;
- colores de marca existentes;
- patrones visuales o de interacción prohibidos.

## Bloque 4: composición e integraciones

- arquetipo explícito opcional;
- sobrescrituras de referencia como `layer=id`;
- adaptadores de agentes;
- salidas de implementación inferidas a partir del stack detectado.

## Estados de evidencia

- observed: detectado en el repositorio;
- declared: aportado por el propietario del proyecto;
- inferred: producido por reglas deterministas;
- unresolved: retenido en `unresolved.yml`.

Un agente que realice una entrevista más rica no debería hacer más de cinco preguntas a la vez ni pedir hechos ya establecidos por la evidencia del repositorio.
