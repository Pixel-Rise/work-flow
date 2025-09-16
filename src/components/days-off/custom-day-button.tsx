import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  CalendarDays,
  Heart,
  User,
  Baby,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Calendar
} from 'lucide-react';

export type LeaveStatus = 'approved' | 'pending' | 'rejected' | 'partial';
export type LeaveType = 'vacation' | 'sick' | 'personal' | 'maternity' | 'emergency' | 'other';

export interface LeaveDay {
  date: string;
  type: LeaveType;
  status: LeaveStatus;
  isHalfDay?: boolean;
  period?: 'morning' | 'afternoon';
  employeeName?: string;
  reason?: string;
  duration?: number;
}

export interface CustomDayButtonProps {
  date: Date;
  leaves?: LeaveDay[];
  isSelected?: boolean;
  isToday?: boolean;
  isOtherMonth?: boolean;
  isWeekend?: boolean;
  isHoliday?: boolean;
  holidayName?: string;
  variant?: 'calendar' | 'mini' | 'detailed';
  showTooltip?: boolean;
  showBadges?: boolean;
  onClick?: (date: Date) => void;
  onLeaveClick?: (leave: LeaveDay) => void;
  className?: string;
}

const getLeaveTypeIcon = (type: LeaveType) => {
  const icons = {
    vacation: CalendarDays,
    sick: Heart,
    personal: User,
    maternity: Baby,
    emergency: AlertTriangle,
    other: Calendar
  };
  return icons[type] || Calendar;
};

const getStatusIcon = (status: LeaveStatus) => {
  switch (status) {
    case 'approved':
      return CheckCircle;
    case 'rejected':
      return XCircle;
    case 'pending':
      return Clock;
    case 'partial':
      return AlertTriangle;
    default:
      return Clock;
  }
};

const getStatusColor = (status: LeaveStatus) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-700 border-green-300';
    case 'rejected':
      return 'bg-red-100 text-red-700 border-red-300';
    case 'pending':
      return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    case 'partial':
      return 'bg-orange-100 text-orange-700 border-orange-300';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300';
  }
};

const getTypeColor = (type: LeaveType) => {
  const colors = {
    vacation: 'bg-blue-500',
    sick: 'bg-red-500',
    personal: 'bg-green-500',
    maternity: 'bg-purple-500',
    emergency: 'bg-orange-500',
    other: 'bg-gray-500'
  };
  return colors[type] || 'bg-gray-500';
};

const LeaveIndicatorDot: React.FC<{
  leave: LeaveDay;
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
}> = ({ leave, size = 'sm', showStatus = false }) => {
  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5'
  };

  const StatusIcon = getStatusIcon(leave.status);

  return (
    <div className="relative">
      <div
        className={cn(
          'rounded-full',
          sizeClasses[size],
          getTypeColor(leave.type),
          leave.isHalfDay && 'opacity-60'
        )}
      />
      {showStatus && (
        <StatusIcon className="absolute -top-1 -right-1 w-2 h-2 text-gray-600" />
      )}
    </div>
  );
};

const TooltipContent: React.FC<{
  date: Date;
  leaves: LeaveDay[];
  isHoliday?: boolean;
  holidayName?: string;
}> = ({ date, leaves, isHoliday, holidayName }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-2 max-w-xs">
      <div className="font-medium">
        {date.toLocaleDateString()}
      </div>

      {isHoliday && holidayName && (
        <div className="text-sm text-blue-600">
          🎉 {holidayName}
        </div>
      )}

      {leaves.length > 0 ? (
        <div className="space-y-2">
          {leaves.map((leave, index) => (
            <div key={index} className="text-sm">
              <div className="flex items-center gap-2 mb-1">
                <div className={cn('w-2 h-2 rounded-full', getTypeColor(leave.type))} />
                <span className="font-medium">
                  {t(`leaveType.${leave.type}`)}
                  {leave.isHalfDay && ` (${t(leave.period || 'halfDay')})`}
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs text-gray-600 ml-4">
                <span className={cn('px-1.5 py-0.5 rounded text-xs', getStatusColor(leave.status))}>
                  {t(leave.status)}
                </span>
                {leave.employeeName && (
                  <span>• {leave.employeeName}</span>
                )}
              </div>

              {leave.reason && (
                <div className="text-xs text-gray-500 ml-4 mt-1">
                  {leave.reason.length > 50 ? `${leave.reason.substring(0, 50)}...` : leave.reason}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500">
          {t('noLeaveScheduled')}
        </div>
      )}
    </div>
  );
};

export const CustomDayButton: React.FC<CustomDayButtonProps> = ({
  date,
  leaves = [],
  isSelected = false,
  isToday = false,
  isOtherMonth = false,
  isWeekend = false,
  isHoliday = false,
  holidayName,
  variant = 'calendar',
  showTooltip = true,
  showBadges = true,
  onClick,
  onLeaveClick,
  className
}) => {
  const { t } = useTranslation();
  const dayNumber = date.getDate();

  const isCompact = variant === 'mini';
  const isDetailed = variant === 'detailed';

  const hasLeaves = leaves.length > 0;
  const hasApprovedLeaves = leaves.some(l => l.status === 'approved');
  const hasPendingLeaves = leaves.some(l => l.status === 'pending');
  const hasRejectedLeaves = leaves.some(l => l.status === 'rejected');

  const totalLeaveDays = leaves.reduce((total, leave) => {
    return total + (leave.duration || (leave.isHalfDay ? 0.5 : 1));
  }, 0);

  const getButtonClasses = () => {
    const baseClasses = cn(
      'relative p-0 border-2 transition-all duration-200 hover:shadow-md',
      isCompact ? 'w-8 h-8' : isDetailed ? 'w-16 h-16' : 'w-12 h-12',
      className
    );

    if (isSelected) {
      return cn(baseClasses, 'border-blue-500 bg-blue-50 text-blue-900');
    }

    if (isToday) {
      return cn(baseClasses, 'border-purple-400 bg-purple-50 text-purple-900 font-bold');
    }

    if (isOtherMonth) {
      return cn(baseClasses, 'border-gray-200 text-gray-400 bg-gray-50');
    }

    if (isHoliday) {
      return cn(baseClasses, 'border-red-300 bg-red-50 text-red-700');
    }

    if (isWeekend) {
      return cn(baseClasses, 'border-gray-300 bg-gray-50 text-gray-600');
    }

    if (hasApprovedLeaves) {
      return cn(baseClasses, 'border-green-300 bg-green-50 text-green-800');
    }

    if (hasPendingLeaves) {
      return cn(baseClasses, 'border-yellow-300 bg-yellow-50 text-yellow-800');
    }

    return cn(baseClasses, 'border-gray-200 hover:border-gray-300 bg-white text-gray-900');
  };

  const buttonContent = (
    <Button
      variant="ghost"
      className={getButtonClasses()}
      onClick={() => onClick?.(date)}
    >
      <div className="flex flex-col items-center justify-center w-full h-full">
        {/* Day Number */}
        <span className={cn(
          'font-medium',
          isCompact ? 'text-xs' : isDetailed ? 'text-lg' : 'text-sm'
        )}>
          {dayNumber}
        </span>

        {/* Leave Indicators */}
        {hasLeaves && !isCompact && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
            {leaves.length === 1 ? (
              <LeaveIndicatorDot
                leave={leaves[0]}
                size={isDetailed ? 'md' : 'sm'}
                showStatus={isDetailed}
              />
            ) : (
              <div className="flex gap-0.5">
                {leaves.slice(0, 3).map((leave, index) => (
                  <LeaveIndicatorDot
                    key={index}
                    leave={leave}
                    size="sm"
                  />
                ))}
                {leaves.length > 3 && (
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                )}
              </div>
            )}
          </div>
        )}

        {/* Compact indicators */}
        {hasLeaves && isCompact && (
          <div className="absolute top-0 right-0">
            <div className={cn(
              'w-1.5 h-1.5 rounded-full',
              hasApprovedLeaves ? 'bg-green-500' :
              hasPendingLeaves ? 'bg-yellow-500' :
              hasRejectedLeaves ? 'bg-red-500' : 'bg-gray-500'
            )} />
          </div>
        )}

        {/* Today indicator */}
        {isToday && (
          <div className="absolute top-1 right-1">
            <div className="w-1 h-1 rounded-full bg-purple-600" />
          </div>
        )}

        {/* Holiday indicator */}
        {isHoliday && (
          <div className="absolute top-1 left-1">
            <div className="text-xs">🎉</div>
          </div>
        )}

        {/* Detailed view extras */}
        {isDetailed && showBadges && (
          <>
            {totalLeaveDays > 0 && (
              <Badge
                variant="secondary"
                className="absolute top-0 left-0 text-xs px-1 py-0"
              >
                {totalLeaveDays}d
              </Badge>
            )}

            {leaves.length > 1 && (
              <Badge
                variant="outline"
                className="absolute top-0 right-0 text-xs px-1 py-0"
              >
                {leaves.length}
              </Badge>
            )}
          </>
        )}
      </div>
    </Button>
  );

  if (showTooltip && (hasLeaves || isHoliday)) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {buttonContent}
          </TooltipTrigger>
          <TooltipContent side="top" className="p-3">
            <TooltipContent
              date={date}
              leaves={leaves}
              isHoliday={isHoliday}
              holidayName={holidayName}
            />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return buttonContent;
};

export default CustomDayButton;