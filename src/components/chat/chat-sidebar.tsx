import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  Search,
  Plus,
  MessageCircle,
  Users,
  Settings,
  Archive,
  Pin,
  MoreVertical,
  Hash,
  Lock,
  Globe,
  UserPlus,
  Filter,
  SortAsc,
  Bell,
  BellOff,
  Star,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';

export type ChatType = 'direct' | 'group' | 'channel' | 'announcement';
export type ChatStatus = 'online' | 'away' | 'busy' | 'offline';
export type ChannelType = 'public' | 'private' | 'archived';

export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  status: ChatStatus;
  lastSeen?: string;
  isBot?: boolean;
}

export interface ChatRoom {
  id: string;
  name: string;
  type: ChatType;
  channelType?: ChannelType;
  avatar?: string;
  description?: string;
  participants: ChatUser[];
  unreadCount: number;
  lastMessage?: {
    id: string;
    content: string;
    sender: ChatUser;
    timestamp: string;
    isRead: boolean;
  };
  isPinned: boolean;
  isMuted: boolean;
  isArchived: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatSidebarProps {
  chats: ChatRoom[];
  activeChat?: string;
  currentUser: ChatUser;
  onChatSelect: (chatId: string) => void;
  onCreateChat: (type: ChatType) => void;
  onArchiveChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onPinChat: (chatId: string, pinned: boolean) => void;
  onMuteChat: (chatId: string, muted: boolean) => void;
  onFavoriteChat: (chatId: string, favorite: boolean) => void;
  variant?: 'default' | 'compact' | 'minimal';
  showSearch?: boolean;
  showCreateButton?: boolean;
  showTabs?: boolean;
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

const ChatRoomItem: React.FC<{
  chat: ChatRoom;
  isActive: boolean;
  variant: 'default' | 'compact' | 'minimal';
  onClick: () => void;
  onPin: (pinned: boolean) => void;
  onMute: (muted: boolean) => void;
  onFavorite: (favorite: boolean) => void;
  onArchive: () => void;
  onDelete: () => void;
}> = ({
  chat,
  isActive,
  variant,
  onClick,
  onPin,
  onMute,
  onFavorite,
  onArchive,
  onDelete
}) => {
  const { t } = useTranslation();
  const isCompact = variant === 'compact';
  const isMinimal = variant === 'minimal';

  const getChatIcon = () => {
    switch (chat.type) {
      case 'group':
        return Users;
      case 'channel':
        return chat.channelType === 'private' ? Lock : Hash;
      case 'announcement':
        return Globe;
      default:
        return MessageCircle;
    }
  };

  const ChatIcon = getChatIcon();
  const lastMessage = chat.lastMessage;
  const mainParticipant = chat.type === 'direct'
    ? chat.participants.find(p => p.id !== chat.id)
    : null;

  return (
    <div
      className={cn(
        'group relative p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50',
        isActive && 'bg-blue-50 border-blue-200 border',
        isCompact && 'p-2',
        isMinimal && 'p-1'
      )}
      onClick={onClick}
    >
      {/* Avatar Section */}
      <div className="flex items-start gap-3">
        <div className="relative">
          <Avatar className={cn(
            isCompact ? 'h-10 w-10' : isMinimal ? 'h-8 w-8' : 'h-12 w-12'
          )}>
            <AvatarImage
              src={chat.avatar || mainParticipant?.avatar}
              alt={chat.name}
            />
            <AvatarFallback className="bg-blue-100 text-blue-700">
              {chat.type === 'direct' && mainParticipant
                ? mainParticipant.name.charAt(0)
                : chat.name.charAt(0)
              }
            </AvatarFallback>
          </Avatar>

          {/* Status indicator for direct chats */}
          {chat.type === 'direct' && mainParticipant && !isMinimal && (
            <div className="absolute -bottom-1 -right-1">
              <ChatStatusIndicator status={mainParticipant.status} />
            </div>
          )}

          {/* Chat type icon for groups/channels */}
          {chat.type !== 'direct' && !isMinimal && (
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 border shadow-sm">
              <ChatIcon className="h-3 w-3 text-gray-600" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 min-w-0">
              <h3 className={cn(
                'font-medium truncate',
                isCompact ? 'text-sm' : isMinimal ? 'text-xs' : 'text-base',
                isActive ? 'text-blue-900' : 'text-gray-900'
              )}>
                {chat.type === 'direct' && mainParticipant
                  ? mainParticipant.name
                  : chat.name
                }
              </h3>

              {/* Indicators */}
              <div className="flex items-center gap-1">
                {chat.isPinned && (
                  <Pin className="h-3 w-3 text-blue-500" />
                )}
                {chat.isMuted && (
                  <BellOff className="h-3 w-3 text-gray-400" />
                )}
                {chat.isFavorite && (
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                )}
                {chat.channelType === 'private' && (
                  <Lock className="h-3 w-3 text-gray-400" />
                )}
              </div>
            </div>

            {/* Timestamp and unread count */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {lastMessage && !isMinimal && (
                <span className={cn(
                  'text-gray-500',
                  isCompact ? 'text-xs' : 'text-sm'
                )}>
                  {new Date(lastMessage.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              )}

              {chat.unreadCount > 0 && (
                <Badge
                  variant="default"
                  className={cn(
                    'bg-blue-500 hover:bg-blue-600 min-w-0',
                    isCompact || isMinimal ? 'text-xs px-1.5 py-0' : 'text-sm'
                  )}
                >
                  {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                </Badge>
              )}
            </div>
          </div>

          {/* Last message preview */}
          {lastMessage && !isMinimal && (
            <div className="flex items-center gap-1">
              <p className={cn(
                'text-gray-600 truncate',
                isCompact ? 'text-xs' : 'text-sm'
              )}>
                {chat.type !== 'direct' && (
                  <span className="font-medium">{lastMessage.sender.name}: </span>
                )}
                {lastMessage.content}
              </p>
              {!lastMessage.isRead && (
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
              )}
            </div>
          )}

          {/* Participant count for groups */}
          {chat.type === 'group' && !isMinimal && (
            <div className="flex items-center gap-1 mt-1">
              <Users className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500">
                {chat.participants.length} {t('members')}
              </span>
            </div>
          )}
        </div>

        {/* Actions menu */}
        {!isMinimal && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onPin(!chat.isPinned)}>
                <Pin className="h-4 w-4 mr-2" />
                {chat.isPinned ? t('unpin') : t('pin')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onMute(!chat.isMuted)}>
                {chat.isMuted ? (
                  <Bell className="h-4 w-4 mr-2" />
                ) : (
                  <BellOff className="h-4 w-4 mr-2" />
                )}
                {chat.isMuted ? t('unmute') : t('mute')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFavorite(!chat.isFavorite)}>
                <Star className={cn(
                  'h-4 w-4 mr-2',
                  chat.isFavorite && 'fill-current text-yellow-500'
                )} />
                {chat.isFavorite ? t('unfavorite') : t('favorite')}
              </DropdownMenuItem>
              <Separator />
              <DropdownMenuItem onClick={onArchive}>
                <Archive className="h-4 w-4 mr-2" />
                {t('archive')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onDelete}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t('delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

const CreateChatButton: React.FC<{
  onCreateChat: (type: ChatType) => void;
  variant: 'default' | 'compact' | 'minimal';
}> = ({ onCreateChat, variant }) => {
  const { t } = useTranslation();
  const isCompact = variant === 'compact' || variant === 'minimal';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(
            'w-full justify-start',
            isCompact ? 'h-8' : 'h-10'
          )}
        >
          <Plus className="h-4 w-4 mr-2" />
          {!isCompact && t('newChat')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem onClick={() => onCreateChat('direct')}>
          <MessageCircle className="h-4 w-4 mr-2" />
          {t('directMessage')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onCreateChat('group')}>
          <Users className="h-4 w-4 mr-2" />
          {t('groupChat')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onCreateChat('channel')}>
          <Hash className="h-4 w-4 mr-2" />
          {t('channel')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onCreateChat('announcement')}>
          <Globe className="h-4 w-4 mr-2" />
          {t('announcement')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  activeChat,
  currentUser,
  onChatSelect,
  onCreateChat,
  onArchiveChat,
  onDeleteChat,
  onPinChat,
  onMuteChat,
  onFavoriteChat,
  variant = 'default',
  showSearch = true,
  showCreateButton = true,
  showTabs = true,
  className
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'unread'>('recent');
  const [filterBy, setFilterBy] = useState<'all' | 'unread' | 'pinned' | 'favorites'>('all');

  const isCompact = variant === 'compact';
  const isMinimal = variant === 'minimal';

  // Filter and sort chats
  const filteredAndSortedChats = useMemo(() => {
    let filtered = chats.filter(chat => {
      if (chat.isArchived) return false;

      const searchMatch = chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase());

      const filterMatch = (() => {
        switch (filterBy) {
          case 'unread':
            return chat.unreadCount > 0;
          case 'pinned':
            return chat.isPinned;
          case 'favorites':
            return chat.isFavorite;
          default:
            return true;
        }
      })();

      return searchMatch && filterMatch;
    });

    // Sort chats
    filtered.sort((a, b) => {
      // Always show pinned chats first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'unread':
          return b.unreadCount - a.unreadCount;
        default: // recent
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

    return filtered;
  }, [chats, searchQuery, sortBy, filterBy]);

  // Group chats by category
  const groupedChats = useMemo(() => {
    if (!showTabs || isCompact || isMinimal) {
      return { all: filteredAndSortedChats };
    }

    return {
      all: filteredAndSortedChats,
      direct: filteredAndSortedChats.filter(chat => chat.type === 'direct'),
      groups: filteredAndSortedChats.filter(chat => chat.type === 'group'),
      channels: filteredAndSortedChats.filter(chat => chat.type === 'channel')
    };
  }, [filteredAndSortedChats, showTabs, isCompact, isMinimal]);

  const totalUnread = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);

  return (
    <Card className={cn('h-full flex flex-col', className)}>
      {/* Header */}
      <CardHeader className={cn(
        'pb-4 space-y-4',
        isCompact && 'pb-2 space-y-2',
        isMinimal && 'pb-1 space-y-1'
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className={cn(
              'font-semibold',
              isCompact ? 'text-lg' : isMinimal ? 'text-base' : 'text-xl'
            )}>
              {t('chats')}
            </h2>
            {totalUnread > 0 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {totalUnread}
              </Badge>
            )}
          </div>

          {!isMinimal && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy('recent')}>
                  <SortAsc className="h-4 w-4 mr-2" />
                  {t('sortByRecent')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('name')}>
                  <SortAsc className="h-4 w-4 mr-2" />
                  {t('sortByName')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('unread')}>
                  <SortAsc className="h-4 w-4 mr-2" />
                  {t('sortByUnread')}
                </DropdownMenuItem>
                <Separator />
                <DropdownMenuItem onClick={() => setFilterBy('all')}>
                  <Filter className="h-4 w-4 mr-2" />
                  {t('showAll')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterBy('unread')}>
                  <Filter className="h-4 w-4 mr-2" />
                  {t('showUnread')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterBy('pinned')}>
                  <Filter className="h-4 w-4 mr-2" />
                  {t('showPinned')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Search */}
        {showSearch && !isMinimal && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t('searchChats')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              size={isCompact ? 'sm' : 'default'}
            />
          </div>
        )}

        {/* Create Chat Button */}
        {showCreateButton && (
          <CreateChatButton onCreateChat={onCreateChat} variant={variant} />
        )}
      </CardHeader>

      {/* Chat List */}
      <CardContent className="flex-1 p-0 overflow-hidden">
        {showTabs && !isCompact && !isMinimal ? (
          <Tabs defaultValue="all" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 mx-4 mb-4">
              <TabsTrigger value="all">{t('all')}</TabsTrigger>
              <TabsTrigger value="direct">{t('direct')}</TabsTrigger>
              <TabsTrigger value="groups">{t('groups')}</TabsTrigger>
              <TabsTrigger value="channels">{t('channels')}</TabsTrigger>
            </TabsList>

            {Object.entries(groupedChats).map(([category, categoryChats]) => (
              <TabsContent key={category} value={category} className="flex-1 mt-0">
                <ScrollArea className="h-full px-4">
                  <div className="space-y-2">
                    {categoryChats.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">{t('noChatsFound')}</p>
                      </div>
                    ) : (
                      categoryChats.map((chat) => (
                        <ChatRoomItem
                          key={chat.id}
                          chat={chat}
                          isActive={activeChat === chat.id}
                          variant={variant}
                          onClick={() => onChatSelect(chat.id)}
                          onPin={(pinned) => onPinChat(chat.id, pinned)}
                          onMute={(muted) => onMuteChat(chat.id, muted)}
                          onFavorite={(favorite) => onFavoriteChat(chat.id, favorite)}
                          onArchive={() => onArchiveChat(chat.id)}
                          onDelete={() => onDeleteChat(chat.id)}
                        />
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <ScrollArea className="h-full px-4">
            <div className="space-y-2">
              {filteredAndSortedChats.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">{t('noChatsFound')}</p>
                </div>
              ) : (
                filteredAndSortedChats.map((chat) => (
                  <ChatRoomItem
                    key={chat.id}
                    chat={chat}
                    isActive={activeChat === chat.id}
                    variant={variant}
                    onClick={() => onChatSelect(chat.id)}
                    onPin={(pinned) => onPinChat(chat.id, pinned)}
                    onMute={(muted) => onMuteChat(chat.id, muted)}
                    onFavorite={(favorite) => onFavoriteChat(chat.id, favorite)}
                    onArchive={() => onArchiveChat(chat.id)}
                    onDelete={() => onDeleteChat(chat.id)}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default ChatSidebar;