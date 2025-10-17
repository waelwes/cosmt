export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  rating: number;
  reviews: number;
  description: string;
  shortDescription: string;
  category: string;
  subcategory: string;
  productType?: string;
  tags: string[];
  isNew: boolean;
  isBestSeller: boolean;
  isOnSale: boolean;
  inStock: boolean;
  stockCount?: number;
  ingredients?: string[];
  skinType?: string[];
  hairType?: string[];
  size?: string;
  weight?: string;
  volume?: string;
  color?: string;
  finish?: string;
  coverage?: string;
  spf?: number;
  crueltyFree: boolean;
  vegan: boolean;
  organic: boolean;
  parabenFree: boolean;
  sulfateFree: boolean;
  fragranceFree: boolean;
  hypoallergenic: boolean;
  dermatologistTested: boolean;
  clinicalTested: boolean;
  howToUse?: string;
  benefits?: string[];
  warnings?: string[];
  shippingInfo?: string;
  returnPolicy?: string;
  warranty?: string;
  relatedProducts?: string[];
  frequentlyBoughtWith?: string[];
  reviews?: {
    id: string;
    userName: string;
    rating: number;
    title: string;
    comment: string;
    date: string;
    verified: boolean;
    helpful: number;
  }[];
}

export const products: Product[] = [
  // SKINCARE - CLEANSERS
  {
    id: 'skincare-cleansers-face-wash-1',
    name: 'AVEDA Botanical Kinetics™ Gentle Foaming Cleanser',
    slug: 'aveda-botanical-kinetics-gentle-foaming-cleanser',
    brand: 'AVEDA',
    price: 32.00,
    originalPrice: 42.00,
    image: '/api/placeholder/400/400',
    images: [
      '/api/placeholder/800/800',
      '/api/placeholder/800/800',
      '/api/placeholder/800/800'
    ],
    rating: 4.8,
    reviews: 124,
    description: 'A luxurious, sulfate-free foaming cleanser that gently removes makeup, dirt, and impurities while maintaining your skin\'s natural moisture balance. Formulated with 95% naturally derived ingredients including botanical extracts of chamomile, lavender, and eucalyptus. This daily cleanser creates a rich, creamy lather that cleanses without stripping, leaving skin feeling soft, refreshed, and perfectly balanced. Perfect for all skin types, especially sensitive and combination skin.',
    shortDescription: 'Luxurious sulfate-free foaming cleanser with 95% naturally derived ingredients',
    category: 'skincare',
    subcategory: 'cleansers',
    productType: 'face-wash',
    tags: ['gentle', 'sulfate-free', 'botanical', 'foaming', 'naturally-derived', 'sensitive-skin'],
    isNew: false,
    isBestSeller: true,
    isOnSale: true,
    inStock: true,
    stockCount: 45,
    ingredients: ['Water', 'Coconut-derived surfactants', 'Chamomile extract', 'Lavender oil'],
    skinType: ['all', 'sensitive', 'dry', 'combination'],
    size: '150ml',
    crueltyFree: true,
    vegan: true,
    organic: false,
    parabenFree: true,
    sulfateFree: true,
    fragranceFree: false,
    hypoallergenic: true,
    dermatologistTested: true,
    howToUse: 'Wet face with lukewarm water. Apply cleanser and gently massage in circular motions. Rinse thoroughly.',
    benefits: ['Removes makeup and dirt', 'Maintains moisture balance', 'Suitable for sensitive skin', 'Botanical ingredients'],
    warnings: ['For external use only', 'Avoid contact with eyes']
  },
  {
    id: 'skincare-cleansers-makeup-remover-1',
    name: 'DAVINES Essential Micellar Cleansing Water',
    slug: 'davines-essential-micellar-cleansing-water',
    brand: 'DAVINES',
    price: 28.00,
    image: '/api/placeholder/400/400',
    rating: 4.6,
    reviews: 89,
    description: 'A revolutionary micellar cleansing water that effectively removes all types of makeup including stubborn waterproof formulas, mascara, and long-wear foundations. Enriched with natural micelles that act like magnets to attract and lift away dirt, oil, and makeup without harsh rubbing. Formulated with soothing cucumber extract and vitamin E to nourish and hydrate skin while cleansing. No rinsing required - simply apply to cotton pad and gently sweep across face and eyes.',
    shortDescription: 'Revolutionary micellar water that removes all makeup types without rinsing',
    category: 'skincare',
    subcategory: 'cleansers',
    productType: 'makeup-remover',
    tags: ['micellar', 'gentle', 'waterproof', 'no-rinse', 'cucumber', 'vitamin-e'],
    isNew: true,
    isBestSeller: false,
    isOnSale: false,
    inStock: true,
    stockCount: 32,
    skinType: ['all'],
    size: '200ml',
    crueltyFree: true,
    vegan: false,
    organic: false,
    parabenFree: true,
    sulfateFree: true,
    fragranceFree: true,
    hypoallergenic: true,
    dermatologistTested: true
  },

  // SKINCARE - SERUMS & TREATMENTS
  {
    id: 'skincare-serums-brightening-1',
    name: 'Vitamin C Brightening Serum',
    slug: 'vitamin-c-brightening-serum',
    brand: 'AVEDA',
    price: 65.00,
    originalPrice: 85.00,
    image: '/api/placeholder/400/400',
    rating: 4.9,
    reviews: 234,
    description: 'Powerful vitamin C serum that brightens skin tone, reduces dark spots, and provides antioxidant protection. Formulated with 20% vitamin C and hyaluronic acid.',
    shortDescription: '20% Vitamin C serum for brightening and antioxidant protection',
    category: 'skincare',
    subcategory: 'serums-treatments',
    productType: 'brightening-serum',
    tags: ['vitamin-c', 'brightening', 'antioxidant', 'hyaluronic-acid'],
    isNew: false,
    isBestSeller: true,
    isOnSale: true,
    inStock: true,
    stockCount: 28,
    skinType: ['all', 'dull', 'uneven-tone'],
    size: '30ml',
    crueltyFree: true,
    vegan: true,
    organic: false,
    parabenFree: true,
    sulfateFree: true,
    fragranceFree: true,
    hypoallergenic: true,
    dermatologistTested: true,
    clinicalTested: true
  },
  {
    id: 'skincare-serums-anti-aging-1',
    name: 'Retinol Anti-Aging Serum',
    slug: 'retinol-anti-aging-serum',
    brand: 'DAVINES',
    price: 89.00,
    image: '/api/placeholder/400/400',
    rating: 4.7,
    reviews: 156,
    description: 'Advanced retinol serum that reduces fine lines, wrinkles, and improves skin texture. Contains 0.5% retinol and peptides for maximum effectiveness.',
    shortDescription: '0.5% Retinol serum with peptides for anti-aging',
    category: 'skincare',
    subcategory: 'serums-treatments',
    productType: 'anti-aging-serum',
    tags: ['retinol', 'anti-aging', 'peptides', 'wrinkles'],
    isNew: false,
    isBestSeller: true,
    isOnSale: false,
    inStock: true,
    stockCount: 19,
    skinType: ['mature', 'normal', 'combination'],
    size: '30ml',
    crueltyFree: true,
    vegan: false,
    organic: false,
    parabenFree: true,
    sulfateFree: true,
    fragranceFree: true,
    hypoallergenic: true,
    dermatologistTested: true,
    clinicalTested: true
  },

  // HAIR CARE - SHAMPOO
  {
    id: 'hair-care-shampoo-1',
    name: 'AVEDA Invati Advanced™ Exfoliating Shampoo',
    slug: 'aveda-invati-advanced-exfoliating-shampoo',
    brand: 'AVEDA',
    price: 45.00,
    originalPrice: 60.00,
    image: '/api/placeholder/400/400',
    rating: 4.8,
    reviews: 189,
    description: 'A clinically proven, plant-based shampoo specifically formulated for thinning hair that helps reduce hair loss and promotes thicker, fuller-looking hair. Features a unique blend of Ayurvedic herbs including ginseng, turmeric, and winter cherry, combined with salicylic acid to gently exfoliate the scalp and remove buildup. This advanced formula helps strengthen hair from root to tip while creating the appearance of fuller, more voluminous hair. Suitable for all hair types experiencing thinning or fine hair concerns.',
    shortDescription: 'Clinically proven shampoo for thinning hair with Ayurvedic herbs',
    category: 'hair-care',
    subcategory: 'shampoo',
    tags: ['thinning-hair', 'ginseng', 'turmeric', 'volumizing', 'ayurvedic', 'exfoliating'],
    isNew: false,
    isBestSeller: true,
    isOnSale: true,
    inStock: true,
    stockCount: 67,
    hairType: ['thin', 'fine', 'all'],
    size: '200ml',
    crueltyFree: true,
    vegan: true,
    organic: false,
    parabenFree: true,
    sulfateFree: false,
    fragranceFree: false,
    hypoallergenic: true,
    dermatologistTested: true
  },
  {
    id: 'hair-care-shampoo-2',
    name: 'Volumizing Shampoo',
    slug: 'volumizing-shampoo',
    brand: 'DAVINES',
    price: 38.00,
    image: '/api/placeholder/400/400',
    rating: 4.6,
    reviews: 142,
    description: 'Professional volumizing shampoo that adds body and fullness to fine, limp hair. Contains rice protein and quinoa.',
    shortDescription: 'Professional volumizing shampoo with rice protein',
    category: 'hair-care',
    subcategory: 'shampoo',
    tags: ['volumizing', 'fine-hair', 'rice-protein', 'quinoa'],
    isNew: true,
    isBestSeller: false,
    isOnSale: false,
    inStock: true,
    stockCount: 54,
    hairType: ['fine', 'limp', 'all'],
    size: '250ml',
    crueltyFree: true,
    vegan: true,
    organic: false,
    parabenFree: true,
    sulfateFree: false,
    fragranceFree: false,
    hypoallergenic: true,
    dermatologistTested: true
  },

  // HAIR CARE - CONDITIONER
  {
    id: 'hair-care-conditioner-1',
    name: 'Nourishing Conditioner',
    slug: 'nourishing-conditioner',
    brand: 'AVEDA',
    price: 42.00,
    image: '/api/placeholder/400/400',
    rating: 4.7,
    reviews: 167,
    description: 'Deeply nourishing conditioner that moisturizes and detangles hair while adding shine and softness.',
    shortDescription: 'Deeply nourishing conditioner for all hair types',
    category: 'hair-care',
    subcategory: 'conditioner',
    tags: ['nourishing', 'moisturizing', 'detangling', 'shine'],
    isNew: false,
    isBestSeller: true,
    isOnSale: false,
    inStock: true,
    stockCount: 43,
    hairType: ['all', 'dry', 'damaged'],
    size: '200ml',
    crueltyFree: true,
    vegan: true,
    organic: false,
    parabenFree: true,
    sulfateFree: false,
    fragranceFree: false,
    hypoallergenic: true,
    dermatologistTested: true
  },

  // MAKEUP - FACE
  {
    id: 'makeup-face-foundation-1',
    name: 'Luminous Foundation',
    slug: 'luminous-foundation',
    brand: 'AVEDA',
    price: 55.00,
    image: '/api/placeholder/400/400',
    rating: 4.8,
    reviews: 298,
    description: 'Lightweight, luminous foundation that provides medium to full coverage with a natural, dewy finish. Long-wearing and transfer-resistant.',
    shortDescription: 'Lightweight luminous foundation with medium-full coverage',
    category: 'makeup',
    subcategory: 'face',
    productType: 'foundation',
    tags: ['luminous', 'medium-coverage', 'dewy', 'long-wearing'],
    isNew: false,
    isBestSeller: true,
    isOnSale: false,
    inStock: true,
    stockCount: 78,
    skinType: ['all'],
    size: '30ml',
    coverage: 'medium-full',
    finish: 'dewy',
    crueltyFree: true,
    vegan: true,
    organic: false,
    parabenFree: true,
    sulfateFree: true,
    fragranceFree: true,
    hypoallergenic: true,
    dermatologistTested: true
  },

  // FRAGRANCE - WOMEN'S
  {
    id: 'fragrance-womens-1',
    name: 'Botanical Essence Eau de Parfum',
    slug: 'botanical-essence-eau-de-parfum',
    brand: 'AVEDA',
    price: 78.00,
    originalPrice: 95.00,
    image: '/api/placeholder/400/400',
    rating: 4.9,
    reviews: 145,
    description: 'Luxurious botanical fragrance with notes of rose, jasmine, and sandalwood. Long-lasting and sophisticated.',
    shortDescription: 'Luxurious botanical fragrance with rose and jasmine',
    category: 'fragrance',
    subcategory: 'womens-perfume',

    productType: 'womens-perfume',
    tags: ['botanical', 'rose', 'jasmine', 'sandalwood'],
    isNew: false,
    isBestSeller: true,
    isOnSale: true,
    inStock: true,
    stockCount: 23,
    size: '50ml',
    crueltyFree: true,
    vegan: true,
    organic: false,
    parabenFree: true,
    sulfateFree: true,
    fragranceFree: false,
    hypoallergenic: true,
    dermatologistTested: true
  },

  // BODY CARE - BODY WASH
  {
    id: 'body-care-body-wash-1',
    name: 'Hydrating Body Wash',
    slug: 'hydrating-body-wash',
    brand: 'DAVINES',
    price: 28.00,
    image: '/api/placeholder/400/400',
    rating: 4.5,
    reviews: 98,
    description: 'Moisturizing body wash that cleanses while hydrating skin. Contains shea butter and vitamin E.',
    shortDescription: 'Moisturizing body wash with shea butter',
    category: 'body-care',
    subcategory: 'body-wash',
    tags: ['hydrating', 'shea-butter', 'vitamin-e', 'moisturizing'],
    isNew: true,
    isBestSeller: false,
    isOnSale: false,
    inStock: true,
    stockCount: 56,
    skinType: ['all', 'dry'],
    size: '400ml',
    crueltyFree: true,
    vegan: true,
    organic: false,
    parabenFree: true,
    sulfateFree: false,
    fragranceFree: false,
    hypoallergenic: true,
    dermatologistTested: true
  }
];

// Helper functions
export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const getProductsBySubcategory = (category: string, subcategory: string): Product[] => {
  return products.filter(product => 
    product.category === category && product.subcategory === subcategory
  );
};

export const getProductsByType = (category: string, subcategory: string, productType: string): Product[] => {
  return products.filter(product => 
    product.category === category && 
    product.subcategory === subcategory && 
    product.productType === productType
  );
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(product => product.slug === slug);
};

export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.brand.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.isBestSeller || product.isNew);
};

export const getProductsOnSale = (): Product[] => {
  return products.filter(product => product.isOnSale);
};

export const getInStockProducts = (): Product[] => {
  return products.filter(product => product.inStock);
};
