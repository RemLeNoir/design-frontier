<!-- [🇬🇧 English](../../.github/CONTRIBUTING.md) · 🇪🇸 Español -->

# Contribuir

Gracias por tu interés en Design Frontier. Lee esto antes de abrir un pull
request.

## Licencia de las contribuciones

Design Frontier es source-available y tiene licencia dual: gratuito para uso no
comercial bajo la [PolyForm Noncommercial License](LICENSE.es.md) y disponible
para uso comercial bajo una licencia aparte.

Al contribuir aceptas el [Acuerdo de Licencia de Contribuidor (CLA)](../../.github/CLA.md), que
permite al proyecto ofrecer tu contribución bajo ambas licencias. **Cada commit
debe firmarse (sign-off)** conforme al [Developer Certificate of Origin](../../.github/DCO.txt):

```bash
git commit -s -m "tu mensaje"
```

La línea de firma (`Signed-off-by: Nombre <email>`) certifica que tienes derecho
a aportar el trabajo. Los pull requests sin sign-off no pueden fusionarse.

## Preparación

```bash
npm ci
npm run check
npm run smoke:pack
```

Se requiere Node.js 20 o superior.

## Cambios de código

- Añade o actualiza tests para los cambios de comportamiento.
- Mantén TypeScript estricto activado.
- Conserva la salida determinista.
- Actualiza los esquemas públicos y la documentación con los cambios de formato.
- Añade fixtures de migración y de conformance para cambios canónicos que rompan
  compatibilidad.
- No escribas fuera de las rutas de repositorio documentadas.

## Cambios en el catálogo

Una contribución de referencia debe declarar:

- capas soportadas y puntuaciones de idoneidad;
- contextos recomendados y no recomendados;
- límites explícitos;
- al menos una fuente primaria;
- una fecha de revisión;
- si es un sistema de diseño oficial;
- sin capturas, logotipos, fuentes, código fuente ni activos de terceros
  empaquetados.

Una contribución de arquetipo debe incluir señales de producto, valores por
defecto, requisitos, prohibiciones y solo referencias que soporten sus capas
asignadas.

Ejecuta:

```bash
npm run catalog:validate
```

## Cambios en plugins

Los cambios en la API de plugins requieren tests con un módulo real cargado
dinámicamente. Las implicaciones de seguridad deben documentarse.

## Pull requests

Explica:

- qué cambió;
- por qué corresponde al núcleo o al catálogo;
- impacto en compatibilidad;
- impacto en migraciones;
- comprobaciones ejecutadas.

Se prefieren commits enfocados. Los cambios en `dist/` generado deben
corresponder a cambios en el código fuente.

## Documentación y traducciones

La documentación de autor es bilingüe (inglés + español). Cuando cambies un
documento en inglés, actualiza su archivo compañero `*.es.md` en el mismo pull
request, o indica que la traducción está pendiente. No traduzcas los fixtures
generados bajo `examples/` ni `conformance/`; deben coincidir con la salida
determinista de la herramienta.
