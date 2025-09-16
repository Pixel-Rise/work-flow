import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  Calendar as CalendarIcon,
  ChevronDown,
  X,
  Clock,
  AlertCircle,
  CheckCircle,
  Zap
} from 'lucide-react';

export interface DateRange {
  start?: string;
  end?: string;
  preset?: 'today' | 'tomorrow' | 'week' | 'month' | 'overdue' | 'upcoming' | 'no_date';
}

export interface DateRangeFilterProps {
  value: DateRange;
  onChange: (dateRange: DateRange) => void;
  variant?: 'dropdown' | 'sidebar' | 'inline';
  showPresets?: boolean;
  showRelativeDates?: boolean;
  allowCustomRange?: boolean;
  placeholder?: string;
  className?: string;
}

const DatePreset: React.FC<{
  preset: string;
  label: string;
  icon: React.ReactElement;
  count?: number;
  isSelected: boolean;
  onSelect: () => void;
  showCount?: boolean;
}> = ({ preset, label, icon, count, isSelected, onSelect, showCount = false }) => (
  <div
    className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-50 ${
      isSelected ? 'bg-blue-50 border border-blue-200' : ''
    }`}
    onClick={onSelect}
  >
    <div className="flex items-center gap-2">
      {React.cloneElement(icon, { className: 'h-4 w-4' })}
      <span className="text-sm font-medium">{label}</span>
    </div>
    {showCount && count !== undefined && (
      <Badge variant="secondary" className="text-xs">
        {count}
      </Badge>
    )}
  </div>
);

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  value,
  onChange,
  variant = 'dropdown',
  showPresets = true,
  showRelativeDates = true,
  allowCustomRange = true,
  placeholder,
  className = ''
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(
    value.start ? new Date(value.start) : undefined
  );
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(
    value.end ? new Date(value.end) : undefined
  );
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');

  const datePresets = [
    {
      key: 'today' as const,
      label: t('today'),
      icon: <Clock />,
      getValue: () => {
        const today = new Date();
        return {
          start: today.toISOString().split('T')[0],
          end: today.toISOString().split('T')[0],
          preset: 'today' as const
        };
      }
    },
    {
      key: 'tomorrow' as const,
      label: t('tomorrow'),
      icon: <Zap />,
      getValue: () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return {
          start: tomorrow.toISOString().split('T')[0],
          end: tomorrow.toISOString().split('T')[0],
          preset: 'tomorrow' as const
        };
      }
    },
    {
      key: 'week' as const,
      label: t('thisWeek'),
      icon: <CalendarIcon />,
      getValue: () => {
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
        return {
          start: startOfWeek.toISOString().split('T')[0],
          end: endOfWeek.toISOString().split('T')[0],
          preset: 'week' as const
        };
      }
    },
    {
      key: 'month' as const,
      label: t('thisMonth'),
      icon: <CalendarIcon />,
      getValue: () => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return {
          start: startOfMonth.toISOString().split('T')[0],
          end: endOfMonth.toISOString().split('T')[0],
          preset: 'month' as const
        };
      }
    },
    {
      key: 'overdue' as const,
      label: t('overdue'),
      icon: <AlertCircle className="text-red-600" />,
      getValue: () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return {
          end: yesterday.toISOString().split('T')[0],
          preset: 'overdue' as const
        };
      }
    },
    {
      key: 'upcoming' as const,
      label: t('upcoming'),
      icon: <CheckCircle className="text-blue-600" />,
      getValue: () => {
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        return {
          start: today.toISOString().split('T')[0],
          end: nextWeek.toISOString().split('T')[0],
          preset: 'upcoming' as const
        };
      }
    },
    {
      key: 'no_date' as const,
      label: t('noDate'),
      icon: <X className="text-gray-500" />,
      getValue: () => ({
        preset: 'no_date' as const
      })
    }
  ];

  const handlePresetSelect = (preset: typeof datePresets[0]) => {
    const newValue = preset.getValue();
    onChange(newValue);
    if (variant === 'dropdown') {
      setIsOpen(false);
    }
  };

  const handleCustomRangeApply = () => {
    const newValue: DateRange = {
      start: customStartDate?.toISOString().split('T')[0],
      end: customEndDate?.toISOString().split('T')[0]
    };

    // Remove preset if custom dates are set
    if (newValue.start || newValue.end) {
      delete newValue.preset;
    }

    onChange(newValue);
    if (variant === 'dropdown') {
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    onChange({});
    setCustomStartDate(undefined);
    setCustomEndDate(undefined);
  };

  const getDisplayText = () => {
    if (value.preset) {
      const preset = datePresets.find(p => p.key === value.preset);
      return preset ? preset.label : t('customRange');
    }

    if (value.start && value.end) {
      if (value.start === value.end) {
        return new Date(value.start).toLocaleDateString();
      }
      return `${new Date(value.start).toLocaleDateString()} - ${new Date(value.end).toLocaleDateString()}`;
    }

    if (value.start) {
      return t('fromDate', { date: new Date(value.start).toLocaleDateString() });
    }

    if (value.end) {
      return t('untilDate', { date: new Date(value.end).toLocaleDateString() });
    }

    return placeholder || t('selectDateRange');
  };

  const hasValue = value.preset || value.start || value.end;

  if (variant === 'sidebar') {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            {t('dateRange')}
          </label>
          {hasValue && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Presets */}
        {showPresets && (
          <div className="space-y-1">
            {datePresets.map((preset) => (
              <DatePreset
                key={preset.key}
                preset={preset.key}
                label={preset.label}
                icon={preset.icon}
                isSelected={value.preset === preset.key}
                onSelect={() => handlePresetSelect(preset)}
              />
            ))}
          </div>
        )}

        {/* Custom Range */}
        {allowCustomRange && (
          <>
            <Separator />
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-600">
                {t('customRange')}
              </Label>
              <div className="space-y-2">
                <div>
                  <Label className="text-xs">{t('startDate')}</Label>
                  <Calendar
                    mode="single"
                    selected={customStartDate}
                    onSelect={setCustomStartDate}
                    className="rounded-md border w-full"
                    classNames={{
                      months: "w-full",
                      month: "w-full",
                      table: "w-full",
                      head_row: "w-full",
                      row: "w-full"
                    }}
                  />
                </div>
                <div>
                  <Label className="text-xs">{t('endDate')}</Label>
                  <Calendar
                    mode="single"
                    selected={customEndDate}
                    onSelect={setCustomEndDate}
                    disabled={(date) => {
                      if (!customStartDate) return false;
                      return date < customStartDate;
                    }}
                    className="rounded-md border w-full"
                    classNames={{
                      months: "w-full",
                      month: "w-full",
                      table: "w-full",
                      head_row: "w-full",
                      row: "w-full"
                    }}
                  />
                </div>
                <Button
                  size="sm"
                  onClick={handleCustomRangeApply}
                  disabled={!customStartDate && !customEndDate}
                  className="w-full"
                >
                  {t('apply')}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {datePresets.map((preset) => (
          <Badge
            key={preset.key}
            variant={value.preset === preset.key ? 'default' : 'outline'}
            className="cursor-pointer flex items-center gap-1"
            onClick={() => handlePresetSelect(preset)}
          >
            {React.cloneElement(preset.icon, { className: 'h-3 w-3' })}
            {preset.label}
          </Badge>
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
          className={cn(
            "justify-between min-w-[140px]",
            !hasValue && "text-muted-foreground",
            className
          )}
        >
          <div className="flex items-center gap-2 truncate">
            <CalendarIcon className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{getDisplayText()}</span>
          </div>
          <div className="flex items-center gap-1 ml-2">
            {hasValue && (
              <Badge variant="secondary" className="text-xs h-5">
                1
              </Badge>
            )}
            <ChevronDown className="h-4 w-4 flex-shrink-0" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{t('selectDateRange')}</h4>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-6 px-2 text-xs"
              >
                {t('clear')}
              </Button>
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

          {/* Tabs */}
          {showPresets && allowCustomRange && (
            <div className="flex border rounded-lg">
              <Button
                variant={activeTab === 'presets' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('presets')}
                className="flex-1 rounded-r-none"
              >
                {t('presets')}
              </Button>
              <Button
                variant={activeTab === 'custom' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('custom')}
                className="flex-1 rounded-l-none"
              >
                {t('custom')}
              </Button>
            </div>
          )}

          {/* Content */}
          {(activeTab === 'presets' || !allowCustomRange) && showPresets && (
            <div className="space-y-1">
              {datePresets.map((preset) => (
                <DatePreset
                  key={preset.key}
                  preset={preset.key}
                  label={preset.label}
                  icon={preset.icon}
                  isSelected={value.preset === preset.key}
                  onSelect={() => handlePresetSelect(preset)}
                />
              ))}
            </div>
          )}

          {activeTab === 'custom' && allowCustomRange && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-sm">{t('startDate')}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !customStartDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {customStartDate ? (
                          customStartDate.toLocaleDateString()
                        ) : (
                          t('selectDate')
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={customStartDate}
                        onSelect={setCustomStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">{t('endDate')}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !customEndDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {customEndDate ? (
                          customEndDate.toLocaleDateString()
                        ) : (
                          t('selectDate')
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={customEndDate}
                        onSelect={setCustomEndDate}
                        disabled={(date) => {
                          if (!customStartDate) return false;
                          return date < customStartDate;
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <Button
                onClick={handleCustomRangeApply}
                disabled={!customStartDate && !customEndDate}
                className="w-full"
              >
                {t('applyRange')}
              </Button>
            </div>
          )}

          {/* Current Selection */}
          {hasValue && (
            <>
              <Separator />
              <div className="text-sm">
                <span className="font-medium">{t('selected')}: </span>
                <span className="text-gray-600">{getDisplayText()}</span>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateRangeFilter;