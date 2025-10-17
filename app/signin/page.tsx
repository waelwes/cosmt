'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Check for admin credentials
    if (email === 'admin@cosmat.com' && password === 'admin123') {
      // Set admin session cookie
      document.cookie = 'adminLoggedIn=true; path=/; max-age=86400'; // 24 hours
      router.push('/admin/dashboard');
      return;
    }

    const success = await login(email, password);
    if (success) {
      router.push('/');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <div className="cosmt-container py-8">
        <div className="max-w-sm mx-auto">

          {/* Sign In Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-cosmt-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-cosmt-sm text-gray-600">Sign in to your account</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-cosmt-sm">
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-cosmt-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-cosmt-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Demo Credentials */}
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-cosmt-xs text-gray-600 mb-1 font-medium">Demo: demo@cosmat.com / password</p>
                <p className="text-cosmt-xs text-gray-600 font-medium">Admin: admin@cosmat.com / admin123</p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>

              {/* Forgot Password */}
              <div className="text-center">
                <button
                  type="button"
                  className="text-cosmt-sm text-green-600 hover:text-green-700 font-medium"
                >
                  Forgot your password?
                </button>
              </div>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <p className="text-cosmt-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  href="/signup"
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Create one here
                </Link>
              </p>
            </div>
          </div>
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
