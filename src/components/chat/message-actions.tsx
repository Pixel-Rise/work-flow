import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  MoreHorizontal,
  Reply,
  Edit2,
  Trash2,
  Copy,
  Share,
  Pin,
  Flag,
  Heart,
  Smile,
  Download,
  Forward,
  Quote,
  Link2,
  Star,
  Archive,
  Eye,
  MessageSquare,
  AlertTriangle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'

export interface MessageActionsProps {
  messageId: string
  isOwnMessage: boolean
  canEdit?: boolean
  canDelete?: boolean
  canPin?: boolean
  canFlag?: boolean
  isLiked?: boolean
  isPinned?: boolean
  isFlagged?: boolean
  isStarred?: boolean
  isArchived?: boolean
  likeCount?: number
  variant?: 'default' | 'compact' | 'minimal'
  showQuickActions?: boolean
  showDropdownActions?: boolean
  position?: 'top' | 'bottom' | 'floating'
  onReply?: (messageId: string) => void
  onEdit?: (messageId: string) => void
  onDelete?: (messageId: string) => void
  onLike?: (messageId: string) => void
  onPin?: (messageId: string) => void
  onFlag?: (messageId: string, reason?: string) => void
  onCopy?: (messageId: string) => void
  onShare?: (messageId: string) => void
  onForward?: (messageId: string) => void
  onQuote?: (messageId: string) => void
  onStar?: (messageId: string) => void
  onArchive?: (messageId: string) => void
  onReaction?: (messageId: string, emoji: string) => void
  className?: string
}

const quickReactions = ['👍', '❤️', '😂', '😮', '😢', '😡']

const flagReasons = [
  { id: 'spam', label: 'spam', icon: AlertTriangle },
  { id: 'inappropriate', label: 'inappropriateContent', icon: Flag },
  { id: 'harassment', label: 'harassment', icon: AlertTriangle },
  { id: 'violence', label: 'violence', icon: Flag },
  { id: 'misinformation', label: 'misinformation', icon: AlertTriangle },
  { id: 'other', label: 'other', icon: Flag }
]

export function MessageActions({
  messageId,
  isOwnMessage,
  canEdit = true,
  canDelete = true,
  canPin = true,
  canFlag = true,
  isLiked = false,
  isPinned = false,
  isFlagged = false,
  isStarred = false,
  isArchived = false,
  likeCount = 0,
  variant = 'default',
  showQuickActions = true,
  showDropdownActions = true,
  position = 'floating',
  onReply,
  onEdit,
  onDelete,
  onLike,
  onPin,
  onFlag,
  onCopy,
  onShare,
  onForward,
  onQuote,
  onStar,
  onArchive,
  onReaction,
  className
}: MessageActionsProps) {
  const { t } = useTranslation()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showFlagDialog, setShowFlagDialog] = useState(false)
  const [flagReason, setFlagReason] = useState('')
  const [showReactions, setShowReactions] = useState(false)

  const handleDelete = () => {
    onDelete?.(messageId)
    setShowDeleteConfirm(false)
  }

  const handleFlag = () => {
    onFlag?.(messageId, flagReason)
    setShowFlagDialog(false)
    setFlagReason('')
  }

  const handleReaction = (emoji: string) => {
    onReaction?.(messageId, emoji)
    setShowReactions(false)
  }

  const renderQuickActions = () => {
    if (!showQuickActions) return null

    const quickActions = []

    if (onReply) {
      quickActions.push(
        <TooltipProvider key="reply">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size={variant === 'minimal' ? 'sm' : 'sm'}
                className={cn(
                  "h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity",
                  variant === 'minimal' && "h-5 w-5"
                )}
                onClick={() => onReply(messageId)}
              >
                <Reply className={cn("h-3 w-3", variant === 'minimal' && "h-2.5 w-2.5")} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('reply')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    if (onLike) {
      quickActions.push(
        <TooltipProvider key="like">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size={variant === 'minimal' ? 'sm' : 'sm'}
                className={cn(
                  "h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity",
                  variant === 'minimal' && "h-5 w-5",
                  isLiked && "text-red-500 opacity-100"
                )}
                onClick={() => onLike(messageId)}
              >
                <Heart className={cn(
                  "h-3 w-3",
                  variant === 'minimal' && "h-2.5 w-2.5",
                  isLiked && "fill-current"
                )} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isLiked ? t('unlike') : t('like')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    if (onReaction) {
      quickActions.push(
        <DropdownMenu key="reactions" open={showReactions} onOpenChange={setShowReactions}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size={variant === 'minimal' ? 'sm' : 'sm'}
                    className={cn(
                      "h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity",
                      variant === 'minimal' && "h-5 w-5"
                    )}
                  >
                    <Smile className={cn("h-3 w-3", variant === 'minimal' && "h-2.5 w-2.5")} />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('addReaction')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DropdownMenuContent className="w-auto p-2" align="center">
            <div className="flex gap-1">
              {quickReactions.map((emoji) => (
                <Button
                  key={emoji}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-lg hover:bg-muted"
                  onClick={() => handleReaction(emoji)}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    return quickActions
  }

  const renderDropdownActions = () => {
    if (!showDropdownActions) return null

    return (
      <DropdownMenu>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size={variant === 'minimal' ? 'sm' : 'sm'}
                  className={cn(
                    "h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity",
                    variant === 'minimal' && "h-5 w-5"
                  )}
                >
                  <MoreHorizontal className={cn("h-3 w-3", variant === 'minimal' && "h-2.5 w-2.5")} />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('moreActions')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenuContent align="end" className="w-48">
          {/* Basic Actions */}
          {onQuote && (
            <DropdownMenuItem onClick={() => onQuote(messageId)}>
              <Quote className="h-4 w-4 mr-2" />
              {t('quote')}
            </DropdownMenuItem>
          )}

          {onForward && (
            <DropdownMenuItem onClick={() => onForward(messageId)}>
              <Forward className="h-4 w-4 mr-2" />
              {t('forward')}
            </DropdownMenuItem>
          )}

          {onCopy && (
            <DropdownMenuItem onClick={() => onCopy(messageId)}>
              <Copy className="h-4 w-4 mr-2" />
              {t('copyMessage')}
            </DropdownMenuItem>
          )}

          {onShare && (
            <DropdownMenuItem onClick={() => onShare(messageId)}>
              <Share className="h-4 w-4 mr-2" />
              {t('share')}
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          {/* Management Actions */}
          {onStar && (
            <DropdownMenuItem onClick={() => onStar(messageId)}>
              <Star className={cn("h-4 w-4 mr-2", isStarred && "fill-current text-yellow-500")} />
              {isStarred ? t('unstar') : t('star')}
            </DropdownMenuItem>
          )}

          {canPin && onPin && (
            <DropdownMenuItem onClick={() => onPin(messageId)}>
              <Pin className={cn("h-4 w-4 mr-2", isPinned && "text-blue-500")} />
              {isPinned ? t('unpin') : t('pinMessage')}
            </DropdownMenuItem>
          )}

          {onArchive && (
            <DropdownMenuItem onClick={() => onArchive(messageId)}>
              <Archive className={cn("h-4 w-4 mr-2", isArchived && "text-gray-500")} />
              {isArchived ? t('unarchive') : t('archive')}
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          {/* Owner Actions */}
          {isOwnMessage && canEdit && onEdit && (
            <DropdownMenuItem onClick={() => onEdit(messageId)}>
              <Edit2 className="h-4 w-4 mr-2" />
              {t('editMessage')}
            </DropdownMenuItem>
          )}

          {isOwnMessage && canDelete && onDelete && (
            <DropdownMenuItem
              onClick={() => setShowDeleteConfirm(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t('deleteMessage')}
            </DropdownMenuItem>
          )}

          {/* Moderation Actions */}
          {!isOwnMessage && canFlag && onFlag && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowFlagDialog(true)}
                className="text-orange-600 focus:text-orange-600"
              >
                <Flag className={cn("h-4 w-4 mr-2", isFlagged && "fill-current")} />
                {isFlagged ? t('flagged') : t('flagMessage')}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  if (variant === 'minimal') {
    return (
      <div className={cn("flex items-center gap-0.5", className)}>
        {likeCount > 0 && (
          <Badge variant="secondary" className="text-xs h-4 px-1">
            <Heart className="h-2 w-2 mr-0.5 fill-current text-red-500" />
            {likeCount}
          </Badge>
        )}
        {renderQuickActions()}
        {renderDropdownActions()}
      </div>
    )
  }

  return (
    <div className={cn(
      "flex items-center gap-1",
      position === 'floating' && "absolute -top-4 right-2 bg-background border rounded-lg shadow-sm px-1 py-0.5",
      position === 'bottom' && "mt-1",
      position === 'top' && "mb-1",
      className
    )}>
      {/* Like Count */}
      {likeCount > 0 && (
        <div className="flex items-center gap-1 mr-2">
          <Badge variant="secondary" className="text-xs">
            <Heart className="h-3 w-3 mr-1 fill-current text-red-500" />
            {likeCount}
          </Badge>
        </div>
      )}

      {/* Status Indicators */}
      <div className="flex items-center gap-0.5 mr-1">
        {isPinned && (
          <Pin className="h-3 w-3 text-blue-500" title={t('pinned')} />
        )}
        {isStarred && (
          <Star className="h-3 w-3 text-yellow-500 fill-current" title={t('starred')} />
        )}
        {isFlagged && (
          <Flag className="h-3 w-3 text-orange-500 fill-current" title={t('flagged')} />
        )}
        {isArchived && (
          <Archive className="h-3 w-3 text-gray-500" title={t('archived')} />
        )}
      </div>

      {/* Quick Actions */}
      {renderQuickActions()}

      {/* Dropdown Actions */}
      {renderDropdownActions()}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('deleteMessage')}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {t('deleteMessageConfirmation')}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              {t('cancel')}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              {t('delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Flag Dialog */}
      <Dialog open={showFlagDialog} onOpenChange={setShowFlagDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('flagMessage')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t('flagMessageDescription')}
            </p>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('reason')}</label>
              <div className="space-y-2">
                {flagReasons.map((reason) => {
                  const Icon = reason.icon
                  return (
                    <label key={reason.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="flagReason"
                        value={reason.id}
                        checked={flagReason === reason.id}
                        onChange={(e) => setFlagReason(e.target.value)}
                        className="text-primary"
                      />
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{t(reason.label)}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFlagDialog(false)}>
              {t('cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleFlag}
              disabled={!flagReason}
            >
              {t('flagMessage')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MessageActions