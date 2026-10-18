// Único lugar donde se lee la URL de la API.
// Se quita la "/" final para evitar URLs con "//".
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')
