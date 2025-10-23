'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useRTL } from '../../contexts/UnifiedLanguageContext';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Warehouse, 
  Megaphone, 
  FileText, 
  Settings, 
  Grid3X3, 
  HelpCircle,
  X,
  BarChart3,
  List,
  Tag,
  Layers,
  Archive,
  CreditCard,
  FileSpreadsheet,
  ShoppingBag,
  Receipt,
  UserCheck,
  UserPlus,
  UserCog,
  Package2,
  Truck,
  Building2,
  ShoppingBasket,
  MegaphoneIcon,
  Gift,
  Star,
  Globe,
  FileEdit,
  Shield,
  Menu,
  Component,
  MessageCircle,
  Mail,
  Calendar,
  CheckSquare,
  Bug,
  BookOpen,
  HelpCircleIcon,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Button } from '../ui/Button';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export function AdminSidebar({ isOpen, onClose, isDarkMode, toggleDarkMode }: AdminSidebarProps) {
  const pathname = usePathname();
  const { isRTL, isArabic, direction } = useRTL();
  const [expandedTabs, setExpandedTabs] = React.useState<string[]>(['Dashboard']);
  
  // Prevent body scroll when sidebar is open on mobile
  React.useEffect(() => {
    if (isOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('sidebar-open');
    };
  }, [isOpen]);
  

  const toggleTab = (tabTitle: string) => {
    setExpandedTabs(prev => 
      prev.includes(tabTitle) 
        ? prev.filter(tab => tab !== tabTitle)
        : [...prev, tabTitle]
    );
  };

  const getTranslation = (key: string) => {
    const translations: { [key: string]: { en: string; ar: string } } = {
      dashboard: { en: 'Dashboard', ar: 'لوحة التحكم' },
      analytics: { en: 'Analytics', ar: 'التحليلات' },
      products: { en: 'Products', ar: 'المنتجات' },
      allProducts: { en: 'All Products', ar: 'جميع المنتجات' },
      collections: { en: 'Collections', ar: 'المجموعات' },
      categories: { en: 'Categories', ar: 'الفئات' },
      attributes: { en: 'Attributes', ar: 'الخصائص' },
      inventory: { en: 'Inventory', ar: 'المخزون' },
      orders: { en: 'Orders', ar: 'الطلبات' },
      allOrders: { en: 'All Orders', ar: 'جميع الطلبات' },
      carts: { en: 'Cart Management', ar: 'إدارة العربات' },
      checkout: { en: 'Checkout', ar: 'الدفع' },
      invoices: { en: 'Invoices', ar: 'الفواتير' },
      customers: { en: 'Customers', ar: 'العملاء' },
      marketing: { en: 'Marketing', ar: 'التسويق' },
      campaigns: { en: 'Campaigns', ar: 'الحملات' },
      coupons: { en: 'Coupons', ar: 'الكوبونات' },
      content: { en: 'Content', ar: 'المحتوى' },
      settings: { en: 'Settings', ar: 'الإعدادات' },
      general: { en: 'General', ar: 'عام' },
      profile: { en: 'Profile', ar: 'الملف الشخصي' },
      users: { en: 'Users', ar: 'المستخدمون' },
      roles: { en: 'Roles', ar: 'الأدوار' },
      permissions: { en: 'Permissions', ar: 'الأذونات' },
      payment: { en: 'Payment', ar: 'الدفع' },
      shipping: { en: 'Shipping', ar: 'الشحن' },
      notifications: { en: 'Notifications', ar: 'الإشعارات' },
      apps: { en: 'Apps & Tools', ar: 'التطبيقات والأدوات' },
      support: { en: 'Support', ar: 'الدعم' },
      backToSite: { en: 'Back to Site', ar: 'العودة للموقع' },
      adminUser: { en: 'Admin User', ar: 'مستخدم الإدارة' },
      adminEmail: { en: 'admin@cosmat.com', ar: 'admin@cosmat.com' }
    };
    
    return translations[key] ? translations[key][isArabic ? 'ar' : 'en'] : key;
  };

  const menuItems = [
    {
      title: getTranslation('dashboard'),
      icon: LayoutDashboard,
      href: '/admin',
      children: [
        { title: 'Overview', href: '/admin', icon: BarChart3 },
        { title: getTranslation('analytics'), href: '/admin/analytics', icon: BarChart3 }
      ]
    },
    {
      title: getTranslation('products'),
      icon: Package,
      href: '/admin/products',
      children: [
        { title: getTranslation('allProducts'), href: '/admin/products', icon: List },
        { title: getTranslation('collections'), href: '/admin/products/collections', icon: Tag },
        { title: getTranslation('categories'), href: '/admin/products/categories', icon: Layers },
        { title: getTranslation('attributes'), href: '/admin/products/attributes', icon: Tag },
        { title: getTranslation('inventory'), href: '/admin/products/inventory', icon: Archive }
      ]
    },
    {
      title: getTranslation('orders'),
      icon: ShoppingCart,
      href: '/admin/orders',
      children: [
        { title: getTranslation('allOrders'), href: '/admin/orders', icon: List },
        { title: 'Order Details', href: '/admin/orders/details', icon: FileSpreadsheet },
        { title: getTranslation('carts'), href: '/admin/orders/carts', icon: ShoppingBag },
        { title: getTranslation('checkout'), href: '/admin/orders/checkout', icon: CreditCard },
        { title: getTranslation('invoices'), href: '/admin/orders/invoices', icon: Receipt }
      ]
    },
    {
      title: getTranslation('customers'),
      icon: Users,
      href: '/admin/customers',
      children: [
        { title: 'All Customers', href: '/admin/customers', icon: List },
        { title: 'Customer List', href: '/admin/customers/list', icon: UserCheck },
        { title: 'Customer Details', href: '/admin/customers/details', icon: UserPlus },
        { title: 'User Management', href: '/admin/customers/users', icon: UserCog }
      ]
    },
    {
      title: 'Inventory',
      icon: Warehouse,
      href: '/admin/inventory',
      children: [
        { title: 'Stock Management', href: '/admin/inventory/stock', icon: Package2 },
        { title: 'Received Orders', href: '/admin/inventory/received', icon: Truck },
        { title: 'Warehouse', href: '/admin/inventory/warehouse', icon: Building2 },
        { title: 'Purchase Orders', href: '/admin/inventory/purchase', icon: ShoppingBasket }
      ]
    },
    {
      title: getTranslation('marketing'),
      icon: Megaphone,
      href: '/admin/marketing',
      children: [
        { title: getTranslation('campaigns'), href: '/admin/marketing/campaigns', icon: MegaphoneIcon },
        { title: getTranslation('coupons'), href: '/admin/marketing/coupons', icon: Gift },
        { title: 'Reviews', href: '/admin/marketing/reviews', icon: Star },
        { title: 'Website Control', href: '/admin/marketing/website', icon: Globe }
      ]
    },
    {
      title: getTranslation('content'),
      icon: FileText,
      href: '/admin/content',
      children: [
        { title: 'Custom Pages', href: '/admin/content/pages', icon: FileEdit },
        { title: 'Theme Customizer', href: '/admin/theme-customizer', icon: Settings },
        { title: 'Authentication', href: '/admin/content/auth', icon: Shield },
        { title: 'Menu Items', href: '/admin/content/menu', icon: Menu },
        { title: 'Components', href: '/admin/content/components', icon: Component }
      ]
    },
    {
      title: getTranslation('settings'),
      icon: Settings,
      href: '/admin/settings',
      children: [
        { title: getTranslation('general'), href: '/admin/settings/general', icon: Settings },
        { title: getTranslation('profile'), href: '/admin/settings/profile', icon: UserCog },
        { title: getTranslation('users'), href: '/admin/settings/users', icon: Users },
        { title: getTranslation('roles'), href: '/admin/settings/roles', icon: ShieldCheck },
        { title: getTranslation('permissions'), href: '/admin/settings/permissions', icon: Shield },
        { title: getTranslation('payment'), href: '/admin/settings/payment', icon: CreditCard },
        { title: getTranslation('shipping'), href: '/admin/settings/shipping', icon: Truck },
        { title: getTranslation('notifications'), href: '/admin/settings/notifications', icon: Mail }
      ]
    },
    {
      title: getTranslation('apps'),
      icon: Grid3X3,
      href: '/admin/apps',
      children: [
        { title: 'Chat', href: '/admin/apps/chat', icon: MessageCircle },
        { title: 'Email', href: '/admin/apps/email', icon: Mail },
        { title: 'Calendar', href: '/admin/apps/calendar', icon: Calendar },
        { title: 'Todo', href: '/admin/apps/todo', icon: CheckSquare },
        { title: 'Debug', href: '/admin/apps/debug', icon: Bug }
      ]
    },
    {
      title: getTranslation('support'),
      icon: HelpCircle,
      href: '/admin/support',
      children: [
        { title: 'Help Center', href: '/admin/support/help', icon: BookOpen },
        { title: 'FAQs', href: '/admin/support/faqs', icon: HelpCircleIcon },
        { title: 'Privacy Policy', href: '/admin/support/privacy', icon: ShieldCheck },
        { title: 'View Site', href: '/', icon: ExternalLink }
      ]
    }
  ];

  const isActive = (href: string) => pathname === href;
  const isParentActive = (children: any[]) => children && children.some(child => pathname === child.href);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="mobile-sidebar-overlay lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div 
        className={`fixed inset-y-0 z-[70] w-64 transform transition-transform duration-300 ease-in-out ${
          isRTL 
            ? `right-0 ${isOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0`
            : `left-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`
        }`}
      >
        {/* Sidebar */}
        <div 
          className={`admin-sidebar w-full h-full flex flex-col bg-black dark:bg-black ${isOpen ? 'open' : ''}`}
          style={{ 
            backgroundColor: '#000000',
            direction: direction,
            textAlign: isRTL ? 'right' : 'left'
          }}
        >
        {/* Header Section - Logo Only */}
        <div className="px-4 py-4 relative">
          {/* Close button - positioned absolutely */}
          <button
            onClick={onClose}
            className="lg:hidden absolute right-4 top-1/2 transform -translate-y-1/2 p-3 text-white hover:bg-gray-700 transition duration-150 touch-manipulation"
            style={{ borderRadius: '0.25rem', minWidth: '44px', minHeight: '44px' }}
            title="Close Navigation Menu"
          >
            <X className="w-6 h-6" />
          </button>
          
          {/* Logo aligned with navigation items */}
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <Link href="/admin/dashboard" className="flex items-center px-3">
              <Image
                src="http://localhost:3000/images/logos/COSMT.png"
                alt="COSMT Logo"
                width={80}
                height={24}
                className="h-6 w-auto"
              />
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto sidebar-scrollbar">
          {menuItems.map((item) => (
            <div key={item.title}>
              {/* Parent Item */}
              <div className="mb-1">
                {item.children ? (
                  <button
                    onClick={() => toggleTab(item.title)}
                    className={`w-full flex items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'} justify-between px-3 py-2 text-sm font-medium transition-colors duration-200 text-white`}
                    style={{
                      backgroundColor: isActive(item.href) || isParentActive(item.children) ? '#2e2e33' : 'transparent',
                      borderRadius: '0.25rem'
                    }}
                  >
                    <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                      <item.icon className="w-5 h-5 me-3" />
                      {item.title}
                    </div>
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform duration-200 ${
                        expandedTabs.includes(item.title) ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`w-full flex items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'} px-3 py-2 text-sm font-medium transition-colors duration-200 text-white`}
                    style={{
                      backgroundColor: isActive(item.href) ? '#2e2e33' : 'transparent',
                      borderRadius: '0.25rem'
                    }}
                  >
                    <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                      <item.icon className="w-5 h-5 me-3" />
                      {item.title}
                    </div>
                  </Link>
                )}
              </div>

              {/* Children Items */}
              {expandedTabs.includes(item.title) && item.children && (
                <div className="ms-6 space-y-1">
                  {item.children.map((child, index) => (
                    <Link 
                      key={child.href} 
                      href={child.href}
                      className="block ps-5 pe-2 py-1.5 text-sm transition-colors duration-200 text-white"
                      style={{
                        backgroundColor: isActive(child.href) ? '#2e2e33' : 'transparent',
                        fontWeight: isActive(child.href) ? '500' : undefined,
                        borderRadius: '0.25rem'
                      }}
                    >
                      {child.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Back to Site */}
        <div className="px-4 py-3">
          <a
            href="/"
            className={`flex items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'} px-3 py-2 text-sm text-white transition-colors duration-200`}
            style={{ borderRadius: '0.25rem' }}
          >
            <ExternalLink className="w-4 h-4 me-3" />
            {getTranslation('backToSite')}
          </a>
        </div>

        {/* Footer */}
        <div className="p-4">
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
              <UserCog className="w-5 h-5 text-gray-300" />
            </div>
            <div className="ms-3">
              <p className="text-sm font-medium text-gray-100">{getTranslation('adminUser')}</p>
              <p className="text-xs text-gray-400">{getTranslation('adminEmail')}</p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
