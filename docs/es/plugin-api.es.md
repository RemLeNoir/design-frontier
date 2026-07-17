<!-- [🇬🇧 English](../plugin-api.md) · 🇪🇸 Español -->
# API de plugins

Los plugins amplían Design Frontier con material específico de la organización o del dominio.

## Carga

Configura un archivo local o un paquete npm:

```yaml
plugins:
  - ./tools/design-frontier-plugin.mjs
  - '@company/design-frontier'
```

El módulo exporta `default`, `designFrontierPlugin`, o el objeto de plugin directamente.

```js
export default {
  name: 'company-catalog',
  version: '1.0.0',
  references: [],
  archetypes: [],
  compatibility: [],
  exporters: {},
  validators: []
};
```

## Referencias y arquetipos

Los objetos de catálogo de los plugins usan los mismos esquemas que las entradas integradas. Los IDs comparten un único espacio de nombres global. Los duplicados detienen la carga.

## Exportadores

```js
export default {
  name: 'figma-token-export',
  version: '1.0.0',
  exporters: {
    custom: async ({ project, composition, tokens, root }) => ({
      '.design-frontier/generated/custom.json': JSON.stringify({ project, composition, tokens }, null, 2)
    })
  }
};
```

Los exportadores devuelven un mapa de rutas de archivo relativas al repositorio a contenido de texto.

## Validadores

```js
export default {
  name: 'company-rules',
  version: '1.0.0',
  validators: [async ({ project }) => {
    if (project.accessibility !== 'wcag-aa') return [{
      code: 'ACME001',
      severity: 'error',
      message: 'Company projects require WCAG AA.'
    }];
  }]
};
```

Los códigos deberían usar un prefijo específico del plugin.

## Seguridad

Los plugins son módulos ejecutables. Se ejecutan con los mismos permisos de sistema de archivos y de proceso que la CLI. Design Frontier no los aísla en un sandbox. Fija las versiones, revisa el código fuente y evita cargar plugins desde ubicaciones no fiables con permiso de escritura.

Consulta `examples/plugin/design-frontier-plugin.mjs`.
