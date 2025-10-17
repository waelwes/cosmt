import { Metadata } from 'next';
import { CategoryPage } from '@/components/pages/CategoryPage';
import { getCategoryBySlug } from '../../../data/categories';

export const metadata: Metadata = {
  title: 'Beauty Tools & Devices - Professional Beauty Equipment | COSMT',
  description: 'Professional beauty tools and devices including face rollers, cleansing brushes, LED masks, and hair removal devices.',
  keywords: 'beauty tools, face roller, cleansing brush, LED mask, microcurrent device, hair removal, beauty devices',
  openGraph: {
    title: 'Beauty Tools & Devices - Professional Beauty Equipment | COSMT',
    description: 'Professional beauty tools and devices including face rollers, cleansing brushes, and LED masks.',
    images: ['/images/tools-devices-og.jpg'],
  },
};

export default function ToolsDevicesPage() {
  const category = getCategoryBySlug('tools-devices');
  
  if (!category) {
    return <div>Category not found</div>;
  }

  return <CategoryPage category={category} />;
}
