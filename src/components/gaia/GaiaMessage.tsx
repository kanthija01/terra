'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { GaiaAvatar } from './GaiaAvatar';

interface GaiaAction {
  label: string;
  icon?: string;
  estimatedSavingsKg?: number;
  onClick?: () => void;
}

interface GaiaMessageProps {
  message: string;
  visible: boolean;
  onDismiss?: () => void;
  /** Optional "next best action" chip, e.g. from the recommendation engine. */
  action?: GaiaAction;
}

export function GaiaMessage({ message, visible, onDismiss, action }: GaiaMessageProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 20 }}
          className="fixed bottom-32 left-4 right-4 z-40 max-w-md mx-auto"
          role="region"
          aria-label="Message from Gaia"
          aria-live="polite"
        >
          <div 
            className="glass glow-aurora p-4 flex items-start gap-3 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-terra-green-400 rounded-lg"
            onClick={onDismiss}
            role="button"
            tabIndex={0}
            aria-label="Close Gaia message"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onDismiss?.();
              }
            }}
          >
            <GaiaAvatar speaking />
            <div className="flex-1">
              <div className="text-xs text-terra-aurora-purple font-semibold mb-1">Gaia</div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-terra-space-200 italic leading-relaxed"
              >
                &quot;{message}&quot;
              </motion.p>
            </div>
          </div>
          {action && (
            <motion.button
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick?.();
              }}
              type="button"
              aria-label={`${action.label}${action.estimatedSavingsKg ? ` - Save ${action.estimatedSavingsKg} kg CO2 per year` : ''}`}
              className="mt-2 w-full glass glass-hover px-4 py-2.5 rounded-xl flex items-center justify-between text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-terra-green-400"
            >
              <span className="flex items-center gap-2 text-sm font-medium text-terra-space-200">
                {action.icon && <span aria-hidden="true">{action.icon}</span>}
                {action.label}
              </span>
              {typeof action.estimatedSavingsKg === 'number' && action.estimatedSavingsKg > 0 && (
                <span className="text-xs font-mono font-bold text-terra-green-400 shrink-0 ml-3" aria-hidden="true">
                  −{action.estimatedSavingsKg.toLocaleString()} kg/yr
                </span>
              )}
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
