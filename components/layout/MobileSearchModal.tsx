'use client';

import React, { useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { Input } from '../ui/Input';
import { useSearch } from '../../contexts/SearchContext';
import { useRouter } from 'next/navigation';

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileSearchModal: React.FC<MobileSearchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { setSearchQuery } = useSearch();
  const router = useRouter();

  // Prevent body scroll when search modal is open
  useEffect(() => {
    if (isOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;
      // Prevent body scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore scroll position
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    } else {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (query && query.trim()) {
      setSearchQuery(query);
      router.push('/search');
      onClose();
    }
  };

  return (
    <>
      {/* Full Screen Shadow Overlay */}
      <div 
          className={`fixed top-0 left-0 right-0 bottom-0 bg-black/50 z-[9998] pointer-events-auto ${
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={onClose}
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%', 
            height: '100vh',
            zIndex: 9998,
            transition: `opacity var(--cosmt-transition-duration) var(--cosmt-transition-easing)`
          }}
        />

        {/* Search Modal - Slides in from top */}
        <div 
          className="fixed top-0 left-0 right-0 bg-white z-[9999]"
        style={{ 
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          transition: `transform var(--cosmt-transition-duration) var(--cosmt-transition-easing), box-shadow var(--cosmt-transition-duration) var(--cosmt-transition-easing)`,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          transform: isOpen ? 'translateY(0)' : 'translateY(-100%)',
          visibility: 'visible',
          zIndex: 9999
        }}
      >
        <div className="p-4">
        <form onSubmit={handleSearch}>
          <div className="flex items-center space-x-4">
            <Input
              type="search"
              name="search"
              placeholder="Search products, brands, and more..."
              icon={<Search className="w-4 h-4" style={{ color: '#003d38' }} />}
              className="flex-1"
              autoFocus
            />
            <button
              type="button"
              onClick={onClose}
              className="hover:bg-gray-100 p-1 transition-colors duration-200"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </form>
        
        {/* Popular searches */}
        <div className="mt-4">
          <h3 className="text-cosmt-sm font-medium text-gray-900 mb-2">Popular Searches</h3>
          <div className="flex flex-wrap gap-2">
            {['AVEDA', 'DAVINES'].map((term) => (
              <button
                key={term}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-cosmt-sm hover:bg-gray-200 transition-colors duration-200"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
        </div>
      </div>
    </>
  );
};
