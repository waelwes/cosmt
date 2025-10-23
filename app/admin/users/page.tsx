'use client';

import React, { memo, useMemo, useState } from 'react';
import { Users, UserPlus, Shield, Mail, Phone, Calendar, Edit, Trash2, Eye, Key, CheckCircle, XCircle } from 'lucide-react';

// Mock data for user management
const users = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@cosmat.com',
    role: 'Super Admin',
    status: 'active',
    lastLogin: '2024-01-16 14:30',
    createdAt: '2024-01-01',
    permissions: ['all'],
    avatar: null
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.j@cosmat.com',
    role: 'Manager',
    status: 'active',
    lastLogin: '2024-01-16 12:15',
    createdAt: '2024-01-05',
    permissions: ['products', 'orders', 'customers'],
    avatar: null
  },
  {
    id: 3,
    name: 'Mike Chen',
    email: 'mike.c@cosmat.com',
    role: 'Editor',
    status: 'active',
    lastLogin: '2024-01-15 16:45',
    createdAt: '2024-01-10',
    permissions: ['products', 'content'],
    avatar: null
  },
  {
    id: 4,
    name: 'Emma Wilson',
    email: 'emma.w@cosmat.com',
    role: 'Support',
    status: 'inactive',
    lastLogin: '2024-01-10 09:30',
    createdAt: '2024-01-12',
    permissions: ['support', 'customers'],
    avatar: null
  },
  {
    id: 5,
    name: 'David Brown',
    email: 'david.b@cosmat.com',
    role: 'Viewer',
    status: 'active',
    lastLogin: '2024-01-16 11:20',
    createdAt: '2024-01-14',
    permissions: ['analytics'],
    avatar: null
  }
];

const roles = [
  {
    id: 1,
    name: 'Super Admin',
    description: 'Full access to all features and settings',
    permissions: ['all'],
    userCount: 1,
    color: 'bg-red-100 text-red-600'
  },
  {
    id: 2,
    name: 'Manager',
    description: 'Manage products, orders, and customers',
    permissions: ['products', 'orders', 'customers', 'inventory'],
    userCount: 1,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    id: 3,
    name: 'Editor',
    description: 'Edit products and content',
    permissions: ['products', 'content', 'media'],
    userCount: 1,
    color: 'bg-green-100 text-blue-600'
  },
  {
    id: 4,
    name: 'Support',
    description: 'Handle customer support and tickets',
    permissions: ['support', 'customers', 'orders'],
    userCount: 1,
    color: 'bg-yellow-100 text-yellow-600'
  },
  {
    id: 5,
    name: 'Viewer',
    description: 'View analytics and reports only',
    permissions: ['analytics', 'reports'],
    userCount: 1,
    color: 'bg-gray-100 text-gray-600'
  }
];

const permissions = [
  { id: 'all', name: 'All Permissions', description: 'Full access to everything' },
  { id: 'products', name: 'Products', description: 'Manage products and inventory' },
  { id: 'orders', name: 'Orders', description: 'View and manage orders' },
  { id: 'customers', name: 'Customers', description: 'Manage customer accounts' },
  { id: 'inventory', name: 'Inventory', description: 'Manage stock levels' },
  { id: 'marketing', name: 'Marketing', description: 'Manage campaigns and promotions' },
  { id: 'content', name: 'Content', description: 'Manage pages and content' },
  { id: 'support', name: 'Support', description: 'Handle customer support' },
  { id: 'analytics', name: 'Analytics', description: 'View reports and analytics' },
  { id: 'settings', name: 'Settings', description: 'Manage system settings' },
  { id: 'users', name: 'Users', description: 'Manage user accounts and roles' }
];

// Helper functions
const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'text-blue-600 bg-green-50';
    case 'inactive': return 'text-gray-600 bg-gray-50';
    case 'suspended': return 'text-red-600 bg-red-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

const formatDate = (date: string) => new Date(date).toLocaleDateString();
const formatDateTime = (dateTime: string) => new Date(dateTime).toLocaleString();

// Memoized components
const StatCard = memo(({ title, value, change, icon: Icon, color }: {
  title: string;
  value: string | number;
  change?: string;
  icon: any;
  color: string;
}) => (
        <div className="analytics-card p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        {change && (
          <p className={`text-sm ${change.startsWith('+') ? 'text-blue-600' : 'text-red-600'}`}>
            {change}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
));

const UserCard = memo(({ user, onEdit, onDelete, onView, onToggleStatus }: {
  user: any;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
  onToggleStatus: (id: number) => void;
}) => (
  <div className="analytics-card p-6">
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
          <Users className="w-6 h-6 text-gray-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{user.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
              {user.status.toUpperCase()}
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              {user.role}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={() => onView(user.id)}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => onEdit(user.id)}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-green-50 rounded-lg transition-colors"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onToggleStatus(user.id)}
          className={`p-2 rounded-lg transition-colors ${
            user.status === 'active'
              ? 'text-red-400 hover:text-red-600 hover:bg-red-50'
              : 'text-green-400 hover:text-blue-600 hover:bg-green-50'
          }`}
        >
          {user.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
        </button>
        <button
          onClick={() => onDelete(user.id)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
    
    <div className="mt-4 pt-4 border-t" style={{ borderTopColor: '#eef2f6' }}>
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>Last login: {formatDateTime(user.lastLogin)}</span>
        <span>Joined: {formatDate(user.createdAt)}</span>
      </div>
      <div className="mt-2">
        <p className="text-sm text-gray-600">Permissions:</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {user.permissions.map((permission: string) => (
            <span key={permission} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              {permission}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
));

const RoleCard = memo(({ role, onEdit, onDelete, onView }: {
  role: any;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}) => (
  <div className="analytics-card p-4">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center space-x-3 mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{role.name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${role.color}`}>
            {role.userCount} users
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-3">{role.description}</p>
        <div className="flex flex-wrap gap-1">
          {role.permissions.map((permission: string) => (
            <span key={permission} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              {permission}
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={() => onView(role.id)}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => onEdit(role.id)}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-green-50 rounded-lg transition-colors"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(role.id)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
));

const PermissionItem = memo(({ permission, isSelected, onToggle }: {
  permission: any;
  isSelected: boolean;
  onToggle: (id: string) => void;
}) => (
  <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
    <input
      type="checkbox"
      checked={isSelected}
      onChange={() => onToggle(permission.id)}
      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
    />
    <div className="flex-1">
      <h4 className="font-medium text-gray-900 dark:text-gray-100">{permission.name}</h4>
      <p className="text-sm text-gray-500 dark:text-gray-400">{permission.description}</p>
    </div>
  </div>
));

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Memoized calculations
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const inactiveUsers = users.filter(u => u.status === 'inactive').length;
    const totalRoles = roles.length;
    
    return { totalUsers, activeUsers, inactiveUsers, totalRoles };
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [searchTerm, roleFilter, statusFilter]);

  const handleEdit = (id: number) => {
    console.log('Edit user/role:', id);
    // TODO: Implement edit functionality
  };

  const handleDelete = (id: number) => {
    console.log('Delete user/role:', id);
    // TODO: Implement delete functionality
  };

  const handleView = (id: number) => {
    console.log('View user/role:', id);
    // TODO: Implement view functionality
  };

  const handleToggleStatus = (id: number) => {
    console.log('Toggle user status:', id);
    // TODO: Implement toggle status functionality
  };

  const handlePermissionToggle = (permissionId: string) => {
    console.log('Toggle permission:', permissionId);
    // TODO: Implement permission toggle functionality
  };

  return (
    <div className="space-y-6" style={{ backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">User Management</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage users, roles, and permissions</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Key className="w-4 h-4" />
            <span>Reset Passwords</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <UserPlus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          change="+2 this month"
          icon={Users}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          change="+1 this week"
          icon={CheckCircle}
          color="bg-green-100 text-blue-600"
        />
        <StatCard
          title="Inactive Users"
          value={stats.inactiveUsers}
          icon={XCircle}
          color="bg-gray-100 text-gray-600"
        />
        <StatCard
          title="User Roles"
          value={stats.totalRoles}
          icon={Shield}
          color="bg-purple-100 text-purple-600"
        />
      </div>

      {/* Search and Filters */}
        <div className="analytics-card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex space-x-4">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              {roles.map(role => (
                <option key={role.id} value={role.name}>{role.name}</option>
              ))}
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="analytics-card">
        <div className="border-b" style={{ borderBottomColor: '#eef2f6' }}>
          <nav className="flex space-x-8 px-4 tab-navigation">
            {[
              { id: 'users', name: 'Users', count: users.length },
              { id: 'roles', name: 'Roles', count: roles.length },
              { id: 'permissions', name: 'Permissions', count: permissions.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-[#00514B] text-[#00514B]'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700'
                }`}
              >
                {tab.name} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">All Users</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <UserPlus className="w-4 h-4" />
                  <span>Add User</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                    onToggleStatus={handleToggleStatus}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Roles Tab */}
          {activeTab === 'roles' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">User Roles</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Shield className="w-4 h-4" />
                  <span>Create Role</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roles.map((role) => (
                  <RoleCard
                    key={role.id}
                    role={role}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Permissions Tab */}
          {activeTab === 'permissions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">System Permissions</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Key className="w-4 h-4" />
                  <span>Create Permission</span>
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Available Permissions</h3>
                <div className="space-y-2">
                  {permissions.map((permission) => (
                    <PermissionItem
                      key={permission.id}
                      permission={permission}
                      isSelected={false} // This would come from state
                      onToggle={handlePermissionToggle}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
