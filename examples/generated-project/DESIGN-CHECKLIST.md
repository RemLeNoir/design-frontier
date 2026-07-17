# DESIGN-CHECKLIST.md

Use this checklist before accepting UI work for **Frontier Ops**.

## Contract

- [ ] The relevant design files were read before implementation.
- [ ] Existing components were checked before creating a new one.
- [ ] The page uses semantic tokens.
- [ ] No page-local color role, radius or spacing scale was introduced.
- [ ] New variants are documented with a real use case.

## Structure

- [ ] The application shell remains consistent.
- [ ] The page has one clear context and primary action.
- [ ] Navigation shows current location.
- [ ] Content density matches medium-high.
- [ ] Cards add containment or interaction rather than decoration.

## Interaction

- [ ] Hover and focus-visible states exist where relevant.
- [ ] Disabled states explain why when needed.
- [ ] Loading, empty, error, warning and success states are resolved.
- [ ] Destructive actions use danger semantics and appropriate confirmation.
- [ ] Frequent actions are not hidden unnecessarily.

## Responsive and accessibility

- [ ] Keyboard operation is possible.
- [ ] Focus order follows task order.
- [ ] Contrast and text size meet wcag-aa.
- [ ] Mobile layout preserves task priority.
- [ ] Tables remain understandable at narrow widths.
- [ ] Reduced motion preferences are respected.

## Reference boundaries

- [ ] Each reference affected only its declared layer.
- [ ] Marketing patterns did not leak into operational screens.
- [ ] No third-party proprietary asset or exact composition was copied.

## Verification

- [ ] `npx design-frontier validate .` passes.
- [ ] `npx design-frontier lint .` has no unreviewed warnings.
