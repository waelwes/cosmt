'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark' | 'auto';
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  isDark: boolean;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    border: string;
    accent: string;
  };
}

const lightTheme = {
  primary: '#059669', // cosmt-primary
  secondary: '#6b7280', // gray-500
  background: '#f8fafc', // gray-50
  surface: '#ffffff', // white
  text: {
    primary: '#111827', // gray-900
    secondary: '#374151', // gray-700
    muted: '#6b7280', // gray-500
  },
  border: '#eef2f6', // custom light gray
  accent: '#f3f4f6', // gray-100
};

const darkTheme = {
  primary: '#10b981', // emerald-500
  secondary: '#9ca3af', // gray-400
  background: '#111827', // gray-900
  surface: '#1f2937', // gray-800
  text: {
    primary: '#f9fafb', // gray-50
    secondary: '#d1d5db', // gray-300
    muted: '#9ca3af', // gray-400
  },
  border: '#374151', // gray-700
  accent: '#374151', // gray-700
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('admin-theme') as 'light' | 'dark' | 'auto' || 'light';
    setTheme(savedTheme);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <>{children}</>;
  }

  // Apply theme changes
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
    } else {
      setIsDark(theme === 'dark');
    }

    // Apply theme to document
    root.classList.toggle('dark', isDark);
    root.setAttribute('data-theme', theme);
    
    // Save to localStorage
    localStorage.setItem('admin-theme', theme);
    localStorage.setItem('admin-dark-mode', isDark.toString());
  }, [theme, isDark]);

  // Listen for system theme changes when in auto mode
  useEffect(() => {
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        setIsDark(e.matches);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const colors = isDark ? darkTheme : lightTheme;

  const value: ThemeContextType = {
    theme,
    setTheme,
    isDark,
    colors,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
