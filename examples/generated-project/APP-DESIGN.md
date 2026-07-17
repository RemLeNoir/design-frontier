# APP-DESIGN.md

> Operational interface contract for Frontier Ops.

## Objective

Support repeated work with medium-high density, stable navigation and explicit system state.

## Shell

- Navigation model: collapsible sidebar.
- Header height, sidebar width and page padding come from tokens.
- Authenticated pages share one shell.
- A feature cannot create a page-specific shell.
- Secondary navigation appears only where a real hierarchy exists.

## Page anatomy

1. Context: title, scope, status and relevant metadata.
2. Primary action: the next meaningful action for this page.
3. Controls: search, filters, view options and bulk actions.
4. Work area: table, form, document, dashboard or detail view.
5. Feedback: loading, empty, warning, error and success states.

## Dominant patterns

- tables
- filters
- forms
- dashboards

## Density

- Target: medium-high.
- Repeated expert workflows may use compact controls.
- Focus visibility and usable targets are not reduced to create density.
- Small amounts of content are not placed inside oversized cards.
- Blank space must support grouping, reading or product communication.

## Component inventory

Before creating a component:

1. Search the existing component directories.
2. Check whether the need is a state, variant or genuinely new component.
3. Register the new behavior in the design-system specification.
4. Use canonical tokens.
5. Add all required states and tests.

## Required states

- hover
- focus-visible
- active or selected
- disabled
- loading
- empty
- error
- warning
- success
- read-only
- insufficient permission
- offline or retry when the product can lose connectivity

## Application prohibitions

- oversized KPI cards with little information
- marketing typography inside operational screens
- Do not turn every section into a card.
- Do not use marketing display sizes inside operational tables.
- No marketing-sized typography in the work area.
- No decorative gradient without a defined information purpose.
- No page-specific navigation model.
- No hidden primary action solely to make the layout look simpler.
