import { z } from 'zod';
import { FORMAT_VERSION, LAYERS } from './types.js';

const layerEnum = z.enum(LAYERS);
const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/, 'Expected a 6 or 8 digit hex color');

export const stackSchema = z.object({
  framework: z.string().optional(),
  language: z.string().optional(),
  styling: z.string().optional(),
  componentLibrary: z.string().optional(),
  packageManager: z.string().optional(),
  storybook: z.boolean().optional(),
  testRunner: z.string().optional(),
  bundler: z.string().optional()
});

export const brandSchema = z.object({
  primary: hexColor.optional(),
  secondary: hexColor.optional(),
  neutral: hexColor.optional(),
  surface: hexColor.optional(),
  fontHeading: z.string().min(1).optional(),
  fontBody: z.string().min(1).optional(),
  fontMono: z.string().min(1).optional(),
  logoPath: z.string().min(1).optional()
});

const referenceOverrideObjectSchema = z.object({
  primary: z.string().min(1),
  secondary: z.string().min(1).optional(),
  weight: z.number().min(0).max(1).optional()
});

export const projectInputSchema = z.object({
  format_version: z.literal(FORMAT_VERSION).default(FORMAT_VERSION),
  name: z.string().min(1),
  product_type: z.string().min(1),
  users: z.string().optional(),
  goals: z.array(z.string().min(1)).optional(),
  auto_archetype: z.string().optional(),
  surfaces: z.enum(['app', 'landing', 'app-and-landing']),
  dominant_patterns: z.array(z.string().min(1)).min(1),
  density: z.enum(['low', 'medium', 'medium-high', 'high']),
  accessibility: z.enum(['wcag-aa', 'wcag-aaa-where-practical']),
  theme: z.enum(['light', 'dark', 'both']).default('light'),
  device_priority: z.enum(['desktop', 'mobile', 'balanced']).default('desktop'),
  locales: z.array(z.string().min(2)).min(1).default(['en']),
  navigation: z.string().optional(),
  stack: stackSchema.optional(),
  brand: brandSchema.optional(),
  constraints: z.object({
    must: z.array(z.string()).optional(),
    must_not: z.array(z.string()).optional(),
    regulatory: z.array(z.string()).optional()
  }).optional(),
  reference_overrides: z.partialRecord(layerEnum, z.union([z.string().min(1), referenceOverrideObjectSchema])).optional(),
  outputs: z.object({
    css: z.boolean().optional(),
    typescript: z.boolean().optional(),
    tailwind: z.boolean().optional(),
    design_system_spec: z.boolean().optional()
  }).optional(),
  token_overrides: z.record(z.string(), z.unknown()).optional(),
  plugins: z.array(z.string().min(1)).optional(),
  agents: z.array(z.enum(['claude', 'codex', 'gemini', 'cursor', 'copilot'])).refine((items) => new Set(items).size === items.length, 'Agent targets must be unique').optional()
});

export const legacyProjectInputSchema = z.object({
  format_version: z.literal(1).default(1),
  name: z.string().min(1),
  product_type: z.string().min(1),
  users: z.string().optional(),
  auto_archetype: z.string().optional(),
  surfaces: z.enum(['app', 'landing', 'app-and-landing']),
  dominant_patterns: z.array(z.string()).min(1),
  density: z.enum(['low', 'medium', 'medium-high', 'high']),
  accessibility: z.enum(['wcag-aa', 'wcag-aaa-where-practical']),
  stack: stackSchema.optional(),
  brand: brandSchema.optional(),
  reference_overrides: z.partialRecord(layerEnum, z.string()).optional()
});

export const evidenceSchema = z.object({
  title: z.string().min(1),
  url: z.url(),
  type: z.enum(['primary', 'secondary'])
});


const layerRecipeSchema = z.object({
  principles: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  prohibitions: z.array(z.string()).optional(),
  components: z.record(z.string(), z.array(z.string())).optional(),
  metrics: z.record(z.string(), z.union([z.string(), z.number()])).optional()
});

export const catalogReferenceSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  kind: z.enum(['brand', 'framework', 'design-system', 'pattern']),
  status: z.enum(['draft', 'reviewed', 'deprecated']),
  official_design_system: z.boolean().optional(),
  last_reviewed: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  summary: z.string().min(1),
  covers_layers: z.partialRecord(layerEnum, z.number().min(0).max(1)),
  recommended_for: z.array(z.string()),
  avoid_for: z.array(z.string()),
  boundaries: z.array(z.string()).min(1),
  implementation_notes: z.array(z.string()).optional(),
  recipes: z.partialRecord(layerEnum, layerRecipeSchema).optional(),
  traits: z.record(z.string(), z.union([z.string(), z.array(z.string())])).optional(),
  evidence: z.array(evidenceSchema).min(1)
});

export const archetypeSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  description: z.string().min(1),
  signals: z.array(z.string()).optional(),
  defaults: z.object({
    density: z.enum(['low', 'medium', 'medium-high', 'high']),
    navigation: z.string(),
    surfaces: z.enum(['app', 'landing', 'app-and-landing']),
    theme: z.enum(['light', 'dark', 'both']).optional(),
    device_priority: z.enum(['desktop', 'mobile', 'balanced']).optional(),
    references: z.partialRecord(layerEnum, z.string())
  }),
  requirements: z.array(z.string()),
  prohibitions: z.array(z.string())
});

export const compatibilityRuleSchema = z.object({
  id: z.string().regex(/^[A-Z0-9-]+$/),
  references: z.tuple([z.string(), z.string()]),
  layers: z.array(layerEnum).optional(),
  severity: z.enum(['error', 'warning', 'info']),
  message: z.string().min(1)
});

export const compatibilityFileSchema = z.object({
  rules: z.array(compatibilityRuleSchema).default([])
});

export const referenceSelectionSchema = z.object({
  primary: z.string().min(1),
  secondary: z.string().min(1).optional(),
  weight: z.number().min(0).max(1),
  source: z.enum(['archetype', 'override'])
});

export const referencesFileSchema = z.object({
  format_version: z.literal(FORMAT_VERSION),
  references: z.partialRecord(layerEnum, referenceSelectionSchema)
});

export const decisionsFileSchema = z.object({
  format_version: z.literal(FORMAT_VERSION),
  archetype: z.string().min(1),
  requirements: z.array(z.string()),
  prohibitions: z.array(z.string()),
  boundaries: z.array(z.string())
});

export const unresolvedFileSchema = z.object({
  format_version: z.literal(FORMAT_VERSION),
  decisions: z.array(z.object({
    id: z.string().min(1),
    question: z.string().min(1),
    status: z.enum(['open', 'accepted', 'rejected']).default('open'),
    resolution: z.string().optional()
  })).default([])
});

export const manifestSchema = z.object({
  format_version: z.literal(FORMAT_VERSION),
  package_version: z.string().regex(/^\d+\.\d+\.\d+/),
  generated_at: z.iso.datetime(),
  files: z.record(z.string(), z.string().regex(/^[a-f0-9]{64}$/))
});
