import { useEffect, useState } from 'react'
import { getProfessionals } from './services/api'
import ServiceFilter from './components/ServiceFilter'
import ProfessionalCard from './components/ProfessionalCard'
import RequestForm from './components/RequestForm'

export default function App() {
  const [professionals, setProfessionals] = useState([])
  const [services, setServices] = useState([]) // oficios conocidos, para el desplegable
  const [service, setService] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [selected, setSelected] = useState(null)

  // Cada vez que cambia el filtro (o se pulsa "Reintentar") se pide la lista a la API.
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    getProfessionals(service)
      .then((data) => {
        if (cancelled) return
        const list = Array.isArray(data) ? data : data?.data || []
        setProfessionals(list)
        // Se acumulan los oficios vistos para que el desplegable no se vacíe al filtrar.
        setServices((prev) => [...new Set([...prev, ...list.map((p) => p.service)])].sort())
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [service, reloadKey])

  return (
    <>
      <header className="hero">
        <div className="container">
          <h1>ConectaPro</h1>
          <p>Encuentra profesionales de confianza para tu hogar en Asunción.</p>
          <p className="demo-note">Demo escolar: profesionales y datos ficticios.</p>
        </div>
      </header>

      <main className="container">
        <ServiceFilter services={services} value={service} onChange={setService} />

        {loading && <p className="status" role="status">Cargando profesionales…</p>}

        {!loading && error && (
          <div className="alert" role="alert">
            <p>{error}</p>
            <button className="btn btn-secondary" onClick={() => setReloadKey((k) => k + 1)}>
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && professionals.length === 0 && (
          <p className="status">No encontramos profesionales para este oficio.</p>
        )}

        {!loading && !error && professionals.length > 0 && (
          <section className="grid" aria-label="Profesionales">
            {professionals.map((p) => (
              <ProfessionalCard key={p.id} professional={p} onRequest={setSelected} />
            ))}
          </section>
        )}
      </main>

      {selected && <RequestForm professional={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
