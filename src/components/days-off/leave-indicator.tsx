import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  Calendar,
  Eye,
  MoreHorizontal,
  Users,
  MapPin
} from 'lucide-react';

export type LeaveStatus = 'approved' | 'pending' | 'rejected' | 'partial' | 'cancelled';
export type LeaveType = 'vacation' | 'sick' | 'personal' | 'maternity' | 'emergency' | 'other';

export interface LeaveItem {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  type: LeaveType;
  status: LeaveStatus;
  startDate: string;
  endDate: string;
  isHalfDay?: boolean;
  period?: 'morning' | 'afternoon';
  reason?: string;
  duration: number;
  location?: string;
  urgent?: boolean;
}

export interface LeaveIndicatorProps {
  leaves: LeaveItem[];
  variant?: 'dot' | 'bar' | 'pill' | 'card' | 'timeline';
  size?: 'sm' | 'md' | 'lg';
  maxVisible?: number;
  showTooltip?: boolean;
  showEmployee?: boolean;
  showStatus?: boolean;
  showType?: boolean;
  showDuration?: boolean;
  groupBy?: 'type' | 'status' | 'employee' | 'none';
  orientation?: 'horizontal' | 'vertical';
  interactive?: boolean;
  onLeaveClick?: (leave: LeaveItem) => void;
  onEmployeeClick?: (employeeId: string) => void;
  className?: string;
}

const getLeaveTypeIcon = (type: LeaveType, size: string = 'h-4 w-4') => {
  const icons = {
    vacation: CalendarDays,
    sick: Heart,
    personal: User,
    maternity: Baby,
    emergency: AlertTriangle,
    other: Calendar
  };
  const IconComponent = icons[type] || Calendar;
  return <IconComponent className={size} />;
};

const getStatusIcon = (status: LeaveStatus, size: string = 'h-3 w-3') => {
  const icons = {
    approved: CheckCircle,
    rejected: XCircle,
    pending: Clock,
    partial: AlertTriangle,
    cancelled: XCircle
  };
  const IconComponent = icons[status] || Clock;
  return <IconComponent className={size} />;
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

const getStatusColor = (status: LeaveStatus) => {
  const colors = {
    approved: 'text-green-600 bg-green-50 border-green-200',
    rejected: 'text-red-600 bg-red-50 border-red-200',
    pending: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    partial: 'text-orange-600 bg-orange-50 border-orange-200',
    cancelled: 'text-gray-600 bg-gray-50 border-gray-200'
  };
  return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
};

const LeaveTooltip: React.FC<{ leave: LeaveItem }> = ({ leave }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-2 max-w-xs">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {getLeaveTypeIcon(leave.type, 'h-4 w-4')}
          <span className="font-medium">{t(`leaveType.${leave.type}`)}</span>
        </div>
        <Badge className={cn('text-xs', getStatusColor(leave.status))}>
          {t(leave.status)}
        </Badge>
      </div>

      <div className="space-y-1 text-sm">
        <div className="flex items-center gap-2">
          <User className="h-3 w-3 text-gray-500" />
          <span>{leave.employeeName}</span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="h-3 w-3 text-gray-500" />
          <span>
            {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3 text-gray-500" />
          <span>
            {leave.duration} {leave.duration === 1 ? t('day') : t('days')}
            {leave.isHalfDay && ` (${t(leave.period || 'halfDay')})`}
          </span>
        </div>

        {leave.location && (
          <div className="flex items-center gap-2">
            <MapPin className="h-3 w-3 text-gray-500" />
            <span>{leave.location}</span>
          </div>
        )}

        {leave.reason && (
          <div className="pt-1 border-t text-xs text-gray-600">
            {leave.reason.length > 100 ? `${leave.reason.substring(0, 100)}...` : leave.reason}
          </div>
        )}
      </div>
    </div>
  );
};

const DotIndicator: React.FC<{
  leaves: LeaveItem[];
  size: 'sm' | 'md' | 'lg';
  maxVisible: number;
  showTooltip: boolean;
  interactive: boolean;
  onLeaveClick?: (leave: LeaveItem) => void;
}> = ({ leaves, size, maxVisible, showTooltip, interactive, onLeaveClick }) => {
  const { t } = useTranslation();
  const visibleLeaves = leaves.slice(0, maxVisible);
  const remainingCount = leaves.length - maxVisible;

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const dotElement = (leave: LeaveItem, index: number) => (
    <div
      key={leave.id}
      className={cn(
        'rounded-full transition-all duration-200 relative',
        sizeClasses[size],
        getTypeColor(leave.type),
        interactive && 'cursor-pointer hover:scale-125',
        leave.urgent && 'animate-pulse'
      )}
      onClick={() => interactive && onLeaveClick?.(leave)}
    >
      {leave.status === 'pending' && (
        <div className="absolute -top-0.5 -right-0.5">
          <div className="w-1 h-1 bg-yellow-400 rounded-full" />
        </div>
      )}
    </div>
  );

  return (
    <div className="flex items-center gap-1">
      {visibleLeaves.map((leave, index) =>
        showTooltip ? (
          <TooltipProvider key={leave.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                {dotElement(leave, index)}
              </TooltipTrigger>
              <TooltipContent>
                <LeaveTooltip leave={leave} />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          dotElement(leave, index)
        )
      )}

      {remainingCount > 0 && (
        <div className={cn(
          'rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600 font-medium',
          size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'
        )}>
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

const BarIndicator: React.FC<{
  leaves: LeaveItem[];
  orientation: 'horizontal' | 'vertical';
  showTooltip: boolean;
}> = ({ leaves, orientation, showTooltip }) => {
  const totalDuration = leaves.reduce((sum, leave) => sum + leave.duration, 0);
  const approvedDuration = leaves.filter(l => l.status === 'approved').reduce((sum, l) => sum + l.duration, 0);
  const pendingDuration = leaves.filter(l => l.status === 'pending').reduce((sum, l) => sum + l.duration, 0);

  const approvedPercentage = (approvedDuration / totalDuration) * 100;
  const pendingPercentage = (pendingDuration / totalDuration) * 100;

  const barElement = (
    <div className={cn(
      'flex overflow-hidden rounded-full bg-gray-200',
      orientation === 'horizontal' ? 'h-2 w-full' : 'w-2 h-16 flex-col'
    )}>
      <div
        className="bg-green-500 transition-all duration-500"
        style={orientation === 'horizontal'
          ? { width: `${approvedPercentage}%` }
          : { height: `${approvedPercentage}%` }
        }
      />
      <div
        className="bg-yellow-500 transition-all duration-500"
        style={orientation === 'horizontal'
          ? { width: `${pendingPercentage}%` }
          : { height: `${pendingPercentage}%` }
        }
      />
    </div>
  );

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {barElement}
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1 text-sm">
              <div>Total: {totalDuration} days</div>
              <div className="text-green-600">Approved: {approvedDuration} days</div>
              <div className="text-yellow-600">Pending: {pendingDuration} days</div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return barElement;
};

const PillIndicator: React.FC<{
  leaves: LeaveItem[];
  size: 'sm' | 'md' | 'lg';
  maxVisible: number;
  showEmployee: boolean;
  showStatus: boolean;
  showType: boolean;
  interactive: boolean;
  onLeaveClick?: (leave: LeaveItem) => void;
}> = ({ leaves, size, maxVisible, showEmployee, showStatus, showType, interactive, onLeaveClick }) => {
  const { t } = useTranslation();
  const visibleLeaves = leaves.slice(0, maxVisible);
  const remainingCount = leaves.length - maxVisible;

  const textSizeClass = size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base';

  return (
    <div className="flex flex-wrap gap-1">
      {visibleLeaves.map((leave) => (
        <Badge
          key={leave.id}
          variant="outline"
          className={cn(
            'cursor-pointer transition-all duration-200 hover:shadow-md',
            textSizeClass,
            getStatusColor(leave.status),
            !interactive && 'cursor-default'
          )}
          onClick={() => interactive && onLeaveClick?.(leave)}
        >
          <div className="flex items-center gap-1">
            {showType && getLeaveTypeIcon(leave.type, 'h-3 w-3')}

            {showEmployee && (
              <span className="font-medium">{leave.employeeName.split(' ')[0]}</span>
            )}

            <span>{leave.duration}d</span>

            {showStatus && getStatusIcon(leave.status, 'h-3 w-3')}
          </div>
        </Badge>
      ))}

      {remainingCount > 0 && (
        <Badge variant="secondary" className={textSizeClass}>
          +{remainingCount}
        </Badge>
      )}
    </div>
  );
};

const CardIndicator: React.FC<{
  leaves: LeaveItem[];
  maxVisible: number;
  showEmployee: boolean;
  showStatus: boolean;
  showType: boolean;
  showDuration: boolean;
  interactive: boolean;
  onLeaveClick?: (leave: LeaveItem) => void;
  onEmployeeClick?: (employeeId: string) => void;
}> = ({
  leaves,
  maxVisible,
  showEmployee,
  showStatus,
  showType,
  showDuration,
  interactive,
  onLeaveClick,
  onEmployeeClick
}) => {
  const { t } = useTranslation();
  const visibleLeaves = leaves.slice(0, maxVisible);
  const remainingCount = leaves.length - maxVisible;

  return (
    <div className="space-y-2">
      {visibleLeaves.map((leave) => (
        <div
          key={leave.id}
          className={cn(
            'flex items-center justify-between p-2 rounded-lg border transition-all duration-200',
            getStatusColor(leave.status),
            interactive && 'cursor-pointer hover:shadow-md'
          )}
          onClick={() => interactive && onLeaveClick?.(leave)}
        >
          <div className="flex items-center gap-2">
            {showType && (
              <div className={cn('w-3 h-3 rounded-full', getTypeColor(leave.type))} />
            )}

            {showEmployee && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 font-medium text-gray-900 hover:text-blue-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onEmployeeClick?.(leave.employeeId);
                }}
              >
                {leave.employeeName}
              </Button>
            )}

            <div className="text-sm text-gray-600">
              {new Date(leave.startDate).toLocaleDateString()}
              {leave.startDate !== leave.endDate && (
                <span> - {new Date(leave.endDate).toLocaleDateString()}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {showDuration && (
              <span className="text-sm font-medium">
                {leave.duration}{leave.isHalfDay ? '.5' : ''}d
              </span>
            )}

            {showStatus && (
              <Badge className={cn('text-xs', getStatusColor(leave.status))}>
                {t(leave.status)}
              </Badge>
            )}

            {interactive && (
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Eye className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      ))}

      {remainingCount > 0 && (
        <div className="flex items-center justify-center p-2 rounded-lg border border-dashed border-gray-300 text-gray-500">
          <MoreHorizontal className="h-4 w-4 mr-2" />
          <span className="text-sm">{remainingCount} more</span>
        </div>
      )}
    </div>
  );
};

const TimelineIndicator: React.FC<{
  leaves: LeaveItem[];
  maxVisible: number;
  showEmployee: boolean;
  showStatus: boolean;
  interactive: boolean;
  onLeaveClick?: (leave: LeaveItem) => void;
}> = ({ leaves, maxVisible, showEmployee, showStatus, interactive, onLeaveClick }) => {
  const { t } = useTranslation();
  const sortedLeaves = [...leaves].sort((a, b) =>
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
  const visibleLeaves = sortedLeaves.slice(0, maxVisible);

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

      <div className="space-y-3">
        {visibleLeaves.map((leave, index) => (
          <div key={leave.id} className="flex items-start gap-3">
            {/* Timeline dot */}
            <div className="relative z-10 flex-shrink-0">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center border-2 bg-white',
                `border-${leave.type === 'vacation' ? 'blue' :
                         leave.type === 'sick' ? 'red' :
                         leave.type === 'personal' ? 'green' :
                         leave.type === 'maternity' ? 'purple' : 'orange'}-500`
              )}>
                {getLeaveTypeIcon(leave.type, 'h-4 w-4')}
              </div>
            </div>

            {/* Content */}
            <div
              className={cn(
                'flex-1 p-3 rounded-lg border bg-white transition-all duration-200',
                interactive && 'cursor-pointer hover:shadow-md'
              )}
              onClick={() => interactive && onLeaveClick?.(leave)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {showEmployee && (
                    <span className="font-medium">{leave.employeeName}</span>
                  )}
                  <span className="text-sm text-gray-600">
                    {t(`leaveType.${leave.type}`)}
                  </span>
                </div>

                {showStatus && (
                  <Badge className={cn('text-xs', getStatusColor(leave.status))}>
                    {t(leave.status)}
                  </Badge>
                )}
              </div>

              <div className="text-sm text-gray-600">
                {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                <span className="ml-2 font-medium">({leave.duration}d)</span>
              </div>

              {leave.reason && (
                <div className="mt-2 text-sm text-gray-500">
                  {leave.reason.length > 80 ? `${leave.reason.substring(0, 80)}...` : leave.reason}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const LeaveIndicator: React.FC<LeaveIndicatorProps> = ({
  leaves,
  variant = 'dot',
  size = 'md',
  maxVisible = 3,
  showTooltip = true,
  showEmployee = false,
  showStatus = false,
  showType = false,
  showDuration = false,
  groupBy = 'none',
  orientation = 'horizontal',
  interactive = false,
  onLeaveClick,
  onEmployeeClick,
  className
}) => {
  if (leaves.length === 0) {
    return null;
  }

  // Group leaves if needed
  let groupedLeaves = { all: leaves };
  if (groupBy !== 'none') {
    groupedLeaves = leaves.reduce((acc, leave) => {
      const key = leave[groupBy as keyof LeaveItem] as string;
      if (!acc[key]) acc[key] = [];
      acc[key].push(leave);
      return acc;
    }, {} as Record<string, LeaveItem[]>);
  }

  return (
    <div className={cn('space-y-2', className)}>
      {Object.entries(groupedLeaves).map(([group, groupLeaves]) => (
        <div key={group} className="space-y-1">
          {groupBy !== 'none' && (
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {group === 'all' ? '' : group}
            </div>
          )}

          {variant === 'dot' && (
            <DotIndicator
              leaves={groupLeaves}
              size={size}
              maxVisible={maxVisible}
              showTooltip={showTooltip}
              interactive={interactive}
              onLeaveClick={onLeaveClick}
            />
          )}

          {variant === 'bar' && (
            <BarIndicator
              leaves={groupLeaves}
              orientation={orientation}
              showTooltip={showTooltip}
            />
          )}

          {variant === 'pill' && (
            <PillIndicator
              leaves={groupLeaves}
              size={size}
              maxVisible={maxVisible}
              showEmployee={showEmployee}
              showStatus={showStatus}
              showType={showType}
              interactive={interactive}
              onLeaveClick={onLeaveClick}
            />
          )}

          {variant === 'card' && (
            <CardIndicator
              leaves={groupLeaves}
              maxVisible={maxVisible}
              showEmployee={showEmployee}
              showStatus={showStatus}
              showType={showType}
              showDuration={showDuration}
              interactive={interactive}
              onLeaveClick={onLeaveClick}
              onEmployeeClick={onEmployeeClick}
            />
          )}

          {variant === 'timeline' && (
            <TimelineIndicator
              leaves={groupLeaves}
              maxVisible={maxVisible}
              showEmployee={showEmployee}
              showStatus={showStatus}
              interactive={interactive}
              onLeaveClick={onLeaveClick}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default LeaveIndicator;