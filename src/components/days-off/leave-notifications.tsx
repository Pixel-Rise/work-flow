import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle, XCircle, Clock, AlertTriangle, Calendar, X } from 'lucide-react';

export interface LeaveNotification {
  id: string;
  type: 'request_approved' | 'request_rejected' | 'request_pending' | 'balance_low' | 'expiring_soon' | 'team_leave';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionRequired?: boolean;
  relatedLeaveId?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface LeaveNotificationsProps {
  notifications: LeaveNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDismiss: (id: string) => void;
  onAction?: (id: string, action: string) => void;
  variant?: 'default' | 'compact';
  maxVisible?: number;
  className?: string;
}

export const LeaveNotifications: React.FC<LeaveNotificationsProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss,
  onAction,
  variant = 'default',
  maxVisible = 5,
  className = ''
}) => {
  const { t } = useTranslation();
  const isCompact = variant === 'compact';

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const visibleNotifications = notifications.slice(0, maxVisible);

  const getIcon = (type: string) => {
    switch (type) {
      case 'request_approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'request_rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'request_pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'balance_low':
      case 'expiring_soon':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'team_leave':
        return <Calendar className="h-4 w-4 text-blue-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200';
    }
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return t('justNow');
    if (diffInMinutes < 60) return t('minutesAgo', { minutes: diffInMinutes });
    if (diffInMinutes < 1440) return t('hoursAgo', { hours: Math.floor(diffInMinutes / 60) });
    return t('daysAgo', { days: Math.floor(diffInMinutes / 1440) });
  };

  if (notifications.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center text-gray-500">
          <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>{t('noNotifications')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h3 className="font-medium">{t('notifications')}</h3>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              {unreadCount}
            </Badge>
          )}
        </div>

        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onMarkAllAsRead}>
            {t('markAllAsRead')}
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {visibleNotifications.map((notification) => (
          <Card
            key={notification.id}
            className={`transition-all hover:shadow-md ${
              !notification.isRead ? 'bg-blue-50 border-blue-200' : ''
            } ${getPriorityColor(notification.priority)}`}
          >
            <CardContent className={`p-${isCompact ? '3' : '4'}`}>
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="mt-1">
                  {getIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className={`font-medium ${isCompact ? 'text-sm' : ''} ${
                      !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                    }`}>
                      {notification.title}
                    </h4>

                    <div className="flex items-center gap-1 ml-2">
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDismiss(notification.id)}
                        className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <p className={`text-gray-600 ${isCompact ? 'text-xs' : 'text-sm'} mb-2`}>
                    {notification.message}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className={`text-gray-500 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                      {formatTime(notification.timestamp)}
                    </span>

                    <div className="flex items-center gap-2">
                      {notification.actionRequired && onAction && (
                        <Button
                          size="sm"
                          onClick={() => onAction(notification.id, 'view')}
                        >
                          {t('takeAction')}
                        </Button>
                      )}

                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onMarkAsRead(notification.id)}
                          className={isCompact ? 'text-xs' : 'text-sm'}
                        >
                          {t('markAsRead')}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Show More */}
      {notifications.length > maxVisible && (
        <div className="text-center">
          <Button variant="outline" size="sm">
            {t('showMore')} ({notifications.length - maxVisible} {t('more')})
          </Button>
        </div>
      )}
    </div>
  );
};

export default LeaveNotifications;