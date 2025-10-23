'use client';

import React from 'react';
import { Truck, Gift, Star, Heart, Sparkles, Globe } from 'lucide-react';
import SimpleSitePreferencesDropdown from '../SimpleSitePreferencesDropdown';
export const TopPromotionBar: React.FC = () => {
  const [isPreferencesOpen, setIsPreferencesOpen] = React.useState(false);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    if (!isPreferencesOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      // Check if click is outside both the button container and the dropdown
      if (!target.closest('.site-preferences-dropdown') && 
          !target.closest('[data-dropdown="site-preferences"]')) {
        setIsPreferencesOpen(false);
      }
    };

    // Add a small delay to prevent immediate closing when opening
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPreferencesOpen]);

  const promotionalTexts = [
    { icon: <Truck className="w-3 h-3 md:w-4 md:h-4" />, text: "Free shipping on orders over $50" },
    { icon: <Gift className="w-3 h-3 md:w-4 md:h-4" />, text: "20% off your first order" },
    { icon: <Star className="w-3 h-3 md:w-4 md:h-4" />, text: "Premium beauty products" },
    { icon: <Heart className="w-3 h-3 md:w-4 md:h-4" />, text: "In our Cosmetic Market you find all you need" },
    { icon: <Sparkles className="w-3 h-3 md:w-4 md:h-4" />, text: "Professional quality at affordable prices" },
    { icon: <Star className="w-3 h-3 md:w-4 md:h-4" />, text: "Expert beauty advice and tips" },
    { icon: <Gift className="w-3 h-3 md:w-4 md:h-4" />, text: "Exclusive deals and new arrivals" },
    { icon: <Truck className="w-3 h-3 md:w-4 md:h-4" />, text: "Fast and secure delivery worldwide" },
    { icon: <Heart className="w-3 h-3 md:w-4 md:h-4" />, text: "Natural and organic beauty solutions" },
    { icon: <Sparkles className="w-3 h-3 md:w-4 md:h-4" />, text: "Cruelty-free and vegan products" },
    { icon: <Star className="w-3 h-3 md:w-4 md:h-4" />, text: "Hair care for every hair type" },
    { icon: <Gift className="w-3 h-3 md:w-4 md:h-4" />, text: "Skincare routines that work" },
    { icon: <Truck className="w-3 h-3 md:w-4 md:h-4" />, text: "Same day delivery available" },
    { icon: <Heart className="w-3 h-3 md:w-4 md:h-4" />, text: "Beauty experts at your service" },
    { icon: <Sparkles className="w-3 h-3 md:w-4 md:h-4" />, text: "Transform your beauty routine" },
    { icon: <Star className="w-3 h-3 md:w-4 md:h-4" />, text: "Glowing skin starts here" },
    { icon: <Gift className="w-3 h-3 md:w-4 md:h-4" />, text: "Luxury beauty made accessible" },
    { icon: <Truck className="w-3 h-3 md:w-4 md:h-4" />, text: "Free returns within 30 days" },
    { icon: <Heart className="w-3 h-3 md:w-4 md:h-4" />, text: "Join thousands of satisfied customers" },
    { icon: <Sparkles className="w-3 h-3 md:w-4 md:h-4" />, text: "Your beauty journey begins now" }
  ];

  return (
    <div className="cosmt-promotion-bar overflow-hidden">
      <div className="cosmt-container">
        <div className="flex items-center text-xs md:text-cosmt-sm font-medium">
          {/* Promotional Text - Scrolling container */}
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center space-x-12 md:space-x-16 animate-scroll">
              {promotionalTexts.map((item, index) => (
                <div key={index} className="flex items-center space-x-3 whitespace-nowrap">
                  {item.icon}
                  <span className="tracking-wide">{item.text}</span>
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {promotionalTexts.map((item, index) => (
                <div key={`duplicate-${index}`} className="flex items-center space-x-3 whitespace-nowrap">
                  {item.icon}
                  <span className="tracking-wide">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          
              {/* Site Preferences Dropdown - Positioned on the right */}
              <div className="flex-shrink-0 ml-4 relative site-preferences-dropdown">
                <button
                  onClick={() => {
                    setIsPreferencesOpen(!isPreferencesOpen);
                  }}
                   className="flex items-center justify-center w-8 h-8 text-gray-800 dark:text-gray-200 transition-all duration-200 rounded-md"
                  title="Site Preferences"
                  aria-label="Open Site Preferences"
                >
                  <Globe className="w-5 h-5 text-white" />
                </button>
                
                {/* Site Preferences Dropdown */}
                <SimpleSitePreferencesDropdown
                  isOpen={isPreferencesOpen}
                  onClose={() => setIsPreferencesOpen(false)}
                />
              </div>
        </div>
      </div>
    </div>
  );
};