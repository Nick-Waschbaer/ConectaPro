// MODO DE DEMOSTRACIÓN LOCAL (herramienta temporal de desarrollo).
// Solo se usa si VITE_USE_MOCK_API=true. Devuelve el mismo formato que el contrato
// (docs/API_CONTRACT.md), pero NO guarda nada en MySQL ni avisa a ningún profesional.

const DEMO_PROFESSIONALS = [
  { id: 1, name: 'Juan Pérez (demo)', service: 'Electricidad', description: 'Instalaciones y reparaciones eléctricas del hogar', neighborhood: 'Villa Morra', rating: 4.8 },
  { id: 2, name: 'Marta Gómez (demo)', service: 'Electricidad', description: 'Cambio de tomacorrientes, luces y tableros', neighborhood: 'Recoleta', rating: 4.5 },
  { id: 3, name: 'Carlos Benítez (demo)', service: 'Plomería', description: 'Pérdidas, cañerías y destapes', neighborhood: 'Sajonia', rating: 4.6 },
  { id: 4, name: 'Ana Duarte (demo)', service: 'Plomería', description: 'Instalación de grifería y sanitarios', neighborhood: 'Villa Morra', rating: 4.2 },
  { id: 5, name: 'Luis Ortiz (demo)', service: 'Pintura', description: 'Pintura de interiores y exteriores', neighborhood: 'Recoleta', rating: 4.7 },
  { id: 6, name: 'Rosa Acosta (demo)', service: 'Aire acondicionado', description: 'Instalación y mantenimiento de equipos split', neighborhood: 'Sajonia', rating: 4.4 },
]

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

let nextDemoId = 1

// Igual que GET /api/professionals?service=...
export async function getProfessionals(service) {
  await wait(400)
  return service ? DEMO_PROFESSIONALS.filter((p) => p.service === service) : [...DEMO_PROFESSIONALS]
}

// Igual que la respuesta 201 de POST /api/service-requests. No se guarda en ningún lado.
export async function createServiceRequest(data) {
  await wait(600)
  return {
    message: 'Solicitud simulada (modo demostración)',
    data: { id: nextDemoId++, professional_id: data.professional_id, status: 'pending' },
  }
}
