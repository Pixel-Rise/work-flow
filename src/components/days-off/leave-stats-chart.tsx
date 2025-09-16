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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  Legend
} from 'recharts';
import {
  CalendarDays,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

export interface LeaveStats {
  totalDays: number;
  usedDays: number;
  remainingDays: number;
  pendingDays: number;
  approvedDays: number;
  rejectedDays: number;
  utilizationRate: number;
  averageLeaveLength: number;
  peakMonth: string;
  trend: 'up' | 'down' | 'stable';
}

export interface LeaveTypeStats {
  type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'emergency' | 'other';
  allocated: number;
  used: number;
  remaining: number;
  requests: number;
  color: string;
}

export interface MonthlyLeaveData {
  month: string;
  vacation: number;
  sick: number;
  personal: number;
  maternity: number;
  emergency: number;
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}

export interface LeaveStatsChartProps {
  stats: LeaveStats;
  typeStats: LeaveTypeStats[];
  monthlyData: MonthlyLeaveData[];
  variant?: 'default' | 'compact' | 'detailed';
  chartType?: 'bar' | 'pie' | 'line' | 'area';
  showTrends?: boolean;
  timeRange?: 'quarter' | 'year' | 'all';
  onExport?: (format: 'png' | 'pdf' | 'csv') => void;
  className?: string;
}

const StatsCard: React.FC<{
  title: string;
  value: string | number;
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

const LeaveTypeCard: React.FC<{
  typeData: LeaveTypeStats;
  variant: 'default' | 'compact' | 'detailed';
}> = ({ typeData, variant }) => {
  const { t } = useTranslation();
  const isCompact = variant === 'compact';
  const utilizationRate = (typeData.used / typeData.allocated) * 100;

  const getStatusColor = () => {
    if (utilizationRate >= 90) return 'text-red-600 bg-red-100';
    if (utilizationRate >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  return (
    <Card>
      <CardContent className={`p-${isCompact ? '4' : '6'}`}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: typeData.color }}
              />
              <h4 className={`font-medium ${isCompact ? 'text-sm' : ''}`}>
                {t(`leaveType.${typeData.type}`)}
              </h4>
            </div>
            <Badge variant="outline" className={`text-xs ${getStatusColor()}`}>
              {utilizationRate.toFixed(0)}%
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{t('used')}</span>
              <span className="font-medium">{typeData.used}/{typeData.allocated}</span>
            </div>
            <Progress value={utilizationRate} className="h-2" />
          </div>

          <div className={`grid grid-cols-2 gap-2 text-center ${isCompact ? 'text-xs' : 'text-sm'}`}>
            <div>
              <p className="font-medium text-green-600">{typeData.remaining}</p>
              <p className="text-gray-500">{t('remaining')}</p>
            </div>
            <div>
              <p className="font-medium text-blue-600">{typeData.requests}</p>
              <p className="text-gray-500">{t('requests')}</p>
            </div>
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
            {`${entry.dataKey}: ${entry.value} ${entry.dataKey.includes('rate') ? '%' : 'days'}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const LeaveStatsChart: React.FC<LeaveStatsChartProps> = ({
  stats,
  typeStats,
  monthlyData,
  variant = 'default',
  chartType = 'bar',
  showTrends = true,
  timeRange = 'year',
  onExport,
  className = ''
}) => {
  const { t } = useTranslation();
  const [selectedChartType, setSelectedChartType] = useState(chartType);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [viewMode, setViewMode] = useState<'chart' | 'cards'>('chart');

  const isCompact = variant === 'compact';

  // Prepare pie chart data
  const pieData = typeStats.map(type => ({
    name: t(`leaveType.${type.type}`),
    value: type.used,
    fill: type.color
  }));

  // Prepare trend data
  const trendData = monthlyData.map(item => ({
    month: item.month,
    total: item.total,
    approved: item.approved,
    pending: item.pending,
    rejected: item.rejected,
    utilizationRate: (item.total / 22) * 100 // Assuming 22 working days per month
  }));

  const renderChart = () => {
    const height = isCompact ? 200 : 300;

    switch (selectedChartType) {
      case 'pie':
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
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#3B82F6"
                strokeWidth={2}
                name={t('totalLeaves')}
              />
              <Line
                type="monotone"
                dataKey="approved"
                stroke="#10B981"
                strokeWidth={2}
                name={t('approved')}
              />
              <Line
                type="monotone"
                dataKey="pending"
                stroke="#F59E0B"
                strokeWidth={2}
                name={t('pending')}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="approved"
                stackId="1"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="pending"
                stackId="1"
                stroke="#F59E0B"
                fill="#F59E0B"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="rejected"
                stackId="1"
                stroke="#EF4444"
                fill="#EF4444"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      default: // bar
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="vacation" fill="#3B82F6" name={t('leaveType.vacation')} />
              <Bar dataKey="sick" fill="#EF4444" name={t('leaveType.sick')} />
              <Bar dataKey="personal" fill="#10B981" name={t('leaveType.personal')} />
              <Bar dataKey="maternity" fill="#8B5CF6" name={t('leaveType.maternity')} />
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
            {t('leaveStatistics')}
          </h2>
          <p className={`text-gray-600 ${isCompact ? 'text-sm' : ''}`}>
            {t('leaveStatsDescription')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quarter">{t('thisQuarter')}</SelectItem>
              <SelectItem value="year">{t('thisYear')}</SelectItem>
              <SelectItem value="all">{t('allTime')}</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'chart' ? 'cards' : 'chart')}
          >
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
        <StatsCard
          title={t('totalLeaves')}
          value={`${stats.usedDays}/${stats.totalDays}`}
          subtitle={`${stats.utilizationRate}% ${t('utilized')}`}
          icon={<CalendarDays />}
          trend={{
            value: 12,
            direction: stats.trend
          }}
          color="blue"
          variant={variant}
        />

        <StatsCard
          title={t('remainingLeaves')}
          value={stats.remainingDays}
          subtitle={t('daysLeft')}
          icon={<Clock />}
          color="green"
          variant={variant}
        />

        <StatsCard
          title={t('pendingApprovals')}
          value={stats.pendingDays}
          subtitle={t('awaitingApproval')}
          icon={<AlertTriangle />}
          color="yellow"
          variant={variant}
        />

        <StatsCard
          title={t('averageLength')}
          value={`${stats.averageLeaveLength} ${t('days')}`}
          subtitle={t('perRequest')}
          icon={<Users />}
          color="purple"
          variant={variant}
        />
      </div>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {t('leaveAnalytics')}
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
                <TabsTrigger value="types">{t('leaveTypes')}</TabsTrigger>
                <TabsTrigger value="trends">{t('trends')}</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                {renderChart()}
              </TabsContent>

              <TabsContent value="types" className="mt-6">
                <div className={`grid gap-4 ${
                  variant === 'compact'
                    ? 'grid-cols-1 md:grid-cols-2'
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                }`}>
                  {typeStats.map((type) => (
                    <LeaveTypeCard
                      key={type.type}
                      typeData={type}
                      variant={variant}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="trends" className="mt-6">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      name={t('totalLeaves')}
                    />
                    <Line
                      type="monotone"
                      dataKey="utilizationRate"
                      stroke="#10B981"
                      strokeWidth={2}
                      name={t('utilizationRate')}
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
              {typeStats.map((type) => (
                <LeaveTypeCard
                  key={type.type}
                  typeData={type}
                  variant={variant}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Statistics */}
      {!isCompact && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('approvalStatistics')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{t('approved')}</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {stats.approvedDays} {t('days')}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">{t('pending')}</span>
                  </div>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {stats.pendingDays} {t('days')}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm">{t('rejected')}</span>
                  </div>
                  <Badge variant="secondary" className="bg-red-100 text-red-800">
                    {stats.rejectedDays} {t('days')}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('insights')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-blue-50">
                  <p className="text-sm font-medium text-blue-900">
                    {t('peakLeaveMonth')}: {stats.peakMonth}
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    {t('planAheadForCoverage')}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-green-50">
                  <p className="text-sm font-medium text-green-900">
                    {t('utilizationRate')}: {stats.utilizationRate}%
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    {stats.utilizationRate < 70
                      ? t('encourageWellBeing')
                      : t('goodUtilization')
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LeaveStatsChart;