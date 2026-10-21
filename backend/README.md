# ConectaPro — Backend (Laravel API)

API en Laravel 13 + MySQL/MariaDB para el MVP de ConectaPro. Solo devuelve JSON; el frontend es React (carpeta `frontend/`). El contrato de la API está en `../docs/API_CONTRACT.md`.

## Requisitos

- **PHP 8.4.1 o superior** (probado con 8.5) y Composer. `composer.json` declara `^8.3`, pero varias dependencias bloqueadas en `composer.lock` exigen 8.4.1 o más.
- MySQL o MariaDB (por ejemplo el de XAMPP).

> **Cuidado con XAMPP:** su PHP (`C:\xampp\php`) es 8.2 y **no sirve**: las dependencias exigen PHP ≥ 8.4.1 y fallan con *"Composer detected issues in your platform"* (también PHPUnit). Usa el PHP de Herd u otro PHP 8.4+. Comprueba cuál usa tu terminal con `php -v` y `where php`.

## Primera puesta en marcha

Desde la carpeta `backend/`:

```bash
composer install
cp .env.example .env
php artisan key:generate
```

Enciende **MySQL** en el panel de XAMPP y crea la base (una sola vez):

```bash
mysql -uroot -e "CREATE DATABASE IF NOT EXISTS conectapro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

(o créala desde phpMyAdmin con el nombre `conectapro`). Revisa en `.env` que `DB_CONNECTION=mysql`, `DB_DATABASE=conectapro` y `DB_USERNAME`/`DB_PASSWORD` coincidan con tu MySQL (en XAMPP, `root` sin contraseña).

Crea las tablas y carga los profesionales ficticios:

```bash
php artisan migrate --seed
```

- `migrate` crea las tablas y es seguro repetirlo: solo ejecuta las migraciones pendientes.
- `--seed` carga 100 profesionales ficticios (7 oficios y 10 barrios, con todas las combinaciones de oficio y barrio cubiertas; los nombres son inventados). Repetirlo no duplica datos (usa `updateOrCreate` por nombre). Si tu base tenía los 6 profesionales antiguos con "(demo)" en el nombre, el seeder les quita ese sufijo conservando sus IDs, así que las solicitudes ya guardadas siguen vinculadas.
- Solo cargar los profesionales: `php artisan db:seed`.
- **Nunca** uses `migrate:fresh` ni `migrate:refresh` salvo que quieras borrar todos los datos.

## Arrancar

```bash
php artisan serve
```

La API queda en `http://127.0.0.1:8000/api`. Pruebas rápidas:

```bash
curl http://127.0.0.1:8000/api/health
curl "http://127.0.0.1:8000/api/professionals?service=Electricidad"
```

## Endpoints

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/health` | Comprueba que la API funciona |
| GET | `/api/professionals` | Lista profesionales; filtros opcionales `service` y `neighborhood` |
| POST | `/api/service-requests` | Valida y guarda una solicitud (201, o 422 con errores por campo) |

## CORS (qué sitios pueden llamar a la API)

Se configura en `config/cors.php` y se controla con `CORS_ALLOWED_ORIGINS` en el `.env` (lista separada por comas, sin `/` final). Por defecto solo permite Vite local (`http://localhost:5173` y `http://127.0.0.1:5173`).

**Cuando se conozca el dominio real de Vercel**, agrégalo en tu `.env` y reinicia `php artisan serve`:

```env
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,https://TU-PROYECTO.vercel.app
```

Si cambia la URL de ngrok no hay que tocar CORS: CORS depende del origen del *frontend*, no de la URL del backend.

## Pruebas

```bash
php artisan test
```

Las pruebas usan SQLite en memoria (ver `phpunit.xml`), así que **no tocan tu base MySQL**.

## Para la demo (ngrok)

El frontend se publica en Vercel y esta API, que corre en la laptop, se expone a internet con ngrok. **No se escribe aquí ninguna URL de ngrok**: la gratuita cambia cada vez que se reinicia el túnel.

1. Enciende MySQL y arranca la API (`php artisan serve`). Revisa que el `.env` tenga **una sola línea** `APP_DEBUG=false` (con `true`, un error podría mostrar rutas internas y datos de conexión por el túnel público).
2. En otra terminal abre el túnel solo hacia el puerto de Laravel: `ngrok http 8000`. Copia la dirección `https://…` que muestra.
3. Comprueba desde otro dispositivo que `<esa dirección>/api/health` devuelve `{"status":"ok","application":"ConectaPro API"}`.
4. Pásale a Nicolás esa dirección **terminada en `/api`**: es el valor de `VITE_API_BASE_URL` en Vercel y hay que volver a desplegar el frontend.
5. El origen que debe permitir el CORS es el de la **demo oficial**, la *Preview* de Vercel indicada en [`../docs/ESTADO_BACKEND_MVP.md`](../docs/ESTADO_BACKEND_MVP.md#57-url-oficial-de-la-demostración) (sección 5.7); **no** el dominio de producción. Si no está ya, agrégalo (sin quitar los anteriores y sin `/` final) en `CORS_ALLOWED_ORIGINS` del `.env` y reinicia `php artisan serve`:

   ```env
   CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,https://LA-DIRECCION-DE-VERCEL
   ```

6. Haz una prueba completa desde la página de Vercel: listar, filtrar, enviar una solicitud y confirmar que aparece en la tabla `service_requests`. Si reinicias ngrok, la dirección cambia y hay que repetir los pasos 4 y 6.

Mantén encendidos MySQL, `php artisan serve` y ngrok durante toda la demostración, y evita que la laptop se suspenda. Nunca subas el `.env` a Git.

## Estado y verificación

Qué se probó, con qué evidencia y qué puede cambiar (ngrok, CORS) está en [`../docs/ESTADO_BACKEND_MVP.md`](../docs/ESTADO_BACKEND_MVP.md). El contrato de los endpoints está en [`../docs/API_CONTRACT.md`](../docs/API_CONTRACT.md).

## Instrucciones para agentes de código

Este backend **no usa Laravel Boost** ni lo necesita para esta entrega. Los agentes no deben instalarlo ni ejecutar instaladores descargados de internet; las reglas vigentes están en [`AGENTS.md`](AGENTS.md).
