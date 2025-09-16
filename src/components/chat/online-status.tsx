import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export type UserStatus = 'online' | 'away' | 'busy' | 'offline' | 'invisible';

export interface OnlineStatusProps {
  status: UserStatus;
  lastSeen?: string;
  showLabel?: boolean;
  showTooltip?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'dot' | 'badge' | 'indicator' | 'full';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  customText?: string;
  animate?: boolean;
  className?: string;
}

const STATUS_CONFIG = {
  online: {
    color: 'bg-green-500',
    textColor: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    label: 'online',
    description: 'userIsOnline'
  },
  away: {
    color: 'bg-yellow-500',
    textColor: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    label: 'away',
    description: 'userIsAway'
  },
  busy: {
    color: 'bg-red-500',
    textColor: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    label: 'busy',
    description: 'userIsBusy'
  },
  offline: {
    color: 'bg-gray-400',
    textColor: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    label: 'offline',
    description: 'userIsOffline'
  },
  invisible: {
    color: 'bg-gray-300',
    textColor: 'text-gray-500',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    label: 'invisible',
    description: 'userIsInvisible'
  }
};

const SIZE_CONFIG = {
  xs: {
    dot: 'w-2 h-2',
    border: 'border',
    text: 'text-xs',
    badge: 'px-1.5 py-0.5 text-xs'
  },
  sm: {
    dot: 'w-2.5 h-2.5',
    border: 'border',
    text: 'text-xs',
    badge: 'px-2 py-0.5 text-xs'
  },
  md: {
    dot: 'w-3 h-3',
    border: 'border-2',
    text: 'text-sm',
    badge: 'px-2.5 py-1 text-sm'
  },
  lg: {
    dot: 'w-4 h-4',
    border: 'border-2',
    text: 'text-base',
    badge: 'px-3 py-1.5 text-base'
  }
};

const POSITION_CONFIG = {
  'bottom-right': 'absolute -bottom-0.5 -right-0.5',
  'bottom-left': 'absolute -bottom-0.5 -left-0.5',
  'top-right': 'absolute -top-0.5 -right-0.5',
  'top-left': 'absolute -top-0.5 -left-0.5'
};

const StatusDot: React.FC<{
  status: UserStatus;
  size: keyof typeof SIZE_CONFIG;
  animate: boolean;
  position?: keyof typeof POSITION_CONFIG;
  className?: string;
}> = ({ status, size, animate, position, className }) => {
  const config = STATUS_CONFIG[status];
  const sizeConfig = SIZE_CONFIG[size];

  return (
    <div
      className={cn(
        'rounded-full border-white flex-shrink-0',
        config.color,
        sizeConfig.dot,
        sizeConfig.border,
        position && POSITION_CONFIG[position],
        animate && status === 'online' && 'animate-pulse',
        className
      )}
    />
  );
};

const StatusBadge: React.FC<{
  status: UserStatus;
  size: keyof typeof SIZE_CONFIG;
  showLabel: boolean;
  customText?: string;
  className?: string;
}> = ({ status, size, showLabel, customText, className }) => {
  const { t } = useTranslation();
  const config = STATUS_CONFIG[status];
  const sizeConfig = SIZE_CONFIG[size];

  return (
    <Badge
      variant="outline"
      className={cn(
        config.textColor,
        config.bgColor,
        config.borderColor,
        sizeConfig.badge,
        'font-medium',
        className
      )}
    >
      <StatusDot status={status} size="xs" animate={false} className="mr-1.5" />
      {customText || (showLabel ? t(config.label) : '')}
    </Badge>
  );
};

const StatusIndicator: React.FC<{
  status: UserStatus;
  size: keyof typeof SIZE_CONFIG;
  showLabel: boolean;
  animate: boolean;
  customText?: string;
  className?: string;
}> = ({ status, size, showLabel, animate, customText, className }) => {
  const { t } = useTranslation();
  const config = STATUS_CONFIG[status];
  const sizeConfig = SIZE_CONFIG[size];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <StatusDot status={status} size={size} animate={animate} />
      {(showLabel || customText) && (
        <span className={cn(config.textColor, sizeConfig.text, 'font-medium')}>
          {customText || t(config.label)}
        </span>
      )}
    </div>
  );
};

const FullStatus: React.FC<{
  status: UserStatus;
  lastSeen?: string;
  size: keyof typeof SIZE_CONFIG;
  animate: boolean;
  customText?: string;
  className?: string;
}> = ({ status, lastSeen, size, animate, customText, className }) => {
  const { t } = useTranslation();
  const config = STATUS_CONFIG[status];
  const sizeConfig = SIZE_CONFIG[size];

  const getStatusText = () => {
    if (customText) return customText;

    if (status === 'offline' && lastSeen) {
      const lastSeenDate = new Date(lastSeen);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - lastSeenDate.getTime()) / (1000 * 60));

      if (diffInMinutes < 1) {
        return t('lastSeenJustNow');
      } else if (diffInMinutes < 60) {
        return t('lastSeenMinutesAgo', { minutes: diffInMinutes });
      } else if (diffInMinutes < 1440) {
        return t('lastSeenHoursAgo', { hours: Math.floor(diffInMinutes / 60) });
      } else {
        return t('lastSeenDaysAgo', { days: Math.floor(diffInMinutes / 1440) });
      }
    }

    return t(config.label);
  };

  return (
    <div className={cn(
      'flex items-center gap-2 px-3 py-2 rounded-lg',
      config.bgColor,
      config.borderColor,
      'border',
      className
    )}>
      <StatusDot status={status} size={size} animate={animate} />
      <div className="flex flex-col">
        <span className={cn(config.textColor, sizeConfig.text, 'font-medium')}>
          {getStatusText()}
        </span>
        {status === 'offline' && lastSeen && !customText && (
          <span className="text-xs text-gray-500">
            {new Date(lastSeen).toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
};

const TooltipWrapper: React.FC<{
  children: React.ReactNode;
  status: UserStatus;
  lastSeen?: string;
  showTooltip: boolean;
}> = ({ children, status, lastSeen, showTooltip }) => {
  const { t } = useTranslation();
  const config = STATUS_CONFIG[status];

  if (!showTooltip) return <>{children}</>;

  const getTooltipContent = () => {
    if (status === 'offline' && lastSeen) {
      const lastSeenDate = new Date(lastSeen);
      return (
        <div className="text-center">
          <div className="font-medium">{t(config.label)}</div>
          <div className="text-xs opacity-80">
            {t('lastSeen')}: {lastSeenDate.toLocaleString()}
          </div>
        </div>
      );
    }

    return (
      <div className="text-center">
        <div className="font-medium">{t(config.label)}</div>
        <div className="text-xs opacity-80">{t(config.description)}</div>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent>
          {getTooltipContent()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const OnlineStatus: React.FC<OnlineStatusProps> = ({
  status,
  lastSeen,
  showLabel = false,
  showTooltip = true,
  size = 'md',
  variant = 'dot',
  position,
  customText,
  animate = true,
  className
}) => {
  const renderStatusComponent = () => {
    switch (variant) {
      case 'badge':
        return (
          <StatusBadge
            status={status}
            size={size}
            showLabel={showLabel}
            customText={customText}
            className={className}
          />
        );

      case 'indicator':
        return (
          <StatusIndicator
            status={status}
            size={size}
            showLabel={showLabel}
            animate={animate}
            customText={customText}
            className={className}
          />
        );

      case 'full':
        return (
          <FullStatus
            status={status}
            lastSeen={lastSeen}
            size={size}
            animate={animate}
            customText={customText}
            className={className}
          />
        );

      case 'dot':
      default:
        return (
          <StatusDot
            status={status}
            size={size}
            animate={animate}
            position={position}
            className={className}
          />
        );
    }
  };

  return (
    <TooltipWrapper
      status={status}
      lastSeen={lastSeen}
      showTooltip={showTooltip}
    >
      {renderStatusComponent()}
    </TooltipWrapper>
  );
};

// Utility hook for managing online status
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

// Utility component for showing user's own status
export const CurrentUserStatus: React.FC<{
  status: UserStatus;
  onStatusChange?: (status: UserStatus) => void;
  size?: keyof typeof SIZE_CONFIG;
  className?: string;
}> = ({ status, onStatusChange, size = 'md', className }) => {
  const { t } = useTranslation();

  if (!onStatusChange) {
    return <OnlineStatus status={status} variant="indicator" showLabel size={size} className={className} />;
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <OnlineStatus status={status} variant="dot" size={size} />
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as UserStatus)}
        className="bg-transparent border-none outline-none text-sm font-medium cursor-pointer"
      >
        <option value="online">{t('online')}</option>
        <option value="away">{t('away')}</option>
        <option value="busy">{t('busy')}</option>
        <option value="invisible">{t('invisible')}</option>
      </select>
    </div>
  );
};

export default OnlineStatus;