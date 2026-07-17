export const FORMAT_VERSION = 2 as const;

export const LAYERS = [
  'brand',
  'typography',
  'layout',
  'application_shell',
  'navigation',
  'density',
  'tables',
  'forms',
  'data_visualization',
  'feedback',
  'marketing_site',
  'documentation',
  'accessibility',
  'motion',
  'mobile'
] as const;

export type Layer = (typeof LAYERS)[number];
export type SurfaceMode = 'app' | 'landing' | 'app-and-landing';
export type Density = 'low' | 'medium' | 'medium-high' | 'high';
export type AccessibilityTarget = 'wcag-aa' | 'wcag-aaa-where-practical';
export type ThemeMode = 'light' | 'dark' | 'both';
export type DevicePriority = 'desktop' | 'mobile' | 'balanced';
export type AgentTarget = 'claude' | 'codex' | 'gemini' | 'cursor' | 'copilot' | 'all';
export type ExporterName = 'css' | 'typescript' | 'tailwind';

export interface Evidence {
  title: string;
  url: string;
  type: 'primary' | 'secondary';
}

export interface LayerRecipe {
  principles?: string[];
  requirements?: string[];
  prohibitions?: string[];
  components?: Record<string, string[]>;
  metrics?: Record<string, string | number>;
}

export interface CatalogReference {
  id: string;
  name: string;
  kind: 'brand' | 'framework' | 'design-system' | 'pattern';
  status: 'draft' | 'reviewed' | 'deprecated';
  official_design_system?: boolean;
  last_reviewed: string;
  summary: string;
  covers_layers: Partial<Record<Layer, number>>;
  recommended_for: string[];
  avoid_for: string[];
  boundaries: string[];
  implementation_notes?: string[];
  recipes?: Partial<Record<Layer, LayerRecipe>>;
  traits?: Record<string, string | string[]>;
  evidence: Evidence[];
}

export interface Archetype {
  id: string;
  name: string;
  description: string;
  signals?: string[];
  defaults: {
    density: Density;
    navigation: string;
    surfaces: SurfaceMode;
    theme?: ThemeMode;
    device_priority?: DevicePriority;
    references: Partial<Record<Layer, string>>;
  };
  requirements: string[];
  prohibitions: string[];
}

export interface CompatibilityRule {
  id: string;
  references: [string, string];
  layers?: Layer[];
  severity: 'error' | 'warning' | 'info';
  message: string;
}

export interface StackInfo {
  framework?: string;
  language?: string;
  styling?: string;
  componentLibrary?: string;
  packageManager?: string;
  storybook?: boolean;
  testRunner?: string;
  bundler?: string;
}

export interface BrandInput {
  primary?: string;
  secondary?: string;
  neutral?: string;
  surface?: string;
  fontHeading?: string;
  fontBody?: string;
  fontMono?: string;
  logoPath?: string;
}

export interface ProjectConstraints {
  must?: string[];
  must_not?: string[];
  regulatory?: string[];
}

export interface ProjectOutputs {
  css?: boolean;
  typescript?: boolean;
  tailwind?: boolean;
  design_system_spec?: boolean;
}

export interface ReferenceOverrideObject {
  primary: string;
  secondary?: string;
  weight?: number;
}

export type ReferenceOverride = string | ReferenceOverrideObject;

export interface ProjectInput {
  format_version: typeof FORMAT_VERSION;
  name: string;
  product_type: string;
  users?: string;
  goals?: string[];
  auto_archetype?: string;
  surfaces: SurfaceMode;
  dominant_patterns: string[];
  density: Density;
  accessibility: AccessibilityTarget;
  theme: ThemeMode;
  device_priority: DevicePriority;
  locales: string[];
  navigation?: string;
  stack?: StackInfo;
  brand?: BrandInput;
  constraints?: ProjectConstraints;
  reference_overrides?: Partial<Record<Layer, ReferenceOverride>>;
  outputs?: ProjectOutputs;
  token_overrides?: Record<string, unknown>;
  plugins?: string[];
  agents?: Exclude<AgentTarget, 'all'>[];
}

export interface ReferenceSelection {
  primary: string;
  secondary?: string;
  weight: number;
  source: 'archetype' | 'override';
}

export interface LayerRuleSet {
  layer: Layer;
  primary?: string;
  secondary?: string;
  principles: string[];
  requirements: string[];
  prohibitions: string[];
  components: Record<string, string[]>;
  metrics: Record<string, string | number>;
}

export interface Composition {
  archetype: string;
  references: Partial<Record<Layer, ReferenceSelection>>;
  requirements: string[];
  prohibitions: string[];
  boundaries: string[];
  layer_rules: Partial<Record<Layer, LayerRuleSet>>;
  warnings: ValidationIssue[];
}

export interface ValidationIssue {
  code: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  path?: string;
  line?: number;
}

export interface InspectResult {
  directory: string;
  packageJsonFound: boolean;
  stack: StackInfo;
  evidence: string[];
  componentFiles: string[];
  styleFiles: string[];
  detectedCssVariables: string[];
  detectedColors: Array<{ value: string; count: number }>;
  routeFiles: string[];
  componentInventory: Array<{ name: string; path: string; category: string }>;
  stylingSignals: Array<{ signal: string; count: number }>;
  risks: string[];
}

export interface DesignFrontierManifest {
  format_version: typeof FORMAT_VERSION;
  package_version: string;
  generated_at: string;
  files: Record<string, string>;
}

export interface ExportContext {
  root: string;
  project: ProjectInput;
  composition: Composition;
  tokens: Record<string, unknown>;
}

export type PluginExporter = (context: ExportContext) => Promise<Record<string, string> | void> | Record<string, string> | void;
export type PluginValidator = (context: ExportContext) => Promise<ValidationIssue[] | void> | ValidationIssue[] | void;

export interface DesignFrontierPlugin {
  name: string;
  version: string;
  references?: CatalogReference[];
  archetypes?: Archetype[];
  compatibility?: CompatibilityRule[];
  exporters?: Record<string, PluginExporter>;
  validators?: PluginValidator[];
}

export interface LoadedCatalog {
  references: CatalogReference[];
  archetypes: Archetype[];
  compatibility: CompatibilityRule[];
  plugins: DesignFrontierPlugin[];
}
