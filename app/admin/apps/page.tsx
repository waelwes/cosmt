'use client';

import React, { memo, useMemo, useState } from 'react';
import { MessageCircle, Mail, Calendar, CheckSquare, Bug, Settings, Plus, Edit, Trash2, Eye, Send, Play, Pause } from 'lucide-react';

// Mock data for apps and tools
const chatMessages = [
  {
    id: 1,
    customer: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    message: 'Hi, I have a question about my order #12345',
    timestamp: '2024-01-16 14:30',
    status: 'unread',
    priority: 'medium'
  },
  {
    id: 2,
    customer: 'Mike Chen',
    email: 'mike.chen@email.com',
    message: 'When will my order be shipped?',
    timestamp: '2024-01-16 13:15',
    status: 'read',
    priority: 'low'
  },
  {
    id: 3,
    customer: 'Emma Wilson',
    email: 'emma.w@email.com',
    message: 'I need to return a product, can you help?',
    timestamp: '2024-01-16 12:45',
    status: 'unread',
    priority: 'high'
  }
];

const emailCampaigns = [
  {
    id: 1,
    name: 'Weekly Newsletter',
    subject: 'This Week\'s Best Deals',
    status: 'scheduled',
    recipients: 15420,
    openRate: 45.2,
    clickRate: 12.8,
    scheduledFor: '2024-01-17 09:00'
  },
  {
    id: 2,
    name: 'Welcome Series',
    subject: 'Welcome to Cosmat!',
    status: 'active',
    recipients: 3250,
    openRate: 52.1,
    clickRate: 18.5,
    scheduledFor: null
  },
  {
    id: 3,
    name: 'Abandoned Cart',
    subject: 'Don\'t forget your items!',
    status: 'paused',
    recipients: 890,
    openRate: 38.7,
    clickRate: 15.2,
    scheduledFor: null
  }
];

const calendarEvents = [
  {
    id: 1,
    title: 'Team Meeting',
    date: '2024-01-17',
    time: '10:00 AM',
    duration: '1 hour',
    type: 'meeting',
    attendees: ['Admin', 'Marketing Team'],
    status: 'confirmed'
  },
  {
    id: 2,
    title: 'Product Launch',
    date: '2024-01-20',
    time: '2:00 PM',
    duration: '2 hours',
    type: 'event',
    attendees: ['Admin', 'All Staff'],
    status: 'confirmed'
  },
  {
    id: 3,
    title: 'Inventory Check',
    date: '2024-01-18',
    time: '9:00 AM',
    duration: '30 minutes',
    type: 'task',
    attendees: ['Admin'],
    status: 'pending'
  }
];

const todoItems = [
  {
    id: 1,
    task: 'Update product descriptions',
    priority: 'high',
    dueDate: '2024-01-18',
    status: 'pending',
    assignedTo: 'Admin'
  },
  {
    id: 2,
    task: 'Review customer feedback',
    priority: 'medium',
    dueDate: '2024-01-19',
    status: 'in-progress',
    assignedTo: 'Admin'
  },
  {
    id: 3,
    task: 'Update website content',
    priority: 'low',
    dueDate: '2024-01-22',
    status: 'completed',
    assignedTo: 'Admin'
  }
];

const debugLogs = [
  {
    id: 1,
    level: 'error',
    message: 'Payment gateway timeout',
    timestamp: '2024-01-16 14:25:30',
    source: 'Payment API',
    details: 'Connection timeout after 30 seconds'
  },
  {
    id: 2,
    level: 'warning',
    message: 'Low inventory alert',
    timestamp: '2024-01-16 13:45:15',
    source: 'Inventory System',
    details: 'Product SKU AVD-001 below minimum stock level'
  },
  {
    id: 3,
    level: 'info',
    message: 'User login successful',
    timestamp: '2024-01-16 12:30:45',
    source: 'Auth System',
    details: 'User admin logged in from 192.168.1.100'
  }
];

// Helper functions
const getStatusColor = (status: string) => {
  switch (status) {
    case 'unread': return 'text-red-600 bg-red-50';
    case 'read': return 'text-green-600 bg-green-50';
    case 'active': return 'text-green-600 bg-green-50';
    case 'scheduled': return 'text-blue-600 bg-blue-50';
    case 'paused': return 'text-yellow-600 bg-yellow-50';
    case 'confirmed': return 'text-green-600 bg-green-50';
    case 'pending': return 'text-yellow-600 bg-yellow-50';
    case 'completed': return 'text-green-600 bg-green-50';
    case 'in-progress': return 'text-blue-600 bg-blue-50';
    case 'error': return 'text-red-600 bg-red-50';
    case 'warning': return 'text-yellow-600 bg-yellow-50';
    case 'info': return 'text-blue-600 bg-blue-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'text-red-600 bg-red-50';
    case 'medium': return 'text-yellow-600 bg-yellow-50';
    case 'low': return 'text-green-600 bg-green-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

// Memoized components
const StatCard = memo(({ title, value, change, icon: Icon, color }: {
  title: string;
  value: string | number;
  change?: string;
  icon: any;
  color: string;
}) => (
        <div className="dashboard-card border border-gray-200 dark:border-gray-700  p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        {change && (
          <p className={`text-sm ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
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

const ChatMessageCard = memo(({ message, onReply, onMarkRead, onDelete }: {
  message: any;
  onReply: (id: number) => void;
  onMarkRead: (id: number) => void;
  onDelete: (id: number) => void;
}) => (
  <div className="dashboard-card border border-gray-200 dark:border-gray-700  p-4">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center space-x-3 mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{message.customer}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
            {message.status.toUpperCase()}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(message.priority)}`}>
            {message.priority.toUpperCase()}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-2">{message.message}</p>
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <span>{message.email}</span>
          <span>{message.timestamp}</span>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={() => onReply(message.id)}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
        <button
          onClick={() => onMarkRead(message.id)}
          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(message.id)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
));

const EmailCampaignCard = memo(({ campaign, onEdit, onDelete, onView, onToggle }: {
  campaign: any;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
  onToggle: (id: number) => void;
}) => (
  <div className="dashboard-card border border-gray-200 dark:border-gray-700  p-4">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center space-x-3 mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{campaign.name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
            {campaign.status.toUpperCase()}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-2">{campaign.subject}</p>
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <span>Recipients: {campaign.recipients.toLocaleString()}</span>
          <span>Open Rate: {campaign.openRate}%</span>
          <span>Click Rate: {campaign.clickRate}%</span>
          {campaign.scheduledFor && <span>Scheduled: {campaign.scheduledFor}</span>}
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={() => onView(campaign.id)}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => onEdit(campaign.id)}
          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onToggle(campaign.id)}
          className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
        >
          {campaign.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button
          onClick={() => onDelete(campaign.id)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
));

const TodoItemCard = memo(({ item, onEdit, onDelete, onToggle }: {
  item: any;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}) => (
  <div className="dashboard-card border border-gray-200 dark:border-gray-700  p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3 flex-1">
        <button
          onClick={() => onToggle(item.id)}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
            item.status === 'completed'
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-green-500'
          }`}
        >
          {item.status === 'completed' && <CheckSquare className="w-3 h-3" />}
        </button>
        
        <div className="flex-1">
          <h3 className={`font-medium ${item.status === 'completed' ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
            {item.task}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
              {item.priority.toUpperCase()}
            </span>
            <span>Due: {item.dueDate}</span>
            <span>Assigned: {item.assignedTo}</span>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(item.id)}
          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
));

const DebugLogCard = memo(({ log, onView, onDelete }: {
  log: any;
  onView: (id: number) => void;
  onDelete: (id: number) => void;
}) => (
  <div className="dashboard-card border border-gray-200 dark:border-gray-700  p-4">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center space-x-3 mb-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.level)}`}>
            {log.level.toUpperCase()}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{log.source}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{log.timestamp}</span>
        </div>
        <p className="text-sm text-gray-900 dark:text-gray-100 mb-1">{log.message}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{log.details}</p>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={() => onView(log.id)}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(log.id)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
));

export default function AppsAndTools() {
  const [activeTab, setActiveTab] = useState('chat');

  // Memoized calculations
  const stats = useMemo(() => {
    const unreadMessages = chatMessages.filter(m => m.status === 'unread').length;
    const activeCampaigns = emailCampaigns.filter(c => c.status === 'active').length;
    const pendingTodos = todoItems.filter(t => t.status === 'pending').length;
    const errorLogs = debugLogs.filter(l => l.level === 'error').length;
    
    return {
      unreadMessages,
      activeCampaigns,
      pendingTodos,
      errorLogs
    };
  }, []);

  const handleEdit = (id: number) => {
    console.log('Edit item:', id);
    // TODO: Implement edit functionality
  };

  const handleDelete = (id: number) => {
    console.log('Delete item:', id);
    // TODO: Implement delete functionality
  };

  const handleView = (id: number) => {
    console.log('View item:', id);
    // TODO: Implement view functionality
  };

  const handleToggle = (id: number) => {
    console.log('Toggle item:', id);
    // TODO: Implement toggle functionality
  };

  const handleReply = (id: number) => {
    console.log('Reply to message:', id);
    // TODO: Implement reply functionality
  };

  const handleMarkRead = (id: number) => {
    console.log('Mark as read:', id);
    // TODO: Implement mark as read functionality
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Apps & Tools</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage communication, tasks, and system monitoring</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Unread Messages"
          value={stats.unreadMessages}
          change="+3 today"
          icon={MessageCircle}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Active Campaigns"
          value={stats.activeCampaigns}
          icon={Mail}
          color="bg-green-100 text-green-600"
        />
        <StatCard
          title="Pending Tasks"
          value={stats.pendingTodos}
          icon={CheckSquare}
          color="bg-orange-100 text-orange-600"
        />
        <StatCard
          title="System Errors"
          value={stats.errorLogs}
          icon={Bug}
          color="bg-red-100 text-red-600"
        />
      </div>

      {/* Tabs */}
      <div className="dashboard-card border border-gray-200 dark:border-gray-700 ">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6 tab-navigation">
            {[
              { id: 'chat', name: 'Chat Support', count: chatMessages.length },
              { id: 'email', name: 'Email Campaigns', count: emailCampaigns.length },
              { id: 'calendar', name: 'Calendar', count: calendarEvents.length },
              { id: 'todos', name: 'Todo List', count: todoItems.length },
              { id: 'debug', name: 'Debug Logs', count: debugLogs.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Customer Support Chat</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>New Chat</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {chatMessages.map((message) => (
                  <ChatMessageCard
                    key={message.id}
                    message={message}
                    onReply={handleReply}
                    onMarkRead={handleMarkRead}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Email Tab */}
          {activeTab === 'email' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Email Campaigns</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>New Campaign</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {emailCampaigns.map((campaign) => (
                  <EmailCampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Calendar Tab */}
          {activeTab === 'calendar' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Calendar Events</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>New Event</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {calendarEvents.map((event) => (
                  <div key={event.id} className="dashboard-card border border-gray-200 dark:border-gray-700  p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{event.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{event.date} at {event.time}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Duration: {event.duration}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Attendees: {event.attendees.join(', ')}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                        {event.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Todos Tab */}
          {activeTab === 'todos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Todo List</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>New Task</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {todoItems.map((item) => (
                  <TodoItemCard
                    key={item.id}
                    item={item}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Debug Tab */}
          {activeTab === 'debug' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">System Debug Logs</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Settings className="w-4 h-4" />
                  <span>Clear Logs</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {debugLogs.map((log) => (
                  <DebugLogCard
                    key={log.id}
                    log={log}
                    onView={handleView}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
