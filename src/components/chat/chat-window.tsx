import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  Phone,
  Video,
  Info,
  Search,
  MoreVertical,
  Pin,
  Archive,
  Trash2,
  Users,
  Settings,
  Bell,
  BellOff,
  Star,
  Share,
  Download,
  Copy,
  MessageSquare,
  Hash,
  Lock,
  Globe,
  UserPlus,
  UserMinus,
  Shield,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

export type ChatType = 'direct' | 'group' | 'channel' | 'announcement';
export type ChatStatus = 'online' | 'away' | 'busy' | 'offline';
export type MessageType = 'text' | 'image' | 'file' | 'voice' | 'video' | 'system';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  status: ChatStatus;
  role?: 'owner' | 'admin' | 'member';
  lastSeen?: string;
  isBot?: boolean;
}

export interface ChatMessage {
  id: string;
  content: string;
  type: MessageType;
  sender: ChatUser;
  timestamp: string;
  status: MessageStatus;
  replyTo?: string;
  reactions?: Record<string, string[]>; // emoji -> userIds
  attachments?: {
    id: string;
    name: string;
    url: string;
    size: number;
    type: string;
  }[];
  isEdited?: boolean;
  editedAt?: string;
  isPinned?: boolean;
  mentions?: string[];
}

export interface ChatRoom {
  id: string;
  name: string;
  type: ChatType;
  avatar?: string;
  description?: string;
  participants: ChatUser[];
  isOnline?: boolean;
  lastSeen?: string;
  isPinned: boolean;
  isMuted: boolean;
  isArchived: boolean;
  permissions?: {
    canSendMessages: boolean;
    canEditMessages: boolean;
    canDeleteMessages: boolean;
    canAddMembers: boolean;
    canRemoveMembers: boolean;
    canManageChat: boolean;
  };
  settings?: {
    notifications: boolean;
    readReceipts: boolean;
    encryption: boolean;
  };
}

export interface ChatWindowProps {
  chat?: ChatRoom;
  messages: ChatMessage[];
  currentUser: ChatUser;
  typingUsers: ChatUser[];
  onSendMessage: (message: string, replyTo?: string) => void;
  onEditMessage: (messageId: string, content: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onPinMessage: (messageId: string, pinned: boolean) => void;
  onReactToMessage: (messageId: string, emoji: string) => void;
  onStartCall: (type: 'voice' | 'video') => void;
  onShowInfo: () => void;
  onSearchMessages: () => void;
  onArchiveChat: () => void;
  onDeleteChat: () => void;
  onPinChat: (pinned: boolean) => void;
  onMuteChat: (muted: boolean) => void;
  isLoading?: boolean;
  variant?: 'default' | 'compact' | 'minimal';
  className?: string;
}

const ChatStatusIndicator: React.FC<{
  status: ChatStatus;
  size?: 'sm' | 'md' | 'lg';
}> = ({ status, size = 'sm' }) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
    offline: 'bg-gray-400'
  };

  return (
    <div
      className={cn(
        'rounded-full border-2 border-white',
        sizeClasses[size],
        statusColors[status]
      )}
    />
  );
};

const ChatHeader: React.FC<{
  chat: ChatRoom;
  currentUser: ChatUser;
  variant: 'default' | 'compact' | 'minimal';
  onStartCall: (type: 'voice' | 'video') => void;
  onShowInfo: () => void;
  onSearchMessages: () => void;
  onArchiveChat: () => void;
  onDeleteChat: () => void;
  onPinChat: (pinned: boolean) => void;
  onMuteChat: (muted: boolean) => void;
}> = ({
  chat,
  currentUser,
  variant,
  onStartCall,
  onShowInfo,
  onSearchMessages,
  onArchiveChat,
  onDeleteChat,
  onPinChat,
  onMuteChat
}) => {
  const { t } = useTranslation();
  const isCompact = variant === 'compact';
  const isMinimal = variant === 'minimal';

  const getChatIcon = () => {
    switch (chat.type) {
      case 'group':
        return Users;
      case 'channel':
        return Hash;
      case 'announcement':
        return Globe;
      default:
        return MessageSquare;
    }
  };

  const ChatIcon = getChatIcon();
  const mainParticipant = chat.type === 'direct'
    ? chat.participants.find(p => p.id !== currentUser.id)
    : null;

  const getStatusText = () => {
    if (chat.type === 'direct' && mainParticipant) {
      if (mainParticipant.status === 'online') {
        return t('online');
      } else if (mainParticipant.lastSeen) {
        return `${t('lastSeen')} ${new Date(mainParticipant.lastSeen).toLocaleString()}`;
      }
      return t('offline');
    } else {
      return `${chat.participants.length} ${t('members')}`;
    }
  };

  return (
    <CardHeader className={cn(
      'pb-3 border-b',
      isCompact && 'pb-2',
      isMinimal && 'pb-1'
    )}>
      <div className="flex items-center justify-between">
        {/* Chat Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative">
            <Avatar className={cn(
              isCompact ? 'h-10 w-10' : isMinimal ? 'h-8 w-8' : 'h-12 w-12'
            )}>
              <AvatarImage
                src={chat.avatar || mainParticipant?.avatar}
                alt={chat.name}
              />
              <AvatarFallback>
                {chat.type === 'direct' && mainParticipant
                  ? mainParticipant.name.charAt(0)
                  : chat.name.charAt(0)
                }
              </AvatarFallback>
            </Avatar>

            {/* Status indicator */}
            {chat.type === 'direct' && mainParticipant && !isMinimal && (
              <div className="absolute -bottom-1 -right-1">
                <ChatStatusIndicator status={mainParticipant.status} />
              </div>
            )}

            {/* Chat type icon */}
            {chat.type !== 'direct' && !isMinimal && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 border shadow-sm">
                <ChatIcon className="h-3 w-3 text-gray-600" />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className={cn(
                'font-semibold truncate',
                isCompact ? 'text-base' : isMinimal ? 'text-sm' : 'text-lg'
              )}>
                {chat.type === 'direct' && mainParticipant
                  ? mainParticipant.name
                  : chat.name
                }
              </h2>

              {/* Chat indicators */}
              <div className="flex items-center gap-1">
                {chat.isPinned && (
                  <Pin className="h-3 w-3 text-blue-500" />
                )}
                {chat.isMuted && (
                  <BellOff className="h-3 w-3 text-gray-400" />
                )}
                {chat.settings?.encryption && (
                  <Shield className="h-3 w-3 text-green-500" />
                )}
              </div>
            </div>

            {!isMinimal && (
              <p className={cn(
                'text-gray-500 truncate',
                isCompact ? 'text-xs' : 'text-sm'
              )}>
                {getStatusText()}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Direct chat actions */}
          {chat.type === 'direct' && !isMinimal && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onStartCall('voice')}
                className="h-8 w-8 p-0"
              >
                <Phone className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onStartCall('video')}
                className="h-8 w-8 p-0"
              >
                <Video className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Search */}
          {!isMinimal && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSearchMessages}
              className="h-8 w-8 p-0"
            >
              <Search className="h-4 w-4" />
            </Button>
          )}

          {/* Info */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onShowInfo}
            className="h-8 w-8 p-0"
          >
            <Info className="h-4 w-4" />
          </Button>

          {/* More actions */}
          {!isMinimal && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onPinChat(!chat.isPinned)}>
                  <Pin className="h-4 w-4 mr-2" />
                  {chat.isPinned ? t('unpin') : t('pin')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onMuteChat(!chat.isMuted)}>
                  {chat.isMuted ? (
                    <Bell className="h-4 w-4 mr-2" />
                  ) : (
                    <BellOff className="h-4 w-4 mr-2" />
                  )}
                  {chat.isMuted ? t('unmute') : t('mute')}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Star className="h-4 w-4 mr-2" />
                  {t('addToFavorites')}
                </DropdownMenuItem>
                <Separator />
                <DropdownMenuItem>
                  <Share className="h-4 w-4 mr-2" />
                  {t('share')}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  {t('exportChat')}
                </DropdownMenuItem>
                <Separator />
                <DropdownMenuItem onClick={onArchiveChat}>
                  <Archive className="h-4 w-4 mr-2" />
                  {t('archive')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onDeleteChat}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('deleteChat')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </CardHeader>
  );
};

const MessageStatusIndicator: React.FC<{
  status: MessageStatus;
  timestamp: string;
  isCompact?: boolean;
}> = ({ status, timestamp, isCompact = false }) => {
  const { t } = useTranslation();

  const getStatusIcon = () => {
    switch (status) {
      case 'sending':
        return <div className="w-3 h-3 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />;
      case 'sent':
        return <CheckCircle2 className="h-3 w-3 text-gray-400" />;
      case 'delivered':
        return <CheckCircle2 className="h-3 w-3 text-blue-500" />;
      case 'read':
        return <CheckCircle2 className="h-3 w-3 text-green-500" />;
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

const EmptyState: React.FC<{
  variant: 'default' | 'compact' | 'minimal';
}> = ({ variant }) => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-4 max-w-md">
        <div className="relative">
          <MessageSquare className="h-24 w-24 mx-auto text-gray-200" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t('selectChatToStart')}
          </h3>
          <p className="text-gray-500 text-sm">
            {t('chooseChatFromSidebar')}
          </p>
        </div>
      </div>
    </div>
  );
};

export const ChatWindow: React.FC<ChatWindowProps> = ({
  chat,
  messages,
  currentUser,
  typingUsers = [],
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onPinMessage,
  onReactToMessage,
  onStartCall,
  onShowInfo,
  onSearchMessages,
  onArchiveChat,
  onDeleteChat,
  onPinChat,
  onMuteChat,
  isLoading = false,
  variant = 'default',
  className
}) => {
  const { t } = useTranslation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!chat) {
    return (
      <Card className={cn('h-full flex flex-col', className)}>
        <EmptyState variant={variant} />
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className={cn('h-full flex flex-col', className)}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto" />
            <p className="text-gray-500">{t('loadingMessages')}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn('h-full flex flex-col', className)}>
      {/* Header */}
      <ChatHeader
        chat={chat}
        currentUser={currentUser}
        variant={variant}
        onStartCall={onStartCall}
        onShowInfo={onShowInfo}
        onSearchMessages={onSearchMessages}
        onArchiveChat={onArchiveChat}
        onDeleteChat={onDeleteChat}
        onPinChat={onPinChat}
        onMuteChat={onMuteChat}
      />

      {/* Messages Area */}
      <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t('noMessagesYet')}
                </h3>
                <p className="text-sm text-gray-500">
                  {t('sendFirstMessage')}
                </p>
              </div>
            ) : (
              messages.map((message, index) => {
                const isOwnMessage = message.sender.id === currentUser.id;
                const showAvatar = !isOwnMessage && (
                  index === 0 ||
                  messages[index - 1].sender.id !== message.sender.id ||
                  new Date(message.timestamp).getTime() - new Date(messages[index - 1].timestamp).getTime() > 300000 // 5 minutes
                );

                return (
                  <div
                    key={message.id}
                    className={cn(
                      'flex gap-3',
                      isOwnMessage && 'justify-end'
                    )}
                  >
                    {/* Avatar for others */}
                    {!isOwnMessage && (
                      <div className="flex-shrink-0">
                        {showAvatar ? (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={message.sender.avatar} />
                            <AvatarFallback>
                              {message.sender.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="h-8 w-8" />
                        )}
                      </div>
                    )}

                    {/* Message content */}
                    <div
                      className={cn(
                        'flex flex-col max-w-[70%]',
                        isOwnMessage && 'items-end'
                      )}
                    >
                      {/* Sender name for group chats */}
                      {!isOwnMessage && showAvatar && chat.type !== 'direct' && (
                        <span className="text-xs text-gray-500 mb-1 ml-3">
                          {message.sender.name}
                        </span>
                      )}

                      {/* Message bubble */}
                      <div
                        className={cn(
                          'rounded-2xl px-4 py-2 relative group',
                          isOwnMessage
                            ? 'bg-blue-500 text-white rounded-br-sm'
                            : 'bg-gray-100 text-gray-900 rounded-bl-sm',
                          selectedMessage === message.id && 'ring-2 ring-blue-300',
                          'cursor-pointer transition-all duration-200'
                        )}
                        onClick={() => setSelectedMessage(
                          selectedMessage === message.id ? null : message.id
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.content}
                        </p>

                        {/* Message actions */}
                        <div className="opacity-0 group-hover:opacity-100 absolute -right-2 top-1/2 -translate-y-1/2 bg-white border rounded-lg shadow-lg p-1 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              onReactToMessage(message.id, '👍');
                            }}
                          >
                            👍
                          </Button>
                          {/* Add more reaction buttons */}
                        </div>
                      </div>

                      {/* Message status and timestamp */}
                      {(selectedMessage === message.id || isOwnMessage) && (
                        <div className={cn(
                          'flex items-center gap-2 mt-1 px-2',
                          isOwnMessage ? 'justify-end' : 'justify-start'
                        )}>
                          {message.isEdited && (
                            <Badge variant="secondary" className="text-xs">
                              {t('edited')}
                            </Badge>
                          )}
                          <MessageStatusIndicator
                            status={message.status}
                            timestamp={message.timestamp}
                            isCompact={variant === 'compact'}
                          />
                        </div>
                      )}

                      {/* Reactions */}
                      {message.reactions && Object.keys(message.reactions).length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {Object.entries(message.reactions).map(([emoji, userIds]) => (
                            <Badge
                              key={emoji}
                              variant="secondary"
                              className="text-xs cursor-pointer hover:bg-gray-200"
                              onClick={() => onReactToMessage(message.id, emoji)}
                            >
                              {emoji} {userIds.length}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {/* Typing indicator */}
            {typingUsers.length > 0 && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={typingUsers[0].avatar} />
                  <AvatarFallback>
                    {typingUsers[0].name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2">
                  <div className="flex items-center gap-1">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    </div>
                    <span className="text-xs text-gray-500 ml-2">
                      {typingUsers.length === 1
                        ? t('userIsTyping', { user: typingUsers[0].name })
                        : t('usersAreTyping', { count: typingUsers.length })
                      }
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input Area will be added separately */}
        <div className="border-t p-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-100 rounded-full px-4 py-2">
              <span className="text-gray-500">{t('messageInputPlaceholder')}</span>
            </div>
            <Button size="sm">
              {t('send')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatWindow;