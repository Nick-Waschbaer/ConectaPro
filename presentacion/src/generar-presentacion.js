// Genera presentacion/ConectaPro.pptx con pptxgenjs (versión 3).
// Uso (desde la raíz del repositorio, en PowerShell):
//   $env:NODE_PATH = "C:\Users\maxic\.claude\tools\pptx-node\node_modules"
//   $env:PPTX_SKILL_DIR = "<carpeta de la skill pptx>"
//   node presentacion/src/generar-presentacion.js
// Las dependencias (pptxgenjs, react-icons, sharp...) NO forman parte del proyecto:
// viven fuera del repositorio. Ver presentacion/README.md.
const path = require('path')
const fs = require('fs')
const pptxgen = require('pptxgenjs')
const React = require('react')
const ReactDOMServer = require('react-dom/server')
const sharp = require('sharp')
const fi = require('react-icons/fi')

const ASSETS = path.join(__dirname, '..', 'assets')
const OUT = path.join(__dirname, '..', 'ConectaPro.pptx')
const DEMO_URL = 'https://conecta-pro-git-feat-frontend-angi-redesign-goldbaeren.vercel.app'
const REPO_URL = 'https://github.com/Nick-Waschbaer/ConectaPro'

// Paleta tomada de la propia aplicación (azul marino, azul de acción y magenta de acento).
const NAVY = '14275E'
const BLUE = '1D4ED8'
const PINK = 'BE185D'
const TEAL = '0F766E'
const INK = '1F2937'
const MUTED = '4B5563'
const LIGHT = 'F4F6FA'
const BORDER = 'D9DEE8'
const ICE = 'DBEAFE'
const WHITE = 'FFFFFF'
const FONT = 'Calibri'

const THEME = {
  name: 'ConectaPro',
  headFontFace: FONT,
  bodyFontFace: FONT,
  colors: {
    dk1: INK, lt1: WHITE, dk2: NAVY, lt2: LIGHT,
    accent1: BLUE, accent2: PINK, accent3: TEAL, accent4: '92400E', accent5: '64748B', accent6: '93C5FD',
    hlink: 'BFDBFE', folHlink: 'C4B5FD',
  },
}

async function icon(name, color, size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(fi[name], { color: '#' + color, size: String(size) }))
  const buf = await sharp(Buffer.from(svg)).png().toBuffer()
  return 'image/png;base64,' + buf.toString('base64')
}

// Círculo de color con un icono dentro (motivo visual repetido en todo el documento).
async function iconBadge(pres, slide, name, x, y, d, bg, fg, objectName) {
  slide.addShape(pres.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: bg }, line: { color: bg }, objectName: objectName + ' fondo' })
  const s = d * 0.5
  slide.addImage({ data: await icon(name, fg), x: x + (d - s) / 2, y: y + (d - s) / 2, w: s, h: s, altText: objectName, objectName })
}

const shot = (file) => path.join(ASSETS, file)
const SHADOW = () => ({ type: 'outer', color: '000000', opacity: 0.2, blur: 8, offset: 3, angle: 90 })

// Recorta los márgenes laterales de una captura real (no altera su contenido) para mostrarla más grande.
async function recorte(file, left, top, width, height) {
  const buf = await sharp(shot(file)).extract({ left, top, width, height }).png().toBuffer()
  return 'image/png;base64,' + buf.toString('base64')
}

async function main() {
  for (const f of ['01-inicio.png', '02-listado.png', '03-resultados-filtrados.png', '04-formulario-solicitud.png']) {
    if (!fs.existsSync(shot(f))) throw new Error('Falta la captura ' + f + ' en presentacion/assets/')
  }

  const pres = new pptxgen()
  pres.layout = 'LAYOUT_16x9' // 10" x 5.625"
  pres.title = 'ConectaPro — presentación final'
  pres.author = 'Nicolás y Daniel'
  pres.subject = 'Proyecto escolar de Despliegue Web: marketplace de servicios del hogar'
  pres.theme = { headFontFace: FONT, bodyFontFace: FONT }

  // ---- Plantillas (layouts) ----
  pres.defineSlideMaster({ title: 'PORTADA', background: { color: NAVY }, objects: [] })
  pres.defineSlideMaster({
    title: 'CONTENIDO',
    background: { color: WHITE },
    objects: [
      { text: { text: 'ConectaPro', options: { x: 0.5, y: 5.2, w: 4, h: 0.3, fontFace: FONT, fontSize: 10, color: MUTED, margin: 0, isTextBox: true } } },
      { placeholder: { options: { name: 'title', type: 'title', x: 0.5, y: 0.3, w: 9, h: 0.8, fontFace: FONT, fontSize: 32, bold: true, color: NAVY, align: 'left', valign: 'middle', margin: 0 }, text: '' } },
    ],
    slideNumber: { x: 9.0, y: 5.2, w: 0.5, h: 0.3, fontFace: FONT, fontSize: 10, color: MUTED, align: 'right' },
  })
  pres.defineSlideMaster({
    title: 'OSCURA',
    background: { color: NAVY },
    objects: [
      { text: { text: 'ConectaPro', options: { x: 0.5, y: 5.2, w: 4, h: 0.3, fontFace: FONT, fontSize: 10, color: 'C7D2FE', margin: 0, isTextBox: true } } },
      { placeholder: { options: { name: 'title', type: 'title', x: 0.5, y: 0.3, w: 9, h: 0.8, fontFace: FONT, fontSize: 32, bold: true, color: WHITE, align: 'left', valign: 'middle', margin: 0 }, text: '' } },
    ],
    slideNumber: { x: 9.0, y: 5.2, w: 0.5, h: 0.3, fontFace: FONT, fontSize: 10, color: 'C7D2FE', align: 'right' },
  })

  const T = (slide, text, opts) => slide.addText(text, { fontFace: FONT, isTextBox: true, margin: 0, ...opts })
  const card = (slide, x, y, w, h, name, fill = LIGHT) =>
    slide.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.12, fill: { color: fill }, line: { color: BORDER, width: 0.75 }, objectName: name })

  // =========================================================
  // 1. Portada — NICOLÁS y DANIEL
  // =========================================================
  {
    pres.addSection({ title: 'Apertura' })
    const s = pres.addSlide({ masterName: 'PORTADA', sectionTitle: 'Apertura' })
    T(s, 'PROYECTO ESCOLAR · DESPLIEGUE WEB', { x: 0.6, y: 0.95, w: 4.4, h: 0.3, fontSize: 13, bold: true, color: '93C5FD', charSpacing: 2, objectName: 'Etiqueta' })
    T(s, 'ConectaPro', { x: 0.6, y: 1.4, w: 4.3, h: 0.95, fontSize: 54, bold: true, color: WHITE, objectName: 'Título' })
    T(s, 'Conecta a personas que necesitan un técnico del hogar con profesionales independientes', {
      x: 0.6, y: 2.5, w: 4.2, h: 1.2, fontSize: 20, color: ICE, valign: 'top', objectName: 'Propósito',
    })
    T(s, 'Nicolás  ·  Daniel', { x: 0.6, y: 4.1, w: 4.2, h: 0.5, fontSize: 20, bold: true, color: WHITE, objectName: 'Integrantes' })
    s.addImage({ path: shot('01-inicio.png'), x: 5.1, y: 1.4, w: 4.4, h: 2.475, altText: 'Captura real de la página de inicio de ConectaPro con el buscador por servicio y barrio', objectName: 'Captura inicio', shadow: { type: 'outer', color: '000000', opacity: 0.35, blur: 12, offset: 4, angle: 90 } })
    s.addNotes(
      'HABLAN: NICOLÁS (≈15 s) y DANIEL (≈15 s).\n' +
      'Nicolás: saluda y presenta a los dos y dice que es el proyecto de Despliegue Web.\n' +
      'Daniel: en una frase, qué es ConectaPro (conecta a personas que necesitan un técnico del hogar con profesionales independientes de Asunción) y anticipa el recorrido: problema, solución, con qué lo construimos, cómo funciona y demostración.\n' +
      'Detalle: la captura es la pantalla real de inicio de la aplicación.',
    )
  }

  // =========================================================
  // 2. El problema — NICOLÁS → DANIEL
  // =========================================================
  {
    const s = pres.addSlide({ masterName: 'CONTENIDO', sectionTitle: 'Apertura' })
    T(s, 'Encontrar un técnico de confianza no es fácil', { placeholder: 'title' })
    const cols = [
      { x: 0.5, ic: 'FiUser', head: 'Si necesitás un técnico', lines: ['Dependés del boca a boca o de buscar en redes sociales', 'Cuesta comparar opciones y saber en quién confiar'] },
      { x: 5.1, ic: 'FiTool', head: 'Si ofrecés tu trabajo', lines: ['Tenés poca visibilidad si trabajás de forma independiente', 'Tenés pocos canales digitales para conseguir clientes'] },
    ]
    for (let i = 0; i < cols.length; i++) {
      const c = cols[i]
      card(s, c.x, 1.4, 4.4, 3.4, 'Tarjeta ' + c.head)
      await iconBadge(pres, s, c.ic, c.x + 0.3, 1.65, 0.7, i === 0 ? BLUE : PINK, WHITE, 'Icono ' + c.head)
      T(s, c.head, { x: c.x + 1.15, y: 1.65, w: 3.1, h: 0.7, fontSize: 20, bold: true, color: NAVY, valign: 'middle', objectName: c.head })
      c.lines.forEach((l, j) => {
        T(s, l, { x: c.x + 0.35, y: 2.65 + j * 1.05, w: 3.7, h: 0.9, fontSize: 18, color: INK, valign: 'top', objectName: 'Punto ' + (i + 1) + '.' + (j + 1) })
      })
    }
    s.addNotes(
      'HABLAN: NICOLÁS (≈30 s) y DANIEL (≈20 s).\n' +
      'Nicolás (columna izquierda, quien busca): cuando se rompe una canilla o falla la luz, mucha gente depende del boca a boca o de buscar en redes sociales. Cuesta comparar opciones y saber en quién confiar. Transición: «Y del otro lado también hay un problema. Daniel…»\n' +
      'Daniel (columna derecha, quien ofrece el servicio): un electricista o un plomero que trabaja solo tiene poca visibilidad y pocos canales digitales para conseguir clientes. Transición: «Entonces pensamos en un lugar donde los dos se encuentren. Nico, ¿cómo funciona?»\n' +
      'Nota: son los problemas que identificamos en el proyecto, no un estudio de mercado; por eso no mostramos estadísticas.',
    )
  }

  // =========================================================
  // 3. La solución — NICOLÁS → DANIEL
  // =========================================================
  {
    pres.addSection({ title: 'Producto' })
    const s = pres.addSlide({ masterName: 'CONTENIDO', sectionTitle: 'Producto' })
    T(s, 'ConectaPro: buscar, comparar y solicitar', { placeholder: 'title' })
    const steps = [
      ['FiSearch', 'Buscá', 'Elegí el servicio y tu barrio'],
      ['FiList', 'Compará', 'Mirá oficio, barrio y valoración'],
      ['FiSend', 'Solicitá', 'Pedile el trabajo al profesional'],
    ]
    for (let i = 0; i < steps.length; i++) {
      const y = 1.45 + i * 1.2
      await iconBadge(pres, s, steps[i][0], 0.5, y, 0.85, i === 2 ? PINK : BLUE, WHITE, 'Icono ' + steps[i][1])
      T(s, steps[i][1], { x: 1.6, y: y + 0.0, w: 3.1, h: 0.45, fontSize: 24, bold: true, color: NAVY, valign: 'middle', objectName: 'Paso ' + (i + 1) })
      T(s, steps[i][2], { x: 1.6, y: y + 0.45, w: 3.1, h: 0.4, fontSize: 16, color: MUTED, valign: 'top', objectName: 'Detalle paso ' + (i + 1) })
    }
    s.addImage({ path: shot('01-inicio.png'), x: 5.0, y: 1.45, w: 4.5, h: 2.53, altText: 'Captura real de la página de inicio: título, buscador por servicio y barrio y atajos por oficio', objectName: 'Captura inicio', shadow: SHADOW() })
    T(s, 'Así se ve ConectaPro al entrar', { x: 5.0, y: 4.1, w: 4.5, h: 0.35, fontSize: 14, color: MUTED, objectName: 'Pie de captura' })
    s.addNotes(
      'HABLAN: DANIEL (≈15 s) y NICOLÁS (≈25 s).\n' +
      'Daniel: entonces ConectaPro es un lugar donde buscás, comparás y pedís un servicio en tres pasos. Detrás de la pantalla hay un servidor que guarda los profesionales y recibe los pedidos, pero eso lo vemos más adelante. Transición: «Nico, mostrales cómo se usa.»\n' +
      'Nicolás: la idea es un recorrido simple. Buscás el servicio que necesitás y tu barrio; comparás profesionales; y le pedís el trabajo a uno. Esa pantalla es la real: la diseñé para que se entienda sin explicaciones.',
    )
  }

  // =========================================================
  // 4. Directorio y filtros — NICOLÁS → DANIEL
  // =========================================================
  {
    const s = pres.addSlide({ masterName: 'CONTENIDO', sectionTitle: 'Producto' })
    T(s, 'Un directorio para comparar y elegir', { placeholder: 'title' })
    const imgs = [
      ['02-listado.png', 'Profesionales de distintos oficios y barrios', 'Captura real del listado de profesionales con oficio, barrio, valoración y botón Solicitar servicio'],
      ['03-resultados-filtrados.png', 'Resultados acotados por servicio', 'Captura real de los resultados filtrados por Plomería, con el enlace Quitar filtros'],
    ]
    for (let i = 0; i < imgs.length; i++) {
      const x = 0.5 + i * 4.6
      // Se recortan los márgenes blancos (x 270–2610 px de 2880) y se conserva la proporción 16:9.
      s.addImage({ data: await recorte(imgs[i][0], 270, 0, 2340, 1316), x, y: 1.3, w: 4.4, h: 2.475, altText: imgs[i][2], objectName: 'Captura ' + (i + 1), shadow: SHADOW() })
      T(s, imgs[i][1], { x, y: 3.9, w: 4.4, h: 0.4, fontSize: 16, bold: true, color: NAVY, valign: 'top', objectName: 'Pie de captura ' + (i + 1) })
    }
    s.addShape(pres.ShapeType.roundRect, { x: 0.5, y: 4.4, w: 9, h: 0.6, rectRadius: 0.1, fill: { color: ICE }, line: { color: ICE }, objectName: 'Datos fondo' })
    T(s, [
      { text: 'Datos de ejemplo de esta versión:  ', options: { color: MUTED } },
      { text: '100 perfiles', options: { bold: true, color: NAVY } },
      { text: '  ·  ', options: { color: MUTED } },
      { text: '7 oficios', options: { bold: true, color: NAVY } },
      { text: '  ·  ', options: { color: MUTED } },
      { text: '10 barrios', options: { bold: true, color: NAVY } },
    ], { x: 0.5, y: 4.4, w: 9, h: 0.6, fontSize: 16, align: 'center', valign: 'middle', objectName: 'Datos del catálogo' })
    s.addNotes(
      'HABLAN: DANIEL (≈15 s) y NICOLÁS (≈30 s).\n' +
      'Daniel: lo primero que ve la persona es un directorio. Esos profesionales son perfiles de ejemplo que cargamos en la base de datos para poder probar: 100 profesionales, 7 oficios y 10 barrios, con valoraciones también de ejemplo. El navegador se los pide al servidor. Transición: «Nico, mostrales cómo se ve.»\n' +
      'Nicolás: a la izquierda, el directorio: cada profesional muestra su nombre, oficio, barrio y una valoración. A la derecha, al elegir un servicio —por ejemplo Plomería— la lista se acota; también se puede filtrar por barrio, y hay un botón para quitar los filtros. Siempre se muestra algo claro: cargando, sin resultados o un aviso si no hay conexión.\n' +
      'Detalle técnico (solo si preguntan): el filtro por servicio lo resuelve la API con un parámetro; el filtro por barrio se aplica en el navegador sobre la lista recibida (decisión de simplicidad del MVP; la API también lo admite pero el frontend no lo usa).',
    )
  }

  // =========================================================
  // 5. Solicitud de servicio — NICOLÁS → DANIEL
  // =========================================================
  {
    const s = pres.addSlide({ masterName: 'CONTENIDO', sectionTitle: 'Producto' })
    T(s, 'Pedir un servicio, paso a paso', { placeholder: 'title' })
    s.addImage({ path: shot('04-formulario-solicitud.png'), x: 0.5, y: 1.3, w: 5.2, h: 2.925, altText: 'Captura real del formulario Solicitar servicio con los campos nombre, teléfono, barrio y descripción, sin enviar', objectName: 'Captura formulario', shadow: SHADOW() })
    T(s, 'Solo se pide el barrio, no tu dirección exacta', { x: 0.5, y: 4.4, w: 5.2, h: 0.4, fontSize: 14, color: MUTED, objectName: 'Pie de captura' })
    const pts = [
      ['FiEdit3', 'Pocos datos', 'Nombre, teléfono, barrio y qué necesitás', BLUE],
      ['FiShield', 'Datos revisados', 'El sistema avisa qué corregir antes de guardar', BLUE],
      ['FiCheckCircle', 'Solicitud confirmada', 'Cuando el servidor la acepta, queda registrada', TEAL],
    ]
    for (let i = 0; i < pts.length; i++) {
      const y = 1.35 + i * 1.2
      await iconBadge(pres, s, pts[i][0], 6.0, y, 0.65, pts[i][3], WHITE, 'Icono ' + pts[i][1])
      T(s, pts[i][1], { x: 6.85, y: y - 0.03, w: 2.65, h: 0.4, fontSize: 18, bold: true, color: INK, valign: 'top', objectName: pts[i][1] })
      T(s, pts[i][2], { x: 6.85, y: y + 0.38, w: 2.65, h: 0.7, fontSize: 14, color: MUTED, valign: 'top', objectName: 'Detalle ' + pts[i][1] })
    }
    s.addNotes(
      'HABLAN: NICOLÁS (≈30 s) y DANIEL (≈25 s).\n' +
      'Nicolás: este es el formulario que se abre al elegir «Solicitar servicio». Pide pocos datos: nombre, teléfono, barrio y qué necesitás. Por privacidad pedimos solo el barrio, no la dirección. Si algo está mal o falta, la pantalla lo marca y explica qué corregir. Transición: «Daniel, ¿qué pasa cuando la persona aprieta Enviar?»\n' +
      'Daniel: el servidor vuelve a revisar todos los datos, porque no podemos confiar solo en el navegador. Si están bien, guarda la solicitud en la base de datos como pendiente y le avisa a la interfaz; recién ahí la persona ve la confirmación con un número de solicitud.\n' +
      'Detalle técnico (solo si preguntan): validación en el navegador y definitiva en Laravel; los errores vuelven con HTTP 422 y un mensaje por campo; una solicitud aceptada responde HTTP 201 y la interfaz solo confirma con esa respuesta; el cliente no puede forzar el estado: el servidor lo fija en «pending».',
    )
  }

  // =========================================================
  // 6. Herramientas y proceso de desarrollo — NICOLÁS → DANIEL
  // =========================================================
  {
    pres.addSection({ title: 'Tecnología' })
    const s = pres.addSlide({ masterName: 'CONTENIDO', sectionTitle: 'Tecnología' })
    T(s, 'Con qué construimos ConectaPro', { placeholder: 'title' })
    const groups = [
      { name: 'Desarrollo', color: NAVY, items: [['Visual Studio Code', 'Donde escribimos el código'], ['Git', 'Registra versiones e historial de cambios'], ['GitHub', 'Repositorio compartido del equipo']] },
      { name: 'Interfaz', color: BLUE, items: [['React', 'Arma la pantalla en piezas'], ['Vite', 'Prepara la web para el navegador'], ['HTML, CSS y JavaScript', 'Estructura, estilo y comportamiento']] },
      { name: 'Servidor y datos', color: PINK, items: [['PHP y Laravel', 'Reciben y validan los pedidos'], ['MySQL', 'Guarda las solicitudes']] },
      { name: 'Publicación y conexión', color: TEAL, items: [['Vercel', 'Publica la interfaz en internet'], ['ngrok', 'Conecta la web con el servidor']] },
    ]
    // Anchos distintos: la columna de la interfaz necesita más espacio para «HTML, CSS y JavaScript».
    const widths = [2.0, 2.45, 1.9, 2.2]
    let gx = 0.5
    for (let i = 0; i < groups.length; i++) {
      const g = groups[i]
      const x = gx
      const w = widths[i]
      gx += w + 0.15
      card(s, x, 1.2, w, 3.05, 'Grupo ' + g.name)
      s.addShape(pres.ShapeType.roundRect, { x, y: 1.2, w, h: 0.45, rectRadius: 0.12, fill: { color: g.color }, line: { color: g.color }, objectName: 'Cabecera ' + g.name })
      T(s, g.name, { x, y: 1.2, w, h: 0.45, fontSize: 14, bold: true, color: WHITE, align: 'center', valign: 'middle', objectName: 'Título ' + g.name })
      g.items.forEach((it, j) => {
        const y = 1.76 + j * 0.8
        T(s, it[0], { x: x + 0.15, y, w: w - 0.25, h: 0.3, fontSize: 14, bold: true, color: INK, valign: 'top', objectName: it[0] })
        T(s, it[1], { x: x + 0.15, y: y + 0.31, w: w - 0.25, h: 0.42, fontSize: 13, color: MUTED, valign: 'top', objectName: 'Función ' + it[0] })
      })
    }
    T(s, 'Cómo fue el proceso', { x: 0.5, y: 4.3, w: 4, h: 0.22, fontSize: 12, bold: true, color: MUTED, objectName: 'Etiqueta proceso' })
    const phases = ['Idea y análisis', 'Diseño de la interfaz', 'Desarrollo front y back', 'Integración y pruebas', 'Publicación y demostración']
    phases.forEach((p, i) => {
      const x = 0.5 + i * 1.78
      s.addShape(pres.ShapeType.chevron, { x, y: 4.56, w: 1.85, h: 0.55, fill: { color: i === 4 ? PINK : BLUE }, line: { color: WHITE, width: 1 }, objectName: 'Etapa ' + (i + 1) + ' fondo' })
      T(s, p, { x: x + 0.36, y: 4.56, w: 1.15, h: 0.55, fontSize: 12, bold: true, color: WHITE, align: 'center', valign: 'middle', objectName: 'Etapa ' + (i + 1) })
    })
    s.addNotes(
      'HABLAN: NICOLÁS (≈35 s) y DANIEL (≈40 s).\n' +
      'Nicolás: para construir ConectaPro usamos herramientas con funciones distintas. Escribimos el código en Visual Studio Code. Git registra versiones e historial de cambios y GitHub es el repositorio compartido donde trabajamos los dos, con ramas y revisión del trabajo del compañero. La interfaz está hecha con React, que arma la pantalla en piezas; Vite la prepara para que corra en el navegador; y debajo están las bases de la web: HTML para la estructura, CSS para el estilo y JavaScript para el comportamiento. Transición: «Daniel, ¿y del lado del servidor?»\n' +
      'Daniel: el servidor está hecho en PHP con Laravel, que recibe los pedidos y los valida; los datos se guardan en MySQL. Para publicar: la interfaz está en Vercel y usamos ngrok para que ese sitio público pueda hablar con nuestro servidor. Y el proceso fue en etapas: partimos de la idea y el análisis, diseñamos la interfaz, desarrollamos frontend y backend, los integramos y probamos, y por último publicamos y preparamos la demostración.\n' +
      'Detalle (solo si preguntan): las etapas se apoyan en el historial del repositorio y la documentación: documentación inicial; interfaz y sus rediseños; backend con MySQL; verificación con MySQL y con Vercel + ngrok; documentación final. No fijamos fechas ni duraciones. Visual Studio Code es el editor que usó el equipo (no consta en la documentación del repositorio). El frontend usa CSS propio y JavaScript con JSX; no usamos frameworks de CSS.',
    )
  }

  // =========================================================
  // 7. Arquitectura y despliegue — NICOLÁS (intro) → DANIEL
  // =========================================================
  {
    const s = pres.addSlide({ masterName: 'CONTENIDO', sectionTitle: 'Tecnología' })
    T(s, 'Del navegador a la base de datos', { placeholder: 'title' })

    // Banda 1: desarrollo y gestión del código.
    s.addShape(pres.ShapeType.roundRect, { x: 0.5, y: 1.2, w: 9, h: 0.95, rectRadius: 0.1, fill: { color: LIGHT }, line: { color: BORDER, width: 0.75 }, objectName: 'Banda código' })
    T(s, 'DESARROLLO DEL CÓDIGO', { x: 0.7, y: 1.27, w: 4, h: 0.25, fontSize: 11, bold: true, color: MUTED, charSpacing: 2, objectName: 'Etiqueta banda código' })
    const dev = [['Visual Studio Code', 'escribimos'], ['Git', 'versionamos'], ['GitHub', 'compartimos']]
    dev.forEach((d, i) => {
      const x = 0.7 + i * 2.05
      s.addShape(pres.ShapeType.roundRect, { x, y: 1.57, w: 1.75, h: 0.46, rectRadius: 0.08, fill: { color: WHITE }, line: { color: NAVY, width: 1.25 }, objectName: 'Herramienta ' + d[0] })
      T(s, [{ text: d[0], options: { bold: true, color: NAVY, breakLine: false } }], { x, y: 1.57, w: 1.75, h: 0.46, fontSize: 13, align: 'center', valign: 'middle', objectName: 'Texto ' + d[0] })
      if (i < 2) s.addShape(pres.ShapeType.line, { x: x + 1.78, y: 1.8, w: 0.24, h: 0, line: { color: NAVY, width: 2, endArrowType: 'triangle' }, objectName: 'Flecha código ' + (i + 1) })
    })
    T(s, 'Vercel publica la interfaz a partir de GitHub', { x: 7.0, y: 1.57, w: 2.4, h: 0.46, fontSize: 12, italic: true, color: MUTED, valign: 'middle', objectName: 'Nota publicación' })
    s.addShape(pres.ShapeType.line, { x: 6.62, y: 1.8, w: 0.3, h: 0, line: { color: TEAL, width: 2, endArrowType: 'triangle', dashType: 'dash' }, objectName: 'Flecha a Vercel' })

    // Banda 2: funcionamiento de la aplicación.
    s.addShape(pres.ShapeType.roundRect, { x: 0.5, y: 2.3, w: 9, h: 2.75, rectRadius: 0.1, fill: { color: WHITE }, line: { color: BLUE, width: 1.25 }, objectName: 'Banda aplicación' })
    T(s, 'FUNCIONAMIENTO DE LA APLICACIÓN', { x: 0.7, y: 2.37, w: 5, h: 0.25, fontSize: 11, bold: true, color: BLUE, charSpacing: 2, objectName: 'Etiqueta banda aplicación' })
    const boxes = [
      ['FiUsers', 'Navegador', 'La persona abre la web', WHITE, INK, 1.5],
      ['FiMonitor', 'Frontend', 'React + Vite, en Vercel', BLUE, WHITE, 1.8],
      ['FiLink', 'ngrok', 'Túnel HTTPS', PINK, WHITE, 1.3],
      ['FiServer', 'Backend', 'Laravel (PHP)', NAVY, WHITE, 1.6],
      ['FiDatabase', 'MySQL', 'Base de datos', TEAL, WHITE, 1.35],
    ]
    const gap = 0.3
    let x = 0.65
    const centers = []
    for (let i = 0; i < boxes.length; i++) {
      const [ic, t, sub, bg, fg, w] = boxes[i]
      s.addShape(pres.ShapeType.roundRect, { x, y: 2.75, w, h: 1.4, rectRadius: 0.1, fill: { color: bg }, line: { color: bg === WHITE ? BLUE : bg, width: 1.5 }, objectName: 'Caja ' + t })
      s.addImage({ data: await icon(ic, bg === WHITE ? BLUE : WHITE), x: x + (w - 0.4) / 2, y: 2.85, w: 0.4, h: 0.4, altText: 'Icono ' + t, objectName: 'Icono ' + t })
      T(s, t, { x: x + 0.04, y: 3.3, w: w - 0.08, h: 0.35, fontSize: 16, bold: true, color: fg, align: 'center', valign: 'middle', objectName: 'Título ' + t })
      T(s, sub, { x: x + 0.04, y: 3.65, w: w - 0.08, h: 0.42, fontSize: 12, color: bg === WHITE ? MUTED : ICE, align: 'center', valign: 'top', objectName: 'Detalle ' + t })
      s.addShape(pres.ShapeType.ellipse, { x: x - 0.08, y: 2.67, w: 0.3, h: 0.3, fill: { color: PINK }, line: { color: WHITE, width: 1.25 }, objectName: 'Número ' + (i + 1) + ' fondo' })
      T(s, String(i + 1), { x: x - 0.08, y: 2.67, w: 0.3, h: 0.3, fontSize: 11, bold: true, color: WHITE, align: 'center', valign: 'middle', objectName: 'Número ' + (i + 1) })
      centers.push([x, w])
      if (i < boxes.length - 1) s.addShape(pres.ShapeType.line, { x: x + w + 0.03, y: 3.45, w: gap - 0.06, h: 0, line: { color: NAVY, width: 2.5, beginArrowType: 'triangle', endArrowType: 'triangle' }, objectName: 'Flecha ' + (i + 1) })
      x += w + gap
    }
    // Etiqueta de la API: frontend ↔ backend.
    const ax = centers[1][0]
    const aw = centers[3][0] + centers[3][1] - ax
    s.addShape(pres.ShapeType.roundRect, { x: ax, y: 4.32, w: aw, h: 0.5, rectRadius: 0.25, fill: { color: ICE }, line: { color: ICE }, objectName: 'Etiqueta API fondo' })
    T(s, 'Frontend y backend son partes separadas que se comunican mediante una API', { x: ax + 0.15, y: 4.32, w: aw - 0.3, h: 0.5, fontSize: 13, bold: true, color: NAVY, align: 'center', valign: 'middle', objectName: 'Etiqueta API' })
    s.addNotes(
      'HABLAN: NICOLÁS (≈20 s) y DANIEL (≈55 s).\n' +
      'Nicolás (franja de arriba y primeras cajas): hay dos cosas distintas. Arriba, cómo desarrollamos: escribimos en Visual Studio Code, Git registra versiones e historial de cambios y GitHub los comparte; de ahí Vercel toma la interfaz y la publica. Abajo, cómo funciona la aplicación. La persona abre la web en su navegador y recibe la interfaz publicada en Vercel. Transición: «Cuando necesita datos, la interfaz le pregunta al servidor. Daniel, seguí vos.»\n' +
      'Daniel (cajas 3 a 5): la interfaz y el servidor son partes separadas que se hablan por medio de una API. El pedido viaja por una conexión HTTPS que armamos con ngrok, porque hoy el servidor corre en mi computadora y ngrok le da una dirección pública segura; es el montaje actual de la demostración. Llega a Laravel, que valida los datos y consulta o guarda en MySQL. El resultado vuelve por el mismo camino y la interfaz lo muestra en pantalla.\n' +
      'Detalle técnico (solo si preguntan): la interfaz está en Vercel (Preview de la rama del frontend); Vercel reconstruye la Preview cuando se sube un commit a esa rama. La URL de la API se configura en la interfaz mediante una variable de entorno y el servidor permite en CORS el origen exacto de la interfaz. La API tiene tres rutas: listar profesionales, crear una solicitud y una de salud. El ngrok gratuito cambia de URL al reiniciarse y depende de que mi computadora esté encendida con Laravel y MySQL; para uso real el servidor iría a un alojamiento estable. Backend NO está en Vercel.',
    )
  }

  // =========================================================
  // 8. Qué conseguimos — DANIEL → NICOLÁS
  // =========================================================
  {
    const s = pres.addSlide({ masterName: 'CONTENIDO', sectionTitle: 'Tecnología' })
    T(s, 'Qué conseguimos', { placeholder: 'title' })
    const items = [
      ['FiList', 'El catálogo y sus filtros funcionan', '100 perfiles de ejemplo, 7 oficios y 10 barrios', BLUE],
      ['FiShield', 'El formulario valida las solicitudes', 'Avisa qué corregir antes de guardar', BLUE],
      ['FiDatabase', 'Las solicitudes quedan guardadas', 'El equipo comprobó que las solicitudes válidas se guardan en MySQL', TEAL],
    ]
    for (let i = 0; i < items.length; i++) {
      const x = 0.5 + i * 3.1
      card(s, x, 1.4, 2.8, 3.4, 'Tarjeta ' + items[i][1])
      await iconBadge(pres, s, items[i][0], x + 0.25, 1.65, 0.8, items[i][3], WHITE, 'Icono ' + items[i][1])
      T(s, items[i][1], { x: x + 0.25, y: 2.65, w: 2.35, h: 0.9, fontSize: 18, bold: true, color: NAVY, valign: 'top', objectName: 'Logro ' + (i + 1) })
      T(s, items[i][2], { x: x + 0.25, y: 3.6, w: 2.35, h: 1.0, fontSize: 14, color: MUTED, valign: 'top', objectName: 'Detalle logro ' + (i + 1) })
    }
    s.addNotes(
      'HABLAN: DANIEL (≈20 s) y NICOLÁS (≈25 s).\n' +
      'Daniel: lo que más nos importaba era que no fuera una maqueta. Por eso el resultado principal es que las solicitudes válidas realmente quedan guardadas en MySQL: lo comprobamos nosotros enviando solicitudes y mirando las filas de la tabla. Transición: «Y del lado de la pantalla, Nico…»\n' +
      'Nicolás: conseguimos un catálogo que se puede recorrer y filtrar, y un formulario que valida lo que se escribe y le explica a la persona qué corregir. Transición: «Ahora lo mejor es verlo funcionando.»\n' +
      'Detalle técnico (solo si preguntan): hay 13 pruebas automáticas del backend (rutas, validación y CORS; usan una base SQLite en memoria, no MySQL) y 8 del frontend (formato de las respuestas; no usan la red). El guardado en MySQL se verificó a mano. Las cifras de pruebas son las registradas en docs/ESTADO_BACKEND_MVP.md.',
    )
  }

  // =========================================================
  // 9. Demostración en vivo — NICOLÁS conduce, DANIEL explica
  // =========================================================
  {
    pres.addSection({ title: 'Demostración' })
    const s = pres.addSlide({ masterName: 'OSCURA', sectionTitle: 'Demostración' })
    T(s, 'Veamos ConectaPro funcionando', { placeholder: 'title' })
    T(s, 'Probala vos también:', { x: 0.5, y: 1.3, w: 9, h: 0.3, fontSize: 14, color: 'BFDBFE', objectName: 'Invitación' })
    s.addShape(pres.ShapeType.roundRect, { x: 0.5, y: 1.65, w: 9, h: 0.7, rectRadius: 0.12, fill: { color: BLUE }, line: { color: '93C5FD', width: 1.5 }, objectName: 'Enlace fondo' })
    T(s, [{ text: DEMO_URL, options: { hyperlink: { url: DEMO_URL, tooltip: 'Abrir ConectaPro' }, color: WHITE, underline: { style: 'sng' } } }], {
      x: 0.7, y: 1.65, w: 8.6, h: 0.7, fontSize: 15, bold: true, align: 'center', valign: 'middle', objectName: 'Enlace demo',
    })
    const steps = [
      ['FiSearch', 'Encontrar profesionales'],
      ['FiFilter', 'Filtrar por servicio o barrio'],
      ['FiEdit3', 'Completar una solicitud'],
    ]
    for (let i = 0; i < steps.length; i++) {
      const x = 0.5 + i * 3.1
      s.addShape(pres.ShapeType.roundRect, { x, y: 2.8, w: 2.8, h: 2.0, rectRadius: 0.12, fill: { color: '1E3A8A' }, line: { color: '3B5BB5', width: 1 }, objectName: 'Tarjeta paso ' + (i + 1) })
      await iconBadge(pres, s, steps[i][0], x + 1.05, 3.0, 0.7, PINK, WHITE, 'Icono ' + steps[i][1])
      T(s, steps[i][1], { x: x + 0.2, y: 3.85, w: 2.4, h: 0.8, fontSize: 18, bold: true, color: WHITE, align: 'center', valign: 'top', objectName: 'Paso demo ' + (i + 1) })
    }
    s.addNotes(
      'HABLAN: NICOLÁS conduce la navegación y DANIEL explica el servidor (≈3 min). Ver el guion para la secuencia completa y el plan de respaldo (no se muestra en pantalla).\n' +
      '1) Encontrar profesionales: Nicolás abre el enlace y muestra el listado; Daniel dice que esa lista viene del servidor.\n' +
      '2) Filtrar: Nicolás filtra por servicio y por barrio.\n' +
      '3) Completar una solicitud: Nicolás intenta enviar vacío (errores) y luego envía con datos de prueba; Daniel explica que el servidor la recibe, la revisa y la guarda en MySQL.',
    )
  }

  // =========================================================
  // 10. Alcance actual y evolución — DANIEL → NICOLÁS
  // =========================================================
  {
    pres.addSection({ title: 'Cierre' })
    const s = pres.addSlide({ masterName: 'CONTENIDO', sectionTitle: 'Cierre' })
    T(s, 'Qué hay hoy y qué viene después', { placeholder: 'title' })
    const cols = [
      { x: 0.5, name: 'Ya funciona', color: TEAL, ic: 'FiCheck', items: ['Listado de profesionales', 'Filtros por servicio y barrio', 'Solicitudes con validación', 'Guardado en base de datos'] },
      { x: 5.1, name: 'Próximas mejoras', color: PINK, ic: 'FiArrowRight', items: ['Cuentas de usuario', 'Panel para profesionales', 'Gestión de solicitudes', 'Reseñas reales', 'Historial y pagos'] },
    ]
    for (const c of cols) {
      card(s, c.x, 1.3, 4.4, 3.2, 'Tarjeta ' + c.name)
      T(s, c.name, { x: c.x + 0.3, y: 1.42, w: 3.8, h: 0.55, fontSize: 20, bold: true, color: c.color, valign: 'middle', objectName: 'Título ' + c.name })
      const ic = await icon(c.ic, c.color)
      c.items.forEach((it, i) => {
        const y = 2.1 + i * 0.47
        s.addImage({ data: ic, x: c.x + 0.3, y: y + 0.08, w: 0.26, h: 0.26, altText: c.name, objectName: 'Icono ' + c.name + ' ' + (i + 1) })
        T(s, it, { x: c.x + 0.7, y, w: 3.5, h: 0.42, fontSize: 16, color: INK, valign: 'middle', objectName: c.name + ' ' + (i + 1) })
      })
    }
    T(s, 'Los perfiles y las valoraciones de esta versión son datos de ejemplo.', { x: 0.5, y: 4.7, w: 9, h: 0.35, fontSize: 14, italic: true, color: MUTED, objectName: 'Nota datos de ejemplo' })
    s.addNotes(
      'HABLAN: DANIEL (≈25 s) y NICOLÁS (≈20 s).\n' +
      'Daniel: hoy ConectaPro ya permite ver profesionales, filtrarlos, enviar una solicitud con validación y guardarla en la base de datos. Un MVP se limita a propósito para terminar un recorrido completo antes de sumar más cosas. Transición: «¿Y después? Nico…»\n' +
      'Nicolás: lo que sigue serían cuentas de usuario, un panel para que cada profesional vea y gestione las solicitudes que recibe y reseñas reales en lugar de valoraciones de ejemplo; más adelante, historial y pagos. Eso no está implementado en esta versión: es la visión del proyecto.\n' +
      'Detalle (solo si preguntan): también quedaría pendiente un alojamiento estable para el servidor y verificar la identidad de los profesionales. La comisión del 15 % prevista en la idea original no está implementada.',
    )
  }

  // =========================================================
  // 11. Conclusión — DANIEL → NICOLÁS
  // =========================================================
  {
    const s = pres.addSlide({ masterName: 'OSCURA', sectionTitle: 'Cierre' })
    T(s, 'Conclusión', { placeholder: 'title' })
    T(s, 'Un recorrido completo: de la búsqueda al pedido guardado', { x: 0.5, y: 1.5, w: 4.8, h: 1.7, fontSize: 28, bold: true, color: WHITE, valign: 'top', objectName: 'Idea central' })
    await iconBadge(pres, s, 'FiUsers', 0.5, 3.55, 0.7, ICE, NAVY, 'Icono equipo')
    T(s, 'Hecho en equipo: Nicolás en la interfaz web, Daniel en el servidor y los datos', { x: 1.4, y: 3.5, w: 3.9, h: 0.85, fontSize: 16, color: ICE, valign: 'middle', objectName: 'Equipo' })
    s.addShape(pres.ShapeType.roundRect, { x: 5.7, y: 1.4, w: 3.8, h: 3.0, rectRadius: 0.15, fill: { color: WHITE }, line: { color: WHITE }, objectName: 'Pregunta fondo' })
    T(s, 'PARA USTEDES', { x: 5.95, y: 1.6, w: 3.3, h: 0.3, fontSize: 12, bold: true, color: PINK, charSpacing: 3, objectName: 'Etiqueta pregunta' })
    T(s, '¿Qué función añadirían primero para que ConectaPro pudiera usarse con clientes reales?', { x: 5.95, y: 2.0, w: 3.3, h: 1.6, fontSize: 20, bold: true, color: NAVY, valign: 'top', objectName: 'Pregunta' })
    T(s, '¡Gracias!', { x: 5.95, y: 3.7, w: 3.3, h: 0.5, fontSize: 22, bold: true, color: BLUE, valign: 'middle', objectName: 'Gracias' })
    T(s, [{ text: REPO_URL, options: { hyperlink: { url: REPO_URL, tooltip: 'Repositorio en GitHub' }, color: 'BFDBFE' } }], { x: 0.5, y: 4.75, w: 6, h: 0.3, fontSize: 12, objectName: 'Repositorio' })
    s.addNotes(
      'HABLAN: DANIEL (≈15 s) y NICOLÁS (≈25 s).\n' +
      'Daniel: ConectaPro muestra un recorrido completo: la persona busca, compara, envía una solicitud y el pedido queda guardado de verdad en la base de datos.\n' +
      'Nicolás: lo construimos entre los dos, interfaz y servidor, y los integramos y probamos juntos. Cerramos con una pregunta para ustedes: ¿qué función añadirían primero para que ConectaPro pudiera usarse con clientes reales? Gracias; quedamos atentos.\n' +
      '(El repositorio público está en el pie de la diapositiva.)',
    )
  }

  await pres.writeFile({ fileName: OUT })
  // Escribe los colores y las fuentes del tema dentro del archivo.
  const { applyTheme } = require(process.env.PPTX_SKILL_DIR + '/scripts/apply_theme.js')
  await applyTheme(OUT, THEME)
  console.log('Generado:', OUT)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
