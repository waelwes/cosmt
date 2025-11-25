import type { Metadata } from 'next';
import BrandsPageContent from './BrandsPageContent';

// Language-specific content
const brandsContent = {
  en: {
    title: 'Brands | Cosmat',
    description: 'Discover all our featured beauty and cosmetic brands.',
    breadcrumbHome: 'Home',
    breadcrumbBrands: 'Brands',
    allBrands: 'All Brands',
    brandsFound: 'brands found',
    sortBy: 'Sort by:',
    popular: 'Popular Brands',
    alphabetical: 'A-Z',
    featured: 'Featured',
    newBrands: 'New Brands',
    filters: 'Filters',
    category: 'Category',
    clearFilters: 'Clear All Filters',
    noImage: 'No Image',
    viewProducts: 'View Products'
  },
  ar: {
    title: 'العلامات التجارية | كوزمت',
    description: 'اكتشف جميع العلامات التجارية المميزة للجمال والتجميل.',
    breadcrumbHome: 'الرئيسية',
    breadcrumbBrands: 'العلامات التجارية',
    allBrands: 'جميع العلامات التجارية',
    brandsFound: 'علامة تجارية موجودة',
    sortBy: 'ترتيب حسب:',
    popular: 'العلامات التجارية الشائعة',
    alphabetical: 'أ-ي',
    featured: 'مميز',
    newBrands: 'العلامات التجارية الجديدة',
    filters: 'المرشحات',
    category: 'الفئة',
    clearFilters: 'مسح جميع المرشحات',
    noImage: 'لا توجد صورة',
    viewProducts: 'عرض المنتجات'
  },
  tr: {
    title: 'Markalar | Cosmat',
    description: 'Tüm öne çıkan güzellik ve kozmetik markalarımızı keşfedin.',
    breadcrumbHome: 'Ana Sayfa',
    breadcrumbBrands: 'Markalar',
    allBrands: 'Tüm Markalar',
    brandsFound: 'marka bulundu',
    sortBy: 'Sırala:',
    popular: 'Popüler Markalar',
    alphabetical: 'A-Z',
    featured: 'Öne Çıkan',
    newBrands: 'Yeni Markalar',
    filters: 'Filtreler',
    category: 'Kategori',
    clearFilters: 'Tüm Filtreleri Temizle',
    noImage: 'Resim Yok',
    viewProducts: 'Ürünleri Görüntüle'
  },
  de: {
    title: 'Marken | Cosmat',
    description: 'Entdecken Sie alle unsere vorgestellten Schönheits- und Kosmetikmarken.',
    breadcrumbHome: 'Startseite',
    breadcrumbBrands: 'Marken',
    allBrands: 'Alle Marken',
    brandsFound: 'Marken gefunden',
    sortBy: 'Sortieren nach:',
    popular: 'Beliebte Marken',
    alphabetical: 'A-Z',
    featured: 'Ausgewählt',
    newBrands: 'Neue Marken',
    filters: 'Filter',
    category: 'Kategorie',
    clearFilters: 'Alle Filter löschen',
    noImage: 'Kein Bild',
    viewProducts: 'Produkte anzeigen'
  },
  fr: {
    title: 'Marques | Cosmat',
    description: 'Découvrez toutes nos marques de beauté et de cosmétiques en vedette.',
    breadcrumbHome: 'Accueil',
    breadcrumbBrands: 'Marques',
    allBrands: 'Toutes les marques',
    brandsFound: 'marques trouvées',
    sortBy: 'Trier par:',
    popular: 'Marques populaires',
    alphabetical: 'A-Z',
    featured: 'En vedette',
    newBrands: 'Nouvelles marques',
    filters: 'Filtres',
    category: 'Catégorie',
    clearFilters: 'Effacer tous les filtres',
    noImage: 'Aucune image',
    viewProducts: 'Voir les produits'
  },
  es: {
    title: 'Marcas | Cosmat',
    description: 'Descubre todas nuestras marcas destacadas de belleza y cosméticos.',
    breadcrumbHome: 'Inicio',
    breadcrumbBrands: 'Marcas',
    allBrands: 'Todas las marcas',
    brandsFound: 'marcas encontradas',
    sortBy: 'Ordenar por:',
    popular: 'Marcas populares',
    alphabetical: 'A-Z',
    featured: 'Destacado',
    newBrands: 'Marcas nuevas',
    filters: 'Filtros',
    category: 'Categoría',
    clearFilters: 'Limpiar todos los filtros',
    noImage: 'Sin imagen',
    viewProducts: 'Ver productos'
  }
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const content = brandsContent[locale as keyof typeof brandsContent] || brandsContent.en;

  return {
    title: content.title,
    description: content.description,
    openGraph: {
      title: content.title,
      description: content.description,
      type: 'website'
    }
  };
}

export default async function BrandsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const content = brandsContent[locale as keyof typeof brandsContent] || brandsContent.en;

  return <BrandsPageContent locale={locale} content={content} />;
}
