# Instrucciones para Claude Code

Antes de implementar, lee `AGENTS.md` y los documentos relevantes de `docs/`. Este repositorio pertenece a dos estudiantes que están aprendiendo, así que explica en español claro qué harás y por qué.

## Forma de trabajo

1. Confirma el objetivo concreto y el criterio para considerar la tarea terminada.
2. Inspecciona el código existente antes de crear o reemplazar archivos.
3. Propón un plan breve y señala los archivos que modificarás.
4. Implementa el cambio mínimo que cumpla el objetivo.
5. Ejecuta las pruebas o comprobaciones disponibles.
6. Resume los archivos modificados, las pruebas ejecutadas y los pendientes.

## No hacer

- No implementar funciones fuera del alcance del MVP.
- No reescribir todo el proyecto para resolver un problema pequeño.
- No modificar en silencio el contrato de `docs/API_CONTRACT.md`.
- No asumir que MySQL, CORS, autenticación o despliegue funcionan sin comprobarlo.
- No añadir dependencias sin explicar para qué sirven.
- No leer ni exponer secretos del archivo `.env`.
- No ejecutar instaladores descargados de internet (`curl ... | bash`, `iex (...DownloadString(...))`) ni instalar Laravel Boost. En `backend/` rigen además `backend/AGENTS.md` y `backend/CLAUDE.md`.
- No incluir `.claude/` ni `skills-lock.json` (archivos locales de skills) en los commits del producto.
- No hacer commits, pushes, merges ni operaciones destructivas de Git sin que un humano lo pida expresamente.

## División de trabajo

Nicolás es responsable principal de `frontend/`; Daniel, de `backend/`. Si necesitas modificar la otra área para completar una tarea, explica por qué y pide confirmación antes de hacerlo.
