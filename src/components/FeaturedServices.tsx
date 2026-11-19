import {getFeaturedServices, serviceCategories} from '../servicesData';

interface FeaturedServicesProps {
  onNavigate?: (to: string) => void;
}

export function FeaturedServices({onNavigate}: FeaturedServicesProps) {
  const featured = getFeaturedServices();

  const handleLink = (to: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(to);
    } else {
      window.location.hash = to;
    }
  };

  return (
    <section id="tratamientos" className="relative border-t border-line bg-paper px-5 py-24 md:px-7">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-ink">
              Tratamientos <span className="accent font-normal text-coral">Destacados</span>
            </h2>
            <p className="mt-3 text-copy text-mute leading-relaxed max-w-[65ch]">
              Procedimientos personalizados de alta precisión clínica bajo la supervisión de Mónica Mejía en Cuenca. Ciencia dérmica, aparatología certificada y resultados visibles desde la primera sesión.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#/servicios"
              onClick={handleLink('#/servicios')}
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-small font-medium text-paper transition-[background-color] duration-200 hover:bg-coral"
            >
              <span>Ver catálogo completo (17)</span>
              <svg
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Categories Quick Navigation Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-y border-line divide-x divide-line mb-12">
          {serviceCategories.map((cat) => (
            <a
              key={cat.id}
              href={`#/servicios?categoria=${cat.id}`}
              onClick={handleLink(`#/servicios?categoria=${cat.id}`)}
              className="group flex flex-col p-5 hover:bg-blush/20 transition-colors duration-200"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-display text-copy font-semibold text-ink group-hover:text-coral transition-colors duration-200 line-clamp-1">
                  {cat.name}
                </span>
                <span className="text-small text-mute group-hover:text-coral transition-colors duration-200">→</span>
              </div>
              <p className="text-small text-mute mt-1.5 line-clamp-2">
                {cat.tagline}
              </p>
            </a>
          ))}
        </div>

        {/* Featured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((service) => (
            <div
              key={service.id}
              className="group flex flex-col rounded-3xl border border-line bg-paper overflow-hidden shadow-xs hover:shadow-xl hover:border-coral/30 transition-[border-color,box-shadow] duration-200"
            >
              {/* Image banner */}
              <div className="relative aspect-[16/10] overflow-hidden bg-blush/20">
                <img
                  src={service.image}
                  alt={service.name}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Card Body */}
              <div className="flex flex-col flex-1 p-6">
                <p className="text-small text-mute">
                  {service.categoryLabel} · {service.duration}
                </p>
                <h3 className="mt-1.5 font-display text-figure font-semibold text-ink tracking-tight group-hover:text-coral transition-colors duration-200 line-clamp-1">
                  {service.shortName}
                </h3>
                <p className="mt-1 text-small text-coral font-medium line-clamp-1">
                  {service.tagline}
                </p>
                <p className="mt-2.5 text-small text-mute line-clamp-2 leading-relaxed">
                  {service.description}
                </p>

                {/* Action Footer */}
                <div className="mt-auto pt-5 mt-5 border-t border-line/60 flex items-center justify-between">
                  <a
                    href={`#/servicios/${service.id}`}
                    onClick={handleLink(`#/servicios/${service.id}`)}
                    className="text-small font-semibold text-ink hover:text-coral transition-colors duration-200 flex items-center gap-1.5 group/btn"
                  >
                    <span>Ver protocolo</span>
                    <span className="transition-transform duration-200 group-hover/btn:translate-x-1">→</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-14 rounded-3xl border border-coral/20 bg-linear-to-r from-blush/40 via-peach/30 to-blush/20 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl md:text-3xl font-semibold text-ink">
              ¿No estás seguro de qué tratamiento necesita tu piel?
            </h3>
            <p className="mt-2 text-copy text-mute max-w-[65ch]">
              En MM Centro Estético realizamos un diagnóstico digital previo para diseñar un protocolo a la medida de tu fisonomía y biología celular.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <a
              href="https://wa.me/593983509697?text=Hola%20M%C3%B3nica%20Mej%C3%ADa,%20deseo%20agendar%20un%20diagn%C3%B3stico%20facial%20personalizado%20en%20Cuenca."
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-ink px-6 py-3 text-small font-medium text-paper transition-[background-color,box-shadow] duration-200 hover:bg-coral shadow-xs hover:shadow-md"
            >
              Agendar Diagnóstico Gratuito
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
