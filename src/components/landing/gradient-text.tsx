import React from 'react'
import { cn } from '@/lib/utils'

export interface GradientTextProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'rainbow' | 'sunset' | 'ocean' | 'forest' | 'purple' | 'fire' | 'custom'
  direction?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl'
  animated?: boolean
  animationType?: 'pulse' | 'wave' | 'shimmer' | 'glow'
  intensity?: 'subtle' | 'medium' | 'strong'
  size?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold'
  as?: 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p'
  customGradient?: string
  className?: string
}

const GRADIENT_VARIANTS = {
  primary: 'from-primary via-primary/80 to-primary/60',
  secondary: 'from-secondary via-secondary/80 to-secondary/60',
  rainbow: 'from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500',
  sunset: 'from-orange-400 via-red-500 to-pink-600',
  ocean: 'from-blue-400 via-teal-500 to-cyan-600',
  forest: 'from-green-400 via-emerald-500 to-teal-600',
  purple: 'from-purple-400 via-pink-500 to-indigo-600',
  fire: 'from-red-400 via-orange-500 to-yellow-600',
  custom: '' // Will be overridden by customGradient prop
}

const SIZE_CLASSES = {
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
  '6xl': 'text-6xl'
}

const WEIGHT_CLASSES = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold'
}

const ANIMATION_CLASSES = {
  pulse: 'animate-pulse',
  wave: 'animate-bounce',
  shimmer: 'animate-pulse',
  glow: 'animate-pulse'
}

export function GradientText({
  children,
  variant = 'primary',
  direction = 'to-r',
  animated = false,
  animationType = 'pulse',
  intensity = 'medium',
  size = 'base',
  weight = 'normal',
  as: Component = 'span',
  customGradient,
  className
}: GradientTextProps) {
  const gradientFrom = variant === 'custom' && customGradient
    ? customGradient
    : GRADIENT_VARIANTS[variant]

  const intensityMultiplier = {
    subtle: 0.6,
    medium: 0.8,
    strong: 1.0
  }

  const baseClasses = cn(
    'bg-gradient-to-r bg-clip-text text-transparent',
    `bg-gradient-${direction}`,
    SIZE_CLASSES[size],
    WEIGHT_CLASSES[weight],
    animated && ANIMATION_CLASSES[animationType],
    className
  )

  // Create enhanced gradients with special effects
  const enhancedGradient = React.useMemo(() => {
    if (variant === 'custom' && customGradient) {
      return customGradient
    }

    const baseGradient = GRADIENT_VARIANTS[variant]

    // Add intensity variations
    if (intensity === 'subtle') {
      return baseGradient.replace(/\/\d+/g, '/40').replace(/([^\/])\s/g, '$1/60 ')
    }

    if (intensity === 'strong') {
      return baseGradient.replace(/\/\d+/g, '/100')
    }

    return baseGradient
  }, [variant, customGradient, intensity])

  const style = React.useMemo(() => {
    const baseStyle: React.CSSProperties = {}

    if (animated) {
      if (animationType === 'shimmer') {
        baseStyle.backgroundSize = '200% 100%'
        baseStyle.animation = 'shimmer 2s ease-in-out infinite'
      } else if (animationType === 'wave') {
        baseStyle.animation = 'wave 2s ease-in-out infinite'
      } else if (animationType === 'glow') {
        baseStyle.filter = 'drop-shadow(0 0 8px currentColor)'
        baseStyle.animation = 'glow 2s ease-in-out infinite alternate'
      }
    }

    return baseStyle
  }, [animated, animationType])

  // Create inline styles for animations that aren't available in Tailwind
  const inlineStyles = `
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    @keyframes wave {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }

    @keyframes glow {
      0% { filter: drop-shadow(0 0 4px currentColor); }
      100% { filter: drop-shadow(0 0 12px currentColor); }
    }
  `

  return (
    <>
      {animated && (
        <style dangerouslySetInnerHTML={{ __html: inlineStyles }} />
      )}
      <Component
        className={cn(
          baseClasses,
          `bg-gradient-${direction}`,
          enhancedGradient
        )}
        style={{
          ...style,
          backgroundImage: `linear-gradient(${direction.replace('to-', 'to ')}, ${enhancedGradient.split(' ').map(color => {
            if (color.startsWith('from-') || color.startsWith('via-') || color.startsWith('to-')) {
              const colorValue = color.replace(/^(from-|via-|to-)/, '')
              return `var(--${colorValue.replace('/', '-').replace('[', '').replace(']', '')})`
            }
            return color
          }).join(', ')})`
        }}
      >
        {children}
      </Component>
    </>
  )
}

// Predefined gradient text components for common use cases
export function HeroGradientText({ children, ...props }: Omit<GradientTextProps, 'size' | 'weight'>) {
  return (
    <GradientText
      size="4xl"
      weight="bold"
      variant="primary"
      animated
      animationType="shimmer"
      {...props}
    >
      {children}
    </GradientText>
  )
}

export function SubtitleGradientText({ children, ...props }: Omit<GradientTextProps, 'size' | 'weight'>) {
  return (
    <GradientText
      size="xl"
      weight="semibold"
      variant="secondary"
      intensity="subtle"
      {...props}
    >
      {children}
    </GradientText>
  )
}

export function BadgeGradientText({ children, ...props }: Omit<GradientTextProps, 'size' | 'weight'>) {
  return (
    <GradientText
      size="sm"
      weight="medium"
      variant="rainbow"
      animated
      animationType="pulse"
      {...props}
    >
      {children}
    </GradientText>
  )
}

export function CTAGradientText({ children, ...props }: Omit<GradientTextProps, 'size' | 'weight'>) {
  return (
    <GradientText
      size="2xl"
      weight="bold"
      variant="fire"
      animated
      animationType="glow"
      intensity="strong"
      {...props}
    >
      {children}
    </GradientText>
  )
}

// Gradient text with multiple lines support
export interface MultiLineGradientTextProps extends Omit<GradientTextProps, 'children'> {
  lines: string[]
  lineClassName?: string
}

export function MultiLineGradientText({
  lines,
  lineClassName,
  as: Component = 'div',
  ...props
}: MultiLineGradientTextProps) {
  return (
    <Component className={props.className}>
      {lines.map((line, index) => (
        <GradientText
          key={index}
          as="div"
          className={lineClassName}
          {...props}
        >
          {line}
        </GradientText>
      ))}
    </Component>
  )
}

// Interactive gradient text that changes on hover
export interface InteractiveGradientTextProps extends GradientTextProps {
  hoverVariant?: GradientTextProps['variant']
  hoverIntensity?: GradientTextProps['intensity']
  hoverAnimation?: boolean
}

export function InteractiveGradientText({
  hoverVariant = 'fire',
  hoverIntensity = 'strong',
  hoverAnimation = true,
  className,
  ...props
}: InteractiveGradientTextProps) {
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="inline-block transition-all duration-300"
    >
      <GradientText
        variant={isHovered ? hoverVariant : props.variant}
        intensity={isHovered ? hoverIntensity : props.intensity}
        animated={isHovered ? hoverAnimation : props.animated}
        className={cn("transition-all duration-300", className)}
        {...props}
      />
    </div>
  )
}

// Typing animation gradient text
export interface TypingGradientTextProps extends Omit<GradientTextProps, 'children'> {
  text: string
  typingSpeed?: number
  pauseAfter?: number
  loop?: boolean
}

export function TypingGradientText({
  text,
  typingSpeed = 100,
  pauseAfter = 2000,
  loop = false,
  ...props
}: TypingGradientTextProps) {
  const [displayText, setDisplayText] = React.useState('')
  const [isTyping, setIsTyping] = React.useState(true)

  React.useEffect(() => {
    let index = 0
    let timeout: NodeJS.Timeout

    const typeText = () => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1))
        index++
        timeout = setTimeout(typeText, typingSpeed)
      } else {
        setIsTyping(false)
        if (loop) {
          timeout = setTimeout(() => {
            setDisplayText('')
            index = 0
            setIsTyping(true)
            typeText()
          }, pauseAfter)
        }
      }
    }

    typeText()

    return () => clearTimeout(timeout)
  }, [text, typingSpeed, pauseAfter, loop])

  return (
    <GradientText
      animated={isTyping}
      animationType="pulse"
      {...props}
    >
      {displayText}
      {isTyping && <span className="animate-pulse">|</span>}
    </GradientText>
  )
}

export default GradientText