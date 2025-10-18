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
