import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  image?: string;
}

export function EmptyState({ icon, title, description, image }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center justify-center px-6 py-14 text-center"
    >
      {image ? (
        <motion.img
          src={image}
          alt=""
          className="mb-4 h-32 w-32 object-contain"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      ) : (
        <div className="mb-3 text-slate-300 dark:text-slate-600">{icon}</div>
      )}
      <h4 className="text-[15px] font-semibold text-slate-700 dark:text-slate-200">{title}</h4>
      <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </motion.div>
  );
}
