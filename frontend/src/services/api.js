import { API_BASE_URL } from '../config'

// Error propio para poder leer el estado HTTP y los errores por campo (422).
export class ApiError extends Error {
  constructor(message, { status = 0, fieldErrors = {} } = {}) {
    super(message)
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

async function request(path, options = {}) {
  if (!API_BASE_URL) {
    throw new ApiError('Falta configurar VITE_API_BASE_URL (revisa frontend/.env.example).')
  }

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: { Accept: 'application/json', ...options.headers },
    })
  } catch {
    // fetch falla sin respuesta: servidor apagado, URL incorrecta o CORS.
    throw new ApiError('No se pudo conectar con el servidor. Revisa que la API esté encendida.')
  }

  let body = null
  try {
    body = await response.json()
  } catch {
    // La respuesta puede no ser JSON (por ejemplo una página de error).
  }

  if (!response.ok) {
    throw new ApiError(
      response.status >= 500
        ? 'El servidor tuvo un problema. Intenta de nuevo más tarde.'
        : body?.message || `Error ${response.status}`,
      { status: response.status, fieldErrors: body?.errors || {} },
    )
  }
  return body
}

// GET /api/professionals?service=...
export function getProfessionals(service) {
  const query = service ? `?service=${encodeURIComponent(service)}` : ''
  return request(`/professionals${query}`)
}

// POST /api/service-requests
export function createServiceRequest(data) {
  return request('/service-requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}
