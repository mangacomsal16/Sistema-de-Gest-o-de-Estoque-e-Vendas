import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';

type Variant = 'primary' | 'light' | 'danger' | 'ghost';
type Size = 'md' | 'sm';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary: 'bg-brand-500 text-white hover:bg-brand-600',
  light: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  ghost: 'text-slate-600 hover:bg-slate-100',
};
const sizes: Record<Size, string> = {
  md: 'px-4 py-2 text-sm',
  sm: 'px-3 py-1.5 text-[13px]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-500/40',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  )
);
Button.displayName = 'Button';
