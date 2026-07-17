# DESIGN-SOURCES.md

This file records the references used to compose the project design contract. Entries are comparative references, not copied design systems.

### Metronic

Modular administrative shell with broad backoffice component coverage.

**Allowed influence:** application_shell, navigation, density, tables, forms, feedback

**Boundaries**

- Use as structural reference, not as permission to ship every available widget.
- Do not inherit demo-page visual clutter or oversized cards.
- Remove unused navigation levels and decorative dashboard blocks.

**Evidence**

- [Metronic official site](https://keenthemes.com/metronic) (primary)
- [Metronic Tailwind documentation](https://keenthemes.com/metronic/tailwind/docs/) (primary)

### Linear

Restrained product interface with controlled density, low visual noise and workflow-first navigation.

**Allowed influence:** navigation, density, application_shell, feedback, marketing_site

**Boundaries**

- Do not transfer marketing headline scale into the application.
- Do not assume its issue-tracking interaction model fits every domain.
- Low visual noise must not reduce discoverability for novice users.

**Evidence**

- [Linear product site](https://linear.app/) (primary)
- [Linear UI redesign article](https://linear.app/blog/how-we-redesigned-the-linear-ui) (primary)

### Airtable

Data operations reference for views, grids, filters and multiple representations of the same records.

**Allowed influence:** tables, density, navigation, forms, feedback

**Boundaries**

- Use view-switching patterns only when multiple representations add real value.
- Do not expose database concepts to users who do not need them.
- Table flexibility must not replace explicit workflow design.

**Evidence**

- [Airtable Views](https://www.airtable.com/platform/views) (primary)
- [Airtable Interface Designer](https://www.airtable.com/platform/interface-designer) (primary)

### IBM Carbon Design System

Enterprise component behavior, data-heavy interfaces and systematic interaction states.

**Allowed influence:** application_shell, tables, forms, data_visualization, accessibility, feedback

**Boundaries**

- Use behavior and component rigor without importing IBM brand identity.
- Enterprise density still requires task prioritization.
- Do not combine multiple complete component systems in one project.

**Evidence**

- [Carbon Design System](https://carbondesignsystem.com/) (primary)

### Stripe

Trust-sensitive forms, developer communication and technical product storytelling.

**Allowed influence:** forms, documentation, marketing_site, feedback, brand

**Boundaries**

- Use trust and clarity patterns without copying payment-specific semantics.
- Decorative gradients belong to marketing surfaces, not operational forms by default.
- Documentation density must remain appropriate for the user's expertise.

**Evidence**

- [Stripe Elements](https://stripe.com/payments/elements) (primary)
- [Stripe Documentation](https://docs.stripe.com/) (primary)

### GOV.UK Design System

Clear public-service forms, error handling, accessible content and task completion.

**Allowed influence:** forms, accessibility, feedback, navigation, documentation

**Boundaries**

- Adapt visual identity while preserving interaction clarity.
- Do not copy government branding into unrelated products.
- Service simplicity should not erase necessary expert controls.

**Evidence**

- [GOV.UK Design System](https://design-system.service.gov.uk/) (primary)

### Shopify Polaris

Commerce operations, resource lists, contextual actions and merchant feedback patterns.

**Allowed influence:** application_shell, navigation, tables, forms, feedback

**Boundaries**

- Use operational patterns without inheriting Shopify-specific vocabulary.
- Contextual actions must remain predictable outside commerce workflows.
- Resource-list cards should not replace tables when comparison is primary.

**Evidence**

- [Shopify Polaris](https://polaris.shopify.com/) (primary)

### Apple

Editorial product presentation, large-scale visual rhythm and platform design guidance.

**Allowed influence:** marketing_site, brand, accessibility

**Boundaries**

- Never use as a table, form-density or backoffice-shell reference.
- Large type and whitespace require sufficient product imagery and concise copy.
- Do not reproduce proprietary assets, fonts or product-page compositions wholesale.

**Evidence**

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines) (primary)
- [Apple Design Resources](https://developer.apple.com/design/resources/) (primary)
