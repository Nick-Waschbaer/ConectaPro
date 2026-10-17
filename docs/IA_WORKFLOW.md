# Flujo de trabajo con ChatGPT, Claude Code y Codex

## Roles

- **ChatGPT:** explicar conceptos, ayudar a elegir el alcance, diseñar tareas y preparar prompts claros a partir de lo que necesita el equipo.
- **Claude Code:** implementar la tarea aprobada en la copia local del repositorio.
- **Codex:** revisar cambios, buscar defectos, comprobar el contrato y sugerir pruebas. Durante una revisión, pedirle que no edite archivos.
- **Nicolás y Daniel:** responsables de decisiones, ejecución de pruebas, comprensión y aceptación de los cambios.

Pueden intercambiar roles si una herramienta da mejor resultado para una tarea. No es necesario instalar ni usar todas las IAs en cada tarea.

## Secuencia para cada tarea

1. Elegir una tarjeta concreta del tablero.
2. Consultar ChatGPT con el objetivo, los archivos/área y el criterio de aceptación. Pedir un prompt de implementación para Claude Code.
3. Abrir Claude Code desde la carpeta del repositorio y pedirle que lea `CLAUDE.md`, `AGENTS.md` y los documentos relacionados.
4. Claude debe explicar el plan antes de cambios y luego implementar solo el alcance aprobado.
5. Ejecutar la app/pruebas y revisar `git diff`.
6. Pedir a Codex una revisión de solo lectura, pasando el objetivo y los cambios; pedir hallazgos priorizados, evidencia y pruebas sugeridas.
7. Si hay un hallazgo válido, decidir si se corrige ahora. Repetir pruebas.
8. El humano guarda el commit y actualiza la tarjeta del tablero.

## Plantilla para pedirle una tarea a ChatGPT

> Estamos trabajando en ConectaPro. La tarea asignada es: [describir tarea]. Responsable: [Nicolás/frontend o Daniel/backend]. Lee el contexto de `docs/PROYECTO.md`, `docs/MVP.md`, `docs/ARQUITECTURA.md` y, si hay comunicación entre frontend/backend, `docs/API_CONTRACT.md`. Somos principiantes: explícanos qué debemos conseguir, cómo comprobarlo y qué riesgos hay. Prepara un prompt concreto para Claude Code que limite los cambios a esta tarea. No inventes que algo está implementado. Si falta una decisión importante, pregúntanos antes de asumirla.

## Plantilla para implementar con Claude Code

> Lee `CLAUDE.md`, `AGENTS.md` y los documentos pertinentes. La tarea es: [tarea]. Antes de editar, explica en español sencillo el plan y los archivos que tocarás. Implementa únicamente lo necesario, no cambies el contrato API sin avisar, no leas ni expongas secretos de `.env`, ejecuta pruebas/comprobaciones y resume los cambios y limitaciones.

## Plantilla de revisión con Codex

> Revisa los cambios de la tarea [tarea] contra `AGENTS.md`, `docs/MVP.md` y `docs/API_CONTRACT.md`. Solo lectura: no edites archivos ni hagas commits. Busca bugs, problemas de seguridad, incompatibilidades de API y ausencia de pruebas. Devuelve primero hallazgos reales ordenados por gravedad, con archivo/línea y cómo reproducir. Distingue errores confirmados de sospechas. Si no ves problemas relevantes, dilo claramente.

## Cómo evitar que los agentes se pisen

- No ejecutar dos agentes con permiso de edición simultáneamente en la misma carpeta/archivos.
- No pedir a Codex que corrija automáticamente mientras Claude aún implementa.
- La revisión debe ocurrir después de que el implementador termine y se inspeccionen los cambios.
- Para trabajo paralelo real, usar ramas separadas y luego Pull Requests. No introducir worktrees ni orquestación multiagente antes de dominar este flujo básico.
