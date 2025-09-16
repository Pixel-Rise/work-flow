import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, Clock, Eye, MessageSquare, Calendar } from 'lucide-react';

export interface LeaveRequest {
  id: string;
  employeeName: string;
  employeeAvatar?: string;
  type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'emergency';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  urgency: 'low' | 'medium' | 'high';
}

export interface LeaveApprovalCardProps {
  request: LeaveRequest;
  onApprove: (requestId: string, comment?: string) => void;
  onReject: (requestId: string, reason: string) => void;
  onViewDetails: (requestId: string) => void;
  variant?: 'default' | 'compact';
  showActions?: boolean;
  className?: string;
}

export const LeaveApprovalCard: React.FC<LeaveApprovalCardProps> = ({
  request,
  onApprove,
  onReject,
  onViewDetails,
  variant = 'default',
  showActions = true,
  className = ''
}) => {
  const { t } = useTranslation();
  const [showCommentBox, setShowCommentBox] = React.useState(false);
  const [comment, setComment] = React.useState('');

  const isCompact = variant === 'compact';

  const getTypeColor = () => {
    const colors = {
      vacation: 'bg-blue-100 text-blue-800',
      sick: 'bg-red-100 text-red-800',
      personal: 'bg-green-100 text-green-800',
      maternity: 'bg-purple-100 text-purple-800',
      emergency: 'bg-orange-100 text-orange-800'
    };
    return colors[request.type];
  };

  const getUrgencyColor = () => {
    const colors = {
      low: 'border-green-200',
      medium: 'border-yellow-200',
      high: 'border-red-200'
    };
    return colors[request.urgency];
  };

  const handleApprove = () => {
    onApprove(request.id, comment);
    setComment('');
    setShowCommentBox(false);
  };

  const handleReject = () => {
    if (comment.trim()) {
      onReject(request.id, comment);
      setComment('');
      setShowCommentBox(false);
    }
  };

  return (
    <Card className={`${getUrgencyColor()} ${className}`}>
      <CardContent className={`p-${isCompact ? '4' : '6'}`}>
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className={isCompact ? 'h-10 w-10' : 'h-12 w-12'}>
                <AvatarImage src={request.employeeAvatar} alt={request.employeeName} />
                <AvatarFallback>{request.employeeName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className={`font-medium ${isCompact ? 'text-sm' : ''}`}>
                  {request.employeeName}
                </h3>
                <p className={`text-gray-600 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                  {t('submittedOn')} {new Date(request.submittedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge className={`text-xs ${getTypeColor()}`}>
                {t(`leaveType.${request.type}`)}
              </Badge>
              {request.urgency === 'high' && (
                <Badge variant="destructive" className="text-xs">
                  {t('urgent')}
                </Badge>
              )}
            </div>
          </div>

          {/* Leave Details */}
          <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
            <div>
              <p className={`text-gray-600 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                {t('startDate')}
              </p>
              <p className={`font-medium ${isCompact ? 'text-sm' : ''}`}>
                {new Date(request.startDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className={`text-gray-600 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                {t('endDate')}
              </p>
              <p className={`font-medium ${isCompact ? 'text-sm' : ''}`}>
                {new Date(request.endDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className={`text-gray-600 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                {t('duration')}
              </p>
              <p className={`font-medium ${isCompact ? 'text-sm' : ''}`}>
                {request.days} {request.days === 1 ? t('day') : t('days')}
              </p>
            </div>
            <div>
              <p className={`text-gray-600 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                {t('status')}
              </p>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-yellow-600" />
                <span className={`text-yellow-600 font-medium ${isCompact ? 'text-sm' : ''}`}>
                  {t('pending')}
                </span>
              </div>
            </div>
          </div>

          {/* Reason */}
          <div>
            <p className={`text-gray-600 ${isCompact ? 'text-xs' : 'text-sm'} mb-2`}>
              {t('reason')}
            </p>
            <p className={`text-gray-900 ${isCompact ? 'text-sm' : ''} bg-white p-3 rounded border`}>
              {request.reason}
            </p>
          </div>

          {/* Comment Box */}
          {showCommentBox && (
            <div className="space-y-2">
              <label className={`text-gray-600 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                {t('addComment')}
              </label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t('enterComment')}
                rows={3}
              />
            </div>
          )}

          {/* Actions */}
          {showActions && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetails(request.id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {t('viewDetails')}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCommentBox(!showCommentBox)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {t('addComment')}
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleReject}
                  disabled={showCommentBox && !comment.trim()}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  {t('reject')}
                </Button>

                <Button
                  size="sm"
                  onClick={handleApprove}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {t('approve')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaveApprovalCard;