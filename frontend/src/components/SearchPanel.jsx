import { useState } from 'react'

// Panel de búsqueda: oficio + barrio. Los valores se aplican al pulsar "Buscar" (App se ocupa
// de mostrar los resultados).
// App lo vuelve a montar (con key) cuando cambia el filtro aplicado, así los campos siempre
// reflejan lo que se está viendo.
export default function SearchPanel({ services, neighborhoods, service, neighborhood, onSearch }) {
  const [draftService, setDraftService] = useState(service)
  const [draftNeighborhood, setDraftNeighborhood] = useState(neighborhood)

  function handleSubmit(e) {
    e.preventDefault()
    onSearch({ service: draftService, neighborhood: draftNeighborhood })
  }

  return (
    <form className="search" onSubmit={handleSubmit} role="search" aria-label="Buscar profesionales">
      <div className="search-field">
        <label htmlFor="search-service">¿Qué servicio necesitás?</label>
        <select id="search-service" value={draftService} onChange={(e) => setDraftService(e.target.value)}>
          <option value="">Todos los oficios</option>
          {services.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="search-field">
        <label htmlFor="search-neighborhood">Barrio</label>
        <select
          id="search-neighborhood"
          value={draftNeighborhood}
          onChange={(e) => setDraftNeighborhood(e.target.value)}
        >
          <option value="">Todos los barrios</option>
          {neighborhoods.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn btn-primary search-submit">
        Buscar
      </button>
    </form>
  )
}
