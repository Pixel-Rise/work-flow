import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Palette,
  Sun,
  Moon,
  Monitor,
  Type,
  Layout,
  Zap,
  Eye,
  Accessibility,
  Download,
  Upload,
  RotateCcw,
  Settings,
  Brush,
  Save,
  Share2,
  Copy,
  Check,
  X,
  Info,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'
import { useTheme, ThemeMode } from './theme-provider'
import { ColorSchemeSelector, ColorScheme } from './color-scheme-selector'

export interface ThemeSettingsProps {
  variant?: 'default' | 'compact' | 'panel' | 'modal'
  showPreview?: boolean
  allowExport?: boolean
  allowImport?: boolean
  colorSchemes?: ColorScheme[]
  className?: string
}

const FONT_FAMILIES = [
  { id: 'system', name: 'System Default', sample: 'Aa' },
  { id: 'sans', name: 'Inter (Sans)', sample: 'Aa' },
  { id: 'serif', name: 'Georgia (Serif)', sample: 'Aa' },
  { id: 'mono', name: 'JetBrains Mono', sample: 'Aa' }
]

const BORDER_RADIUS_OPTIONS = [
  { id: 'none', name: 'None', value: 0 },
  { id: 'sm', name: 'Small', value: 4 },
  { id: 'md', name: 'Medium', value: 8 },
  { id: 'lg', name: 'Large', value: 12 },
  { id: 'xl', name: 'Extra Large', value: 16 }
]

export function ThemeSettings({
  variant = 'default',
  showPreview = true,
  allowExport = true,
  allowImport = true,
  colorSchemes = [],
  className
}: ThemeSettingsProps) {
  const { t } = useTranslation()
  const {
    config,
    isDark,
    updateTheme,
    resetTheme,
    exportTheme,
    importTheme,
    applyColorScheme
  } = useTheme()

  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [importData, setImportData] = useState('')
  const [exportData, setExportData] = useState('')
  const [copied, setCopied] = useState(false)

  const handleExport = () => {
    const data = exportTheme()
    setExportData(data)
    setExportDialogOpen(true)
  }

  const handleImport = () => {
    if (importData.trim()) {
      const success = importTheme(importData)
      if (success) {
        setImportDialogOpen(false)
        setImportData('')
      }
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  const renderThemeModeSelector = () => (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{t('appearance')}</Label>
      <div className="grid grid-cols-3 gap-2">
        {[
          { id: 'light', icon: Sun, label: t('light') },
          { id: 'dark', icon: Moon, label: t('dark') },
          { id: 'system', icon: Monitor, label: t('system') }
        ].map(({ id, icon: Icon, label }) => (
          <Button
            key={id}
            variant={config.mode === id ? 'default' : 'outline'}
            size="sm"
            className="flex flex-col gap-1 h-auto p-3"
            onClick={() => updateTheme({ mode: id as ThemeMode })}
          >
            <Icon className="w-4 h-4" />
            <span className="text-xs">{label}</span>
          </Button>
        ))}
      </div>
    </div>
  )

  const renderFontSettings = () => (
    <div className="space-y-4">
      <div className="space-y-3">
        <Label className="text-sm font-medium">{t('fontFamily')}</Label>
        <Select
          value={config.fontFamily}
          onValueChange={(value) => updateTheme({ fontFamily: value as any })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_FAMILIES.map((font) => (
              <SelectItem key={font.id} value={font.id}>
                <div className="flex items-center justify-between w-full">
                  <span>{font.name}</span>
                  <span className="ml-2 text-lg">{font.sample}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">{t('fontSize')}</Label>
        <div className="grid grid-cols-5 gap-2">
          {(['xs', 'sm', 'base', 'lg', 'xl'] as const).map((size) => (
            <Button
              key={size}
              variant={config.fontSize === size ? 'default' : 'outline'}
              size="sm"
              className="h-auto p-2"
              onClick={() => updateTheme({ fontSize: size })}
            >
              <span className={cn(
                'font-medium',
                size === 'xs' && 'text-xs',
                size === 'sm' && 'text-sm',
                size === 'base' && 'text-base',
                size === 'lg' && 'text-lg',
                size === 'xl' && 'text-xl'
              )}>
                Aa
              </span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )

  const renderLayoutSettings = () => (
    <div className="space-y-4">
      <div className="space-y-3">
        <Label className="text-sm font-medium">{t('borderRadius')}</Label>
        <div className="grid grid-cols-5 gap-2">
          {BORDER_RADIUS_OPTIONS.map((radius) => (
            <Button
              key={radius.id}
              variant={config.borderRadius === radius.id ? 'default' : 'outline'}
              size="sm"
              className="h-auto p-3 flex flex-col gap-1"
              onClick={() => updateTheme({ borderRadius: radius.id as any })}
            >
              <div
                className="w-4 h-4 bg-current"
                style={{ borderRadius: `${radius.value}px` }}
              />
              <span className="text-xs">{radius.name}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">{t('compactMode')}</Label>
          <Switch
            checked={config.compact}
            onCheckedChange={(checked) => updateTheme({ compact: checked })}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {t('compactModeDescription')}
        </p>
      </div>
    </div>
  )

  const renderAccessibilitySettings = () => (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">{t('highContrast')}</Label>
          <Switch
            checked={config.highContrast}
            onCheckedChange={(checked) => updateTheme({ highContrast: checked })}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {t('highContrastDescription')}
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">{t('reduceMotion')}</Label>
          <Switch
            checked={config.reducedMotion}
            onCheckedChange={(checked) => updateTheme({ reducedMotion: checked })}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {t('reduceMotionDescription')}
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">{t('animations')}</Label>
          <Switch
            checked={config.animations}
            onCheckedChange={(checked) => updateTheme({ animations: checked })}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {t('animationsDescription')}
        </p>
      </div>
    </div>
  )

  const renderPreview = () => {
    if (!showPreview) return null

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">{t('preview')}</CardTitle>
          <CardDescription>
            {t('previewDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{t('sampleCard')}</h4>
                  <Badge>{t('preview')}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('sampleCardDescription')}
                </p>
                <div className="flex gap-2">
                  <Button size="sm">{t('primary')}</Button>
                  <Button size="sm" variant="outline">{t('secondary')}</Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Label>{t('sampleForm')}</Label>
              <input
                className="w-full px-3 py-2 border rounded-md text-sm"
                placeholder={t('sampleInput')}
                readOnly
              />
              <Button size="sm" className="w-full">{t('submit')}</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderActions = () => (
    <div className="flex items-center justify-between pt-4 border-t">
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={resetTheme}>
          <RotateCcw className="w-4 h-4 mr-2" />
          {t('reset')}
        </Button>
        {allowImport && (
          <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                {t('import')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('importTheme')}</DialogTitle>
                <DialogDescription>
                  {t('importThemeDescription')}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <textarea
                  className="w-full h-32 px-3 py-2 border rounded-md text-sm font-mono"
                  placeholder={t('pasteThemeData')}
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
                    {t('cancel')}
                  </Button>
                  <Button onClick={handleImport} disabled={!importData.trim()}>
                    {t('import')}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {allowExport && (
        <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Share2 className="w-4 h-4 mr-2" />
              {t('export')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('exportTheme')}</DialogTitle>
              <DialogDescription>
                {t('exportThemeDescription')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative">
                <textarea
                  className="w-full h-32 px-3 py-2 border rounded-md text-sm font-mono"
                  value={exportData}
                  readOnly
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(exportData)}
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
                  {t('close')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )

  if (variant === 'compact') {
    return (
      <Card className={cn("w-full max-w-sm", className)}>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="w-4 h-4" />
            {t('themeSettings')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderThemeModeSelector()}
          <Separator />
          <ColorSchemeSelector
            variant="compact"
            currentScheme={config.colorScheme}
            colorSchemes={colorSchemes}
            onSchemeChange={applyColorScheme}
          />
          {renderActions()}
        </CardContent>
      </Card>
    )
  }

  if (variant === 'modal') {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className={className}>
            <Settings className="w-4 h-4 mr-2" />
            {t('themeSettings')}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('themeSettings')}</DialogTitle>
            <DialogDescription>
              {t('customizeAppearance')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <Tabs defaultValue="colors">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="colors">{t('colors')}</TabsTrigger>
                <TabsTrigger value="typography">{t('typography')}</TabsTrigger>
                <TabsTrigger value="layout">{t('layout')}</TabsTrigger>
                <TabsTrigger value="accessibility">{t('accessibility')}</TabsTrigger>
                <TabsTrigger value="preview">{t('preview')}</TabsTrigger>
              </TabsList>

              <TabsContent value="colors" className="space-y-4">
                {renderThemeModeSelector()}
                <Separator />
                <ColorSchemeSelector
                  currentScheme={config.colorScheme}
                  colorSchemes={colorSchemes}
                  darkMode={isDark}
                  onSchemeChange={applyColorScheme}
                />
              </TabsContent>

              <TabsContent value="typography" className="space-y-4">
                {renderFontSettings()}
              </TabsContent>

              <TabsContent value="layout" className="space-y-4">
                {renderLayoutSettings()}
              </TabsContent>

              <TabsContent value="accessibility" className="space-y-4">
                {renderAccessibilitySettings()}
              </TabsContent>

              <TabsContent value="preview" className="space-y-4">
                {renderPreview()}
              </TabsContent>
            </Tabs>

            {renderActions()}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h2 className="text-2xl font-bold">{t('themeSettings')}</h2>
        <p className="text-muted-foreground">
          {t('customizeAppearance')}
        </p>
      </div>

      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="colors" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            {t('colors')}
          </TabsTrigger>
          <TabsTrigger value="typography" className="flex items-center gap-2">
            <Type className="w-4 h-4" />
            {t('typography')}
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center gap-2">
            <Layout className="w-4 h-4" />
            {t('layout')}
          </TabsTrigger>
          <TabsTrigger value="accessibility" className="flex items-center gap-2">
            <Accessibility className="w-4 h-4" />
            {t('accessibility')}
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="colors" className="space-y-6">
            {renderThemeModeSelector()}
            <Separator />
            <ColorSchemeSelector
              currentScheme={config.colorScheme}
              colorSchemes={colorSchemes}
              darkMode={isDark}
              showCategories={true}
              showPreview={true}
              allowCustom={true}
              allowExport={true}
              allowImport={true}
              onSchemeChange={applyColorScheme}
            />
          </TabsContent>

          <TabsContent value="typography" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('typography')}</CardTitle>
                <CardDescription>
                  {t('typographyDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderFontSettings()}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="layout" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('layout')}</CardTitle>
                <CardDescription>
                  {t('layoutDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderLayoutSettings()}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accessibility" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('accessibility')}</CardTitle>
                <CardDescription>
                  {t('accessibilityDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderAccessibilitySettings()}
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      {showPreview && renderPreview()}
      {renderActions()}
    </div>
  )
}

export default ThemeSettings