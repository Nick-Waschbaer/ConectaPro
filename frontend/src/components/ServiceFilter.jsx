// Filtro por oficio con botones. Si aún no hay oficios, no muestra nada.
export default function ServiceFilter({ services, value, onChange, disabled }) {
  if (services.length === 0) return null

  return (
    <div className="chips" role="group" aria-label="Filtrar por oficio">
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
  )
}
