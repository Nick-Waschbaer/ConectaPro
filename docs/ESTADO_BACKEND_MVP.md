# Estado del backend MVP

Diagnóstico basado en el repositorio y en comprobaciones ejecutadas el 2026-10-18 en la laptop de Daniel. Entorno: PHP 8.5.0, Laravel 13.37.0, MariaDB 10.4.32 (XAMPP), ngrok 3.39.9.

## Cómo leer este documento

Cada requisito se clasifica según el **tipo de evidencia**. No son equivalentes:

| Tipo de evidencia | Qué demuestra | Qué NO demuestra |
| --- | --- | --- |
| **Prueba automatizada** (`php artisan test`) | La lógica de rutas, validación y CORS funciona | MySQL: estas pruebas usan SQLite en memoria (ver `phpunit.xml`) |
| **Prueba HTTP contra MySQL local** (`curl` con el servidor de Laravel y la base `conectapro`) | La API guarda y lee datos reales en MySQL de esa laptop | Que funcione desde internet, ngrok o Vercel |
| **Configuración instalada, sin probar** | La herramienta existe y su configuración es válida | Que haya funcionado en un uso real |
| **Integración pública pendiente** | Nada todavía | — |

Los números concretos (IDs de solicitudes, cantidad de filas) son **resultados de una ejecución determinada** en la base local de Daniel. No son valores fijos: en otra computadora o tras otra ejecución serán distintos.

## 1. Pruebas automatizadas

`php artisan test --do-not-cache-result` → 13 pasaron, 0 fallaron, 50 aserciones (ejecución del 2026-10-18).

Cubren: salud, listado y filtro por oficio, lista vacía, creación válida, validación 422 (campos faltantes, profesional inexistente, teléfono inválido), que el cliente no pueda forzar `status`, y CORS (origen local permitido, dominio de Vercel permitido cuando se configura, origen desconocido rechazado). Usan SQLite en memoria y no tocan la base MySQL.

## 2. Pruebas HTTP contra MySQL local

Ejecutadas con `php artisan serve` leyendo el `.env` local (`DB_CONNECTION=mysql`, base `conectapro`, `127.0.0.1:3306`).

| Requisito | Estado | Resultado de la ejecución del 2026-10-18 | Siguiente acción |
| --- | --- | --- | --- |
| Laravel conecta a MySQL | verificado | `config('database.default')` → `mysql`; `migrate:status` lee la base | Repetir en la laptop de la demo |
| Migraciones aplicadas | verificado | 5 migraciones `Ran`; repetir `migrate --seed` no cambió los conteos | Ninguna |
| Profesionales ficticios | verificado | 6 profesionales "(demo)" en esa base; repetir el seeder no duplicó | Ninguna |
| `GET /api/health` | verificado | 200 `{"status":"ok","application":"ConectaPro API"}` | Ninguna |
| `GET /api/professionals` | verificado | 200 con las claves `id,name,service,description,neighborhood,rating` | Ninguna |
| Filtro `?service=` | verificado | `?service=Plomería` devolvió solo profesionales de Plomería; `?service=Zzz` devolvió `[]` con 200 | Confirmar con Nicolás los nombres exactos de oficio |
| `POST /api/service-requests` válido | verificado | 201 con `data.id`, `data.professional_id` y `data.status: "pending"`; el conteo de filas en `service_requests` subió en 1 y la fila existía en la tabla (en esa ejecución, `id=3`) | Ninguna |
| `POST` inválido no guarda | verificado | 422 con `message` y `errors` por campo; el conteo de filas **no cambió** | Ninguna |
| Profesional inexistente / JSON mal formado | verificado (desviación admitida) | Responden 422. El contrato admite "404 o 422, según el caso" y el 400 "cuando corresponda" | Ninguna; el contrato no se cambió |
| CORS desde Vite local | verificado | Preflight `OPTIONS` desde `http://localhost:5173` → 204 con `Access-Control-Allow-Origin` | Ninguna |
| CORS rechaza orígenes no listados | verificado | Preflight desde un `*.vercel.app` no configurado → 204 **sin** `Access-Control-Allow-Origin` | Ninguna |
| Filtro `?neighborhood=` (opcional en el contrato) | pendiente | Implementado y sin prueba propia | Añadir prueba solo si el frontend lo usa |

## 3. Configuración instalada, sin probar en uso real

| Elemento | Estado | Evidencia | Siguiente acción |
| --- | --- | --- | --- |
| ngrok | instalado y configurado; **no se ha abierto ningún túnel** | `ngrok version` → 3.39.9; `ngrok config check` → configuración válida | Abrir el túnel (ver "Pasos pendientes para ngrok") |
| Mecanismo de CORS para Vercel | listo | `config/cors.php` lee `CORS_ALLOWED_ORIGINS` del `.env`; probado con un dominio de ejemplo en pruebas automatizadas | Agregar el dominio real cuando se conozca |

## 4. Integración pública pendiente

| Requisito | Estado | Motivo | Quién lo desbloquea |
| --- | --- | --- | --- |
| CORS con el dominio público de Vercel | **bloqueado** | El dominio no figura en el repositorio ni en la documentación; no se inventó | **Nicolás** debe pasar la URL exacta (`https://…vercel.app`, sin `/` final) |
| Túnel ngrok → Laravel | pendiente | No se probó | Daniel, con `ngrok http 8000` |
| Frontend en Vercel ↔ backend vía ngrok | pendiente | No se probó en un navegador real; solo se comparó por lectura el código del frontend con el contrato | Prueba conjunta de Daniel y Nicolás |

## Contradicciones y notas

- Contrato vs. código: sin contradicciones graves; solo las dos desviaciones permitidas de la sección 2.
- Autenticación: fuera de alcance del MVP según `docs/MVP.md`; no se implementó.
- `rating` es un dato ficticio de demo; ningún profesional se presenta como verificado.
- `.env.example` trae `APP_DEBUG=false`. Con `true`, un error o un 404 puede mostrar rutas internas del servidor en el JSON. En el `.env` local puede ser `true` mientras se desarrolla, pero **debe ser `false` antes de exponer la API con ngrok**.
- `php artisan db:show` falla en XAMPP porque su `performance_schema` está incompleto. No es un problema de conexión; usar `php artisan migrate:status` para comprobarla.
- La base `conectapro` de la laptop de Daniel acumula solicitudes de prueba creadas durante las verificaciones. Conviene limpiarlas antes de la demo, con permiso explícito de Daniel (solo un `DELETE` dirigido; nunca `migrate:fresh`).
- El PHP de XAMPP (8.2) **no sirve**: las dependencias exigen PHP ≥ 8.4.1 y fallan en `vendor/autoload.php`. Usar el PHP de Herd; comprobar con `php -v`.
- Codex reportó un fallo de `is_readable('vendor/autoload.php')`. No se pudo reproducir localmente (las pruebas pasan); probablemente es del entorno restringido de Codex.

## Bloqueos actuales

1. **Dominio público de Vercel:** lo debe proporcionar Nicolás (único dato que falta para configurar CORS).
2. **URL de ngrok:** solo existe cuando se abre el túnel; la gratuita cambia cada vez que se reinicia.

## Cómo arrancar el backend

Desde `backend/`, con MySQL encendido en XAMPP y la base `conectapro` creada:

```bash
composer install
cp .env.example .env          # solo la primera vez; luego revisar DB_* en .env
php artisan key:generate      # solo la primera vez
php artisan migrate --seed    # seguro de repetir; no usar migrate:fresh
php artisan serve             # API en http://127.0.0.1:8000/api
php artisan test              # pruebas (SQLite en memoria, no tocan MySQL)
```

Antes, abrir el panel de XAMPP y pulsar **Start** en MySQL, y comprobar con `php -v` que el PHP sea 8.4 o superior.

### Probar la API a mano (para principiantes)

En otra terminal, con `php artisan serve` corriendo:

```bash
curl http://127.0.0.1:8000/api/health
curl "http://127.0.0.1:8000/api/professionals?service=Electricidad"
curl -X POST http://127.0.0.1:8000/api/service-requests -H "Content-Type: application/json" -H "Accept: application/json" -d '{"professional_id":1,"customer_name":"Cliente de prueba","contact_phone":"0981000000","description":"Prueba","neighborhood":"Villa Morra"}'
```

El último debe responder `201`. Para ver la fila guardada, abrir phpMyAdmin → base `conectapro` → tabla `service_requests`.

## Pasos pendientes para ngrok

1. Dejar encendidos MySQL, `php artisan serve` y ngrok durante toda la demo.
2. En otra terminal: `ngrok http 8000` y copiar la URL `https://….ngrok-free.app`.
3. Probar desde otro dispositivo (por ejemplo, un celular con datos móviles): `https://….ngrok-free.app/api/health` debe devolver el JSON de salud.
4. **Daniel → Nicolás:** pasar esa URL **terminada en `/api`** para `VITE_API_BASE_URL` en Vercel; Nicolás debe volver a desplegar.
5. **Nicolás → Daniel:** pasar la URL pública exacta de Vercel. Daniel la agrega en `backend/.env` y reinicia `php artisan serve`:

```env
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,https://LA-URL-DE-VERCEL
```

6. Poner `APP_DEBUG=false` en `backend/.env`.
7. Con `APP_DEBUG=false`, hacer una prueba completa desde la página de Vercel: listar, filtrar, enviar una solicitud y comprobar la fila en MySQL.
8. Si se reinicia ngrok, la URL cambia: avisar a Nicolás para redesplegar.
