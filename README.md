# ConectaPro

Marketplace web para conectar clientes con profesionales independientes de servicios del hogar en Asunción, Paraguay.

> **Entrega escolar:** MVP funcional y demostrable. Este repositorio no debe prometer como terminadas funciones que solo estén diseñadas o simuladas.

## Cómo está organizado

- `frontend/`: React + Vite + JavaScript. Responsable principal: Nicolás.
- `backend/`: Laravel + PHP + MySQL. Responsable principal: Daniel.
- `docs/`: requisitos, arquitectura, contrato API y flujo de trabajo.
- `AGENTS.md`: instrucciones compartidas para agentes de código, especialmente Codex.
- `CLAUDE.md`: instrucciones de proyecto para Claude Code.

## Objetivo del MVP

1. Mostrar profesionales de ejemplo obtenidos desde Laravel.
2. Filtrar profesionales por oficio.
3. Enviar una solicitud de servicio y guardarla en la base de datos.
4. Mostrar confirmación o errores útiles.
5. Desplegar el frontend en Vercel y, para la demostración, exponer el backend local mediante ngrok.

Leer primero:

1. `docs/PROYECTO.md`
2. `docs/MVP.md`
3. `docs/ARQUITECTURA.md`
4. `docs/API_CONTRACT.md`
5. `docs/FLUJO_TRABAJO.md`
6. `docs/IA_WORKFLOW.md`
7. `docs/PRIMEROS_PASOS.md`

## Desarrollo local

### Backend (`backend/`)

Requiere **PHP 8.4 o superior** (el PHP 8.2 de XAMPP no sirve) y MySQL encendido. Resumen:

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed   # crea las tablas y carga profesionales ficticios
php artisan serve            # API en http://127.0.0.1:8000/api
php artisan test             # pruebas (usan SQLite en memoria, no tocan MySQL)
```

Los pasos completos (crear la base `conectapro`, CORS para Vercel, etc.) están en [`backend/README.md`](backend/README.md).

### Frontend (`frontend/`)

Pendiente de documentar por Nicolás. Como referencia general: `npm install` y `npm run dev` dentro de `frontend/`.

No subir nunca archivos `.env`, contraseñas, claves API ni datos personales reales.
