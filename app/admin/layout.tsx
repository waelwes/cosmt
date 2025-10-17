'use client';

import React, { useState, useEffect, memo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
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
// import { CurrencyProvider } from '../../contexts/CurrencyContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  // Sidebar is always visible, no toggle needed
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

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

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
  ];

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    setShowLanguageMenu(false);
    // Here you would typically:
    // 1. Update the app's language context
    // 2. Save to localStorage
    // 3. Reload translations
    console.log('Language changed to:', languageCode);
  };

  useEffect(() => {
    // Check if admin is logged in
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

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('admin-dark-mode', newDarkMode.toString());
  };

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div 
          className="animate-spin h-32 w-32 border-4 border-gray-200 border-t-green-600" 
          style={{
            borderRadius: '50%',
            borderStyle: 'solid',
            borderWidth: '4px',
            borderColor: '#e5e7eb transparent #e5e7eb #e5e7eb',
            borderTopColor: '#059669'
          }}
        ></div>
      </div>
    );
  }

  // Show full admin layout
  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100`} data-admin="true">
      <div className="flex">
        {/* Left Sidebar - Starting from top */}
        <div className="admin-sidebar">
          <AdminSidebar isOpen={true} onClose={() => {}} />
        </div>
        
        {/* Right side - Header + Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Header with Controls */}
          <div className="admin-header admin-header-white bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm" style={{ backgroundColor: '#ffffff' }}>
            <div className="flex items-center justify-between h-12 px-4">
              {/* Left side - Breadcrumb or Page Title */}
              <div className="flex items-center">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  Admin Dashboard
                </h2>
              </div>
              
              {/* Right side - Controls */}
              <div className="flex items-center space-x-1">
                {/* Language Selector */}
                <div className="relative">
                  <button 
                    onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                    className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Select Language"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                      {languages.find(lang => lang.code === selectedLanguage)?.flag}
                    </span>
                  </button>
                  
                  {showLanguageMenu && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-lg z-50">
                      <div className="py-2">
                        {languages.map((language) => (
                          <button
                            key={language.code}
                            onClick={() => handleLanguageChange(language.code)}
                            className={`w-full flex items-center px-4 py-3 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${
                              selectedLanguage === language.code 
                                ? 'bg-green-50 text-green-600 dark:bg-green-800 dark:text-green-300' 
                                : 'text-gray-700 dark:text-gray-100'
                            }`}
                          >
                            <span className="mr-3 text-lg">{language.flag}</span>
                            <span className="font-medium">{language.name}</span>
                            {selectedLanguage === language.code && (
                              <span className="ml-auto text-green-600 dark:text-green-300">✓</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

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
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-lg z-50">
                      <div className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-600">
                        Notifications
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
                        <Button variant="ghost" className="w-full text-center text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium">
                          View all notifications
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
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-lg z-50">
                      <div className="py-2">
                        <Link
                          href="/admin/settings/profile"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          <span className="font-medium">Settings</span>
                        </Link>
                        <Button
                          onClick={handleLogout}
                          variant="ghost"
                          className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          <span className="font-medium">Sign out</span>
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
            <main className="py-2">
              <div className="max-w-5xl mx-auto px-2 sm:px-3 lg:px-4">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
