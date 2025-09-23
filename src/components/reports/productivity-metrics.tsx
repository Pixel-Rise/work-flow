import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, TrendingUp, Clock, CheckSquare, Activity } from 'lucide-react';

interface ProductivityData {
  score: number;
  tasksCompleted: number;
  efficiency: number;
  focusTime: number;
  trend: 'up' | 'down' | 'stable';
}

interface ProductivityMetricsProps {
  data: ProductivityData;
  variant?: 'default' | 'compact';
}

export const ProductivityMetrics: React.FC<ProductivityMetricsProps> = ({
  data,
  variant = 'default'
}) => {
  const { t } = useTranslation();
  const isCompact = variant === 'compact';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          {t('productivityMetrics')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`grid gap-4 ${isCompact ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2'}`}>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t('productivityScore')}</span>
              <Badge variant="secondary">{data.score}%</Badge>
            </div>
            <Progress value={data.score} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t('efficiency')}</span>
              <Badge variant="secondary">{data.efficiency}%</Badge>
            </div>
            <Progress value={data.efficiency} className="h-2" />
          </div>

          <div className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-green-600" />
            <span className="text-sm">{t('tasksCompleted')}: {data.tasksCompleted}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-sm">{t('focusTime')}: {data.focusTime}h</span>
          </div>

          <div className="flex items-center gap-2">
            {data.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-600" />}
            {data.trend === 'down' && <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />}
            {data.trend === 'stable' && <Activity className="h-4 w-4 text-gray-600" />}
            <span className="text-sm">{t(`trend.${data.trend}`)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductivityMetrics;