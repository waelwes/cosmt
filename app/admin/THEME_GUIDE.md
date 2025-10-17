# Admin Dashboard Theme System

## Overview
The admin dashboard now has a comprehensive theme system that provides consistent design across all pages with support for light, dark, and auto themes.

## Theme Features

### 1. Theme Options
- **Light Theme**: Clean, bright interface with light backgrounds
- **Dark Theme**: Dark interface with dark backgrounds and light text
- **Auto Theme**: Automatically switches based on system preference

### 2. Default Design Elements
- **Primary Color**: #059669 (Green)
- **Border Radius**: 0.25rem (4px) for all elements
- **Border Color**: #eef2f6 (Light gray)
- **Typography**: Inter font family
- **Consistent Spacing**: Standardized padding and margins

## Text Theme Classes

### Color Classes
```css
.text-theme-primary     /* Main text color */
.text-theme-secondary   /* Secondary text color */
.text-theme-muted       /* Muted/subtle text color */
.text-theme-accent      /* Accent color (primary green) */
.text-theme-white       /* White text */
.text-theme-black       /* Black text */
```

### Typography Scale
```css
.text-display          /* 3rem, bold, for large displays */
.text-heading-1        /* 2.25rem, semibold, main headings */
.text-heading-2        /* 1.875rem, semibold, section headings */
.text-heading-3        /* 1.5rem, semibold, subsection headings */
.text-heading-4        /* 1.25rem, semibold, card headings */
.text-body-large       /* 1.125rem, regular, large body text */
.text-body             /* 1rem, regular, standard body text */
.text-body-small       /* 0.875rem, regular, small body text */
.text-caption          /* 0.75rem, regular, captions */
.text-label            /* 0.875rem, medium, form labels */
.text-button           /* 0.875rem, medium, button text */
```

## Usage Examples

### Basic Text Styling
```jsx
<h1 className="text-heading-1">Dashboard</h1>
<p className="text-body">This is regular body text</p>
<span className="text-caption">Small caption text</span>
```

### Color Variations
```jsx
<div className="text-theme-primary">Primary text</div>
<div className="text-theme-secondary">Secondary text</div>
<div className="text-theme-muted">Muted text</div>
<div className="text-theme-accent">Accent text</div>
```

### Card Styling
```jsx
<div className="analytics-card">
  <h3 className="text-heading-4">Card Title</h3>
  <p className="text-body-small">Card description</p>
</div>
```

## Theme Toggle
The theme can be changed using the theme toggle in the admin header, which provides:
- Light mode
- Dark mode  
- Auto mode (follows system preference)

## CSS Variables
The theme system uses CSS custom properties that automatically adjust based on the selected theme:

```css
--admin-primary: #059669;
--admin-primary-dark: #047857;
--admin-primary-light: #d1fae5;
--admin-secondary: #6b7280;
--admin-background: #f8fafc;
--admin-surface: #ffffff;
--admin-text-primary: #111827;
--admin-text-secondary: #374151;
--admin-text-muted: #6b7280;
--admin-border: #eef2f6;
--admin-accent: #f3f4f6;
```

## Best Practices

1. **Use semantic text classes** instead of hardcoded colors
2. **Prefer theme classes** over custom styling
3. **Test in both light and dark modes**
4. **Use the typography scale** for consistent text sizing
5. **Leverage CSS variables** for custom components

## Implementation
The theme system is automatically applied to all admin pages through:
- `ThemeProvider` context
- `theme.css` stylesheet
- CSS custom properties
- Automatic dark mode detection
