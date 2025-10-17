'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [expandedTabs, setExpandedTabs] = React.useState<string[]>(['Dashboard']);

  const toggleTab = (tabTitle: string) => {
    setExpandedTabs(prev => 
      prev.includes(tabTitle) 
        ? prev.filter(tab => tab !== tabTitle)
        : [...prev, tabTitle]
    );
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      href: '/admin',
      children: [
        { title: 'Overview', href: '/admin', icon: BarChart3 },
        { title: 'Analytics', href: '/admin/analytics', icon: BarChart3 }
      ]
    },
    {
      title: 'Products',
      icon: Package,
      href: '/admin/products',
      children: [
        { title: 'All Products', href: '/admin/products', icon: List },
        { title: 'Collections', href: '/admin/products/collections', icon: Tag },
        { title: 'Categories', href: '/admin/products/categories', icon: Layers },
        { title: 'Attributes', href: '/admin/products/attributes', icon: Tag },
        { title: 'Inventory', href: '/admin/products/inventory', icon: Archive }
      ]
    },
    {
      title: 'Orders',
      icon: ShoppingCart,
      href: '/admin/orders',
      children: [
        { title: 'All Orders', href: '/admin/orders', icon: List },
        { title: 'Order Details', href: '/admin/orders/details', icon: FileSpreadsheet },
        { title: 'Cart Management', href: '/admin/orders/carts', icon: ShoppingBag },
        { title: 'Checkout', href: '/admin/orders/checkout', icon: CreditCard },
        { title: 'Invoices', href: '/admin/orders/invoices', icon: Receipt }
      ]
    },
    {
      title: 'Customers',
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
      title: 'Marketing',
      icon: Megaphone,
      href: '/admin/marketing',
      children: [
        { title: 'Campaigns', href: '/admin/marketing/campaigns', icon: MegaphoneIcon },
        { title: 'Coupons', href: '/admin/marketing/coupons', icon: Gift },
        { title: 'Reviews', href: '/admin/marketing/reviews', icon: Star },
        { title: 'Website Control', href: '/admin/marketing/website', icon: Globe }
      ]
    },
    {
      title: 'Content',
      icon: FileText,
      href: '/admin/content',
      children: [
        { title: 'Custom Pages', href: '/admin/content/pages', icon: FileEdit },
        { title: 'Authentication', href: '/admin/content/auth', icon: Shield },
        { title: 'Menu Items', href: '/admin/content/menu', icon: Menu },
        { title: 'Components', href: '/admin/content/components', icon: Component }
      ]
    },
    {
      title: 'Settings',
      icon: Settings,
      href: '/admin/settings',
      children: [
        { title: 'General', href: '/admin/settings/general', icon: Settings },
        { title: 'Profile', href: '/admin/settings/profile', icon: UserCog },
        { title: 'Users', href: '/admin/settings/users', icon: Users },
        { title: 'Roles', href: '/admin/settings/roles', icon: ShieldCheck },
        { title: 'Permissions', href: '/admin/settings/permissions', icon: Shield },
        { title: 'Payment', href: '/admin/settings/payment', icon: CreditCard },
        { title: 'Shipping', href: '/admin/settings/shipping', icon: Truck },
        { title: 'Notifications', href: '/admin/settings/notifications', icon: Mail }
      ]
    },
    {
      title: 'Apps & Tools',
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
      title: 'Support',
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
  const isParentActive = (children: any[]) => children.some(child => pathname === child.href);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

              {/* Sidebar */}
              <div className="w-full h-full flex flex-col border-r border-gray-600 bg-slate-800 dark:bg-slate-800" style={{ backgroundColor: '#1e293b' }}>
        {/* Header Section - Logo Only */}
        <div className="p-4 border-b border-gray-600">
          <div className="flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center">
              <Image
                src="/images/logos/COSMT.png"
                alt="COSMT Logo"
                width={80}
                height={24}
                className="h-6 w-auto"
              />
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded text-white hover:bg-gray-700 transition duration-150"
              title="Close Navigation Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <div key={item.title}>
              {/* Parent Item */}
              <div className="mb-1">
                <button
                  onClick={() => toggleTab(item.title)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded hover:bg-gray-700 transition duration-150 text-white"
                  style={{
                    backgroundColor: isActive(item.href) || isParentActive(item.children) ? '#334155' : 'transparent',
                    boxShadow: isActive(item.href) || isParentActive(item.children) ? '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)' : 'none',
                    border: isActive(item.href) || isParentActive(item.children) ? '1px solid #475569' : 'none'
                  }}
                >
                  <div className="flex items-center">
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.title}
                  </div>
                  <ChevronDown 
                    className={`w-4 h-4 transition-transform duration-200 ${
                      expandedTabs.includes(item.title) ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
              </div>

              {/* Children Items */}
              {expandedTabs.includes(item.title) && (
                <div className="relative ml-6 space-y-1">
                  {/* Vertical line */}
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-600"></div>
                  
                  {item.children.map((child, index) => (
                    <Link 
                      key={child.href} 
                      href={child.href}
                      className="block pl-5 pr-2 py-1.5 text-sm rounded hover:bg-gray-700 transition duration-150 text-white"
                      style={{
                        backgroundColor: isActive(child.href) ? '#334155' : 'transparent',
                        fontWeight: isActive(child.href) ? '500' : undefined,
                        boxShadow: isActive(child.href) ? '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)' : 'none',
                        border: isActive(child.href) ? '1px solid #475569' : 'none'
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
        <div className="px-4 py-3 border-t border-gray-600">
          <a
            href="/"
            className="flex items-center px-3 py-2 text-sm text-white rounded hover:bg-gray-700 transition duration-150"
          >
            <ExternalLink className="w-4 h-4 mr-3" />
            Back to Site
          </a>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-600">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
              <UserCog className="w-5 h-5 text-gray-300" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-100">Admin User</p>
              <p className="text-xs text-gray-400">admin@cosmat.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
