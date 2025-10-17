'use client';

import React, { useState } from 'react';
import { 
  Shield, 
  CheckCircle, 
  XCircle,
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  FileText,
  Megaphone,
  Settings,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function PermissionsSettingsPage() {
  const [permissions, setPermissions] = useState({
    dashboard: {
      view: true,
      export: true,
      customize: false
    },
    products: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      manageInventory: true,
      manageCategories: true
    },
    orders: {
      view: true,
      create: true,
      edit: true,
      cancel: true,
      refund: true,
      manageShipping: true
    },
    customers: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      viewOrders: true,
      manageAddresses: true
    },
    analytics: {
      view: true,
      export: true,
      customize: true,
      viewFinancials: false
    },
    marketing: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      manageCampaigns: true,
      manageCoupons: true
    },
    content: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      managePages: true,
      manageMenus: true
    },
    settings: {
      view: true,
      edit: true,
      manageUsers: false,
      manageRoles: false,
      systemSettings: false
    }
  });

  const permissionGroups = [
    {
      name: 'Dashboard',
      icon: BarChart3,
      color: 'blue',
      permissions: [
        { key: 'view', label: 'View Dashboard', description: 'Access to dashboard overview' },
        { key: 'export', label: 'Export Data', description: 'Export dashboard data' },
        { key: 'customize', label: 'Customize Layout', description: 'Modify dashboard layout' }
      ]
    },
    {
      name: 'Products',
      icon: Package,
      color: 'green',
      permissions: [
        { key: 'view', label: 'View Products', description: 'View product listings' },
        { key: 'create', label: 'Create Products', description: 'Add new products' },
        { key: 'edit', label: 'Edit Products', description: 'Modify existing products' },
        { key: 'delete', label: 'Delete Products', description: 'Remove products' },
        { key: 'manageInventory', label: 'Manage Inventory', description: 'Update stock levels' },
        { key: 'manageCategories', label: 'Manage Categories', description: 'Organize product categories' }
      ]
    },
    {
      name: 'Orders',
      icon: ShoppingCart,
      color: 'purple',
      permissions: [
        { key: 'view', label: 'View Orders', description: 'Access order listings' },
        { key: 'create', label: 'Create Orders', description: 'Create new orders' },
        { key: 'edit', label: 'Edit Orders', description: 'Modify existing orders' },
        { key: 'cancel', label: 'Cancel Orders', description: 'Cancel orders' },
        { key: 'refund', label: 'Process Refunds', description: 'Handle refunds' },
        { key: 'manageShipping', label: 'Manage Shipping', description: 'Update shipping details' }
      ]
    },
    {
      name: 'Customers',
      icon: Users,
      color: 'orange',
      permissions: [
        { key: 'view', label: 'View Customers', description: 'Access customer listings' },
        { key: 'create', label: 'Create Customers', description: 'Add new customers' },
        { key: 'edit', label: 'Edit Customers', description: 'Modify customer info' },
        { key: 'delete', label: 'Delete Customers', description: 'Remove customers' },
        { key: 'viewOrders', label: 'View Customer Orders', description: 'See customer order history' },
        { key: 'manageAddresses', label: 'Manage Addresses', description: 'Update customer addresses' }
      ]
    },
    {
      name: 'Analytics',
      icon: BarChart3,
      color: 'indigo',
      permissions: [
        { key: 'view', label: 'View Analytics', description: 'Access analytics dashboard' },
        { key: 'export', label: 'Export Reports', description: 'Download analytics reports' },
        { key: 'customize', label: 'Customize Reports', description: 'Modify report settings' },
        { key: 'viewFinancials', label: 'View Financial Data', description: 'Access financial information' }
      ]
    },
    {
      name: 'Marketing',
      icon: Megaphone,
      color: 'pink',
      permissions: [
        { key: 'view', label: 'View Marketing', description: 'Access marketing tools' },
        { key: 'create', label: 'Create Campaigns', description: 'Create marketing campaigns' },
        { key: 'edit', label: 'Edit Campaigns', description: 'Modify campaigns' },
        { key: 'delete', label: 'Delete Campaigns', description: 'Remove campaigns' },
        { key: 'manageCampaigns', label: 'Manage Campaigns', description: 'Full campaign management' },
        { key: 'manageCoupons', label: 'Manage Coupons', description: 'Create and manage coupons' }
      ]
    },
    {
      name: 'Content',
      icon: FileText,
      color: 'teal',
      permissions: [
        { key: 'view', label: 'View Content', description: 'Access content management' },
        { key: 'create', label: 'Create Content', description: 'Add new content' },
        { key: 'edit', label: 'Edit Content', description: 'Modify existing content' },
        { key: 'delete', label: 'Delete Content', description: 'Remove content' },
        { key: 'managePages', label: 'Manage Pages', description: 'Create and edit pages' },
        { key: 'manageMenus', label: 'Manage Menus', description: 'Update navigation menus' }
      ]
    },
    {
      name: 'Settings',
      icon: Settings,
      color: 'gray',
      permissions: [
        { key: 'view', label: 'View Settings', description: 'Access settings panel' },
        { key: 'edit', label: 'Edit Settings', description: 'Modify general settings' },
        { key: 'manageUsers', label: 'Manage Users', description: 'Add and manage users' },
        { key: 'manageRoles', label: 'Manage Roles', description: 'Create and edit roles' },
        { key: 'systemSettings', label: 'System Settings', description: 'Access system configuration' }
      ]
    }
  ];

  const handlePermissionChange = (group: string, permission: string, value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [group]: {
        ...prev[group as keyof typeof prev],
        [permission]: value
      }
    }));
  };

  const handleSave = () => {
    // Here you would typically save to backend
    console.log('Permissions saved:', permissions);
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'green':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'purple':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100';
      case 'orange':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100';
      case 'indigo':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100';
      case 'pink':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-100';
      case 'teal':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-800 dark:text-teal-100';
      case 'gray':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Permission Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Configure detailed permissions for each role</p>
          </div>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            Save Permissions
          </Button>
        </div>
      </div>

      {/* Permission Groups */}
      <div className="space-y-6">
        {permissionGroups.map((group) => (
          <div key={group.name} className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Group Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <group.icon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{group.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Manage {group.name.toLowerCase()} related permissions
                  </p>
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.permissions.map((permission) => {
                  const groupKey = group.name.toLowerCase() as keyof typeof permissions;
                  const currentValue = permissions[groupKey]?.[permission.key as keyof typeof permissions[groupKey]] || false;
                  
                  return (
                    <div key={permission.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {permission.label}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {permission.description}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer ml-4">
                        <input
                          type="checkbox"
                          checked={currentValue}
                          onChange={(e) => handlePermissionChange(group.name.toLowerCase(), permission.key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Permission Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {permissionGroups.map((group) => {
            const groupPermissions = permissions[group.name.toLowerCase() as keyof typeof permissions];
            const totalPermissions = Object.keys(groupPermissions || {}).length;
            const enabledPermissions = Object.values(groupPermissions || {}).filter(Boolean).length;
            
            return (
              <div key={group.name} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{group.name}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorClasses(group.color)}`}>
                    {enabledPermissions}/{totalPermissions}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(enabledPermissions / totalPermissions) * 100}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
