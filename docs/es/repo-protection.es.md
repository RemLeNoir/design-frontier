<!-- [🇬🇧 English](../repo-protection.md) · 🇪🇸 Español -->

# Protección del repositorio

Este documento describe cómo hacer el repositorio público **y protegido**. Los
archivos del repo declaran la política; algunos ajustes deben aplicarse una vez
en la interfaz o la API de GitHub porque no pueden vivir en el árbol de código.

## Ajustes únicos en GitHub

### 1. Protección de rama (importar el ruleset)

Hay un ruleset listo para importar en
[`.github/rulesets/main-branch-protection.json`](../../.github/rulesets/main-branch-protection.json).

- **UI:** Repo → Settings → Rules → Rulesets → New ruleset → Import → selecciona
  el archivo JSON → pon el enforcement en *Active*.
- **CLI:**

  ```bash
  gh api --method POST repos/{owner}/{repo}/rulesets \
    --input .github/rulesets/main-branch-protection.json
  ```

Aplica en `main`: revisión por pull request (1 aprobación, revisión de code owner
obligatoria, revisiones obsoletas descartadas, hilos resueltos), checks de CI en
verde (`check (20)`, `check (22)`), sin force-push y sin borrado de rama. El
propietario del repositorio (rol admin) omite (bypass) estas reglas, de modo que
un mantenedor en solitario nunca queda bloqueado; las reglas restringen al resto
de contribuidores.

> Los commits firmados **no** se exigen por defecto, para no bloquear a un
> mantenedor que no haya configurado la firma de commits. Para exigirlos, añade
> `{ "type": "required_signatures" }` al array `rules` del ruleset y vuelve a
> importarlo.

### 2. Reporte privado de vulnerabilidades

Repo → Settings → Security → **Enable private vulnerability reporting**. Esto
respalda el flujo descrito en [`SECURITY.md`](../../.github/SECURITY.md).

### 3. Endurecimiento general

- Repo → Settings → General → Pull Requests: permite solo **squash merge**;
  activa *Automatically delete head branches*.
- Repo → Settings → Actions → General: permisos de workflow en **solo lectura**
  por defecto (el workflow de CI ya declara `contents: read`).
- Restringe quién puede hacer push y crear releases al owner/mantenedores.
- Protege el paquete npm: activa 2FA en la cuenta de npm y mantén
  `publishConfig.provenance` activado (ya está).

## Lo que aplican los archivos del repo

- **Revisión por propietario:** [`.github/CODEOWNERS`](../../.github/CODEOWNERS)
  enruta las rutas sensibles (licencia, gobernanza, catálogo, código, workflows)
  al owner.
- **Términos de contribución:** [`CLA.md`](../../.github/CLA.md) + sign-off DCO, descrito en
  [`CONTRIBUTING.es.md`](./CONTRIBUTING.es.md).
- **Licencia:** [`LICENSE`](../../LICENSE) (PolyForm Noncommercial) +
  [`COMMERCIAL-LICENSE.es.md`](./COMMERCIAL-LICENSE.es.md).
- **Nombre y logotipo:** [`TRADEMARK.es.md`](./TRADEMARK.es.md).

## Opcional: forzar el DCO en los pull requests

Añade la GitHub App de DCO, o un pequeño check de CI que falle los PR cuyos
commits carezcan de línea `Signed-off-by`, para que el requisito del DCO sea
automático en lugar de manual.
