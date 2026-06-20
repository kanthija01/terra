'use client';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  glow?: 'green' | 'aurora' | 'none';
}

export function GlassCard({ className, glow = 'none', children, ...props }: GlassCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'glass glass-hover p-4',
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
