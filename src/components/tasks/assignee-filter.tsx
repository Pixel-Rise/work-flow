import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Users, ChevronDown, Search, X, Check, Circle, Zap } from 'lucide-react';

export interface Assignee {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  department?: string;
  isOnline?: boolean;
  workload?: 'light' | 'medium' | 'heavy' | 'overloaded';
  tasksCount?: number;
  completedTasksCount?: number;
}

export interface AssigneeFilterProps {
  value: number[];
  onChange: (assigneeIds: number[]) => void;
  assignees: Assignee[];
  variant?: 'dropdown' | 'sidebar' | 'inline';
  maxDisplayCount?: number;
  showWorkload?: boolean;
  showOnlineStatus?: boolean;
  showDepartments?: boolean;
  allowMultiple?: boolean;
  includeUnassigned?: boolean;
  placeholder?: string;
  className?: string;
}

const WorkloadIndicator: React.FC<{ workload: string; size?: 'sm' | 'md' }> = ({
  workload,
  size = 'sm'
}) => {
  const colors = {
    light: 'bg-green-500',
    medium: 'bg-yellow-500',
    heavy: 'bg-orange-500',
    overloaded: 'bg-red-500'
  };

  const dotSize = size === 'sm' ? 'w-2 h-2' : 'w-3 h-3';

  return (
    <div className={`${dotSize} rounded-full ${colors[workload as keyof typeof colors] || colors.medium}`} />
  );
};

export const AssigneeFilter: React.FC<AssigneeFilterProps> = ({
  value,
  onChange,
  assignees,
  variant = 'dropdown',
  maxDisplayCount = 3,
  showWorkload = true,
  showOnlineStatus = true,
  showDepartments = false,
  allowMultiple = true,
  includeUnassigned = true,
  placeholder,
  className = ''
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Include unassigned option
  const allAssignees = includeUnassigned
    ? [
        {
          id: -1,
          name: t('unassigned'),
          email: '',
          role: t('unassigned'),
          department: '',
          isOnline: false,
          workload: 'light' as const,
          tasksCount: 0,
          completedTasksCount: 0
        },
        ...assignees
      ]
    : assignees;

  // Group assignees by department if enabled
  const groupedAssignees = showDepartments
    ? allAssignees.reduce((groups, assignee) => {
        const department = assignee.department || t('noDepartment');
        if (!groups[department]) groups[department] = [];
        groups[department].push(assignee);
        return groups;
      }, {} as Record<string, Assignee[]>)
    : { [t('allMembers')]: allAssignees };

  // Filter assignees based on search
  const filteredAssignees = searchQuery
    ? allAssignees.filter(assignee =>
        assignee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (assignee.role && assignee.role.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : allAssignees;

  const selectedAssignees = allAssignees.filter(a => value.includes(a.id));

  const handleToggleAssignee = (assigneeId: number) => {
    if (!allowMultiple) {
      onChange(value.includes(assigneeId) ? [] : [assigneeId]);
      if (variant === 'dropdown') setIsOpen(false);
      return;
    }

    if (value.includes(assigneeId)) {
      onChange(value.filter(id => id !== assigneeId));
    } else {
      onChange([...value, assigneeId]);
    }
  };

  const handleSelectAll = () => {
    onChange(filteredAssignees.map(a => a.id));
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const getDisplayText = () => {
    if (value.length === 0) {
      return placeholder || t('selectAssignees');
    }

    if (value.length === 1) {
      const assignee = allAssignees.find(a => a.id === value[0]);
      return assignee?.name || t('selectedAssignee');
    }

    if (value.length <= maxDisplayCount) {
      return selectedAssignees.map(a => a.name).join(', ');
    }

    return t('assigneesSelected', { count: value.length });
  };

  const AssigneeItem: React.FC<{
    assignee: Assignee;
    isSelected: boolean;
    onToggle: () => void;
  }> = ({ assignee, isSelected, onToggle }) => (
    <div
      className={`flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer ${
        isSelected ? 'bg-blue-50' : ''
      }`}
      onClick={onToggle}
    >
      {allowMultiple && (
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggle}
          onClick={(e) => e.stopPropagation()}
        />
      )}

      <div className="flex items-center gap-2">
        {assignee.id === -1 ? (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <Users className="h-4 w-4 text-gray-500" />
          </div>
        ) : (
          <div className="relative">
            <Avatar className="h-8 w-8">
              <AvatarImage src={assignee.avatar} alt={assignee.name} />
              <AvatarFallback className="text-xs">
                {assignee.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {showOnlineStatus && assignee.isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">{assignee.name}</span>
          {showWorkload && assignee.workload && assignee.id !== -1 && (
            <WorkloadIndicator workload={assignee.workload} />
          )}
        </div>
        <div className="text-xs text-gray-500 truncate">
          {assignee.role && assignee.id !== -1 ? assignee.role : assignee.email}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {assignee.tasksCount !== undefined && assignee.id !== -1 && (
          <Badge variant="secondary" className="text-xs">
            {assignee.completedTasksCount || 0}/{assignee.tasksCount}
          </Badge>
        )}
        {isSelected && !allowMultiple && (
          <Check className="h-4 w-4 text-green-600" />
        )}
      </div>
    </div>
  );

  if (variant === 'sidebar') {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t('assignees')}
            {value.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {value.length}
              </Badge>
            )}
          </label>
          {value.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {allAssignees.length > 5 && (
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t('searchAssignees')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
        )}

        <ScrollArea className="max-h-48">
          <div className="space-y-1">
            {Object.entries(groupedAssignees).map(([department, departmentAssignees]) => (
              <div key={department}>
                {showDepartments && Object.keys(groupedAssignees).length > 1 && (
                  <>
                    <div className="px-2 py-1 text-xs font-medium text-gray-500 uppercase">
                      {department}
                    </div>
                    <Separator className="mb-1" />
                  </>
                )}
                {departmentAssignees
                  .filter(a =>
                    !searchQuery ||
                    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (a.role && a.role.toLowerCase().includes(searchQuery.toLowerCase()))
                  )
                  .map((assignee) => (
                    <AssigneeItem
                      key={assignee.id}
                      assignee={assignee}
                      isSelected={value.includes(assignee.id)}
                      onToggle={() => handleToggleAssignee(assignee.id)}
                    />
                  ))}
              </div>
            ))}

            {filteredAssignees.length === 0 && searchQuery && (
              <div className="text-center py-4 text-gray-500 text-sm">
                {t('noAssigneesFound')}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {allAssignees.map((assignee) => (
          <Badge
            key={assignee.id}
            variant={value.includes(assignee.id) ? 'default' : 'outline'}
            className="cursor-pointer flex items-center gap-1"
            onClick={() => handleToggleAssignee(assignee.id)}
          >
            {assignee.id !== -1 ? (
              <Avatar className="h-4 w-4">
                <AvatarImage src={assignee.avatar} alt={assignee.name} />
                <AvatarFallback className="text-xs">
                  {assignee.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <Users className="h-3 w-3" />
            )}
            {assignee.name}
          </Badge>
        ))}
      </div>
    );
  }

  // Dropdown variant
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`justify-between min-w-[140px] ${className}`}
        >
          <div className="flex items-center gap-2 truncate">
            <Users className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{getDisplayText()}</span>
          </div>
          <div className="flex items-center gap-1 ml-2">
            {value.length > 0 && (
              <Badge variant="secondary" className="text-xs h-5">
                {value.length}
              </Badge>
            )}
            <ChevronDown className="h-4 w-4 flex-shrink-0" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{t('selectAssignees')}</h4>
            <div className="flex items-center gap-2">
              {allowMultiple && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSelectAll}
                    className="h-6 px-2 text-xs"
                  >
                    {t('selectAll')}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAll}
                    className="h-6 px-2 text-xs"
                  >
                    {t('clearAll')}
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {allAssignees.length > 3 && (
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t('searchAssignees')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8"
              />
            </div>
          )}

          <ScrollArea className="max-h-60">
            <div className="space-y-1">
              {Object.entries(groupedAssignees).map(([department, departmentAssignees]) => (
                <div key={department}>
                  {showDepartments && Object.keys(groupedAssignees).length > 1 && (
                    <>
                      <div className="px-2 py-1 text-xs font-medium text-gray-500 uppercase">
                        {department}
                      </div>
                      <Separator className="mb-1" />
                    </>
                  )}
                  {departmentAssignees
                    .filter(a =>
                      !searchQuery ||
                      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (a.role && a.role.toLowerCase().includes(searchQuery.toLowerCase()))
                    )
                    .map((assignee) => (
                      <AssigneeItem
                        key={assignee.id}
                        assignee={assignee}
                        isSelected={value.includes(assignee.id)}
                        onToggle={() => handleToggleAssignee(assignee.id)}
                      />
                    ))}
                </div>
              ))}

              {filteredAssignees.length === 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  {searchQuery ? t('noAssigneesFound') : t('noAssigneesAvailable')}
                </div>
              )}
            </div>
          </ScrollArea>

          {allowMultiple && value.length > 0 && (
            <>
              <Separator />
              <div className="flex flex-wrap gap-1">
                {selectedAssignees.slice(0, 5).map((assignee) => (
                  <Badge
                    key={assignee.id}
                    variant="secondary"
                    className="text-xs cursor-pointer flex items-center gap-1"
                    onClick={() => handleToggleAssignee(assignee.id)}
                  >
                    {assignee.id !== -1 ? (
                      <Avatar className="h-3 w-3">
                        <AvatarImage src={assignee.avatar} alt={assignee.name} />
                        <AvatarFallback className="text-xs">
                          {assignee.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Users className="h-3 w-3" />
                    )}
                    {assignee.name}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
                {selectedAssignees.length > 5 && (
                  <Badge variant="secondary" className="text-xs">
                    +{selectedAssignees.length - 5} {t('more')}
                  </Badge>
                )}
              </div>
            </>
          )}

          {showWorkload && (
            <>
              <Separator />
              <div className="text-xs text-gray-500">
                <div className="font-medium mb-1">{t('workloadLegend')}:</div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="flex items-center gap-1">
                    <WorkloadIndicator workload="light" />
                    <span>{t('light')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <WorkloadIndicator workload="medium" />
                    <span>{t('medium')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <WorkloadIndicator workload="heavy" />
                    <span>{t('heavy')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <WorkloadIndicator workload="overloaded" />
                    <span>{t('overloaded')}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AssigneeFilter;