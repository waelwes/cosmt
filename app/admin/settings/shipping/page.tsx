'use client';

import React, { useState } from 'react';
import { 
  Truck, 
  Save, 
  Plus, 
  Edit, 
  Trash2, 
  MapPin,
  Clock,
  DollarSign,
  Package,
  Globe,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ShippingSettingsPage() {
  const [shippingZones, setShippingZones] = useState([
    {
      id: 1,
      name: 'United States',
      countries: ['US'],
      methods: [
        {
          id: 1,
          name: 'Standard Shipping',
          cost: 5.99,
          freeThreshold: 50,
          estimatedDays: '3-5',
          enabled: true
        },
        {
          id: 2,
          name: 'Express Shipping',
          cost: 12.99,
          freeThreshold: 100,
          estimatedDays: '1-2',
          enabled: true
        }
      ]
    },
    {
      id: 2,
      name: 'Europe',
      countries: ['GB', 'DE', 'FR', 'IT', 'ES'],
      methods: [
        {
          id: 3,
          name: 'Standard International',
          cost: 15.99,
          freeThreshold: 100,
          estimatedDays: '7-14',
          enabled: true
        }
      ]
    },
    {
      id: 3,
      name: 'Rest of World',
      countries: ['*'],
      methods: [
        {
          id: 4,
          name: 'International Shipping',
          cost: 25.99,
          freeThreshold: 200,
          estimatedDays: '10-21',
          enabled: true
        }
      ]
    }
  ]);

  const [settings, setSettings] = useState({
    enableShipping: true,
    freeShippingThreshold: 50,
    enableTracking: true,
    enableInsurance: true,
    insuranceCost: 2.99,
    enableSignature: false,
    signatureCost: 5.99,
    enableSaturdayDelivery: false,
    saturdayCost: 8.99,
    enableHolidayDelivery: false,
    holidayCost: 12.99,
    defaultWeight: 1.0,
    maxWeight: 50.0,
    enableDimensionalWeight: true,
    enableRealTimeRates: true
  });

  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'AU', name: 'Australia' },
    { code: 'JP', name: 'Japan' },
    { code: 'CN', name: 'China' }
  ];

  const handleSave = () => {
    console.log('Shipping settings saved:', settings);
  };

  const getCountryName = (code: string) => {
    const country = countries.find(c => c.code === code);
    return country ? country.name : code;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg  border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Shipping Settings</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Configure shipping zones, rates, and delivery options</p>
          </div>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>

      {/* General Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg  border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          General Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Free Shipping Threshold ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={settings.freeShippingThreshold}
              onChange={(e) => setSettings(prev => ({ ...prev, freeShippingThreshold: parseFloat(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Default Package Weight (lbs)
            </label>
            <input
              type="number"
              step="0.1"
              value={settings.defaultWeight}
              onChange={(e) => setSettings(prev => ({ ...prev, defaultWeight: parseFloat(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Maximum Package Weight (lbs)
            </label>
            <input
              type="number"
              step="0.1"
              value={settings.maxWeight}
              onChange={(e) => setSettings(prev => ({ ...prev, maxWeight: parseFloat(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Insurance Cost ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={settings.insuranceCost}
              onChange={(e) => setSettings(prev => ({ ...prev, insuranceCost: parseFloat(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Shipping Zones */}
      <div className="bg-white dark:bg-gray-800 rounded-lg  border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Shipping Zones
          </h2>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Zone
          </Button>
        </div>
        
        <div className="space-y-6">
          {shippingZones.map((zone) => (
            <div key={zone.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{zone.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {zone.countries.includes('*') ? 'All other countries' : zone.countries.map(getCountryName).join(', ')}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                {zone.methods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-gray-100 dark:bg-gray-600 rounded-lg">
                        <Truck className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{method.name}</h4>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            <DollarSign className="w-4 h-4 inline mr-1" />
                            ${method.cost}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="w-4 h-4 inline mr-1" />
                            {method.estimatedDays} days
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Free over ${method.freeThreshold}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        method.enabled 
                          ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                          : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                      }`}>
                        {method.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Options */}
      <div className="bg-white dark:bg-gray-800 rounded-lg  border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Package className="w-5 h-5 mr-2" />
          Delivery Options
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Enable Tracking</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Provide tracking numbers for shipments</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableTracking}
                onChange={(e) => setSettings(prev => ({ ...prev, enableTracking: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Enable Insurance</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Add insurance to shipments for protection</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableInsurance}
                onChange={(e) => setSettings(prev => ({ ...prev, enableInsurance: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Enable Signature Required</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Require signature for delivery confirmation</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableSignature}
                onChange={(e) => setSettings(prev => ({ ...prev, enableSignature: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Enable Saturday Delivery</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Offer Saturday delivery option</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableSaturdayDelivery}
                onChange={(e) => setSettings(prev => ({ ...prev, enableSaturdayDelivery: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Enable Real-time Rates</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Get live shipping rates from carriers</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableRealTimeRates}
                onChange={(e) => setSettings(prev => ({ ...prev, enableRealTimeRates: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
