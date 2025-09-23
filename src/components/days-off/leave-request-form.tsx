import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LeaveTypeSelector } from './leave-type-selector';
import { cn } from '@/lib/utils';
import {
  CalendarDays,
  Clock,
  AlertTriangle,
  FileText,
  Send,
  Save,
  X,
  Plus,
  Trash2,
  Calendar as CalendarIcon
} from 'lucide-react';

export interface LeaveRequestData {
  type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'emergency' | 'other';
  startDate: string;
  endDate: string;
  isHalfDay: boolean;
  halfDayPeriod?: 'morning' | 'afternoon';
  reason: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  documents: File[];
  managerNote?: string;
  workCoverage?: {
    handoverTo: string;
    handoverNotes: string;
  };
}

export interface LeaveRequestFormProps {
  initialData?: Partial<LeaveRequestData>;
  availableBalance: Record<string, number>;
  isEditing?: boolean;
  onSubmit: (data: LeaveRequestData) => Promise<void>;
  onCancel?: () => void;
  onSaveDraft?: (data: Partial<LeaveRequestData>) => void;
  variant?: 'default' | 'compact' | 'modal';
  className?: string;
}

export const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({
  initialData,
  availableBalance,
  isEditing = false,
  onSubmit,
  onCancel,
  onSaveDraft,
  variant = 'default',
  className = ''
}) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDates, setSelectedDates] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: initialData?.startDate ? new Date(initialData.startDate) : undefined,
    to: initialData?.endDate ? new Date(initialData.endDate) : undefined
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showEmergencyContact, setShowEmergencyContact] = useState(false);
  const [showWorkCoverage, setShowWorkCoverage] = useState(false);

  const isCompact = variant === 'compact';
  const isModal = variant === 'modal';

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty }
  } = useForm<LeaveRequestData>({
    defaultValues: {
      type: 'vacation',
      isHalfDay: false,
      reason: '',
      documents: [],
      ...initialData
    }
  });

  const selectedType = watch('type');
  const isHalfDay = watch('isHalfDay');
  const reason = watch('reason');

  // Calculate leave duration
  const calculateLeaveDays = () => {
    if (!selectedDates.from || !selectedDates.to) return 0;

    const start = selectedDates.from;
    const end = selectedDates.to;
    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    return isHalfDay ? 0.5 : daysDiff;
  };

  const leaveDays = calculateLeaveDays();
  const remainingBalance = availableBalance[selectedType] || 0;
  const isOverBalance = leaveDays > remainingBalance;

  // Handle form submission
  const onFormSubmit = async (data: LeaveRequestData) => {
    if (!selectedDates.from || !selectedDates.to) return;

    setIsLoading(true);
    try {
      const formData: LeaveRequestData = {
        ...data,
        startDate: selectedDates.from.toISOString().split('T')[0],
        endDate: selectedDates.to.toISOString().split('T')[0],
        documents: uploadedFiles
      };

      await onSubmit(formData);
    } catch (error) {
      console.error('Failed to submit leave request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = () => {
    if (onSaveDraft) {
      const draftData = {
        type: selectedType,
        startDate: selectedDates.from?.toISOString().split('T')[0],
        endDate: selectedDates.to?.toISOString().split('T')[0],
        isHalfDay,
        reason,
        documents: uploadedFiles
      };
      onSaveDraft(draftData);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  return (
    <div className={className}>
      <Card className={isModal ? 'border-0 shadow-none' : ''}>
        <CardHeader className={isCompact ? 'pb-4' : ''}>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            {isEditing ? t('editLeaveRequest') : t('newLeaveRequest')}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            {/* Leave Type */}
            <div>
              <Label className="text-sm font-medium">{t('leaveType')}</Label>
              <div className="mt-1">
                <LeaveTypeSelector
                  value={selectedType}
                  onChange={(type) => setValue('type', type)}
                  availableBalance={availableBalance}
                  variant={isCompact ? 'compact' : 'default'}
                />
              </div>
            </div>

            {/* Date Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">{t('startDate')}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !selectedDates.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDates.from ? (
                        selectedDates.from.toLocaleDateString()
                      ) : (
                        t('selectDate')
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDates.from}
                      onSelect={(date) => setSelectedDates({ ...selectedDates, from: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label className="text-sm font-medium">{t('endDate')}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !selectedDates.to && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDates.to ? (
                        selectedDates.to.toLocaleDateString()
                      ) : (
                        t('selectDate')
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDates.to}
                      onSelect={(date) => setSelectedDates({ ...selectedDates, to: date })}
                      disabled={(date) => {
                        if (!selectedDates.from) return false;
                        return date < selectedDates.from;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Half Day Option */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="halfDay"
                {...register('isHalfDay')}
                className="rounded border-gray-300"
              />
              <Label htmlFor="halfDay" className="text-sm">
                {t('halfDayLeave')}
              </Label>
            </div>

            {isHalfDay && (
              <div>
                <Label className="text-sm font-medium">{t('halfDayPeriod')}</Label>
                <div className="flex gap-2 mt-1">
                  <Button
                    type="button"
                    variant={watch('halfDayPeriod') === 'morning' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setValue('halfDayPeriod', 'morning')}
                  >
                    {t('morning')}
                  </Button>
                  <Button
                    type="button"
                    variant={watch('halfDayPeriod') === 'afternoon' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setValue('halfDayPeriod', 'afternoon')}
                  >
                    {t('afternoon')}
                  </Button>
                </div>
              </div>
            )}

            {/* Leave Summary */}
            {selectedDates.from && selectedDates.to && (
              <div className="p-4 rounded-lg bg-gray-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t('leaveDuration')}</span>
                  <Badge variant="secondary">
                    {leaveDays} {leaveDays === 1 ? t('day') : t('days')}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('remainingBalance')}</span>
                  <span className={`text-sm font-medium ${
                    isOverBalance ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {remainingBalance} {t('days')}
                  </span>
                </div>
                {isOverBalance && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {t('insufficientBalance')}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {/* Reason */}
            <div>
              <Label htmlFor="reason" className="text-sm font-medium">
                {t('reason')} *
              </Label>
              <Textarea
                id="reason"
                {...register('reason', { required: t('reasonRequired') })}
                placeholder={t('enterLeaveReason')}
                className={`mt-1 ${errors.reason ? 'border-red-500' : ''}`}
                rows={3}
              />
              {errors.reason && (
                <p className="text-sm text-red-600 mt-1">{errors.reason.message}</p>
              )}
            </div>

            {/* Emergency Contact */}
            <div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">{t('emergencyContact')}</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEmergencyContact(!showEmergencyContact)}
                >
                  {showEmergencyContact ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {showEmergencyContact ? t('remove') : t('add')}
                </Button>
              </div>

              {showEmergencyContact && (
                <div className="mt-2 p-4 border rounded-lg space-y-3">
                  <div>
                    <Label htmlFor="emergencyName" className="text-sm">{t('name')}</Label>
                    <Input
                      id="emergencyName"
                      {...register('emergencyContact.name')}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyPhone" className="text-sm">{t('phoneNumber')}</Label>
                    <Input
                      id="emergencyPhone"
                      {...register('emergencyContact.phone')}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyRelation" className="text-sm">{t('relationship')}</Label>
                    <Input
                      id="emergencyRelation"
                      {...register('emergencyContact.relationship')}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Work Coverage */}
            <div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">{t('workCoverage')}</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowWorkCoverage(!showWorkCoverage)}
                >
                  {showWorkCoverage ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {showWorkCoverage ? t('remove') : t('add')}
                </Button>
              </div>

              {showWorkCoverage && (
                <div className="mt-2 p-4 border rounded-lg space-y-3">
                  <div>
                    <Label htmlFor="handoverTo" className="text-sm">{t('handoverTo')}</Label>
                    <Input
                      id="handoverTo"
                      {...register('workCoverage.handoverTo')}
                      placeholder={t('colleagueName')}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="handoverNotes" className="text-sm">{t('handoverNotes')}</Label>
                    <Textarea
                      id="handoverNotes"
                      {...register('workCoverage.handoverNotes')}
                      placeholder={t('describeHandover')}
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Document Upload */}
            <div>
              <Label className="text-sm font-medium">{t('supportingDocuments')}</Label>
              <div className="mt-2">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                <Label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <FileText className="h-4 w-4" />
                  {t('uploadDocuments')}
                </Label>

                {uploadedFiles.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="h-6 w-6 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                {onSaveDraft && isDirty && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleSaveDraft}
                    disabled={isLoading}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {t('saveDraft')}
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {onCancel && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isLoading}
                  >
                    {t('cancel')}
                  </Button>
                )}

                <Button
                  type="submit"
                  disabled={isLoading || isOverBalance || !selectedDates.from || !selectedDates.to || !reason.trim()}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isLoading
                    ? t('submitting')
                    : isEditing
                    ? t('updateRequest')
                    : t('submitRequest')
                  }
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveRequestForm;