<!-- [🇬🇧 English](../migrations.md) · 🇪🇸 Español -->
# Migraciones

## Comandos

```bash
design-frontier migrate . --dry-run
design-frontier migrate .
design-frontier update .
```

`update` migra cuando es necesario y luego regenera.

## Comportamiento de las copias de seguridad

Antes de una migración en disco, Design Frontier copia los archivos canónicos existentes en:

```text
.design-frontier/backups/<ISO timestamp>/
```

La migración no elimina las copias de seguridad.

## Del formato 1 al formato 2

La migración añade:

- modo de tema;
- prioridad de dispositivo;
- locales;
- configuración de salida;
- configuración de plugins;
- objetivos de agente;
- sobrescrituras de referencia en forma de objeto.

Se conservan las sobrescrituras de referencia existentes de producto, stack, marca, densidad, accesibilidad y cadenas de texto.

## Política

Un cambio canónico incompatible debe incluir:

- una nueva versión de formato;
- pruebas de migración a nivel de objeto;
- una ruta de migración en disco;
- un paso de copia de seguridad;
- fixtures heredados públicos;
- notas de la versión.
