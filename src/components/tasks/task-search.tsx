import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Kbd } from '@/components/ui/kbd';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  X,
  Clock,
  Hash,
  User,
  FolderOpen,
  Flag,
  Calendar,
  Filter,
  ArrowUp,
  ArrowDown,
  Enter
} from 'lucide-react';

export interface SearchSuggestion {
  id: string;
  type: 'task' | 'project' | 'assignee' | 'tag' | 'filter';
  title: string;
  subtitle?: string;
  icon?: React.ReactElement;
  data?: any;
}

export interface TaskSearchProps {
  value: string;
  onChange: (query: string) => void;
  onSearch?: (query: string) => void;
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  suggestions?: SearchSuggestion[];
  recentSearches?: string[];
  placeholder?: string;
  showSuggestions?: boolean;
  showRecentSearches?: boolean;
  showSearchFilters?: boolean;
  maxSuggestions?: number;
  debounceMs?: number;
  className?: string;
}

const SearchFilter: React.FC<{
  type: string;
  label: string;
  icon: React.ReactElement;
  isActive: boolean;
  onClick: () => void;
}> = ({ type, label, icon, isActive, onClick }) => (
  <Badge
    variant={isActive ? 'default' : 'outline'}
    className="cursor-pointer flex items-center gap-1"
    onClick={onClick}
  >
    {React.cloneElement(icon, { className: 'h-3 w-3' })}
    {label}
  </Badge>
);

const SuggestionItem: React.FC<{
  suggestion: SearchSuggestion;
  isHighlighted: boolean;
  onClick: () => void;
}> = ({ suggestion, isHighlighted, onClick }) => {
  const getIcon = () => {
    if (suggestion.icon) return suggestion.icon;

    switch (suggestion.type) {
      case 'task':
        return <Hash className="h-4 w-4" />;
      case 'project':
        return <FolderOpen className="h-4 w-4" />;
      case 'assignee':
        return <User className="h-4 w-4" />;
      case 'tag':
        return <Hash className="h-4 w-4" />;
      case 'filter':
        return <Filter className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const getTypeColor = () => {
    switch (suggestion.type) {
      case 'task':
        return 'text-blue-600';
      case 'project':
        return 'text-green-600';
      case 'assignee':
        return 'text-purple-600';
      case 'tag':
        return 'text-yellow-600';
      case 'filter':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div
      className={`flex items-center gap-3 p-2 rounded-md cursor-pointer ${
        isHighlighted ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      <div className={getTypeColor()}>{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{suggestion.title}</div>
        {suggestion.subtitle && (
          <div className="text-xs text-gray-500 truncate">{suggestion.subtitle}</div>
        )}
      </div>
      <Badge variant="outline" className="text-xs">
        {suggestion.type}
      </Badge>
    </div>
  );
};

export const TaskSearch: React.FC<TaskSearchProps> = ({
  value,
  onChange,
  onSearch,
  onSuggestionSelect,
  suggestions = [],
  recentSearches = [],
  placeholder,
  showSuggestions = true,
  showRecentSearches = true,
  showSearchFilters = true,
  maxSuggestions = 6,
  debounceMs = 300,
  className = ''
}) => {
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [debouncedValue, setDebouncedValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Debounce search value
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
      if (onSearch && value.trim()) {
        onSearch(value);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, onSearch, debounceMs]);

  // Reset highlight when suggestions change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [suggestions, value]);

  const searchFilters = [
    { key: 'all', label: t('all'), icon: <Search /> },
    { key: 'tasks', label: t('tasks'), icon: <Hash /> },
    { key: 'projects', label: t('projects'), icon: <FolderOpen /> },
    { key: 'assignees', label: t('people'), icon: <User /> },
    { key: 'tags', label: t('tags'), icon: <Hash /> }
  ];

  const handleFilterToggle = (filterKey: string) => {
    const newFilters = new Set(activeFilters);
    if (filterKey === 'all') {
      newFilters.clear();
    } else {
      if (newFilters.has(filterKey)) {
        newFilters.delete(filterKey);
      } else {
        newFilters.add(filterKey);
        newFilters.delete('all');
      }
    }
    setActiveFilters(newFilters);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const visibleSuggestions = suggestions.slice(0, maxSuggestions);
    const recentItems = showRecentSearches ? recentSearches : [];
    const totalItems = visibleSuggestions.length + recentItems.length;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < totalItems - 1 ? prev + 1 : 0
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev > 0 ? prev - 1 : totalItems - 1
        );
        break;

      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          if (highlightedIndex < visibleSuggestions.length) {
            const suggestion = visibleSuggestions[highlightedIndex];
            handleSuggestionSelect(suggestion);
          } else {
            const recentIndex = highlightedIndex - visibleSuggestions.length;
            onChange(recentItems[recentIndex]);
          }
        } else if (value.trim() && onSearch) {
          onSearch(value);
        }
        break;

      case 'Escape':
        setIsFocused(false);
        inputRef.current?.blur();
        break;

      case 'Tab':
        if (highlightedIndex >= 0) {
          e.preventDefault();
          if (highlightedIndex < visibleSuggestions.length) {
            const suggestion = visibleSuggestions[highlightedIndex];
            handleSuggestionSelect(suggestion);
          }
        }
        break;
    }
  };

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    onChange(suggestion.title);
    setIsFocused(false);
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    }
  };

  const handleRecentSelect = (recent: string) => {
    onChange(recent);
    setIsFocused(false);
  };

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const visibleSuggestions = suggestions.slice(0, maxSuggestions);
  const showDropdown = isFocused && (
    (showSuggestions && visibleSuggestions.length > 0) ||
    (showRecentSearches && recentSearches.length > 0 && !value.trim())
  );

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            // Delay blur to allow click on suggestions
            setTimeout(() => setIsFocused(false), 200);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || t('searchTasks')}
          className="pl-10 pr-10"
        />
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Filters */}
      {showSearchFilters && (
        <div className="flex flex-wrap gap-1 mt-2">
          {searchFilters.map((filter) => (
            <SearchFilter
              key={filter.key}
              type={filter.key}
              label={filter.label}
              icon={filter.icon}
              isActive={activeFilters.has(filter.key) || (activeFilters.size === 0 && filter.key === 'all')}
              onClick={() => handleFilterToggle(filter.key)}
            />
          ))}
        </div>
      )}

      {/* Suggestions Dropdown */}
      {showDropdown && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg">
          <ScrollArea className="max-h-80">
            <div className="p-2">
              {/* Suggestions */}
              {showSuggestions && visibleSuggestions.length > 0 && (
                <div className="space-y-1">
                  {visibleSuggestions.map((suggestion, index) => (
                    <div
                      key={suggestion.id}
                      ref={el => suggestionRefs.current[index] = el}
                    >
                      <SuggestionItem
                        suggestion={suggestion}
                        isHighlighted={highlightedIndex === index}
                        onClick={() => handleSuggestionSelect(suggestion)}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Recent Searches */}
              {showRecentSearches && recentSearches.length > 0 && !value.trim() && (
                <>
                  {visibleSuggestions.length > 0 && <Separator className="my-2" />}
                  <div className="space-y-1">
                    <div className="px-2 py-1 text-xs font-medium text-gray-500 uppercase">
                      {t('recentSearches')}
                    </div>
                    {recentSearches.slice(0, 3).map((recent, index) => {
                      const recentIndex = visibleSuggestions.length + index;
                      return (
                        <div
                          key={recent}
                          className={`flex items-center gap-3 p-2 rounded-md cursor-pointer ${
                            highlightedIndex === recentIndex ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => handleRecentSelect(recent)}
                        >
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm flex-1">{recent}</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Keyboard shortcuts */}
              {(visibleSuggestions.length > 0 || recentSearches.length > 0) && (
                <>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between px-2 py-1 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Kbd>↑</Kbd>
                        <Kbd>↓</Kbd>
                        <span>{t('navigate')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Kbd>↵</Kbd>
                        <span>{t('select')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Kbd>Esc</Kbd>
                      <span>{t('close')}</span>
                    </div>
                  </div>
                </>
              )}

              {/* No results */}
              {showSuggestions && value.trim() && visibleSuggestions.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">{t('noResultsFound')}</p>
                  <p className="text-xs mt-1">{t('tryDifferentKeywords')}</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
};

export default TaskSearch;