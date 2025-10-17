'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Star, Heart, Share2, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { WishlistButton } from '../../../components/ui/WishlistButton';
import { useCart } from '../../../contexts/CartContext';
import { getProductById } from '../../../data/products';
import { PageLayout } from '../../../components/layout/PageLayout';

interface ProductDetail {
  id: string;
  name: string;
  brand: string;
  price: string;
  originalPrice?: string;
  images: string[];
  category: string;
  description: string;
  longDescription: string;
  ingredients: string[];
  usage: string[];
  rating: number;
  reviews: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  inStock: boolean;
  size?: string;
  weight?: string;
}

interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

interface RelatedProduct {
  id: string;
  name: string;
  brand: string;
  price: string;
  originalPrice?: string;
  image: string;
  rating: number;
  reviews: number;
}

// Sample review data
const sampleReviews: Review[] = [
  {
    id: '1',
    name: 'Sarah M.',
    rating: 5,
    date: '2024-01-15',
    comment: 'Absolutely love this product! It has transformed my hair completely. The results were visible after just one use.',
    verified: true
  },
  {
    id: '2',
    name: 'Jessica L.',
    rating: 4,
    date: '2024-01-10',
    comment: 'Great quality and fast shipping. My hair feels so much healthier now. Would definitely recommend!',
    verified: true
  },
  {
    id: '3',
    name: 'Maria G.',
    rating: 5,
    date: '2024-01-08',
    comment: 'This is my second purchase. The product is amazing and the customer service is excellent.',
    verified: true
  },
  {
    id: '4',
    name: 'Emily R.',
    rating: 4,
    date: '2024-01-05',
    comment: 'Good product overall. Takes a bit of time to see results but worth the wait.',
    verified: false
  },
  {
    id: '5',
    name: 'Anna K.',
    rating: 5,
    date: '2024-01-02',
    comment: 'Perfect! Exactly what I was looking for. Will definitely buy again.',
    verified: true
  }
];

// Sample related products
const getRelatedProducts = (category: string, currentId: string): RelatedProduct[] => {
  const relatedProducts: RelatedProduct[] = [
    {
      id: '2',
      name: 'Hydrating Hair Mask',
      brand: 'AVEDA',
      price: '$45.00',
      originalPrice: '$55.00',
      image: '/api/placeholder/300/300',
      rating: 4.8,
      reviews: 124
    },
    {
      id: '3',
      name: 'Repairing Treatment',
      brand: 'DAVINES',
      price: '$38.00',
      image: '/api/placeholder/300/300',
      rating: 4.6,
      reviews: 89
    },
    {
      id: '4',
      name: 'Nourishing Oil',
      brand: 'Oribe',
      price: '$52.00',
      image: '/api/placeholder/300/300',
      rating: 4.9,
      reviews: 156
    },
    {
      id: '5',
      name: 'Volumizing Spray',
      brand: 'Bumble and bumble',
      price: '$28.00',
      image: '/api/placeholder/300/300',
      rating: 4.4,
      reviews: 67
    }
  ];
  
  return relatedProducts.filter(p => p.id !== currentId).slice(0, 4);
};

// Convert our Product interface to the expected format
const convertProduct = (product: any) => {
  if (!product) return null;

  return {
    id: product.id,
    name: product.name,
    brand: product.brand,
    price: `$${product.price.toFixed(2)}`,
    originalPrice: product.originalPrice ? `$${product.originalPrice.toFixed(2)}` : null,
    images: product.images || [product.image],
    category: product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : 'Category',
    description: product.shortDescription || product.description,
    longDescription: product.description,
    ingredients: product.ingredients || [],
    usage: product.howToUse ? [product.howToUse] : [],
    rating: product.rating,
    reviews: product.reviews,
    isNew: product.isNew,
    isBestSeller: product.isBestSeller,
    inStock: product.inStock,
    size: product.size,
    weight: product.weight || product.volume,
  };
};

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ingredients');
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  useEffect(() => {
    if (params.id) {
      const productData = getProductById(params.id as string);
      const convertedProduct = convertProduct(productData);
      setProduct(convertedProduct);
      setIsLoading(false);
    }
  }, [params.id]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart({
          id: parseInt(product.id),
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.images[0],
          category: product.category,
          description: product.description,
        });
      }
    }
  };

  const nextImage = () => {
    if (product) {
      setSelectedImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product) {
      setSelectedImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-cosmt-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Button variant="primary" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <PageLayout>
      {/* Breadcrumb */}
      <div className="py-4">
        <div className="cosmt-container">
          <nav className="flex items-center space-x-2 text-cosmt-sm">
            <a href="/" className="text-gray-500 hover:text-gray-700">Home</a>
            <span className="text-gray-400">/</span>
            <a href={`/categories/${product.category.toLowerCase()}`} className="text-gray-500 hover:text-gray-700">
              {product.category}
            </a>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="cosmt-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images - Sticky */}
          <div className="space-y-4 sticky top-8 h-fit">
            {/* Main Image */}
            <div 
              className={`relative aspect-square bg-gray-100 overflow-hidden cursor-pointer transition-all duration-300 ${
                isImageZoomed ? 'fixed inset-0 z-50 bg-black' : ''
              }`}
              onClick={() => setIsImageZoomed(!isImageZoomed)}
            >
              <Image
                src={product.images[selectedImageIndex]}
                alt={product.name}
                width={600}
                height={600}
                className={`w-full h-full object-cover transition-transform duration-300 ${
                  isImageZoomed ? 'scale-150' : 'hover:scale-105'
                }`}
              />
              
              {isImageZoomed && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsImageZoomed(false);
                  }}
                  className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              )}

              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 transition-colors duration-200"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 transition-colors duration-200"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col space-y-2">
                {product.isNew && (
                  <span className="px-3 py-1 bg-green-600 text-white text-cosmt-xs font-medium">
                    New
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="px-3 py-1 bg-amber-600 text-white text-cosmt-xs font-medium">
                    Best Seller
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square overflow-hidden ${
                      selectedImageIndex === index ? 'ring-2 ring-green-600' : ''
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6 relative max-w-md">
            {/* Share Button - Top Right */}
            <div className="absolute top-0 right-0">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Header */}
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">{product.brand}</p>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-bold text-gray-900">{product.price}</span>
              {product.originalPrice && (
                <span className="text-lg text-gray-500 line-through">
                  {product.originalPrice}
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-600 leading-relaxed">{product.longDescription}</p>
            </div>

            {/* Product Details */}
            <div className="space-y-2 text-sm">
              {product.size && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Size:</span>
                  <span className="text-gray-900">{product.size}</span>
                </div>
              )}
              {product.weight && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Weight:</span>
                  <span className="text-gray-900">{product.weight}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Category:</span>
                <span className="text-gray-900">{product.category}</span>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-900">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1"
                >
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                <WishlistButton
                  product={{
                    id: product.id,
                    name: product.name,
                    price: parseFloat(product.price),
                    originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : undefined,
                    image: product.images[0],
                    brand: product.brand,
                    category: product.category,
                    slug: product.id
                  }}
                  variant="button"
                  size="md"
                />
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <Truck className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Secure Payment</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button 
                onClick={() => setActiveTab('ingredients')}
                className={`py-4 px-1 border-b-2 font-medium text-cosmt-base transition-colors duration-200 ${
                  activeTab === 'ingredients' 
                    ? 'border-green-600 text-green-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Ingredients
              </button>
              <button 
                onClick={() => setActiveTab('usage')}
                className={`py-4 px-1 border-b-2 font-medium text-cosmt-base transition-colors duration-200 ${
                  activeTab === 'usage' 
                    ? 'border-green-600 text-green-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                How to Use
              </button>
              <button 
                onClick={() => setActiveTab('reviews')}
                className={`py-4 px-1 border-b-2 font-medium text-cosmt-base transition-colors duration-200 ${
                  activeTab === 'reviews' 
                    ? 'border-green-600 text-green-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Reviews ({sampleReviews.length})
              </button>
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'ingredients' && (
              <div>
                <h3 className="text-cosmt-lg font-semibold text-gray-900 mb-4">Key Ingredients</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="text-cosmt-base text-gray-700">{ingredient}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'usage' && (
              <div>
                <h3 className="text-cosmt-lg font-semibold text-gray-900 mb-4">How to Use</h3>
                <div className="space-y-4">
                  {product.usage.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-cosmt-sm font-medium">
                        {index + 1}
                      </div>
                      <p className="text-cosmt-base text-gray-700">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-cosmt-lg font-semibold text-gray-900">Customer Reviews</h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-cosmt-sm text-gray-600">
                      {product.rating} out of 5 ({product.reviews} reviews)
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  {sampleReviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{review.name}</span>
                          {review.verified && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-cosmt-xs font-medium">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-cosmt-sm text-gray-500">{review.date}</span>
                        </div>
                      </div>
                      <p className="text-cosmt-base text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h3 className="text-cosmt-2xl font-bold text-gray-900 mb-8">You Might Also Like</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getRelatedProducts(product.category, product.id).map((relatedProduct) => (
              <div key={relatedProduct.id} className="group">
                <div className="relative aspect-square bg-gray-100 overflow-hidden mb-4">
                  <Image
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-cosmt-sm text-gray-500">{relatedProduct.brand}</p>
                  <h4 className="font-medium text-gray-900 group-hover:text-green-600 transition-colors duration-200">
                    {relatedProduct.name}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(relatedProduct.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-cosmt-xs text-gray-600">
                      {relatedProduct.rating} ({relatedProduct.reviews})
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">{relatedProduct.price}</span>
                    {relatedProduct.originalPrice && (
                      <span className="text-cosmt-sm text-gray-500 line-through">
                        {relatedProduct.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
