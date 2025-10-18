'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Copy, 
  Calendar,
  User,
  Globe,
  FileText,
  Home,
  ShoppingBag,
  Info,
  Mail,
  Phone,
  MapPin,
  Heart,
  Star,
  Tag,
  Image as ImageIcon,
  Settings,
  Save,
  Undo,
  Redo,
  Palette,
  Type,
  Layout,
  Image,
  Video,
  Code,
  Smartphone,
  Monitor,
  Tablet,
  Move,
  GripVertical,
  X,
  ChevronDown,
  ChevronRight,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link,
  ExternalLink,
  Download,
  Upload,
  Zap,
  Layers,
  Grid,
  List,
  Maximize,
  Minimize,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Component types for the page builder
interface Component {
  id: string;
  type: string;
  props: any;
  children?: Component[];
}

interface PageBuilderProps {
  pageId?: string;
  onSave?: (page: any) => void;
  onClose?: () => void;
}

// Available components for the page builder
const AVAILABLE_COMPONENTS = [
  {
    category: 'Layout',
    components: [
      { type: 'container', name: 'Container', icon: Layout, description: 'Basic container for content' },
      { type: 'row', name: 'Row', icon: Grid, description: 'Horizontal layout row' },
      { type: 'column', name: 'Column', icon: List, description: 'Vertical layout column' },
      { type: 'section', name: 'Section', icon: Layers, description: 'Page section with background' },
    ]
  },
  {
    category: 'Content',
    components: [
      { type: 'heading', name: 'Heading', icon: Type, description: 'Text heading (H1-H6)' },
      { type: 'paragraph', name: 'Paragraph', icon: FileText, description: 'Text paragraph' },
      { type: 'button', name: 'Button', icon: Zap, description: 'Clickable button' },
      { type: 'image', name: 'Image', icon: Image, description: 'Image element' },
      { type: 'video', name: 'Video', icon: Video, description: 'Video player' },
      { type: 'divider', name: 'Divider', icon: Minimize, description: 'Horizontal line divider' },
    ]
  },
  {
    category: 'E-commerce',
    components: [
      { type: 'product-grid', name: 'Product Grid', icon: ShoppingBag, description: 'Product listing grid' },
      { type: 'product-card', name: 'Product Card', icon: Tag, description: 'Single product display' },
      { type: 'category-filter', name: 'Category Filter', icon: Filter, description: 'Product category filter' },
      { type: 'price-range', name: 'Price Range', icon: DollarSign, description: 'Price filter slider' },
    ]
  },
  {
    category: 'Navigation',
    components: [
      { type: 'menu', name: 'Menu', icon: List, description: 'Navigation menu' },
      { type: 'breadcrumb', name: 'Breadcrumb', icon: ChevronRight, description: 'Breadcrumb navigation' },
      { type: 'pagination', name: 'Pagination', icon: ChevronDown, description: 'Page navigation' },
    ]
  },
  {
    category: 'Forms',
    components: [
      { type: 'contact-form', name: 'Contact Form', icon: Mail, description: 'Contact form with fields' },
      { type: 'newsletter', name: 'Newsletter', icon: Mail, description: 'Email subscription form' },
      { type: 'search-bar', name: 'Search Bar', icon: Search, description: 'Search input field' },
    ]
  },
  {
    category: 'Media',
    components: [
      { type: 'image-gallery', name: 'Image Gallery', icon: Image, description: 'Image carousel/gallery' },
      { type: 'hero-slider', name: 'Hero Slider', icon: Image, description: 'Full-width image slider' },
      { type: 'testimonial', name: 'Testimonial', icon: Star, description: 'Customer testimonial' },
    ]
  }
];

// Default component configurations
const DEFAULT_COMPONENTS = {
  container: {
    id: '',
    type: 'container',
    props: {
      className: 'py-8 px-4',
      backgroundColor: '#ffffff',
      padding: 'medium'
    },
    children: []
  },
  heading: {
    id: '',
    type: 'heading',
    props: {
      text: 'Your Heading Here',
      level: 'h2',
      size: 'large',
      color: '#000000',
      align: 'left'
    }
  },
  paragraph: {
    id: '',
    type: 'paragraph',
    props: {
      text: 'Your paragraph text goes here. You can edit this content and customize the styling.',
      color: '#666666',
      size: 'medium',
      align: 'left'
    }
  },
  button: {
    id: '',
    type: 'button',
    props: {
      text: 'Click Me',
      variant: 'primary',
      size: 'medium',
      color: '#059669',
      backgroundColor: '#059669',
      textColor: '#ffffff'
    }
  },
  image: {
    id: '',
    type: 'image',
    props: {
      src: '/api/placeholder/400/300',
      alt: 'Image description',
      width: '100%',
      height: 'auto',
      borderRadius: 'medium'
    }
  }
};

export default function PageBuilder({ pageId, onSave, onClose }: PageBuilderProps) {
  const [components, setComponents] = useState<Component[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showComponents, setShowComponents] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [draggedComponent, setDraggedComponent] = useState<any>(null);
  const [history, setHistory] = useState<Component[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [pageData, setPageData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load existing page data
  useEffect(() => {
    if (pageId) {
      loadPageData(pageId);
    }
  }, [pageId]);

  const loadPageData = async (id: string) => {
    setIsLoading(true);
    try {
      // Mock data for different pages - in real app, this would be an API call
      const pageDataMap: { [key: string]: any } = {
        '1': { // Homepage
          id: '1',
          title: 'Homepage',
          slug: '/',
          components: [
            {
              id: 'hero-1',
              type: 'section',
              props: {
                backgroundColor: '#f8fafc',
                padding: 'large'
              },
              children: [
                {
                  id: 'hero-heading',
                  type: 'heading',
                  props: {
                    text: 'Welcome to COSMT',
                    level: 'h1',
                    size: 'large',
                    color: '#1f2937',
                    align: 'center'
                  }
                },
                {
                  id: 'hero-subtitle',
                  type: 'paragraph',
                  props: {
                    text: 'Discover our premium collection of cosmetics and beauty products. High-quality skincare, makeup, and hair care essentials.',
                    color: '#6b7280',
                    size: 'large',
                    align: 'center'
                  }
                },
                {
                  id: 'hero-button',
                  type: 'button',
                  props: {
                    text: 'Shop Now',
                    variant: 'primary',
                    size: 'large',
                    color: '#ffffff',
                    backgroundColor: '#059669',
                    textColor: '#ffffff'
                  }
                }
              ]
            },
            {
              id: 'products-section',
              type: 'section',
              props: {
                backgroundColor: '#ffffff',
                padding: 'large'
              },
              children: [
                {
                  id: 'products-heading',
                  type: 'heading',
                  props: {
                    text: 'Featured Products',
                    level: 'h2',
                    size: 'large',
                    color: '#1f2937',
                    align: 'center'
                  }
                },
                {
                  id: 'product-grid',
                  type: 'product-grid',
                  props: {
                    columns: 3,
                    showFilters: true
                  }
                }
              ]
            }
          ]
        },
        '2': { // Shop page
          id: '2',
          title: 'Shop',
          slug: '/shop',
          components: [
            {
              id: 'shop-header',
              type: 'section',
              props: {
                backgroundColor: '#ffffff',
                padding: 'medium'
              },
              children: [
                {
                  id: 'shop-title',
                  type: 'heading',
                  props: {
                    text: 'Shop All Products',
                    level: 'h1',
                    size: 'large',
                    color: '#1f2937',
                    align: 'left'
                  }
                },
                {
                  id: 'search-bar',
                  type: 'search-bar',
                  props: {
                    placeholder: 'Search products...',
                    showFilters: true
                  }
                }
              ]
            },
            {
              id: 'products-listing',
              type: 'product-grid',
              props: {
                columns: 4,
                showFilters: true,
                showPagination: true
              }
            }
          ]
        },
        '3': { // About page
          id: '3',
          title: 'About Us',
          slug: '/about',
          components: [
            {
              id: 'about-hero',
              type: 'section',
              props: {
                backgroundColor: '#f8fafc',
                padding: 'large'
              },
              children: [
                {
                  id: 'about-title',
                  type: 'heading',
                  props: {
                    text: 'About COSMT',
                    level: 'h1',
                    size: 'large',
                    color: '#1f2937',
                    align: 'center'
                  }
                },
                {
                  id: 'about-image',
                  type: 'image',
                  props: {
                    src: '/api/placeholder/800/400',
                    alt: 'About COSMT',
                    width: '100%',
                    height: '400px',
                    borderRadius: 'large'
                  }
                },
                {
                  id: 'about-content',
                  type: 'paragraph',
                  props: {
                    text: 'COSMT is dedicated to providing premium beauty products that enhance your natural beauty. Our mission is to make high-quality cosmetics accessible to everyone.',
                    color: '#374151',
                    size: 'medium',
                    align: 'left'
                  }
                }
              ]
            }
          ]
        }
      };

      const data = pageDataMap[id] || {
        id,
        title: 'New Page',
        slug: '/new-page',
        components: []
      };

      setPageData(data);
      setComponents(data.components || []);
      saveToHistory(data.components || []);
    } catch (error) {
      console.error('Error loading page data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add component to page
  const addComponent = (componentType: string) => {
    const newComponent = {
      ...DEFAULT_COMPONENTS[componentType as keyof typeof DEFAULT_COMPONENTS],
      id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    const newComponents = [...components, newComponent];
    setComponents(newComponents);
    setSelectedComponent(newComponent.id);
    saveToHistory(newComponents);
  };

  // Update component properties
  const updateComponent = (componentId: string, updates: any) => {
    const updatedComponents = components.map(comp => 
      comp.id === componentId 
        ? { ...comp, props: { ...comp.props, ...updates } }
        : comp
    );
    setComponents(updatedComponents);
    saveToHistory(updatedComponents);
  };

  // Delete component
  const deleteComponent = (componentId: string) => {
    const updatedComponents = components.filter(comp => comp.id !== componentId);
    setComponents(updatedComponents);
    setSelectedComponent(null);
    saveToHistory(updatedComponents);
  };

  // Move component
  const moveComponent = (dragIndex: number, hoverIndex: number) => {
    const draggedItem = components[dragIndex];
    const newComponents = [...components];
    newComponents.splice(dragIndex, 1);
    newComponents.splice(hoverIndex, 0, draggedItem);
    setComponents(newComponents);
    saveToHistory(newComponents);
  };

  // History management
  const saveToHistory = (newComponents: Component[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newComponents]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setComponents(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setComponents(history[historyIndex + 1]);
    }
  };

  // Render component
  const renderComponent = (component: Component) => {
    const isSelected = selectedComponent === component.id;
    
    switch (component.type) {
      case 'container':
        return (
          <div
            key={component.id}
            className={`border-2 ${isSelected ? 'border-blue-500' : 'border-transparent'} hover:border-gray-300 cursor-pointer`}
            style={{ backgroundColor: component.props.backgroundColor }}
            onClick={() => setSelectedComponent(component.id)}
          >
            <div className="p-4">
              {component.children?.map(child => renderComponent(child)) || (
                <div className="text-gray-400 text-center py-8">
                  Drop components here
                </div>
              )}
            </div>
          </div>
        );
      
      case 'heading':
        const HeadingTag = component.props.level || 'h2';
        return (
          <div
            key={component.id}
            className={`border-2 ${isSelected ? 'border-blue-500' : 'border-transparent'} hover:border-gray-300 cursor-pointer p-2`}
            onClick={() => setSelectedComponent(component.id)}
          >
            <HeadingTag
              style={{
                color: component.props.color,
                textAlign: component.props.align,
                fontSize: component.props.size === 'large' ? '2rem' : 
                         component.props.size === 'medium' ? '1.5rem' : '1rem'
              }}
            >
              {component.props.text}
            </HeadingTag>
          </div>
        );
      
      case 'paragraph':
        return (
          <div
            key={component.id}
            className={`border-2 ${isSelected ? 'border-blue-500' : 'border-transparent'} hover:border-gray-300 cursor-pointer p-2`}
            onClick={() => setSelectedComponent(component.id)}
          >
            <p
              style={{
                color: component.props.color,
                textAlign: component.props.align,
                fontSize: component.props.size === 'large' ? '1.25rem' : 
                         component.props.size === 'medium' ? '1rem' : '0.875rem'
              }}
            >
              {component.props.text}
            </p>
          </div>
        );
      
      case 'button':
        return (
          <div
            key={component.id}
            className={`border-2 ${isSelected ? 'border-blue-500' : 'border-transparent'} hover:border-gray-300 cursor-pointer p-2`}
            onClick={() => setSelectedComponent(component.id)}
          >
            <button
              className="px-6 py-3 rounded-lg font-medium transition-colors"
              style={{
                backgroundColor: component.props.backgroundColor,
                color: component.props.textColor,
                fontSize: component.props.size === 'large' ? '1.125rem' : 
                         component.props.size === 'medium' ? '1rem' : '0.875rem'
              }}
            >
              {component.props.text}
            </button>
          </div>
        );
      
      case 'image':
        return (
          <div
            key={component.id}
            className={`border-2 ${isSelected ? 'border-blue-500' : 'border-transparent'} hover:border-gray-300 cursor-pointer p-2`}
            onClick={() => setSelectedComponent(component.id)}
          >
            <img
              src={component.props.src}
              alt={component.props.alt}
              style={{
                width: component.props.width,
                height: component.props.height,
                borderRadius: component.props.borderRadius === 'large' ? '1rem' :
                             component.props.borderRadius === 'medium' ? '0.5rem' : '0.25rem'
              }}
              className="max-w-full h-auto"
            />
          </div>
        );
      
      case 'section':
        return (
          <div
            key={component.id}
            className={`border-2 ${isSelected ? 'border-blue-500' : 'border-transparent'} hover:border-gray-300 cursor-pointer`}
            style={{ 
              backgroundColor: component.props.backgroundColor,
              padding: component.props.padding === 'large' ? '3rem' : 
                       component.props.padding === 'medium' ? '2rem' : '1rem'
            }}
            onClick={() => setSelectedComponent(component.id)}
          >
            <div className="p-4">
              {component.children?.map(child => renderComponent(child)) || (
                <div className="text-gray-400 text-center py-8">
                  Drop components here
                </div>
              )}
            </div>
          </div>
        );
      
      case 'product-grid':
        return (
          <div
            key={component.id}
            className={`border-2 ${isSelected ? 'border-blue-500' : 'border-transparent'} hover:border-gray-300 cursor-pointer p-4`}
            onClick={() => setSelectedComponent(component.id)}
          >
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Product Grid</h3>
              <p className="text-sm text-gray-500">
                {component.props.columns} columns • {component.props.showFilters ? 'With filters' : 'No filters'}
              </p>
            </div>
            <div className={`grid gap-4 ${
              component.props.columns === 2 ? 'grid-cols-2' :
              component.props.columns === 3 ? 'grid-cols-3' :
              component.props.columns === 4 ? 'grid-cols-4' : 'grid-cols-1'
            }`}>
              {[1, 2, 3, 4].slice(0, component.props.columns).map((i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <div className="w-full h-32 bg-gray-100 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'search-bar':
        return (
          <div
            key={component.id}
            className={`border-2 ${isSelected ? 'border-blue-500' : 'border-transparent'} hover:border-gray-300 cursor-pointer p-4`}
            onClick={() => setSelectedComponent(component.id)}
          >
            <div className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder={component.props.placeholder || 'Search...'}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  disabled
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div
            key={component.id}
            className={`border-2 ${isSelected ? 'border-blue-500' : 'border-transparent'} hover:border-gray-300 cursor-pointer p-4`}
            onClick={() => setSelectedComponent(component.id)}
          >
            <div className="text-gray-500 text-center">
              {component.type} Component
            </div>
          </div>
        );
    }
  };

  // Get selected component for editing
  const selectedComponentData = components.find(comp => comp.id === selectedComponent);

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Left Sidebar - Components */}
      {showComponents && (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Components</h2>
            <p className="text-sm text-gray-600">Drag components to build your page</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {AVAILABLE_COMPONENTS.map((category) => (
              <div key={category.category} className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">{category.category}</h3>
                <div className="space-y-2">
                  {category.components.map((component) => (
                    <div
                      key={component.type}
                      className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
                      onClick={() => addComponent(component.type)}
                    >
                      <div className="flex items-center space-x-3">
                        <component.icon className="w-5 h-5 text-gray-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{component.name}</div>
                          <div className="text-xs text-gray-500">{component.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {pageData ? `Editing: ${pageData.title}` : 'Page Builder'}
                </h1>
                {pageData && (
                  <p className="text-sm text-gray-500">{pageData.slug}</p>
                )}
              </div>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowComponents(!showComponents)}
              >
                <Layout className="w-4 h-4 mr-2" />
                Components
              </Button>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={undo}
                  disabled={historyIndex <= 0}
                >
                  <Undo className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                >
                  <Redo className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
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

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => onSave?.(components)}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Page
              </Button>
            </div>
          </div>
        </div>

        {/* Page Preview */}
        <div className="flex-1 flex">
          <div className="flex-1 p-8 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading page content...</p>
                </div>
              </div>
            ) : (
              <div 
                className={`mx-auto bg-white shadow-lg ${
                  previewMode === 'desktop' ? 'max-w-6xl' :
                  previewMode === 'tablet' ? 'max-w-2xl' : 'max-w-sm'
                }`}
              >
                {components.length === 0 ? (
                  <div className="text-center py-20">
                    <Layout className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Start Building Your Page</h3>
                    <p className="text-gray-500 mb-4">
                      Choose components from the sidebar to start building your page
                    </p>
                    <Button onClick={() => setShowComponents(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Component
                    </Button>
                  </div>
                ) : (
                  <div className="min-h-screen">
                    {components.map(component => renderComponent(component))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar - Component Settings */}
          {showSettings && selectedComponentData && (
            <div className="w-80 bg-white border-l border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Component Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Text Settings */}
                {['heading', 'paragraph'].includes(selectedComponentData.type) && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Text</label>
                      <textarea
                        value={selectedComponentData.props.text}
                        onChange={(e) => updateComponent(selectedComponentData.id, { text: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                      <input
                        type="color"
                        value={selectedComponentData.props.color}
                        onChange={(e) => updateComponent(selectedComponentData.id, { color: e.target.value })}
                        className="w-full h-10 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                      <select
                        value={selectedComponentData.props.size}
                        onChange={(e) => updateComponent(selectedComponentData.id, { size: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Alignment</label>
                      <div className="flex space-x-2">
                        {[
                          { value: 'left', icon: AlignLeft },
                          { value: 'center', icon: AlignCenter },
                          { value: 'right', icon: AlignRight },
                          { value: 'justify', icon: AlignJustify }
                        ].map((align) => (
                          <button
                            key={align.value}
                            onClick={() => updateComponent(selectedComponentData.id, { align: align.value })}
                            className={`p-2 border rounded ${
                              selectedComponentData.props.align === align.value 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-300'
                            }`}
                          >
                            <align.icon className="w-4 h-4" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Button Settings */}
                {selectedComponentData.type === 'button' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                      <input
                        type="text"
                        value={selectedComponentData.props.text}
                        onChange={(e) => updateComponent(selectedComponentData.id, { text: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                      <input
                        type="color"
                        value={selectedComponentData.props.backgroundColor}
                        onChange={(e) => updateComponent(selectedComponentData.id, { backgroundColor: e.target.value })}
                        className="w-full h-10 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                      <input
                        type="color"
                        value={selectedComponentData.props.textColor}
                        onChange={(e) => updateComponent(selectedComponentData.id, { textColor: e.target.value })}
                        className="w-full h-10 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </>
                )}

                {/* Image Settings */}
                {selectedComponentData.type === 'image' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                      <input
                        type="url"
                        value={selectedComponentData.props.src}
                        onChange={(e) => updateComponent(selectedComponentData.id, { src: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Alt Text</label>
                      <input
                        type="text"
                        value={selectedComponentData.props.alt}
                        onChange={(e) => updateComponent(selectedComponentData.id, { alt: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </>
                )}

                {/* Container Settings */}
                {selectedComponentData.type === 'container' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                      <input
                        type="color"
                        value={selectedComponentData.props.backgroundColor}
                        onChange={(e) => updateComponent(selectedComponentData.id, { backgroundColor: e.target.value })}
                        className="w-full h-10 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </>
                )}

                {/* Section Settings */}
                {selectedComponentData.type === 'section' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                      <input
                        type="color"
                        value={selectedComponentData.props.backgroundColor}
                        onChange={(e) => updateComponent(selectedComponentData.id, { backgroundColor: e.target.value })}
                        className="w-full h-10 border border-gray-300 rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Padding</label>
                      <select
                        value={selectedComponentData.props.padding}
                        onChange={(e) => updateComponent(selectedComponentData.id, { padding: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Product Grid Settings */}
                {selectedComponentData.type === 'product-grid' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Columns</label>
                      <select
                        value={selectedComponentData.props.columns}
                        onChange={(e) => updateComponent(selectedComponentData.id, { columns: parseInt(e.target.value) })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      >
                        <option value="1">1 Column</option>
                        <option value="2">2 Columns</option>
                        <option value="3">3 Columns</option>
                        <option value="4">4 Columns</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedComponentData.props.showFilters}
                          onChange={(e) => updateComponent(selectedComponentData.id, { showFilters: e.target.checked })}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">Show Filters</span>
                      </label>
                    </div>
                  </>
                )}

                {/* Search Bar Settings */}
                {selectedComponentData.type === 'search-bar' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Placeholder Text</label>
                      <input
                        type="text"
                        value={selectedComponentData.props.placeholder}
                        onChange={(e) => updateComponent(selectedComponentData.id, { placeholder: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedComponentData.props.showFilters}
                          onChange={(e) => updateComponent(selectedComponentData.id, { showFilters: e.target.checked })}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">Show Filters</span>
                      </label>
                    </div>
                  </>
                )}

                {/* Delete Component */}
                <div className="pt-4 border-t border-gray-200">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => deleteComponent(selectedComponentData.id)}
                    className="w-full text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Component
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
