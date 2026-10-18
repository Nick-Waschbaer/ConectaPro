import { useState } from 'react'
import { ApiError, createServiceRequest } from '../services/api'

const EMPTY = { customer_name: '', contact_phone: '', neighborhood: '', description: '' }

const LABELS = {
  customer_name: 'Tu nombre',
  contact_phone: 'Teléfono de contacto',
  neighborhood: 'Barrio o zona',
  description: 'Describe el problema',
}

export default function RequestForm({ professional, onClose }) {
  const [form, setForm] = useState({ ...EMPTY, neighborhood: professional.neighborhood || '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(null)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // Validación sencilla en el navegador; Laravel valida de nuevo.
    const local = {}
    for (const key of Object.keys(EMPTY)) {
      if (!form[key].trim()) local[key] = [`${LABELS[key]} es obligatorio.`]
    }
    setFieldErrors(local)
    if (Object.keys(local).length > 0) return

    setSending(true)
    try {
      const result = await createServiceRequest({ professional_id: professional.id, ...form })
      setSuccess(result)
    } catch (err) {
      setError(err.message)
      if (err instanceof ApiError) setFieldErrors(err.fieldErrors)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="form-title">
      <div className="modal">
        {success ? (
          <div className="success">
            <h2 id="form-title">¡Solicitud enviada!</h2>
            <p>{success.message || 'Solicitud creada correctamente'}</p>
            {success.data?.id && <p className="muted">Número de solicitud: {success.data.id}</p>}
            <p className="muted">Tu solicitud para {professional.name} quedó registrada.</p>
            <button className="btn" onClick={onClose}>
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <h2 id="form-title">Solicitar a {professional.name}</h2>
            <p className="muted">{professional.service}</p>

            {error && (
              <p className="alert" role="alert">
                {error}
              </p>
            )}

            {Object.keys(EMPTY).map((name) => (
              <div className="field" key={name}>
                <label htmlFor={name}>{LABELS[name]}</label>
                {name === 'description' ? (
                  <textarea id={name} name={name} rows="4" value={form[name]} onChange={handleChange} />
                ) : (
                  <input
                    id={name}
                    name={name}
                    type={name === 'contact_phone' ? 'tel' : 'text'}
                    value={form[name]}
                    onChange={handleChange}
                  />
                )}
                {fieldErrors[name] && <span className="field-error">{fieldErrors[name][0]}</span>}
              </div>
            ))}

            <div className="actions">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={sending}>
                Cancelar
              </button>
              <button type="submit" className="btn" disabled={sending}>
                {sending ? 'Enviando…' : 'Enviar solicitud'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
