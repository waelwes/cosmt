'use client';

import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/ui/Button';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContextBypass';
import { useRouter } from 'next/navigation';
import { buildProductPath } from '../../utils/slug';

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      brand: item.brand,
      category: item.category,
      slug: item.slug,
      quantity: 1
    });
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromWishlist(itemId);
  };

  const handleClearWishlist = () => {
    clearWishlist();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <div className="cosmt-container py-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-cosmt-2xl font-bold text-gray-900 mb-4">Please sign in</h1>
              <p className="text-gray-600 mb-6">You need to be signed in to view your wishlist.</p>
              <Button onClick={() => router.push('/signin')}>
                Sign In
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <div className="cosmt-container py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-cosmt-3xl font-bold text-gray-900">My Wishlist</h1>
                <p className="text-gray-600 mt-2">
                  {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
                </p>
              </div>
              {wishlistItems.length > 0 && (
                <Button
                  variant="outline"
                  onClick={handleClearWishlist}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>

            {/* Wishlist Items */}
            {wishlistItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group">
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden">
                      <Link href={buildProductPath({ 
                        name: item.name, 
                        categorySlug: item.categories?.slug, 
                        subcategorySlug: null, 
                        productSlug: item.slug, 
                        id: item.id 
                      })}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                      
                      {/* Wishlist Button */}
                      <div className="absolute top-3 right-3">
        <button
          onClick={() => handleRemoveItem(item.id)}
          className="p-2 text-red-600 hover:text-red-700 transition-colors"
          title="Remove from wishlist"
        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <div className="mb-2">
                        <p className="text-cosmt-xs font-medium text-gray-500 uppercase tracking-wide">
                          {item.brand}
                        </p>
                        <h3 className="text-cosmt-sm font-semibold text-gray-900 line-clamp-2">
                          <Link href={`/product/${item.slug}`} className="hover:text-green-600">
                            {item.name}
                          </Link>
                        </h3>
                      </div>

                      {/* Price */}
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="text-cosmt-lg font-bold text-gray-900">
                          ${item.price.toFixed(2)}
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-cosmt-sm text-gray-500 line-through">
                            ${item.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleAddToCart(item)}
                          size="sm"
                          className="flex-1"
                        >
                          <ShoppingBag className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="px-3"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-cosmt-xl font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Start adding products you love to your wishlist. You can save items for later and easily find them when you're ready to buy.
                </p>
                <Button onClick={() => router.push('/')}>
                  Start Shopping
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
