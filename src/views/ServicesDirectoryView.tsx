import {useState, useMemo, useEffect} from 'react';
import {
  servicesData,
  serviceCategories,
  type ClinicalService,
} from '../servicesData';
import {brand} from '../content';

interface ServicesDirectoryViewProps {
  initialCategory?: string;
  onNavigate: (to: string) => void;
}

const VALID_CATEGORIES = ['faciales', 'corporales', 'post-quirurgicos', 'mirada-labios'];

export function ServicesDirectoryView({initialCategory, onNavigate}: ServicesDirectoryViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(() =>
    initialCategory && VALID_CATEGORIES.includes(initialCategory) ? initialCategory : 'todos'
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quickViewService, setQuickViewService] = useState<ClinicalService | null>(null);

  useEffect(() => {
    setSelectedCategory(
      initialCategory && VALID_CATEGORIES.includes(initialCategory) ? initialCategory : 'todos'
    );
  }, [initialCategory]);

  const filteredServices = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return servicesData.filter((service) => {
      const matchesCategory =
        selectedCategory === 'todos' || service.category === selectedCategory;

      if (!matchesCategory) return false;
      if (!q) return true;

      return (
        service.name.toLowerCase().includes(q) ||
        service.shortName.toLowerCase().includes(q) ||
        service.tagline.toLowerCase().includes(q) ||
        service.description.toLowerCase().includes(q) ||
        service.technology.toLowerCase().includes(q) ||
        service.benefits.some((b) => b.toLowerCase().includes(q)) ||
        service.targetConditions.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [selectedCategory, searchQuery]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {todos: servicesData.length};
    serviceCategories.forEach((cat) => {
      counts[cat.id] = servicesData.filter((s) => s.category === cat.id).length;
    });
    return counts;
  }, []);

  const handleSelectService = (serviceId: string) => {
    onNavigate(`#/servicios/${serviceId}`);
  };

  return (
    <div className="min-h-screen bg-paper pt-28 pb-24 px-5 md:px-7">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-micro font-medium text-mute mb-6">
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
          <span className="text-ink font-semibold">Tratamientos Clínicos</span>
        </nav>

        {/* Header Hero */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-coral/20 bg-blush/40 px-3.5 py-1 text-micro font-medium uppercase tracking-wider text-coral mb-4">
            <span className="size-1.5 rounded-full bg-coral" />
            Catálogo Clínico Integral · 17 Protocolos
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-ink">
            Medicina Estética &{' '}
            <span className="accent font-normal text-coral">Protocolos Avanzados</span>
          </h1>
          <p className="mt-4 text-copy text-mute leading-relaxed max-w-2xl">
            Cada piel y silueta cuenta una historia biológica única. En MM Centro Estético combinamos aparatología de grado médico, activos liposomados y atención personalizada en Cuenca para resultados armónicos y naturales.
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-10 pb-6 border-b border-line">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('todos')}
              className={`rounded-full px-4 py-2 text-small font-medium transition-[background-color,color,border-color,box-shadow] duration-200 shrink-0 ${
                selectedCategory === 'todos'
                  ? 'bg-ink text-paper shadow-xs'
                  : 'bg-blush/40 text-ink/80 hover:bg-blush hover:text-ink'
              }`}
            >
              Todos ({categoryCounts.todos})
            </button>
            {serviceCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-full px-4 py-2 text-small font-medium transition-[background-color,color,border-color,box-shadow] duration-200 shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-ink text-paper shadow-xs'
                    : 'bg-blush/40 text-ink/80 hover:bg-blush hover:text-ink'
                }`}
              >
                {cat.shortLabel} ({categoryCounts[cat.id] || 0})
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-80">
            <input
              id="service-search"
              name="service-search"
              aria-label="Buscar tratamientos, beneficios o tecnología"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por tratamiento, beneficio o condición..."
              className="w-full rounded-full border border-line bg-white/90 pl-10 pr-4 py-2.5 text-small text-ink placeholder:text-mute focus:border-coral focus:outline-none focus:ring-1 focus:ring-coral transition-[background-color,color,border-color,box-shadow] duration-200"
            />
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-mute"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-micro text-mute hover:text-ink"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Selected Category Description (if not "todos") */}
        {selectedCategory !== 'todos' && (
          <div className="mb-8 rounded-2xl bg-blush/25 border border-line p-5">
            {(() => {
              const cat = serviceCategories.find((c) => c.id === selectedCategory);
              if (!cat) return null;
              return (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-ink">
                      {cat.name}
                    </h2>
                    <p className="text-small text-mute mt-0.5">{cat.description}</p>
                  </div>
                  <span className="shrink-0 text-micro font-semibold uppercase tracking-wider text-coral">
                    {cat.badge}
                  </span>
                </div>
              );
            })()}
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between text-micro text-mute mb-6">
          <span>Mostrando {filteredServices.length} de {servicesData.length} tratamientos</span>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('todos');
              }}
              className="text-coral underline hover:text-ink font-medium"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <div className="rounded-3xl border border-line bg-blush/20 p-12 text-center max-w-lg mx-auto">
            <span className="text-3xl mb-3 block">🔍</span>
            <h3 className="font-display text-xl font-semibold text-ink">
              No encontramos resultados para tu búsqueda
            </h3>
            <p className="mt-2 text-small text-mute">
              Prueba con otros términos como &ldquo;acné&rdquo;, &ldquo;firmeza&rdquo;, &ldquo;lipo&rdquo;, &ldquo;ojeras&rdquo; o &ldquo;drenaje&rdquo;.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('todos');
              }}
              className="mt-5 rounded-full bg-ink px-5 py-2 text-small font-medium text-paper hover:bg-coral transition-colors"
            >
              Ver todos los tratamientos
            </button>
          </div>
        )}

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group flex flex-col rounded-3xl border border-line bg-white/70 overflow-hidden shadow-xs hover:shadow-xl hover:border-coral/40 transition-[border-color,box-shadow] duration-200"
            >
              {/* Media image header */}
              <div className="relative aspect-[16/10] overflow-hidden bg-blush/20">
                <img
                  src={service.image}
                  alt={service.name}
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-t from-ink/70 via-ink/20 to-transparent" />
                
                {/* Category Pill */}
                <div className="absolute top-3.5 left-3.5">
                  <span className="glass rounded-full px-3 py-1 text-micro font-medium text-ink shadow-xs">
                    {service.categoryLabel}
                  </span>
                </div>

                {/* Duration & Sessions Bar */}
                <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white text-micro font-medium">
                  <span className="flex items-center gap-1.5 drop-shadow-sm">
                    <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {service.duration}
                  </span>
                  <span className="truncate max-w-[170px] text-paper/90 drop-shadow-sm">
                    {service.recommendedSessions}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="flex flex-col flex-1 p-6">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-display text-xl font-semibold text-ink tracking-tight group-hover:text-coral transition-colors line-clamp-1">
                    {service.shortName}
                  </h3>
                </div>

                <p className="text-small text-coral font-medium line-clamp-1">
                  {service.tagline}
                </p>

                <p className="mt-2.5 text-small text-mute line-clamp-3 leading-relaxed flex-1">
                  {service.description}
                </p>

                {/* Technology pill */}
                <div className="mt-4 p-2.5 rounded-xl bg-blush/30 border border-line/60">
                  <span className="text-[0.68rem] font-semibold uppercase tracking-wider text-mute block mb-0.5">
                    Tecnología / Técnica:
                  </span>
                  <p className="text-micro text-ink/80 font-medium line-clamp-1">
                    {service.technology}
                  </p>
                </div>

                {/* Key Benefits */}
                <div className="mt-4 space-y-1.5">
                  <span className="text-[0.68rem] font-semibold uppercase tracking-wider text-mute block">
                    Beneficios Clínicos:
                  </span>
                  {service.benefits.slice(0, 3).map((benefit, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-micro text-ink/80">
                      <svg className="size-3 text-coral shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="line-clamp-1">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Target Conditions Badges */}
                <div className="mt-4 pt-3 border-t border-line/60 flex flex-wrap gap-1">
                  {service.targetConditions.slice(0, 3).map((cond, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-paper border border-line px-2 py-0.5 text-[0.66rem] text-mute"
                    >
                      {cond}
                    </span>
                  ))}
                  {service.targetConditions.length > 3 && (
                    <span className="rounded-full bg-paper border border-line px-1.5 py-0.5 text-[0.66rem] text-mute">
                      +{service.targetConditions.length - 3}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-4 border-t border-line/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSelectService(service.id)}
                      className="rounded-full bg-ink px-4 py-2 text-small font-medium text-paper hover:bg-coral transition-colors flex items-center gap-1.5"
                    >
                      <span>Ver detalle</span>
                      <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setQuickViewService(service)}
                      title="Vista Rápida"
                      className="rounded-full border border-line bg-paper p-2 text-ink/70 hover:text-coral hover:border-coral transition-colors"
                    >
                      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                      </svg>
                    </button>
                  </div>

                  <a
                    href={service.whatsappText}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-coral/30 bg-coral/10 px-3.5 py-2 text-micro font-semibold text-coral hover:bg-coral hover:text-paper transition-[background-color,color,border-color,box-shadow] duration-200"
                  >
                    <span>Agendar</span>
                    <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.599 2.679-.702c.974.553 1.838.816 2.781.816 3.18 0 5.767-2.587 5.767-5.766.001-3.182-2.585-5.77-5.767-5.77zm0 10.368c-.848 0-1.637-.246-2.348-.711l-.168-.11-1.579.414.421-1.54-.12-.191c-.48-.763-.733-1.528-.733-2.46 0-2.535 2.062-4.597 4.597-4.597 2.535 0 4.598 2.063 4.598 4.598 0 2.535-2.063 4.597-4.597 4.597z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick View Modal */}
        {quickViewService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-fade-in">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-paper border border-line p-6 md:p-8 shadow-2xl">
              <button
                onClick={() => setQuickViewService(null)}
                className="absolute top-5 right-5 size-8 rounded-full bg-blush/60 text-ink hover:bg-coral hover:text-paper flex items-center justify-center transition-colors"
              >
                ✕
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-full bg-blush px-3 py-1 text-micro font-medium text-coral">
                  {quickViewService.categoryLabel}
                </span>
                <span className="text-micro text-mute">⏱ {quickViewService.duration}</span>
              </div>

              <h2 className="font-display text-2xl md:text-3xl font-semibold text-ink">
                {quickViewService.name}
              </h2>
              <p className="text-small text-coral font-medium mt-1">
                {quickViewService.tagline}
              </p>

              <p className="mt-4 text-small text-ink/80 leading-relaxed">
                {quickViewService.description}
              </p>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-blush/20 border border-line">
                <div>
                  <span className="text-micro font-semibold uppercase tracking-wider text-mute block mb-1">
                    Tecnología / Técnica
                  </span>
                  <p className="text-small text-ink font-medium">
                    {quickViewService.technology}
                  </p>
                </div>
                <div>
                  <span className="text-micro font-semibold uppercase tracking-wider text-mute block mb-1">
                    Sesiones sugeridas
                  </span>
                  <p className="text-small text-ink font-medium">
                    {quickViewService.recommendedSessions}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <h4 className="text-small font-semibold text-ink mb-2">Beneficios Clínicos:</h4>
                <ul className="space-y-1.5">
                  {quickViewService.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-small text-ink/85">
                      <span className="text-coral font-bold">✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-5 border-t border-line flex flex-wrap items-center justify-between gap-4">
                <button
                  onClick={() => {
                    const id = quickViewService.id;
                    setQuickViewService(null);
                    handleSelectService(id);
                  }}
                  className="rounded-full bg-ink px-5 py-2.5 text-small font-medium text-paper hover:bg-coral transition-colors"
                >
                  Ver protocolo clínico completo
                </button>

                <a
                  href={quickViewService.whatsappText}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-coral px-5 py-2.5 text-small font-medium text-paper hover:bg-ink transition-colors"
                >
                  <span>Agendar por WhatsApp</span>
                  <svg className="size-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.599 2.679-.702c.974.553 1.838.816 2.781.816 3.18 0 5.767-2.587 5.767-5.766.001-3.182-2.585-5.77-5.767-5.77zm0 10.368c-.848 0-1.637-.246-2.348-.711l-.168-.11-1.579.414.421-1.54-.12-.191c-.48-.763-.733-1.528-.733-2.46 0-2.535 2.062-4.597 4.597-4.597 2.535 0 4.598 2.063 4.598 4.598 0 2.535-2.063 4.597-4.597 4.597z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Reassurance Banner */}
        <div className="mt-16 rounded-3xl border border-line bg-blush/30 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <h3 className="font-display text-2xl font-semibold text-ink">
              Evaluación previa personalizada en cabina
            </h3>
            <p className="mt-1.5 text-small text-mute">
              Antes de iniciar cualquier protocolo en MM Centro Estético, realizamos un examen dermo-clínico para determinar exactamente la combinación de activos y tecnología óptima para tu organismo.
            </p>
          </div>
          <a
            href={brand.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-ink px-6 py-3 text-small font-medium text-paper hover:bg-coral transition-colors shrink-0"
          >
            Consultar con Mónica Mejía
          </a>
        </div>
      </div>
    </div>
  );
}
