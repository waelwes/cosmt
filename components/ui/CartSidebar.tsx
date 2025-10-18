'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import { Button } from './Button';
import { Minus, Plus, ShoppingBag, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCart();

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      // Add a small delay to prevent jump
      const timer = setTimeout(() => {
        document.body.style.overflow = 'hidden';
      }, 100);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Helper function to safely format price
  const formatPrice = (price: string | number): string => {
    if (typeof price === 'string') {
      // If it's already a string with $, return as is
      if (price.includes('$')) {
        return price;
      }
      // If it's a string number, parse and format
      const numPrice = parseFloat(price);
      return isNaN(numPrice) ? '$0.00' : `$${numPrice.toFixed(2)}`;
    }
    // If it's a number, format it
    return `$${price.toFixed(2)}`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Full Screen Shadow Overlay */}
      <div 
        className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 z-[60] opacity-100 pointer-events-auto"
        onClick={onClose}
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw', 
          height: '100vh',
          zIndex: 60,
          transition: 'opacity 400ms cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 w-full max-w-md bg-white border-l border-gray-200 transform z-[70] translate-x-0" style={{ 
        boxShadow: '-4px 0 15px rgba(0, 0, 0, 0.1)',
        transition: 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 400ms cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'fixed',
        top: 0,
        right: 0,
        height: '100vh',
        width: '100%',
        maxWidth: '28rem', // Same width for both mobile and desktop
        display: 'flex',
        flexDirection: 'column',
        WebkitOverflowScrolling: 'touch' // Smooth scrolling on iOS
      }}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-cosmt-lg font-bold text-gray-900">
              Cart ({getTotalItems()})
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 min-h-0">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-cosmt-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-cosmt-sm text-gray-600 mb-6">
                  Add some products to get started
                </p>
                <Link href="/categories" onClick={onClose}>
                  <Button variant="primary">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-0">
                {items.map((item, index) => (
                  <div key={item.id} className={`flex items-start space-x-3 p-3 ${index > 0 ? 'border-t border-gray-200' : ''}`}>
                    {/* Product Image */}
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      {/* Top row: Product Name and X */}
                      <div className="flex items-start justify-between mb-0.5">
                        <h4 className="text-xs font-medium text-gray-900 line-clamp-2 flex-1 pr-2">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors duration-200 flex-shrink-0"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      
                      <p className="text-xs text-gray-500 mb-1.5">{item.category}</p>
                      
                      {/* Bottom row: Counter and Price */}
                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-200 rounded-sm overflow-hidden h-5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-5 h-5 flex items-center justify-center hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-900"
                          >
                            <Minus className="w-2 h-2" />
                          </button>
                          <div className="w-5 h-5 flex items-center justify-center border-l border-r border-gray-200">
                            <span className="text-xs font-medium text-gray-900">{item.quantity}</span>
                          </div>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-5 h-5 flex items-center justify-center hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-900"
                          >
                            <Plus className="w-2 h-2" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="flex items-center space-x-1">
                          <span className="text-xs font-bold text-gray-900">{formatPrice(item.price)}</span>
                          {item.originalPrice && (
                            <span className="text-xs text-gray-500 line-through">
                              {formatPrice(item.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-4 bg-white flex-shrink-0 mt-auto">
              {/* Total */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-cosmt-lg font-bold text-gray-900">Total</span>
                <span className="text-cosmt-xl font-bold text-gray-900">
                  ${(getTotalPrice() + (getTotalPrice() >= 50 ? 0 : 9.99)).toFixed(2)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="cart-buttons-container">
                <Link href="/checkout" onClick={onClose} className="flex-1">
                  <Button variant="primary" className="w-full cart-button-left">
                    Proceed to Checkout
                  </Button>
                </Link>
                <Link href="/cart" onClick={onClose} className="flex-1">
                  <Button variant="outline" className="w-full cart-button-right">
                    View Full Cart
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
