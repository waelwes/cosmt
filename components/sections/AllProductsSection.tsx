'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ServiceContainer } from '@/lib/di/ServiceContainer';
import { IProductService } from '@/lib/factories/interfaces/IProductService';
import { buildProductPath } from '@/utils/slug';

interface ProductItem {
  id: number;
  name: string;
  brand?: string;
  price: number;
  original_price?: number | null;
  image?: string | null;
  categories?: { id: number; name: string; slug: string } | null;
  subcategories?: { id: number; name: string; slug: string } | null;
  rating?: number;
  reviews?: number;
}

export const AllProductsSection: React.FC = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);
        const productService: IProductService = ServiceContainer
          .getInstance()
          .getServiceFactory()
          .createProductService();
        const data = await productService.getProducts();
        setProducts(data as unknown as ProductItem[]);
      } catch (e: any) {
        setError(e?.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-600">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-600">
        <p>Error loading products: {error}</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-600">No products found.</p>
      </div>
    );
  }

  return (
    <section className="py-4">
      <div className="mb-4 text-sm text-gray-600">
        Showing {products.length} products
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => {
          const href = buildProductPath(p.name, p.categories?.slug || undefined, p.subcategories?.slug || undefined, p.id);
          const imgSrc = (p.image && p.image.trim().length > 0) ? p.image : '/images/product-placeholder.jpg';
          return (
            <div key={p.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <Link href={href} className="relative block overflow-hidden rounded-t-lg">
                <Image
                  src={imgSrc}
                  alt={p.name}
                  width={300}
                  height={300}
                  className="w-full h-48 object-cover"
                />
              </Link>
              <div className="p-4">
                {p.brand && <p className="text-sm text-gray-500">{p.brand}</p>}
                <h3 className="text-lg font-semibold text-gray-900 mt-1">
                  <Link href={href}>{p.name}</Link>
                </h3>
                <div className="flex items-baseline mt-3">
                  <span className="text-xl font-bold text-gray-900">${p.price.toFixed(2)}</span>
                  {p.original_price && (
                    <span className="text-sm text-gray-500 line-through ml-2">${p.original_price.toFixed(2)}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
