import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Mail,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  Send,
  Clock,
  Shield
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'

export interface ForgotPasswordProps {
  variant?: 'default' | 'card' | 'modal'
  onSubmit?: (email: string) => Promise<boolean>
  onBack?: () => void
  allowResend?: boolean
  resendDelay?: number
  className?: string
}

export function ForgotPassword({
  variant = 'default',
  onSubmit,
  onBack,
  allowResend = true,
  resendDelay = 60,
  className
}: ForgotPasswordProps) {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [resendTimer, setResendTimer] = useState(0)

  // Start resend timer
  const startResendTimer = () => {
    setResendTimer(resendDelay)
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError(t('emailRequired'))
      return
    }

    if (!validateEmail(email)) {
      setError(t('invalidEmail'))
      return
    }

    setIsLoading(true)

    try {
      const success = await onSubmit?.(email) ?? true
      if (success) {
        setIsSubmitted(true)
        startResendTimer()
      } else {
        setError(t('failedToSendEmail'))
      }
    } catch (err) {
      setError(t('networkError'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendTimer > 0) return

    setIsLoading(true)
    try {
      const success = await onSubmit?.(email) ?? true
      if (success) {
        startResendTimer()
      } else {
        setError(t('failedToSendEmail'))
      }
    } catch (err) {
      setError(t('networkError'))
    } finally {
      setIsLoading(false)
    }
  }

  const renderSuccessState = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">{t('checkYourEmail')}</h3>
        <p className="text-muted-foreground">
          {t('passwordResetLinkSent', { email })}
        </p>
      </div>

      <Alert>
        <Mail className="h-4 w-4" />
        <AlertDescription>
          {t('checkSpamFolder')}
        </AlertDescription>
      </Alert>

      <div className="space-y-3">
        {allowResend && (
          <Button
            variant="outline"
            onClick={handleResend}
            disabled={resendTimer > 0 || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : resendTimer > 0 ? (
              <>
                <Clock className="h-4 w-4 mr-2" />
                {t('resendIn', { seconds: resendTimer })}
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {t('resendEmail')}
              </>
            )}
          </Button>
        )}

        {onBack && (
          <Button variant="ghost" onClick={onBack} className="w-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('backToLogin')}
          </Button>
        )}
      </div>
    </div>
  )

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{t('email')}</Label>
        <Input
          id="email"
          type="email"
          placeholder={t('enterYourEmail')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className={cn(error && 'border-destructive')}
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t('sending')}
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              {t('sendResetLink')}
            </>
          )}
        </Button>

        {onBack && (
          <Button type="button" variant="ghost" onClick={onBack} className="w-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('backToLogin')}
          </Button>
        )}
      </div>
    </form>
  )

  const content = (
    <div className="space-y-6">
      {!isSubmitted && (
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold">{t('forgotPassword')}</h2>
          <p className="text-muted-foreground">
            {t('forgotPasswordDescription')}
          </p>
        </div>
      )}

      {isSubmitted ? renderSuccessState() : renderForm()}

      {!isSubmitted && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {t('rememberPassword')}{' '}
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="font-medium text-primary hover:underline"
              >
                {t('signIn')}
              </button>
            )}
          </p>
        </div>
      )}
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
          <CardTitle className="text-2xl">{t('forgotPassword')}</CardTitle>
          <CardDescription>
            {t('forgotPasswordDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitted ? renderSuccessState() : renderForm()}
        </CardContent>
        {!isSubmitted && (
          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              {t('rememberPassword')}{' '}
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="font-medium text-primary hover:underline"
                >
                  {t('signIn')}
                </button>
              )}
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

export default ForgotPassword