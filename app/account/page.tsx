'use client';

import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Edit3, Save, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const { user, updateProfile, logout } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || '',
      country: user?.address?.country || ''
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    const success = await updateProfile(formData);
    if (success) {
      setIsEditing(false);
    }
    setIsLoading(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: {
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        zipCode: user?.address?.zipCode || '',
        country: user?.address?.country || ''
      }
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-cosmt-2xl font-bold text-gray-900 mb-4">Please sign in</h1>
          <p className="text-gray-600 mb-6">You need to be signed in to view your account.</p>
          <Button onClick={() => router.push('/')}>
            Go to Homepage
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <div className="cosmt-container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-cosmt-3xl font-bold text-gray-900">My Account</h1>
                <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
              </div>
              <div className="flex space-x-3">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isLoading}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isLoading}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Information */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-cosmt-xl font-bold text-gray-900 mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Profile Information
                </h2>

                <div className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-cosmt-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      {isEditing ? (
                        <Input
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="First name"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">{user.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-cosmt-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      {isEditing ? (
                        <Input
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Last name"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">{user.lastName}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-cosmt-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Address
                    </label>
                    {isEditing ? (
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email address"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{user.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-cosmt-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      Phone Number
                    </label>
                    {isEditing ? (
                      <Input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone number"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{user.phone || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                <h2 className="text-cosmt-xl font-bold text-gray-900 mb-6 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Address Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-cosmt-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    {isEditing ? (
                      <Input
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleChange}
                        placeholder="Street address"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{user.address?.street || 'Not provided'}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-cosmt-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      {isEditing ? (
                        <Input
                          name="address.city"
                          value={formData.address.city}
                          onChange={handleChange}
                          placeholder="City"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">{user.address?.city || 'Not provided'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-cosmt-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      {isEditing ? (
                        <Input
                          name="address.state"
                          value={formData.address.state}
                          onChange={handleChange}
                          placeholder="State"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">{user.address?.state || 'Not provided'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-cosmt-sm font-medium text-gray-700 mb-2">
                        ZIP Code
                      </label>
                      {isEditing ? (
                        <Input
                          name="address.zipCode"
                          value={formData.address.zipCode}
                          onChange={handleChange}
                          placeholder="ZIP code"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">{user.address?.zipCode || 'Not provided'}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-cosmt-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    {isEditing ? (
                      <Input
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleChange}
                        placeholder="Country"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{user.address?.country || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Account Actions */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-cosmt-lg font-bold text-gray-900 mb-4">Account Actions</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => router.push('/orders')}
                  >
                    Order History
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => router.push('/wishlist')}
                  >
                    My Wishlist
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => router.push('/addresses')}
                  >
                    Manage Addresses
                  </Button>
                </div>
              </div>

              {/* Account Info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-cosmt-lg font-bold text-gray-900 mb-4">Account Information</h3>
                <div className="space-y-2 text-cosmt-sm text-gray-600">
                  <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
                  <p>Account ID: {user.id}</p>
                </div>
              </div>

              {/* Logout */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <Button
                  variant="outline"
                  className="w-full text-red-600 border-red-300 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
