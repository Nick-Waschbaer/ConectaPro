# Estado del backend MVP

Diagnóstico basado en el repositorio real y en comprobaciones ejecutadas el 2026-10-18 (rama `feat/backend-mvp`, igual a `main` en `d819123`). Entorno: PHP 8.5.0, Laravel 13.37.0, MariaDB 10.4.32 (XAMPP).

**Criterio:** "verificado" significa que se ejecutó y se vio el resultado. Lo que solo se leyó en el código figura como "no verificado".

## Tabla de requisitos

| Requisito | Estado (verificado/no verificado/pendiente) | Evidencia o prueba | Siguiente acción |
| --- | --- | --- | --- |
| `GET /api/health` → 200 JSON | verificado | `curl` real: `{"status":"ok","application":"ConectaPro API"}` [200]; prueba `ApiTest::test_health_responde_ok` | Ninguna |
| `GET /api/professionals` desde BD, campos `id,name,service,description,neighborhood,rating` | verificado | `curl` contra MySQL: 6 profesionales con esos campos; `assertJsonStructure` en `ApiTest` | Ninguna |
| Filtro `?service=` por oficio | verificado | `curl ?service=Electricidad` → 2 resultados, ambos Electricidad; prueba `test_lista_profesionales_y_filtra_por_oficio` | Confirmar con Nicolás los textos exactos de oficio (hoy: Electricidad, Plomería, Pintura, Aire acondicionado) |
| Sin coincidencias → `200 []` | verificado | `curl ?service=Zzz` → `[]` [200]; prueba dedicada | Ninguna |
| Filtro `?neighborhood=` (opcional en el contrato) | no verificado | Implementado; solo cubierto por lectura de código, sin prueba propia | Añadir prueba si el frontend lo va a usar |
| `POST /api/service-requests` válido → 201 y guarda | verificado | `curl` contra MySQL: 201 `{"message":"Solicitud creada correctamente","data":{"id":2,"professional_id":1,"status":"pending"}}`; filas en `service_requests` 1 → 2 | Ninguna |
| POST inválido → 422 con `message` y `errors` por campo | verificado | `curl`: faltan campos → 422 con errores por campo; profesional inexistente → 422 | Ninguna |
| Profesional inexistente | verificado (con desviación) | Devuelve 422, no 404. El contrato admite "404 o 422, según el caso" | Aceptado: el frontend lee `errors.professional_id` |
| JSON mal formado | verificado (con desviación) | Devuelve 422 (campos faltantes), no 400. El contrato dice 400 "cuando corresponda" | Aceptable para el MVP; no se cambió el contrato |
| `status` no manipulable por el cliente | verificado | Prueba `test_el_cliente_no_puede_forzar_el_estado` | Ninguna |
| Migraciones y datos ficticios | verificado | `migrate:status`: 5 migraciones ejecutadas en MySQL; 6 profesionales "(demo)" en BD | Ninguna |
| Persistencia en MySQL | verificado | Conteo de filas antes/después en MariaDB 10.4.32 (`conectapro`) | Repetir en la laptop que haga la demo |
| Pruebas automáticas | verificado | `php artisan test --do-not-cache-result`: 13 pasaron, 50 aserciones (usan SQLite en memoria, no MySQL) | Ejecutar antes de cada commit |
| CORS para Vite local | verificado | Preflight `OPTIONS` real desde `http://localhost:5173` → 204 con `Access-Control-Allow-Origin`; pruebas en `CorsTest` | Ninguna |
| CORS rechaza orígenes desconocidos | verificado | Preflight desde `https://otro.vercel.app` → 204 sin cabecera `Allow-Origin`; prueba en `CorsTest` | Ninguna |
| CORS para el dominio real de Vercel | pendiente | Mecanismo listo (`CORS_ALLOWED_ORIGINS` en `.env`); dominio aún no conocido | Agregar el dominio y reiniciar `php artisan serve` |
| ngrok exponiendo la API | pendiente | No se probó | Ver "Pasos pendientes para ngrok" |
| Frontend real (navegador) ↔ backend | no verificado | Se comparó por lectura el código de `frontend/src/services` con el contrato; no se probó en un navegador | Prueba conjunta con Nicolás |
| Autenticación | fuera de alcance | `docs/MVP.md` la excluye | No hacer |

## Contradicciones y notas

- Contrato vs. código: sin contradicciones graves. Solo las dos desviaciones permitidas arriba (422 en vez de 404 y en vez de 400).
- `rating` es un dato ficticio de demo; ningún profesional se presenta como verificado.
- `APP_DEBUG` quedó en `false` en `.env.example`. Con `true`, un error o un 404 puede mostrar rutas internas del servidor en el JSON. En tu `.env` local puedes ponerlo en `true` solo mientras desarrollas.
- La base MySQL de demo ya contiene solicitudes de prueba (ids 1 y 2) creadas durante la verificación.

## Bloqueos actuales

- Ninguno que impida el recorrido local. Para la demo pública faltan: el dominio de Vercel y el túnel ngrok.
- Riesgo de entorno: el PHP de XAMPP es 8.2 y **no sirve** (las dependencias exigen ≥ 8.4.1). Usar el PHP de Herd; comprobar con `php -v`.
- Codex reportó un fallo de `is_readable('vendor/autoload.php')`. No se pudo reproducir localmente (las pruebas pasan); probablemente es del entorno restringido de Codex.

## Cómo arrancar el backend

Desde `backend/`, con MySQL encendido en XAMPP y la base `conectapro` creada:

```bash
composer install
cp .env.example .env          # solo la primera vez; luego revisar DB_* en .env
php artisan key:generate      # solo la primera vez
php artisan migrate --seed    # seguro de repetir; no usar migrate:fresh
php artisan serve             # http://127.0.0.1:8000/api
php artisan test              # pruebas (SQLite en memoria)
```

## Pasos pendientes para ngrok

1. Dejar encendidos MySQL, `php artisan serve` y ngrok durante toda la demo.
2. En otra terminal: `ngrok http 8000` y copiar la URL `https://....ngrok-free.app`.
3. Probar desde otro dispositivo: `https://....ngrok-free.app/api/health` debe devolver el JSON de salud.
4. Pasar a Nicolás la URL terminada en `/api` para su `VITE_API_BASE_URL` (en Vercel, y volver a desplegar).
5. Agregar el dominio de Vercel a `CORS_ALLOWED_ORIGINS` en el `.env` y reiniciar `php artisan serve`.
6. Con `APP_DEBUG=false` en el `.env`, hacer una prueba completa desde la URL pública de Vercel: listar, filtrar, enviar una solicitud y comprobar la fila en MySQL.
7. La URL de ngrok gratis cambia al reiniciar el túnel: avisar a Nicolás si cambia.
