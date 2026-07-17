<!-- 🇬🇧 English · [🇪🇸 Español](./es/repo-protection.es.md) -->

# Repository protection

This document describes how to make the repository public **and protected**. The
files in the repo declare policy; a few settings must be applied once in the
GitHub UI or API because they cannot live in the tree.

## One-time GitHub settings

### 1. Branch protection (import the ruleset)

A ready-to-import ruleset lives at
[`.github/rulesets/main-branch-protection.json`](../.github/rulesets/main-branch-protection.json).

- **UI:** Repo → Settings → Rules → Rulesets → New ruleset → Import → select the
  JSON file → set enforcement to *Active*.
- **CLI:**

  ```bash
  gh api --method POST repos/{owner}/{repo}/rulesets \
    --input .github/rulesets/main-branch-protection.json
  ```

It enforces on `main`: pull-request review (1 approval, code-owner review
required, stale reviews dismissed, threads resolved), passing CI status checks
(`check (20)`, `check (22)`), no force-push, and no branch deletion. The
repository owner (admin role) bypasses these rules, so a solo maintainer is
never locked out; the rules constrain other contributors.

> Signed commits are **not** required by default, to avoid locking out a
> maintainer who has not configured commit signing. To require them, add
> `{ "type": "required_signatures" }` to the ruleset's `rules` array and
> re-import.

### 2. Private vulnerability reporting

Repo → Settings → Security → **Enable private vulnerability reporting**. This
backs the flow described in [`SECURITY.md`](../.github/SECURITY.md).

### 3. General hardening

- Repo → Settings → General → Pull Requests: allow **squash merge** only; enable
  *Automatically delete head branches*.
- Repo → Settings → Actions → General: set workflow permissions to
  **read-only** by default (the CI workflow already declares `contents: read`).
- Restrict who can push and who can create releases to the owner/maintainers.
- Protect the npm package: enable 2FA on the npm account and keep
  `publishConfig.provenance` enabled (already set).

## What is enforced by files in the repo

- **Ownership review:** [`.github/CODEOWNERS`](../.github/CODEOWNERS) routes
  sensitive paths (license, governance, catalog, source, workflows) to the owner.
- **Contribution terms:** [`CLA.md`](../.github/CLA.md) + DCO sign-off, described in
  [`CONTRIBUTING.md`](../.github/CONTRIBUTING.md).
- **Licensing:** [`LICENSE`](../LICENSE) (PolyForm Noncommercial) +
  [`COMMERCIAL-LICENSE.md`](../COMMERCIAL-LICENSE.md).
- **Name and logo:** [`TRADEMARK.md`](../TRADEMARK.md).

## Optional: enforce DCO on pull requests

Add the DCO GitHub App, or a small CI check that fails PRs whose commits lack a
`Signed-off-by` line, to make the DCO requirement automatic rather than manual.
