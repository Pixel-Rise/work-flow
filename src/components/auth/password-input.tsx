import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Eye,
  EyeOff,
  Check,
  X,
  Shield,
  Lock,
  Unlock,
  AlertTriangle,
  Info,
  RefreshCw
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'

export interface PasswordRequirement {
  id: string
  label: string
  regex: RegExp
  description?: string
  category: 'length' | 'character' | 'security'
}

interface PasswordInputProps {
  id?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  error?: string | null
  showPasswordStrength?: boolean
  showRequirements?: boolean
  showToggle?: boolean
  showGenerator?: boolean
  requirements?: PasswordRequirement[]
  minStrength?: number
  allowPaste?: boolean
  validateOnChange?: boolean
  onStrengthChange?: (strength: number, isValid: boolean) => void
  onRequirementsChange?: (met: PasswordRequirement[], unmet: PasswordRequirement[]) => void
  className?: string
}

const defaultRequirements: PasswordRequirement[] = [
  {
    id: 'length',
    label: 'At least 8 characters',
    regex: /.{8,}/,
    description: 'Password must be at least 8 characters long',
    category: 'length'
  },
  {
    id: 'uppercase',
    label: 'One uppercase letter',
    regex: /[A-Z]/,
    description: 'Include at least one uppercase letter (A-Z)',
    category: 'character'
  },
  {
    id: 'lowercase',
    label: 'One lowercase letter',
    regex: /[a-z]/,
    description: 'Include at least one lowercase letter (a-z)',
    category: 'character'
  },
  {
    id: 'number',
    label: 'One number',
    regex: /\d/,
    description: 'Include at least one number (0-9)',
    category: 'character'
  },
  {
    id: 'special',
    label: 'One special character',
    regex: /[!@#$%^&*(),.?":{}|<>]/,
    description: 'Include at least one special character (!@#$%^&*)',
    category: 'character'
  },
  {
    id: 'no_common',
    label: 'Not a common password',
    regex: /^(?!.*(?:password|123456|qwerty|admin|letmein|welcome|monkey|1234567890))/i,
    description: 'Avoid common passwords like "password" or "123456"',
    category: 'security'
  }
]

const commonPasswords = [
  'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
  'admin', 'letmein', 'welcome', 'monkey', '1234567890', '12345678',
  'football', 'iloveyou', 'admin123', 'welcome123', 'princess', 'login',
  'starwars', 'superman', 'master', 'hello', 'freedom', 'dragon'
]

const characterSets = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
}

export function PasswordInput({
  id,
  value,
  onChange,
  placeholder = 'Enter password',
  disabled = false,
  error,
  showPasswordStrength = false,
  showRequirements = false,
  showToggle = true,
  showGenerator = false,
  requirements = defaultRequirements,
  minStrength = 60,
  allowPaste = true,
  validateOnChange = true,
  onStrengthChange,
  onRequirementsChange,
  className
}: PasswordInputProps) {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)
  const [showRequirementsPopover, setShowRequirementsPopover] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  // Calculate password strength
  const calculateStrength = (password: string): number => {
    if (!password) return 0

    let score = 0
    const metRequirements = requirements.filter(req => req.regex.test(password))

    // Base score from requirements
    score += (metRequirements.length / requirements.length) * 60

    // Length bonus
    if (password.length >= 12) score += 10
    if (password.length >= 16) score += 10

    // Character variety bonus
    const hasLower = /[a-z]/.test(password)
    const hasUpper = /[A-Z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const varieties = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length

    score += varieties * 5

    // Penalty for common patterns
    if (/(.)\1{2,}/.test(password)) score -= 10 // Repeated characters
    if (/123|abc|qwe/i.test(password)) score -= 10 // Sequential characters
    if (commonPasswords.some(common => password.toLowerCase().includes(common))) score -= 20

    return Math.min(100, Math.max(0, score))
  }

  // Get strength label and color
  const getStrengthInfo = (strength: number) => {
    if (strength < 30) return { label: t('veryWeak'), color: 'bg-red-500', textColor: 'text-red-600' }
    if (strength < 50) return { label: t('weak'), color: 'bg-orange-500', textColor: 'text-orange-600' }
    if (strength < 70) return { label: t('medium'), color: 'bg-yellow-500', textColor: 'text-yellow-600' }
    if (strength < 85) return { label: t('strong'), color: 'bg-blue-500', textColor: 'text-blue-600' }
    return { label: t('veryStrong'), color: 'bg-green-500', textColor: 'text-green-600' }
  }

  // Check which requirements are met
  const checkRequirements = (password: string) => {
    const met = requirements.filter(req => req.regex.test(password))
    const unmet = requirements.filter(req => !req.regex.test(password))
    return { met, unmet }
  }

  // Generate secure password
  const generatePassword = (length: number = 16): string => {
    const allChars = Object.values(characterSets).join('')
    let password = ''

    // Ensure at least one character from each set
    password += characterSets.lowercase[Math.floor(Math.random() * characterSets.lowercase.length)]
    password += characterSets.uppercase[Math.floor(Math.random() * characterSets.uppercase.length)]
    password += characterSets.numbers[Math.floor(Math.random() * characterSets.numbers.length)]
    password += characterSets.symbols[Math.floor(Math.random() * characterSets.symbols.length)]

    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)]
    }

    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('')
  }

  const handlePasswordGenerate = () => {
    const newPassword = generatePassword()
    onChange(newPassword)
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    if (!allowPaste) {
      e.preventDefault()
    }
  }

  // Update strength and requirements when password changes
  useEffect(() => {
    if (validateOnChange) {
      const strength = calculateStrength(value)
      const { met, unmet } = checkRequirements(value)
      const isValid = strength >= minStrength && unmet.length === 0

      onStrengthChange?.(strength, isValid)
      onRequirementsChange?.(met, unmet)
    }
  }, [value, requirements, minStrength, validateOnChange, onStrengthChange, onRequirementsChange])

  const strength = calculateStrength(value)
  const strengthInfo = getStrengthInfo(strength)
  const { met, unmet } = checkRequirements(value)

  return (
    <div className={cn("space-y-2", className)}>
      {/* Password Input */}
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onPaste={handlePaste}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "pr-20",
            error && "border-red-500",
            showPasswordStrength && value && strength >= minStrength && "border-green-500"
          )}
        />

        {/* Action Buttons */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {showGenerator && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={handlePasswordGenerate}
              title={t('generatePassword')}
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          )}

          {showRequirements && value && (
            <Popover open={showRequirementsPopover} onOpenChange={setShowRequirementsPopover}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  title={t('passwordRequirements')}
                >
                  <Info className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">{t('passwordRequirements')}</h4>
                  <div className="space-y-2">
                    {requirements.map((req) => {
                      const isMet = met.includes(req)
                      return (
                        <div key={req.id} className="flex items-start gap-2">
                          <div className={cn(
                            "mt-0.5 h-4 w-4 rounded-full flex items-center justify-center",
                            isMet ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
                          )}>
                            {isMet ? <Check className="h-2.5 w-2.5" /> : <X className="h-2.5 w-2.5" />}
                          </div>
                          <div className="flex-1">
                            <p className={cn(
                              "text-sm",
                              isMet ? "text-green-700" : "text-muted-foreground"
                            )}>
                              {req.label}
                            </p>
                            {req.description && (
                              <p className="text-xs text-muted-foreground">{req.description}</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {showToggle && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? t('hidePassword') : t('showPassword')}
            >
              {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          {error}
        </p>
      )}

      {/* Password Strength */}
      {showPasswordStrength && value && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t('passwordStrength')}</span>
            <Badge variant="outline" className={strengthInfo.textColor}>
              {strengthInfo.label}
            </Badge>
          </div>
          <Progress value={strength} className="h-2">
            <div
              className={cn("h-full transition-all duration-300 rounded-full", strengthInfo.color)}
              style={{ width: `${strength}%` }}
            />
          </Progress>
        </div>
      )}

      {/* Inline Requirements (when focused) */}
      {showRequirements && value && isFocused && (
        <div className="space-y-2 p-3 border rounded-lg bg-muted/50">
          <h5 className="text-sm font-medium">{t('passwordRequirements')}</h5>
          <div className="grid grid-cols-1 gap-1">
            {requirements.map((req) => {
              const isMet = met.includes(req)
              return (
                <div key={req.id} className="flex items-center gap-2">
                  <div className={cn(
                    "h-3 w-3 rounded-full flex items-center justify-center",
                    isMet ? "bg-green-500 text-white" : "bg-gray-300 text-gray-500"
                  )}>
                    {isMet ? <Check className="h-2 w-2" /> : <X className="h-2 w-2" />}
                  </div>
                  <span className={cn(
                    "text-xs",
                    isMet ? "text-green-700" : "text-muted-foreground"
                  )}>
                    {req.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Security Tips */}
      {showPasswordStrength && strength < 50 && value && (
        <div className="flex items-start gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
          <Shield className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium">{t('improveSecurity')}</p>
            <ul className="text-xs mt-1 space-y-0.5">
              {unmet.slice(0, 3).map((req) => (
                <li key={req.id}>• {req.label}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showPasswordStrength && strength >= 85 && (
        <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg">
          <Lock className="h-4 w-4 text-green-600" />
          <span className="text-sm text-green-800 font-medium">{t('excellentPassword')}</span>
        </div>
      )}
    </div>
  )
}

export default PasswordInput