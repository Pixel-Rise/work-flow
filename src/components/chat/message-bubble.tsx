import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  MoreVertical,
  Reply,
  Edit,
  Copy,
  Pin,
  Trash2,
  Forward,
  Star,
  Download,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Image as ImageIcon,
  File,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Mic,
  Video
} from 'lucide-react';

export type MessageType = 'text' | 'image' | 'file' | 'voice' | 'video' | 'system' | 'reply';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  role?: 'owner' | 'admin' | 'member';
}

export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  thumbnail?: string;
  duration?: number; // for audio/video files
}

export interface ChatMessage {
  id: string;
  content: string;
  type: MessageType;
  sender: ChatUser;
  timestamp: string;
  status: MessageStatus;
  replyTo?: {
    id: string;
    content: string;
    sender: ChatUser;
  };
  reactions?: Record<string, string[]>; // emoji -> userIds
  attachments?: MessageAttachment[];
  isEdited?: boolean;
  editedAt?: string;
  isPinned?: boolean;
  mentions?: string[];
  isForwarded?: boolean;
  forwardedFrom?: ChatUser;
}

export interface MessageBubbleProps {
  message: ChatMessage;
  currentUser: ChatUser;
  isOwnMessage: boolean;
  showAvatar?: boolean;
  showSender?: boolean;
  showTimestamp?: boolean;
  variant?: 'default' | 'compact' | 'minimal';
  onReply?: (message: ChatMessage) => void;
  onEdit?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onCopy?: (content: string) => void;
  onPin?: (messageId: string, pinned: boolean) => void;
  onForward?: (message: ChatMessage) => void;
  onReaction?: (messageId: string, emoji: string) => void;
  onDownload?: (attachment: MessageAttachment) => void;
  className?: string;
}

const MessageStatusIndicator: React.FC<{
  status: MessageStatus;
  timestamp: string;
  isCompact?: boolean;
}> = ({ status, timestamp, isCompact = false }) => {
  const { t } = useTranslation();

  const getStatusIcon = () => {
    switch (status) {
      case 'sending':
        return <Clock className="h-3 w-3 text-gray-400 animate-pulse" />;
      case 'sent':
        return <CheckCircle2 className="h-3 w-3 text-gray-400" />;
      case 'delivered':
        return (
          <div className="flex">
            <CheckCircle2 className="h-3 w-3 text-blue-500" />
            <CheckCircle2 className="h-3 w-3 text-blue-500 -ml-1" />
          </div>
        );
      case 'read':
        return (
          <div className="flex">
            <CheckCircle2 className="h-3 w-3 text-green-500" />
            <CheckCircle2 className="h-3 w-3 text-green-500 -ml-1" />
          </div>
        );
      case 'failed':
        return <AlertTriangle className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center gap-1">
      <span className={cn(
        'text-gray-500',
        isCompact ? 'text-xs' : 'text-sm'
      )}>
        {new Date(timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })}
      </span>
      {getStatusIcon()}
    </div>
  );
};

const AttachmentPreview: React.FC<{
  attachment: MessageAttachment;
  onDownload?: (attachment: MessageAttachment) => void;
}> = ({ attachment, onDownload }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isImage = attachment.type.startsWith('image/');
  const isVideo = attachment.type.startsWith('video/');
  const isAudio = attachment.type.startsWith('audio/');
  const isDocument = !isImage && !isVideo && !isAudio;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = () => {
    if (isAudio && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else if (isVideo && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    } else if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (isImage) {
    return (
      <div className="relative group cursor-pointer" onClick={() => onDownload?.(attachment)}>
        <img
          src={attachment.url}
          alt={attachment.name}
          className="max-w-xs max-h-64 rounded-lg object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 bg-white bg-opacity-90 rounded-full p-2">
            <Download className="h-4 w-4 text-gray-700" />
          </div>
        </div>
      </div>
    );
  }

  if (isVideo) {
    return (
      <div className="relative max-w-xs">
        <video
          ref={videoRef}
          src={attachment.url}
          poster={attachment.thumbnail}
          className="w-full max-h-64 rounded-lg"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          controls={false}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="secondary"
            size="sm"
            className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white"
            onClick={togglePlayPause}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </div>
        <div className="absolute bottom-2 right-2 flex gap-1">
          <Button
            variant="secondary"
            size="sm"
            className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white h-6 w-6 p-0"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white h-6 w-6 p-0"
            onClick={() => onDownload?.(attachment)}
          >
            <Download className="h-3 w-3" />
          </Button>
        </div>
        {attachment.duration && (
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            {formatDuration(attachment.duration)}
          </div>
        )}
      </div>
    );
  }

  if (isAudio) {
    return (
      <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 max-w-xs">
        <audio
          ref={audioRef}
          src={attachment.url}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />

        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 rounded-full bg-blue-500 text-white hover:bg-blue-600"
          onClick={togglePlayPause}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Mic className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium truncate">{attachment.name}</span>
          </div>
          <div className="text-xs text-gray-500">
            {attachment.duration && formatDuration(attachment.duration)} • {formatFileSize(attachment.size)}
          </div>
        </div>

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => onDownload?.(attachment)}
          >
            <Download className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  }

  if (isDocument) {
    return (
      <div
        className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 max-w-xs cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => onDownload?.(attachment)}
      >
        <div className="p-2 bg-blue-100 rounded-lg">
          <File className="h-6 w-6 text-blue-600" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{attachment.name}</p>
          <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
        </div>

        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <Download className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return null;
};

const MessageActions: React.FC<{
  message: ChatMessage;
  isOwnMessage: boolean;
  onReply?: (message: ChatMessage) => void;
  onEdit?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onCopy?: (content: string) => void;
  onPin?: (messageId: string, pinned: boolean) => void;
  onForward?: (message: ChatMessage) => void;
}> = ({
  message,
  isOwnMessage,
  onReply,
  onEdit,
  onDelete,
  onCopy,
  onPin,
  onForward
}) => {
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreVertical className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onReply?.(message)}>
          <Reply className="h-4 w-4 mr-2" />
          {t('reply')}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onCopy?.(message.content)}>
          <Copy className="h-4 w-4 mr-2" />
          {t('copy')}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onForward?.(message)}>
          <Forward className="h-4 w-4 mr-2" />
          {t('forward')}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onPin?.(message.id, !message.isPinned)}>
          <Pin className="h-4 w-4 mr-2" />
          {message.isPinned ? t('unpin') : t('pin')}
        </DropdownMenuItem>

        {isOwnMessage && (
          <>
            <DropdownMenuItem onClick={() => onEdit?.(message.id)}>
              <Edit className="h-4 w-4 mr-2" />
              {t('edit')}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onDelete?.(message.id)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t('delete')}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ReactionButton: React.FC<{
  emoji: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}> = ({ emoji, count, isActive, onClick }) => {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      size="sm"
      className={cn(
        "h-6 px-2 py-0 text-xs",
        isActive && "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200"
      )}
      onClick={onClick}
    >
      <span className="mr-1">{emoji}</span>
      {count}
    </Button>
  );
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  currentUser,
  isOwnMessage,
  showAvatar = true,
  showSender = true,
  showTimestamp = true,
  variant = 'default',
  onReply,
  onEdit,
  onDelete,
  onCopy,
  onPin,
  onForward,
  onReaction,
  onDownload,
  className
}) => {
  const { t } = useTranslation();
  const [showActions, setShowActions] = useState(false);
  const isCompact = variant === 'compact';
  const isMinimal = variant === 'minimal';

  const handleReaction = (emoji: string) => {
    onReaction?.(message.id, emoji);
  };

  return (
    <div
      className={cn(
        'group flex gap-3 relative',
        isOwnMessage && 'justify-end',
        className
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar for others */}
      {!isOwnMessage && showAvatar && (
        <div className="flex-shrink-0">
          <Avatar className={cn(
            isCompact ? 'h-6 w-6' : isMinimal ? 'h-8 w-8' : 'h-10 w-10'
          )}>
            <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
            <AvatarFallback>
              {message.sender.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      {/* Message content */}
      <div className={cn(
        'flex flex-col max-w-[70%] relative',
        isOwnMessage && 'items-end'
      )}>
        {/* Sender name */}
        {!isOwnMessage && showSender && showAvatar && (
          <div className="flex items-center gap-2 mb-1 ml-3">
            <span className={cn(
              'font-medium',
              isCompact ? 'text-xs' : 'text-sm'
            )}>
              {message.sender.name}
            </span>
            {message.sender.role && message.sender.role !== 'member' && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                {t(message.sender.role)}
              </Badge>
            )}
          </div>
        )}

        {/* Forwarded message indicator */}
        {message.isForwarded && message.forwardedFrom && (
          <div className="text-xs text-gray-500 mb-1 ml-3">
            <Forward className="h-3 w-3 inline mr-1" />
            {t('forwardedFrom')} {message.forwardedFrom.name}
          </div>
        )}

        {/* Reply preview */}
        {message.replyTo && (
          <div className={cn(
            'bg-gray-100 border-l-4 border-blue-500 rounded-r-lg p-2 mb-2 text-sm',
            isOwnMessage ? 'bg-blue-100' : 'bg-gray-100'
          )}>
            <div className="text-blue-600 font-medium text-xs mb-1">
              {message.replyTo.sender.name}
            </div>
            <div className="text-gray-600 text-xs truncate">
              {message.replyTo.content}
            </div>
          </div>
        )}

        {/* Message bubble */}
        <div className={cn(
          'rounded-2xl px-4 py-2 relative',
          isOwnMessage
            ? 'bg-blue-500 text-white rounded-br-sm'
            : 'bg-gray-100 text-gray-900 rounded-bl-sm',
          message.isPinned && 'ring-2 ring-yellow-300',
          isCompact && 'px-3 py-1.5 text-sm',
          isMinimal && 'px-2 py-1 text-xs'
        )}>
          {/* Pinned indicator */}
          {message.isPinned && (
            <div className="absolute -top-2 -left-2">
              <div className="bg-yellow-400 rounded-full p-1">
                <Pin className="h-3 w-3 text-white" />
              </div>
            </div>
          )}

          {/* Text content */}
          <div className="space-y-2">
            {message.content && (
              <p className="whitespace-pre-wrap break-words">
                {message.content}
              </p>
            )}

            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="space-y-2">
                {message.attachments.map((attachment) => (
                  <AttachmentPreview
                    key={attachment.id}
                    attachment={attachment}
                    onDownload={onDownload}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Quick reactions */}
          {showActions && !isMinimal && (
            <div className="absolute -top-8 right-0 bg-white border rounded-lg shadow-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex gap-1">
                {['👍', '❤️', '😂', '😮', '😢', '😡'].map((emoji) => (
                  <Button
                    key={emoji}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-gray-100"
                    onClick={() => handleReaction(emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Actions menu */}
          {showActions && !isMinimal && (
            <div className={cn(
              'absolute top-0',
              isOwnMessage ? '-left-8' : '-right-8'
            )}>
              <MessageActions
                message={message}
                isOwnMessage={isOwnMessage}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
                onCopy={onCopy}
                onPin={onPin}
                onForward={onForward}
              />
            </div>
          )}
        </div>

        {/* Message metadata */}
        <div className={cn(
          'flex items-center gap-2 mt-1 px-2',
          isOwnMessage ? 'justify-end' : 'justify-start'
        )}>
          {message.isEdited && (
            <Badge variant="secondary" className="text-xs px-1.5 py-0">
              {t('edited')}
            </Badge>
          )}

          {showTimestamp && (
            <MessageStatusIndicator
              status={message.status}
              timestamp={message.timestamp}
              isCompact={isCompact}
            />
          )}
        </div>

        {/* Reactions */}
        {message.reactions && Object.keys(message.reactions).length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {Object.entries(message.reactions).map(([emoji, userIds]) => {
              const isActive = userIds.includes(currentUser.id);
              return (
                <TooltipProvider key={emoji}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ReactionButton
                        emoji={emoji}
                        count={userIds.length}
                        isActive={isActive}
                        onClick={() => handleReaction(emoji)}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-sm">
                        {userIds.slice(0, 3).join(', ')}
                        {userIds.length > 3 && ` +${userIds.length - 3} more`}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;