// Una fila del listado. En escritorio los datos se alinean en columnas (ver index.css);
// en móvil se apilan y cada dato muestra su etiqueta.
export default function ProfessionalCard({ professional, onRequest }) {
  const { name, service, description, neighborhood, rating } = professional
  const hasRating = rating != null

  return (
    <li className="pro">
      <div className="pro-main">
        <h3>{name}</h3>
        {description && <p>{description}</p>}
      </div>

      <dl className="pro-facts">
        <div>
          <dt>Oficio</dt>
          <dd>{service}</dd>
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
