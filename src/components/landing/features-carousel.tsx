import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Dot,
  ArrowRight,
  ExternalLink,
  Zap,
  Shield,
  Users,
  Globe,
  Star,
  Rocket,
  Heart,
  Award,
  Sparkles,
  Eye,
  MousePointer,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'

export interface Feature {
  id: string
  title: string
  description: string
  icon?: React.ComponentType<any>
  image?: string
  video?: string
  badge?: {
    text: string
    variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive'
  }
  link?: {
    text: string
    href: string
    external?: boolean
  }
  stats?: {
    value: string
    label: string
  }[]
  highlighted?: boolean
  comingSoon?: boolean
}

export interface FeaturesCarouselProps {
  features: Feature[]
  variant?: 'default' | 'compact' | 'showcase' | 'grid'
  autoplay?: boolean
  autoplayInterval?: number
  showDots?: boolean
  showArrows?: boolean
  showPlayPause?: boolean
  itemsPerView?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
  height?: 'auto' | 'fixed' | 'full'
  backgroundPattern?: boolean
  centerMode?: boolean
  infinite?: boolean
  responsive?: {
    mobile?: number
    tablet?: number
    desktop?: number
  }
  onFeatureClick?: (feature: Feature) => void
  className?: string
}

export function FeaturesCarousel({
  features,
  variant = 'default',
  autoplay = true,
  autoplayInterval = 5000,
  showDots = true,
  showArrows = true,
  showPlayPause = true,
  itemsPerView = 1,
  gap = 'md',
  height = 'auto',
  backgroundPattern = false,
  centerMode = false,
  infinite = true,
  responsive = {
    mobile: 1,
    tablet: 2,
    desktop: itemsPerView
  },
  onFeatureClick,
  className
}: FeaturesCarouselProps) {
  const { t } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoplay)
  const [isPaused, setIsPaused] = useState(false)

  const totalSlides = features.length
  const maxIndex = infinite ? totalSlides : Math.max(0, totalSlides - itemsPerView)

  // Auto-advance slides
  useEffect(() => {
    if (!isPlaying || isPaused || totalSlides <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (infinite) {
          return (prev + 1) % totalSlides
        }
        return prev >= maxIndex ? 0 : prev + 1
      })
    }, autoplayInterval)

    return () => clearInterval(interval)
  }, [isPlaying, isPaused, autoplayInterval, totalSlides, maxIndex, infinite])

  // Pause on hover
  const handleMouseEnter = () => setIsPaused(true)
  const handleMouseLeave = () => setIsPaused(false)

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex(prev => {
      if (infinite) {
        return prev === 0 ? totalSlides - 1 : prev - 1
      }
      return Math.max(0, prev - 1)
    })
  }

  const goToNext = () => {
    setCurrentIndex(prev => {
      if (infinite) {
        return (prev + 1) % totalSlides
      }
      return Math.min(maxIndex, prev + 1)
    })
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const renderFeature = (feature: Feature, index: number) => {
    const isActive = index === currentIndex
    const IconComponent = feature.icon || Sparkles

    const featureCard = (
      <Card
        className={cn(
          "group cursor-pointer transition-all duration-300",
          variant === 'showcase' && "hover:shadow-xl hover:scale-105",
          variant === 'compact' && "hover:shadow-md",
          feature.highlighted && "ring-2 ring-primary/20 bg-primary/5",
          feature.comingSoon && "opacity-75",
          isActive && centerMode && "scale-105 z-10"
        )}
        onClick={() => onFeatureClick?.(feature)}
      >
        <CardContent className={cn(
          "p-6",
          variant === 'compact' && "p-4",
          height === 'fixed' && "h-80",
          height === 'full' && "h-full"
        )}>
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Icon */}
              <div className={cn(
                "p-2 rounded-lg flex-shrink-0",
                feature.highlighted ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              )}>
                <IconComponent className={cn(
                  variant === 'compact' ? "w-5 h-5" : "w-6 h-6"
                )} />
              </div>

              {/* Title and Badge */}
              <div className="min-w-0 flex-1">
                <h3 className={cn(
                  "font-semibold truncate",
                  variant === 'compact' ? "text-sm" : "text-lg"
                )}>
                  {feature.title}
                </h3>
                {feature.badge && (
                  <Badge
                    variant={feature.badge.variant || 'secondary'}
                    className="mt-1 text-xs"
                  >
                    {feature.badge.text}
                  </Badge>
                )}
              </div>
            </div>

            {feature.comingSoon && (
              <Badge variant="outline" className="text-xs">
                {t('comingSoon')}
              </Badge>
            )}
          </div>

          {/* Media */}
          {(feature.image || feature.video) && (
            <div className={cn(
              "relative mb-4 rounded-lg overflow-hidden bg-muted",
              variant === 'compact' ? "h-32" : "h-48"
            )}>
              {feature.video ? (
                <video
                  src={feature.video}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  autoPlay={isActive}
                />
              ) : (
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}

              {/* Play overlay for videos */}
              {feature.video && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="secondary" className="rounded-full">
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <p className={cn(
            "text-muted-foreground mb-4",
            variant === 'compact' ? "text-sm line-clamp-2" : "line-clamp-3"
          )}>
            {feature.description}
          </p>

          {/* Stats */}
          {feature.stats && feature.stats.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mb-4 py-3 border-t">
              {feature.stats.map((stat, statIndex) => (
                <div key={statIndex} className="text-center">
                  <div className="text-lg font-bold text-primary">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Link */}
          {feature.link && (
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-primary hover:text-primary/80"
              >
                <a
                  href={feature.link.href}
                  target={feature.link.external ? '_blank' : undefined}
                  rel={feature.link.external ? 'noopener noreferrer' : undefined}
                  onClick={(e) => e.stopPropagation()}
                >
                  {feature.link.text}
                  {feature.link.external ? (
                    <ExternalLink className="ml-1 w-3 h-3" />
                  ) : (
                    <ArrowRight className="ml-1 w-3 h-3" />
                  )}
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    )

    return (
      <div
        key={feature.id}
        className={cn(
          "flex-shrink-0 w-full",
          itemsPerView > 1 && "px-2"
        )}
        style={{
          width: `${100 / itemsPerView}%`
        }}
      >
        {featureCard}
      </div>
    )
  }

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  }

  if (variant === 'grid') {
    return (
      <div className={cn("space-y-6", className)}>
        <div className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
          gapClasses[gap]
        )}>
          {features.map((feature, index) => renderFeature(feature, index))}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative",
        backgroundPattern && "bg-gradient-to-r from-background via-muted/20 to-background",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Carousel Container */}
      <div className="relative overflow-hidden rounded-lg">
        <div
          className={cn(
            "flex transition-transform duration-500 ease-out",
            gapClasses[gap]
          )}
          style={{
            transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)`,
            width: `${(totalSlides * 100) / itemsPerView}%`
          }}
        >
          {features.map((feature, index) => renderFeature(feature, index))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && totalSlides > itemsPerView && (
        <>
          <Button
            variant="outline"
            size="sm"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
            onClick={goToPrevious}
            disabled={!infinite && currentIndex === 0}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
            onClick={goToNext}
            disabled={!infinite && currentIndex >= maxIndex}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-6">
        {/* Dots */}
        {showDots && totalSlides > 1 && (
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.ceil(totalSlides / itemsPerView) }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-200",
                  Math.floor(currentIndex / itemsPerView) === index
                    ? "bg-primary w-6"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
              />
            ))}
          </div>
        )}

        {/* Play/Pause */}
        {showPlayPause && totalSlides > 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePlayPause}
            className="flex items-center gap-1"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3 h-3" />
                <span className="text-xs">{t('pause')}</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3" />
                <span className="text-xs">{t('play')}</span>
              </>
            )}
          </Button>
        )}
      </div>

      {/* Progress Indicator */}
      {isPlaying && !isPaused && (
        <div className="absolute bottom-0 left-0 h-1 bg-primary/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-100 ease-linear"
            style={{
              width: `${((Date.now() % autoplayInterval) / autoplayInterval) * 100}%`
            }}
          />
        </div>
      )}
    </div>
  )
}

// Predefined feature sets for common use cases
export const FEATURE_PRESETS = {
  // Product features
  productivity: [
    {
      id: 'automation',
      title: 'Smart Automation',
      description: 'Automate repetitive tasks and workflows with AI-powered automation.',
      icon: Zap,
      highlighted: true,
      stats: [
        { value: '75%', label: 'Time Saved' },
        { value: '99%', label: 'Accuracy' }
      ]
    },
    {
      id: 'collaboration',
      title: 'Team Collaboration',
      description: 'Work together seamlessly with real-time collaboration tools.',
      icon: Users,
      stats: [
        { value: '10x', label: 'Faster' },
        { value: '50+', label: 'Integrations' }
      ]
    },
    {
      id: 'security',
      title: 'Enterprise Security',
      description: 'Bank-level security with end-to-end encryption and compliance.',
      icon: Shield,
      badge: { text: 'SOC 2', variant: 'success' }
    }
  ],

  // Service features
  platform: [
    {
      id: 'global',
      title: 'Global Scale',
      description: 'Deploy worldwide with our global infrastructure and CDN.',
      icon: Globe,
      stats: [
        { value: '99.9%', label: 'Uptime' },
        { value: '100+', label: 'Regions' }
      ]
    },
    {
      id: 'performance',
      title: 'Lightning Fast',
      description: 'Optimized for speed with sub-second response times.',
      icon: Rocket,
      highlighted: true
    },
    {
      id: 'support',
      title: '24/7 Support',
      description: 'Get help when you need it with our expert support team.',
      icon: Heart,
      badge: { text: 'Premium', variant: 'warning' }
    }
  ]
}

export default FeaturesCarousel