# Admin Dashboard Theme Style Guide

## Overview
This guide defines the consistent theme style that all admin dashboard pages should follow. The theme provides a clean, professional, and modern look with consistent spacing, colors, and layout patterns.

## Card Structure

### Main Card Container
All admin pages should use the `analytics-card` class for their main content containers:

```tsx
<div className="analytics-card p-0">
  {/* Card Header */}
  <div className="px-6 pt-6 pb-4 border-b">
    <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Page Title</h1>
  </div>
  
  {/* Card Content */}
  <div className="px-6 py-6">
    {/* Page content goes here */}
  </div>
</div>
```

### Card Header
- **Padding**: `px-6 pt-6 pb-4`
- **Border**: `border-b` (horizontal line only, no vertical lines)
- **Title**: `text-lg font-semibold text-gray-900 dark:text-white`

### Card Content
- **Padding**: `px-6 py-6`
- **Background**: White (`#ffffff`)
- **Border Radius**: `0.25rem` (4px)

## Color Scheme

### Primary Colors
- **Primary Green**: `#059669` (cosmt-primary)
- **Primary Dark**: `#047857` (cosmt-primary-dark)
- **Primary Light**: `#d1fae5` (cosmt-primary-light)

### Text Colors
- **Primary Text**: `#111827` (text-gray-900)
- **Secondary Text**: `#374151` (text-gray-600)
- **Muted Text**: `#6b7280` (text-gray-500)

### Border Colors
- **Default Border**: `#eef2f6` (border-gray-200)
- **No Vertical Lines**: All vertical borders should be removed

## Layout Patterns

### Page Structure
```tsx
<div className="space-y-6">
  {/* Main Content Card */}
  <div className="analytics-card p-0">
    {/* Header and Content */}
  </div>
  
  {/* Additional Cards */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div className="analytics-card p-0">
      {/* Card content */}
    </div>
  </div>
</div>
```

### Stats Grid
```tsx
<div className="flex flex-row">
  {stats.map((stat, index) => (
    <div key={index} className="flex-1 py-4 px-4">
      {/* No vertical borders between stats */}
    </div>
  ))}
</div>
```

### Form Elements
```tsx
<input 
  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:border-cosmt-primary focus:ring-0"
  // All inputs should have white background and consistent styling
/>
```

## Typography

### Headings
- **H1**: `text-lg font-semibold text-gray-900 dark:text-white`
- **H2**: `text-base font-semibold text-gray-900 dark:text-white`
- **H3**: `text-sm font-semibold text-gray-600 dark:text-gray-300`

### Body Text
- **Primary**: `text-sm text-gray-900 dark:text-white`
- **Secondary**: `text-xs text-gray-500 dark:text-gray-400`

## Spacing

### Card Spacing
- **Between Cards**: `space-y-6` (24px)
- **Card Internal**: `px-6 py-6` (24px horizontal, 24px vertical)
- **Header Padding**: `px-6 pt-6 pb-4` (24px horizontal, 24px top, 16px bottom)

### Grid Spacing
- **Grid Gap**: `gap-6` (24px)
- **Flex Gap**: `space-x-2` or `space-x-4` (8px or 16px)

## Interactive Elements

### Buttons
```tsx
<button className="px-4 py-2 bg-cosmt-primary text-white rounded-md hover:bg-cosmt-primary-dark transition-colors">
  Button Text
</button>
```

### Links
```tsx
<a className="text-cosmt-primary hover:text-cosmt-primary-dark transition-colors">
  Link Text
</a>
```

## RTL Support

### Direction Classes
```tsx
<div className={`flex ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
  {/* Content */}
</div>
```

### Text Alignment
```tsx
<h1 className={`text-lg font-semibold ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
  Title
</h1>
```

## Dark Mode Support

All elements should support dark mode with appropriate classes:
- `dark:text-white` for primary text
- `dark:text-gray-300` for secondary text
- `dark:bg-gray-800` for dark backgrounds

## Table Styles

### Standard Data Table
All admin tables should follow this consistent structure and styling:

```tsx
<div className="analytics-card p-0">
  {/* Table Header */}
  <div className="px-6 pt-6 pb-4 border-b">
    <div className="flex items-center justify-between">
      <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
        Table Title
      </h1>
      
      {/* Action Buttons */}
      <div className="flex items-center space-x-3">
        {/* Export Dropdown */}
        <div className="relative export-dropdown">
          <Button variant="secondary" className="flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Button>
        </div>
        
        {/* Import Dropdown */}
        <div className="relative import-dropdown">
          <Button variant="secondary" className="flex items-center">
            <Upload className="w-4 h-4 mr-2" />
            Import
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Button>
        </div>
        
        {/* Add Button */}
        <Button variant="primary" className="flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </Button>
      </div>
    </div>
  </div>

  {/* Search and Filters */}
  <div className="px-6 py-4 border-b">
    <div className="flex items-center justify-between">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cosmt-primary focus:border-transparent"
          />
        </div>
      </div>
      
      {/* Filter Controls */}
      <div className="flex items-center space-x-3">
        <Button variant="secondary" className="flex items-center">
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filter
        </Button>
        <Button variant="secondary" className="flex items-center">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  </div>

  {/* Table */}
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead className="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            ID
          </th>
          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Name
          </th>
          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Category
          </th>
          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Price
          </th>
          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Stock
          </th>
          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Status
          </th>
          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {data.map((item) => (
          <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              #{item.id}
            </td>
            <td className="px-3 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-8 w-8">
                  <img className="h-8 w-8 rounded-full" src={item.image} alt={item.name} />
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {item.brand}
                  </div>
                </div>
              </div>
            </td>
            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {item.category}
            </td>
            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              ${item.price.toFixed(2)}
            </td>
            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {item.stock}
            </td>
            <td className="px-3 py-4 whitespace-nowrap">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                item.status === 'active' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {item.status}
              </span>
            </td>
            <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
              <div className="flex items-center space-x-2">
                <button className="text-cosmt-primary hover:text-cosmt-primary-dark">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="text-cosmt-primary hover:text-cosmt-primary-dark">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-900">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Pagination */}
  <div className="px-6 py-4 border-t">
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-700 dark:text-gray-300">
        Showing 1 to 10 of 100 results
      </div>
      <div className="flex items-center space-x-2">
        <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
          Previous
        </button>
        <button className="px-3 py-1 text-sm bg-cosmt-primary text-white rounded-md">
          1
        </button>
        <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
          2
        </button>
        <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
          Next
        </button>
      </div>
    </div>
  </div>
</div>
```

### Table Styling Guidelines

#### Table Container
- **Wrapper**: `analytics-card p-0` for main container
- **Overflow**: `overflow-x-auto` for horizontal scrolling on mobile
- **Table**: `min-w-full divide-y divide-gray-200 dark:divide-gray-700`

#### Table Header
- **Background**: `bg-gray-50 dark:bg-gray-800`
- **Text**: `text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider`
- **Padding**: `px-3 py-3`

#### Table Body
- **Background**: `bg-white dark:bg-gray-800`
- **Hover**: `hover:bg-gray-50 dark:hover:bg-gray-700`
- **Padding**: `px-3 py-4`
- **Text**: `text-sm text-gray-900 dark:text-white`

#### Status Badges
```tsx
<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
  status === 'active' 
    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
}`}>
  {status}
</span>
```

#### Action Buttons
```tsx
<div className="flex items-center space-x-2">
  <button className="text-cosmt-primary hover:text-cosmt-primary-dark">
    <Eye className="w-4 h-4" />
  </button>
  <button className="text-cosmt-primary hover:text-cosmt-primary-dark">
    <Edit className="w-4 h-4" />
  </button>
  <button className="text-red-600 hover:text-red-900">
    <Trash2 className="w-4 h-4" />
  </button>
</div>
```

### Responsive Table Design

#### Mobile Responsiveness
- Use `overflow-x-auto` for horizontal scrolling
- Hide less important columns on smaller screens with `hidden lg:table-cell`
- Stack information vertically in cells when needed

#### Column Visibility
```tsx
// Hide on mobile, show on large screens
<th className="hidden lg:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
  Category
</th>

// Show on mobile with different layout
<td className="px-3 py-4 whitespace-nowrap lg:hidden">
  <div className="text-sm text-gray-900 dark:text-white">
    {item.name}
  </div>
  <div className="text-xs text-gray-500 dark:text-gray-400">
    {item.category} • {item.brand}
  </div>
</td>
```

## Prohibited Elements

### ❌ Do NOT Use
- Vertical lines (`border-r`, `border-l`)
- Rounded corners larger than `0.25rem` (except for specific UI elements)
- Gray backgrounds for cards (use white `#ffffff`)
- Shadows on cards (use `box-shadow: none`)

### ✅ Do Use
- Horizontal lines only (`border-b`)
- Consistent `0.25rem` border radius
- White card backgrounds
- Clean, minimal design

## Example Implementation

```tsx
export default function ExamplePage() {
  return (
    <div className="space-y-6">
      {/* Main Page Card */}
      <div className="analytics-card p-0">
        <div className="px-6 pt-6 pb-4 border-b">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            Page Title
          </h1>
        </div>
        
        <div className="px-6 py-6">
          {/* Page content */}
          <div className="space-y-4">
            <p className="text-sm text-gray-900 dark:text-white">
              Content goes here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## CSS Classes Reference

### Card Classes
- `analytics-card` - Main card container
- `dashboard-card` - Dashboard-specific cards (8px border radius)

### Layout Classes
- `space-y-6` - Vertical spacing between cards
- `px-6 py-6` - Card content padding
- `px-6 pt-6 pb-4` - Card header padding

### Text Classes
- `text-lg font-semibold` - Main headings
- `text-sm font-semibold` - Sub headings
- `text-sm` - Body text
- `text-xs` - Small text

### Color Classes
- `text-gray-900 dark:text-white` - Primary text
- `text-gray-600 dark:text-gray-300` - Secondary text
- `text-gray-500 dark:text-gray-400` - Muted text
- `text-cosmt-primary` - Brand color text

This style guide ensures consistency across all admin dashboard pages and provides a professional, clean appearance.
