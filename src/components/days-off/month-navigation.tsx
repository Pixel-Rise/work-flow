import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, RotateCcw, FastForward, Rewind } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MonthNavigationProps {
  currentDate: Date;
  minDate?: Date;
  maxDate?: Date;
  onDateChange: (date: Date) => void;
  variant?: 'default' | 'compact' | 'minimal' | 'detailed';
  showToday?: boolean;
  showQuickJump?: boolean;
  showYearSelector?: boolean;
  showMonthGrid?: boolean;
  showNavigationButtons?: boolean;
  showQuickActions?: boolean;
  leaveCount?: Record<string, number>;
  holidayCount?: Record<string, number>;
  className?: string;
}

const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
];

const QUICK_ACTIONS = [
  { key: 'prevMonth', icon: ChevronLeft, label: 'previousMonth' },
  { key: 'nextMonth', icon: ChevronRight, label: 'nextMonth' },
  { key: 'today', icon: RotateCcw, label: 'today' },
  { key: 'prevYear', icon: Rewind, label: 'previousYear' },
  { key: 'nextYear', icon: FastForward, label: 'nextYear' }
];

const MonthGrid: React.FC<{
  currentDate: Date;
  selectedYear: number;
  onMonthSelect: (month: number) => void;
  leaveCount?: Record<string, number>;
  holidayCount?: Record<string, number>;
}> = ({ currentDate, selectedYear, onMonthSelect, leaveCount = {}, holidayCount = {} }) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-3 gap-2 p-4">
      {MONTHS.map((month, index) => {
        const monthKey = `${selectedYear}-${String(index + 1).padStart(2, '0')}`;
        const isCurrentMonth = currentDate.getFullYear() === selectedYear && currentDate.getMonth() === index;
        const isToday = new Date().getFullYear() === selectedYear && new Date().getMonth() === index;
        const leaves = leaveCount[monthKey] || 0;
        const holidays = holidayCount[monthKey] || 0;

        return (
          <Button
            key={month}
            variant={isCurrentMonth ? 'default' : 'outline'}
            size="sm"
            onClick={() => onMonthSelect(index)}
            className={cn(
              'h-16 flex flex-col items-center justify-center relative',
              isToday && !isCurrentMonth && 'border-purple-300 text-purple-700'
            )}
          >
            <span className="font-medium text-sm">
              {t(`months.${month}`)}
            </span>

            <div className="flex gap-1 mt-1">
              {leaves > 0 && (
                <Badge variant="secondary" className="text-xs px-1 py-0 bg-blue-100 text-blue-700">
                  {leaves}L
                </Badge>
              )}
              {holidays > 0 && (
                <Badge variant="secondary" className="text-xs px-1 py-0 bg-red-100 text-red-700">
                  {holidays}H
                </Badge>
              )}
            </div>

            {isToday && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full" />
            )}
          </Button>
        );
      })}
    </div>
  );
};

const YearSelector: React.FC<{
  currentYear: number;
  minYear?: number;
  maxYear?: number;
  onYearChange: (year: number) => void;
}> = ({ currentYear, minYear, maxYear, onYearChange }) => {
  const { t } = useTranslation();
  const currentDate = new Date();
  const defaultMinYear = minYear || currentDate.getFullYear() - 5;
  const defaultMaxYear = maxYear || currentDate.getFullYear() + 2;

  const years = Array.from(
    { length: defaultMaxYear - defaultMinYear + 1 },
    (_, i) => defaultMinYear + i
  );

  return (
    <Select value={currentYear.toString()} onValueChange={(value) => onYearChange(parseInt(value))}>
      <SelectTrigger className="w-24">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {years.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const QuickActions: React.FC<{
  currentDate: Date;
  onAction: (action: string) => void;
  variant: 'default' | 'compact' | 'minimal' | 'detailed';
}> = ({ currentDate, onAction, variant }) => {
  const { t } = useTranslation();
  const isCompact = variant === 'compact' || variant === 'minimal';

  return (
    <div className="flex items-center gap-1">
      {QUICK_ACTIONS.map((action) => {
        if (isCompact && !['prevMonth', 'nextMonth', 'today'].includes(action.key)) {
          return null;
        }

        return (
          <Button
            key={action.key}
            variant="ghost"
            size="sm"
            onClick={() => onAction(action.key)}
            className="p-2"
            title={t(action.label)}
          >
            <action.icon className="h-4 w-4" />
          </Button>
        );
      })}
    </div>
  );
};

const MonthYearDisplay: React.FC<{
  date: Date;
  variant: 'default' | 'compact' | 'minimal' | 'detailed';
  onClick?: () => void;
  leaveCount?: number;
  holidayCount?: number;
}> = ({ date, variant, onClick, leaveCount = 0, holidayCount = 0 }) => {
  const { t } = useTranslation();
  const isCompact = variant === 'compact' || variant === 'minimal';
  const isDetailed = variant === 'detailed';

  const monthName = t(`months.${MONTHS[date.getMonth()]}`);
  const year = date.getFullYear();

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        'font-semibold text-left hover:bg-gray-100',
        isCompact ? 'text-sm px-2' : 'text-lg px-3'
      )}
    >
      <div className="flex items-center gap-2">
        <CalendarIcon className={cn(isCompact ? 'h-4 w-4' : 'h-5 w-5')} />

        <div>
          <div className="flex items-center gap-2">
            <span>{monthName} {year}</span>
            {isDetailed && (leaveCount > 0 || holidayCount > 0) && (
              <div className="flex gap-1">
                {leaveCount > 0 && (
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                    {leaveCount} {t('leaves')}
                  </Badge>
                )}
                {holidayCount > 0 && (
                  <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">
                    {holidayCount} {t('holidays')}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {isDetailed && (
            <div className="text-xs text-gray-500">
              {t('weekOf')} {date.getDate()}
            </div>
          )}
        </div>
      </div>
    </Button>
  );
};

export const MonthNavigation: React.FC<MonthNavigationProps> = ({
  currentDate,
  minDate,
  maxDate,
  onDateChange,
  variant = 'default',
  showToday = true,
  showQuickJump = true,
  showYearSelector = true,
  showMonthGrid = true,
  showNavigationButtons = true,
  showQuickActions = false,
  leaveCount = {},
  holidayCount = {},
  className
}) => {
  const { t } = useTranslation();
  const [showMonthSelector, setShowMonthSelector] = useState(false);

  const today = new Date();
  const isCompact = variant === 'compact' || variant === 'minimal';
  const isDetailed = variant === 'detailed';

  const currentMonthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  const currentMonthLeaves = leaveCount[currentMonthKey] || 0;
  const currentMonthHolidays = holidayCount[currentMonthKey] || 0;

  const handleQuickAction = (action: string) => {
    const newDate = new Date(currentDate);

    switch (action) {
      case 'prevMonth':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case 'nextMonth':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case 'today':
        onDateChange(today);
        return;
      case 'prevYear':
        newDate.setFullYear(newDate.getFullYear() - 1);
        break;
      case 'nextYear':
        newDate.setFullYear(newDate.getFullYear() + 1);
        break;
    }

    // Check bounds
    if (minDate && newDate < minDate) return;
    if (maxDate && newDate > maxDate) return;

    onDateChange(newDate);
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(monthIndex);
    onDateChange(newDate);
    setShowMonthSelector(false);
  };

  const handleYearChange = (year: number) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    onDateChange(newDate);
  };

  const handleTodayClick = () => {
    onDateChange(today);
  };

  const canGoPrevious = !minDate || new Date(currentDate.getFullYear(), currentDate.getMonth() - 1) >= minDate;
  const canGoNext = !maxDate || new Date(currentDate.getFullYear(), currentDate.getMonth() + 1) <= maxDate;

  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center justify-between', className)}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleQuickAction('prevMonth')}
          disabled={!canGoPrevious}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <MonthYearDisplay
          date={currentDate}
          variant={variant}
          onClick={() => setShowMonthSelector(true)}
        />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleQuickAction('nextMonth')}
          disabled={!canGoNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main Navigation Bar */}
      <div className="flex items-center justify-between">
        {/* Left Side - Month/Year Display */}
        <div className="flex items-center gap-2">
          {showMonthGrid ? (
            <Popover open={showMonthSelector} onOpenChange={setShowMonthSelector}>
              <PopoverTrigger asChild>
                <MonthYearDisplay
                  date={currentDate}
                  variant={variant}
                  leaveCount={currentMonthLeaves}
                  holidayCount={currentMonthHolidays}
                />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="space-y-2">
                  {showYearSelector && (
                    <div className="flex items-center justify-center p-2 border-b">
                      <YearSelector
                        currentYear={currentDate.getFullYear()}
                        minYear={minDate?.getFullYear()}
                        maxYear={maxDate?.getFullYear()}
                        onYearChange={handleYearChange}
                      />
                    </div>
                  )}
                  <MonthGrid
                    currentDate={currentDate}
                    selectedYear={currentDate.getFullYear()}
                    onMonthSelect={handleMonthSelect}
                    leaveCount={leaveCount}
                    holidayCount={holidayCount}
                  />
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <MonthYearDisplay
              date={currentDate}
              variant={variant}
              leaveCount={currentMonthLeaves}
              holidayCount={currentMonthHolidays}
            />
          )}
        </div>

        {/* Right Side - Navigation Controls */}
        <div className="flex items-center gap-2">
          {showNavigationButtons && (
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction('prevMonth')}
                disabled={!canGoPrevious}
                className="p-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction('nextMonth')}
                disabled={!canGoNext}
                className="p-2"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {showToday && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleTodayClick}
              className={cn(
                'text-purple-600 border-purple-300 hover:bg-purple-50',
                isCompact && 'px-2'
              )}
            >
              {isCompact ? (
                <RotateCcw className="h-4 w-4" />
              ) : (
                <>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  {t('today')}
                </>
              )}
            </Button>
          )}

          {showQuickActions && (
            <QuickActions
              currentDate={currentDate}
              onAction={handleQuickAction}
              variant={variant}
            />
          )}
        </div>
      </div>

      {/* Additional Info Bar for Detailed Variant */}
      {isDetailed && (
        <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>{t('currentMonth')}: {t(`months.${MONTHS[currentDate.getMonth()]}`)} {currentDate.getFullYear()}</span>
            </div>

            {currentMonthLeaves > 0 && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span>{currentMonthLeaves} {t('leaves')}</span>
              </div>
            )}

            {currentMonthHolidays > 0 && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span>{currentMonthHolidays} {t('holidays')}</span>
              </div>
            )}
          </div>

          <div className="text-xs">
            {t('week')} {Math.ceil(currentDate.getDate() / 7)}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthNavigation;