<!-- [🇬🇧 English](../conformance.md) · 🇪🇸 Español -->
# Suite de conformidad

El directorio `conformance/` es el contrato público de interoperabilidad.

## Fixtures

- `valid-project.yml`: un proyecto válido en formato 2;
- `legacy-v1.yml`: un proyecto en formato 1 migrable;
- `invalid/reference-layer.yml`: entrada sintácticamente válida con una referencia con alcance inválido.

## Requisitos para otra implementación

Una implementación conforme debería:

1. parsear el fixture válido;
2. rechazar o informar de la asignación de capa inválida;
3. migrar el fixture heredado sin perder los campos declarados;
4. preservar los metadatos opcionales desconocidos solo cuando su política así lo indique;
5. emitir tokens semánticos con hojas tipadas;
6. mantener los límites de referencia de app y landing;
7. informar de las decisiones sin resolver;
8. detectar la divergencia de los artefactos generados.

Ejecuta:

```bash
npm run conformance
```
