import {useState} from 'react';
import {brand, footer} from '../content';
import {serviceCategories} from '../servicesData';

interface ContactViewProps {
  onNavigate: (to: string) => void;
}

export function ContactView({onNavigate}: ContactViewProps) {
  const [selectedInterest, setSelectedInterest] = useState<string>('Diagnóstico Facial');
  const [patientName, setPatientName] = useState<string>('');
  const [customQuery, setCustomQuery] = useState<string>('');

  const buildWhatsAppConsultation = () => {
    let msg = `Hola Mónica Mejía, soy ${patientName.trim() || 'un/a paciente'}. Deseo consultar sobre: *${selectedInterest}* en MM Centro Estético Cuenca.`;
    if (customQuery.trim()) {
      msg += ` Mensaje: ${customQuery.trim()}`;
    }
    return `https://wa.me/593983509697?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="min-h-screen bg-paper pt-28 pb-24 px-5 md:px-7">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-micro font-medium text-mute mb-8">
          <a
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('#/');
            }}
            className="hover:text-coral transition-colors"
          >
            Inicio
          </a>
          <span>/</span>
          <span className="text-ink font-semibold">Contacto & Ubicación</span>
        </nav>

        {/* Header Hero */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-coral/20 bg-blush/40 px-3.5 py-1 text-micro font-medium uppercase tracking-wider text-coral mb-4">
            <span className="size-1.5 rounded-full bg-coral" />
            Centro Estético en Cuenca · Mónica Mejía
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-ink">
            Un Santuario de Calma &{' '}
            <span className="accent font-normal text-coral">Medicina Estética</span>
          </h1>
          <p className="mt-4 text-copy text-mute leading-relaxed max-w-2xl">
            Te recibimos en un espacio privado y sofisticado en Cuenca, diseñado para que experimentes la mayor relajación mientras cuidamos tu piel con rigor clínico y aparatología certificada.
          </p>
        </div>

        {/* 2-Column Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Left Column: Direct Contact & Consultation Builder */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {/* Quick Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* WhatsApp Card */}
              <div className="p-6 rounded-3xl bg-blush/30 border border-line flex flex-col justify-between">
                <div>
                  <div className="size-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
                    <svg className="size-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.599 2.679-.702c.974.553 1.838.816 2.781.816 3.18 0 5.767-2.587 5.767-5.766.001-3.182-2.585-5.77-5.767-5.77zm0 10.368c-.848 0-1.637-.246-2.348-.711l-.168-.11-1.579.414.421-1.54-.12-.191c-.48-.763-.733-1.528-.733-2.46 0-2.535 2.062-4.597 4.597-4.597 2.535 0 4.598 2.063 4.598 4.598 0 2.535-2.063 4.597-4.597 4.597z"/>
                    </svg>
                  </div>
                  <span className="text-micro font-semibold uppercase tracking-wider text-mute">
                    WhatsApp Directo
                  </span>
                  <h3 className="font-display text-xl font-semibold text-ink mt-1">
                    Agendamiento Inmediato
                  </h3>
                  <p className="text-small text-mute mt-1">
                    Respuesta rápida para citas, valoraciones y cotizaciones.
                  </p>
                </div>
                <a
                  href={brand.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-small font-medium text-paper hover:bg-coral transition-colors"
                >
                  <span>Chatear (+593 98 350 9697)</span>
                </a>
              </div>

              {/* Instagram Card */}
              <div className="p-6 rounded-3xl bg-blush/30 border border-line flex flex-col justify-between">
                <div>
                  <div className="size-10 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4">
                    <svg className="size-5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </div>
                  <span className="text-micro font-semibold uppercase tracking-wider text-mute">
                    Comunidad Instagram
                  </span>
                  <h3 className="font-display text-xl font-semibold text-ink mt-1">
                    @mmspaesthetic
                  </h3>
                  <p className="text-small text-mute mt-1">
                    Casos reales clínicos, testimonios y tips diarios de Mónica Mejía.
                  </p>
                </div>
                <a
                  href={brand.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 bg-white/90 px-4 py-2.5 text-small font-medium text-ink hover:text-coral hover:border-coral transition-colors"
                >
                  <span>Seguir en Instagram</span>
                </a>
              </div>
            </div>

            {/* Interactive WhatsApp Consultation Assistant */}
            <div className="p-7 md:p-8 rounded-3xl bg-white/80 border border-line shadow-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-coral/10 px-3 py-1 text-micro font-semibold uppercase tracking-wider text-coral mb-3">
                Asistente de Consulta Previa
              </span>
              <h2 className="font-display text-2xl font-semibold text-ink">
                ¿Qué tratamiento deseas evaluar?
              </h2>
              <p className="mt-1 text-small text-mute">
                Personaliza tu mensaje y contacta directamente con Mónica Mejía en un solo clic:
              </p>

              <div className="mt-6 flex flex-col gap-4">
                {/* Interest Pills */}
                <div>
                  <label className="text-micro font-semibold uppercase tracking-wider text-mute block mb-2">
                    1. Selecciona tu área de interés:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Diagnóstico Facial',
                      'Protocolo Max Light',
                      'Limpieza Facial Profunda',
                      'Lipo Sin Cirugía',
                      'Drenaje Linfático Post-Quirúrgico',
                      'Hidralips',
                      'Depilación Láser',
                    ].map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => setSelectedInterest(interest)}
                        className={`rounded-full px-3.5 py-1.5 text-micro font-medium transition-[background-color,color,border-color,box-shadow] duration-200 ${
                          selectedInterest === interest
                            ? 'bg-ink text-paper shadow-xs'
                            : 'bg-blush/40 text-ink/80 hover:bg-blush'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name field */}
                <div>
                  <label htmlFor="patient-name" className="text-micro font-semibold uppercase tracking-wider text-mute block mb-1.5">
                    2. Tu nombre (opcional):
                  </label>
                  <input
                    id="patient-name"
                    name="patient-name"
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Ej. María Augusta"
                    className="w-full rounded-2xl border border-line bg-paper px-4 py-2.5 text-small text-ink focus:border-coral focus:outline-none"
                  />
                </div>

                {/* Custom query field */}
                <div>
                  <label htmlFor="patient-query" className="text-micro font-semibold uppercase tracking-wider text-mute block mb-1.5">
                    3. Detalle o pregunta adicional:
                  </label>
                  <textarea
                    id="patient-query"
                    name="patient-query"
                    rows={2}
                    value={customQuery}
                    onChange={(e) => setCustomQuery(e.target.value)}
                    placeholder="Ej. Quisiera saber horarios disponibles para este sábado..."
                    className="w-full rounded-2xl border border-line bg-paper px-4 py-2.5 text-small text-ink focus:border-coral focus:outline-none resize-none"
                  />
                </div>

                {/* Submit to WhatsApp */}
                <a
                  href={buildWhatsAppConsultation()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-coral px-6 py-3.5 text-small font-medium text-paper hover:bg-ink transition-[background-color,color,border-color,box-shadow] duration-200 shadow-md group"
                >
                  <svg className="size-4 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.599 2.679-.702c.974.553 1.838.816 2.781.816 3.18 0 5.767-2.587 5.767-5.766.001-3.182-2.585-5.77-5.767-5.77zm0 10.368c-.848 0-1.637-.246-2.348-.711l-.168-.11-1.579.414.421-1.54-.12-.191c-.48-.763-.733-1.528-.733-2.46 0-2.535 2.062-4.597 4.597-4.597 2.535 0 4.598 2.063 4.598 4.598 0 2.535-2.063 4.597-4.597 4.597z"/>
                  </svg>
                  <span>Enviar consulta a WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Location Details & Interactive Google Maps Card */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Address & Hours Information */}
            <div className="p-7 md:p-8 rounded-3xl bg-blush/20 border border-line">
              <span className="text-micro font-semibold uppercase tracking-wider text-coral block mb-2">
                Coordenadas & Horarios
              </span>
              <h2 className="font-display text-2xl font-semibold text-ink">
                Ubicación en Cuenca
              </h2>

              <div className="mt-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="size-8 rounded-full bg-coral/10 text-coral flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-micro font-semibold uppercase text-mute tracking-wider block">
                      Dirección Exacta:
                    </span>
                    <p className="text-small font-medium text-ink mt-0.5">
                      Gonzalo Cordero Dávila y Av. Ricardo Muñoz Dávila
                    </p>
                    <p className="text-micro text-mute">
                      Código Postal 010203 · Cuenca, Azuay, Ecuador
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="size-8 rounded-full bg-coral/10 text-coral flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-micro font-semibold uppercase text-mute tracking-wider block">
                      Horarios de Atención:
                    </span>
                    <p className="text-small font-medium text-ink mt-0.5">
                      Lunes a Viernes: 09:00 - 19:00
                    </p>
                    <p className="text-small font-medium text-ink">
                      Sábados: 09:00 - 14:00
                    </p>
                    <p className="text-micro text-coral font-medium mt-0.5">
                      * Exclusivamente bajo cita médica previa
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="size-8 rounded-full bg-coral/10 text-coral flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-micro font-semibold uppercase text-mute tracking-wider block">
                      Referencias de Acceso:
                    </span>
                    <p className="text-micro text-ink/80 mt-0.5 leading-relaxed">
                      Zona residencial distinguida y segura, a pocos minutos de la Av. Solano y Av. Diez de Agosto. Estacionamiento disponible y ambiente sereno.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Visual Embed / Card */}
            <div className="rounded-3xl border border-line bg-paper overflow-hidden shadow-md">
              <div className="relative aspect-[16/11] bg-blush/30 overflow-hidden">
                {/* Embed iframe for interactive map navigation */}
                <iframe
                  title="Ubicación MM Centro Estético Cuenca"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4970.4901560174985!2d-79.01752852404874!3d-2.9042500970721408!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91cd190a3f5cf06b%3A0x51f2154820c94982!2sMM%20Cento%20Est%C3%A9tico!5e1!3m2!1ses!2sec!4v1794528010542!5m2!1ses!2sec"
                  className="size-full border-0 filter contrast-[1.05]"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>

              <div className="p-5 flex items-center justify-between gap-4 bg-white">
                <div>
                  <span className="text-micro font-semibold uppercase tracking-wider text-coral block">
                    Navegación GPS
                  </span>
                  <span className="text-small font-medium text-ink">
                    Abrir en Google Maps / Waze
                  </span>
                </div>
                <a
                  href={footer.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-micro font-medium text-paper hover:bg-coral transition-colors shrink-0"
                >
                  <span>Cómo llegar</span>
                  <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Clinic Atmosphere Showcase */}
        <div className="mt-8 rounded-3xl border border-line bg-blush/30 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 items-center">
            <div className="relative aspect-[16/10] md:col-span-6 h-full min-h-[300px]">
              <img
                src="/media/clinic-space.webp"
                alt="Instalaciones de MM Centro Estético Cuenca"
                className="size-full object-cover"
              />
            </div>
            <div className="p-8 md:p-10 md:col-span-6 flex flex-col justify-center">
              <span className="text-micro font-semibold uppercase tracking-wider text-coral mb-2">
                Instalaciones MM Centro Estético
              </span>
              <h3 className="font-display text-2xl md:text-3xl font-semibold text-ink">
                Privacidad, Esterilidad & Alta Tecnología
              </h3>
              <p className="mt-3 text-small text-mute leading-relaxed">
                Cada cabina de MM Centro Estético está equipada con tecnología electromédica certificada, camillas ergonómicas y protocolos estrictos de esterilización para brindarte una experiencia clínica segura y placentera.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {serviceCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => onNavigate(`#/servicios?categoria=${cat.id}`)}
                    className="rounded-full bg-white/80 border border-line px-3 py-1 text-micro font-medium text-ink hover:border-coral hover:text-coral transition-colors"
                  >
                    Cabina {cat.shortLabel}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
