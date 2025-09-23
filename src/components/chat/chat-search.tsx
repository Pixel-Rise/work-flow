import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  Search,
  Filter,
  Calendar as CalendarIcon,
  User,
  Hash,
  File,
  Image as ImageIcon,
  Video,
  Mic,
  Clock,
  ArrowUp,
  ArrowDown,
  X,
  ChevronLeft,
  ChevronRight,
  MoreVertical
} from 'lucide-react';

export type MessageType = 'text' | 'image' | 'file' | 'voice' | 'video' | 'system';
export type SearchFilterType = 'all' | 'text' | 'images' | 'files' | 'media' | 'links';
export type SortOrder = 'newest' | 'oldest' | 'relevance';

export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  type: MessageType;
  sender: ChatUser;
  timestamp: string;
  chatId: string;
  chatName: string;
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
}

export interface SearchResult {
  message: ChatMessage;
  matches: {
    start: number;
    end: number;
    text: string;
  }[];
}

export interface ChatSearchProps {
  messages: ChatMessage[];
  onMessageClick: (messageId: string, chatId: string) => void;
  onClose: () => void;
  variant?: 'default' | 'compact' | 'minimal';
  className?: string;
}

const SearchFilters: React.FC<{
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterType: SearchFilterType;
  onFilterChange: (type: SearchFilterType) => void;
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
  dateRange: { from?: Date; to?: Date };
  onDateRangeChange: (range: { from?: Date; to?: Date }) => void;
  selectedSender?: string;
  onSenderChange: (senderId?: string) => void;
  senders: ChatUser[];
  variant: 'default' | 'compact' | 'minimal';
}> = ({
  searchQuery,
  onSearchChange,
  filterType,
  onFilterChange,
  sortOrder,
  onSortChange,
  dateRange,
  onDateRangeChange,
  selectedSender,
  onSenderChange,
  senders,
  variant
}) => {
  const { t } = useTranslation();
  const isCompact = variant === 'compact' || variant === 'minimal';

  const filterTypes = [
    { value: 'all', label: 'allMessages', icon: Hash },
    { value: 'text', label: 'textMessages', icon: Search },
    { value: 'images', label: 'images', icon: ImageIcon },
    { value: 'files', label: 'files', icon: File },
    { value: 'media', label: 'media', icon: Video },
    { value: 'links', label: 'links', icon: Hash }
  ];

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t('searchMessages')}
          className="pl-10"
          size={isCompact ? 'sm' : 'default'}
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSearchChange('')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Quick Filters */}
      {!isCompact && (
        <div className="flex flex-wrap gap-2">
          {filterTypes.map(({ value, label, icon: IconComponent }) => (
            <Button
              key={value}
              variant={filterType === value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFilterChange(value as SearchFilterType)}
              className="text-xs"
            >
              <IconComponent className="h-3 w-3 mr-1" />
              {t(label)}
            </Button>
          ))}
        </div>
      )}

      {/* Advanced Filters */}
      <div className="flex flex-wrap gap-2">
        {/* Sort Order */}
        <Select value={sortOrder} onValueChange={(value: SortOrder) => onSortChange(value)}>
          <SelectTrigger className={cn('w-32', isCompact && 'w-28 text-xs')}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">{t('relevance')}</SelectItem>
            <SelectItem value="newest">{t('newest')}</SelectItem>
            <SelectItem value="oldest">{t('oldest')}</SelectItem>
          </SelectContent>
        </Select>

        {/* Sender Filter */}
        {!isCompact && senders.length > 0 && (
          <Select value={selectedSender || 'all'} onValueChange={(value) =>
            onSenderChange(value === 'all' ? undefined : value)
          }>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allSenders')}</SelectItem>
              {senders.map((sender) => (
                <SelectItem key={sender.id} value={sender.id}>
                  {sender.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Date Range */}
        {!isCompact && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <CalendarIcon className="h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
                  ) : (
                    dateRange.from.toLocaleDateString()
                  )
                ) : (
                  t('selectDate')
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={(range) => onDateRangeChange(range || {})}
                numberOfMonths={2}
              />
              <div className="p-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDateRangeChange({})}
                  className="w-full"
                >
                  {t('clearDate')}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
};

const SearchResultItem: React.FC<{
  result: SearchResult;
  onClick: () => void;
  variant: 'default' | 'compact' | 'minimal';
}> = ({ result, onClick, variant }) => {
  const { t } = useTranslation();
  const { message, matches } = result;
  const isCompact = variant === 'compact' || variant === 'minimal';

  const highlightMatches = (text: string, matches: typeof result.matches) => {
    if (matches.length === 0) return text;

    const parts = [];
    let lastEnd = 0;

    matches.forEach((match, index) => {
      // Add text before match
      if (match.start > lastEnd) {
        parts.push(
          <span key={`before-${index}`}>
            {text.slice(lastEnd, match.start)}
          </span>
        );
      }

      // Add highlighted match
      parts.push(
        <span key={`match-${index}`} className="bg-yellow-200 font-medium">
          {match.text}
        </span>
      );

      lastEnd = match.end;
    });

    // Add remaining text
    if (lastEnd < text.length) {
      parts.push(
        <span key="after">
          {text.slice(lastEnd)}
        </span>
      );
    }

    return parts;
  };

  const getMessageTypeIcon = () => {
    switch (message.type) {
      case 'image':
        return <ImageIcon className="h-3 w-3" />;
      case 'file':
        return <File className="h-3 w-3" />;
      case 'voice':
        return <Mic className="h-3 w-3" />;
      case 'video':
        return <Video className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <Card className="cursor-pointer hover:shadow-md transition-all duration-200" onClick={onClick}>
      <CardContent className={cn('p-4', isCompact && 'p-3')}>
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <Avatar className={cn(
            isCompact ? 'h-8 w-8' : 'h-10 w-10'
          )}>
            <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
            <AvatarFallback>
              {message.sender.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={cn(
                  'font-medium',
                  isCompact ? 'text-sm' : 'text-base'
                )}>
                  {message.sender.name}
                </span>

                <Badge variant="outline" className="text-xs">
                  {message.chatName}
                </Badge>

                {getMessageTypeIcon() && (
                  <div className="text-gray-500">
                    {getMessageTypeIcon()}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-gray-500">
                <Clock className="h-3 w-3" />
                <span className="text-xs">
                  {new Date(message.timestamp).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Message Content */}
            <div className={cn(
              'text-gray-700',
              isCompact ? 'text-sm' : 'text-base'
            )}>
              {message.content ? (
                <p className="break-words">
                  {highlightMatches(message.content, matches)}
                </p>
              ) : (
                <div className="flex items-center gap-2 text-gray-500 italic">
                  {getMessageTypeIcon()}
                  <span>{t(`messageType.${message.type}`)}</span>
                </div>
              )}
            </div>

            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {message.attachments.map((attachment) => (
                  <Badge key={attachment.id} variant="secondary" className="text-xs">
                    <File className="h-3 w-3 mr-1" />
                    {attachment.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SearchStats: React.FC<{
  totalResults: number;
  currentPage: number;
  totalPages: number;
  searchTime: number;
  variant: 'default' | 'compact' | 'minimal';
}> = ({ totalResults, currentPage, totalPages, searchTime, variant }) => {
  const { t } = useTranslation();
  const isCompact = variant === 'compact' || variant === 'minimal';

  return (
    <div className={cn(
      'flex items-center justify-between text-sm text-gray-600 bg-gray-50 rounded-lg p-3',
      isCompact && 'p-2 text-xs'
    )}>
      <div>
        {totalResults > 0 ? (
          <span>
            {t('searchResults', {
              total: totalResults,
              time: searchTime.toFixed(2)
            })}
          </span>
        ) : (
          <span>{t('noResults')}</span>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <span>
            {t('pageInfo', { current: currentPage, total: totalPages })}
          </span>
        </div>
      )}
    </div>
  );
};

export const ChatSearch: React.FC<ChatSearchProps> = ({
  messages,
  onMessageClick,
  onClose,
  variant = 'default',
  className
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<SearchFilterType>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('relevance');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedSender, setSelectedSender] = useState<string>();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTime, setSearchTime] = useState(0);

  const resultsPerPage = variant === 'minimal' ? 5 : variant === 'compact' ? 10 : 20;
  const isCompact = variant === 'compact' || variant === 'minimal';

  // Get unique senders
  const senders = useMemo(() => {
    const uniqueSenders = new Map();
    messages.forEach(message => {
      if (!uniqueSenders.has(message.sender.id)) {
        uniqueSenders.set(message.sender.id, message.sender);
      }
    });
    return Array.from(uniqueSenders.values());
  }, [messages]);

  // Search and filter logic
  const searchResults = useMemo(() => {
    const startTime = performance.now();

    let filteredMessages = messages.filter(message => {
      // Filter by type
      if (filterType !== 'all') {
        switch (filterType) {
          case 'text':
            if (message.type !== 'text' || !message.content) return false;
            break;
          case 'images':
            if (message.type !== 'image') return false;
            break;
          case 'files':
            if (message.type !== 'file') return false;
            break;
          case 'media':
            if (!['image', 'video', 'voice'].includes(message.type)) return false;
            break;
          case 'links':
            if (!message.content || !message.content.includes('http')) return false;
            break;
        }
      }

      // Filter by sender
      if (selectedSender && message.sender.id !== selectedSender) {
        return false;
      }

      // Filter by date range
      if (dateRange.from || dateRange.to) {
        const messageDate = new Date(message.timestamp);
        if (dateRange.from && messageDate < dateRange.from) return false;
        if (dateRange.to && messageDate > dateRange.to) return false;
      }

      return true;
    });

    // Search in content
    let results: SearchResult[] = [];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();

      results = filteredMessages
        .map(message => {
          const content = message.content?.toLowerCase() || '';
          const matches: { start: number; end: number; text: string }[] = [];

          // Find all matches
          let index = 0;
          while (true) {
            const foundIndex = content.indexOf(query, index);
            if (foundIndex === -1) break;

            matches.push({
              start: foundIndex,
              end: foundIndex + query.length,
              text: message.content?.substring(foundIndex, foundIndex + query.length) || ''
            });

            index = foundIndex + 1;
          }

          return { message, matches };
        })
        .filter(result => result.matches.length > 0);
    } else {
      results = filteredMessages.map(message => ({
        message,
        matches: []
      }));
    }

    // Sort results
    results.sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          return new Date(b.message.timestamp).getTime() - new Date(a.message.timestamp).getTime();
        case 'oldest':
          return new Date(a.message.timestamp).getTime() - new Date(b.message.timestamp).getTime();
        case 'relevance':
        default:
          if (searchQuery.trim()) {
            return b.matches.length - a.matches.length;
          }
          return new Date(b.message.timestamp).getTime() - new Date(a.message.timestamp).getTime();
      }
    });

    const endTime = performance.now();
    setSearchTime(endTime - startTime);

    return results;
  }, [messages, searchQuery, filterType, sortOrder, dateRange, selectedSender]);

  // Pagination
  const totalPages = Math.ceil(searchResults.length / resultsPerPage);
  const currentResults = searchResults.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType, sortOrder, dateRange, selectedSender]);

  return (
    <Card className={cn('h-full flex flex-col', className)}>
      <CardHeader className={cn('pb-4', isCompact && 'pb-2')}>
        <div className="flex items-center justify-between">
          <CardTitle className={cn(
            'flex items-center gap-2',
            isCompact ? 'text-lg' : 'text-xl'
          )}>
            <Search className="h-5 w-5" />
            {t('searchMessages')}
          </CardTitle>

          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <SearchFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterType={filterType}
          onFilterChange={setFilterType}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          selectedSender={selectedSender}
          onSenderChange={setSelectedSender}
          senders={senders}
          variant={variant}
        />
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden flex flex-col p-0">
        {/* Search Stats */}
        <div className="px-4 pb-4">
          <SearchStats
            totalResults={searchResults.length}
            currentPage={currentPage}
            totalPages={totalPages}
            searchTime={searchTime}
            variant={variant}
          />
        </div>

        {/* Results */}
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-3">
            {currentResults.length > 0 ? (
              currentResults.map((result) => (
                <SearchResultItem
                  key={result.message.id}
                  result={result}
                  onClick={() => onMessageClick(result.message.id, result.message.chatId)}
                  variant={variant}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery ? t('noSearchResults') : t('startSearching')}
                </h3>
                <p className="text-gray-500">
                  {searchQuery
                    ? t('tryDifferentQuery')
                    : t('enterQueryToSearch')
                  }
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                {t('previous')}
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + Math.max(1, currentPage - 2);
                  if (pageNum > totalPages) return null;

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <span className="text-gray-500">...</span>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                {t('next')}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChatSearch;