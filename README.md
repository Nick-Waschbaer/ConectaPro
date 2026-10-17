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

Los comandos definitivos se documentarán aquí cuando se hayan confirmado las configuraciones de `frontend/` y `backend/`. Como referencia general:

- Frontend: instalar dependencias con `npm install` y ejecutar `npm run dev` dentro de `frontend/`.
- Backend: instalar dependencias con `composer install`, preparar el `.env`, configurar MySQL, ejecutar `php artisan migrate` y arrancar Laravel con `php artisan serve` dentro de `backend/`.

No subir nunca archivos `.env`, contraseñas, claves API ni datos personales reales.
