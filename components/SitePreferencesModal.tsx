'use client';

import React, { useState, useEffect } from 'react';
import { X, Globe, MapPin, DollarSign, Check } from 'lucide-react';
import { useLocale } from '../contexts/LocaleProvider';
import { getSupportedLocales, detectUserLocale } from '../utils/detectLocale';

export default function SitePreferencesModal({ isOpen, onClose, showAutoDetection = false }) {
  const { updateLocale, getCurrentLocale, isFirstVisit } = useLocale();
  const [selectedLocale, setSelectedLocale] = useState('en');
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [isDetecting, setIsDetecting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [detectedInfo, setDetectedInfo] = useState(null);

  const supportedLocales = getSupportedLocales();

  // Initialize with current locale
  useEffect(() => {
    if (isOpen) {
      const current = getCurrentLocale();
      setSelectedLocale(current.locale);
      setSelectedCountry(current.country);
      setSelectedCurrency(current.currency);
    }
  }, [isOpen, getCurrentLocale]);

  // Auto-detect location
  const handleAutoDetection = async () => {
    setIsDetecting(true);
    try {
      const detected = await detectUserLocale();
      setDetectedInfo(detected);
      setShowToast(true);
      
      // Auto-apply detection
      setSelectedLocale(detected.locale);
      setSelectedCountry(detected.country);
      setSelectedCurrency(detected.currency);
    } catch (error) {
      console.error('Auto-detection failed:', error);
    } finally {
      setIsDetecting(false);
    }
  };

  // Handle locale selection
  const handleLocaleSelect = (locale) => {
    setSelectedLocale(locale.code);
    setSelectedCountry(locale.country);
    setSelectedCurrency(locale.currency);
  };

  // Save preferences
  const handleSave = () => {
    // Only redirect if country changed, not for language/currency only changes
    const current = getCurrentLocale();
    const shouldRedirect = selectedCountry !== current.country;
    updateLocale(selectedLocale, selectedCountry, selectedCurrency, shouldRedirect);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <Globe className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Site Preferences
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Choose your region and language
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Auto-detection Toast */}
        {showToast && detectedInfo && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    We've set your region to {detectedInfo.countryName} {detectedInfo.flag}
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Language: {supportedLocales.find(l => l.code === detectedInfo.locale)?.name}
                    {detectedInfo.reason === 'detected_turkey_location' && (
                      <span className="ml-1 text-green-600">(detected your location)</span>
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowToast(false)}
                className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
              >
                Accept
              </button>
            </div>
          </div>
        )}

        {/* Auto-detection Button */}
        {isFirstVisit && (
          <div className="mb-6">
            <button
              onClick={handleAutoDetection}
              disabled={isDetecting}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDetecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Detecting your location...</span>
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4" />
                  <span>Auto-detect my location</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Language Selection */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Globe className="w-4 h-4 inline mr-2" />
              Language & Region
            </label>
            <div className="grid grid-cols-1 gap-2">
              {supportedLocales.map((locale) => (
                <button
                  key={locale.code}
                  onClick={() => handleLocaleSelect(locale)}
                  className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                    selectedLocale === locale.code
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{locale.flag}</span>
                    <div className="text-left">
                      <p className="font-medium text-gray-900 dark:text-white">{locale.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{locale.country}</p>
                    </div>
                  </div>
                  {selectedLocale === locale.code && (
                    <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Currency Display */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <DollarSign className="w-4 h-4 inline mr-2" />
              Currency
            </label>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  {selectedCurrency}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {supportedLocales.find(l => l.code === selectedLocale)?.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}