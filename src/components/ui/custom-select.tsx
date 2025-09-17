import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Search,
  Plus,
  Filter,
  Star,
  Circle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'

export interface SelectOption {
  value: string
  label: string
  description?: string
  icon?: React.ComponentType<any>
  disabled?: boolean
  group?: string
  color?: string
  avatar?: string
  meta?: Record<string, any>
}

export interface CustomSelectProps {
  options: SelectOption[]
  value?: string | string[]
  defaultValue?: string | string[]
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  multiple?: boolean
  searchable?: boolean
  clearable?: boolean
  creatable?: boolean
  disabled?: boolean
  loading?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'ghost' | 'minimal'
  maxHeight?: number
  maxSelected?: number
  groupBy?: string
  showGroupLabels?: boolean
  allowSelectAll?: boolean
  renderOption?: (option: SelectOption) => React.ReactNode
  renderValue?: (option: SelectOption) => React.ReactNode
  onValueChange?: (value: string | string[]) => void
  onSearch?: (query: string) => void
  onCreate?: (value: string) => void
  onOpen?: () => void
  onClose?: () => void
  className?: string
}

export function CustomSelect({
  options = [],
  value,
  defaultValue,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search options...',
  emptyText = 'No options found',
  multiple = false,
  searchable = false,
  clearable = false,
  creatable = false,
  disabled = false,
  loading = false,
  size = 'md',
  variant = 'default',
  maxHeight = 300,
  maxSelected,
  groupBy,
  showGroupLabels = true,
  allowSelectAll = false,
  renderOption,
  renderValue,
  onValueChange,
  onSearch,
  onCreate,
  onOpen,
  onClose,
  className
}: CustomSelectProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [internalValue, setInternalValue] = useState<string | string[]>(
    value ?? defaultValue ?? (multiple ? [] : '')
  )

  const currentValue = value !== undefined ? value : internalValue

  const handleValueChange = (newValue: string | string[]) => {
    if (value === undefined) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
  }

  const selectedOptions = multiple
    ? options.filter(option => Array.isArray(currentValue) && currentValue.includes(option.value))
    : options.filter(option => option.value === currentValue)

  const filteredOptions = searchQuery
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options

  // Group options if groupBy is specified
  const groupedOptions = groupBy
    ? filteredOptions.reduce((groups, option) => {
        const group = option[groupBy as keyof SelectOption] as string || 'Other'
        if (!groups[group]) groups[group] = []
        groups[group].push(option)
        return groups
      }, {} as Record<string, SelectOption[]>)
    : { '': filteredOptions }

  const handleSelect = (optionValue: string) => {
    if (disabled) return

    if (multiple) {
      const currentArray = Array.isArray(currentValue) ? currentValue : []
      const isSelected = currentArray.includes(optionValue)

      let newValue: string[]
      if (isSelected) {
        newValue = currentArray.filter(v => v !== optionValue)
      } else {
        if (maxSelected && currentArray.length >= maxSelected) return
        newValue = [...currentArray, optionValue]
      }

      handleValueChange(newValue)
    } else {
      handleValueChange(optionValue)
      setOpen(false)
    }
  }

  const handleSelectAll = () => {
    if (!multiple) return

    const allValues = filteredOptions
      .filter(option => !option.disabled)
      .map(option => option.value)

    const currentArray = Array.isArray(currentValue) ? currentValue : []
    const allSelected = allValues.every(value => currentArray.includes(value))

    if (allSelected) {
      const newValue = currentArray.filter(value => !allValues.includes(value))
      handleValueChange(newValue)
    } else {
      const newValue = Array.from(new Set([...currentArray, ...allValues]))
      if (maxSelected && newValue.length > maxSelected) return
      handleValueChange(newValue)
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    handleValueChange(multiple ? [] : '')
  }

  const handleCreate = () => {
    if (!creatable || !searchQuery.trim()) return

    onCreate?.(searchQuery.trim())

    // Add the new option to selection
    if (multiple) {
      const currentArray = Array.isArray(currentValue) ? currentValue : []
      handleValueChange([...currentArray, searchQuery.trim()])
    } else {
      handleValueChange(searchQuery.trim())
    }

    setSearchQuery('')
    setOpen(false)
  }

  const handleRemoveSelected = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!multiple) return

    const currentArray = Array.isArray(currentValue) ? currentValue : []
    const newValue = currentArray.filter(v => v !== optionValue)
    handleValueChange(newValue)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen) {
      onOpen?.()
    } else {
      onClose?.()
      setSearchQuery('')
    }
  }

  const defaultRenderOption = (option: SelectOption) => (
    <div className="flex items-center gap-2 w-full">
      {option.icon && (
        <option.icon className="h-4 w-4 flex-shrink-0" />
      )}
      {option.avatar && (
        <img
          src={option.avatar}
          alt={option.label}
          className="w-6 h-6 rounded-full flex-shrink-0"
        />
      )}
      {option.color && (
        <Circle
          className="h-3 w-3 flex-shrink-0"
          fill={option.color}
          style={{ color: option.color }}
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{option.label}</div>
        {option.description && (
          <div className="text-sm text-muted-foreground truncate">
            {option.description}
          </div>
        )}
      </div>
      {multiple && Array.isArray(currentValue) && currentValue.includes(option.value) && (
        <Check className="h-4 w-4 text-primary" />
      )}
    </div>
  )

  const defaultRenderValue = (option: SelectOption) => (
    <div className="flex items-center gap-2">
      {option.icon && <option.icon className="h-4 w-4" />}
      {option.avatar && (
        <img src={option.avatar} alt={option.label} className="w-5 h-5 rounded-full" />
      )}
      {option.color && (
        <Circle className="h-3 w-3" fill={option.color} style={{ color: option.color }} />
      )}
      <span className="truncate">{option.label}</span>
    </div>
  )

  const triggerContent = () => {
    if (multiple && Array.isArray(currentValue) && currentValue.length > 0) {
      if (currentValue.length === 1) {
        const option = selectedOptions[0]
        return option ? (renderValue?.(option) ?? defaultRenderValue(option)) : currentValue[0]
      }

      if (currentValue.length <= 3) {
        return (
          <div className="flex flex-wrap gap-1">
            {selectedOptions.map(option => (
              <Badge
                key={option.value}
                variant="secondary"
                className="max-w-32"
              >
                <span className="truncate">{option.label}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-3 w-3 p-0 ml-1 hover:bg-transparent"
                  onClick={(e) => handleRemoveSelected(option.value, e)}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            ))}
          </div>
        )
      }

      return (
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {currentValue.length} {t('selected')}
          </Badge>
          {clearable && (
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0"
              onClick={handleClear}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      )
    }

    if (!multiple && currentValue && selectedOptions[0]) {
      return renderValue?.(selectedOptions[0]) ?? defaultRenderValue(selectedOptions[0])
    }

    return <span className="text-muted-foreground">{placeholder}</span>
  }

  const sizeClasses = {
    sm: 'h-8 text-sm',
    md: 'h-10',
    lg: 'h-12 text-lg'
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          role="combobox"
          aria-expanded={open}
          disabled={disabled || loading}
          className={cn(
            'justify-between font-normal',
            sizeClasses[size],
            className
          )}
        >
          <div className="flex-1 overflow-hidden text-left">
            {triggerContent()}
          </div>
          <div className="flex items-center gap-1 ml-2">
            {clearable && (multiple ?
              (Array.isArray(currentValue) && currentValue.length > 0) :
              currentValue
            ) && !multiple && (
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0"
                onClick={handleClear}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            {open ? (
              <ChevronUp className="h-4 w-4 opacity-50" />
            ) : (
              <ChevronDown className="h-4 w-4 opacity-50" />
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" style={{ minWidth: 'var(--radix-popover-trigger-width)' }}>
        <Command>
          {searchable && (
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput
                placeholder={searchPlaceholder}
                value={searchQuery}
                onValueChange={(value) => {
                  setSearchQuery(value)
                  onSearch?.(value)
                }}
              />
            </div>
          )}

          <CommandList style={{ maxHeight }}>
            {loading ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                {t('loading')}...
              </div>
            ) : (
              <>
                {multiple && allowSelectAll && filteredOptions.length > 0 && (
                  <CommandGroup>
                    <CommandItem onSelect={handleSelectAll}>
                      <div className="flex items-center gap-2 w-full">
                        <Checkbox
                          checked={filteredOptions
                            .filter(option => !option.disabled)
                            .every(option =>
                              Array.isArray(currentValue) && currentValue.includes(option.value)
                            )}
                        />
                        <span className="font-medium">{t('selectAll')}</span>
                      </div>
                    </CommandItem>
                  </CommandGroup>
                )}

                {Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
                  <CommandGroup key={groupName} heading={showGroupLabels && groupName ? groupName : undefined}>
                    {groupOptions.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                        onSelect={() => handleSelect(option.value)}
                      >
                        {renderOption?.(option) ?? defaultRenderOption(option)}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))}

                {creatable && searchQuery && !options.some(opt =>
                  opt.label.toLowerCase() === searchQuery.toLowerCase()
                ) && (
                  <CommandGroup>
                    <CommandItem onSelect={handleCreate}>
                      <Plus className="mr-2 h-4 w-4" />
                      {t('create')} "{searchQuery}"
                    </CommandItem>
                  </CommandGroup>
                )}

                {filteredOptions.length === 0 && !creatable && (
                  <CommandEmpty>{emptyText}</CommandEmpty>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default CustomSelect