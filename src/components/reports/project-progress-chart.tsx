import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  RadialBarChart,
  RadialBar,
  Legend
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Users,
  Calendar,
  MoreVertical,
  Download,
  RefreshCw,
  Filter
} from 'lucide-react';

export interface ProjectData {
  id: string;
  name: string;
  progress: number;
  status: 'on_track' | 'at_risk' | 'delayed' | 'completed';
  startDate: string;
  endDate: string;
  completedTasks: number;
  totalTasks: number;
  teamSize: number;
  budget?: {
    spent: number;
    total: number;
  };
  milestones?: {
    completed: number;
    total: number;
  };
  trend: 'up' | 'down' | 'stable';
  category?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface ChartDataPoint {
  name: string;
  progress: number;
  planned: number;
  actual: number;
  tasks: number;
  date: string;
  status: string;
  category?: string;
}

export interface ProjectProgressChartProps {
  projects: ProjectData[];
  chartData?: ChartDataPoint[];
  variant?: 'default' | 'compact' | 'detailed';
  chartType?: 'bar' | 'line' | 'area' | 'pie' | 'radial';
  showTrends?: boolean;
  showFilters?: boolean;
  groupBy?: 'status' | 'category' | 'priority' | 'none';
  timeRange?: 'week' | 'month' | 'quarter' | 'year';
  onProjectSelect?: (projectId: string) => void;
  onExport?: (format: 'png' | 'pdf' | 'csv') => void;
  className?: string;
}

const StatusIcon: React.FC<{ status: string; className?: string }> = ({ status, className = "h-4 w-4" }) => {
  const iconMap = {
    on_track: <CheckCircle className={`${className} text-green-500`} />,
    at_risk: <AlertTriangle className={`${className} text-yellow-500`} />,
    delayed: <Clock className={`${className} text-red-500`} />,
    completed: <Target className={`${className} text-blue-500`} />
  };

  return iconMap[status as keyof typeof iconMap] || <Clock className={className} />;
};

const ProjectCard: React.FC<{
  project: ProjectData;
  variant: 'default' | 'compact' | 'detailed';
  onClick: () => void;
}> = ({ project, variant, onClick }) => {
  const { t } = useTranslation();
  const isCompact = variant === 'compact';
  const isDetailed = variant === 'detailed';

  const getStatusColor = () => {
    switch (project.status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'on_track': return 'bg-blue-100 text-blue-800';
      case 'at_risk': return 'bg-yellow-100 text-yellow-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = () => {
    switch (project.priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardContent className={`p-${isCompact ? '4' : '6'}`}>
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-3 h-3 rounded-full ${getPriorityColor()}`} />
                <h4 className={`font-medium truncate ${isCompact ? 'text-sm' : ''}`}>
                  {project.name}
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <StatusIcon status={project.status} className="h-3 w-3" />
                <Badge variant="outline" className={`text-xs ${getStatusColor()}`}>
                  {t(`projectStatus.${project.status}`)}
                </Badge>
                {project.category && (
                  <Badge variant="secondary" className="text-xs">
                    {project.category}
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreVertical className="h-3 w-3" />
            </Button>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-sm text-gray-600 ${isCompact ? 'text-xs' : ''}`}>
                {t('progress')}
              </span>
              <span className={`font-medium ${isCompact ? 'text-sm' : ''}`}>
                {project.progress}%
              </span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>

          {/* Metrics */}
          <div className={`grid grid-cols-${isDetailed ? '3' : '2'} gap-4 text-center`}>
            <div>
              <p className={`font-medium ${isCompact ? 'text-sm' : ''}`}>
                {project.completedTasks}/{project.totalTasks}
              </p>
              <p className={`text-gray-500 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                {t('tasks')}
              </p>
            </div>

            <div>
              <p className={`font-medium ${isCompact ? 'text-sm' : ''}`}>
                {project.teamSize}
              </p>
              <p className={`text-gray-500 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                {t('team')}
              </p>
            </div>

            {isDetailed && project.milestones && (
              <div>
                <p className={`font-medium ${isCompact ? 'text-sm' : ''}`}>
                  {project.milestones.completed}/{project.milestones.total}
                </p>
                <p className={`text-gray-500 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                  {t('milestones')}
                </p>
              </div>
            )}
          </div>

          {/* Budget */}
          {isDetailed && project.budget && (
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">{t('budget')}</span>
                <span className="text-sm font-medium">
                  ${project.budget.spent.toLocaleString()}/${project.budget.total.toLocaleString()}
                </span>
              </div>
              <Progress
                value={(project.budget.spent / project.budget.total) * 100}
                className="h-1"
              />
            </div>
          )}

          {/* Timeline */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(project.endDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              {project.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
              {project.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
              <span className={project.trend === 'up' ? 'text-green-500' : project.trend === 'down' ? 'text-red-500' : ''}>
                {project.trend === 'up' ? t('improving') : project.trend === 'down' ? t('declining') : t('stable')}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  const { t } = useTranslation();

  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-md">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.dataKey}: ${entry.value}${entry.dataKey.includes('progress') ? '%' : ''}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const ProjectProgressChart: React.FC<ProjectProgressChartProps> = ({
  projects,
  chartData,
  variant = 'default',
  chartType = 'bar',
  showTrends = true,
  showFilters = true,
  groupBy = 'none',
  timeRange = 'month',
  onProjectSelect,
  onExport,
  className = ''
}) => {
  const { t } = useTranslation();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'chart' | 'grid'>('chart');

  const isCompact = variant === 'compact';
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

  // Filter projects based on selections
  const filteredProjects = projects.filter(project => {
    if (selectedStatus !== 'all' && project.status !== selectedStatus) return false;
    if (selectedCategory !== 'all' && project.category !== selectedCategory) return false;
    return true;
  });

  // Prepare chart data
  const preparedChartData = chartData || filteredProjects.map((project, index) => ({
    name: project.name.length > 12 ? project.name.substring(0, 12) + '...' : project.name,
    progress: project.progress,
    planned: 100,
    actual: project.progress,
    tasks: project.completedTasks,
    date: project.endDate,
    status: project.status,
    category: project.category
  }));

  // Group data if needed
  const groupedData = groupBy !== 'none' ?
    preparedChartData.reduce((acc, item) => {
      const key = item[groupBy as keyof typeof item] as string;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {} as Record<string, typeof preparedChartData>) :
    { all: preparedChartData };

  const statusDistribution = projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(statusDistribution).map(([status, count]) => ({
    name: t(`projectStatus.${status}`),
    value: count,
    status
  }));

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={isCompact ? 200 : 300}>
            <LineChart data={preparedChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="progress"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
              {showTrends && (
                <Line
                  type="monotone"
                  dataKey="planned"
                  stroke="#10B981"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={isCompact ? 200 : 300}>
            <AreaChart data={preparedChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="progress"
                stackId="1"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={isCompact ? 200 : 300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={isCompact ? 60 : 80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'radial':
        return (
          <ResponsiveContainer width="100%" height={isCompact ? 200 : 300}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="20%"
              outerRadius="90%"
              data={preparedChartData.slice(0, 6)}
            >
              <RadialBar
                minAngle={15}
                label={{ position: 'insideStart', fill: '#fff' }}
                background
                clockWise
                dataKey="progress"
                fill="#3B82F6"
              />
              <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
        );

      default: // bar
        return (
          <ResponsiveContainer width="100%" height={isCompact ? 200 : 300}>
            <BarChart data={preparedChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="progress" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              {showTrends && (
                <Bar dataKey="planned" fill="#E5E7EB" radius={[4, 4, 0, 0]} opacity={0.3} />
              )}
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {t('projectProgress')}
            </CardTitle>
            <div className="flex items-center gap-2">
              {showFilters && (
                <>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder={t('status')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('allStatuses')}</SelectItem>
                      <SelectItem value="on_track">{t('projectStatus.on_track')}</SelectItem>
                      <SelectItem value="at_risk">{t('projectStatus.at_risk')}</SelectItem>
                      <SelectItem value="delayed">{t('projectStatus.delayed')}</SelectItem>
                      <SelectItem value="completed">{t('projectStatus.completed')}</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    {t('filter')}
                  </Button>
                </>
              )}

              <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'chart' ? 'grid' : 'chart')}>
                {viewMode === 'chart' ? t('gridView') : t('chartView')}
              </Button>

              <Button variant="outline" size="sm" onClick={() => onExport?.('png')}>
                <Download className="h-4 w-4 mr-2" />
                {t('export')}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
              <TabsTrigger value="progress">{t('progress')}</TabsTrigger>
              <TabsTrigger value="status">{t('statusBreakdown')}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-6">
              {viewMode === 'chart' ? (
                <div className="space-y-4">
                  {renderChart()}

                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {projects.filter(p => p.status === 'completed').length}
                      </p>
                      <p className="text-sm text-gray-600">{t('completed')}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {projects.filter(p => p.status === 'on_track').length}
                      </p>
                      <p className="text-sm text-gray-600">{t('onTrack')}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-600">
                        {projects.filter(p => p.status === 'at_risk').length}
                      </p>
                      <p className="text-sm text-gray-600">{t('atRisk')}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">
                        {projects.filter(p => p.status === 'delayed').length}
                      </p>
                      <p className="text-sm text-gray-600">{t('delayed')}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`grid gap-4 ${
                  variant === 'compact'
                    ? 'grid-cols-1 md:grid-cols-2'
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                }`}>
                  {filteredProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      variant={variant}
                      onClick={() => onProjectSelect?.(project.id)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="progress" className="mt-6">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={preparedChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="progress" fill="#3B82F6" />
                  <Bar dataKey="tasks" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="status" className="mt-6">
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectProgressChart;