import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { LoadingSpinner } from './LoadingSpinner'

type Variant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  loading?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-plum-700 text-cream-50 hover:bg-plum-800 focus-visible:outline-plum-700 shadow-soft',
  secondary:
    'bg-gold-400 text-plum-900 hover:bg-gold-500 focus-visible:outline-gold-500 shadow-soft',
  ghost: 'bg-transparent text-plum-700 hover:bg-plum-100 focus-visible:outline-plum-700',
}

/** Shared classes so non-<button> elements (e.g. router <Link>) can look identical to Button. */
export function buttonClasses(variant: Variant = 'primary', className = '') {
  return `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${className}`
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', loading = false, disabled, className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={buttonClasses(variant, className)}
        {...props}
      >
        {loading && <LoadingSpinner className="h-4 w-4" />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
