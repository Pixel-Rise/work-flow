import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
  Legend,
  RechartsTooltip
} from 'recharts';
import {
  Clock,
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  PlayCircle,
  PauseCircle,
  StopCircle,
  Timer,
  Award,
  AlertTriangle,
  Activity,
  BarChart3,
  Download,
  Filter,
  RefreshCw,
  Users,
  FolderOpen
} from 'lucide-react';

export interface TimeEntry {
  id: string;
  date: string;
  hours: number;
  minutes: number;
  project: string;
  task: string;
  user: string;
  category: 'development' | 'design' | 'meeting' | 'review' | 'testing' | 'documentation' | 'other';
  billable: boolean;
  overtime: boolean;
  description?: string;
}

export interface TimeSpentData {
  date: string;
  totalHours: number;
  billableHours: number;
  nonBillableHours: number;
  overtimeHours: number;
  development: number;
  design: number;
  meeting: number;
  review: number;
  testing: number;
  documentation: number;
  other: number;
  projects: Record<string, number>;
  users: Record<string, number>;
}

export interface TimeMetrics {
  totalHours: number;
  averageDaily: number;
  billablePercentage: number;
  overtimeHours: number;
  efficiency: number;
  topCategory: string;
  topProject: string;
  activeUsers: number;
  trend: 'up' | 'down' | 'stable';
  comparison: {
    period: string;
    change: number;
  };
}

export interface TimeSpentChartProps {
  timeData: TimeSpentData[];
  timeEntries: TimeEntry[];
  metrics: TimeMetrics;
  variant?: 'default' | 'compact' | 'detailed';
  chartType?: 'area' | 'line' | 'bar' | 'composed' | 'pie' | 'heatmap';
  timeRange?: 'day' | 'week' | 'month' | 'quarter' | 'year';
  groupBy?: 'date' | 'project' | 'user' | 'category';
  showBillable?: boolean;
  showOvertime?: boolean;
  onPeriodChange?: (range: string) => void;
  onExport?: (format: 'png' | 'pdf' | 'csv') => void;
  className?: string;
}

const CategoryIcon: React.FC<{ category: string; className?: string }> = ({ category, className = "h-4 w-4" }) => {
  const iconMap = {
    development: <Target className={`${className} text-blue-600`} />,
    design: <Award className={`${className} text-purple-600`} />,
    meeting: <Users className={`${className} text-green-600`} />,
    review: <Activity className={`${className} text-yellow-600`} />,
    testing: <AlertTriangle className={`${className} text-red-600`} />,
    documentation: <FolderOpen className={`${className} text-gray-600`} />,
    other: <Clock className={`${className} text-gray-500`} />
  };

  return iconMap[category as keyof typeof iconMap] || <Clock className={className} />;
};

const TimeCard: React.FC<{
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactElement;
  trend?: { value: number; direction: 'up' | 'down' | 'stable' };
  color: string;
  variant: 'default' | 'compact' | 'detailed';
}> = ({ title, value, subtitle, icon, trend, color, variant }) => {
  const { t } = useTranslation();
  const isCompact = variant === 'compact';

  const getTrendIcon = () => {
    if (!trend) return null;
    switch (trend.direction) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent className={`p-${isCompact ? '4' : '6'}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-2 rounded-lg bg-${color}-100`}>
                {React.cloneElement(icon, {
                  className: `h-${isCompact ? '4' : '5'} w-${isCompact ? '4' : '5'} text-${color}-600`
                })}
              </div>
              {!isCompact && (
                <p className="text-sm font-medium text-gray-600">{title}</p>
              )}
            </div>

            {isCompact && (
              <p className="text-xs font-medium text-gray-600 mb-2">{title}</p>
            )}

            <div className="flex items-end gap-2">
              <span className={`font-bold ${isCompact ? 'text-xl' : 'text-2xl'} text-gray-900`}>
                {value}
              </span>
              {trend && (
                <div className="flex items-center gap-1">
                  {getTrendIcon()}
                  <span className={`text-sm ${
                    trend.direction === 'up' ? 'text-green-600' :
                    trend.direction === 'down' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {Math.abs(trend.value)}%
                  </span>
                </div>
              )}
            </div>

            {subtitle && (
              <p className={`${isCompact ? 'text-xs' : 'text-sm'} text-gray-500 mt-1`}>
                {subtitle}
              </p>
            )}
          </div>
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
            {`${entry.dataKey}: ${entry.value}h`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const HeatmapCell: React.FC<{
  date: string;
  hours: number;
  maxHours: number;
  onClick: () => void;
}> = ({ date, hours, maxHours, onClick }) => {
  const intensity = Math.min(hours / maxHours, 1);
  const opacity = Math.max(0.1, intensity);

  return (
    <div
      className={`w-3 h-3 rounded-sm cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all`}
      style={{
        backgroundColor: `rgba(59, 130, 246, ${opacity})`
      }}
      title={`${date}: ${hours}h`}
      onClick={onClick}
    />
  );
};

export const TimeSpentChart: React.FC<TimeSpentChartProps> = ({
  timeData,
  timeEntries,
  metrics,
  variant = 'default',
  chartType = 'area',
  timeRange = 'month',
  groupBy = 'date',
  showBillable = true,
  showOvertime = true,
  onPeriodChange,
  onExport,
  className = ''
}) => {
  const { t } = useTranslation();
  const [selectedChartType, setSelectedChartType] = useState(chartType);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'chart' | 'table' | 'heatmap'>('chart');

  const isCompact = variant === 'compact';
  const categoryColors = {
    development: '#3B82F6',
    design: '#8B5CF6',
    meeting: '#10B981',
    review: '#F59E0B',
    testing: '#EF4444',
    documentation: '#6B7280',
    other: '#9CA3AF'
  };

  // Filter data by category if selected
  const filteredData = selectedCategory === 'all' ? timeData : timeData.map(item => ({
    ...item,
    totalHours: item[selectedCategory as keyof typeof item] as number || 0
  }));

  // Prepare chart data based on groupBy
  const chartData = (() => {
    switch (groupBy) {
      case 'project':
        return Object.entries(timeData[0]?.projects || {}).map(([project, hours]) => ({
          name: project,
          hours,
          percentage: (hours / metrics.totalHours) * 100
        }));

      case 'user':
        return Object.entries(timeData[0]?.users || {}).map(([user, hours]) => ({
          name: user,
          hours,
          percentage: (hours / metrics.totalHours) * 100
        }));

      case 'category':
        return Object.entries(categoryColors).map(([category, color]) => ({
          name: t(`category.${category}`),
          hours: timeData.reduce((sum, item) => sum + (item[category as keyof TimeSpentData] as number || 0), 0),
          fill: color
        }));

      default: // date
        return filteredData.map(item => ({
          date: new Date(item.date).toLocaleDateString(),
          totalHours: item.totalHours,
          billableHours: item.billableHours,
          nonBillableHours: item.nonBillableHours,
          overtimeHours: item.overtimeHours,
          ...item
        }));
    }
  })();

  // Generate heatmap data for year view
  const heatmapData = timeData.map(item => ({
    date: item.date,
    hours: item.totalHours,
    day: new Date(item.date).getDay(),
    week: Math.floor(new Date(item.date).getDate() / 7)
  }));

  const maxHours = Math.max(...timeData.map(item => item.totalHours));

  const renderChart = () => {
    const height = isCompact ? 200 : 300;

    switch (selectedChartType) {
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="totalHours"
                stackId="1"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.6}
              />
              {showBillable && (
                <Area
                  type="monotone"
                  dataKey="billableHours"
                  stackId="2"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.4}
                />
              )}
              {showOvertime && (
                <Area
                  type="monotone"
                  dataKey="overtimeHours"
                  stackId="3"
                  stroke="#EF4444"
                  fill="#EF4444"
                  fillOpacity={0.3}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="totalHours"
                stroke="#3B82F6"
                strokeWidth={2}
              />
              {showBillable && (
                <Line
                  type="monotone"
                  dataKey="billableHours"
                  stroke="#10B981"
                  strokeWidth={2}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="totalHours" fill="#3B82F6" />
              {showBillable && (
                <Bar dataKey="billableHours" fill="#10B981" />
              )}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'composed':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="billableHours" fill="#10B981" />
              <Bar dataKey="nonBillableHours" fill="#F59E0B" />
              <Line type="monotone" dataKey="totalHours" stroke="#3B82F6" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        );

      case 'pie':
        const pieData = groupBy === 'category' ? chartData :
          Object.entries(categoryColors).map(([category, color]) => ({
            name: t(`category.${category}`),
            value: timeData.reduce((sum, item) => sum + (item[category as keyof TimeSpentData] as number || 0), 0),
            fill: color
          }));

        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={isCompact ? 60 : 80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'heatmap':
        return (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-xs text-gray-500 text-center">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {heatmapData.map((item, index) => (
                <HeatmapCell
                  key={index}
                  date={item.date}
                  hours={item.hours}
                  maxHours={maxHours}
                  onClick={() => {}}
                />
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
              <span>{t('lessActive')}</span>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: `rgba(59, 130, 246, ${0.2 + i * 0.2})` }}
                  />
                ))}
              </div>
              <span>{t('moreActive')}</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`font-bold ${isCompact ? 'text-lg' : 'text-2xl'} text-gray-900`}>
            {t('timeSpentAnalytics')}
          </h2>
          <p className={`text-gray-600 ${isCompact ? 'text-sm' : ''}`}>
            {t('timeSpentDescription')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">{t('today')}</SelectItem>
              <SelectItem value="week">{t('thisWeek')}</SelectItem>
              <SelectItem value="month">{t('thisMonth')}</SelectItem>
              <SelectItem value="quarter">{t('thisQuarter')}</SelectItem>
              <SelectItem value="year">{t('thisYear')}</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(
              viewMode === 'chart' ? 'table' :
              viewMode === 'table' ? 'heatmap' : 'chart'
            )}
          >
            {viewMode === 'chart' ? t('tableView') :
             viewMode === 'table' ? t('heatmapView') : t('chartView')}
          </Button>

          <Button variant="outline" size="sm" onClick={() => onExport?.('png')}>
            <Download className="h-4 w-4 mr-2" />
            {t('export')}
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className={`grid gap-4 ${isCompact ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-4'}`}>
        <TimeCard
          title={t('totalHours')}
          value={`${metrics.totalHours}h`}
          subtitle={`${metrics.averageDaily}h ${t('daily')}`}
          icon={<Clock />}
          trend={{
            value: metrics.comparison.change,
            direction: metrics.trend
          }}
          color="blue"
          variant={variant}
        />

        <TimeCard
          title={t('billableHours')}
          value={`${metrics.billablePercentage}%`}
          subtitle={`${(metrics.totalHours * metrics.billablePercentage / 100).toFixed(1)}h`}
          icon={<Target />}
          color="green"
          variant={variant}
        />

        <TimeCard
          title={t('overtimeHours')}
          value={`${metrics.overtimeHours}h`}
          subtitle={showOvertime ? t('thisWeek') : ''}
          icon={<AlertTriangle />}
          color="red"
          variant={variant}
        />

        <TimeCard
          title={t('efficiency')}
          value={`${metrics.efficiency}%`}
          subtitle={t('productivity')}
          icon={<Activity />}
          color="purple"
          variant={variant}
        />
      </div>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              {t('timeDistribution')}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={groupBy} onValueChange={() => {}}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">{t('byDate')}</SelectItem>
                  <SelectItem value="project">{t('byProject')}</SelectItem>
                  <SelectItem value="user">{t('byUser')}</SelectItem>
                  <SelectItem value="category">{t('byCategory')}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedChartType} onValueChange={setSelectedChartType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="area">{t('areaChart')}</SelectItem>
                  <SelectItem value="line">{t('lineChart')}</SelectItem>
                  <SelectItem value="bar">{t('barChart')}</SelectItem>
                  <SelectItem value="composed">{t('composedChart')}</SelectItem>
                  <SelectItem value="pie">{t('pieChart')}</SelectItem>
                  <SelectItem value="heatmap">{t('heatmap')}</SelectItem>
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
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
                <TabsTrigger value="categories">{t('categories')}</TabsTrigger>
                <TabsTrigger value="projects">{t('projects')}</TabsTrigger>
                <TabsTrigger value="efficiency">{t('efficiency')}</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                {renderChart()}
              </TabsContent>

              <TabsContent value="categories" className="mt-6">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={Object.entries(categoryColors).map(([category, color]) => ({
                    name: t(`category.${category}`),
                    hours: timeData.reduce((sum, item) => sum + (item[category as keyof TimeSpentData] as number || 0), 0),
                    fill: color
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                      {Object.values(categoryColors).map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>

              <TabsContent value="projects" className="mt-6">
                <div className="space-y-3">
                  {Object.entries(timeData[0]?.projects || {})
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 10)
                    .map(([project, hours]) => (
                    <div key={project} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <FolderOpen className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{project}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress
                          value={(hours / metrics.totalHours) * 100}
                          className="w-20 h-2"
                        />
                        <span className="text-sm font-medium w-12">{hours}h</span>
                        <span className="text-xs text-gray-500 w-8">
                          {((hours / metrics.totalHours) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="efficiency" className="mt-6">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="billableHours"
                      stroke="#10B981"
                      strokeWidth={2}
                      name={t('billableHours')}
                    />
                    <Line
                      type="monotone"
                      dataKey="nonBillableHours"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      name={t('nonBillableHours')}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          ) : viewMode === 'heatmap' ? (
            renderChart()
          ) : (
            /* Table View */
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 text-sm font-medium text-gray-600">{t('date')}</th>
                    <th className="pb-2 text-sm font-medium text-gray-600">{t('totalHours')}</th>
                    <th className="pb-2 text-sm font-medium text-gray-600">{t('billable')}</th>
                    <th className="pb-2 text-sm font-medium text-gray-600">{t('overtime')}</th>
                    <th className="pb-2 text-sm font-medium text-gray-600">{t('topCategory')}</th>
                  </tr>
                </thead>
                <tbody>
                  {timeData.slice(0, 10).map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-2 text-sm">{new Date(item.date).toLocaleDateString()}</td>
                      <td className="py-2 text-sm font-medium">{item.totalHours}h</td>
                      <td className="py-2 text-sm">{item.billableHours}h</td>
                      <td className="py-2 text-sm">
                        {item.overtimeHours > 0 && (
                          <span className="text-red-600">{item.overtimeHours}h</span>
                        )}
                      </td>
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <CategoryIcon
                            category={Object.entries(item)
                              .filter(([key]) => key in categoryColors)
                              .sort(([,a], [,b]) => (b as number) - (a as number))[0][0]
                            }
                            className="h-3 w-3"
                          />
                          <span className="text-sm">
                            {t(`category.${
                              Object.entries(item)
                                .filter(([key]) => key in categoryColors)
                                .sort(([,a], [,b]) => (b as number) - (a as number))[0][0]
                            }`)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeSpentChart;