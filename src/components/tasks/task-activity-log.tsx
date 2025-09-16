import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  Activity,
  Plus,
  Edit,
  Trash2,
  User,
  Calendar,
  Tag,
  CheckSquare,
  MessageSquare,
  FileText,
  Clock,
  ArrowRight,
  Target,
  Users,
  Paperclip,
  Flag,
  Archive,
  RefreshCw,
  Settings,
  Filter
} from 'lucide-react';

export type ActivityType =
  | 'created'
  | 'updated'
  | 'deleted'
  | 'assigned'
  | 'unassigned'
  | 'status_changed'
  | 'priority_changed'
  | 'due_date_changed'
  | 'tag_added'
  | 'tag_removed'
  | 'subtask_added'
  | 'subtask_completed'
  | 'checklist_updated'
  | 'comment_added'
  | 'attachment_added'
  | 'attachment_removed'
  | 'time_logged'
  | 'moved'
  | 'copied'
  | 'archived'
  | 'restored'
  | 'flagged'
  | 'unflagged';

export interface ActivityData {
  id: number;
  type: ActivityType;
  user: {
    id: number;
    name: string;
    avatar?: string;
    role?: string;
  };
  timestamp: string;
  details: {
    field?: string;
    oldValue?: any;
    newValue?: any;
    description?: string;
    target?: {
      id: number;
      name: string;
      type: string;
    };
    metadata?: Record<string, any>;
  };
  isImportant?: boolean;
  isSystem?: boolean;
}

export interface TaskActivityLogProps {
  taskId: number;
  activities: ActivityData[];
  variant?: 'default' | 'compact' | 'timeline';
  maxHeight?: string;
  showFilters?: boolean;
  showUserFilter?: boolean;
  showTypeFilter?: boolean;
  showTimeFilter?: boolean;
  groupByDate?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
  className?: string;
}

const ActivityIcon: React.FC<{ type: ActivityType; className?: string }> = ({ type, className = 'h-4 w-4' }) => {
  const iconMap: Record<ActivityType, React.ReactElement> = {
    created: <Plus className={className} />,
    updated: <Edit className={className} />,
    deleted: <Trash2 className={className} />,
    assigned: <User className={className} />,
    unassigned: <User className={className} />,
    status_changed: <RefreshCw className={className} />,
    priority_changed: <Flag className={className} />,
    due_date_changed: <Calendar className={className} />,
    tag_added: <Tag className={className} />,
    tag_removed: <Tag className={className} />,
    subtask_added: <Plus className={className} />,
    subtask_completed: <CheckSquare className={className} />,
    checklist_updated: <CheckSquare className={className} />,
    comment_added: <MessageSquare className={className} />,
    attachment_added: <Paperclip className={className} />,
    attachment_removed: <Paperclip className={className} />,
    time_logged: <Clock className={className} />,
    moved: <ArrowRight className={className} />,
    copied: <FileText className={className} />,
    archived: <Archive className={className} />,
    restored: <RefreshCw className={className} />,
    flagged: <Flag className={className} />,
    unflagged: <Flag className={className} />
  };

  return iconMap[type] || <Activity className={className} />;
};

const ActivityItem: React.FC<{
  activity: ActivityData;
  variant: 'default' | 'compact' | 'timeline';
  showDate: boolean;
}> = ({ activity, variant, showDate }) => {
  const { t } = useTranslation();

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return t('justNow');
    if (diffInMinutes < 60) return t('minutesAgo', { minutes: diffInMinutes });
    if (diffInMinutes < 1440) return t('hoursAgo', { hours: Math.floor(diffInMinutes / 60) });

    if (showDate) {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    return t('daysAgo', { days: Math.floor(diffInMinutes / 1440) });
  };

  const getActivityMessage = () => {
    const { type, details, user } = activity;
    const userName = user.name;

    switch (type) {
      case 'created':
        return t('activityCreated', { user: userName });
      case 'updated':
        return t('activityUpdated', { user: userName, field: details.field });
      case 'assigned':
        return t('activityAssigned', {
          user: userName,
          assignee: details.target?.name || details.newValue
        });
      case 'unassigned':
        return t('activityUnassigned', {
          user: userName,
          assignee: details.target?.name || details.oldValue
        });
      case 'status_changed':
        return t('activityStatusChanged', {
          user: userName,
          from: details.oldValue,
          to: details.newValue
        });
      case 'priority_changed':
        return t('activityPriorityChanged', {
          user: userName,
          from: details.oldValue,
          to: details.newValue
        });
      case 'due_date_changed':
        return t('activityDueDateChanged', {
          user: userName,
          date: details.newValue ? new Date(details.newValue).toLocaleDateString() : t('removed')
        });
      case 'tag_added':
        return t('activityTagAdded', { user: userName, tag: details.newValue });
      case 'tag_removed':
        return t('activityTagRemoved', { user: userName, tag: details.oldValue });
      case 'comment_added':
        return t('activityCommentAdded', { user: userName });
      case 'attachment_added':
        return t('activityAttachmentAdded', { user: userName, file: details.target?.name });
      case 'time_logged':
        return t('activityTimeLogged', { user: userName, time: details.newValue });
      case 'subtask_added':
        return t('activitySubtaskAdded', { user: userName, subtask: details.target?.name });
      case 'subtask_completed':
        return t('activitySubtaskCompleted', { user: userName, subtask: details.target?.name });
      case 'moved':
        return t('activityMoved', { user: userName, from: details.oldValue, to: details.newValue });
      case 'archived':
        return t('activityArchived', { user: userName });
      case 'restored':
        return t('activityRestored', { user: userName });
      default:
        return details.description || t('activityGeneric', { user: userName, type });
    }
  };

  const getActivityColor = () => {
    const colorMap: Record<ActivityType, string> = {
      created: 'text-green-600',
      updated: 'text-blue-600',
      deleted: 'text-red-600',
      assigned: 'text-purple-600',
      unassigned: 'text-gray-600',
      status_changed: 'text-blue-600',
      priority_changed: 'text-orange-600',
      due_date_changed: 'text-yellow-600',
      tag_added: 'text-green-600',
      tag_removed: 'text-red-600',
      comment_added: 'text-blue-600',
      attachment_added: 'text-gray-600',
      time_logged: 'text-indigo-600',
      moved: 'text-purple-600',
      archived: 'text-gray-600',
      restored: 'text-green-600',
      flagged: 'text-red-600',
      unflagged: 'text-gray-600',
      subtask_added: 'text-green-600',
      subtask_completed: 'text-blue-600',
      checklist_updated: 'text-blue-600',
      attachment_removed: 'text-red-600',
      copied: 'text-gray-600'
    };

    return colorMap[activity.type] || 'text-gray-600';
  };

  const isCompact = variant === 'compact';
  const isTimeline = variant === 'timeline';

  return (
    <div className={`flex gap-3 ${isCompact ? 'py-1' : 'py-2'} ${activity.isImportant ? 'bg-yellow-50 -mx-2 px-2 rounded' : ''}`}>
      {/* Timeline connector */}
      {isTimeline && (
        <div className="flex flex-col items-center">
          <div className={`rounded-full p-1 ${getActivityColor()} bg-white border-2 border-current`}>
            <ActivityIcon type={activity.type} className="h-3 w-3" />
          </div>
          <div className="flex-1 w-px bg-gray-200 mt-1" />
        </div>
      )}

      {/* Avatar */}
      {!isCompact && !activity.isSystem && (
        <Avatar className={isTimeline ? 'h-6 w-6' : 'h-8 w-8'}>
          <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
          <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
      )}

      {/* Icon for compact/system activities */}
      {(isCompact || activity.isSystem) && !isTimeline && (
        <div className={`${getActivityColor()} mt-1`}>
          <ActivityIcon type={activity.type} />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className={`flex items-center gap-2 ${isCompact ? 'text-sm' : ''}`}>
          {/* Message */}
          <span className="text-gray-900">
            {getActivityMessage()}
          </span>

          {/* Badges */}
          {activity.isImportant && (
            <Badge variant="secondary" className="text-xs">
              {t('important')}
            </Badge>
          )}

          {activity.isSystem && (
            <Badge variant="outline" className="text-xs">
              {t('system')}
            </Badge>
          )}

          {activity.user.role && !isCompact && (
            <Badge variant="secondary" className="text-xs">
              {activity.user.role}
            </Badge>
          )}
        </div>

        {/* Timestamp */}
        <div className={`text-gray-500 ${isCompact ? 'text-xs' : 'text-sm'} mt-0.5`}>
          {formatTime(activity.timestamp)}
        </div>

        {/* Details */}
        {activity.details.metadata && Object.keys(activity.details.metadata).length > 0 && !isCompact && (
          <div className="mt-1 text-sm text-gray-600">
            {Object.entries(activity.details.metadata).map(([key, value]) => (
              <div key={key} className="flex gap-2">
                <span className="font-medium">{key}:</span>
                <span>{String(value)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const TaskActivityLog: React.FC<TaskActivityLogProps> = ({
  taskId,
  activities,
  variant = 'default',
  maxHeight = '400px',
  showFilters = true,
  showUserFilter = true,
  showTypeFilter = true,
  showTimeFilter = true,
  groupByDate = false,
  onLoadMore,
  hasMore = false,
  isLoading = false,
  className = ''
}) => {
  const { t } = useTranslation();
  const [userFilter, setUserFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<ActivityType[]>([]);
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month' | 'all'>('all');

  const uniqueUsers = Array.from(new Set(activities.map(a => a.user.id)))
    .map(id => activities.find(a => a.user.id === id)?.user)
    .filter(Boolean);

  const activityTypes: ActivityType[] = [
    'created', 'updated', 'assigned', 'status_changed', 'priority_changed',
    'comment_added', 'attachment_added', 'time_logged'
  ];

  const filteredActivities = activities.filter(activity => {
    // User filter
    if (userFilter.length > 0 && !userFilter.includes(activity.user.id.toString())) {
      return false;
    }

    // Type filter
    if (typeFilter.length > 0 && !typeFilter.includes(activity.type)) {
      return false;
    }

    // Time filter
    if (timeFilter !== 'all') {
      const now = new Date();
      const activityDate = new Date(activity.timestamp);
      const diffInDays = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));

      switch (timeFilter) {
        case 'today':
          if (diffInDays > 0) return false;
          break;
        case 'week':
          if (diffInDays > 7) return false;
          break;
        case 'month':
          if (diffInDays > 30) return false;
          break;
      }
    }

    return true;
  });

  const groupedActivities = groupByDate
    ? filteredActivities.reduce((groups, activity) => {
        const date = new Date(activity.timestamp).toDateString();
        if (!groups[date]) groups[date] = [];
        groups[date].push(activity);
        return groups;
      }, {} as Record<string, ActivityData[]>)
    : { all: filteredActivities };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-gray-500" />
          <span className="font-medium">
            {t('activityLog')} ({activities.length})
          </span>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="flex items-center gap-2">
            {showUserFilter && uniqueUsers.length > 1 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    {userFilter.length > 0 ? `${userFilter.length} users` : t('allUsers')}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {uniqueUsers.map((user) => (
                    <DropdownMenuCheckboxItem
                      key={user!.id}
                      checked={userFilter.includes(user!.id.toString())}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setUserFilter([...userFilter, user!.id.toString()]);
                        } else {
                          setUserFilter(userFilter.filter(id => id !== user!.id.toString()));
                        }
                      }}
                    >
                      {user!.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {showTypeFilter && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    {typeFilter.length > 0 ? `${typeFilter.length} types` : t('allTypes')}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {activityTypes.map((type) => (
                    <DropdownMenuCheckboxItem
                      key={type}
                      checked={typeFilter.includes(type)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setTypeFilter([...typeFilter, type]);
                        } else {
                          setTypeFilter(typeFilter.filter(t => t !== type));
                        }
                      }}
                    >
                      <ActivityIcon type={type} className="h-4 w-4 mr-2" />
                      {t(`activityType.${type}`)}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {showTimeFilter && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Clock className="h-4 w-4 mr-2" />
                    {t(`timeFilter.${timeFilter}`)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {(['all', 'today', 'week', 'month'] as const).map((filter) => (
                    <DropdownMenuCheckboxItem
                      key={filter}
                      checked={timeFilter === filter}
                      onCheckedChange={() => setTimeFilter(filter)}
                    >
                      {t(`timeFilter.${filter}`)}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </div>

      {/* Activities */}
      <ScrollArea style={{ maxHeight }}>
        <div className={variant === 'timeline' ? 'relative' : 'space-y-1'}>
          {Object.entries(groupedActivities).map(([date, dateActivities]) => (
            <div key={date}>
              {/* Date separator */}
              {groupByDate && date !== 'all' && (
                <div className="flex items-center gap-2 py-2 mb-2">
                  <div className="h-px bg-gray-200 flex-1" />
                  <span className="text-xs text-gray-500 font-medium bg-white px-2">
                    {new Date(date).toLocaleDateString()}
                  </span>
                  <div className="h-px bg-gray-200 flex-1" />
                </div>
              )}

              {/* Activities for this date */}
              <div className={variant === 'timeline' ? 'space-y-2' : 'space-y-1'}>
                {dateActivities.map((activity, index) => (
                  <ActivityItem
                    key={activity.id}
                    activity={activity}
                    variant={variant}
                    showDate={!groupByDate}
                  />
                ))}
              </div>
            </div>
          ))}

          {filteredActivities.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>{t('noActivitiesFound')}</p>
              {(userFilter.length > 0 || typeFilter.length > 0 || timeFilter !== 'all') && (
                <p className="text-sm mt-1">{t('tryAdjustingFilters')}</p>
              )}
            </div>
          )}
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="text-center py-4">
            <Button
              variant="outline"
              onClick={onLoadMore}
              disabled={isLoading}
              size="sm"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  {t('loading')}
                </>
              ) : (
                t('loadMore')
              )}
            </Button>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default TaskActivityLog;