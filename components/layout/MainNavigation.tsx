'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Search, Menu, X, ShoppingBag, User, Heart, LogOut } from 'lucide-react';
import { Input } from '../ui/Input';
import { MobileSearchModal } from './MobileSearchModal';
import { MegaMenu } from './MegaMenu';
import { CartSidebar } from '../ui/CartSidebar';
import { useCart } from '../../contexts/CartContext';
import { useSearch } from '../../contexts/SearchContext';
import { useAuth } from '../../contexts/AuthContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useRTL } from '../../contexts/UnifiedLanguageContext';
import { useLanguage } from '../../contexts/UnifiedLanguageContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { UserProfile } from '../auth/UserProfile';

interface MainNavigationProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

export const MainNavigation: React.FC<MainNavigationProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isSearchOpen,
  setIsSearchOpen,
}) => {
  const { getTotalItems, isCartOpen, setIsCartOpen } = useCart();
  const { setSearchQuery } = useSearch();
  const { user, userProfile, signOut } = useAuth();
  const { getWishlistCount } = useWishlist();
  const { isRTL } = useRTL();
  const { t } = useLanguage();
  const router = useRouter();
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (query && query.trim()) {
      setSearchQuery(query);
      router.push('/search');
    }
  };

  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setIsMegaMenuOpen(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 300); // 300ms delay before closing
    setHoverTimeout(timeout);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);
  const navigationItems = useMemo(() => [
    { name: t.hairCare, href: '/categories/hair-care' },
    { name: t.skincare, href: '/categories/skincare' },
    { name: t.makeup, href: '/categories/makeup' },
    { name: t.fragrance, href: '/categories/fragrance' },
    { name: t.bodyCare, href: '/categories/body-care' },
    { name: t.allCategories, href: '/categories' },
    { name: t.sale, href: '/sale' },
  ], [t]);

  return (
    <>
      {/* Top Row */}
      <div className="cosmt-container">
        <div className={`flex items-center justify-between h-16 px-2 md:px-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Mobile menu button */}
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Center - Logo */}
          <div className="flex-1 flex justify-center md:flex-none md:flex-shrink-0">
            <Link href="/" className="block">
              <Image
                src="/images/logos/COSMT.png"
                alt="COSMT Logo"
                width={90}
                height={30}
                className="h-6 w-auto hover:opacity-80 transition-opacity duration-200"
                priority
              />
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch}>
              <Input
                type="search"
                name="search"
                placeholder={isRTL ? "ابحث عن المنتجات والعلامات التجارية..." : "Search products, brands, and more..."}
                icon={<Search className="w-4 h-4 text-gray-400" />}
              />
            </form>
          </div>

          {/* Language Switcher */}
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>

          {/* Right side icons */}
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-1 md:space-x-2' : 'space-x-1 md:space-x-2'}`}>
            {/* Mobile search button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-1.5 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Mobile wishlist button */}
            <button 
              onClick={() => router.push('/wishlist')}
              className="md:hidden p-1.5 text-gray-600 hover:text-gray-900 relative transition-colors duration-200"
            >
              <Heart className="w-5 h-5" />
              {getWishlistCount() > 0 && (
                <span className="absolute -top-1 -right-1 text-white text-cosmt-xs h-4 w-4 flex items-center justify-center rounded-full text-xs" style={{ backgroundColor: '#00833F' }}>
                  {getWishlistCount()}
                </span>
              )}
            </button>

            {/* Mobile user button */}
            <button 
              onClick={() => router.push('/signin')}
              className="md:hidden p-1.5 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Mobile cart button */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="md:hidden p-1.5 text-gray-600 hover:text-gray-900 relative transition-colors duration-200"
            >
              <ShoppingBag className="w-5 h-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 text-white text-cosmt-xs h-4 w-4 flex items-center justify-center rounded-full text-xs" style={{ backgroundColor: '#00833F' }}>
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* Desktop icons */}
            <div className="hidden md:flex items-center space-x-2">
              {/* User Menu */}
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-1.5 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  <User className="w-6 h-6" />
                </button>
                
                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {user ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-200">
                          <p className="text-cosmt-sm font-medium text-gray-900">{userProfile?.full_name || user.email || 'User'}</p>
                          <p className="text-cosmt-xs text-gray-600">{userProfile?.email || user.email}</p>
                          {userProfile?.role === 'admin' && (
                            <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full mt-1">
                              Admin
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setShowUserProfile(true);
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-cosmt-sm text-gray-700 hover:bg-gray-50"
                        >
                          My Profile
                        </button>
                        <button
                          onClick={() => {
                            router.push('/orders');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-cosmt-sm text-gray-700 hover:bg-gray-50"
                        >
                          Order History
                        </button>
                        {(userProfile?.role === 'admin' || user.email === 'admin@cosmat.com') && (
                          <button
                            onClick={() => {
                              router.push('/admin');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-cosmt-sm text-gray-700 hover:bg-gray-50"
                          >
                            Admin Dashboard
                          </button>
                        )}
                        <button
                          onClick={() => {
                            signOut();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-cosmt-sm text-red-600 hover:bg-red-50 flex items-center"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            router.push('/signin');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-cosmt-sm text-gray-700 hover:bg-gray-50"
                        >
                          Sign In
                        </button>
                        <button
                          onClick={() => {
                            router.push('/signup');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-cosmt-sm text-gray-700 hover:bg-gray-50"
                        >
                          Create Account
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => router.push('/wishlist')}
                className="p-1.5 text-gray-600 hover:text-gray-900 relative transition-colors duration-200"
              >
                <Heart className="w-6 h-6" />
                {getWishlistCount() > 0 && (
                  <span className="absolute -top-1 -right-1 text-white text-cosmt-xs h-5 w-5 flex items-center justify-center rounded-full" style={{ backgroundColor: '#00833F' }}>
                    {getWishlistCount()}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="p-1.5 text-gray-600 hover:text-gray-900 relative transition-colors duration-200"
              >
                <ShoppingBag className="w-6 h-6" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 text-white text-cosmt-xs h-5 w-5 flex items-center justify-center rounded-full" style={{ backgroundColor: '#00833F' }}>
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row - Desktop Navigation */}
      <div 
        className="hidden md:block border-t border-gray-200 relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="cosmt-container">
          <nav className="flex space-x-8 py-4">
            {navigationItems.map((item) => (
              <div key={item.name} className="relative">
                <a
                  href={item.href}
                  className="text-cosmt-sm text-gray-700 hover:text-green-600 font-medium transition-colors duration-200"
                >
                  {item.name}
                </a>
              </div>
            ))}
          </nav>
        </div>
        
        {/* Mega Menu */}
        <MegaMenu 
          isOpen={isMegaMenuOpen} 
          onClose={() => setIsMegaMenuOpen(false)} 
        />
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white shadow-lg">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block px-4 py-3 text-cosmt-base text-gray-700 hover:text-green-600 hover:bg-gray-50 font-medium transition-colors duration-200 rounded-lg active:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="pt-4 border-t border-gray-200 mt-4">
              <div className="flex items-center justify-around px-2">
                <button 
                  onClick={() => {
                    router.push('/account');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex flex-col items-center p-3 text-gray-600 hover:text-green-600 transition-colors duration-200 rounded-lg active:bg-gray-100"
                >
                  <User className="w-6 h-6 mb-1" />
                  <span className="text-cosmt-xs font-medium">Account</span>
                </button>
                <button 
                  onClick={() => {
                    router.push('/wishlist');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex flex-col items-center p-3 text-gray-600 hover:text-green-600 transition-colors duration-200 rounded-lg active:bg-gray-100 relative"
                >
                  <Heart className="w-6 h-6 mb-1" />
                  {getWishlistCount() > 0 && (
                    <span className="absolute -top-1 -right-1 text-white text-cosmt-xs h-5 w-5 flex items-center justify-center rounded-full" style={{ backgroundColor: '#00833F' }}>
                      {getWishlistCount()}
                    </span>
                  )}
                  <span className="text-cosmt-xs font-medium">Wishlist</span>
                </button>
                <button 
                  onClick={() => {
                    setIsCartOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex flex-col items-center p-3 text-gray-600 hover:text-green-600 transition-colors duration-200 rounded-lg active:bg-gray-100 relative"
                >
                  <ShoppingBag className="w-6 h-6 mb-1" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 text-white text-cosmt-xs h-5 w-5 flex items-center justify-center rounded-full" style={{ backgroundColor: '#00833F' }}>
                      {getTotalItems()}
                    </span>
                  )}
                  <span className="text-cosmt-xs font-medium">Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Search Modal */}
      <MobileSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />

      {/* Cart Sidebar */}
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />


      {/* User Profile Modal */}
      {showUserProfile && (
        <UserProfile
          onClose={() => setShowUserProfile(false)}
        />
      )}

      {/* Close dropdown when clicking outside */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </>
  );
};
