# Guion de exposición — ConectaPro (versión 3, Despliegue Web)

Es una **guía para explicar y practicar en un día**, no un texto para memorizar. Cada diapositiva tiene: quién empieza, la idea que hay que transmitir, una explicación corta y cómo pasarle la palabra al compañero. Digan las cosas con sus palabras.

**Duración:** unos 8 minutos de exposición + unos 3 minutos de demostración.

## Reparto

Los dos hablan en casi todas las diapositivas y se pasan la palabra. Nicolás lleva el problema, lo que ve el usuario, la interfaz y la demo; Daniel, el servidor, la base de datos y la conexión. Las explicaciones de herramientas y resultados las comparten.

| # | Diapositiva | Empieza | Sigue | Tiempo |
|---|-------------|---------|-------|--------|
| 1 | Portada | Nicolás | Daniel | 0:30 |
| 2 | El problema | Nicolás | Daniel | 0:50 |
| 3 | La solución | Daniel | Nicolás | 0:40 |
| 4 | Directorio y filtros | Daniel | Nicolás | 0:45 |
| 5 | Pedir un servicio | Nicolás | Daniel | 0:55 |
| 6 | Con qué construimos | Nicolás | Daniel | 1:15 |
| 7 | Del navegador a la base de datos | Nicolás | Daniel | 1:15 |
| 8 | Qué conseguimos | Daniel | Nicolás | 0:45 |
| 9 | Demostración | Nicolás conduce | Daniel explica | ≈3:00 |
| 10 | Qué hay hoy y qué viene después | Daniel | Nicolás | 0:45 |
| 11 | Conclusión | Daniel | Nicolás | 0:40 |

Sin contar la demostración: **Nicolás ≈ 4:15 y Daniel ≈ 4:05** (≈ 8:20 en total), con diez intervenciones cada uno.

> Regla para practicar: aprendan **la idea de cada diapositiva y la transición**, no las frases. Si se traban, la frase de ejemplo está para rescatarlos.

---

## Lo que se dice al público

### 1. Portada — Nicolás → Daniel (0:30)
**Idea:** qué es ConectaPro y qué vamos a contar.
- **Nicolás:** «Buenas. Somos Nicolás y Daniel y les presentamos ConectaPro, nuestro proyecto de Despliegue Web.»
- **Daniel:** «Es una plataforma que conecta a personas que necesitan un técnico del hogar con profesionales independientes. Les contamos el problema, la solución, con qué la construimos y cómo funciona, y después la vemos andando.»

### 2. El problema — Nicolás → Daniel (0:50)
**Idea:** es difícil para los dos lados.
- **Nicolás** *(columna izquierda)*: «Cuando se rompe una canilla o falla la luz, mucha gente depende del boca a boca o de buscar en redes. Cuesta comparar opciones y saber en quién confiar. Y del otro lado también hay un problema. Daniel…»
- **Daniel** *(columna derecha)*: «Un electricista o un plomero que trabaja solo tiene poca visibilidad y pocos canales digitales para conseguir clientes. Entonces pensamos en un lugar donde los dos se encuentren. Nico, ¿cómo funciona?»

### 3. La solución — Daniel → Nicolás (0:40)
**Idea:** tres pasos: buscar, comparar y solicitar.
- **Daniel:** «ConectaPro es un lugar donde buscás, comparás y pedís un servicio en tres pasos. Detrás hay un servidor que guarda los datos, pero eso lo vemos después. Nico, mostrales cómo se usa.»
- **Nicolás:** «Buscás el servicio y tu barrio, comparás profesionales y le pedís el trabajo a uno. Esta es la pantalla real; la pensé para que se entienda sin explicaciones.»

### 4. Directorio y filtros — Daniel → Nicolás (0:45)
**Idea:** hay profesionales de varios oficios y barrios, y se puede acotar la búsqueda.
- **Daniel:** «Lo primero que ve la persona es un directorio. Son perfiles de ejemplo que cargamos en la base de datos para probar: 100 profesionales, 7 oficios y 10 barrios. Nico, mostrales cómo se ve.»
- **Nicolás:** «A la izquierda, el directorio con oficio, barrio y valoración. A la derecha, al elegir un servicio, por ejemplo Plomería, la lista se acota. También se puede filtrar por barrio.»

### 5. Pedir un servicio — Nicolás → Daniel (0:55)
**Idea:** pocos datos, revisión y confirmación.
- **Nicolás:** «Este es el formulario: nombre, teléfono, barrio y qué necesitás. Por privacidad pedimos solo el barrio, no la dirección. Si algo falta o está mal, la pantalla lo marca. Daniel, ¿qué pasa al enviar?»
- **Daniel:** «El servidor vuelve a revisar todo, porque no podemos confiar solo en el navegador. Si está bien, guarda la solicitud en la base de datos y avisa; recién ahí la persona ve la confirmación.»

### 6. Con qué construimos — Nicolás → Daniel (1:15)
**Idea:** cada herramienta tiene una función; trabajamos en etapas.
- **Nicolás:** «Escribimos el código en Visual Studio Code. Git registra versiones e historial de cambios y GitHub es el repositorio que compartimos los dos. La interfaz usa React, que arma la pantalla en piezas, y Vite, que la prepara para el navegador; la base son HTML, CSS y JavaScript. Y Vercel la publica en internet. Daniel, ¿y del lado del servidor?»
- **Daniel:** «El servidor está hecho en PHP con Laravel: recibe los pedidos y los valida. Los datos se guardan en MySQL. Y usamos ngrok para que la web publicada pueda hablar con nuestro servidor. Lo hicimos en etapas: idea y análisis, diseño de la interfaz, desarrollo del frontend y del backend, integración y pruebas, y por último la publicación y la demostración.»

*(Visual: recorrer las cuatro columnas de izquierda a derecha y cerrar señalando la fila de etapas.)*

### 7. Del navegador a la base de datos — Nicolás → Daniel (1:15)
**Idea:** frontend y backend son partes separadas que se comunican por una API.
- **Nicolás:** «Hay dos cosas distintas. Arriba, cómo desarrollamos: VS Code, Git y GitHub; de ahí Vercel toma la interfaz y la publica. Abajo, cómo funciona: la persona abre la web en el navegador y recibe la interfaz de Vercel. Cuando necesita datos, le pregunta al servidor. Daniel, seguí vos.»
- **Daniel:** «Interfaz y servidor son partes separadas que se hablan por una API. El pedido viaja por una conexión segura que armamos con ngrok, porque hoy el servidor corre en mi computadora; es el montaje actual de la demostración. Llega a Laravel, que valida y consulta o guarda en MySQL. El resultado vuelve por el mismo camino y se muestra en pantalla.»

*(Visual: seguir los números 1 al 5 en el diagrama y señalar la etiqueta de la API.)*

### 8. Qué conseguimos — Daniel → Nicolás (0:45)
**Idea:** tres resultados concretos.
- **Daniel:** «Queríamos que no fuera una maqueta: las solicitudes válidas realmente quedan guardadas en MySQL. Lo comprobamos nosotros enviando solicitudes y mirando la tabla. Y del lado de la pantalla, Nico…»
- **Nicolás:** «Conseguimos un catálogo que se recorre y se filtra, y un formulario que valida y explica qué corregir. Ahora lo mejor es verlo funcionando.»

### 9. Demostración — Nicolás conduce, Daniel explica (≈3:00)
**Idea:** ver el producto funcionando con datos de prueba.

| Paso | Nicolás (navega y cuenta lo que ve el usuario) | Daniel (explica el servidor) |
|---|---|---|
| Intro | «Ahora lo vemos funcionando.» *(clic en el enlace de la diapositiva)* | — |
| 1. Encontrar profesionales | «Entramos y aparece la lista de profesionales.» | «Esa lista la pide el navegador al servidor.» |
| 2. Filtrar | *Elegir un servicio y un barrio.* «Fíjense cómo cambian los resultados.» | — |
| 3. Completar una solicitud | *Abrir «Solicitar servicio». Enviar vacío.* «Si falta algo, nos avisa qué corregir.» *Completar con datos de prueba y enviar.* «Y aparece la confirmación con un número.» | «El servidor recibió el pedido, lo revisó y lo guardó en la base de datos.» |
| Cierre | «Volvemos a las diapositivas.» | — |

Datos de prueba sugeridos: nombre ficticio, teléfono `0981 000 000`, un barrio y una descripción corta. Cada envío crea una fila real.

### 10. Qué hay hoy y qué viene después — Daniel → Nicolás (0:45)
**Idea:** alcance honesto; lo que falta se dice una sola vez.
- **Daniel:** «Hoy ConectaPro permite ver profesionales, filtrarlos, enviar una solicitud con validación y guardarla. Un MVP se limita a propósito para terminar un recorrido completo. ¿Y después? Nico…»
- **Nicolás:** «Lo que sigue serían cuentas de usuario, un panel para que cada profesional gestione sus solicitudes y reseñas reales en lugar de las valoraciones de ejemplo; más adelante, historial y pagos. Eso todavía no está hecho.»

### 11. Conclusión — Daniel → Nicolás (0:40)
**Idea:** valor del proyecto, trabajo conjunto y pregunta.
- **Daniel:** «ConectaPro muestra un recorrido completo: la persona busca, compara, envía una solicitud y el pedido queda guardado de verdad.»
- **Nicolás:** «Lo construimos entre los dos, interfaz y servidor, y lo integramos y probamos juntos. Les dejamos una pregunta: ¿qué función añadirían primero para que ConectaPro pudiera usarse con clientes reales? Gracias.»

---

## SECCIÓN OPERATIVA — no se dice al público

### Antes de empezar (Daniel, unos 5 minutos antes)
1. Laptop enchufada y sin suspensión. Encender **MySQL**, **`php artisan serve`** y **ngrok**.
2. Abrir la demo y comprobar que cargan los profesionales: <https://conecta-pro-git-feat-frontend-angi-redesign-goldbaeren.vercel.app>. Usar **esa** dirección; **no** `conecta-pro-psi.vercel.app` (producción: el 20/10 no estaba configurado para conectarse a la API).
3. Si ngrok se reinició, su URL cambió: hay que actualizar `VITE_API_BASE_URL` en Vercel y volver a desplegar (`docs/ESTADO_BACKEND_MVP.md`, sección 5.4). No hacer push ni borrar la rama `feat/frontend-angi-redesign`: genera esta Preview.
4. Tener a mano el **video de respaldo** que grabó el equipo (no está en el repositorio).
5. Cerrar pestañas y notificaciones; zoom del navegador al 100–125 %.

### Si la demostración falla
- La lista no carga o hay error de conexión: lo más probable es que ngrok, Laravel o MySQL estén apagados o que la URL del túnel haya cambiado.
- Máximo 30 segundos de intento. Luego **Daniel** dice «El servidor corre en una laptop con una conexión temporal; para no perder tiempo, mostramos el video que grabamos» y se reproduce el **video de respaldo**, que **Nicolás** narra con los tres pasos de la diapositiva 9.
- Sin demostración ni video: volver a las capturas de las diapositivas 3, 4 y 5 y explicar el recorrido con ellas.

### Qué recortar si hay menos tiempo
| Tiempo | Recorte |
|---|---|
| ≈ 6 min + demo | Fusionar 2 y 3 en una sola intervención; en 4 omitir de dónde salen los datos; en 8 decir solo «guardado verificado en MySQL». |
| ≈ 4–5 min + demo | Además, omitir la 5 (los errores se ven en la demo, paso 3) y resumir la 10 en una frase. |
| Sin demo | Reproducir el video (≈ 2 min) en lugar de la diapositiva 9. |

No conviene recortar: la 6 y la 7 (herramientas y arquitectura, que es lo que evalúa la materia), el alcance de la 10 ni la demostración.

### Datos para confirmar antes de exponer
- **Visual Studio Code** aparece porque el equipo lo indica como editor; no consta en la documentación del repositorio.
- **Colegio y materia** no constan en el repositorio; la portada no los muestra.

---

## Preguntas previsibles y respuestas técnicas

Son para cuando pregunte el profesor; no hace falta decirlas en la exposición.

**¿Cuál es la diferencia entre frontend y backend?**
El frontend es lo que corre en el navegador de la persona: la interfaz (React y Vite). El backend corre en un servidor: recibe pedidos, valida y guarda datos (Laravel y MySQL). Son partes independientes que se comunican mediante una API.

**¿Qué es la API?**
Es el conjunto de «puertas» por las que el frontend le pide cosas al backend. Hay tres: listar profesionales, crear una solicitud y una de salud para comprobar que el servidor responde. Los datos viajan en formato JSON.

**¿Para qué sirven React y Vite?**
React arma la pantalla a partir de componentes (piezas reutilizables). Vite prepara el código para el navegador: en desarrollo levanta un servidor local rápido y al publicar genera los archivos finales. El frontend usa JavaScript con JSX y CSS propio, sobre un HTML base.

**¿Cómo publicaron el frontend?**
En Vercel. El código está en GitHub y Vercel genera una Preview a partir de la rama del frontend; cada vez que se sube un commit a esa rama, Vercel la reconstruye. La URL de la API se configura como variable de entorno en Vercel (`VITE_API_BASE_URL`).

**¿Qué es ngrok y por qué lo usan?**
Es un túnel HTTPS que hace accesible desde internet el servidor Laravel que corre en la laptop de Daniel; sin él, la página publicada en Vercel no podría llegar a ese servidor. Es un montaje para la demostración, no una arquitectura de producción: la URL gratuita cambia al reiniciarlo y depende de que la laptop esté encendida. Para uso real, el backend iría a un alojamiento estable. El backend **no** está en Vercel.

**¿Qué es CORS y por qué aparece?**
Es una regla del navegador: una web solo puede llamar a otro origen si ese servidor lo permite. Configuramos Laravel para permitir el origen exacto de la web de Vercel y el local de desarrollo.

**¿Qué función tienen Git y GitHub?**
Git guarda el historial de cambios del proyecto. GitHub es el repositorio compartido: trabajamos en ramas, abrimos Pull Requests y el compañero revisa antes de integrar a `main` (`docs/FLUJO_TRABAJO.md`).

**¿Cuáles fueron las etapas del proyecto?**
Idea y análisis; diseño de la interfaz; desarrollo del frontend y del backend; integración y pruebas; publicación y demostración. Se apoya en el historial del repositorio (documentación inicial, interfaz y sus rediseños, backend con MySQL, verificación con MySQL y con Vercel + ngrok, documentación final). El `docs/PLAN_6_DIAS.md` es el plan inicial y es histórico: no usamos fechas ni duraciones.

**¿Cómo viaja una solicitud, técnicamente?**
La interfaz hace una petición HTTP con JSON a la API de Laravel; Laravel valida y guarda en MySQL, y responde. Si hay errores, responde HTTP 422 con un mensaje por campo; si todo está bien, 201 y la interfaz solo confirma con esa respuesta. El estado lo fija el servidor en «pending»: el cliente no puede forzarlo.

**¿Cómo saben que se guarda en MySQL?**
Lo verificamos a mano: enviamos solicitudes (por HTTP y desde la web) y consultamos las filas de la tabla `service_requests`. Las 13 pruebas automáticas del backend usan SQLite en memoria, así que no prueban MySQL; por eso hicimos esa verificación aparte. En el frontend hay 8 pruebas sobre el formato de las respuestas (no usan la red).

**¿Qué validan y dónde?**
Nombre, teléfono, barrio y descripción, con largos máximos y formato de teléfono. En el navegador (para ahorrar viajes) y de forma definitiva en Laravel.

**¿Por qué el filtro de barrio se hace en el navegador?**
Por simplicidad del MVP. La API también admite filtrar por barrio, pero el frontend no lo usa; el filtro por servicio sí lo resuelve la API con un parámetro.

**¿Son reales los profesionales y las valoraciones?**
No. Son perfiles de ejemplo cargados con un seeder, sin teléfonos ni direcciones; ninguno está verificado.

**¿Qué está terminado y qué no?**
Terminado: listado, filtros, solicitud con validación y guardado en MySQL. No existe: autenticación y roles, panel del profesional, gestión de estados, historial, reseñas reales ni pagos (`docs/MVP.md`). La comisión del 15 % de la idea original no está implementada.

**¿Qué pasa si el servidor se cae?**
La interfaz muestra un aviso de error con un botón para reintentar. Limitación conocida: no hay tiempo límite en las peticiones; si la conexión se cuelga, el formulario puede quedarse en «Enviando…» hasta recargar.

**¿Qué hay de seguridad?**
Es un MVP público sin autenticación. Hicimos: validación en el servidor, CORS limitado, modo de depuración desactivado y solo datos de prueba. Limitación conocida: el endpoint de solicitudes es público y sin límite de peticiones.

**¿Por qué esa dirección de Vercel y no la de producción?**
Porque es la que está conectada al servidor de la demostración. El dominio de producción no tenía configurada la URL de la API cuando lo revisamos y no afirmamos que esté corregido.

**¿Cómo se repartieron el trabajo?**
Nicolás, la interfaz web (React, Vite, experiencia del usuario). Daniel, el servidor (Laravel, PHP, validación, MySQL, ngrok). Ambos, la integración, las pruebas y la preparación; las rutas y los campos se acordaron en `docs/API_CONTRACT.md`.

**¿Qué construirían después?**
Cuentas y roles; un panel para que el profesional vea y gestione solicitudes; un alojamiento estable para el servidor; y más adelante reseñas reales, historial y pagos.
