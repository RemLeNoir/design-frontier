# Design system implementation specification

This document defines the minimum component gallery and implementation evidence required for Frontier Ops.

## Required route or story collection

Create one of the following, using the project's existing tooling:

- an internal `/design-system` route;
- Storybook stories;
- a static component gallery under `docs/`.

The chosen surface must be excluded from production navigation unless it is intended for users.

## Required groups

### Foundations

- color roles in light and dark themes when supported;
- typography scale;
- spacing scale;
- radii, borders and shadows;
- icon sizes and alignment;
- motion durations and reduced-motion behavior.

### Controls

- buttons: primary, secondary, quiet, danger and icon-only;
- fields: text, textarea, select, checkbox, radio, switch and date input where used;
- search and filter controls;
- tabs, pagination and segmented controls where used.

### Data and containment

- table and resource list;
- card and panel only where the product uses them;
- badge, status and metadata patterns;
- charts with empty, loading and error states when charts exist.

### Overlays and feedback

- modal, drawer, popover and tooltip;
- inline validation;
- alert, toast and persistent banner;
- loading, skeleton, empty, offline and permission states.

## State matrix

Every interactive component documents:

- default;
- hover;
- focus-visible;
- active or selected;
- disabled;
- loading where applicable;
- error where applicable;
- dark theme where supported;
- narrow viewport behavior.

## Composition requirements

- comparison-friendly tables
- keyboard and focus support
- explicit bulk-action state
- compact but readable spacing
- Keep primary actions visible in repeated workflows.

## Canonical token table

| Token | Value |
|---|---|
| `meta.formatVersion` | `2` |
| `meta.theme` | `both` |
| `meta.density` | `medium-high` |
| `color.surface.page` | `#F7F8FA` |
| `color.surface.panel` | `#FFFFFF` |
| `color.surface.raised` | `#FFFFFF` |
| `color.surface.overlay` | `#FFFFFF` |
| `color.text.primary` | `#171A21` |
| `color.text.secondary` | `#5F6877` |
| `color.text.muted` | `#667085` |
| `color.text.inverse` | `#FFFFFF` |
| `color.border.default` | `#D8DDE6` |
| `color.border.strong` | `#AEB7C6` |
| `color.border.focus` | `#7D9BFF` |
| `color.action.primary` | `#3157D5` |
| `color.action.primaryHover` | `#1F45C3` |
| `color.action.secondary` | `#0F9F8F` |
| `color.action.disabled` | `#98A2B3` |
| `color.status.success` | `#15805D` |
| `color.status.warning` | `#A86500` |
| `color.status.danger` | `#C73535` |
| `color.status.info` | `#1C6FC2` |
| `themes.light.color.surface.page` | `#F7F8FA` |
| `themes.light.color.surface.panel` | `#FFFFFF` |
| `themes.light.color.surface.raised` | `#FFFFFF` |
| `themes.light.color.surface.overlay` | `#FFFFFF` |
| `themes.light.color.text.primary` | `#171A21` |
| `themes.light.color.text.secondary` | `#5F6877` |
| `themes.light.color.text.muted` | `#667085` |
| `themes.light.color.text.inverse` | `#FFFFFF` |
| `themes.light.color.border.default` | `#D8DDE6` |
| `themes.light.color.border.strong` | `#AEB7C6` |
| `themes.light.color.border.focus` | `#7D9BFF` |
| `themes.light.color.action.primary` | `#3157D5` |
| `themes.light.color.action.primaryHover` | `#1F45C3` |
| `themes.light.color.action.secondary` | `#0F9F8F` |
| `themes.light.color.action.disabled` | `#98A2B3` |
| `themes.light.color.status.success` | `#15805D` |
| `themes.light.color.status.warning` | `#A86500` |
| `themes.light.color.status.danger` | `#C73535` |
| `themes.light.color.status.info` | `#1C6FC2` |
| `themes.dark.color.surface.page` | `#0F1115` |
| `themes.dark.color.surface.panel` | `#171A21` |
| `themes.dark.color.surface.raised` | `#1E222B` |
| `themes.dark.color.surface.overlay` | `#252A34` |
| `themes.dark.color.text.primary` | `#F4F6F8` |
| `themes.dark.color.text.secondary` | `#B4BCC8` |
| `themes.dark.color.text.muted` | `#667085` |
| `themes.dark.color.text.inverse` | `#171A21` |
| `themes.dark.color.border.default` | `#343B47` |
| `themes.dark.color.border.strong` | `#566071` |
| `themes.dark.color.border.focus` | `#7D9BFF` |
| `themes.dark.color.action.primary` | `#3157D5` |
| `themes.dark.color.action.primaryHover` | `#4369E7` |
| `themes.dark.color.action.secondary` | `#0F9F8F` |
| `themes.dark.color.action.disabled` | `#667085` |
| `themes.dark.color.status.success` | `#36B98B` |
| `themes.dark.color.status.warning` | `#E2A43A` |
| `themes.dark.color.status.danger` | `#EF6B6B` |
| `themes.dark.color.status.info` | `#62A8E8` |
| `space.0` | `0px` |
| `space.1` | `4px` |
| `space.2` | `8px` |
| `space.3` | `12px` |
| `space.4` | `16px` |
| `space.5` | `20px` |
| `space.6` | `24px` |
| `space.8` | `32px` |
| `space.10` | `40px` |
| `space.12` | `48px` |
| `space.16` | `64px` |
| `size.control.compact` | `32px` |
| `size.control.default` | `36px` |
| `size.control.large` | `44px` |
| `size.layout.pagePadding` | `20px` |
| `size.layout.sectionGap` | `24px` |
| `size.layout.sidebar` | `264px` |
| `size.layout.sidebarCollapsed` | `72px` |
| `size.layout.header` | `56px` |
| `size.content.appMax` | `1440px` |
| `size.content.readingMax` | `760px` |
| `size.content.landingMax` | `1280px` |
| `radius.none` | `0px` |
| `radius.control` | `8px` |
| `radius.panel` | `12px` |
| `radius.overlay` | `14px` |
| `radius.pill` | `999px` |
| `border.width.default` | `1px` |
| `border.width.strong` | `2px` |
| `shadow.raised` | `{"color":"#0000001A","offsetX":"0px","offsetY":"4px","blur":"16px","spread":"0px"}` |
| `shadow.overlay` | `{"color":"#00000026","offsetX":"0px","offsetY":"12px","blur":"32px","spread":"0px"}` |
| `typography.family.body` | `Inter, ui-sans-serif, system-ui, sans-serif` |
| `typography.family.heading` | `Inter, ui-sans-serif, system-ui, sans-serif` |
| `typography.family.mono` | `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` |
| `typography.size.xs` | `12px` |
| `typography.size.sm` | `14px` |
| `typography.size.md` | `16px` |
| `typography.size.lg` | `18px` |
| `typography.size.xl` | `24px` |
| `typography.size.display` | `48px` |
| `typography.lineHeight.tight` | `1.2` |
| `typography.lineHeight.normal` | `1.5` |
| `typography.lineHeight.relaxed` | `1.65` |
| `motion.duration.fast` | `120ms` |
| `motion.duration.normal` | `180ms` |
| `motion.duration.slow` | `280ms` |
| `motion.easing.standard` | `[0.2,0,0,1]` |
