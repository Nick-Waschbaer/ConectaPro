# ConectaPro

Marketplace web que conecta a clientes con profesionales independientes de servicios del hogar en Asunción, Paraguay.

> **Entrega escolar:** este repositorio contiene un **MVP funcional y demostrable**, no la plataforma completa. Los profesionales y las solicitudes son datos de prueba. Aquí se distingue siempre entre lo **implementado**, lo **verificado** y lo **planificado para futuras fases**.

## Qué es ConectaPro

Una persona que necesita un técnico o un servicio de mantenimiento (electricidad, plomería, pintura, etc.) puede buscar profesionales de su zona, compararlos y enviarles una solicitud de servicio. La idea completa del producto (la visión) está resumida en [`docs/PROYECTO.md`](docs/PROYECTO.md); lo que se construyó para esta entrega está acotado en [`docs/MVP.md`](docs/MVP.md).

## Qué incluye el MVP actual

Implementado en el código de este repositorio:

- **Listado de profesionales** pedido a la API de Laravel (`GET /api/professionals`). El seeder carga unos 100 profesionales ficticios, repartidos en 7 oficios y 10 barrios de Asunción.
- **Búsqueda y filtros:** por **oficio** (lo filtra la API con `?service=`) y por **barrio** (se aplica en el navegador sobre la lista recibida), con atajos por oficio y botón "Quitar filtros".
- **Solicitud de servicio** a un profesional (`POST /api/service-requests`): formulario con validación en el navegador y validación definitiva en Laravel.
- **Estados claros en pantalla:** carga, lista vacía, errores de validación (HTTP 422), error de conexión y confirmación de éxito. El frontend solo confirma si el servidor responde **HTTP 201** con los datos esperados.
- **Persistencia real** de las solicitudes en MySQL/MariaDB.
- **Comprobación de salud** del backend (`GET /api/health`).
- **Modo demostración opcional** del frontend (`VITE_USE_MOCK_API=true`) para probar la interfaz sin backend. Está desactivado por defecto y **no guarda nada**.
- **Despliegue previsto para la demo:** frontend en Vercel y backend de Laravel local expuesto con ngrok (ver [`docs/ARQUITECTURA.md`](docs/ARQUITECTURA.md)).

## Qué NO incluye (futuras fases)

No está implementado, aunque aparezca en la visión del producto: autenticación y roles, perfiles o portafolios editables, validación real de profesionales, gestión integral de trabajos, historial, reseñas reales (el `rating` mostrado es un dato ficticio), pagos, comisiones, comprobantes y reportes financieros, chat y notificaciones. El detalle módulo por módulo está en [`docs/PROYECTO.md`](docs/PROYECTO.md).

## Tecnologías

| Parte | Tecnologías |
| --- | --- |
| Frontend (`frontend/`) | React 19 (JavaScript con JSX), Vite 8, CSS propio, oxlint, `node:test` |
| Backend (`backend/`) | PHP 8.4 o superior, Laravel 13, MySQL/MariaDB (XAMPP), PHPUnit |
| Publicación de la demo | Vercel (frontend) y ngrok (túnel hacia Laravel local) |

## Estructura del repositorio

```text
ConectaPro/
├── frontend/          # React + Vite (responsable principal: Nicolás)
│   └── README.md      # instalación, variables, modo demo, pruebas
├── backend/           # Laravel API + MySQL (responsable principal: Daniel)
│   └── README.md      # instalación, base de datos, CORS, pruebas, ngrok
├── docs/              # requisitos, arquitectura, contrato de API, estado y flujo de trabajo
├── README.md          # este archivo
├── AGENTS.md          # instrucciones para agentes de código (Codex y compatibles)
└── CLAUDE.md          # instrucciones para Claude Code
```

## Documentación

| Documento | Para qué sirve |
| --- | --- |
| [`docs/PROYECTO.md`](docs/PROYECTO.md) | Idea, problema, modelo de negocio previsto y visión; incluye qué módulos están implementados |
| [`docs/MVP.md`](docs/MVP.md) | Alcance de la entrega, criterios de aceptación y su estado |
| [`docs/ARQUITECTURA.md`](docs/ARQUITECTURA.md) | Cómo viaja una solicitud, responsabilidades, variables de entorno y CORS |
| [`docs/API_CONTRACT.md`](docs/API_CONTRACT.md) | Endpoints, campos y respuestas de la API |
| [`docs/ESTADO_BACKEND_MVP.md`](docs/ESTADO_BACKEND_MVP.md) | Qué se probó, con qué evidencia y qué puede cambiar (ngrok, CORS) |
| [`frontend/README.md`](frontend/README.md) | Guía del frontend |
| [`backend/README.md`](backend/README.md) | Guía del backend |
| [`docs/FLUJO_TRABAJO.md`](docs/FLUJO_TRABAJO.md), [`docs/IA_WORKFLOW.md`](docs/IA_WORKFLOW.md) | Cómo trabajan Nicolás y Daniel, y cómo usan las herramientas de IA |
| [`docs/PLAN_6_DIAS.md`](docs/PLAN_6_DIAS.md), [`docs/PRIMEROS_PASOS.md`](docs/PRIMEROS_PASOS.md), [`docs/TABLERO_INICIAL.md`](docs/TABLERO_INICIAL.md) | Planificación inicial (histórica) |

## Cómo empezar

Necesitas Node.js 20.19+ (o 22.12+), PHP 8.4.1 o superior con Composer, y MySQL/MariaDB (por ejemplo el de XAMPP). El PHP 8.2 de XAMPP **no sirve**.

### Backend (`backend/`)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed   # crea las tablas y carga los profesionales ficticios
php artisan serve            # API en http://127.0.0.1:8000/api
php artisan test             # pruebas (SQLite en memoria; no tocan MySQL)
```

Antes de `migrate`, hay que encender MySQL y crear la base `conectapro`. Los pasos completos, CORS y el procedimiento de ngrok están en [`backend/README.md`](backend/README.md).

### Frontend (`frontend/`)

```bash
cd frontend
npm install
cp .env.example .env         # en PowerShell: Copy-Item .env.example .env
npm run dev
```

Con el backend encendido, `VITE_API_BASE_URL` debe apuntar a `http://127.0.0.1:8000/api`. Para probar solo la interfaz, sin backend, se puede poner `VITE_USE_MOCK_API=true`. Más detalles, comandos de pruebas y compilación en [`frontend/README.md`](frontend/README.md).

## Estado de la verificación

- **Pruebas automatizadas:** el frontend tiene 8 pruebas (`npm test`) que comprueban el contrato de la respuesta y el modo demo; **no llaman al backend real**. El backend tiene 13 pruebas (`php artisan test`) sobre rutas, validación y CORS; usan SQLite en memoria.
- **Integración real:** el recorrido (listar, filtrar, enviar una solicitud y guardarla en MySQL, a través de Vercel y ngrok) fue **probado de forma manual por el equipo** y está registrado, junto con su tipo de evidencia, en [`docs/ESTADO_BACKEND_MVP.md`](docs/ESTADO_BACKEND_MVP.md). No es una prueba automatizada.
- **Lo operativo puede cambiar:** la URL de ngrok cambia al reiniciar el túnel y el dominio de Vercel debe estar permitido en el CORS del backend. Conviene repetir una prueba completa justo antes de cada demostración.

## Reglas básicas

- No subir `.env`, contraseñas, claves ni datos personales reales. Las variables `VITE_*` del frontend son visibles en el navegador.
- No cambiar rutas ni campos de la API sin acordarlo entre Nicolás y Daniel y actualizar [`docs/API_CONTRACT.md`](docs/API_CONTRACT.md).
- `.claude/` y `skills-lock.json` son archivos locales de herramientas de IA y no forman parte del producto: no deben incluirse en los commits.
- No se debe presentar como terminado nada que solo esté diseñado o simulado.
