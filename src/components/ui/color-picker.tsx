import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import {
  Palette,
  Pipette,
  Copy,
  Check,
  RotateCcw,
  Save,
  Trash2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'

export interface ColorPickerProps {
  value?: string
  defaultValue?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'swatch' | 'button'
  showPresets?: boolean
  showRecent?: boolean
  showAlpha?: boolean
  showInput?: boolean
  presetColors?: string[]
  onValueChange?: (color: string) => void
  onSaveColor?: (color: string) => void
  className?: string
}

const DEFAULT_PRESETS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#85929E', '#D5A6BD',
  '#F4D03F', '#AED6F1', '#A9DFBF', '#F9E79F', '#D2B4DE',
  '#000000', '#FFFFFF', '#6C757D', '#28A745', '#DC3545',
  '#FFC107', '#007BFF', '#6F42C1', '#E83E8C', '#FD7E14'
]

interface HSV {
  h: number
  s: number
  v: number
}

interface RGB {
  r: number
  g: number
  b: number
}

export function ColorPicker({
  value,
  defaultValue = '#3B82F6',
  disabled = false,
  size = 'md',
  variant = 'default',
  showPresets = true,
  showRecent = true,
  showAlpha = false,
  showInput = true,
  presetColors = DEFAULT_PRESETS,
  onValueChange,
  onSaveColor,
  className
}: ColorPickerProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [internalValue, setInternalValue] = useState(value ?? defaultValue)
  const [hsv, setHSV] = useState<HSV>({ h: 0, s: 0, v: 0 })
  const [alpha, setAlpha] = useState(1)
  const [recentColors, setRecentColors] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('color-picker-recent') || '[]')
    } catch {
      return []
    }
  })
  const [copiedColor, setCopiedColor] = useState('')

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hueCanvasRef = useRef<HTMLCanvasElement>(null)

  const currentValue = value !== undefined ? value : internalValue

  useEffect(() => {
    const color = hexToHsv(currentValue)
    setHSV(color)
    const alphaValue = currentValue.length === 9 ? parseInt(currentValue.slice(7), 16) / 255 : 1
    setAlpha(alphaValue)
  }, [currentValue])

  useEffect(() => {
    drawColorPicker()
    drawHueSlider()
  }, [hsv])

  const hexToHsv = (hex: string): HSV => {
    const rgb = hexToRgb(hex)
    return rgbToHsv(rgb)
  }

  const hexToRgb = (hex: string): RGB => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 }
  }

  const rgbToHsv = (rgb: RGB): HSV => {
    const { r, g, b } = rgb
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const diff = max - min

    let h = 0
    let s = max === 0 ? 0 : diff / max
    let v = max / 255

    if (diff !== 0) {
      switch (max) {
        case r: h = (g - b) / diff + (g < b ? 6 : 0); break
        case g: h = (b - r) / diff + 2; break
        case b: h = (r - g) / diff + 4; break
      }
      h /= 6
    }

    return { h: h * 360, s, v }
  }

  const hsvToRgb = (hsv: HSV): RGB => {
    const { h, s, v } = hsv
    const c = v * s
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
    const m = v - c

    let r = 0, g = 0, b = 0

    if (h >= 0 && h < 60) {
      r = c; g = x; b = 0
    } else if (h >= 60 && h < 120) {
      r = x; g = c; b = 0
    } else if (h >= 120 && h < 180) {
      r = 0; g = c; b = x
    } else if (h >= 180 && h < 240) {
      r = 0; g = x; b = c
    } else if (h >= 240 && h < 300) {
      r = x; g = 0; b = c
    } else if (h >= 300 && h < 360) {
      r = c; g = 0; b = x
    }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    }
  }

  const rgbToHex = (rgb: RGB, alpha?: number): string => {
    const toHex = (n: number) => {
      const hex = Math.round(n).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }

    let hex = `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`

    if (alpha !== undefined && alpha < 1) {
      hex += toHex(alpha * 255)
    }

    return hex
  }

  const drawColorPicker = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = canvas

    // Create saturation-value gradient
    const gradient1 = ctx.createLinearGradient(0, 0, width, 0)
    gradient1.addColorStop(0, '#FFFFFF')
    gradient1.addColorStop(1, `hsl(${hsv.h}, 100%, 50%)`)

    ctx.fillStyle = gradient1
    ctx.fillRect(0, 0, width, height)

    const gradient2 = ctx.createLinearGradient(0, 0, 0, height)
    gradient2.addColorStop(0, 'transparent')
    gradient2.addColorStop(1, '#000000')

    ctx.fillStyle = gradient2
    ctx.fillRect(0, 0, width, height)
  }

  const drawHueSlider = () => {
    const canvas = hueCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = canvas

    for (let i = 0; i < width; i++) {
      const hue = (i / width) * 360
      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`
      ctx.fillRect(i, 0, 1, height)
    }
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const saturation = x / canvas.width
    const value = 1 - (y / canvas.height)

    const newHsv = { ...hsv, s: saturation, v: value }
    setHSV(newHsv)

    const rgb = hsvToRgb(newHsv)
    const hexColor = rgbToHex(rgb, showAlpha ? alpha : undefined)
    handleValueChange(hexColor)
  }

  const handleHueClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = hueCanvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const hue = (x / canvas.width) * 360

    const newHsv = { ...hsv, h: hue }
    setHSV(newHsv)

    const rgb = hsvToRgb(newHsv)
    const hexColor = rgbToHex(rgb, showAlpha ? alpha : undefined)
    handleValueChange(hexColor)
  }

  const handleValueChange = (color: string) => {
    if (value === undefined) {
      setInternalValue(color)
    }
    onValueChange?.(color)
  }

  const handleInputChange = (inputValue: string) => {
    if (/^#[0-9A-F]{6}([0-9A-F]{2})?$/i.test(inputValue)) {
      handleValueChange(inputValue)
    }
  }

  const handlePresetClick = (color: string) => {
    handleValueChange(color)
    addToRecent(color)
  }

  const addToRecent = (color: string) => {
    const newRecent = [color, ...recentColors.filter(c => c !== color)].slice(0, 10)
    setRecentColors(newRecent)
    localStorage.setItem('color-picker-recent', JSON.stringify(newRecent))
  }

  const copyToClipboard = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color)
      setCopiedColor(color)
      setTimeout(() => setCopiedColor(''), 2000)
    } catch (err) {
      console.error('Failed to copy color:', err)
    }
  }

  const handleSave = () => {
    onSaveColor?.(currentValue)
    addToRecent(currentValue)
    setOpen(false)
  }

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  }

  const triggerButton = (
    <Button
      variant={variant === 'button' ? 'outline' : 'ghost'}
      disabled={disabled}
      className={cn(
        variant === 'swatch' ? 'p-1 border-2 border-border' : 'justify-start',
        sizeClasses[size],
        className
      )}
    >
      {variant === 'swatch' ? (
        <div
          className="w-full h-full rounded"
          style={{ backgroundColor: currentValue }}
        />
      ) : (
        <>
          <div
            className="w-4 h-4 rounded border mr-2"
            style={{ backgroundColor: currentValue }}
          />
          {variant === 'button' && currentValue}
        </>
      )}
    </Button>
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {triggerButton}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="p-4 space-y-4">
          {/* Color Picker Canvas */}
          <div className="space-y-2">
            <canvas
              ref={canvasRef}
              width={272}
              height={160}
              className="w-full h-40 border rounded cursor-crosshair"
              onClick={handleCanvasClick}
            />

            {/* Hue Slider */}
            <canvas
              ref={hueCanvasRef}
              width={272}
              height={16}
              className="w-full h-4 border rounded cursor-pointer"
              onClick={handleHueClick}
            />

            {/* Alpha Slider */}
            {showAlpha && (
              <div className="space-y-1">
                <Label className="text-sm">{t('opacity')}</Label>
                <Slider
                  value={[alpha * 100]}
                  onValueChange={(values) => {
                    const newAlpha = values[0] / 100
                    setAlpha(newAlpha)
                    const rgb = hsvToRgb(hsv)
                    const hexColor = rgbToHex(rgb, newAlpha)
                    handleValueChange(hexColor)
                  }}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            )}
          </div>

          <Tabs defaultValue="presets" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="presets">{t('presets')}</TabsTrigger>
              <TabsTrigger value="custom">{t('custom')}</TabsTrigger>
            </TabsList>

            <TabsContent value="presets" className="space-y-3">
              {showPresets && (
                <div>
                  <Label className="text-sm text-muted-foreground">{t('colors')}</Label>
                  <div className="grid grid-cols-10 gap-1 mt-2">
                    {presetColors.map((color, index) => (
                      <button
                        key={index}
                        className={cn(
                          "w-6 h-6 rounded border-2 hover:scale-110 transition-transform",
                          currentValue === color ? "border-primary" : "border-border"
                        )}
                        style={{ backgroundColor: color }}
                        onClick={() => handlePresetClick(color)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {showRecent && recentColors.length > 0 && (
                <div>
                  <Label className="text-sm text-muted-foreground">{t('recent')}</Label>
                  <div className="flex gap-1 mt-2">
                    {recentColors.map((color, index) => (
                      <button
                        key={index}
                        className={cn(
                          "w-6 h-6 rounded border-2 hover:scale-110 transition-transform",
                          currentValue === color ? "border-primary" : "border-border"
                        )}
                        style={{ backgroundColor: color }}
                        onClick={() => handlePresetClick(color)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="custom" className="space-y-3">
              {showInput && (
                <div className="space-y-2">
                  <Label className="text-sm">{t('hexValue')}</Label>
                  <div className="flex gap-2">
                    <Input
                      value={currentValue}
                      onChange={(e) => handleInputChange(e.target.value)}
                      placeholder="#000000"
                      className="font-mono"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(currentValue)}
                    >
                      {copiedColor === currentValue ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* RGB Values */}
              <div className="grid grid-cols-3 gap-2">
                {['R', 'G', 'B'].map((channel, index) => {
                  const rgb = hsvToRgb(hsv)
                  const value = [rgb.r, rgb.g, rgb.b][index]
                  return (
                    <div key={channel} className="space-y-1">
                      <Label className="text-xs">{channel}</Label>
                      <Input
                        type="number"
                        min={0}
                        max={255}
                        value={Math.round(value)}
                        onChange={(e) => {
                          const newValue = parseInt(e.target.value) || 0
                          const newRgb = { ...rgb }
                          if (index === 0) newRgb.r = newValue
                          else if (index === 1) newRgb.g = newValue
                          else newRgb.b = newValue

                          const newHsv = rgbToHsv(newRgb)
                          setHSV(newHsv)
                          handleValueChange(rgbToHex(newRgb, showAlpha ? alpha : undefined))
                        }}
                        className="text-xs"
                      />
                    </div>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex justify-between pt-2 border-t">
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleValueChange(defaultValue)}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              {recentColors.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setRecentColors([])
                    localStorage.removeItem('color-picker-recent')
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              {onSaveColor && (
                <Button variant="outline" size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-1" />
                  {t('save')}
                </Button>
              )}
              <Button size="sm" onClick={() => setOpen(false)}>
                {t('done')}
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default ColorPicker