<!-- [🇬🇧 English](../validation-codes.md) · 🇪🇸 Español -->
# Códigos de validación

Los códigos son identificadores estables para la automatización. Los mensajes pueden mejorar entre versiones compatibles.

## Archivos de proyecto y canónicos

| Código | Significado |
|---|---|
| `DES001` | Falta la configuración del proyecto |
| `DES002` | Configuración del proyecto no válida |
| `DES003` | Falta la composición de referencias |
| `DES004` | Faltan los tokens |
| `DES005` | El formato heredado requiere migración |
| `DES006` | Faltan las decisiones |
| `DES007` | Falta el archivo de decisiones sin resolver |
| `DES012` | Archivo de referencia no válido |
| `DES013` | Referencia desconocida |
| `DES014` | Referencia asignada a una capa no soportada |
| `DES017` | Las referencias generadas no coinciden con la composición del proyecto |
| `DES032` | JSON de token no válido |
| `DES033` | Falta un grupo de tokens semánticos requerido |
| `DES034` | La hoja de token carece de `$type` |
| `DES035` | El archivo de tokens difiere de la generación configurada |
| `DES042` | Falta un artefacto generado o adaptador requerido |
| `DES065` | Falta el logo configurado |
| `DES071` | Arquetipo desconocido |
| `DES072` | Archivo de decisiones no válido |
| `DES073` | Las decisiones difieren de la composición |
| `DES074` | Quedan decisiones abiertas sin resolver |
| `DES075` | Archivo de decisiones sin resolver no válido |

## Integridad y extensiones

| Código | Significado |
|---|---|
| `DES082` | Falta el archivo de manifiesto |
| `DES083` | El hash del artefacto generado ha cambiado |
| `DES084` | Manifiesto no válido |
| `DES085` | Los artefactos fueron generados por otra versión del paquete |
| `DES090` | Fallo al cargar el plugin o el catálogo |
| `DES091` | Fallo en el validador del plugin |
| `DES101` | Color en crudo fuera de los tokens canónicos |
| `DES102` | Dimensión literal fuera de los tokens canónicos |

## Catálogo

`CAT001` a `CAT011` cubren el tamaño mínimo estable, la evidencia, la actualidad, los IDs desconocidos, las asignaciones de arquetipo no soportadas y los datos de compatibilidad.

Los validadores de plugins deberían usar su propio prefijo en mayúsculas.
