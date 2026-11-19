import {useEffect, useState} from 'react';
import {scrollToHash, scrollToY} from '../lib/scroll';

export type Route =
  | {view: 'home'; anchor?: string}
  | {view: 'services'; category?: string}
  | {view: 'service-detail'; serviceId: string}
  | {view: 'contact'};

export function parseHash(hash: string): Route {
  const raw = hash.replace(/^#\/?/, '').trim();
  const [cleanPath, queryStr = ''] = raw.split('?');
  const clean = cleanPath.replace(/\/+$/, '');

  if (!clean || clean === '/') {
    return {view: 'home'};
  }

  // Anchor shortcuts
  if (clean === 'ritual' || clean === 'instalaciones' || clean === 'promesa' || clean === 'tratamientos') {
    return {view: 'home', anchor: clean};
  }

  if (clean === 'contacto' || clean === 'ubicacion') {
    return {view: 'contact'};
  }

  if (clean === 'servicios' || clean === 'tratamientos-catalogo') {
    const params = new URLSearchParams(queryStr);
    const category = params.get('categoria') || undefined;
    return {view: 'services', category};
  }

  if (clean.startsWith('servicios/')) {
    const serviceId = clean.slice('servicios/'.length).split('/')[0];
    if (serviceId) {
      return {view: 'service-detail', serviceId};
    }
    return {view: 'services'};
  }

  return {view: 'home'};
}

export function useRouter() {
  const [route, setRoute] = useState<Route>(() => {
    if (typeof window === 'undefined') return {view: 'home'};
    return parseHash(window.location.hash);
  });

  useEffect(() => {
    const handleHashChange = () => {
      const nextRoute = parseHash(window.location.hash);
      setRoute(nextRoute);

      if (nextRoute.view === 'home' && nextRoute.anchor) {
        // Handle in-page smooth anchor navigation
        setTimeout(() => {
          scrollToHash(`#${nextRoute.anchor}`);
        }, 80);
      } else {
        // Reset scroll position on route switch
        scrollToY(0, true);
        window.scrollTo({top: 0, left: 0, behavior: 'instant'});
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial anchor scroll if loaded directly with an anchor
    if (route.view === 'home' && route.anchor) {
      setTimeout(() => {
        scrollToHash(`#${route.anchor}`);
      }, 250);
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = (to: string) => {
    if (window.location.hash === to) {
      // Re-trigger if already there
      const nextRoute = parseHash(to);
      setRoute(nextRoute);
      if (nextRoute.view === 'home' && nextRoute.anchor) {
        scrollToHash(`#${nextRoute.anchor}`);
      } else {
        scrollToY(0, true);
        window.scrollTo({top: 0, left: 0, behavior: 'instant'});
      }
    } else {
      window.location.hash = to;
    }
  };

  return {route, navigate};
}
