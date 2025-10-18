'use client';

import { useRTL } from '../contexts/UnifiedLanguageContext';

export function useRTLUtils() {
  const { isRTL, isArabic, language, direction } = useRTL();

  // RTL-aware class utilities
  const getRTLClasses = (ltrClasses: string, rtlClasses: string) => {
    return isRTL ? rtlClasses : ltrClasses;
  };

  // RTL-aware flex direction
  const getFlexDirection = (baseDirection: 'row' | 'col' = 'row') => {
    if (baseDirection === 'row') {
      return isRTL ? 'flex-row-reverse' : 'flex-row';
    }
    return isRTL ? 'flex-col-reverse' : 'flex-col';
  };

  // RTL-aware spacing
  const getSpacing = (ltrSpacing: string, rtlSpacing?: string) => {
    if (rtlSpacing) {
      return isRTL ? rtlSpacing : ltrSpacing;
    }
    return isRTL ? ltrSpacing.replace('space-x-', 'space-x-reverse space-x-') : ltrSpacing;
  };

  // RTL-aware margin/padding
  const getMargin = (ltrMargin: string) => {
    if (isRTL) {
      return ltrMargin
        .replace(/ml-/g, 'ms-')
        .replace(/mr-/g, 'me-')
        .replace(/pl-/g, 'ps-')
        .replace(/pr-/g, 'pe-');
    }
    return ltrMargin;
  };

  // RTL-aware text alignment
  const getTextAlign = (ltrAlign: 'left' | 'right' | 'center' = 'left') => {
    if (ltrAlign === 'left') return isRTL ? 'text-right' : 'text-left';
    if (ltrAlign === 'right') return isRTL ? 'text-left' : 'text-right';
    return 'text-center';
  };

  // RTL-aware justify content
  const getJustifyContent = (ltrJustify: 'start' | 'end' | 'center' = 'start') => {
    if (ltrJustify === 'start') return isRTL ? 'justify-end' : 'justify-start';
    if (ltrJustify === 'end') return isRTL ? 'justify-start' : 'justify-end';
    return 'justify-center';
  };

  // RTL-aware border
  const getBorder = (ltrBorder: string) => {
    if (isRTL) {
      return ltrBorder
        .replace(/border-l-/g, 'border-s-')
        .replace(/border-r-/g, 'border-e-');
    }
    return ltrBorder;
  };

  // RTL-aware positioning
  const getPosition = (ltrPosition: 'left' | 'right') => {
    return isRTL 
      ? (ltrPosition === 'left' ? 'right-0' : 'left-0')
      : (ltrPosition === 'left' ? 'left-0' : 'right-0');
  };

  // RTL-aware transform
  const getTransform = (ltrTransform: string) => {
    if (isRTL) {
      return ltrTransform
        .replace(/translate-x-/g, 'translate-x-')
        .replace(/-translate-x-/g, 'translate-x-')
        .replace(/translate-x-full/g, 'translate-x-full')
        .replace(/-translate-x-full/g, 'translate-x-full');
    }
    return ltrTransform;
  };

  // RTL-aware icon rotation
  const getIconRotation = (baseRotation: number = 0) => {
    return isRTL ? baseRotation + 180 : baseRotation;
  };

  // RTL-aware arrow direction
  const getArrowDirection = (ltrDirection: 'left' | 'right' | 'up' | 'down') => {
    if (isRTL) {
      if (ltrDirection === 'left') return 'right';
      if (ltrDirection === 'right') return 'left';
    }
    return ltrDirection;
  };

  // RTL-aware chevron direction
  const getChevronDirection = (ltrDirection: 'left' | 'right') => {
    return isRTL 
      ? (ltrDirection === 'left' ? 'right' : 'left')
      : ltrDirection;
  };

  // RTL-aware content direction
  const getContentDirection = () => {
    return {
      dir: direction,
      textAlign: isRTL ? 'right' : 'left',
      flexDirection: isRTL ? 'row-reverse' : 'row'
    };
  };

  // RTL-aware container classes
  const getContainerClasses = (baseClasses: string = '') => {
    const rtlClasses = isRTL ? 'rtl' : 'ltr';
    return `${baseClasses} ${rtlClasses}`.trim();
  };

  // RTL-aware responsive classes
  const getResponsiveClasses = (baseClasses: string) => {
    if (isRTL) {
      return baseClasses
        .replace(/lg:ml-/g, 'lg:me-')
        .replace(/lg:mr-/g, 'lg:ms-')
        .replace(/md:ml-/g, 'md:me-')
        .replace(/md:mr-/g, 'md:ms-')
        .replace(/sm:ml-/g, 'sm:me-')
        .replace(/sm:mr-/g, 'sm:ms-');
    }
    return baseClasses;
  };

  return {
    isRTL,
    isArabic,
    language,
    direction,
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
  };
}
