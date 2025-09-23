import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Upload,
  File,
  Image,
  Video,
  Music,
  Archive,
  FileText,
  X,
  Check,
  AlertCircle,
  Download,
  Eye,
  Trash2,
  RefreshCw
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'

export interface FileItem {
  id: string
  file: File
  preview?: string
  progress?: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
  url?: string
}

export interface FileDropzoneProps {
  value?: FileItem[]
  accept?: Record<string, string[]>
  multiple?: boolean
  maxFiles?: number
  maxSize?: number
  disabled?: boolean
  showPreview?: boolean
  showProgress?: boolean
  allowRemove?: boolean
  allowRetry?: boolean
  variant?: 'default' | 'compact' | 'grid'
  onFilesChange?: (files: FileItem[]) => void
  onUpload?: (files: File[]) => Promise<string[]>
  onRemove?: (fileId: string) => void
  onPreview?: (file: FileItem) => void
  className?: string
}

const fileTypeIcons = {
  image: Image,
  video: Video,
  audio: Music,
  archive: Archive,
  document: FileText,
  default: File
}

const getFileType = (file: File): keyof typeof fileTypeIcons => {
  const type = file.type.split('/')[0]
  if (type === 'image') return 'image'
  if (type === 'video') return 'video'
  if (type === 'audio') return 'audio'
  if (file.name.match(/\.(zip|rar|7z|tar|gz)$/i)) return 'archive'
  if (file.type.includes('text') || file.name.match(/\.(doc|docx|pdf|txt)$/i)) return 'document'
  return 'default'
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

export function FileDropzone({
  value = [],
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    'application/pdf': ['.pdf'],
    'text/*': ['.txt', '.csv']
  },
  multiple = true,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  disabled = false,
  showPreview = true,
  showProgress = true,
  allowRemove = true,
  allowRetry = true,
  variant = 'default',
  onFilesChange,
  onUpload,
  onRemove,
  onPreview,
  className
}: FileDropzoneProps) {
  const { t } = useTranslation()
  const [files, setFiles] = useState<FileItem[]>(value)
  const [dragActive, setDragActive] = useState(false)

  const currentFiles = value.length > 0 ? value : files

  const handleFilesChange = (newFiles: FileItem[]) => {
    if (value.length === 0) {
      setFiles(newFiles)
    }
    onFilesChange?.(newFiles)
  }

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    setDragActive(false)

    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const rejectedItems: FileItem[] = rejectedFiles.map(({ file, errors }) => ({
        id: `rejected-${Date.now()}-${Math.random()}`,
        file,
        status: 'error' as const,
        error: errors.map((e: any) => e.message).join(', ')
      }))

      handleFilesChange([...currentFiles, ...rejectedItems])
      return
    }

    // Create file items from accepted files
    const newFileItems: FileItem[] = await Promise.all(
      acceptedFiles.map(async (file) => {
        const id = `${Date.now()}-${Math.random()}`
        let preview: string | undefined

        // Generate preview for images
        if (showPreview && file.type.startsWith('image/')) {
          preview = URL.createObjectURL(file)
        }

        return {
          id,
          file,
          preview,
          status: 'pending' as const,
          progress: 0
        }
      })
    )

    const updatedFiles = [...currentFiles, ...newFileItems]

    // Respect maxFiles limit
    const finalFiles = multiple
      ? updatedFiles.slice(0, maxFiles)
      : [newFileItems[0]].filter(Boolean)

    handleFilesChange(finalFiles)

    // Auto-upload if onUpload is provided
    if (onUpload) {
      await handleUpload(newFileItems.map(item => item.file), newFileItems.map(item => item.id))
    }
  }, [currentFiles, multiple, maxFiles, onUpload, showPreview])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxFiles,
    maxSize,
    disabled,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false)
  })

  const handleUpload = async (filesToUpload: File[], fileIds: string[]) => {
    if (!onUpload) return

    // Update status to uploading
    handleFilesChange(
      currentFiles.map(item =>
        fileIds.includes(item.id)
          ? { ...item, status: 'uploading', progress: 0 }
          : item
      )
    )

    try {
      const urls = await onUpload(filesToUpload)

      // Update with success status and URLs
      handleFilesChange(
        currentFiles.map(item =>
          fileIds.includes(item.id)
            ? {
                ...item,
                status: 'success',
                progress: 100,
                url: urls[fileIds.indexOf(item.id)]
              }
            : item
        )
      )
    } catch (error) {
      // Update with error status
      handleFilesChange(
        currentFiles.map(item =>
          fileIds.includes(item.id)
            ? {
                ...item,
                status: 'error',
                error: error instanceof Error ? error.message : 'Upload failed'
              }
            : item
        )
      )
    }
  }

  const handleRemove = (fileId: string) => {
    const fileToRemove = currentFiles.find(f => f.id === fileId)
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview)
    }

    const updatedFiles = currentFiles.filter(f => f.id !== fileId)
    handleFilesChange(updatedFiles)
    onRemove?.(fileId)
  }

  const handleRetry = async (fileId: string) => {
    const fileToRetry = currentFiles.find(f => f.id === fileId)
    if (!fileToRetry || !onUpload) return

    await handleUpload([fileToRetry.file], [fileId])
  }

  const renderFileItem = (fileItem: FileItem) => {
    const FileIcon = fileTypeIcons[getFileType(fileItem.file)]
    const isImage = fileItem.file.type.startsWith('image/')

    return (
      <div
        key={fileItem.id}
        className={cn(
          "relative border rounded-lg p-3 bg-card",
          fileItem.status === 'error' && "border-destructive",
          fileItem.status === 'success' && "border-green-500",
          variant === 'grid' ? "aspect-square" : "flex items-center gap-3"
        )}
      >
        {/* Preview/Icon */}
        <div className={cn(
          "flex-shrink-0",
          variant === 'grid' ? "mb-2" : ""
        )}>
          {isImage && fileItem.preview ? (
            <img
              src={fileItem.preview}
              alt={fileItem.file.name}
              className={cn(
                "object-cover rounded",
                variant === 'grid' ? "w-full h-24" : "w-12 h-12"
              )}
            />
          ) : (
            <div className={cn(
              "flex items-center justify-center bg-muted rounded",
              variant === 'grid' ? "w-full h-24" : "w-12 h-12"
            )}>
              <FileIcon className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="space-y-1">
            <p className="text-sm font-medium truncate">{fileItem.file.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(fileItem.file.size)}
            </p>

            {/* Status */}
            <div className="flex items-center gap-1">
              {fileItem.status === 'uploading' && (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span className="text-xs">{t('uploading')}</span>
                </>
              )}
              {fileItem.status === 'success' && (
                <>
                  <Check className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">{t('uploaded')}</span>
                </>
              )}
              {fileItem.status === 'error' && (
                <>
                  <AlertCircle className="w-3 h-3 text-destructive" />
                  <span className="text-xs text-destructive">{t('failed')}</span>
                </>
              )}
            </div>

            {/* Progress Bar */}
            {showProgress && fileItem.status === 'uploading' && (
              <Progress value={fileItem.progress || 0} className="h-1" />
            )}

            {/* Error Message */}
            {fileItem.status === 'error' && fileItem.error && (
              <p className="text-xs text-destructive">{fileItem.error}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {fileItem.status === 'success' && fileItem.url && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => window.open(fileItem.url, '_blank')}
            >
              <Download className="w-3 h-3" />
            </Button>
          )}

          {onPreview && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => onPreview(fileItem)}
            >
              <Eye className="w-3 h-3" />
            </Button>
          )}

          {allowRetry && fileItem.status === 'error' && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => handleRetry(fileItem.id)}
            >
              <RefreshCw className="w-3 h-3" />
            </Button>
          )}

          {allowRemove && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => handleRemove(fileItem.id)}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  const acceptedFileTypes = Object.values(accept).flat().join(', ')

  return (
    <div className={cn("space-y-4", className)}>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive || dragActive
            ? "border-primary bg-primary/10"
            : "border-border hover:border-primary/50",
          disabled && "opacity-50 cursor-not-allowed",
          variant === 'compact' && "p-4"
        )}
      >
        <input {...getInputProps()} />

        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Upload className="w-6 h-6 text-primary" />
          </div>

          <div className="space-y-2">
            <p className="text-lg font-medium">
              {isDragActive || dragActive
                ? t('dropFilesHere')
                : t('dragDropFiles')
              }
            </p>
            <p className="text-sm text-muted-foreground">
              {t('orClickToSelect')}
            </p>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              {t('acceptedFiles')}: {acceptedFileTypes}
            </p>
            <p>
              {t('maxSize')}: {formatFileSize(maxSize)}
            </p>
            {maxFiles > 1 && (
              <p>
                {t('maxFiles')}: {maxFiles}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* File List */}
      {currentFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">
              {t('files')} ({currentFiles.length})
            </h4>
            {allowRemove && currentFiles.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  currentFiles.forEach(file => {
                    if (file.preview) URL.revokeObjectURL(file.preview)
                  })
                  handleFilesChange([])
                }}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                {t('clearAll')}
              </Button>
            )}
          </div>

          <div className={cn(
            variant === 'grid'
              ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
              : "space-y-2"
          )}>
            {currentFiles.map(renderFileItem)}
          </div>
        </div>
      )}

      {/* Upload All Button */}
      {onUpload && currentFiles.some(f => f.status === 'pending') && (
        <Button
          onClick={() => {
            const pendingFiles = currentFiles.filter(f => f.status === 'pending')
            handleUpload(
              pendingFiles.map(f => f.file),
              pendingFiles.map(f => f.id)
            )
          }}
          disabled={disabled}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          {t('uploadAll')} ({currentFiles.filter(f => f.status === 'pending').length})
        </Button>
      )}
    </div>
  )
}

export default FileDropzone