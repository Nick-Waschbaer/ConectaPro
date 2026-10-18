import { API_BASE_URL, USE_MOCK_API } from '../config'
import * as mockApi from './mockApi'
import { ApiError } from './apiError'
import { UNEXPECTED, confirmCreatedRequest } from './contract'

export { ApiError }

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

  // Se devuelve también el código HTTP: cada función decide si el cuerpo (que puede ser null
  // si no era JSON) y el código cumplen el contrato.
  return { status: response.status, body }
}

// GET /api/professionals?service=...  ->  [ { id, name, service, ... } ]
export async function getProfessionals(service, signal) {
  // Solo con VITE_USE_MOCK_API=true. Si no, siempre se llama a la API real.
  if (USE_MOCK_API) return mockApi.getProfessionals(service)

  const query = service ? `?service=${encodeURIComponent(service)}` : ''
  const { body } = await request(`/professionals${query}`, { signal })
  // El contrato dice que siempre es un arreglo (vacío si no hay coincidencias).
  if (!Array.isArray(body)) throw new ApiError(UNEXPECTED)
  return body
}

// POST /api/service-requests  ->  201 { message, data: { id, professional_id, status } }
export async function createServiceRequest(data) {
  // El modo demostración simula un 201 y pasa por la misma comprobación que la API real.
  if (USE_MOCK_API) {
    const simulated = await mockApi.createServiceRequest(data)
    return confirmCreatedRequest(201, simulated, data.professional_id)
  }

  const { status, body } = await request('/service-requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  // Solo es éxito con 201 y { data: { id, professional_id, status } } (ver contract.js).
  return confirmCreatedRequest(status, body, data.professional_id)
}
