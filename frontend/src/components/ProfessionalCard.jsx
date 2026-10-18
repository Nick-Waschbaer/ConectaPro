// Iniciales para el avatar: se ignora lo que va entre paréntesis, por ejemplo "(demo)".
function initials(name) {
  return name
    .replace(/\(.*?\)/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() || '')
    .join('')
}

export default function ProfessionalCard({ professional, onRequest }) {
  const { name, service, description, neighborhood, rating } = professional
  return (
    <article className="card">
      <div className="card-top">
        <div className="avatar" aria-hidden="true">
          {initials(name)}
        </div>
        <div>
          <h3>{name}</h3>
          <span className="badge">{service}</span>
        </div>
      </div>

      {description && <p className="card-desc">{description}</p>}

      <ul className="meta">
        {neighborhood && <li>📍 {neighborhood}</li>}
        {rating != null && <li aria-label={`Calificación ${Number(rating).toFixed(1)} de 5`}>★ {Number(rating).toFixed(1)}</li>}
      </ul>

      <button type="button" className="btn btn-block" onClick={() => onRequest(professional)}>
        Solicitar servicio
      </button>
    </article>
  )
}
