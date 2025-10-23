'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Settings, 
  X, 
  Layout, 
  Palette, 
  Type, 
  Image, 
  Plus, 
  Eye, 
  EyeOff, 
  Move, 
  GripVertical,
  Save,
  Undo,
  Redo,
  Smartphone,
  Tablet,
  Monitor,
  Zap,
  Star,
  Mail,
  Users,
  ShoppingBag,
  Home,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  Trash2
} from 'lucide-react';
import Link from 'next/link';

export default function ThemeCustomizer() {
  const [activeTab, setActiveTab] = useState('sections');
  const [selectedSection, setSelectedSection] = useState(null);
  const [sections, setSections] = useState([
    { id: 'hero', name: 'Hero Slider', visible: true, order: 1 },
    { id: 'category', name: 'Category Showcase', visible: true, order: 2 },
    { id: 'brand', name: 'Brand Section', visible: true, order: 3 },
    { id: 'product', name: 'Product Showcase', visible: true, order: 4 },
    { id: 'testimonial', name: 'Testimonials', visible: false, order: 5 },
    { id: 'newsletter', name: 'Newsletter', visible: false, order: 6 },
    { id: 'footer', name: 'Footer', visible: true, order: 7 }
  ]);

  // Remove duplicates on component mount - memoized
  const uniqueSections = useMemo(() => {
    return sections.filter((section, index, self) => 
      index === self.findIndex(s => s.id === section.id)
    );
  }, [sections]);

  useEffect(() => {
    if (uniqueSections.length !== sections.length) {
      setSections(uniqueSections);
    }
  }, [uniqueSections, sections.length]);

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      // Cleanup any pending timeouts
      const timeouts = document.querySelectorAll('[data-timeout-id]');
      timeouts.forEach(timeout => {
        clearTimeout(parseInt(timeout.getAttribute('data-timeout-id') || '0'));
      });
    };
  }, []);

  // Debounced iframe update function
  const debouncedIframeUpdate = useCallback(() => {
    const timeoutId = setTimeout(() => {
      const iframe = document.getElementById('preview-iframe') as HTMLIFrameElement;
      if (iframe && iframe.contentDocument) {
        const iframeDoc = iframe.contentDocument;
        
        // Apply CSS variables to iframe
        const root = iframeDoc.documentElement;
        root.style.setProperty('--hero-bg-color', document.documentElement.style.getPropertyValue('--hero-bg-color') || '#ffffff');
        root.style.setProperty('--category-bg-color', document.documentElement.style.getPropertyValue('--category-bg-color') || '#f8fafc');
        root.style.setProperty('--brand-bg-color', document.documentElement.style.getPropertyValue('--brand-bg-color') || '#ffffff');
        root.style.setProperty('--product-bg-color', document.documentElement.style.getPropertyValue('--product-bg-color') || '#f8fafc');
        root.style.setProperty('--cosmt-primary', document.documentElement.style.getPropertyValue('--cosmt-primary') || '#059669');
        root.style.setProperty('--cosmt-secondary', document.documentElement.style.getPropertyValue('--cosmt-secondary') || '#3b82f6');
        root.style.setProperty('--font-family', document.documentElement.style.getPropertyValue('--font-family') || 'Inter, sans-serif');
        root.style.setProperty('--base-font-size', document.documentElement.style.getPropertyValue('--base-font-size') || '16px');
        root.style.setProperty('--container-width', document.documentElement.style.getPropertyValue('--container-width') || '1200px');
        root.style.setProperty('--section-spacing', document.documentElement.style.getPropertyValue('--section-spacing') || '6rem');
      
      // Apply background color to iframe body
      iframeDoc.body.style.backgroundColor = document.body.style.backgroundColor || '#ffffff';
    }
    }, 300); // 300ms debounce delay
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Keep the original function for immediate updates when needed
  const applyChangesToIframe = useCallback(() => {
    const iframe = document.getElementById('preview-iframe') as HTMLIFrameElement;
    if (iframe && iframe.contentDocument) {
      const iframeDoc = iframe.contentDocument;
      
      // Apply CSS variables to iframe
      const root = iframeDoc.documentElement;
      root.style.setProperty('--hero-bg-color', document.documentElement.style.getPropertyValue('--hero-bg-color') || '#ffffff');
      root.style.setProperty('--category-bg-color', document.documentElement.style.getPropertyValue('--category-bg-color') || '#f8fafc');
      root.style.setProperty('--brand-bg-color', document.documentElement.style.getPropertyValue('--brand-bg-color') || '#ffffff');
      root.style.setProperty('--product-bg-color', document.documentElement.style.getPropertyValue('--product-bg-color') || '#f8fafc');
      root.style.setProperty('--cosmt-primary', document.documentElement.style.getPropertyValue('--cosmt-primary') || '#059669');
      root.style.setProperty('--cosmt-secondary', document.documentElement.style.getPropertyValue('--cosmt-secondary') || '#3b82f6');
      root.style.setProperty('--font-family', document.documentElement.style.getPropertyValue('--font-family') || 'Inter, sans-serif');
      root.style.setProperty('--base-font-size', document.documentElement.style.getPropertyValue('--base-font-size') || '16px');
      root.style.setProperty('--container-width', document.documentElement.style.getPropertyValue('--container-width') || '1200px');
      root.style.setProperty('--section-spacing', document.documentElement.style.getPropertyValue('--section-spacing') || '6rem');
      
      // Apply background color to iframe body
      iframeDoc.body.style.backgroundColor = document.body.style.backgroundColor || '#ffffff';
    }
  }, []);

  const handleSave = () => {
    // Apply changes to iframe
    applyChangesToIframe();
    
    // Show success message
    const notification = document.createElement('div');
    notification.style.cssText = 'position: fixed; top: 16px; right: 16px; background: #10b981; color: white; padding: 8px 16px; border-radius: 8px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); z-index: 10001;';
    notification.textContent = 'Theme changes saved successfully!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  };

  const handleDeleteSection = (sectionId: string) => {
    // Don't allow deleting core sections
    const coreSections = ['hero', 'category', 'brand', 'product', 'footer'];
    if (coreSections.includes(sectionId)) {
      alert('Core sections cannot be deleted. You can only hide them.');
      return;
    }

    // Confirm deletion
    if (confirm('Are you sure you want to delete this section?')) {
      setSections(sections.filter(section => section.id !== sectionId));
      
      // Clear selection if deleted section was selected
      if (selectedSection === sectionId) {
        setSelectedSection(null);
      }
      
      // Show success message
      const notification = document.createElement('div');
      notification.style.cssText = 'position: fixed; top: 16px; right: 16px; background: #ef4444; color: white; padding: 8px 16px; border-radius: 8px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); z-index: 10001;';
      notification.textContent = 'Section deleted successfully!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--cosmt-background, #f1f5f9)' }}>
      {/* Header */}
      <div className="border-b px-6 py-4" style={{ backgroundColor: 'var(--cosmt-background, #ffffff)', borderColor: 'var(--cosmt-gray-200, #e5e7eb)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              href="/admin"
              className="flex items-center transition-colors"
              style={{ color: 'var(--cosmt-text-light, #6b7280)' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--cosmt-text, #111827)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--cosmt-text-light, #6b7280)'}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Link>
            <div className="h-6 w-px" style={{ backgroundColor: 'var(--cosmt-gray-200, #e5e7eb)' }}></div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--cosmt-text, #111827)' }}>Theme Customizer</h1>
              <p className="text-sm" style={{ color: 'var(--cosmt-text-light, #6b7280)' }}>Customize your website's appearance and content</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.open('/', '_blank')}
              className="px-4 py-2 text-sm font-medium border rounded-lg transition-colors"
              style={{ 
                color: 'var(--cosmt-text, #111827)', 
                backgroundColor: 'var(--cosmt-background, #ffffff)', 
                borderColor: 'var(--cosmt-gray-200, #e5e7eb)' 
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--cosmt-gray-50, #f9fafb)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--cosmt-background, #ffffff)'}
            >
              Preview Site
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors flex items-center space-x-2"
              style={{ backgroundColor: 'var(--cosmt-primary, #059669)' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--cosmt-primary-dark, #047857)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--cosmt-primary, #059669)'}
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 h-screen overflow-y-auto" style={{ backgroundColor: 'var(--cosmt-background, #ffffff)', borderRight: '1px solid var(--cosmt-gray-200, #e5e7eb)' }}>

          {/* Navigation Tabs */}
          <div style={{ borderBottom: '1px solid var(--cosmt-gray-200, #e5e7eb)' }}>
            <nav className="flex theme-customizer-tabs">
               <button
                 className={`flex-1 flex items-center justify-center py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                   activeTab === 'sections' 
                     ? 'bg-green-50' 
                     : 'hover:bg-gray-50'
                 }`}
                 style={{
                   borderRadius: '0 !important',
                   borderBottomColor: activeTab === 'sections' ? 'var(--cosmt-primary, #00514B)' : 'transparent',
                   color: activeTab === 'sections' ? 'var(--cosmt-primary, #00514B)' : 'var(--cosmt-text-light, #6b7280)',
                   backgroundColor: activeTab === 'sections' ? 'var(--cosmt-primary-light, #ecfdf5)' : 'transparent'
                 }}
                onClick={() => setActiveTab('sections')}
                onMouseEnter={(e) => {
                  if (activeTab !== 'sections') {
                    e.target.style.color = 'var(--cosmt-text, #111827)';
                    e.target.style.backgroundColor = 'var(--cosmt-gray-50, #f9fafb)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'sections') {
                    e.target.style.color = 'var(--cosmt-text-light, #6b7280)';
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Layout className="w-4 h-4 mr-2" />
                Sections
              </button>
               <button
                 className={`flex-1 flex items-center justify-center py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                   activeTab === 'design' 
                     ? 'bg-green-50' 
                     : 'hover:bg-gray-50'
                 }`}
                 style={{
                   borderRadius: '0 !important',
                   borderBottomColor: activeTab === 'design' ? 'var(--cosmt-primary, #059669)' : 'transparent',
                   color: activeTab === 'design' ? 'var(--cosmt-primary, #059669)' : 'var(--cosmt-text-light, #6b7280)',
                   backgroundColor: activeTab === 'design' ? 'var(--cosmt-primary-light, #ecfdf5)' : 'transparent'
                 }}
                onClick={() => setActiveTab('design')}
                onMouseEnter={(e) => {
                  if (activeTab !== 'design') {
                    e.target.style.color = 'var(--cosmt-text, #111827)';
                    e.target.style.backgroundColor = 'var(--cosmt-gray-50, #f9fafb)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'design') {
                    e.target.style.color = 'var(--cosmt-text-light, #6b7280)';
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Palette className="w-4 h-4 mr-2" />
                Design
              </button>
               <button
                 className={`flex-1 flex items-center justify-center py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                   activeTab === 'content' 
                     ? 'bg-green-50' 
                     : 'hover:bg-gray-50'
                 }`}
                 style={{
                   borderRadius: '0 !important',
                   borderBottomColor: activeTab === 'content' ? 'var(--cosmt-primary, #059669)' : 'transparent',
                   color: activeTab === 'content' ? 'var(--cosmt-primary, #059669)' : 'var(--cosmt-text-light, #6b7280)',
                   backgroundColor: activeTab === 'content' ? 'var(--cosmt-primary-light, #ecfdf5)' : 'transparent'
                 }}
                onClick={() => setActiveTab('content')}
                onMouseEnter={(e) => {
                  if (activeTab !== 'content') {
                    e.target.style.color = 'var(--cosmt-text, #111827)';
                    e.target.style.backgroundColor = 'var(--cosmt-gray-50, #f9fafb)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'content') {
                    e.target.style.color = 'var(--cosmt-text-light, #6b7280)';
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Type className="w-4 h-4 mr-2" />
                Content
              </button>
            </nav>
          </div>

            {/* Content */}
            <div className="p-4">
              {/* Selected Section Customization */}
              {selectedSection && (
                <div className="mb-6 p-4 border border-green-200 rounded-lg bg-green-50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-green-900">
                      Customizing: {sections.find(s => s.id === selectedSection)?.name}
                    </h4>
                    <button
                      onClick={() => setSelectedSection(null)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {selectedSection === 'hero' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Background Color</label>
                         <input
                           type="color"
                           defaultValue="#ffffff"
                           onChange={(e) => {
                             document.documentElement.style.setProperty('--hero-bg-color', e.target.value);
                             applyChangesToIframe();
                           }}
                           className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                         />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Height</label>
                         <select
                           onChange={(e) => {
                             document.documentElement.style.setProperty('--hero-height', e.target.value);
                             applyChangesToIframe();
                           }}
                           className="w-full h-8 border border-gray-300 rounded px-2 text-xs"
                         >
                          <option value="400px">Small (400px)</option>
                          <option value="500px">Medium (500px)</option>
                          <option value="600px">Large (600px)</option>
                          <option value="70vh">Full Height (70vh)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {selectedSection === 'category' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Background Color</label>
                         <input
                           type="color"
                           defaultValue="#f8fafc"
                           onChange={(e) => {
                             document.documentElement.style.setProperty('--category-bg-color', e.target.value);
                             applyChangesToIframe();
                           }}
                           className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                         />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Columns</label>
                         <select
                           onChange={(e) => {
                             document.documentElement.style.setProperty('--category-columns', e.target.value);
                             applyChangesToIframe();
                           }}
                           className="w-full h-8 border border-gray-300 rounded px-2 text-xs"
                         >
                          <option value="3">3 Columns</option>
                          <option value="4">4 Columns</option>
                          <option value="5">5 Columns</option>
                          <option value="6">6 Columns</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {selectedSection === 'brand' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Background Color</label>
                         <input
                           type="color"
                           defaultValue="#ffffff"
                           onChange={(e) => {
                             document.documentElement.style.setProperty('--brand-bg-color', e.target.value);
                             applyChangesToIframe();
                           }}
                           className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                         />
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          defaultChecked
                          onChange={(e) => {
                            const brandSection = document.querySelector('[style*="--brand-bg-color"]');
                            if (brandSection) {
                              brandSection.style.display = e.target.checked ? 'block' : 'none';
                            }
                          }}
                          className="mr-2"
                        />
                        <label className="text-xs font-medium text-gray-700">Show Brand Section</label>
                      </div>
                    </div>
                  )}

                  {selectedSection === 'product' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Background Color</label>
                         <input
                           type="color"
                           defaultValue="#f8fafc"
                           onChange={(e) => {
                             document.documentElement.style.setProperty('--product-bg-color', e.target.value);
                             applyChangesToIframe();
                           }}
                           className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                         />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Product Columns</label>
                         <select
                           onChange={(e) => {
                             document.documentElement.style.setProperty('--product-columns', e.target.value);
                             applyChangesToIframe();
                           }}
                           className="w-full h-8 border border-gray-300 rounded px-2 text-xs"
                         >
                          <option value="2">2 Columns</option>
                          <option value="3">3 Columns</option>
                          <option value="4">4 Columns</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Sections Tab */}
              {activeTab === 'sections' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Page Sections</h3>
                  <button className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1">
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>

                {/* Sections List */}
                <div className="space-y-2">
                  {sections.map((section, index) => {
                    const isCoreSection = ['hero', 'category', 'brand', 'product', 'footer'].includes(section.id);
                    return (
                      <div
                        key={section.id}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedSection === section.id 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedSection(section.id)}
                      >
                        <GripVertical className="w-4 h-4 text-gray-400 mr-3" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {section.name}
                            {isCoreSection && (
                              <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                                Core
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {section.visible ? 'Visible' : 'Hidden'}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const newSections = sections.map(s => 
                                s.id === section.id ? { ...s, visible: !s.visible } : s
                              );
                              setSections(newSections);
                            }}
                            className={`p-1 rounded transition-colors ${
                              section.visible 
                                ? 'text-green-600 hover:bg-green-100' 
                                : 'text-gray-400 hover:bg-gray-100'
                            }`}
                            title={section.visible ? 'Hide section' : 'Show section'}
                          >
                            {section.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSection(section.id);
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            title="Customize section"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                          {!isCoreSection && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSection(section.id);
                              }}
                              className="p-1 text-red-400 hover:text-red-600 hover:bg-red-100 rounded transition-colors"
                              title="Delete section"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add New Section Options */}
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Add New Section</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'testimonial', name: 'Testimonials', icon: Star },
                      { id: 'newsletter', name: 'Newsletter', icon: Mail },
                      { id: 'team', name: 'Team', icon: Users },
                      { id: 'gallery', name: 'Gallery', icon: Image },
                      { id: 'cta', name: 'Call to Action', icon: Zap },
                      { id: 'custom', name: 'Custom HTML', icon: Type }
                    ].map((section) => (
                      <button
                        key={section.id}
                        onClick={() => {
                          // Check if section already exists
                          const existingSection = sections.find(s => s.id === section.id);
                          if (!existingSection) {
                            // Generate unique ID to prevent duplicates
                            const uniqueId = `${section.id}-${Date.now()}`;
                            const newSection = {
                              id: uniqueId,
                              name: section.name,
                              visible: true,
                              order: sections.length + 1
                            };
                            setSections([...sections, newSection]);
                          }
                        }}
                        className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors flex flex-col items-center space-y-2"
                      >
                        <section.icon className="w-5 h-5 text-gray-600" />
                        <span className="text-xs font-medium text-gray-700">{section.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Design Tab */}
            {activeTab === 'design' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Design Settings</h3>
                
                {/* Color Scheme */}
                <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Color Scheme</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Primary Color</label>
                       <input
                         type="color"
                         defaultValue="#059669"
                         onChange={(e) => {
                           document.documentElement.style.setProperty('--cosmt-primary', e.target.value);
                           applyChangesToIframe();
                         }}
                         className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                       />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Secondary Color</label>
                       <input
                         type="color"
                         defaultValue="#3b82f6"
                         onChange={(e) => {
                           document.documentElement.style.setProperty('--cosmt-secondary', e.target.value);
                           applyChangesToIframe();
                         }}
                         className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                       />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Background Color</label>
                       <input
                         type="color"
                         defaultValue="#ffffff"
                         onChange={(e) => {
                           document.body.style.backgroundColor = e.target.value;
                           applyChangesToIframe();
                         }}
                         className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                       />
                    </div>
                  </div>
                </div>

                {/* Typography */}
                <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Typography</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Font Family</label>
                       <select
                         onChange={(e) => {
                           document.documentElement.style.setProperty('--font-family', e.target.value);
                           applyChangesToIframe();
                         }}
                         className="w-full h-8 border border-gray-300 rounded px-2 text-xs"
                       >
                        <option value="Inter, sans-serif">Inter</option>
                        <option value="Roboto, sans-serif">Roboto</option>
                        <option value="Open Sans, sans-serif">Open Sans</option>
                        <option value="Poppins, sans-serif">Poppins</option>
                        <option value="Montserrat, sans-serif">Montserrat</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Font Size</label>
                       <select
                         onChange={(e) => {
                           document.documentElement.style.setProperty('--base-font-size', e.target.value);
                           applyChangesToIframe();
                         }}
                         className="w-full h-8 border border-gray-300 rounded px-2 text-xs"
                       >
                        <option value="14px">Small (14px)</option>
                        <option value="16px">Medium (16px)</option>
                        <option value="18px">Large (18px)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Layout */}
                <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Layout</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Container Width</label>
                       <select
                         onChange={(e) => {
                           document.documentElement.style.setProperty('--container-width', e.target.value);
                           applyChangesToIframe();
                         }}
                         className="w-full h-8 border border-gray-300 rounded px-2 text-xs"
                       >
                        <option value="1200px">Standard (1200px)</option>
                        <option value="1400px">Wide (1400px)</option>
                        <option value="100%">Full Width</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Spacing</label>
                       <select
                         onChange={(e) => {
                           document.documentElement.style.setProperty('--section-spacing', e.target.value);
                           applyChangesToIframe();
                         }}
                         className="w-full h-8 border border-gray-300 rounded px-2 text-xs"
                       >
                        <option value="4rem">Compact</option>
                        <option value="6rem">Standard</option>
                        <option value="8rem">Spacious</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Content Tab */}
            {activeTab === 'content' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Settings</h3>
                
                {/* Hero Content */}
                <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Hero Content</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Main Heading</label>
                      <input
                        type="text"
                        defaultValue="Welcome to COSMT"
                        onChange={(e) => {
                          const heroHeading = document.querySelector('h1, .hero-title');
                          if (heroHeading) {
                            heroHeading.textContent = e.target.value;
                          }
                        }}
                        className="w-full h-8 border border-gray-300 rounded px-2 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Subheading</label>
                      <textarea
                        defaultValue="Discover our premium collection of cosmetics and beauty products"
                        onChange={(e) => {
                          const heroSubheading = document.querySelector('.hero-subtitle, .hero-description');
                          if (heroSubheading) {
                            heroSubheading.textContent = e.target.value;
                          }
                        }}
                        className="w-full h-16 border border-gray-300 rounded px-2 py-1 text-xs resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Button Text</label>
                      <input
                        type="text"
                        defaultValue="Shop Now"
                        onChange={(e) => {
                          const heroButton = document.querySelector('.hero-button, .cta-button');
                          if (heroButton) {
                            heroButton.textContent = e.target.value;
                          }
                        }}
                        className="w-full h-8 border border-gray-300 rounded px-2 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* SEO Settings */}
                <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">SEO Settings</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Page Title</label>
                      <input
                        type="text"
                        defaultValue="COSMT - Premium Cosmetics & Beauty Products"
                        onChange={(e) => {
                          document.title = e.target.value;
                        }}
                        className="w-full h-8 border border-gray-300 rounded px-2 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Meta Description</label>
                      <textarea
                        defaultValue="Discover our premium collection of cosmetics and beauty products. High-quality skincare, makeup, and hair care essentials."
                        onChange={(e) => {
                          let metaDescription = document.querySelector('meta[name="description"]');
                          if (!metaDescription) {
                            metaDescription = document.createElement('meta');
                            metaDescription.setAttribute('name', 'description');
                            document.head.appendChild(metaDescription);
                          }
                          metaDescription.setAttribute('content', e.target.value);
                        }}
                        className="w-full h-16 border border-gray-300 rounded px-2 py-1 text-xs resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 p-6">
          <div className="rounded-lg shadow-sm h-full overflow-hidden" style={{ backgroundColor: 'var(--cosmt-background, #ffffff)', border: '1px solid var(--cosmt-gray-200, #e5e7eb)' }}>
            <div className="p-4" style={{ borderBottom: '1px solid var(--cosmt-gray-200, #e5e7eb)' }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--cosmt-text, #111827)' }}>Live Preview</h3>
                  <p className="text-sm" style={{ color: 'var(--cosmt-text-light, #6b7280)' }}>See your changes in real-time</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedSection ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {selectedSection ? `Selected: ${sections.find(s => s.id === selectedSection)?.name}` : 'No section selected'}
                  </div>
                  <button
                    onClick={() => setSelectedSection(null)}
                    className="px-3 py-1 text-xs font-medium rounded transition-colors"
                    style={{ color: 'var(--cosmt-text-light, #6b7280)' }}
                    onMouseEnter={(e) => {
                      e.target.style.color = 'var(--cosmt-text, #111827)';
                      e.target.style.backgroundColor = 'var(--cosmt-gray-100, #f3f4f6)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'var(--cosmt-text-light, #6b7280)';
                      e.target.style.backgroundColor = 'transparent';
                    }}
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
              
              {/* Device Preview Controls */}
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium" style={{ color: 'var(--cosmt-text-light, #6b7280)' }}>Preview Mode</h4>
                <div className="flex gap-1 rounded-lg p-1" style={{ backgroundColor: 'var(--cosmt-gray-100, #f3f4f6)' }}>
                  <button
                    className={`flex items-center justify-center py-1.5 px-3 rounded text-xs font-medium transition-colors ${
                      activeTab === 'desktop' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setActiveTab('desktop')}
                  >
                    <Monitor className="w-4 h-4 mr-1" />
                    Desktop
                  </button>
                  <button
                    className={`flex items-center justify-center py-1.5 px-3 rounded text-xs font-medium transition-colors ${
                      activeTab === 'tablet' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setActiveTab('tablet')}
                  >
                    <Tablet className="w-4 h-4 mr-1" />
                    Tablet
                  </button>
                  <button
                    className={`flex items-center justify-center py-1.5 px-3 rounded text-xs font-medium transition-colors ${
                      activeTab === 'mobile' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setActiveTab('mobile')}
                  >
                    <Smartphone className="w-4 h-4 mr-1" />
                    Mobile
                  </button>
                </div>
              </div>
            </div>
            <div className="h-full overflow-y-auto relative">
              <div className={`h-full transition-all duration-300 ${
                activeTab === 'tablet' ? 'max-w-2xl mx-auto' : 
                activeTab === 'mobile' ? 'max-w-sm mx-auto' : 
                'w-full'
              }`}>
                <iframe
                  src="/"
                  className={`w-full h-full border-0 transition-all duration-300 ${
                    activeTab === 'tablet' ? 'rounded-lg shadow-lg' : 
                    activeTab === 'mobile' ? 'rounded-lg shadow-lg' : 
                    ''
                  }`}
                  title="Theme Preview"
                  id="preview-iframe"
                  loading="lazy"
                onLoad={useCallback(() => {
                  // Debounced iframe load handler for better performance
                  const timeoutId = setTimeout(() => {
                    const iframe = document.getElementById('preview-iframe') as HTMLIFrameElement;
                    if (iframe && iframe.contentDocument) {
                      const doc = iframe.contentDocument;
                      
                      // Add click handlers to different sections
                      const addClickHandler = (selector: string, sectionId: string, sectionName: string) => {
                        // Skip if selector is empty
                        if (!selector || selector.trim() === '') {
                          return;
                        }
                        
                        const element = doc.querySelector(selector);
                        if (element) {
                          element.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedSection(sectionId);
                            console.log(`Selected section: ${sectionName}`);
                          });
                          element.style.cursor = 'pointer';
                          element.title = `Click to customize ${sectionName}`;
                          
                          // Add hover effects
                          element.addEventListener('mouseenter', () => {
                            element.style.outline = '2px dashed #059669';
                            element.style.outlineOffset = '4px';
                          });
                          element.addEventListener('mouseleave', () => {
                            element.style.outline = 'none';
                            element.style.outlineOffset = '0';
                          });
                        }
                      };

                      // Add click handlers for each section
                      addClickHandler('[style*="--hero-bg-color"]', 'hero', 'Hero Section');
                      addClickHandler('.cosmt-hero-slider', 'hero', 'Hero Section');
                      addClickHandler('main > div:first-child', 'hero', 'Hero Section');
                      
                      addClickHandler('[style*="--category-bg-color"]', 'category', 'Category Section');
                      addClickHandler('.category-showcase', 'category', 'Category Section');
                      addClickHandler('main > div:nth-child(2)', 'category', 'Category Section');
                      
                      addClickHandler('[style*="--brand-bg-color"]', 'brand', 'Brand Section');
                      addClickHandler('.brand-section', 'brand', 'Brand Section');
                      addClickHandler('main > div:nth-child(3)', 'brand', 'Brand Section');
                      
                      addClickHandler('[style*="--product-bg-color"]', 'product', 'Product Section');
                      addClickHandler('.product-showcase', 'product', 'Product Section');
                      addClickHandler('main > div:nth-child(4)', 'product', 'Product Section');

                      // Also add click handlers to main sections as fallback
                      const mainSections = doc.querySelectorAll('main > div');
                      mainSections.forEach((section, index) => {
                        // Add click handler directly to the element
                        section.addEventListener('click', (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          
                          let sectionId = '';
                          let sectionName = '';
                          
                          if (index === 0) {
                            sectionId = 'hero';
                            sectionName = 'Hero Section';
                          } else if (index === 1) {
                            sectionId = 'category';
                            sectionName = 'Category Section';
                          } else if (index === 2) {
                            sectionId = 'brand';
                            sectionName = 'Brand Section';
                          } else if (index === 3) {
                            sectionId = 'product';
                            sectionName = 'Product Section';
                          }
                          
                          if (sectionId) {
                            setSelectedSection(sectionId);
                            console.log(`Selected section: ${sectionName}`);
                          }
                        });
                        
                        section.style.cursor = 'pointer';
                        section.title = `Click to customize section ${index + 1}`;
                        
                        // Add hover effects
                        section.addEventListener('mouseenter', () => {
                          section.style.outline = '2px dashed #059669';
                          section.style.outlineOffset = '4px';
                        });
                        section.addEventListener('mouseleave', () => {
                          section.style.outline = 'none';
                          section.style.outlineOffset = '0';
                        });
                      });
                    }
                  }, 1000);
                  
                  return () => clearTimeout(timeoutId);
                }, [])
                }
                />
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
