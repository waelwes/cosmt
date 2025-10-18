'use client';

import React, { useState } from 'react';
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
  ChevronRight
} from 'lucide-react';

export default function CustomizerToggle() {
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
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

  const handleSave = (changes: any) => {
    // Apply changes to the live site
    console.log('Saving customizer changes:', changes);
    
    // Update the homepage sections based on customizer settings
    changes.forEach((section: any) => {
      if (section.type === 'hero-slider') {
        // Update hero slider settings
        document.documentElement.style.setProperty('--hero-bg-color', section.settings.backgroundColor);
        document.documentElement.style.setProperty('--hero-height', section.settings.height);
      } else if (section.type === 'category-showcase') {
        // Update category showcase settings
        document.documentElement.style.setProperty('--category-bg-color', section.settings.backgroundColor);
        document.documentElement.style.setProperty('--category-columns', section.settings.columns);
      } else if (section.type === 'brand-sections') {
        // Update brand sections settings
        document.documentElement.style.setProperty('--brand-bg-color', section.settings.backgroundColor);
      } else if (section.type === 'product-showcases') {
        // Update product showcases settings
        document.documentElement.style.setProperty('--product-bg-color', section.settings.backgroundColor);
        document.documentElement.style.setProperty('--product-columns', section.settings.columns);
      }
    });

    // Show success message
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.textContent = 'Changes saved successfully!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };

  return (
    <>
      {/* Customizer Toggle Button */}
      <button
        onClick={() => setIsCustomizerOpen(true)}
        className="fixed bottom-6 left-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-40 transition-colors"
        title="Customize this page"
      >
        <Settings className="w-6 h-6" />
      </button>

      {/* Simple Customizer Panel */}
      {isCustomizerOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'transparent',
            zIndex: 10000,
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'stretch'
          }}
          onClick={() => setIsCustomizerOpen(false)}
        >
          <div 
            style={{
              width: '400px',
              backgroundColor: 'white',
              boxShadow: 'none',
              display: 'flex',
              flexDirection: 'column',
              height: '100vh',
              overflow: 'hidden',
              borderRight: '1px solid #e5e7eb'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
                  Theme Customizer
                </h2>
                <button
                  onClick={() => setIsCustomizerOpen(false)}
                  style={{
                    padding: '4px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    borderRadius: '4px'
                  }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Device Preview */}
              <div style={{ display: 'flex', gap: '4px', backgroundColor: '#e5e7eb', borderRadius: '6px', padding: '2px' }}>
                <button
                  style={{
                    padding: '6px 8px',
                    border: 'none',
                    background: activeTab === 'desktop' ? 'white' : 'transparent',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                  onClick={() => setActiveTab('desktop')}
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  style={{
                    padding: '6px 8px',
                    border: 'none',
                    background: activeTab === 'tablet' ? 'white' : 'transparent',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                  onClick={() => setActiveTab('tablet')}
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  style={{
                    padding: '6px 8px',
                    border: 'none',
                    background: activeTab === 'mobile' ? 'white' : 'transparent',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                  onClick={() => setActiveTab('mobile')}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', backgroundColor: 'white' }} className="live-customizer-tabs">
              <button
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: 'none',
                  background: activeTab === 'sections' ? '#f3f4f6' : 'transparent',
                  borderBottom: activeTab === 'sections' ? '2px solid #059669' : '2px solid transparent',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: activeTab === 'sections' ? '#059669' : '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
                onClick={() => setActiveTab('sections')}
              >
                <Layout className="w-4 h-4" />
                Sections
              </button>
              <button
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: 'none',
                  background: activeTab === 'design' ? '#f3f4f6' : 'transparent',
                  borderBottom: activeTab === 'design' ? '2px solid #059669' : '2px solid transparent',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: activeTab === 'design' ? '#059669' : '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
                onClick={() => setActiveTab('design')}
              >
                <Palette className="w-4 h-4" />
                Design
              </button>
              <button
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: 'none',
                  background: activeTab === 'content' ? '#f3f4f6' : 'transparent',
                  borderBottom: activeTab === 'content' ? '2px solid #059669' : '2px solid transparent',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: activeTab === 'content' ? '#059669' : '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
                onClick={() => setActiveTab('content')}
              >
                <Type className="w-4 h-4" />
                Content
              </button>
            </div>

            {/* Content */}
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
              {/* Sections Tab */}
              {activeTab === 'sections' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: 0 }}>
                      Page Sections
                    </h3>
                    <button
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#059669',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Plus className="w-4 h-4" />
                      Add Section
                    </button>
                  </div>

                  {/* Sections List */}
                  <div style={{ space: '8px' }}>
                    {sections.map((section, index) => (
                      <div
                        key={section.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '12px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          marginBottom: '8px',
                          backgroundColor: selectedSection === section.id ? '#f0f9ff' : 'white',
                          cursor: 'pointer'
                        }}
                        onClick={() => setSelectedSection(section.id)}
                      >
                        <GripVertical className="w-4 h-4" style={{ color: '#9ca3af', marginRight: '12px' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                            {section.name}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            {section.visible ? 'Visible' : 'Hidden'}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const newSections = sections.map(s => 
                                s.id === section.id ? { ...s, visible: !s.visible } : s
                              );
                              setSections(newSections);
                            }}
                            style={{
                              padding: '4px',
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer',
                              color: section.visible ? '#059669' : '#6b7280'
                            }}
                          >
                            {section.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSection(section.id);
                            }}
                            style={{
                              padding: '4px',
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer',
                              color: '#6b7280'
                            }}
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add New Section Options */}
                  <div style={{ marginTop: '20px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>
                      Add New Section
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
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
                            const newSection = {
                              id: section.id,
                              name: section.name,
                              visible: true,
                              order: sections.length + 1
                            };
                            setSections([...sections, newSection]);
                          }}
                          style={{
                            padding: '12px',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            background: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '12px',
                            fontWeight: '500',
                            color: '#374151'
                          }}
                        >
                          <section.icon className="w-5 h-5" />
                          {section.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Design Tab */}
              {activeTab === 'design' && (
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                    Design Settings
                  </h3>
                
                  {/* Color Scheme */}
                  <div style={{ marginBottom: '24px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: '0 0 12px 0' }}>Color Scheme</h4>
                    
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                        Primary Color
                      </label>
                      <input
                        type="color"
                        defaultValue="#059669"
                        onChange={(e) => {
                          document.documentElement.style.setProperty('--cosmt-primary', e.target.value);
                        }}
                        style={{
                          width: '100%',
                          height: '32px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                        Secondary Color
                      </label>
                      <input
                        type="color"
                        defaultValue="#3b82f6"
                        onChange={(e) => {
                          document.documentElement.style.setProperty('--cosmt-secondary', e.target.value);
                        }}
                        style={{
                          width: '100%',
                          height: '32px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                        Background Color
                      </label>
                      <input
                        type="color"
                        defaultValue="#ffffff"
                        onChange={(e) => {
                          document.body.style.backgroundColor = e.target.value;
                        }}
                        style={{
                          width: '100%',
                          height: '32px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      />
                    </div>
                  </div>

                  {/* Typography */}
                  <div style={{ marginBottom: '24px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: '0 0 12px 0' }}>Typography</h4>
                    
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                        Font Family
                      </label>
                      <select
                        onChange={(e) => {
                          document.documentElement.style.setProperty('--font-family', e.target.value);
                        }}
                        style={{
                          width: '100%',
                          height: '32px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          padding: '0 8px',
                          fontSize: '12px'
                        }}
                      >
                        <option value="Inter, sans-serif">Inter</option>
                        <option value="Roboto, sans-serif">Roboto</option>
                        <option value="Open Sans, sans-serif">Open Sans</option>
                        <option value="Poppins, sans-serif">Poppins</option>
                        <option value="Montserrat, sans-serif">Montserrat</option>
                      </select>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                        Font Size
                      </label>
                      <select
                        onChange={(e) => {
                          document.documentElement.style.setProperty('--base-font-size', e.target.value);
                        }}
                        style={{
                          width: '100%',
                          height: '32px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          padding: '0 8px',
                          fontSize: '12px'
                        }}
                      >
                        <option value="14px">Small (14px)</option>
                        <option value="16px" selected>Medium (16px)</option>
                        <option value="18px">Large (18px)</option>
                      </select>
                    </div>
                  </div>

                  {/* Layout */}
                  <div style={{ marginBottom: '24px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: '0 0 12px 0' }}>Layout</h4>
                    
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                        Container Width
                      </label>
                      <select
                        onChange={(e) => {
                          document.documentElement.style.setProperty('--container-width', e.target.value);
                        }}
                        style={{
                          width: '100%',
                          height: '32px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          padding: '0 8px',
                          fontSize: '12px'
                        }}
                      >
                        <option value="1200px">Standard (1200px)</option>
                        <option value="1400px">Wide (1400px)</option>
                        <option value="100%">Full Width</option>
                      </select>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                        Spacing
                      </label>
                      <select
                        onChange={(e) => {
                          document.documentElement.style.setProperty('--section-spacing', e.target.value);
                        }}
                        style={{
                          width: '100%',
                          height: '32px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          padding: '0 8px',
                          fontSize: '12px'
                        }}
                      >
                        <option value="4rem">Compact</option>
                        <option value="6rem" selected>Standard</option>
                        <option value="8rem">Spacious</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Content Tab */}
              {activeTab === 'content' && (
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                    Content Settings
                  </h3>
                
                  {/* Hero Content */}
                  <div style={{ marginBottom: '24px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: '0 0 12px 0' }}>Hero Content</h4>
                    
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                        Main Heading
                      </label>
                      <input
                        type="text"
                        defaultValue="Welcome to COSMT"
                        onChange={(e) => {
                          // Update hero heading
                          const heroHeading = document.querySelector('h1, .hero-title');
                          if (heroHeading) {
                            heroHeading.textContent = e.target.value;
                          }
                        }}
                        style={{
                          width: '100%',
                          height: '32px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          padding: '0 8px',
                          fontSize: '12px'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                        Subheading
                      </label>
                      <textarea
                        defaultValue="Discover our premium collection of cosmetics and beauty products"
                        onChange={(e) => {
                          // Update hero subheading
                          const heroSubheading = document.querySelector('.hero-subtitle, .hero-description');
                          if (heroSubheading) {
                            heroSubheading.textContent = e.target.value;
                          }
                        }}
                        style={{
                          width: '100%',
                          height: '60px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          padding: '8px',
                          fontSize: '12px',
                          resize: 'vertical'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                        Button Text
                      </label>
                      <input
                        type="text"
                        defaultValue="Shop Now"
                        onChange={(e) => {
                          // Update hero button
                          const heroButton = document.querySelector('.hero-button, .cta-button');
                          if (heroButton) {
                            heroButton.textContent = e.target.value;
                          }
                        }}
                        style={{
                          width: '100%',
                          height: '32px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          padding: '0 8px',
                          fontSize: '12px'
                        }}
                      />
                    </div>
                  </div>

                  {/* SEO Settings */}
                  <div style={{ marginBottom: '24px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: '0 0 12px 0' }}>SEO Settings</h4>
                    
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                        Page Title
                      </label>
                      <input
                        type="text"
                        defaultValue="COSMT - Premium Cosmetics & Beauty Products"
                        onChange={(e) => {
                          document.title = e.target.value;
                        }}
                        style={{
                          width: '100%',
                          height: '32px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          padding: '0 8px',
                          fontSize: '12px'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                        Meta Description
                      </label>
                      <textarea
                        defaultValue="Discover our premium collection of cosmetics and beauty products. High-quality skincare, makeup, and hair care essentials."
                        onChange={(e) => {
                          // Update meta description
                          let metaDescription = document.querySelector('meta[name="description"]');
                          if (!metaDescription) {
                            metaDescription = document.createElement('meta');
                            metaDescription.setAttribute('name', 'description');
                            document.head.appendChild(metaDescription);
                          }
                          metaDescription.setAttribute('content', e.target.value);
                        }}
                        style={{
                          width: '100%',
                          height: '60px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          padding: '8px',
                          fontSize: '12px',
                          resize: 'vertical'
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '16px', borderTop: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <button
                  style={{
                    flex: 1,
                    backgroundColor: '#6b7280',
                    color: 'white',
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <Undo className="w-4 h-4" />
                  Undo
                </button>
                <button
                  style={{
                    flex: 1,
                    backgroundColor: '#6b7280',
                    color: 'white',
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <Redo className="w-4 h-4" />
                  Redo
                </button>
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setIsCustomizerOpen(false)}
                  style={{
                    flex: 1,
                    backgroundColor: '#e5e7eb',
                    color: '#374151',
                    padding: '10px 16px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Show success message
                    const notification = document.createElement('div');
                    notification.style.cssText = 'position: fixed; top: 16px; right: 16px; background: #10b981; color: white; padding: 8px 16px; border-radius: 8px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); z-index: 10001;';
                    notification.textContent = 'Changes saved successfully!';
                    document.body.appendChild(notification);
                    
                    setTimeout(() => {
                      if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                      }
                    }, 3000);
                    
                    setIsCustomizerOpen(false);
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: '#059669',
                    color: 'white',
                    padding: '10px 16px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
