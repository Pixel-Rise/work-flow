import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sparkles,
  Star,
  TrendingUp,
  Zap,
  Award,
  Crown,
  Gift,
  Heart,
  ThumbsUp,
  Users,
  Globe,
  Shield,
  Rocket,
  Lightning,
  Fire,
  Diamond,
  Gem,
  ArrowRight,
  ExternalLink,
  Play,
  Eye,
  Download,
  Bell,
  Check,
  Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'

export interface HeroBadgeProps {
  variant?: 'default' | 'announcement' | 'achievement' | 'social-proof' | 'feature' | 'update' | 'cta' | 'stats'
  text: string
  subtext?: string
  icon?: React.ComponentType<any>
  animated?: boolean
  animationType?: 'pulse' | 'bounce' | 'glow' | 'shimmer' | 'float'
  clickable?: boolean
  href?: string
  onClick?: () => void
  showArrow?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: 'default' | 'primary' | 'success' | 'warning' | 'destructive' | 'secondary'
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center'
  backdrop?: boolean
  glow?: boolean
  gradient?: boolean
  className?: string
}

const VARIANT_CONFIGS = {
  default: {
    color: 'secondary' as const,
    icon: Sparkles,
    animated: false
  },
  announcement: {
    color: 'primary' as const,
    icon: Bell,
    animated: true,
    animationType: 'pulse' as const,
    showArrow: true
  },
  achievement: {
    color: 'success' as const,
    icon: Award,
    animated: true,
    animationType: 'glow' as const
  },
  'social-proof': {
    color: 'secondary' as const,
    icon: Users,
    animated: false
  },
  feature: {
    color: 'primary' as const,
    icon: Star,
    animated: true,
    animationType: 'shimmer' as const
  },
  update: {
    color: 'warning' as const,
    icon: Rocket,
    animated: true,
    animationType: 'bounce' as const
  },
  cta: {
    color: 'primary' as const,
    icon: ArrowRight,
    animated: true,
    animationType: 'float' as const,
    clickable: true,
    showArrow: true
  },
  stats: {
    color: 'success' as const,
    icon: TrendingUp,
    animated: false
  }
}

const ANIMATION_CLASSES = {
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
  glow: 'animate-pulse drop-shadow-lg',
  shimmer: 'animate-pulse bg-gradient-to-r',
  float: 'animate-bounce'
}

const SIZE_CONFIGS = {
  sm: {
    padding: 'px-2 py-1',
    textSize: 'text-xs',
    iconSize: 'w-3 h-3',
    gap: 'gap-1'
  },
  md: {
    padding: 'px-3 py-1.5',
    textSize: 'text-sm',
    iconSize: 'w-4 h-4',
    gap: 'gap-2'
  },
  lg: {
    padding: 'px-4 py-2',
    textSize: 'text-base',
    iconSize: 'w-5 h-5',
    gap: 'gap-2'
  }
}

export function HeroBadge({
  variant = 'default',
  text,
  subtext,
  icon,
  animated,
  animationType,
  clickable,
  href,
  onClick,
  showArrow,
  size = 'md',
  color,
  position = 'center',
  backdrop = false,
  glow = false,
  gradient = false,
  className
}: HeroBadgeProps) {
  const { t } = useTranslation()

  const config = VARIANT_CONFIGS[variant]
  const sizeConfig = SIZE_CONFIGS[size]

  const finalIcon = icon || config.icon
  const finalColor = color || config.color
  const finalAnimated = animated !== undefined ? animated : config.animated
  const finalAnimationType = animationType || config.animationType || 'pulse'
  const finalClickable = clickable !== undefined ? clickable : config.clickable || !!href || !!onClick
  const finalShowArrow = showArrow !== undefined ? showArrow : config.showArrow

  const badgeElement = (
    <div
      className={cn(
        "inline-flex items-center rounded-full border transition-all duration-200",
        sizeConfig.padding,
        sizeConfig.gap,
        finalAnimated && ANIMATION_CLASSES[finalAnimationType],
        finalClickable && "cursor-pointer hover:scale-105 active:scale-95",
        backdrop && "backdrop-blur-sm bg-background/80",
        glow && "shadow-lg hover:shadow-xl",
        gradient && finalColor === 'primary' && "bg-gradient-to-r from-primary to-primary/80",
        position === 'top' && "mb-4",
        position === 'bottom' && "mt-4",
        position === 'left' && "mr-4",
        position === 'right' && "ml-4",
        className
      )}
      onClick={onClick}
    >
      {/* Icon */}
      {finalIcon && (
        <finalIcon className={cn(
          sizeConfig.iconSize,
          finalColor === 'primary' && "text-primary",
          finalColor === 'success' && "text-green-500",
          finalColor === 'warning' && "text-yellow-500",
          finalColor === 'destructive' && "text-red-500",
          finalColor === 'secondary' && "text-muted-foreground"
        )} />
      )}

      {/* Text Content */}
      <div className="flex items-center gap-1">
        <span className={cn(
          "font-medium",
          sizeConfig.textSize,
          finalColor === 'primary' && "text-primary",
          finalColor === 'success' && "text-green-700 dark:text-green-400",
          finalColor === 'warning' && "text-yellow-700 dark:text-yellow-400",
          finalColor === 'destructive' && "text-red-700 dark:text-red-400",
          finalColor === 'secondary' && "text-foreground"
        )}>
          {text}
        </span>

        {subtext && (
          <span className={cn(
            "text-muted-foreground ml-1",
            size === 'sm' ? 'text-xs' : 'text-sm'
          )}>
            {subtext}
          </span>
        )}
      </div>

      {/* Arrow */}
      {finalShowArrow && (
        <ArrowRight className={cn(
          sizeConfig.iconSize,
          "transition-transform group-hover:translate-x-1",
          finalColor === 'primary' && "text-primary",
          finalColor === 'success' && "text-green-500",
          finalColor === 'warning' && "text-yellow-500",
          finalColor === 'destructive' && "text-red-500",
          finalColor === 'secondary' && "text-muted-foreground"
        )} />
      )}
    </div>
  )

  if (href) {
    return (
      <a
        href={href}
        className="inline-block group"
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {badgeElement}
      </a>
    )
  }

  if (finalClickable) {
    return (
      <button className="inline-block group" onClick={onClick}>
        {badgeElement}
      </button>
    )
  }

  return badgeElement
}

// Predefined hero badges for common use cases
export const HERO_BADGE_PRESETS = {
  // Announcements
  newRelease: {
    variant: 'announcement' as const,
    text: 'New Release',
    icon: Rocket,
    animated: true
  },
  betaLaunch: {
    variant: 'announcement' as const,
    text: 'Beta Launch',
    subtext: 'Join Now',
    icon: Lightning,
    showArrow: true
  },
  comingSoon: {
    variant: 'update' as const,
    text: 'Coming Soon',
    icon: Clock,
    animated: true
  },

  // Social Proof
  trustedBy: {
    variant: 'social-proof' as const,
    text: 'Trusted by 10k+',
    subtext: 'companies',
    icon: Shield
  },
  topRated: {
    variant: 'achievement' as const,
    text: '#1 Rated',
    subtext: 'by users',
    icon: Star,
    color: 'success' as const
  },
  awardWinner: {
    variant: 'achievement' as const,
    text: 'Award Winner',
    icon: Award,
    glow: true
  },

  // Features
  aiPowered: {
    variant: 'feature' as const,
    text: 'AI Powered',
    icon: Zap,
    gradient: true
  },
  openSource: {
    variant: 'feature' as const,
    text: 'Open Source',
    icon: Heart,
    color: 'success' as const
  },
  enterprise: {
    variant: 'feature' as const,
    text: 'Enterprise Ready',
    icon: Crown,
    color: 'primary' as const
  },

  // CTAs
  getStarted: {
    variant: 'cta' as const,
    text: 'Get Started Free',
    icon: ArrowRight,
    clickable: true,
    showArrow: true
  },
  watchDemo: {
    variant: 'cta' as const,
    text: 'Watch Demo',
    icon: Play,
    color: 'secondary' as const,
    clickable: true
  },
  downloadNow: {
    variant: 'cta' as const,
    text: 'Download Now',
    icon: Download,
    clickable: true
  },

  // Stats
  userCount: {
    variant: 'stats' as const,
    text: '1M+ Users',
    icon: Users,
    color: 'success' as const
  },
  uptime: {
    variant: 'stats' as const,
    text: '99.9% Uptime',
    icon: Shield,
    color: 'success' as const
  },
  satisfaction: {
    variant: 'stats' as const,
    text: '98% Satisfaction',
    icon: ThumbsUp,
    color: 'success' as const
  }
}

// Animated floating badge
export interface FloatingBadgeProps extends Omit<HeroBadgeProps, 'animationType'> {
  floatDirection?: 'up' | 'down' | 'left' | 'right'
  floatDistance?: number
  duration?: number
}

export function FloatingBadge({
  floatDirection = 'up',
  floatDistance = 10,
  duration = 3,
  className,
  ...props
}: FloatingBadgeProps) {
  const floatStyle = {
    animation: `float-${floatDirection} ${duration}s ease-in-out infinite`,
    '--float-distance': `${floatDistance}px`
  } as React.CSSProperties

  const floatKeyframes = `
    @keyframes float-${floatDirection} {
      0%, 100% { transform: translate${floatDirection === 'up' || floatDirection === 'down' ? 'Y' : 'X'}(0); }
      50% { transform: translate${floatDirection === 'up' || floatDirection === 'down' ? 'Y' : 'X'}(${
        floatDirection === 'down' || floatDirection === 'right' ? '' : '-'
      }var(--float-distance)); }
    }
  `

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: floatKeyframes }} />
      <HeroBadge
        {...props}
        className={cn(className)}
        style={floatStyle}
      />
    </>
  )
}

// Badge with countdown timer
export interface CountdownBadgeProps extends Omit<HeroBadgeProps, 'text'> {
  targetDate: Date
  prefix?: string
  suffix?: string
  onComplete?: () => void
}

export function CountdownBadge({
  targetDate,
  prefix = 'Ends in',
  suffix = '',
  onComplete,
  ...props
}: CountdownBadgeProps) {
  const [timeLeft, setTimeLeft] = React.useState('')

  React.useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now

      if (distance < 0) {
        setTimeLeft('Expired')
        onComplete?.()
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h`)
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`)
      } else {
        setTimeLeft(`${minutes}m`)
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [targetDate, onComplete])

  return (
    <HeroBadge
      {...props}
      text={`${prefix} ${timeLeft} ${suffix}`.trim()}
      variant="announcement"
      animated
      icon={Clock}
    />
  )
}

export default HeroBadge