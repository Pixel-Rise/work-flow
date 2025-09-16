import React, { createContext, useContext, useEffect, useState } from 'react'
import { ColorScheme } from './color-scheme-selector'

export type ThemeMode = 'light' | 'dark' | 'system'

export interface ThemeConfig {
  mode: ThemeMode
  colorScheme: ColorScheme
  fontSize: 'xs' | 'sm' | 'base' | 'lg' | 'xl'
  fontFamily: 'system' | 'sans' | 'serif' | 'mono'
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  animations: boolean
  reducedMotion: boolean
  highContrast: boolean
  compact: boolean
}

export interface ThemeContextType {
  config: ThemeConfig
  isDark: boolean
  updateTheme: (updates: Partial<ThemeConfig>) => void
  resetTheme: () => void
  exportTheme: () => string
  importTheme: (themeData: string) => boolean
  applyColorScheme: (scheme: ColorScheme) => void
}

const DEFAULT_THEME_CONFIG: ThemeConfig = {
  mode: 'system',
  colorScheme: {
    id: 'default',
    name: 'Default',
    type: 'preset',
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
  fontSize: 'base',
  fontFamily: 'system',
  borderRadius: 'md',
  animations: true,
  reducedMotion: false,
  highContrast: false,
  compact: false
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Partial<ThemeConfig>
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = {},
  storageKey = 'workflow-theme'
}: ThemeProviderProps) {
  const [config, setConfig] = useState<ThemeConfig>(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        return { ...DEFAULT_THEME_CONFIG, ...JSON.parse(stored), ...defaultTheme }
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error)
    }
    return { ...DEFAULT_THEME_CONFIG, ...defaultTheme }
  })

  const [isDark, setIsDark] = useState(false)

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const updateSystemTheme = () => {
      if (config.mode === 'system') {
        setIsDark(mediaQuery.matches)
      }
    }

    updateSystemTheme()
    mediaQuery.addEventListener('change', updateSystemTheme)
    return () => mediaQuery.removeEventListener('change', updateSystemTheme)
  }, [config.mode])

  // Update isDark when mode changes
  useEffect(() => {
    if (config.mode === 'light') {
      setIsDark(false)
    } else if (config.mode === 'dark') {
      setIsDark(true)
    }
    // For 'system', isDark is handled by the media query listener
  }, [config.mode])

  // Apply theme to CSS custom properties
  useEffect(() => {
    const root = document.documentElement
    const colors = isDark && config.colorScheme.darkColors
      ? config.colorScheme.darkColors
      : config.colorScheme.colors

    // Apply color variables
    Object.entries(colors).forEach(([key, value]) => {
      const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
      root.style.setProperty(cssVar, value)
    })

    // Apply font size
    const fontSizeMap = {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px'
    }
    root.style.setProperty('--base-font-size', fontSizeMap[config.fontSize])

    // Apply font family
    const fontFamilyMap = {
      system: 'system-ui, -apple-system, sans-serif',
      sans: 'Inter, system-ui, sans-serif',
      serif: 'Georgia, serif',
      mono: 'JetBrains Mono, Consolas, monospace'
    }
    root.style.setProperty('--font-family', fontFamilyMap[config.fontFamily])

    // Apply border radius
    const borderRadiusMap = {
      none: '0px',
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px'
    }
    root.style.setProperty('--border-radius', borderRadiusMap[config.borderRadius])

    // Apply theme class to document
    root.className = [
      isDark ? 'dark' : 'light',
      config.animations ? 'animations-enabled' : 'animations-disabled',
      config.reducedMotion ? 'reduce-motion' : '',
      config.highContrast ? 'high-contrast' : '',
      config.compact ? 'compact' : '',
      `font-${config.fontSize}`,
      `radius-${config.borderRadius}`
    ].filter(Boolean).join(' ')

  }, [config, isDark])

  // Save theme to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(config))
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error)
    }
  }, [config, storageKey])

  const updateTheme = (updates: Partial<ThemeConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }))
  }

  const resetTheme = () => {
    setConfig(DEFAULT_THEME_CONFIG)
    localStorage.removeItem(storageKey)
  }

  const exportTheme = () => {
    return JSON.stringify(config, null, 2)
  }

  const importTheme = (themeData: string): boolean => {
    try {
      const parsedTheme = JSON.parse(themeData)
      // Validate the theme structure
      if (parsedTheme && typeof parsedTheme === 'object') {
        setConfig({ ...DEFAULT_THEME_CONFIG, ...parsedTheme })
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to import theme:', error)
      return false
    }
  }

  const applyColorScheme = (scheme: ColorScheme) => {
    setConfig(prev => ({ ...prev, colorScheme: scheme }))
  }

  const value: ThemeContextType = {
    config,
    isDark,
    updateTheme,
    resetTheme,
    exportTheme,
    importTheme,
    applyColorScheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// Theme-aware component wrapper
interface ThemedProps {
  children: React.ReactNode
  className?: string
}

export function Themed({ children, className }: ThemedProps) {
  const { config } = useTheme()

  return (
    <div
      className={className}
      style={{
        fontSize: config.fontSize === 'base' ? undefined : `var(--base-font-size)`,
        fontFamily: config.fontFamily === 'system' ? undefined : `var(--font-family)`
      }}
    >
      {children}
    </div>
  )
}

// Hook for theme-aware styling
export function useThemeStyles() {
  const { config, isDark } = useTheme()

  return {
    isDark,
    colors: isDark && config.colorScheme.darkColors
      ? config.colorScheme.darkColors
      : config.colorScheme.colors,
    fontSize: config.fontSize,
    fontFamily: config.fontFamily,
    borderRadius: config.borderRadius,
    animations: config.animations,
    reducedMotion: config.reducedMotion,
    highContrast: config.highContrast,
    compact: config.compact
  }
}

// Higher-order component for theme-aware components
export function withTheme<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function ThemedComponent(props: P) {
    const themeProps = useThemeStyles()
    return <WrappedComponent {...props} {...themeProps} />
  }
}

export default ThemeProvider