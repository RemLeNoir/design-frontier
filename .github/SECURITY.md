# Security Policy · Política de Seguridad

## 🇬🇧 English

### Supported versions

Security fixes are provided for the latest stable major release.

### Reporting a vulnerability

**Do not open a public issue** for a vulnerability that could expose repository
data, execute untrusted code, overwrite files outside documented paths, or
compromise published packages.

Report privately through **GitHub → Security → Report a vulnerability** (private
vulnerability reporting is enabled for this repository). If that is unavailable,
contact the maintainer at info@apferrer.com.

Include:

- affected version;
- reproduction steps;
- expected impact;
- a minimal proof of concept.

You will receive an acknowledgement within a reasonable time. Please give the
maintainer a chance to release a fix before any public disclosure
(coordinated disclosure).

### Trust boundaries

- Built-in catalog files are data only.
- Plugins are executable modules and are **not** sandboxed.
- Agent skills and instruction files influence agent behavior and must be
  reviewed.
- Plugin exporters may choose output paths.
- Normal core commands do not require network access.

See [docs/security-model.md](../docs/security-model.md).

---

## 🇪🇸 Español

### Versiones soportadas

Las correcciones de seguridad se proporcionan para la última versión mayor
estable.

### Cómo reportar una vulnerabilidad

**No abras una issue pública** para una vulnerabilidad que pueda exponer datos
del repositorio, ejecutar código no confiable, sobrescribir archivos fuera de
las rutas documentadas o comprometer paquetes publicados.

Repórtala en privado a través de **GitHub → Security → Report a vulnerability**
(el reporte privado de vulnerabilidades está activado en este repositorio). Si no
está disponible, contacta con el mantenedor en info@apferrer.com.

Incluye:

- versión afectada;
- pasos de reproducción;
- impacto esperado;
- una prueba de concepto mínima.

Recibirás acuse de recibo en un plazo razonable. Por favor, da al mantenedor la
oportunidad de publicar una corrección antes de cualquier divulgación pública
(divulgación coordinada).

### Límites de confianza

- Los archivos de catálogo integrados son solo datos.
- Los plugins son módulos ejecutables y **no** están aislados (sandbox).
- Las skills de agente y los archivos de instrucciones influyen en el
  comportamiento del agente y deben revisarse.
- Los exportadores de plugins pueden elegir rutas de salida.
- Los comandos normales del núcleo no requieren acceso a red.

Consulta [docs/security-model.md](../docs/security-model.md).
