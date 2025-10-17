'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  Save, 
  Mail, 
  Smartphone, 
  Globe,
  Settings,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotificationsSettingsPage() {
  const [notifications, setNotifications] = useState({
    email: {
      newOrder: true,
      orderShipped: true,
      orderDelivered: true,
      orderCancelled: true,
      lowStock: true,
      paymentReceived: true,
      refundProcessed: true,
      customerRegistration: true,
      newsletter: false,
      marketing: false
    },
    sms: {
      newOrder: false,
      orderShipped: true,
      orderDelivered: true,
      orderCancelled: true,
      lowStock: false,
      paymentReceived: false,
      refundProcessed: true,
      customerRegistration: false
    },
    push: {
      newOrder: true,
      orderShipped: true,
      orderDelivered: true,
      orderCancelled: true,
      lowStock: true,
      paymentReceived: true,
      refundProcessed: true,
      customerRegistration: false,
      marketing: false
    }
  });

  const [emailTemplates, setEmailTemplates] = useState([
    {
      id: 1,
      name: 'Order Confirmation',
      subject: 'Order Confirmation - #{orderNumber}',
      type: 'newOrder',
      enabled: true,
      lastModified: '2024-01-15'
    },
    {
      id: 2,
      name: 'Order Shipped',
      subject: 'Your order has been shipped!',
      type: 'orderShipped',
      enabled: true,
      lastModified: '2024-01-15'
    },
    {
      id: 3,
      name: 'Order Delivered',
      subject: 'Your order has been delivered',
      type: 'orderDelivered',
      enabled: true,
      lastModified: '2024-01-15'
    },
    {
      id: 4,
      name: 'Low Stock Alert',
      subject: 'Low Stock Alert - {productName}',
      type: 'lowStock',
      enabled: true,
      lastModified: '2024-01-15'
    },
    {
      id: 5,
      name: 'Welcome Email',
      subject: 'Welcome to COSMT!',
      type: 'customerRegistration',
      enabled: true,
      lastModified: '2024-01-15'
    }
  ]);

  const [settings, setSettings] = useState({
    enableNotifications: true,
    emailFrom: 'noreply@cosmt.com',
    emailFromName: 'COSMT',
    smsProvider: 'twilio',
    smsFrom: '+1234567890',
    pushEnabled: true,
    enableDigest: true,
    digestFrequency: 'daily',
    digestTime: '09:00',
    enableWebhooks: true,
    webhookUrl: 'https://cosmt.com/api/webhooks/notifications'
  });

  const notificationTypes = [
    { key: 'newOrder', label: 'New Order', description: 'When a new order is placed' },
    { key: 'orderShipped', label: 'Order Shipped', description: 'When an order is shipped' },
    { key: 'orderDelivered', label: 'Order Delivered', description: 'When an order is delivered' },
    { key: 'orderCancelled', label: 'Order Cancelled', description: 'When an order is cancelled' },
    { key: 'lowStock', label: 'Low Stock Alert', description: 'When inventory is running low' },
    { key: 'paymentReceived', label: 'Payment Received', description: 'When payment is processed' },
    { key: 'refundProcessed', label: 'Refund Processed', description: 'When a refund is processed' },
    { key: 'customerRegistration', label: 'Customer Registration', description: 'When a new customer registers' },
    { key: 'newsletter', label: 'Newsletter', description: 'Marketing newsletters' },
    { key: 'marketing', label: 'Marketing', description: 'Promotional messages' }
  ];

  const handleSave = () => {
    console.log('Notification settings saved:', { notifications, settings });
  };

  const handleNotificationChange = (channel: string, type: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel as keyof typeof prev],
        [type]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg  border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notification Settings</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Configure notification channels and preferences</p>
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
              Email From Address
            </label>
            <input
              type="email"
              value={settings.emailFrom}
              onChange={(e) => setSettings(prev => ({ ...prev, emailFrom: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email From Name
            </label>
            <input
              type="text"
              value={settings.emailFromName}
              onChange={(e) => setSettings(prev => ({ ...prev, emailFromName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              SMS Provider
            </label>
            <select
              value={settings.smsProvider}
              onChange={(e) => setSettings(prev => ({ ...prev, smsProvider: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="twilio">Twilio</option>
              <option value="aws-sns">AWS SNS</option>
              <option value="sendgrid">SendGrid</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              SMS From Number
            </label>
            <input
              type="tel"
              value={settings.smsFrom}
              onChange={(e) => setSettings(prev => ({ ...prev, smsFrom: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Notification Channels */}
      <div className="bg-white dark:bg-gray-800 rounded-lg  border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          Notification Channels
        </h2>
        
        <div className="space-y-6">
          {/* Email Notifications */}
          <div>
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Email Notifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notificationTypes.map((type) => (
                <div key={type.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{type.label}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{type.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.email[type.key as keyof typeof notifications.email] || false}
                      onChange={(e) => handleNotificationChange('email', type.key, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* SMS Notifications */}
          <div>
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <Smartphone className="w-5 h-5 mr-2" />
              SMS Notifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notificationTypes.filter(type => type.key !== 'newsletter' && type.key !== 'marketing').map((type) => (
                <div key={type.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{type.label}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{type.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.sms[type.key as keyof typeof notifications.sms] || false}
                      onChange={(e) => handleNotificationChange('sms', type.key, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Push Notifications */}
          <div>
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Push Notifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notificationTypes.map((type) => (
                <div key={type.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{type.label}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{type.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.push[type.key as keyof typeof notifications.push] || false}
                      onChange={(e) => handleNotificationChange('push', type.key, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Email Templates */}
      <div className="bg-white dark:bg-gray-800 rounded-lg  border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Email Templates
          </h2>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Template
          </Button>
        </div>
        
        <div className="space-y-4">
          {emailTemplates.map((template) => (
            <div key={template.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">{template.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{template.subject}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Last modified: {template.lastModified}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  template.enabled 
                    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                    : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                }`}>
                  {template.enabled ? 'Enabled' : 'Disabled'}
                </span>
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg  border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Advanced Settings
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Enable Digest Notifications</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Send daily/weekly summary of notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableDigest}
                onChange={(e) => setSettings(prev => ({ ...prev, enableDigest: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          {settings.enableDigest && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Digest Frequency
                </label>
                <select
                  value={settings.digestFrequency}
                  onChange={(e) => setSettings(prev => ({ ...prev, digestFrequency: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Digest Time
                </label>
                <input
                  type="time"
                  value={settings.digestTime}
                  onChange={(e) => setSettings(prev => ({ ...prev, digestTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          )}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Enable Webhooks</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Send notifications to external webhook URLs</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableWebhooks}
                onChange={(e) => setSettings(prev => ({ ...prev, enableWebhooks: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          {settings.enableWebhooks && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Webhook URL
              </label>
              <input
                type="url"
                value={settings.webhookUrl}
                onChange={(e) => setSettings(prev => ({ ...prev, webhookUrl: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
