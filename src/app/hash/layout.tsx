import React from 'react';
import HashSubNav from '@/components/simulations/HashSubNav';
import PageTransition from '@/components/layout/PageTransition';

export default function HashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <HashSubNav />
      <PageTransition>{children}</PageTransition>
    </div>
  );
}
