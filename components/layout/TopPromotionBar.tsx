'use client';

import React from 'react';
import { Truck, Gift, Star, Heart, Sparkles } from 'lucide-react';

export const TopPromotionBar: React.FC = () => {

  const promotionalTexts = [
    { icon: <Truck className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "Free shipping on orders over $50" },
    { icon: <Gift className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "20% off your first order" },
    { icon: <Star className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "Premium beauty products" },
    { icon: <Heart className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "In our Cosmetic Market you find all you need" },
    { icon: <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "Professional quality at affordable prices" },
    { icon: <Star className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "Expert beauty advice and tips" },
    { icon: <Gift className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "Exclusive deals and new arrivals" },
    { icon: <Truck className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "Fast and secure delivery worldwide" },
    { icon: <Heart className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "Natural and organic beauty solutions" },
    { icon: <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "Cruelty-free and vegan products" },
    { icon: <Star className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "Hair care for every hair type" },
    { icon: <Gift className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "Skincare routines that work" },
    { icon: <Truck className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "Same day delivery available" },
    { icon: <Heart className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "Beauty experts at your service" },
    { icon: <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "Transform your beauty routine" },
    { icon: <Star className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "Glowing skin starts here" },
    { icon: <Gift className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "Luxury beauty made accessible" },
    { icon: <Truck className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "Free returns within 30 days" },
    { icon: <Heart className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "Join thousands of satisfied customers" },
    { icon: <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "Your beauty journey begins now" },
    { icon: <Truck className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "Premium skincare for all skin types" },
    { icon: <Gift className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "Award-winning beauty products" },
    { icon: <Star className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "Trusted by beauty professionals" },
    { icon: <Heart className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "Sustainable and eco-friendly options" },
    { icon: <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "International shipping available" },
    { icon: <Star className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "24/7 customer support" },
    { icon: <Gift className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "Money-back guarantee" },
    { icon: <Truck className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "Express delivery options" },
    { icon: <Heart className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "Personalized beauty recommendations" },
    { icon: <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "Beauty tutorials and guides" },
    { icon: <Star className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "Trending beauty products" },
    { icon: <Gift className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "Seasonal beauty specials" },
    { icon: <Truck className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "Bulk order discounts" },
    { icon: <Heart className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "Beauty subscription boxes" },
    { icon: <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "Virtual makeup consultations" },
    { icon: <Star className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "Beauty product reviews" },
    { icon: <Gift className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "Gift wrapping services" },
    { icon: <Truck className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "Store pickup available" },
    { icon: <Heart className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "Beauty community forum" },
    { icon: <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3" />, text: "Beauty blog and insights" }
  ];

  return (
    <div className="cosmt-promotion-bar overflow-hidden" style={{ overflowX: 'hidden', overflowY: 'hidden', width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}>
      <div className="flex items-center text-[10px] md:text-xs font-medium h-full">
        {/* Promotional Text - Scrolling container */}
        <div className="flex-1 overflow-hidden scrollbar-hide" style={{ overflowX: 'hidden', overflowY: 'hidden', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="flex items-center animate-scroll" style={{ overflow: 'hidden', animationDuration: '60s' }}>
            {promotionalTexts.map((item, index) => (
              <div key={index} className="flex items-center space-x-3 whitespace-nowrap" style={{ marginRight: '2rem', marginLeft: index === 0 ? '0' : '0' }}>
                {item.icon}
                <span className="tracking-wide">{item.text}</span>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {promotionalTexts.map((item, index) => (
              <div key={`duplicate-${index}`} className="flex items-center space-x-3 whitespace-nowrap" style={{ marginRight: '2rem', marginLeft: '0' }}>
                {item.icon}
                <span className="tracking-wide">{item.text}</span>
              </div>
            ))}
            {/* Third copy for extra seamless loop */}
            {promotionalTexts.map((item, index) => (
              <div key={`third-${index}`} className="flex items-center space-x-3 whitespace-nowrap" style={{ marginRight: '2rem', marginLeft: '0' }}>
                {item.icon}
                <span className="tracking-wide">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
