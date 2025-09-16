import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Settings,
  Bell,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Download,
  Upload,
  Trash2,
  UserPlus,
  UserMinus,
  Shield,
  MessageSquare,
  Image,
  FileText,
  Link,
  Smile,
  Camera,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  PhoneOff,
  Monitor,
  Smartphone,
  Tablet,
  Palette,
  Type,
  Zap,
  Clock,
  Archive,
  Star,
  Flag,
  RotateCcw
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'

export interface ChatSettingsData {
  // General Settings
  theme: 'light' | 'dark' | 'system'
  language: string
  fontSize: number
  compactMode: boolean
  showAvatars: boolean
  showTimestamps: boolean
  groupMessages: boolean

  // Notifications
  enableNotifications: boolean
  soundEnabled: boolean
  soundVolume: number
  desktopNotifications: boolean
  mobileNotifications: boolean
  emailNotifications: boolean
  notificationSound: string
  doNotDisturbMode: boolean
  doNotDisturbSchedule: {
    enabled: boolean
    start: string
    end: string
  }

  // Privacy & Security
  showOnlineStatus: boolean
  showLastSeen: boolean
  showTypingIndicator: boolean
  showReadReceipts: boolean
  allowDirectMessages: boolean
  allowGroupInvites: boolean
  requireApprovalForGroups: boolean
  blockUnknownUsers: boolean
  autoDeleteMessages: boolean
  autoDeleteDuration: number
  endToEndEncryption: boolean

  // Media & Files
  autoDownloadImages: boolean
  autoDownloadVideos: boolean
  autoDownloadFiles: boolean
  maxFileSize: number
  imageQuality: 'low' | 'medium' | 'high'
  videoQuality: 'low' | 'medium' | 'high'

  // Chat Features
  enableEmojis: boolean
  enableGifs: boolean
  enableStickers: boolean
  enableVoiceMessages: boolean
  enableVideoMessages: boolean
  enableScreenShare: boolean
  autoCorrect: boolean
  sendOnEnter: boolean
  showLinkPreviews: boolean

  // Backup & Data
  autoBackup: boolean
  backupFrequency: 'daily' | 'weekly' | 'monthly'
  includeMedia: boolean
  cloudSync: boolean

  // Advanced
  developerMode: boolean
  betaFeatures: boolean
  analyticsEnabled: boolean
  crashReporting: boolean
}

interface ChatSettingsProps {
  settings: ChatSettingsData
  onSettingsChange: (settings: ChatSettingsData) => void
  onExportData?: () => void
  onImportData?: (file: File) => void
  onClearData?: () => void
  onResetSettings?: () => void
  variant?: 'default' | 'modal' | 'page'
  className?: string
}

const notificationSounds = [
  { id: 'default', name: 'Default' },
  { id: 'ping', name: 'Ping' },
  { id: 'chime', name: 'Chime' },
  { id: 'bell', name: 'Bell' },
  { id: 'whistle', name: 'Whistle' },
  { id: 'none', name: 'None' }
]

const languages = [
  { code: 'en', name: 'English' },
  { code: 'uz', name: 'O\'zbekcha' },
  { code: 'ru', name: 'Русский' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' }
]

const themes = [
  { id: 'light', name: 'Light', icon: Sun },
  { id: 'dark', name: 'Dark', icon: Moon },
  { id: 'system', name: 'System', icon: Monitor }
]

export function ChatSettings({
  settings,
  onSettingsChange,
  onExportData,
  onImportData,
  onClearData,
  onResetSettings,
  variant = 'default',
  className
}: ChatSettingsProps) {
  const { t } = useTranslation()
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const updateSetting = <K extends keyof ChatSettingsData>(key: K, value: ChatSettingsData[K]) => {
    onSettingsChange({ ...settings, key: value })
  }

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && onImportData) {
      onImportData(file)
    }
  }

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            {t('appearance')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Theme */}
          <div className="space-y-2">
            <Label>{t('theme')}</Label>
            <div className="grid grid-cols-3 gap-2">
              {themes.map((theme) => {
                const Icon = theme.icon
                return (
                  <Button
                    key={theme.id}
                    variant={settings.theme === theme.id ? 'default' : 'outline'}
                    className="flex flex-col gap-2 h-16"
                    onClick={() => updateSetting('theme', theme.id as any)}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs">{t(theme.name.toLowerCase())}</span>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Language */}
          <div className="space-y-2">
            <Label>{t('language')}</Label>
            <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      {lang.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <Label className="flex items-center justify-between">
              <span>{t('fontSize')}</span>
              <Badge variant="secondary">{settings.fontSize}px</Badge>
            </Label>
            <Slider
              value={[settings.fontSize]}
              onValueChange={([value]) => updateSetting('fontSize', value)}
              min={12}
              max={24}
              step={1}
              className="w-full"
            />
          </div>

          {/* Display Options */}
          <div className="space-y-3">
            <Label>{t('displayOptions')}</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="compact-mode" className="text-sm">{t('compactMode')}</Label>
                <Switch
                  id="compact-mode"
                  checked={settings.compactMode}
                  onCheckedChange={(checked) => updateSetting('compactMode', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-avatars" className="text-sm">{t('showAvatars')}</Label>
                <Switch
                  id="show-avatars"
                  checked={settings.showAvatars}
                  onCheckedChange={(checked) => updateSetting('showAvatars', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-timestamps" className="text-sm">{t('showTimestamps')}</Label>
                <Switch
                  id="show-timestamps"
                  checked={settings.showTimestamps}
                  onCheckedChange={(checked) => updateSetting('showTimestamps', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="group-messages" className="text-sm">{t('groupMessages')}</Label>
                <Switch
                  id="group-messages"
                  checked={settings.groupMessages}
                  onCheckedChange={(checked) => updateSetting('groupMessages', checked)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {t('notifications')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Enable Notifications */}
          <div className="flex items-center justify-between">
            <Label htmlFor="enable-notifications">{t('enableNotifications')}</Label>
            <Switch
              id="enable-notifications"
              checked={settings.enableNotifications}
              onCheckedChange={(checked) => updateSetting('enableNotifications', checked)}
            />
          </div>

          {settings.enableNotifications && (
            <>
              {/* Sound Settings */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sound-enabled">{t('soundNotifications')}</Label>
                  <Switch
                    id="sound-enabled"
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
                  />
                </div>

                {settings.soundEnabled && (
                  <>
                    <div className="space-y-2">
                      <Label>{t('notificationSound')}</Label>
                      <Select
                        value={settings.notificationSound}
                        onValueChange={(value) => updateSetting('notificationSound', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {notificationSounds.map((sound) => (
                            <SelectItem key={sound.id} value={sound.id}>
                              {sound.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center justify-between">
                        <span>{t('volume')}</span>
                        <Badge variant="secondary">{settings.soundVolume}%</Badge>
                      </Label>
                      <Slider
                        value={[settings.soundVolume]}
                        onValueChange={([value]) => updateSetting('soundVolume', value)}
                        min={0}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Platform Notifications */}
              <div className="space-y-2">
                <Label>{t('platformNotifications')}</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="desktop-notifications" className="text-sm flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      {t('desktopNotifications')}
                    </Label>
                    <Switch
                      id="desktop-notifications"
                      checked={settings.desktopNotifications}
                      onCheckedChange={(checked) => updateSetting('desktopNotifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="mobile-notifications" className="text-sm flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      {t('mobileNotifications')}
                    </Label>
                    <Switch
                      id="mobile-notifications"
                      checked={settings.mobileNotifications}
                      onCheckedChange={(checked) => updateSetting('mobileNotifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications" className="text-sm flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      {t('emailNotifications')}
                    </Label>
                    <Switch
                      id="email-notifications"
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                    />
                  </div>
                </div>
              </div>

              {/* Do Not Disturb */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dnd-mode">{t('doNotDisturbMode')}</Label>
                  <Switch
                    id="dnd-mode"
                    checked={settings.doNotDisturbMode}
                    onCheckedChange={(checked) => updateSetting('doNotDisturbMode', checked)}
                  />
                </div>

                {settings.doNotDisturbMode && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="dnd-schedule">{t('scheduleDoNotDisturb')}</Label>
                      <Switch
                        id="dnd-schedule"
                        checked={settings.doNotDisturbSchedule.enabled}
                        onCheckedChange={(checked) =>
                          updateSetting('doNotDisturbSchedule', {
                            ...settings.doNotDisturbSchedule,
                            enabled: checked
                          })
                        }
                      />
                    </div>
                    {settings.doNotDisturbSchedule.enabled && (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">{t('start')}</Label>
                          <Input
                            type="time"
                            value={settings.doNotDisturbSchedule.start}
                            onChange={(e) =>
                              updateSetting('doNotDisturbSchedule', {
                                ...settings.doNotDisturbSchedule,
                                start: e.target.value
                              })
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">{t('end')}</Label>
                          <Input
                            type="time"
                            value={settings.doNotDisturbSchedule.end}
                            onChange={(e) =>
                              updateSetting('doNotDisturbSchedule', {
                                ...settings.doNotDisturbSchedule,
                                end: e.target.value
                              })
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t('privacyAndSecurity')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Visibility Settings */}
          <div className="space-y-2">
            <Label>{t('visibility')}</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-online-status" className="text-sm">{t('showOnlineStatus')}</Label>
                <Switch
                  id="show-online-status"
                  checked={settings.showOnlineStatus}
                  onCheckedChange={(checked) => updateSetting('showOnlineStatus', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-last-seen" className="text-sm">{t('showLastSeen')}</Label>
                <Switch
                  id="show-last-seen"
                  checked={settings.showLastSeen}
                  onCheckedChange={(checked) => updateSetting('showLastSeen', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-typing" className="text-sm">{t('showTypingIndicator')}</Label>
                <Switch
                  id="show-typing"
                  checked={settings.showTypingIndicator}
                  onCheckedChange={(checked) => updateSetting('showTypingIndicator', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-read-receipts" className="text-sm">{t('showReadReceipts')}</Label>
                <Switch
                  id="show-read-receipts"
                  checked={settings.showReadReceipts}
                  onCheckedChange={(checked) => updateSetting('showReadReceipts', checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Communication Settings */}
          <div className="space-y-2">
            <Label>{t('communication')}</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="allow-dm" className="text-sm">{t('allowDirectMessages')}</Label>
                <Switch
                  id="allow-dm"
                  checked={settings.allowDirectMessages}
                  onCheckedChange={(checked) => updateSetting('allowDirectMessages', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="allow-group-invites" className="text-sm">{t('allowGroupInvites')}</Label>
                <Switch
                  id="allow-group-invites"
                  checked={settings.allowGroupInvites}
                  onCheckedChange={(checked) => updateSetting('allowGroupInvites', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="require-approval" className="text-sm">{t('requireApprovalForGroups')}</Label>
                <Switch
                  id="require-approval"
                  checked={settings.requireApprovalForGroups}
                  onCheckedChange={(checked) => updateSetting('requireApprovalForGroups', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="block-unknown" className="text-sm">{t('blockUnknownUsers')}</Label>
                <Switch
                  id="block-unknown"
                  checked={settings.blockUnknownUsers}
                  onCheckedChange={(checked) => updateSetting('blockUnknownUsers', checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Security Settings */}
          <div className="space-y-2">
            <Label>{t('security')}</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="e2e-encryption" className="text-sm">{t('endToEndEncryption')}</Label>
                <Switch
                  id="e2e-encryption"
                  checked={settings.endToEndEncryption}
                  onCheckedChange={(checked) => updateSetting('endToEndEncryption', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-delete" className="text-sm">{t('autoDeleteMessages')}</Label>
                <Switch
                  id="auto-delete"
                  checked={settings.autoDeleteMessages}
                  onCheckedChange={(checked) => updateSetting('autoDeleteMessages', checked)}
                />
              </div>
              {settings.autoDeleteMessages && (
                <div className="space-y-2">
                  <Label>{t('autoDeleteDuration')}</Label>
                  <Select
                    value={settings.autoDeleteDuration.toString()}
                    onValueChange={(value) => updateSetting('autoDeleteDuration', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">{t('1Day')}</SelectItem>
                      <SelectItem value="7">{t('1Week')}</SelectItem>
                      <SelectItem value="30">{t('1Month')}</SelectItem>
                      <SelectItem value="90">{t('3Months')}</SelectItem>
                      <SelectItem value="365">{t('1Year')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderDataSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            {t('dataAndBackup')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Backup Settings */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-backup">{t('autoBackup')}</Label>
              <Switch
                id="auto-backup"
                checked={settings.autoBackup}
                onCheckedChange={(checked) => updateSetting('autoBackup', checked)}
              />
            </div>

            {settings.autoBackup && (
              <>
                <div className="space-y-2">
                  <Label>{t('backupFrequency')}</Label>
                  <Select
                    value={settings.backupFrequency}
                    onValueChange={(value) => updateSetting('backupFrequency', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">{t('daily')}</SelectItem>
                      <SelectItem value="weekly">{t('weekly')}</SelectItem>
                      <SelectItem value="monthly">{t('monthly')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="include-media" className="text-sm">{t('includeMediaInBackup')}</Label>
                  <Switch
                    id="include-media"
                    checked={settings.includeMedia}
                    onCheckedChange={(checked) => updateSetting('includeMedia', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="cloud-sync" className="text-sm">{t('cloudSync')}</Label>
                  <Switch
                    id="cloud-sync"
                    checked={settings.cloudSync}
                    onCheckedChange={(checked) => updateSetting('cloudSync', checked)}
                  />
                </div>
              </>
            )}
          </div>

          <Separator />

          {/* Data Management */}
          <div className="space-y-3">
            <Label>{t('dataManagement')}</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={onExportData} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                {t('exportData')}
              </Button>
              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                  id="import-data"
                />
                <Button variant="outline" className="flex items-center gap-2 w-full" asChild>
                  <label htmlFor="import-data">
                    <Upload className="h-4 w-4" />
                    {t('importData')}
                  </label>
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Dangerous Actions */}
          <div className="space-y-3">
            <Label className="text-destructive">{t('dangerZone')}</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="destructive"
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {t('clearAllData')}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                {t('resetSettings')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const content = (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="general">{t('general')}</TabsTrigger>
        <TabsTrigger value="notifications">{t('notifications')}</TabsTrigger>
        <TabsTrigger value="privacy">{t('privacy')}</TabsTrigger>
        <TabsTrigger value="data">{t('data')}</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="mt-4">
        {renderGeneralSettings()}
      </TabsContent>

      <TabsContent value="notifications" className="mt-4">
        {renderNotificationSettings()}
      </TabsContent>

      <TabsContent value="privacy" className="mt-4">
        {renderPrivacySettings()}
      </TabsContent>

      <TabsContent value="data" className="mt-4">
        {renderDataSettings()}
      </TabsContent>
    </Tabs>
  )

  if (variant === 'modal') {
    return (
      <div className={cn("w-full max-w-2xl", className)}>
        {content}

        {/* Confirmation Dialogs */}
        <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('clearAllData')}</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              {t('clearDataConfirmation')}
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowClearConfirm(false)}>
                {t('cancel')}
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  onClearData?.()
                  setShowClearConfirm(false)
                }}
              >
                {t('clearData')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('resetSettings')}</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              {t('resetSettingsConfirmation')}
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowResetConfirm(false)}>
                {t('cancel')}
              </Button>
              <Button
                onClick={() => {
                  onResetSettings?.()
                  setShowResetConfirm(false)
                }}
              >
                {t('resetSettings')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className={cn("w-full", className)}>
      {content}
    </div>
  )
}

export default ChatSettings