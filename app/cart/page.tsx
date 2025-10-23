'use client';

import React from 'react';
import { useCart } from '../../contexts/CartContext';
import { PageLayout } from '../../components/layout/PageLayout';
import { Button } from '../../components/ui/Button';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice, getTotalItems } = useCart();

  if (items.length === 0) {
    return (
      <PageLayout>
        <div className="cosmt-container py-16">
          <div className="text-center">
            <div className="mb-8">
              <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-4" />
              <h1 className="text-cosmt-4xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
              <p className="text-cosmt-lg text-gray-600 mb-8">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link href="/categories">
                <Button variant="primary">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen" style={{backgroundColor: '#fbfbfb'}}>
        <div className="cosmt-container py-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-gray-600 hover:text-green-600 transition-colors duration-200 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
            <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-lg text-gray-600 mt-2">
              {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''} in your cart
            </p>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-start space-x-6">
                    {/* Product Image */}
                    <div className="relative w-32 h-32 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                      <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                      
                      {/* Price */}
                      <div className="flex items-center space-x-2 mt-4">
                        <span className="text-xl font-bold text-green-600">${item.price.toFixed(2)}</span>
                        {item.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ${item.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end space-y-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-green-300 transition-colors duration-200"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-16 text-center font-semibold text-lg">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-green-300 transition-colors duration-200"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-800 transition-colors duration-200 flex items-center space-x-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear Cart Button */}
            <div className="mt-6">
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-800 transition-colors duration-200 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear Cart</span>
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Subtotal */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-base text-gray-600">Subtotal</span>
                <span className="text-lg font-semibold text-gray-900">
                  ${getTotalPrice().toFixed(2)}
                </span>
              </div>

              {/* Shipping */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-base text-gray-600">Shipping</span>
                <span className="text-base text-gray-900">
                  {getTotalPrice() >= 50 ? 'Free' : '$9.99'}
                </span>
              </div>

              {/* Tax */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-base text-gray-600">Tax</span>
                <span className="text-base text-gray-900">
                  ${(getTotalPrice() * 0.08).toFixed(2)}
                </span>
              </div>

              {/* Total */}
              <div className="border-t border-gray-300 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${(getTotalPrice() + (getTotalPrice() >= 50 ? 0 : 9.99) + (getTotalPrice() * 0.08)).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link href="/checkout">
                <Button className="w-full mb-4 bg-green-600 hover:bg-green-700 text-white text-lg py-3 rounded-lg font-semibold transition-colors duration-200">
                  Proceed to Checkout
                </Button>
              </Link>

              {/* Continue Shopping */}
              <Link href="/categories" className="block">
                <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50 text-lg py-3 rounded-lg transition-colors duration-200">
                  Continue Shopping
                </Button>
              </Link>

            </div>
          </div>
        </div>
        </div>
      </div>
    </PageLayout>
  );
}
