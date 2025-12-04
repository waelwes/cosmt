import { Metadata } from 'next';
import Image from 'next/image';
import { PageLayout } from '../../../components/layout/PageLayout';

// Language-specific content
const aboutContent = {
  en: {
    title: 'About COSMT - Professional Beauty & Cosmetics Brand',
    description: 'Learn about COSMT\'s mission to provide professional-grade beauty and cosmetics products. Discover our story, values, and commitment to quality.',
    heroTitle: 'About COSMT',
    heroSubtitle: 'Professional Beauty & Cosmetics for Every Skin Type',
    ourStoryTitle: 'Our Story',
    ourStory1: 'COSMT was founded with a simple yet powerful mission: to make professional-grade beauty and cosmetics accessible to everyone. We believe that everyone deserves access to high-quality products that enhance their natural beauty and boost their confidence.',
    ourStory2: 'Our carefully curated selection features products from trusted brands like AVEDA and DAVINES, ensuring that every item meets our strict standards for quality, effectiveness, and safety.',
    qualityTitle: 'Quality First',
    qualityDesc: 'Every product is carefully selected for its quality, effectiveness, and safety standards.',
    customerTitle: 'Customer Care',
    customerDesc: 'We\'re committed to providing exceptional customer service and support every step of the way.',
    innovationTitle: 'Innovation',
    innovationDesc: 'We stay ahead of beauty trends and continuously expand our product range.',
    ctaTitle: 'Ready to Discover Your Perfect Products?',
    ctaDesc: 'Browse our extensive collection of professional beauty and cosmetics products.',
    shopButton: 'Shop All Categories',
    contactButton: 'Contact Us'
  },
  ar: {
    title: 'حول كوزمت - علامة تجارية للجمال ومستحضرات التجميل المهنية',
    description: 'تعرف على مهمة كوزمت في توفير منتجات الجمال ومستحضرات التجميل عالية الجودة. اكتشف قصتنا وقيمنا والتزامنا بالجودة.',
    heroTitle: 'حول كوزمت',
    heroSubtitle: 'الجمال ومستحضرات التجميل المهنية لكل نوع بشرة',
    ourStoryTitle: 'قصتنا',
    ourStory1: 'تأسست كوزمت بمهمة بسيطة لكنها قوية: جعل منتجات الجمال ومستحضرات التجميل المهنية متاحة للجميع. نؤمن أن الجميع يستحقون الوصول إلى منتجات عالية الجودة تعزز جمالهم الطبيعي وتزيد ثقتهم بأنفسهم.',
    ourStory2: 'تشمل مجموعتنا المختارة بعناية منتجات من علامات تجارية موثوقة مثل أفيدا ودافينز، مما يضمن أن كل منتج يلبي معاييرنا الصارمة للجودة والفعالية والأمان.',
    qualityTitle: 'الجودة أولاً',
    qualityDesc: 'كل منتج يتم اختياره بعناية لجودته وفعاليته ومعايير الأمان.',
    customerTitle: 'رعاية العملاء',
    customerDesc: 'نحن ملتزمون بتقديم خدمة عملاء استثنائية ودعم في كل خطوة.',
    innovationTitle: 'الابتكار',
    innovationDesc: 'نبقى في المقدمة في اتجاهات الجمال ونوسع باستمرار مجموعة منتجاتنا.',
    ctaTitle: 'مستعد لاكتشاف منتجاتك المثالية؟',
    ctaDesc: 'تصفح مجموعتنا الواسعة من منتجات الجمال ومستحضرات التجميل المهنية.',
    shopButton: 'تسوق جميع الفئات',
    contactButton: 'اتصل بنا'
  },
  tr: {
    title: 'COSMT Hakkında - Profesyonel Güzellik ve Kozmetik Markası',
    description: 'COSMT\'nin profesyonel kalitede güzellik ve kozmetik ürünleri sağlama misyonunu öğrenin. Hikayemizi, değerlerimizi ve kaliteye olan bağlılığımızı keşfedin.',
    heroTitle: 'COSMT Hakkında',
    heroSubtitle: 'Her Cilt Tipi İçin Profesyonel Güzellik ve Kozmetik',
    ourStoryTitle: 'Hikayemiz',
    ourStory1: 'COSMT, basit ama güçlü bir misyonla kuruldu: profesyonel kalitede güzellik ve kozmetik ürünlerini herkese erişilebilir kılmak. Herkesin doğal güzelliğini artıran ve özgüvenini artıran yüksek kaliteli ürünlere erişimi hak ettiğine inanıyoruz.',
    ourStory2: 'Dikkatle seçilmiş koleksiyonumuz, AVEDA ve DAVINES gibi güvenilir markalardan ürünler içeriyor ve her ürünün kalite, etkinlik ve güvenlik standartlarımızı karşılamasını sağlıyor.',
    qualityTitle: 'Kalite Öncelikli',
    qualityDesc: 'Her ürün kalitesi, etkinliği ve güvenlik standartları için dikkatle seçilir.',
    customerTitle: 'Müşteri Hizmetleri',
    customerDesc: 'Her adımda olağanüstü müşteri hizmetleri ve destek sağlamaya kararlıyız.',
    innovationTitle: 'Yenilik',
    innovationDesc: 'Güzellik trendlerinin önünde kalıyor ve ürün yelpazemizi sürekli genişletiyoruz.',
    ctaTitle: 'Mükemmel Ürünlerinizi Keşfetmeye Hazır mısınız?',
    ctaDesc: 'Profesyonel güzellik ve kozmetik ürünlerinin geniş koleksiyonumuzu inceleyin.',
    shopButton: 'Tüm Kategorileri İncele',
    contactButton: 'İletişime Geçin'
  },
  de: {
    title: 'Über COSMT - Professionelle Beauty- und Kosmetikmarke',
    description: 'Erfahren Sie mehr über COSMTs Mission, professionelle Beauty- und Kosmetikprodukte bereitzustellen. Entdecken Sie unsere Geschichte, Werte und unser Engagement für Qualität.',
    heroTitle: 'Über COSMT',
    heroSubtitle: 'Professionelle Beauty- und Kosmetikprodukte für jeden Hauttyp',
    ourStoryTitle: 'Unsere Geschichte',
    ourStory1: 'COSMT wurde mit einer einfachen, aber kraftvollen Mission gegründet: professionelle Beauty- und Kosmetikprodukte für jeden zugänglich zu machen. Wir glauben, dass jeder Zugang zu hochwertigen Produkten verdient, die ihre natürliche Schönheit verbessern und ihr Selbstvertrauen stärken.',
    ourStory2: 'Unsere sorgfältig kuratierte Auswahl umfasst Produkte von vertrauenswürdigen Marken wie AVEDA und DAVINES und stellt sicher, dass jedes Produkt unseren strengen Standards für Qualität, Wirksamkeit und Sicherheit entspricht.',
    qualityTitle: 'Qualität zuerst',
    qualityDesc: 'Jedes Produkt wird sorgfältig nach Qualität, Wirksamkeit und Sicherheitsstandards ausgewählt.',
    customerTitle: 'Kundenservice',
    customerDesc: 'Wir sind verpflichtet, außergewöhnlichen Kundenservice und Support in jedem Schritt zu bieten.',
    innovationTitle: 'Innovation',
    innovationDesc: 'Wir bleiben den Beauty-Trends voraus und erweitern kontinuierlich unser Produktsortiment.',
    ctaTitle: 'Bereit, Ihre perfekten Produkte zu entdecken?',
    ctaDesc: 'Durchsuchen Sie unsere umfangreiche Sammlung professioneller Beauty- und Kosmetikprodukte.',
    shopButton: 'Alle Kategorien durchsuchen',
    contactButton: 'Kontaktieren Sie uns'
  },
  fr: {
    title: 'À propos de COSMT - Marque de beauté et cosmétiques professionnels',
    description: 'Découvrez la mission de COSMT de fournir des produits de beauté et cosmétiques de qualité professionnelle. Découvrez notre histoire, nos valeurs et notre engagement envers la qualité.',
    heroTitle: 'À propos de COSMT',
    heroSubtitle: 'Beauté et cosmétiques professionnels pour tous types de peau',
    ourStoryTitle: 'Notre histoire',
    ourStory1: 'COSMT a été fondé avec une mission simple mais puissante : rendre les produits de beauté et cosmétiques de qualité professionnelle accessibles à tous. Nous croyons que tout le monde mérite d\'avoir accès à des produits de haute qualité qui améliorent leur beauté naturelle et renforcent leur confiance.',
    ourStory2: 'Notre sélection soigneusement organisée comprend des produits de marques de confiance comme AVEDA et DAVINES, garantissant que chaque article répond à nos normes strictes de qualité, d\'efficacité et de sécurité.',
    qualityTitle: 'La qualité d\'abord',
    qualityDesc: 'Chaque produit est soigneusement sélectionné pour sa qualité, son efficacité et ses normes de sécurité.',
    customerTitle: 'Service client',
    customerDesc: 'Nous nous engageons à fournir un service client exceptionnel et un support à chaque étape.',
    innovationTitle: 'Innovation',
    innovationDesc: 'Nous restons à la pointe des tendances beauté et élargissons continuellement notre gamme de produits.',
    ctaTitle: 'Prêt à découvrir vos produits parfaits ?',
    ctaDesc: 'Parcourez notre vaste collection de produits de beauté et cosmétiques professionnels.',
    shopButton: 'Parcourir toutes les catégories',
    contactButton: 'Nous contacter'
  },
  es: {
    title: 'Acerca de COSMT - Marca de belleza y cosméticos profesionales',
    description: 'Conoce la misión de COSMT de proporcionar productos de belleza y cosméticos de calidad profesional. Descubre nuestra historia, valores y compromiso con la calidad.',
    heroTitle: 'Acerca de COSMT',
    heroSubtitle: 'Belleza y cosméticos profesionales para todo tipo de piel',
    ourStoryTitle: 'Nuestra historia',
    ourStory1: 'COSMT fue fundada con una misión simple pero poderosa: hacer accesibles los productos de belleza y cosméticos de calidad profesional para todos. Creemos que todos merecen acceso a productos de alta calidad que realcen su belleza natural y aumenten su confianza.',
    ourStory2: 'Nuestra selección cuidadosamente curada incluye productos de marcas de confianza como AVEDA y DAVINES, asegurando que cada artículo cumpla con nuestros estrictos estándares de calidad, efectividad y seguridad.',
    qualityTitle: 'Calidad primero',
    qualityDesc: 'Cada producto es cuidadosamente seleccionado por su calidad, efectividad y estándares de seguridad.',
    customerTitle: 'Atención al cliente',
    customerDesc: 'Estamos comprometidos a brindar un servicio al cliente excepcional y apoyo en cada paso.',
    innovationTitle: 'Innovación',
    innovationDesc: 'Mantenemos el liderazgo en las tendencias de belleza y expandimos continuamente nuestra gama de productos.',
    ctaTitle: '¿Listo para descubrir tus productos perfectos?',
    ctaDesc: 'Explora nuestra extensa colección de productos de belleza y cosméticos profesionales.',
    shopButton: 'Explorar todas las categorías',
    contactButton: 'Contáctanos'
  }
};

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  const content = aboutContent[locale as keyof typeof aboutContent] || aboutContent.en;

  return {
    title: content.title,
    description: content.description,
    keywords: 'about COSMT, beauty brand, cosmetics company, professional beauty, quality products, brand story',
    openGraph: {
      title: content.title,
      description: content.description,
      images: ['/images/about-og.jpg'],
    },
  };
}

export default function AboutPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const content = aboutContent[locale as keyof typeof aboutContent] || aboutContent.en;

  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1596462502278-27ddf263e05d?w=1200&h=400&fit=crop&crop=center"
          alt={content.heroTitle}
          fill
          style={{ objectFit: 'cover' }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-center">
          <div className="text-white">
            <h1 className="text-cosmt-4xl font-bold mb-4">{content.heroTitle}</h1>
            <p className="text-cosmt-lg max-w-2xl mx-auto">
              {content.heroSubtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="cosmt-container py-16">
        {/* Our Story */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-cosmt-3xl font-bold text-gray-900 mb-6">{content.ourStoryTitle}</h2>
          <p className="text-cosmt-lg text-gray-600 leading-relaxed mb-6">
            {content.ourStory1}
          </p>
          <p className="text-cosmt-lg text-gray-600 leading-relaxed">
            {content.ourStory2}
          </p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-cosmt-xl font-semibold text-gray-900 mb-2">{content.qualityTitle}</h3>
            <p className="text-gray-600">
              {content.qualityDesc}
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-cosmt-xl font-semibold text-gray-900 mb-2">{content.customerTitle}</h3>
            <p className="text-gray-600">
              {content.customerDesc}
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-cosmt-xl font-semibold text-gray-900 mb-2">{content.innovationTitle}</h3>
            <p className="text-gray-600">
              {content.innovationDesc}
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-cosmt-2xl font-bold text-gray-900 mb-4">
            {content.ctaTitle}
          </h2>
          <p className="text-cosmt-lg text-gray-600 mb-6">
            {content.ctaDesc}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`/${locale}/categories`}
              className="px-8 py-3 text-white transition-colors duration-200 font-medium"
              style={{ backgroundColor: '#003d38' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#002a25'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#003d38'}
            >
              {content.shopButton}
            </a>
            <a
              href={`/${locale}/contact`}
              className="px-8 py-3 border border-gray-300 text-gray-700 hover:border-green-600 hover:text-green-600 transition-colors duration-200 font-medium"
            >
              {content.contactButton}
            </a>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
