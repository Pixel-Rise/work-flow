import React from 'react';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, FolderOpen, Users, Clock, Activity, Target } from 'lucide-react';

interface DataSource {
  key: string;
  label: string;
  icon: React.ElementType;
  description: string;
  count?: number;
}

interface DataSourceSelectorProps {
  value: string;
  onChange: (dataSource: string) => void;
  showCounts?: boolean;
  variant?: 'default' | 'compact';
}

const dataSources: DataSource[] = [
  {
    key: 'tasks',
    label: 'tasks',
    icon: CheckSquare,
    description: 'taskData',
    count: 156
  },
  {
    key: 'projects',
    label: 'projects',
    icon: FolderOpen,
    description: 'projectData',
    count: 24
  },
  {
    key: 'users',
    label: 'users',
    icon: Users,
    description: 'userData',
    count: 12
  },
  {
    key: 'time',
    label: 'timeEntries',
    icon: Clock,
    description: 'timeData',
    count: 89
  },
  {
    key: 'activity',
    label: 'activity',
    icon: Activity,
    description: 'activityData',
    count: 234
  },
  {
    key: 'metrics',
    label: 'metrics',
    icon: Target,
    description: 'metricsData',
    count: 45
  }
];

export const DataSourceSelector: React.FC<DataSourceSelectorProps> = ({
  value,
  onChange,
  showCounts = true,
  variant = 'default'
}) => {
  const { t } = useTranslation();

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={t('selectDataSource')} />
      </SelectTrigger>
      <SelectContent>
        {dataSources.map((source) => (
          <SelectItem key={source.key} value={source.key}>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <source.icon className="h-4 w-4" />
                <div>
                  <div className="font-medium">{t(source.label)}</div>
                  <div className="text-xs text-gray-500">{t(source.description)}</div>
                </div>
              </div>
              {showCounts && source.count && (
                <Badge variant="secondary" className="ml-2">
                  {source.count}
                </Badge>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DataSourceSelector;