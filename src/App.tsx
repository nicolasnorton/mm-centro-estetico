import {useEffect, useState} from 'react';
import {Footer} from './components/Footer';
import {Hero} from './components/Hero';
import {Nav} from './components/Nav';
import {Split} from './components/Split';
import {Statement} from './components/Statement';
import {FeaturedServices} from './components/FeaturedServices';
import {ServicesDirectoryView} from './views/ServicesDirectoryView';
import {ServiceDetailView} from './views/ServiceDetailView';
import {ContactView} from './views/ContactView';
import {models} from './content';
import {useReducedMotion} from './hooks/useReducedMotion';
import {useReveals} from './hooks/useReveals';
import {startScroll} from './lib/scroll';
import {useRouter} from './hooks/useRouter';

const STORAGE_KEY = 'mm_spa_model_index';

// Evaluated strictly ONCE per page load at module initialization,
// preventing React <StrictMode> double-invocation from skipping every other model.
const INITIAL_MODEL_INDEX: number = (() => {
  if (typeof window === 'undefined') return 0;

  // 1. Optional URL override (?model=1..4 or ?model=sofia|valentina|camila|isabela)
  const params = new URLSearchParams(window.location.search);
  const param = params.get('model');
  if (param) {
    const num = parseInt(param, 10);
    if (!isNaN(num) && num >= 1 && num <= models.length) {
      const idx = num - 1;
      try {
        localStorage.setItem(STORAGE_KEY, idx.toString());
      } catch {
        // ignore storage errors
      }
      return idx;
    }
    const namedIndex = models.findIndex(
      (m) =>
        m.id.toLowerCase() === param.toLowerCase() ||
        m.name.toLowerCase() === param.toLowerCase()
    );
    if (namedIndex !== -1) {
      try {
        localStorage.setItem(STORAGE_KEY, namedIndex.toString());
      } catch {
        // ignore storage errors
      }
      return namedIndex;
    }
  }

  // 2. Guaranteed 4-model cycle: sees all 4 models (0 -> 1 -> 2 -> 3) before repeating
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    let nextIndex: number;
    if (saved === null) {
      nextIndex = 0;
    } else {
      const last = parseInt(saved, 10);
      nextIndex = isNaN(last) ? 0 : (last + 1) % models.length;
    }
    localStorage.setItem(STORAGE_KEY, nextIndex.toString());
    return nextIndex;
  } catch {
    return 0;
  }
})();

export default function App() {
  const reduced = useReducedMotion();
  const navRoot = useReveals<HTMLDivElement>();
  const [modelIndex, setModelIndex] = useState<number>(INITIAL_MODEL_INDEX);
  const {route, navigate} = useRouter();

  useEffect(() => startScroll(reduced), [reduced]);

  const handleSelectModel = (index: number) => {
    setModelIndex(index);
    try {
      localStorage.setItem(STORAGE_KEY, index.toString());
    } catch {
      // Ignore if localStorage is restricted
    }
  };

  const currentModel = models[modelIndex] || models[0];

  return (
    <main className="relative min-h-screen bg-paper">
      <div ref={navRoot}>
        <Nav currentRoute={route} onNavigate={navigate} />
      </div>

      {route.view === 'home' && (
        <>
          <Hero
            model={currentModel}
            activeModelIndex={modelIndex}
            onSelectModel={handleSelectModel}
            reduced={reduced}
          />
          <Split model={currentModel} reduced={reduced} />
          <FeaturedServices onNavigate={navigate} />
          <Statement reduced={reduced} />
        </>
      )}

      {route.view === 'services' && (
        <ServicesDirectoryView initialCategory={route.category} onNavigate={navigate} />
      )}

      {route.view === 'service-detail' && (
        <ServiceDetailView serviceId={route.serviceId} onNavigate={navigate} />
      )}

      {route.view === 'contact' && (
        <ContactView onNavigate={navigate} />
      )}

      <Footer onNavigate={navigate} />
    </main>
  );
}
