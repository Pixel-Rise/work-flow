import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  X,
  Today,
  Calendar as CalendarSolid
} from 'lucide-react'
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isToday, parseISO, isValid } from 'date-fns'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'

export interface DatePickerProps {
  value?: Date | null
  defaultValue?: Date | null
  placeholder?: string
  disabled?: boolean
  variant?: 'default' | 'outline' | 'ghost' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  showTime?: boolean
  showToday?: boolean
  showClear?: boolean
  minDate?: Date
  maxDate?: Date
  disabledDates?: (date: Date) => boolean
  presets?: Array<{
    label: string
    value: Date | [Date, Date]
    shortcut?: string
  }>
  formatString?: string
  mode?: 'single' | 'range' | 'multiple'
  onValueChange?: (value: Date | Date[] | null) => void
  onOpenChange?: (open: boolean) => void
  className?: string
}

const DEFAULT_PRESETS = [
  {
    label: 'Today',
    value: new Date(),
    shortcut: 'T'
  },
  {
    label: 'Tomorrow',
    value: addDays(new Date(), 1),
    shortcut: 'T+1'
  },
  {
    label: 'This Week',
    value: [startOfWeek(new Date()), endOfWeek(new Date())] as [Date, Date],
    shortcut: 'W'
  },
  {
    label: 'This Month',
    value: [startOfMonth(new Date()), endOfMonth(new Date())] as [Date, Date],
    shortcut: 'M'
  }
]

export function DatePicker({
  value,
  defaultValue,
  placeholder = 'Select date...',
  disabled = false,
  variant = 'outline',
  size = 'md',
  showTime = false,
  showToday = true,
  showClear = true,
  minDate,
  maxDate,
  disabledDates,
  presets = DEFAULT_PRESETS,
  formatString = 'PPP',
  mode = 'single',
  onValueChange,
  onOpenChange,
  className
}: DatePickerProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [internalValue, setInternalValue] = useState<Date | Date[] | null>(value ?? defaultValue ?? null)
  const [timeInput, setTimeInput] = useState('')
  const [currentMonth, setCurrentMonth] = useState<Date>(
    Array.isArray(internalValue) ? internalValue[0] || new Date() :
    internalValue || new Date()
  )

  const currentValue = value !== undefined ? value : internalValue

  const handleValueChange = (newValue: Date | Date[] | null) => {
    if (value === undefined) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    onOpenChange?.(newOpen)

    if (!newOpen && showTime && currentValue instanceof Date && timeInput) {
      const [hours, minutes] = timeInput.split(':').map(Number)
      if (!isNaN(hours) && !isNaN(minutes)) {
        const newDate = new Date(currentValue)
        newDate.setHours(hours, minutes)
        handleValueChange(newDate)
      }
    }
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return

    if (mode === 'single') {
      if (showTime && timeInput) {
        const [hours, minutes] = timeInput.split(':').map(Number)
        if (!isNaN(hours) && !isNaN(minutes)) {
          selectedDate.setHours(hours, minutes)
        }
      }
      handleValueChange(selectedDate)
      if (!showTime) {
        setOpen(false)
      }
    } else if (mode === 'multiple') {
      const currentArray = Array.isArray(currentValue) ? currentValue : []
      const isSelected = currentArray.some(date =>
        date.toDateString() === selectedDate.toDateString()
      )

      if (isSelected) {
        handleValueChange(currentArray.filter(date =>
          date.toDateString() !== selectedDate.toDateString()
        ))
      } else {
        handleValueChange([...currentArray, selectedDate])
      }
    }
    // Range mode would be handled by the Calendar component itself
  }

  const handlePresetSelect = (preset: typeof DEFAULT_PRESETS[0]) => {
    if (Array.isArray(preset.value)) {
      handleValueChange(preset.value)
    } else {
      handleValueChange(preset.value)
    }
    setOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    handleValueChange(null)
  }

  const handleTodaySelect = () => {
    const today = new Date()
    if (showTime && timeInput) {
      const [hours, minutes] = timeInput.split(':').map(Number)
      if (!isNaN(hours) && !isNaN(minutes)) {
        today.setHours(hours, minutes)
      }
    }
    handleValueChange(today)
    if (!showTime) {
      setOpen(false)
    }
  }

  const formatDisplayValue = () => {
    if (!currentValue) return null

    if (Array.isArray(currentValue)) {
      if (currentValue.length === 0) return null
      if (currentValue.length === 1) {
        return format(currentValue[0], formatString)
      }
      if (currentValue.length === 2) {
        return `${format(currentValue[0], 'MMM d')} - ${format(currentValue[1], formatString)}`
      }
      return `${currentValue.length} dates selected`
    }

    return format(currentValue, showTime ? `${formatString} HH:mm` : formatString)
  }

  const sizeClasses = {
    sm: 'h-8 text-sm',
    md: 'h-10',
    lg: 'h-12 text-lg'
  }

  const displayValue = formatDisplayValue()

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          disabled={disabled}
          className={cn(
            'justify-start text-left font-normal',
            sizeClasses[size],
            !displayValue && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayValue || placeholder}
          {showClear && displayValue && (
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 ml-auto"
              onClick={handleClear}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex">
          {/* Presets Sidebar */}
          {presets.length > 0 && (
            <div className="border-r p-3 space-y-1">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                {t('quickSelect')}
              </div>
              {presets.map((preset, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-left font-normal"
                  onClick={() => handlePresetSelect(preset)}
                >
                  <span className="flex-1">{t(preset.label.toLowerCase().replace(' ', ''))}</span>
                  {preset.shortcut && (
                    <kbd className="text-xs bg-muted px-1 rounded">
                      {preset.shortcut}
                    </kbd>
                  )}
                </Button>
              ))}
            </div>
          )}

          {/* Calendar */}
          <div className="p-3 space-y-3">
            {/* Calendar Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentMonth(addDays(currentMonth, -30))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm font-medium min-w-32 text-center">
                  {format(currentMonth, 'MMMM yyyy')}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentMonth(addDays(currentMonth, 30))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {showToday && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTodaySelect}
                  className="flex items-center gap-1"
                >
                  <Today className="h-3 w-3" />
                  {t('today')}
                </Button>
              )}
            </div>

            {/* Calendar Component */}
            <Calendar
              mode={mode as any}
              selected={currentValue as any}
              onSelect={handleDateSelect as any}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              disabled={(date) => {
                if (disabled) return true
                if (minDate && date < minDate) return true
                if (maxDate && date > maxDate) return true
                if (disabledDates) return disabledDates(date)
                return false
              }}
              className="rounded-md border"
            />

            {/* Time Input */}
            {showTime && (
              <div className="space-y-2 pt-2 border-t">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  {t('time')}
                </Label>
                <Input
                  type="time"
                  value={timeInput}
                  onChange={(e) => setTimeInput(e.target.value)}
                  className="w-full"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="text-xs text-muted-foreground">
                {mode === 'multiple' && Array.isArray(currentValue) && currentValue.length > 0 && (
                  <span>{currentValue.length} {t('selected')}</span>
                )}
              </div>
              <div className="flex gap-2">
                {showClear && currentValue && (
                  <Button variant="outline" size="sm" onClick={handleClear}>
                    {t('clear')}
                  </Button>
                )}
                <Button size="sm" onClick={() => setOpen(false)}>
                  {t('done')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Date Range Picker Component
export interface DateRangePickerProps extends Omit<DatePickerProps, 'value' | 'defaultValue' | 'mode' | 'onValueChange'> {
  value?: [Date, Date] | null
  defaultValue?: [Date, Date] | null
  onValueChange?: (range: [Date, Date] | null) => void
}

export function DateRangePicker({
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Select date range...',
  ...props
}: DateRangePickerProps) {
  return (
    <DatePicker
      {...props}
      mode="range"
      placeholder={placeholder}
      value={value as any}
      defaultValue={defaultValue as any}
      onValueChange={onValueChange as any}
    />
  )
}

// Time Picker Component
export interface TimePickerProps {
  value?: string
  defaultValue?: string
  placeholder?: string
  disabled?: boolean
  variant?: 'default' | 'outline' | 'ghost' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  format24h?: boolean
  showSeconds?: boolean
  minuteStep?: number
  onValueChange?: (time: string) => void
  className?: string
}

export function TimePicker({
  value,
  defaultValue = '',
  placeholder = 'Select time...',
  disabled = false,
  variant = 'outline',
  size = 'md',
  format24h = true,
  showSeconds = false,
  minuteStep = 1,
  onValueChange,
  className
}: TimePickerProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [internalValue, setInternalValue] = useState(value ?? defaultValue)

  const currentValue = value !== undefined ? value : internalValue

  const handleValueChange = (newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
    setOpen(false)
  }

  const generateTimeOptions = () => {
    const options: string[] = []
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += minuteStep) {
        for (let s = 0; s < (showSeconds ? 60 : 1); s += 30) {
          const hour = format24h ? h : h % 12 || 12
          const ampm = format24h ? '' : ` ${h < 12 ? 'AM' : 'PM'}`
          const time = `${hour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}${
            showSeconds ? `:${s.toString().padStart(2, '0')}` : ''
          }${ampm}`
          options.push(time)
        }
      }
    }
    return options
  }

  const sizeClasses = {
    sm: 'h-8 text-sm',
    md: 'h-10',
    lg: 'h-12 text-lg'
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          disabled={disabled}
          className={cn(
            'justify-start text-left font-normal',
            sizeClasses[size],
            !currentValue && 'text-muted-foreground',
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {currentValue || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        <div className="space-y-2">
          <Input
            type="time"
            value={currentValue}
            onChange={(e) => handleValueChange(e.target.value)}
            step={showSeconds ? 1 : 60}
          />
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleValueChange('09:00')}
            >
              9:00 AM
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleValueChange('17:00')}
            >
              5:00 PM
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default DatePicker