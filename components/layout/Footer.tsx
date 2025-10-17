'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const footerLinks = {
  shop: [
    { name: 'Hair Care', href: '/categories/hair-care' },
    { name: 'Skin Care', href: '/categories/skincare' },
    { name: 'Makeup', href: '/categories/makeup' },
    { name: 'Fragrance', href: '/categories/fragrance' },
    { name: 'Body Care', href: '/categories/body-care' },
    { name: 'All Categories', href: '/categories' },
    { name: 'Sale', href: '/sale' },
  ],
  support: [
    { name: 'Contact Us', href: '/contact' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Returns & Exchanges', href: '/returns' },
    { name: 'Size Guide', href: '/size-guide' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Track Your Order', href: '/track' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Sustainability', href: '/sustainability' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
  connect: [
    { name: 'Beauty Blog', href: '/blog' },
    { name: 'Beauty Tips', href: '/tips' },
    { name: 'Tutorials', href: '/tutorials' },
    { name: 'Reviews', href: '/reviews' },
    { name: 'Community', href: '/community' },
    { name: 'Influencer Program', href: '/influencers' },
  ],
};

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <footer className="cosmt-footer">
      {/* Newsletter Section */}
      <div className="py-12" style={{ backgroundColor: '#00833F' }}>
        <div className="cosmt-container">
          <div className="text-center">
            <h3 className="text-cosmt-3xl font-bold mb-4">Stay Beautiful</h3>
            <p className="text-cosmt-xl mb-8" style={{ color: '#e6f7e6' }}>
              Get the latest beauty tips, exclusive offers, and new product launches delivered to your inbox
            </p>
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-4">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                icon={<Mail className="w-4 h-4 text-gray-400" />}
              />
              <Button type="submit" variant="secondary" size="md">
                Subscribe
              </Button>
            </form>
            <p className="text-cosmt-sm mt-4" style={{ color: '#e6f7e6' }}>
              By subscribing, you agree to our Privacy Policy and Terms of Service
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-16">
        <div className="cosmt-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Logo Column - Left Side */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <Image
                  src="/images/logos/COSMT.png"
                  alt="COSMT Logo"
                  width={100}
                  height={33}
                  className="h-8 w-auto mb-4"
                />
                <p className="text-cosmt-sm text-gray-400 leading-relaxed">
                  Your trusted destination for premium beauty products and professional-grade cosmetics.
                </p>
              </div>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4" style={{ color: '#00833F' }} />
                  <span className="text-cosmt-sm text-gray-300">1-800-BEAUTY</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4" style={{ color: '#00833F' }} />
                  <span className="text-cosmt-sm text-gray-300">info@cosmt.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4" style={{ color: '#00833F' }} />
                  <span className="text-cosmt-sm text-gray-300">New York, NY</span>
                </div>
              </div>
            </div>

            {/* Shop Column */}
            <div>
              <h4 className="text-cosmt-lg font-semibold mb-6">Shop</h4>
              <ul className="space-y-3">
                {footerLinks.shop.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h4 className="text-cosmt-lg font-semibold mb-6">Support</h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="text-cosmt-lg font-semibold mb-6">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect Column */}
            <div>
              <h4 className="text-cosmt-lg font-semibold mb-6">Connect</h4>
              <ul className="space-y-3 mb-8">
                {footerLinks.connect.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Social Media */}
              <div className="mt-6">
                <h5 className="text-cosmt-sm font-semibold mb-4">Follow Us</h5>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="p-2 bg-gray-800 hover:bg-green-600 transition-colors duration-200"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="p-2 bg-gray-800 hover:bg-green-600 transition-colors duration-200"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="p-2 bg-gray-800 hover:bg-green-600 transition-colors duration-200"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="p-2 bg-gray-800 hover:bg-green-600 transition-colors duration-200"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="cosmt-container">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left flex items-center space-x-4">
              <Image
                src="/images/logos/COSMT.png"
                alt="COSMT Logo"
                width={60}
                height={20}
                className="h-4 w-auto opacity-80"
              />
              <p className="text-gray-400 text-cosmt-sm">
                © 2024 COSMT. All rights reserved. | Made with ❤️ for beauty lovers
              </p>
            </div>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <img
                src="/api/placeholder/120/40"
                alt="Payment methods"
                className="h-8 opacity-60"
              />
              <div className="flex items-center space-x-2 text-cosmt-sm text-gray-400">
                <span>Secure</span>
                <span>•</span>
                <span>SSL Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
