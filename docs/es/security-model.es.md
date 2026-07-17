<!-- [🇬🇧 English](../security-model.md) · 🇪🇸 Español -->
# Modelo de seguridad

## Operación local-first

Los comandos del núcleo leen y escriben archivos locales del repositorio. La generación y validación normales no suben código, prompts, tokens ni información de producto.

## Plugins

Los plugins son ejecutables y constituyen el mayor riesgo de extensión. Pueden acceder a archivos, variables de entorno y a la red con los permisos del proceso actual. Usa plugins de confianza y con versión fijada, y revisa las actualizaciones.

## Skills e instrucciones de agente

Los archivos de skill y las instrucciones del repositorio pueden influir en las acciones del agente. Son texto plano confirmado en el repositorio, de modo que los equipos pueden inspeccionarlos. Design Frontier no incrusta cargas ejecutables ocultas en las skills que incluye.

## Rutas generadas

Los exportadores integrados escriben únicamente dentro de `.design-frontier/generated/`. Los adaptadores de agente escriben en ubicaciones de instrucciones del repositorio documentadas. Los exportadores de plugins eligen sus propias rutas y deben revisarse.

## Cadena de suministro

Controles recomendados:

- confirmar el lockfile;
- usar `npm ci` en CI;
- revisar la procedencia del paquete de plugin;
- fijar las versiones de los plugins;
- ejecutar `npm audit` según la política de la organización;
- proteger los flujos de trabajo de publicación y los tokens de npm;
- usar `design-frontier diff` para detectar cambios manuales en archivos generados.

## Contenido del catálogo

Los archivos de catálogo contienen descripciones y URLs, no código ejecutable ni activos de terceros.
