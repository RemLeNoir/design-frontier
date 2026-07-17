<!-- [🇬🇧 English](../DESIGN-CATALOG.md) · 🇪🇸 Español -->
# Catálogo de Design Frontier

Design Frontier compone frontends a partir de referencias acotadas y arquetipos de producto. El catálogo es configuración ejecutable, validada por la CLI.

## Capas

| Capa | Qué controla |
|---|---|
| `brand` | Identidad compartida y roles semánticos de marca |
| `typography` | Familias tipográficas, jerarquía, comportamiento de lectura |
| `layout` | Rejilla, anchos, ritmo de página, contención |
| `application_shell` | Marco persistente, barra lateral, cabecera, área de trabajo |
| `navigation` | Orientación, jerarquía, pestañas, cambio de espacio de trabajo |
| `density` | Tamaño de controles, compresión de información, ruido visual |
| `tables` | Comparación, ordenación, filtrado, selección, acciones masivas |
| `forms` | Entrada, validación, progreso, flujos sensibles a la confianza |
| `data_visualization` | Métricas, gráficas, composición analítica |
| `feedback` | Estados de carga, vacío, éxito, aviso, fallo y sin conexión |
| `marketing_site` | Narrativa pública, prueba, presentación de producto, conversión |
| `documentation` | Lectura técnica, ejemplos, código y contenido de referencia |
| `accessibility` | Interacción inclusiva y claridad del servicio |
| `motion` | Duración, aceleración, propósito de las transiciones |
| `mobile` | Estrategia de viewport estrecho e interacción táctil |

## Referencias incluidas

### Estructura e interfaz de producto

- `metronic`: shells administrativos modulares y estructura de backoffice multiárea;
- `linear`: navegación de flujo de trabajo contenida y bajo ruido visual;
- `atlassian`: patrones de producto colaborativo y navegación estructurada;
- `primer`: patrones de aplicación orientados a personas desarrolladoras y flujos de repositorio;
- `ant-design`: entrada de datos empresarial y amplia cobertura de componentes densos;
- `elastic-eui`: búsqueda operativa, observabilidad y controles con gran densidad de datos.

### Sistemas empresariales y públicos

- `carbon`: componentes empresariales y visualización de datos;
- `fluent2`: aplicaciones de productividad y patrones adaptativos estilo Microsoft;
- `fiori`: aplicaciones de procesos empresariales;
- `lightning`: flujos de CRM centrados en registros;
- `spectrum`: comportamiento de herramientas creativas/profesionales;
- `govuk`: formularios de servicio público, gestión de errores y claridad de contenido;
- `uswds`: cimientos accesibles de servicios digitales públicos;
- `material3`: interacción multidispositivo y móvil.

### Componentes y primitivas de implementación

- `radix`: primitivas de interacción accesibles y sin estilos;
- `shadcn`: componentes de aplicación componibles construidos a partir de código local.

### Datos, comercio, formularios y marketing

- `airtable`: tablas, vistas, filtros y operaciones de datos flexibles;
- `polaris`: operaciones de comercio, listas de recursos y feedback;
- `stripe`: formularios, flujos sensibles a la confianza, comunicación técnica;
- `apple`: narrativa editorial de producto y ritmo de marketing de baja densidad.

## Arquetipos incluidos

- `saas-operational-dense`
- `crm-commercial`
- `document-portal`
- `executive-dashboard`
- `developer-tool`
- `technical-b2b-landing`
- `commerce-operations`
- `public-service`
- `analytics-platform`
- `content-management`
- `marketplace`
- `mobile-product`

## Regla de selección

Una referencia solo puede influir en la capa que tiene asignada. La accesibilidad y las restricciones explícitas del proyecto sobrescriben cualquier referencia. Las puntuaciones expresan idoneidad, no permiso para copiar ni un porcentaje de similitud visual.

Las entradas canónicas viven bajo `catalog/`. Ejecuta:

```bash
design-frontier catalog validate
design-frontier catalog list --layer forms
design-frontier catalog show stripe
```
