'use client';

import React, { useState, useEffect, memo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { SimpleCurrencySelector } from '../../components/admin/SimpleCurrencySelector';
import LanguageSwitcher from '../../components/language/LanguageSwitcher';
import {
  Bell,
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
  Globe
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import './theme.css';

interface AdminLayoutProps {
  children: React.ReactNode;
}

// Admin layout content component that uses the language context
function AdminLayoutContent({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Always call useLanguage hook to maintain hook order
  let languageContext;
  try {
    languageContext = useLanguage();
  } catch (error) {
    // If context is not available, we'll handle it in the render
    languageContext = null;
  }

  // All other hooks must be called before any conditional returns
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [languageUpdateKey, setLanguageUpdateKey] = useState(0);

  // Prevent hydration mismatch by not rendering until mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Apply RTL/LTR direction to the admin container
  useEffect(() => {
    if (mounted && languageContext && typeof window !== 'undefined') {
      const { direction, currentLanguage } = languageContext;
      console.log('AdminLayout: Setting admin container direction:', direction, 'language:', currentLanguage);
      
      // Force RTL on the admin container
      const adminContainer = document.querySelector('[data-admin="true"]') as HTMLElement;
      if (adminContainer) {
        adminContainer.setAttribute('dir', direction);
        adminContainer.style.direction = direction;
      }
      
      console.log('AdminLayout: Admin container direction applied successfully');
    }
  }, [mounted, languageContext]);

  // Check if admin is logged in
  useEffect(() => {
    const checkAuth = () => {
      const adminLoggedIn = document.cookie
        .split(';')
        .some(cookie => cookie.trim().startsWith('adminLoggedIn=true'));
      
      if (!adminLoggedIn) {
        router.push('/signin');
      } else {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    // Initialize dark mode from localStorage
    const savedDarkMode = localStorage.getItem('admin-dark-mode') === 'true';
    setIsDarkMode(savedDarkMode);

    checkAuth();
  }, [router, pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showLanguageMenu) {
        setShowLanguageMenu(false);
      }
      if (showNotifications) {
        setShowNotifications(false);
      }
      if (showUserMenu) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLanguageMenu, showNotifications, showUserMenu]);

  // If not mounted, return children without language context
  if (!mounted) {
    return <>{children}</>;
  }

  // If context is not available after mounting, show error
  if (!languageContext) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-lg">
          Language Context Error: Context not available
        </div>
      </div>
    );
  }
  
  const { currentLanguage, setCurrentLanguage, languages, t, direction } = languageContext;

  const handleLogout = () => {
    // Clear admin session cookie
    document.cookie = 'adminLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/signin');
  };

  const notifications = [
    {
      id: 1,
      title: 'New Order Received',
      message: 'Order #12345 has been placed',
      time: '2 minutes ago',
      unread: true
    },
    {
      id: 2,
      title: 'Low Stock Alert',
      message: 'Hair Mask is running low (5 items left)',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      title: 'Payment Processed',
      message: 'Payment for Order #12344 completed',
      time: '3 hours ago',
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleLanguageChange = (languageCode: string) => {
    console.log('AdminLayout: Language change requested:', languageCode);
    console.log('AdminLayout: Current language before change:', currentLanguage);
    console.log('AdminLayout: Available languages:', languages.map(l => `${l.code}(${l.direction})`));
    
    // Find the language object
    const selectedLanguage = languages.find(lang => lang.code === languageCode);
    console.log('AdminLayout: Selected language object:', selectedLanguage);
    
    if (selectedLanguage) {
      console.log('AdminLayout: Selected language direction:', selectedLanguage.direction);
    }
    
    // Update the language
    setCurrentLanguage(languageCode);
    setShowLanguageMenu(false);
    
    // Force re-render
    setLanguageUpdateKey(prev => prev + 1);
    
    // Trigger a custom event to notify other components
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: languageCode } 
    }));
    
    console.log('AdminLayout: Language change event dispatched for:', languageCode);
    console.log('AdminLayout: Force re-render triggered');
    
    // Force a page refresh to ensure RTL is applied
    setTimeout(() => {
      console.log('AdminLayout: Forcing page refresh for RTL change');
      window.location.reload();
    }, 500);
  };


  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('admin-dark-mode', newDarkMode.toString());
  };

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-32 w-32">
            <img
              src="/images/logos/COSMT.png"
              alt="COSMT Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-gray-400 rounded animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1 h-1 bg-gray-400 rounded animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1 h-1 bg-gray-400 rounded animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Show full admin layout
  return (
    <div 
      className={`min-h-screen ${isDarkMode ? 'dark' : ''} bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100`}
      data-admin="true"
      dir={direction}
      style={{ 
        direction: direction,
        textAlign: direction === 'rtl' ? 'right' : 'left'
      }}
      key={`admin-layout-${currentLanguage}-${direction}-${languageUpdateKey}`}
    >
      <LanguageDebug />
      <div 
        className={`flex ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}
        style={{ 
          direction: direction,
          flexDirection: direction === 'rtl' ? 'row-reverse' : 'row'
        }}
      >
        {/* Sidebar - Position changes based on direction */}
        <div 
          className="admin-sidebar"
          style={{ 
            direction: direction,
            textAlign: direction === 'rtl' ? 'right' : 'left'
          }}
        >
          <AdminSidebar isOpen={true} onClose={() => {}} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        </div>

        {/* Main Content Area - Adjusts margin based on direction */}
        <div 
          className="flex-1 flex flex-col"
          style={{ 
            direction: direction,
            textAlign: direction === 'rtl' ? 'right' : 'left'
          }}
        >
          {/* Top Header with Controls */}
          <div className="admin-header admin-header-white bg-white dark:bg-gray-800" style={{ backgroundColor: '#ffffff' }}>
            {/* Header Content */}
            <div 
              className={`flex items-center justify-between h-16 px-6 ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}
              style={{ 
                direction: direction,
                flexDirection: direction === 'rtl' ? 'row-reverse' : 'row'
              }}
            >
              {/* Page Title - Position changes based on direction */}
              <div 
                className={`flex items-center ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
                style={{ 
                  direction: direction,
                  textAlign: direction === 'rtl' ? 'right' : 'left'
                }}
              >
                <h2 
                  className={`text-xl font-semibold text-gray-900 dark:text-white ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
                  style={{ 
                    direction: direction,
                    textAlign: direction === 'rtl' ? 'right' : 'left'
                  }}
                >
                  {t.adminDashboard}
                  <span className="ml-2 px-2 py-1 bg-cosmt-primary text-white text-xs rounded">
                    {currentLanguage.toUpperCase()} - {direction.toUpperCase()}
                  </span>
                </h2>
              </div>
              
              {/* Controls - Position changes based on direction */}
              <div 
                className={`flex items-center ${direction === 'rtl' ? 'space-x-reverse space-x-2' : 'space-x-2'}`}
                style={{ 
                  direction: direction,
                  flexDirection: direction === 'rtl' ? 'row-reverse' : 'row'
                }}
              >
                {/* Language Selector */}
                <div className="relative">
                  <button 
                    onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                    className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Select Language"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          {languages.find(lang => lang.code === currentLanguage)?.flag}
                        </span>
                  </button>
                  
                  {showLanguageMenu && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 z-50">
                      <div className="py-2">
                        {languages.map((language) => (
                          <button
                            key={language.code}
                            onClick={() => handleLanguageChange(language.code)}
                            className={`w-full flex items-center px-4 py-3 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${
                              currentLanguage === language.code 
                                ? 'bg-green-50 text-green-600 dark:bg-green-800 dark:text-green-300' 
                                : 'text-gray-700 dark:text-gray-100'
                            }`}
                          >
                            <span className="mr-3 text-lg">{language.flag}</span>
                            <span className="font-medium">{language.name}</span>
                            {currentLanguage === language.code && (
                              <span className="ml-auto text-green-600 dark:text-green-300">✓</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Currency Selector */}
                <SimpleCurrencySelector />

                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 rounded-lg transition-colors relative"
                    title="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {showNotifications && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 z-50">
                      <div className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-600">
                        {t.notifications}
                      </div>
                      <div className="divide-y divide-gray-100 dark:divide-gray-600">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 ${notification.unread ? 'bg-blue-50 dark:bg-blue-900' : ''} hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors`}
                          >
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{notification.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t border-gray-200 dark:border-gray-600">
                        <Button variant="outline" className="w-full text-center text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium">
                          {t.viewAllNotifications}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="User Menu"
                  >
                    <User className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Admin</span>
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 z-50">
                      <div className="py-2">
                        <Link
                          href="/admin/settings/profile"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          <span className="font-medium">{t.settings}</span>
                        </Link>
                        <Button
                          onClick={handleLogout}
                          variant="outline"
                          className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          <span className="font-medium">{t.signOut}</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
                      {/* Main Content */}
                      <div className="admin-main" style={{ backgroundColor: '#f9fafb' }}>
            <main className="py-4">
              <div className="w-full px-2 sm:px-3 lg:px-4 pr-2">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main admin layout - LanguageProvider is already provided by root layout
export default function AdminLayout({ children }: AdminLayoutProps) {
  return <AdminLayoutContent>{children}</AdminLayoutContent>;
}
