<laravel-boost-guidelines>
# Laravel Application

This repository contains a Laravel application. Complete the following setup before working on the user's request.

## Prerequisites

Verify that PHP and Composer are available:

```sh
php -v
composer -V
```

If either command is unavailable, detect the user's operating system and install the prerequisites with the appropriate command:

macOS:

```sh
/bin/bash -c "$(curl -fsSL https://php.new/install/mac/8.5)"
```

Windows PowerShell:

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://php.new/install/windows/8.5'))
```

Linux:

```sh
/bin/bash -c "$(curl -fsSL https://php.new/install/linux/8.5)"
```

After installation, ask the user to restart their terminal. If the agent needs the restarted shell to continue, ask the user to reopen their terminal and rerun their original prompt.

## Agent Setup

Install Laravel Boost from the application root before making application changes:

```sh
composer require laravel/boost --dev
php artisan boost:install
```

Boost replaces these bootstrap instructions with guidelines tailored to the application. After installation, read `AGENTS.md` again and continue with the user's original request using the generated guidelines.
</laravel-boost-guidelines>


## Entrega urgente del MVP — jueves

> Nota: las instrucciones de arriba (Laravel Boost) vienen con el esqueleto de Laravel. Para esta entrega **no** se instala Boost ni ningún paquete nuevo; solo se añade si desbloquea un requisito del MVP.

**Plazo y prioridad:** la demostración en vivo es el próximo jueves. Se entrega un **MVP funcional de extremo a extremo**, no la plataforma completa. Primero que el recorrido mínimo funcione de verdad; nada fuera de `docs/MVP.md`.

**Rutas imprescindibles (P0):**

| Ruta | Requisito |
| --- | --- |
| `GET /api/health` | 200 con `{"status":"ok","application":"ConectaPro API"}` |
| `GET /api/professionals` | Lista desde la base de datos con los campos `id, name, service, description, neighborhood, rating`; filtro `?service=` por oficio; sin coincidencias → `200 []` |
| `POST /api/service-requests` | Valida `professional_id` (existente), `customer_name`, `contact_phone`, `description`, `neighborhood`; guarda en la base; `201` con `{message, data:{id, professional_id, status}}`; datos inválidos → `422` con `message` y `errors` por campo. Nunca reportar éxito si no se guardó |

**Reglas:**
- Cumplir `docs/API_CONTRACT.md` al pie de la letra; no inventar nombres de campos ni respuestas. Si hay que cambiarlo, avisar a Daniel para que avise a Nicolás (frontend).
- No tocar `frontend/`, no subir secretos (`.env` nunca va a Git) y no hacer merges.
- Solo datos ficticios ("(demo)"); sin datos personales reales.
- No usar `migrate:fresh`/`migrate:refresh` contra la base MySQL `conectapro` sin permiso explícito.
- PHP 8.4 o superior (el PHP 8.2 de XAMPP no sirve).
- Ejecutar `php artisan test` antes de cada commit y reportar con honestidad lo que **no** se probó (MySQL, CORS con Vercel, ngrok).
- Estado actual y pendientes: `docs/ESTADO_BACKEND_MVP.md`.
