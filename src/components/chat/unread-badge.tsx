import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface UnreadBadgeProps {
  count: number;
  maxCount?: number;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'accent';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'inline';
  showZero?: boolean;
  animate?: boolean;
  pulse?: boolean;
  className?: string;
}

const SIZE_CONFIG = {
  xs: {
    badge: 'text-xs px-1 py-0 min-w-[16px] h-4',
    dot: 'w-2 h-2',
    font: 'text-xs'
  },
  sm: {
    badge: 'text-xs px-1.5 py-0.5 min-w-[18px] h-5',
    dot: 'w-2.5 h-2.5',
    font: 'text-xs'
  },
  md: {
    badge: 'text-sm px-2 py-1 min-w-[20px] h-6',
    dot: 'w-3 h-3',
    font: 'text-sm'
  },
  lg: {
    badge: 'text-base px-2.5 py-1 min-w-[24px] h-7',
    dot: 'w-4 h-4',
    font: 'text-base'
  }
};

const POSITION_CONFIG = {
  'top-right': 'absolute -top-1 -right-1',
  'top-left': 'absolute -top-1 -left-1',
  'bottom-right': 'absolute -bottom-1 -right-1',
  'bottom-left': 'absolute -bottom-1 -left-1',
  'inline': 'relative'
};

const VARIANT_CONFIG = {
  default: 'bg-blue-500 hover:bg-blue-600 text-white',
  destructive: 'bg-red-500 hover:bg-red-600 text-white',
  outline: 'border-2 border-blue-500 bg-white text-blue-500',
  secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
  accent: 'bg-purple-500 hover:bg-purple-600 text-white'
};

export const UnreadBadge: React.FC<UnreadBadgeProps> = ({
  count,
  maxCount = 99,
  variant = 'destructive',
  size = 'sm',
  position = 'top-right',
  showZero = false,
  animate = true,
  pulse = true,
  className
}) => {
  // Don't render if count is 0 and showZero is false
  if (count === 0 && !showZero) {
    return null;
  }

  const sizeConfig = SIZE_CONFIG[size];
  const positionClass = POSITION_CONFIG[position];
  const variantClass = VARIANT_CONFIG[variant];

  // Format count display
  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  // Show just a dot for very small sizes or when count is 0
  const showDot = count === 0 || (size === 'xs' && count === 1);

  if (showDot) {
    return (
      <div
        className={cn(
          'rounded-full flex-shrink-0',
          sizeConfig.dot,
          variantClass,
          positionClass,
          animate && 'transition-all duration-200 ease-in-out',
          pulse && count > 0 && 'animate-pulse',
          className
        )}
      />
    );
  }

  return (
    <Badge
      className={cn(
        'rounded-full flex items-center justify-center font-semibold leading-none',
        sizeConfig.badge,
        sizeConfig.font,
        variantClass,
        positionClass,
        animate && 'transition-all duration-200 ease-in-out transform',
        animate && count > 0 && 'scale-100',
        animate && count === 0 && 'scale-0',
        pulse && count > 0 && 'animate-pulse',
        className
      )}
    >
      {displayCount}
    </Badge>
  );
};

// Utility component for wrapping elements with unread badge
export const UnreadBadgeWrapper: React.FC<{
  children: React.ReactNode;
  count: number;
  maxCount?: number;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'accent';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  showZero?: boolean;
  animate?: boolean;
  pulse?: boolean;
  className?: string;
  badgeClassName?: string;
}> = ({
  children,
  count,
  maxCount,
  variant,
  size,
  position,
  showZero,
  animate,
  pulse,
  className,
  badgeClassName
}) => {
  return (
    <div className={cn('relative inline-block', className)}>
      {children}
      <UnreadBadge
        count={count}
        maxCount={maxCount}
        variant={variant}
        size={size}
        position={position}
        showZero={showZero}
        animate={animate}
        pulse={pulse}
        className={badgeClassName}
      />
    </div>
  );
};

// Animated counter component
export const AnimatedUnreadCounter: React.FC<{
  count: number;
  previousCount?: number;
  maxCount?: number;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'accent';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showZero?: boolean;
  className?: string;
}> = ({
  count,
  previousCount = 0,
  maxCount = 99,
  variant = 'destructive',
  size = 'sm',
  showZero = false,
  className
}) => {
  const [displayCount, setDisplayCount] = React.useState(previousCount);
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useEffect(() => {
    if (count !== previousCount) {
      setIsAnimating(true);

      // Animate the counter
      const startCount = previousCount;
      const endCount = count;
      const duration = 500; // ms
      const steps = 20;
      const stepDuration = duration / steps;
      const increment = (endCount - startCount) / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const newCount = Math.round(startCount + (increment * currentStep));

        setDisplayCount(newCount);

        if (currentStep >= steps) {
          clearInterval(timer);
          setDisplayCount(endCount);
          setIsAnimating(false);
        }
      }, stepDuration);

      return () => clearInterval(timer);
    }
  }, [count, previousCount]);

  return (
    <UnreadBadge
      count={displayCount}
      maxCount={maxCount}
      variant={variant}
      size={size}
      showZero={showZero}
      animate={!isAnimating}
      pulse={isAnimating}
      className={cn(
        isAnimating && 'scale-110',
        'transition-transform duration-300',
        className
      )}
    />
  );
};

// Multi-level badge for showing different types of notifications
export const MultiLevelUnreadBadge: React.FC<{
  levels: {
    count: number;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'accent';
    label?: string;
  }[];
  size?: 'xs' | 'sm' | 'md' | 'lg';
  maxCount?: number;
  orientation?: 'horizontal' | 'vertical' | 'stacked';
  spacing?: 'tight' | 'normal' | 'loose';
  className?: string;
}> = ({
  levels,
  size = 'sm',
  maxCount = 99,
  orientation = 'horizontal',
  spacing = 'normal',
  className
}) => {
  const visibleLevels = levels.filter(level => level.count > 0);

  if (visibleLevels.length === 0) {
    return null;
  }

  const spacingClasses = {
    tight: 'gap-1',
    normal: 'gap-2',
    loose: 'gap-3'
  };

  const orientationClasses = {
    horizontal: `flex flex-row items-center ${spacingClasses[spacing]}`,
    vertical: `flex flex-col items-center ${spacingClasses[spacing]}`,
    stacked: 'relative'
  };

  if (orientation === 'stacked') {
    return (
      <div className={cn('relative', className)}>
        {visibleLevels.map((level, index) => (
          <UnreadBadge
            key={index}
            count={level.count}
            maxCount={maxCount}
            variant={level.variant}
            size={size}
            position={index === 0 ? 'top-right' : 'top-left'}
            className={index > 0 ? `translate-x-${index * 2} translate-y-${index * 2}` : ''}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn(orientationClasses[orientation], className)}>
      {visibleLevels.map((level, index) => (
        <div key={index} className="flex items-center gap-1">
          <UnreadBadge
            count={level.count}
            maxCount={maxCount}
            variant={level.variant}
            size={size}
            position="inline"
          />
          {level.label && (
            <span className="text-xs text-gray-600">{level.label}</span>
          )}
        </div>
      ))}
    </div>
  );
};

// Hook for managing unread counts
export const useUnreadCount = (initialCount = 0) => {
  const [count, setCount] = React.useState(initialCount);
  const [previousCount, setPreviousCount] = React.useState(initialCount);

  const increment = React.useCallback((amount = 1) => {
    setPreviousCount(count);
    setCount(prev => prev + amount);
  }, [count]);

  const decrement = React.useCallback((amount = 1) => {
    setPreviousCount(count);
    setCount(prev => Math.max(0, prev - amount));
  }, [count]);

  const reset = React.useCallback(() => {
    setPreviousCount(count);
    setCount(0);
  }, [count]);

  const set = React.useCallback((newCount: number) => {
    setPreviousCount(count);
    setCount(Math.max(0, newCount));
  }, [count]);

  return {
    count,
    previousCount,
    increment,
    decrement,
    reset,
    set
  };
};

export default UnreadBadge;