'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Star, Heart, Share2, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight, X, ShoppingCart } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { WishlistButton } from '../../../components/ui/WishlistButton';
import { useCart } from '../../../contexts/CartContext';
import { useProduct, useProductsByCategory } from '../../../hooks/useStorefrontData';
import { PageLayout } from '../../../components/layout/PageLayout';
import Link from 'next/link';

interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export default function ProductPageReal() {
  const params = useParams();
  const productId = parseInt(params.id as string);
  const { product, loading, error } = useProduct(productId);
  const { products: relatedProducts } = useProductsByCategory(product?.category || '');
  const { addToCart } = useCart();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showImageModal, setShowImageModal] = useState(false);

  // Mock reviews data (you can replace this with real data later)
  const reviews: Review[] = [
    {
      id: '1',
      name: 'Ahmet Yılmaz',
      rating: 5,
      date: '2024-01-15',
      comment: 'Excellent product! Really works as described.',
      verified: true
    },
    {
      id: '2',
      name: 'Ayşe Demir',
      rating: 4,
      date: '2024-01-10',
      comment: 'Good quality, fast delivery. Would recommend.',
      verified: true
    }
  ];

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.brand,
        description: product.description || product.name,
        quantity: quantity
      });
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cosmt-primary"></div>
            <span className="text-gray-600">Loading product...</span>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !product) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Not Found</h3>
            <p className="text-gray-600 mb-4">{error || 'The product you are looking for does not exist.'}</p>
            <Link href="/">
              <Button variant="primary">Back to Home</Button>
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  const images = [product.image]; // You can expand this to support multiple images
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-cosmt-primary">Home</Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-cosmt-primary">Categories</Link>
          <span>/</span>
          <span className="text-gray-900">{product.category}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                width={600}
                height={600}
                className="h-full w-full object-cover object-center cursor-pointer"
                onClick={() => setShowImageModal(true)}
              />
            </div>
            
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-lg ${
                      selectedImage === index ? 'ring-2 ring-cosmt-primary' : ''
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={150}
                      height={150}
                      className="h-full w-full object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-lg text-gray-600 mt-2">{product.brand}</p>
              
              <div className="flex items-center mt-4 space-x-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                {product.isBestSeller && (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                    Best Seller
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-gray-900">
                ₺{product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ₺{product.originalPrice.toFixed(2)}
                  </span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                    {discountPercentage}% OFF
                  </span>
                </>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">{product.description || 'No description available.'}</p>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
                <WishlistButton productId={product.id} />
                <Button variant="secondary" size="lg">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              {product.stock < 10 && product.stock > 0 && (
                <p className="text-sm text-orange-600">
                  Only {product.stock} left in stock!
                </p>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-cosmt-primary" />
                <span className="text-sm text-gray-600">Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-cosmt-primary" />
                <span className="text-sm text-gray-600">Secure Payment</span>
              </div>
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-5 h-5 text-cosmt-primary" />
                <span className="text-sm text-gray-600">30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">{review.name}</span>
                    {review.verified && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        Verified
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts
                .filter(p => p.id !== product.id)
                .slice(0, 4)
                .map((relatedProduct) => (
                  <Link key={relatedProduct.id} href={`/product/${relatedProduct.id}`}>
                    <div className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="aspect-square overflow-hidden rounded-lg">
                        <Image
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          width={300}
                          height={300}
                          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 line-clamp-2">
                          {relatedProduct.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{relatedProduct.brand}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-lg font-semibold text-gray-900">
                            ₺{relatedProduct.price.toFixed(2)}
                          </span>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-500 ml-1">
                              {relatedProduct.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <Image
              src={images[selectedImage]}
              alt={product.name}
              width={800}
              height={800}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </PageLayout>
  );
}
