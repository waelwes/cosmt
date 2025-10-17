'use client';

import React, { useState } from 'react';
import { 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  CheckCircle,
  XCircle,
  Settings,
  Package,
  ShoppingCart,
  BarChart3,
  FileText,
  Megaphone
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function RolesSettingsPage() {
  const [showAddRole, setShowAddRole] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const roles = [
    {
      id: 1,
      name: 'Super Admin',
      description: 'Full access to all features and settings',
      userCount: 1,
      permissions: [
        { name: 'Dashboard', icon: BarChart3, allowed: true },
        { name: 'Products', icon: Package, allowed: true },
        { name: 'Orders', icon: ShoppingCart, allowed: true },
        { name: 'Customers', icon: Users, allowed: true },
        { name: 'Analytics', icon: BarChart3, allowed: true },
        { name: 'Marketing', icon: Megaphone, allowed: true },
        { name: 'Content', icon: FileText, allowed: true },
        { name: 'Settings', icon: Settings, allowed: true }
      ],
      color: 'purple'
    },
    {
      id: 2,
      name: 'Manager',
      description: 'Can manage products, orders, and customers',
      userCount: 2,
      permissions: [
        { name: 'Dashboard', icon: BarChart3, allowed: true },
        { name: 'Products', icon: Package, allowed: true },
        { name: 'Orders', icon: ShoppingCart, allowed: true },
        { name: 'Customers', icon: Users, allowed: true },
        { name: 'Analytics', icon: BarChart3, allowed: true },
        { name: 'Marketing', icon: Megaphone, allowed: false },
        { name: 'Content', icon: FileText, allowed: false },
        { name: 'Settings', icon: Settings, allowed: false }
      ],
      color: 'blue'
    },
    {
      id: 3,
      name: 'Editor',
      description: 'Can edit products and content',
      userCount: 1,
      permissions: [
        { name: 'Dashboard', icon: BarChart3, allowed: true },
        { name: 'Products', icon: Package, allowed: true },
        { name: 'Orders', icon: ShoppingCart, allowed: false },
        { name: 'Customers', icon: Users, allowed: false },
        { name: 'Analytics', icon: BarChart3, allowed: true },
        { name: 'Marketing', icon: Megaphone, allowed: false },
        { name: 'Content', icon: FileText, allowed: true },
        { name: 'Settings', icon: Settings, allowed: false }
      ],
      color: 'green'
    },
    {
      id: 4,
      name: 'Viewer',
      description: 'Read-only access to analytics and reports',
      userCount: 1,
      permissions: [
        { name: 'Dashboard', icon: BarChart3, allowed: true },
        { name: 'Products', icon: Package, allowed: false },
        { name: 'Orders', icon: ShoppingCart, allowed: false },
        { name: 'Customers', icon: Users, allowed: false },
        { name: 'Analytics', icon: BarChart3, allowed: true },
        { name: 'Marketing', icon: Megaphone, allowed: false },
        { name: 'Content', icon: FileText, allowed: false },
        { name: 'Settings', icon: Settings, allowed: false }
      ],
      color: 'gray'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'purple':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100';
      case 'blue':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'green':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'gray':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  const getPermissionIcon = (allowed: boolean) => {
    return allowed ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Role Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Define user roles and their permissions</p>
          </div>
          <Button onClick={() => setShowAddRole(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Role
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
              <Shield className="w-6 h-6 text-purple-600 dark:text-purple-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Roles</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{roles.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {roles.reduce((sum, role) => sum + role.userCount, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Roles</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{roles.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 dark:bg-orange-800 rounded-lg">
              <Settings className="w-6 h-6 text-orange-600 dark:text-orange-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Custom Roles</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {roles.map((role) => (
          <div key={role.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Role Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <Shield className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{role.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{role.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorClasses(role.color)}`}>
                    {role.userCount} users
                  </span>
                  <div className="flex space-x-1">
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setEditingRole(role)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div className="p-6">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Permissions</h4>
              <div className="grid grid-cols-2 gap-3">
                {role.permissions.map((permission, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <permission.icon className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {permission.name}
                      </span>
                    </div>
                    {getPermissionIcon(permission.allowed)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Role Modal Placeholder */}
      {showAddRole && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Role</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Role creation form would go here...</p>
              <div className="flex justify-end space-x-3">
                <Button onClick={() => setShowAddRole(false)} variant="outline">
                  Cancel
                </Button>
                <Button onClick={() => setShowAddRole(false)} className="bg-blue-600 hover:bg-blue-700">
                  Add Role
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Role Modal Placeholder */}
      {editingRole && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Edit Role: {editingRole.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Role editing form would go here...</p>
              <div className="flex justify-end space-x-3">
                <Button onClick={() => setEditingRole(null)} variant="outline">
                  Cancel
                </Button>
                <Button onClick={() => setEditingRole(null)} className="bg-blue-600 hover:bg-blue-700">
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
