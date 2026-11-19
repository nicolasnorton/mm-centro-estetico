import {useState} from 'react';
import {
  getServiceById,
  getServicesByCategory,
  getCategoryInfo,
} from '../servicesData';
import {brand} from '../content';

interface ServiceDetailViewProps {
  serviceId: string;
  onNavigate: (to: string) => void;
}

export function ServiceDetailView({serviceId, onNavigate}: ServiceDetailViewProps) {
  const service = getServiceById(serviceId);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  if (!service) {
    return (
      <div className="min-h-screen bg-paper pt-36 pb-24 px-5 text-center">
        <div className="mx-auto max-w-lg rounded-3xl border border-line bg-blush/20 p-12">
          <span className="text-4xl block mb-4">🌿</span>
          <h1 className="font-display text-2xl font-semibold text-ink">
            Tratamiento no encontrado
          </h1>
          <p className="mt-2 text-small text-mute">
            El protocolo solicitado no existe o fue actualizado en nuestro catálogo clínico.
          </p>
          <button
            onClick={() => onNavigate('#/servicios')}
            className="mt-6 rounded-full bg-ink px-6 py-2.5 text-small font-medium text-paper hover:bg-coral transition-colors"
          >
            Ver todos los tratamientos
          </button>
        </div>
      </div>
    );
  }

  const category = getCategoryInfo(service.category);
  const relatedServices = getServicesByCategory(service.category)
    .filter((s) => s.id !== service.id)
    .slice(0, 3);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="min-h-screen bg-paper pt-28 pb-28 px-5 md:px-7">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-micro font-medium text-mute mb-8 flex-wrap">
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
          <a
            href="#/servicios"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('#/servicios');
            }}
            className="hover:text-coral transition-colors"
          >
            Tratamientos
          </a>
          <span>/</span>
          <a
            href={`#/servicios?categoria=${service.category}`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(`#/servicios?categoria=${service.category}`);
            }}
            className="hover:text-coral transition-colors"
          >
            {category?.shortLabel || service.categoryLabel}
          </a>
          <span>/</span>
          <span className="text-ink font-semibold truncate max-w-[200px] sm:max-w-none">
            {service.shortName}
          </span>
        </nav>

        {/* Hero Section of Service */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-coral/30 bg-blush/60 px-3 py-1 text-micro font-semibold uppercase tracking-wider text-coral">
                <span className="size-1.5 rounded-full bg-coral" />
                {service.categoryLabel}
              </span>
              <span className="rounded-full bg-paper border border-line px-3 py-1 text-micro font-medium text-mute">
                Protocolo Médico Certificado
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-ink leading-[1.08]">
              {service.name}
            </h1>

            <p className="mt-3 font-serif text-xl sm:text-2xl italic text-coral">
              {service.tagline}
            </p>

            <p className="mt-5 text-copy text-mute leading-relaxed">
              {service.description}
            </p>

            {/* Quick Stats Grid */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-blush/30 border border-line">
                <span className="text-micro font-semibold uppercase tracking-wider text-mute block mb-1">
                  ⏱ Duración
                </span>
                <span className="font-display text-base font-semibold text-ink">
                  {service.duration}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-blush/30 border border-line">
                <span className="text-micro font-semibold uppercase tracking-wider text-mute block mb-1">
                  🔄 Sesiones Sugeridas
                </span>
                <span className="font-display text-base font-semibold text-ink">
                  {service.recommendedSessions}
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-blush/30 border border-line">
                <span className="text-micro font-semibold uppercase tracking-wider text-mute block mb-1">
                  🌱 Recuperación
                </span>
                <span className="font-display text-base font-semibold text-ink">
                  {service.recoveryTime}
                </span>
              </div>
            </div>

            {/* Target Conditions */}
            <div className="mt-6 flex flex-wrap items-center gap-1.5">
              <span className="text-micro font-semibold text-mute uppercase mr-1">
                Indicado para:
              </span>
              {service.targetConditions.map((cond, idx) => (
                <span
                  key={idx}
                  className="rounded-full bg-white border border-line px-3 py-1 text-micro text-ink font-medium"
                >
                  {cond}
                </span>
              ))}
            </div>
          </div>

          {/* Right Hero Visual & Booking Card */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-line shadow-lg bg-blush/20">
              <img
                src={service.image}
                alt={service.name}
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-ink/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <span className="text-micro uppercase font-semibold tracking-wider text-coral block mb-1">
                  Centro MM Centro Estético · Cuenca
                </span>
                <p className="font-display text-lg font-semibold leading-tight drop-shadow-sm">
                  Atención directa y protocolizada por Mónica Mejía
                </p>
              </div>
            </div>

            {/* Direct Booking Callout */}
            <div className="rounded-3xl border border-coral/30 bg-blush/40 p-6 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-micro font-semibold uppercase tracking-wider text-ink">
                  Disponibilidad de Citas en Cuenca
                </span>
              </div>
              <p className="text-small text-mute">
                Agenda tu evaluación diagnóstica sin compromiso o asegura tu turno directamente en cabina.
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5 mt-2">
                <a
                  href={service.whatsappText}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-coral px-5 py-3 text-small font-medium text-paper hover:bg-ink transition-colors shadow-xs"
                >
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.599 2.679-.702c.974.553 1.838.816 2.781.816 3.18 0 5.767-2.587 5.767-5.766.001-3.182-2.585-5.77-5.767-5.77zm0 10.368c-.848 0-1.637-.246-2.348-.711l-.168-.11-1.579.414.421-1.54-.12-.191c-.48-.763-.733-1.528-.733-2.46 0-2.535 2.062-4.597 4.597-4.597 2.535 0 4.598 2.063 4.598 4.598 0 2.535-2.063 4.597-4.597 4.597z"/>
                  </svg>
                  <span>Agendar por WhatsApp</span>
                </a>
                <a
                  href={`tel:${brand.phone.replace(/\s+/g, '')}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 bg-white/90 px-4 py-3 text-small font-medium text-ink hover:border-coral hover:text-coral transition-colors"
                >
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>Llamar</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Deep Dive Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Clinical Columns */}
          <div className="lg:col-span-8 flex flex-col gap-12">
            {/* 1. Clinical Objective */}
            <section className="p-7 md:p-8 rounded-3xl bg-blush/20 border border-line">
              <div className="flex items-center gap-2 text-micro font-semibold uppercase tracking-wider text-coral mb-3">
                <span className="size-2 rounded-full bg-coral" />
                Fundamento Médico & Justificación
              </div>
              <h2 className="font-display text-2xl font-semibold text-ink">
                Objetivo Clínico del Protocolo
              </h2>
              <p className="mt-3 text-copy text-ink/85 leading-relaxed">
                {service.clinicalObjective}
              </p>
              <div className="mt-5 pt-4 border-t border-line/70 flex items-start gap-3">
                <span className="text-coral text-lg font-bold">⚙</span>
                <div>
                  <span className="text-micro font-semibold uppercase text-mute tracking-wider block">
                    Tecnología y Principios Aplicados:
                  </span>
                  <p className="text-small text-ink font-medium mt-0.5">
                    {service.technology}
                  </p>
                </div>
              </div>
            </section>

            {/* 2. Protocol Steps Timeline */}
            <section>
              <div className="flex items-center gap-2 text-micro font-semibold uppercase tracking-wider text-coral mb-2">
                <span>Paso a Paso</span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-ink mb-6">
                Protocolo Clínico en Cabina
              </h2>

              <div className="space-y-4">
                {service.protocolSteps.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-5 md:p-6 rounded-2xl border border-line bg-white/70 hover:border-coral/40 transition-[background-color,color,border-color,box-shadow] duration-200 flex flex-col sm:flex-row gap-4 items-start"
                  >
                    <div className="flex items-center justify-center size-10 rounded-full bg-blush text-coral font-display font-bold text-sm shrink-0 border border-coral/20">
                      {s.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-lg font-semibold text-ink">
                        {s.title}
                      </h3>
                      <p className="mt-1 text-small text-mute leading-relaxed">
                        {s.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. Clinical Benefits Grid */}
            <section>
              <div className="flex items-center gap-2 text-micro font-semibold uppercase tracking-wider text-coral mb-2">
                <span>Resultados Probados</span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-ink mb-6">
                Beneficios Clínicos Principales
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.benefits.map((benefit, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-paper border border-line hover:border-coral/30 transition-[background-color,color,border-color,box-shadow] duration-200 flex items-start gap-3"
                  >
                    <div className="size-6 rounded-full bg-coral/10 text-coral flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <p className="text-small text-ink/90 leading-snug font-medium">
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. Aftercare & Recommendations */}
            <section className="p-7 md:p-8 rounded-3xl bg-blush/30 border border-line">
              <div className="flex items-center gap-2 text-micro font-semibold uppercase tracking-wider text-coral mb-2">
                <span>Seguridad & Cuidados</span>
              </div>
              <h2 className="font-display text-2xl font-semibold text-ink mb-4">
                Recomendaciones Post-Tratamiento
              </h2>
              <ul className="space-y-3">
                {service.aftercare.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-small text-ink/85 leading-relaxed">
                    <span className="text-coral font-bold mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 5. FAQs Accordion */}
            <section>
              <div className="flex items-center gap-2 text-micro font-semibold uppercase tracking-wider text-coral mb-2">
                <span>Dudas Frecuentes</span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-ink mb-6">
                Preguntas Habituales de Pacientes
              </h2>

              <div className="space-y-3">
                {service.faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-line bg-paper overflow-hidden transition-[background-color,color,border-color,box-shadow] duration-200"
                    >
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="w-full p-5 text-left flex items-center justify-between gap-4 font-display text-base font-semibold text-ink hover:text-coral transition-colors"
                      >
                        <span>{faq.question}</span>
                        <span className="size-6 rounded-full bg-blush flex items-center justify-center text-sm shrink-0">
                          {isOpen ? '−' : '+'}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-small text-mute leading-relaxed border-t border-line/50">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-4 sticky top-28 flex flex-col gap-6">
            {/* Summary Booking Card */}
            <div className="rounded-3xl border border-line bg-white/90 p-6 md:p-7 shadow-lg flex flex-col gap-5">
              <div>
                <span className="text-micro font-semibold uppercase tracking-wider text-coral">
                  Reserva Personalizada
                </span>
                <h3 className="font-display text-xl font-semibold text-ink mt-1">
                  Agenda tu sesión en Cuenca
                </h3>
                <p className="text-small text-mute mt-1.5 leading-relaxed">
                  Trato exclusivo, puntual y privado en nuestro centro estético.
                </p>
              </div>

              <div className="space-y-2 py-3 border-y border-line text-small">
                <div className="flex justify-between">
                  <span className="text-mute">Atención:</span>
                  <span className="font-medium text-ink">Mónica Mejía</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mute">Tiempo estimado:</span>
                  <span className="font-medium text-ink">{service.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mute">Modalidad:</span>
                  <span className="font-medium text-ink">Previa cita médica</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mute">Ciudad:</span>
                  <span className="font-medium text-ink">Cuenca, Ecuador</span>
                </div>
              </div>

              <a
                href={service.whatsappText}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-small font-medium text-paper hover:bg-coral transition-[background-color,color,border-color,box-shadow] duration-200 shadow-md group"
              >
                <span>Agendar Cita por WhatsApp</span>
                <svg className="size-4 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.599 2.679-.702c.974.553 1.838.816 2.781.816 3.18 0 5.767-2.587 5.767-5.766.001-3.182-2.585-5.77-5.767-5.77zm0 10.368c-.848 0-1.637-.246-2.348-.711l-.168-.11-1.579.414.421-1.54-.12-.191c-.48-.763-.733-1.528-.733-2.46 0-2.535 2.062-4.597 4.597-4.597 2.535 0 4.598 2.063 4.598 4.598 0 2.535-2.063 4.597-4.597 4.597z"/>
                </svg>
              </a>

              <a
                href="#/contacto"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('#/contacto');
                }}
                className="w-full inline-flex items-center justify-center rounded-full border border-line bg-paper px-4 py-2.5 text-micro font-medium text-ink/80 hover:text-coral hover:border-coral transition-colors"
              >
                Ver ubicación & horarios de atención
              </a>

              {/* Guarantees */}
              <div className="pt-2 flex flex-col gap-2 text-micro text-mute">
                <span className="flex items-center gap-2">
                  <span className="text-coral">✓</span> Diagnóstico previo exhaustivo
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-coral">✓</span> Bioseguridad y materiales estériles
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-coral">✓</span> Seguimiento post-tratamiento
                </span>
              </div>
            </div>

            {/* Location Pill */}
            <div className="rounded-2xl border border-line bg-blush/20 p-5">
              <span className="text-micro font-semibold uppercase tracking-wider text-mute block mb-1">
                Dirección en Cuenca
              </span>
              <p className="text-small text-ink font-medium leading-snug">
                {brand.location}
              </p>
              <a
                href={brand.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-micro font-semibold text-coral hover:underline"
              >
                <span>Abrir en Google Maps</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Related Treatments in same category */}
        {relatedServices.length > 0 && (
          <div className="mt-24 pt-12 border-t border-line">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-micro font-semibold uppercase tracking-wider text-coral block mb-1">
                  Continuar explorando
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
                  Otros tratamientos de {category?.shortLabel || 'esta categoría'}
                </h3>
              </div>
              <a
                href={`#/servicios?categoria=${service.category}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(`#/servicios?categoria=${service.category}`);
                }}
                className="text-small font-semibold text-coral hover:text-ink transition-colors flex items-center gap-1"
              >
                <span>Ver todos en {category?.shortLabel}</span>
                <span>→</span>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedServices.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onNavigate(`#/servicios/${rel.id}`)}
                  className="group cursor-pointer rounded-2xl border border-line bg-white/70 p-5 hover:border-coral/40 hover:shadow-lg transition-[background-color,color,border-color,box-shadow] duration-200"
                >
                  <div className="flex items-center justify-between text-micro text-mute mb-2">
                    <span className="text-coral font-medium">{rel.duration}</span>
                    <span>{rel.categoryLabel}</span>
                  </div>
                  <h4 className="font-display text-lg font-semibold text-ink group-hover:text-coral transition-colors line-clamp-1">
                    {rel.shortName}
                  </h4>
                  <p className="mt-1 text-small text-mute line-clamp-2">
                    {rel.tagline}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-micro font-semibold text-ink group-hover:text-coral transition-colors">
                    Ver protocolo <span>→</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Sticky Mobile WhatsApp CTA */}
      <div className="fixed bottom-5 inset-x-5 z-40 lg:hidden">
        <a
          href={service.whatsappText}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 rounded-full bg-ink py-3.5 px-6 text-small font-medium text-paper shadow-2xl hover:bg-coral transition-colors"
        >
          <svg className="size-4 fill-current text-emerald-400" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.599 2.679-.702c.974.553 1.838.816 2.781.816 3.18 0 5.767-2.587 5.767-5.766.001-3.182-2.585-5.77-5.767-5.77zm0 10.368c-.848 0-1.637-.246-2.348-.711l-.168-.11-1.579.414.421-1.54-.12-.191c-.48-.763-.733-1.528-.733-2.46 0-2.535 2.062-4.597 4.597-4.597 2.535 0 4.598 2.063 4.598 4.598 0 2.535-2.063 4.597-4.597 4.597z"/>
          </svg>
          <span>Agendar {service.shortName} por WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
