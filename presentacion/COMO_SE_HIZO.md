# Cómo se hizo la presentación de ConectaPro

Este documento cuenta cómo se creó la presentación final, con qué herramientas y cómo volver a generarla. Está pensado para que **Daniel** (o cualquiera que esté aprendiendo desarrollo web y automatización con IA) pueda entender el proceso, mantener las diapositivas y repetir algo parecido en otro proyecto.

> **Alcance.** Todo lo que se afirma aquí se comprobó con los archivos de `presentacion/`, con el código del generador y con las herramientas del equipo que la creó. Lo que no se pudo confirmar se marca como tal. No hay rutas personales: donde hace falta una carpeta se usa un marcador como `<CARPETA_NODE>`.

## Índice

1. [Resultado: qué archivos hay y cómo se relacionan](#1-resultado-qué-archivos-hay-y-cómo-se-relacionan)
2. [Cómo se planificó el contenido](#2-cómo-se-planificó-el-contenido)
3. [Cómo se obtuvieron las capturas](#3-cómo-se-obtuvieron-las-capturas)
4. [Herramientas y qué hizo la IA](#4-herramientas-y-qué-hizo-la-ia)
5. [Diseño visual y las 11 diapositivas](#5-diseño-visual-y-las-11-diapositivas)
6. [Cómo evolucionó entre versiones](#6-cómo-evolucionó-entre-versiones)
7. [Cómo generar y validar de nuevo](#7-cómo-generar-y-validar-de-nuevo)
8. [Buenas prácticas reutilizables](#8-buenas-prácticas-reutilizables)
9. [Limitaciones conocidas](#9-limitaciones-conocidas)

---

## 1. Resultado: qué archivos hay y cómo se relacionan

Todo está en `presentacion/` y no forma parte de la aplicación (`frontend/` y `backend/` no se tocaron).

| Archivo | Qué es | Para qué sirve |
|---|---|---|
| `ConectaPro.pptx` | Presentación de 11 diapositivas (16:9) con notas del orador | Es **el archivo editable**: se abre con PowerPoint y es el que se proyecta |
| `ConectaPro.pdf` | Exportación del `.pptx` | **Respaldo**: se ve igual en cualquier equipo, con el enlace de la demo clicable (no lleva las notas) |
| `guion.md` | Guía de exposición | Explicaciones, **reparto de voces** entre Nicolás y Daniel, tiempos, **instrucciones operativas** de la demo y preguntas previsibles |
| `README.md` | Guía corta | Cómo abrir y presentar los archivos |
| `src/generar-presentacion.js` | Código que construye el `.pptx` | Es **la fuente**: si querés cambiar algo de forma consistente, se edita acá y se regenera |
| `assets/` | 4 capturas reales (PNG de 2880×1620) | Imágenes que usa el generador |
| `COMO_SE_HIZO.md` | Este documento | Explica el proceso |

Relación entre ellos:

```text
assets/*.png ─┐
              ├─► src/generar-presentacion.js ─► ConectaPro.pptx ─► ConectaPro.pdf
docs/ y código┘      (Node + pptxgenjs)           (editable)         (respaldo)
        │
        └─► guion.md  (lo que se dice; coincide con las notas del orador del .pptx)
```

Importante: el `.pptx` y el PDF son **generados**. Si editás el `.pptx` a mano en PowerPoint, esos cambios se pierden la próxima vez que se regenere desde el script, y el PDF queda desactualizado hasta volver a exportarlo.

---

## 2. Cómo se planificó el contenido

### 2.1 Primero se leyó el proyecto, después se escribió

Antes de crear ninguna diapositiva se inspeccionó el repositorio: `README.md`, `docs/PROYECTO.md`, `docs/MVP.md`, `docs/ARQUITECTURA.md`, `docs/ESTADO_BACKEND_MVP.md`, `docs/FLUJO_TRABAJO.md`, `docs/PLAN_6_DIAS.md`, los componentes y rutas del frontend, las rutas del backend y el historial de Git. Esa lectura definió **qué se puede afirmar**.

### 2.2 Tres categorías de afirmaciones

Al armar el contenido se separó siempre:

| Categoría | Ejemplo | Cómo se trató |
|---|---|---|
| **Implementado y verificado** | Listado, filtros, formulario validado, guardado en MySQL | Va en las diapositivas como logro |
| **Visto o reportado** | Que la demo cargó 100 perfiles; que el equipo comprobó el guardado en MySQL | Se dice quién lo comprobó («el equipo comprobó…»); las fechas y el detalle de las revisiones se dejaron fuera de las diapositivas |
| **Futuro (no implementado)** | Cuentas, panel profesional, reseñas reales, historial, pagos | Se muestra aparte, como «Próximas mejoras» |

La documentación del proyecto ya hace esa distinción (`docs/PROYECTO.md` tiene una tabla de módulos implementados y futuros); la presentación la respeta. Las cifras de pruebas (13 del backend, 8 del frontend) son las registradas en `docs/ESTADO_BACKEND_MVP.md`; **no se volvieron a ejecutar** para la presentación.

### 2.3 Decisiones editoriales

- **Problema y solución primero.** El público (el profesor y los compañeros) tiene que entender *por qué* existe ConectaPro antes de ver cómo está hecho.
- **Capturas auténticas.** Las imágenes son de la aplicación real, no maquetas.
- **Herramientas y arquitectura explicadas** (la materia es Despliegue Web): cada herramienta aparece con su función, no como lista de logotipos.
- **Resultados verificables:** tres evidencias (catálogo y filtros, validación del formulario, solicitudes guardadas en MySQL).
- **Demostración, alcance y conclusión** al final, con una pregunta abierta al público.
- **Guion equilibrado.** Nicolás explica sobre todo el problema, la interfaz y la demo; Daniel, el servidor, los datos y la conectividad. Se alternan en casi todas las diapositivas y cada uno le pasa la palabra al otro. El tiempo hablado sin la demo es parecido (≈ 4:15 y ≈ 4:05).

### 2.4 Por qué las diapositivas no llevan detalles internos

Las diapositivas están pensadas para el público, no para el equipo. Por eso se sacaron de lo visible: fechas de revisiones, «resultado reportado», parámetros y rutas de la API, códigos HTTP, instrucciones de encendido y planes de respaldo. Esos datos **no se perdieron**: están en las **notas del orador** (detalle técnico «solo si preguntan»), en la sección operativa de `guion.md` y en las preguntas previsibles.

---

## 3. Cómo se obtuvieron las capturas

Se usó **Playwright MCP**, un servidor que le permite a Claude Code controlar un navegador.

**Lo confirmado:**

- **URL:** únicamente la oficial de la demostración (la Preview de Vercel que figura en `docs/ESTADO_BACKEND_MVP.md`, sección 5.7). No se usó el dominio de producción.
- **Navegador:** Chrome en modo *headless* (sin ventana), con viewport de 1440×810 y factor de escala 2. Resultado: **PNG de 2880×1620** (16:9), verificado con Pillow.
- **Ubicación:** `presentacion/assets/`:
  - `01-inicio.png`: inicio con buscador y atajos por oficio.
  - `02-listado.png`: listado de los 100 profesionales.
  - `03-resultados-filtrados.png`: filtro por Plomería (15 resultados).
  - `04-formulario-solicitud.png`: formulario abierto y vacío.
- **Cómo se decidió qué pantallas:** se priorizó lo que sostiene la historia: listado, filtros, tarjetas con sus datos y formulario. Se descartó, por ejemplo, una captura de un filtro con un solo resultado, porque mostraba poco; se repitió con Plomería sola (15 resultados).
- **Nota sobre `04-formulario-solicitud.png`:** se tomó con un filtro de Plomería + Sajonia activo, por eso el fondo muestra «1 profesional de Plomería en Sajonia». Es la aplicación real tal cual estaba en ese momento.
- **Cómo se verificó que era la aplicación real:**
  - La página cargó desde la URL oficial con el título «ConectaPro» y 100 profesionales traídos de la API.
  - **No** aparecía el aviso «Modo demostración» que muestra el frontend cuando usa datos ficticios (`frontend/src/App.jsx`), así que no era el modo de datos simulados.
  - Los textos coinciden con el código: «Profesionales del hogar en tu barrio de Asunción», los campos y mensajes de `RequestForm.jsx`, el pie «Proyecto escolar de demostración…».
- **Cómo se evitó crear solicitudes o modificar datos:** solo se *leyó* la página (cargar, elegir filtros, abrir el formulario y cerrarlo con Escape). **Nunca se pulsó «Enviar solicitud»** ni se hizo ninguna operación de escritura. La integración ya la había probado el equipo.
- **Recorte:** en la diapositiva 4 las dos capturas se recortan (quitando los márgenes blancos laterales) para que se lean más grandes. El recorte lo hace el generador al armar la diapositiva; los archivos de `assets/` no se modifican.
- Las capturas exploratorias que el navegador guarda automáticamente quedaron en una carpeta del equipo, **fuera del repositorio**; solo las cuatro finales están en `assets/`.

No se capturaron credenciales ni datos personales: son perfiles de ejemplo y el formulario se mostró sin llenar.

---

## 4. Herramientas y qué hizo la IA

### 4.1 Necesarias para **generar** las diapositivas

| Herramienta | Para qué se usó (confirmado en el código) |
|---|---|
| **Claude Code** + **skill `pptx`** | Claude Code es el asistente de IA que trabajó en el repositorio. La skill `pptx` aporta las instrucciones y utilidades para crear presentaciones (por ejemplo, el módulo que escribe el tema de colores y fuentes en el archivo) |
| **Node.js** (se usó v24) | Ejecuta el generador (`generar-presentacion.js`) |
| **pptxgenjs** (4.0.1) | Librería de JavaScript que construye el `.pptx`: diapositivas, formas, textos, imágenes, enlaces y notas |
| **react-icons** (5.7.0) y **react** / **react-dom** (19.3.1) | `react-icons` provee los iconos (familia Feather, `react-icons/fi`). Se dibujan como SVG con `react-dom/server` y se insertan como imagen |
| **sharp** (0.35.5) | Convierte el SVG de cada icono a PNG y recorta las capturas de la diapositiva 4 |
| **Módulo `apply_theme.js` de la skill** | Al final, escribe en el archivo los colores y fuentes del tema (el generador lo carga con `require` desde una carpeta indicada por variable de entorno) |

### 4.2 Para **obtener las capturas**

| Herramienta | Uso |
|---|---|
| **Playwright MCP** | Abrir la demo y sacar las capturas (ver sección 3). Su configuración fija Chrome *headless*, el viewport y la escala |

### 4.3 Para **exportar, inspeccionar y validar** (no necesarias para generar)

| Herramienta | Uso |
|---|---|
| **Microsoft PowerPoint** + **script de PowerShell** | Exportan el `.pptx` a PDF y a una imagen PNG por diapositiva (ver sección 7). No había LibreOffice en el equipo |
| **`validate.py` de la skill** | Valida la estructura del `.pptx` («All validations PASSED!») |
| **Python** (3.14) con **python-pptx** y **Pillow** | Inspeccionar el archivo: tamaño de diapositiva, cantidad de diapositivas, layouts y dimensiones de las imágenes |
| **Scripts de comprobación temporales** (Python estándar) | Leer el XML del `.pptx` para revisar notas y enlaces, contar páginas del PDF y consultar el estado HTTP de los enlaces. Eran de uso puntual y no se guardaron en el repositorio |
| **`pdfinfo`** (Poppler) | Confirmar el número de páginas del PDF |

### 4.4 Qué hizo la IA y qué hicieron las personas

**La IA (Claude Code) hizo:** leer la documentación y el código; proponer la estructura; escribir el generador y los textos (diapositivas, notas, guion); tomar las capturas con Playwright MCP; regenerar, renderizar e inspeccionar las diapositivas; y proponer correcciones.

**Las personas hicieron:** definir los requisitos de cada versión (público, materia, nivel técnico, reparto, estilo); aportar datos que **no están en el repositorio** (por ejemplo, que el editor usado es Visual Studio Code y que existe un video de respaldo); revisar y aprobar cada versión; y decidir cuándo hacer commit y push.

**Controles necesarios.** La IA no «acierta a la primera». Hubo errores reales que se detectaron al renderizar: un subtítulo que quedó invisible por un color invertido, títulos que se partían en dos líneas, una caja que se salía de su contenedor y textos que se solapaban. Por eso cada versión se **renderizó y se miró diapositiva por diapositiva**, y se contrastaron las afirmaciones con la documentación. Nada de esto reemplaza la revisión humana: los datos externos (video, editor, verificaciones del equipo) hay que confirmarlos con quien los conoce.

---

## 5. Diseño visual y las 11 diapositivas

### 5.1 Sistema visual

- **Formato:** panorámico 16:9 (10 × 5,625 pulgadas).
- **Paleta**, tomada de la propia aplicación: azul oscuro `14275E`, azul brillante `1D4ED8`, magenta de acento `BE185D`, verde azul `0F766E` (para lo «logrado»), texto `1F2937` y gris `4B5563`, fondos claros `F4F6FA` y `DBEAFE`.
- **Tipografía:** Calibri (sans serif, viene con Office, así que se ve igual en PowerPoint). La web usa otra fuente (Figtree), que no está en el equipo.
- **Jerarquía:** títulos de 32 pt en negrita; cuerpo entre 14 y 18 pt; textos de apoyo de 12 a 13 pt; el pie de 10 pt. Pocas palabras por diapositiva.
- **Motivos repetidos:** tarjetas con esquinas redondeadas, iconos dentro de círculos de color y capturas con sombra suave. Se evitaron barras decorativas.
- **Estructura en el archivo:** tres plantillas (*layouts*): `PORTADA`, `CONTENIDO` (fondo blanco) y `OSCURA` (fondo azul; se usa en la demostración y la conclusión). La portada usa `PORTADA`, también de fondo azul. Los títulos son *placeholders*, así que se pueden editar en PowerPoint. También hay secciones (Apertura, Producto, Tecnología, Demostración, Cierre).
- **Notas del orador:** cada diapositiva lleva en sus notas quién habla, la idea, la transición al compañero y, aparte, el «detalle técnico (solo si preguntan)». Deben coincidir con `guion.md`.

### 5.2 El diagrama de arquitectura (diapositiva 7)

Se construyó con **formas editables de PowerPoint** (rectángulos redondeados y flechas), no como imagen, así que se puede retocar en PowerPoint.

Decisiones para equilibrar claridad y detalle técnico:

- **Dos bandas separadas** para no mezclar dos ideas: arriba, el *desarrollo del código* (VS Code → Git → GitHub); abajo, el *funcionamiento de la aplicación*.
- **Cinco cajas numeradas** en orden de recorrido: Navegador → Frontend → ngrok → Backend → MySQL, con flechas de doble punta (la respuesta vuelve por el mismo camino).
- **Color por función:** azul para el frontend, magenta para el túnel, azul oscuro para el backend y verde azulado para la base de datos.
- **Una etiqueta** aclara que frontend y backend son partes separadas que se comunican mediante una API.
- **ngrok aparece como un detalle** («Túnel HTTPS»), sin repetir advertencias operativas en varias diapositivas; el detalle va en las notas.
- **Qué se dejó fuera a propósito:** rutas, códigos HTTP, variables de entorno y configuraciones.

### 5.3 Las 11 diapositivas

| # | Diapositiva | Finalidad |
|---|---|---|
| 1 | Portada | Nombre, propósito en una frase, integrantes y la materia |
| 2 | El problema | Dificultades de quien busca un técnico y de quien ofrece su trabajo |
| 3 | La solución | Recorrido en tres pasos: buscar, comparar, solicitar |
| 4 | Directorio y filtros | Capturas reales del listado y del filtro; aclara que son datos de ejemplo |
| 5 | Pedir un servicio | Captura del formulario: pocos datos, revisión y confirmación |
| 6 | Con qué construimos | Herramientas agrupadas por función y las etapas del proceso |
| 7 | Del navegador a la base de datos | Arquitectura y despliegue |
| 8 | Qué conseguimos | Tres resultados concretos |
| 9 | Demostración | Enlace clicable a la demo y los tres pasos a mostrar |
| 10 | Qué hay hoy y qué viene después | Alcance actual y mejoras futuras |
| 11 | Conclusión | Idea central, trabajo en equipo y pregunta al público |

Las etapas de la diapositiva 6 (Idea y análisis → Diseño de la interfaz → Desarrollo front y back → Integración y pruebas → Publicación y demostración) se contrastaron con el historial de Git y la documentación; **no llevan fechas ni duraciones**.

---

## 6. Cómo evolucionó entre versiones

| Versión | Qué cambió | Qué se aprendió |
|---|---|---|
| **1 (10 diapositivas)** | Primera estructura completa: problema, solución, módulos, arquitectura, resultados, demo y alcance, con mucho detalle de auditoría | La estructura servía, pero el contenido estaba escrito «para el equipo»: fechas, rutas de la API, códigos HTTP y advertencias de infraestructura |
| **2** | Se simplificó el texto, se quitaron los detalles internos de lo visible y se movieron a notas y guion; se repartió mejor la exposición (cada uno habla en casi todas las diapositivas); el guion se reescribió con una sección operativa aparte; se mejoraron las capturas de la diapositiva 4 | Separar **lo que se muestra** de **lo que se sabe**; un guion corto y por ideas se practica mejor que uno largo |
| **3 (11 diapositivas)** | Se agregaron las **herramientas de desarrollo y despliegue** (VS Code, Git/GitHub, React/Vite, Laravel, MySQL, Vercel, ngrok) y las **etapas del proyecto**; el diagrama separó el *desarrollo del código* del *funcionamiento de la aplicación*; se rebalanceó el reparto | El profesor de Despliegue Web espera ver *cómo* se construye y se publica, no solo qué hace la app. Mejor explicar la función de cada herramienta que listar logotipos |
| **Ajustes finales** | La portada pasó a decir «Proyecto escolar · Despliegue Web»; Git se describe como «Registra versiones e historial de cambios»; la columna de Vercel y ngrok se llama «Publicación y conexión» | Precisar una palabra puede evitar una explicación equivocada |
| **Revisión visual (en todas)** | Tras generar, se renderizó cada diapositiva y se corrigieron colores invertidos, títulos de dos líneas, cajas desbordadas y textos apretados | Mirar las imágenes siempre encuentra algo que el código no avisa |

---

## 7. Cómo generar y validar de nuevo

### 7.1 Lo que necesitás (parte del entorno vive fuera del repositorio)

El repositorio **no** incluye `package.json` ni un instalador para la presentación: no se agregaron dependencias al proyecto. El equipo que la creó preparó el entorno en su perfil de usuario, así que en otra computadora hay que reconstruirlo.

| Necesidad | Detalle confirmado |
|---|---|
| **Node.js** | Se usó la versión 24 |
| **Paquetes de npm** | `pptxgenjs` 4.0.1, `react` y `react-dom` 19.3.1, `react-icons` 5.7.0 y `sharp` 0.35.5, instalados en una carpeta propia **fuera** del repositorio |
| **La skill `pptx`** | El generador carga `scripts/apply_theme.js` desde la carpeta de la skill. Su ubicación depende de cómo esté instalada la skill en cada equipo |
| **PowerPoint (Windows)** | Para exportar a PDF e imágenes con el script de PowerShell |
| **Python** (opcional) | Solo para validar e inspeccionar (ver 7.4) |

### 7.2 Variables de entorno del script

El generador usa **una** variable: `PPTX_SKILL_DIR`, la carpeta de la skill `pptx` (de ahí carga `scripts/apply_theme.js`, línea final del script). Además, para que Node encuentre los paquetes instalados fuera del proyecto se usó `NODE_PATH`, que apunta a la carpeta `node_modules` de esa instalación.

### 7.3 Comandos confirmados

Desde PowerShell, con las dos variables apuntando a tus carpetas:

```powershell
$env:NODE_PATH = "<CARPETA_NODE>\node_modules"       # donde están pptxgenjs, react-icons, sharp...
$env:PPTX_SKILL_DIR = "<CARPETA_DE_LA_SKILL_PPTX>"
node presentacion/src/generar-presentacion.js
```

El script escribe `presentacion/ConectaPro.pptx` y aplica el tema (mensaje «Generado: …»). Las rutas del script son relativas a su propia ubicación, así que funciona aunque lo ejecutes desde otra carpeta.

> Detalle del orden: el script **primero** guarda el `.pptx` y **después** carga `apply_theme.js`. Si `PPTX_SKILL_DIR` está mal, el archivo se genera pero sin el tema de colores y fuentes, y el script termina con error.

### 7.4 Validar y exportar

1. **Validar la estructura** (desde la carpeta de la skill; el resultado esperado es `All validations PASSED!`):

   ```powershell
   python "<CARPETA_DE_LA_SKILL_PPTX>\scripts\office\validate.py" presentacion\ConectaPro.pptx
   ```

2. **Exportar a PDF y a una imagen por diapositiva.** Se usó un script de PowerShell del equipo (no está en el repositorio) que abre el `.pptx` en PowerPoint **por COM**, en solo lectura y sin ventana, lo guarda como PDF y exporta cada diapositiva como PNG con el ancho indicado:

   ```powershell
   powershell -NoProfile -File <export-pptx.ps1> -Pptx presentacion\ConectaPro.pptx -OutDir <CARPETA_TEMPORAL> -Width 1600
   ```

   Genera `ConectaPro.pdf` y `slide-01.png … slide-11.png` (se usó 1600 px de ancho para revisar). El PDF resultante se copió a `presentacion/ConectaPro.pdf`; las imágenes de revisión **no** se guardan en el repositorio.

   Lo que hace ese script, por si necesitás reescribirlo: crea el objeto `PowerPoint.Application`, abre el archivo (`Presentations.Open` en solo lectura y sin ventana), guarda con `SaveAs(<pdf>, 32)` (32 = PDF) y recorre las diapositivas con `Slide.Export(<png>, 'PNG', ancho, alto)`.

3. **Revisión visual (obligatoria):** abrir las imágenes y mirar **todas** las diapositivas. Buscar texto cortado o desbordado, solapamientos, tamaños muy pequeños, imágenes deformadas y flechas confusas.

4. **Revisión técnica:** comprobar que el PDF tenga 11 páginas (`pdfinfo`), que las notas del orador estén en su diapositiva y coincidan con `guion.md`, y que el enlace de la demo sea clicable (en el `.pptx` y en el PDF) y responda.

5. **Git:** ejecutar `git diff --check` y confirmar que no cambió ningún archivo de la aplicación.

### 7.5 Problemas que podés encontrar en un equipo nuevo

- **`Cannot find module 'pptxgenjs'`:** falta instalar los paquetes o `NODE_PATH` no apunta a su `node_modules`.
- **Error al cargar `apply_theme.js`:** `PPTX_SKILL_DIR` no está definida o apunta a otra carpeta (ver el detalle del orden en 7.3).
- **`sharp` no funciona:** es un paquete con componentes nativos; se instala por sistema operativo y versión de Node, no se copia de otra máquina.
- **`EBUSY: resource busy or locked` al escribir el `.pptx`:** otro programa tiene el archivo abierto (PowerPoint, una vista previa o el antivirus). Cerralo y reintentá; en este trabajo fue un bloqueo pasajero.
- **Sin PowerPoint no funciona la exportación por COM.** La skill documenta una alternativa con LibreOffice (`soffice`), pero **no se probó** en este trabajo porque no estaba instalado.
- **Python en Windows:** el módulo de Pillow o python-pptx puede no verse si se ejecuta con el modo aislado (`-I`), que ignora los paquetes instalados por usuario. Y para imprimir tildes en la consola conviene `python -X utf8`.
- **Ejecución de scripts `.ps1`:** si la política de PowerShell lo bloquea, ejecutarlo con `powershell -NoProfile -File …` como arriba o ajustar la política según las normas del equipo.

### 7.6 Limitación y propuesta para hacerlo reproducible

**Limitación:** hoy no existe un instalador reproducible desde cero. El script depende de carpetas del perfil del equipo original (paquetes de Node, la skill y el script de exportación).

**Propuesta (sin instalar ni cambiar nada ahora):**

1. Agregar un `presentacion/package.json` privado con las dependencias y un `package-lock.json`, para instalar con `npm install` dentro de `presentacion/` (y listar `node_modules/` en `.gitignore`). Así desaparecería la necesidad de `NODE_PATH`.
2. Reemplazar la carga de `apply_theme.js` de la skill por una pequeña función propia dentro del repositorio (o documentar qué versión de la skill se necesita), para quitar `PPTX_SKILL_DIR`.
3. Guardar el script de exportación a PDF/PNG dentro del repositorio (por ejemplo en `presentacion/herramientas/`) y documentar que requiere PowerPoint en Windows.
4. Agregar un comando único (por ejemplo `npm run generar`) que ejecute el generador.
5. Quitar del comentario inicial del script la ruta local de ejemplo y dejar solo marcadores como los de este documento.

Cada punto es independiente: se puede hacer uno solo y ya mejora.

---

## 8. Buenas prácticas reutilizables

1. **Inspeccioná antes de crear.** Leé la documentación y el código primero; el contenido se apoya en eso, no en lo que «suena razonable».
2. **Usá capturas auténticas** de la aplicación real, y verificá que lo sean (URL, textos, ausencia de modo simulado).
3. **Separá tres cosas:** datos confirmados, inferencias y funciones futuras. Decí quién comprobó cada cosa.
4. **Diapositivas visuales y material de apoyo detallado:** lo visible es corto; lo profundo va en las notas, el guion y las preguntas previsibles.
5. **Generá desde código** (como este script): los cambios de color, textos o estructura se aplican a todas las diapositivas de forma consistente y se pueden revisar en Git.
6. **Renderizá y mirá todas las diapositivas** antes de entregar; corregí desbordes, solapamientos y tamaños pequeños. Mirá también las diapositivas que *no* tocaste, por si hubo regresiones.
7. **Comprobá el PDF, los enlaces y las notas:** número de páginas, enlace clicable y que cada nota corresponda a su diapositiva.
8. **Mantené el guion practicable:** ideas y transiciones, no discursos para memorizar; y reparto equilibrado entre quienes exponen.
9. **No modifiques el producto** cuando el trabajo es documental: antes de cada commit, revisá que el cambio incluya solo lo previsto (`git diff --cached --name-only` y `git diff --check`).
10. **No afirmes que algo pasó si no se ejecutó.** Si no se repitió una prueba, decilo.

---

## 9. Limitaciones conocidas

- **Dependencias fuera del repositorio:** los paquetes de Node, la skill `pptx` y el script de exportación se prepararon en el perfil del equipo que creó la presentación. En otro equipo hay que reconstruirlos (ver 7.1 y 7.6).
- **El generador depende de la skill:** carga `apply_theme.js` desde `PPTX_SKILL_DIR`.
- **Exportación con PowerPoint:** el PDF y las imágenes se obtuvieron con PowerPoint (COM de Windows). No se probó otra vía.
- **Sin QR:** la diapositiva de la demo no incluye código QR porque no había una herramienta disponible sin instalar dependencias.
- **Datos que no constan en el repositorio:** el uso de Visual Studio Code y la existencia del video de respaldo los aportó el equipo; el video no está en el repositorio. El colegio no figura en la portada.
- **Pruebas no repetidas:** las cifras de pruebas automáticas son las registradas en `docs/ESTADO_BACKEND_MVP.md`; no se volvieron a ejecutar para este material.
- **La demo depende del servidor del equipo:** para que la demostración en vivo muestre profesionales tienen que estar encendidos MySQL, Laravel y ngrok (ver la sección operativa de `guion.md`).
- **Capturas con fecha:** se tomaron en octubre de 2026; si cambia la interfaz o los datos, hay que repetirlas.
- **Comentario con ruta local:** el comentario inicial de `src/generar-presentacion.js` contiene una ruta de ejemplo del equipo original; no es portable y conviene reemplazarla (propuesta 5 de la sección 7.6).
