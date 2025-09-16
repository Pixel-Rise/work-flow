import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { PhoneInput } from './phone-input'
import { PasswordInput } from './password-input'
import {
  User,
  Mail,
  Building,
  MapPin,
  Calendar,
  UserCheck,
  Shield,
  Eye,
  EyeOff,
  Check,
  X,
  AlertTriangle,
  Info
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'

export interface RegisterFormData {
  // Personal Information
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string

  // Professional Information
  company?: string
  jobTitle?: string
  department?: string
  experience?: string

  // Location
  country?: string
  city?: string
  timezone?: string

  // Preferences
  language: string
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
  }

  // Legal
  agreeToTerms: boolean
  agreeToPrivacy: boolean
  subscribeToNewsletter: boolean
}

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void> | void
  onLoginClick?: () => void
  initialData?: Partial<RegisterFormData>
  variant?: 'default' | 'compact' | 'wizard'
  showSocialLogin?: boolean
  requiredFields?: (keyof RegisterFormData)[]
  companyDomains?: string[]
  isLoading?: boolean
  errors?: Partial<Record<keyof RegisterFormData, string>>
  className?: string
}

const countries = [
  { code: 'UZ', name: 'Uzbekistan' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'RU', name: 'Russia' },
  { code: 'CN', name: 'China' },
  { code: 'JP', name: 'Japan' }
]

const languages = [
  { code: 'en', name: 'English' },
  { code: 'uz', name: "O'zbekcha" },
  { code: 'ru', name: 'Русский' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' }
]

const experienceLevels = [
  { value: 'entry', label: 'Entry Level (0-2 years)' },
  { value: 'junior', label: 'Junior (2-4 years)' },
  { value: 'mid', label: 'Mid-level (4-7 years)' },
  { value: 'senior', label: 'Senior (7-10 years)' },
  { value: 'lead', label: 'Lead (10+ years)' },
  { value: 'executive', label: 'Executive' }
]

const passwordRequirements = [
  { id: 'length', label: 'At least 8 characters', regex: /.{8,}/ },
  { id: 'uppercase', label: 'One uppercase letter', regex: /[A-Z]/ },
  { id: 'lowercase', label: 'One lowercase letter', regex: /[a-z]/ },
  { id: 'number', label: 'One number', regex: /\d/ },
  { id: 'special', label: 'One special character', regex: /[!@#$%^&*(),.?":{}|<>]/ }
]

export function RegisterForm({
  onSubmit,
  onLoginClick,
  initialData = {},
  variant = 'default',
  showSocialLogin = true,
  requiredFields = ['firstName', 'lastName', 'email', 'password', 'agreeToTerms'],
  companyDomains = [],
  isLoading = false,
  errors = {},
  className
}: RegisterFormProps) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    company: '',
    jobTitle: '',
    department: '',
    experience: '',
    country: '',
    city: '',
    timezone: '',
    language: 'en',
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    agreeToTerms: false,
    agreeToPrivacy: false,
    subscribeToNewsletter: false,
    ...initialData
  })

  const [currentStep, setCurrentStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())

  const steps = [
    { id: 'personal', title: t('personalInformation'), fields: ['firstName', 'lastName', 'email', 'phone'] },
    { id: 'security', title: t('securitySettings'), fields: ['password', 'confirmPassword'] },
    { id: 'professional', title: t('professionalInformation'), fields: ['company', 'jobTitle', 'department', 'experience'] },
    { id: 'preferences', title: t('preferences'), fields: ['country', 'language', 'notifications'] },
    { id: 'legal', title: t('termsAndConditions'), fields: ['agreeToTerms', 'agreeToPrivacy', 'subscribeToNewsletter'] }
  ]

  const updateField = (field: keyof RegisterFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setTouchedFields(prev => new Set([...prev, field]))
  }

  const getPasswordStrength = () => {
    const met = passwordRequirements.filter(req => req.regex.test(formData.password))
    return (met.length / passwordRequirements.length) * 100
  }

  const getPasswordStrengthLabel = () => {
    const strength = getPasswordStrength()
    if (strength < 40) return { label: t('weak'), color: 'text-red-600' }
    if (strength < 70) return { label: t('medium'), color: 'text-yellow-600' }
    if (strength < 90) return { label: t('strong'), color: 'text-blue-600' }
    return { label: t('veryStrong'), color: 'text-green-600' }
  }

  const validateField = (field: keyof RegisterFormData): string | null => {
    const value = formData[field]

    if (requiredFields.includes(field) && !value) {
      return t('fieldRequired')
    }

    switch (field) {
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string)) {
          return t('invalidEmail')
        }
        if (companyDomains.length > 0) {
          const domain = (value as string).split('@')[1]
          if (!companyDomains.includes(domain)) {
            return t('invalidCompanyDomain')
          }
        }
        break

      case 'password':
        if (value && (value as string).length < 8) {
          return t('passwordTooShort')
        }
        break

      case 'confirmPassword':
        if (value && value !== formData.password) {
          return t('passwordsDontMatch')
        }
        break

      case 'phone':
        if (value && !/^\+?[\d\s-()]+$/.test(value as string)) {
          return t('invalidPhoneNumber')
        }
        break
    }

    return errors[field] || null
  }

  const getStepCompletion = (stepIndex: number) => {
    const step = steps[stepIndex]
    const stepFields = step.fields.filter(field => requiredFields.includes(field as any))
    const completedFields = stepFields.filter(field => {
      const value = formData[field as keyof RegisterFormData]
      return value && !validateField(field as keyof RegisterFormData)
    })
    return stepFields.length > 0 ? (completedFields.length / stepFields.length) * 100 : 100
  }

  const canProceedToNextStep = () => {
    const step = steps[currentStep]
    const stepFields = step.fields.filter(field => requiredFields.includes(field as any))
    return stepFields.every(field => {
      const value = formData[field as keyof RegisterFormData]
      return value && !validateField(field as keyof RegisterFormData)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Mark all fields as touched for validation
    const allFields = Object.keys(formData) as (keyof RegisterFormData)[]
    setTouchedFields(new Set(allFields))

    // Validate all required fields
    const hasErrors = requiredFields.some(field => validateField(field))
    if (hasErrors) return

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Registration error:', error)
    }
  }

  const renderPersonalStep = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">{t('firstName')} *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => updateField('firstName', e.target.value)}
            placeholder={t('enterFirstName')}
            className={validateField('firstName') ? 'border-red-500' : ''}
          />
          {touchedFields.has('firstName') && validateField('firstName') && (
            <p className="text-sm text-red-600">{validateField('firstName')}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">{t('lastName')} *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => updateField('lastName', e.target.value)}
            placeholder={t('enterLastName')}
            className={validateField('lastName') ? 'border-red-500' : ''}
          />
          {touchedFields.has('lastName') && validateField('lastName') && (
            <p className="text-sm text-red-600">{validateField('lastName')}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{t('email')} *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          placeholder={t('enterEmail')}
          className={validateField('email') ? 'border-red-500' : ''}
        />
        {touchedFields.has('email') && validateField('email') && (
          <p className="text-sm text-red-600">{validateField('email')}</p>
        )}
        {companyDomains.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {t('allowedDomains')}: {companyDomains.join(', ')}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">{t('phoneNumber')}</Label>
        <PhoneInput
          value={formData.phone}
          onChange={(value) => updateField('phone', value)}
          placeholder={t('enterPhoneNumber')}
          error={touchedFields.has('phone') ? validateField('phone') : null}
        />
      </div>
    </div>
  )

  const renderSecurityStep = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">{t('password')} *</Label>
        <PasswordInput
          id="password"
          value={formData.password}
          onChange={(value) => updateField('password', value)}
          placeholder={t('enterPassword')}
          showPasswordStrength
          error={touchedFields.has('password') ? validateField('password') : null}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">{t('confirmPassword')} *</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => updateField('confirmPassword', e.target.value)}
            placeholder={t('confirmPassword')}
            className={validateField('confirmPassword') ? 'border-red-500 pr-10' : 'pr-10'}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 h-6 w-6 p-0 -translate-y-1/2"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-3 w-3" />
            ) : (
              <Eye className="h-3 w-3" />
            )}
          </Button>
        </div>
        {touchedFields.has('confirmPassword') && validateField('confirmPassword') && (
          <p className="text-sm text-red-600">{validateField('confirmPassword')}</p>
        )}
      </div>
    </div>
  )

  const renderProfessionalStep = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="company">{t('company')}</Label>
        <Input
          id="company"
          value={formData.company}
          onChange={(e) => updateField('company', e.target.value)}
          placeholder={t('enterCompany')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="jobTitle">{t('jobTitle')}</Label>
          <Input
            id="jobTitle"
            value={formData.jobTitle}
            onChange={(e) => updateField('jobTitle', e.target.value)}
            placeholder={t('enterJobTitle')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">{t('department')}</Label>
          <Input
            id="department"
            value={formData.department}
            onChange={(e) => updateField('department', e.target.value)}
            placeholder={t('enterDepartment')}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience">{t('experience')}</Label>
        <Select value={formData.experience} onValueChange={(value) => updateField('experience', value)}>
          <SelectTrigger>
            <SelectValue placeholder={t('selectExperience')} />
          </SelectTrigger>
          <SelectContent>
            {experienceLevels.map((level) => (
              <SelectItem key={level.value} value={level.value}>
                {level.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  const renderPreferencesStep = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="country">{t('country')}</Label>
          <Select value={formData.country} onValueChange={(value) => updateField('country', value)}>
            <SelectTrigger>
              <SelectValue placeholder={t('selectCountry')} />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">{t('language')}</Label>
          <Select value={formData.language} onValueChange={(value) => updateField('language', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <Label>{t('notificationPreferences')}</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="email-notifications"
              checked={formData.notifications.email}
              onCheckedChange={(checked) =>
                updateField('notifications', { ...formData.notifications, email: !!checked })
              }
            />
            <Label htmlFor="email-notifications" className="text-sm">
              {t('emailNotifications')}
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="sms-notifications"
              checked={formData.notifications.sms}
              onCheckedChange={(checked) =>
                updateField('notifications', { ...formData.notifications, sms: !!checked })
              }
            />
            <Label htmlFor="sms-notifications" className="text-sm">
              {t('smsNotifications')}
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="push-notifications"
              checked={formData.notifications.push}
              onCheckedChange={(checked) =>
                updateField('notifications', { ...formData.notifications, push: !!checked })
              }
            />
            <Label htmlFor="push-notifications" className="text-sm">
              {t('pushNotifications')}
            </Label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderLegalStep = () => (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="agree-terms"
            checked={formData.agreeToTerms}
            onCheckedChange={(checked) => updateField('agreeToTerms', !!checked)}
            className={!formData.agreeToTerms && touchedFields.has('agreeToTerms') ? 'border-red-500' : ''}
          />
          <Label htmlFor="agree-terms" className="text-sm leading-relaxed">
            {t('agreeToTerms')} <a href="/terms" className="text-primary hover:underline">{t('termsOfService')}</a> *
          </Label>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="agree-privacy"
            checked={formData.agreeToPrivacy}
            onCheckedChange={(checked) => updateField('agreeToPrivacy', !!checked)}
          />
          <Label htmlFor="agree-privacy" className="text-sm leading-relaxed">
            {t('agreeToPrivacy')} <a href="/privacy" className="text-primary hover:underline">{t('privacyPolicy')}</a>
          </Label>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="subscribe-newsletter"
            checked={formData.subscribeToNewsletter}
            onCheckedChange={(checked) => updateField('subscribeToNewsletter', !!checked)}
          />
          <Label htmlFor="subscribe-newsletter" className="text-sm leading-relaxed">
            {t('subscribeToNewsletter')}
          </Label>
        </div>
      </div>

      {!formData.agreeToTerms && touchedFields.has('agreeToTerms') && (
        <p className="text-sm text-red-600 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          {t('mustAgreeToTerms')}
        </p>
      )}
    </div>
  )

  if (variant === 'wizard') {
    return (
      <Card className={cn("w-full max-w-2xl mx-auto", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            {t('createAccount')}
          </CardTitle>
          <CardDescription>
            {t('step')} {currentStep + 1} {t('of')} {steps.length}: {steps[currentStep].title}
          </CardDescription>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={((currentStep + 1) / steps.length) * 100} className="w-full" />
            <div className="flex justify-between text-xs text-muted-foreground">
              {steps.map((step, index) => (
                <span key={step.id} className={index <= currentStep ? 'text-primary' : ''}>
                  {step.title}
                </span>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === 0 && renderPersonalStep()}
            {currentStep === 1 && renderSecurityStep()}
            {currentStep === 2 && renderProfessionalStep()}
            {currentStep === 3 && renderPreferencesStep()}
            {currentStep === 4 && renderLegalStep()}

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                {t('previous')}
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!canProceedToNextStep()}
                >
                  {t('next')}
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading || !formData.agreeToTerms}
                  className="min-w-[120px]"
                >
                  {isLoading ? t('creatingAccount') : t('createAccount')}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("w-full max-w-md mx-auto", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          {t('createAccount')}
        </CardTitle>
        <CardDescription>
          {t('createAccountDescription')}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderPersonalStep()}
          {renderSecurityStep()}

          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="agree-terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => updateField('agreeToTerms', !!checked)}
                className={!formData.agreeToTerms && touchedFields.has('agreeToTerms') ? 'border-red-500' : ''}
              />
              <Label htmlFor="agree-terms" className="text-sm leading-relaxed">
                {t('agreeToTerms')} <a href="/terms" className="text-primary hover:underline">{t('termsOfService')}</a> *
              </Label>
            </div>

            {!formData.agreeToTerms && touchedFields.has('agreeToTerms') && (
              <p className="text-sm text-red-600">{t('mustAgreeToTerms')}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !formData.agreeToTerms}
          >
            {isLoading ? t('creatingAccount') : t('createAccount')}
          </Button>
        </form>

        {onLoginClick && (
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              {t('alreadyHaveAccount')}{' '}
              <button
                type="button"
                onClick={onLoginClick}
                className="text-primary hover:underline"
              >
                {t('signIn')}
              </button>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default RegisterForm