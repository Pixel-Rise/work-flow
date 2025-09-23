import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Flag, ChevronDown, X, Check, AlertTriangle, Minus, Plus } from 'lucide-react';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface PriorityFilterProps {
  value: Priority[];
  onChange: (priorities: Priority[]) => void;
  variant?: 'dropdown' | 'sidebar' | 'inline';
  showCounts?: boolean;
  allowMultiple?: boolean;
  priorityCounts?: Record<Priority, number>;
  placeholder?: string;
  className?: string;
}

const PriorityIcon: React.FC<{ priority: Priority; className?: string }> = ({
  priority,
  className = 'h-4 w-4'
}) => {
  const iconMap: Record<Priority, React.ReactElement> = {
    low: <Minus className={`${className} text-green-600`} />,
    medium: <Flag className={`${className} text-yellow-600`} />,
    high: <Flag className={`${className} text-orange-600`} />,
    urgent: <AlertTriangle className={`${className} text-red-600`} />
  };

  return iconMap[priority];
};

const PriorityBadge: React.FC<{
  priority: Priority;
  count?: number;
  showCount?: boolean;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md';
}> = ({ priority, count, showCount = false, variant = 'outline', size = 'sm' }) => {
  const { t } = useTranslation();

  const colorMap: Record<Priority, string> = {
    low: variant === 'default' ? 'bg-green-100 text-green-800 border-green-200' : 'border-green-300 text-green-700',
    medium: variant === 'default' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 'border-yellow-300 text-yellow-700',
    high: variant === 'default' ? 'bg-orange-100 text-orange-800 border-orange-200' : 'border-orange-300 text-orange-700',
    urgent: variant === 'default' ? 'bg-red-100 text-red-800 border-red-200' : 'border-red-300 text-red-700'
  };

  const sizeClass = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1';

  return (
    <div className={`inline-flex items-center gap-1 rounded-full border ${colorMap[priority]} ${sizeClass}`}>
      <PriorityIcon priority={priority} className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
      <span className="font-medium">{t(`priority.${priority}`)}</span>
      {showCount && count !== undefined && (
        <Badge variant="secondary" className="text-xs h-4 px-1 ml-1">
          {count}
        </Badge>
      )}
    </div>
  );
};

export const PriorityFilter: React.FC<PriorityFilterProps> = ({
  value,
  onChange,
  variant = 'dropdown',
  showCounts = false,
  allowMultiple = true,
  priorityCounts,
  placeholder,
  className = ''
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const priorities: Priority[] = ['urgent', 'high', 'medium', 'low'];

  const handleTogglePriority = (priority: Priority) => {
    if (!allowMultiple) {
      onChange(value.includes(priority) ? [] : [priority]);
      if (variant === 'dropdown') setIsOpen(false);
      return;
    }

    if (value.includes(priority)) {
      onChange(value.filter(p => p !== priority));
    } else {
      onChange([...value, priority]);
    }
  };

  const handleSelectAll = () => {
    onChange([...priorities]);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const getDisplayText = () => {
    if (value.length === 0) {
      return placeholder || t('selectPriorities');
    }

    if (value.length === 1) {
      return t(`priority.${value[0]}`);
    }

    if (value.length === priorities.length) {
      return t('allPriorities');
    }

    return t('prioritiesSelected', { count: value.length });
  };

  const PriorityItem: React.FC<{
    priority: Priority;
    isSelected: boolean;
    onToggle: () => void;
  }> = ({ priority, isSelected, onToggle }) => (
    <div
      className={`flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer ${
        isSelected ? 'bg-blue-50' : ''
      }`}
      onClick={onToggle}
    >
      {allowMultiple && (
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggle}
          onClick={(e) => e.stopPropagation()}
        />
      )}

      <div className="flex items-center gap-2 flex-1">
        <PriorityIcon priority={priority} />
        <span className="text-sm font-medium">{t(`priority.${priority}`)}</span>
      </div>

      <div className="flex items-center gap-2">
        {showCounts && priorityCounts && priorityCounts[priority] !== undefined && (
          <Badge variant="secondary" className="text-xs">
            {priorityCounts[priority]}
          </Badge>
        )}
        {isSelected && !allowMultiple && (
          <Check className="h-4 w-4 text-green-600" />
        )}
      </div>
    </div>
  );

  if (variant === 'sidebar') {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium flex items-center gap-2">
            <Flag className="h-4 w-4" />
            {t('priority')}
            {value.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {value.length}
              </Badge>
            )}
          </label>
          {value.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        <div className="space-y-1">
          {priorities.map((priority) => (
            <PriorityItem
              key={priority}
              priority={priority}
              isSelected={value.includes(priority)}
              onToggle={() => handleTogglePriority(priority)}
            />
          ))}
        </div>

        {allowMultiple && (
          <div className="flex gap-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
              className="h-6 px-2 text-xs flex-1"
            >
              {t('selectAll')}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="h-6 px-2 text-xs flex-1"
            >
              {t('clearAll')}
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {priorities.map((priority) => (
          <div
            key={priority}
            className="cursor-pointer"
            onClick={() => handleTogglePriority(priority)}
          >
            <PriorityBadge
              priority={priority}
              count={priorityCounts?.[priority]}
              showCount={showCounts}
              variant={value.includes(priority) ? 'default' : 'outline'}
            />
          </div>
        ))}
      </div>
    );
  }

  // Dropdown variant
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`justify-between min-w-[120px] ${className}`}
        >
          <div className="flex items-center gap-2 truncate">
            <Flag className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{getDisplayText()}</span>
          </div>
          <div className="flex items-center gap-1 ml-2">
            {value.length > 0 && (
              <Badge variant="secondary" className="text-xs h-5">
                {value.length}
              </Badge>
            )}
            <ChevronDown className="h-4 w-4 flex-shrink-0" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="start">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{t('selectPriorities')}</h4>
            <div className="flex items-center gap-2">
              {allowMultiple && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSelectAll}
                    className="h-6 px-2 text-xs"
                  >
                    {t('selectAll')}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAll}
                    className="h-6 px-2 text-xs"
                  >
                    {t('clearAll')}
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-1">
            {priorities.map((priority) => (
              <PriorityItem
                key={priority}
                priority={priority}
                isSelected={value.includes(priority)}
                onToggle={() => handleTogglePriority(priority)}
              />
            ))}
          </div>

          {allowMultiple && value.length > 0 && (
            <>
              <Separator />
              <div className="flex flex-wrap gap-1">
                {value.map((priority) => (
                  <div
                    key={priority}
                    className="cursor-pointer"
                    onClick={() => handleTogglePriority(priority)}
                  >
                    <PriorityBadge
                      priority={priority}
                      variant="default"
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {showCounts && priorityCounts && (
            <>
              <Separator />
              <div className="text-xs text-gray-500">
                <div className="font-medium mb-2">{t('taskCounts')}:</div>
                <div className="grid grid-cols-2 gap-1">
                  {priorities.map((priority) => (
                    <div key={priority} className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <PriorityIcon priority={priority} className="h-3 w-3" />
                        <span>{t(`priority.${priority}`)}</span>
                      </div>
                      <span className="font-medium">
                        {priorityCounts[priority] || 0}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PriorityFilter;