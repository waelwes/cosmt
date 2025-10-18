'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  X, 
  Save, 
  Undo, 
  Redo, 
  Eye, 
  Palette, 
  Type, 
  Layout, 
  Image, 
  Move, 
  ChevronDown,
  ChevronRight,
  Monitor,
  Tablet,
  Smartphone,
  Zap,
  Layers,
  Grid,
  List,
  Plus,
  Edit,
  Trash2,
  GripVertical
} from 'lucide-react';
import { Button } from '../ui/Button';

interface CustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (changes: any) => void;
}

interface Section {
  id: string;
  type: string;
  name: string;
  visible: boolean;
  order: number;
  settings: any;
}

// Available sections for customization
const AVAILABLE_SECTIONS: Section[] = [
  {
    id: 'hero-slider',
    type: 'hero-slider',
    name: 'Hero Slider',
    visible: true,
    order: 1,
    settings: {
      backgroundColor: '#ffffff',
      height: '500px',
      showArrows: true,
      showDots: true,
      autoplay: true,
      slides: [
        {
          id: 1,
          title: 'Welcome to COSMT',
          subtitle: 'Premium Beauty Products',
          buttonText: 'Shop Now',
          buttonLink: '/shop',
          image: '/api/placeholder/1200/500',
          textColor: '#1f2937',
          buttonColor: '#059669'
        }
      ]
    }
  },
  {
    id: 'category-showcase',
    type: 'category-showcase',
    name: 'Category Showcase',
    visible: true,
    order: 2,
    settings: {
      backgroundColor: '#f8fafc',
      title: 'Shop by Category',
      showTitle: true,
      columns: 4,
      categories: [
        { name: 'Hair Care', image: '/api/placeholder/300/200', link: '/categories/hair-care' },
        { name: 'Skincare', image: '/api/placeholder/300/200', link: '/categories/skincare' },
        { name: 'Makeup', image: '/api/placeholder/300/200', link: '/categories/makeup' },
        { name: 'Fragrance', image: '/api/placeholder/300/200', link: '/categories/fragrance' }
      ]
    }
  },
  {
    id: 'brand-sections',
    type: 'brand-sections',
    name: 'Brand Sections',
    visible: true,
    order: 3,
    settings: {
      backgroundColor: '#ffffff',
      title: 'Featured Brands',
      showTitle: true,
      brands: [
        { name: 'AVEDA', logo: '/api/placeholder/150/80' },
        { name: 'DAVINES', logo: '/api/placeholder/150/80' },
        { name: 'L\'Oreal', logo: '/api/placeholder/150/80' },
        { name: 'Moroccanoil', logo: '/api/placeholder/150/80' }
      ]
    }
  },
  {
    id: 'product-showcases',
    type: 'product-showcases',
    name: 'Product Showcases',
    visible: true,
    order: 4,
    settings: {
      backgroundColor: '#f8fafc',
      title: 'Featured Products',
      showTitle: true,
      columns: 4,
      showFilters: true,
      products: [
        { name: 'Hair Mask', price: 89.99, image: '/api/placeholder/300/300' },
        { name: 'Shampoo Set', price: 156.50, image: '/api/placeholder/300/300' },
        { name: 'Conditioner', price: 67.25, image: '/api/placeholder/300/300' },
        { name: 'Hair Oil', price: 124.99, image: '/api/placeholder/300/300' }
      ]
    }
  }
];

export default function LiveCustomizer({ isOpen, onClose, onSave }: CustomizerProps) {
  const [sections, setSections] = useState<Section[]>(AVAILABLE_SECTIONS);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [hasChanges, setHasChanges] = useState(false);

  // Load saved settings on mount
  useEffect(() => {
    const savedSections = localStorage.getItem('homepage-sections');
    if (savedSections) {
      setSections(JSON.parse(savedSections));
    }
  }, []);

  // Save changes
  const handleSave = () => {
    localStorage.setItem('homepage-sections', JSON.stringify(sections));
    onSave(sections);
    setHasChanges(false);
  };

  // Update section settings
  const updateSection = (sectionId: string, updates: any) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, settings: { ...section.settings, ...updates } }
        : section
    ));
    setHasChanges(true);
  };

  // Toggle section visibility
  const toggleSectionVisibility = (sectionId: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, visible: !section.visible }
        : section
    ));
    setHasChanges(true);
  };

  // Reorder sections
  const moveSection = (dragIndex: number, hoverIndex: number) => {
    const draggedSection = sections[dragIndex];
    const newSections = [...sections];
    newSections.splice(dragIndex, 1);
    newSections.splice(hoverIndex, 0, draggedSection);
    
    // Update order numbers
    const updatedSections = newSections.map((section, index) => ({
      ...section,
      order: index + 1
    }));
    
    setSections(updatedSections);
    setHasChanges(true);
  };

  const selectedSectionData = sections.find(section => section.id === selectedSection);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      
      {/* Customizer Panel */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Customize Homepage</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Preview Mode Toggle */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              className={`p-2 rounded ${previewMode === 'desktop' ? 'bg-white shadow-sm' : ''}`}
              onClick={() => setPreviewMode('desktop')}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              className={`p-2 rounded ${previewMode === 'tablet' ? 'bg-white shadow-sm' : ''}`}
              onClick={() => setPreviewMode('tablet')}
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              className={`p-2 rounded ${previewMode === 'mobile' ? 'bg-white shadow-sm' : ''}`}
              onClick={() => setPreviewMode('mobile')}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sections List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Page Sections</h3>
            
            {sections
              .sort((a, b) => a.order - b.order)
              .map((section, index) => (
                <div
                  key={section.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                    selectedSection === section.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    setSelectedSection(section.id);
                    setShowSettings(true);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {section.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {section.type}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSectionVisibility(section.id);
                        }}
                        className={`p-1 rounded ${
                          section.visible 
                            ? 'text-green-600 hover:bg-green-100' 
                            : 'text-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSection(section.id);
                          setShowSettings(true);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {hasChanges ? 'Unsaved changes' : 'All changes saved'}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                disabled={!hasChanges}
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && selectedSectionData && (
        <div className="fixed right-96 top-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedSectionData.name} Settings
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {/* General Settings */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">General</h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Background Color
                    </label>
                    <input
                      type="color"
                      value={selectedSectionData.settings.backgroundColor}
                      onChange={(e) => updateSection(selectedSectionData.id, { 
                        backgroundColor: e.target.value 
                      })}
                      className="w-full h-10 border border-gray-300 rounded-lg"
                    />
                  </div>

                  {selectedSectionData.settings.title && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Section Title
                      </label>
                      <input
                        type="text"
                        value={selectedSectionData.settings.title}
                        onChange={(e) => updateSection(selectedSectionData.id, { 
                          title: e.target.value 
                        })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  )}

                  {selectedSectionData.settings.showTitle !== undefined && (
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedSectionData.settings.showTitle}
                          onChange={(e) => updateSection(selectedSectionData.id, { 
                            showTitle: e.target.checked 
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Show Title
                        </span>
                      </label>
                    </div>
                  )}

                  {selectedSectionData.settings.columns && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Columns
                      </label>
                      <select
                        value={selectedSectionData.settings.columns}
                        onChange={(e) => updateSection(selectedSectionData.id, { 
                          columns: parseInt(e.target.value) 
                        })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      >
                        <option value="1">1 Column</option>
                        <option value="2">2 Columns</option>
                        <option value="3">3 Columns</option>
                        <option value="4">4 Columns</option>
                      </select>
                    </div>
                  )}

                  {selectedSectionData.settings.height && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Height
                      </label>
                      <input
                        type="text"
                        value={selectedSectionData.settings.height}
                        onChange={(e) => updateSection(selectedSectionData.id, { 
                          height: e.target.value 
                        })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder="e.g., 500px, 50vh"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Hero Slider Specific Settings */}
              {selectedSectionData.type === 'hero-slider' && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Hero Slider</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedSectionData.settings.showArrows}
                          onChange={(e) => updateSection(selectedSectionData.id, { 
                            showArrows: e.target.checked 
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Show Navigation Arrows
                        </span>
                      </label>
                    </div>

                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedSectionData.settings.showDots}
                          onChange={(e) => updateSection(selectedSectionData.id, { 
                            showDots: e.target.checked 
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Show Dots Indicator
                        </span>
                      </label>
                    </div>

                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedSectionData.settings.autoplay}
                          onChange={(e) => updateSection(selectedSectionData.id, { 
                            autoplay: e.target.checked 
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Autoplay
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
