# ConectaPro — Backend (Laravel API)

API en Laravel 13 + MySQL/MariaDB para el MVP de ConectaPro. Solo devuelve JSON; el frontend es React (carpeta `frontend/`). El contrato de la API está en `../docs/API_CONTRACT.md`.

## Requisitos

- **PHP 8.4 o superior** (probado con 8.5) y Composer.
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
- `--seed` carga 6 profesionales ficticios ("(demo)"). Repetirlo no duplica datos (usa `updateOrCreate`).
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

## Para la demo

Poner `APP_DEBUG=false` en el `.env` antes de exponer la API con ngrok, para no mostrar errores internos. Nunca subas el `.env` a Git.
