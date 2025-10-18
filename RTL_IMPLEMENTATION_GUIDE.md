# RTL (Right-to-Left) Implementation Guide

## Overview

This document outlines the comprehensive RTL implementation for the COSMT website, supporting both English (LTR) and Arabic (RTL) layouts.

## Architecture

### 1. RTL Context System

The RTL system is built around a centralized context that manages language and direction state:

```typescript
// contexts/RTLContext.tsx
interface RTLContextType {
  language: Language;        // 'en' | 'ar'
  direction: Direction;      // 'ltr' | 'rtl'
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  isArabic: boolean;
  isEnglish: boolean;
}
```

### 2. Language Switcher Component

A reusable language switcher component that allows users to toggle between English and Arabic:

```typescript
// components/ui/LanguageSwitcher.tsx
<LanguageSwitcher />
```

### 3. RTL Utility Hook

A comprehensive utility hook for RTL-aware styling:

```typescript
// hooks/useRTLUtils.ts
const {
  isRTL,
  isArabic,
  getRTLClasses,
  getFlexDirection,
  getSpacing,
  getMargin,
  getTextAlign,
  getJustifyContent,
  getBorder,
  getPosition,
  getTransform,
  getIconRotation,
  getArrowDirection,
  getChevronDirection,
  getContentDirection,
  getContainerClasses,
  getResponsiveClasses,
} = useRTLUtils();
```

## Implementation Details

### 1. Tailwind Configuration

The RTL system uses the `tailwindcss-rtl` plugin:

```javascript
// tailwind.config.js
module.exports = {
  plugins: [
    require('tailwindcss-rtl'),
  ],
  rtl: {
    enabled: true,
    prefix: 'rtl:',
  },
}
```

### 2. CSS RTL Support

Comprehensive RTL CSS rules are defined in `styles/rtl.css`:

- **Base RTL Styles**: Direction and text alignment
- **Flexbox RTL**: Row reversal and alignment
- **Grid RTL**: Direction-aware grid layouts
- **Spacing RTL**: Margin and padding conversion
- **Border RTL**: Border direction conversion
- **Positioning RTL**: Left/right positioning
- **Transform RTL**: Translation and rotation
- **Form RTL**: Input and textarea alignment
- **Component RTL**: Cards, modals, dropdowns, etc.

### 3. Component Updates

All major components have been updated to support RTL:

#### Header Component
```typescript
// components/layout/Header.tsx
const { isRTL } = useRTL();

<header dir={isRTL ? 'rtl' : 'ltr'}>
  <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
    {/* Content */}
  </div>
</header>
```

#### Footer Component
```typescript
// components/layout/Footer.tsx
const { isRTL, isArabic } = useRTL();

<footer dir={isRTL ? 'rtl' : 'ltr'}>
  <div className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
    <h3>{isArabic ? 'ابقى جميلاً' : 'Stay Beautiful'}</h3>
  </div>
</footer>
```

#### Admin Sidebar
```typescript
// components/admin/AdminSidebar.tsx
const { isRTL } = useRTL();

<div className={`fixed inset-y-0 z-50 w-64 ${
  isRTL 
    ? `right-0 ${isOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0`
    : `left-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`
}`}>
```

### 4. Translation System

The system includes a comprehensive translation system for Arabic content:

```typescript
const getArabicTranslation = (text: string) => {
  const translations: { [key: string]: string } = {
    'Hair Care': 'العناية بالشعر',
    'Skin Care': 'العناية بالبشرة',
    'Makeup': 'مكياج',
    'Fragrance': 'العطور',
    'Body Care': 'العناية بالجسم',
    // ... more translations
  };
  return translations[text] || text;
};
```

## Usage Examples

### 1. Basic RTL Component

```typescript
import { useRTL } from '../contexts/RTLContext';

function MyComponent() {
  const { isRTL, isArabic } = useRTL();
  
  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <h1 className={isRTL ? 'text-right' : 'text-left'}>
        {isArabic ? 'مرحباً' : 'Hello'}
      </h1>
    </div>
  );
}
```

### 2. RTL-Aware Styling

```typescript
import { useRTLUtils } from '../hooks/useRTLUtils';

function MyComponent() {
  const { getRTLClasses, getFlexDirection, getSpacing } = useRTLUtils();
  
  return (
    <div className={getFlexDirection('row')}>
      <div className={getSpacing('space-x-4')}>
        <span>Item 1</span>
        <span>Item 2</span>
      </div>
    </div>
  );
}
```

### 3. RTL Form

```typescript
function RTLForm() {
  const { isRTL, isArabic } = useRTL();
  
  return (
    <form dir={isRTL ? 'rtl' : 'ltr'}>
      <input 
        type="text" 
        placeholder={isArabic ? 'أدخل النص هنا' : 'Enter text here'}
        className={isRTL ? 'text-right' : 'text-left'}
      />
    </form>
  );
}
```

## Best Practices

### 1. Use Logical Properties

Instead of hardcoded directional classes, use logical properties:

```typescript
// ❌ Avoid
className="ml-4 mr-2 pl-3 pr-1"

// ✅ Use
className="ms-4 me-2 ps-3 pe-1"
```

### 2. RTL-Aware Icons

Use the utility functions for icon direction:

```typescript
const { getIconRotation, getArrowDirection } = useRTLUtils();

<ChevronRight 
  className="w-4 h-4" 
  style={{ transform: `rotate(${getIconRotation(0)}deg)` }}
/>
```

### 3. Responsive RTL

Use responsive RTL classes:

```typescript
const { getResponsiveClasses } = useRTLUtils();

<div className={getResponsiveClasses('lg:ml-64 md:ml-32')}>
  {/* Content */}
</div>
```

### 4. RTL-Aware Flexbox

Use the utility function for flex direction:

```typescript
const { getFlexDirection } = useRTLUtils();

<div className={getFlexDirection('row')}>
  {/* Content */}
</div>
```

## Testing

### 1. Manual Testing

1. Switch language using the language switcher
2. Verify all text is translated to Arabic
3. Check that layout flows from right to left
4. Ensure icons and arrows are properly flipped
5. Test forms and inputs for RTL alignment
6. Verify responsive behavior on mobile devices

### 2. Automated Testing

```typescript
// Example test
describe('RTL Support', () => {
  it('should switch to RTL when Arabic is selected', () => {
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByText('العربية'));
    expect(document.documentElement.dir).toBe('rtl');
  });
});
```

## Browser Support

The RTL implementation supports:

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance Considerations

1. **CSS Optimization**: RTL styles are loaded only when needed
2. **Font Loading**: Arabic fonts are loaded asynchronously
3. **Bundle Size**: RTL utilities are tree-shakeable
4. **Hydration**: RTL state is managed client-side to prevent hydration mismatches

## Troubleshooting

### Common Issues

1. **Hydration Mismatch**: Ensure RTL state is managed client-side
2. **Icon Direction**: Use utility functions for icon rotation
3. **Spacing Issues**: Use logical properties instead of directional classes
4. **Form Alignment**: Ensure inputs have proper text alignment

### Debug Tools

```typescript
// Add to component for debugging
const { isRTL, isArabic, language, direction } = useRTL();
console.log({ isRTL, isArabic, language, direction });
```

## Future Enhancements

1. **Additional Languages**: Support for more RTL languages (Hebrew, Persian)
2. **Advanced Typography**: Better Arabic font rendering
3. **RTL Animations**: Direction-aware animations
4. **RTL Charts**: RTL-compatible chart components
5. **RTL Tables**: Advanced RTL table layouts

## Conclusion

The RTL implementation provides a comprehensive solution for Arabic language support while maintaining clean, maintainable code. The system is designed to be scalable and easily extensible for future language additions.
