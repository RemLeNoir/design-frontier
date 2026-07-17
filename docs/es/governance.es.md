<!-- [🇬🇧 English](../governance.md) · 🇪🇸 Español -->
# Gobernanza

## Roles

- **Mantenedores** aprueban las publicaciones, los cambios de formato, las correcciones de seguridad y la política de catálogo.
- **Revisores de catálogo** verifican la evidencia, los alcances, los límites y las fechas de revisión.
- **Colaboradores** envían código, esquemas, documentación, fixtures y referencias.

Una misma persona puede desempeñar varios roles mientras el proyecto sea pequeño.

## Clases de decisión

### Cambios rutinarios

Las correcciones de errores, la documentación, las pruebas nuevas y las mejoras de catálogo no disruptivas usan la revisión normal de pull request.

### Adiciones al catálogo

Una referencia o arquetipo requiere:

- validación de esquema;
- evidencia primaria;
- capas soportadas explícitas;
- contextos no adecuados;
- límites;
- una fecha de revisión actual;
- ningún activo propietario.

### Cambios de formato

Los cambios de formato requieren una propuesta de diseño en una issue, el impacto de migración, fixtures de conformidad y la aprobación de un mantenedor. Los cambios disruptivos incrementan `format_version`.

### Cambios de seguridad

Las correcciones de seguridad pueden fusionarse de forma privada y publicarse antes de una discusión pública completa. Consulta `SECURITY.md`.

## Deprecación

Las entradas del catálogo pueden marcarse como `deprecated` antes de su eliminación. Se evita la eliminación de un formato estable cuando hay proyectos existentes que dependen del ID. Deben preferirse los alias o las migraciones.

Las deprecaciones de la API pública se documentan durante al menos una publicación menor antes de su eliminación en la siguiente versión mayor del paquete.

## Política de publicación

- patch: correcciones compatibles y correcciones editoriales;
- minor: funcionalidades compatibles, campos opcionales, nuevas entradas de catálogo;
- major: rupturas de la API pública o cambios de política que no pueden mantenerse compatibles;
- los cambios del formato canónico siguen su propia secuencia de `format_version`.

## Neutralidad de marcas

Los nombres de terceros identifican fuentes comparativas. La inclusión en el catálogo no implica respaldo, asociación ni estatus oficial.
