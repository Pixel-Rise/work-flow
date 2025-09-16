import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Separator } from '@/components/ui/separator'
import {
  Search,
  X,
  ChevronUp,
  ChevronDown,
  Calendar as CalendarIcon,
  Filter,
  User,
  FileText,
  Image,
  Paperclip,
  Link,
  RotateCcw,
  Clock,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'

export interface SearchMessage {
  id: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  timestamp: Date
  chatId: string
  chatName: string
  messageType: 'text' | 'image' | 'file' | 'link'
  hasAttachments: boolean
  isEdited: boolean
  replyTo?: {
    id: string
    content: string
    author: string
  }
}

export interface SearchFilters {
  author?: string
  dateRange?: {
    from?: Date
    to?: Date
  }
  messageType?: 'all' | 'text' | 'image' | 'file' | 'link'
  chatId?: string
  hasAttachments?: boolean
}

interface MessageSearchProps {
  messages: SearchMessage[]
  chats: { id: string; name: string }[]
  authors: { id: string; name: string; avatar?: string }[]
  onMessageSelect?: (message: SearchMessage) => void
  onSearchResults?: (results: SearchMessage[]) => void
  placeholder?: string
  variant?: 'default' | 'compact' | 'modal'
  showFilters?: boolean
  showStats?: boolean
  maxResults?: number
  className?: string
}

export function MessageSearch({
  messages,
  chats,
  authors,
  onMessageSelect,
  onSearchResults,
  placeholder,
  variant = 'default',
  showFilters = true,
  showStats = true,
  maxResults = 50,
  className
}: MessageSearchProps) {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({})
  const [results, setResults] = useState<SearchMessage[]>([])
  const [currentResult, setCurrentResult] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        performSearch()
      } else {
        setResults([])
        setCurrentResult(0)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, filters])

  const performSearch = async () => {
    setIsLoading(true)

    try {
      let filteredMessages = [...messages]

      // Apply text search
      if (query.trim()) {
        const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0)
        filteredMessages = filteredMessages.filter(message =>
          searchTerms.every(term =>
            message.content.toLowerCase().includes(term) ||
            message.author.name.toLowerCase().includes(term) ||
            message.chatName.toLowerCase().includes(term)
          )
        )
      }

      // Apply author filter
      if (filters.author && filters.author !== 'all') {
        filteredMessages = filteredMessages.filter(message => message.author.id === filters.author)
      }

      // Apply date range filter
      if (filters.dateRange?.from || filters.dateRange?.to) {
        filteredMessages = filteredMessages.filter(message => {
          const messageDate = message.timestamp
          if (filters.dateRange?.from && messageDate < filters.dateRange.from) return false
          if (filters.dateRange?.to && messageDate > filters.dateRange.to) return false
          return true
        })
      }

      // Apply message type filter
      if (filters.messageType && filters.messageType !== 'all') {
        filteredMessages = filteredMessages.filter(message => message.messageType === filters.messageType)
      }

      // Apply chat filter
      if (filters.chatId && filters.chatId !== 'all') {
        filteredMessages = filteredMessages.filter(message => message.chatId === filters.chatId)
      }

      // Apply attachments filter
      if (filters.hasAttachments !== undefined) {
        filteredMessages = filteredMessages.filter(message => message.hasAttachments === filters.hasAttachments)
      }

      // Sort by relevance and date
      filteredMessages.sort((a, b) => {
        // Prioritize exact matches
        const aExact = a.content.toLowerCase().includes(query.toLowerCase())
        const bExact = b.content.toLowerCase().includes(query.toLowerCase())
        if (aExact && !bExact) return -1
        if (!aExact && bExact) return 1

        // Then by date (newest first)
        return b.timestamp.getTime() - a.timestamp.getTime()
      })

      const limitedResults = filteredMessages.slice(0, maxResults)
      setResults(limitedResults)
      setCurrentResult(0)
      onSearchResults?.(limitedResults)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const navigateResults = (direction: 'up' | 'down') => {
    if (results.length === 0) return

    let newIndex
    if (direction === 'up') {
      newIndex = currentResult > 0 ? currentResult - 1 : results.length - 1
    } else {
      newIndex = currentResult < results.length - 1 ? currentResult + 1 : 0
    }

    setCurrentResult(newIndex)
    onMessageSelect?.(results[newIndex])
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setCurrentResult(0)
    setFilters({})
  }

  const highlightText = (text: string, searchQuery: string) => {
    if (!searchQuery.trim()) return text

    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (days === 1) {
      return t('yesterday')
    } else if (days < 7) {
      return t('daysAgo', { days })
    } else {
      return date.toLocaleDateString()
    }
  }

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-3 w-3" />
      case 'file':
        return <Paperclip className="h-3 w-3" />
      case 'link':
        return <Link className="h-3 w-3" />
      default:
        return <FileText className="h-3 w-3" />
    }
  }

  if (variant === 'compact') {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            placeholder={placeholder || t('searchMessages')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-20"
          />

          {query && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {results.length > 0 && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => navigateResults('up')}
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <span className="text-xs text-muted-foreground min-w-[40px] text-center">
                    {results.length > 0 ? `${currentResult + 1}/${results.length}` : '0'}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => navigateResults('down')}
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={clearSearch}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Header */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            placeholder={placeholder || t('searchMessages')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {showFilters && (
          <Popover open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {t('filters')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{t('searchFilters')}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilters({})}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    {t('reset')}
                  </Button>
                </div>

                {/* Author Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('author')}</label>
                  <Select value={filters.author || 'all'} onValueChange={(value) =>
                    setFilters(prev => ({ ...prev, author: value === 'all' ? undefined : value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('allAuthors')}</SelectItem>
                      {authors.map((author) => (
                        <SelectItem key={author.id} value={author.id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-4 w-4">
                              <AvatarImage src={author.avatar} />
                              <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {author.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Chat Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('chat')}</label>
                  <Select value={filters.chatId || 'all'} onValueChange={(value) =>
                    setFilters(prev => ({ ...prev, chatId: value === 'all' ? undefined : value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('allChats')}</SelectItem>
                      {chats.map((chat) => (
                        <SelectItem key={chat.id} value={chat.id}>
                          {chat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Message Type Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('messageType')}</label>
                  <Select value={filters.messageType || 'all'} onValueChange={(value) =>
                    setFilters(prev => ({ ...prev, messageType: value === 'all' ? undefined : value as any }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('allTypes')}</SelectItem>
                      <SelectItem value="text">{t('textMessages')}</SelectItem>
                      <SelectItem value="image">{t('images')}</SelectItem>
                      <SelectItem value="file">{t('files')}</SelectItem>
                      <SelectItem value="link">{t('links')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('dateRange')}</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateRange?.from ? (
                          filters.dateRange.to ? (
                            `${filters.dateRange.from.toLocaleDateString()} - ${filters.dateRange.to.toLocaleDateString()}`
                          ) : (
                            filters.dateRange.from.toLocaleDateString()
                          )
                        ) : (
                          t('selectDateRange')
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={{
                          from: filters.dateRange?.from,
                          to: filters.dateRange?.to
                        }}
                        onSelect={(range) => setFilters(prev => ({
                          ...prev,
                          dateRange: { from: range?.from, to: range?.to }
                        }))}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}

        {query && (
          <Button variant="ghost" size="sm" onClick={clearSearch}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Stats */}
      {showStats && query && (
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            {isLoading ? t('searching') : t('searchResults', { count: results.length })}
          </span>
          {results.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateResults('up')}
                disabled={results.length === 0}
              >
                <ArrowUp className="h-3 w-3" />
              </Button>
              <span className="min-w-[60px] text-center">
                {currentResult + 1} / {results.length}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateResults('down')}
                disabled={results.length === 0}
              >
                <ArrowDown className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <ScrollArea className="h-96 border rounded-lg">
          <div className="p-2 space-y-2">
            {results.map((message, index) => (
              <div
                key={message.id}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted",
                  currentResult === index && "bg-primary/10 border-primary"
                )}
                onClick={() => {
                  setCurrentResult(index)
                  onMessageSelect?.(message)
                }}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={message.author.avatar} />
                    <AvatarFallback className="text-xs">
                      {message.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{message.author.name}</span>
                      <span className="text-xs text-muted-foreground">{message.chatName}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(message.timestamp)}
                      </span>
                      {getMessageIcon(message.messageType)}
                      {message.isEdited && (
                        <Badge variant="outline" className="text-xs">
                          {t('edited')}
                        </Badge>
                      )}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {highlightText(message.content, query)}
                    </div>

                    {message.replyTo && (
                      <div className="mt-2 pl-3 border-l-2 border-muted">
                        <div className="text-xs text-muted-foreground">
                          {t('replyingTo')} {message.replyTo.author}:
                        </div>
                        <div className="text-xs">
                          {message.replyTo.content.substring(0, 100)}...
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* No Results */}
      {query && !isLoading && results.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>{t('noSearchResults')}</p>
          <p className="text-sm">{t('tryDifferentKeywords')}</p>
        </div>
      )}
    </div>
  )
}

export default MessageSearch