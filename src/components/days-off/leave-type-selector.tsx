import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Plane,
  Heart,
  User,
  Baby,
  AlertTriangle,
  Calendar,
  CheckCircle
} from 'lucide-react';

export type LeaveType = 'vacation' | 'sick' | 'personal' | 'maternity' | 'emergency' | 'other';

export interface LeaveTypeOption {
  type: LeaveType;
  label: string;
  icon: React.ElementType;
  color: string;
  description: string;
  requiresApproval: boolean;
  maxDays?: number;
  minAdvanceNotice?: number;
}

export interface LeaveTypeSelectorProps {
  value: LeaveType;
  onChange: (type: LeaveType) => void;
  availableBalance?: Record<string, number>;
  variant?: 'default' | 'compact' | 'grid' | 'dropdown';
  disabled?: boolean;
  showBalance?: boolean;
  showDescriptions?: boolean;
  className?: string;
}

const leaveTypes: LeaveTypeOption[] = [
  {
    type: 'vacation',
    label: 'vacation',
    icon: Plane,
    color: 'blue',
    description: 'plannedTimeOff',
    requiresApproval: true,
    minAdvanceNotice: 14
  },
  {
    type: 'sick',
    label: 'sickLeave',
    icon: Heart,
    color: 'red',
    description: 'healthRelatedLeave',
    requiresApproval: false,
    maxDays: 10
  },
  {
    type: 'personal',
    label: 'personalLeave',
    icon: User,
    color: 'green',
    description: 'personalMatters',
    requiresApproval: true,
    minAdvanceNotice: 3
  },
  {
    type: 'maternity',
    label: 'maternityLeave',
    icon: Baby,
    color: 'purple',
    description: 'parentalLeave',
    requiresApproval: true,
    minAdvanceNotice: 30
  },
  {
    type: 'emergency',
    label: 'emergencyLeave',
    icon: AlertTriangle,
    color: 'orange',
    description: 'unexpectedSituations',
    requiresApproval: false,
    maxDays: 5
  },
  {
    type: 'other',
    label: 'otherLeave',
    icon: Calendar,
    color: 'gray',
    description: 'otherReasons',
    requiresApproval: true
  }
];

const LeaveTypeCard: React.FC<{
  option: LeaveTypeOption;
  isSelected: boolean;
  balance?: number;
  showBalance: boolean;
  showDescriptions: boolean;
  variant: 'default' | 'compact' | 'grid' | 'dropdown';
  onClick: () => void;
}> = ({
  option,
  isSelected,
  balance,
  showBalance,
  showDescriptions,
  variant,
  onClick
}) => {
  const { t } = useTranslation();
  const isCompact = variant === 'compact';

  const getColorClasses = () => {
    const baseClasses = isSelected
      ? `border-${option.color}-500 bg-${option.color}-50`
      : 'border-gray-200 hover:border-gray-300';

    return `${baseClasses} transition-colors`;
  };

  const getIconColorClass = () => {
    return isSelected
      ? `text-${option.color}-600`
      : `text-${option.color}-500`;
  };

  return (
    <div
      className={`cursor-pointer border-2 rounded-lg p-${isCompact ? '3' : '4'} ${getColorClasses()}`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg bg-${option.color}-100`}>
          <option.icon className={`h-${isCompact ? '4' : '5'} w-${isCompact ? '4' : '5'} ${getIconColorClass()}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`font-medium ${isCompact ? 'text-sm' : ''}`}>
              {t(`leaveType.${option.label}`)}
            </h4>
            {isSelected && (
              <CheckCircle className="h-4 w-4 text-green-600" />
            )}
          </div>

          {showDescriptions && (
            <p className={`text-gray-600 ${isCompact ? 'text-xs' : 'text-sm'} mb-2`}>
              {t(`leaveDescription.${option.description}`)}
            </p>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            {option.requiresApproval && (
              <Badge variant="outline" className="text-xs">
                {t('requiresApproval')}
              </Badge>
            )}

            {option.minAdvanceNotice && (
              <Badge variant="secondary" className="text-xs">
                {option.minAdvanceNotice}d {t('advance')}
              </Badge>
            )}

            {option.maxDays && (
              <Badge variant="secondary" className="text-xs">
                {t('max')} {option.maxDays}d
              </Badge>
            )}
          </div>

          {showBalance && balance !== undefined && (
            <div className="mt-2 pt-2 border-t">
              <div className="flex items-center justify-between">
                <span className={`text-gray-600 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                  {t('available')}
                </span>
                <span className={`font-medium ${
                  balance <= 2 ? 'text-red-600' :
                  balance <= 5 ? 'text-yellow-600' :
                  'text-green-600'
                } ${isCompact ? 'text-sm' : ''}`}>
                  {balance} {t('days')}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const LeaveTypeSelector: React.FC<LeaveTypeSelectorProps> = ({
  value,
  onChange,
  availableBalance = {},
  variant = 'default',
  disabled = false,
  showBalance = true,
  showDescriptions = true,
  className = ''
}) => {
  const { t } = useTranslation();

  if (variant === 'dropdown') {
    const selectedOption = leaveTypes.find(option => option.type === value);

    return (
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger className={className}>
          <SelectValue>
            {selectedOption && (
              <div className="flex items-center gap-2">
                <selectedOption.icon className="h-4 w-4" />
                {t(`leaveType.${selectedOption.label}`)}
                {showBalance && availableBalance[value] !== undefined && (
                  <Badge variant="secondary" className="ml-2">
                    {availableBalance[value]} {t('days')}
                  </Badge>
                )}
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {leaveTypes.map((option) => (
            <SelectItem key={option.type} value={option.type}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <option.icon className="h-4 w-4" />
                  <div>
                    <div className="font-medium">{t(`leaveType.${option.label}`)}</div>
                    {showDescriptions && (
                      <div className="text-xs text-gray-500">
                        {t(`leaveDescription.${option.description}`)}
                      </div>
                    )}
                  </div>
                </div>
                {showBalance && availableBalance[option.type] !== undefined && (
                  <Badge variant="secondary" className="ml-2">
                    {availableBalance[option.type]} {t('days')}
                  </Badge>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (variant === 'grid') {
    return (
      <div className={`grid gap-3 ${
        variant === 'compact'
          ? 'grid-cols-1 sm:grid-cols-2'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      } ${className}`}>
        {leaveTypes.map((option) => (
          <LeaveTypeCard
            key={option.type}
            option={option}
            isSelected={value === option.type}
            balance={availableBalance[option.type]}
            showBalance={showBalance}
            showDescriptions={showDescriptions}
            variant={variant}
            onClick={() => !disabled && onChange(option.type)}
          />
        ))}
      </div>
    );
  }

  // Default variant - button group
  return (
    <div className={`space-y-2 ${className}`}>
      {leaveTypes.map((option) => (
        <Button
          key={option.type}
          variant={value === option.type ? 'default' : 'outline'}
          onClick={() => !disabled && onChange(option.type)}
          disabled={disabled}
          className="w-full justify-start h-auto p-3"
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <option.icon className="h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">{t(`leaveType.${option.label}`)}</div>
                {showDescriptions && (
                  <div className="text-xs opacity-70">
                    {t(`leaveDescription.${option.description}`)}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {option.requiresApproval && (
                <Badge variant="secondary" className="text-xs">
                  {t('approval')}
                </Badge>
              )}
              {showBalance && availableBalance[option.type] !== undefined && (
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    availableBalance[option.type] <= 2 ? 'border-red-300 text-red-600' :
                    availableBalance[option.type] <= 5 ? 'border-yellow-300 text-yellow-600' :
                    'border-green-300 text-green-600'
                  }`}
                >
                  {availableBalance[option.type]} {t('days')}
                </Badge>
              )}
            </div>
          </div>
        </Button>
      ))}
    </div>
  );
};

export default LeaveTypeSelector;