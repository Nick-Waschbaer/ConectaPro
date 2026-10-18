import { useEffect, useState } from 'react'
import { USE_MOCK_API } from './config'
import { getProfessionals } from './services/api'
import ServiceFilter from './components/ServiceFilter'
import ProfessionalCard from './components/ProfessionalCard'
import RequestForm from './components/RequestForm'

export default function App() {
  const [service, setService] = useState('') // oficio elegido ('' = todos)
  const [reloadKey, setReloadKey] = useState(0) // sube cuando se pulsa "Reintentar"
  const [services, setServices] = useState([]) // oficios vistos, para los botones del filtro
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
        // Se acumulan los oficios para que los botones no desaparezcan al filtrar.
        setServices((prev) => [...new Set([...prev, ...list.map((p) => p.service)])].sort())
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

  const { list, error } = result

  return (
    <>
      <header className="band">
        <div className="container">
          <p className="brand">
            <span className="brand-mark" aria-hidden="true">C</span> ConectaPro
          </p>
          <h1>Profesionales del hogar en Asunción</h1>
          <ServiceFilter services={services} value={service} onChange={setService} disabled={loading} />
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

      <main className="container">
        <div aria-live="polite">
          {loading && (
            <ul className="list" aria-label="Cargando profesionales" aria-busy="true">
              {[1, 2, 3].map((n) => (
                <li className="pro skeleton" key={n} aria-hidden="true" />
              ))}
            </ul>
          )}

          {!loading && error && (
            <div className="state state-error" role="alert">
              <h2>No pudimos cargar los profesionales</h2>
              <p>{error}</p>
              <button type="button" className="btn btn-primary" onClick={() => setReloadKey((k) => k + 1)}>
                Reintentar
              </button>
            </div>
          )}

          {!loading && !error && list.length === 0 && (
            <div className="state">
              <h2>{service ? `No hay profesionales de ${service} por ahora` : 'Todavía no hay profesionales'}</h2>
              <p>{service ? 'Probá con otro oficio.' : 'Volvé a intentar más tarde.'}</p>
              {service && (
                <button type="button" className="btn btn-secondary" onClick={() => setService('')}>
                  Ver todos
                </button>
              )}
            </div>
          )}

          {!loading && !error && list.length > 0 && (
            <>
              <p className="count">
                {list.length} {list.length === 1 ? 'profesional' : 'profesionales'}
                {service && ` de ${service}`}
              </p>
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
