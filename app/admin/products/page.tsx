'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { ApiConnectionTest } from '@/components/debug/ApiConnectionTest';
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
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [lastKnownTotalPages, setLastKnownTotalPages] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    image: true,
    name: true,
    category: true,
    brand: true,
    type: false,
    price: true,
    stock: true,
    status: true,
    rating: false,
    sku: false,
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
  
  // Update last known total pages when we successfully get data
  useEffect(() => {
    if (productsData?.totalPages && productsData.totalPages > 0) {
      setLastKnownTotalPages(productsData.totalPages);
    }
  }, [productsData?.totalPages]);
  
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


  // Bulk delete function
  const handleBulkDelete = async () => {
    if (selectedProducts.size === 0) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedProducts.size} product${selectedProducts.size !== 1 ? 's' : ''}? This action cannot be undone.`
    );
    
    if (confirmed) {
      try {
        const productsToDelete = Array.from(selectedProducts);
        const deletePromises = productsToDelete.map(id => 
          fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
        );
        
        await Promise.all(deletePromises);
        
        // Clear selection and reset to page 1 to avoid 404 errors
        setSelectedProducts(new Set());
        setShowBulkActions(false);
        setCurrentPage(1);
        
        // The page change will trigger a refetch automatically via useProducts
        alert(`Successfully deleted ${productsToDelete.length} product${productsToDelete.length !== 1 ? 's' : ''}.`);
      } catch (error) {
        console.error('Bulk delete failed:', error);
        alert('Failed to delete some products. Please try again.');
      }
    }
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedStatus, sortBy, sortOrder]);

  // Ensure current page doesn't exceed total pages
  useEffect(() => {
    if (productsData?.totalPages && currentPage > productsData.totalPages) {
      console.log(`⚠️ Current page ${currentPage} exceeds total pages ${productsData.totalPages}, redirecting to page ${productsData.totalPages}`);
      setCurrentPage(productsData.totalPages);
    }
  }, [productsData?.totalPages, currentPage]);

  // Handle 404 errors by resetting to valid page
  useEffect(() => {
    if (error && error.includes('404')) {
      console.log('🔄 404 error detected, resetting to valid page');
      // Use last known total pages to redirect to a valid page
      const lastPage = Math.max(1, lastKnownTotalPages);
      console.log(`📄 Redirecting to page ${lastPage} (last known: ${lastKnownTotalPages})`);
      setCurrentPage(lastPage);
    }
  }, [error, lastKnownTotalPages]);

  // Prevent navigation to invalid pages
  const handlePageChange = (newPage: number) => {
    console.log(`🔄 Page change requested: ${currentPage} → ${newPage}`);
    console.log(`📊 Total pages available: ${productsData?.totalPages || 'unknown'}`);
    
    // Ensure newPage is within valid bounds
    if (newPage < 1) {
      console.log(`⚠️ Attempted to navigate to page ${newPage}, setting to page 1`);
      setCurrentPage(1);
      return;
    }
    
    // If we know the total pages, ensure we don't go beyond it
    if (productsData?.totalPages) {
      if (newPage > productsData.totalPages) {
        console.log(`⚠️ Attempted to navigate to page ${newPage}, but only ${productsData.totalPages} pages exist`);
        setCurrentPage(productsData.totalPages);
        return;
      }
    }
    
    console.log(`✅ Valid page navigation to page ${newPage}`);
    setCurrentPage(newPage);
  };

  const { create, update, remove, loading: crudLoading } = useCrudOperations<Product>(
    '/api/admin/products',
    () => {
      // Close modal and clear selection
      setShowDeleteModal(null);
      setSelectedProducts(new Set());
      setShowBulkActions(false);
      
      // Reset to page 1 to avoid 404 errors after deletion
      setCurrentPage(1);
      
      // The page change will trigger a refetch automatically via useProducts
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

  // Selection functions
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(filteredProducts.map(p => p.id));
      setSelectedProducts(allIds);
      setShowBulkActions(true);
    } else {
      setSelectedProducts(new Set());
      setShowBulkActions(false);
    }
  };

  const handleSelectProduct = (productId: number, checked: boolean) => {
    const newSelected = new Set(selectedProducts);
    if (checked) {
      newSelected.add(productId);
    } else {
      newSelected.delete(productId);
    }
    setSelectedProducts(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const isAllSelected = filteredProducts.length > 0 && selectedProducts.size === filteredProducts.length;
  const isIndeterminate = selectedProducts.size > 0 && selectedProducts.size < filteredProducts.length;

  // Debug logging for selection state
  console.log('🔍 Selection Debug:', {
    selectedProducts: Array.from(selectedProducts),
    selectedCount: selectedProducts.size,
    totalProducts: filteredProducts.length,
    isAllSelected,
    isIndeterminate,
    showBulkActions,
    currentPage,
    totalPages: productsData?.totalPages
  });

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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to import products: ${errorMessage}`);
    } finally {
      setImportLoading(false);
    }
  };

  const importFromCSV = async (file: File) => {
    const text = await file.text();
    console.log('Raw CSV content:', text.substring(0, 500)); // Show first 500 chars
    
    // Handle different line endings and remove empty lines
    const lines = text.split(/\r?\n/).filter(line => line.trim());
    console.log('Total lines after filtering:', lines.length);
    console.log('All lines:', lines);
    
    if (lines.length < 2) {
      throw new Error('CSV file must have at least a header row and one data row. Please check your file format.');
    }
    
    // Detect delimiter (comma, semicolon, or tab)
    const firstLine = lines[0];
    let delimiter = ',';
    if (firstLine.includes(';') && !firstLine.includes(',')) {
      delimiter = ';';
    } else if (firstLine.includes('\t')) {
      delimiter = '\t';
    }
    console.log('Detected delimiter:', delimiter);
    
    const headers = firstLine.split(delimiter).map(h => h.trim().replace(/"/g, ''));
    console.log('CSV Headers:', headers);
    console.log('Expected format: ID, Image, Name, Category, Brand, Type, Price, Stock, Status, Rating, SKU, Created');
    
    // Validate headers
    const requiredHeaders = ['name', 'brand', 'price'];
    const missingHeaders = requiredHeaders.filter(h => !headers.some(header => header.toLowerCase() === h));
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required headers: ${missingHeaders.join(', ')}. Please ensure your CSV has columns for Name, Brand, and Price.`);
    }
    
    const products = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      console.log(`Processing line ${i + 1}: "${line}"`);
      
      if (line) {
        // Parse CSV line properly handling quoted fields
        const values = parseCSVLine(line, delimiter);
        console.log(`Row ${i + 1} values:`, values);
        console.log(`Row ${i + 1} values length:`, values.length);
        
        if (values.length >= 7) { // At least ID, Image, Name, Category, Brand, Type, Price
          const product = {
            name: (values[2] || '').trim(), // Name column
            brand: (values[4] || '').trim(), // Brand column
            price: parseFloat(values[6]) || 0, // Price column
            originalPrice: null, // Not in your CSV
            stock: parseInt(values[7]) || 0, // Stock column
            status: (values[8] === 'inactive' || values[8] === 'out_of_stock' ? 'inactive' : 'active') as 'active' | 'inactive',
            rating: parseFloat(values[9]) || 0, // Rating column
            reviews: 0, // Not in your CSV, default to 0
            image: (values[1] || '/api/placeholder/300/300').trim(), // Image column
            isBestSeller: false, // Not in your CSV, default to false
            isOnSale: false, // Not in your CSV, default to false
            description: `${values[3]} - ${values[5]}` // Category - Type as description
          };
          
          console.log('Parsed product:', product);
          
          // Validate required fields
          if (!product.name || !product.brand || product.price <= 0) {
            console.error('Invalid product data:', product);
            console.error('Values that caused the issue:', {
              name: values[0],
              brand: values[1], 
              price: values[2],
              parsedPrice: parseFloat(values[2]),
              allValues: values
            });
            throw new Error(`Invalid product data in row ${i + 1}: Missing required fields (name, brand, price). 
            
Debug info:
- Name: "${values[0]}" (${typeof values[0]})
- Brand: "${values[1]}" (${typeof values[1]})
- Price: "${values[2]}" (${typeof values[2]})
- Parsed Price: ${parseFloat(values[2])}

Please check that your CSV format matches the expected format:
name,brand,price,originalPrice,stock,status,rating,reviews,image,isBestSeller,isOnSale,description`);
          }
          
          products.push(product);
        } else {
          console.warn(`Row ${i + 1} has insufficient columns (${values.length}), skipping`);
        }
      }
    }
    
    console.log(`Parsed ${products.length} products from CSV`);
    
    if (products.length === 0) {
      throw new Error('No valid products found in CSV file. Please check the file format and ensure it has data rows.');
    }
    
    // Create products via API
    for (const product of products) {
      try {
      await create(product);
      } catch (error) {
        console.error('Failed to create product:', product, error);
        throw new Error(`Failed to create product "${product.name}": ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  // Helper function to parse CSV line properly handling quoted fields
  const parseCSVLine = (line: string, delimiter: string): string[] => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };

  const importFromExcel = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    console.log('Excel data sample:', jsonData.slice(0, 2));
    console.log('Expected columns: name, brand, price, originalPrice, stock, status, rating, reviews, image, isBestSeller, isOnSale, description');
    
    const products = jsonData.map((row: Record<string, unknown>, index: number) => {
      const product = {
        name: String(row.name || row.Name || '').trim(),
        brand: String(row.brand || row.Brand || '').trim(),
        price: parseFloat(String(row.price || row.Price)) || 0,
        originalPrice: row.originalPrice || row['Original Price'] ? parseFloat(String(row.originalPrice || row['Original Price'])) : null,
        stock: parseInt(String(row.stock || row.Stock)) || 0,
      status: (row.status === 'inactive' || row.Status === 'inactive' ? 'inactive' : 'active') as 'active' | 'inactive',
        rating: parseFloat(String(row.rating || row.Rating)) || 0,
        reviews: parseInt(String(row.reviews || row.Reviews)) || 0,
        image: String(row.image || row.Image || '/api/placeholder/300/300').trim(),
        isBestSeller: row.isBestSeller === true || row['Best Seller'] === 'true' || row['Best Seller'] === true,
        isOnSale: row.isOnSale === true || row['On Sale'] === 'true' || row['On Sale'] === true,
        description: String(row.description || row.Description || '').trim()
      };
      
      console.log(`Row ${index + 1} parsed product:`, product);
      
      // Validate required fields
      if (!product.name || !product.brand || product.price <= 0) {
        console.error('Invalid product data:', product);
        throw new Error(`Invalid product data in row ${index + 1}: Missing required fields (name, brand, price)`);
      }
      
      return product;
    });
    
    console.log(`Parsed ${products.length} products from Excel`);
    
    // Create products via API
    for (const product of products) {
      try {
      await create(product);
      } catch (error) {
        console.error('Failed to create product:', product, error);
        throw new Error(`Failed to create product "${product.name}": ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
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
      type: false,
      price: true,
      stock: true,
      status: true,
      rating: false,
      sku: false,
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

      
      {/* API Connection Test - Remove this after debugging */}
      <ApiConnectionTest />
      
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

        {/* Bulk Actions Bar - Shopify Style */}
        {showBulkActions && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 mb-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {selectedProducts.size} product{selectedProducts.size !== 1 ? 's' : ''} selected
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSelectedProducts(new Set());
                    setShowBulkActions(false);
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline"
                >
                  Clear selection
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    // TODO: Implement bulk edit
                    alert('Bulk edit feature coming soon!');
                  }}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit Selected
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="overflow-x-auto max-w-full">
          <table id="products-table" className="w-full divide-y table-fixed" style={{ minWidth: '1000px' }}>
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-3 py-4 text-left w-8">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = isIndeterminate;
                    }}
                    onChange={(e) => {
                      console.log('Select all clicked:', e.target.checked);
                      handleSelectAll(e.target.checked);
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                  />
                </th>
                {visibleColumns.id && (
                  <th className="px-3 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-300 uppercase tracking-wider w-16">
                    ID
                  </th>
                )}
                {visibleColumns.image && (
                  <th className="px-3 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-300 uppercase tracking-wider w-20">
                    Image
                  </th>
                )}
                {visibleColumns.name && (
                  <th className="px-3 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-300 uppercase tracking-wider w-64">
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
                  <th className="px-3 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-300 uppercase tracking-wider w-24">
                    Price
                  </th>
                )}
                {visibleColumns.stock && (
                  <th className="px-3 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-300 uppercase tracking-wider w-20">
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
                  <th className="px-3 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-300 uppercase tracking-wider w-24">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y">
              {error ? (
                <tr>
                  <td colSpan={Object.values(visibleColumns).filter(Boolean).length + 1} className="px-6 py-12 text-center">
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
                  <td colSpan={Object.values(visibleColumns).filter(Boolean).length + 1} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <span>No products found</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={Object.values(visibleColumns).filter(Boolean).length + 1} className="px-6 py-12 text-center">
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
                filteredProducts.map((product, index) => {
                  // Calculate the row number based on current page and position
                  const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
                  
                  return (
                <tr 
                  key={product.id} 
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-600 cursor-pointer ${
                    selectedProducts.has(product.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onClick={(e) => {
                    // Don't trigger if clicking on checkbox or action buttons
                    if (e.target instanceof HTMLInputElement || e.target.closest('button')) return;
                    handleSelectProduct(product.id, !selectedProducts.has(product.id));
                  }}
                >
                  {/* Selection Column */}
                  <td className="px-3 py-4 whitespace-nowrap w-8">
                    <input
                      type="checkbox"
                      checked={selectedProducts.has(product.id)}
                      onChange={(e) => {
                        e.stopPropagation(); // Prevent row click
                        console.log('Product checkbox clicked:', product.id, e.target.checked);
                        handleSelectProduct(product.id, e.target.checked);
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                    />
                  </td>
                  {/* ID Column */}
                  {visibleColumns.id && (
                    <td className="px-3 py-4 whitespace-nowrap w-16">
                      <div className="text-xs font-medium text-gray-900 dark:text-gray-100">#{rowNumber}</div>
                    </td>
                  )}
                  
                  {/* Image Column */}
                  {visibleColumns.image && (
                    <td className="px-3 py-4 whitespace-nowrap w-20">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded object-cover"
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
                    <td className="px-3 py-4 w-64">
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
                    <td className="px-3 py-4 whitespace-nowrap w-24">
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
                    <td className="px-3 py-4 whitespace-nowrap w-20">
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
                    <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium w-24">
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
                );
                })
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
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                // Only show page numbers that actually exist
                if (pageNum > totalPages) return null;
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
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
