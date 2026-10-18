export default function ProfessionalCard({ professional, onRequest }) {
  const { name, service, description, neighborhood, rating } = professional
  return (
    <article className="card">
      <span className="badge">{service}</span>
      <h3>{name}</h3>
      {description && <p className="muted">{description}</p>}
      <p className="meta">
        {neighborhood && <span>📍 {neighborhood}</span>}
        {rating != null && <span>★ {Number(rating).toFixed(1)}</span>}
      </p>
      <button className="btn" onClick={() => onRequest(professional)}>
        Solicitar servicio
      </button>
    </article>
  )
}
