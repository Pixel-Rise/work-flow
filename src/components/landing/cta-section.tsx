import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Zap,
  Shield,
  Globe,
  TrendingUp,
  Clock,
  Target,
  Sparkles,
  Gift,
  Award,
  Heart,
  Download,
  Play,
  Phone,
  Mail,
  Calendar
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'

export interface CTAAction {
  label: string
  href?: string
  onClick?: () => void
  variant?: 'default' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
  icon?: React.ComponentType<any>
}

export interface CTASectionProps {
  variant?: 'default' | 'minimal' | 'card' | 'banner' | 'split' | 'newsletter' | 'app-download'
  title: string
  subtitle?: string
  description?: string
  primaryAction: CTAAction
  secondaryAction?: CTAAction
  badge?: {
    text: string
    variant?: 'default' | 'secondary' | 'success' | 'warning'
  }
  features?: Array<{
    icon?: React.ComponentType<any>
    text: string
  }>
  urgency?: {
    text: string
    type?: 'limited-time' | 'limited-quantity' | 'countdown'
    endDate?: Date
  }
  social?: {
    proof?: {
      count: string
      text: string
      icon?: React.ComponentType<any>
    }
    testimonial?: {
      text: string
      author: string
      title: string
      avatar?: string
    }
  }
  backgroundImage?: string
  gradientOverlay?: boolean
  centered?: boolean
  fullWidth?: boolean
  animated?: boolean
  className?: string
}

export function CTASection({
  variant = 'default',
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  badge,
  features = [],
  urgency,
  social,
  backgroundImage,
  gradientOverlay = true,
  centered = true,
  fullWidth = false,
  animated = true,
  className
}: CTASectionProps) {
  const { t } = useTranslation()

  const renderCountdown = () => {
    if (!urgency || urgency.type !== 'countdown' || !urgency.endDate) return null

    // Simple countdown display - in real app would use live countdown
    const timeLeft = urgency.endDate.getTime() - new Date().getTime()
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))

    return (
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{days}</div>
          <div className="text-xs text-muted-foreground">{t('days')}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{hours}</div>
          <div className="text-xs text-muted-foreground">{t('hours')}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{minutes}</div>
          <div className="text-xs text-muted-foreground">{t('minutes')}</div>
        </div>
      </div>
    )
  }

  const renderActions = () => (
    <div className={cn(
      "flex gap-3",
      variant === 'split' ? "justify-start" : "justify-center",
      centered && variant !== 'split' && "justify-center",
      "flex-wrap"
    )}>
      <Button
        size={primaryAction.size || 'lg'}
        variant={primaryAction.variant || 'default'}
        onClick={primaryAction.onClick}
        className={cn(
          "group",
          animated && "transition-all duration-200 hover:scale-105"
        )}
      >
        {primaryAction.icon && <primaryAction.icon className="w-4 h-4 mr-2" />}
        {primaryAction.label}
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Button>

      {secondaryAction && (
        <Button
          size={secondaryAction.size || 'lg'}
          variant={secondaryAction.variant || 'outline'}
          onClick={secondaryAction.onClick}
          className={cn(
            animated && "transition-all duration-200 hover:scale-105"
          )}
        >
          {secondaryAction.icon && <secondaryAction.icon className="w-4 h-4 mr-2" />}
          {secondaryAction.label}
        </Button>
      )}
    </div>
  )

  const renderFeatures = () => {
    if (features.length === 0) return null

    return (
      <div className="flex flex-wrap items-center justify-center gap-6 mt-6">
        {features.map((feature, index) => {
          const Icon = feature.icon || CheckCircle
          return (
            <div
              key={index}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Icon className="h-4 w-4 text-green-500" />
              <span>{feature.text}</span>
            </div>
          )
        })}
      </div>
    )
  }

  const renderSocialProof = () => {
    if (!social?.proof) return null

    const ProofIcon = social.proof.icon || Users

    return (
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-4">
        <ProofIcon className="h-4 w-4" />
        <span>
          <strong className="text-foreground">{social.proof.count}</strong> {social.proof.text}
        </span>
      </div>
    )
  }

  const renderTestimonial = () => {
    if (!social?.testimonial) return null

    return (
      <div className="max-w-md mx-auto mt-6">
        <Card className="border-0 bg-background/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <blockquote className="text-sm italic mb-3">
              "{social.testimonial.text}"
            </blockquote>
            <div className="flex items-center gap-2">
              {social.testimonial.avatar && (
                <img
                  src={social.testimonial.avatar}
                  alt={social.testimonial.author}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <div>
                <p className="text-xs font-medium">{social.testimonial.author}</p>
                <p className="text-xs text-muted-foreground">{social.testimonial.title}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderContent = () => (
    <div className={cn(
      "space-y-6",
      variant === 'split' ? "text-left" : "text-center",
      centered && variant !== 'split' && "text-center"
    )}>
      {/* Badge */}
      {badge && (
        <div>
          <Badge
            variant={badge.variant || 'secondary'}
            className="inline-flex items-center gap-2 px-3 py-1"
          >
            <Sparkles className="h-3 w-3" />
            {badge.text}
          </Badge>
        </div>
      )}

      {/* Subtitle */}
      {subtitle && (
        <p className="text-lg text-primary font-medium">
          {subtitle}
        </p>
      )}

      {/* Title */}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
        {title}
      </h2>

      {/* Description */}
      {description && (
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {description}
        </p>
      )}

      {/* Urgency */}
      {urgency && (
        <div className="space-y-4">
          {urgency.type === 'countdown' ? (
            renderCountdown()
          ) : (
            <div className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full",
              urgency.type === 'limited-time' && "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
              urgency.type === 'limited-quantity' && "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
            )}>
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">{urgency.text}</span>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      {renderActions()}

      {/* Features */}
      {renderFeatures()}

      {/* Social Proof */}
      {renderSocialProof()}

      {/* Testimonial */}
      {renderTestimonial()}
    </div>
  )

  // Variant-specific layouts
  switch (variant) {
    case 'minimal':
      return (
        <section className={cn("py-12", className)}>
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              {renderContent()}
            </div>
          </div>
        </section>
      )

    case 'card':
      return (
        <section className={cn("py-16", className)}>
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto">
              <CardContent className="p-12">
                {renderContent()}
              </CardContent>
            </Card>
          </div>
        </section>
      )

    case 'banner':
      return (
        <section className={cn(
          "relative py-4 bg-primary text-primary-foreground",
          className
        )}>
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  <span className="font-medium">{title}</span>
                </div>
                {description && (
                  <span className="text-sm opacity-90 hidden md:inline">
                    {description}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={primaryAction.onClick}
                  className="whitespace-nowrap"
                >
                  {primaryAction.label}
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      )

    case 'split':
      return (
        <section className={cn(
          "relative py-20 lg:py-32",
          backgroundImage && "bg-cover bg-center",
          className
        )}
        style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
        >
          {(backgroundImage || gradientOverlay) && (
            <div className={cn(
              "absolute inset-0",
              backgroundImage && gradientOverlay && "bg-gradient-to-r from-background/90 to-background/70",
              !backgroundImage && gradientOverlay && "bg-gradient-to-br from-primary/5 to-secondary/5"
            )} />
          )}

          <div className="relative container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                {renderContent()}
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8 flex items-center justify-center">
                  <div className="w-full h-full bg-card rounded-xl shadow-xl flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <Target className="h-16 w-16 text-primary mx-auto" />
                      <h3 className="text-xl font-semibold">{t('readyToStart')}</h3>
                      <p className="text-muted-foreground">{t('joinThousands')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )

    case 'newsletter':
      return (
        <section className={cn("py-16", className)}>
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold">{title}</h3>
                    {description && (
                      <p className="text-muted-foreground">{description}</p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <input
                      type="email"
                      placeholder={t('enterEmail')}
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button onClick={primaryAction.onClick}>
                      {primaryAction.label}
                    </Button>
                  </div>

                  {renderFeatures()}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )

    case 'app-download':
      return (
        <section className={cn("py-16", className)}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
                {description && (
                  <p className="text-xl text-muted-foreground">{description}</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  onClick={primaryAction.onClick}
                  className="w-full sm:w-auto"
                >
                  <Download className="w-5 h-5 mr-2" />
                  {primaryAction.label}
                </Button>

                {secondaryAction && (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={secondaryAction.onClick}
                    className="w-full sm:w-auto"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    {secondaryAction.label}
                  </Button>
                )}
              </div>

              {renderFeatures()}
              {renderSocialProof()}
            </div>
          </div>
        </section>
      )

    default:
      return (
        <section className={cn(
          "relative py-20 lg:py-32",
          backgroundImage && "bg-cover bg-center",
          className
        )}
        style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
        >
          {(backgroundImage || gradientOverlay) && (
            <div className={cn(
              "absolute inset-0",
              backgroundImage && gradientOverlay && "bg-gradient-to-r from-background/90 to-background/70",
              !backgroundImage && gradientOverlay && "bg-gradient-to-br from-primary/5 to-secondary/5"
            )} />
          )}

          <div className="relative container mx-auto px-4">
            <div className={cn(
              "max-w-4xl",
              centered && "mx-auto",
              fullWidth && "max-w-none"
            )}>
              {renderContent()}
            </div>
          </div>
        </section>
      )
  }
}

export default CTASection