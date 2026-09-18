import React from 'react';
import MiningSubNav from '@/components/simulations/MiningSubNav';
import PageTransition from '@/components/layout/PageTransition';

export default function MiningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <MiningSubNav />
      <PageTransition>{children}</PageTransition>
    </div>
  );
}
