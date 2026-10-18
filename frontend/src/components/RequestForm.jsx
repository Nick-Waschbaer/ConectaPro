import { useEffect, useRef, useState } from 'react'
import { USE_MOCK_API } from '../config'
import { ApiError, createServiceRequest } from '../services/api'

// Los límites copian las reglas de Laravel (StoreServiceRequestRequest).
// Laravel valida igual: esto solo evita viajes innecesarios al servidor.
const FIELDS = [
  { name: 'customer_name', label: 'Tu nombre', max: 100, autoComplete: 'name' },
  {
    name: 'contact_phone',
    label: 'Teléfono de contacto',
    max: 30,
    type: 'tel',
    autoComplete: 'tel',
    hint: 'Usá un número de prueba, por ejemplo 0981 000 000.',
  },
  { name: 'neighborhood', label: 'Barrio o zona', max: 100, hint: 'Solo el barrio, no tu dirección exacta.' },
  { name: 'description', label: '¿Qué necesitás que revisen o arreglen?', max: 1000, multiline: true },
]

const PHONE_REGEX = /^[0-9+\s()-]{6,30}$/

function validate(form) {
  const errors = {}
  for (const { name, label, max } of FIELDS) {
    const value = form[name].trim()
    if (!value) errors[name] = 'Este campo es obligatorio.'
    else if (value.length > max) errors[name] = `${label}: máximo ${max} caracteres.`
  }
  if (!errors.contact_phone && !PHONE_REGEX.test(form.contact_phone.trim())) {
    errors.contact_phone = 'Usá solo números, espacios, +, ( ) y guiones (entre 6 y 30 caracteres).'
  }
  return errors
}

export default function RequestForm({ professional, onClose }) {
  const [form, setForm] = useState({
    customer_name: '',
    contact_phone: '',
    neighborhood: professional.neighborhood || '',
    description: '',
  })
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(null)
  const submittingRef = useRef(false) // evita doble envío aunque se haga doble clic muy rápido
  const dialogRef = useRef(null)

  // Al abrir: bloquea el scroll del fondo y enfoca el primer campo.
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.querySelector('input, textarea')?.focus()
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  // Escape cierra el formulario, salvo mientras se está enviando.
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape' && !submittingRef.current) onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  function focusField(name) {
    dialogRef.current?.querySelector(`[name="${name}"]`)?.focus()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (submittingRef.current) return
    setError('')

    const local = validate(form)
    setFieldErrors(local)
    const firstInvalid = FIELDS.find((f) => local[f.name])
    if (firstInvalid) {
      focusField(firstInvalid.name)
      return
    }

    submittingRef.current = true
    setSending(true)
    try {
      const result = await createServiceRequest({
        professional_id: professional.id,
        customer_name: form.customer_name.trim(),
        contact_phone: form.contact_phone.trim(),
        neighborhood: form.neighborhood.trim(),
        description: form.description.trim(),
      })
      setSuccess(result)
    } catch (err) {
      setError(err.message)
      if (err instanceof ApiError && err.status === 422) {
        // Errores por campo que manda Laravel: { campo: ["mensaje"] }
        const mapped = {}
        for (const { name } of FIELDS) {
          if (err.fieldErrors[name]?.[0]) mapped[name] = err.fieldErrors[name][0]
        }
        setFieldErrors(mapped)
        const first = FIELDS.find((f) => mapped[f.name])
        if (first) focusField(first.name)
        // Si el error es de un campo que el usuario no ve (ej. professional_id), queda el mensaje general.
        if (first) setError('Revisá los campos marcados e intentá de nuevo.')
      }
    } finally {
      submittingRef.current = false
      setSending(false)
    }
  }

  return (
    <div
      className="overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !sending) onClose()
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="form-title" ref={dialogRef}>
        {success ? (
          <div className="success">
            <div className="success-icon" aria-hidden="true">✓</div>
            {USE_MOCK_API ? (
              <>
                <h2 id="form-title">Simulación completada</h2>
                <p>
                  Así se vería la confirmación para <strong>{professional.name}</strong>.
                </p>
                <p className="alert-demo">
                  Modo demostración: esta solicitud NO se guardó en MySQL ni se envió a ningún profesional.
                </p>
              </>
            ) : (
              <>
                <h2 id="form-title">¡Solicitud registrada!</h2>
                <p>
                  Tu solicitud para <strong>{professional.name}</strong> quedó guardada
                  {success.data.status === 'pending' ? ' como pendiente' : ''}.
                </p>
                <p className="muted">Número de solicitud: #{success.data.id}</p>
              </>
            )}
            <button type="button" className="btn btn-primary" onClick={onClose} autoFocus>
              Listo
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <h2 id="form-title">Solicitar servicio</h2>
            <p className="muted">
              {professional.name} · {professional.service}
            </p>

            {USE_MOCK_API && (
              <p className="alert-demo">
                Modo demostración: al enviar, nada se guarda en MySQL ni llega a ningún profesional.
              </p>
            )}

            {error && (
              <p className="alert" role="alert">
                {error}
              </p>
            )}

            {FIELDS.map(({ name, label, max, type, multiline, hint, autoComplete }) => {
              const errorId = `${name}-error`
              const common = {
                id: name,
                name,
                value: form[name],
                onChange: handleChange,
                maxLength: max,
                disabled: sending,
                'aria-invalid': fieldErrors[name] ? 'true' : undefined,
                'aria-describedby': fieldErrors[name] ? errorId : undefined,
              }
              return (
                <div className="field" key={name}>
                  <label htmlFor={name}>{label}</label>
                  {multiline ? (
                    <textarea rows="4" {...common} />
                  ) : (
                    <input type={type || 'text'} autoComplete={autoComplete} {...common} />
                  )}
                  {hint && !fieldErrors[name] && <span className="hint">{hint}</span>}
                  {fieldErrors[name] && (
                    <span className="field-error" id={errorId}>
                      {fieldErrors[name]}
                    </span>
                  )}
                  {multiline && (
                    <span className="counter">
                      {form[name].length}/{max}
                    </span>
                  )}
                </div>
              )
            })}

            <div className="actions">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={sending}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={sending}>
                {sending ? 'Enviando…' : 'Enviar solicitud'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
