// Único lugar donde se leen las variables de entorno de la API.
// Se quita la "/" final para evitar URLs con "//".
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')

// Modo de demostración: solo se activa si la variable vale exactamente "true".
// Cualquier otro valor (o si falta) usa la API real, sin datos ficticios de reserva.
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true'
