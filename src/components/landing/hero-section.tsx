import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  ArrowRight,
  Play,
  Star,
  Users,
  CheckCircle,
  Zap,
  Shield,
  Globe,
  TrendingUp,
  Award,
  Clock,
  Target,
  Sparkles,
  ChevronDown,
  ArrowDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'

export interface HeroSectionProps {
  variant?: 'default' | 'centered' | 'split' | 'video' | 'animated'
  title: string
  subtitle?: string
  description: string
  primaryAction: {
    label: string
    href?: string
    onClick?: () => void
  }
  secondaryAction?: {
    label: string
    href?: string
    onClick?: () => void
  }
  badge?: {
    text: string
    variant?: 'default' | 'secondary' | 'success' | 'warning'
  }
  features?: Array<{
    icon: React.ComponentType<any>
    text: string
  }>
  stats?: Array<{
    value: string
    label: string
    icon?: React.ComponentType<any>
  }>
  testimonial?: {
    text: string
    author: {
      name: string
      title: string
      avatar?: string
    }
    rating?: number
  }
  video?: {
    thumbnail: string
    url: string
    title?: string
  }
  backgroundImage?: string
  gradientOverlay?: boolean
  animated?: boolean
  showScrollIndicator?: boolean
  className?: string
}

export function HeroSection({
  variant = 'default',
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  badge,
  features = [],
  stats = [],
  testimonial,
  video,
  backgroundImage,
  gradientOverlay = true,
  animated = true,
  showScrollIndicator = false,
  className
}: HeroSectionProps) {
  const { t } = useTranslation()
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [typedText, setTypedText] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  // Typing animation effect
  useEffect(() => {
    if (animated && variant === 'animated') {
      let timeout: NodeJS.Timeout
      const textToType = title
      let index = 0

      const typeNextChar = () => {
        if (index < textToType.length) {
          setTypedText(textToType.substring(0, index + 1))
          index++
          timeout = setTimeout(typeNextChar, 100)
        }
      }

      const startTyping = setTimeout(typeNextChar, 500)
      return () => {
        clearTimeout(startTyping)
        clearTimeout(timeout)
      }
    }
  }, [title, animated, variant])

  // Fade in animation
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setIsVisible(true), 100)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(true)
    }
  }, [animated])

  const renderFeatures = () => {
    if (features.length === 0) return null

    return (
      <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <div
              key={index}
              className={cn(
                "flex items-center gap-2 text-sm",
                animated && "opacity-0 animate-in slide-in-from-bottom-4 duration-700",
                animated && `delay-[${(index + 3) * 200}ms]`,
                isVisible && "opacity-100"
              )}
            >
              <Icon className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">{feature.text}</span>
            </div>
          )
        })}
      </div>
    )
  }

  const renderStats = () => {
    if (stats.length === 0) return null

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className={cn(
                "text-center",
                animated && "opacity-0 animate-in slide-in-from-bottom-4 duration-700",
                animated && `delay-[${(index + 4) * 200}ms]`,
                isVisible && "opacity-100"
              )}
            >
              <div className="flex items-center justify-center mb-2">
                {Icon && <Icon className="h-5 w-5 text-primary mr-2" />}
                <span className="text-2xl font-bold text-foreground">{stat.value}</span>
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          )
        })}
      </div>
    )
  }

  const renderTestimonial = () => {
    if (!testimonial) return null

    return (
      <Card className={cn(
        "max-w-md mx-auto mt-12",
        animated && "opacity-0 animate-in slide-in-from-bottom-4 duration-700 delay-1000",
        isVisible && "opacity-100"
      )}>
        <CardContent className="p-6">
          <div className="flex items-center gap-1 mb-3">
            {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <blockquote className="text-sm italic mb-4">
            "{testimonial.text}"
          </blockquote>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={testimonial.author.avatar} />
              <AvatarFallback>{testimonial.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{testimonial.author.name}</p>
              <p className="text-xs text-muted-foreground">{testimonial.author.title}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderVideo = () => {
    if (!video) return null

    return (
      <div className={cn(
        "relative max-w-2xl mx-auto mt-12",
        animated && "opacity-0 animate-in slide-in-from-bottom-4 duration-700 delay-700",
        isVisible && "opacity-100"
      )}>
        <div className="relative rounded-lg overflow-hidden shadow-2xl">
          <img
            src={video.thumbnail}
            alt={video.title || "Video thumbnail"}
            className="w-full h-auto"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="h-16 w-16 rounded-full p-0 bg-white/90 hover:bg-white"
              onClick={() => setIsVideoPlaying(true)}
            >
              <Play className="h-6 w-6 text-primary ml-1" />
            </Button>
          </div>
        </div>
        {video.title && (
          <p className="text-center text-sm text-muted-foreground mt-2">
            {video.title}
          </p>
        )}
      </div>
    )
  }

  const renderContent = () => (
    <div className={cn(
      "container mx-auto px-4",
      variant === 'split' ? "grid lg:grid-cols-2 gap-12 items-center" : "text-center"
    )}>
      <div className={cn(
        variant === 'split' && "lg:text-left"
      )}>
        {/* Badge */}
        {badge && (
          <div className={cn(
            "mb-6",
            animated && "opacity-0 animate-in slide-in-from-bottom-4 duration-700",
            isVisible && "opacity-100"
          )}>
            <Badge
              variant={badge.variant || 'secondary'}
              className="inline-flex items-center gap-2 px-3 py-1 text-sm"
            >
              <Sparkles className="h-3 w-3" />
              {badge.text}
            </Badge>
          </div>
        )}

        {/* Subtitle */}
        {subtitle && (
          <p className={cn(
            "text-lg text-primary font-medium mb-4",
            animated && "opacity-0 animate-in slide-in-from-bottom-4 duration-700 delay-200",
            isVisible && "opacity-100"
          )}>
            {subtitle}
          </p>
        )}

        {/* Title */}
        <h1 className={cn(
          "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6",
          animated && variant !== 'animated' && "opacity-0 animate-in slide-in-from-bottom-4 duration-700 delay-300",
          variant !== 'animated' && isVisible && "opacity-100"
        )}>
          {variant === 'animated' ? (
            <span className="inline-block">
              {typedText}
              <span className="animate-pulse">|</span>
            </span>
          ) : (
            title
          )}
        </h1>

        {/* Description */}
        <p className={cn(
          "text-xl text-muted-foreground mb-8 max-w-2xl",
          variant === 'split' ? "lg:max-w-none" : "mx-auto",
          animated && "opacity-0 animate-in slide-in-from-bottom-4 duration-700 delay-500",
          isVisible && "opacity-100"
        )}>
          {description}
        </p>

        {/* Actions */}
        <div className={cn(
          "flex flex-col sm:flex-row gap-4 mb-8",
          variant === 'split' ? "lg:justify-start" : "justify-center",
          animated && "opacity-0 animate-in slide-in-from-bottom-4 duration-700 delay-700",
          isVisible && "opacity-100"
        )}>
          <Button
            size="lg"
            onClick={primaryAction.onClick}
            className="group"
          >
            {primaryAction.label}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>

          {secondaryAction && (
            <Button
              size="lg"
              variant="outline"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>

        {/* Features */}
        {renderFeatures()}
      </div>

      {/* Right side content for split layout */}
      {variant === 'split' && (
        <div className={cn(
          "relative",
          animated && "opacity-0 animate-in slide-in-from-right-4 duration-700 delay-500",
          isVisible && "opacity-100"
        )}>
          {video ? renderVideo() : (
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8 flex items-center justify-center">
                <div className="w-full h-full bg-card rounded-xl shadow-xl flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Target className="h-16 w-16 text-primary mx-auto" />
                    <h3 className="text-xl font-semibold">{t('poweredByWorkFlow')}</h3>
                    <p className="text-muted-foreground">{t('modernWorkflowSolution')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )

  return (
    <section
      className={cn(
        "relative py-20 lg:py-32 overflow-hidden",
        backgroundImage && "bg-cover bg-center",
        className
      )}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
    >
      {/* Background overlay */}
      {(backgroundImage || gradientOverlay) && (
        <div className={cn(
          "absolute inset-0",
          backgroundImage && gradientOverlay && "bg-gradient-to-r from-background/90 to-background/70",
          !backgroundImage && gradientOverlay && "bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"
        )} />
      )}

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {variant === 'video' && video ? (
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              {renderContent()}
              {renderVideo()}
            </div>
          </div>
        ) : variant === 'centered' ? (
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              {renderContent()}
              {renderStats()}
              {renderTestimonial()}
            </div>
          </div>
        ) : (
          <>
            {renderContent()}
            {stats.length > 0 && (
              <div className="container mx-auto px-4 mt-16">
                {renderStats()}
              </div>
            )}
            {testimonial && (
              <div className="container mx-auto px-4">
                {renderTestimonial()}
              </div>
            )}
          </>
        )}
      </div>

      {/* Scroll indicator */}
      {showScrollIndicator && (
        <div className={cn(
          "absolute bottom-8 left-1/2 transform -translate-x-1/2",
          animated && "opacity-0 animate-in fade-in duration-700 delay-1200",
          isVisible && "opacity-100"
        )}>
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-sm">{t('scrollToExplore')}</span>
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </div>
        </div>
      )}
    </section>
  )
}

export default HeroSection