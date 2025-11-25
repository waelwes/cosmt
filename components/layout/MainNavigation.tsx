'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Search, Menu, X, ShoppingCart, User, Heart, LogOut, Globe } from 'lucide-react';
import { Input } from '../ui/Input';
import { MobileSearchModal } from './MobileSearchModal';
import { MegaMenu } from './MegaMenu';
import { CartSidebar } from '../ui/CartSidebar';
import { useCart } from '../../contexts/CartContextNew';
import { useSearch } from '../../contexts/SearchContext';
import { useAuth } from '../../contexts/AuthContextBypass';
import { useWishlist } from '../../contexts/WishlistContext';
import { useRTL } from '../../contexts/UnifiedLanguageContext';
import { useLanguage } from '../../contexts/UnifiedLanguageContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MultiLanguageLogo } from '../ui/MultiLanguageLogo';
import SimpleSitePreferencesDropdown from '../SimpleSitePreferencesDropdown';

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
  // Track if component is mounted (client-side only)
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;
      // Prevent body scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        // Restore scroll position
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    } else {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    }
  }, [isMobileMenuOpen]);
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
  const [isMobileUserMenuOpen, setIsMobileUserMenuOpen] = useState(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const preferencesButtonRef = React.useRef<HTMLButtonElement>(null);

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
    try {
      const results = typeof getFilteredResults === 'function' ? getFilteredResults() : getFilteredResults;
      return Array.isArray(results) ? results.slice(0, 8) : [];
    } catch (error) {
      return [];
    }
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

  // Close preferences dropdown when clicking outside
  useEffect(() => {
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

  // Listen for mega menu mouse events
  useEffect(() => {
    const handleMegaMenuMouseEnter = () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        setHoverTimeout(null);
      }
    };

    const handleMegaMenuMouseLeave = () => {
      const timeout = setTimeout(() => {
        setIsMegaMenuOpen(false);
        setMegaMenuCategory(null);
      }, 500);
      setHoverTimeout(timeout);
    };

    window.addEventListener('megaMenuMouseEnter', handleMegaMenuMouseEnter);
    window.addEventListener('megaMenuMouseLeave', handleMegaMenuMouseLeave);

    // Cleanup
    return () => {
      window.removeEventListener('megaMenuMouseEnter', handleMegaMenuMouseEnter);
      window.removeEventListener('megaMenuMouseLeave', handleMegaMenuMouseLeave);
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  // Close mega menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isMegaMenuOpen) {
        setIsMegaMenuOpen(false);
        setMegaMenuCategory(null);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMegaMenuOpen]);
  const navigationItems = useMemo(() => [
    { name: 'All Categories', href: '/categories' },
    { name: 'Hair Care', href: '/categories/hair-care' },
    { name: 'Skin Care', href: '/categories/skin-care' },
    { name: 'Brands', href: '/brands' },
    { name: 'Personal Care', href: '/categories/personal-care' },
    { name: 'Mother and Baby', href: '/categories/mother-baby' },
    { name: 'Make-up', href: '/categories/makeup' },
    { name: 'Electronic', href: '/categories/electronic' },
    { name: 'Discover', href: '/discover' },
  ], [t]);

  return (
    <>
      {/* Main Header Container */}
      <div className="cosmt-container pt-2 overflow-x-hidden w-full scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="max-w-7xl mx-auto flex flex-col items-center w-full">
          {/* Top Row */}
          <div className="relative flex items-center justify-between w-full h-12 px-4 md:px-8 py-2">
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Logo - Centered on mobile, left on desktop */}
            <div className="flex items-center absolute left-1/2 transform -translate-x-1/2 top-2 md:relative md:left-0 md:transform-none md:top-0 md:ml-16 md:mr-2 z-0" style={{ lineHeight: 0 }}>
              <MultiLanguageLogo
                size="md"
                href="/"
                priority
                className="h-8 w-auto"
              />
            </div>

            {/* Desktop Search - Perfectly Centered */}
            <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 search-dropdown-container" style={{ zIndex: 10 }}>
              <form onSubmit={handleSearch} className="w-[40rem] max-w-[calc(100vw-2rem)]">
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Search className="w-4 h-4" style={{ color: '#003d38' }} />
                  </div>
                  <input
                    type="search"
                    name="search"
                    value={searchInputValue}
                    onChange={handleSearchInputChange}
                    placeholder={isRTL ? "ابحث عن المنتجات والعلامات التجارية..." : "Search products, brands, and more..."}
                    className="w-full px-3 py-2 pr-10 text-sm rounded-md bg-white text-gray-900 placeholder-gray-500 border border-[#ededed] focus:outline-none focus:ring-2 focus:ring-[#003d38] transition-colors duration-200"
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#111827',
                    }}
                    onFocus={(e) => {
                      e.target.style.boxShadow = '0 0 0 3px rgba(0, 61, 56, 0.1)';
                      handleSearchInputFocus(); // Open the dropdown
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </form>
            </div>

            {/* Search Results Dropdown - Outside container */}
            {isSearchDropdownOpen && (
              <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 w-[40rem] max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-t-none rounded-lg shadow-xl z-[9999] max-h-96 overflow-y-auto scrollbar-hide search-dropdown-container" style={{ backgroundColor: 'white', marginTop: '24px', marginLeft: '-64px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-900">
                      {searchQuery.trim() ? `Search Results (${getFilteredResults().length})` : 'Trending Products'}
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
                    getFilteredResults().length > 0 ? (
                      <div className="space-y-2">
                        {getFilteredResults().slice(0, 5).map((product: any) => (
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
                              <p className="text-sm font-semibold" style={{ color: '#003d38' }}>{product.price}</p>
                            </div>
                          </div>
                        ))}

                        {getFilteredResults().length > 5 && (
                          <div className="pt-2 border-t border-gray-200">
                            <button
                              onClick={() => {
                                router.push('/search');
                                setIsSearchDropdownOpen(false);
                              }}
                              className="w-full text-center text-sm font-medium"
                              style={{ color: '#003d38' }}
                              onMouseEnter={(e) => e.currentTarget.style.color = '#002a25'}
                              onMouseLeave={(e) => e.currentTarget.style.color = '#003d38'}
                            >
                              View all {getFilteredResults().length} results
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
                              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full transition-colors duration-200"
                              style={{ backgroundColor: 'inherit' }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#e6f7f5';
                                e.currentTarget.style.color = '#003d38';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '';
                                e.currentTarget.style.color = '';
                              }}
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
                                <p className="text-sm font-semibold" style={{ color: '#003d38' }}>{product.price}</p>
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
                          className="w-full text-center text-sm font-medium"
                          style={{ color: '#003d38' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#002a25'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#003d38'}
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
            <div className="flex items-center ml-auto gap-0 md:space-x-2 -mr-4 md:mr-0">
              {/* Mobile search button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="md:hidden p-0.5 text-gray-600 hover:text-gray-900 transition-colors duration-200 -mr-2"
              >
                <Search className="w-5 h-5" style={{ color: '#003d38' }} />
              </button>

              {/* Mobile wishlist button */}
              <button
                onClick={() => router.push('/wishlist')}
                className="md:hidden p-0.5 text-gray-600 hover:text-gray-900 relative transition-colors duration-200 -mx-1"
              >
                <Heart className="w-5 h-5" />
                {getWishlistCount() > 0 && (
                  <span className="absolute -top-1 -right-1 text-white text-cosmt-xs h-4 w-4 flex items-center justify-center rounded-full text-xs" style={{ backgroundColor: '#00833F' }}>
                    {getWishlistCount()}
                  </span>
                )}
              </button>

              {/* Mobile user menu */}
              <div className="relative md:hidden">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMobileUserMenuOpen(!isMobileUserMenuOpen);
                  }}
                  className="p-0.5 text-gray-600 hover:text-gray-900 transition-colors duration-200 -mx-1"
                >
                  <User className="w-5 h-5" />
                </button>

                {/* Mobile User Dropdown */}
                {isMobileUserMenuOpen && (
                  <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[60]">
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
                            router.push('/account');
                            setIsMobileUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-cosmt-sm text-gray-700 hover:bg-gray-50"
                        >
                          Settings
                        </button>
                        <button
                          onClick={() => {
                            router.push('/orders');
                            setIsMobileUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-cosmt-sm text-gray-700 hover:bg-gray-50"
                        >
                          Order History
                        </button>
                        {(userProfile?.role === 'admin' || user.email === 'admin@cosmat.com') && (
                          <button
                            onClick={() => {
                              router.push('/admin');
                              setIsMobileUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-cosmt-sm text-gray-700 hover:bg-gray-50"
                          >
                            Admin Dashboard
                          </button>
                        )}
                        <button
                          onClick={() => {
                            signOut();
                            setIsMobileUserMenuOpen(false);
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
                            setIsMobileUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-cosmt-sm text-gray-700 hover:bg-gray-50"
                        >
                          Sign In
                        </button>
                        <button
                          onClick={() => {
                            router.push('/signup');
                            setIsMobileUserMenuOpen(false);
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

              {/* Mobile cart button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="md:hidden p-0.5 text-gray-600 hover:text-gray-900 relative transition-colors duration-200 -ml-2"
              >
                <ShoppingCart className="w-5 h-5" />
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
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsUserMenuOpen(!isUserMenuOpen);
                    }}
                    className="flex items-center space-x-2 p-1.5 text-black transition-colors duration-200"
                    style={{ color: 'inherit' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#003d38'}
                    onMouseLeave={(e) => e.currentTarget.style.color = ''}
                  >
                    <User className="w-5 h-5" />
                  </button>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[60]">
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
                              router.push('/account');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-cosmt-sm text-gray-700 hover:bg-gray-50"
                          >
                            Settings
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
                  className="flex items-center space-x-2 p-1.5 text-black relative transition-colors duration-200"
                  style={{ color: 'inherit' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#003d38'}
                  onMouseLeave={(e) => e.currentTarget.style.color = ''}
                >
                  <Heart className="w-5 h-5" />
                  {getWishlistCount() > 0 && (
                    <span className="absolute -top-1 -right-1 text-white text-cosmt-xs h-5 w-5 flex items-center justify-center rounded-full" style={{ backgroundColor: '#00833F' }}>
                      {getWishlistCount()}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="flex items-center space-x-2 p-1.5 text-black relative transition-colors duration-200"
                  style={{ color: 'inherit' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#003d38'}
                  onMouseLeave={(e) => e.currentTarget.style.color = ''}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 text-white text-cosmt-xs h-5 w-5 flex items-center justify-center rounded-full" style={{ backgroundColor: '#00833F' }}>
                      {getTotalItems()}
                    </span>
                  )}
                </button>

                {/* Site Preferences */}
                <div className="relative">
                  <button
                    ref={preferencesButtonRef}
                    onClick={() => setIsPreferencesOpen(!isPreferencesOpen)}
                    className="flex items-center justify-center w-8 h-8 text-black transition-all duration-200 rounded-md relative z-10"
                    style={{ color: 'inherit' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#003d38'}
                    onMouseLeave={(e) => e.currentTarget.style.color = ''}
                    title="Site Preferences"
                    aria-label="Open Site Preferences"
                  >
                    <Globe className="w-5 h-5" />
                  </button>

                  {/* Site Preferences Dropdown */}
                  <SimpleSitePreferencesDropdown
                    isOpen={isPreferencesOpen}
                    onClose={() => setIsPreferencesOpen(false)}
                    buttonRef={preferencesButtonRef as React.RefObject<HTMLButtonElement>}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Desktop Navigation - Full width container */}
      <div style={{ backgroundColor: '#ededed', height: '1px', marginTop: '10px' }}></div>
      <div className="cosmt-container">
        <div className="max-w-7xl mx-auto">
          <div
            className="hidden md:block w-full overflow-x-auto"
            onMouseLeave={handleMouseLeave}
          >
            <nav className="flex flex-nowrap justify-start space-x-8 md:space-x-12 lg:space-x-16 pt-3 pb-3 pl-12 pr-8" style={{ borderTop: '1px solid #ededed' }}>
              {navigationItems.map((item) => (
                <div key={item.name} className="relative">
                  <a
                    href={item.href}
                    className="text-cosmt-sm text-black font-medium transition-colors duration-200"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#003d38';
                      handleMouseEnter(item.name);
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '';
                      handleMouseLeave();
                    }}
                  >
                    {item.name}
                  </a>
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Mega Menu - Portal to body to avoid overflow issues */}
      {isMounted && createPortal(
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
        </div>,
        document.body
      )}

      {/* Mobile Menu Drawer - Portal to body */}
      {isMounted && createPortal(
        <>
          {/* Full Screen Shadow Overlay */}
          <div
            className={`fixed top-0 left-0 right-0 bottom-0 bg-black/50 z-[9998] pointer-events-auto md:hidden transition-opacity duration-400 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: '100vh',
              zIndex: 9998,
              transition: `opacity var(--cosmt-transition-duration) var(--cosmt-transition-easing)`
            }}
          />

          {/* Sidebar - Slides in from left */}
          <div
            className="fixed left-0 top-0 w-full max-w-md bg-white border-r border-gray-200 z-[9999] md:hidden"
            style={{
              boxShadow: '4px 0 15px rgba(0, 0, 0, 0.1)',
              transition: `transform var(--cosmt-transition-duration) var(--cosmt-transition-easing), box-shadow var(--cosmt-transition-duration) var(--cosmt-transition-easing)`,
              position: 'fixed',
              top: 0,
              left: 0,
              height: '100vh',
              width: '100%',
              maxWidth: '28rem',
              display: 'flex',
              flexDirection: 'column',
              WebkitOverflowScrolling: 'touch',
              transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
              visibility: isMobileMenuOpen ? 'visible' : 'visible',
              zIndex: 9999
            }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                <h2 className="text-lg font-bold text-gray-900">Menu</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto p-4 min-h-0 scrollbar-hide" style={{
                scrollbarWidth: 'none', /* Firefox */
                msOverflowStyle: 'none', /* IE and Edge */
              }}>
                <div className="space-y-1">
                  {navigationItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block px-4 py-3 text-base text-gray-700 hover:bg-gray-50 font-medium transition-colors duration-200 rounded-lg active:bg-gray-100"
                      style={{ color: 'inherit' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#003d38'}
                      onMouseLeave={(e) => e.currentTarget.style.color = ''}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>

                {/* Account Actions */}
                <div className="pt-6 border-t border-gray-200 mt-6">
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        router.push('/account');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200 rounded-lg active:bg-gray-100"
                      style={{ color: 'inherit' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#003d38'}
                      onMouseLeave={(e) => e.currentTarget.style.color = ''}
                    >
                      <User className="w-5 h-5 mr-3" />
                      <span className="text-base font-medium">Account</span>
                    </button>
                    <button
                      onClick={() => {
                        router.push('/wishlist');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200 rounded-lg active:bg-gray-100 relative"
                      style={{ color: 'inherit' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#003d38'}
                      onMouseLeave={(e) => e.currentTarget.style.color = ''}
                    >
                      <Heart className="w-5 h-5 mr-3" />
                      <span className="text-base font-medium">Wishlist</span>
                      {getWishlistCount() > 0 && (
                        <span className="ml-auto text-white text-xs h-5 w-5 flex items-center justify-center rounded-full" style={{ backgroundColor: '#003d38' }}>
                          {getWishlistCount()}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setIsCartOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200 rounded-lg active:bg-gray-100 relative"
                      style={{ color: 'inherit' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#003d38'}
                      onMouseLeave={(e) => e.currentTarget.style.color = ''}
                    >
                      <ShoppingCart className="w-5 h-5 mr-3" />
                      <span className="text-base font-medium">Cart</span>
                      {getTotalItems() > 0 && (
                        <span className="ml-auto text-white text-xs h-5 w-5 flex items-center justify-center rounded-full" style={{ backgroundColor: '#003d38' }}>
                          {getTotalItems()}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}

      {/* Mobile Search Modal - Portal to body */}
      {isMounted && createPortal(
        <MobileSearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />,
        document.body
      )}

      {/* Cart Sidebar - Portal to body */}
      {isMounted && createPortal(
        <CartSidebar
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />,
        document.body
      )}



      {/* Close dropdown when clicking outside */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}

      {/* Close mobile user dropdown when clicking outside */}
      {isMobileUserMenuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setIsMobileUserMenuOpen(false)}
        />
      )}
    </>
  );
};
