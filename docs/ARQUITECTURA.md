# Arquitectura propuesta

## Estructura del repositorio

```text
ConectaPro/
├── frontend/       # React + Vite + JavaScript; responsabilidad principal: Nicolás
├── backend/        # Laravel + PHP; responsabilidad principal: Daniel
├── docs/           # documentación compartida
├── README.md
├── AGENTS.md       # instrucciones para Codex y agentes compatibles
└── CLAUDE.md       # instrucciones de Claude Code
```

## Cómo viaja una solicitud

```text
Navegador del cliente
  -> frontend React desplegado en Vercel
  -> petición HTTP/JSON a la URL pública del API
  -> túnel ngrok
  -> Laravel en la laptop de Daniel
  -> MySQL local
  -> respuesta JSON en sentido inverso
```

## Responsabilidades

### Frontend

- Mostrar páginas, tarjetas, filtros y formularios.
- Validar datos sencillos para mejorar la experiencia, sin reemplazar la validación del servidor.
- Llamar a la API mediante una URL configurable.
- Gestionar estados de carga, éxito, vacío y error.
- Mantener el diseño usable en móvil y escritorio.

### Backend

- Definir endpoints y validar cada petición.
- Aplicar reglas de negocio.
- Leer/escribir datos en MySQL.
- Responder JSON con códigos HTTP adecuados.
- Mantener configuración y secretos fuera del repositorio.

## Variables de entorno

Frontend: `VITE_API_BASE_URL` debe contener la URL base pública de la API; por ejemplo, la URL de ngrok terminada en `/api`. Las variables `VITE_*` quedan expuestas al navegador: nunca guardar secretos en ellas.

Frontend, modo demostración: `VITE_USE_MOCK_API=true` sustituye la API por datos ficticios **solo para probar la interfaz sin backend**; no guarda nada. Debe estar ausente o en `false` en la demostración pública. Detalles en [`../frontend/README.md`](../frontend/README.md).

Backend: `.env` contiene la configuración local de Laravel y base de datos. Nunca subirlo a GitHub. Mantener `.env.example` sin contraseñas reales.

## Desarrollo y demostración

- Desarrollo frontend: servidor Vite local.
- Desarrollo backend: `php artisan serve`.
- Base de datos: MySQL local, por ejemplo el MySQL/MariaDB de XAMPP, configurado para el proyecto Laravel.
- Demo pública: Vercel para frontend y ngrok para exponer el backend local.

La URL del túnel puede cambiar o estar sujeta a límites del plan gratuito. Daniel debe mantener encendidos y funcionando Laravel, MySQL y ngrok durante la demo. Esto es adecuado como puente de demostración, no como alojamiento productivo permanente.

## CORS

El backend debe permitir el origen del frontend local durante desarrollo y el dominio Vercel utilizado para la entrega. No resolver errores usando configuraciones amplias sin entender el riesgo; probar la configuración real del navegador.

## Estado de implementación

La arquitectura descrita arriba **está implementada**: React (frontend) llama a la API de Laravel, que valida y guarda en MySQL. Qué se probó, con qué evidencia y qué aspectos operativos pueden cambiar (URL de ngrok, CORS, variables de Vercel) está en [`ESTADO_BACKEND_MVP.md`](ESTADO_BACKEND_MVP.md); los endpoints, en [`API_CONTRACT.md`](API_CONTRACT.md).
