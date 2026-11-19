import {brand, footer} from '../content';
import {Mark} from './icons';
import {serviceCategories} from '../servicesData';

interface FooterProps {
  onNavigate?: (to: string) => void;
}

export function Footer({onNavigate}: FooterProps) {
  const handleLink = (href: string) => (e: React.MouseEvent) => {
    if (href.startsWith('#/')) {
      e.preventDefault();
      if (onNavigate) {
        onNavigate(href);
      } else {
        window.location.hash = href;
      }
    }
  };

  return (
    <footer id="contacto" className="border-t border-line bg-paper px-5 py-12 md:px-7">
      <div className="mx-auto max-w-7xl">
        {/* Clinic showcase banner */}
        <div id="instalaciones" className="mb-10 overflow-hidden rounded-3xl border border-line bg-blush/30 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 items-center">
            <div className="relative aspect-[16/9] md:col-span-6 h-full min-h-[260px] overflow-hidden">
              <img
                src="/media/clinic-space.webp"
                alt="Instalaciones de MM Centro Estético en Cuenca"
                className="size-full object-cover transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-t from-ink/40 via-transparent to-transparent md:hidden" />
              <div className="absolute bottom-3 left-4 glass rounded-full px-3 py-1 text-micro font-medium text-ink flex items-center gap-1.5 md:hidden">
                <span className="size-1.5 rounded-full bg-coral" />
                Nuestro Centro en Cuenca
              </div>
            </div>
            <div className="p-6 md:p-8 md:col-span-6 flex flex-col justify-center">
              <div className="hidden md:inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-micro font-medium uppercase tracking-wider text-coral bg-coral/10 mb-3">
                <span className="size-1.5 rounded-full bg-coral" />
                Instalaciones MM Centro Estético
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-semibold text-ink tracking-tight">
                Un santuario de calma y medicina estética
              </h3>
              <p className="mt-2 text-small text-mute max-w-lg leading-relaxed">
                Diseñado para brindarte una experiencia clínica y sensorial inigualable en Cuenca. Equipamiento de vanguardia, diagnóstico facial con IA y atención médica personalizada por Mónica Mejía.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a
                  href="#/contacto"
                  onClick={handleLink('#/contacto')}
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-small font-medium text-paper transition-[background-color,color,border-color,box-shadow] duration-200 hover:bg-coral"
                >
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Ver Cómo Llegar & Horarios
                </a>
                <span className="text-small text-ink/75 font-medium">
                  {footer.address}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Links & Information Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-6 items-start pb-10 border-b border-line">
          {/* Brand & founder */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <span className="flex items-center gap-2.5 text-ink">
              <Mark className="h-7 w-auto" />
              <span className="font-display text-lg font-semibold tracking-[-0.03em]">{brand.name}</span>
            </span>
            <p className="text-small font-medium text-ink/80">{footer.founder}</p>
            <p className="text-small text-mute max-w-sm">{footer.note}</p>
          </div>

          {/* Quick Links to Categories */}
          <div className="md:col-span-3 flex flex-col gap-2.5">
            <h3 className="text-micro font-medium uppercase tracking-wider text-mute">Tratamientos Clínicos</h3>
            <div className="flex flex-col gap-1.5 text-small text-ink/80">
              <a
                href="#/servicios"
                onClick={handleLink('#/servicios')}
                className="hover:text-coral transition-colors font-medium"
              >
                Catálogo Completo (17)
              </a>
              {serviceCategories.map((c) => (
                <a
                  key={c.id}
                  href={`#/servicios?categoria=${c.id}`}
                  onClick={handleLink(`#/servicios?categoria=${c.id}`)}
                  className="hover:text-coral transition-colors text-mute hover:text-ink"
                >
                  {c.shortLabel}
                </a>
              ))}
            </div>
          </div>

          {/* Location & Schedule */}
          <div className="md:col-span-3 flex flex-col gap-2">
            <h3 className="text-micro font-medium uppercase tracking-wider text-mute">Ubicación en Cuenca</h3>
            <a
              href="#/contacto"
              onClick={handleLink('#/contacto')}
              className="text-small text-ink/85 hover:text-coral transition-colors flex items-start gap-2 group"
            >
              <svg className="size-4 shrink-0 mt-0.5 text-coral" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="group-hover:underline">{footer.address}</span>
            </a>
            <p className="text-micro text-mute mt-1">Lunes a Sábado · Con previa cita médica</p>
          </div>

          {/* Contact CTAs */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <h3 className="text-micro font-medium uppercase tracking-wider text-mute">Contacto Directo</h3>
            <a
              href={footer.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-small font-medium text-paper transition-[background-color,color,border-color,box-shadow] duration-200 hover:bg-coral w-fit"
            >
              <svg className="size-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.599 2.679-.702c.974.553 1.838.816 2.781.816 3.18 0 5.767-2.587 5.767-5.766.001-3.182-2.585-5.77-5.767-5.77zm0 10.368c-.848 0-1.637-.246-2.348-.711l-.168-.11-1.579.414.421-1.54-.12-.191c-.48-.763-.733-1.528-.733-2.46 0-2.535 2.062-4.597 4.597-4.597 2.535 0 4.598 2.063 4.598 4.598 0 2.535-2.063 4.597-4.597 4.597z"/>
              </svg>
              {brand.booking}
            </a>
            <a
              href={footer.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-small text-mute hover:text-coral transition-colors flex items-center gap-1.5"
            >
              <span>Instagram:</span>
              <span className="font-medium text-ink">@mmspaesthetic</span>
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 text-[0.72rem] text-mute md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} {brand.name}. Todos los derechos reservados.</span>
          <span className="flex gap-5">
            {footer.links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-coral"
              >
                {l.label}
              </a>
            ))}
          </span>
        </div>
      </div>
    </footer>
  );
}
