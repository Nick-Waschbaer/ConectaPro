# Tarjetas iniciales para GitHub Projects

> **Documento histórico (tarjetas iniciales).** Las casillas **no se actualizaron** y no reflejan el estado actual. El seguimiento real se lleva en los issues y el tablero de GitHub (el equipo informa que los issues #7 y #16 están cerrados; su contenido no está en el repositorio). El estado técnico verificado está en [`ESTADO_BACKEND_MVP.md`](ESTADO_BACKEND_MVP.md).

Crear un tablero Kanban con estados `Por hacer`, `En progreso`, `En revisión` y `Terminado`. Cada elemento siguiente puede crearse como Issue y añadirse al Project.

## Bloqueantes compartidos

- [ ] Crear repositorio ConectaPro y agregar a ambos integrantes.
- [ ] Subir documentación inicial y revisar que no incluya secretos.
- [ ] Crear `frontend/` React/Vite y `backend/` Laravel.
- [ ] Confirmar y congelar el contrato API inicial.

## Backend — Daniel

- [ ] Comprobar `GET /api/health` devuelve JSON y HTTP 200.
- [ ] Configurar MySQL local y documentar el nombre de la base (sin contraseñas).
- [ ] Crear migración/modelo para solicitudes de servicio.
- [ ] Implementar `GET /api/professionals` con datos ficticios.
- [ ] Implementar `POST /api/service-requests` con validación y persistencia.
- [ ] Probar respuesta 201 y respuesta 422.

## Frontend — Nicolás

- [ ] Crear layout responsive básico con título y navegación.
- [ ] Obtener profesionales del endpoint de Laravel.
- [ ] Implementar filtro por oficio.
- [ ] Crear formulario de solicitud asociado al profesional.
- [ ] Mostrar loading, éxito, lista vacía y errores.
- [ ] Configurar URL del API mediante `VITE_API_BASE_URL`.

## Integración — ambos

- [ ] Probar un flujo completo frontend → Laravel → MySQL.
- [ ] Configurar y probar CORS desde el origen real del frontend.
- [ ] Publicar frontend en Vercel.
- [ ] Exponer backend con ngrok y probar desde la URL pública.
- [ ] Preparar datos y plan de respaldo para la demo.
- [ ] Revisar README, commits, archivos ignorados y ausencia de secretos.
- [ ] Preparar y ensayar la presentación.
