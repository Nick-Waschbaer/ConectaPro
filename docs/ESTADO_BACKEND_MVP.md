# Estado del backend MVP

Diagnóstico basado en el repositorio y en comprobaciones ejecutadas los días 2026-10-18 y 2026-10-19 en la laptop de Daniel. Entorno: PHP 8.5.0, Laravel 13.37.0, MariaDB 10.4.32 (XAMPP), ngrok 3.39.9.

## Cómo leer este documento

Cada requisito se clasifica según el **tipo de evidencia**. No son equivalentes:

| Tipo de evidencia | Qué demuestra | Qué NO demuestra |
| --- | --- | --- |
| **Prueba automatizada** (`php artisan test`) | La lógica de rutas, validación y CORS funciona | MySQL: estas pruebas usan SQLite en memoria (ver `phpunit.xml`) |
| **Prueba HTTP contra MySQL local** (`curl` con el servidor de Laravel y la base `conectapro`) | La API guarda y lee datos reales en MySQL de esa laptop | Que funcione desde internet, ngrok o Vercel |
| **Prueba a través del túnel público** (`curl` a la URL de ngrok y envíos desde la web de Vercel) | La API responde desde internet y acepta el origen de Vercel configurado | Que la URL del túnel sea estable: cambia al reiniciar ngrok |
| **Dato reportado por el equipo** | Lo que Daniel o Nicolás vieron | No fue observado de forma independiente en esta verificación |

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
| Profesionales ficticios | verificado | Ejecución del 2026-10-20: 100 profesionales ficticios sin sufijo "(demo)", con 100 nombres únicos, 7 oficios, 10 barrios y las 70 combinaciones de oficio y barrio cubiertas; repetir el seeder no duplicó (siguen 100); las solicitudes ya guardadas siguen vinculadas a su profesional | Ninguna |
| `GET /api/health` | verificado | 200 `{"status":"ok","application":"ConectaPro API"}` | Ninguna |
| `GET /api/professionals` | verificado | 200 con las claves `id,name,service,description,neighborhood,rating` | Ninguna |
| Filtro `?service=` | verificado | `?service=Plomería` devolvió solo profesionales de Plomería; `?service=Zzz` devolvió `[]` con 200 | Confirmar con Nicolás los nombres exactos de oficio |
| `POST /api/service-requests` válido | verificado | 201 con `data.id`, `data.professional_id` y `data.status: "pending"`; el conteo de filas en `service_requests` subió en 1 y la fila existía en la tabla (en esa ejecución, `id=3`) | Ninguna |
| `POST` inválido no guarda | verificado | 422 con `message` y `errors` por campo; el conteo de filas **no cambió** | Ninguna |
| Profesional inexistente / JSON mal formado | verificado (desviación admitida) | Responden 422. El contrato admite "404 o 422, según el caso" y el 400 "cuando corresponda" | Ninguna; el contrato no se cambió |
| CORS desde Vite local | verificado | Preflight `OPTIONS` desde `http://localhost:5173` → 204 con `Access-Control-Allow-Origin` | Ninguna |
| CORS rechaza orígenes no listados | verificado | Preflight desde un `*.vercel.app` no configurado → 204 **sin** `Access-Control-Allow-Origin` | Ninguna |
| Filtro `?neighborhood=` (opcional en el contrato) | pendiente | Implementado y sin prueba propia | Añadir prueba solo si el frontend lo usa |

## 3. Túnel ngrok y Vercel (verificado el 2026-10-19)

Con Laravel, MySQL y ngrok encendidos en la laptop de Daniel. La URL del túnel no se escribe aquí porque cambia cada vez que se reinicia ngrok.

| Requisito | Estado | Evidencia | Siguiente acción |
| --- | --- | --- | --- |
| Túnel abierto solo al puerto de Laravel | verificado | La consulta local de ngrok mostró un único túnel hacia `localhost:8000` (no se expone todo XAMPP) | Mantener así |
| `GET /api/health` a través del túnel | verificado | `curl` a la URL pública → 200 `{"status":"ok","application":"ConectaPro API"}` | Ninguna |
| Los errores no filtran detalles internos | verificado | `APP_DEBUG` efectivo = `false` (consultado a Laravel); un 404 por el túnel devolvió solo `{"message":"The route api/nada could not be found."}`, sin rutas ni trazas | Ver nota sobre `APP_DEBUG` en "Contradicciones y notas" |
| CORS acepta el dominio de Vercel configurado | verificado | Preflight `OPTIONS` por el túnel desde el dominio de Vercel que figura en `CORS_ALLOWED_ORIGINS` → 204 con `Access-Control-Allow-Origin` igual a ese dominio | Si el dominio cambia, agregarlo (ver "Pendiente y riesgos") |
| Solicitudes enviadas desde la web llegan a MySQL | verificado (filas) / reportado (origen) | Consulta `SELECT` en MySQL: existen filas con estado `pending` creadas por el formulario (ver los IDs 4 a 6 de esa ejecución), sin duplicados ni saltos de ID. Que se enviaron desde la web de Vercel y desde otros dispositivos lo reportaron Daniel y Nicolás | Repetir una prueba completa justo antes de la demo |
| Listado de profesionales visible en la web de Vercel | reportado | Lo reportó Nicolás; no se observó en un navegador en esta verificación | Repetir antes de la demo |

## 4. Pendiente y riesgos para la demo

| Tema | Estado | Detalle | Siguiente acción |
| --- | --- | --- | --- |
| Dominio de Vercel en CORS | funciona hoy, con un riesgo | El dominio configurado puede ser una dirección de **rama** (preview), distinta del dominio de producción. Si se usa otra dirección en la presentación, no estará permitida y el navegador bloqueará las peticiones (error de CORS) | Nicolás confirma la dirección final; Daniel la **agrega** (sin quitar la actual) en `CORS_ALLOWED_ORIGINS` y reinicia `php artisan serve` |
| URL de ngrok estable | pendiente de cuidar | La URL gratuita cambia al reiniciar ngrok; Vercel apuntaría a una URL muerta hasta que Nicolás actualice `VITE_API_BASE_URL` y redespliegue | Mantener ngrok abierto durante la demo |
| Laptop como servidor | riesgo | MySQL, `php artisan serve` y ngrok deben seguir encendidos y la laptop no debe suspenderse | Desactivar la suspensión; dejar la laptop enchufada |
| Datos de prueba en la base | pendiente | La tabla `service_requests` contiene solicitudes de prueba | Limpiarla antes de la demo con un `DELETE` dirigido y permiso explícito de Daniel (nunca `migrate:fresh`) |
| Filtro `?neighborhood=` | pendiente | Sin prueba propia | Solo si el frontend lo usa |

Fuera del alcance del MVP (`docs/MVP.md`): autenticación, pagos, reseñas reales, y un panel para ver las solicitudes.

## Contradicciones y notas

- Contrato vs. código: sin contradicciones graves; solo las dos desviaciones permitidas de la sección 2.
- Autenticación: fuera de alcance del MVP según `docs/MVP.md`; no se implementó.
- `rating` es un dato ficticio de demo; ningún profesional se presenta como verificado.
- Datos de ejemplo: los 100 profesionales son inventados (pueden coincidir por casualidad con personas reales), sin teléfonos ni direcciones; los ratings son ficticios. Los oficios actuales son Electricidad, Plomería, Pintura, Aire acondicionado, Carpintería, Cerrajería y Jardinería, y hay 10 barrios de Asunción. El frontend los toma de la API, por lo que no necesita cambios.
- `.env.example` trae `APP_DEBUG=false`. Con `true`, un error o un 404 puede mostrar rutas internas del servidor y datos de conexión en el JSON. Como la API es pública por ngrok, el `.env` debe tener **una sola línea** `APP_DEBUG=false`: si hay dos líneas duplicadas, Laravel usa la última y borrar la equivocada podría reactivar el modo de depuración.
- `php artisan db:show` falla en XAMPP porque su `performance_schema` está incompleto. No es un problema de conexión; usar `php artisan migrate:status` para comprobarla.
- El PHP de XAMPP (8.2) **no sirve**: las dependencias exigen PHP ≥ 8.4.1 y fallan en `vendor/autoload.php`. Usar el PHP de Herd; comprobar con `php -v`.
- Codex reportó un fallo de `is_readable('vendor/autoload.php')`. No se pudo reproducir localmente (las pruebas pasan); probablemente es del entorno restringido de Codex.
- El archivo `.env` es local y nunca se sube a Git: cada computadora necesita el suyo.

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

## Cómo abrir el túnel con ngrok

1. Dejar encendidos MySQL, `php artisan serve` y ngrok durante toda la demo.
2. En otra terminal: `ngrok http 8000` y copiar la URL `https://….ngrok-free.…`. Se expone solo el puerto de Laravel.
3. Probar desde otro dispositivo (por ejemplo, un celular con datos móviles): `https://…/api/health` debe devolver el JSON de salud.
4. **Daniel → Nicolás:** pasar esa URL **terminada en `/api`** para `VITE_API_BASE_URL` en Vercel; Nicolás debe volver a desplegar.
5. **Nicolás → Daniel:** pasar la URL pública exacta de Vercel. Daniel la agrega en `backend/.env` y reinicia `php artisan serve`:

```env
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,https://LA-URL-DE-VERCEL
```

6. Confirmar que `backend/.env` tiene una sola línea `APP_DEBUG=false`.
7. Hacer una prueba completa desde la página de Vercel: listar, filtrar, enviar una solicitud y comprobar la fila en MySQL.
8. Si se reinicia ngrok, la URL cambia: avisar a Nicolás para redesplegar.
