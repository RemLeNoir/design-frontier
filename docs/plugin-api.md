# Plugin API

Plugins extend Design Frontier with organization or domain-specific material.

## Loading

Configure a local file or npm package:

```yaml
plugins:
  - ./tools/design-frontier-plugin.mjs
  - '@company/design-frontier'
```

The module exports `default`, `designFrontierPlugin`, or the plugin object directly.

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

## References and archetypes

Plugin catalog objects use the same schemas as built-in entries. IDs share one global namespace. Duplicates stop loading.

## Exporters

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

Exporters return a map of repository-relative file paths to text content.

## Validators

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

Codes should use a plugin-specific prefix.

## Security

Plugins are executable modules. They run with the same filesystem and process permissions as the CLI. Design Frontier does not sandbox them. Pin versions, review source, and avoid loading plugins from writable untrusted locations.

See `examples/plugin/design-frontier-plugin.mjs`.
