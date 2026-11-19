// MM Centro Estético (Mónica Mejía · Cuenca, Ecuador)
// Comprehensive Medical & Clinical Services Catalog

export type ServiceCategory =
  | 'faciales'
  | 'corporales'
  | 'post-quirurgicos'
  | 'mirada-labios';

export interface ProtocolStep {
  step: string;
  title: string;
  description: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ClinicalService {
  id: string;
  name: string;
  shortName: string;
  category: ServiceCategory;
  categoryLabel: string;
  tagline: string;
  description: string;
  clinicalObjective: string;
  technology: string;
  duration: string;
  recommendedSessions: string;
  recoveryTime: string;
  benefits: string[];
  targetConditions: string[];
  protocolSteps: ProtocolStep[];
  aftercare: string[];
  faqs: ServiceFAQ[];
  image: string;
  whatsappText: string;
  isFeatured?: boolean;
}

export interface CategoryInfo {
  id: ServiceCategory;
  name: string;
  shortLabel: string;
  tagline: string;
  description: string;
  badge: string;
  color: string;
}

export const serviceCategories: CategoryInfo[] = [
  {
    id: 'faciales',
    name: 'Tratamientos Faciales Avanzados',
    shortLabel: 'Faciales',
    tagline: 'Bio-luminosidad, rejuvenecimiento celular y nutrición dérmica profunda.',
    description:
      'Protocolos clínicos diseñados para restaurar la reflectividad celular, uniformar el tono y compactar la matriz dérmica sin alterar la fisonomía natural.',
    badge: 'Dermo-Estética Facial',
    color: '#e7866c', // coral
  },
  {
    id: 'corporales',
    name: 'Tratamientos Corporales & Silueta',
    shortLabel: 'Corporales',
    tagline: 'Reducción localizada, remodelación anatómica y reafirmación tisular.',
    description:
      'Aparatología médica de última generación combinada con bio-remodelación manual para esculpir la silueta, eliminar adiposidad rebelde y alisar celulitis.',
    badge: 'Silueta & Firmeza',
    color: '#d69752', // warm gold/amber
  },
  {
    id: 'post-quirurgicos',
    name: 'Cuidados Post-Quirúrgicos & Terapéuticos',
    shortLabel: 'Post-Quirúrgicos',
    tagline: 'Drenaje linfático médico, prevención de fibrosis y rehabilitación tisular.',
    description:
      'Atención especializada postoperatoria avalada por cirujanos plásticos en Cuenca. Maniobras kinesiologicas Vodder y ultrasonido anti-fibrosis para acelerar tu recuperación.',
    badge: 'Rehabilitación Dérmica',
    color: '#8fc3dc', // dew blue
  },
  {
    id: 'mirada-labios',
    name: 'Estética de la Mirada & Labios',
    shortLabel: 'Mirada & Labios',
    tagline: 'Hidratación labial molecular, visagismo orgánico y realce de pestañas.',
    description:
      'Tratamientos no invasivos de precisión para iluminar la mirada, armonizar el marco de las cejas y devolver a los labios su volumen hídrico y tono sonrosado.',
    badge: 'Micro-Estética & Armonía',
    color: '#e59aa1', // soft rose
  },
];

const WHATSAPP_BASE = 'https://wa.me/593983509697?text=';

function makeWhatsAppUrl(serviceName: string): string {
  const message = `Hola Mónica Mejía, deseo consultar disponibilidad y agendar una cita para el tratamiento *${serviceName}* en MM Centro Estético Cuenca.`;
  return `${WHATSAPP_BASE}${encodeURIComponent(message)}`;
}

export const servicesData: ClinicalService[] = [
  // ==========================================
  // 1. TRATAMIENTOS FACIALES AVANZADOS
  // ==========================================
  {
    id: 'protocolo-max-light',
    name: 'Protocolo Max Light (Bio-Luminosidad & Tono Homogéneo)',
    shortName: 'Protocolo Max Light',
    category: 'faciales',
    categoryLabel: 'Tratamientos Faciales Avanzados',
    tagline: 'Iluminación celular profunda y unificación dérmica con efecto glow inmediato.',
    description:
      'Tratamiento insignia de MM Centro Estético formulado para revitalizar rostros apagados, foto-envejecidos o con tono irregular por la radiación solar andina. Combina dermo-infusión de principios activos antioxidantes (vitamina C biológica al 15%, ácido ferúlico y niacinamida) con fototerapia LED multiespectral de grado médico para restaurar la reflectividad celular y unificar el tono cutáneo sin descamación agresiva.',
    clinicalObjective:
      'Reactivar el metabolismo de los queratinocitos, neutralizar radicales libres acumulados y optimizar la reflexión de la luz sobre la epidermis mediante bio-infusión de antioxidantes y fotomodulación atérmica.',
    technology:
      'Fototerapia LED Multiespectral + Dermo-Infusión Transdérmica + Bio-Peeling Enzimático Suave',
    duration: '75 min',
    recommendedSessions: '3 a 5 sesiones (cada 15 a 21 días)',
    recoveryTime: 'Inmediata (cero tiempo de baja, evento-ready)',
    isFeatured: true,
    image: '/media/split.webp',
    benefits: [
      'Bio-luminosidad y efecto glow radiante visible desde la 1ª sesión',
      'Atenuación progresiva de manchas solares superficiales y tono cetrino',
      'Estimulación de la microcirculación y oxigenación celular profunda',
      'Textura aterciopelada y refinamiento visible de los poros dilatados',
      'Escudo antioxidante reforzado contra la alta radiación UV en Cuenca',
    ],
    targetConditions: [
      'Piel opaca, desvitalizada o con tono irregular',
      'Fotoenvejecimiento y daño solar superficial',
      'Piel asfixiada por polución o estrés metabólico',
      'Preparación facial para eventos de gala o bodas',
      'Falta de reflectividad y textura áspera',
    ],
    protocolSteps: [
      {
        step: '01',
        title: 'Mapeo Clínico & Diagnóstico Digital',
        description:
          'Evaluación visual y digital de la reflectancia dérmica, grado de hidratación y áreas hiperpigmentadas.',
      },
      {
        step: '02',
        title: 'Doble Limpieza Fito-Activa & Exfoliación Enzimática',
        description:
          'Purificación sin agresión del manto lipídico con enzimas de papaya y piña para retirar células queratinizadas.',
      },
      {
        step: '03',
        title: 'Infusión Transdérmica Max Light',
        description:
          'Penetración de cóctel de vitamina C liposomal, ácido ferúlico y resveratrol mediante nanotecnología dérmica.',
      },
      {
        step: '04',
        title: 'Fotobiomodulación LED Multiespectral',
        description:
          'Emisión de luz ámbar y roja calibrada a 630nm para potenciar la síntesis mitocondrial de ATP y uniformar el tono.',
      },
      {
        step: '05',
        title: 'Sellado Criogénico & Filtro Solar Mineral',
        description:
          'Velo oclusivo calmante y pantalla fotoprotectora de amplio espectro SPF 50+ con toque seco de seda.',
      },
    ],
    aftercare: [
      'Uso obligatorio de protector solar mineral SPF 50+ cada 3 horas.',
      'Evitar saunas, vapor o piscinas climatizadas durante las primeras 24 horas.',
      'No aplicar ácidos exfoliantes domiciliarios (glicólico o retinoico) por 48 horas.',
      'Mantener óptima ingesta de agua para prolongar el efecto turgente.',
    ],
    faqs: [
      {
        question: '¿El Protocolo Max Light pela o descama la piel?',
        answer:
          'No. Es un protocolo de bio-luminosidad biológica no ablativo. La piel no se descama ni sufre enrojecimiento prolongado, por lo que puedes reincorporarte de inmediato a tus actividades sociales.',
      },
      {
        question: '¿Cuántas sesiones se recomiendan para un evento importante?',
        answer:
          'Con una sola sesión 48 horas antes del evento notarás un resplandor extraordinario. Para corregir tono desparejo persistente se aconseja un ciclo de 3 a 4 sesiones.',
      },
    ],
    whatsappText: makeWhatsAppUrl('Protocolo Max Light'),
  },

  {
    id: 'limpieza-facial-profunda',
    name: 'Limpieza Facial Profunda & Detox Cutáneo (Efecto Porcelana)',
    shortName: 'Limpieza Facial Profunda',
    category: 'faciales',
    categoryLabel: 'Tratamientos Faciales Avanzados',
    tagline: 'Higiene dérmica médica, extracción ultrasónica indolora y sellado porcelana.',
    description:
      'Protocolo exhaustivo de purificación y equilibrio celular que supera con creces una limpieza cosmética tradicional. Mediante peeling ultrasónico y desincrustación con vapor de ozono enriquecido, desprendemos impurezas foliculares y comedones sin traumatizar el tejido dérmico. Se complementa con alta frecuencia bactericida, mascarilla hidroplástica criogénica y nutrición molecular para un acabado pulido tipo porcelana.',
    clinicalObjective:
      'Eliminar queratina retenida, sebo oxidado y detritos celulares, desinfectar la flora bacteriana con ozono y alta frecuencia, y restablecer el equilibrio hidrolipídico con un acabado mate y refinado.',
    technology:
      'Peeling Ultrasónico de 28 kHz + Vapor de Ozono + Alta Frecuencia Bactericida + Máscara Hidroplástica Criogénica',
    duration: '90 min',
    recommendedSessions: '1 sesión cada 28 a 35 días (ciclo fisiológico)',
    recoveryTime: 'Inmediata (leve eritema que remite en 1 hora)',
    isFeatured: true,
    image: '/media/model3-split.webp',
    benefits: [
      'Extracción folicular profunda e indolora sin dejar marcas ni pellizcos',
      'Efecto bactericida y descongestivo preventivo contra futuros brotes de acné',
      'Poros visiblemente purificados, descongestionados y refinados',
      'Normalización de la secreción sebácea y equilibrio del manto hidrolipídico',
      'Sensación de frescura absoluta y textura satinada efecto porcelana',
    ],
    targetConditions: [
      'Comedones abiertos (puntos negros) y comedones cerrados (milliums)',
      'Piel asfíctica, congestionada o expuesta a smog citadino',
      'Glándulas sebáceas hiperactivas con brillo en zona T',
      'Textura áspera por acumulación de células muertas',
      'Mantenimiento regular de salud dermatológica',
    ],
    protocolSteps: [
      {
        step: '01',
        title: 'Higienización Dermo-Cosmética',
        description: 'Emulsión micelar biocompatible y tónico descongestivo con extractos botánicos.',
      },
      {
        step: '02',
        title: 'Desincrustación con Vapor de Ozono',
        description:
          'Apertura atraumática del canal folicular y ablandamiento del tapón córneo con calor húmedo ozonizado.',
      },
      {
        step: '03',
        title: 'Peeling Ultrasónico & Micro-Extracción Manual',
        description:
          'Vibración por cavitación líquida para desprender impurezas, seguida de extracción manual estéril milimétrica.',
      },
      {
        step: '04',
        title: 'Terapia de Alta Frecuencia (Gas Argón / Neón)',
        description:
          'Oxigenación tisular, cauterización bactericida y cierre inmediato de poros mediante chisporroteo atérmico.',
      },
      {
        step: '05',
        title: 'Mascarilla Hidroplástica de Alginatos Criogénica',
        description:
          'Compresión oclusiva fría con extractos de menta y caléndula para desinflamar y sellar el efecto porcelana.',
      },
    ],
    aftercare: [
      'No maquillarse durante las 12 horas posteriores a la sesión.',
      'Cambiar la funda de la almohada esa misma noche por higiene folicular.',
      'Lavar el rostro con agua templada y limpiador syndet suave.',
      'Reaplicar protector solar no comedogénico a diario.',
    ],
    faqs: [
      {
        question: '¿Quedaré con marcas rojas o hematomas después de la sesión?',
        answer:
          'No. En MM Centro Estético priorizamos la integridad del tejido dérmico. Gracias a la espátula ultrasónica y el protocolo de alta frecuencia, cualquier enrojecimiento leve desaparece en menos de 60 minutos.',
      },
      {
        question: '¿Cada cuánto tiempo es prudente realizarse una limpieza profunda?',
        answer:
          'Para mantener los poros libres de impurezas y la renovación celular activa, recomendamos 1 sesión cada 4 semanas, coincidiendo con el ciclo natural de descamación celular.',
      },
    ],
    whatsappText: makeWhatsAppUrl('Limpieza Facial Profunda & Detox Cutáneo'),
  },

  {
    id: 'dermapen-microneedling',
    name: 'Dermapen Micro-Needling & Bio-Estimulación de Colágeno',
    shortName: 'Dermapen Micro-Needling',
    category: 'faciales',
    categoryLabel: 'Tratamientos Faciales Avanzados',
    tagline: 'Terapia de micro-punciones dérmicas con cócteles estériles de alta pureza.',
    description:
      'Innovadora terapia de inducción de colágeno mediante microagujas de titanio de velocidad y profundidad micrométrica calibrada. Genera microcanales transdérmicos temporales que inducen una cascada biológica de cicatrización y regeneración, a la vez que posibilitan la absorción profunda del 90% de principios activos estériles: péptidos biomiméticos, factores de crecimiento fibroblástico y ácido hialurónico molecular.',
    clinicalObjective:
      'Inducir la síntesis endógena de colágeno tipo I y III y elastina mediante microneedling fraccionado y permeabilización de mesoterapia biológica estéril de grado médico.',
    technology:
      'Dermapen Automático de Grado Médico con Agujas Quirúrgicas Estériles de Titanio + Principios Activos Biológicos',
    duration: '75 min',
    recommendedSessions: '4 a 6 sesiones (intervalos de 21 a 28 días)',
    recoveryTime: '24 a 48 horas de eritema leve (sensación de calor suave)',
    isFeatured: true,
    image: '/media/pill-gel.webp',
    benefits: [
      'Estimulación masiva de colágeno propio y engrosamiento dermo-epidérmico',
      'Suavizado visible de cicatrices deprimidas residuales de acné',
      'Atenuación de líneas de expresión en frente, entrecejo y patas de gallo',
      'Afinamiento drástico del tamaño de los poros y uniformidad de la piel',
      'Efecto tensor progresivo y recuperación de la elasticidad biológica',
    ],
    targetConditions: [
      'Cicatrices atróficas post-acné',
      'Líneas finas de expresión y arrugas prematuras',
      'Poros dilatados y textura cutánea irregular',
      'Flacidez dérmica y pérdida de densidad tisular',
      'Pigmentación residual post-inflamatoria',
    ],
    protocolSteps: [
      {
        step: '01',
        title: 'Asepsia Quirúrgica & Preparación Tisular',
        description: 'Desinfección estéril con clorhexidina al 0.5% y aplicación de crema anestésica tópica.',
      },
      {
        step: '02',
        title: 'Selección Personalizada del Vial Estéril',
        description:
          'Dosificación de cóctel de aminoácidos, silicio orgánico, péptidos tensores y ácido hialurónico.',
      },
      {
        step: '03',
        title: 'Micro-Punción Fraccionada por Cuadrantes',
        description:
          'Pasadas sistemáticas con Dermapen a profundidad regulada de 0.5mm a 1.5mm según la zona anatómica.',
      },
      {
        step: '04',
        title: 'Terapia Dérmica Calmante con Fotón Frío',
        description:
          'Luz fría calmante para reducir la hiperemia y sellar la barrera con mascarilla enriquecida con caléndula.',
      },
      {
        step: '05',
        title: 'Sellado Epitelial Reparador',
        description:
          'Bálsamo regenerador con factores cicatrizantes y fotoprotector mineral no irritante.',
      },
    ],
    aftercare: [
      'No lavar el rostro con jabón ni usar maquillaje durante las primeras 24 horas.',
      'Evitar la exposición solar directa durante 7 días y aplicar fotoprotector SPF 50+ religioso.',
      'Suspender retinol, vitamina C pura y ácidos exfoliantes durante 5 días.',
      'Hidratar frecuentemente con suero de ácido hialurónico puro estéril.',
    ],
    faqs: [
      {
        question: '¿El procedimiento con Dermapen es doloroso?',
        answer:
          'Gracias a la aplicación previa de una crema anestésica tópica de alta efectividad, el procedimiento es muy tolerable, percibiéndose apenas como una ligera vibración o cosquilleo sobre la piel.',
      },
      {
        question: '¿Cuándo se aprecian los verdaderos resultados del Dermapen?',
        answer:
          'A los 7 días la piel luce más luminosa y tersa. La estimulación real de nuevo colágeno alcanza su pico máximo entre la 3ª y 4ª semana, siendo un resultado acumulativo y duradero.',
      },
    ],
    whatsappText: makeWhatsAppUrl('Dermapen Micro-Needling'),
  },

  {
    id: 'radiofrecuencia-facial-tripolar',
    name: 'Radiofrecuencia Facial Tripolar (Lifting Sin Cirugía)',
    shortName: 'Radiofrecuencia Facial Tripolar',
    category: 'faciales',
    categoryLabel: 'Tratamientos Faciales Avanzados',
    tagline: 'Tensión dérmica controlada, compactación tisular y redefinición del óvalo facial.',
    description:
      'Tratamiento médico-estético no invasivo que suministra ondas electromagnéticas de alta frecuencia para elevar la temperatura de la dermis profunda a 40-42°C de manera controlada y segura. Este choque térmico produce el acortamiento inmediato de las fibras de colágeno existentes e inicia una neocologenogénesis retardada, levantando los tejidos descolgados del tercio inferior, reduciendo papada y devolviendo firmeza al rostro.',
    clinicalObjective:
      'Estimular la contracción y remodelación del colágeno dérmico profundo mediante diatermia tripolar localizada, mejorando la tensión cutánea y combatiendo la elastosis y flacidez.',
    technology:
      'Radiofrecuencia Tripolar / Multipolar Resistiva con Sensor Infrarrojo de Temperatura Cutánea',
    duration: '60 min',
    recommendedSessions: '6 a 8 sesiones (1 semanal o quincenal)',
    recoveryTime: 'Cero tiempo de baja (efecto flash inmediato)',
    isFeatured: true,
    image: '/media/model2-split.webp',
    benefits: [
      'Efecto lifting no quirúrgico y compactación inmediata del tejido cutáneo',
      'Redefinición del ángulo y contorno mandibular (perfilado facial)',
      'Atenuación del surco nasogeniano y líneas de marioneta',
      'Tonificación de la piel flácida en cuello y escote',
      'Tratamiento agradable, cálido e indoloro con efecto buena cara',
    ],
    targetConditions: [
      'Flacidez leve a moderada en rostro, cuello y papada',
      'Pérdida de definición en la línea de la mandíbula',
      'Surcos nasogenianos marcados por caída de mejillas',
      'Piel apergaminada con falta de soporte estructural',
      'Mantenimiento preventivo anti-edad a partir de los 28 años',
    ],
    protocolSteps: [
      {
        step: '01',
        title: 'Preparación Dérmica & Dermo-Limpieza',
        description: 'Retiro de oleosidad y tonificación dérmica con pH equilibrado.',
      },
      {
        step: '02',
        title: 'Aplicación de Gel Glicerinado Conductor',
        description:
          'Medio de acople biocompatible enriquecido con ácido hialurónico para conducción térmica uniforme.',
      },
      {
        step: '03',
        title: 'Emisión de Diatermia Tripolar Guiada',
        description:
          'Movimientos ascendentes y de tracción vectorial con electrodo tripolar hasta alcanzar 40-42°C monitorizados.',
      },
      {
        step: '04',
        title: 'Enfriamiento & Drenaje Manual Tensor',
        description:
          'Masaje mio-fascial con rodillos de cuarzo rosa frío para descongestionar y sellar la elevación tisular.',
      },
      {
        step: '05',
        title: 'Mascarilla Tensora de Péptidos & Fotoprotección',
        description:
          'Nutrición intensiva con suero de colágeno marino y crema selladora de elastina con filtro solar.',
      },
    ],
    aftercare: [
      'Beber al menos 2 litros de agua para favorecer la síntesis de colágeno tisular.',
      'No aplicar compresas heladas de golpe para permitir que el estímulo térmico active fibroblastos.',
      'Continuar con protector solar diario y crema nutritiva reafirmante.',
    ],
    faqs: [
      {
        question: '¿Qué se siente durante una sesión de radiofrecuencia?',
        answer:
          'Se experimenta una sensación cálida muy agradable y relajante similar a un masaje con piedras calientes. No hay dolor ni sensación de ardor.',
      },
      {
        question: '¿Cuánto dura el efecto de lifting tras completar el ciclo?',
        answer:
          'El resultado perdura entre 8 y 12 meses gracias a las nuevas fibras de colágeno creadas por el organismo. Se recomienda una sesión de refuerzo cada 2 o 3 meses.',
      },
    ],
    whatsappText: makeWhatsAppUrl('Radiofrecuencia Facial Tripolar'),
  },

  {
    id: 'peeling-quimico-renovacion',
    name: 'Peeling Químico de Renovación Tisular',
    shortName: 'Peeling Químico de Renovación',
    category: 'faciales',
    categoryLabel: 'Tratamientos Faciales Avanzados',
    tagline: 'Exfoliación médica ácida para corregir hiperpigmentaciones y renovar el estrato córneo.',
    description:
      'Aplicación protocolizada de hidroxiácidos médicos combinados (ácido mandélico, glicólico, salicílico o kójico) seleccionados específicamente según el fototipo cutáneo y las condiciones climáticas de Cuenca. Produce una exfoliación química controlada que desprende las capas celulares dañadas, desvanece manchas de fotoenvejecimiento y activa el recambio tisular para un cutis completamente renovado.',
    clinicalObjective:
      'Acelerar el turnover celular epidérmico, inhibir la tirosinasa para atenuar manchas melánicas y homogenizar el relieve cutáneo mediante quimioexfoliación de pH bufferizado.',
    technology:
      'Soluciones Ácidas Médicas Homologadas (AHA / BHA / PHA) + Solución Neutralizante de pH + Velo Reparador',
    duration: '50 min',
    recommendedSessions: '3 a 5 sesiones (cada 15 a 21 días)',
    recoveryTime: 'Descamación fina imperceptible de 3 a 5 días',
    isFeatured: false,
    image: '/media/split.webp',
    benefits: [
      'Aclaramiento visible de manchas solares, melasma y pecas',
      'Aceleración de la renovación celular epidérmica profunda',
      'Textura infinitamente más fina, suave y homogénea',
      'Regulación de pieles grasas o con tendencia al acné comedónico',
      'Efecto pulido dermo-luminoso con absorción cosmética optimizada',
    ],
    targetConditions: [
      'Manchas solares y fotoenvejecimiento pigmentario',
      'Melasma moderado y pecas acumuladas',
      'Piel engrosada, áspera o con queratinización excesiva',
      'Secuelas pigmentarias post-inflamatorias de acné',
      'Piel apagada y sin reflectividad luminosa',
    ],
    protocolSteps: [
      {
        step: '01',
        title: 'Desengrase & Preparación Cutánea',
        description: 'Limpieza con solución pre-peeling desengrasante para asegurar absorción ácida uniforme.',
      },
      {
        step: '02',
        title: 'Protección de Zonas Sensibles',
        description: 'Aislamiento de aletas de la nariz, comisuras labiales y contorno de ojos con emoliente oclusivo.',
      },
      {
        step: '03',
        title: 'Aplicación Estratificada del Peeling Químico',
        description:
          'Pincelado del cóctel ácido por capas con cronometraje estricto del tiempo de exposición dérmica.',
      },
      {
        step: '04',
        title: 'Neutralización de pH & Lavado Dérmico',
        description:
          'Solución neutralizante alcalina con bicarbonato tamponado para detener la acción ácida de inmediato.',
      },
      {
        step: '05',
        title: 'Máscara Restauradora Post-Peel & Fotoprotección',
        description:
          'Cura calmante con aloe vera de grado médico, ceramidas y pantalla solar física 100% no química.',
      },
    ],
    aftercare: [
      'Evitar completamente la exposición al sol durante la semana siguiente.',
      'No rascar, frotar ni retirar las pequeñas pieles de descamación con los dedos.',
      'Usar limpiador extremadamente suave sin frotar con toallas ásperas.',
      'Reaplicar crema restauradora de barrera varias veces al día.',
    ],
    faqs: [
      {
        question: '¿Puedo hacerme un peeling viviendo en la altitud de Cuenca?',
        answer:
          'Sí. En MM Centro Estético adaptamos las fórmulas y concentraciones específicamente a la radiación de Cuenca, usando ácidos seguros (como el ácido mandélico o ferúlico) que no provocan efecto rebote ni hipersensibilidad solar.',
      },
      {
        question: '¿Sentiré ardor durante el tratamiento?',
        answer:
          'Es normal sentir un ligero picor o cosquilleo durante los 3 a 5 minutos que actúa el ácido. Una vez aplicada la solución neutralizante, el alivio es inmediato.',
      },
    ],
    whatsappText: makeWhatsAppUrl('Peeling Químico de Renovación Tisular'),
  },

  // ==========================================
  // 2. TRATAMIENTOS CORPORALES & SILUETA
  // ==========================================
  {
    id: 'lipo-sin-cirugia',
    name: 'Lipo Sin Cirugía Personalizada (Cavitación + RF + Vacum)',
    shortName: 'Lipo Sin Cirugía',
    category: 'corporales',
    categoryLabel: 'Tratamientos Corporales & Silueta',
    tagline: 'Tri-tecnología reductora para degradar adiposidad localizada y moldear contornos.',
    description:
      'Protocolo reductor y estético intensivo que sincroniza tres de las tecnologías más efectivas en medicina estética no invasiva. La ultracavitación genera microburbujas en el tejido graso para lisar la membrana de los adipocitos; la vacuum-terapia endodérmica moviliza los triglicéridos liberados hacia los conductos linfáticos; y la radiofrecuencia multipolar retrae la dermis evitando la flacidez secundaria a la pérdida de volumen.',
    clinicalObjective:
      'Destruir adipocitos localizados en zonas rebeldes mediante implosión por cavitación, drenar lípidos al sistema linfático y estimular la síntesis de colágeno para compactar el contorno corporal.',
    technology:
      'Ultracavitación de 40 kHz + Radiofrecuencia Multipolar Corporal + Vacumterapia Endodérmica de Presión Negativa',
    duration: '90 min',
    recommendedSessions: '8 a 12 sesiones (1 o 2 por semana)',
    recoveryTime: 'Inmediata (sin bajas, cortes ni anestesia)',
    isFeatured: true,
    image: '/media/model4-split.webp',
    benefits: [
      'Reducción medible en centímetros desde las primeras 3 sesiones',
      'Disolución de acúmulos grasos rebeldes resistentes a dietas y ejercicio',
      'Reafirmación dérmica simultánea para prevenir descolgamiento cutáneo',
      'Afinamiento estético de cintura, abdomen, flancos y espalda',
      'Procedimiento 100% ambulatorio, seguro y sin postoperatorio invasivo',
    ],
    targetConditions: [
      'Grasa localizada en abdomen alto y bajo',
      'Rollitos en flancos, cintura y espalda (sujetador)',
      'Cartucheras y cara interna de muslos',
      'Pérdida de silueta y volumen corporal tras cambios de peso',
      'Deseo de moldear el cuerpo sin pasar por quirófano',
    ],
    protocolSteps: [
      {
        step: '01',
        title: 'Mapeo Corporal Antropométrico',
        description: 'Toma de medidas, plicometría y delimitación con lápiz dérmico de las áreas diana.',
      },
      {
        step: '02',
        title: 'Ultracavitación de 40 kHz',
        description:
          'Emisión de ultrasonido focal de baja frecuencia para inducir la lisis de la membrana adipocitaria.',
      },
      {
        step: '03',
        title: 'Vacumterapia Endodérmica de Drenaje',
        description:
          'Masaje subdermo-terapéutico de succión pulsátil para canalizar lípidos hacia las cadenas ganglionares.',
      },
      {
        step: '04',
        title: 'Radiofrecuencia Multipolar Reafirmante',
        description:
          'Calentamiento profundo de la dermis para tensar las fibras colágenas y compactar la piel.',
      },
      {
        step: '05',
        title: 'Masaje Reductor con Principios Activos Lipolíticos',
        description:
          'Aplicación de geles térmicos de carnitina, cafeína y fucus para prolongar la acción reductora.',
      },
    ],
    aftercare: [
      'Beber de 2 a 2.5 litros de agua al día para facilitar la excreción renal de las grasas lisadas.',
      'Realizar 30 minutos de actividad cardiovascular moderada (caminar a paso ligero) el día de la sesión.',
      'Evitar azúcares refinados y alcohol durante las 48 horas posteriores.',
      'Mantener una faja reductora suave si así lo aconseja la especialista.',
    ],
    faqs: [
      {
        question: '¿Cuántos centímetros se pueden reducir con este protocolo?',
        answer:
          'El promedio habitual oscila entre 3 y 8 centímetros en el contorno abdominal a lo largo de un ciclo completo de 8 a 10 sesiones, dependiendo del metabolismo de cada paciente y sus hábitos de hidratación.',
      },
      {
        question: '¿La grasa eliminada vuelve a aparecer?',
        answer:
          'Los adipocitos destruidos por la cavitación no se regeneran. Sin embargo, para mantener los resultados es importante mantener un estilo de vida equilibrado para evitar que los adipocitos remanentes ganen volumen.',
      },
    ],
    whatsappText: makeWhatsAppUrl('Lipo Sin Cirugía Personalizada'),
  },

  {
    id: 'adios-celulitis-reafirmacion-glutea',
    name: 'Protocolo "Adiós Celulitis" & Reafirmación Glútea',
    shortName: 'Adiós Celulitis & Reafirmación',
    category: 'corporales',
    categoryLabel: 'Tratamientos Corporales & Silueta',
    tagline: 'Reestructuración del septo fibroso, drenaje de toxinas y elevación tisular glútea.',
    description:
      'Abordaje clínico tridimensional contra la celulitis edematosa, fibrótica y esclerótica. Integra masaje modelador con maderoterapia anatómica de grado clínico, vacumterapia drenante con copas de succión continua y radiofrecuencia focalizada. Rompe los tabiques fibrosos causantes de los hoyuelos, estimula la microcirculación capilar y promueve una compactación y levantamiento visual del músculo glúteo y muslos.',
    clinicalObjective:
      'Desorganizar los septos fibrosos verticales que aprisionan los lobulillos grasos, evacuar el estancamiento linfático intersticial y compactar la matriz dérmica para alisar la superficie cutánea.',
    technology:
      'Vacumterapia Focalizada + Radiofrecuencia Corporal Bipolar + Maderoterapia Anatómica + Crioterapia Activa',
    duration: '75 min',
    recommendedSessions: '8 a 10 sesiones continuas (2 por semana)',
    recoveryTime: 'Inmediata',
    isFeatured: true,
    image: '/media/model4-poster.webp',
    benefits: [
      'Alisamiento evidente de la piel de naranja y hoyuelos en glúteos y muslos',
      'Descongestión profunda de la retención hídrica y sensación de piernas ligeras',
      'Efecto lifting y moldeado visible del pliegue subglúteo',
      'Aumento de la elasticidad de la piel y tonificación muscular refleja',
      'Mejora de la circulación sanguínea venosa y aspecto general de la piel',
    ],
    targetConditions: [
      'Celulitis de grados I, II y III en glúteos y piernas',
      'Retención de líquidos persistente en muslos posteriores',
      'Flacidez y pérdida de firmeza en la zona glútea',
      'Hoyuelos visibles al sentarse o al estar de pie',
      'Piel con aspecto irregular o acartonado',
    ],
    protocolSteps: [
      {
        step: '01',
        title: 'Diagnóstico Celular & Termografía Palpatoria',
        description: 'Identificación del tipo de celulitis (dura, blanda o edematosa) y grado de fibrosis.',
      },
      {
        step: '02',
        title: 'Maderoterapia Anatómica de Estimulación',
        description:
          'Uso de copas suecas, rodillos de mazorca y tablas moldeadoras para activar hiperemia y romper nódulos.',
      },
      {
        step: '03',
        title: 'Vacumterapia Subdérmica Anti-Hoyuelos',
        description:
          'Descompresión mecánica de los tabiques conjuntivos para restaurar el flujo vascular intersticial.',
      },
      {
        step: '04',
        title: 'Radiofrecuencia Reafirmante Glútea',
        description:
          'Estímulo térmico de 41°C para contraer las fibras de elastina y generar soporte tisular firme.',
      },
      {
        step: '05',
        title: 'Crioterapia Reafirmante Final',
        description:
          'Envoltura fría con mentol y centella asiática para provocar vasoconstricción y sellado reafirmante.',
      },
    ],
    aftercare: [
      'Beber suficiente agua para evacuar los depósitos movilizados.',
      'Reducir el consumo de sal y alimentos ultraprocesados ricos en sodio.',
      'Complementar con sentadillas o caminatas para potenciar el tono glúteo.',
    ],
    faqs: [
      {
        question: '¿La maderoterapia o el tratamiento dejan moretones?',
        answer:
          'En MM Centro Estético trabajamos con maniobras terapéuticas precisas y controladas. No buscamos romper vasos sanguíneos, por lo que no deben quedar hematomas severos.',
      },
      {
        question: '¿En cuántas sesiones se nota el alisamiento de la celulitis?',
        answer:
          'Desde la 3ª o 4ª sesión se percibe una piel más lisa y compacta, con disminución visible de la hinchazón y mayor definición glútea.',
      },
    ],
    whatsappText: makeWhatsAppUrl('Protocolo Adiós Celulitis & Reafirmación Glútea'),
  },

  {
    id: 'depilacion-laser-diodo',
    name: 'Depilación Láser Diodo de Alta Densidad (Triple Onda)',
    shortName: 'Depilación Láser Diodo',
    category: 'corporales',
    categoryLabel: 'Tratamientos Corporales & Silueta',
    tagline: 'Eliminación progresiva definitiva del vello con cabezal criogénico indoloro a -5°C.',
    description:
      'Sistema láser de alta densidad y tecnología de triple longitud de onda simultánea (755nm Alexandrita, 808nm Diodo y 1064nm Nd:YAG) que destruye las células madre del folículo piloso en todas sus profundidades sin afectar la piel circundante. Su potente cabezal de enfriamiento continuo por contacto zafiro a -5°C asegura una sesión completamente confortable, segura e indolora incluso en fototipos morenos.',
    clinicalObjective:
      'Alcanzar la fototermólisis selectiva del folículo piloso en fase anágena mediante la absorción de melanina a múltiples profundidades dérmicas con crioprotección epidérmica activa.',
    technology:
      'Láser Diodo de Triple Longitud de Onda (755nm / 808nm / 1064nm) + Cabezal Criogénico Zafiro Ice a -5°C',
    duration: '15 a 60 min (según zona corporal)',
    recommendedSessions: '6 a 8 sesiones (intervalos de 4 a 6 semanas)',
    recoveryTime: 'Inmediata',
    isFeatured: false,
    image: '/media/model2-split.webp',
    benefits: [
      'Eliminación permanente del 85% al 95% del vello en la zona tratada',
      'Experiencia prácticamente indolora gracias a la anestesia criogénica de zafiro',
      'Solución médica definitiva contra la foliculitis y los vellos encarnados',
      'Piel infinitamente más suave, uniforme y libre de sombras oscuras',
      'Seguro y eficaz en todo tipo de fototipos cutáneos andinos durante todo el año',
    ],
    targetConditions: [
      'Vello corporal y facial no deseado (axilas, bikini, piernas, espalda, etc.)',
      'Foliculitis recurrente, granitos e irritación por afeitado o cera',
      'Sombras oscuras en axilas o área íntima provocadas por la raíz del vello',
      'Hirsutismo o crecimiento acelerado de vello',
    ],
    protocolSteps: [
      {
        step: '01',
        title: 'Revisión Fototípica & Rasurado Clínico',
        description: 'Evaluación del grosor del pelo y verificación de rasurado previo al ras de piel.',
      },
      {
        step: '02',
        title: 'Protección Ocular & Marcación de Cuadrantes',
        description: 'Colocación de gafas de protección láser específicas y delimitación blanca de la zona.',
      },
      {
        step: '03',
        title: 'Aplicación de Gel Óptico de Acople Frío',
        description: 'Gel conductor transparente que optimiza la penetración del haz de luz y enfría el tejido.',
      },
      {
        step: '04',
        title: 'Disparo Láser con Barrido Dinámico SHR',
        description:
          'Deslizamiento del cabezal a -5°C emitiendo ráfagas de alta repetición hasta alcanzar la dosis térmica folicular.',
      },
      {
        step: '05',
        title: 'Retiro de Gel & Emulsión Calmante con Aloe Puro',
        description: 'Limpieza suave y aplicación de gel reparador descongestivo.',
      },
    ],
    aftercare: [
      'No exponer la zona al sol directo durante 7 días y usar fotoprotector.',
      'No usar cera ni pinzas entre sesiones (únicamente afeitadora convencional).',
      'Evitar duchas de agua muy caliente y saunas las primeras 24 horas.',
      'Hidratar la piel diariamente con crema corporal neutra.',
    ],
    faqs: [
      {
        question: '¿Duele la depilación láser de diodo con cabezal de zafiro?',
        answer:
          'No, la tecnología de punta con cabezal zafiro a -5°C enfría la piel al instante antes y durante cada disparo, convirtiendo el tratamiento en una experiencia muy cómoda sin los dolorosos pellizcos de los láseres antiguos.',
      },
      {
        question: '¿Puedo depilarme si tengo piel morena?',
        answer:
          'Totalmente. Al incorporar la longitud de onda de 1064nm (Nd:YAG), nuestro equipo es sumamente seguro para fototipos oscuros sin riesgo de manchas ni quemaduras.',
      },
    ],
    whatsappText: makeWhatsAppUrl('Depilación Láser Diodo de Alta Densidad'),
  },

  {
    id: 'reafirmante-corporal-antiestrias',
    name: 'Protocolo Reafirmante Corporal & Antiestrías',
    shortName: 'Reafirmante Corporal & Antiestrías',
    category: 'corporales',
    categoryLabel: 'Tratamientos Corporales & Silueta',
    tagline: 'Reconstrucción de la matriz dérmica y regeneración profunda de fibras elásticas.',
    description:
      'Tratamiento intensivo formulado para combatir la laxitud tisular y el deterioro dérmico derivado de cambios de peso, embarazos o envejecimiento cronológico. Asocia corrientes rusas e interferenciales de electro-tonificación con radiofrecuencia profunda y dermo-infusión de principios activos bio-reestructurantes (silicio orgánico, centella asiática y colágeno hidrolizado) para devolver firmeza y atenuar estrías nacientes y consolidadas.',
    clinicalObjective:
      'Reorganizar la arquitectura del tejido conectivo, estimular los fibroblastos atróficos y mejorar la microcirculación vascular en zonas con flacidez o estrías distensas.',
    technology:
      'Radiofrecuencia Reafirmante Capacitiva + Electroestimulación Tisular (Corrientes Rusas) + Principios Activos Liposomados',
    duration: '70 min',
    recommendedSessions: '8 a 10 sesiones',
    recoveryTime: 'Inmediata',
    isFeatured: false,
    image: '/media/model4-split.webp',
    benefits: [
      'Recuperación progresiva del tono y consistencia dérmica en abdomen y brazos',
      'Atenuación visual y alisamiento de estrías rojas y blanquecinas',
      'Engrosamiento de la piel atrófica o adelgazada',
      'Estimulación del tono muscular subyacente mediante electroterapia',
      'Piel notablemente más compacta, elástica y aterciopelada al tacto',
    ],
    targetConditions: [
      'Flacidez en abdomen tras pérdidas bruscas de peso',
      'Flacidez en la cara interna de brazos (efecto ala de murciélago)',
      'Estrías de distensión en caderas, glúteos o abdomen',
      'Laxitud en cara interna de muslos y rodillas',
    ],
    protocolSteps: [
      {
        step: '01',
        title: 'Exfoliación Médica con Gránulos de Sílice',
        description: 'Retiro del estrato córneo para potenciar la permeabilidad dérmica.',
      },
      {
        step: '02',
        title: 'Electroestimulación Tisular Reafirmante',
        description: 'Colocación de electrodos para inducir contracciones musculares tónicas y mejorar el soporte.',
      },
      {
        step: '03',
        title: 'Radiofrecuencia de Colágeno Dérmico',
        description: 'Aplicación térmica profunda para contraer las fibras de elastina y redensificar la matriz.',
      },
      {
        step: '04',
        title: 'Micro-Infusión de Silicio Orgánico & Centella',
        description: 'Masaje reactivador con principios activos regeneradores de la matriz extracelular.',
      },
      {
        step: '05',
        title: 'Sellado Tensor Hidronutritivo',
        description: 'Emulsión reafirmante rica en péptidos y ácido hialurónico.',
      },
    ],
    aftercare: [
      'Aplicar la crema reafirmante domiciliaria recomendada por la especialista dos veces al día.',
      'Mantener consumo regular de fuentes de vitamina C y proteína magra.',
      'Evitar aumentos o disminuciones abruptas de peso corporal.',
    ],
    faqs: [
      {
        question: '¿Se pueden eliminar completamente las estrías blancas?',
        answer:
          'Las estrías blancas son tejido cicatricial consolidado; no desaparecen al 100%, pero con este protocolo logramos atenuar notablemente su profundidad, grosor y relieve, unificándolas con la piel circundante.',
      },
      {
        question: '¿Se puede aplicar en brazos?',
        answer:
          'Sí, es uno de los tratamientos estrella para la flacidez en la cara interna de los brazos gracias a la combinación de radiofrecuencia y electroterapia.',
      },
    ],
    whatsappText: makeWhatsAppUrl('Protocolo Reafirmante Corporal & Antiestrías'),
  },

  // ==========================================
  // 3. CUIDADOS POST-QUIRÚRGICOS & TERAPÉUTICOS
  // ==========================================
  {
    id: 'drenaje-linfatico-manual',
    name: 'Drenaje Linfático Manual Especializado (Método Vodder)',
    shortName: 'Drenaje Linfático Manual',
    category: 'post-quirurgicos',
    categoryLabel: 'Cuidados Post-Quirúrgicos & Terapéuticos',
    tagline: 'Técnica kinesiológica manual precisa para desinflamar, evacuar edemas y acelerar la recuperación.',
    description:
      'Pilar imprescindible en el postoperatorio de cirugías plásticas (lipoescultura, abdominoplastia, mamoplastia, rinoplastia). Ejecutado bajo el estricto protocolo de Vodder con maniobras lentas, rítmicas y milimétricamente orientadas a los cuadrantes ganglionares linfáticos. Facilita la evacuación de líquidos anestésicos retenidos, alivia el dolor inflamatorio, previene equimosis y ayuda al tejido a cicatrizar en tiempo récord.',
    clinicalObjective:
      'Favorecer la reabsorción del líquido intersticial y macromoléculas retenidas en el espacio extracelular post-quirúrgico, estimular el peristaltismo linfangiónico y reducir el edema sin generar tracción nociva.',
    technology:
      'Terapia Manual Especializada Método Vodder + Drenaje Linfodinámico Posicional + Vendaje Compresivo Terapéutico',
    duration: '60 - 75 min',
    recommendedSessions: '10 a 20 sesiones (según prescripción del cirujano plástico)',
    recoveryTime: 'Inmediata (alivio y ligereza instantáneos)',
    isFeatured: true,
    image: '/media/clinic-space.webp',
    benefits: [
      'Disminución drástica del dolor, la inflamación y la sensación de tirantez',
      'Aceleración de la reabsorción de hematomas y líquidos infiltrados',
      'Prevención fundamental contra el desarrollo de fibrosis y adherencias quirúrgicas',
      'Mejora de la oxigenación celular y la velocidad de cicatrización cutánea',
      'Atención personalizada de Mónica Mejía con criterio clínico y empatía absoluta',
    ],
    targetConditions: [
      'Postoperatorio de liposucción, lipo vaser o marcación abdominal',
      'Postoperatorio de abdominoplastia o dermolipectomía',
      'Postoperatorio de aumento, reducción o pexia mamaria',
      'Postoperatorio de rinoplastia, blefaroplastia o lifting facial',
      'Edemas crónicos o pesadez circulatoria generalizada',
    ],
    protocolSteps: [
      {
        step: '01',
        title: 'Evaluación Clínica Postoperatoria',
        description: 'Revisión del estado de heridas quirúrgicas, faja postoperatoria y evolución de hematomas.',
      },
      {
        step: '02',
        title: 'Apertura de Estaciones Ganglionares',
        description:
          'Bombeos manuales suaves en fosas supraclaviculares, ganglios axilares, retroauriculares e inguinales.',
      },
      {
        step: '03',
        title: 'Maniobras Especializadas Vodder',
        description:
          'Círculos fijos, pases de llamada y movimientos rotatorios de presión muy suave (menos de 40 mmHg).',
      },
      {
        step: '04',
        title: 'Descongestión Posicional & Drenaje Asistido',
        description: 'Canalización del fluido linfático hacia las áreas de drenaje activas no afectadas.',
      },
      {
        step: '05',
        title: 'Acomodación de Faja Quirúrgica & Tablas Anatómicas',
        description: 'Colocación adecuada de prendas de compresión para evitar pliegues sobre la piel.',
      },
    ],
    aftercare: [
      'Usar la faja postoperatoria según el tiempo indicado por su médico cirujano.',
      'Mantener reposo relativo y caminar suavemente dentro de casa.',
      'Cuidar las apósitos y no mojar las incisiones sin autorización médica.',
      'Evitar alimentos inflamatorios o con alto contenido de sodio.',
    ],
    faqs: [
      {
        question: '¿Cuándo debo empezar con los drenajes postoperatorios?',
        answer:
          'Generalmente entre las 48 y 72 horas posteriores a la cirugía, siempre con la indicación y autorización expresa de su cirujano plástico.',
      },
      {
        question: '¿El drenaje linfático debe doler?',
        answer:
          '¡De ninguna manera! El verdadero drenaje linfático Vodder es sumamente suave y superficial. No debe causar dolor ni presiones bruscas; de hecho, produce un profundo alivio y relajación del dolor post-quirúrgico.',
      },
    ],
    whatsappText: makeWhatsAppUrl('Drenaje Linfático Manual Especializado'),
  },

  {
    id: 'ultrasonido-terapeutico-anti-fibrosis',
    name: 'Ultrasonido Terapéutico Anti-Fibrosis',
    shortName: 'Ultrasonido Anti-Fibrosis',
    category: 'post-quirurgicos',
    categoryLabel: 'Cuidados Post-Quirúrgicos & Terapéuticos',
    tagline: 'Ondas mecánicas atérmicas para disolver nódulos y prevenir fibrosis cicatricial interna.',
    description:
      'Aplicación de ultrasonido médico a 1 y 3 MHz con acción de micro-masaje celular profundo. Ablanda y flexibiliza el tejido cicatricial que tiende a desorganizarse y endurecerse tras cirugías invasivas como la liposucción, evitando la formación de cordones fibróticos o hendiduras en la piel. Facilita la permeabilidad de las membranas celulares, optimiza la absorción de seromas y asegura un resultado post-quirúrgico liso y uniforme.',
    clinicalObjective:
      'Generar un efecto piezoeléctrico micromecánico que desorganice los enlaces de colágeno desordenado (fibrosis), reactive la circulación tisular y favorezca la resolución de seromas residuales.',
    technology:
      'Ultrasonido Terapéutico Continuo y Pulsátil de 1/3 MHz con Transductor Quirúrgico de Alta Precisión',
    duration: '45 min',
    recommendedSessions: '6 a 12 sesiones (iniciando tras la fase aguda postoperatoria)',
    recoveryTime: 'Inmediata',
    isFeatured: false,
    image: '/media/clinic-space.webp',
    benefits: [
      'Prevención activa y ablandamiento de la fibrosis post-quirúrgica',
      'Desaparición de nódulos endurecidos debajo de la piel',
      'Reabsorción acelerada de colecciones líquidas y seromas',
      'Sensación de distensión y elasticidad en la pared abdominal',
      'Resultado quirúrgico con acabado liso, uniforme y simétrico',
    ],
    targetConditions: [
      'Endurecimiento o empastamiento tisular tras lipoescultura',
      'Fibrosis quirúrgica inicial o establecida',
      'Seromas postoperatorios en fase de resolución',
      'Zonas con tirantez excesiva o fibrosis cicatricial',
    ],
    protocolSteps: [
      {
        step: '01',
        title: 'Palpación & Diagnóstico de Zonas Induradas',
        description: 'Mapeo táctil para localizar nódulos, cordones de fibrosis o retención localizada.',
      },
      {
        step: '02',
        title: 'Aplicación de Gel Médico Osmótico',
        description: 'Gel conductor hipoalergénico formulado para la transmisión de ondas acústicas.',
      },
      {
        step: '03',
        title: 'Emisión de Ultrasonido Pulsátil Selectivo',
        description:
          'Movimientos lentos y circulares con el cabezal calibrado para degradar el colágeno desordenado.',
      },
      {
        step: '04',
        title: 'Maniobras Manuales Miofasciales Desfibrosantes',
        description: 'Presiones digitales suaves para despegar planos tisulares adheridos.',
      },
      {
        step: '05',
        title: 'Re-alineación con Faja Anatómica',
        description: 'Verificación del acomodo de la faja para evitar la formación de nuevos pliegues.',
      },
    ],
    aftercare: [
      'Mantener uso continuo de la tabla compresiva recomendada.',
      'No masajearse bruscamente en casa sin supervisión profesional.',
      'Asistir puntualmente a las sesiones pautadas para evitar que la fibrosis se consolide.',
    ],
    faqs: [
      {
        question: '¿Cuándo se debe incorporar el ultrasonido a los drenajes?',
        answer:
          'Generalmente a partir del día 8 a 12 post-cirugía, cuando la fase inflamatoria aguda inicial ha cedido y comienza el período de formación cicatricial interna.',
      },
      {
        question: '¿Es normal sentir calor durante el ultrasonido?',
        answer:
          'En el postoperatorio se utiliza en modo pulsátil con baja intensidad térmica para evitar calentar el tejido inflamado. Se percibe como un suave y cómodo masaje.',
      },
    ],
    whatsappText: makeWhatsAppUrl('Ultrasonido Terapéutico Anti-Fibrosis'),
  },

  {
    id: 'presoterapia-secuencial-medica',
    name: 'Presoterapia Secuencial de Grado Médico',
    shortName: 'Presoterapia de Grado Médico',
    category: 'post-quirurgicos',
    categoryLabel: 'Cuidados Post-Quirúrgicos & Terapéuticos',
    tagline: 'Compresión neumática multicámara para reactivar el retorno venoso y linfático profundo.',
    description:
      'Sistema terapéutico computarizado con botas y fajas inflables multicámara que aplican ondas de presión de gradiente ascendente y continuo. Emula la acción fisiológica del bombeo muscular venoso y linfático, impulsando masivamente la linfa desde las extremidades hacia el torso. Es un coadyuvante inestimable en la fase intermedia postoperatoria para drenar piernas hinchadas, eliminar toxinas y reactivar la circulación.',
    clinicalObjective:
      'Incrementar la velocidad del flujo sanguíneo venoso y linfático, disminuir la presión hidrostática capilar y eliminar el exceso de fluido intersticial acumulado por inmovilidad o cirugía.',
    technology:
      'Equipo de Presoterapia Secuencial Digital de 12 Cámaras Superpuestas con Presión Neumática Graduada',
    duration: '45 min',
    recommendedSessions: '1 o 2 sesiones semanales (o en combo post-quirúrgico)',
    recoveryTime: 'Inmediata',
    isFeatured: false,
    image: '/media/model3-split.webp',
    benefits: [
      'Reactivación circulatoria venosa y desinflamación profunda de piernas y pies',
      'Alivio instantáneo de la sensación de pesadez, adormecimiento y cansancio',
      'Complemento de máxima eficacia para acelerar el vaciamiento de toxinas',
      'Prevención de estasis venosa tras reposo prolongado por cirugía',
      'Sensación reconfortante de masaje envolvente y relajación generalizada',
    ],
    targetConditions: [
      'Retención de líquidos post-quirúrgica en miembros inferiores',
      'Piernas pesadas, edematosas o con hinchazón vespertina',
      'Insuficiencia venosa funcional leve',
      'Coadyuvante post-parto y en tratamientos modeladores corporales',
    ],
    protocolSteps: [
      {
        step: '01',
        title: 'Calibración Personalizada de Presión',
        description: 'Ajuste milimétrico de los mmHg según el estado circulatorio y postoperatorio del paciente.',
      },
      {
        step: '02',
        title: 'Colocación de Fundas Higiénicas Estériles',
        description: 'Protección desechable sobre piernas y abdomen para total bioseguridad.',
      },
      {
        step: '03',
        title: 'Ciclo Neumático Secuencial Ascendente',
        description:
          'Inflado por cámaras solapadas desde la planta del pie, pantorrillas, muslos y abdomen.',
      },
      {
        step: '04',
        title: 'Fase de Sostenimiento & Descompresión Gradual',
        description: 'Pausa de absorción fisiológica y vaciado controlado para evitar reflujo circulatorio.',
      },
      {
        step: '05',
        title: 'Desconexión & Masaje de Cierre con Gel Frío',
        description: 'Aplicación rápida de gel descongestionante con rusco y castaño de indias.',
      },
    ],
    aftercare: [
      'Orinar inmediatamente después de la sesión para expulsar líquidos movilizados.',
      'Mantenerse bien hidratado con agua natural.',
      'Evitar cruzar las piernas al sentarse para favorecer el retorno venoso.',
    ],
    faqs: [
      {
        question: '¿Puedo usar presoterapia si tengo marcapasos o trombosis activa?',
        answer:
          'No. La presoterapia está contraindicada en pacientes con trombosis venosa profunda activa, infecciones agudas o problemas cardíacos graves no controlados. En MM Centro Estético evaluamos previamente a cada paciente.',
      },
      {
        question: '¿Qué se siente dentro del traje de presoterapia?',
        answer:
          'Es una sensación muy agradable y relajante de compresión y descompresión rítmica, similar a un suave abrazo que masajea las piernas de abajo hacia arriba.',
      },
    ],
    whatsappText: makeWhatsAppUrl('Presoterapia Secuencial de Grado Médico'),
  },

  {
    id: 'protocolo-post-parto-recuperacion',
    name: 'Protocolo Post-Parto de Recuperación Abdominal',
    shortName: 'Protocolo Post-Parto',
    category: 'post-quirurgicos',
    categoryLabel: 'Cuidados Post-Quirúrgicos & Terapéuticos',
    tagline: 'Rehabilitación respetuosa de la faja abdominal, suelo pélvico y retracción cutánea.',
    description:
      'Programa integral y amoroso de cuidado dérmico y miofascial diseñado para madres a partir de las 6 a 8 semanas post-parto (o con alta del ginecólogo). Integra drenaje linfático para desinflamar la retención hormonal, radiofrecuencia no ablativa para favorecer la retracción de la piel distendida y maniobras suaves para acompañar el cierre fisiológico de la diástasis abdominal respetando al 100% el período de lactancia materna.',
    clinicalObjective:
      'Estimular la síntesis de nuevas fibras colágenas para compactar la piel abdominal flácida post-gestacional, evacuar la retención edematosa y brindar confort tisular en la zona lumbar y pélvica.',
    technology:
      'Drenaje Linfático Suave + Radiofrecuencia de Baja Temperatura + Masaje Miofascial Reafirmante',
    duration: '75 min',
    recommendedSessions: '8 a 12 sesiones progresivas',
    recoveryTime: 'Inmediata',
    isFeatured: false,
    image: '/media/model4-split.webp',
    benefits: [
      'Estimulación de la retracción biológica de la piel abdominal',
      'Descongestión profunda de líquidos y desinflamación hormonal',
      'Atenuación visual de estrías rosadas recientes y cicatriz de cesárea',
      'Acompañamiento seguro, libre de fármacos o químicos incompatibles con la lactancia',
      'Espacio sagrado de calma, autocuidado y bienestar para la madre en Cuenca',
    ],
    targetConditions: [
      'Flacidez y exceso de piel en vientre post-embarazo',
      'Laxitud en faja abdominal y cintura',
      'Cicatriz de cesárea en fase madura de recuperación',
      'Retención de líquidos persistente post-parto',
    ],
    protocolSteps: [
      {
        step: '01',
        title: 'Evaluación de Diástasis & Estado Tisular',
        description: 'Chequeo palpatorio del tono muscular abdominal y del estado de la piel post-gestacional.',
      },
      {
        step: '02',
        title: 'Drenaje Linfático Descongestivo de Tronco',
        description: 'Maniobras para drenar edema hormonal hacia ganglios linfáticos activos.',
      },
      {
        step: '03',
        title: 'Radiofrecuencia Reafirmante a Temperatura Segura',
        description: 'Emisión térmica moderada para activar colágeno sin generar molestias.',
      },
      {
        step: '04',
        title: 'Masaje Miofascial de Conexión Lumbar',
        description: 'Alivio de tensiones en espalda baja por posturas de lactancia y carga del bebé.',
      },
      {
        step: '05',
        title: 'Cuidado Oclusivo Regenerador con Rosa Mosqueta Pura',
        description: 'Nutrición con aceites biocompatibles para regenerar estrías y cicatrices.',
      },
    ],
    aftercare: [
      'Mantenerse muy bien hidratada para cuidar la producción láctea y la elasticidad cutánea.',
      'Complementar con ejercicios de respiración diafragmática e hipopresivos bajo guía médica.',
      'Aplicar la crema nutritiva recomendada tras el baño diario.',
    ],
    faqs: [
      {
        question: '¿Cuándo puedo comenzar este tratamiento tras dar a luz?',
        answer:
          'En parto natural a partir de la 6ª semana; en cesárea a partir de la 8ª a 10ª semana, siempre con la confirmación de alta médica de tu ginecólogo de confianza.',
      },
      {
        question: '¿Afecta la lactancia materna?',
        answer:
          'No interfiere en absoluto. No utilizamos principios activos sistémicos ni fármacos que pasen a la leche materna; es un abordaje puramente físico y dermo-cosmético seguro.',
      },
    ],
    whatsappText: makeWhatsAppUrl('Protocolo Post-Parto de Recuperación Abdominal'),
  },

  // ==========================================
  // 4. ESTÉTICA DE LA MIRADA & LABIOS
  // ==========================================
  {
    id: 'hidralips-infusion-labial',
    name: 'Hidralips (Micro-Infusión de Ácido Hialurónico Labial)',
    shortName: 'Hidralips Infusión Labial',
    category: 'mirada-labios',
    categoryLabel: 'Estética de la Mirada & Labios',
    tagline: 'Nutrición profunda, bio-regeneración labial y brillo natural efecto volumen sin agujas de relleno.',
    description:
      'Tratamiento dermocosmético no invasivo de regeneración de la mucosa labial. Mediante nanoneedling estéril e indoloro, se exfolian suavemente las células queratinizadas y pellejitos secos provocados por el clima andino de Cuenca, para luego infundir un suero biocompatible de ácido hialurónico molecular, pantenol y vitaminas. Devuelve a los labios su tono sonrosado natural, atenúa el código de barras y aporta una hidratación extrema con sutil efecto turgente.',
    clinicalObjective:
      'Restaurar la barrera hidrolipídica de la semimucosa labial, estimular la síntesis de glucosaminoglicanos y eliminar fisuras mediante nano-infusión no inyectable de ácido hialurónico de alto y bajo peso molecular.',
    technology:
      'Dermapen con Nano-Cartucho Estéril de Contacto + Ácido Hialurónico Multimolecular Puro + Bálsamo Oclusivo Reparador',
    duration: '45 min',
    recommendedSessions: '3 sesiones (cada 15 a 20 días) para resultados de hasta 6 meses',
    recoveryTime: 'Inmediata',
    isFeatured: true,
    image: '/media/pill-freckles.webp',
    benefits: [
      'Labios profundamente hidratados, jugosos y libres de grietas o sequedad',
      'Restauración del tono rosado natural y luminosidad de la mucosa labial',
      'Efecto visual de labios carnosos y turgentes por hidratación hídrica (plump)',
      'Suavizado del contorno labial y disminución del código de barras fino',
      'Procedimiento 100% indoloro, relajante y libre de agujas inyectables',
    ],
    targetConditions: [
      'Labios agrietados, resecos o con pellejitos por el clima seco y frío',
      'Pérdida de color y vitalidad en la mucosa labial (labios pálidos)',
      'Finas arruguitas en el borde bermellón',
      'Deseo de labios jugosos sin recurrir a rellenos inyectables permanentes',
    ],
    protocolSteps: [
      {
        step: '01',
        title: 'Exfoliación Suave con Enzimas Fito-Labiales',
        description: 'Gommage delicado para remover pieles secas sin sangrado ni agresión.',
      },
      {
        step: '02',
        title: 'Nano-Infusión con Ácido Hialurónico Puro',
        description:
          'Micropasadas con nanoagujas que no penetran vasos, introduciendo moléculas hidratantes en la mucosa.',
      },
      {
        step: '03',
        title: 'Masaje de Turgencia con Vitaminas & Pantenol',
        description: 'Maniobras circulares para favorecer la fijación de la red hídrica en los labios.',
      },
      {
        step: '04',
        title: 'Parche Hidrogel Labial Criogénico',
        description: 'Colocación de máscara de colágeno frío para sellar los activos y aportar frescura.',
      },
      {
        step: '05',
        title: 'Bálsamo Sellador con FPS & Efecto Gloss',
        description: 'Emulsión nutritiva con manteca de karité, vitamina E y filtro UV.',
      },
    ],
    aftercare: [
      'No morderse los labios ni arrancar pielecitas.',
      'Aplicar bálsamo hidratante varias veces al día durante las 2 semanas siguientes.',
      'Evitar comer alimentos excesivamente picantes o muy calientes las primeras 12 horas.',
    ],
    faqs: [
      {
        question: '¿Hidralips aumenta el tamaño de los labios?',
        answer:
          'No es un relleno de ácido hialurónico reticulado con aguja. El ligero aumento de volumen que se aprecia se debe a la turgencia e hidratación profunda de las células labiales, brindando un aspecto naturalmente carnoso y juvenil.',
      },
      {
        question: '¿Duele o sangra?',
        answer:
          'No. Al utilizar nano-cartuchos no ablativo, no hay dolor, agujas ni sangrado; es un tratamiento sumamente cómodo.',
      },
    ],
    whatsappText: makeWhatsAppUrl('Hidralips (Micro-Infusión Labial)'),
  },

  {
    id: 'lifting-laminado-pestanas-botox',
    name: 'Lifting & Laminado de Pestañas con Lash Botox',
    shortName: 'Lifting de Pestañas con Lash Botox',
    category: 'mirada-labios',
    categoryLabel: 'Estética de la Mirada & Labios',
    tagline: 'Curvatura perfecta, alargamiento óptico y nutrición con queratina y aminoácidos.',
    description:
      'Elevación milimétrica y natural de las pestañas naturales desde la raíz, logrando un efecto visual de mayor longitud, espesor y curvatura sin recurrir a pestañas postizas ni extensiones. Incluye tinte negro intenso de grado oftalmológico y un baño enriquecido de "Lash Botox" (queratina hidrolizada, pantenol y aceites esenciales) que nutre la fibra capilar, estimula su crecimiento y sella la cutícula.',
    clinicalObjective:
      'Modificar los puentes de disulfuro de la queratina de la pestaña natural para elevarla y curvarla desde la raíz, remineralizándola con péptidos y pigmento mineral oftalmológico.',
    technology:
      'Moldes Siliconados Anatómicos + Fórmulas Suaves Sin Amoníaco + Queratina Pura Lash Botox Clínico',
    duration: '60 min',
    recommendedSessions: '1 sesión cada 6 a 8 semanas (según ciclo de renovación natural)',
    recoveryTime: 'Inmediata (evitar agua en las primeras 24 horas)',
    isFeatured: true,
    image: '/media/pill-eyes.webp',
    benefits: [
      'Mirada abierta, despierta e impactante desde el primer segundo',
      'Curvatura perfecta y efecto rímel intacto las 24 horas del día',
      'Nutrición profunda con queratina pura que fortalece y engrosa la pestaña propia',
      'Cero mantenimiento engorroso ni caídas accidentales de postizas',
      'Totalmente compatible con natación, sauna y deporte tras 24 horas',
    ],
    targetConditions: [
      'Pestañas rectas, caídas o de difícil curvatura con encrespador',
      'Deseo de mirada radiante sin necesidad de maquillaje diario',
      'Alergias o incompatibilidad con adhesivos de pestañas postizas',
      'Pestañas debilitadas por uso excesivo de rímel o químicos agresivos',
    ],
    protocolSteps: [
      {
        step: '01',
        title: 'Limpieza Oftalmológica & Desengrase',
        description: 'Retiro de oleosidad en pestañas y colocación de parches de colágeno protectores.',
      },
      {
        step: '02',
        title: 'Adhesión al Molde de Silicona Curvado',
        description:
          'Peinado milimétrico pestaña por pestaña sobre la curvatura de silicona con adhesivo soluble.',
      },
      {
        step: '03',
        title: 'Aplicación de Loción de Curvatura',
        description: 'Fórmula suave que abre los puentes de queratina durante el tiempo exacto.',
      },
      {
        step: '04',
        title: 'Fijación & Tinte Negro Intenso',
        description: 'Neutralización de la forma y pigmentación profunda para efecto máscara de pestañas.',
      },
      {
        step: '05',
        title: 'Baño Nutritivo Lash Botox',
        description: 'Infusión oclusiva de queratina hidrolizada, colágeno y vitaminas que sella la cutícula.',
      },
    ],
    aftercare: [
      'No mojar las pestañas ni aplicar vapor o maquillaje durante las primeras 24 horas.',
      'Peinar suavemente las pestañas hacia arriba con el cepillito entregado.',
      'Dormir boca arriba la primera noche para evitar aplastar la curvatura mientras se consolida.',
    ],
    faqs: [
      {
        question: '¿Daña mis pestañas naturales este tratamiento?',
        answer:
          'No, a diferencia de tratamientos antiguos, nuestras fórmulas están libres de químicos agresivos e incorporan Lash Botox con queratina que realmente nutre y fortalece la estructura capilar.',
      },
      {
        question: '¿Cuánto tiempo dura el efecto?',
        answer:
          'Entre 6 y 8 semanas, dependiendo del ritmo natural de recambio de tus pestañas.',
      },
    ],
    whatsappText: makeWhatsAppUrl('Lifting & Laminado de Pestañas con Lash Botox'),
  },

  {
    id: 'diseno-perfilado-cejas-organicas',
    name: 'Diseño, Perfilado & Pigmentación Orgánica de Cejas (Visagismo)',
    shortName: 'Diseño & Perfilado de Cejas',
    category: 'mirada-labios',
    categoryLabel: 'Estética de la Mirada & Labios',
    tagline: 'Arquitectura de cejas según la fisonomía facial con tintes botánicos de alta definición.',
    description:
      'Estudio antropométrico y visagismo facial para estructurar el arco, grosor y longitud óptimos de tus cejas en perfecta armonía con tu estructura ósea. Incluye depilación precisa con pinzas esterilizadas o hilo orgánico, laminado disciplinante de vellos rebeldes y aplicación de pigmentos orgánicos semipermanentes con base en henna botánica o tinte híbrido de fijación dérmica suave.',
    clinicalObjective:
      'Mapear las proporciones áureas faciales para diseñar un marco de cejas simétrico y personalizado, ordenando la dirección de los vellos y cubriendo claros con tinte botánico biocompatible.',
    technology:
      'Calibrador Vernier de Visagismo + Hilo Orgánico / Pinza Quirúrgica + Pigmentación Botánica Híbrida',
    duration: '50 min',
    recommendedSessions: 'Mantenimiento cada 3 a 4 semanas',
    recoveryTime: 'Inmediata',
    isFeatured: false,
    image: '/media/split.webp',
    benefits: [
      'Armonización y simetría facial milimétrica que resalta tu fisonomía',
      'Definición limpia del arco sin dolor excesivo ni agresión a los párpados',
      'Relleno de claros y sensación de cejas más pobladas y ordenadas',
      'Pigmentación botánica segura, libre de químicos tóxicos o tonos anaranjados',
      'Ahorro significativo de tiempo en tu rutina matutina de maquillaje',
    ],
    targetConditions: [
      'Cejas rebeldes, asimétricas o despeinadas',
      'Espacios despoblados o falta de densidad en la colita de la ceja',
      'Deseo de marco definido sin someterse a microblading permanente',
      'Mantenimiento regular de visagismo facial',
    ],
    protocolSteps: [
      {
        step: '01',
        title: 'Mapeo Facial con Calibrador Áureo',
        description: 'Trazado de puntos de inicio, arco más alto y cola de la ceja con hilo pigmentado.',
      },
      {
        step: '02',
        title: 'Aprobación del Diseño con el Paciente',
        description: 'Visualización conjunta en el espejo del diseño propuesto antes de retirar vellos.',
      },
      {
        step: '03',
        title: 'Depilación & Perfilado de Alta Precisión',
        description: 'Extracción folicular milimétrica con pinza desinfectada e hilo orgánico sin estirar la piel.',
      },
      {
        step: '04',
        title: 'Pigmentación Orgánica Híbrida',
        description: 'Pincelado del tinte botánico con degradé en el inicio de la ceja para acabado natural.',
      },
      {
        step: '05',
        title: 'Fijación & Cepillado con Suero Reestructurante',
        description: 'Sellado con aceite de ricino orgánico y peinado disciplinante.',
      },
    ],
    aftercare: [
      'No frotar con jabones fuertes ni exfoliantes sobre las cejas.',
      'Evitar mojarlas con agua caliente durante las primeras 12 horas para prolongar el pigmento en piel.',
    ],
    faqs: [
      {
        question: '¿El tinte orgánico se volverá de color rojo o anaranjado?',
        answer:
          'No. Usamos pigmentos orgánicos híbridos de alta estabilidad que desvanecen gradualmente en su tono original sin virar a colores indeseados.',
      },
      {
        question: '¿Cuánto dura la pigmentación?',
        answer:
          'En la piel dura entre 7 y 12 días (según tu tipo de piel, seca o grasa) y en el vello de la ceja permanece hasta 4 semanas.',
      },
    ],
    whatsappText: makeWhatsAppUrl('Diseño, Perfilado & Pigmentación Orgánica de Cejas'),
  },

  {
    id: 'protocolo-peri-orbital-ojeras-bolsas',
    name: 'Protocolo Peri-Orbital Anti-Ojeras & Bolsas',
    shortName: 'Protocolo Anti-Ojeras & Bolsas',
    category: 'mirada-labios',
    categoryLabel: 'Estética de la Mirada & Labios',
    tagline: 'Drenaje micro-circulatorio, aclarado de pigmento vascular y alisado de finas líneas perioculares.',
    description:
      'Tratamiento altamente específico formulado para la zona más delgada y frágil del rostro: el contorno periocular. Sincroniza drenaje linfático suave con presoterapia ocular o microcorrientes estimulantes, infusiones de péptidos tensores, cafeína vectorizada y ácido tranexámico. Descongestiona bolsas edematosas matutinas, atenúa la tonalidad violácea o marrón de las ojeras y revitaliza la mirada fatigada.',
    clinicalObjective:
      'Drenar el edema estancado en el cojinete periocular, activar la microcirculación capilar y aclarar depósitos pigmentarios y hemosiderina para devolver frescura y brillo a la mirada.',
    technology:
      'Microcorrientes Drenantes + Crioterapia Descongestiva + Cóctel Despigmentante Peri-Orbital con Ácido Tranexámico',
    duration: '50 min',
    recommendedSessions: '4 a 6 sesiones (1 por semana)',
    recoveryTime: 'Inmediata',
    isFeatured: false,
    image: '/media/pill-eyes.webp',
    benefits: [
      'Desinflamación visible de bolsas y retención líquida en párpados inferiores',
      'Aclarado progresivo de ojeras vasculares (azuladas) y pigmentarias (marrones)',
      'Atenuación de líneas de expresión (patas de gallo) y textura apergaminada',
      'Efecto mirada fresca, descansada y luminosa al instante',
      'Procedimiento sumamente suave, seguro e indoloro para ojos sensibles',
    ],
    targetConditions: [
      'Ojeras pigmentadas u oscuras por fatiga y mala microcirculación',
      'Bolsas perioculares edematosas matutinas',
      'Piel apergaminada y arruguitas en el párpado inferior',
      'Mirada cansada, pesada o con signos de estrés digital frente a pantallas',
    ],
    protocolSteps: [
      {
        step: '01',
        title: 'Desmaquillado Bifásico & Descongestión',
        description: 'Limpieza ultra-suave con tónico de aciano y manzanilla calmante.',
      },
      {
        step: '02',
        title: 'Drenaje Linfático Manual Periocular',
        description:
          'Bombeos suaves desde el lagrimal hacia las sienes y ganglios parotídeos para desocupar la bolsa.',
      },
      {
        step: '03',
        title: 'Dermo-Infusión de Cafeína & Ácido Tranexámico',
        description:
          'Penetración de suero descongestivo con rodillo micro-magnético atérmico.',
      },
      {
        step: '04',
        title: 'Crioterapia Periocular con Esferas Heladas',
        description:
          'Masaje refrescante con cryo-globes de vidrio que activan la vasoconstricción y tonifican la piel.',
      },
      {
        step: '05',
        title: 'Parches de Hidrogel & Sellado Antioxidante',
        description:
          'Compresión fría de 15 minutos con péptidos y crema final con pigmentos correctores minerales.',
      },
    ],
    aftercare: [
      'Dormir con la cabeza ligeramente elevada para favorecer el drenaje nocturno.',
      'Evitar el exceso de sal en las cenas.',
      'Aplicar el contorno de ojos en toques suaves con el dedo anular sin frotar.',
    ],
    faqs: [
      {
        question: '¿Sirve para las bolsas de grasa estructurales?',
        answer:
          'Este protocolo es extraordinario para bolsas acuosas por retención de líquidos y mala circulación. Si se trata de herniación grasa genética severa, se requiere valoración médica para evaluar si es candidato a blefaroplastia.',
      },
      {
        question: '¿Es apto si uso lentes de contacto?',
        answer:
          'Sí, únicamente recomendamos retirar los lentes de contacto durante los 50 minutos de la sesión para mayor confort y descanso ocular.',
      },
    ],
    whatsappText: makeWhatsAppUrl('Protocolo Peri-Orbital Anti-Ojeras & Bolsas'),
  },
];

// Helper functions for easy querying
export function getAllServices(): ClinicalService[] {
  return servicesData;
}

export function getServiceById(id: string): ClinicalService | undefined {
  return servicesData.find((s) => s.id === id);
}

export function getServicesByCategory(category: ServiceCategory): ClinicalService[] {
  return servicesData.filter((s) => s.category === category);
}

export function getFeaturedServices(): ClinicalService[] {
  return servicesData.filter((s) => s.isFeatured);
}

export function getCategoryInfo(categoryId: ServiceCategory): CategoryInfo | undefined {
  return serviceCategories.find((c) => c.id === categoryId);
}

export function searchServices(query: string, category?: string): ClinicalService[] {
  const clean = query.trim().toLowerCase();
  return servicesData.filter((s) => {
    if (category && category !== 'todos' && s.category !== category) {
      return false;
    }
    if (!clean) return true;
    return (
      s.name.toLowerCase().includes(clean) ||
      s.tagline.toLowerCase().includes(clean) ||
      s.description.toLowerCase().includes(clean) ||
      s.technology.toLowerCase().includes(clean) ||
      s.benefits.some((b) => b.toLowerCase().includes(clean)) ||
      s.targetConditions.some((t) => t.toLowerCase().includes(clean))
    );
  });
}
