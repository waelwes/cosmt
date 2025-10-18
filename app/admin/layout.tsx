'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { SimpleCurrencySelector } from '../../components/admin/SimpleCurrencySelector';
import { LanguageSwitcher } from '../../components/ui/LanguageSwitcher';
import { useRTL } from '../../contexts/UnifiedLanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  Bell,
  Settings,
  User,
  LogOut,
  Sun,
  Moon,
  ChevronDown,
  Menu
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Auth context
  const { user, userProfile, loading, signOut, isAdmin } = useAuth();
  
  // RTL context
  const { language, direction, isRTL, isArabic } = useRTL();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if user is admin and redirect if not
  useEffect(() => {
    console.log('Admin layout check:', { mounted, loading, user: !!user, isAdmin, userProfile });
    if (mounted && !loading && user) {
      // Wait a bit for the profile to be loaded
      const timer = setTimeout(() => {
        console.log('Delayed admin check:', { isAdmin, userProfile });
        if (!isAdmin) {
          console.log('User is not admin after delay, redirecting to signin');
          router.push('/signin');
        } else {
          console.log('User is admin after delay, allowing access');
        }
      }, 1000); // Wait 1 second for profile to load
      
      return () => clearTimeout(timer);
    } else if (mounted && !loading && !user) {
      console.log('No user, redirecting to signin');
      router.push('/signin');
    }
  }, [mounted, loading, user, isAdmin, router, userProfile]);

  // Load dark mode preference
  useEffect(() => {
    if (mounted) {
      const savedDarkMode = localStorage.getItem('darkMode') === 'true';
      setIsDarkMode(savedDarkMode);
      
      if (savedDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [mounted]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/signin');
  };

  // Mock notifications
  const notifications = [
    { id: 1, message: 'New order received', time: '2 min ago', unread: true },
    { id: 2, message: 'Payment processed', time: '5 min ago', unread: true },
    { id: 3, message: 'Customer inquiry', time: '10 min ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-lg">Checking authentication...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-lg">Access denied. Redirecting...</div>
      </div>
    );
  }

  // Temporarily allow access if user exists, regardless of admin status
  if (!isAdmin) {
    console.log('User is not admin, but allowing access temporarily for debugging');
  }

  return (
    <div 
      className={`min-h-screen ${isDarkMode ? 'dark' : ''} bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100`}
      data-admin="true"
      dir={direction as 'ltr' | 'rtl'}
      style={{ 
        direction: direction as 'ltr' | 'rtl',
        textAlign: direction === 'rtl' ? 'right' : 'left'
      }}
    >
      <div 
        className={`flex ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}
        style={{ 
          direction: direction as 'ltr' | 'rtl',
          flexDirection: direction === 'rtl' ? 'row-reverse' : 'row'
        }}
      >
        {/* Sidebar */}
        <AdminSidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          isDarkMode={isDarkMode} 
          toggleDarkMode={toggleDarkMode}
        />
        
        {/* Main Content */}
        <div 
          className={`flex-1 flex flex-col ${isRTL ? 'lg:me-64' : 'lg:ms-64'}`}
          style={{ 
            direction: direction as 'ltr' | 'rtl',
            textAlign: direction === 'rtl' ? 'right' : 'left'
          }}
        >
          {/* Header */}
          <header 
            className="w-full border-b border-gray-200 dark:border-gray-700 px-6 py-4 shadow-sm"
            style={{ 
              direction: direction as 'ltr' | 'rtl',
              textAlign: direction === 'rtl' ? 'right' : 'left',
              backgroundColor: '#ffffff',
              background: '#ffffff'
            }}
          >
            <div 
              className={`flex items-center justify-between ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}
              style={{ 
                direction: direction as 'ltr' | 'rtl',
                flexDirection: direction === 'rtl' ? 'row-reverse' : 'row'
              }}
            >
              <div className={`flex items-center ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Mobile menu button */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors me-4 admin-header-button"
                >
                  <Menu className="w-5 h-5" />
                </button>
                
                <div>
                  <h1 
                    className="text-xl font-semibold text-gray-900 dark:text-white"
                    style={{ 
                      direction: direction as 'ltr' | 'rtl',
                      textAlign: direction === 'rtl' ? 'right' : 'left'
                    }}
                  >
                    {isArabic ? 'لوحة تحكم الإدارة' : 'Admin Dashboard'}
                    <span className="ms-2 px-2 py-1 bg-cosmt-primary text-white text-xs rounded">
                      {language.toUpperCase()} - {direction.toUpperCase()}
                    </span>
                  </h1>
                </div>
              </div>
              
              {/* Controls */}
              <div 
                className={`flex items-center ${direction === 'rtl' ? 'space-x-reverse space-x-4' : 'space-x-4'}`}
                style={{ 
                  direction: direction as 'ltr' | 'rtl',
                  flexDirection: direction === 'rtl' ? 'row-reverse' : 'row'
                }}
              >
                {/* Language Switcher */}
                <LanguageSwitcher />
                
                {/* Currency Selector */}
                <SimpleCurrencySelector />
                
                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors admin-header-button"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors relative admin-header-button"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  
                  {showNotifications && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-lg z-50">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{isArabic ? 'الإشعارات' : 'Notifications'}</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-100 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 ${
                              notification.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                            }`}
                          >
                            <p className="text-sm text-gray-900 dark:text-white">{notification.message}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors admin-header-button"
                  >
                    <User className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      {userProfile?.full_name || user?.email || 'Admin'}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-lg z-50">
                      <div className="py-2">
                        <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">
                          <Settings className="w-4 h-4 mr-3" />
                          {isArabic ? 'الإعدادات' : 'Settings'}
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          {isArabic ? 'تسجيل الخروج' : 'Sign Out'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>
          
          {/* Main Content */}
          <main 
            className="flex-1 p-6"
            style={{ 
              direction: direction as 'ltr' | 'rtl',
              textAlign: direction === 'rtl' ? 'right' : 'left'
            }}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
