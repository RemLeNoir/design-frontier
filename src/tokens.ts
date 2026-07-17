import type { Density, ProjectInput } from './types.js';

function token(type: string, value: unknown, description: string) {
  return { $type: type, $value: value, $description: description };
}

function color(value: string, description: string) {
  return token('color', value, description);
}

function dimension(value: string, description: string) {
  return token('dimension', value, description);
}

function number(value: number, description: string) {
  return token('number', value, description);
}

function densityValues(density: Density) {
  if (density === 'high') return { compact: '28px', default: '32px', page: '16px', section: '20px' };
  if (density === 'medium-high') return { compact: '32px', default: '36px', page: '20px', section: '24px' };
  if (density === 'medium') return { compact: '36px', default: '40px', page: '24px', section: '32px' };
  return { compact: '40px', default: '44px', page: '32px', section: '40px' };
}

function clamp(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function adjustHex(value: string, amount: number): string {
  const match = /^#([0-9a-fA-F]{6})$/.exec(value);
  if (!match?.[1]) return value;
  const raw = match[1];
  const parts = [0, 2, 4].map((index) => Number.parseInt(raw.slice(index, index + 2), 16));
  return `#${parts.map((part) => clamp(part + amount).toString(16).padStart(2, '0')).join('').toUpperCase()}`;
}

function semanticColors(mode: 'light' | 'dark', project: ProjectInput) {
  const primary = project.brand?.primary ?? '#3157D5';
  const secondary = project.brand?.secondary ?? '#0F9F8F';
  const neutral = project.brand?.neutral ?? '#667085';
  const isDark = mode === 'dark';
  const palette = isDark
    ? { page: '#0F1115', panel: '#171A21', raised: '#1E222B', overlay: '#252A34', textPrimary: '#F4F6F8', textSecondary: '#B4BCC8', border: '#343B47', borderStrong: '#566071' }
    : { page: project.brand?.surface ?? '#F7F8FA', panel: '#FFFFFF', raised: '#FFFFFF', overlay: '#FFFFFF', textPrimary: '#171A21', textSecondary: '#5F6877', border: '#D8DDE6', borderStrong: '#AEB7C6' };
  return {
    surface: {
      page: color(palette.page, 'Page background'),
      panel: color(palette.panel, 'Primary contained surface'),
      raised: color(palette.raised, 'Raised panel, popover or menu'),
      overlay: color(palette.overlay, 'Modal and drawer surface')
    },
    text: {
      primary: color(palette.textPrimary, 'Primary readable text'),
      secondary: color(palette.textSecondary, 'Secondary readable text'),
      muted: color(neutral, 'Muted labels and metadata'),
      inverse: color(isDark ? '#171A21' : '#FFFFFF', 'Text on inverse surfaces')
    },
    border: {
      default: color(palette.border, 'Default structural border'),
      strong: color(palette.borderStrong, 'Emphasized structural border'),
      focus: color('#7D9BFF', 'Visible focus outline')
    },
    action: {
      primary: color(primary, 'Primary action'),
      primaryHover: color(adjustHex(primary, isDark ? 18 : -18), 'Primary action hover'),
      secondary: color(secondary, 'Secondary action or accent'),
      disabled: color(isDark ? '#667085' : '#98A2B3', 'Disabled control')
    },
    status: {
      success: color(isDark ? '#36B98B' : '#15805D', 'Successful outcome'),
      warning: color(isDark ? '#E2A43A' : '#A86500', 'Warning or attention'),
      danger: color(isDark ? '#EF6B6B' : '#C73535', 'Destructive action or error'),
      info: color(isDark ? '#62A8E8' : '#1C6FC2', 'Informational feedback')
    }
  };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function deepMergeTokens(base: Record<string, unknown>, override?: Record<string, unknown>): Record<string, unknown> {
  if (!override) return base;
  const result: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const existing = result[key];
    result[key] = isPlainObject(existing) && isPlainObject(value)
      ? deepMergeTokens(existing, value)
      : value;
  }
  return result;
}

export function createTokens(project: ProjectInput): Record<string, unknown> {
  const density = densityValues(project.density);
  const defaultMode = project.theme === 'dark' ? 'dark' : 'light';
  const base: Record<string, unknown> = {
    $schema: 'https://design-frontier.dev/schemas/tokens.schema.json',
    $description: `Design Frontier semantic tokens for ${project.name}`,
    meta: {
      formatVersion: number(2, 'Canonical Design Frontier token format'),
      theme: token('string', project.theme, 'Supported theme mode'),
      density: token('string', project.density, 'Operational density target')
    },
    color: semanticColors(defaultMode, project),
    themes: {
      light: { color: semanticColors('light', project) },
      dark: { color: semanticColors('dark', project) }
    },
    space: {
      0: dimension('0px', 'No spacing'), 1: dimension('4px', 'Smallest spacing unit'), 2: dimension('8px', 'Compact spacing'),
      3: dimension('12px', 'Compact component spacing'), 4: dimension('16px', 'Default component spacing'), 5: dimension('20px', 'Section internal spacing'),
      6: dimension('24px', 'Default section spacing'), 8: dimension('32px', 'Large section spacing'), 10: dimension('40px', 'Page section separation'),
      12: dimension('48px', 'Large public-site rhythm'), 16: dimension('64px', 'Major marketing section rhythm')
    },
    size: {
      control: { compact: dimension(density.compact, 'Compact control height'), default: dimension(density.default, 'Default control height'), large: dimension('44px', 'Touch-friendly control height') },
      layout: { pagePadding: dimension(density.page, 'Default page horizontal padding'), sectionGap: dimension(density.section, 'Default vertical section gap'), sidebar: dimension('264px', 'Expanded application sidebar width'), sidebarCollapsed: dimension('72px', 'Collapsed application sidebar width'), header: dimension('56px', 'Application header height') },
      content: { appMax: dimension('1440px', 'Maximum operational content width'), readingMax: dimension('760px', 'Maximum long-form reading width'), landingMax: dimension('1280px', 'Maximum marketing content width') }
    },
    radius: { none: dimension('0px', 'Square corners'), control: dimension('8px', 'Inputs and buttons'), panel: dimension('12px', 'Panels and cards'), overlay: dimension('14px', 'Modals and drawers'), pill: dimension('999px', 'Chips, filters and compact selectors only') },
    border: { width: { default: dimension('1px', 'Default border width'), strong: dimension('2px', 'Focus and emphasized border width') } },
    shadow: {
      raised: token('shadow', { color: '#0000001A', offsetX: '0px', offsetY: '4px', blur: '16px', spread: '0px' }, 'Raised panel shadow'),
      overlay: token('shadow', { color: '#00000026', offsetX: '0px', offsetY: '12px', blur: '32px', spread: '0px' }, 'Modal or drawer shadow')
    },
    typography: {
      family: { body: token('fontFamily', project.brand?.fontBody ?? 'Inter, ui-sans-serif, system-ui, sans-serif', 'Body family'), heading: token('fontFamily', project.brand?.fontHeading ?? 'Inter, ui-sans-serif, system-ui, sans-serif', 'Heading family'), mono: token('fontFamily', project.brand?.fontMono ?? 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', 'Monospace family') },
      size: { xs: dimension('12px', 'Compact labels'), sm: dimension('14px', 'Secondary text and controls'), md: dimension('16px', 'Default body text'), lg: dimension('18px', 'Large body or compact heading'), xl: dimension('24px', 'Page heading'), display: dimension('48px', 'Marketing display, never used in operational tables or forms') },
      lineHeight: { tight: number(1.2, 'Display and compact headings'), normal: number(1.5, 'Body and controls'), relaxed: number(1.65, 'Long-form reading') }
    },
    motion: {
      duration: { fast: dimension('120ms', 'Hover and focus feedback'), normal: dimension('180ms', 'Menus and compact transitions'), slow: dimension('280ms', 'Large surface transitions') },
      easing: { standard: token('cubicBezier', [0.2, 0, 0, 1], 'Standard interface easing') }
    }
  };
  return deepMergeTokens(base, project.token_overrides);
}

export function flattenTokens(tokens: Record<string, unknown>, prefix: string[] = []): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(tokens)) {
    if (key.startsWith('$')) continue;
    const next = [...prefix, key];
    if (value && typeof value === 'object' && '$value' in (value as Record<string, unknown>)) {
      result[next.join('.')] = (value as Record<string, unknown>).$value;
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenTokens(value as Record<string, unknown>, next));
    }
  }
  return result;
}
