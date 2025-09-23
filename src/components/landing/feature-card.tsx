import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  ArrowRight,
  ExternalLink,
  Star,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  Zap,
  Shield,
  Globe,
  Target,
  Award,
  Lightbulb,
  Rocket,
  Heart,
  Eye,
  Play,
  Pause,
  ChevronRight,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'

export interface FeatureCardProps {
  variant?: 'default' | 'minimal' | 'detailed' | 'interactive' | 'comparison' | 'testimonial'
  title: string
  description: string
  icon?: React.ComponentType<any> | string
  image?: string
  badges?: Array<{
    text: string
    variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive'
  }>
  features?: string[]
  metrics?: Array<{
    label: string
    value: string
    icon?: React.ComponentType<any>
  }>
  testimonial?: {
    text: string
    author: {
      name: string
      title: string
      avatar?: string
      company?: string
    }
    rating?: number
  }
  comparison?: {
    before: string
    after: string
    improvement: string
  }
  action?: {
    label: string
    href?: string
    onClick?: () => void
    variant?: 'default' | 'secondary' | 'outline' | 'ghost'
  }
  secondaryAction?: {
    label: string
    href?: string
    onClick?: () => void
  }
  interactive?: {
    demo?: boolean
    video?: string
    liveDemoUrl?: string
  }
  status?: 'new' | 'popular' | 'coming_soon' | 'beta'
  priority?: boolean
  animated?: boolean
  hoverable?: boolean
  className?: string
}

const iconMap = {
  zap: Zap,
  shield: Shield,
  globe: Globe,
  users: Users,
  target: Target,
  award: Award,
  lightbulb: Lightbulb,
  rocket: Rocket,
  heart: Heart,
  eye: Eye,
  trending: TrendingUp,
  check: CheckCircle,
  clock: Clock,
  star: Star,
  sparkles: Sparkles
}

export function FeatureCard({
  variant = 'default',
  title,
  description,
  icon,
  image,
  badges = [],
  features = [],
  metrics = [],
  testimonial,
  comparison,
  action,
  secondaryAction,
  interactive,
  status,
  priority = false,
  animated = true,
  hoverable = true,
  className
}: FeatureCardProps) {
  const { t } = useTranslation()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Get icon component
  const IconComponent = typeof icon === 'string' ? iconMap[icon as keyof typeof iconMap] : icon

  const getStatusBadge = () => {
    if (!status) return null

    const statusConfig = {
      new: { text: t('new'), variant: 'default' as const },
      popular: { text: t('popular'), variant: 'success' as const },
      coming_soon: { text: t('comingSoon'), variant: 'secondary' as const },
      beta: { text: t('beta'), variant: 'warning' as const }
    }

    const config = statusConfig[status]
    return (
      <Badge variant={config.variant} className="absolute top-4 right-4 z-10">
        {config.text}
      </Badge>
    )
  }

  const renderIcon = () => {
    if (image) {
      return (
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
      )
    }

    if (IconComponent) {
      return (
        <div className={cn(
          "w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center transition-colors",
          isHovered && "bg-primary/20"
        )}>
          <IconComponent className="w-6 h-6 text-primary" />
        </div>
      )
    }

    return null
  }

  const renderFeatures = () => {
    if (features.length === 0) return null

    return (
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>
    )
  }

  const renderMetrics = () => {
    if (metrics.length === 0) return null

    return (
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => {
          const MetricIcon = metric.icon
          return (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center mb-1">
                {MetricIcon && <MetricIcon className="w-4 h-4 text-primary mr-1" />}
                <span className="text-lg font-bold text-foreground">{metric.value}</span>
              </div>
              <p className="text-xs text-muted-foreground">{metric.label}</p>
            </div>
          )
        })}
      </div>
    )
  }

  const renderTestimonial = () => {
    if (!testimonial) return null

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-1">
          {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <blockquote className="text-sm italic text-muted-foreground">
          "{testimonial.text}"
        </blockquote>
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={testimonial.author.avatar} />
            <AvatarFallback>{testimonial.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{testimonial.author.name}</p>
            <p className="text-xs text-muted-foreground">
              {testimonial.author.title}
              {testimonial.author.company && ` at ${testimonial.author.company}`}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const renderComparison = () => {
    if (!comparison) return null

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-xs text-red-600 font-medium mb-1">{t('before')}</p>
            <p className="text-sm text-red-800">{comparison.before}</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs text-green-600 font-medium mb-1">{t('after')}</p>
            <p className="text-sm text-green-800">{comparison.after}</p>
          </div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-600 font-medium mb-1">{t('improvement')}</p>
          <p className="text-sm font-bold text-blue-800">{comparison.improvement}</p>
        </div>
      </div>
    )
  }

  const renderInteractive = () => {
    if (!interactive) return null

    return (
      <div className="space-y-3">
        {interactive.demo && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                {t('pauseDemo')}
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                {t('watchDemo')}
              </>
            )}
          </Button>
        )}

        {interactive.liveDemoUrl && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => window.open(interactive.liveDemoUrl, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            {t('tryLiveDemo')}
          </Button>
        )}
      </div>
    )
  }

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div
        className={cn(
          "group flex items-start gap-4 p-4 rounded-lg transition-all duration-200",
          hoverable && "hover:bg-muted/50",
          animated && "opacity-0 animate-in slide-in-from-bottom-4 duration-500",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {renderIcon()}
        <div className="flex-1">
          <h3 className="font-semibold mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
          {action && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 p-0 h-auto font-normal text-primary hover:text-primary/80"
              onClick={action.onClick}
            >
              {action.label}
              <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  // Testimonial variant
  if (variant === 'testimonial') {
    return (
      <Card
        className={cn(
          "group relative",
          hoverable && "hover:shadow-lg transition-all duration-200",
          animated && "opacity-0 animate-in slide-in-from-bottom-4 duration-500",
          priority && "ring-2 ring-primary/20",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {getStatusBadge()}
        <CardContent className="p-6">
          {renderTestimonial()}
        </CardContent>
      </Card>
    )
  }

  // Comparison variant
  if (variant === 'comparison') {
    return (
      <Card
        className={cn(
          "group relative",
          hoverable && "hover:shadow-lg transition-all duration-200",
          animated && "opacity-0 animate-in slide-in-from-bottom-4 duration-500",
          priority && "ring-2 ring-primary/20",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {getStatusBadge()}
        <CardHeader className="pb-4">
          <div className="flex items-start gap-4">
            {renderIcon()}
            <div className="flex-1">
              <CardTitle className="text-lg">{title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {renderComparison()}
          {action && (
            <Button
              className="w-full mt-4 group"
              variant={action.variant || 'default'}
              onClick={action.onClick}
            >
              {action.label}
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  // Interactive variant
  if (variant === 'interactive') {
    return (
      <Card
        className={cn(
          "group relative overflow-hidden",
          hoverable && "hover:shadow-lg transition-all duration-200",
          animated && "opacity-0 animate-in slide-in-from-bottom-4 duration-500",
          priority && "ring-2 ring-primary/20",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {getStatusBadge()}

        {/* Interactive background effect */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )} />

        <CardHeader className="relative">
          <div className="flex items-start gap-4">
            {renderIcon()}
            <div className="flex-1">
              <CardTitle className="text-lg">{title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative pt-0 space-y-4">
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {badges.map((badge, index) => (
                <Badge key={index} variant={badge.variant || 'secondary'}>
                  {badge.text}
                </Badge>
              ))}
            </div>
          )}

          {features.length > 0 && renderFeatures()}
          {metrics.length > 0 && renderMetrics()}
          {renderInteractive()}

          {action && (
            <Button
              className="w-full group"
              variant={action.variant || 'default'}
              onClick={action.onClick}
            >
              {action.label}
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  // Detailed variant
  if (variant === 'detailed') {
    return (
      <Card
        className={cn(
          "group relative h-full",
          hoverable && "hover:shadow-lg transition-all duration-200",
          animated && "opacity-0 animate-in slide-in-from-bottom-4 duration-500",
          priority && "ring-2 ring-primary/20",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {getStatusBadge()}
        <CardHeader>
          <div className="flex items-start gap-4">
            {renderIcon()}
            <div className="flex-1">
              <CardTitle className="text-lg">{title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {badges.map((badge, index) => (
                <Badge key={index} variant={badge.variant || 'secondary'}>
                  {badge.text}
                </Badge>
              ))}
            </div>
          )}

          {features.length > 0 && renderFeatures()}
          {metrics.length > 0 && renderMetrics()}
          {testimonial && renderTestimonial()}

          <div className="flex flex-col gap-2 mt-auto pt-4">
            {action && (
              <Button
                className="group"
                variant={action.variant || 'default'}
                onClick={action.onClick}
              >
                {action.label}
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            )}

            {secondaryAction && (
              <Button
                variant="outline"
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default variant
  return (
    <Card
      className={cn(
        "group relative h-full",
        hoverable && "hover:shadow-md transition-all duration-200",
        animated && "opacity-0 animate-in slide-in-from-bottom-4 duration-500",
        priority && "ring-2 ring-primary/20",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {getStatusBadge()}
      <CardHeader>
        <div className="flex items-start gap-4">
          {renderIcon()}
          <div className="flex-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {badges.map((badge, index) => (
              <Badge key={index} variant={badge.variant || 'secondary'}>
                {badge.text}
              </Badge>
            ))}
          </div>
        )}

        {features.length > 0 && (
          <div className="mb-4">
            {renderFeatures()}
          </div>
        )}

        {action && (
          <Button
            className="w-full group"
            variant={action.variant || 'default'}
            onClick={action.onClick}
          >
            {action.label}
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default FeatureCard