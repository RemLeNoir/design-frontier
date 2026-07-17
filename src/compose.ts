import type {
  Archetype,
  CatalogReference,
  CompatibilityRule,
  Composition,
  Layer,
  ProjectInput,
  ReferenceOverride,
  ReferenceSelection,
  ValidationIssue,
  LayerRuleSet
} from './types.js';

function projectText(project: ProjectInput): string {
  return [project.product_type, project.users, ...(project.goals ?? []), ...project.dominant_patterns].filter(Boolean).join(' ').toLowerCase();
}

function inferArchetype(project: ProjectInput, archetypes: Archetype[]): string {
  if (project.auto_archetype) return project.auto_archetype;
  const text = projectText(project);
  let best: { id: string; score: number } | undefined;
  for (const archetype of archetypes) {
    let score = 0;
    for (const signal of archetype.signals ?? []) if (text.includes(signal.toLowerCase())) score += signal.length > 8 ? 3 : 2;
    if (archetype.defaults.surfaces === project.surfaces) score += 2;
    if (project.surfaces === 'landing' && archetype.defaults.surfaces === 'landing') score += 3;
    if (!best || score > best.score) best = { id: archetype.id, score };
  }
  return best?.score ? best.id : (project.surfaces === 'landing' ? 'technical-b2b-landing' : 'saas-operational-dense');
}

function normalizeOverride(value: ReferenceOverride, source: ReferenceSelection['source']): ReferenceSelection {
  if (typeof value === 'string') return { primary: value, weight: source === 'override' ? 0.9 : 0.8, source };
  return { primary: value.primary, secondary: value.secondary, weight: value.weight ?? (source === 'override' ? 0.9 : 0.8), source };
}

function selectedReferences(composition: Partial<Record<Layer, ReferenceSelection>>): Set<string> {
  const ids = new Set<string>();
  for (const selection of Object.values(composition)) {
    if (!selection) continue;
    ids.add(selection.primary);
    if (selection.secondary) ids.add(selection.secondary);
  }
  return ids;
}

function mergeUnique(...groups: Array<string[] | undefined>): string[] {
  return [...new Set(groups.flatMap((group) => group ?? []))];
}

function composeLayerRules(
  composition: Partial<Record<Layer, ReferenceSelection>>,
  references: CatalogReference[]
): Partial<Record<Layer, LayerRuleSet>> {
  const output: Partial<Record<Layer, LayerRuleSet>> = {};
  for (const [layerName, selection] of Object.entries(composition)) {
    if (!selection) continue;
    const layer = layerName as Layer;
    const primary = references.find((item) => item.id === selection.primary);
    const secondary = selection.secondary ? references.find((item) => item.id === selection.secondary) : undefined;
    const a = primary?.recipes?.[layer];
    const b = secondary?.recipes?.[layer];
    const componentKeys = new Set([...Object.keys(a?.components ?? {}), ...Object.keys(b?.components ?? {})]);
    const components: Record<string, string[]> = {};
    for (const key of componentKeys) components[key] = mergeUnique(a?.components?.[key], b?.components?.[key]);
    output[layer] = {
      layer,
      primary: primary?.id,
      secondary: secondary?.id,
      principles: mergeUnique(a?.principles, b?.principles),
      requirements: mergeUnique(a?.requirements, b?.requirements),
      prohibitions: mergeUnique(a?.prohibitions, b?.prohibitions),
      components,
      metrics: { ...(b?.metrics ?? {}), ...(a?.metrics ?? {}) }
    };
  }
  return output;
}

export function composeProject(
  project: ProjectInput,
  archetypes: Archetype[],
  references: CatalogReference[],
  compatibility: CompatibilityRule[] = []
): Composition {
  const warnings: ValidationIssue[] = [];
  const archetypeId = inferArchetype(project, archetypes);
  const archetype = archetypes.find((item) => item.id === archetypeId);
  if (!archetype) throw new Error(`Unknown archetype ${archetypeId}.`);

  const compositionReferences: Partial<Record<Layer, ReferenceSelection>> = {};
  for (const [layer, referenceId] of Object.entries(archetype.defaults.references)) {
    if (referenceId) compositionReferences[layer as Layer] = normalizeOverride(referenceId, 'archetype');
  }
  for (const [layer, override] of Object.entries(project.reference_overrides ?? {})) {
    if (override) compositionReferences[layer as Layer] = normalizeOverride(override, 'override');
  }

  if (project.surfaces === 'app') delete compositionReferences.marketing_site;
  if (project.surfaces === 'landing') {
    for (const layer of ['application_shell', 'navigation', 'tables', 'forms', 'data_visualization', 'feedback', 'density'] as Layer[]) {
      delete compositionReferences[layer];
    }
  }

  const boundaries = new Set<string>([
    'Accessibility requirements override all aesthetic references.',
    'A reference may influence only the layer where it is selected.',
    'Marketing spacing, typography and motion do not redefine application density.',
    'Existing component behavior overrides purely visual inspiration unless a migration is explicit.',
    'Third-party references never authorize copying proprietary assets, source code or exact compositions.'
  ]);

  const validateSelection = (layer: string, referenceId: string, role: 'primary' | 'secondary') => {
    const reference = references.find((item) => item.id === referenceId);
    if (!reference) {
      warnings.push({ code: 'DES013', severity: 'error', message: `Unknown ${role} reference ${referenceId}.`, path: `references.${layer}.${role}` });
      return;
    }
    if (!(layer in reference.covers_layers)) {
      warnings.push({ code: 'DES014', severity: 'error', message: `${reference.name} does not support layer ${layer}.`, path: `references.${layer}.${role}` });
    }
    if (reference.status === 'deprecated') warnings.push({ code: 'DES016', severity: 'warning', message: `${reference.name} is deprecated in the catalog.`, path: `references.${layer}.${role}` });
    reference.boundaries.forEach((boundary) => boundaries.add(boundary));
  };

  for (const [layer, selection] of Object.entries(compositionReferences)) {
    if (!selection) continue;
    validateSelection(layer, selection.primary, 'primary');
    if (selection.secondary) validateSelection(layer, selection.secondary, 'secondary');
    if (selection.weight < 0 || selection.weight > 1) warnings.push({ code: 'DES015', severity: 'error', message: `Weight for ${layer} must be between 0 and 1.`, path: `references.${layer}.weight` });
  }

  const selected = selectedReferences(compositionReferences);
  for (const rule of compatibility) {
    const [a, b] = rule.references;
    if (!selected.has(a) || !selected.has(b)) continue;
    if (rule.layers?.length) {
      const activeLayers = Object.entries(compositionReferences)
        .filter(([, selection]) => Boolean(selection && ([selection.primary, selection.secondary].includes(a) || [selection.primary, selection.secondary].includes(b))))
        .map(([layer]) => layer as Layer);
      if (!rule.layers.some((layer) => activeLayers.includes(layer))) continue;
    }
    warnings.push({ code: rule.id, severity: rule.severity, message: rule.message });
  }

  const marketing = compositionReferences.marketing_site?.primary;
  if (marketing && compositionReferences.application_shell?.primary === marketing) {
    warnings.push({ code: 'DES021', severity: 'warning', message: 'The same reference controls marketing and application shell. Confirm the scopes are genuinely compatible.' });
  }

  return {
    archetype: archetype.id,
    references: compositionReferences,
    requirements: [...archetype.requirements, ...(project.constraints?.must ?? []), ...(project.constraints?.regulatory ?? [])],
    prohibitions: [...archetype.prohibitions, ...(project.constraints?.must_not ?? [])],
    boundaries: [...boundaries],
    layer_rules: composeLayerRules(compositionReferences, references),
    warnings
  };
}
