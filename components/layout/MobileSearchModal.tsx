'use client';

import React from 'react';
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
      <div className="bg-white p-4">
        <form onSubmit={handleSearch}>
          <div className="flex items-center space-x-4">
            <Input
              type="search"
              name="search"
              placeholder="Search products, brands, and more..."
              icon={<Search className="w-4 h-4 text-gray-400" />}
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
  );
};
