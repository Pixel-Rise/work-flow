import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Check, ChevronDown, Phone, Search, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'

export interface Country {
  code: string
  name: string
  dialCode: string
  flag: string
  format?: string
  priority?: number
}

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  defaultCountry?: string
  countries?: Country[]
  disabled?: boolean
  error?: string | null
  showFlag?: boolean
  showCountryCode?: boolean
  allowCountrySelect?: boolean
  formatAsYouType?: boolean
  validateOnBlur?: boolean
  onValidation?: (isValid: boolean, country: Country | null) => void
  className?: string
}

// Default countries list with common countries
const defaultCountries: Country[] = [
  { code: 'UZ', name: 'Uzbekistan', dialCode: '+998', flag: '🇺🇿', format: '## ### ## ##', priority: 1 },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸', format: '(###) ###-####', priority: 2 },
  { code: 'RU', name: 'Russia', dialCode: '+7', flag: '🇷🇺', format: '### ###-##-##', priority: 3 },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', format: '#### ### ####' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪', format: '### ########' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷', format: '# ## ## ## ##' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹', format: '### ### ####' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸', format: '### ### ###' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦', format: '(###) ###-####' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺', format: '#### ### ###' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵', format: '##-####-####' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳', format: '### #### ####' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳', format: '##### #####' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷', format: '(##) #####-####' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽', format: '## #### ####' },
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷', format: '## ####-####' },
  { code: 'TR', name: 'Turkey', dialCode: '+90', flag: '🇹🇷', format: '### ### ## ##' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷', format: '##-####-####' },
  { code: 'TH', name: 'Thailand', dialCode: '+66', flag: '🇹🇭', format: '##-###-####' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾', format: '##-#### ####' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬', format: '#### ####' },
  { code: 'ID', name: 'Indonesia', dialCode: '+62', flag: '🇮🇩', format: '##-####-#####' },
  { code: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭', format: '### ### ####' },
  { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳', format: '##-####-####' },
  { code: 'KZ', name: 'Kazakhstan', dialCode: '+7', flag: '🇰🇿', format: '### ###-##-##' },
  { code: 'KG', name: 'Kyrgyzstan', dialCode: '+996', flag: '🇰🇬', format: '### ### ###' },
  { code: 'TJ', name: 'Tajikistan', dialCode: '+992', flag: '🇹🇯', format: '##-###-####' },
  { code: 'TM', name: 'Turkmenistan', dialCode: '+993', flag: '🇹🇲', format: '##-##-####' },
  { code: 'AF', name: 'Afghanistan', dialCode: '+93', flag: '🇦🇫', format: '##-###-####' }
]

export function PhoneInput({
  value,
  onChange,
  placeholder,
  defaultCountry = 'UZ',
  countries = defaultCountries,
  disabled = false,
  error,
  showFlag = true,
  showCountryCode = true,
  allowCountrySelect = true,
  formatAsYouType = true,
  validateOnBlur = true,
  onValidation,
  className
}: PhoneInputProps) {
  const { t } = useTranslation()
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Sort countries by priority and name
  const sortedCountries = [...countries].sort((a, b) => {
    if (a.priority && b.priority) return a.priority - b.priority
    if (a.priority) return -1
    if (b.priority) return 1
    return a.name.localeCompare(b.name)
  })

  // Filter countries based on search query
  const filteredCountries = sortedCountries.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.dialCode.includes(searchQuery) ||
    country.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Initialize selected country
  useEffect(() => {
    const country = countries.find(c => c.code === defaultCountry)
    if (country) {
      setSelectedCountry(country)
    }
  }, [defaultCountry, countries])

  // Parse existing value to extract country and number
  useEffect(() => {
    if (value && !phoneNumber) {
      // Try to match the value with a country dial code
      const matchedCountry = countries.find(country =>
        value.startsWith(country.dialCode)
      )

      if (matchedCountry) {
        setSelectedCountry(matchedCountry)
        setPhoneNumber(value.substring(matchedCountry.dialCode.length).trim())
      } else {
        setPhoneNumber(value)
      }
    }
  }, [value, countries, phoneNumber])

  const formatPhoneNumber = (number: string, format?: string): string => {
    if (!format || !formatAsYouType) return number

    // Remove all non-digits
    const digits = number.replace(/\D/g, '')
    let formatted = ''
    let digitIndex = 0

    for (let i = 0; i < format.length && digitIndex < digits.length; i++) {
      const char = format[i]
      if (char === '#') {
        formatted += digits[digitIndex]
        digitIndex++
      } else {
        formatted += char
      }
    }

    // Add remaining digits
    if (digitIndex < digits.length) {
      formatted += digits.substring(digitIndex)
    }

    return formatted
  }

  const validatePhoneNumber = (country: Country | null, number: string): boolean => {
    if (!country || !number) return false

    // Remove all non-digits for validation
    const digits = number.replace(/\D/g, '')

    // Basic validation - most phone numbers are between 7-15 digits
    if (digits.length < 7 || digits.length > 15) return false

    // Country-specific validation could be added here
    switch (country.code) {
      case 'UZ':
        return digits.length === 9
      case 'US':
      case 'CA':
        return digits.length === 10
      case 'GB':
        return digits.length >= 10 && digits.length <= 11
      case 'DE':
        return digits.length >= 10 && digits.length <= 12
      default:
        return digits.length >= 7 && digits.length <= 15
    }
  }

  const handlePhoneChange = (newNumber: string) => {
    // Remove all non-digits and format
    const cleanNumber = newNumber.replace(/\D/g, '')
    const formattedNumber = formatPhoneNumber(cleanNumber, selectedCountry?.format)

    setPhoneNumber(formattedNumber)

    // Combine with country code
    const fullNumber = selectedCountry
      ? `${selectedCountry.dialCode} ${formattedNumber}`.trim()
      : formattedNumber

    onChange(fullNumber)

    // Validate and notify
    if (onValidation) {
      const isValid = validatePhoneNumber(selectedCountry, formattedNumber)
      onValidation(isValid, selectedCountry)
    }
  }

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country)
    setIsOpen(false)
    setSearchQuery('')

    // Update the full phone number with new country code
    const fullNumber = `${country.dialCode} ${phoneNumber}`.trim()
    onChange(fullNumber)

    // Revalidate
    if (onValidation) {
      const isValid = validatePhoneNumber(country, phoneNumber)
      onValidation(isValid, country)
    }
  }

  const handleBlur = () => {
    if (validateOnBlur && onValidation && selectedCountry) {
      const isValid = validatePhoneNumber(selectedCountry, phoneNumber)
      onValidation(isValid, selectedCountry)
    }
  }

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex">
        {/* Country Selector */}
        {allowCountrySelect && (
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={isOpen}
                className={cn(
                  "flex items-center gap-2 border-r-0 rounded-r-none px-3",
                  error && "border-red-500",
                  disabled && "opacity-50"
                )}
                disabled={disabled}
              >
                {selectedCountry ? (
                  <div className="flex items-center gap-2">
                    {showFlag && <span className="text-lg">{selectedCountry.flag}</span>}
                    {showCountryCode && (
                      <span className="text-sm font-mono">{selectedCountry.dialCode}</span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span className="text-sm">+</span>
                  </div>
                )}
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <Command>
                <CommandInput
                  placeholder={t('searchCountries')}
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                <CommandEmpty>{t('noCountriesFound')}</CommandEmpty>
                <CommandGroup className="max-h-64 overflow-auto">
                  {filteredCountries.map((country) => (
                    <CommandItem
                      key={country.code}
                      onSelect={() => handleCountrySelect(country)}
                      className="flex items-center gap-3"
                    >
                      <span className="text-lg">{country.flag}</span>
                      <div className="flex-1">
                        <div className="font-medium">{country.name}</div>
                        <div className="text-sm text-muted-foreground font-mono">
                          {country.dialCode}
                        </div>
                      </div>
                      <Check
                        className={cn(
                          "h-4 w-4",
                          selectedCountry?.code === country.code ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        )}

        {/* Phone Number Input */}
        <div className="relative flex-1">
          <Input
            type="tel"
            value={phoneNumber}
            onChange={(e) => handlePhoneChange(e.target.value)}
            onBlur={handleBlur}
            placeholder={
              placeholder ||
              (selectedCountry?.format
                ? formatPhoneNumber('1234567890', selectedCountry.format)
                : t('enterPhoneNumber'))
            }
            className={cn(
              allowCountrySelect ? "rounded-l-none" : "",
              error && "border-red-500"
            )}
            disabled={disabled}
          />
          {selectedCountry && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Phone className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <span>{error}</span>
        </p>
      )}

      {/* Format Example */}
      {selectedCountry?.format && !error && (
        <p className="text-xs text-muted-foreground">
          {t('format')}: {selectedCountry.dialCode} {formatPhoneNumber('1234567890', selectedCountry.format)}
        </p>
      )}

      {/* Validation Status */}
      {phoneNumber && selectedCountry && !error && (
        <div className="flex items-center gap-2">
          {validatePhoneNumber(selectedCountry, phoneNumber) ? (
            <Badge variant="secondary" className="text-green-600 bg-green-50">
              <Check className="h-3 w-3 mr-1" />
              {t('validPhoneNumber')}
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-orange-600 bg-orange-50">
              {t('checkPhoneNumber')}
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}

export default PhoneInput