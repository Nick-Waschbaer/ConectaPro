# ConectaPro — Frontend

Interfaz web de ConectaPro, un marketplace que conecta a personas con profesionales independientes de servicios del hogar en Asunción, Paraguay. Esta carpeta es solo el **frontend**: muestra los profesionales, permite buscarlos y filtrarlos, y envía solicitudes de servicio a la API. La API (Laravel) vive en [`../backend`](../backend) y sus endpoints están descritos en [`../docs/API_CONTRACT.md`](../docs/API_CONTRACT.md).

> Es un proyecto escolar de demostración. Los profesionales y las solicitudes son de prueba: no hay pagos, verificación de identidad ni notificaciones.

## Qué hace

- **Lista de profesionales** pedida a la API (`GET /api/professionals`). Con el seeder actual del backend son unos 100 profesionales ficticios en 7 oficios y 10 barrios; el frontend no tiene esos datos escritos: los oficios y barrios que ofrece salen de lo que devuelve la API.
- **Búsqueda y filtros:**
  - **Oficio:** lo filtra la API (`?service=<oficio>`). Se puede elegir desde el buscador o desde los atajos "Explorá por oficio".
  - **Barrio:** se filtra en el navegador sobre la lista que ya llegó (la API también admite `?neighborhood=`, pero el frontend no lo usa).
  - El título de resultados indica el filtro aplicado y hay un botón "Quitar filtros".
- **Solicitud de servicio** (`POST /api/service-requests`): al pulsar "Solicitar servicio" en un profesional se abre un formulario con nombre, teléfono, barrio y descripción del problema. Valida en el navegador (campos obligatorios, largos máximos y formato de teléfono, iguales a las reglas de Laravel) y evita envíos duplicados mientras se envía. Laravel valida de nuevo.
- **Estados en pantalla:** carga (filas de relleno), lista vacía (con "Ver todos"), error al cargar (con "Reintentar") y confirmación de éxito con el número de solicitud.
- **Errores del formulario:**
  - *Validación (HTTP 422):* se marcan los campos con el primer mensaje que envía Laravel y se muestra "Revisá los campos marcados e intentá de nuevo."
  - *Conexión:* "No pudimos conectarnos con el servidor. Revisá tu conexión o que la API esté encendida." (servidor apagado, URL incorrecta, sin internet o bloqueo de CORS; el navegador no distingue estos casos).
  - *Error del servidor (5xx):* "El servidor tuvo un problema. Probá de nuevo en unos minutos."
  - *Otros 4xx:* el mensaje que envíe la API o "No se pudo completar la operación (error N)".
- **Confirmación estricta:** solo se muestra "¡Solicitud registrada!" si el servidor responde **HTTP 201** con `data.id`, `data.professional_id` (igual al profesional elegido) y `data.status`. Una respuesta distinta (por ejemplo `200`, o un `201` incompleto) muestra "No pudimos confirmar que tu solicitud se haya registrado…" y no se presenta como éxito.

## Tecnologías

| Herramienta | Para qué se usa |
| --- | --- |
| [React](https://react.dev) 19 (JavaScript con JSX) | Interfaz |
| [Vite](https://vite.dev) 8 | Servidor de desarrollo y compilación |
| CSS propio ([`src/index.css`](src/index.css)) | Estilos; sin librería de componentes |
| [oxlint](https://oxc.rs) | Revisión de código (`npm run lint`) |
| `node:test` (incluido en Node) | Pruebas automáticas (`npm test`) |

No se usa TypeScript, enrutador ni gestor de estado. **React Compiler no está integrado.** La tipografía Figtree se carga desde Google Fonts ([`index.html`](index.html)); si no carga, se usa la fuente del sistema.

## Requisitos

- **Node.js 20.19 o superior** (o 22.12+), que es lo que exige Vite 8. Comprueba tu versión con `node -v`.
- npm (viene con Node).

## Instalar y ejecutar

Desde la carpeta `frontend/`:

```bash
npm install
cp .env.example .env
npm run dev
```

(En PowerShell, en lugar de `cp` usa `Copy-Item .env.example .env`.)

Vite muestra en la terminal la dirección local, normalmente `http://localhost:5173`. Ábrela en el navegador.

> **Atención con el puerto:** si el 5173 está ocupado, Vite elige otro (por ejemplo 5174) y lo avisa en la terminal. El backend, por defecto, solo acepta peticiones desde `localhost:5173` y `127.0.0.1:5173`; desde otro puerto el navegador bloqueará las llamadas (error de CORS). Cierra lo que use el 5173 o agrega el nuevo origen en `CORS_ALLOWED_ORIGINS` del backend.

## Variables de entorno

Se leen del archivo `frontend/.env`, que **no se sube a Git** (está en `.gitignore`). La plantilla es [`.env.example`](.env.example). Solo se leen en un único lugar: [`src/config.js`](src/config.js).

| Variable | Valor en la plantilla | Descripción |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `http://127.0.0.1:8000/api` | URL base de la API, **terminada en `/api`**. |
| `VITE_USE_MOCK_API` | `false` | Con `true` se activa el modo demo (ver más abajo). |

Reglas importantes:

- **Reinicia `npm run dev` cada vez que cambies el `.env`**: Vite lo lee solo al arrancar.
- Las variables `VITE_*` **quedan visibles en el navegador**. Nunca pongas contraseñas, claves ni tokens.
- Si `VITE_API_BASE_URL` falta, la pantalla muestra "Falta configurar VITE_API_BASE_URL".

### `VITE_API_BASE_URL`

- **Desarrollo local:** `http://127.0.0.1:8000/api` (la dirección de `php artisan serve`).
- **Demo con ngrok:** la URL pública de ngrok más `/api`. Si la URL contiene `ngrok`, el frontend envía el encabezado `ngrok-skip-browser-warning`, y el backend ya lo permite en su CORS. **La URL gratuita de ngrok cambia cada vez que se reinicia el túnel**, por eso este documento no la incluye.
- **Vercel:** la variable se define en la configuración del proyecto de Vercel y hay que volver a desplegar tras cambiarla, porque Vite la incorpora al **compilar**, no al abrir la página. En el repositorio no hay `vercel.json`: el directorio raíz (`frontend`), el comando de compilación y el directorio de salida se configuran en Vercel y **no pueden comprobarse desde el repositorio**.

## Modo demo (`VITE_USE_MOCK_API=true`)

Sirve para probar la interfaz **sin backend**.

**Activarlo:** en `frontend/.env` pon

```env
VITE_USE_MOCK_API=true
```

y reinicia `npm run dev`. **Desactivarlo:** pon `VITE_USE_MOCK_API=false` (o borra la línea) y reinicia.

Solo se activa con el valor exacto `true`. Cuando está activo, la página muestra un aviso amarillo de "Modo demostración" y el formulario repite que nada se guarda.

**Limitaciones del modo demo:**

- Usa **6 profesionales ficticios** escritos en [`src/services/mockApi.js`](src/services/mockApi.js), con "(demo)" en el nombre. No vienen de la API ni de MySQL.
- Las solicitudes **no se guardan en MySQL ni se envían a ningún profesional**; no hay petición de red. La confirmación dice "Simulación completada".
- El envío **siempre tiene éxito**: no reproduce los errores de validación del servidor (422), ni los de conexión, ni los 500. El formulario sí valida en el navegador antes de "enviar".
- El número de solicitud simulado empieza en 1 y se reinicia al recargar la página.
- No sirve para comprobar que el frontend y Laravel se entienden: para eso hay que usar la API real.
- Si el modo demo está desactivado y la API falla, la app muestra el error con "Reintentar". **No cae automáticamente a datos ficticios.**
- No lo dejes en `true` en Vercel: el sitio publicado mostraría datos de demostración. En la compilación normal (sin esta variable) esos datos ni siquiera se incluyen en el código generado.

## Comandos

Ejecútalos dentro de `frontend/`:

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con recarga automática. |
| `npm run build` | Compila para producción en `dist/` (no se sube a Git). |
| `npm run preview` | Sirve localmente lo compilado en `dist/`. Ejecuta antes `npm run build`. |
| `npm run lint` | Revisa el código con oxlint. |
| `npm test` | Ejecuta las pruebas automáticas. |

Última comprobación local registrada para este frontend (2026-10-20): `npm run build` termina bien, `npm run lint` no da avisos y `npm test` pasa **8 pruebas**.

### Qué cubren las pruebas automáticas

Están en [`src/services/contract.test.js`](src/services/contract.test.js) y **no hacen llamadas de red ni usan el backend**. Comprueban la lógica del frontend por separado:

- que una solicitud solo se considera exitosa con **HTTP 201** y una respuesta con `id`, `professional_id` y `status` válidos;
- que respuestas incompletas, con otro código (por ejemplo `200`) o de otro profesional **no** producen una confirmación falsa;
- que la respuesta simulada del modo demo cumple el mismo formato de éxito.

**No cubren** los componentes de React, el filtro, el formulario ni las llamadas reales con `fetch`.

## Verificación de la integración con Laravel y MySQL

La integración **no está cubierta por pruebas automáticas de frontend**: se verificó **manualmente** y la evidencia está registrada en [`../docs/ESTADO_BACKEND_MVP.md`](../docs/ESTADO_BACKEND_MVP.md), que distingue el tipo de evidencia de cada punto. En resumen:

- **Comprobado en MySQL (2026-10-18 y 2026-10-19, en la laptop de Daniel):** el listado y el filtro por oficio responden desde la base, una solicitud válida devuelve `201` y queda guardada, una inválida devuelve `422` y no guarda nada, y las solicitudes enviadas desde la web aparecen en la tabla con estado `pending`.
- **Comprobado a través del túnel público (2026-10-19):** la API responde desde internet y el CORS acepta el dominio de Vercel configurado en ese momento.
- **Reportado por el equipo:** que el listado se vio en la web de Vercel y que se enviaron solicitudes desde otros dispositivos; también que se probaron los errores de validación, el CORS y el mensaje cuando se pierde la conexión. Estos puntos no quedaron registrados con más detalle en el repositorio.
- **Reportado el 2026-10-20:** el equipo informa que ya grabó un video de respaldo de la demostración pública. El video no forma parte del repositorio y no se pudo revisar desde aquí.
- **No se repitió desde la auditoría del 2026-10-20:** esa revisión (de solo lectura) no pudo ejecutar el backend, porque faltaban sus dependencias locales, ni llamó a la API pública. Por eso el registro del repositorio no incluye una prueba de punta a punta de la versión final del frontend (portada con buscador y 100 profesionales). Se recomienda repetir el recorrido completo antes de cada demostración.

## Qué necesita el frontend para conectarse al backend

Para usar la API real (con `VITE_USE_MOCK_API=false`):

1. **El backend encendido** y accesible en la URL de `VITE_API_BASE_URL`. Los pasos para levantarlo (PHP 8.4+, Composer, MySQL/MariaDB, `php artisan migrate --seed`, `php artisan serve`) están en [`../backend/README.md`](../backend/README.md).
2. **Los endpoints del contrato**, con exactamente estas rutas y campos:
   - `GET /api/professionals` (el frontend envía `?service=<oficio>` al filtrar por oficio).
   - `POST /api/service-requests` con `professional_id`, `customer_name`, `contact_phone`, `description` y `neighborhood`. Solo se confirma con **`201`** y `data.id`, `data.professional_id` y `data.status`.
3. **CORS** que permita el origen del frontend: por defecto `http://localhost:5173` y `http://127.0.0.1:5173`. Para Vercel hay que agregar su dominio en `CORS_ALLOWED_ORIGINS` del `.env` del backend; si se usa otra dirección (por ejemplo la de una rama de previsualización), el navegador bloqueará las llamadas.

Los oficios y barrios del buscador salen de los profesionales que devuelve la API.

## Problemas frecuentes

| Qué ves | Causa probable |
| --- | --- |
| "Falta configurar VITE_API_BASE_URL" | No existe `frontend/.env` o la variable está vacía. Reinicia Vite tras crearlo. |
| "No pudimos conectarnos con el servidor" | La API está apagada, la URL es incorrecta (¿falta `/api`?), no hay internet, el túnel de ngrok está cerrado o **CORS** bloquea el origen (revisa el puerto de Vite o el dominio de Vercel). |
| "El servidor tuvo un problema" | La API respondió un error 500. Revisa los registros de Laravel. |
| "El servidor respondió algo inesperado" | La respuesta no tiene el formato del contrato (por ejemplo, una página HTML en lugar de JSON). |
| "No pudimos confirmar que tu solicitud se haya registrado" | El servidor no respondió `201` con los datos esperados. La solicitud pudo guardarse o no: revisa la base antes de reenviar. |
| Aparecen profesionales con "(demo)" y un aviso amarillo | El modo demo está activo (`VITE_USE_MOCK_API=true`). |

## Estructura

```text
frontend/
├── .env.example           # plantilla de variables (sin secretos)
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx           # punto de entrada
    ├── App.jsx            # pantalla principal: portada, búsqueda, resultados y estados
    ├── config.js          # lee VITE_API_BASE_URL y VITE_USE_MOCK_API
    ├── index.css          # estilos
    ├── components/        # SearchPanel, CategoryGrid, ProfessionalCard, RequestForm, ServiceIcon, HeroIllustration
    └── services/
        ├── api.js         # llamadas a la API (o al modo demo)
        ├── apiError.js    # error con estado HTTP y errores por campo
        ├── contract.js    # comprobación estricta de la respuesta de éxito
        ├── contract.test.js
        └── mockApi.js     # datos y envío simulados del modo demo
```

## Seguridad y Git

- No subas `frontend/.env` ni pongas secretos en variables `VITE_*`.
- `node_modules/` y `dist/` tampoco se suben.
- No cambies rutas ni campos de la API sin acordarlo antes con quien trabaja el backend y actualizar [`../docs/API_CONTRACT.md`](../docs/API_CONTRACT.md).
