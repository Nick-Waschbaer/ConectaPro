// Filtro por oficio con botones ("chips"). Si no hay oficios aún, no muestra nada.
export default function ServiceFilter({ services, value, onChange, disabled }) {
  if (services.length === 0) return null

  return (
    <div className="filter" role="group" aria-label="Filtrar por oficio">
      <span className="filter-label">Oficio</span>
      <div className="chips">
        <button
          type="button"
          className="chip"
          aria-pressed={value === ''}
          onClick={() => onChange('')}
          disabled={disabled}
        >
          Todos
        </button>
        {services.map((service) => (
          <button
            key={service}
            type="button"
            className="chip"
            aria-pressed={value === service}
            onClick={() => onChange(service)}
            disabled={disabled}
          >
            {service}
          </button>
        ))}
      </div>
    </div>
  )
}
