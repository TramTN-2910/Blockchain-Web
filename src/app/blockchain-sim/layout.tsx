import React from 'react';
import HorizontalSubNav from '@/components/layout/HorizontalSubNav';
import PageTransition from '@/components/layout/PageTransition';

export default function BlockchainSimLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <HorizontalSubNav />
      <PageTransition>{children}</PageTransition>
    </div>
  );
}
