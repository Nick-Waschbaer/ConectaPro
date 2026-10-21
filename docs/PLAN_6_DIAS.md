# Plan de trabajo hasta la entrega

> **Documento histórico (planificación inicial).** Describe el plan de trabajo que se previó, no el estado actual del proyecto. El estado real está en [`../README.md`](../README.md), en la sección «Estado de la entrega» de [`MVP.md`](MVP.md) y en [`ESTADO_BACKEND_MVP.md`](ESTADO_BACKEND_MVP.md).

Ajusten el plan a la hora real de presentación. Si un objetivo se retrasa, reduzcan alcance antes de comprometer la demo.

## Día 1 — Base compartida

- Crear repositorio único y agregar a ambos integrantes.
- Subir documentos de contexto e instrucciones.
- Crear carpeta `backend/` con Laravel y `frontend/` con React/Vite.
- Verificar que ambas apps arrancan localmente en sus respectivas máquinas.

## Día 2 — API y datos

- Daniel crea las rutas de salud y listado de profesionales.
- Daniel configura MySQL y prepara datos ficticios.
- Nicolás crea la página de búsqueda y las tarjetas de profesionales.
- Ambos verifican que el frontend obtiene datos reales de Laravel.

## Día 3 — Solicitudes

- Crear formulario asociado a un profesional.
- Validar datos en Laravel.
- Guardar la solicitud en MySQL y devolver `201 Created`.
- Mostrar estado de éxito y errores en React.

## Día 4 — Integración y calidad

- Probar filtros, lista vacía, datos inválidos y errores de servidor.
- Revisar código, seguridad básica y README.
- No añadir funciones grandes antes de que el recorrido principal sea estable.

## Día 5 — Publicación de la demo

- Desplegar frontend en Vercel.
- Exponer backend con ngrok.
- Configurar URL API y CORS según dominios reales.
- Probar desde navegador limpio y preparar capturas/vídeo de respaldo.

## Día 6 — Congelación y presentación

- Corregir defectos críticos; congelar nuevas funcionalidades.
- Verificar historial Git y que no haya secretos en el repositorio.
- Preparar diapositivas: problema, solución, módulos, arquitectura, demo y estado real.
- Ensayar quién explica cada parte y qué hacer si Internet o ngrok fallan.
