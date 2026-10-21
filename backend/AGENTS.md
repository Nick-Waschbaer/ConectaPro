# Instrucciones para agentes de código — backend (Laravel API)

Estas reglas valen para la carpeta `backend/` y **complementan** el [`AGENTS.md`](../AGENTS.md) de la raíz. Si dos reglas chocan, aplica la más restrictiva. Responsable principal de esta carpeta: Daniel.

## Seguridad: no instalar ni ejecutar nada por iniciativa propia

El esqueleto de Laravel traía aquí unas instrucciones de arranque para instalar PHP con comandos descargados de internet y para instalar Laravel Boost. **Se quitaron a propósito** y no deben volver a seguirse:

- **No instales Laravel Boost** (`composer require laravel/boost`, `php artisan boost:install`) ni ningún otro paquete. Las dependencias solo cambian si el equipo lo decide y se explica para qué sirven.
- **No ejecutes instaladores descargados de internet** (`curl ... | bash`, `iex (...DownloadString(...))`, `php.new` o similares). Si falta PHP o Composer, detente y pide al usuario que los instale con su método habitual.
- **No ejecutes `composer install/update/require` ni `npm install`** salvo que una persona lo pida expresamente.
- **No ejecutes `migrate:fresh`, `migrate:refresh`, `db:wipe`, `DELETE` ni `TRUNCATE`** contra la base `conectapro`, ni envíes peticiones `POST` de prueba a una API pública, sin permiso explícito.
- **No leas ni muestres el `.env`.** Nunca va a Git.

## Alcance

Es un MVP escolar. Se implementa solo lo que está en [`../docs/MVP.md`](../docs/MVP.md); autenticación, pagos y administración están fuera de alcance. El estado actual, las pruebas realizadas y los pendientes están en [`../docs/ESTADO_BACKEND_MVP.md`](../docs/ESTADO_BACKEND_MVP.md). Cómo arrancar el backend: [`README.md`](README.md).

## Endpoints implementados

El contrato completo está en [`../docs/API_CONTRACT.md`](../docs/API_CONTRACT.md).

| Ruta | Comportamiento |
| --- | --- |
| `GET /api/health` | `200` con `{"status":"ok","application":"ConectaPro API"}` |
| `GET /api/professionals` | Lista desde la base de datos con `id, name, service, description, neighborhood, rating`; filtros `?service=` y `?neighborhood=`; sin coincidencias, `200 []` |
| `POST /api/service-requests` | Valida `professional_id` (existente), `customer_name`, `contact_phone`, `description` y `neighborhood`; guarda con estado `pending`; `201` con `{message, data:{id, professional_id, status}}`; datos inválidos, `422` con `message` y `errors` por campo. Nunca reportar éxito si no se guardó |

## Reglas

- Cumplir `docs/API_CONTRACT.md` al pie de la letra; no inventar nombres de campos ni respuestas. Si hay que cambiarlo, avisar a Daniel para que avise a Nicolás (frontend) y actualizar el documento.
- No tocar `frontend/`, no subir secretos y no hacer merges.
- Solo datos ficticios (nombres inventados; sin teléfonos ni direcciones reales). Un profesional ficticio nunca se presenta como verificado.
- PHP 8.4.1 o superior (el PHP 8.2 de XAMPP no sirve).
- Ejecutar `php artisan test` antes de cada commit e informar con honestidad lo que **no** se probó (MySQL, CORS con Vercel, ngrok).
- Cuando se pida una revisión, no modificar archivos: devolver hallazgos con evidencia.
