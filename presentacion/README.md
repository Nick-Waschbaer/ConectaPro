# Presentación final de ConectaPro

Material para la exposición. No forma parte de la aplicación (`frontend/` y `backend/` no se modificaron).

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `ConectaPro.pptx` | Presentación editable (11 diapositivas, 16:9) con notas del orador |
| `ConectaPro.pdf` | Copia de respaldo; el enlace de la demo es clicable |
| `guion.md` | Guía para exponer (Nicolás y Daniel se alternan), sección operativa aparte y preguntas frecuentes con respuestas técnicas |
| `assets/` | Capturas reales de la demo oficial (4 imágenes PNG de 2880×1620) |
| `src/generar-presentacion.js` | Código que genera el `.pptx` (por si hay que rehacerlo) |

## Cómo presentar

1. Abrir `ConectaPro.pptx` con PowerPoint. Ver las notas con *Vista → Notas* o en la vista del presentador (Alt+F5 en Windows). Si no hay PowerPoint, usar `ConectaPro.pdf` (sin notas).
2. Leer la **«Sección operativa»** de `guion.md` (no se dice al público): el servidor (MySQL, Laravel y ngrok) tiene que estar encendido en la laptop de Daniel para que la demo muestre profesionales, y ahí está el plan si la demo falla.
3. En la diapositiva 9 el enlace abre la demo oficial: <https://conecta-pro-git-feat-frontend-angi-redesign-goldbaeren.vercel.app>. No usar el dominio de producción (`conecta-pro-psi.vercel.app`).
4. Tener a mano el **video de respaldo**. El video **no está en este repositorio**; lo grabó el equipo y hay que guardarlo en la computadora que se use para exponer.

## Para revisar antes de entregar

- **Colegio:** no consta en la documentación del repositorio, por eso la portada solo dice «Proyecto escolar · Despliegue Web». Si el profesor lo pide, añadirlo en la diapositiva 1 (en PowerPoint o en `src/generar-presentacion.js`).
- **Visual Studio Code:** aparece en las diapositivas 6 y 7 porque el equipo lo indica como editor de desarrollo; no consta en la documentación del repositorio.
- **Etapas del proyecto** (diapositiva 6): se apoyan en el historial de Git y en la documentación; no se indican fechas ni duraciones.
- **Código QR:** la diapositiva 9 no lo incluye porque no hay una herramienta de QR disponible sin instalar dependencias. Si lo quieren, se puede añadir una imagen generada por ustedes con el enlace de la demo.
- **Fecha de las capturas:** se tomaron de la demo oficial al preparar la presentación (octubre de 2026). Si cambia la interfaz o los datos, repetirlas.
- Las cifras de las pruebas (13 del backend, 8 del frontend) son las registradas en `docs/ESTADO_BACKEND_MVP.md`; no se volvieron a ejecutar para este material.

## Regenerar la presentación (opcional)

El script usa `pptxgenjs`, `react-icons`, `sharp` y la skill `pptx`, **instalados fuera del repositorio** (no se añadieron dependencias al proyecto). En PowerShell, desde la raíz del repositorio:

```powershell
$env:NODE_PATH = "<carpeta con node_modules de pptxgenjs>"
$env:PPTX_SKILL_DIR = "<carpeta de la skill pptx>"
node presentacion/src/generar-presentacion.js
```

El PDF se exportó con PowerPoint (no hay LibreOffice en el equipo).
