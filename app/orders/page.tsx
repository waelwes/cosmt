'use client';

import React from 'react';
import { Package, Calendar, CreditCard, MapPin } from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Mock order data
  const orders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'Delivered',
      total: 89.97,
      items: [
        { name: 'AVEDA Invati Advanced™ Exfoliating Shampoo', quantity: 1, price: 45.00 },
        { name: 'Nourishing Conditioner', quantity: 1, price: 42.00 },
        { name: 'Hair Mask Treatment', quantity: 1, price: 2.97 }
      ],
      shippingAddress: {
        street: '123 Beauty Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001'
      }
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      status: 'Shipped',
      total: 67.50,
      items: [
        { name: 'Premium Hair Oil', quantity: 2, price: 32.50 },
        { name: 'Scalp Treatment', quantity: 1, price: 2.50 }
      ],
      shippingAddress: {
        street: '123 Beauty Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001'
      }
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-cosmt-2xl font-bold text-gray-900 mb-4">Please sign in</h1>
          <p className="text-gray-600 mb-6">You need to be signed in to view your orders.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Go to Homepage
          </button>
        </div>
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
          <div className="mb-8">
            <h1 className="text-cosmt-3xl font-bold text-gray-900">Order History</h1>
            <p className="text-gray-600 mt-2">Track and manage your orders</p>
          </div>

          {/* Orders List */}
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-cosmt-lg font-semibold text-gray-900">Order #{order.id}</h3>
                      <div className="flex items-center mt-1 text-cosmt-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        Placed on {new Date(order.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="mt-3 sm:mt-0">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-cosmt-sm font-medium ${
                        order.status === 'Delivered' 
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'Shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <h4 className="text-cosmt-base font-medium text-gray-900 mb-4">Items Ordered</h4>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div className="flex items-center">
                          <Package className="w-4 h-4 text-gray-400 mr-3" />
                          <div>
                            <p className="text-cosmt-sm font-medium text-gray-900">{item.name}</p>
                            <p className="text-cosmt-xs text-gray-600">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="text-cosmt-sm font-medium text-gray-900">${item.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-cosmt-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>
                          {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-cosmt-lg font-bold text-gray-900">${order.total.toFixed(2)}</p>
                        <p className="text-cosmt-xs text-gray-600">Total</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="mt-6 flex space-x-3">
                    <button className="px-4 py-2 border border-gray-300 text-cosmt-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                      Track Package
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-cosmt-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                      Reorder
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-cosmt-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                      Leave Review
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {orders.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-cosmt-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
