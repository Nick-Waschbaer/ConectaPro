# Flujo de trabajo de dos personas

## Responsabilidades principales

- **Nicolás:** `frontend/` (React, Vite, interfaz y llamadas al API).
- **Daniel:** `backend/` (Laravel, rutas API, validación, lógica y MySQL).
- **Ambos:** `docs/`, pruebas integradas, presentación y decisiones que cambien el contrato API.

Ser responsable principal no significa que el otro no pueda leer o aprender esa parte. Significa que una persona coordina los cambios de esa zona.

## Tareas pequeñas

Cada tarea de GitHub Projects debe incluir:

- Qué problema resuelve.
- Qué archivos/área afecta.
- Cómo comprobar que funciona.
- Quién es responsable.

Una tarea debe poder completarse y probarse en unas horas, no abarcar todo un módulo.

## Estados del tablero

- `Por hacer`: nadie empezó.
- `En progreso`: alguien trabaja en ello.
- `En revisión`: ya hay cambios, pero falta revisión/prueba.
- `Terminado`: se probó y se integró en la rama principal.

## Git, explicado de forma práctica

- `git status`: muestra qué cambió.
- `git add <archivo>`: prepara cambios para el próximo commit.
- `git commit -m "mensaje"`: guarda una versión local con un mensaje.
- `git push`: envía commits a GitHub.
- `git pull`: trae y combina cambios remotos en la rama actual.
- `git switch -c nombre-rama`: crea y cambia a una rama de trabajo.

## Flujo recomendado

1. Antes de empezar, comprobar `git status` y sincronizar la rama según el flujo acordado.
2. Crear una rama corta para la tarea, por ejemplo `feat/professionals-api` o `feat/professionals-page`.
3. Modificar solo la parte asignada; no permitir que dos agentes escriban a la vez en los mismos archivos.
4. Ejecutar pruebas y revisar `git diff` para inspeccionar exactamente los cambios.
5. Guardar un commit con mensaje descriptivo y hacer `git push`.
6. Abrir un Pull Request hacia `main`; el compañero revisa y se integra cuando pasa las comprobaciones.
7. Después de integrar, volver a sincronizar antes de la tarea siguiente.

Como ambos recién aprenden branches, pueden pedir ayuda antes de cada primer Pull Request. No hagan `git push --force`, `git reset --hard` ni borrados masivos como solución improvisada.

## Regla para cambios compartidos

Si una tarea necesita cambiar `docs/API_CONTRACT.md`, primero acordarla entre Nicolás y Daniel. Después ambos actualizan su implementación para mantener compatibilidad.
