'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Save, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle,
  XCircle,
  Shield,
  DollarSign,
  Settings,
  AlertTriangle,
  TestTube,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PaymentGateway {
  id: number;
  name: string;
  display_name: string;
  provider: string;
  is_active: boolean;
  is_default: boolean;
  mode: 'sandbox' | 'live';
  public_key?: string;
  secret_key?: string;
  merchant_id?: string;
  webhook_secret?: string;
  // Turkish payment providers specific fields
  terminal_id?: string;
  password?: string;
  store_key?: string;
  merchant_salt?: string;
  supported_currencies: string[];
  supported_countries: string[];
  fees_percentage: number;
  fees_fixed: number;
  api_url?: string;
  webhook_url?: string;
  description?: string;
  logo_url?: string;
  documentation_url?: string;
  last_tested_at?: string;
  test_status: 'pending' | 'success' | 'failed';
  test_error?: string;
  created_at: string;
  updated_at: string;
}

export default function PaymentSettingsPage() {
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showSecrets, setShowSecrets] = useState<{ [key: number]: boolean }>({});

  const [formData, setFormData] = useState({
    public_key: '',
    secret_key: '',
    merchant_id: '',
    webhook_secret: '',
    mode: 'sandbox' as 'sandbox' | 'live',
    is_active: false,
    is_default: false,
    fees_percentage: 2.90,
    fees_fixed: 0.30,
    api_url: '',
    webhook_url: '',
    description: '',
    // Turkish payment providers specific fields
    terminal_id: '',
    password: '',
    store_key: '',
    merchant_salt: ''
  });

  useEffect(() => {
    fetchGateways();
  }, []);

  const fetchGateways = async () => {
    try {
      const response = await fetch('/api/admin/payment-gateways');
      const result = await response.json();
      
      // Handle different response formats
      if (Array.isArray(result)) {
        // Direct array response
        setGateways(result);
        if (result.length > 0 && !selectedGateway) {
          setSelectedGateway(result[0]);
          loadGatewayData(result[0]);
        }
      } else if (result.data && Array.isArray(result.data)) {
        // Response with data property
        setGateways(result.data);
        if (result.data.length > 0 && !selectedGateway) {
          setSelectedGateway(result.data[0]);
          loadGatewayData(result.data[0]);
        }
      } else if (result.error) {
        // Error response
        console.error('API Error:', result.error);
        setGateways([]);
      } else {
        console.error('Invalid data format received:', result);
        setGateways([]);
      }
    } catch (error) {
      console.error('Error fetching gateways:', error);
      setGateways([]);
    } finally {
      setLoading(false);
    }
  };

  const loadGatewayData = (gateway: PaymentGateway) => {
    setFormData({
      public_key: gateway.public_key || '',
      secret_key: gateway.secret_key || '',
      merchant_id: gateway.merchant_id || '',
      webhook_secret: gateway.webhook_secret || '',
      mode: gateway.mode,
      is_active: gateway.is_active,
      is_default: gateway.is_default,
      fees_percentage: gateway.fees_percentage,
      fees_fixed: gateway.fees_fixed,
      api_url: gateway.api_url || '',
      webhook_url: gateway.webhook_url || '',
      description: gateway.description || '',
      // Turkish payment providers specific fields
      terminal_id: gateway.terminal_id || '',
      password: gateway.password || '',
      store_key: gateway.store_key || '',
      merchant_salt: gateway.merchant_salt || ''
    });
  };

  const handleGatewaySelect = (gateway: PaymentGateway) => {
    setSelectedGateway(gateway);
    loadGatewayData(gateway);
  };

  const handleSave = async () => {
    if (!selectedGateway) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/payment-gateways/${selectedGateway.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchGateways();
        // Show success message
      }
    } catch (error) {
      console.error('Error saving gateway:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    if (!selectedGateway) return;

    setTesting(true);
    try {
      const response = await fetch(`/api/admin/payment-gateways/${selectedGateway.id}/test`, {
        method: 'POST'
      });

      const result = await response.json();
      
      if (result.success) {
        // Show success message
        await fetchGateways();
      } else {
        // Show error message
      }
    } catch (error) {
      console.error('Error testing connection:', error);
    } finally {
      setTesting(false);
    }
  };

  const toggleSecretVisibility = (gatewayId: number) => {
    setShowSecrets(prev => ({
      ...prev,
      [gatewayId]: !prev[gatewayId]
    }));
  };

  const getStatusIcon = (gateway: PaymentGateway) => {
    if (gateway.test_status === 'success') {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else if (gateway.test_status === 'failed') {
      return <XCircle className="w-4 h-4 text-red-500" />;
    }
    return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-gray-600">Settings not available</span>
      </div>
    );
  }

  return (
    <div 
      className="space-y-6" 
      style={{
        '--tw-divide-y-reverse': '0',
        '--tw-divide-x-reverse': '0',
        '--tw-border-opacity': '0',
        backgroundColor: '#f1f5f9',
        minHeight: '100vh'
      }}
    >
      <style jsx>{`
        /* Remove ALL vertical dividers from text elements */
        *::after,
        *::before {
          content: none !important;
          display: none !important;
          visibility: hidden !important;
        }
        
        /* Specific targeting for all text elements */
        h1, h2, h3, h4, h5, h6, p, div, span, strong, b, em, i, label {
          position: relative;
        }
        
        h1::after, h2::after, h3::after, h4::after, h5::after, h6::after,
        p::after, div::after, span::after, strong::after, b::after, em::after, i::after,
        label::after {
          content: none !important;
          display: none !important;
          visibility: hidden !important;
          width: 0 !important;
          height: 0 !important;
          position: absolute !important;
          left: -9999px !important;
          top: -9999px !important;
        }
        
        /* Target gateway list items specifically */
        .analytics-card * {
          position: relative;
        }
        
        .analytics-card *::after,
        .analytics-card *::before {
          content: none !important;
          display: none !important;
          visibility: hidden !important;
          width: 0 !important;
          height: 0 !important;
          position: absolute !important;
          left: -9999px !important;
          top: -9999px !important;
        }
        
        /* Nuclear option for gateway list */
        .analytics-card h4,
        .analytics-card p,
        .analytics-card span,
        .analytics-card div {
          position: relative !important;
        }
        
        .analytics-card h4::after,
        .analytics-card h4::before,
        .analytics-card p::after,
        .analytics-card p::before,
        .analytics-card span::after,
        .analytics-card span::before,
        .analytics-card div::after,
        .analytics-card div::before {
          content: none !important;
          display: none !important;
          visibility: hidden !important;
          width: 0 !important;
          height: 0 !important;
          position: absolute !important;
          left: -9999px !important;
          top: -9999px !important;
          font-size: 0 !important;
          line-height: 0 !important;
        }
        
        /* Keep input field borders intact */
        input, textarea, select {
          border: 1px solid #d1d5db !important;
        }
        
        input:focus, textarea:focus, select:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }
        
        .dark input, .dark textarea, .dark select {
          border-color: #4b5563 !important;
        }
        
        .dark input:focus, .dark textarea:focus, .dark select:focus {
          border-color: #3b82f6 !important;
        }
      `}</style>

      {/* Header */}
      <div className="analytics-card p-0">
        <div className="flex justify-between items-center px-4 pt-4 pb-3 border-b">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Gateways</h1>
          <button
            onClick={handleSave}
            disabled={saving || !selectedGateway}
            className="cosmt-btn-primary flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gateway List */}
        <div className="lg:col-span-1">
          <div className="analytics-card p-0">
            <div className="px-4 pt-4 pb-3 border-b">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Payment Gateways</h3>
            </div>
            <div className="p-4">
              {Array.isArray(gateways) && gateways.length > 0 ? (
                gateways.map((gateway) => (
                  <div
                    key={gateway.id}
                    onClick={() => handleGatewaySelect(gateway)}
                    className={`p-4 mb-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg ${
                      selectedGateway?.id === gateway.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </div>
          <div>
                          <h4 className="font-medium text-gray-900 dark:text-white" style={{'::after': {content: 'none', display: 'none'}, '::before': {content: 'none', display: 'none'}}}>
                            {gateway.display_name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400" style={{'::after': {content: 'none', display: 'none'}, '::before': {content: 'none', display: 'none'}}}>
                            {gateway.provider}
                          </p>
          </div>
        </div>
                      <div className="flex items-center gap-2">
                        {gateway.is_active ? (
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        ) : (
                          <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        )}
                        {getStatusIcon(gateway)}
      </div>
        </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className={`px-2 py-1 rounded-full ${
                        gateway.mode === 'live' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                      }`}>
                        {gateway.mode}
                      </span>
                      {gateway.is_default && (
                        <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                          Default
                        </span>
                      )}
                    </div>
                    </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  <CreditCard className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">No payment gateways found</p>
                  <p className="text-xs mt-1">
                    The payment_gateways table needs to be created.
                  </p>
                  <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-xs text-yellow-800 dark:text-yellow-200">
                      <strong>Setup Required:</strong> Run the SQL script in your Supabase dashboard to create the payment gateways table.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Gateway Configuration */}
        <div className="lg:col-span-2">
          {selectedGateway ? (
            <div className="analytics-card p-0">
              <div className="px-4 pt-4 pb-3 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                      {selectedGateway.display_name} Configuration
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {selectedGateway.description}
                    </p>
                  </div>
                  <button
                    onClick={handleTestConnection}
                    disabled={testing}
                    className="cosmt-btn-secondary flex items-center gap-2"
                  >
                    <TestTube className="w-4 h-4" />
                    Test Connection
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-4">

                {/* Basic Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {selectedGateway.provider === 'stripe' ? 'Publishable Key' : 
                       selectedGateway.provider === 'paypal' ? 'Client ID' :
                       selectedGateway.provider === 'razorpay' ? 'Key ID' :
                       'Public Key / Client ID'}
                    </label>
                    <input
                      type="text"
                      value={formData.public_key}
                      onChange={(e) => setFormData(prev => ({ ...prev, public_key: e.target.value }))}
                      className="cosmt-input-base w-full"
                      placeholder={
                        selectedGateway.provider === 'stripe' ? 'pk_test_... or pk_live_...' :
                        selectedGateway.provider === 'paypal' ? 'Client ID from PayPal Dashboard' :
                        selectedGateway.provider === 'razorpay' ? 'rzp_test_... or rzp_live_...' :
                        'Enter public key or client ID'
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {selectedGateway.provider === 'stripe' ? 'Secret Key' : 
                       selectedGateway.provider === 'paypal' ? 'Client Secret' :
                       selectedGateway.provider === 'razorpay' ? 'Key Secret' :
                       'Secret Key / Private Key'}
                    </label>
                    <div className="relative">
                      <input
                        type={showSecrets[selectedGateway.id] ? "text" : "password"}
                        value={formData.secret_key}
                        onChange={(e) => setFormData(prev => ({ ...prev, secret_key: e.target.value }))}
                        className="cosmt-input-base w-full pr-10"
                        placeholder={
                          selectedGateway.provider === 'stripe' ? 'sk_test_... or sk_live_...' :
                          selectedGateway.provider === 'paypal' ? 'Client Secret from PayPal' :
                          selectedGateway.provider === 'razorpay' ? 'Key Secret from Razorpay' :
                          'Enter secret key or private key'
                        }
                      />
                      <button
                        type="button"
                        onClick={() => toggleSecretVisibility(selectedGateway.id)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showSecrets[selectedGateway.id] ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
            </div>
        </div>
      </div>

                {/* Merchant ID and Webhook Secret */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {selectedGateway.provider === 'stripe' ? 'Account ID' :
                       selectedGateway.provider === 'paypal' ? 'Merchant ID' :
                       selectedGateway.provider === 'razorpay' ? 'Merchant ID' :
                       selectedGateway.provider === 'paystack' ? 'Merchant Email' :
                       selectedGateway.provider === 'paytr' ? 'Merchant ID' :
                       selectedGateway.provider === 'vakifbank' ? 'Merchant ID' :
                       selectedGateway.provider === 'kuveytturk' ? 'Merchant ID' :
                       'Merchant ID'}
                    </label>
                    <input
                      type="text"
                      value={formData.merchant_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, merchant_id: e.target.value }))}
                      className="cosmt-input-base w-full"
                      placeholder={
                        selectedGateway.provider === 'stripe' ? 'acct_... (from Stripe Dashboard)' :
                        selectedGateway.provider === 'paypal' ? 'Merchant ID from PayPal' :
                        selectedGateway.provider === 'razorpay' ? 'Merchant ID from Razorpay' :
                        selectedGateway.provider === 'paystack' ? 'merchant@example.com' :
                        selectedGateway.provider === 'paytr' ? 'PayTR Merchant ID' :
                        selectedGateway.provider === 'vakifbank' ? 'VakıfBank Merchant ID' :
                        selectedGateway.provider === 'kuveytturk' ? 'Kuveyt Türk Merchant ID' :
                        'Enter merchant ID'
                      }
                    />
            </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Webhook Secret
                    </label>
                    <div className="relative">
              <input
                        type={showSecrets[selectedGateway.id] ? "text" : "password"}
                        value={formData.webhook_secret}
                        onChange={(e) => setFormData(prev => ({ ...prev, webhook_secret: e.target.value }))}
                        className="cosmt-input-base w-full"
                        placeholder={
                          selectedGateway.provider === 'stripe' ? 'whsec_... (from Stripe Webhooks)' :
                          selectedGateway.provider === 'paypal' ? 'Webhook Secret from PayPal' :
                          selectedGateway.provider === 'razorpay' ? 'Webhook Secret from Razorpay' :
                          'Enter webhook secret'
                        }
                      />
                      <button
                        type="button"
                        onClick={() => toggleSecretVisibility(selectedGateway.id)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showSecrets[selectedGateway.id] ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
          </div>

                {/* Turkish Payment Providers Specific Fields */}
                {(selectedGateway.provider === 'paytr' || selectedGateway.provider === 'vakifbank' || selectedGateway.provider === 'kuveytturk') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Terminal ID for VakıfBank and Kuveyt Türk */}
                    {(selectedGateway.provider === 'vakifbank' || selectedGateway.provider === 'kuveytturk') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Terminal ID
                        </label>
                        <input
                          type="text"
                          value={formData.terminal_id}
                          onChange={(e) => setFormData(prev => ({ ...prev, terminal_id: e.target.value }))}
                          className="cosmt-input-base w-full"
                          placeholder={`${selectedGateway.provider === 'vakifbank' ? 'VakıfBank' : 'Kuveyt Türk'} Terminal ID`}
                        />
                      </div>
                    )}

                    {/* Password for VakıfBank and Kuveyt Türk */}
                    {(selectedGateway.provider === 'vakifbank' || selectedGateway.provider === 'kuveytturk') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            type={showSecrets[selectedGateway.id] ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            className="cosmt-input-base w-full pr-10"
                            placeholder={`${selectedGateway.provider === 'vakifbank' ? 'VakıfBank' : 'Kuveyt Türk'} Password`}
                          />
                          <button
                            type="button"
                            onClick={() => toggleSecretVisibility(selectedGateway.id)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showSecrets[selectedGateway.id] ? (
                              <EyeOff className="w-4 h-4 text-gray-400" />
                            ) : (
                              <Eye className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Store Key for Kuveyt Türk */}
                    {selectedGateway.provider === 'kuveytturk' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Store Key
                        </label>
                        <div className="relative">
                          <input
                            type={showSecrets[selectedGateway.id] ? "text" : "password"}
                            value={formData.store_key}
                            onChange={(e) => setFormData(prev => ({ ...prev, store_key: e.target.value }))}
                            className="cosmt-input-base w-full pr-10"
                            placeholder="Kuveyt Türk Store Key"
                          />
                          <button
                            type="button"
                            onClick={() => toggleSecretVisibility(selectedGateway.id)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showSecrets[selectedGateway.id] ? (
                              <EyeOff className="w-4 h-4 text-gray-400" />
                            ) : (
                              <Eye className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Merchant Salt for PayTR */}
                    {selectedGateway.provider === 'paytr' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Merchant Salt
                        </label>
                        <div className="relative">
                          <input
                            type={showSecrets[selectedGateway.id] ? "text" : "password"}
                            value={formData.merchant_salt}
                            onChange={(e) => setFormData(prev => ({ ...prev, merchant_salt: e.target.value }))}
                            className="cosmt-input-base w-full pr-10"
                            placeholder="PayTR Merchant Salt"
                          />
                          <button
                            type="button"
                            onClick={() => toggleSecretVisibility(selectedGateway.id)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showSecrets[selectedGateway.id] ? (
                              <EyeOff className="w-4 h-4 text-gray-400" />
                            ) : (
                              <Eye className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Mode and Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mode
                    </label>
                    <select
                      value={formData.mode}
                      onChange={(e) => setFormData(prev => ({ ...prev, mode: e.target.value as 'sandbox' | 'live' }))}
                      className="cosmt-input-base w-full"
                    >
                      <option value="sandbox">Sandbox</option>
                      <option value="live">Live</option>
                    </select>
            </div>
                  <div className="flex items-center">
                    <label className="flex items-center">
              <input
                type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                        className="cosmt-input-base"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Active</span>
            </label>
          </div>
                  <div className="flex items-center">
                    <label className="flex items-center">
              <input
                type="checkbox"
                        checked={formData.is_default}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_default: e.target.checked }))}
                        className="cosmt-input-base"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Default</span>
            </label>
          </div>
        </div>

                {/* Fees */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fees Percentage (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.fees_percentage}
                      onChange={(e) => setFormData(prev => ({ ...prev, fees_percentage: parseFloat(e.target.value) }))}
                      className="cosmt-input-base w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fixed Fees
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.fees_fixed}
                      onChange={(e) => setFormData(prev => ({ ...prev, fees_fixed: parseFloat(e.target.value) }))}
                      className="cosmt-input-base w-full"
                    />
                  </div>
                </div>

                {/* URLs */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      API URL
                    </label>
                    <input
                      type="url"
                      value={formData.api_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, api_url: e.target.value }))}
                      className="cosmt-input-base w-full"
                      placeholder="Enter API URL"
                    />
                  </div>
                  <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Webhook URL
            </label>
            <input
              type="url"
                      value={formData.webhook_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, webhook_url: e.target.value }))}
                      className="cosmt-input-base w-full"
                      placeholder="Enter webhook URL"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="cosmt-input-base w-full"
                    placeholder="Enter description"
            />
          </div>

                {/* Supported Currencies and Countries */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Supported Currencies
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedGateway.supported_currencies.map((currency) => (
                        <span
                          key={currency}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full dark:bg-blue-800 dark:text-blue-100"
                        >
                          {currency}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Supported Countries
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedGateway.supported_countries.map((country) => (
                        <span
                          key={country}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full dark:bg-green-800 dark:text-green-100"
                        >
                          {country}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Test Status */}
                {selectedGateway.last_tested_at && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TestTube className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Last Tested
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(selectedGateway.last_tested_at).toLocaleString()}
                    </p>
                    {selectedGateway.test_error && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        Error: {selectedGateway.test_error}
                      </p>
        )}
      </div>
                )}

              </div>
            </div>
          ) : (
            <div className="analytics-card p-0">
              <div className="px-4 pt-4 pb-3 border-b">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Gateway Configuration</h3>
              </div>
              <div className="p-6 text-center">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                  Select a Payment Gateway
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Choose a payment gateway from the list to configure its settings.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
