# Instrucciones del repositorio para agentes de código

## Antes de tocar código

1. Lee `README.md` y los documentos pertinentes dentro de `docs/`.
2. Identifica si la tarea corresponde a `frontend/`, `backend/` o al contrato/documentación compartida.
3. Resume el plan en lenguaje sencillo y enumera los archivos que propones modificar.
4. Si la tarea contradice `docs/API_CONTRACT.md` o `docs/MVP.md`, pregunta antes de cambiar el alcance.

## Reglas del equipo

- El equipo está aprendiendo React, Laravel, MySQL y Git. Explica las decisiones; no te limites a producir código.
- Implementa solo la tarea solicitada. No hagas refactors grandes ni añadas paquetes sin justificarlo.
- No cambies archivos del otro área sin necesidad y sin avisar.
- No cambies el contrato API silenciosamente. Propón cambios y deja que Nicolás y Daniel los acuerden.
- No inventes que una funcionalidad funciona: ejecútala o indica claramente que no pudiste probarla.
- Antes de terminar, informa: qué cambió, por qué, qué comandos/pruebas ejecutaste, resultado y pasos pendientes.
- Prefiere una solución sencilla, fácil de explicar y mantener, a una arquitectura sofisticada.
- No crees agentes, automatizaciones, MCP ni nuevas herramientas salvo que se solicite expresamente.
- No ejecutes instaladores descargados de internet (`curl ... | bash`, `iex (...DownloadString(...))`) ni instales Laravel Boost. Dentro de `backend/` rigen además las reglas de `backend/AGENTS.md`.
- No incluyas `.claude/` ni `skills-lock.json` (archivos locales de skills de IA) en los commits del producto.

## Seguridad

- Nunca muestres, copies ni confirmes secretos de `.env`.
- No añadas `.env`, tokens, claves, contraseñas ni datos personales al repositorio.
- No desactives validaciones, CORS ni comprobaciones de seguridad para ocultar errores.
- La demo puede utilizar datos ficticios; no introduzcas datos reales de clientes o profesionales sin autorización.

## Límite de responsabilidad

- `frontend/`: React, Vite, JavaScript, interfaz y consumo de API.
- `backend/`: Laravel, PHP, rutas API, validación, lógica de negocio y persistencia MySQL.
- `docs/`: decisiones y acuerdos que deben conocer ambos lados.

## Revisión

Cuando se te pida revisar, no modifiques archivos. Devuelve hallazgos concretos por gravedad, archivo/línea cuando sea posible, pasos para reproducir y pruebas recomendadas. Si no detectas problemas, dilo sin inventarlos.
