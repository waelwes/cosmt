export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parentId?: string;
  children?: Category[];
  productCount: number;
}

export const categories: Category[] = [
  {
    id: 'skincare',
    name: 'Skincare',
    slug: 'skincare',
    description: 'Complete skincare solutions for healthy, radiant skin',
    image: '/api/placeholder/1200/400',
    productCount: 45,
    children: [
      {
        id: 'cleansers',
        name: 'Cleansers',
        slug: 'cleansers',
        description: 'Gentle cleansers for all skin types',
        image: '/api/placeholder/600/300',
        parentId: 'skincare',
        productCount: 12,
        children: [
          { id: 'face-wash', name: 'Face Wash', slug: 'face-wash', description: 'Daily face cleansers', image: '', parentId: 'cleansers', productCount: 5 },
          { id: 'makeup-remover', name: 'Makeup Remover', slug: 'makeup-remover', description: 'Effective makeup removal', image: '', parentId: 'cleansers', productCount: 4 },
          { id: 'micellar-water', name: 'Micellar Water', slug: 'micellar-water', description: 'Gentle micellar cleansers', image: '', parentId: 'cleansers', productCount: 3 }
        ]
      },
      {
        id: 'toners-essences',
        name: 'Toners & Essences',
        slug: 'toners-essences',
        description: 'Hydrating toners and essences',
        image: '/api/placeholder/600/300',
        parentId: 'skincare',
        productCount: 8
      },
      {
        id: 'exfoliators-scrubs',
        name: 'Exfoliators & Scrubs',
        slug: 'exfoliators-scrubs',
        description: 'Gentle exfoliation products',
        image: '/api/placeholder/600/300',
        parentId: 'skincare',
        productCount: 6
      },
      {
        id: 'serums-treatments',
        name: 'Serums & Treatments',
        slug: 'serums-treatments',
        description: 'Targeted treatment serums',
        image: '/api/placeholder/600/300',
        parentId: 'skincare',
        productCount: 15,
        children: [
          { id: 'brightening-serum', name: 'Brightening Serum', slug: 'brightening-serum', description: 'Vitamin C and brightening serums', image: '', parentId: 'serums-treatments', productCount: 5 },
          { id: 'anti-aging-serum', name: 'Anti-Aging Serum', slug: 'anti-aging-serum', description: 'Retinol and anti-aging treatments', image: '', parentId: 'serums-treatments', productCount: 6 },
          { id: 'acne-serum', name: 'Acne Serum', slug: 'acne-serum', description: 'Acne treatment serums', image: '', parentId: 'serums-treatments', productCount: 4 }
        ]
      },
      {
        id: 'moisturizers',
        name: 'Moisturizers',
        slug: 'moisturizers',
        description: 'Hydrating moisturizers for all skin types',
        image: '/api/placeholder/600/300',
        parentId: 'skincare',
        productCount: 10,
        children: [
          { id: 'day-cream', name: 'Day Cream', slug: 'day-cream', description: 'Daily moisturizers with SPF', image: '', parentId: 'moisturizers', productCount: 4 },
          { id: 'night-cream', name: 'Night Cream', slug: 'night-cream', description: 'Rich night moisturizers', image: '', parentId: 'moisturizers', productCount: 4 },
          { id: 'gel-cream', name: 'Gel Cream', slug: 'gel-cream', description: 'Lightweight gel moisturizers', image: '', parentId: 'moisturizers', productCount: 2 }
        ]
      },
      {
        id: 'eye-care',
        name: 'Eye Care',
        slug: 'eye-care',
        description: 'Specialized eye area treatments',
        image: '/api/placeholder/600/300',
        parentId: 'skincare',
        productCount: 8
      },
      {
        id: 'sunscreen',
        name: 'Sunscreen',
        slug: 'sunscreen',
        description: 'UV protection for all skin types',
        image: '/api/placeholder/600/300',
        parentId: 'skincare',
        productCount: 6
      },
      {
        id: 'masks',
        name: 'Masks',
        slug: 'masks',
        description: 'Treatment masks for deep care',
        image: '/api/placeholder/600/300',
        parentId: 'skincare',
        productCount: 12,
        children: [
          { id: 'sheet-masks', name: 'Sheet Masks', slug: 'sheet-masks', description: 'Hydrating sheet masks', image: '', parentId: 'masks', productCount: 5 },
          { id: 'clay-masks', name: 'Clay Masks', slug: 'clay-masks', description: 'Purifying clay masks', image: '', parentId: 'masks', productCount: 4 },
          { id: 'sleeping-masks', name: 'Sleeping Masks', slug: 'sleeping-masks', description: 'Overnight treatment masks', image: '', parentId: 'masks', productCount: 3 }
        ]
      },
      {
        id: 'lip-care',
        name: 'Lip Care',
        slug: 'lip-care',
        description: 'Nourishing lip treatments',
        image: '/api/placeholder/600/300',
        parentId: 'skincare',
        productCount: 8,
        children: [
          { id: 'lip-balm', name: 'Lip Balm', slug: 'lip-balm', description: 'Moisturizing lip balms', image: '', parentId: 'lip-care', productCount: 4 },
          { id: 'lip-scrub', name: 'Lip Scrub', slug: 'lip-scrub', description: 'Exfoliating lip scrubs', image: '', parentId: 'lip-care', productCount: 2 },
          { id: 'lip-mask', name: 'Lip Mask', slug: 'lip-mask', description: 'Intensive lip treatments', image: '', parentId: 'lip-care', productCount: 2 }
        ]
      }
    ]
  },
  {
    id: 'body-care',
    name: 'Body Care',
    slug: 'body-care',
    description: 'Luxurious body care products for soft, nourished skin',
    image: '/api/placeholder/1200/400',
    productCount: 32,
    children: [
      {
        id: 'body-wash',
        name: 'Body Wash',
        slug: 'body-wash',
        description: 'Gentle body cleansers',
        image: '/api/placeholder/600/300',
        parentId: 'body-care',
        productCount: 8
      },
      {
        id: 'body-scrubs',
        name: 'Body Scrubs',
        slug: 'body-scrubs',
        description: 'Exfoliating body scrubs',
        image: '/api/placeholder/600/300',
        parentId: 'body-care',
        productCount: 6
      },
      {
        id: 'body-lotion-cream',
        name: 'Body Lotion & Cream',
        slug: 'body-lotion-cream',
        description: 'Moisturizing body care',
        image: '/api/placeholder/600/300',
        parentId: 'body-care',
        productCount: 10
      },
      {
        id: 'body-oils',
        name: 'Body Oils',
        slug: 'body-oils',
        description: 'Nourishing body oils',
        image: '/api/placeholder/600/300',
        parentId: 'body-care',
        productCount: 4
      },
      {
        id: 'hand-foot-care',
        name: 'Hand & Foot Care',
        slug: 'hand-foot-care',
        description: 'Specialized hand and foot treatments',
        image: '/api/placeholder/600/300',
        parentId: 'body-care',
        productCount: 6
      },
      {
        id: 'deodorant-roll-on',
        name: 'Deodorant & Roll-On',
        slug: 'deodorant-roll-on',
        description: 'Natural deodorants and roll-ons',
        image: '/api/placeholder/600/300',
        parentId: 'body-care',
        productCount: 8
      },
      {
        id: 'body-mist-perfume-spray',
        name: 'Body Mist & Perfume Spray',
        slug: 'body-mist-perfume-spray',
        description: 'Light body fragrances',
        image: '/api/placeholder/600/300',
        parentId: 'body-care',
        productCount: 5
      },
      {
        id: 'intimate-care',
        name: 'Intimate Care',
        slug: 'intimate-care',
        description: 'Gentle intimate hygiene products',
        image: '/api/placeholder/600/300',
        parentId: 'body-care',
        productCount: 4
      }
    ]
  },
  {
    id: 'hair-care',
    name: 'Hair Care',
    slug: 'hair-care',
    description: 'Professional hair care products for every hair type and concern',
    image: '/api/placeholder/1200/400',
    productCount: 58,
    children: [
      {
        id: 'shampoo',
        name: 'Shampoo',
        slug: 'shampoo',
        description: 'Gentle cleansing shampoos',
        image: '/api/placeholder/600/300',
        parentId: 'hair-care',
        productCount: 15
      },
      {
        id: 'conditioner',
        name: 'Conditioner',
        slug: 'conditioner',
        description: 'Nourishing hair conditioners',
        image: '/api/placeholder/600/300',
        parentId: 'hair-care',
        productCount: 12
      },
      {
        id: 'hair-masks',
        name: 'Hair Masks',
        slug: 'hair-masks',
        description: 'Intensive hair treatments',
        image: '/api/placeholder/600/300',
        parentId: 'hair-care',
        productCount: 8
      },
      {
        id: 'hair-oils-serums',
        name: 'Hair Oils & Serums',
        slug: 'hair-oils-serums',
        description: 'Nourishing hair oils and serums',
        image: '/api/placeholder/600/300',
        parentId: 'hair-care',
        productCount: 10
      },
      {
        id: 'leave-in-treatments',
        name: 'Leave-in Treatments',
        slug: 'leave-in-treatments',
        description: 'Daily leave-in hair care',
        image: '/api/placeholder/600/300',
        parentId: 'hair-care',
        productCount: 6
      },
      {
        id: 'hair-styling',
        name: 'Hair Styling',
        slug: 'hair-styling',
        description: 'Professional hair styling products',
        image: '/api/placeholder/600/300',
        parentId: 'hair-care',
        productCount: 8
      },
      {
        id: 'hair-color',
        name: 'Hair Color',
        slug: 'hair-color',
        description: 'Hair coloring and treatment products',
        image: '/api/placeholder/600/300',
        parentId: 'hair-care',
        productCount: 5
      },
      {
        id: 'hair-vitamins',
        name: 'Hair Vitamins',
        slug: 'hair-vitamins',
        description: 'Nutritional supplements for hair health',
        image: '/api/placeholder/600/300',
        parentId: 'hair-care',
        productCount: 4
      }
    ]
  },
  {
    id: 'makeup',
    name: 'Makeup',
    slug: 'makeup',
    description: 'Professional makeup products for flawless beauty',
    image: '/api/placeholder/1200/400',
    productCount: 78,
    children: [
      {
        id: 'face',
        name: 'Face',
        slug: 'face',
        description: 'Face makeup products',
        image: '/api/placeholder/600/300',
        parentId: 'makeup',
        productCount: 25,
        children: [
          { id: 'primer', name: 'Primer', slug: 'primer', description: 'Face primers', image: '', parentId: 'face', productCount: 5 },
          { id: 'foundation', name: 'Foundation', slug: 'foundation', description: 'Foundation and base makeup', image: '', parentId: 'face', productCount: 8 },
          { id: 'concealer', name: 'Concealer', slug: 'concealer', description: 'Concealers and correctors', image: '', parentId: 'face', productCount: 6 },
          { id: 'powder', name: 'Powder', slug: 'powder', description: 'Setting and finishing powders', image: '', parentId: 'face', productCount: 4 },
          { id: 'blush-bronzer', name: 'Blush & Bronzer', slug: 'blush-bronzer', description: 'Cheek color products', image: '', parentId: 'face', productCount: 6 },
          { id: 'highlighter', name: 'Highlighter', slug: 'highlighter', description: 'Highlighting products', image: '', parentId: 'face', productCount: 4 },
          { id: 'setting-spray', name: 'Setting Spray', slug: 'setting-spray', description: 'Makeup setting sprays', image: '', parentId: 'face', productCount: 3 }
        ]
      },
      {
        id: 'eyes',
        name: 'Eyes',
        slug: 'eyes',
        description: 'Eye makeup products',
        image: '/api/placeholder/600/300',
        parentId: 'makeup',
        productCount: 28,
        children: [
          { id: 'eyeshadow', name: 'Eyeshadow', slug: 'eyeshadow', description: 'Eye shadow palettes and singles', image: '', parentId: 'eyes', productCount: 12 },
          { id: 'eyeliner', name: 'Eyeliner', slug: 'eyeliner', description: 'Eye liners and pencils', image: '', parentId: 'eyes', productCount: 8 },
          { id: 'mascara', name: 'Mascara', slug: 'mascara', description: 'Mascara and lash products', image: '', parentId: 'eyes', productCount: 6 },
          { id: 'eyebrow-products', name: 'Eyebrow Products', slug: 'eyebrow-products', description: 'Brow shaping and coloring', image: '', parentId: 'eyes', productCount: 5 }
        ]
      },
      {
        id: 'lips',
        name: 'Lips',
        slug: 'lips',
        description: 'Lip makeup products',
        image: '/api/placeholder/600/300',
        parentId: 'makeup',
        productCount: 20,
        children: [
          { id: 'lipstick', name: 'Lipstick', slug: 'lipstick', description: 'Lipstick and lip color', image: '', parentId: 'lips', productCount: 10 },
          { id: 'lip-gloss', name: 'Lip Gloss', slug: 'lip-gloss', description: 'Lip gloss and shine', image: '', parentId: 'lips', productCount: 6 },
          { id: 'lip-liner', name: 'Lip Liner', slug: 'lip-liner', description: 'Lip liners and pencils', image: '', parentId: 'lips', productCount: 4 }
        ]
      }
    ]
  },
  {
    id: 'fragrance',
    name: 'Fragrance',
    slug: 'fragrance',
    description: 'Signature fragrances and essential oils',
    image: '/api/placeholder/1200/400',
    productCount: 35,
    children: [
      {
        id: 'womens-perfume',
        name: 'Women\'s Perfume',
        slug: 'womens-perfume',
        description: 'Elegant women\'s fragrances',
        image: '/api/placeholder/600/300',
        parentId: 'fragrance',
        productCount: 15
      },
      {
        id: 'mens-perfume',
        name: 'Men\'s Perfume',
        slug: 'mens-perfume',
        description: 'Sophisticated men\'s fragrances',
        image: '/api/placeholder/600/300',
        parentId: 'fragrance',
        productCount: 12
      },
      {
        id: 'unisex-perfume',
        name: 'Unisex Perfume',
        slug: 'unisex-perfume',
        description: 'Versatile unisex fragrances',
        image: '/api/placeholder/600/300',
        parentId: 'fragrance',
        productCount: 8
      },
      {
        id: 'body-spray',
        name: 'Body Spray',
        slug: 'body-spray',
        description: 'Light body fragrances',
        image: '/api/placeholder/600/300',
        parentId: 'fragrance',
        productCount: 6
      },
      {
        id: 'perfume-oil',
        name: 'Perfume Oil',
        slug: 'perfume-oil',
        description: 'Concentrated perfume oils',
        image: '/api/placeholder/600/300',
        parentId: 'fragrance',
        productCount: 4
      },
      {
        id: 'gift-sets',
        name: 'Gift Sets',
        slug: 'gift-sets',
        description: 'Fragrance gift sets and collections',
        image: '/api/placeholder/600/300',
        parentId: 'fragrance',
        productCount: 8
      }
    ]
  },
  {
    id: 'mens-grooming',
    name: 'Men\'s Grooming',
    slug: 'mens-grooming',
    description: 'Complete grooming solutions for men',
    image: '/api/placeholder/1200/400',
    productCount: 28,
    children: [
      {
        id: 'face-wash-mens',
        name: 'Face Wash',
        slug: 'face-wash-mens',
        description: 'Men\'s facial cleansers',
        image: '/api/placeholder/600/300',
        parentId: 'mens-grooming',
        productCount: 6
      },
      {
        id: 'moisturizer-mens',
        name: 'Moisturizer',
        slug: 'moisturizer-mens',
        description: 'Men\'s facial moisturizers',
        image: '/api/placeholder/600/300',
        parentId: 'mens-grooming',
        productCount: 5
      },
      {
        id: 'shaving-aftershave',
        name: 'Shaving & Aftershave',
        slug: 'shaving-aftershave',
        description: 'Shaving products and aftershave',
        image: '/api/placeholder/600/300',
        parentId: 'mens-grooming',
        productCount: 8
      },
      {
        id: 'beard-oils-balms',
        name: 'Beard Oils & Balms',
        slug: 'beard-oils-balms',
        description: 'Beard care and styling products',
        image: '/api/placeholder/600/300',
        parentId: 'mens-grooming',
        productCount: 6
      },
      {
        id: 'hair-styling-mens',
        name: 'Hair Styling',
        slug: 'hair-styling-mens',
        description: 'Men\'s hair styling products',
        image: '/api/placeholder/600/300',
        parentId: 'mens-grooming',
        productCount: 4
      },
      {
        id: 'deodorant-body-spray-mens',
        name: 'Deodorant & Body Spray',
        slug: 'deodorant-body-spray-mens',
        description: 'Men\'s deodorants and body sprays',
        image: '/api/placeholder/600/300',
        parentId: 'mens-grooming',
        productCount: 5
      },
      {
        id: 'mens-serum-sunscreen',
        name: 'Men\'s Serum & Sunscreen',
        slug: 'mens-serum-sunscreen',
        description: 'Men\'s skincare serums and sun protection',
        image: '/api/placeholder/600/300',
        parentId: 'mens-grooming',
        productCount: 4
      }
    ]
  },
  {
    id: 'supplements',
    name: 'Supplements',
    slug: 'supplements',
    description: 'Nutritional supplements for beauty and wellness',
    image: '/api/placeholder/1200/400',
    productCount: 22,
    children: [
      {
        id: 'hair-skin-nails-vitamins',
        name: 'Hair, Skin & Nails Vitamins',
        slug: 'hair-skin-nails-vitamins',
        description: 'Beauty vitamins and supplements',
        image: '/api/placeholder/600/300',
        parentId: 'supplements',
        productCount: 8
      },
      {
        id: 'collagen-supplements',
        name: 'Collagen Supplements',
        slug: 'collagen-supplements',
        description: 'Collagen for skin and joint health',
        image: '/api/placeholder/600/300',
        parentId: 'supplements',
        productCount: 5
      },
      {
        id: 'biotin',
        name: 'Biotin',
        slug: 'biotin',
        description: 'Biotin for hair and nail health',
        image: '/api/placeholder/600/300',
        parentId: 'supplements',
        productCount: 3
      },
      {
        id: 'hyaluronic-acid',
        name: 'Hyaluronic Acid',
        slug: 'hyaluronic-acid',
        description: 'Hyaluronic acid supplements',
        image: '/api/placeholder/600/300',
        parentId: 'supplements',
        productCount: 2
      },
      {
        id: 'detox-glow-drinks',
        name: 'Detox & Glow Drinks',
        slug: 'detox-glow-drinks',
        description: 'Detox and beauty drinks',
        image: '/api/placeholder/600/300',
        parentId: 'supplements',
        productCount: 2
      },
      {
        id: 'anti-aging-capsules',
        name: 'Anti-Aging Capsules',
        slug: 'anti-aging-capsules',
        description: 'Anti-aging supplements',
        image: '/api/placeholder/600/300',
        parentId: 'supplements',
        productCount: 2
      }
    ]
  },
  {
    id: 'tools-devices',
    name: 'Tools & Devices',
    slug: 'tools-devices',
    description: 'Professional beauty tools and devices',
    image: '/api/placeholder/1200/400',
    productCount: 18,
    children: [
      {
        id: 'face-roller-gua-sha',
        name: 'Face Roller & Gua Sha',
        slug: 'face-roller-gua-sha',
        description: 'Facial massage tools',
        image: '/api/placeholder/600/300',
        parentId: 'tools-devices',
        productCount: 4
      },
      {
        id: 'cleansing-brush',
        name: 'Cleansing Brush',
        slug: 'cleansing-brush',
        description: 'Electronic cleansing brushes',
        image: '/api/placeholder/600/300',
        parentId: 'tools-devices',
        productCount: 3
      },
      {
        id: 'hair-brush-comb',
        name: 'Hair Brush & Comb',
        slug: 'hair-brush-comb',
        description: 'Hair styling tools',
        image: '/api/placeholder/600/300',
        parentId: 'tools-devices',
        productCount: 3
      },
      {
        id: 'makeup-sponge',
        name: 'Makeup Sponge',
        slug: 'makeup-sponge',
        description: 'Makeup application tools',
        image: '/api/placeholder/600/300',
        parentId: 'tools-devices',
        productCount: 2
      },
      {
        id: 'nail-tools',
        name: 'Nail Tools',
        slug: 'nail-tools',
        description: 'Nail care and manicure tools',
        image: '/api/placeholder/600/300',
        parentId: 'tools-devices',
        productCount: 2
      },
      {
        id: 'waxing-kit',
        name: 'Waxing Kit',
        slug: 'waxing-kit',
        description: 'Hair removal waxing kits',
        image: '/api/placeholder/600/300',
        parentId: 'tools-devices',
        productCount: 2
      },
      {
        id: 'led-mask',
        name: 'LED Mask',
        slug: 'led-mask',
        description: 'LED light therapy masks',
        image: '/api/placeholder/600/300',
        parentId: 'tools-devices',
        productCount: 1
      },
      {
        id: 'microcurrent-device',
        name: 'Microcurrent Device',
        slug: 'microcurrent-device',
        description: 'Microcurrent facial devices',
        image: '/api/placeholder/600/300',
        parentId: 'tools-devices',
        productCount: 1
      },
      {
        id: 'hair-removal-device',
        name: 'Hair Removal Device',
        slug: 'hair-removal-device',
        description: 'At-home hair removal devices',
        image: '/api/placeholder/600/300',
        parentId: 'tools-devices',
        productCount: 1
      }
    ]
  },
  {
    id: 'natural-organic',
    name: 'Natural & Organic',
    slug: 'natural-organic',
    description: 'Natural and organic beauty products',
    image: '/api/placeholder/1200/400',
    productCount: 25,
    children: [
      {
        id: 'organic-skincare',
        name: 'Organic Skincare',
        slug: 'organic-skincare',
        description: 'Certified organic skincare products',
        image: '/api/placeholder/600/300',
        parentId: 'natural-organic',
        productCount: 10
      },
      {
        id: 'natural-oils-serums',
        name: 'Natural Oils & Serums',
        slug: 'natural-oils-serums',
        description: 'Pure natural oils and serums',
        image: '/api/placeholder/600/300',
        parentId: 'natural-organic',
        productCount: 8
      },
      {
        id: 'herbal-soaps',
        name: 'Herbal Soaps',
        slug: 'herbal-soaps',
        description: 'Handmade herbal soaps',
        image: '/api/placeholder/600/300',
        parentId: 'natural-organic',
        productCount: 4
      },
      {
        id: 'vegan-products',
        name: 'Vegan Products',
        slug: 'vegan-products',
        description: 'Cruelty-free vegan beauty products',
        image: '/api/placeholder/600/300',
        parentId: 'natural-organic',
        productCount: 3
      },
      {
        id: 'essential-oils',
        name: 'Essential Oils',
        slug: 'essential-oils',
        description: 'Pure essential oils for aromatherapy',
        image: '/api/placeholder/600/300',
        parentId: 'natural-organic',
        productCount: 5
      }
    ]
  },
  {
    id: 'mom-baby-care',
    name: 'Mom & Baby Care',
    slug: 'mom-baby-care',
    description: 'Gentle care products for mothers and babies',
    image: '/api/placeholder/1200/400',
    productCount: 15,
    children: [
      {
        id: 'baby-lotion',
        name: 'Baby Lotion',
        slug: 'baby-lotion',
        description: 'Gentle baby moisturizers',
        image: '/api/placeholder/600/300',
        parentId: 'mom-baby-care',
        productCount: 4
      },
      {
        id: 'baby-shampoo',
        name: 'Baby Shampoo',
        slug: 'baby-shampoo',
        description: 'Tear-free baby shampoos',
        image: '/api/placeholder/600/300',
        parentId: 'mom-baby-care',
        productCount: 3
      },
      {
        id: 'baby-cream',
        name: 'Baby Cream',
        slug: 'baby-cream',
        description: 'Nourishing baby creams',
        image: '/api/placeholder/600/300',
        parentId: 'mom-baby-care',
        productCount: 3
      },
      {
        id: 'stretch-mark-cream',
        name: 'Stretch Mark Cream',
        slug: 'stretch-mark-cream',
        description: 'Pregnancy stretch mark prevention',
        image: '/api/placeholder/600/300',
        parentId: 'mom-baby-care',
        productCount: 3
      },
      {
        id: 'nursing-cream',
        name: 'Nursing Cream',
        slug: 'nursing-cream',
        description: 'Nursing comfort and care',
        image: '/api/placeholder/600/300',
        parentId: 'mom-baby-care',
        productCount: 2
      }
    ]
  }
];

export const getCategoryBySlug = (slug: string): Category | undefined => {
  const findCategory = (categories: Category[]): Category | undefined => {
    for (const category of categories) {
      if (category.slug === slug) {
        return category;
      }
      if (category.children) {
        const found = findCategory(category.children);
        if (found) return found;
      }
    }
    return undefined;
  };
  
  return findCategory(categories);
};

export const getMainCategories = (): Category[] => {
  return categories.filter(category => !category.parentId);
};

export const getSubCategories = (parentId: string): Category[] => {
  const findSubCategories = (categories: Category[]): Category[] => {
    for (const category of categories) {
      if (category.id === parentId && category.children) {
        return category.children;
      }
      if (category.children) {
        const found = findSubCategories(category.children);
        if (found.length > 0) return found;
      }
    }
    return [];
  };
  
  return findSubCategories(categories);
};
