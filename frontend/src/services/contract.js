// Comprobaciones del contrato (docs/API_CONTRACT.md) para POST /api/service-requests.
// Es un módulo puro (sin fetch ni variables de entorno) para poder probarlo con `npm test`.
import { ApiError } from './apiError.js'

export const UNEXPECTED = 'El servidor respondió algo inesperado. Avisale al equipo y probá de nuevo.'

// Mensaje para cuando NO podemos asegurar que la solicitud quedó registrada.
// No decimos que falló: el servidor pudo haberla guardado aunque respondió mal.
export const UNCONFIRMED =
  'No pudimos confirmar que tu solicitud se haya registrado, porque el servidor respondió algo distinto a lo esperado. Avisale al equipo antes de volver a enviarla.'

const isId = (value) => Number.isInteger(value) && value > 0

// Éxito según el contrato: HTTP 201 y { data: { id, professional_id, status } }.
// Devuelve el cuerpo si todo coincide; si no, lanza ApiError y NO hay confirmación.
export function confirmCreatedRequest(status, body, professionalId) {
  const data = body?.data
  const valid =
    status === 201 &&
    data !== null &&
    typeof data === 'object' &&
    isId(data.id) &&
    isId(data.professional_id) &&
    data.professional_id === professionalId &&
    typeof data.status === 'string' &&
    data.status.trim() !== ''

  if (!valid) throw new ApiError(UNCONFIRMED, { status })
  return body
}
