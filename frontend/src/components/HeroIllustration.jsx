// Ilustración propia (SVG dibujado a mano, sin imágenes externas): una casa en corte con un
// ambiente por oficio y un lapacho, el árbol típico de Asunción. Es decorativa: los lectores de
// pantalla la ignoran porque el título y el buscador ya dicen lo mismo.
export default function HeroIllustration() {
  return (
    <svg className="hero-art" viewBox="0 0 520 380" aria-hidden="true" focusable="false">
      {/* Suelo */}
      <path d="M10 352h500" stroke="#0e2361" strokeWidth="4" strokeLinecap="round" />

      {/* Lapacho */}
      <path d="M86 352V238M86 270l-18-22M86 256l20-20" stroke="#5b3b2a" strokeWidth="7" strokeLinecap="round" />
      <g fill="#f472b6">
        <circle cx="62" cy="214" r="30" />
        <circle cx="104" cy="200" r="34" />
        <circle cx="80" cy="176" r="28" />
      </g>
      <g fill="#db2777">
        <circle cx="52" cy="232" r="16" />
        <circle cx="122" cy="226" r="18" />
        <circle cx="96" cy="160" r="14" />
      </g>
      <g fill="#fbcfe8">
        <circle cx="70" cy="196" r="5" />
        <circle cx="112" cy="186" r="4" />
        <circle cx="92" cy="222" r="4" />
        <circle cx="60" cy="356" r="3" />
        <circle cx="126" cy="358" r="3" />
      </g>

      {/* Casa: techo, paredes y divisiones */}
      {/* Chimenea: se dibuja antes del techo para que el techo tape su base. */}
      <rect x="382" y="54" width="24" height="44" fill="#f8fafc" stroke="#0e2361" strokeWidth="4" />
      <path d="M146 142 330 46l184 96" fill="#be185d" stroke="#0e2361" strokeWidth="4" strokeLinejoin="round" />
      <rect x="164" y="140" width="332" height="212" fill="#f8fafc" stroke="#0e2361" strokeWidth="4" />
      <path d="M330 140v212M164 246h332" stroke="#0e2361" strokeWidth="4" />

      {/* Electricidad: lámpara encendida y tomacorriente */}
      <path d="M247 142v20" stroke="#0e2361" strokeWidth="3" />
      <path d="M231 162h32l-6 14h-20z" fill="#f59e0b" stroke="#0e2361" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="247" cy="182" r="6" fill="#fde68a" />
      <path d="M247 196v10M229 190l-7 7M265 190l7 7" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
      <rect x="298" y="208" width="14" height="20" rx="3" fill="#fff" stroke="#0e2361" strokeWidth="3" />
      <path d="M303 215v3M307 215v3" stroke="#0e2361" strokeWidth="2" strokeLinecap="round" />

      {/* Aire acondicionado: equipo split y aire frío */}
      <rect x="364" y="162" width="104" height="30" rx="7" fill="#fff" stroke="#0e2361" strokeWidth="3" />
      <path d="M376 182h80" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M386 202c6 6-6 10 0 16M416 202c6 6-6 10 0 16M446 202c6 6-6 10 0 16"
        fill="none"
        stroke="#60a5fa"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Pintura: pared a medio pintar, escalera y rodillo */}
      <rect x="166" y="248" width="82" height="102" fill="#fbcfe8" />
      <path d="M248 248v102" stroke="#f9a8d4" strokeWidth="3" strokeDasharray="6 6" />
      <path d="M272 268v82M304 268v82M272 288h32M272 310h32M272 332h32" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
      <rect x="226" y="262" width="34" height="14" rx="5" fill="#db2777" stroke="#0e2361" strokeWidth="3" />
      <path d="M243 276v12h18v26" fill="none" stroke="#0e2361" strokeWidth="3" strokeLinejoin="round" />

      {/* Plomería: mesada, grifo, gota y cañería con sifón */}
      <path d="M372 290h104" stroke="#0e2361" strokeWidth="5" strokeLinecap="round" />
      <path d="M392 290v8a10 10 0 0 0 10 10h44a10 10 0 0 0 10-10v-8" fill="#e2e8f0" stroke="#0e2361" strokeWidth="3" />
      <path d="M424 290v-22h18v8" fill="none" stroke="#0e2361" strokeWidth="4" strokeLinejoin="round" />
      <path d="M442 282c-4 6-6 9-6 12a6 6 0 0 0 12 0c0-3-2-6-6-12z" fill="#3b82f6" />
      <path
        d="M424 308v20a8 8 0 0 0 16 0v-6h20v28"
        fill="none"
        stroke="#64748b"
        strokeWidth="6"
        strokeLinejoin="round"
      />
    </svg>
  )
}
