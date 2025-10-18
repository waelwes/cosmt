'use client';

import React from 'react';
import { PageLayout } from '../../../components/layout/PageLayout';
import { ProductListingPage } from '../../../components/pages/ProductListingPage';

export default function MomBabyCarePage() {
  return (
    <PageLayout>
      <ProductListingPage 
        category="mom-baby-care"
        title="Mom & Baby Care"
        description="Essential products for mothers and babies"
      />
    </PageLayout>
  );
}
