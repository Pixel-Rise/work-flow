import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'

export interface TypingUser {
  id: string
  name: string
  avatar?: string
}

export interface TypingIndicatorProps {
  typingUsers: TypingUser[]
  variant?: 'default' | 'compact' | 'minimal' | 'bubble'
  maxUsers?: number
  showAvatars?: boolean
  showNames?: boolean
  animationType?: 'dots' | 'pulse' | 'wave' | 'typing'
  position?: 'left' | 'right' | 'center'
  className?: string
}

export function TypingIndicator({
  typingUsers,
  variant = 'default',
  maxUsers = 3,
  showAvatars = true,
  showNames = true,
  animationType = 'dots',
  position = 'left',
  className
}: TypingIndicatorProps) {
  const { t } = useTranslation()
  const [animationStep, setAnimationStep] = useState(0)

  // Animation cycling
  useEffect(() => {
    if (typingUsers.length === 0) return

    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 3)
    }, 500)

    return () => clearInterval(interval)
  }, [typingUsers.length])

  // Don't render if no one is typing
  if (typingUsers.length === 0) {
    return null
  }

  const displayUsers = typingUsers.slice(0, maxUsers)
  const remainingCount = Math.max(0, typingUsers.length - maxUsers)

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return showNames ? t('userIsTyping', { user: displayUsers[0].name }) : t('isTyping')
    } else if (typingUsers.length === 2) {
      return showNames
        ? t('twoUsersAreTyping', { user1: displayUsers[0].name, user2: displayUsers[1].name })
        : t('areTyping')
    } else {
      return showNames
        ? t('multipleUsersAreTyping', { users: displayUsers.map(u => u.name).join(', '), count: remainingCount })
        : t('multipleAreTyping', { count: typingUsers.length })
    }
  }

  const renderDotAnimation = () => {
    return (
      <div className="flex items-center space-x-1">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={cn(
              "w-2 h-2 bg-current rounded-full transition-opacity duration-300",
              variant === 'minimal' && "w-1.5 h-1.5",
              animationStep === index ? "opacity-100" : "opacity-30"
            )}
          />
        ))}
      </div>
    )
  }

  const renderPulseAnimation = () => {
    return (
      <div className="flex items-center space-x-1">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={cn(
              "w-2 h-2 bg-current rounded-full animate-pulse",
              variant === 'minimal' && "w-1.5 h-1.5"
            )}
            style={{ animationDelay: `${index * 200}ms` }}
          />
        ))}
      </div>
    )
  }

  const renderWaveAnimation = () => {
    return (
      <div className="flex items-end space-x-1 h-4">
        {[0, 1, 2, 1, 0].map((height, index) => (
          <div
            key={index}
            className={cn(
              "w-1 bg-current rounded-full transition-all duration-300",
              variant === 'minimal' && "w-0.5"
            )}
            style={{
              height: `${8 + height * 4 + (animationStep === index % 3 ? 4 : 0)}px`,
            }}
          />
        ))}
      </div>
    )
  }

  const renderTypingAnimation = () => {
    const text = "typing"
    return (
      <div className="flex items-center">
        {text.split('').map((char, index) => (
          <span
            key={index}
            className={cn(
              "transition-opacity duration-300",
              animationStep === index % 3 ? "opacity-100" : "opacity-50"
            )}
          >
            {char}
          </span>
        ))}
        <span className="animate-pulse">...</span>
      </div>
    )
  }

  const renderAnimation = () => {
    switch (animationType) {
      case 'pulse':
        return renderPulseAnimation()
      case 'wave':
        return renderWaveAnimation()
      case 'typing':
        return renderTypingAnimation()
      default:
        return renderDotAnimation()
    }
  }

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className={cn(
        "flex items-center gap-2 text-xs text-muted-foreground",
        position === 'center' && "justify-center",
        position === 'right' && "justify-end",
        className
      )}>
        {renderAnimation()}
        <span className="animate-pulse">{t('typing')}</span>
      </div>
    )
  }

  // Bubble variant
  if (variant === 'bubble') {
    return (
      <div className={cn(
        "flex items-start gap-3 mb-4",
        position === 'right' && "flex-row-reverse",
        className
      )}>
        {showAvatars && displayUsers.length > 0 && (
          <div className="relative">
            <Avatar className="h-8 w-8">
              <AvatarImage src={displayUsers[0].avatar} />
              <AvatarFallback className="text-xs">
                {displayUsers[0].name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {displayUsers.length > 1 && (
              <div className="absolute -top-1 -right-1">
                <Badge variant="secondary" className="h-5 w-5 p-0 text-xs rounded-full">
                  +{displayUsers.length - 1}
                </Badge>
              </div>
            )}
          </div>
        )}

        <div className={cn(
          "bg-muted rounded-2xl px-4 py-3 max-w-xs",
          position === 'right' && "bg-primary text-primary-foreground"
        )}>
          <div className="flex items-center gap-3">
            {renderAnimation()}
            <span className="text-sm text-muted-foreground">
              {getTypingText()}
            </span>
          </div>
        </div>
      </div>
    )
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={cn(
        "flex items-center gap-2 py-1 px-2 text-sm text-muted-foreground",
        position === 'center' && "justify-center",
        position === 'right' && "justify-end",
        className
      )}>
        {showAvatars && (
          <div className="flex -space-x-1">
            {displayUsers.map((user, index) => (
              <Avatar key={user.id} className="h-4 w-4 border border-background">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-xs">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ))}
            {remainingCount > 0 && (
              <div className="h-4 w-4 bg-muted border border-background rounded-full flex items-center justify-center">
                <span className="text-xs">+{remainingCount}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          {renderAnimation()}
          <span>{getTypingText()}</span>
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div className={cn(
      "flex items-center gap-3 py-2 px-3 bg-muted/50 rounded-lg",
      position === 'center' && "justify-center",
      position === 'right' && "justify-end",
      className
    )}>
      {showAvatars && (
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {displayUsers.map((user) => (
              <Avatar key={user.id} className="h-6 w-6 border-2 border-background">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-xs">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          {remainingCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              +{remainingCount}
            </Badge>
          )}
        </div>
      )}

      <div className="flex items-center gap-3">
        {renderAnimation()}
        <span className="text-sm text-muted-foreground">
          {getTypingText()}
        </span>
      </div>
    </div>
  )
}

// Hook for managing typing state
export function useTypingIndicator(timeout: number = 3000) {
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
  const [timeouts, setTimeouts] = useState<Map<string, NodeJS.Timeout>>(new Map())

  const addTypingUser = (user: TypingUser) => {
    // Clear existing timeout for this user
    const existingTimeout = timeouts.get(user.id)
    if (existingTimeout) {
      clearTimeout(existingTimeout)
    }

    // Add or update user
    setTypingUsers(prev => {
      const filtered = prev.filter(u => u.id !== user.id)
      return [...filtered, user]
    })

    // Set new timeout
    const newTimeout = setTimeout(() => {
      removeTypingUser(user.id)
    }, timeout)

    setTimeouts(prev => new Map(prev).set(user.id, newTimeout))
  }

  const removeTypingUser = (userId: string) => {
    // Clear timeout
    const existingTimeout = timeouts.get(userId)
    if (existingTimeout) {
      clearTimeout(existingTimeout)
    }

    // Remove user
    setTypingUsers(prev => prev.filter(u => u.id !== userId))
    setTimeouts(prev => {
      const newMap = new Map(prev)
      newMap.delete(userId)
      return newMap
    })
  }

  const clearAllTyping = () => {
    // Clear all timeouts
    timeouts.forEach(timeout => clearTimeout(timeout))
    setTimeouts(new Map())
    setTypingUsers([])
  }

  return {
    typingUsers,
    addTypingUser,
    removeTypingUser,
    clearAllTyping
  }
}

export default TypingIndicator