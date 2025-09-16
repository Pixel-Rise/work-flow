import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TaskPrioritySelector } from './task-priority-selector';
import { TaskAssigneeSelector } from './task-assignee-selector';
import { TaskDueDatePicker } from './task-due-date-picker';
import { TaskTagsInput } from './task-tags-input';
import { SubtasksList } from './subtasks-list';
import { TaskChecklist } from './task-checklist';
import {
  Save,
  RotateCcw,
  AlertCircle,
  Clock,
  Calendar,
  User,
  Tag,
  CheckSquare,
  List,
  FileText,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';

export interface TaskFormData {
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignees: Array<{
    id: number;
    name: string;
    avatar?: string;
    email: string;
  }>;
  dueDate?: string;
  tags: string[];
  project?: {
    id: number;
    name: string;
  };
  subtasks: Array<{
    id?: number;
    title: string;
    completed: boolean;
    assignee?: {
      id: number;
      name: string;
      avatar?: string;
    };
  }>;
  checklist: Array<{
    id?: number;
    text: string;
    completed: boolean;
  }>;
  estimatedTime?: number;
  actualTime?: number;
}

export interface EditTaskFormProps {
  taskId: number;
  initialData: TaskFormData;
  variant?: 'default' | 'compact' | 'modal';
  showUnsavedWarning?: boolean;
  autoSave?: boolean;
  autoSaveDelay?: number;
  onSubmit: (data: TaskFormData) => void;
  onCancel?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  isLoading?: boolean;
  className?: string;
}

export const EditTaskForm: React.FC<EditTaskFormProps> = ({
  taskId,
  initialData,
  variant = 'default',
  showUnsavedWarning = true,
  autoSave = false,
  autoSaveDelay = 2000,
  onSubmit,
  onCancel,
  onDelete,
  onDuplicate,
  isLoading = false,
  className = ''
}) => {
  const { t } = useTranslation();
  const [hasChanges, setHasChanges] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty }
  } = useForm<TaskFormData>({
    defaultValues: initialData
  });

  const watchedValues = watch();

  // Track changes
  useEffect(() => {
    const hasFormChanges = isDirty || hasChanges;
    setHasChanges(hasFormChanges);

    if (autoSave && hasFormChanges) {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }

      const timeout = setTimeout(() => {
        handleAutoSave();
      }, autoSaveDelay);

      setAutoSaveTimeout(timeout);
    }

    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [watchedValues, isDirty, hasChanges, autoSave]);

  // Warn before leaving if there are unsaved changes
  useEffect(() => {
    if (!showUnsavedWarning) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = t('unsavedChangesWarning');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges, showUnsavedWarning, t]);

  const handleAutoSave = async () => {
    if (!hasChanges) return;

    try {
      await onSubmit(watchedValues);
      setLastSaved(new Date());
      setHasChanges(false);
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  const onFormSubmit = async (data: TaskFormData) => {
    try {
      await onSubmit(data);
      setHasChanges(false);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const handleReset = () => {
    reset(initialData);
    setHasChanges(false);
  };

  const handleFieldChange = (field: keyof TaskFormData, value: any) => {
    setValue(field, value);
    setHasChanges(true);
  };

  const isCompact = variant === 'compact';
  const isModal = variant === 'modal';

  const formContent = (
    <div className="space-y-6">
      {/* Header */}
      {!isModal && (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t('editTask')}</h2>
          <div className="flex items-center gap-2">
            {hasChanges && showUnsavedWarning && (
              <Badge variant="outline" className="text-orange-600">
                {t('unsavedChanges')}
              </Badge>
            )}
            {lastSaved && (
              <span className="text-xs text-gray-500">
                {t('lastSaved')}: {lastSaved.toLocaleTimeString()}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
            >
              {isPreviewMode ? <Edit className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {isPreviewMode ? t('edit') : t('preview')}
            </Button>
          </div>
        </div>
      )}

      {/* Unsaved changes warning */}
      {hasChanges && showUnsavedWarning && !autoSave && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t('unsavedChangesMessage')}
          </AlertDescription>
        </Alert>
      )}

      {isPreviewMode ? (
        /* Preview Mode */
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">{watchedValues.title}</h3>
              {watchedValues.description && (
                <p className="text-gray-600 whitespace-pre-wrap">{watchedValues.description}</p>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-medium mb-3">{t('taskDetails')}</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{t('priority')}:</span>
                    <TaskPrioritySelector
                      value={watchedValues.priority}
                      variant="badge"
                      disabled
                    />
                  </div>
                  {watchedValues.assignees.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{t('assignees')}:</span>
                      <div className="flex gap-1">
                        {watchedValues.assignees.map((assignee) => (
                          <Badge key={assignee.id} variant="outline">
                            {assignee.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {watchedValues.dueDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        {new Date(watchedValues.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {watchedValues.tags.length > 0 && (
                    <div className="flex items-start gap-2">
                      <span className="text-sm text-gray-500 mt-1">{t('tags')}:</span>
                      <div className="flex flex-wrap gap-1">
                        {watchedValues.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {(watchedValues.subtasks.length > 0 || watchedValues.checklist.length > 0) && (
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-medium mb-3">{t('progress')}</h4>
                  {watchedValues.subtasks.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-sm text-gray-500">{t('subtasks')}:</span>
                      <SubtasksList
                        subtasks={watchedValues.subtasks}
                        variant="minimal"
                        readOnly
                      />
                    </div>
                  )}
                  {watchedValues.checklist.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-sm text-gray-500">{t('checklist')}:</span>
                      <TaskChecklist
                        items={watchedValues.checklist}
                        variant="minimal"
                        readOnly
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ) : (
        /* Edit Mode */
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">{t('taskTitle')}</Label>
              <Input
                id="title"
                {...register('title', { required: t('titleRequired') })}
                className={errors.title ? 'border-red-500' : ''}
                placeholder={t('enterTaskTitle')}
              />
              {errors.title && (
                <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">{t('description')}</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder={t('enterTaskDescription')}
                className={isCompact ? 'min-h-[80px]' : 'min-h-[120px]'}
              />
            </div>
          </div>

          {!isCompact && <Separator />}

          {/* Task Properties */}
          <div className={`grid gap-4 ${isCompact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">{t('priority')}</Label>
                <TaskPrioritySelector
                  value={watchedValues.priority}
                  onChange={(priority) => handleFieldChange('priority', priority)}
                  variant="default"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">{t('assignees')}</Label>
                <TaskAssigneeSelector
                  value={watchedValues.assignees}
                  onChange={(assignees) => handleFieldChange('assignees', assignees)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">{t('dueDate')}</Label>
                <TaskDueDatePicker
                  value={watchedValues.dueDate}
                  onChange={(date) => handleFieldChange('dueDate', date)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">{t('tags')}</Label>
                <TaskTagsInput
                  value={watchedValues.tags}
                  onChange={(tags) => handleFieldChange('tags', tags)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {!isCompact && <Separator />}

          {/* Subtasks */}
          {!isCompact && (
            <div>
              <Label className="text-sm font-medium flex items-center gap-2 mb-3">
                <List className="h-4 w-4" />
                {t('subtasks')} ({watchedValues.subtasks?.length || 0})
              </Label>
              <SubtasksList
                subtasks={watchedValues.subtasks || []}
                onChange={(subtasks) => handleFieldChange('subtasks', subtasks)}
                variant="default"
              />
            </div>
          )}

          {!isCompact && <Separator />}

          {/* Checklist */}
          {!isCompact && (
            <div>
              <Label className="text-sm font-medium flex items-center gap-2 mb-3">
                <CheckSquare className="h-4 w-4" />
                {t('checklist')} ({watchedValues.checklist?.length || 0})
              </Label>
              <TaskChecklist
                items={watchedValues.checklist || []}
                onChange={(checklist) => handleFieldChange('checklist', checklist)}
                variant="default"
              />
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2">
              {onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={onDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('delete')}
                </Button>
              )}

              {onDuplicate && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onDuplicate}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {t('duplicate')}
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {hasChanges && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  {t('reset')}
                </Button>
              )}

              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                >
                  {t('cancel')}
                </Button>
              )}

              <Button
                type="submit"
                disabled={isLoading || (!hasChanges && !isDirty)}
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? t('saving') : t('saveChanges')}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );

  if (isModal) {
    return <div className={className}>{formContent}</div>;
  }

  return (
    <div className={`${className}`}>
      {isCompact ? (
        formContent
      ) : (
        <Card>
          <CardContent className="p-6">
            {formContent}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EditTaskForm;