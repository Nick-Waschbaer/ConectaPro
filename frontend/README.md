# ConectaPro — Frontend

Interfaz web de ConectaPro, un marketplace que conecta a personas con profesionales independientes de servicios del hogar en Asunción, Paraguay. Esta carpeta es solo el **frontend**: muestra los profesionales, permite filtrarlos y envía solicitudes de servicio a la API. La API (Laravel) vive en [`../backend`](../backend) y su contrato está en [`../docs/API_CONTRACT.md`](../docs/API_CONTRACT.md).

> Es un proyecto escolar de demostración. Los profesionales y las solicitudes son de prueba: no hay pagos, verificación de identidad ni notificaciones.

## Tecnologías

| Herramienta | Para qué se usa |
| --- | --- |
| [React](https://react.dev) 19 (JavaScript con JSX) | Interfaz |
| [Vite](https://vite.dev) 8 | Servidor de desarrollo y compilación |
| [oxlint](https://oxc.rs) | Revisión de código (`npm run lint`) |
| `node:test` (incluido en Node) | Pruebas automáticas (`npm test`) |

No se usa TypeScript, librería de componentes, enrutador ni gestor de estado: solo React y Vite.

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

| Variable | Valor | Descripción |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `http://127.0.0.1:8000/api` | URL base de la API, **terminada en `/api`**. |
| `VITE_USE_MOCK_API` | `false` | Con `true` se activa el modo demo (ver más abajo). |

Reglas importantes:

- **Reinicia `npm run dev` cada vez que cambies el `.env`**: Vite lo lee solo al arrancar.
- Las variables `VITE_*` **quedan visibles en el navegador**. Nunca pongas contraseñas, claves ni tokens.
- Si `VITE_API_BASE_URL` falta, la pantalla muestra "Falta configurar VITE_API_BASE_URL".

### `VITE_API_BASE_URL`

- **Desarrollo local:** `http://127.0.0.1:8000/api` (la dirección de `php artisan serve`).
- **Demo con ngrok:** la URL pública de ngrok más `/api`, por ejemplo `https://xxxx.ngrok-free.app/api`. Si la URL contiene `ngrok`, el frontend envía el encabezado `ngrok-skip-browser-warning`, y el backend ya lo permite en su CORS. La URL de ngrok puede cambiar cada vez que se reinicia el túnel.
- **Vercel:** define la variable en la configuración del proyecto y vuelve a desplegar, porque Vite la incorpora al **compilar**, no al abrir la página.

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
- El envío **siempre tiene éxito**: no reproduce los errores de validación del servidor (422), ni errores de conexión, ni errores 500. El formulario sí valida en el navegador antes de "enviar".
- El número de solicitud simulado empieza en 1 y se reinicia al recargar la página.
- No sirve para comprobar que el frontend y Laravel se entienden: para eso hay que usar la API real.
- Si el modo demo está desactivado y la API falla, la app muestra el error con "Reintentar". **No cae automáticamente a datos ficticios.**
- No lo dejes en `true` en Vercel: el sitio publicado mostraría datos de demostración.

## Comandos

Ejecútalos dentro de `frontend/`:

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con recarga automática. |
| `npm run build` | Compila para producción en `dist/` (no se sube a Git). |
| `npm run preview` | Sirve localmente lo compilado en `dist/`. Ejecuta antes `npm run build`. |
| `npm run lint` | Revisa el código con oxlint. |
| `npm test` | Ejecuta las pruebas automáticas. |

Última comprobación de esta guía: `npm run build` termina bien, `npm run lint` no da avisos y `npm test` pasa **8 pruebas**.

### Qué cubren las pruebas

Las pruebas están en [`src/services/contract.test.js`](src/services/contract.test.js) y comprueban:

- que una solicitud solo se considera exitosa con **HTTP 201** y una respuesta con `id`, `professional_id` y `status` válidos (según el contrato);
- que respuestas incompletas, con otro código (por ejemplo `200`) o de otro profesional **no** producen una confirmación falsa;
- que la respuesta simulada del modo demo cumple el mismo contrato de éxito.

**No cubren** los componentes de React, el filtro, el formulario ni las llamadas reales con `fetch`. Eso se prueba a mano.

## Conectar con el backend Laravel

Para usar la API real (con `VITE_USE_MOCK_API=false`), el frontend necesita:

1. **El backend encendido** y accesible en la URL de `VITE_API_BASE_URL`. Los pasos para levantarlo (PHP 8.4+, Composer, MySQL/MariaDB, `php artisan migrate --seed`, `php artisan serve`) están en [`../backend/README.md`](../backend/README.md).
2. **Los endpoints del contrato**, con exactamente estas rutas y campos:
   - `GET /api/professionals` (el frontend envía `?service=<oficio>` al filtrar por oficio).
   - `POST /api/service-requests` con `professional_id`, `customer_name`, `contact_phone`, `description` y `neighborhood`. El frontend solo muestra la confirmación si recibe **`201`** con `data.id`, `data.professional_id` y `data.status`.
3. **CORS** que permita el origen del frontend: por defecto `http://localhost:5173` y `http://127.0.0.1:5173`. Para Vercel hay que agregar su dominio en `CORS_ALLOWED_ORIGINS` del `.env` del backend.

Notas:

- El filtro por **oficio** lo hace la API (`?service=`). El filtro por **barrio** se aplica en el navegador sobre la lista recibida.
- Los oficios y barrios que se ofrecen en la búsqueda salen de los profesionales que devuelve la API; no están escritos en el frontend.

### Qué no está comprobado

Estas pruebas se hicieron solo con datos simulados y con la API apagada. **Todavía no se ha verificado el recorrido completo contra el backend Laravel real**: que la lista llegue desde MySQL, que el filtro devuelva lo esperado, que una solicitud válida se guarde y que una inválida muestre los errores de Laravel. Hasta no probarlo, no se debe dar por funcionando la integración.

Para probarla: levanta el backend, desactiva el modo demo, abre el frontend desde `localhost:5173`, filtra, envía una solicitud y confirma que aparece en la base de datos.

## Problemas frecuentes

| Qué ves | Causa probable |
| --- | --- |
| "Falta configurar VITE_API_BASE_URL" | No existe `frontend/.env` o la variable está vacía. Reinicia Vite tras crearlo. |
| "No pudimos conectarnos con el servidor" | La API está apagada, la URL es incorrecta (¿falta `/api`?), no hay internet o **CORS** bloquea el origen (revisa el puerto de Vite). |
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
    ├── App.jsx            # pantalla principal: búsqueda, resultados y estados
    ├── config.js          # lee VITE_API_BASE_URL y VITE_USE_MOCK_API
    ├── index.css          # estilos
    ├── components/        # SearchPanel, CategoryGrid, ProfessionalCard, RequestForm, íconos e ilustración
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
- No cambies rutas ni campos de la API sin acordarlo antes con quien trabaja el backend y actualizar `docs/API_CONTRACT.md`.
