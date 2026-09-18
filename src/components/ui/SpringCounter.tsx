'use client';

import React, { useEffect } from 'react';
import { useSpring, useTransform, motion } from 'framer-motion';

interface SpringCounterProps {
  value: number;
  className?: string;
}

export function SpringCounter({ value, className = '' }: SpringCounterProps) {
  const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => Math.round(current));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span className={className}>{display}</motion.span>;
}
