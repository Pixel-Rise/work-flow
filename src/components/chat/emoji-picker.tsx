import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Smile, Search, Clock, Heart, Activity, Coffee, Car, Flag, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'

export interface Emoji {
  emoji: string
  name: string
  category: string
  keywords: string[]
  codepoint: string
}

export interface EmojiCategory {
  id: string
  name: string
  icon: React.ComponentType<any>
  emojis: Emoji[]
}

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
  recentEmojis?: string[]
  onRecentEmojisChange?: (emojis: string[]) => void
  variant?: 'default' | 'compact' | 'minimal'
  maxRecentEmojis?: number
  showSearch?: boolean
  showCategories?: boolean
  showSkinTones?: boolean
  className?: string
  trigger?: React.ReactNode
}

// Sample emoji data - in real app, this would come from a comprehensive emoji database
const emojiCategories: EmojiCategory[] = [
  {
    id: 'recent',
    name: 'recent',
    icon: Clock,
    emojis: []
  },
  {
    id: 'smileys',
    name: 'smileysAndPeople',
    icon: Smile,
    emojis: [
      { emoji: '😀', name: 'grinning face', category: 'smileys', keywords: ['happy', 'smile'], codepoint: '1F600' },
      { emoji: '😃', name: 'grinning face with big eyes', category: 'smileys', keywords: ['happy', 'joy'], codepoint: '1F603' },
      { emoji: '😄', name: 'grinning face with smiling eyes', category: 'smileys', keywords: ['happy', 'joy'], codepoint: '1F604' },
      { emoji: '😁', name: 'beaming face with smiling eyes', category: 'smileys', keywords: ['happy', 'smile'], codepoint: '1F601' },
      { emoji: '😆', name: 'grinning squinting face', category: 'smileys', keywords: ['happy', 'laugh'], codepoint: '1F606' },
      { emoji: '😅', name: 'grinning face with sweat', category: 'smileys', keywords: ['happy', 'sweat'], codepoint: '1F605' },
      { emoji: '🤣', name: 'rolling on the floor laughing', category: 'smileys', keywords: ['laugh', 'rofl'], codepoint: '1F923' },
      { emoji: '😂', name: 'face with tears of joy', category: 'smileys', keywords: ['laugh', 'joy'], codepoint: '1F602' },
      { emoji: '🙂', name: 'slightly smiling face', category: 'smileys', keywords: ['smile'], codepoint: '1F642' },
      { emoji: '🙃', name: 'upside-down face', category: 'smileys', keywords: ['silly'], codepoint: '1F643' },
      { emoji: '😉', name: 'winking face', category: 'smileys', keywords: ['wink'], codepoint: '1F609' },
      { emoji: '😊', name: 'smiling face with smiling eyes', category: 'smileys', keywords: ['happy'], codepoint: '1F60A' },
      { emoji: '😇', name: 'smiling face with halo', category: 'smileys', keywords: ['angel'], codepoint: '1F607' },
      { emoji: '🥰', name: 'smiling face with hearts', category: 'smileys', keywords: ['love'], codepoint: '1F970' },
      { emoji: '😍', name: 'smiling face with heart-eyes', category: 'smileys', keywords: ['love'], codepoint: '1F60D' },
      { emoji: '🤩', name: 'star-struck', category: 'smileys', keywords: ['star', 'eyes'], codepoint: '1F929' },
      { emoji: '😘', name: 'face blowing a kiss', category: 'smileys', keywords: ['kiss'], codepoint: '1F618' },
      { emoji: '😗', name: 'kissing face', category: 'smileys', keywords: ['kiss'], codepoint: '1F617' },
      { emoji: '😚', name: 'kissing face with closed eyes', category: 'smileys', keywords: ['kiss'], codepoint: '1F61A' },
      { emoji: '😙', name: 'kissing face with smiling eyes', category: 'smileys', keywords: ['kiss'], codepoint: '1F619' },
      { emoji: '🥲', name: 'smiling face with tear', category: 'smileys', keywords: ['emotional'], codepoint: '1F972' },
      { emoji: '😋', name: 'face savoring food', category: 'smileys', keywords: ['delicious'], codepoint: '1F60B' },
      { emoji: '😛', name: 'face with tongue', category: 'smileys', keywords: ['tongue'], codepoint: '1F61B' },
      { emoji: '😜', name: 'winking face with tongue', category: 'smileys', keywords: ['wink', 'tongue'], codepoint: '1F61C' },
      { emoji: '🤪', name: 'zany face', category: 'smileys', keywords: ['crazy'], codepoint: '1F92A' },
      { emoji: '😝', name: 'squinting face with tongue', category: 'smileys', keywords: ['tongue'], codepoint: '1F61D' },
      { emoji: '🤑', name: 'money-mouth face', category: 'smileys', keywords: ['money'], codepoint: '1F911' },
      { emoji: '🤗', name: 'hugging face', category: 'smileys', keywords: ['hug'], codepoint: '1F917' },
      { emoji: '🤭', name: 'face with hand over mouth', category: 'smileys', keywords: ['secret'], codepoint: '1F92D' },
      { emoji: '🤫', name: 'shushing face', category: 'smileys', keywords: ['quiet'], codepoint: '1F92B' },
      { emoji: '🤔', name: 'thinking face', category: 'smileys', keywords: ['think'], codepoint: '1F914' },
      { emoji: '🤐', name: 'zipper-mouth face', category: 'smileys', keywords: ['quiet'], codepoint: '1F910' }
    ]
  },
  {
    id: 'activities',
    name: 'activities',
    icon: Activity,
    emojis: [
      { emoji: '⚽', name: 'soccer ball', category: 'activities', keywords: ['sport', 'football'], codepoint: '26BD' },
      { emoji: '🏀', name: 'basketball', category: 'activities', keywords: ['sport'], codepoint: '1F3C0' },
      { emoji: '🏈', name: 'american football', category: 'activities', keywords: ['sport'], codepoint: '1F3C8' },
      { emoji: '⚾', name: 'baseball', category: 'activities', keywords: ['sport'], codepoint: '26BE' },
      { emoji: '🥎', name: 'softball', category: 'activities', keywords: ['sport'], codepoint: '1F94E' },
      { emoji: '🎾', name: 'tennis', category: 'activities', keywords: ['sport'], codepoint: '1F3BE' },
      { emoji: '🏐', name: 'volleyball', category: 'activities', keywords: ['sport'], codepoint: '1F3D0' },
      { emoji: '🏉', name: 'rugby football', category: 'activities', keywords: ['sport'], codepoint: '1F3C9' },
      { emoji: '🥏', name: 'frisbee', category: 'activities', keywords: ['sport'], codepoint: '1F94F' },
      { emoji: '🎱', name: 'pool 8 ball', category: 'activities', keywords: ['game'], codepoint: '1F3B1' },
      { emoji: '🪀', name: 'yo-yo', category: 'activities', keywords: ['toy'], codepoint: '1FA80' },
      { emoji: '🏓', name: 'ping pong', category: 'activities', keywords: ['sport'], codepoint: '1F3D3' },
      { emoji: '🏸', name: 'badminton', category: 'activities', keywords: ['sport'], codepoint: '1F3F8' },
      { emoji: '🥅', name: 'goal net', category: 'activities', keywords: ['sport'], codepoint: '1F945' },
      { emoji: '⛳', name: 'flag in hole', category: 'activities', keywords: ['golf'], codepoint: '26F3' },
      { emoji: '🪁', name: 'kite', category: 'activities', keywords: ['fly'], codepoint: '1FA81' }
    ]
  },
  {
    id: 'food',
    name: 'foodAndDrink',
    icon: Coffee,
    emojis: [
      { emoji: '🍎', name: 'red apple', category: 'food', keywords: ['fruit'], codepoint: '1F34E' },
      { emoji: '🍊', name: 'tangerine', category: 'food', keywords: ['fruit'], codepoint: '1F34A' },
      { emoji: '🍋', name: 'lemon', category: 'food', keywords: ['fruit'], codepoint: '1F34B' },
      { emoji: '🍌', name: 'banana', category: 'food', keywords: ['fruit'], codepoint: '1F34C' },
      { emoji: '🍉', name: 'watermelon', category: 'food', keywords: ['fruit'], codepoint: '1F349' },
      { emoji: '🍇', name: 'grapes', category: 'food', keywords: ['fruit'], codepoint: '1F347' },
      { emoji: '🍓', name: 'strawberry', category: 'food', keywords: ['fruit'], codepoint: '1F353' },
      { emoji: '🫐', name: 'blueberries', category: 'food', keywords: ['fruit'], codepoint: '1FAD0' },
      { emoji: '🍈', name: 'melon', category: 'food', keywords: ['fruit'], codepoint: '1F348' },
      { emoji: '🍒', name: 'cherries', category: 'food', keywords: ['fruit'], codepoint: '1F352' },
      { emoji: '🍑', name: 'peach', category: 'food', keywords: ['fruit'], codepoint: '1F351' },
      { emoji: '🥭', name: 'mango', category: 'food', keywords: ['fruit'], codepoint: '1F96D' },
      { emoji: '🍍', name: 'pineapple', category: 'food', keywords: ['fruit'], codepoint: '1F34D' },
      { emoji: '🥥', name: 'coconut', category: 'food', keywords: ['fruit'], codepoint: '1F965' },
      { emoji: '🥝', name: 'kiwi fruit', category: 'food', keywords: ['fruit'], codepoint: '1F95D' },
      { emoji: '🍅', name: 'tomato', category: 'food', keywords: ['vegetable'], codepoint: '1F345' }
    ]
  },
  {
    id: 'travel',
    name: 'travelAndPlaces',
    icon: Car,
    emojis: [
      { emoji: '🚗', name: 'automobile', category: 'travel', keywords: ['car'], codepoint: '1F697' },
      { emoji: '🚕', name: 'taxi', category: 'travel', keywords: ['car'], codepoint: '1F695' },
      { emoji: '🚙', name: 'sport utility vehicle', category: 'travel', keywords: ['car'], codepoint: '1F699' },
      { emoji: '🚌', name: 'bus', category: 'travel', keywords: ['vehicle'], codepoint: '1F68C' },
      { emoji: '🚎', name: 'trolleybus', category: 'travel', keywords: ['vehicle'], codepoint: '1F68E' },
      { emoji: '🏎️', name: 'racing car', category: 'travel', keywords: ['car', 'sport'], codepoint: '1F3CE' },
      { emoji: '🚓', name: 'police car', category: 'travel', keywords: ['car'], codepoint: '1F693' },
      { emoji: '🚑', name: 'ambulance', category: 'travel', keywords: ['vehicle'], codepoint: '1F691' },
      { emoji: '🚒', name: 'fire engine', category: 'travel', keywords: ['vehicle'], codepoint: '1F692' },
      { emoji: '🚐', name: 'minibus', category: 'travel', keywords: ['vehicle'], codepoint: '1F690' },
      { emoji: '🛻', name: 'pickup truck', category: 'travel', keywords: ['vehicle'], codepoint: '1F6FB' },
      { emoji: '🚚', name: 'delivery truck', category: 'travel', keywords: ['vehicle'], codepoint: '1F69A' },
      { emoji: '🚛', name: 'articulated lorry', category: 'travel', keywords: ['vehicle'], codepoint: '1F69B' },
      { emoji: '🚜', name: 'tractor', category: 'travel', keywords: ['vehicle'], codepoint: '1F69C' },
      { emoji: '🏍️', name: 'motorcycle', category: 'travel', keywords: ['vehicle'], codepoint: '1F3CD' },
      { emoji: '🛵', name: 'motor scooter', category: 'travel', keywords: ['vehicle'], codepoint: '1F6F5' }
    ]
  },
  {
    id: 'objects',
    name: 'objects',
    icon: Lightbulb,
    emojis: [
      { emoji: '💡', name: 'light bulb', category: 'objects', keywords: ['idea'], codepoint: '1F4A1' },
      { emoji: '🔦', name: 'flashlight', category: 'objects', keywords: ['light'], codepoint: '1F526' },
      { emoji: '🕯️', name: 'candle', category: 'objects', keywords: ['light'], codepoint: '1F56F' },
      { emoji: '🪔', name: 'diya lamp', category: 'objects', keywords: ['light'], codepoint: '1FA94' },
      { emoji: '🧯', name: 'fire extinguisher', category: 'objects', keywords: ['safety'], codepoint: '1F9EF' },
      { emoji: '🛢️', name: 'oil drum', category: 'objects', keywords: ['oil'], codepoint: '1F6E2' },
      { emoji: '💸', name: 'money with wings', category: 'objects', keywords: ['money'], codepoint: '1F4B8' },
      { emoji: '💰', name: 'money bag', category: 'objects', keywords: ['money'], codepoint: '1F4B0' },
      { emoji: '💎', name: 'gem stone', category: 'objects', keywords: ['diamond'], codepoint: '1F48E' },
      { emoji: '⚖️', name: 'balance scale', category: 'objects', keywords: ['justice'], codepoint: '2696' },
      { emoji: '🧰', name: 'toolbox', category: 'objects', keywords: ['tools'], codepoint: '1F9F0' },
      { emoji: '🔧', name: 'wrench', category: 'objects', keywords: ['tool'], codepoint: '1F527' },
      { emoji: '🔨', name: 'hammer', category: 'objects', keywords: ['tool'], codepoint: '1F528' },
      { emoji: '⛏️', name: 'pick', category: 'objects', keywords: ['tool'], codepoint: '26CF' },
      { emoji: '🛠️', name: 'hammer and wrench', category: 'objects', keywords: ['tools'], codepoint: '1F6E0' },
      { emoji: '⚒️', name: 'hammer and pick', category: 'objects', keywords: ['tools'], codepoint: '2692' }
    ]
  },
  {
    id: 'flags',
    name: 'flags',
    icon: Flag,
    emojis: [
      { emoji: '🏁', name: 'chequered flag', category: 'flags', keywords: ['race'], codepoint: '1F3C1' },
      { emoji: '🚩', name: 'triangular flag', category: 'flags', keywords: ['flag'], codepoint: '1F6A9' },
      { emoji: '🎌', name: 'crossed flags', category: 'flags', keywords: ['japan'], codepoint: '1F38C' },
      { emoji: '🏴', name: 'black flag', category: 'flags', keywords: ['flag'], codepoint: '1F3F4' },
      { emoji: '🏳️', name: 'white flag', category: 'flags', keywords: ['flag'], codepoint: '1F3F3' },
      { emoji: '🏳️‍🌈', name: 'rainbow flag', category: 'flags', keywords: ['pride'], codepoint: '1F3F3-200D-1F308' },
      { emoji: '🏳️‍⚧️', name: 'transgender flag', category: 'flags', keywords: ['transgender'], codepoint: '1F3F3-200D-26A7' },
      { emoji: '🏴‍☠️', name: 'pirate flag', category: 'flags', keywords: ['pirate'], codepoint: '1F3F4-200D-2620' },
      { emoji: '🇺🇿', name: 'flag: uzbekistan', category: 'flags', keywords: ['uzbekistan'], codepoint: '1F1FA-1F1FF' },
      { emoji: '🇺🇸', name: 'flag: united states', category: 'flags', keywords: ['usa'], codepoint: '1F1FA-1F1F8' },
      { emoji: '🇷🇺', name: 'flag: russia', category: 'flags', keywords: ['russia'], codepoint: '1F1F7-1F1FA' },
      { emoji: '🇬🇧', name: 'flag: united kingdom', category: 'flags', keywords: ['uk'], codepoint: '1F1EC-1F1E7' },
      { emoji: '🇩🇪', name: 'flag: germany', category: 'flags', keywords: ['germany'], codepoint: '1F1E9-1F1EA' },
      { emoji: '🇫🇷', name: 'flag: france', category: 'flags', keywords: ['france'], codepoint: '1F1EB-1F1F7' },
      { emoji: '🇮🇹', name: 'flag: italy', category: 'flags', keywords: ['italy'], codepoint: '1F1EE-1F1F9' },
      { emoji: '🇪🇸', name: 'flag: spain', category: 'flags', keywords: ['spain'], codepoint: '1F1EA-1F1F8' }
    ]
  }
]

export function EmojiPicker({
  onEmojiSelect,
  recentEmojis = [],
  onRecentEmojisChange,
  variant = 'default',
  maxRecentEmojis = 24,
  showSearch = true,
  showCategories = true,
  showSkinTones = false,
  className,
  trigger
}: EmojiPickerProps) {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('smileys')
  const [isOpen, setIsOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Filter emojis based on search query
  const filteredEmojis = searchQuery
    ? emojiCategories.flatMap(category =>
        category.emojis.filter(emoji =>
          emoji.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emoji.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      )
    : emojiCategories.find(cat => cat.id === activeCategory)?.emojis || []

  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    onEmojiSelect(emoji)

    // Add to recent emojis
    if (onRecentEmojisChange) {
      const updatedRecent = [emoji, ...recentEmojis.filter(e => e !== emoji)].slice(0, maxRecentEmojis)
      onRecentEmojisChange(updatedRecent)
    }

    setIsOpen(false)
  }

  // Get categories with recent emojis
  const categoriesWithRecent = React.useMemo(() => {
    const categories = [...emojiCategories]
    if (recentEmojis.length > 0) {
      const recentCategory = categories.find(cat => cat.id === 'recent')
      if (recentCategory) {
        recentCategory.emojis = recentEmojis.map(emoji => ({
          emoji,
          name: emoji,
          category: 'recent',
          keywords: [],
          codepoint: ''
        }))
      }
    }
    return categories.filter(cat => cat.id !== 'recent' || recentEmojis.length > 0)
  }, [recentEmojis])

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current && showSearch) {
      setTimeout(() => searchInputRef.current?.focus(), 100)
    }
  }, [isOpen, showSearch])

  const renderEmojiGrid = (emojis: Emoji[]) => (
    <div className={cn(
      "grid gap-1",
      variant === 'compact' ? "grid-cols-8" : variant === 'minimal' ? "grid-cols-6" : "grid-cols-9"
    )}>
      {emojis.map((emoji, index) => (
        <Button
          key={`${emoji.emoji}-${index}`}
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0 hover:bg-muted text-lg",
            variant === 'compact' && "h-7 w-7 text-base",
            variant === 'minimal' && "h-6 w-6 text-sm"
          )}
          onClick={() => handleEmojiSelect(emoji.emoji)}
          title={emoji.name}
        >
          {emoji.emoji}
        </Button>
      ))}
    </div>
  )

  if (variant === 'minimal') {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          {trigger || (
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Smile className="h-3 w-3" />
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2" align="end">
          <div className="space-y-2">
            <div className="flex gap-1 overflow-x-auto">
              {categoriesWithRecent.slice(0, 4).map((category) => {
                const Icon = category.icon
                return (
                  <Button
                    key={category.id}
                    variant={activeCategory === category.id ? 'default' : 'ghost'}
                    size="sm"
                    className="h-6 w-6 p-0 flex-shrink-0"
                    onClick={() => setActiveCategory(category.id)}
                  >
                    <Icon className="h-3 w-3" />
                  </Button>
                )
              })}
            </div>
            <ScrollArea className="h-40">
              {renderEmojiGrid(filteredEmojis.slice(0, 30))}
            </ScrollArea>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            <Smile className="h-4 w-4" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className={cn("w-80 p-0", className)} align="end">
        <div className="flex flex-col h-96">
          {/* Header */}
          <div className="p-3 border-b space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{t('selectEmoji')}</h4>
              <Badge variant="secondary" className="text-xs">
                {filteredEmojis.length}
              </Badge>
            </div>

            {/* Search */}
            {showSearch && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  placeholder={t('searchEmojis')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}
          </div>

          {/* Categories and Content */}
          {searchQuery ? (
            /* Search Results */
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-3">
                <h5 className="text-sm font-medium text-muted-foreground">
                  {t('searchResults')} ({filteredEmojis.length})
                </h5>
                {renderEmojiGrid(filteredEmojis)}
              </div>
            </ScrollArea>
          ) : (
            /* Category Tabs */
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="flex-1 flex flex-col">
              {showCategories && (
                <TabsList className="grid w-full grid-cols-6 h-auto p-1 m-2 mb-0">
                  {categoriesWithRecent.slice(0, 6).map((category) => {
                    const Icon = category.icon
                    return (
                      <TabsTrigger
                        key={category.id}
                        value={category.id}
                        className="p-2"
                        title={t(category.name)}
                      >
                        <Icon className="h-4 w-4" />
                      </TabsTrigger>
                    )
                  })}
                </TabsList>
              )}

              <div className="flex-1 overflow-hidden">
                {categoriesWithRecent.map((category) => (
                  <TabsContent
                    key={category.id}
                    value={category.id}
                    className="h-full m-0 p-3"
                  >
                    <ScrollArea className="h-full">
                      <div className="space-y-3">
                        <h5 className="text-sm font-medium text-muted-foreground">
                          {t(category.name)} ({category.emojis.length})
                        </h5>
                        {renderEmojiGrid(category.emojis)}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default EmojiPicker