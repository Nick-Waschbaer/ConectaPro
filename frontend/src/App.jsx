import { useEffect, useState } from 'react'
import { USE_MOCK_API } from './config'
import { getProfessionals } from './services/api'
import SearchPanel from './components/SearchPanel'
import CategoryGrid from './components/CategoryGrid'
import ProfessionalCard from './components/ProfessionalCard'
import RequestForm from './components/RequestForm'

const unique = (values) => [...new Set(values)].sort((a, b) => a.localeCompare(b, 'es'))

export default function App() {
  const [service, setService] = useState('') // oficio elegido ('' = todos); lo filtra la API
  const [neighborhood, setNeighborhood] = useState('') // barrio elegido; se filtra aquí, sobre la lista recibida
  const [reloadKey, setReloadKey] = useState(0) // sube cuando se pulsa "Reintentar"
  const [services, setServices] = useState([]) // oficios vistos, para las opciones de búsqueda
  const [neighborhoods, setNeighborhoods] = useState([]) // barrios vistos
  const [selected, setSelected] = useState(null) // profesional elegido para el formulario
  // Guardamos el resultado junto con la petición a la que pertenece (key).
  const [result, setResult] = useState({ key: null, list: [], error: '' })

  const requestKey = `${service}|${reloadKey}`
  // Está cargando mientras el resultado guardado no corresponda a la petición actual.
  const loading = result.key !== requestKey

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false

    getProfessionals(service, controller.signal)
      .then((list) => {
        if (cancelled) return
        setResult({ key: requestKey, list, error: '' })
        // Se acumulan oficios y barrios para que las opciones no desaparezcan al filtrar.
        setServices((prev) => unique([...prev, ...list.map((p) => p.service)]))
        setNeighborhoods((prev) => unique([...prev, ...list.map((p) => p.neighborhood).filter(Boolean)]))
      })
      .catch((err) => {
        if (!cancelled) setResult({ key: requestKey, list: [], error: err.message })
      })

    // Si cambia el filtro antes de terminar, se descarta la petición anterior.
    return () => {
      cancelled = true
      controller.abort()
    }
  }, [service, requestKey])

  const { error } = result
  const list = neighborhood ? result.list.filter((p) => p.neighborhood === neighborhood) : result.list
  const filtered = Boolean(service || neighborhood)
  const showSearch = services.length > 0 || loading

  // Si los resultados quedan debajo de la mitad de la pantalla (típico en el celular, por el panel
  // y los oficios que hay antes), se baja hasta ellos. En escritorio ya se ven y no se mueve nada.
  function showResults() {
    const results = document.getElementById('profesionales')
    if (!results || results.getBoundingClientRect().top < window.innerHeight * 0.5) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    results.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
  }

  function handleSearch(next) {
    setService(next.service)
    setNeighborhood(next.neighborhood)
    showResults()
  }

  function handleCategory(next) {
    setService(next)
    showResults()
  }

  function clearFilters() {
    setService('')
    setNeighborhood('')
  }

  // Frase para el título de resultados, por ejemplo "de Plomería en Sajonia".
  const context = [service && `de ${service}`, neighborhood && `en ${neighborhood}`].filter(Boolean).join(' ')

  return (
    <>
      <header className="topbar">
        <div className="container topbar-inner">
          <p className="brand">
            <span className="brand-mark" aria-hidden="true">C</span> ConectaPro
          </p>
          <nav aria-label="Principal">
            {/* La sección de oficios solo existe cuando la API devolvió oficios: sin ella, no hay enlace. */}
            {services.length > 0 && <a href="#oficios">Oficios</a>}
            <a href="#profesionales">Profesionales</a>
          </nav>
        </div>
      </header>

      {USE_MOCK_API && (
        <div className="demo-banner" role="status">
          <div className="container">
            <strong>Modo demostración:</strong> estos profesionales son ficticios y las solicitudes no se guardan
            en MySQL ni se envían a ningún profesional.
          </div>
        </div>
      )}

      <section className="band">
        <div className="container">
          <h1>Encontrá profesionales del hogar en Asunción</h1>
          <p className="band-sub">Elegí un oficio y un barrio, y pedí tu servicio.</p>
        </div>
      </section>

      <main className="container">
        {showSearch && (
          <SearchPanel
            key={`${service}|${neighborhood}|${services.length}|${neighborhoods.length}`}
            services={services}
            neighborhoods={neighborhoods}
            service={service}
            neighborhood={neighborhood}
            onSearch={handleSearch}
          />
        )}

        <CategoryGrid services={services} value={service} onChange={handleCategory} />

        <section id="profesionales" className="results" aria-labelledby="results-title">
          <div aria-live="polite">
            {loading && (
              <>
                <h2 id="results-title">Profesionales</h2>
                <ul className="list" aria-label="Cargando profesionales" aria-busy="true">
                  {[1, 2, 3].map((n) => (
                    <li className="pro skeleton" key={n} aria-hidden="true" />
                  ))}
                </ul>
              </>
            )}

            {!loading && error && (
              <div className="state state-error" role="alert">
                <h2 id="results-title">No pudimos cargar los profesionales</h2>
                <p>{error}</p>
                <button type="button" className="btn btn-primary" onClick={() => setReloadKey((k) => k + 1)}>
                  Reintentar
                </button>
              </div>
            )}

            {!loading && !error && list.length === 0 && (
              <div className="state">
                <h2 id="results-title">
                  {filtered ? `No hay profesionales ${context} por ahora` : 'Todavía no hay profesionales'}
                </h2>
                <p>{filtered ? 'Probá con otro oficio o con otro barrio.' : 'Volvé a intentar más tarde.'}</p>
                {filtered && (
                  <button type="button" className="btn btn-secondary" onClick={clearFilters}>
                    Ver todos
                  </button>
                )}
              </div>
            )}

            {!loading && !error && list.length > 0 && (
              <>
                <h2 id="results-title">
                  {list.length} {list.length === 1 ? 'profesional' : 'profesionales'}
                  {context && ` ${context}`}
                </h2>
                <div className="list-head" aria-hidden="true">
                  <span>Profesional</span>
                  <span>Oficio</span>
                  <span>Barrio</span>
                  <span>Valoración</span>
                  <span />
                </div>
                <ul className="list" aria-label="Profesionales">
                  {list.map((p) => (
                    <ProfessionalCard key={p.id} professional={p} onRequest={setSelected} />
                  ))}
                </ul>
              </>
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          Proyecto escolar de demostración. Los profesionales y las solicitudes son de prueba; no hay pagos ni
          verificación de identidad.
        </div>
      </footer>

      {selected && <RequestForm professional={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
