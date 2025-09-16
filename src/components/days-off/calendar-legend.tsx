import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  CalendarDays,
  Heart,
  User,
  Baby,
  AlertTriangle,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  MapPin,
  Eye,
  EyeOff,
  Settings,
  Info,
  Sparkles
} from 'lucide-react';

export type LeaveType = 'vacation' | 'sick' | 'personal' | 'maternity' | 'emergency' | 'other';
export type LeaveStatus = 'approved' | 'pending' | 'rejected' | 'partial' | 'cancelled';
export type CalendarItemType = 'leave' | 'holiday' | 'weekend' | 'today' | 'selected' | 'other-month';

export interface LegendItem {
  type: LeaveType | CalendarItemType;
  label: string;
  color: string;
  icon?: React.ElementType;
  count?: number;
  description?: string;
  visible: boolean;
}

export interface StatusLegendItem {
  status: LeaveStatus;
  label: string;
  color: string;
  icon: React.ElementType;
  count?: number;
  description?: string;
}

export interface CalendarLegendProps {
  leaveTypes?: LegendItem[];
  statusTypes?: StatusLegendItem[];
  calendarItems?: LegendItem[];
  onVisibilityChange?: (type: string, visible: boolean) => void;
  variant?: 'default' | 'compact' | 'detailed' | 'sidebar';
  orientation?: 'horizontal' | 'vertical';
  showCounts?: boolean;
  showToggles?: boolean;
  showDescriptions?: boolean;
  showTabs?: boolean;
  collapsible?: boolean;
  className?: string;
}

const DEFAULT_LEAVE_TYPES: LegendItem[] = [
  {
    type: 'vacation',
    label: 'vacation',
    color: 'bg-blue-500',
    icon: CalendarDays,
    visible: true,
    description: 'Planned time off for rest and recreation'
  },
  {
    type: 'sick',
    label: 'sickLeave',
    color: 'bg-red-500',
    icon: Heart,
    visible: true,
    description: 'Medical leave for health-related issues'
  },
  {
    type: 'personal',
    label: 'personalLeave',
    color: 'bg-green-500',
    icon: User,
    visible: true,
    description: 'Personal time off for private matters'
  },
  {
    type: 'maternity',
    label: 'maternityLeave',
    color: 'bg-purple-500',
    icon: Baby,
    visible: true,
    description: 'Parental leave for new parents'
  },
  {
    type: 'emergency',
    label: 'emergencyLeave',
    color: 'bg-orange-500',
    icon: AlertTriangle,
    visible: true,
    description: 'Urgent leave for unexpected situations'
  },
  {
    type: 'other',
    label: 'otherLeave',
    color: 'bg-gray-500',
    icon: Calendar,
    visible: true,
    description: 'Other types of leave'
  }
];

const DEFAULT_STATUS_TYPES: StatusLegendItem[] = [
  {
    status: 'approved',
    label: 'approved',
    color: 'text-green-600',
    icon: CheckCircle,
    description: 'Leave request has been approved'
  },
  {
    status: 'pending',
    label: 'pending',
    color: 'text-yellow-600',
    icon: Clock,
    description: 'Leave request is awaiting approval'
  },
  {
    status: 'rejected',
    label: 'rejected',
    color: 'text-red-600',
    icon: XCircle,
    description: 'Leave request has been rejected'
  },
  {
    status: 'partial',
    label: 'partiallyApproved',
    color: 'text-orange-600',
    icon: AlertTriangle,
    description: 'Leave request is partially approved'
  },
  {
    status: 'cancelled',
    label: 'cancelled',
    color: 'text-gray-600',
    icon: XCircle,
    description: 'Leave request has been cancelled'
  }
];

const DEFAULT_CALENDAR_ITEMS: LegendItem[] = [
  {
    type: 'today',
    label: 'today',
    color: 'border-purple-400 bg-purple-50',
    visible: true,
    description: 'Current date'
  },
  {
    type: 'selected',
    label: 'selectedDate',
    color: 'border-blue-500 bg-blue-50',
    visible: true,
    description: 'Selected date'
  },
  {
    type: 'weekend',
    label: 'weekend',
    color: 'bg-gray-100 text-gray-600',
    visible: true,
    description: 'Weekend days'
  },
  {
    type: 'holiday',
    label: 'holiday',
    color: 'border-red-300 bg-red-50',
    visible: true,
    description: 'Public holidays'
  },
  {
    type: 'other-month',
    label: 'otherMonth',
    color: 'text-gray-400 bg-gray-50',
    visible: true,
    description: 'Days from adjacent months'
  }
];

const LegendItemComponent: React.FC<{
  item: LegendItem | StatusLegendItem;
  showCount?: boolean;
  showToggle?: boolean;
  showDescription?: boolean;
  variant: 'default' | 'compact' | 'detailed' | 'sidebar';
  onToggle?: (visible: boolean) => void;
}> = ({ item, showCount = false, showToggle = false, showDescription = false, variant, onToggle }) => {
  const { t } = useTranslation();
  const isCompact = variant === 'compact';
  const isDetailed = variant === 'detailed';

  const itemContent = (
    <div className={cn(
      'flex items-center gap-2 p-2 rounded-lg transition-all duration-200',
      isCompact ? 'p-1' : 'p-2',
      showToggle && 'hover:bg-gray-50'
    )}>
      {/* Color indicator */}
      <div className="flex items-center gap-2">
        {'color' in item ? (
          <div
            className={cn(
              'rounded-full flex-shrink-0',
              isCompact ? 'w-2 h-2' : 'w-3 h-3',
              item.color.startsWith('bg-') ? item.color : 'bg-gray-300'
            )}
            style={!item.color.startsWith('bg-') ? { backgroundColor: item.color } : undefined}
          />
        ) : (
          <item.icon className={cn(
            'flex-shrink-0',
            isCompact ? 'h-3 w-3' : 'h-4 w-4',
            item.color
          )} />
        )}

        {'icon' in item && item.icon && (
          <item.icon className={cn(
            'flex-shrink-0 text-gray-600',
            isCompact ? 'h-3 w-3' : 'h-4 w-4'
          )} />
        )}
      </div>

      {/* Label and details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn(
            'font-medium',
            isCompact ? 'text-xs' : 'text-sm',
            !('visible' in item) || item.visible ? 'text-gray-900' : 'text-gray-500'
          )}>
            {t(`leaveType.${item.label}`) || t(item.label)}
          </span>

          {showCount && item.count !== undefined && (
            <Badge
              variant="secondary"
              className={cn(
                'text-xs',
                isCompact && 'px-1 py-0'
              )}
            >
              {item.count}
            </Badge>
          )}
        </div>

        {showDescription && item.description && !isCompact && (
          <p className="text-xs text-gray-500 mt-1">
            {item.description}
          </p>
        )}
      </div>

      {/* Visibility toggle */}
      {showToggle && 'visible' in item && (
        <div className="flex items-center gap-1">
          <Switch
            checked={item.visible}
            onCheckedChange={onToggle}
            size="sm"
          />
          {isDetailed && (
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              {item.visible ? (
                <Eye className="h-3 w-3" />
              ) : (
                <EyeOff className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );

  if (showDescription && item.description && !isCompact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {itemContent}
          </TooltipTrigger>
          <TooltipContent>
            <div className="max-w-xs text-sm">
              {item.description}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return itemContent;
};

const LegendSection: React.FC<{
  title: string;
  items: (LegendItem | StatusLegendItem)[];
  showCount?: boolean;
  showToggle?: boolean;
  showDescription?: boolean;
  variant: 'default' | 'compact' | 'detailed' | 'sidebar';
  orientation: 'horizontal' | 'vertical';
  onItemToggle?: (type: string, visible: boolean) => void;
}> = ({
  title,
  items,
  showCount,
  showToggle,
  showDescription,
  variant,
  orientation,
  onItemToggle
}) => {
  const { t } = useTranslation();
  const isCompact = variant === 'compact';

  return (
    <div className="space-y-2">
      <h4 className={cn(
        'font-medium text-gray-700',
        isCompact ? 'text-sm' : 'text-base'
      )}>
        {t(title)}
      </h4>

      <div className={cn(
        'space-y-1',
        orientation === 'horizontal' && !isCompact && 'flex flex-wrap gap-4 space-y-0'
      )}>
        {items.map((item) => (
          <LegendItemComponent
            key={'type' in item ? item.type : item.status}
            item={item}
            showCount={showCount}
            showToggle={showToggle}
            showDescription={showDescription}
            variant={variant}
            onToggle={(visible) => {
              const key = 'type' in item ? item.type.toString() : item.status;
              onItemToggle?.(key, visible);
            }}
          />
        ))}
      </div>
    </div>
  );
};

const SummarySection: React.FC<{
  leaveTypes?: LegendItem[];
  variant: 'default' | 'compact' | 'detailed' | 'sidebar';
}> = ({ leaveTypes = [], variant }) => {
  const { t } = useTranslation();
  const isCompact = variant === 'compact';

  const totalLeaves = leaveTypes.reduce((sum, item) => sum + (item.count || 0), 0);
  const visibleTypes = leaveTypes.filter(item => item.visible).length;
  const totalTypes = leaveTypes.length;

  if (isCompact || totalLeaves === 0) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue-600" />
          <span className="font-medium text-blue-900">{t('summary')}</span>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-gray-600">{t('total')}:</span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {totalLeaves}
            </Badge>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-gray-600">{t('showing')}:</span>
            <span className="font-medium text-blue-900">
              {visibleTypes}/{totalTypes} {t('types')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CalendarLegend: React.FC<CalendarLegendProps> = ({
  leaveTypes = DEFAULT_LEAVE_TYPES,
  statusTypes = DEFAULT_STATUS_TYPES,
  calendarItems = DEFAULT_CALENDAR_ITEMS,
  onVisibilityChange,
  variant = 'default',
  orientation = 'vertical',
  showCounts = true,
  showToggles = false,
  showDescriptions = false,
  showTabs = true,
  collapsible = false,
  className
}) => {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const isCompact = variant === 'compact';
  const isSidebar = variant === 'sidebar';

  const handleItemToggle = (type: string, visible: boolean) => {
    onVisibilityChange?.(type, visible);
  };

  const legendContent = (
    <div className={cn(
      'space-y-4',
      isCompact && 'space-y-2',
      isSidebar && 'space-y-6'
    )}>
      {/* Summary Section */}
      <SummarySection leaveTypes={leaveTypes} variant={variant} />

      {/* Tabbed Content */}
      {showTabs && !isCompact ? (
        <Tabs defaultValue="leaves" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="leaves">{t('leaveTypes')}</TabsTrigger>
            <TabsTrigger value="status">{t('status')}</TabsTrigger>
            <TabsTrigger value="calendar">{t('calendar')}</TabsTrigger>
          </TabsList>

          <TabsContent value="leaves" className="space-y-2 mt-4">
            <LegendSection
              title="leaveTypes"
              items={leaveTypes}
              showCount={showCounts}
              showToggle={showToggles}
              showDescription={showDescriptions}
              variant={variant}
              orientation={orientation}
              onItemToggle={handleItemToggle}
            />
          </TabsContent>

          <TabsContent value="status" className="space-y-2 mt-4">
            <LegendSection
              title="leaveStatus"
              items={statusTypes}
              showCount={showCounts}
              showToggle={false}
              showDescription={showDescriptions}
              variant={variant}
              orientation={orientation}
              onItemToggle={handleItemToggle}
            />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-2 mt-4">
            <LegendSection
              title="calendarItems"
              items={calendarItems}
              showCount={false}
              showToggle={showToggles}
              showDescription={showDescriptions}
              variant={variant}
              orientation={orientation}
              onItemToggle={handleItemToggle}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-4">
          <LegendSection
            title="leaveTypes"
            items={leaveTypes}
            showCount={showCounts}
            showToggle={showToggles}
            showDescription={showDescriptions}
            variant={variant}
            orientation={orientation}
            onItemToggle={handleItemToggle}
          />

          {!isCompact && (
            <>
              <LegendSection
                title="leaveStatus"
                items={statusTypes}
                showCount={showCounts}
                showToggle={false}
                showDescription={showDescriptions}
                variant={variant}
                orientation={orientation}
                onItemToggle={handleItemToggle}
              />

              <LegendSection
                title="calendarItems"
                items={calendarItems}
                showCount={false}
                showToggle={showToggles}
                showDescription={showDescriptions}
                variant={variant}
                orientation={orientation}
                onItemToggle={handleItemToggle}
              />
            </>
          )}
        </div>
      )}
    </div>
  );

  if (isSidebar) {
    return (
      <div className={cn('w-64 h-full', className)}>
        <Card className="h-full">
          <CardHeader className={cn(
            'pb-2',
            collapsible && 'pb-0'
          )}>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Info className="h-5 w-5" />
                {t('legend')}
              </CardTitle>

              {collapsible && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="h-8 w-8 p-0"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>

          {(!collapsible || !isCollapsed) && (
            <CardContent className="pt-2">
              {legendContent}
            </CardContent>
          )}
        </Card>
      </div>
    );
  }

  if (isCompact) {
    return (
      <div className={cn('flex items-center gap-4 flex-wrap', className)}>
        {leaveTypes.slice(0, 4).map((item) => (
          <div key={item.type} className="flex items-center gap-1">
            <div className={cn('w-2 h-2 rounded-full', item.color)} />
            <span className="text-xs text-gray-600">
              {t(`leaveType.${item.label}`)}
              {showCounts && item.count !== undefined && ` (${item.count})`}
            </span>
          </div>
        ))}
        {leaveTypes.length > 4 && (
          <span className="text-xs text-gray-500">
            +{leaveTypes.length - 4} {t('more')}
          </span>
        )}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className={cn(
        'pb-4',
        isCompact && 'pb-2'
      )}>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            {t('legend')}
          </CardTitle>

          {collapsible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </CardHeader>

      {(!collapsible || !isCollapsed) && (
        <CardContent className="pt-0">
          {legendContent}
        </CardContent>
      )}
    </Card>
  );
};

export default CalendarLegend;