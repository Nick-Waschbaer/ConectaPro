import { API_BASE_URL } from '../config'

// Error propio para poder leer el estado HTTP y los errores por campo (422).
export class ApiError extends Error {
  constructor(message, { status = 0, fieldErrors = {} } = {}) {
    super(message)
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

const UNEXPECTED = 'El servidor respondió algo inesperado. Avisale al equipo y probá de nuevo.'

async function request(path, options = {}) {
  if (!API_BASE_URL) {
    throw new ApiError('Falta configurar VITE_API_BASE_URL (revisá frontend/.env.example).')
  }

  // ngrok (plan gratis) muestra una página de aviso en HTML; este encabezado la evita.
  // El backend ya lo permite en su configuración de CORS.
  const extraHeaders = API_BASE_URL.includes('ngrok') ? { 'ngrok-skip-browser-warning': '1' } : {}

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: { Accept: 'application/json', ...extraHeaders, ...options.headers },
    })
  } catch {
    // fetch falla sin respuesta: servidor apagado, URL incorrecta, sin internet o CORS.
    throw new ApiError('No pudimos conectarnos con el servidor. Revisá tu conexión o que la API esté encendida.')
  }

  let body = null
  try {
    body = await response.json()
  } catch {
    // La respuesta puede no ser JSON (por ejemplo una página de error).
  }

  if (!response.ok) {
    if (response.status >= 500) {
      throw new ApiError('El servidor tuvo un problema. Probá de nuevo en unos minutos.', {
        status: response.status,
      })
    }
    throw new ApiError(body?.message || `No se pudo completar la operación (error ${response.status}).`, {
      status: response.status,
      fieldErrors: body?.errors || {},
    })
  }

  if (body === null) throw new ApiError(UNEXPECTED, { status: response.status })
  return body
}

// GET /api/professionals?service=...  ->  [ { id, name, service, ... } ]
export async function getProfessionals(service, signal) {
  const query = service ? `?service=${encodeURIComponent(service)}` : ''
  const body = await request(`/professionals${query}`, { signal })
  // El contrato dice que siempre es un arreglo (vacío si no hay coincidencias).
  if (!Array.isArray(body)) throw new ApiError(UNEXPECTED)
  return body
}

// POST /api/service-requests  ->  201 { message, data: { id, professional_id, status } }
export async function createServiceRequest(data) {
  const body = await request('/service-requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  // Solo es éxito si el servidor devolvió el id de la solicitud guardada.
  if (body?.data?.id == null) throw new ApiError(UNEXPECTED)
  return body
}
