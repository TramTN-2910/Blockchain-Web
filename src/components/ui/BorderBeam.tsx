'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface BorderBeamProps {
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
  className?: string;
  size?: number;
}

export function BorderBeam({
  duration = 6,
  colorFrom = '#10b981', // emerald-500
  colorTo = '#06b6d4',   // cyan-500
  className = '',
}: BorderBeamProps) {
  return (
    <div className={`pointer-events-none absolute -inset-[1.5px] rounded-[inherit] overflow-hidden ${className}`}>
      <motion.div
        className="absolute -inset-[200%] [background:conic-gradient(from_0deg_at_50%_50%,transparent_0deg,transparent_60deg,var(--from)_120deg,var(--to)_180deg,transparent_240deg)]"
        style={{
          ['--from' as string]: colorFrom,
          ['--to' as string]: colorTo,
        }}
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration,
        }}
      />
    </div>
  );
}
