import ServiceIcon from './ServiceIcon'

// Iniciales para el avatar, sin el "(demo)" de los datos de prueba: "Marta Gómez (demo)" -> "MG".
function initials(name) {
  return name
    .replace(/\(.*?\)/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

// Una fila del listado. En escritorio los datos se alinean en columnas (ver index.css);
// en móvil se apilan y cada dato muestra su etiqueta.
export default function ProfessionalCard({ professional, onRequest }) {
  const { name, service, description, neighborhood, rating } = professional
  const hasRating = rating != null

  return (
    <li className="pro">
      <div className="pro-main">
        <span className="avatar" aria-hidden="true">
          {initials(name)}
        </span>
        <div>
          <h3>{name}</h3>
          {description && <p>{description}</p>}
        </div>
      </div>

      <dl className="pro-facts">
        <div>
          <dt>Oficio</dt>
          <dd className="pro-service">
            <ServiceIcon service={service} size={18} />
            {service}
          </dd>
        </div>
        <div>
          <dt>Barrio</dt>
          <dd>{neighborhood || 'Sin dato'}</dd>
        </div>
        <div>
          <dt>Valoración</dt>
          <dd className="rating" aria-label={hasRating ? `${Number(rating).toFixed(1)} de 5` : 'Sin valoración'}>
            {hasRating ? (
              <>
                <span className="star" aria-hidden="true">★</span> {Number(rating).toFixed(1)}
              </>
            ) : (
              'Sin dato'
            )}
          </dd>
        </div>
      </dl>

      <button type="button" className="btn btn-outline pro-action" onClick={() => onRequest(professional)}>
        Solicitar servicio
      </button>
    </li>
  )
}
