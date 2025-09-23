import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Shield,
  Smartphone,
  Key,
  CheckCircle,
  AlertCircle,
  Loader2,
  QrCode,
  Copy,
  RefreshCw,
  ArrowLeft,
  Info,
  Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'

export interface TwoFactorAuthProps {
  variant?: 'default' | 'setup' | 'verify' | 'modal'
  mode?: 'sms' | 'app' | 'both'
  phoneNumber?: string
  qrCodeUrl?: string
  backupCodes?: string[]
  onVerify?: (code: string, method: 'sms' | 'app' | 'backup') => Promise<boolean>
  onSetup?: (method: 'sms' | 'app', phoneNumber?: string) => Promise<{ success: boolean; qrCode?: string; backupCodes?: string[] }>
  onResendSMS?: () => Promise<boolean>
  onBack?: () => void
  onSuccess?: () => void
  resendDelay?: number
  codeLength?: number
  className?: string
}

export function TwoFactorAuth({
  variant = 'verify',
  mode = 'both',
  phoneNumber,
  qrCodeUrl,
  backupCodes = [],
  onVerify,
  onSetup,
  onResendSMS,
  onBack,
  onSuccess,
  resendDelay = 30,
  codeLength = 6,
  className
}: TwoFactorAuthProps) {
  const { t } = useTranslation()
  const [activeMethod, setActiveMethod] = useState<'sms' | 'app' | 'backup'>('app')
  const [code, setCode] = useState(Array(codeLength).fill(''))
  const [backupCode, setBackupCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [setupStep, setSetupStep] = useState<'method' | 'phone' | 'qr' | 'verify' | 'backup'>('method')
  const [setupMethod, setSetupMethod] = useState<'sms' | 'app'>('app')
  const [setupPhone, setSetupPhone] = useState(phoneNumber || '')
  const [generatedQR, setGeneratedQR] = useState(qrCodeUrl || '')
  const [generatedBackupCodes, setGeneratedBackupCodes] = useState<string[]>(backupCodes)
  const [copiedCode, setCopiedCode] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Initialize active method based on available options
  useEffect(() => {
    if (mode === 'sms') setActiveMethod('sms')
    else if (mode === 'app') setActiveMethod('app')
    else if (phoneNumber) setActiveMethod('sms')
    else setActiveMethod('app')
  }, [mode, phoneNumber])

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
      const lastIndex = Math.min(pastedCode.length - 1, codeLength - 1)
      inputRefs.current[lastIndex]?.focus()
      return
    }

    if (!/^\d*$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)
    setError('')

    if (value && index < codeLength - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when code is complete
    if (newCode.every(digit => digit !== '')) {
      setTimeout(() => handleVerify(newCode.join('')), 100)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async (codeToVerify?: string) => {
    const verificationCode = codeToVerify ||
                           (activeMethod === 'backup' ? backupCode : code.join(''))

    if (!verificationCode || verificationCode.length < (activeMethod === 'backup' ? 8 : codeLength)) {
      setError(t('pleaseEnterCompleteCode'))
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const success = await onVerify?.(verificationCode, activeMethod) ?? true

      if (success) {
        setIsVerified(true)
        setTimeout(() => onSuccess?.(), 1500)
      } else {
        setError(t('invalidVerificationCode'))
        if (activeMethod === 'backup') {
          setBackupCode('')
        } else {
          setCode(Array(codeLength).fill(''))
          inputRefs.current[0]?.focus()
        }
      }
    } catch (err) {
      setError(t('verificationFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendSMS = async () => {
    if (resendTimer > 0) return

    setIsLoading(true)
    try {
      const success = await onResendSMS?.() ?? true
      if (success) {
        setResendTimer(resendDelay)
        const timer = setInterval(() => {
          setResendTimer(prev => {
            if (prev <= 1) {
              clearInterval(timer)
              return 0
            }
            return prev - 1
          })
        }, 1000)
        setCode(Array(codeLength).fill(''))
      } else {
        setError(t('failedToResendCode'))
      }
    } catch (err) {
      setError(t('resendFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetup = async () => {
    setIsLoading(true)
    setError('')

    try {
      const result = await onSetup?.(setupMethod, setupPhone) ?? {
        success: true,
        qrCode: 'data:image/png;base64,mock-qr-code',
        backupCodes: ['12345678', '87654321', '11111111', '22222222', '33333333']
      }

      if (result.success) {
        if (result.qrCode) setGeneratedQR(result.qrCode)
        if (result.backupCodes) setGeneratedBackupCodes(result.backupCodes)

        if (setupMethod === 'app') {
          setSetupStep('qr')
        } else {
          setSetupStep('verify')
        }
      } else {
        setError(t('setupFailed'))
      }
    } catch (err) {
      setError(t('setupError'))
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string, codeId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedCode(codeId)
      setTimeout(() => setCopiedCode(''), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
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
                <h3 className="text-xl font-semibold text-green-600">{t('verified')}</h3>
                <p className="text-muted-foreground">
                  {t('twoFactorVerificationSuccess')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (variant === 'setup') {
    return (
      <div className={cn("w-full max-w-2xl mx-auto", className)}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {t('setupTwoFactorAuth')}
            </CardTitle>
            <CardDescription>
              {t('setupTwoFactorDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {setupStep === 'method' && (
              <div className="space-y-4">
                <Label className="text-base">{t('chooseAuthMethod')}</Label>
                <div className="grid gap-3">
                  {(mode === 'both' || mode === 'app') && (
                    <Card
                      className={cn(
                        "cursor-pointer transition-colors",
                        setupMethod === 'app' && "ring-2 ring-primary"
                      )}
                      onClick={() => setSetupMethod('app')}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Smartphone className="h-8 w-8 text-primary" />
                          <div>
                            <h3 className="font-medium">{t('authenticatorApp')}</h3>
                            <p className="text-sm text-muted-foreground">
                              {t('authenticatorAppDescription')}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {(mode === 'both' || mode === 'sms') && (
                    <Card
                      className={cn(
                        "cursor-pointer transition-colors",
                        setupMethod === 'sms' && "ring-2 ring-primary"
                      )}
                      onClick={() => setSetupMethod('sms')}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Key className="h-8 w-8 text-primary" />
                          <div>
                            <h3 className="font-medium">{t('smsCode')}</h3>
                            <p className="text-sm text-muted-foreground">
                              {t('smsCodeDescription')}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  {onBack && (
                    <Button variant="outline" onClick={onBack}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      {t('cancel')}
                    </Button>
                  )}
                  <Button
                    onClick={() => setupMethod === 'sms' ? setSetupStep('phone') : handleSetup()}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    {t('continue')}
                  </Button>
                </div>
              </div>
            )}

            {setupStep === 'phone' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('phoneNumber')}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={setupPhone}
                    onChange={(e) => setSetupPhone(e.target.value)}
                  />
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    {t('smsSetupNote')}
                  </AlertDescription>
                </Alert>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSetupStep('method')}>
                    {t('back')}
                  </Button>
                  <Button onClick={handleSetup} disabled={!setupPhone || isLoading}>
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    {t('sendCode')}
                  </Button>
                </div>
              </div>
            )}

            {setupStep === 'qr' && (
              <div className="space-y-4">
                <div className="text-center space-y-4">
                  <h3 className="text-lg font-medium">{t('scanQRCode')}</h3>
                  <div className="flex justify-center">
                    {generatedQR ? (
                      <img src={generatedQR} alt="QR Code" className="w-48 h-48 border rounded-lg" />
                    ) : (
                      <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                        <QrCode className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    {t('scanQRCodeInstructions')}
                  </p>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSetupStep('method')}>
                    {t('back')}
                  </Button>
                  <Button onClick={() => setSetupStep('verify')}>
                    {t('continue')}
                  </Button>
                </div>
              </div>
            )}

            {setupStep === 'verify' && (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-medium">{t('enterVerificationCode')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {setupMethod === 'app'
                      ? t('enterCodeFromApp')
                      : t('enterCodeFromSMS', { phone: setupPhone })}
                  </p>
                </div>

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
                      className="w-12 h-12 text-center text-lg"
                    />
                  ))}
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSetupStep(setupMethod === 'app' ? 'qr' : 'phone')}>
                    {t('back')}
                  </Button>
                  <Button
                    onClick={() => handleVerify()}
                    disabled={code.some(d => !d) || isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    {t('verify')}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  const verifyForm = (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">{t('twoFactorVerification')}</h2>
        <p className="text-muted-foreground">
          {t('twoFactorVerificationDescription')}
        </p>
      </div>

      <Tabs value={activeMethod} onValueChange={(value) => setActiveMethod(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          {(mode === 'both' || mode === 'app') && (
            <TabsTrigger value="app">{t('app')}</TabsTrigger>
          )}
          {(mode === 'both' || mode === 'sms') && phoneNumber && (
            <TabsTrigger value="sms">{t('sms')}</TabsTrigger>
          )}
          <TabsTrigger value="backup">{t('backup')}</TabsTrigger>
        </TabsList>

        <TabsContent value="app" className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              {t('enterCodeFromAuthenticatorApp')}
            </p>
          </div>

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
                className="w-12 h-12 text-center text-lg"
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sms" className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              {t('enterCodeFromSMS', { phone: phoneNumber })}
            </p>
          </div>

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
                className="w-12 h-12 text-center text-lg"
              />
            ))}
          </div>

          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResendSMS}
              disabled={resendTimer > 0 || isLoading}
            >
              {resendTimer > 0 ? (
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
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              {t('enterBackupCode')}
            </p>
          </div>

          <div className="space-y-2">
            <Input
              placeholder={t('backupCodePlaceholder')}
              value={backupCode}
              onChange={(e) => setBackupCode(e.target.value.replace(/\s/g, ''))}
              className="text-center font-mono"
            />
          </div>

          <Button
            onClick={() => handleVerify()}
            disabled={!backupCode || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            {t('verify')}
          </Button>
        </TabsContent>
      </Tabs>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {onBack && (
        <Button variant="ghost" onClick={onBack} className="w-full">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('backToLogin')}
        </Button>
      )}
    </div>
  )

  if (variant === 'modal') {
    return (
      <div className={cn("w-full max-w-md", className)}>
        {verifyForm}
      </div>
    )
  }

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {verifyForm}
        </CardContent>
      </Card>
    </div>
  )
}

export default TwoFactorAuth