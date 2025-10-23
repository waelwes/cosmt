'use client';

import React, { useState } from 'react';
import { 
  Save, 
  Truck, 
  Settings, 
  Globe, 
  Package,
  MapPin,
  CreditCard,
  Bell,
  Shield
} from 'lucide-react';
import DHLSettingsForm from '@/components/admin/DHLSettingsForm';
import YurticiSettingsForm from '@/components/admin/YurticiSettingsForm';
import PTTSettingsForm from '@/components/admin/PTTSettingsForm';

export default function ShippingSettingsPage() {
  const [activeTab, setActiveTab] = useState('dhl');
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    { id: 'dhl', name: 'DHL eCommerce', icon: Truck },
    { id: 'yurtici', name: 'Yurtiçi Kargo', icon: Truck },
    { id: 'ptt', name: 'PTT Kargo', icon: Truck },
    { id: 'general', name: 'General', icon: Settings },
    { id: 'zones', name: 'Shipping Zones', icon: Globe },
    { id: 'rates', name: 'Rates', icon: Package },
    { id: 'notifications', name: 'Notifications', icon: Bell }
  ];

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    alert('Shipping settings saved successfully!');
  };

  const renderDHLSettings = () => (
    <DHLSettingsForm />
  );

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Free Shipping Threshold ($)</label>
          <input
            type="number"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="50.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Standard Shipping Cost ($)</label>
          <input
            type="number"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="9.99"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Handling Fee ($)</label>
          <input
            type="number"
            step="0.01"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Processing Time (days)</label>
          <input
            type="number"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="1"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="realTimeRates"
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label htmlFor="realTimeRates" className="ml-2 text-sm text-gray-700">
            Enable Real-time Rate Calculation
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="signatureRequired"
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label htmlFor="signatureRequired" className="ml-2 text-sm text-gray-700">
            Require Signature for Delivery
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="insurance"
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label htmlFor="insurance" className="ml-2 text-sm text-gray-700">
            Include Shipping Insurance
          </label>
        </div>
      </div>
    </div>
  );

  const renderShippingZones = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-800">Domestic Shipping</h3>
            <p className="text-sm text-gray-600">Turkey - Free shipping over $50</p>
          </div>
          <button className="text-green-600 hover:text-green-700 text-sm font-medium">
            Edit Zone
          </button>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-800">Europe</h3>
            <p className="text-sm text-gray-600">EU Countries - $15.99 shipping</p>
          </div>
          <button className="text-green-600 hover:text-green-700 text-sm font-medium">
            Edit Zone
          </button>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-800">Rest of World</h3>
            <p className="text-sm text-gray-600">International - $25.99 shipping</p>
          </div>
          <button className="text-green-600 hover:text-green-700 text-sm font-medium">
            Edit Zone
          </button>
        </div>
      </div>

      <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:text-gray-700 hover:border-gray-400">
        + Add New Shipping Zone
      </button>
    </div>
  );

  const renderRates = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-800 mb-2">Express Shipping</h3>
          <p className="text-2xl font-bold text-green-600">$19.99</p>
          <p className="text-sm text-gray-600">1-2 business days</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-800 mb-2">Standard Shipping</h3>
          <p className="text-2xl font-bold text-green-600">$9.99</p>
          <p className="text-sm text-gray-600">3-5 business days</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-800 mb-2">Economy Shipping</h3>
          <p className="text-2xl font-bold text-green-600">$4.99</p>
          <p className="text-sm text-gray-600">5-7 business days</p>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Package className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Rate Configuration</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>Shipping rates are calculated based on weight, dimensions, and destination.</p>
              <p className="mt-1">Configure rate rules in the shipping zones section.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="shippingNotifications"
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label htmlFor="shippingNotifications" className="ml-2 text-sm text-gray-700">
            Send shipping notifications to customers
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="adminNotifications"
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label htmlFor="adminNotifications" className="ml-2 text-sm text-gray-700">
            Notify admin of shipping updates
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="trackingEmails"
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label htmlFor="trackingEmails" className="ml-2 text-sm text-gray-700">
            Send tracking information via email
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Notification Email</label>
        <input
          type="email"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="shipping@cosmat.com"
        />
      </div>
    </div>
  );

  const renderYurticiSettings = () => (
    <YurticiSettingsForm />
  );

  const renderPTTSettings = () => (
    <PTTSettingsForm />
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dhl':
        return renderDHLSettings();
      case 'yurtici':
        return renderYurticiSettings();
      case 'ptt':
        return renderPTTSettings();
      case 'general':
        return renderGeneralSettings();
      case 'zones':
        return renderShippingZones();
      case 'rates':
        return renderRates();
      case 'notifications':
        return renderNotifications();
      default:
        return renderDHLSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Settings Card */}
      <div className="analytics-card p-0">
        {/* Header */}
        <div className="px-4 pt-4 pb-3 border-b">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Shipping Settings</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Configure shipping providers and manage delivery options</p>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="px-4 pt-3 pb-0">
          <nav className="flex space-x-8 tab-navigation">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-[#00514B] text-[#00514B]'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="px-4 py-4">
          {renderTabContent()}
        </div>

        {/* Save Button */}
        <div className="px-4 py-3 bg-gray-50 border-t flex justify-end" style={{ borderTopColor: '#eef2f6' }}>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}