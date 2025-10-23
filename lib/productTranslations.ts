// Product translation system
export interface ProductTranslation {
  name: string;
  description?: string;
  brand?: string;
}

export interface ProductTranslations {
  [productId: string]: {
    en: ProductTranslation;
    ar: ProductTranslation;
    tr: ProductTranslation;
    de: ProductTranslation;
    fr: ProductTranslation;
    es: ProductTranslation;
    it: ProductTranslation;
    nl: ProductTranslation;
    ja: ProductTranslation;
    zh: ProductTranslation;
    hi: ProductTranslation;
    pt: ProductTranslation;
    ru: ProductTranslation;
    ko: ProductTranslation;
  };
}

// Sample product translations - in a real app, this would come from a database
export const productTranslations: ProductTranslations = {
  '1': {
    en: { name: 'Hydrating Face Serum', description: 'Deeply hydrating serum for all skin types', brand: 'Cosmat' },
    ar: { name: 'مصل ترطيب الوجه', description: 'مصل مرطب بعمق لجميع أنواع البشرة', brand: 'كوزمات' },
    tr: { name: 'Nemlendirici Yüz Serumu', description: 'Tüm cilt tipleri için derinlemesine nemlendirici serum', brand: 'Cosmat' },
    de: { name: 'Feuchtigkeitsspendendes Gesichtsserum', description: 'Tief feuchtigkeitsspendendes Serum für alle Hauttypen', brand: 'Cosmat' },
    fr: { name: 'Sérum Hydratant Visage', description: 'Sérum hydratant en profondeur pour tous types de peau', brand: 'Cosmat' },
    es: { name: 'Sérum Hidratante Facial', description: 'Sérum hidratante profundo para todos los tipos de piel', brand: 'Cosmat' },
    it: { name: 'Siero Idratante Viso', description: 'Siero idratante profondo per tutti i tipi di pelle', brand: 'Cosmat' },
    nl: { name: 'Hydraterend Gezichtsserum', description: 'Diep hydraterend serum voor alle huidtypes', brand: 'Cosmat' },
    ja: { name: '保湿フェイスセラム', description: 'すべての肌タイプに深く保湿するセラム', brand: 'コズマット' },
    zh: { name: '保湿面部精华', description: '适用于所有肌肤类型的深层保湿精华', brand: '科兹玛特' },
    hi: { name: 'हाइड्रेटिंग फेस सीरम', description: 'सभी त्वचा प्रकारों के लिए गहरी हाइड्रेशन सीरम', brand: 'कोस्मैट' },
    pt: { name: 'Sérum Hidratante Facial', description: 'Sérum hidratante profundo para todos os tipos de pele', brand: 'Cosmat' },
    ru: { name: 'Увлажняющая сыворотка для лица', description: 'Глубоко увлажняющая сыворотка для всех типов кожи', brand: 'Космат' },
    ko: { name: '수분 공급 페이스 세럼', description: '모든 피부 타입을 위한 깊은 수분 공급 세럼', brand: '코즈맷' }
  },
  '2': {
    en: { name: 'Anti-Aging Night Cream', description: 'Powerful anti-aging cream for overnight repair', brand: 'Cosmat' },
    ar: { name: 'كريم ليلي مضاد للشيخوخة', description: 'كريم قوي مضاد للشيخوخة للإصلاح الليلي', brand: 'كوزمات' },
    tr: { name: 'Anti-Aging Gece Kremi', description: 'Gece onarımı için güçlü anti-aging krem', brand: 'Cosmat' },
    de: { name: 'Anti-Aging Nachtcreme', description: 'Kräftige Anti-Aging-Creme für nächtliche Reparatur', brand: 'Cosmat' },
    fr: { name: 'Crème de Nuit Anti-Âge', description: 'Crème anti-âge puissante pour réparation nocturne', brand: 'Cosmat' },
    es: { name: 'Crema Nocturna Anti-Edad', description: 'Crema anti-edad potente para reparación nocturna', brand: 'Cosmat' },
    it: { name: 'Crema Notturna Anti-Age', description: 'Crema anti-età potente per riparazione notturna', brand: 'Cosmat' },
    nl: { name: 'Anti-Aging Nachtcrème', description: 'Krachtige anti-aging crème voor nachtelijke reparatie', brand: 'Cosmat' },
    ja: { name: 'アンチエイジングナイトクリーム', description: '夜間修復用の強力なアンチエイジングクリーム', brand: 'コズマット' },
    zh: { name: '抗衰老晚霜', description: '强效抗衰老晚霜，夜间修护', brand: '科兹玛特' },
    hi: { name: 'एंटी-एजिंग नाइट क्रीम', description: 'रात भर की मरम्मत के लिए शक्तिशाली एंटी-एजिंग क्रीम', brand: 'कोस्मैट' },
    pt: { name: 'Creme Noturna Anti-Idade', description: 'Creme anti-idade potente para reparação noturna', brand: 'Cosmat' },
    ru: { name: 'Антивозрастной ночной крем', description: 'Мощный антивозрастной крем для ночного восстановления', brand: 'Космат' },
    ko: { name: '안티에이징 나이트 크림', description: '야간 수리를 위한 강력한 안티에이징 크림', brand: '코즈맷' }
  },
  '3': {
    en: { name: 'Vitamin C Brightening Mask', description: 'Brightening mask with vitamin C for radiant skin', brand: 'Cosmat' },
    ar: { name: 'قناع فيتامين سي المضيء', description: 'قناع مضيء بفيتامين سي للبشرة المتوهجة', brand: 'كوزمات' },
    tr: { name: 'C Vitamini Parlatıcı Maske', description: 'Parlak cilt için C vitamini ile parlatıcı maske', brand: 'Cosmat' },
    de: { name: 'Vitamin C Aufhellende Maske', description: 'Aufhellende Maske mit Vitamin C für strahlende Haut', brand: 'Cosmat' },
    fr: { name: 'Masque Éclaircissant Vitamine C', description: 'Masque éclaircissant à la vitamine C pour peau radieuse', brand: 'Cosmat' },
    es: { name: 'Máscara Iluminadora Vitamina C', description: 'Máscara iluminadora con vitamina C para piel radiante', brand: 'Cosmat' },
    it: { name: 'Maschera Illuminante Vitamina C', description: 'Maschera illuminante con vitamina C per pelle radiosa', brand: 'Cosmat' },
    nl: { name: 'Vitamine C Verhelderende Masker', description: 'Verhelderende masker met vitamine C voor stralende huid', brand: 'Cosmat' },
    ja: { name: 'ビタミンCブライトニングマスク', description: '輝く肌のためのビタミンCブライトニングマスク', brand: 'コズマット' },
    zh: { name: '维生素C亮白面膜', description: '含维生素C的亮白面膜，让肌肤焕发光彩', brand: '科兹玛特' },
    hi: { name: 'विटामिन सी ब्राइटनिंग मास्क', description: 'चमकदार त्वचा के लिए विटामिन सी के साथ ब्राइटनिंग मास्क', brand: 'कोस्मैट' },
    pt: { name: 'Máscara Clareadora Vitamina C', description: 'Máscara clareadora com vitamina C para pele radiante', brand: 'Cosmat' },
    ru: { name: 'Осветляющая маска с витамином С', description: 'Осветляющая маска с витамином С для сияющей кожи', brand: 'Космат' },
    ko: { name: '비타민 C 브라이트닝 마스크', description: '빛나는 피부를 위한 비타민 C 브라이트닝 마스크', brand: '코즈맷' }
  }
};

// Function to get translated product information
export const getProductTranslation = (
  productId: string | number, 
  language: string, 
  fallbackLanguage: string = 'en'
): ProductTranslation => {
  const translations = productTranslations[productId.toString()];
  
  if (!translations) {
    // Return a default translation if product not found
    return {
      name: `Product ${productId}`,
      description: 'Product description not available',
      brand: 'Cosmat'
    };
  }
  
  // Return translation for the requested language, fallback to English if not available
  return translations[language as keyof typeof translations] || translations[fallbackLanguage as keyof typeof translations] || translations.en;
};

// Function to get translated product name only
export const getTranslatedProductName = (
  productId: string | number, 
  language: string, 
  fallbackLanguage: string = 'en'
): string => {
  const translation = getProductTranslation(productId, language, fallbackLanguage);
  return translation.name;
};

// Function to get translated product description
export const getTranslatedProductDescription = (
  productId: string | number, 
  language: string, 
  fallbackLanguage: string = 'en'
): string => {
  const translation = getProductTranslation(productId, language, fallbackLanguage);
  return translation.description || '';
};

// Function to get translated brand name
export const getTranslatedBrand = (
  productId: string | number, 
  language: string, 
  fallbackLanguage: string = 'en'
): string => {
  const translation = getProductTranslation(productId, language, fallbackLanguage);
  return translation.brand || 'Cosmat';
};
