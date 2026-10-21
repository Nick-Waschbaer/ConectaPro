# Contrato de API — ConectaPro

**Estado:** contrato del MVP, **implementado** en el backend (`backend/`) y consumido por el frontend (`frontend/`). Si hacen cambios, actualicen este documento antes de modificar ambos lados.

> **Revisión documental del 2026-10-20:** se añadieron las notas «Implementación actual» y la sección de CORS para reflejar lo que hace el código. **No se cambió ninguna ruta, ningún campo ni ninguna respuesta** respecto al contrato acordado. Evidencia de las pruebas: [`ESTADO_BACKEND_MVP.md`](ESTADO_BACKEND_MVP.md).

## Convenciones

- Prefijo de rutas: `/api`.
- Los cuerpos de petición y respuesta usan JSON.
- Los nombres de campos se escriben en `snake_case` en la API.
- `GET` consulta; `POST` envía/crea.
- Los datos de demostración son ficticios.

## 1. Salud del API

### `GET /api/health`

Respuesta `200 OK`:

```json
{
  "status": "ok",
  "application": "ConectaPro API"
}
```

## 2. Listar profesionales

### `GET /api/professionals`

Parámetros opcionales:

- `service`: filtra por oficio, por ejemplo `Electricidad`.
- `neighborhood`: filtra por barrio.

**Implementación actual:**

- Ambos filtros comparan por **igualdad exacta** del texto (por ejemplo `?service=Plomería`) y se pueden combinar. El frontend usa `service` (codificado en la URL); **no usa `neighborhood`**: el barrio lo filtra en el navegador sobre la lista recibida.
- `service` está comprobado por pruebas del backend y por el equipo contra MySQL. `neighborhood` está implementado pero **no tiene prueba propia** (ver [`ESTADO_BACKEND_MVP.md`](ESTADO_BACKEND_MVP.md)).
- La lista no está paginada y se devuelve ordenada por `id` ascendente.
- Cada elemento trae exactamente las claves `id`, `name`, `service`, `description`, `neighborhood` y `rating`.

Respuesta `200 OK` (ejemplo; los datos definitivos pueden variar):

```json
[
  {
    "id": 1,
    "name": "Juan Pérez",
    "service": "Electricidad",
    "description": "Instalaciones y reparaciones del hogar",
    "neighborhood": "Villa Morra",
    "rating": 4.8
  }
]
```

Si no hay coincidencias, devolver `200 OK` con una lista vacía `[]`, no un error.

`rating` es un **dato ficticio de demostración** (decimal con un decimal, puede ser `null`); no proviene de reseñas reales. Ningún profesional ficticio se representa como verificado.

## 3. Crear solicitud de servicio

### `POST /api/service-requests`

Petición JSON:

```json
{
  "professional_id": 1,
  "customer_name": "Cliente de prueba",
  "contact_phone": "0981000000",
  "description": "Revisar un enchufe que no funciona",
  "neighborhood": "Villa Morra"
}
```

Campos requeridos:

- `professional_id`: identificador de un profesional existente.
- `customer_name`: nombre del cliente de prueba.
- `contact_phone`: teléfono ficticio válido para pruebas; no publicar teléfonos reales.
- `description`: descripción del problema.
- `neighborhood`: barrio o zona general, no dirección precisa.

**Implementación actual — reglas de validación (Laravel):**

| Campo | Regla |
| --- | --- |
| `professional_id` | obligatorio, entero y debe existir en la tabla de profesionales |
| `customer_name` | obligatorio, texto, máximo 100 caracteres |
| `contact_phone` | obligatorio, texto, máximo 30 caracteres, formato `^[0-9+\s()-]{6,30}$` (solo dígitos, espacios, `+`, `(`, `)` y `-`; entre 6 y 30 caracteres) |
| `description` | obligatorio, texto, máximo 1000 caracteres |
| `neighborhood` | obligatorio, texto, máximo 100 caracteres |

El cliente **no puede fijar `status`**: aunque lo envíe, el backend guarda siempre `pending`. El frontend aplica las mismas reglas en el navegador para dar respuesta inmediata, pero la validación que cuenta es la del servidor.

Éxito: `201 Created`, con una respuesta similar a:

```json
{
  "message": "Solicitud creada correctamente",
  "data": {
    "id": 12,
    "professional_id": 1,
    "status": "pending"
  }
}
```

La respuesta real debe reflejar el ID creado y el estado guardado. El registro debe persistir en MySQL.

**Qué consume el frontend:** solo muestra la confirmación si recibe **exactamente `201`** y un `data` con `id` y `professional_id` enteros positivos, `professional_id` igual al profesional elegido y `status` como texto no vacío. Con cualquier otro código (por ejemplo `200`) o con una respuesta incompleta, no confirma y avisa de que no pudo verificar el registro. El campo `message` no es obligatorio para el frontend. Hoy `status` siempre vale `pending`.

Error de validación: `422 Unprocessable Entity`, con forma compatible con Laravel:

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "description": ["La descripción es obligatoria."]
  }
}
```

El texto exacto puede variar, pero el frontend debe poder leer `message` y los errores por campo. No devolver contraseñas, credenciales ni datos innecesarios.

**Implementación actual y uso en el frontend:**

- Las claves de `errors` coinciden con los nombres de los campos de la petición. Cada una trae una lista de mensajes.
- Laravel redacta en español los mensajes de campo obligatorio, de profesional inexistente y de teléfono con formato inválido. Otros mensajes (por ejemplo un texto demasiado largo) pueden venir en inglés: el frontend ya valida esos límites en el navegador antes de enviar.
- El frontend lee el **primer mensaje** de cada uno de los cuatro campos visibles del formulario (`customer_name`, `contact_phone`, `neighborhood`, `description`) y los muestra junto al campo. Si el error es de un campo que el usuario no ve (por ejemplo `professional_id`), muestra el `message` general.
- Un `422` no guarda nada: así lo comprobó el equipo contra MySQL (conteo de filas sin cambios).

## Errores comunes

Comportamiento real del backend (la respuesta es JSON en todas las rutas `/api/*`):

- `422`: datos no válidos. **Incluye también** el caso de un `professional_id` inexistente y el de un cuerpo JSON mal formado; el contrato original admitía `404` o `400` para esos casos y se aceptó esta desviación.
- `404`: ruta inexistente. Responde JSON con un `message` genérico en inglés, sin trazas ni rutas internas (con `APP_DEBUG=false`).
- `400`: **no se usa**.
- `500`: error inesperado del servidor; no se muestran detalles internos al usuario final.

El frontend distingue tres situaciones: error de **conexión** (la petición no obtiene respuesta: servidor apagado, URL incorrecta o CORS bloqueado), error de **validación** (`422`) y otros errores del servidor (`5xx` u otros `4xx`).

## CORS y cabeceras

El navegador hace una petición previa (`OPTIONS`) porque el frontend envía JSON. El backend lo atiende para `/api/*` con esta configuración:

- Métodos permitidos: `GET`, `POST` y `OPTIONS`.
- Cabeceras permitidas: `Content-Type`, `Accept`, `X-Requested-With` y `ngrok-skip-browser-warning` (el frontend envía esta última solo cuando la URL de la API contiene `ngrok`).
- Orígenes permitidos: los de la variable `CORS_ALLOWED_ORIGINS` del `.env` del backend (por defecto, `http://localhost:5173` y `http://127.0.0.1:5173`). Un origen no listado no recibe `Access-Control-Allow-Origin` y el navegador bloquea la respuesta.
- Sin cookies ni credenciales: la API no usa sesiones.
- El frontend envía `Accept: application/json` en todas las peticiones.

## Acuerdo entre frontend y backend

Antes de implementar, ambos debían confirmar lo siguiente (el contrato se implementó en ambos lados y se probó con datos ficticios):

1. Que los nombres de endpoints y campos coincidan exactamente.
2. Que la lista de profesionales use el mismo formato.
3. Que el frontend maneje carga, lista vacía, éxito y error.
4. Que el backend valide aunque React también valide.
5. Que se pruebe el contrato con datos ficticios.

Este MVP no usa autenticación. No exponer endpoints de administración o listados de solicitudes de clientes sin protección. Para una aplicación real, el acceso, la privacidad y la autenticación requieren una fase adicional.
