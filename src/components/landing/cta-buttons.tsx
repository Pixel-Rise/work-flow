import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowRight,
  Play,
  Download,
  ExternalLink,
  Star,
  CheckCircle,
  Zap,
  Rocket,
  Gift,
  Calendar,
  Phone,
  Mail,
  MessageSquare,
  Video,
  Users,
  CreditCard,
  ShoppingCart,
  FileText,
  Eye,
  Heart,
  Share2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'

export interface CTAButton {
  id: string
  label: string
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive'
  size?: 'sm' | 'default' | 'lg' | 'xl'
  icon?: React.ComponentType<any>
  iconPosition?: 'left' | 'right'
  href?: string
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  badge?: {
    text: string
    variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive'
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  }
  tooltip?: string
  external?: boolean
  pulse?: boolean
  gradient?: boolean
  glow?: boolean
}

export interface CTAButtonsProps {
  buttons: CTAButton[]
  layout?: 'horizontal' | 'vertical' | 'grid' | 'stack'
  alignment?: 'left' | 'center' | 'right' | 'stretch'
  gap?: 'sm' | 'md' | 'lg'
  responsive?: boolean
  animated?: boolean
  priority?: boolean
  className?: string
}

const COMMON_BUTTON_CONFIGS = {
  // Primary Actions
  getStarted: {
    label: 'Get Started',
    variant: 'default' as const,
    icon: ArrowRight,
    iconPosition: 'right' as const,
    gradient: true
  },
  signUp: {
    label: 'Sign Up Free',
    variant: 'default' as const,
    icon: Rocket,
    gradient: true,
    badge: { text: 'Free', variant: 'success' as const }
  },
  tryFree: {
    label: 'Try Free',
    variant: 'default' as const,
    icon: Star,
    badge: { text: 'No Credit Card', variant: 'secondary' as const }
  },

  // Secondary Actions
  learnMore: {
    label: 'Learn More',
    variant: 'outline' as const,
    icon: ArrowRight,
    iconPosition: 'right' as const
  },
  viewDemo: {
    label: 'View Demo',
    variant: 'outline' as const,
    icon: Play,
    iconPosition: 'left' as const
  },
  watchVideo: {
    label: 'Watch Video',
    variant: 'ghost' as const,
    icon: Video,
    iconPosition: 'left' as const
  },

  // Download/Install
  download: {
    label: 'Download',
    variant: 'secondary' as const,
    icon: Download,
    iconPosition: 'left' as const
  },
  appStore: {
    label: 'App Store',
    variant: 'outline' as const,
    external: true
  },
  googlePlay: {
    label: 'Google Play',
    variant: 'outline' as const,
    external: true
  },

  // Contact/Support
  contactUs: {
    label: 'Contact Us',
    variant: 'outline' as const,
    icon: MessageSquare,
    iconPosition: 'left' as const
  },
  bookDemo: {
    label: 'Book Demo',
    variant: 'secondary' as const,
    icon: Calendar,
    iconPosition: 'left' as const
  },
  callNow: {
    label: 'Call Now',
    variant: 'outline' as const,
    icon: Phone,
    iconPosition: 'left' as const,
    pulse: true
  },

  // Purchase/Pricing
  buyNow: {
    label: 'Buy Now',
    variant: 'default' as const,
    icon: ShoppingCart,
    iconPosition: 'left' as const,
    glow: true
  },
  viewPricing: {
    label: 'View Pricing',
    variant: 'outline' as const,
    icon: CreditCard,
    iconPosition: 'left' as const
  },

  // Documentation/Resources
  documentation: {
    label: 'Documentation',
    variant: 'ghost' as const,
    icon: FileText,
    iconPosition: 'left' as const
  },
  resources: {
    label: 'Resources',
    variant: 'ghost' as const,
    icon: ExternalLink,
    external: true
  }
}

export function CTAButtons({
  buttons,
  layout = 'horizontal',
  alignment = 'center',
  gap = 'md',
  responsive = true,
  animated = true,
  priority = false,
  className
}: CTAButtonsProps) {
  const { t } = useTranslation()

  const renderButton = (button: CTAButton, index: number) => {
    const {
      id,
      label,
      variant = 'default',
      size = 'default',
      icon: Icon,
      iconPosition = 'left',
      href,
      onClick,
      disabled = false,
      loading = false,
      badge,
      tooltip,
      external = false,
      pulse = false,
      gradient = false,
      glow = false
    } = button

    const isPrimary = index === 0 && priority
    const buttonSize = isPrimary && size === 'default' ? 'lg' : size

    const buttonElement = (
      <div className="relative inline-block">
        <Button
          variant={variant}
          size={buttonSize}
          disabled={disabled || loading}
          onClick={onClick}
          asChild={!!href}
          className={cn(
            "relative overflow-hidden transition-all duration-200",
            animated && "hover:scale-105 active:scale-95",
            gradient && variant === 'default' && "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70",
            glow && "shadow-lg hover:shadow-xl",
            pulse && "animate-pulse",
            isPrimary && "font-semibold"
          )}
          title={tooltip}
        >
          {href ? (
            <a
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              className="flex items-center gap-2"
            >
              {Icon && iconPosition === 'left' && (
                <Icon className={cn(
                  size === 'sm' ? 'w-3 h-3' :
                  size === 'lg' ? 'w-5 h-5' :
                  size === 'xl' ? 'w-6 h-6' : 'w-4 h-4'
                )} />
              )}
              <span>{t(label.toLowerCase().replace(/\s+/g, '')) || label}</span>
              {Icon && iconPosition === 'right' && (
                <Icon className={cn(
                  size === 'sm' ? 'w-3 h-3' :
                  size === 'lg' ? 'w-5 h-5' :
                  size === 'xl' ? 'w-6 h-6' : 'w-4 h-4',
                  animated && "transition-transform group-hover:translate-x-1"
                )} />
              )}
              {external && (
                <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
              )}
            </a>
          ) : (
            <>
              {Icon && iconPosition === 'left' && (
                <Icon className={cn(
                  size === 'sm' ? 'w-3 h-3' :
                  size === 'lg' ? 'w-5 h-5' :
                  size === 'xl' ? 'w-6 h-6' : 'w-4 h-4'
                )} />
              )}
              <span>{t(label.toLowerCase().replace(/\s+/g, '')) || label}</span>
              {Icon && iconPosition === 'right' && (
                <Icon className={cn(
                  size === 'sm' ? 'w-3 h-3' :
                  size === 'lg' ? 'w-5 h-5' :
                  size === 'xl' ? 'w-6 h-6' : 'w-4 h-4',
                  animated && "transition-transform group-hover:translate-x-1"
                )} />
              )}
            </>
          )}
        </Button>

        {/* Badge */}
        {badge && (
          <Badge
            variant={badge.variant || 'default'}
            className={cn(
              "absolute text-xs px-1.5 py-0.5 pointer-events-none",
              badge.position === 'top-left' && "-top-1 -left-1",
              badge.position === 'top-right' && "-top-1 -right-1",
              badge.position === 'bottom-left' && "-bottom-1 -left-1",
              badge.position === 'bottom-right' && "-bottom-1 -right-1",
              !badge.position && "-top-1 -right-1" // default to top-right
            )}
          >
            {badge.text}
          </Badge>
        )}
      </div>
    )

    return (
      <div key={id} className="inline-block">
        {buttonElement}
      </div>
    )
  }

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4'
  }

  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    stretch: 'justify-stretch'
  }

  const layoutClasses = {
    horizontal: cn(
      'flex flex-wrap items-center',
      alignmentClasses[alignment],
      gapClasses[gap],
      responsive && 'flex-col sm:flex-row'
    ),
    vertical: cn(
      'flex flex-col items-center',
      alignment === 'left' && 'items-start',
      alignment === 'right' && 'items-end',
      alignment === 'stretch' && 'items-stretch',
      gapClasses[gap]
    ),
    grid: cn(
      'grid grid-cols-1 place-items-center',
      buttons.length >= 2 && 'sm:grid-cols-2',
      buttons.length >= 4 && 'lg:grid-cols-4',
      gapClasses[gap]
    ),
    stack: cn(
      'flex flex-col items-center',
      alignment === 'left' && 'items-start',
      alignment === 'right' && 'items-end',
      alignment === 'stretch' && 'items-stretch',
      gapClasses[gap],
      responsive && 'sm:flex-row sm:items-center sm:justify-center'
    )
  }

  return (
    <div className={cn(layoutClasses[layout], className)}>
      {buttons.map((button, index) => renderButton(button, index))}
    </div>
  )
}

// Predefined button groups for common use cases
export const CTA_PRESETS = {
  // Hero Section
  hero: [
    { id: 'primary', ...COMMON_BUTTON_CONFIGS.getStarted },
    { id: 'secondary', ...COMMON_BUTTON_CONFIGS.viewDemo }
  ],

  // Pricing Section
  pricing: [
    { id: 'primary', ...COMMON_BUTTON_CONFIGS.tryFree },
    { id: 'secondary', ...COMMON_BUTTON_CONFIGS.viewPricing }
  ],

  // Contact Section
  contact: [
    { id: 'primary', ...COMMON_BUTTON_CONFIGS.contactUs },
    { id: 'secondary', ...COMMON_BUTTON_CONFIGS.bookDemo },
    { id: 'tertiary', ...COMMON_BUTTON_CONFIGS.callNow }
  ],

  // App Download
  download: [
    { id: 'primary', ...COMMON_BUTTON_CONFIGS.download },
    { id: 'appstore', ...COMMON_BUTTON_CONFIGS.appStore },
    { id: 'googleplay', ...COMMON_BUTTON_CONFIGS.googlePlay }
  ],

  // Footer
  footer: [
    { id: 'primary', ...COMMON_BUTTON_CONFIGS.getStarted, size: 'sm' as const },
    { id: 'secondary', ...COMMON_BUTTON_CONFIGS.documentation, size: 'sm' as const }
  ]
}

export default CTAButtons