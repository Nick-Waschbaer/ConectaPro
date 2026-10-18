export default function ServiceFilter({ services, value, onChange }) {
  return (
    <div className="filter">
      <label htmlFor="service-filter">Filtrar por oficio</label>
      <select id="service-filter" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Todos los oficios</option>
        {services.map((service) => (
          <option key={service} value={service}>
            {service}
          </option>
        ))}
      </select>
    </div>
  )
}
