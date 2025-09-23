import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Legend,
  FunnelChart,
  Funnel,
  LabelList
} from 'recharts';
import {
  CheckSquare,
  Clock,
  AlertTriangle,
  Play,
  Pause,
  XCircle,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  Users,
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react';

export interface TaskStatusData {
  status: 'todo' | 'in_progress' | 'review' | 'done' | 'cancelled';
  count: number;
  percentage: number;
  trend: {
    change: number;
    direction: 'up' | 'down' | 'stable';
    period: string;
  };
  averageTime?: number;
  priority?: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
}

export interface TaskTimelineData {
  date: string;
  todo: number;
  in_progress: number;
  review: number;
  done: number;
  cancelled: number;
  total: number;
}

export interface TaskMetrics {
  completionRate: number;
  averageCompletionTime: number;
  overdueCount: number;
  totalTasks: number;
  velocityTrend: 'up' | 'down' | 'stable';
  burndownData: Array<{
    date: string;
    remaining: number;
    ideal: number;
  }>;
}

export interface TaskStatusChartProps {
  statusData: TaskStatusData[];
  timelineData: TaskTimelineData[];
  metrics: TaskMetrics;
  variant?: 'default' | 'compact' | 'detailed';
  chartType?: 'bar' | 'pie' | 'line' | 'area' | 'funnel' | 'composed';
  timeRange?: 'week' | 'month' | 'quarter' | 'year';
  showTrends?: boolean;
  showPriorities?: boolean;
  groupBy?: 'status' | 'priority' | 'assignee' | 'project';
  onStatusClick?: (status: string) => void;
  onExport?: (format: 'png' | 'pdf' | 'csv') => void;
  className?: string;
}

const StatusIcon: React.FC<{ status: string; className?: string }> = ({ status, className = "h-4 w-4" }) => {
  const iconMap = {
    todo: <CheckSquare className={`${className} text-gray-500`} />,
    in_progress: <Play className={`${className} text-blue-500`} />,
    review: <Clock className={`${className} text-yellow-500`} />,
    done: <CheckSquare className={`${className} text-green-500`} />,
    cancelled: <XCircle className={`${className} text-red-500`} />
  };

  return iconMap[status as keyof typeof iconMap] || <CheckSquare className={className} />;
};

const StatusCard: React.FC<{
  statusData: TaskStatusData;
  variant: 'default' | 'compact' | 'detailed';
  onClick: () => void;
}> = ({ statusData, variant, onClick }) => {
  const { t } = useTranslation();
  const isCompact = variant === 'compact';
  const isDetailed = variant === 'detailed';

  const getStatusColor = () => {
    switch (statusData.status) {
      case 'todo': return 'border-gray-200 bg-gray-50';
      case 'in_progress': return 'border-blue-200 bg-blue-50';
      case 'review': return 'border-yellow-200 bg-yellow-50';
      case 'done': return 'border-green-200 bg-green-50';
      case 'cancelled': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getTrendIcon = () => {
    switch (statusData.trend.direction) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-600" />;
      default:
        return <div className="h-3 w-3" />;
    }
  };

  return (
    <Card
      className={`cursor-pointer hover:shadow-md transition-all ${getStatusColor()}`}
      onClick={onClick}
    >
      <CardContent className={`p-${isCompact ? '4' : '6'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <StatusIcon status={statusData.status} />
            <h4 className={`font-medium ${isCompact ? 'text-sm' : ''}`}>
              {t(`taskStatus.${statusData.status}`)}
            </h4>
          </div>
          {getTrendIcon()}
        </div>

        <div className="space-y-2">
          <div className="flex items-end gap-2">
            <span className={`font-bold ${isCompact ? 'text-2xl' : 'text-3xl'}`}>
              {statusData.count}
            </span>
            <span className={`text-sm text-gray-600 ${isCompact ? 'text-xs' : ''}`}>
              ({statusData.percentage}%)
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className={`${
              statusData.trend.direction === 'up' ? 'text-green-600' :
              statusData.trend.direction === 'down' ? 'text-red-600' :
              'text-gray-600'
            }`}>
              {statusData.trend.direction === 'up' ? '+' : statusData.trend.direction === 'down' ? '-' : ''}
              {Math.abs(statusData.trend.change)}%
            </span>
            <span className="text-gray-500">vs {statusData.trend.period}</span>
          </div>

          {statusData.averageTime && isDetailed && (
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">{t('avgTime')}</span>
                <span className="text-xs font-medium">{statusData.averageTime}h</span>
              </div>
            </div>
          )}

          {statusData.priority && isDetailed && (
            <div className="pt-2 border-t">
              <div className="text-xs text-gray-600 mb-1">{t('priorityBreakdown')}</div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-red-600">{t('urgent')}:</span>
                  <span>{statusData.priority.urgent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-600">{t('high')}:</span>
                  <span>{statusData.priority.high}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-600">{t('medium')}:</span>
                  <span>{statusData.priority.medium}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">{t('low')}:</span>
                  <span>{statusData.priority.low}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-md">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.dataKey}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const TaskStatusChart: React.FC<TaskStatusChartProps> = ({
  statusData,
  timelineData,
  metrics,
  variant = 'default',
  chartType = 'bar',
  timeRange = 'month',
  showTrends = true,
  showPriorities = false,
  groupBy = 'status',
  onStatusClick,
  onExport,
  className = ''
}) => {
  const { t } = useTranslation();
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [selectedChartType, setSelectedChartType] = useState(chartType);
  const [viewMode, setViewMode] = useState<'chart' | 'cards'>('chart');

  const isCompact = variant === 'compact';
  const colors = {
    todo: '#6B7280',
    in_progress: '#3B82F6',
    review: '#F59E0B',
    done: '#10B981',
    cancelled: '#EF4444'
  };

  // Prepare chart data
  const chartData = statusData.map(item => ({
    name: t(`taskStatus.${item.status}`),
    value: item.count,
    percentage: item.percentage,
    status: item.status,
    fill: colors[item.status as keyof typeof colors]
  }));

  // Funnel data for conversion flow
  const funnelData = [
    { name: t('taskStatus.todo'), value: statusData.find(s => s.status === 'todo')?.count || 0, fill: colors.todo },
    { name: t('taskStatus.in_progress'), value: statusData.find(s => s.status === 'in_progress')?.count || 0, fill: colors.in_progress },
    { name: t('taskStatus.review'), value: statusData.find(s => s.status === 'review')?.count || 0, fill: colors.review },
    { name: t('taskStatus.done'), value: statusData.find(s => s.status === 'done')?.count || 0, fill: colors.done }
  ];

  const renderChart = () => {
    const height = isCompact ? 200 : 300;

    switch (selectedChartType) {
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={isCompact ? 60 : 80}
                dataKey="value"
                label={({ name, percentage }) => `${name} (${percentage}%)`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {Object.entries(colors).map(([status, color]) => (
                <Line
                  key={status}
                  type="monotone"
                  dataKey={status}
                  stroke={color}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {Object.entries(colors).map(([status, color]) => (
                <Area
                  key={status}
                  type="monotone"
                  dataKey={status}
                  stackId="1"
                  stroke={color}
                  fill={color}
                  fillOpacity={0.6}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'funnel':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <FunnelChart>
              <Funnel
                data={funnelData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
              >
                <LabelList position="center" fill="#fff" stroke="none" />
                {funnelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Funnel>
              <Tooltip />
            </FunnelChart>
          </ResponsiveContainer>
        );

      case 'composed':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <ComposedChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="done" stackId="a" fill={colors.done} />
              <Bar dataKey="in_progress" stackId="a" fill={colors.in_progress} />
              <Bar dataKey="review" stackId="a" fill={colors.review} />
              <Bar dataKey="todo" stackId="a" fill={colors.todo} />
              <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        );

      default: // bar
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`font-bold ${isCompact ? 'text-lg' : 'text-2xl'} text-gray-900`}>
            {t('taskStatusAnalytics')}
          </h2>
          <p className={`text-gray-600 ${isCompact ? 'text-sm' : ''}`}>
            {t('taskStatusDescription')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">{t('thisWeek')}</SelectItem>
              <SelectItem value="month">{t('thisMonth')}</SelectItem>
              <SelectItem value="quarter">{t('thisQuarter')}</SelectItem>
              <SelectItem value="year">{t('thisYear')}</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'chart' ? 'cards' : 'chart')}>
            {viewMode === 'chart' ? t('cardView') : t('chartView')}
          </Button>

          <Button variant="outline" size="sm" onClick={() => onExport?.('png')}>
            <Download className="h-4 w-4 mr-2" />
            {t('export')}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className={`grid gap-4 ${isCompact ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-4'}`}>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('completionRate')}</p>
                <p className="text-2xl font-bold text-green-600">{metrics.completionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('avgTime')}</p>
                <p className="text-2xl font-bold text-blue-600">{metrics.averageCompletionTime}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('overdue')}</p>
                <p className="text-2xl font-bold text-red-600">{metrics.overdueCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <CheckSquare className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('totalTasks')}</p>
                <p className="text-2xl font-bold text-purple-600">{metrics.totalTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {t('statusDistribution')}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={selectedChartType} onValueChange={setSelectedChartType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">{t('barChart')}</SelectItem>
                  <SelectItem value="pie">{t('pieChart')}</SelectItem>
                  <SelectItem value="line">{t('lineChart')}</SelectItem>
                  <SelectItem value="area">{t('areaChart')}</SelectItem>
                  <SelectItem value="funnel">{t('funnelChart')}</SelectItem>
                  <SelectItem value="composed">{t('composedChart')}</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {t('filter')}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {viewMode === 'chart' ? (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
                <TabsTrigger value="trends">{t('trends')}</TabsTrigger>
                <TabsTrigger value="burndown">{t('burndown')}</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                {renderChart()}
              </TabsContent>

              <TabsContent value="trends" className="mt-6">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    {Object.entries(colors).map(([status, color]) => (
                      <Line
                        key={status}
                        type="monotone"
                        dataKey={status}
                        stroke={color}
                        strokeWidth={2}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>

              <TabsContent value="burndown" className="mt-6">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={metrics.burndownData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="remaining"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      name={t('actualRemaining')}
                    />
                    <Line
                      type="monotone"
                      dataKey="ideal"
                      stroke="#10B981"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name={t('idealBurndown')}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          ) : (
            <div className={`grid gap-4 ${
              variant === 'compact'
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {statusData.map((status) => (
                <StatusCard
                  key={status.status}
                  statusData={status}
                  variant={variant}
                  onClick={() => onStatusClick?.(status.status)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskStatusChart;