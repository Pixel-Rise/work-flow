import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
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
  Check,
  RotateCcw,
  Download,
  Upload,
  Sun,
  Moon,
  Monitor,
  Eye,
  Sparkles,
  Brush,
  Settings,
  Copy,
  Share2,
  Save,
  RefreshCw
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'

export interface ColorScheme {
  id: string
  name: string
  description?: string
  type: 'preset' | 'custom' | 'generated'
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
    muted: string
    mutedForeground: string
    border: string
    ring: string
    destructive: string
    warning: string
    success: string
    info: string
  }
  darkColors?: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
    muted: string
    mutedForeground: string
    border: string
    ring: string
    destructive: string
    warning: string
    success: string
    info: string
  }
  category?: 'business' | 'creative' | 'minimal' | 'bold' | 'nature' | 'tech'
  tags?: string[]
  featured?: boolean
  premium?: boolean
}

export interface ColorSchemeSelectorProps {
  variant?: 'default' | 'compact' | 'grid' | 'list' | 'preview'
  currentScheme?: ColorScheme
  colorSchemes: ColorScheme[]
  darkMode?: boolean
  showCategories?: boolean
  showPreview?: boolean
  allowCustom?: boolean
  allowExport?: boolean
  allowImport?: boolean
  onSchemeChange?: (scheme: ColorScheme) => void
  onCustomScheme?: (scheme: ColorScheme) => void
  onExport?: (scheme: ColorScheme) => void
  onImport?: (scheme: ColorScheme) => void
  className?: string
}

const DEFAULT_SCHEMES: ColorScheme[] = [
  {
    id: 'default',
    name: 'Default',
    type: 'preset',
    category: 'minimal',
    colors: {
      primary: '#0F172A',
      secondary: '#F1F5F9',
      accent: '#3B82F6',
      background: '#FFFFFF',
      foreground: '#0F172A',
      muted: '#F1F5F9',
      mutedForeground: '#64748B',
      border: '#E2E8F0',
      ring: '#3B82F6',
      destructive: '#EF4444',
      warning: '#F59E0B',
      success: '#10B981',
      info: '#3B82F6'
    },
    darkColors: {
      primary: '#F8FAFC',
      secondary: '#1E293B',
      accent: '#3B82F6',
      background: '#0F172A',
      foreground: '#F8FAFC',
      muted: '#1E293B',
      mutedForeground: '#94A3B8',
      border: '#334155',
      ring: '#3B82F6',
      destructive: '#EF4444',
      warning: '#F59E0B',
      success: '#10B981',
      info: '#3B82F6'
    }
  },
  {
    id: 'ocean',
    name: 'Ocean Blue',
    type: 'preset',
    category: 'nature',
    colors: {
      primary: '#0369A1',
      secondary: '#E0F2FE',
      accent: '#0EA5E9',
      background: '#FFFFFF',
      foreground: '#0C4A6E',
      muted: '#F0F9FF',
      mutedForeground: '#0369A1',
      border: '#BAE6FD',
      ring: '#0EA5E9',
      destructive: '#DC2626',
      warning: '#D97706',
      success: '#059669',
      info: '#0284C7'
    }
  },
  {
    id: 'forest',
    name: 'Forest Green',
    type: 'preset',
    category: 'nature',
    colors: {
      primary: '#166534',
      secondary: '#DCFCE7',
      accent: '#22C55E',
      background: '#FFFFFF',
      foreground: '#14532D',
      muted: '#F0FDF4',
      mutedForeground: '#166534',
      border: '#BBF7D0',
      ring: '#22C55E',
      destructive: '#DC2626',
      warning: '#D97706',
      success: '#16A34A',
      info: '#0284C7'
    }
  },
  {
    id: 'sunset',
    name: 'Sunset Orange',
    type: 'preset',
    category: 'bold',
    colors: {
      primary: '#EA580C',
      secondary: '#FED7AA',
      accent: '#FB923C',
      background: '#FFFFFF',
      foreground: '#9A3412',
      muted: '#FFF7ED',
      mutedForeground: '#EA580C',
      border: '#FDBA74',
      ring: '#FB923C',
      destructive: '#DC2626',
      warning: '#D97706',
      success: '#059669',
      info: '#0284C7'
    }
  }
]

export function ColorSchemeSelector({
  variant = 'default',
  currentScheme,
  colorSchemes = DEFAULT_SCHEMES,
  darkMode = false,
  showCategories = true,
  showPreview = true,
  allowCustom = true,
  allowExport = true,
  allowImport = true,
  onSchemeChange,
  onCustomScheme,
  onExport,
  onImport,
  className
}: ColorSchemeSelectorProps) {
  const { t } = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [previewScheme, setPreviewScheme] = useState<ColorScheme | null>(null)
  const [customDialogOpen, setCustomDialogOpen] = useState(false)

  const categories = Array.from(new Set(colorSchemes.map(s => s.category).filter(Boolean)))
  const filteredSchemes = selectedCategory === 'all'
    ? colorSchemes
    : colorSchemes.filter(s => s.category === selectedCategory)

  const renderColorPreview = (scheme: ColorScheme, size: 'sm' | 'md' | 'lg' = 'md') => {
    const colors = darkMode && scheme.darkColors ? scheme.darkColors : scheme.colors
    const swatchSize = size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-6 h-6'

    return (
      <div className="flex gap-1">
        <div className={cn(swatchSize, "rounded-full border")} style={{ backgroundColor: colors.primary }} />
        <div className={cn(swatchSize, "rounded-full border")} style={{ backgroundColor: colors.accent }} />
        <div className={cn(swatchSize, "rounded-full border")} style={{ backgroundColor: colors.success }} />
        <div className={cn(swatchSize, "rounded-full border")} style={{ backgroundColor: colors.warning }} />
      </div>
    )
  }

  const renderSchemeCard = (scheme: ColorScheme) => {
    const isSelected = currentScheme?.id === scheme.id
    const colors = darkMode && scheme.darkColors ? scheme.darkColors : scheme.colors

    return (
      <Card
        key={scheme.id}
        className={cn(
          "group cursor-pointer transition-all duration-200 hover:shadow-md",
          isSelected && "ring-2 ring-primary",
          scheme.premium && "relative overflow-hidden"
        )}
        onClick={() => onSchemeChange?.(scheme)}
      >
        {scheme.premium && (
          <div className="absolute top-2 right-2 z-10">
            <Badge variant="secondary" className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
              <Sparkles className="w-3 h-3 mr-1" />
              Pro
            </Badge>
          </div>
        )}

        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Color Preview */}
            <div
              className="h-16 rounded-lg border-2 border-border relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 50%, ${colors.success} 100%)`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              {isSelected && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 rounded-full p-1">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">{scheme.name}</h4>
                {scheme.featured && (
                  <Badge variant="outline" className="text-xs">
                    {t('featured')}
                  </Badge>
                )}
              </div>

              {scheme.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {scheme.description}
                </p>
              )}

              <div className="flex items-center justify-between">
                {renderColorPreview(scheme, 'sm')}
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      setPreviewScheme(scheme)
                    }}
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                  {allowExport && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        onExport?.(scheme)
                      }}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>

              {scheme.tags && (
                <div className="flex flex-wrap gap-1">
                  {scheme.tags.slice(0, 2).map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs px-1 py-0">
                      {tag}
                    </Badge>
                  ))}
                  {scheme.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      +{scheme.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderPreviewDialog = () => {
    if (!previewScheme) return null

    const colors = darkMode && previewScheme.darkColors ? previewScheme.darkColors : previewScheme.colors

    return (
      <Dialog open={!!previewScheme} onOpenChange={() => setPreviewScheme(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{previewScheme.name} Preview</DialogTitle>
            <DialogDescription>
              Preview how this color scheme looks across different components
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Color Swatches */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {Object.entries(colors).map(([name, color]) => (
                <div key={name} className="text-center space-y-2">
                  <div
                    className="w-full h-12 rounded-lg border-2 border-border"
                    style={{ backgroundColor: color }}
                  />
                  <div className="space-y-1">
                    <p className="text-xs font-medium capitalize">{name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{color}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Component Preview */}
            <div
              className="p-6 rounded-lg border-2"
              style={{
                backgroundColor: colors.background,
                color: colors.foreground,
                borderColor: colors.border
              }}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Component Preview</h3>
                  <Button size="sm" style={{ backgroundColor: colors.primary, color: colors.background }}>
                    Primary Button
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card style={{ backgroundColor: colors.muted, borderColor: colors.border }}>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Card Example</h4>
                      <p style={{ color: colors.mutedForeground }}>
                        This is how cards would look with this color scheme.
                      </p>
                    </CardContent>
                  </Card>

                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      style={{ borderColor: colors.border, color: colors.foreground }}
                    >
                      Secondary Button
                    </Button>
                    <Button
                      size="sm"
                      className="w-full"
                      style={{ backgroundColor: colors.accent, color: colors.background }}
                    >
                      Accent Button
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setPreviewScheme(null)}>
                {t('close')}
              </Button>
              <Button onClick={() => {
                onSchemeChange?.(previewScheme)
                setPreviewScheme(null)
              }}>
                {t('applyScheme')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">{t('colorScheme')}</Label>
          <Badge variant="outline" className="text-xs">
            {currentScheme?.name || t('default')}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          {colorSchemes.slice(0, 6).map((scheme) => (
            <Button
              key={scheme.id}
              variant={currentScheme?.id === scheme.id ? "default" : "outline"}
              size="sm"
              className="h-8 px-2"
              onClick={() => onSchemeChange?.(scheme)}
            >
              {renderColorPreview(scheme, 'sm')}
              <span className="ml-2 text-xs">{scheme.name}</span>
            </Button>
          ))}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 px-2">
                <Settings className="w-3 h-3 mr-1" />
                {t('more')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('selectColorScheme')}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3">
                {colorSchemes.map((scheme) => renderSchemeCard(scheme))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{t('colorSchemes')}</h3>
          <p className="text-sm text-muted-foreground">
            {t('chooseColorSchemeDescription')}
          </p>
        </div>

        <div className="flex gap-2">
          {allowCustom && (
            <Button variant="outline" size="sm" onClick={() => setCustomDialogOpen(true)}>
              <Brush className="w-4 h-4 mr-2" />
              {t('custom')}
            </Button>
          )}
          {allowImport && (
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              {t('import')}
            </Button>
          )}
        </div>
      </div>

      {/* Categories */}
      {showCategories && categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            {t('all')}
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {t(category)}
            </Button>
          ))}
        </div>
      )}

      {/* Schemes Grid */}
      <div className={cn(
        "grid gap-4",
        variant === 'grid' ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-2 md:grid-cols-4"
      )}>
        {filteredSchemes.map((scheme) => renderSchemeCard(scheme))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            {t('reset')}
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('randomize')}
          </Button>
        </div>

        {currentScheme && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {t('current')}: {currentScheme.name}
            </span>
            {allowExport && (
              <Button variant="outline" size="sm" onClick={() => onExport?.(currentScheme)}>
                <Share2 className="w-4 h-4 mr-2" />
                {t('export')}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Preview Dialog */}
      {renderPreviewDialog()}
    </div>
  )
}

export default ColorSchemeSelector