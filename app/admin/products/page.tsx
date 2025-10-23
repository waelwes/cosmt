'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  SlidersHorizontal, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  Star,
  TrendingUp,
  AlertTriangle,
  X,
  Save,
  Check,
  RefreshCw,
  Download,
  FileText,
  FileSpreadsheet,
  File,
  Printer,
  Upload,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useProducts, useCrudOperations } from '@/hooks/useAdminData';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

interface Product {
  id: number;
  name: string;
  brand: string;
  category?: string; // Keep for backward compatibility
  category_id?: number;
  categories?: {
    id: number;
    name: string;
    slug: string;
    parent_id: number | null;
  };
  type?: string;
  price: number;
  original_price?: number | null;
  originalPrice?: number | null; // For backward compatibility
  stock: number;
  status: 'active' | 'inactive';
  rating: number;
  reviews: number;
  image: string;
  sku?: string;
  is_best_seller?: boolean;
  isBestSeller?: boolean; // For backward compatibility
  is_on_sale?: boolean;
  isOnSale?: boolean; // For backward compatibility
  description?: string;
  created_at?: Date | string;
  createdAt?: Date | string; // For backward compatibility
  updated_at?: Date | string;
  updatedAt?: Date | string; // For backward compatibility
}

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const [showViewModal, setShowViewModal] = useState<Product | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showImportMenu, setShowImportMenu] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    image: true,
    name: true,
    category: true,
    brand: true,
    type: true,
    price: true,
    stock: true,
    status: true,
    rating: true,
    sku: true,
    created: true,
    actions: true
  });
  const [filters, setFilters] = useState({
    status: 'all',
    stock: 'all',
    rating: 'all'
  });

  // Use API hooks with pagination
  const { data: productsData, loading, error, refetch, retry } = useProducts({
    search: debouncedSearchTerm,
    category: selectedCategory,
    status: selectedStatus,
    sortBy: sortBy,
    sortOrder: sortOrder,
    page: currentPage,
    limit: itemsPerPage
  });

  // Transform products to handle both old and new field names
  const transformProduct = (product: any): Product => ({
    ...product,
    originalPrice: product.original_price || product.originalPrice,
    isBestSeller: product.is_best_seller || product.isBestSeller || false,
    isOnSale: product.is_on_sale || product.isOnSale || false,
    createdAt: product.created_at || product.createdAt,
    updatedAt: product.updated_at || product.updatedAt,
    category: product.categories?.name || product.category || 'Unknown', // Use new category structure
  });

  const allProducts = productsData?.products ? productsData.products.map(transformProduct) : [];
  const totalProducts = productsData?.total || 0;
  const totalPages = productsData?.totalPages || 1;
  
  // Debug logging
  console.log('🔍 Products Debug Info:');
  console.log('productsData:', productsData);
  console.log('productsData.products:', productsData?.products);
  console.log('productsData.products length:', productsData?.products?.length);
  console.log('allProducts:', allProducts);
  console.log('allProducts length:', allProducts?.length);
  console.log('totalProducts:', totalProducts);
  console.log('loading:', loading);
  console.log('error:', error);
  
  // Check if productsData has the expected structure
  if (productsData) {
    console.log('🔍 API Response Structure:');
    console.log('- success:', (productsData as any).success);
    console.log('- products type:', typeof productsData.products);
    console.log('- products is array:', Array.isArray(productsData.products));
    console.log('- total:', productsData.total);
    console.log('- page:', productsData.page);
    console.log('- totalPages:', productsData.totalPages);
    
    // Show sample product data
    if (productsData.products && productsData.products.length > 0) {
      console.log('🔍 Sample Product Data:');
      console.log('First product:', productsData.products[0]);
      console.log('Product keys:', Object.keys(productsData.products[0]));
    }
  }

  // Debounce search term to avoid excessive filtering
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedStatus, sortBy, sortOrder]);

  const { create, update, remove, loading: crudLoading } = useCrudOperations<Product>(
    '/api/admin/products',
    () => {
      refetch(); // Refresh data after successful operation
      setShowDeleteModal(null);
    },
    (error) => {
      console.error('CRUD operation failed:', error);
      // You could add a toast notification here
    }
  );


  // Mock data removed - now using real data from API


  // CRUD Operations using API
  const handleEdit = (product: Product) => {
    // Navigate to edit page
    window.location.href = `/admin/products/edit/${product.id}`;
  };


  const handleDelete = async (id: number) => {
    try {
      await remove(id);
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleView = (product: Product) => {
    setShowViewModal(product);
  };


  // Memoized filtered and sorted products
  const filteredProducts = useMemo(() => {
    if (!allProducts || !Array.isArray(allProducts)) {
      return [];
    }
    
    const filtered = allProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           product.brand.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      
      const matchesStatus = filters.status === 'all' || product.status === filters.status;
      const matchesStock = filters.stock === 'all' || 
                          (filters.stock === 'in-stock' && product.stock > 0) ||
                          (filters.stock === 'low-stock' && product.stock > 0 && product.stock < 10) ||
                          (filters.stock === 'out-of-stock' && product.stock === 0);
      const matchesRating = filters.rating === 'all' || 
                           (filters.rating === 'high' && product.rating >= 4.5) ||
                           (filters.rating === 'medium' && product.rating >= 3.5 && product.rating < 4.5) ||
                           (filters.rating === 'low' && product.rating < 3.5);
      
      return matchesSearch && matchesStatus && matchesStock && matchesRating;
    });

    return filtered;
  }, [allProducts, debouncedSearchTerm, filters]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'inactive':
        return 'status-inactive';
      default:
        return 'status-inactive';
    }
  };

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showExportMenu && !(event.target as Element).closest('.export-dropdown')) {
        setShowExportMenu(false);
      }
      if (showFilterMenu && !(event.target as Element).closest('.filter-dropdown')) {
        setShowFilterMenu(false);
      }
      if (showImportMenu && !(event.target as Element).closest('.import-dropdown')) {
        setShowImportMenu(false);
      }
      if (showColumnSettings && !(event.target as Element).closest('.column-settings-dropdown')) {
        setShowColumnSettings(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExportMenu, showFilterMenu, showImportMenu, showColumnSettings]);

  // Export Functions
  const exportToCSV = () => {
    if (filteredProducts.length === 0) {
      alert('No products to export');
      return;
    }

    const csvData = filteredProducts.map(product => ({
      'Product ID': product.id,
      'Name': product.name,
      'Brand': product.brand,
      'Category': product.categories?.name || product.category || 'Unknown',
      'Price': `$${product.price.toFixed(2)}`,
      'Original Price': product.originalPrice ? `$${product.originalPrice.toFixed(2)}` : 'N/A',
      'Stock': product.stock,
      'Status': product.status,
      'Rating': product.rating,
      'Reviews': product.reviews,
      'Best Seller': product.isBestSeller ? 'Yes' : 'No',
      'On Sale': product.isOnSale ? 'Yes' : 'No',
      'Description': product.description || 'N/A'
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `products-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportToExcel = () => {
    if (filteredProducts.length === 0) {
      alert('No products to export');
      return;
    }

    const excelData = filteredProducts.map(product => ({
      'Product ID': product.id,
      'Name': product.name,
      'Brand': product.brand,
      'Category': product.categories?.name || product.category || 'Unknown',
      'Price': product.price,
      'Original Price': product.originalPrice || 0,
      'Stock': product.stock,
      'Status': product.status,
      'Rating': product.rating,
      'Reviews': product.reviews,
      'Best Seller': product.isBestSeller,
      'On Sale': product.isOnSale,
      'Description': product.description || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
    
    XLSX.writeFile(workbook, `products-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportToPDF = async () => {
    if (filteredProducts.length === 0) {
      alert('No products to export');
      return;
    }

    const element = document.getElementById('products-table');
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('l', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`products-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const printProducts = () => {
    if (filteredProducts.length === 0) {
      alert('No products to print');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const tableElement = document.getElementById('products-table');
    if (!tableElement) return;

    const totalProducts = filteredProducts.length;
    const activeProducts = filteredProducts.filter(p => p.status === 'active').length;
    const lowStock = filteredProducts.filter(p => p.stock < 10).length;
    const onSale = filteredProducts.filter(p => p.isOnSale).length;
    const totalValue = filteredProducts.reduce((sum, product) => sum + (product.price * product.stock), 0);

    printWindow.document.write(`
      <html>
        <head>
          <title>Products Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .header { text-align: center; margin-bottom: 20px; }
            .stats { display: flex; justify-content: space-around; margin-bottom: 20px; }
            .stat-item { text-align: center; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Products Report</h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="stats">
            <div class="stat-item">
              <h3>${totalProducts}</h3>
              <p>Total Products</p>
            </div>
            <div class="stat-item">
              <h3>${activeProducts}</h3>
              <p>Active</p>
            </div>
            <div class="stat-item">
              <h3>${lowStock}</h3>
              <p>Low Stock</p>
            </div>
            <div class="stat-item">
              <h3>${onSale}</h3>
              <p>On Sale</p>
            </div>
            <div class="stat-item">
              <h3>$${totalValue.toFixed(2)}</h3>
              <p>Total Value</p>
            </div>
          </div>
          ${tableElement.outerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // Import Functions
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImportFile(file);
    }
  };

  const importProducts = async () => {
    if (!importFile) {
      alert('Please select a file to import');
      return;
    }

    setImportLoading(true);
    try {
      const fileExtension = importFile.name.split('.').pop()?.toLowerCase();
      
      if (fileExtension === 'csv') {
        await importFromCSV(importFile);
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        await importFromExcel(importFile);
      } else {
        alert('Unsupported file format. Please use CSV or Excel files.');
        return;
      }
      
      // Refresh the products list
      refetch();
      setImportFile(null);
      setShowImportMenu(false);
      alert('Products imported successfully!');
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import products. Please check the file format and try again.');
    } finally {
      setImportLoading(false);
    }
  };

  const importFromCSV = async (file: File) => {
    const text = await file.text();
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    const products = [];
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        if (values.length >= headers.length) {
          const product = {
            name: values[0] || '',
            brand: values[1] || '',
            category: values[2] || '',
            price: parseFloat(values[3]) || 0,
            originalPrice: values[4] ? parseFloat(values[4]) : null,
            stock: parseInt(values[5]) || 0,
            status: (values[6] === 'inactive' ? 'inactive' : 'active') as 'active' | 'inactive',
            rating: parseFloat(values[7]) || 0,
            reviews: parseInt(values[8]) || 0,
            image: values[9] || '/api/placeholder/300/300',
            isBestSeller: values[10] === 'true',
            isOnSale: values[11] === 'true',
            description: values[12] || ''
          };
          products.push(product);
        }
      }
    }
    
    // Create products via API
    for (const product of products) {
      await create(product);
    }
  };

  const importFromExcel = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    const products = jsonData.map((row: Record<string, unknown>) => ({
      name: row.name || row.Name || '',
      brand: row.brand || row.Brand || '',
      category: row.category || row.Category || '',
      price: parseFloat(row.price || row.Price) || 0,
      originalPrice: row.originalPrice || row['Original Price'] ? parseFloat(row.originalPrice || row['Original Price']) : null,
      stock: parseInt(row.stock || row.Stock) || 0,
      status: (row.status === 'inactive' || row.Status === 'inactive' ? 'inactive' : 'active') as 'active' | 'inactive',
      rating: parseFloat(row.rating || row.Rating) || 0,
      reviews: parseInt(row.reviews || row.Reviews) || 0,
      image: row.image || row.Image || '/api/placeholder/300/300',
      isBestSeller: row.isBestSeller || row['Best Seller'] === 'true' || row['Best Seller'] === true,
      isOnSale: row.isOnSale || row['On Sale'] === 'true' || row['On Sale'] === true,
      description: row.description || row.Description || ''
    }));
    
    // Create products via API
    for (const product of products) {
      await create(product);
    }
  };

  const getStockColor = (stock: number) => {
    if (stock === 0) return 'text-red-600';
    if (stock < 10) return 'text-yellow-600';
    return 'text-green-600';
  };

  const toggleColumn = (column: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const resetColumns = () => {
    setVisibleColumns({
      id: true,
      image: true,
      name: true,
      category: true,
      brand: true,
      type: true,
      price: true,
      stock: true,
      status: true,
      rating: true,
      sku: true,
      created: true,
      actions: true
    });
  };

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return 'N/A';
      }
      return dateObj.toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  const formatTime = (date: Date | string) => {
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return 'N/A';
      }
      return dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    } catch {
      return 'N/A';
    }
  };

  // Calculate stats for the header
  const lowStockCount = allProducts && Array.isArray(allProducts) ? allProducts.filter(product => product.stock < 10).length : 0;
  const topRatedCount = allProducts && Array.isArray(allProducts) ? allProducts.filter(product => product.rating >= 4.5).length : 0;

  // Loading and error states are now handled within the table

  // Debug info
  console.log('🔍 Admin Products Debug:', {
    loading,
    productsCount: allProducts.length,
    error,
    hasData: !!productsData,
    dataLength: productsData?.products?.length
  });

  return (
    <div className="space-y-4">
      {/* Single Combined Card */}
      <div className="analytics-card p-0">
        {/* Header */}
        <div className="px-4 pt-4 pb-3 border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Products</h1>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Export Dropdown */}
              <div className="relative export-dropdown">
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="flex items-center"
                  onClick={() => setShowExportMenu(!showExportMenu)}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Button>
                
                {/* Dropdown Menu */}
                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          exportToCSV();
                          setShowExportMenu(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <FileText className="w-4 h-4 mr-3" />
                        Export as CSV
                      </button>
                      <button
                        onClick={() => {
                          exportToExcel();
                          setShowExportMenu(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <FileSpreadsheet className="w-4 h-4 mr-3" />
                        Export as Excel
                      </button>
                      <button
                        onClick={() => {
                          exportToPDF();
                          setShowExportMenu(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <File className="w-4 h-4 mr-3" />
                        Export as PDF
                      </button>
                      <button
                        onClick={() => {
                          printProducts();
                          setShowExportMenu(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Printer className="w-4 h-4 mr-3" />
                        Print Products
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Import Dropdown */}
              <div className="relative import-dropdown">
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="flex items-center"
                  onClick={() => setShowImportMenu(!showImportMenu)}
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Import
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Button>
                
                {/* Import Dropdown Menu */}
                {showImportMenu && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Import Products</h3>
                      
                      {/* File Upload */}
                      <div className="mb-4">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Select File (CSV or Excel)
                        </label>
                        <input
                          type="file"
                          accept=".csv,.xlsx,.xls"
                          onChange={handleFileSelect}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                        />
                        {importFile && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Selected: {importFile.name}
                          </p>
                        )}
                      </div>
                      
                      {/* File Format Info */}
                      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Expected Format:</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          name, brand, category, price, originalPrice, stock, status, rating, reviews, image, isBestSeller, isOnSale, description
                        </p>
                      </div>
                      
                      {/* Import Actions */}
                      <div className="flex space-x-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={importProducts}
                          disabled={!importFile || importLoading}
                          className="flex-1"
                        >
                          {importLoading ? 'Importing...' : 'Import Products'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setImportFile(null);
                            setShowImportMenu(false);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <Link href="/admin/products/add">
                <Button 
                  variant="primary" 
                  size="sm"
                  className="flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Product
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="px-4 py-3 border-b">
          <div className="flex items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cosmt-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter and Column Controls */}
            <div className="flex items-center space-x-2">
              {/* Filter Button */}
              <div className="relative">
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="flex items-center"
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                >
                  <SlidersHorizontal className="w-4 h-4 mr-1" />
                  Filter
                </Button>
                
                {/* Filter Dropdown Menu */}
                {showFilterMenu && (
                  <div className="filter-dropdown absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Filter Products</h3>
                      
                      {/* Status Filter */}
                      <div className="mb-4">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                        <select
                          value={filters.status}
                          onChange={(e) => setFilters({...filters, status: e.target.value})}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          <option value="all">All Status</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                      
                      {/* Stock Filter */}
                      <div className="mb-4">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Stock</label>
                        <select
                          value={filters.stock}
                          onChange={(e) => setFilters({...filters, stock: e.target.value})}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          <option value="all">All Stock</option>
                          <option value="in-stock">In Stock</option>
                          <option value="low-stock">Low Stock</option>
                          <option value="out-of-stock">Out of Stock</option>
                        </select>
                      </div>
                      
                      {/* Rating Filter */}
                      <div className="mb-4">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</label>
                        <select
                          value={filters.rating}
                          onChange={(e) => setFilters({...filters, rating: e.target.value})}
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          <option value="all">All Ratings</option>
                          <option value="high">High (4.5+)</option>
                          <option value="medium">Medium (3.5-4.4)</option>
                          <option value="low">Low (Below 3.5)</option>
                        </select>
                      </div>
                      
                      {/* Clear Filters */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFilters({status: 'all', stock: 'all', rating: 'all'})}
                        className="w-full"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Column Settings */}
              <div className="relative column-settings-dropdown">
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="flex items-center"
                  onClick={() => setShowColumnSettings(!showColumnSettings)}
                >
                  <Settings className="w-4 h-4" />
                </Button>
                
                {/* Column Settings Dropdown Menu */}
                {showColumnSettings && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Column Settings</h3>
                      
                      {/* Column Toggles */}
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {Object.entries(visibleColumns).map(([column, isVisible]) => (
                          <label key={column} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                              {column === 'created' ? 'Created Date' : column}
                            </span>
                            <input
                              type="checkbox"
                              checked={isVisible}
                              onChange={() => toggleColumn(column as keyof typeof visibleColumns)}
                              className="rounded border-gray-300 text-cosmt-primary focus:ring-cosmt-primary"
                            />
                          </label>
                        ))}
                      </div>
                      
                      {/* Reset Button */}
                      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={resetColumns}
                          className="w-full"
                        >
                          Reset to Default
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Products Table */}
        <div className="overflow-x-auto max-w-full">
          <table id="products-table" className="w-full divide-y table-auto" style={{ minWidth: '800px' }}>
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {visibleColumns.id && (
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-300 uppercase tracking-wider w-12">
                    ID
                  </th>
                )}
                {visibleColumns.image && (
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-300 uppercase tracking-wider w-16">
                    Image
                  </th>
                )}
                {visibleColumns.name && (
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-300 uppercase tracking-wider min-w-[150px] max-w-[200px]">
                    Name
                  </th>
                )}
                {visibleColumns.category && (
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-300 uppercase tracking-wider w-20 hidden lg:table-cell">
                    Category
                  </th>
                )}
                {visibleColumns.brand && (
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-300 uppercase tracking-wider w-20 hidden xl:table-cell">
                    Brand
                  </th>
                )}
                {visibleColumns.type && (
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-300 uppercase tracking-wider w-16 hidden xl:table-cell">
                    Type
                  </th>
                )}
                {visibleColumns.price && (
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-300 uppercase tracking-wider w-20">
                    Price
                  </th>
                )}
                {visibleColumns.stock && (
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-300 uppercase tracking-wider w-16">
                    Stock
                  </th>
                )}
                {visibleColumns.status && (
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-300 uppercase tracking-wider w-16 hidden md:table-cell">
                    Status
                  </th>
                )}
                {visibleColumns.rating && (
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-300 uppercase tracking-wider w-16 hidden lg:table-cell">
                    Rating
                  </th>
                )}
                {visibleColumns.sku && (
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-300 uppercase tracking-wider w-20 hidden xl:table-cell">
                    SKU
                  </th>
                )}
                {visibleColumns.created && (
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-300 uppercase tracking-wider w-20 hidden xl:table-cell">
                    Created
                  </th>
                )}
                {visibleColumns.actions && (
                  <th className="px-2 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-300 uppercase tracking-wider w-20">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y">
              {error ? (
                <tr>
                  <td colSpan={Object.values(visibleColumns).filter(Boolean).length} className="px-6 py-12 text-center">
                    <div className="text-center">
                      <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Error Loading Products</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                      <Button onClick={retry} variant="primary">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try Again
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : loading ? (
                <tr>
                  <td colSpan={Object.values(visibleColumns).filter(Boolean).length} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <span>No products found</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={Object.values(visibleColumns).filter(Boolean).length} className="px-6 py-12 text-center">
                    <div className="text-center">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Products Found</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {searchTerm ? 'No products match your search criteria.' : 'No products have been added yet.'}
                      </p>
                      <div className="flex space-x-2 justify-center">
                        {searchTerm && (
                          <Button onClick={() => setSearchTerm('')} variant="secondary">
                            Clear Search
                          </Button>
                        )}
                        <Link href="/admin/products/add">
                          <Button variant="primary">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Product
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  {/* ID Column */}
                  {visibleColumns.id && (
                    <td className="px-2 py-3 whitespace-nowrap">
                      <div className="text-xs font-medium text-gray-900 dark:text-gray-100">#{product.id}</div>
                    </td>
                  )}
                  
                  {/* Image Column */}
                  {visibleColumns.image && (
                    <td className="px-2 py-3 whitespace-nowrap">
                      <div className="flex-shrink-0 h-8 w-8">
                        <img
                          className="h-8 w-8 rounded object-cover"
                          src={product.image || '/api/placeholder/300/300'}
                          alt={product.name}
                          onError={(e) => {
                            console.log('Image failed to load:', product.image);
                            e.currentTarget.src = '/api/placeholder/300/300';
                          }}
                        />
                      </div>
                    </td>
                  )}
                  
                  {/* Name Column */}
                  {visibleColumns.name && (
                    <td className="px-2 py-3">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{product.name}</div>
                        {product.isBestSeller && (
                          <TrendingUp className="w-3 h-3 text-orange-500 ml-1 flex-shrink-0" />
                        )}
                        {product.isOnSale && (
                          <AlertTriangle className="w-3 h-3 text-red-500 ml-1 flex-shrink-0" />
                        )}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate lg:hidden">
                        {product.categories?.name || product.category || 'Unknown'} • {product.brand}
                      </div>
                    </td>
                  )}
                  
                  {/* Category Column - Hidden on small screens */}
                  {visibleColumns.category && (
                    <td className="px-2 py-3 whitespace-nowrap hidden lg:table-cell">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium status-active">
                        {product.categories?.name || product.category || 'Unknown'}
                      </span>
                    </td>
                  )}
                  
                  {/* Brand Column - Hidden on small/medium screens */}
                  {visibleColumns.brand && (
                    <td className="px-2 py-3 whitespace-nowrap hidden xl:table-cell">
                      <div className="text-xs text-gray-900 dark:text-gray-100 truncate">{product.brand}</div>
                    </td>
                  )}
                  
                  {/* Type Column - Hidden on small/medium screens */}
                  {visibleColumns.type && (
                    <td className="px-2 py-3 whitespace-nowrap hidden xl:table-cell">
                      <div className="text-xs text-gray-500 dark:text-gray-400">{product.type || 'Standard'}</div>
                    </td>
                  )}
                  
                  {/* Price Column */}
                  {visibleColumns.price && (
                    <td className="px-2 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">${product.price.toFixed(2)}</div>
                      {product.originalPrice && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </div>
                      )}
                    </td>
                  )}
                  
                  {/* Stock Column */}
                  {visibleColumns.stock && (
                    <td className="px-2 py-3 whitespace-nowrap">
                      <div className={`text-sm font-medium ${getStockColor(product.stock)}`}>
                        {product.stock}
                      </div>
                      {product.stock < 10 && product.stock > 0 && (
                        <div className="text-xs text-yellow-600">Low</div>
                      )}
                      {product.stock === 0 && (
                        <div className="text-xs text-red-600">Out</div>
                      )}
                    </td>
                  )}
                  
                  {/* Status Column - Hidden on small screens */}
                  {visibleColumns.status && (
                    <td className="px-2 py-3 whitespace-nowrap hidden md:table-cell">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                        {product.status}
                      </span>
                    </td>
                  )}
                  
                  {/* Rating Column - Hidden on small/medium screens */}
                  {visibleColumns.rating && (
                    <td className="px-2 py-3 whitespace-nowrap hidden lg:table-cell">
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="ml-1 text-xs text-gray-900 dark:text-gray-100">{product.rating}</span>
                        <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">({product.reviews})</span>
                      </div>
                    </td>
                  )}
                  
                  {/* SKU Column - Hidden on small/medium screens */}
                  {visibleColumns.sku && (
                    <td className="px-2 py-3 whitespace-nowrap hidden xl:table-cell">
                      <div className="text-xs text-gray-900 dark:text-gray-100 font-mono">
                        {product.sku || `SKU-${product.id.toString().padStart(4, '0')}`}
                      </div>
                    </td>
                  )}
                  
                  {/* Created Column - Hidden on small/medium screens */}
                  {visibleColumns.created && (
                    <td className="px-2 py-3 whitespace-nowrap hidden xl:table-cell">
                      <div className="text-xs text-gray-900 dark:text-gray-100">
                        {formatDate(product.createdAt)}
                    </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTime(product.createdAt)}
                      </div>
                    </td>
                  )}
                  
                  {/* Actions Column */}
                  {visibleColumns.actions && (
                    <td className="px-2 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-1">
                        <button 
                          onClick={() => handleView(product)}
                          className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                          title="View Product"
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => handleEdit(product)}
                          className="text-gray-400 hover:text-green-600 transition-colors p-1"
                          title="Edit Product"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => setShowDeleteModal(product.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-1"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">Items per page:</span>
                <select 
                  value={itemsPerPage} 
                  onChange={(e) => {
                    setItemsPerPage(parseInt(e.target.value));
                    setCurrentPage(1); // Reset to first page when changing items per page
                  }}
                  className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">
                  {allProducts.length > 0 ? ((currentPage - 1) * itemsPerPage + 1) : 0}-{Math.min(currentPage * itemsPerPage, totalProducts)}
                </span> of <span className="font-medium">{totalProducts}</span> products
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>


      {/* View Product Modal */}
      {showViewModal && (
        <div className="modal-overlay" onClick={() => setShowViewModal(null)}>
          <div className="bg-white rounded w-full max-w-lg">
            {/* Header with title and horizontal line */}
            <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: '#eef2f6' }}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Product Details</h3>
                <button onClick={() => setShowViewModal(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6">
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <img
                  src={showViewModal.image || '/api/placeholder/300/300'}
                  alt={showViewModal.name}
                  className="w-20 h-20 rounded object-cover"
                  onError={(e) => {
                    console.log('Image failed to load in modal:', showViewModal.image);
                    e.currentTarget.src = '/api/placeholder/300/300';
                  }}
                />
                <div>
                  <h4 className="text-xl font-semibold">{showViewModal.name}</h4>
                  <p className="text-gray-600 dark:text-gray-400">{showViewModal.brand}</p>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm">{showViewModal.rating} ({showViewModal.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{showViewModal.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">${showViewModal.price.toFixed(2)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stock</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{showViewModal.stock} units</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(showViewModal.status)}`}>
                    {showViewModal.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button variant="secondary" onClick={() => setShowViewModal(null)}>
                Close
              </Button>
            </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(null)}>
          <div className="bg-white rounded w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            {/* Header with title and horizontal line */}
            <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: '#eef2f6' }}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-red-600">Delete Product</h3>
                <button onClick={() => setShowDeleteModal(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6">
            
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => setShowDeleteModal(null)}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={() => handleDelete(showDeleteModal)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Product
              </Button>
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
