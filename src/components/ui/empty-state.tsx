import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Inbox,
  Search,
  Plus,
  FileText,
  Users,
  MessageSquare,
  Calendar,
  CheckSquare,
  FolderOpen,
  Image,
  Star,
  Heart,
  Archive,
  Trash2,
  AlertTriangle,
  Wifi,
  RefreshCw,
  Download,
  Upload,
  Settings,
  Filter,
  Eye,
  Lock,
  Globe,
  Clock,
  Target,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'

export interface EmptyStateAction {
  label: string
  onClick: () => void
  variant?: 'default' | 'secondary' | 'outline' | 'ghost'
  icon?: React.ComponentType<any>
  disabled?: boolean
}

export interface EmptyStateProps {
  variant?: 'default' | 'minimal' | 'card' | 'centered' | 'inline'
  icon?: React.ComponentType<any> | 'inbox' | 'search' | 'files' | 'users' | 'messages' | 'tasks' | 'calendar' | 'folder' | 'image' | 'star' | 'heart' | 'archive' | 'trash' | 'error' | 'offline' | 'filter' | 'locked' | 'loading'
  title: string
  description?: string
  actions?: EmptyStateAction[]
  badge?: {
    text: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  }
  illustration?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  className?: string
}

const iconMap = {
  inbox: Inbox,
  search: Search,
  files: FileText,
  users: Users,
  messages: MessageSquare,
  tasks: CheckSquare,
  calendar: Calendar,
  folder: FolderOpen,
  image: Image,
  star: Star,
  heart: Heart,
  archive: Archive,
  trash: Trash2,
  error: AlertTriangle,
  offline: Wifi,
  filter: Filter,
  locked: Lock,
  loading: RefreshCw
}

const sizeConfig = {
  sm: {
    icon: 'h-12 w-12',
    title: 'text-lg',
    description: 'text-sm',
    spacing: 'space-y-3',
    padding: 'p-6'
  },
  md: {
    icon: 'h-16 w-16',
    title: 'text-xl',
    description: 'text-base',
    spacing: 'space-y-4',
    padding: 'p-8'
  },
  lg: {
    icon: 'h-20 w-20',
    title: 'text-2xl',
    description: 'text-lg',
    spacing: 'space-y-6',
    padding: 'p-12'
  }
}

export function EmptyState({
  variant = 'default',
  icon = 'inbox',
  title,
  description,
  actions = [],
  badge,
  illustration,
  size = 'md',
  animated = true,
  className
}: EmptyStateProps) {
  const { t } = useTranslation()
  const config = sizeConfig[size]

  // Get icon component
  const IconComponent = typeof icon === 'string' ? iconMap[icon] : icon

  const content = (
    <div className={cn(
      "flex flex-col items-center justify-center text-center",
      config.spacing,
      variant === 'inline' ? 'py-8' : config.padding,
      className
    )}>
      {/* Badge */}
      {badge && (
        <Badge variant={badge.variant || 'secondary'} className="mb-2">
          {badge.text}
        </Badge>
      )}

      {/* Custom Illustration or Icon */}
      {illustration ? (
        <div className="mb-4">{illustration}</div>
      ) : IconComponent ? (
        <div className={cn(
          "text-muted-foreground/60 mb-2",
          animated && "transition-all duration-200 group-hover:text-muted-foreground/80"
        )}>
          <IconComponent className={cn(
            config.icon,
            animated && icon === 'loading' && "animate-spin"
          )} />
        </div>
      ) : null}

      {/* Title */}
      <h3 className={cn(
        "font-semibold text-foreground",
        config.title
      )}>
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className={cn(
          "text-muted-foreground max-w-md",
          config.description
        )}>
          {description}
        </p>
      )}

      {/* Actions */}
      {actions.length > 0 && (
        <div className={cn(
          "flex flex-wrap items-center justify-center gap-2",
          actions.length > 2 ? "flex-col sm:flex-row" : "flex-row"
        )}>
          {actions.map((action, index) => {
            const ActionIcon = action.icon
            return (
              <Button
                key={index}
                variant={action.variant || (index === 0 ? 'default' : 'outline')}
                onClick={action.onClick}
                disabled={action.disabled}
                size={size === 'sm' ? 'sm' : 'default'}
                className={cn(
                  animated && "transition-all duration-200 hover:scale-105"
                )}
              >
                {ActionIcon && <ActionIcon className="w-4 h-4 mr-2" />}
                {action.label}
              </Button>
            )
          })}
        </div>
      )}
    </div>
  )

  // Variant-specific wrappers
  switch (variant) {
    case 'card':
      return (
        <Card className={cn("group", animated && "transition-all duration-200 hover:shadow-md")}>
          <CardContent className="p-0">
            {content}
          </CardContent>
        </Card>
      )

    case 'centered':
      return (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className={cn("group max-w-lg mx-auto", className)}>
            {content}
          </div>
        </div>
      )

    case 'minimal':
      return (
        <div className={cn(
          "flex items-center justify-center py-8 text-center",
          className
        )}>
          <div className="flex items-center gap-3">
            {IconComponent && (
              <IconComponent className="h-5 w-5 text-muted-foreground" />
            )}
            <div>
              <p className="text-sm font-medium text-foreground">{title}</p>
              {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
        </div>
      )

    case 'inline':
      return (
        <div className={cn("group", className)}>
          {content}
        </div>
      )

    default:
      return (
        <div className={cn("group", className)}>
          {content}
        </div>
      )
  }
}

// Predefined empty states for common scenarios
export function NoResultsFound({
  searchQuery,
  onClearSearch,
  onRefresh,
  ...props
}: {
  searchQuery?: string
  onClearSearch?: () => void
  onRefresh?: () => void
} & Partial<EmptyStateProps>) {
  const { t } = useTranslation()

  const actions: EmptyStateAction[] = []
  if (onClearSearch) {
    actions.push({
      label: t('clearSearch'),
      onClick: onClearSearch,
      variant: 'outline',
      icon: RefreshCw
    })
  }
  if (onRefresh) {
    actions.push({
      label: t('refresh'),
      onClick: onRefresh,
      variant: 'default',
      icon: RefreshCw
    })
  }

  return (
    <EmptyState
      icon="search"
      title={searchQuery ? t('noResultsFor', { query: searchQuery }) : t('noResultsFound')}
      description={t('tryDifferentSearchTerms')}
      actions={actions}
      {...props}
    />
  )
}

export function NoDataFound({
  dataType = 'items',
  onRefresh,
  onCreate,
  ...props
}: {
  dataType?: string
  onRefresh?: () => void
  onCreate?: () => void
} & Partial<EmptyStateProps>) {
  const { t } = useTranslation()

  const actions: EmptyStateAction[] = []
  if (onCreate) {
    actions.push({
      label: t('create', { type: dataType }),
      onClick: onCreate,
      variant: 'default',
      icon: Plus
    })
  }
  if (onRefresh) {
    actions.push({
      label: t('refresh'),
      onClick: onRefresh,
      variant: 'outline',
      icon: RefreshCw
    })
  }

  return (
    <EmptyState
      icon="inbox"
      title={t('noDataFound', { type: dataType })}
      description={t('getStartedByCreating', { type: dataType })}
      actions={actions}
      {...props}
    />
  )
}

export function ErrorState({
  error,
  onRetry,
  onReport,
  ...props
}: {
  error?: string
  onRetry?: () => void
  onReport?: () => void
} & Partial<EmptyStateProps>) {
  const { t } = useTranslation()

  const actions: EmptyStateAction[] = []
  if (onRetry) {
    actions.push({
      label: t('tryAgain'),
      onClick: onRetry,
      variant: 'default',
      icon: RefreshCw
    })
  }
  if (onReport) {
    actions.push({
      label: t('reportProblem'),
      onClick: onReport,
      variant: 'outline',
      icon: AlertTriangle
    })
  }

  return (
    <EmptyState
      icon="error"
      title={t('somethingWentWrong')}
      description={error || t('unexpectedErrorOccurred')}
      actions={actions}
      badge={{ text: t('error'), variant: 'destructive' }}
      {...props}
    />
  )
}

export function OfflineState({
  onRetry,
  ...props
}: {
  onRetry?: () => void
} & Partial<EmptyStateProps>) {
  const { t } = useTranslation()

  const actions: EmptyStateAction[] = []
  if (onRetry) {
    actions.push({
      label: t('tryAgain'),
      onClick: onRetry,
      variant: 'default',
      icon: RefreshCw
    })
  }

  return (
    <EmptyState
      icon="offline"
      title={t('youAreOffline')}
      description={t('checkInternetConnection')}
      actions={actions}
      badge={{ text: t('offline'), variant: 'secondary' }}
      {...props}
    />
  )
}

export function LoadingState({
  message,
  ...props
}: {
  message?: string
} & Partial<EmptyStateProps>) {
  const { t } = useTranslation()

  return (
    <EmptyState
      icon="loading"
      title={message || t('loading')}
      description={t('pleaseWait')}
      animated={true}
      {...props}
    />
  )
}

export function AccessDeniedState({
  onRequestAccess,
  onGoBack,
  ...props
}: {
  onRequestAccess?: () => void
  onGoBack?: () => void
} & Partial<EmptyStateProps>) {
  const { t } = useTranslation()

  const actions: EmptyStateAction[] = []
  if (onRequestAccess) {
    actions.push({
      label: t('requestAccess'),
      onClick: onRequestAccess,
      variant: 'default',
      icon: Lock
    })
  }
  if (onGoBack) {
    actions.push({
      label: t('goBack'),
      onClick: onGoBack,
      variant: 'outline'
    })
  }

  return (
    <EmptyState
      icon="locked"
      title={t('accessDenied')}
      description={t('noPermissionToView')}
      actions={actions}
      badge={{ text: t('restricted'), variant: 'destructive' }}
      {...props}
    />
  )
}

export default EmptyState