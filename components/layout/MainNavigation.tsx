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
import { useAuth } from '../../contexts/AuthContextBypass';
import { useWishlist } from '../../contexts/WishlistContext';
import { useRTL } from '../../contexts/UnifiedLanguageContext';
import { useLanguage } from '../../contexts/UnifiedLanguageContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MultiLanguageLogo } from '../ui/MultiLanguageLogo';

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
  const { searchQuery, setSearchQuery, getFilteredResults } = useSearch();
  const { user, userProfile, signOut } = useAuth();
  const { getWishlistCount } = useWishlist();
  const { isRTL } = useRTL();
  const { t } = useLanguage();
  const router = useRouter();
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [megaMenuCategory, setMegaMenuCategory] = useState<string | null>(null);
  
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState('');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (query && query.trim()) {
      setSearchQuery(query);
      setIsSearchDropdownOpen(true);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInputValue(value);
    setSearchQuery(value);
    setIsSearchDropdownOpen(true); // Always show dropdown when typing
  };

  const handleSearchInputFocus = () => {
    setIsSearchDropdownOpen(true);
  };

  // Get trending products (you can modify this to get actual trending products)
  const getTrendingProducts = () => {
    return getFilteredResults.slice(0, 8); // Show first 8 products as trending
  };

  // Popular search tags
  const popularSearchTags = [
    'Skincare', 'Makeup', 'Hair Care', 'Fragrance', 'Anti-aging', 
    'Moisturizer', 'Serum', 'Cleanser', 'Sunscreen', 'Lipstick'
  ];

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSearchDropdownOpen && !(event.target as Element).closest('.search-dropdown-container')) {
        setIsSearchDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchDropdownOpen]);

  const handleMouseEnter = (categoryName: string) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setMegaMenuCategory(categoryName);
    setIsMegaMenuOpen(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsMegaMenuOpen(false);
      setMegaMenuCategory(null);
    }, 500); // Increased to 500ms delay before closing
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
    { name: 'All Categories', href: '/categories' },
    { name: 'Hair Care', href: '/categories/hair-care' },
    { name: 'Skin Care', href: '/categories/skin-care' },
    { name: 'Personal Care', href: '/categories/personal-care' },
    { name: 'Mother and Baby', href: '/categories/mother-baby' },
    { name: 'Make-up', href: '/categories/makeup' },
    { name: 'Electronic', href: '/categories/electronic' },
    { name: 'Discover', href: '/discover' },
    { name: 'Brands', href: '/brands' },
  ], [t]);

  return (
    <>
      {/* Main Header Container */}
      <div className="cosmt-container pt-2">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          {/* Top Row */}
          <div className="relative flex items-center w-full h-12 px-4 md:px-8 py-2">
            {/* Mobile menu button */}
            <div className="flex items-center mr-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

             {/* Logo */}
             <div className="flex items-center mr-2">
               <MultiLanguageLogo
                 size="md"
                 href="/"
                 priority
                 className="h-8 w-auto"
               />
             </div>

            {/* Desktop Search - Perfectly Centered */}
            <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <form onSubmit={handleSearch} className="w-[40rem] -ml-32">
            <Input
              type="search"
              name="search"
              value={searchInputValue}
              onChange={handleSearchInputChange}
              onFocus={handleSearchInputFocus}
              placeholder={isRTL ? "ابحث عن المنتجات والعلامات التجارية..." : "Search products, brands, and more..."}
              icon={<Search className="w-4 h-4 text-green-600" />}
              className="!rounded-sm"
            />
              </form>
            </div>
            
            {/* Search Results Dropdown - Outside container */}
            {isSearchDropdownOpen && (
              <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 w-[40rem] bg-white border border-gray-200 rounded-t-none rounded-lg shadow-xl z-[9999] max-h-96 overflow-y-auto" style={{backgroundColor: 'white', marginTop: '24px', marginLeft: '-64px'}}>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-gray-900">
                          {searchQuery.trim() ? `Search Results (${getFilteredResults.length})` : 'Trending Products'}
                        </h3>
                        <button
                          onClick={() => setIsSearchDropdownOpen(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {searchQuery.trim() ? (
                        // Search Results
                        getFilteredResults.length > 0 ? (
                          <div className="space-y-2">
                            {getFilteredResults.slice(0, 5).map((product: any) => (
                              <div
                                key={product.id}
                                className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                onClick={() => {
                                  router.push(`/product/${product.id}`);
                                  setIsSearchDropdownOpen(false);
                                }}
                              >
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {product.name}
                                  </p>
                                  <p className="text-xs text-gray-500">{product.brand}</p>
                                  <p className="text-sm font-semibold text-green-600">{product.price}</p>
                                </div>
                              </div>
                            ))}
                            
                            {getFilteredResults.length > 5 && (
                              <div className="pt-2 border-t border-gray-200">
                                <button
                                  onClick={() => {
                                    router.push('/search');
                                    setIsSearchDropdownOpen(false);
                                  }}
                                  className="w-full text-center text-sm text-green-600 hover:text-green-700 font-medium"
                                >
                                  View all {getFilteredResults.length} results
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-sm text-gray-500">No products found</p>
                          </div>
                        )
                      ) : (
                        // Trending Products and Popular Search Tags
                        <div className="space-y-4">
                          {/* Popular Search Tags */}
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                              Popular Searches
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {popularSearchTags.map((tag, index) => (
                                <button
                                  key={index}
                                  onClick={() => {
                                    setSearchInputValue(tag);
                                    setSearchQuery(tag);
                                  }}
                                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-700 rounded-full transition-colors duration-200"
                                >
                                  {tag}
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          {/* Trending Products */}
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                              Trending Products
                            </h4>
                            <div className="space-y-2">
                              {getTrendingProducts().map((product: any) => (
                                <div
                                  key={product.id}
                                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                  onClick={() => {
                                    router.push(`/product/${product.id}`);
                                    setIsSearchDropdownOpen(false);
                                  }}
                                >
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {product.name}
                                    </p>
                                    <p className="text-xs text-gray-500">{product.brand}</p>
                                    <p className="text-sm font-semibold text-green-600">{product.price}</p>
                                  </div>
                                  <div className="text-xs text-yellow-600 font-medium">
                                    ⭐ {product.rating}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="pt-2 border-t border-gray-200">
                            <button
                              onClick={() => {
                                router.push('/search');
                                setIsSearchDropdownOpen(false);
                              }}
                              className="w-full text-center text-sm text-green-600 hover:text-green-700 font-medium"
                            >
                              View all products
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
            )}

            {/* Right side icons */}
            <div className="flex items-center ml-auto space-x-1 md:space-x-2">
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
            <div className="hidden md:flex items-center space-x-4">
              {/* User Menu */}
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-1.5 text-black hover:text-green-600 transition-colors duration-200"
                >
                  <User className="w-5 h-5" />
                  <span className="text-xs font-medium" style={{ fontSize: '13px' }}>Account</span>
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
                            router.push('/customer/profile');
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
                className="flex items-center space-x-2 p-1.5 text-black hover:text-green-600 relative transition-colors duration-200"
              >
                <Heart className="w-5 h-5" />
                <span className="text-xs font-medium" style={{ fontSize: '13px' }}>Wishlist</span>
                {getWishlistCount() > 0 && (
                  <span className="absolute -top-1 -right-1 text-white text-cosmt-xs h-5 w-5 flex items-center justify-center rounded-full" style={{ backgroundColor: '#00833F' }}>
                    {getWishlistCount()}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="flex items-center space-x-2 p-1.5 text-black hover:text-green-600 relative transition-colors duration-200"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="text-xs font-medium" style={{ fontSize: '13px' }}>Cart</span>
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
      </div>

      {/* Border line between header and navigation - Full width, moved down */}
      <div className="w-full border-t border-gray-200 mt-2"></div>

      {/* Desktop Navigation - Full width container */}
      <div className="cosmt-container">
        <div className="max-w-7xl mx-auto">
          <div 
            className="hidden md:block relative w-full"
            onMouseLeave={handleMouseLeave}
          >
            <nav className="flex justify-center space-x-16 pt-3 pb-3 px-8">
             {navigationItems.map((item) => (
               <div key={item.name} className="relative">
                 <a
                   href={item.href}
                   className="text-cosmt-sm text-black hover:text-green-600 font-medium transition-colors duration-200"
                   onMouseEnter={() => handleMouseEnter(item.name)}
                   onMouseLeave={handleMouseLeave}
                 >
                   {item.name}
                 </a>
               </div>
             ))}
           </nav>
          
          {/* Mega Menu */}
          <div onMouseEnter={() => {
            if (hoverTimeout) {
              clearTimeout(hoverTimeout);
              setHoverTimeout(null);
            }
          }}>
            <MegaMenu 
              isOpen={isMegaMenuOpen} 
              onClose={() => setIsMegaMenuOpen(false)}
              categoryName={megaMenuCategory || undefined}
            />
          </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white shadow-lg">
          <div className="px-4 pt-4 pb-6 space-y-2 text-left">
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
