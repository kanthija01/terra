'use client';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { KeyboardEvent } from 'react';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  glow?: 'green' | 'aurora' | 'none';
  onClick?: (e: React.MouseEvent) => void;
  role?: string;
  tabIndex?: number;
  onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void;
  ariaLabel?: string;
}

export function GlassCard({ 
  className, 
  glow = 'none', 
  children, 
  onClick,
  role,
  tabIndex,
  onKeyDown,
  ariaLabel,
  ...props 
}: GlassCardProps) {
  const isClickable = Boolean(onClick);
  
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick?.(e as unknown as React.MouseEvent);
    }
    onKeyDown?.(e);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      onKeyDown={isClickable ? handleKeyDown : onKeyDown}
      role={isClickable ? (role || 'button') : role}
      tabIndex={isClickable ? (tabIndex ?? 0) : tabIndex}
      aria-label={ariaLabel}
      className={cn(
        'glass glass-hover p-4 transition-colors',
        isClickable && 'cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terra-green-400',
        glow === 'green' && 'glow-green',
        glow === 'aurora' && 'glow-aurora',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
