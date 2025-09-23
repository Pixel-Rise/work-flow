import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { FolderOpen, ChevronDown, Search, X, Check } from 'lucide-react';

export interface Project {
  id: number;
  name: string;
  color?: string;
  tasksCount?: number;
  completedTasksCount?: number;
  isActive?: boolean;
  category?: string;
}

export interface ProjectFilterProps {
  value: number[];
  onChange: (projectIds: number[]) => void;
  projects: Project[];
  variant?: 'dropdown' | 'sidebar' | 'inline';
  maxDisplayCount?: number;
  showTaskCounts?: boolean;
  showCategories?: boolean;
  allowMultiple?: boolean;
  placeholder?: string;
  className?: string;
}

export const ProjectFilter: React.FC<ProjectFilterProps> = ({
  value,
  onChange,
  projects,
  variant = 'dropdown',
  maxDisplayCount = 3,
  showTaskCounts = true,
  showCategories = false,
  allowMultiple = true,
  placeholder,
  className = ''
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Group projects by category if enabled
  const groupedProjects = showCategories
    ? projects.reduce((groups, project) => {
        const category = project.category || t('uncategorized');
        if (!groups[category]) groups[category] = [];
        groups[category].push(project);
        return groups;
      }, {} as Record<string, Project[]>)
    : { [t('allProjects')]: projects };

  // Filter projects based on search
  const filteredProjects = searchQuery
    ? projects.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : projects;

  const selectedProjects = projects.filter(p => value.includes(p.id));

  const handleToggleProject = (projectId: number) => {
    if (!allowMultiple) {
      onChange(value.includes(projectId) ? [] : [projectId]);
      if (variant === 'dropdown') setIsOpen(false);
      return;
    }

    if (value.includes(projectId)) {
      onChange(value.filter(id => id !== projectId));
    } else {
      onChange([...value, projectId]);
    }
  };

  const handleSelectAll = () => {
    onChange(filteredProjects.map(p => p.id));
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const getDisplayText = () => {
    if (value.length === 0) {
      return placeholder || t('selectProjects');
    }

    if (value.length === 1) {
      const project = projects.find(p => p.id === value[0]);
      return project?.name || t('selectedProject');
    }

    if (value.length <= maxDisplayCount) {
      return selectedProjects.map(p => p.name).join(', ');
    }

    return t('projectsSelected', { count: value.length });
  };

  const ProjectItem: React.FC<{
    project: Project;
    isSelected: boolean;
    onToggle: () => void;
  }> = ({ project, isSelected, onToggle }) => (
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

      <div className="flex items-center gap-2 flex-1">
        {project.color && (
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: project.color }}
          />
        )}
        <span className="text-sm font-medium truncate">{project.name}</span>
      </div>

      <div className="flex items-center gap-2">
        {showTaskCounts && project.tasksCount !== undefined && (
          <Badge variant="secondary" className="text-xs">
            {project.completedTasksCount || 0}/{project.tasksCount}
          </Badge>
        )}
        {!project.isActive && (
          <Badge variant="outline" className="text-xs">
            {t('inactive')}
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
            <FolderOpen className="h-4 w-4" />
            {t('projects')}
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

        {projects.length > 5 && (
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t('searchProjects')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
        )}

        <ScrollArea className="max-h-48">
          <div className="space-y-1">
            {Object.entries(groupedProjects).map(([category, categoryProjects]) => (
              <div key={category}>
                {showCategories && Object.keys(groupedProjects).length > 1 && (
                  <>
                    <div className="px-2 py-1 text-xs font-medium text-gray-500 uppercase">
                      {category}
                    </div>
                    <Separator className="mb-1" />
                  </>
                )}
                {categoryProjects
                  .filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((project) => (
                    <ProjectItem
                      key={project.id}
                      project={project}
                      isSelected={value.includes(project.id)}
                      onToggle={() => handleToggleProject(project.id)}
                    />
                  ))}
              </div>
            ))}

            {filteredProjects.length === 0 && searchQuery && (
              <div className="text-center py-4 text-gray-500 text-sm">
                {t('noProjectsFound')}
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
        {projects.map((project) => (
          <Badge
            key={project.id}
            variant={value.includes(project.id) ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => handleToggleProject(project.id)}
          >
            {project.color && (
              <div
                className="w-2 h-2 rounded-full mr-1"
                style={{ backgroundColor: project.color }}
              />
            )}
            {project.name}
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
            <FolderOpen className="h-4 w-4 flex-shrink-0" />
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
            <h4 className="font-medium">{t('selectProjects')}</h4>
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

          {projects.length > 3 && (
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t('searchProjects')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8"
              />
            </div>
          )}

          <ScrollArea className="max-h-60">
            <div className="space-y-1">
              {Object.entries(groupedProjects).map(([category, categoryProjects]) => (
                <div key={category}>
                  {showCategories && Object.keys(groupedProjects).length > 1 && (
                    <>
                      <div className="px-2 py-1 text-xs font-medium text-gray-500 uppercase">
                        {category}
                      </div>
                      <Separator className="mb-1" />
                    </>
                  )}
                  {categoryProjects
                    .filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((project) => (
                      <ProjectItem
                        key={project.id}
                        project={project}
                        isSelected={value.includes(project.id)}
                        onToggle={() => handleToggleProject(project.id)}
                      />
                    ))}
                </div>
              ))}

              {filteredProjects.length === 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  {searchQuery ? t('noProjectsFound') : t('noProjectsAvailable')}
                </div>
              )}
            </div>
          </ScrollArea>

          {allowMultiple && value.length > 0 && (
            <>
              <Separator />
              <div className="flex flex-wrap gap-1">
                {selectedProjects.slice(0, 6).map((project) => (
                  <Badge
                    key={project.id}
                    variant="secondary"
                    className="text-xs cursor-pointer"
                    onClick={() => handleToggleProject(project.id)}
                  >
                    {project.color && (
                      <div
                        className="w-2 h-2 rounded-full mr-1"
                        style={{ backgroundColor: project.color }}
                      />
                    )}
                    {project.name}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
                {selectedProjects.length > 6 && (
                  <Badge variant="secondary" className="text-xs">
                    +{selectedProjects.length - 6} {t('more')}
                  </Badge>
                )}
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProjectFilter;