// Íconos simples (SVG propios) para reconocer cada oficio de un vistazo.
// Los oficios vienen de la API: si hay uno desconocido se usa una llave inglesa.
const PATHS = {
  electricidad: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />,
  plomeria: <path d="M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z" />,
  pintura: (
    <>
      <rect x="4" y="3" width="14" height="6" rx="1" />
      <path d="M18 6h2v5h-8v3" />
      <path d="M10 14h4v7h-4z" />
    </>
  ),
  aire: <path d="M12 2v20M4.2 7l15.6 10M19.8 7 4.2 17" />,
  todos: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </>
  ),
  otro: <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z" />,
}

function kindOf(service) {
  if (service === '') return 'todos' // el atajo "Todos" de los oficios
  const s = service.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  if (s.startsWith('electric')) return 'electricidad'
  if (s.startsWith('plomer')) return 'plomeria'
  if (s.startsWith('pintur')) return 'pintura'
  if (s.startsWith('aire')) return 'aire'
  return 'otro'
}

export default function ServiceIcon({ service, size = 24 }) {
  return (
    <svg
      className="service-icon"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[kindOf(service)]}
    </svg>
  )
}
