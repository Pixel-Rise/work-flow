import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { BarChart, LineChart, PieChart, AreaChart, TrendingUp, Activity } from 'lucide-react';

interface ChartTypeSelectorProps {
  value: string;
  onChange: (chartType: string) => void;
  variant?: 'default' | 'compact';
}

const chartTypes = [
  { key: 'bar', icon: BarChart, label: 'barChart' },
  { key: 'line', icon: LineChart, label: 'lineChart' },
  { key: 'pie', icon: PieChart, label: 'pieChart' },
  { key: 'area', icon: AreaChart, label: 'areaChart' },
  { key: 'trend', icon: TrendingUp, label: 'trendChart' },
  { key: 'radar', icon: Activity, label: 'radarChart' }
];

export const ChartTypeSelector: React.FC<ChartTypeSelectorProps> = ({
  value,
  onChange,
  variant = 'default'
}) => {
  const { t } = useTranslation();
  const isCompact = variant === 'compact';

  return (
    <div className={`grid gap-2 ${isCompact ? 'grid-cols-3' : 'grid-cols-2 md:grid-cols-3'}`}>
      {chartTypes.map((type) => (
        <Button
          key={type.key}
          variant={value === type.key ? 'default' : 'outline'}
          size={isCompact ? 'sm' : 'default'}
          onClick={() => onChange(type.key)}
          className="flex items-center gap-2"
        >
          <type.icon className="h-4 w-4" />
          {!isCompact && t(type.label)}
        </Button>
      ))}
    </div>
  );
};

export default ChartTypeSelector;