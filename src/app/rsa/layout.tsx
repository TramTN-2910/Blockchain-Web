import React from 'react';
import RsaSubNav from '@/components/simulations/RsaSubNav';
import PageTransition from '@/components/layout/PageTransition';

export default function RsaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <RsaSubNav />
      <PageTransition>{children}</PageTransition>
    </div>
  );
}
