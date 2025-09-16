import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2, RotateCw, RefreshCw, Disc, Circle, Square, Triangle } from 'lucide-react'

export interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'dots' | 'pulse' | 'bounce' | 'spin' | 'bars' | 'wave' | 'squares'
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'muted'
  speed?: 'slow' | 'normal' | 'fast'
  label?: string
  centered?: boolean
  overlay?: boolean
  className?: string
}

const sizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
}

const colorClasses = {
  default: 'text-foreground',
  primary: 'text-primary',
  secondary: 'text-secondary',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  danger: 'text-red-600',
  muted: 'text-muted-foreground'
}

const speedClasses = {
  slow: 'animate-spin duration-2000',
  normal: 'animate-spin',
  fast: 'animate-spin duration-500'
}

export function LoadingSpinner({
  size = 'md',
  variant = 'default',
  color = 'default',
  speed = 'normal',
  label,
  centered = false,
  overlay = false,
  className
}: LoadingSpinnerProps) {
  const baseClasses = cn(
    sizeClasses[size],
    colorClasses[color],
    className
  )

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className={cn("flex space-x-1", baseClasses)}>
            <div className={cn("rounded-full animate-bounce", sizeClasses[size])} style={{ backgroundColor: 'currentColor', animationDelay: '0ms' }} />
            <div className={cn("rounded-full animate-bounce", sizeClasses[size])} style={{ backgroundColor: 'currentColor', animationDelay: '150ms' }} />
            <div className={cn("rounded-full animate-bounce", sizeClasses[size])} style={{ backgroundColor: 'currentColor', animationDelay: '300ms' }} />
          </div>
        )

      case 'pulse':
        return (
          <div className={cn("rounded-full animate-pulse", baseClasses)} style={{ backgroundColor: 'currentColor' }} />
        )

      case 'bounce':
        return (
          <div className={cn("rounded-full animate-bounce", baseClasses)} style={{ backgroundColor: 'currentColor' }} />
        )

      case 'spin':
        return (
          <RotateCw className={cn(baseClasses, speedClasses[speed])} />
        )

      case 'bars':
        return (
          <div className={cn("flex space-x-1", baseClasses)}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse"
                style={{
                  width: size === 'xs' ? '2px' : size === 'sm' ? '3px' : size === 'md' ? '4px' : size === 'lg' ? '5px' : '6px',
                  height: sizeClasses[size].split(' ')[1].replace('h-', '').replace('3', '12px').replace('4', '16px').replace('6', '24px').replace('8', '32px').replace('12', '48px'),
                  backgroundColor: 'currentColor',
                  animationDelay: `${i * 100}ms`,
                  animationDuration: '1.2s'
                }}
              />
            ))}
          </div>
        )

      case 'wave':
        return (
          <div className={cn("flex items-end space-x-1", baseClasses)}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="animate-pulse"
                style={{
                  width: size === 'xs' ? '2px' : size === 'sm' ? '3px' : '4px',
                  height: `${20 + Math.sin((i / 4) * Math.PI) * 10}px`,
                  backgroundColor: 'currentColor',
                  animationDelay: `${i * 100}ms`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        )

      case 'squares':
        return (
          <div className={cn("grid grid-cols-2 gap-1", baseClasses)}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse"
                style={{
                  width: size === 'xs' ? '4px' : size === 'sm' ? '6px' : size === 'md' ? '8px' : size === 'lg' ? '10px' : '12px',
                  height: size === 'xs' ? '4px' : size === 'sm' ? '6px' : size === 'md' ? '8px' : size === 'lg' ? '10px' : '12px',
                  backgroundColor: 'currentColor',
                  animationDelay: `${i * 200}ms`,
                  animationDuration: '1.6s'
                }}
              />
            ))}
          </div>
        )

      default:
        return (
          <Loader2 className={cn(baseClasses, speedClasses[speed])} />
        )
    }
  }

  const spinner = (
    <div className={cn(
      "inline-flex items-center",
      centered && "justify-center",
      label && "gap-2"
    )}>
      {renderSpinner()}
      {label && (
        <span className={cn(
          "text-sm",
          colorClasses[color],
          size === 'xs' && "text-xs",
          size === 'xl' && "text-base"
        )}>
          {label}
        </span>
      )}
    </div>
  )

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex flex-col items-center space-y-4 p-6 bg-card border rounded-lg shadow-lg">
          {spinner}
        </div>
      </div>
    )
  }

  if (centered) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[100px]">
        {spinner}
      </div>
    )
  }

  return spinner
}

// Loading Button Component
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  spinnerSize?: LoadingSpinnerProps['size']
  spinnerVariant?: LoadingSpinnerProps['variant']
  loadingText?: string
  children: React.ReactNode
}

export function LoadingButton({
  loading = false,
  spinnerSize = 'sm',
  spinnerVariant = 'default',
  loadingText,
  disabled,
  children,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2",
        loading && "cursor-not-allowed opacity-70",
        className
      )}
    >
      {loading && (
        <LoadingSpinner
          size={spinnerSize}
          variant={spinnerVariant}
          color="default"
        />
      )}
      {loading && loadingText ? loadingText : children}
    </button>
  )
}

// Loading Card Component
interface LoadingCardProps {
  title?: string
  description?: string
  size?: LoadingSpinnerProps['size']
  variant?: LoadingSpinnerProps['variant']
  className?: string
}

export function LoadingCard({
  title = "Loading...",
  description,
  size = 'lg',
  variant = 'default',
  className
}: LoadingCardProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 space-y-4 border rounded-lg bg-card",
      className
    )}>
      <LoadingSpinner size={size} variant={variant} color="primary" />
      <div className="text-center space-y-2">
        <h3 className="text-lg font-medium">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  )
}

// Loading Skeleton Component
interface LoadingSkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  lines?: number
  className?: string
}

export function LoadingSkeleton({
  variant = 'text',
  width,
  height,
  lines = 1,
  className
}: LoadingSkeletonProps) {
  const skeletonClasses = cn(
    "animate-pulse bg-muted",
    variant === 'text' && "h-4 rounded",
    variant === 'circular' && "rounded-full",
    variant === 'rectangular' && "rounded-none",
    variant === 'rounded' && "rounded-lg",
    className
  )

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height
  }

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              skeletonClasses,
              i === lines - 1 && "w-3/4" // Last line is shorter
            )}
            style={style}
          />
        ))}
      </div>
    )
  }

  return <div className={skeletonClasses} style={style} />
}

// Loading List Component
interface LoadingListProps {
  items?: number
  showAvatar?: boolean
  showActions?: boolean
  className?: string
}

export function LoadingList({
  items = 3,
  showAvatar = true,
  showActions = false,
  className
}: LoadingListProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
          {showAvatar && (
            <LoadingSkeleton variant="circular" width={40} height={40} />
          )}
          <div className="flex-1 space-y-2">
            <LoadingSkeleton variant="text" width="60%" />
            <LoadingSkeleton variant="text" width="40%" />
          </div>
          {showActions && (
            <div className="flex space-x-2">
              <LoadingSkeleton variant="rounded" width={60} height={32} />
              <LoadingSkeleton variant="rounded" width={60} height={32} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default LoadingSpinner