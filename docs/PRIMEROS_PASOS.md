# Primeros pasos — comenzar hoy

> **Documento histórico (planificación inicial).** Estos pasos ya se realizaron; no son las instrucciones para arrancar el proyecto hoy. Para ejecutarlo, usa [`../README.md`](../README.md), [`../frontend/README.md`](../frontend/README.md) y [`../backend/README.md`](../backend/README.md). Algunas frases mencionan un PRD que no está en este repositorio, y React Compiler **no** llegó a integrarse en el frontend.

## Decisión inicial

Usar un único repositorio GitHub llamado `ConectaPro` con `frontend/`, `backend/` y `docs/`. Crear el repositorio vacío evita conflictos entre un README remoto y archivos locales.

## Paso 1 — Crear el repositorio

1. Nicolás crea `ConectaPro` en GitHub, sin inicializarlo con README, `.gitignore` ni licencia.
2. Añade a Daniel como colaborador con permiso de escritura.
3. Copia los archivos Markdown de este paquete al repositorio local recién clonado y hace un commit inicial de documentación.

## Paso 2 — Crear las carpetas de la aplicación

Desde la raíz del repositorio, crear `frontend/` y `backend/`. No mover aún el proyecto `C:\proyectos\aprediendo-laravel` sin comprobar primero si contiene una carpeta `.git`. La forma más simple y segura es usarlo como laboratorio y crear el backend definitivo dentro del repo compartido después del commit inicial.

## Paso 3 — Preparar Laravel en `backend/`

Desde la raíz de `ConectaPro`, ejecutar el instalador Laravel para crear el proyecto dentro de `backend/`, seleccionando una instalación mínima sin starter kit de frontend. No se necesita una interfaz Blade para el frontend definitivo; la API se consumirá desde React.

Como Laravel Prompts mostró problemas con las flechas de selección en el equipo, si vuelve a fallar, no improvisar: cancelar el prompt sin borrar archivos y usar las opciones no interactivas disponibles para la versión instalada, o preguntar antes de continuar.

## Paso 4 — Preparar React en `frontend/`

Desde la raíz del repositorio, crear la aplicación Vite con plantilla React JavaScript dentro de `frontend/`. Instalar dependencias y verificar que el servidor de desarrollo arranque. React Compiler es deseado por el PRD, pero si configurarlo amenaza con retrasar el primer flujo funcional, posponer su integración hasta tener la app básica funcionando.

## Paso 5 — Acordar el contrato

Leer juntos `API_CONTRACT.md`. No empezar a cambiar ambos lados hasta confirmar rutas, campos de petición, respuestas y errores. Luego Daniel implementa primero `GET /api/health` y `GET /api/professionals`; Nicolás puede hacer la interfaz con datos temporales mientras espera que la API esté lista.

## Paso 6 — MySQL

Daniel confirma que MySQL/MariaDB de XAMPP inicia y crea una base local para ConectaPro. Configura las variables solo en `backend/.env`, mantiene las credenciales fuera de Git y ejecuta migraciones. Si MySQL bloquea el primer día, comunicarlo pronto y pedir una decisión de contingencia antes de diseñar toda la aplicación sobre otra base de datos.

## Paso 7 — Primer flujo completo

1. Laravel devuelve una lista ficticia de profesionales.
2. React la obtiene mediante `fetch` y la muestra.
3. React envía una solicitud con datos ficticios.
4. Laravel valida y guarda en MySQL.
5. React muestra la confirmación/error.

No pasar a más módulos hasta completar y probar este flujo.

## Paso 8 — Despliegue

Solo cuando funcione localmente: frontend a Vercel, Laravel local expuesto con ngrok y variables/CORS configurados para los orígenes reales. Mantener la laptop de Daniel, MySQL y el túnel funcionando durante la demo.
