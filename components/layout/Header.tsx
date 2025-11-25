'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Menu, X, ShoppingCart, User, Heart } from 'lucide-react';
import { TopPromotionBar } from './TopPromotionBar';
import { MainNavigation } from './MainNavigation';
export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show header when scrolling up or at the top
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsHeaderVisible(true);
      } 
      // Hide header when scrolling down (but not at the very top)
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Set CSS variable for header height
  useEffect(() => {
    if (headerRef.current) {
      const updateHeaderHeight = () => {
        const height = headerRef.current?.offsetHeight || 140;
        document.documentElement.style.setProperty('--header-height', `${height}px`);
      };
      
      updateHeaderHeight();
      window.addEventListener('resize', updateHeaderHeight);
      
      return () => window.removeEventListener('resize', updateHeaderHeight);
    }
  }, []);

  return (
    <header 
      ref={headerRef}
      className={`cosmt-navigation transition-transform duration-300 ease-in-out overflow-x-hidden overflow-y-visible ${
        isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
      dir="ltr"
      style={{ 
        overflowY: 'visible',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <TopPromotionBar />
      <MainNavigation 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
      />
    </header>
  );
};
