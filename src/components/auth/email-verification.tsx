import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Mail,
  CheckCircle,
  AlertCircle,
  Loader2,
  Send,
  Clock,
  ArrowLeft,
  Shield,
  RefreshCw
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'

export interface EmailVerificationProps {
  variant?: 'default' | 'card' | 'modal'
  email?: string
  codeLength?: number
  onVerify?: (code: string) => Promise<boolean>
  onResend?: (email?: string) => Promise<boolean>
  onBack?: () => void
  onSuccess?: () => void
  resendDelay?: number
  autoVerify?: boolean
  className?: string
}

export function EmailVerification({
  variant = 'default',
  email,
  codeLength = 6,
  onVerify,
  onResend,
  onBack,
  onSuccess,
  resendDelay = 60,
  autoVerify = true,
  className
}: EmailVerificationProps) {
  const { t } = useTranslation()
  const [code, setCode] = useState(Array(codeLength).fill(''))
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState('')
  const [resendTimer, setResendTimer] = useState(resendDelay)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Start resend timer on component mount
  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Auto-verify when code is complete
  useEffect(() => {
    if (autoVerify && code.every(digit => digit !== '') && code.join('').length === codeLength) {
      handleVerify()
    }
  }, [code, autoVerify, codeLength])

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedCode = value.slice(0, codeLength)
      const newCode = Array(codeLength).fill('')

      for (let i = 0; i < pastedCode.length; i++) {
        if (/^\d$/.test(pastedCode[i])) {
          newCode[i] = pastedCode[i]
        }
      }

      setCode(newCode)

      // Focus on the last filled input or the next empty one
      const lastFilledIndex = newCode.findIndex(digit => digit === '')
      const focusIndex = lastFilledIndex === -1 ? codeLength - 1 : lastFilledIndex
      inputRefs.current[focusIndex]?.focus()
      return
    }

    if (!/^\d*$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value

    setCode(newCode)
    setError('')

    // Move to next input
    if (value && index < codeLength - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < codeLength - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleVerify = async () => {
    const codeString = code.join('')

    if (codeString.length !== codeLength) {
      setError(t('pleaseEnterCompleteCode'))
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const success = await onVerify?.(codeString) ?? true

      if (success) {
        setIsVerified(true)
        setTimeout(() => {
          onSuccess?.()
        }, 2000)
      } else {
        setError(t('invalidVerificationCode'))
        // Clear code on error
        setCode(Array(codeLength).fill(''))
        inputRefs.current[0]?.focus()
      }
    } catch (err) {
      setError(t('verificationFailed'))
      setCode(Array(codeLength).fill(''))
      inputRefs.current[0]?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendTimer > 0 || isResending) return

    setIsResending(true)
    setError('')

    try {
      const success = await onResend?.(email) ?? true

      if (success) {
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

        // Clear current code
        setCode(Array(codeLength).fill(''))
        inputRefs.current[0]?.focus()
      } else {
        setError(t('failedToResendCode'))
      }
    } catch (err) {
      setError(t('resendFailed'))
    } finally {
      setIsResending(false)
    }
  }

  if (isVerified) {
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
                <h3 className="text-xl font-semibold text-green-600">{t('emailVerified')}</h3>
                <p className="text-muted-foreground">
                  {t('emailVerificationSuccess')}
                </p>
              </div>
              <Button onClick={onSuccess} className="w-full">
                {t('continue')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const form = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <Label className="text-base font-medium">{t('enterVerificationCode')}</Label>
          <p className="text-sm text-muted-foreground">
            {t('verificationCodeSent')} {email && <span className="font-medium">{email}</span>}
          </p>
        </div>

        {/* Code Input */}
        <div className="flex gap-2 justify-center">
          {code.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={isLoading}
              className={cn(
                "w-12 h-12 text-center text-lg font-semibold",
                error && 'border-destructive'
              )}
            />
          ))}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-3">
            {t('didNotReceiveCode')}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResend}
            disabled={resendTimer > 0 || isResending}
            className="w-full sm:w-auto"
          >
            {isResending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t('sending')}
              </>
            ) : resendTimer > 0 ? (
              <>
                <Clock className="h-4 w-4 mr-2" />
                {t('resendIn', { seconds: resendTimer })}
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                {t('resendCode')}
              </>
            )}
          </Button>
        </div>
      </div>

      {!autoVerify && (
        <Button
          onClick={handleVerify}
          disabled={isLoading || code.some(digit => digit === '')}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t('verifying')}
            </>
          ) : (
            <>
              <Shield className="h-4 w-4 mr-2" />
              {t('verifyEmail')}
            </>
          )}
        </Button>
      )}

      {onBack && (
        <Button variant="ghost" onClick={onBack} className="w-full">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('back')}
        </Button>
      )}
    </div>
  )

  const content = (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Mail className="h-6 w-6 text-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-bold">{t('verifyYourEmail')}</h2>
        <p className="text-muted-foreground">
          {t('emailVerificationDescription')}
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
              <Mail className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">{t('verifyYourEmail')}</CardTitle>
          <CardDescription>
            {t('emailVerificationDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {form}
        </CardContent>
      </Card>
    </div>
  )
}

export default EmailVerification