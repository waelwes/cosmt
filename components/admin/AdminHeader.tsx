'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Bell, 
  Settings, 
  User, 
  LogOut,
  Moon,
  Sun,
  Globe,
  ExternalLink
} from 'lucide-react';
import { Button } from '../ui/Button';
import { SimpleCurrencySelector } from './SimpleCurrencySelector';

interface AdminHeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export function AdminHeader({ isDarkMode, toggleDarkMode }: AdminHeaderProps) {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

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

  return (
    <header className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between h-14 px-3 sm:px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center">
          {/* Logo */}
          <Link href="/admin/dashboard" className="flex items-center">
            <Image
              src="/images/logos/COSMT.png"
              alt="COSMT Logo"
              width={80}
              height={24}
              className="h-6 w-auto"
            />
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2">
          {/* Back to Site Button */}
                  <a
                    href="/"
                    className="flex items-center px-2 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 rounded-md transition-colors"
                  >
            <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
            Back to Site
          </a>

          {/* Currency Selector */}
          <SimpleCurrencySelector />

          {/* Language Selector */}
          <div className="relative">
            <button className="flex items-center p-1.5 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              <Globe className="w-4 h-4" />
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-1.5 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-1.5 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white relative"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 z-50">
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Notifications</h3>
                  </div>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 ${notification.unread ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
                    >
                      <div className="flex items-start">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {notification.time}
                          </p>
                        </div>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="px-4 py-2 border-t border-gray-200">
                    <Button variant="outline" size="sm" className="text-cosmt-primary hover:text-cosmt-primary-dark">
                      View all notifications
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center p-1.5 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <User className="w-4 h-4" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 z-50">
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Admin User</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">admin@cosmat.com</p>
                  </div>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <User className="w-4 h-4 mr-3" />
                    Profile
                  </a>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </a>
                  <div className="border-t border-gray-200 dark:border-gray-700"></div>
                  <Button
                    onClick={handleLogout}
                    variant="secondary"
                    className="flex items-center w-full justify-start"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign out
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
