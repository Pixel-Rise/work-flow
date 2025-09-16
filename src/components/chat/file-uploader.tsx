import React, { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  Upload,
  File,
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  Archive,
  X,
  Check,
  AlertTriangle,
  Paperclip,
  Camera,
  Folder,
  Download
} from 'lucide-react';

export interface FileWithPreview {
  file: File;
  id: string;
  preview?: string;
  uploadProgress?: number;
  uploadStatus?: 'pending' | 'uploading' | 'success' | 'error';
  uploadError?: string;
  url?: string;
}

export interface FileUploaderProps {
  onFilesSelect: (files: FileWithPreview[]) => void;
  onFileRemove?: (fileId: string) => void;
  onUpload?: (files: FileWithPreview[]) => Promise<void>;
  acceptedTypes?: string[];
  maxFileSize?: number; // in bytes
  maxFiles?: number;
  variant?: 'default' | 'compact' | 'minimal' | 'dropzone';
  multiple?: boolean;
  disabled?: boolean;
  showPreview?: boolean;
  showProgress?: boolean;
  dragAndDrop?: boolean;
  autoUpload?: boolean;
  className?: string;
}

const FILE_TYPE_ICONS = {
  image: ImageIcon,
  video: Video,
  audio: Music,
  text: FileText,
  application: File,
  archive: Archive,
  default: File
};

const FILE_TYPE_COLORS = {
  image: 'text-blue-600 bg-blue-50',
  video: 'text-purple-600 bg-purple-50',
  audio: 'text-green-600 bg-green-50',
  text: 'text-yellow-600 bg-yellow-50',
  application: 'text-gray-600 bg-gray-50',
  archive: 'text-orange-600 bg-orange-50',
  default: 'text-gray-600 bg-gray-50'
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileType = (file: File): keyof typeof FILE_TYPE_ICONS => {
  const type = file.type.split('/')[0];
  if (type in FILE_TYPE_ICONS) {
    return type as keyof typeof FILE_TYPE_ICONS;
  }
  if (file.type.includes('zip') || file.type.includes('rar') || file.type.includes('tar')) {
    return 'archive';
  }
  return 'default';
};

const getFileIcon = (file: File) => {
  const type = getFileType(file);
  return FILE_TYPE_ICONS[type];
};

const getFileColor = (file: File) => {
  const type = getFileType(file);
  return FILE_TYPE_COLORS[type];
};

const FilePreview: React.FC<{
  fileWithPreview: FileWithPreview;
  onRemove?: () => void;
  showProgress: boolean;
  variant: 'default' | 'compact' | 'minimal' | 'dropzone';
}> = ({ fileWithPreview, onRemove, showProgress, variant }) => {
  const { t } = useTranslation();
  const { file, preview, uploadProgress, uploadStatus, uploadError } = fileWithPreview;
  const isCompact = variant === 'compact' || variant === 'minimal';

  const FileIcon = getFileIcon(file);
  const fileColor = getFileColor(file);
  const isImage = file.type.startsWith('image/');

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'success':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'uploading':
        return (
          <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        );
      default:
        return null;
    }
  };

  return (
    <Card className={cn(
      'relative group transition-all duration-200 hover:shadow-md',
      uploadStatus === 'error' && 'border-red-200 bg-red-50',
      uploadStatus === 'success' && 'border-green-200 bg-green-50',
      isCompact && 'p-2'
    )}>
      <CardContent className={cn('p-4', isCompact && 'p-2')}>
        <div className="flex items-center gap-3">
          {/* File thumbnail/icon */}
          <div className={cn(
            'relative flex-shrink-0 rounded-lg p-2',
            fileColor,
            isCompact ? 'w-10 h-10' : 'w-12 h-12'
          )}>
            {isImage && preview ? (
              <img
                src={preview}
                alt={file.name}
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <FileIcon className="w-full h-full" />
            )}

            {/* Status overlay */}
            {uploadStatus && uploadStatus !== 'pending' && (
              <div className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-md">
                {getStatusIcon()}
              </div>
            )}
          </div>

          {/* File info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className={cn(
                'font-medium truncate',
                isCompact ? 'text-sm' : 'text-base'
              )}>
                {file.name}
              </h4>

              {onRemove && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRemove}
                  className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 hover:bg-red-100"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className={cn(
                'text-gray-500',
                isCompact ? 'text-xs' : 'text-sm'
              )}>
                {formatFileSize(file.size)}
              </span>

              <div className="flex items-center gap-2">
                {uploadStatus === 'error' && uploadError && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm">{uploadError}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                <Badge variant="outline" className="text-xs">
                  {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
                </Badge>
              </div>
            </div>

            {/* Upload progress */}
            {showProgress && uploadStatus === 'uploading' && typeof uploadProgress === 'number' && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{t('uploading')}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-1" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const DropZone: React.FC<{
  onDrop: (files: File[]) => void;
  accept?: string[];
  maxFileSize?: number;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}> = ({ onDrop, accept, maxFileSize, disabled, children, className }) => {
  const { t } = useTranslation();
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragError, setDragError] = useState<string>('');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragOver(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setDragError('');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setDragError('');

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    const validFiles: File[] = [];
    let hasError = false;

    for (const file of files) {
      // Check file type
      if (accept && accept.length > 0) {
        const isValidType = accept.some(type => {
          if (type === '*/*') return true;
          if (type.endsWith('/*')) {
            return file.type.startsWith(type.replace('/*', '/'));
          }
          return file.type === type || file.name.toLowerCase().endsWith(type.replace('.', '.'));
        });

        if (!isValidType) {
          setDragError(t('invalidFileType'));
          hasError = true;
          continue;
        }
      }

      // Check file size
      if (maxFileSize && file.size > maxFileSize) {
        setDragError(t('fileTooLarge', { max: formatFileSize(maxFileSize) }));
        hasError = true;
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onDrop(validFiles);
    }

    if (hasError) {
      setTimeout(() => setDragError(''), 3000);
    }
  }, [disabled, accept, maxFileSize, onDrop, t]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'relative transition-all duration-200',
        isDragOver && !disabled && 'ring-2 ring-blue-500 ring-offset-2',
        dragError && 'ring-2 ring-red-500 ring-offset-2',
        className
      )}
    >
      {children}

      {dragError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 bg-opacity-90 rounded-lg">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-red-600">{dragError}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesSelect,
  onFileRemove,
  onUpload,
  acceptedTypes = ['*/*'],
  maxFileSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 5,
  variant = 'default',
  multiple = true,
  disabled = false,
  showPreview = true,
  showProgress = true,
  dragAndDrop = true,
  autoUpload = false,
  className
}) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isCompact = variant === 'compact' || variant === 'minimal';
  const isDropzone = variant === 'dropzone';

  const createFileWithPreview = useCallback((file: File): Promise<FileWithPreview> => {
    return new Promise((resolve) => {
      const fileWithPreview: FileWithPreview = {
        file,
        id: Math.random().toString(36).substr(2, 9),
        uploadStatus: 'pending'
      };

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          fileWithPreview.preview = e.target?.result as string;
          resolve(fileWithPreview);
        };
        reader.readAsDataURL(file);
      } else {
        resolve(fileWithPreview);
      }
    });
  }, []);

  const handleFileSelect = useCallback(async (selectedFiles: File[]) => {
    if (disabled) return;

    const remainingSlots = maxFiles - files.length;
    const filesToProcess = selectedFiles.slice(0, remainingSlots);

    const newFilesWithPreview = await Promise.all(
      filesToProcess.map(createFileWithPreview)
    );

    const updatedFiles = [...files, ...newFilesWithPreview];
    setFiles(updatedFiles);
    onFilesSelect(newFilesWithPreview);

    if (autoUpload && onUpload) {
      handleUpload(newFilesWithPreview);
    }
  }, [files, maxFiles, disabled, createFileWithPreview, onFilesSelect, autoUpload, onUpload]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    handleFileSelect(selectedFiles);

    // Reset input value so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleFileSelect]);

  const handleRemoveFile = useCallback((fileId: string) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    setFiles(updatedFiles);
    onFileRemove?.(fileId);
  }, [files, onFileRemove]);

  const handleUpload = useCallback(async (filesToUpload?: FileWithPreview[]) => {
    if (!onUpload || isUploading) return;

    const targetFiles = filesToUpload || files.filter(f => f.uploadStatus === 'pending');
    if (targetFiles.length === 0) return;

    setIsUploading(true);

    try {
      // Update status to uploading
      setFiles(prev => prev.map(f =>
        targetFiles.find(tf => tf.id === f.id)
          ? { ...f, uploadStatus: 'uploading' as const, uploadProgress: 0 }
          : f
      ));

      await onUpload(targetFiles);

      // Update status to success
      setFiles(prev => prev.map(f =>
        targetFiles.find(tf => tf.id === f.id)
          ? { ...f, uploadStatus: 'success' as const, uploadProgress: 100 }
          : f
      ));
    } catch (error) {
      // Update status to error
      setFiles(prev => prev.map(f =>
        targetFiles.find(tf => tf.id === f.id)
          ? { ...f, uploadStatus: 'error' as const, uploadError: error instanceof Error ? error.message : 'Upload failed' }
          : f
      ));
    } finally {
      setIsUploading(false);
    }
  }, [onUpload, isUploading, files]);

  const openFileDialog = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  }, [disabled]);

  const renderUploadButton = () => {
    if (isCompact) {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={openFileDialog}
          disabled={disabled || files.length >= maxFiles}
          className="h-8 w-8 p-0"
        >
          <Paperclip className="h-4 w-4" />
        </Button>
      );
    }

    return (
      <Button
        variant="outline"
        onClick={openFileDialog}
        disabled={disabled || files.length >= maxFiles}
        className="gap-2"
      >
        <Upload className="h-4 w-4" />
        {t('selectFiles')}
      </Button>
    );
  };

  const renderDropzone = () => (
    <DropZone
      onDrop={handleFileSelect}
      accept={acceptedTypes}
      maxFileSize={maxFileSize}
      disabled={disabled}
      className={className}
    >
      <Card className={cn(
        'border-2 border-dashed transition-all duration-200 hover:border-blue-400',
        disabled ? 'border-gray-200 bg-gray-50' : 'border-gray-300',
        'cursor-pointer'
      )}>
        <CardContent className="p-12 text-center">
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
              <Upload className="h-8 w-8 text-blue-500" />
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('dropFilesHere')}
              </h3>
              <p className="text-gray-500 mb-4">
                {t('orClickToSelect')}
              </p>

              <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
                <span>{t('maxFiles')}: {maxFiles}</span>
                <span>•</span>
                <span>{t('maxSize')}: {formatFileSize(maxFileSize)}</span>
              </div>
            </div>

            <Button onClick={openFileDialog} disabled={disabled}>
              <Folder className="h-4 w-4 mr-2" />
              {t('browseFiles')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </DropZone>
  );

  const content = (
    <div className={cn('space-y-4', className)}>
      {/* Upload area */}
      {isDropzone ? (
        renderDropzone()
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {renderUploadButton()}

            {!isCompact && (
              <div className="text-sm text-gray-500">
                {files.length} / {maxFiles} {t('files')}
                {maxFileSize && (
                  <span className="ml-2">
                    (Max: {formatFileSize(maxFileSize)})
                  </span>
                )}
              </div>
            )}
          </div>

          {onUpload && files.some(f => f.uploadStatus === 'pending') && (
            <Button
              onClick={() => handleUpload()}
              disabled={isUploading}
              size="sm"
            >
              {isUploading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              {t('upload')}
            </Button>
          )}
        </div>
      )}

      {/* File previews */}
      {showPreview && files.length > 0 && (
        <div className="space-y-2">
          {files.map((fileWithPreview) => (
            <FilePreview
              key={fileWithPreview.id}
              fileWithPreview={fileWithPreview}
              onRemove={() => handleRemoveFile(fileWithPreview.id)}
              showProgress={showProgress}
              variant={variant}
            />
          ))}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={acceptedTypes.join(',')}
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );

  return dragAndDrop && !isDropzone ? (
    <DropZone
      onDrop={handleFileSelect}
      accept={acceptedTypes}
      maxFileSize={maxFileSize}
      disabled={disabled}
      className={className}
    >
      {content}
    </DropZone>
  ) : content;
};

export default FileUploader;