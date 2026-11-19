// MM Centro Estético (Mónica Mejía Esthetic - Cuenca, Ecuador)
// Official branding, multi-model profiles, and clinical copy.

export const brand = {
  name: 'MM Centro Estético',
  shortName: 'MM Centro Estético',
  founder: 'Mónica Mejía · Centro Estético Integral',
  location: 'Gonzalo Cordero Dávila y Av. Ricardo Muñoz Dávila, 010203 Cuenca',
  phone: '+593 98 350 9697',
  whatsappUrl:
    'https://wa.me/593983509697?text=Hola%20MM%20Spa%20Aesthetic,%20deseo%20agendar%20una%20evaluaci%C3%B3n%20personalizada%20en%20Cuenca.',
  instagramUrl: 'https://www.instagram.com/mmspaesthetic/',
  mapsUrl: 'https://share.google/MO1hgQpuYQe14f3Tu',
  nav: [
    {label: 'Inicio', href: '#/'},
    {label: 'Tratamientos', href: '#/servicios'},
    {label: 'Método MM', href: '#ritual'},
    {label: 'Instalaciones', href: '#instalaciones'},
    {label: 'Contacto', href: '#/contacto'},
  ],
  contact: 'Contacto',
  booking: 'Agendar cita',
  trusted: {start: 4850, end: 5200, label: 'pacientes transformando su piel'},
};

export * from './servicesData';

export type ScanSide = 'left' | 'right';

export interface ScanPoint {
  name: string;
  value: string;
  side: ScanSide;
}

export interface CardRow {
  value: number;
  suffix: string;
  label: string;
}

export interface SplitStep {
  n: string;
  title: string;
  text: string;
}

export interface SplitPill {
  label: string;
  x: number;
  y: number;
}

export interface SplitConfig {
  eyebrow: string;
  title: string[];
  body: string;
  steps: SplitStep[];
  title2: string[];
  body2: string;
  pills: SplitPill[];
  image: string;
}

export interface ModelProfile {
  id: 'sofia' | 'valentina' | 'camila' | 'isabela';
  name: string;
  shortFocus: string;
  avatarColor: [string, string];
  focus: string;
  eyebrow: string;
  lead: string;
  accent: string;
  tail: string;
  sub: string;
  cta: string;
  scans: readonly ScanPoint[];
  card: {
    title: string;
    done: string;
    rows: CardRow[];
  };
  split: SplitConfig;
  media: {
    introVideo: string;
    idleVideo: string;
    posterImage: string;
    endImage: string;
    splitImage: string;
    altText: string;
  };
}

export const models: readonly ModelProfile[] = [
  // 1. Model 1 — Sofía (Copper-haired model)
  {
    id: 'sofia',
    name: 'Sofía',
    shortFocus: 'Max Light',
    avatarColor: ['#f6cdb9', '#e7866c'],
    focus: 'Protocolo Max Light & Bio-Luminosidad',
    eyebrow: 'Diagnóstico Facial IA · Protocolo Max Light',
    lead: 'Tu piel,',
    accent: 'finalmente',
    tail: 'comprendida.',
    sub: 'En MM Centro Estético analizamos tu piel en treinta segundos y diseñamos un protocolo clínico personalizado para devolverle su luz propia.',
    cta: 'Agendar mi diagnóstico',
    scans: [
      {name: 'Luminosidad', value: '94%', side: 'left'},
      {name: 'Líneas finas', value: 'Mínimas', side: 'right'},
      {name: 'Poros', value: 'Refinados', side: 'left'},
    ],
    card: {
      title: 'Diagnóstico en vivo',
      done: 'Análisis completado',
      rows: [
        {value: 98, suffix: '%', label: 'precisión diagnóstica'},
        {value: 40, suffix: '+', label: 'marcadores leídos'},
        {value: 14, suffix: ' días', label: 'ritual adaptativo'},
      ],
    },
    split: {
      eyebrow: 'El Método Mónica Mejía',
      title: ['Inteligencia', '*Cutánea*'],
      body: 'En MM Centro Estético no perseguimos la perfección artificial. Observamos, diagnosticamos y adaptamos cada tratamiento a las necesidades celulares de tu rostro.',
      steps: [
        {n: '01', title: 'Diagnosticar', text: 'Un escaneo clínico digital mapea hidratación, textura y niveles de bio-luminosidad.'},
        {n: '02', title: 'Personalizar', text: 'Tu protocolo se adapta a tu ritmo celular, estilo de vida y balance dérmico.'},
        {n: '03', title: 'Transformar', text: 'Resultados progresivos y naturales, visibles desde la primera sesión en cabina.'},
      ],
      title2: ['Rituales *Conscientes*'],
      body2: 'La piel viva se transforma con el tiempo. Te guiamos con delicadeza, ciencia y honestidad clínica.',
      pills: [
        {label: 'Protocolo Max Light', x: 58, y: 16},
        {label: 'Hidratación profunda', x: 30, y: 52},
        {label: 'Calma celular', x: 54, y: 82},
      ],
      image: '/media/split.webp',
    },
    media: {
      introVideo: '/media/hero-intro.mp4',
      idleVideo: '/media/hero-idle.mp4',
      posterImage: '/media/hero-poster.webp',
      endImage: '/media/hero-end.webp',
      splitImage: '/media/split.webp',
      altText: 'Modelo Sofía en diagnóstico de bio-luminosidad y Protocolo Max Light',
    },
  },

  // 2. Model 2 — Valentina (Latina model with warm olive skin & sleek dark hair)
  {
    id: 'valentina',
    name: 'Valentina',
    shortFocus: 'Firmeza',
    avatarColor: ['#f3d9c9', '#c99a7f'],
    focus: 'Rejuvenecimiento Facial & Firmeza Sin Cirugía',
    eyebrow: 'Rejuvenecimiento Avanzado · Sin Cirugía',
    lead: 'Firmeza,',
    accent: 'naturalmente',
    tail: 'renovada.',
    sub: 'Bio-estimulación profunda y aparatología de última generación para redefinir el contorno facial sin procedimientos invasivos.',
    cta: 'Evaluar mi piel',
    scans: [
      {name: 'Elasticidad', value: '92%', side: 'left'},
      {name: 'Colágeno', value: 'Activo', side: 'right'},
      {name: 'Firmeza', value: 'Óptima', side: 'left'},
    ],
    card: {
      title: 'Escaneo de firmeza',
      done: 'Evaluación lista',
      rows: [
        {value: 96, suffix: '%', label: 'tensión dérmica'},
        {value: 35, suffix: '+', label: 'vectores faciales'},
        {value: 21, suffix: ' días', label: 'bio-regeneración'},
      ],
    },
    split: {
      eyebrow: 'Bio-Estimulación Clínica',
      title: ['Firmeza', '*Consciente*'],
      body: 'Estimulamos la síntesis natural de colágeno y elastina. Reafirmamos tejidos profundos respetando tu anatomía y expresión única.',
      steps: [
        {n: '01', title: 'Vectores', text: 'Mapeo de líneas de tensión dérmica y soporte neuromuscular facial.'},
        {n: '02', title: 'Bio-estímulo', text: 'Inducción de colágeno propio mediante tecnología no invasiva de grado médico.'},
        {n: '03', title: 'Firmeza', text: 'Redefinición progresiva del óvalo facial y tonicidad visible y duradera.'},
      ],
      title2: ['Elevación *Natural*'],
      body2: 'El verdadero rejuvenecimiento respeta tu anatomía. Firmeza real sostenida por tu propia biología.',
      pills: [
        {label: 'Bio-colágeno', x: 58, y: 16},
        {label: 'Efecto lifting', x: 30, y: 52},
        {label: 'Contorno definido', x: 54, y: 82},
      ],
      image: '/media/model2-split.webp',
    },
    media: {
      introVideo: '/media/model2-intro.mp4',
      idleVideo: '/media/model2-idle.mp4',
      posterImage: '/media/model2-poster.webp',
      endImage: '/media/model2-end.webp',
      splitImage: '/media/model2-split.webp',
      altText: 'Modelo Valentina en evaluación de bio-estimulación y firmeza facial',
    },
  },

  // 3. Model 3 — Camila (Young radiant woman with glass skin & dark wavy hair)
  {
    id: 'camila',
    name: 'Camila',
    shortFocus: 'Detox & Pureza',
    avatarColor: ['#f7dfe1', '#e59aa1'],
    focus: 'Detox Facial Profundo & Textura de Porcelana',
    eyebrow: 'Limpieza Clínica Profunda · Detox Cutáneo',
    lead: 'Pureza,',
    accent: 'visiblemente',
    tail: 'auténtica.',
    sub: 'Oxigenación celular, nutrición dermo-cosmética y equilibrio hidrolipídico para una piel fresca, limpia y libre de imperfecciones.',
    cta: 'Iniciar mi ritual',
    scans: [
      {name: 'Hidratación', value: '96%', side: 'left'},
      {name: 'Oxigenación', value: 'Alta', side: 'right'},
      {name: 'Textura', value: 'Porcelana', side: 'left'},
    ],
    card: {
      title: 'Detox cutáneo en vivo',
      done: 'Pureza confirmada',
      rows: [
        {value: 99, suffix: '%', label: 'pureza folicular'},
        {value: 45, suffix: '+', label: 'activos clínicos'},
        {value: 7, suffix: ' días', label: 'renovación visible'},
      ],
    },
    split: {
      eyebrow: 'Oxigenación & Nutrición',
      title: ['Pureza', '*Celular*'],
      body: 'Liberamos cada poro de toxinas acumuladas e impurezas. Un protocolo oxigenante que restaura la barrera dérmica con efecto porcelana inmediato.',
      steps: [
        {n: '01', title: 'Purificación', text: 'Extracción ultrasónica suave y descongestión de poros sin agredir el tejido.'},
        {n: '02', title: 'Oxigenación', text: 'Infusión de cócteles antioxidantes, péptidos y ácido hialurónico molecular.'},
        {n: '03', title: 'Equilibrio', text: 'Sellado de barrera protectora con efecto porcelana y frescura inmediata.'},
      ],
      title2: ['Textura *Impecable*'],
      body2: 'Una piel limpia es una piel luminosa. Equilibrio puro que respira salud en cada poro.',
      pills: [
        {label: 'Detox ultrasónico', x: 58, y: 16},
        {label: 'Barrera intacta', x: 30, y: 52},
        {label: 'Efecto porcelana', x: 54, y: 82},
      ],
      image: '/media/model3-split.webp',
    },
    media: {
      introVideo: '/media/model3-intro.mp4',
      idleVideo: '/media/model3-idle.mp4',
      posterImage: '/media/model3-poster.webp',
      endImage: '/media/model3-end.webp',
      splitImage: '/media/model3-split.webp',
      altText: 'Modelo Camila con piel de porcelana, limpieza clínica y detox facial',
    },
  },

  // 4. Model 4 — Isabela (Sophisticated sun-kissed model with honey-brown hair)
  {
    id: 'isabela',
    name: 'Isabela',
    shortFocus: 'Integral & Lipo',
    avatarColor: ['#f6dfc8', '#d69752'],
    focus: 'Estética Integral · Lipo Sin Cirugía & Armonía Corporal',
    eyebrow: 'Estética Integral · Rostro & Silueta',
    lead: 'Tu belleza,',
    accent: 'plenamente',
    tail: 'esculpida.',
    sub: 'De tratamientos faciales Max Light a lipo sin cirugía, protocolos anticelulitis y cuidado post-quirúrgico especializado en Cuenca.',
    cta: 'Reservar valoración',
    scans: [
      {name: 'Tonicidad', value: '95%', side: 'left'},
      {name: 'Vitalidad', value: 'Radiante', side: 'right'},
      {name: 'Armonía', value: 'Integral', side: 'left'},
    ],
    card: {
      title: 'Evaluación integral',
      done: 'Perfil completo',
      rows: [
        {value: 97, suffix: '%', label: 'definición tisular'},
        {value: 50, suffix: '+', label: 'parámetros clínicos'},
        {value: 10, suffix: ' días', label: 'cambio progresivo'},
      ],
    },
    split: {
      eyebrow: 'Cuidado Integral MM',
      title: ['Belleza', '*Esculpida*'],
      body: 'Un abordaje integral que sincroniza el cuidado facial con la armonización de la silueta. Tecnología médica y drenaje linfático especializado.',
      steps: [
        {n: '01', title: 'Evaluación', text: 'Diagnóstico corporal y facial 360° para focalizar zonas clave de tratamiento.'},
        {n: '02', title: 'Esculpir', text: 'Aparatología clínica reductora, tonificante y drenaje linfático especializado.'},
        {n: '03', title: 'Armonía', text: 'Silueta definida y tejido firme en perfecta armonía con tu fisonomía.'},
      ],
      title2: ['Armonía *Total*'],
      body2: 'De la precisión facial al contorno corporal: una experiencia clínica pensada para tu bienestar integral.',
      pills: [
        {label: 'Lipo sin cirugía', x: 58, y: 16},
        {label: 'Drenaje clínico', x: 30, y: 52},
        {label: 'Piel tonificada', x: 54, y: 82},
      ],
      image: '/media/model4-split.webp',
    },
    media: {
      introVideo: '/media/model4-intro.mp4',
      idleVideo: '/media/model4-idle.mp4',
      posterImage: '/media/model4-poster.webp',
      endImage: '/media/model4-end.webp',
      splitImage: '/media/model4-split.webp',
      altText: 'Modelo Isabela en estética integral, lipo sin cirugía y armonización',
    },
  },
];

// Fallbacks / defaults corresponding to Model 1
export const hero = models[0];
export const scans = models[0].scans;
export const split = models[0].split;

export const statement = {
  eyebrow: 'Nuestra promesa clínica',
  tokens: [
    'MM Centro Estético',
    'te',
    'ayuda',
    {img: 'eyes'},
    'a',
    'revelar',
    'y',
    'cuidar',
    'tu',
    'piel',
    'como',
    'nunca',
    'antes.',
    'Protocolos',
    'guiados',
    'por',
    'ciencia',
    {img: 'gel'},
    'clínica',
    'y',
    'experiencia',
    'estética,',
    'para',
    'tu',
    '*rostro más radiante,*',
    'firme',
    'y',
    '*luminoso*',
    {img: 'freckles'},
    'en Cuenca.',
  ] as (string | {img: string})[],
  chips: [
    {label: 'Cuidado', icon: 'heart', at: 'cuidar', x: 74, y: 13, r: 6},
    {label: 'Confianza', icon: 'star', at: 'nunca', x: 84, y: 34, r: -5},
    {label: 'Bio-Luz', icon: 'dew', at: 'clínica', x: 6, y: 80, r: 4},
    {label: 'Serenidad', icon: 'leaf', at: '*rostro más radiante,*', x: 58, y: 84, r: -3},
    {label: 'Luminosa', icon: 'sun', at: '*luminoso*', x: 80, y: 74, r: 5},
  ] as const,
};

export const footer = {
  brand: 'MM Centro Estético',
  founder: 'Mónica Mejía · Centro Estético Integral',
  address: 'Gonzalo Cordero Dávila y Av. Ricardo Muñoz Dávila, 010203 Cuenca',
  phone: '+593 98 350 9697',
  whatsappUrl:
    'https://wa.me/593983509697?text=Hola%20MM%20Spa%20Aesthetic,%20deseo%20agendar%20una%20evaluaci%C3%B3n%20personalizada.',
  instagramUrl: 'https://www.instagram.com/mmspaesthetic/',
  mapsUrl: 'https://share.google/MO1hgQpuYQe14f3Tu',
  note: 'Mónica Mejía Centro Estético Integral. Especialistas en bio-estimulación facial, Protocolo Max Light, lipo sin cirugía y armonización estética en Cuenca.',
  links: [
    {label: 'WhatsApp', href: 'https://wa.me/593983509697?text=Hola%20MM%20Spa%20Aesthetic,%20deseo%20agendar%20una%20evaluaci%C3%B3n%20personalizada.'},
    {label: 'Instagram', href: 'https://www.instagram.com/mmspaesthetic/'},
    {label: 'Google Maps', href: 'https://share.google/MO1hgQpuYQe14f3Tu'},
  ],
};
