import {useState, useEffect, type CSSProperties} from 'react';
import {brand} from '../content';
import {Mark} from './icons';
import {serviceCategories} from '../servicesData';
import type {Route} from '../hooks/useRouter';

interface NavProps {
  currentRoute?: Route;
  onNavigate?: (to: string) => void;
}

export function Nav({currentRoute, onNavigate}: NavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [treatmentsDropdownOpen, setTreatmentsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLink = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setTreatmentsDropdownOpen(false);
    if (onNavigate) {
      onNavigate(href);
    } else {
      window.location.hash = href;
    }
  };

  // Determine active item
  const isHome = !currentRoute || currentRoute.view === 'home';
  const isServices = currentRoute?.view === 'services' || currentRoute?.view === 'service-detail';
  const isContact = currentRoute?.view === 'contact';

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,padding,box-shadow] duration-200 ${
          scrolled || !isHome
            ? 'bg-paper/92 backdrop-blur-md border-b border-line py-3 px-5 md:px-7 shadow-xs'
            : 'bg-transparent py-5 px-5 md:px-7'
        }`}
      >
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-6 lg:gap-8">
            <a
              href="#/"
              onClick={handleLink('#/')}
              className="glass flex items-center gap-3 rounded-full py-1.5 pr-4 pl-3 transition-transform hover:scale-[1.02] group"
              data-reveal
              style={{'--d': '150ms'} as CSSProperties}
            >
              <Mark className="h-8 md:h-9 w-auto transition-transform group-hover:scale-105" />
              <div className="flex flex-col leading-none">
                <span className="font-display text-[1.1rem] font-semibold tracking-[-0.035em] text-ink md:text-[1.25rem]">
                  {brand.name}
                </span>
                <span className="mt-0.5 text-small font-normal text-mute">
                  Mónica Mejía, Cuenca
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav
              className="hidden items-center gap-7 text-small font-medium text-ink/80 xl:flex"
              data-reveal
              style={{'--d': '300ms'} as CSSProperties}
            >
              {/* Inicio */}
              <a
                href="#/"
                onClick={handleLink('#/')}
                className={`transition-colors hover:text-coral ${
                  isHome ? 'text-coral font-semibold' : ''
                }`}
              >
                Inicio
              </a>

              {/* Tratamientos with Dropdown Menu */}
              <div
                className="relative"
                onMouseEnter={() => setTreatmentsDropdownOpen(true)}
                onMouseLeave={() => setTreatmentsDropdownOpen(false)}
              >
                <a
                  href="#/servicios"
                  onClick={handleLink('#/servicios')}
                  className={`flex items-center gap-1 transition-colors hover:text-coral ${
                    isServices ? 'text-coral font-semibold' : ''
                  }`}
                >
                  <span>Tratamientos</span>
                  <svg
                    className={`size-3.5 transition-transform duration-200 ${
                      treatmentsDropdownOpen ? 'rotate-180 text-coral' : 'text-mute'
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </a>

                {/* Dropdown Menu */}
                {treatmentsDropdownOpen && (
                  <div className="absolute top-full -left-4 pt-3 w-80 animate-fade-in">
                    <div className="glass rounded-3xl border border-line p-3 shadow-2xl bg-white/95">
                      <div className="px-3 py-2 border-b border-line/60 flex items-center justify-between">
                        <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-mute">
                          Categorías Clínicas
                        </span>
                        <a
                          href="#/servicios"
                          onClick={handleLink('#/servicios')}
                          className="text-[0.68rem] text-coral hover:underline font-medium"
                        >
                          Ver todos (17) →
                        </a>
                      </div>

                      <div className="p-1 space-y-1">
                        {serviceCategories.map((cat) => (
                          <a
                            key={cat.id}
                            href={`#/servicios?categoria=${cat.id}`}
                            onClick={handleLink(`#/servicios?categoria=${cat.id}`)}
                            className="flex flex-col px-3 py-2 rounded-2xl hover:bg-blush/40 transition-colors group/item"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-small font-semibold text-ink group-hover/item:text-coral transition-colors">
                                {cat.name}
                              </span>
                              <span className="text-micro text-coral opacity-0 group-hover/item:opacity-100 transition-opacity">
                                →
                              </span>
                            </div>
                            <span className="text-micro text-mute line-clamp-1 mt-0.5">
                              {cat.tagline}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Método MM */}
              <a
                href="#/ritual"
                onClick={handleLink('#/ritual')}
                className="transition-colors hover:text-coral"
              >
                Método MM
              </a>

              {/* Instalaciones */}
              <a
                href="#/instalaciones"
                onClick={handleLink('#/instalaciones')}
                className="transition-colors hover:text-coral"
              >
                Instalaciones
              </a>

              {/* Contacto */}
              <a
                href="#/contacto"
                onClick={handleLink('#/contacto')}
                className={`transition-colors hover:text-coral ${
                  isContact ? 'text-coral font-semibold' : ''
                }`}
              >
                Contacto
              </a>
            </nav>
          </div>

          {/* Right Header Section (CTA & Mobile Toggle) */}
          <div
            className="flex items-center gap-3 md:gap-5"
            data-reveal
            style={{'--d': '450ms'} as CSSProperties}
          >
            {/* Medium screen links */}
            <nav className="hidden items-center gap-5 text-small font-medium text-ink/80 lg:flex xl:hidden">
              <a
                href="#/"
                onClick={handleLink('#/')}
                className={`hover:text-coral ${isHome ? 'text-coral font-semibold' : ''}`}
              >
                Inicio
              </a>
              <a
                href="#/servicios"
                onClick={handleLink('#/servicios')}
                className={`hover:text-coral ${isServices ? 'text-coral font-semibold' : ''}`}
              >
                Tratamientos
              </a>
              <a
                href="#/contacto"
                onClick={handleLink('#/contacto')}
                className={`hover:text-coral ${isContact ? 'text-coral font-semibold' : ''}`}
              >
                Contacto
              </a>
            </nav>

            {/* Direct Phone / Contact shortcut */}
            <a
              href="#/contacto"
              onClick={handleLink('#/contacto')}
              className="hidden text-small font-medium text-ink/80 transition-colors hover:text-coral sm:block xl:hidden"
            >
              Ubicación
            </a>

            {/* WhatsApp Booking CTA */}
            <a
              href={brand.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-small font-medium text-paper transition-[background-color,box-shadow] duration-200 hover:bg-coral shadow-xs hover:shadow-md"
            >
              <span>{brand.booking}</span>
              <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.599 2.679-.702c.974.553 1.838.816 2.781.816 3.18 0 5.767-2.587 5.767-5.766.001-3.182-2.585-5.77-5.767-5.77zm0 10.368c-.848 0-1.637-.246-2.348-.711l-.168-.11-1.579.414.421-1.54-.12-.191c-.48-.763-.733-1.528-.733-2.46 0-2.535 2.062-4.597 4.597-4.597 2.535 0 4.598 2.063 4.598 4.598 0 2.535-2.063 4.597-4.597 4.597z"/>
              </svg>
            </a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Abrir Menú de Navegación"
              className="glass size-10 rounded-full flex items-center justify-center text-ink hover:text-coral transition-colors lg:hidden"
            >
              {mobileMenuOpen ? (
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="8" x2="20" y2="8" />
                  <line x1="4" y1="16" x2="20" y2="16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer / Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-paper/95 backdrop-blur-xl animate-fade-in">
          {/* Mobile Top Header */}
          <div className="flex items-center justify-between p-5 border-b border-line">
            <div className="flex items-center gap-2.5">
              <Mark className="h-8 w-auto" />
              <div className="flex flex-col">
                <span className="font-display text-base font-semibold text-ink">
                  {brand.name}
                </span>
                <span className="text-[0.55rem] text-mute uppercase tracking-widest">
                  Cuenca · Ecuador
                </span>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="glass size-9 rounded-full flex items-center justify-center text-ink"
            >
              ✕
            </button>
          </div>

          {/* Mobile Nav Links Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <a
                href="#/"
                onClick={handleLink('#/')}
                className="font-display text-2xl font-semibold text-ink hover:text-coral transition-colors flex items-center justify-between py-2 border-b border-line/60"
              >
                <span>Inicio</span>
                <span className="text-small text-coral">→</span>
              </a>

              <a
                href="#/servicios"
                onClick={handleLink('#/servicios')}
                className="font-display text-2xl font-semibold text-ink hover:text-coral transition-colors flex items-center justify-between py-2 border-b border-line/60"
              >
                <span>Todos los Tratamientos</span>
                <span className="text-small text-coral">17</span>
              </a>

              {/* Sub-categories */}
              <div className="pl-3 py-1 flex flex-col gap-2 text-small text-mute">
                {serviceCategories.map((cat) => (
                  <a
                    key={cat.id}
                    href={`#/servicios?categoria=${cat.id}`}
                    onClick={handleLink(`#/servicios?categoria=${cat.id}`)}
                    className="hover:text-coral py-1 flex items-center justify-between"
                  >
                    <span>{cat.name}</span>
                    <span className="text-micro text-mute">({cat.shortLabel})</span>
                  </a>
                ))}
              </div>

              <a
                href="#/ritual"
                onClick={handleLink('#/ritual')}
                className="font-display text-2xl font-semibold text-ink hover:text-coral transition-colors flex items-center justify-between py-2 border-b border-line/60"
              >
                <span>Método MM</span>
                <span className="text-small text-coral">→</span>
              </a>

              <a
                href="#/instalaciones"
                onClick={handleLink('#/instalaciones')}
                className="font-display text-2xl font-semibold text-ink hover:text-coral transition-colors flex items-center justify-between py-2 border-b border-line/60"
              >
                <span>Instalaciones</span>
                <span className="text-small text-coral">→</span>
              </a>

              <a
                href="#/contacto"
                onClick={handleLink('#/contacto')}
                className="font-display text-2xl font-semibold text-ink hover:text-coral transition-colors flex items-center justify-between py-2 border-b border-line/60"
              >
                <span>Contacto & Ubicación</span>
                <span className="text-small text-coral">→</span>
              </a>
            </div>

            {/* Contact Details in Drawer */}
            <div className="mt-auto pt-6 border-t border-line flex flex-col gap-3">
              <span className="text-micro font-semibold uppercase tracking-wider text-mute">
                Atención en Cuenca:
              </span>
              <p className="text-small text-ink font-medium leading-snug">
                {brand.location}
              </p>
              <a
                href={brand.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-full bg-coral py-3 text-small font-medium text-paper shadow-md"
              >
                <svg className="size-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.599 2.679-.702c.974.553 1.838.816 2.781.816 3.18 0 5.767-2.587 5.767-5.766.001-3.182-2.585-5.77-5.767-5.77zm0 10.368c-.848 0-1.637-.246-2.348-.711l-.168-.11-1.579.414.421-1.54-.12-.191c-.48-.763-.733-1.528-.733-2.46 0-2.535 2.062-4.597 4.597-4.597 2.535 0 4.598 2.063 4.598 4.598 0 2.535-2.063 4.597-4.597 4.597z"/>
                </svg>
                <span>Agendar Cita en WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
