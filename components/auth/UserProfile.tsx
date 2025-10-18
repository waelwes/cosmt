'use client';

import React, { useState } from 'react';
import { User, LogOut, Settings, Package, Heart, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../contexts/AuthContext';

interface UserProfileProps {
  onClose: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const { user, userProfile, signOut, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: userProfile?.full_name || '',
    phone: userProfile?.phone || '',
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await updateProfile(formData);

    if (!error) {
      setIsEditing(false);
    }

    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  if (!user || !userProfile) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="text-center">
            <div className="w-20 h-20 bg-cosmt-primary rounded-full flex items-center justify-center mx-auto mb-4">
              {userProfile.avatar_url ? (
                <img
                  src={userProfile.avatar_url}
                  alt={userProfile.full_name || 'User'}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-white" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              {userProfile.full_name || 'User'}
            </h3>
            <p className="text-gray-600">{userProfile.email}</p>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
              userProfile.role === 'admin' 
                ? 'bg-red-100 text-red-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {userProfile.role}
            </span>
          </div>

          {/* Profile Form */}
          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <Input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="flex space-x-3">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsEditing(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{userProfile.full_name || 'Not set'}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{userProfile.email}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{userProfile.phone || 'Not set'}</span>
              </div>

              <Button
                onClick={() => setIsEditing(true)}
                variant="secondary"
                className="w-full"
              >
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          )}

          {/* Quick Actions */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" className="flex items-center justify-center">
                <Package className="w-4 h-4 mr-2" />
                My Orders
              </Button>
              <Button variant="secondary" className="flex items-center justify-center">
                <Heart className="w-4 h-4 mr-2" />
                Wishlist
              </Button>
            </div>
          </div>

          {/* Sign Out */}
          <div className="border-t pt-4">
            <Button
              onClick={handleSignOut}
              variant="secondary"
              className="w-full text-red-600 hover:text-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
