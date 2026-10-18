import ServiceIcon from './ServiceIcon'

// Atajos por oficio. Son botones (no enlaces) con estado "presionado" para lectores de pantalla.
// Se acomodan en varias filas: nunca quedan recortados ni ocultos.
export default function CategoryGrid({ services, value, onChange }) {
  if (services.length === 0) return null

  return (
    <section id="oficios" className="categories" aria-labelledby="oficios-title">
      <h2 id="oficios-title">Oficios</h2>
      <div className="category-grid">
        <button type="button" className="category" aria-pressed={value === ''} onClick={() => onChange('')}>
          Todos
        </button>
        {services.map((service) => (
          <button
            key={service}
            type="button"
            className="category"
            aria-pressed={value === service}
            onClick={() => onChange(service)}
          >
            <ServiceIcon service={service} />
            {service}
          </button>
        ))}
      </div>
    </section>
  )
}
