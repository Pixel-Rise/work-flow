import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  TrendingUp,
  Globe,
  Award,
  Clock,
  Star,
  CheckCircle,
  Target,
  Zap,
  Heart,
  Download,
  Calendar,
  Building,
  UserCheck,
  Activity,
  BarChart3,
  LineChart,
  PieChart,
  Shield,
  Rocket
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'

export interface Stat {
  id: string
  value: string
  label: string
  description?: string
  icon?: React.ComponentType<any>
  trend?: {
    value: string
    direction: 'up' | 'down' | 'neutral'
    label?: string
  }
  highlighted?: boolean
  suffix?: string
  prefix?: string
}

export interface StatsSectionProps {
  variant?: 'default' | 'minimal' | 'cards' | 'grid' | 'inline' | 'featured' | 'comparison'
  title?: string
  subtitle?: string
  description?: string
  stats: Stat[]
  columns?: 2 | 3 | 4 | 5 | 6
  animated?: boolean
  showTrends?: boolean
  backgroundColor?: 'default' | 'muted' | 'primary' | 'transparent'
  badge?: {
    text: string
    variant?: 'default' | 'secondary' | 'success' | 'warning'
  }
  className?: string
}

const iconMap = {
  users: Users,
  trending: TrendingUp,
  globe: Globe,
  award: Award,
  clock: Clock,
  star: Star,
  check: CheckCircle,
  target: Target,
  zap: Zap,
  heart: Heart,
  download: Download,
  calendar: Calendar,
  building: Building,
  userCheck: UserCheck,
  activity: Activity,
  barChart: BarChart3,
  lineChart: LineChart,
  pieChart: PieChart,
  shield: Shield,
  rocket: Rocket
}

export function StatsSection({
  variant = 'default',
  title,
  subtitle,
  description,
  stats,
  columns = 4,
  animated = true,
  showTrends = true,
  backgroundColor = 'default',
  badge,
  className
}: StatsSectionProps) {
  const { t } = useTranslation()

  const getGridColumns = () => {
    switch (columns) {
      case 2: return 'grid-cols-1 sm:grid-cols-2'
      case 3: return 'grid-cols-1 md:grid-cols-3'
      case 4: return 'grid-cols-2 md:grid-cols-4'
      case 5: return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
      case 6: return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
      default: return 'grid-cols-2 md:grid-cols-4'
    }
  }

  const renderTrend = (trend: Stat['trend']) => {
    if (!trend || !showTrends) return null

    const trendIcon = trend.direction === 'up' ? TrendingUp :
                     trend.direction === 'down' ? TrendingUp :
                     null

    const trendColor = trend.direction === 'up' ? 'text-green-600' :
                      trend.direction === 'down' ? 'text-red-600' :
                      'text-muted-foreground'

    return (
      <div className={cn("flex items-center gap-1 text-xs", trendColor)}>
        {trendIcon && (
          <trendIcon className={cn(
            "h-3 w-3",
            trend.direction === 'down' && "rotate-180"
          )} />
        )}
        <span>{trend.value}</span>
        {trend.label && <span className="text-muted-foreground">{trend.label}</span>}
      </div>
    )
  }

  const renderStat = (stat: Stat, index: number) => {
    const Icon = stat.icon

    const statContent = (
      <div className={cn(
        "space-y-2",
        animated && "transition-all duration-200"
      )}>
        <div className="flex items-center justify-between">
          {Icon && (
            <div className={cn(
              "p-2 rounded-lg",
              stat.highlighted ? "bg-primary/10 text-primary" : "bg-muted/50 text-muted-foreground"
            )}>
              <Icon className="h-4 w-4" />
            </div>
          )}
          {stat.trend && renderTrend(stat.trend)}
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline gap-1">
            {stat.prefix && (
              <span className="text-sm text-muted-foreground">{stat.prefix}</span>
            )}
            <span className={cn(
              "font-bold",
              variant === 'minimal' ? "text-xl" : "text-2xl lg:text-3xl",
              stat.highlighted && "text-primary"
            )}>
              {stat.value}
            </span>
            {stat.suffix && (
              <span className="text-sm text-muted-foreground">{stat.suffix}</span>
            )}
          </div>

          <div className="space-y-1">
            <p className={cn(
              "font-medium",
              variant === 'minimal' ? "text-sm" : "text-base",
              stat.highlighted ? "text-foreground" : "text-muted-foreground"
            )}>
              {stat.label}
            </p>

            {stat.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {stat.description}
              </p>
            )}
          </div>
        </div>
      </div>
    )

    if (variant === 'cards') {
      return (
        <Card key={stat.id} className={cn(
          "group",
          animated && "hover:shadow-md transition-all duration-200",
          stat.highlighted && "ring-2 ring-primary/20"
        )}>
          <CardContent className="p-6">
            {statContent}
          </CardContent>
        </Card>
      )
    }

    return (
      <div key={stat.id} className={cn(
        "group",
        variant === 'minimal' ? "text-center" : "p-6 rounded-lg border bg-card",
        animated && "hover:bg-accent/50 transition-all duration-200",
        stat.highlighted && "bg-primary/5 border-primary/20"
      )}>
        {statContent}
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

  // Variant-specific layouts
  switch (variant) {
    case 'minimal':
      return (
        <section className={cn(
          "py-12",
          backgroundColor === 'muted' && "bg-muted/50",
          backgroundColor === 'primary' && "bg-primary/5",
          className
        )}>
          <div className="container mx-auto px-4">
            {renderHeader()}
            <div className={cn(
              "grid gap-8",
              getGridColumns()
            )}>
              {stats.map((stat, index) => renderStat(stat, index))}
            </div>
          </div>
        </section>
      )

    case 'cards':
      return (
        <section className={cn(
          "py-16",
          backgroundColor === 'muted' && "bg-muted/50",
          backgroundColor === 'primary' && "bg-primary/5",
          className
        )}>
          <div className="container mx-auto px-4">
            {renderHeader()}
            <div className={cn(
              "grid gap-6",
              getGridColumns()
            )}>
              {stats.map((stat, index) => renderStat(stat, index))}
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
            <div className={cn(
              "grid gap-4",
              getGridColumns()
            )}>
              {stats.map((stat, index) => renderStat(stat, index))}
            </div>
          </div>
        </section>
      )

    case 'inline':
      return (
        <section className={cn(
          "py-8",
          backgroundColor === 'muted' && "bg-muted/50",
          backgroundColor === 'primary' && "bg-primary/5",
          className
        )}>
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {stats.map((stat, index) => (
                <div key={stat.id} className="text-center">
                  <div className="flex items-baseline gap-1 justify-center mb-1">
                    {stat.prefix && (
                      <span className="text-sm text-muted-foreground">{stat.prefix}</span>
                    )}
                    <span className="text-2xl md:text-3xl font-bold text-foreground">
                      {stat.value}
                    </span>
                    {stat.suffix && (
                      <span className="text-sm text-muted-foreground">{stat.suffix}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )

    case 'featured':
      const featuredStat = stats.find(s => s.highlighted) || stats[0]
      const otherStats = stats.filter(s => s.id !== featuredStat.id)

      return (
        <section className={cn(
          "py-16",
          backgroundColor === 'muted' && "bg-muted/50",
          backgroundColor === 'primary' && "bg-primary/5",
          className
        )}>
          <div className="container mx-auto px-4">
            {renderHeader()}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Featured Stat */}
              <div className="lg:col-span-1">
                <Card className="h-full bg-primary text-primary-foreground">
                  <CardContent className="p-8 text-center space-y-4">
                    {featuredStat.icon && (
                      <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                        <featuredStat.icon className="h-8 w-8" />
                      </div>
                    )}
                    <div className="space-y-2">
                      <div className="text-4xl lg:text-5xl font-bold">
                        {featuredStat.prefix}{featuredStat.value}{featuredStat.suffix}
                      </div>
                      <p className="text-lg opacity-90">{featuredStat.label}</p>
                      {featuredStat.description && (
                        <p className="text-sm opacity-75">{featuredStat.description}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Other Stats */}
              <div className="lg:col-span-2">
                <div className={cn(
                  "grid gap-6",
                  otherStats.length <= 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2 md:grid-cols-3"
                )}>
                  {otherStats.map((stat, index) => renderStat(stat, index))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )

    case 'comparison':
      return (
        <section className={cn(
          "py-16",
          backgroundColor === 'muted' && "bg-muted/50",
          backgroundColor === 'primary' && "bg-primary/5",
          className
        )}>
          <div className="container mx-auto px-4">
            {renderHeader()}
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                {stats.map((stat, index) => (
                  <Card key={stat.id} className={cn(
                    "relative overflow-hidden",
                    stat.highlighted && "ring-2 ring-primary"
                  )}>
                    {stat.highlighted && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
                    )}
                    <CardContent className="p-8 text-center space-y-4">
                      {stat.icon && (
                        <div className={cn(
                          "mx-auto w-12 h-12 rounded-full flex items-center justify-center",
                          stat.highlighted ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        )}>
                          <stat.icon className="h-6 w-6" />
                        </div>
                      )}
                      <div className="space-y-2">
                        <div className={cn(
                          "text-3xl font-bold",
                          stat.highlighted && "text-primary"
                        )}>
                          {stat.prefix}{stat.value}{stat.suffix}
                        </div>
                        <p className="text-lg font-medium">{stat.label}</p>
                        {stat.description && (
                          <p className="text-sm text-muted-foreground">{stat.description}</p>
                        )}
                        {stat.trend && renderTrend(stat.trend)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
            <div className={cn(
              "grid gap-6",
              getGridColumns()
            )}>
              {stats.map((stat, index) => renderStat(stat, index))}
            </div>
          </div>
        </section>
      )
  }
}

// Predefined stat sets for common use cases
export const COMMON_STATS = {
  business: [
    {
      id: 'users',
      value: '50K+',
      label: 'Active Users',
      icon: Users,
      trend: { value: '+12%', direction: 'up' as const, label: 'this month' }
    },
    {
      id: 'growth',
      value: '300%',
      label: 'Growth Rate',
      icon: TrendingUp,
      trend: { value: '+25%', direction: 'up' as const, label: 'YoY' }
    },
    {
      id: 'countries',
      value: '150+',
      label: 'Countries',
      icon: Globe,
      trend: { value: '+5', direction: 'up' as const, label: 'new this quarter' }
    },
    {
      id: 'satisfaction',
      value: '98%',
      label: 'Satisfaction',
      icon: Star,
      highlighted: true
    }
  ],

  software: [
    {
      id: 'downloads',
      value: '1M+',
      label: 'Downloads',
      icon: Download,
      trend: { value: '+15%', direction: 'up' as const }
    },
    {
      id: 'uptime',
      value: '99.9%',
      label: 'Uptime',
      icon: Shield,
      highlighted: true
    },
    {
      id: 'response',
      value: '200ms',
      label: 'Response Time',
      icon: Zap,
      suffix: ' avg'
    },
    {
      id: 'customers',
      value: '10K+',
      label: 'Happy Customers',
      icon: Heart
    }
  ],

  social: [
    {
      id: 'members',
      value: '25K+',
      label: 'Community Members',
      icon: Users
    },
    {
      id: 'posts',
      value: '100K+',
      label: 'Posts Created',
      icon: Activity
    },
    {
      id: 'engagement',
      value: '85%',
      label: 'Engagement Rate',
      icon: Heart,
      highlighted: true
    },
    {
      id: 'events',
      value: '500+',
      label: 'Events Hosted',
      icon: Calendar
    }
  ]
}

export default StatsSection