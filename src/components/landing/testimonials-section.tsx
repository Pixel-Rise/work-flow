import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Play,
  ExternalLink,
  Verified,
  Award,
  Users,
  Building,
  MapPin,
  Calendar,
  ThumbsUp,
  MessageSquare,
  Share2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'

export interface Testimonial {
  id: string
  name: string
  title: string
  company?: string
  location?: string
  avatar?: string
  rating: number
  text: string
  date?: string
  verified?: boolean
  featured?: boolean
  tags?: string[]
  metrics?: {
    improvement?: string
    timeframe?: string
    category?: string
  }
  media?: {
    type: 'image' | 'video'
    url: string
    thumbnail?: string
  }
  social?: {
    platform?: string
    handle?: string
    url?: string
  }
}

export interface TestimonialsSectionProps {
  variant?: 'default' | 'carousel' | 'grid' | 'featured' | 'masonry' | 'video' | 'compact'
  title?: string
  subtitle?: string
  description?: string
  testimonials: Testimonial[]
  showRatings?: boolean
  showCompanies?: boolean
  showMetrics?: boolean
  autoplay?: boolean
  autoplayInterval?: number
  itemsPerView?: 1 | 2 | 3
  badge?: {
    text: string
    variant?: 'default' | 'secondary' | 'success' | 'warning'
  }
  backgroundColor?: 'default' | 'muted' | 'primary' | 'transparent'
  className?: string
}

export function TestimonialsSection({
  variant = 'default',
  title,
  subtitle,
  description,
  testimonials,
  showRatings = true,
  showCompanies = true,
  showMetrics = false,
  autoplay = false,
  autoplayInterval = 5000,
  itemsPerView = 1,
  badge,
  backgroundColor = 'default',
  className
}: TestimonialsSectionProps) {
  const { t } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-advance carousel
  React.useEffect(() => {
    if (autoplay && variant === 'carousel') {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
      }, autoplayInterval)
      return () => clearInterval(interval)
    }
  }, [autoplay, autoplayInterval, testimonials.length, variant])

  const renderStars = (rating: number) => {
    if (!showRatings) return null

    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-4 w-4",
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
            )}
          />
        ))}
      </div>
    )
  }

  const renderQuote = (testimonial: Testimonial) => (
    <div className="relative">
      <Quote className="absolute -top-2 -left-2 h-8 w-8 text-primary/20" />
      <blockquote className="text-lg italic leading-relaxed pl-6">
        "{testimonial.text}"
      </blockquote>
    </div>
  )

  const renderAuthor = (testimonial: Testimonial) => (
    <div className="flex items-center gap-3">
      <Avatar className="h-12 w-12">
        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-foreground">{testimonial.name}</p>
          {testimonial.verified && (
            <Verified className="h-4 w-4 text-blue-500" />
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{testimonial.title}</p>
          {showCompanies && testimonial.company && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Building className="h-3 w-3" />
              <span>{testimonial.company}</span>
              {testimonial.location && (
                <>
                  <span>•</span>
                  <MapPin className="h-3 w-3" />
                  <span>{testimonial.location}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderMetrics = (testimonial: Testimonial) => {
    if (!showMetrics || !testimonial.metrics) return null

    return (
      <div className="flex flex-wrap gap-2 mt-4">
        {testimonial.metrics.improvement && (
          <Badge variant="success" className="text-xs">
            <TrendingUp className="h-3 w-3 mr-1" />
            {testimonial.metrics.improvement}
          </Badge>
        )}
        {testimonial.metrics.timeframe && (
          <Badge variant="secondary" className="text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            {testimonial.metrics.timeframe}
          </Badge>
        )}
        {testimonial.metrics.category && (
          <Badge variant="outline" className="text-xs">
            {testimonial.metrics.category}
          </Badge>
        )}
      </div>
    )
  }

  const renderTestimonial = (testimonial: Testimonial, index?: number) => {
    const content = (
      <div className="space-y-4">
        {showRatings && (
          <div className="flex items-center justify-between">
            {renderStars(testimonial.rating)}
            {testimonial.date && (
              <span className="text-xs text-muted-foreground">{testimonial.date}</span>
            )}
          </div>
        )}

        {testimonial.media && (
          <div className="relative rounded-lg overflow-hidden">
            {testimonial.media.type === 'video' ? (
              <div className="relative aspect-video bg-muted">
                <img
                  src={testimonial.media.thumbnail || testimonial.media.url}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Button size="lg" variant="secondary" className="rounded-full p-3">
                    <Play className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            ) : (
              <img
                src={testimonial.media.url}
                alt="Testimonial media"
                className="w-full h-auto rounded-lg"
              />
            )}
          </div>
        )}

        {renderQuote(testimonial)}
        {renderAuthor(testimonial)}
        {renderMetrics(testimonial)}

        {testimonial.tags && (
          <div className="flex flex-wrap gap-1">
            {testimonial.tags.map((tag, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {testimonial.social && (
          <div className="flex items-center gap-2 pt-2 border-t">
            <Button size="sm" variant="ghost" className="text-xs">
              <ThumbsUp className="h-3 w-3 mr-1" />
              {t('helpful')}
            </Button>
            <Button size="sm" variant="ghost" className="text-xs">
              <Share2 className="h-3 w-3 mr-1" />
              {t('share')}
            </Button>
            {testimonial.social.url && (
              <Button size="sm" variant="ghost" className="text-xs">
                <ExternalLink className="h-3 w-3 mr-1" />
                {t('viewOriginal')}
              </Button>
            )}
          </div>
        )}
      </div>
    )

    if (variant === 'grid' || variant === 'masonry' || variant === 'featured') {
      return (
        <Card
          key={testimonial.id}
          className={cn(
            "group transition-all duration-200 hover:shadow-md",
            testimonial.featured && "ring-2 ring-primary/20 bg-primary/5"
          )}
        >
          <CardContent className="p-6">
            {content}
          </CardContent>
        </Card>
      )
    }

    return (
      <div key={testimonial.id} className="w-full">
        <Card className="mx-auto max-w-4xl">
          <CardContent className="p-8">
            {content}
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderHeader = () => {
    if (!title && !subtitle && !description && !badge) return null

    return (
      <div className="text-center space-y-4 mb-12">
        {badge && (
          <Badge variant={badge.variant || 'secondary'} className="mb-2">
            {badge.text}
          </Badge>
        )}

        {subtitle && (
          <p className="text-lg text-primary font-medium">
            {subtitle}
          </p>
        )}

        {title && (
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {title}
          </h2>
        )}

        {description && (
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {description}
          </p>
        )}
      </div>
    )
  }

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  // Variant-specific layouts
  switch (variant) {
    case 'carousel':
      return (
        <section className={cn(
          "py-16",
          backgroundColor === 'muted' && "bg-muted/50",
          backgroundColor === 'primary' && "bg-primary/5",
          className
        )}>
          <div className="container mx-auto px-4">
            {renderHeader()}

            <div className="relative">
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
                  }}
                >
                  {testimonials.map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className={cn(
                        "flex-shrink-0 px-3",
                        itemsPerView === 1 && "w-full",
                        itemsPerView === 2 && "w-1/2",
                        itemsPerView === 3 && "w-1/3"
                      )}
                    >
                      {renderTestimonial(testimonial)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={prevTestimonial}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-colors",
                        index === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={nextTestimonial}
                  disabled={currentIndex === testimonials.length - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      )

    case 'grid':
      return (
        <section className={cn(
          "py-16",
          backgroundColor === 'muted' && "bg-muted/50",
          backgroundColor === 'primary' && "bg-primary/5",
          className
        )}>
          <div className="container mx-auto px-4">
            {renderHeader()}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => renderTestimonial(testimonial))}
            </div>
          </div>
        </section>
      )

    case 'featured':
      const featuredTestimonial = testimonials.find(t => t.featured) || testimonials[0]
      const otherTestimonials = testimonials.filter(t => t.id !== featuredTestimonial.id).slice(0, 4)

      return (
        <section className={cn(
          "py-16",
          backgroundColor === 'muted' && "bg-muted/50",
          backgroundColor === 'primary' && "bg-primary/5",
          className
        )}>
          <div className="container mx-auto px-4">
            {renderHeader()}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Featured */}
              <div>
                <Card className="h-full bg-primary text-primary-foreground">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      <Badge variant="secondary" className="text-primary bg-white">
                        {t('featured')}
                      </Badge>
                    </div>
                    {renderStars(featuredTestimonial.rating)}
                    <blockquote className="text-xl italic leading-relaxed">
                      "{featuredTestimonial.text}"
                    </blockquote>
                    <div className="flex items-center gap-3 pt-4 border-t border-white/20">
                      <Avatar className="h-12 w-12 ring-2 ring-white/20">
                        <AvatarImage src={featuredTestimonial.avatar} />
                        <AvatarFallback className="bg-white/10">
                          {featuredTestimonial.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{featuredTestimonial.name}</p>
                        <p className="text-sm opacity-90">{featuredTestimonial.title}</p>
                        {featuredTestimonial.company && (
                          <p className="text-xs opacity-75">{featuredTestimonial.company}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Other testimonials */}
              <div className="space-y-4">
                {otherTestimonials.map((testimonial) => renderTestimonial(testimonial))}
              </div>
            </div>
          </div>
        </section>
      )

    case 'masonry':
      return (
        <section className={cn(
          "py-16",
          backgroundColor === 'muted' && "bg-muted/50",
          backgroundColor === 'primary' && "bg-primary/5",
          className
        )}>
          <div className="container mx-auto px-4">
            {renderHeader()}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="break-inside-avoid">
                  {renderTestimonial(testimonial)}
                </div>
              ))}
            </div>
          </div>
        </section>
      )

    case 'compact':
      return (
        <section className={cn(
          "py-12",
          backgroundColor === 'muted' && "bg-muted/50",
          backgroundColor === 'primary' && "bg-primary/5",
          className
        )}>
          <div className="container mx-auto px-4">
            {renderHeader()}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="hover:shadow-md transition-all duration-200">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      {renderStars(testimonial.rating)}
                      {testimonial.verified && (
                        <Verified className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <p className="text-sm italic">"{testimonial.text}"</p>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={testimonial.avatar} />
                        <AvatarFallback className="text-xs">
                          {testimonial.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {testimonial.title}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )

    default:
      return (
        <section className={cn(
          "py-16",
          backgroundColor === 'muted' && "bg-muted/50",
          backgroundColor === 'primary' && "bg-primary/5",
          className
        )}>
          <div className="container mx-auto px-4">
            {renderHeader()}
            <div className="space-y-8">
              {testimonials.map((testimonial) => renderTestimonial(testimonial))}
            </div>
          </div>
        </section>
      )
  }
}

export default TestimonialsSection