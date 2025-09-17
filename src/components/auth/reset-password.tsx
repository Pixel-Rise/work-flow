import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import {
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
  Shield,
  Check,
  X,
  Key,
  ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'

export interface ResetPasswordProps {
  variant?: 'default' | 'card' | 'modal'
  token?: string
  onSubmit?: (password: string, confirmPassword: string, token?: string) => Promise<boolean>
  onSuccess?: () => void
  onInvalidToken?: () => void
  minLength?: number
  requireUppercase?: boolean
  requireLowercase?: boolean
  requireNumbers?: boolean
  requireSpecialChars?: boolean
  className?: string
}

interface PasswordStrength {
  score: number
  label: string
  color: string
}

export function ResetPassword({
  variant = 'default',
  token,
  onSubmit,
  onSuccess,
  onInvalidToken,
  minLength = 8,
  requireUppercase = true,
  requireLowercase = true,
  requireNumbers = true,
  requireSpecialChars = true,
  className
}: ResetPasswordProps) {
  const { t } = useTranslation()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [tokenError, setTokenError] = useState(false)

  // Validate token on component mount
  useEffect(() => {
    if (token) {
      // In real app, validate token with API
      // For now, just check if token exists and is not empty
      if (token.length < 10) {
        setTokenError(true)
        onInvalidToken?.()
      }
    }
  }, [token, onInvalidToken])

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0
    let feedback = []

    if (password.length >= minLength) score += 1
    if (requireUppercase && /[A-Z]/.test(password)) score += 1
    if (requireLowercase && /[a-z]/.test(password)) score += 1
    if (requireNumbers && /\d/.test(password)) score += 1
    if (requireSpecialChars && /[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1

    const strengthMap = {
      0: { label: t('veryWeak'), color: 'bg-red-500' },
      1: { label: t('weak'), color: 'bg-red-400' },
      2: { label: t('fair'), color: 'bg-yellow-500' },
      3: { label: t('good'), color: 'bg-blue-500' },
      4: { label: t('strong'), color: 'bg-green-500' },
      5: { label: t('veryStrong'), color: 'bg-green-600' }
    }

    return {
      score,
      label: strengthMap[score as keyof typeof strengthMap].label,
      color: strengthMap[score as keyof typeof strengthMap].color
    }
  }

  const getPasswordRequirements = () => [
    {
      text: t('minCharacters', { count: minLength }),
      met: password.length >= minLength
    },
    {
      text: t('uppercaseLetter'),
      met: !requireUppercase || /[A-Z]/.test(password)
    },
    {
      text: t('lowercaseLetter'),
      met: !requireLowercase || /[a-z]/.test(password)
    },
    {
      text: t('number'),
      met: !requireNumbers || /\d/.test(password)
    },
    {
      text: t('specialCharacter'),
      met: !requireSpecialChars || /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
  ]

  const isPasswordValid = () => {
    const requirements = getPasswordRequirements()
    return requirements.every(req => req.met)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!password) {
      setError(t('passwordRequired'))
      return
    }

    if (!confirmPassword) {
      setError(t('confirmPasswordRequired'))
      return
    }

    if (!isPasswordValid()) {
      setError(t('passwordDoesNotMeetRequirements'))
      return
    }

    if (password !== confirmPassword) {
      setError(t('passwordsDoNotMatch'))
      return
    }

    setIsLoading(true)

    try {
      const success = await onSubmit?.(password, confirmPassword, token) ?? true
      if (success) {
        setIsSuccess(true)
        setTimeout(() => {
          onSuccess?.()
        }, 2000)
      } else {
        setError(t('failedToResetPassword'))
      }
    } catch (err) {
      setError(t('networkError'))
    } finally {
      setIsLoading(false)
    }
  }

  const strength = calculatePasswordStrength(password)
  const requirements = getPasswordRequirements()

  if (tokenError) {
    return (
      <div className={cn("w-full max-w-md mx-auto", className)}>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <X className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-red-600">{t('invalidToken')}</h3>
                <p className="text-muted-foreground">
                  {t('invalidTokenDescription')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className={cn("w-full max-w-md mx-auto", className)}>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-green-600">{t('passwordResetSuccess')}</h3>
                <p className="text-muted-foreground">
                  {t('passwordResetSuccessDescription')}
                </p>
              </div>
              <Button onClick={onSuccess} className="w-full">
                <ArrowRight className="h-4 w-4 mr-2" />
                {t('continueToLogin')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const form = (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Password Input */}
      <div className="space-y-2">
        <Label htmlFor="password">{t('newPassword')}</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder={t('enterNewPassword')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className={cn(
              error && 'border-destructive',
              'pr-10'
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Password Strength */}
        {password && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t('passwordStrength')}</span>
              <span className={cn(
                "font-medium",
                strength.score <= 2 ? 'text-red-600' :
                strength.score <= 3 ? 'text-yellow-600' : 'text-green-600'
              )}>
                {strength.label}
              </span>
            </div>
            <Progress
              value={(strength.score / 5) * 100}
              className={cn("h-2", strength.color)}
            />
          </div>
        )}
      </div>

      {/* Password Requirements */}
      {password && (
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">{t('passwordRequirements')}</Label>
          <div className="space-y-1">
            {requirements.map((req, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center gap-2 text-sm",
                  req.met ? 'text-green-600' : 'text-muted-foreground'
                )}
              >
                {req.met ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <X className="h-3 w-3" />
                )}
                <span>{req.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirm Password Input */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder={t('confirmNewPassword')}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            className={cn(
              error && 'border-destructive',
              confirmPassword && password !== confirmPassword && 'border-destructive',
              'pr-10'
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isLoading}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        {confirmPassword && password !== confirmPassword && (
          <p className="text-sm text-destructive">{t('passwordsDoNotMatch')}</p>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !isPasswordValid() || password !== confirmPassword}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {t('resetting')}
          </>
        ) : (
          <>
            <Key className="h-4 w-4 mr-2" />
            {t('resetPassword')}
          </>
        )}
      </Button>
    </form>
  )

  const content = (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-bold">{t('resetPassword')}</h2>
        <p className="text-muted-foreground">
          {t('resetPasswordDescription')}
        </p>
      </div>
      {form}
    </div>
  )

  if (variant === 'modal') {
    return (
      <div className={cn("w-full max-w-md", className)}>
        {content}
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <Card className={cn("w-full max-w-md", className)}>
        <CardContent className="pt-6">
          {content}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      <Card>
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">{t('resetPassword')}</CardTitle>
          <CardDescription>
            {t('resetPasswordDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {form}
        </CardContent>
      </Card>
    </div>
  )
}

export default ResetPassword