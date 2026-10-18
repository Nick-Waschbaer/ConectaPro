import ServiceIcon from './ServiceIcon'

// Atajos por oficio. Son botones (no enlaces) con estado "presionado" para lectores de pantalla.
// Se acomodan en varias filas: nunca quedan recortados ni ocultos.
export default function CategoryGrid({ services, value, onChange }) {
  if (services.length === 0) return null

  return (
    <section id="oficios" className="categories" aria-labelledby="oficios-title">
      <h2 id="oficios-title">Explorá por oficio</h2>
      <div className="category-grid">
        {['', ...services].map((service) => (
          <button
            key={service || 'todos'}
            type="button"
            className="category"
            aria-pressed={value === service}
            onClick={() => onChange(service)}
          >
            <span className="category-icon">
              <ServiceIcon service={service} size={28} />
            </span>
            {service || 'Todos'}
          </button>
        ))}
      </div>
    </section>
  )
}
