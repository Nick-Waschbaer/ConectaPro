# Contrato inicial de API — ConectaPro

**Estado:** propuesta de MVP para que Nicolás y Daniel la revisen y acuerden. Si hacen cambios, actualicen este documento antes de modificar ambos lados.

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
- `neighborhood`: filtra por barrio, si se implementa dentro del MVP.

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

El equipo debe decidir si `rating` será un dato ficticio de demo o si se omite hasta tener reseñas reales. No representar a un profesional ficticio como verificado.

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

## Errores comunes

- `400`: petición mal formada, cuando corresponda.
- `404`: profesional inexistente o ruta inexistente, según el caso.
- `422`: datos no válidos.
- `500`: error inesperado del servidor; no mostrar detalles internos al usuario final.

## Acuerdo entre frontend y backend

Antes de implementar, ambos deben confirmar:

1. Que los nombres de endpoints y campos coincidan exactamente.
2. Que la lista de profesionales use el mismo formato.
3. Que el frontend maneje carga, lista vacía, éxito y error.
4. Que el backend valide aunque React también valide.
5. Que se pruebe el contrato con datos ficticios.

Este MVP no usa autenticación. No exponer endpoints de administración o listados de solicitudes de clientes sin protección. Para una aplicación real, el acceso, la privacidad y la autenticación requieren una fase adicional.
