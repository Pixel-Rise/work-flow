import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { ProjectFilter } from './project-filter';
import { AssigneeFilter } from './assignee-filter';
import { PriorityFilter } from './priority-filter';
import { DateRangeFilter } from './date-range-filter';
import { TaskSearch } from './task-search';
import {
  Filter,
  X,
  RotateCcw,
  Settings,
  ChevronDown,
  Search,
  Calendar,
  User,
  Flag,
  FolderOpen
} from 'lucide-react';

export interface TaskFilterState {
  search: string;
  projects: number[];
  assignees: number[];
  priorities: ('low' | 'medium' | 'high' | 'urgent')[];
  statuses: ('todo' | 'in_progress' | 'review' | 'done' | 'cancelled')[];
  tags: string[];
  dateRange: {
    start?: string;
    end?: string;
    preset?: 'today' | 'week' | 'month' | 'overdue';
  };
  showCompleted: boolean;
  showArchived: boolean;
}

export interface TaskFiltersProps {
  filters: TaskFilterState;
  onFiltersChange: (filters: TaskFilterState) => void;
  variant?: 'default' | 'compact' | 'sidebar';
  showSearch?: boolean;
  showProjectFilter?: boolean;
  showAssigneeFilter?: boolean;
  showPriorityFilter?: boolean;
  showDateFilter?: boolean;
  showStatusFilter?: boolean;
  showAdvanced?: boolean;
  availableProjects?: Array<{ id: number; name: string; color?: string; }>;
  availableAssignees?: Array<{ id: number; name: string; avatar?: string; }>;
  availableTags?: string[];
  className?: string;
}

const StatusFilter: React.FC<{
  value: string[];
  onChange: (statuses: string[]) => void;
  variant?: 'default' | 'compact';
}> = ({ value, onChange, variant = 'default' }) => {
  const { t } = useTranslation();
  const statuses = [
    { key: 'todo', label: t('todo'), color: 'bg-gray-500' },
    { key: 'in_progress', label: t('inProgress'), color: 'bg-blue-500' },
    { key: 'review', label: t('review'), color: 'bg-yellow-500' },
    { key: 'done', label: t('done'), color: 'bg-green-500' },
    { key: 'cancelled', label: t('cancelled'), color: 'bg-red-500' }
  ];

  const handleToggle = (status: string) => {
    if (value.includes(status)) {
      onChange(value.filter(s => s !== status));
    } else {
      onChange([...value, status]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{t('status')}</label>
      <div className={`grid gap-2 ${variant === 'compact' ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {statuses.map((status) => (
          <div key={status.key} className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`status-${status.key}`}
              checked={value.includes(status.key)}
              onChange={() => handleToggle(status.key)}
              className="rounded border-gray-300"
            />
            <label
              htmlFor={`status-${status.key}`}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <div className={`w-2 h-2 rounded-full ${status.color}`} />
              {status.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

const TagFilter: React.FC<{
  value: string[];
  onChange: (tags: string[]) => void;
  availableTags: string[];
}> = ({ value, onChange, availableTags }) => {
  const { t } = useTranslation();

  const handleToggle = (tag: string) => {
    if (value.includes(tag)) {
      onChange(value.filter(t => t !== tag));
    } else {
      onChange([...value, tag]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{t('tags')}</label>
      <div className="flex flex-wrap gap-1">
        {availableTags.map((tag) => (
          <Badge
            key={tag}
            variant={value.includes(tag) ? "default" : "outline"}
            className="cursor-pointer text-xs"
            onClick={() => handleToggle(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  onFiltersChange,
  variant = 'default',
  showSearch = true,
  showProjectFilter = true,
  showAssigneeFilter = true,
  showPriorityFilter = true,
  showDateFilter = true,
  showStatusFilter = true,
  showAdvanced = true,
  availableProjects = [],
  availableAssignees = [],
  availableTags = [],
  className = ''
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(variant === 'sidebar');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const updateFilter = <K extends keyof TaskFilterState>(
    key: K,
    value: TaskFilterState[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFiltersChange({
      search: '',
      projects: [],
      assignees: [],
      priorities: [],
      statuses: [],
      tags: [],
      dateRange: {},
      showCompleted: true,
      showArchived: false
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.projects.length > 0) count++;
    if (filters.assignees.length > 0) count++;
    if (filters.priorities.length > 0) count++;
    if (filters.statuses.length > 0) count++;
    if (filters.tags.length > 0) count++;
    if (filters.dateRange.start || filters.dateRange.end || filters.dateRange.preset) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();
  const isCompact = variant === 'compact';
  const isSidebar = variant === 'sidebar';

  if (isSidebar) {
    return (
      <Card className={`h-fit ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium flex items-center gap-2">
              <Filter className="h-4 w-4" />
              {t('filters')}
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </h3>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-6 w-6 p-0"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {showSearch && (
              <TaskSearch
                value={filters.search}
                onChange={(search) => updateFilter('search', search)}
                placeholder={t('searchTasks')}
              />
            )}

            {showProjectFilter && availableProjects.length > 0 && (
              <ProjectFilter
                value={filters.projects}
                onChange={(projects) => updateFilter('projects', projects)}
                projects={availableProjects}
                variant="sidebar"
              />
            )}

            {showAssigneeFilter && availableAssignees.length > 0 && (
              <AssigneeFilter
                value={filters.assignees}
                onChange={(assignees) => updateFilter('assignees', assignees)}
                assignees={availableAssignees}
                variant="sidebar"
              />
            )}

            {showPriorityFilter && (
              <PriorityFilter
                value={filters.priorities}
                onChange={(priorities) => updateFilter('priorities', priorities)}
                variant="sidebar"
              />
            )}

            {showStatusFilter && (
              <StatusFilter
                value={filters.statuses}
                onChange={(statuses) => updateFilter('statuses', statuses)}
                variant="compact"
              />
            )}

            {showDateFilter && (
              <DateRangeFilter
                value={filters.dateRange}
                onChange={(dateRange) => updateFilter('dateRange', dateRange)}
                variant="sidebar"
              />
            )}

            {availableTags.length > 0 && (
              <TagFilter
                value={filters.tags}
                onChange={(tags) => updateFilter('tags', tags)}
                availableTags={availableTags}
              />
            )}

            {showAdvanced && (
              <div className="space-y-2">
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="showCompleted"
                      checked={filters.showCompleted}
                      onChange={(e) => updateFilter('showCompleted', e.target.checked)}
                    />
                    <label htmlFor="showCompleted" className="text-sm">
                      {t('showCompleted')}
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="showArchived"
                      checked={filters.showArchived}
                      onChange={(e) => updateFilter('showArchived', e.target.checked)}
                    />
                    <label htmlFor="showArchived" className="text-sm">
                      {t('showArchived')}
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      {/* Search */}
      {showSearch && (
        <TaskSearch
          value={filters.search}
          onChange={(search) => updateFilter('search', search)}
          placeholder={t('searchTasks')}
          className="min-w-[200px]"
        />
      )}

      {/* Quick Filters */}
      <div className="flex items-center gap-2">
        {showProjectFilter && availableProjects.length > 0 && (
          <ProjectFilter
            value={filters.projects}
            onChange={(projects) => updateFilter('projects', projects)}
            projects={availableProjects}
            variant="dropdown"
          />
        )}

        {showAssigneeFilter && availableAssignees.length > 0 && (
          <AssigneeFilter
            value={filters.assignees}
            onChange={(assignees) => updateFilter('assignees', assignees)}
            assignees={availableAssignees}
            variant="dropdown"
          />
        )}

        {showPriorityFilter && (
          <PriorityFilter
            value={filters.priorities}
            onChange={(priorities) => updateFilter('priorities', priorities)}
            variant="dropdown"
          />
        )}

        {showDateFilter && (
          <DateRangeFilter
            value={filters.dateRange}
            onChange={(dateRange) => updateFilter('dateRange', dateRange)}
            variant="dropdown"
          />
        )}

        {/* Advanced Filters */}
        {showAdvanced && (
          <Popover open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                {t('moreFilters')}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{t('advancedFilters')}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAdvancedFilters(false)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {showStatusFilter && (
                  <StatusFilter
                    value={filters.statuses}
                    onChange={(statuses) => updateFilter('statuses', statuses)}
                    variant={isCompact ? 'compact' : 'default'}
                  />
                )}

                {availableTags.length > 0 && (
                  <TagFilter
                    value={filters.tags}
                    onChange={(tags) => updateFilter('tags', tags)}
                    availableTags={availableTags}
                  />
                )}

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="showCompletedPopover"
                      checked={filters.showCompleted}
                      onChange={(e) => updateFilter('showCompleted', e.target.checked)}
                    />
                    <label htmlFor="showCompletedPopover" className="text-sm">
                      {t('showCompleted')}
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="showArchivedPopover"
                      checked={filters.showArchived}
                      onChange={(e) => updateFilter('showArchived', e.target.checked)}
                    />
                    <label htmlFor="showArchivedPopover" className="text-sm">
                      {t('showArchived')}
                    </label>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 ml-2">
          <span className="text-sm text-gray-500">
            {t('activeFilters', { count: activeFiltersCount })}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-6 px-2 text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            {t('clearAll')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaskFilters;