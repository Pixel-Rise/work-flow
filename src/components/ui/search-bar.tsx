import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Search,
  X,
  Filter,
  Clock,
  TrendingUp,
  Star,
  ArrowRight,
  Loader2,
  History,
  Bookmark,
  Tag,
  Hash
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'

export interface SearchSuggestion {
  id: string
  text: string
  type: 'history' | 'suggestion' | 'trending' | 'saved'
  category?: string
  count?: number
  icon?: React.ComponentType<any>
}

export interface SearchFilter {
  id: string
  label: string
  value: string
  active: boolean
}

export interface SearchBarProps {
  value?: string
  placeholder?: string
  disabled?: boolean
  loading?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'minimal' | 'bordered'
  showSuggestions?: boolean
  showFilters?: boolean
  showRecent?: boolean
  suggestions?: SearchSuggestion[]
  filters?: SearchFilter[]
  recentSearches?: string[]
  savedSearches?: string[]
  maxSuggestions?: number
  debounceMs?: number
  onSearch?: (query: string) => void
  onSuggestionClick?: (suggestion: SearchSuggestion) => void
  onFilterChange?: (filters: SearchFilter[]) => void
  onClear?: () => void
  className?: string
}

const TRENDING_SEARCHES = [
  { id: '1', text: 'React components', type: 'trending' as const, count: 1200 },
  { id: '2', text: 'TypeScript tutorial', type: 'trending' as const, count: 950 },
  { id: '3', text: 'UI design patterns', type: 'trending' as const, count: 780 }
]

const SUGGESTION_CATEGORIES = [
  { id: 'pages', label: 'Pages', icon: Hash },
  { id: 'users', label: 'Users', icon: Star },
  { id: 'projects', label: 'Projects', icon: Bookmark },
  { id: 'tags', label: 'Tags', icon: Tag }
]

export function SearchBar({
  value = '',
  placeholder = 'Search...',
  disabled = false,
  loading = false,
  size = 'md',
  variant = 'default',
  showSuggestions = true,
  showFilters = false,
  showRecent = true,
  suggestions = [],
  filters = [],
  recentSearches = [],
  savedSearches = [],
  maxSuggestions = 8,
  debounceMs = 300,
  onSearch,
  onSuggestionClick,
  onFilterChange,
  onClear,
  className
}: SearchBarProps) {
  const { t } = useTranslation()
  const [query, setQuery] = useState(value)
  const [open, setOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout>()
  const inputRef = useRef<HTMLInputElement>(null)

  const activeFilters = filters.filter(f => f.active)

  useEffect(() => {
    setQuery(value)
  }, [value])

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery)

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      onSearch?.(newQuery)
    }, debounceMs)
  }

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (query.trim()) {
      onSearch?.(query.trim())
      setOpen(false)
      inputRef.current?.blur()
    }
  }

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text)
    onSuggestionClick?.(suggestion)
    onSearch?.(suggestion.text)
    setOpen(false)
  }

  const handleClear = () => {
    setQuery('')
    onClear?.()
    inputRef.current?.focus()
  }

  const handleFilterToggle = (filterId: string) => {
    const updatedFilters = filters.map(f =>
      f.id === filterId ? { ...f, active: !f.active } : f
    )
    onFilterChange?.(updatedFilters)
  }

  const renderSuggestionIcon = (suggestion: SearchSuggestion) => {
    switch (suggestion.type) {
      case 'history':
        return <Clock className="w-4 h-4 text-muted-foreground" />
      case 'trending':
        return <TrendingUp className="w-4 h-4 text-orange-500" />
      case 'saved':
        return <Star className="w-4 h-4 text-yellow-500" />
      default:
        return suggestion.icon ? <suggestion.icon className="w-4 h-4 text-muted-foreground" /> : <Search className="w-4 h-4 text-muted-foreground" />
    }
  }

  const groupedSuggestions = suggestions.reduce((groups, suggestion) => {
    const category = suggestion.category || suggestion.type
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(suggestion)
    return groups
  }, {} as Record<string, SearchSuggestion[]>)

  const sizeClasses = {
    sm: 'h-8 text-sm',
    md: 'h-10',
    lg: 'h-12 text-lg'
  }

  const searchInput = (
    <div className={cn(
      "relative flex items-center w-full",
      variant === 'bordered' && "border rounded-lg bg-background",
      variant === 'minimal' && "bg-transparent"
    )}>
      <div className="relative flex-1">
        <Search className={cn(
          "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground",
          size === 'sm' ? "w-3 h-3" : size === 'lg' ? "w-5 h-5" : "w-4 h-4"
        )} />

        <form onSubmit={handleSubmit}>
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => showSuggestions && setOpen(true)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "pl-10 pr-20 border-0 focus-visible:ring-0 focus-visible:ring-offset-0",
              variant === 'bordered' && "border",
              variant === 'minimal' && "bg-muted/50",
              sizeClasses[size]
            )}
          />
        </form>

        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {loading && (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          )}

          {query && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={handleClear}
            >
              <X className="w-3 h-3" />
            </Button>
          )}

          {showFilters && (
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-6 w-6 p-0",
                activeFilters.length > 0 && "text-primary"
              )}
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <Filter className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-1 ml-2">
          {activeFilters.slice(0, 2).map((filter) => (
            <Badge
              key={filter.id}
              variant="secondary"
              className="text-xs h-6"
            >
              {filter.label}
              <Button
                variant="ghost"
                size="sm"
                className="h-3 w-3 p-0 ml-1"
                onClick={() => handleFilterToggle(filter.id)}
              >
                <X className="w-2 h-2" />
              </Button>
            </Badge>
          ))}
          {activeFilters.length > 2 && (
            <Badge variant="outline" className="text-xs h-6">
              +{activeFilters.length - 2}
            </Badge>
          )}
        </div>
      )}
    </div>
  )

  return (
    <div className={cn("relative w-full", className)}>
      {showSuggestions ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            {searchInput}
          </PopoverTrigger>
          <PopoverContent
            className="p-0 w-full"
            style={{ minWidth: 'var(--radix-popover-trigger-width)' }}
            align="start"
          >
            <Command className="max-h-96 overflow-hidden">
              <CommandList className="max-h-80">
                {/* Recent Searches */}
                {showRecent && recentSearches.length > 0 && !query && (
                  <CommandGroup heading={t('recent')}>
                    {recentSearches.slice(0, 5).map((search, index) => (
                      <CommandItem
                        key={`recent-${index}`}
                        value={search}
                        onSelect={() => handleSuggestionSelect({
                          id: `recent-${index}`,
                          text: search,
                          type: 'history'
                        })}
                      >
                        <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>{search}</span>
                        <ArrowRight className="w-3 h-3 ml-auto text-muted-foreground" />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {/* Saved Searches */}
                {savedSearches.length > 0 && !query && (
                  <CommandGroup heading={t('saved')}>
                    {savedSearches.slice(0, 3).map((search, index) => (
                      <CommandItem
                        key={`saved-${index}`}
                        value={search}
                        onSelect={() => handleSuggestionSelect({
                          id: `saved-${index}`,
                          text: search,
                          type: 'saved'
                        })}
                      >
                        <Star className="w-4 h-4 mr-2 text-yellow-500" />
                        <span>{search}</span>
                        <ArrowRight className="w-3 h-3 ml-auto text-muted-foreground" />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {/* Trending Searches */}
                {!query && (
                  <CommandGroup heading={t('trending')}>
                    {TRENDING_SEARCHES.slice(0, 3).map((trending) => (
                      <CommandItem
                        key={trending.id}
                        value={trending.text}
                        onSelect={() => handleSuggestionSelect(trending)}
                      >
                        <TrendingUp className="w-4 h-4 mr-2 text-orange-500" />
                        <span>{trending.text}</span>
                        <Badge variant="outline" className="ml-auto text-xs">
                          {trending.count}
                        </Badge>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {/* Suggestions */}
                {query && Object.entries(groupedSuggestions).map(([category, categorySuggestions]) => (
                  <CommandGroup
                    key={category}
                    heading={SUGGESTION_CATEGORIES.find(c => c.id === category)?.label || category}
                  >
                    {categorySuggestions.slice(0, maxSuggestions).map((suggestion) => (
                      <CommandItem
                        key={suggestion.id}
                        value={suggestion.text}
                        onSelect={() => handleSuggestionSelect(suggestion)}
                      >
                        {renderSuggestionIcon(suggestion)}
                        <span className="ml-2">{suggestion.text}</span>
                        {suggestion.count && (
                          <Badge variant="outline" className="ml-auto text-xs">
                            {suggestion.count}
                          </Badge>
                        )}
                        <ArrowRight className="w-3 h-3 ml-2 text-muted-foreground" />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))}

                {query && suggestions.length === 0 && (
                  <CommandEmpty>
                    <div className="py-6 text-center text-sm">
                      <Search className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p>{t('noResultsFound')}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2"
                        onClick={handleSubmit}
                      >
                        {t('searchFor')} "{query}"
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </CommandEmpty>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      ) : (
        searchInput
      )}

      {/* Filters Popover */}
      {showFilters && filters.length > 0 && (
        <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
          <PopoverTrigger asChild>
            <div />
          </PopoverTrigger>
          <PopoverContent className="w-72 p-4" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">{t('filters')}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const clearedFilters = filters.map(f => ({ ...f, active: false }))
                    onFilterChange?.(clearedFilters)
                  }}
                >
                  {t('clearAll')}
                </Button>
              </div>

              <div className="space-y-2">
                {filters.map((filter) => (
                  <div
                    key={filter.id}
                    className="flex items-center justify-between"
                  >
                    <label
                      htmlFor={filter.id}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {filter.label}
                    </label>
                    <input
                      id={filter.id}
                      type="checkbox"
                      checked={filter.active}
                      onChange={() => handleFilterToggle(filter.id)}
                      className="rounded border-border"
                    />
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}

export default SearchBar