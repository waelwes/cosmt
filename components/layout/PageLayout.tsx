

import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { ScrollToTop } from '../ui/ScrollToTop';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen ${className}`} style={{ backgroundColor: '#fbfbfb' }}>
      <Header />
      <main>
        {children}
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};
