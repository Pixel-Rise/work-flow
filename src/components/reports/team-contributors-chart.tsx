import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ScatterChart,
  Scatter
} from 'recharts';
import {
  Users,
  TrendingUp,
  TrendingDown,
  Star,
  Award,
  Target,
  Clock,
  CheckSquare,
  AlertTriangle,
  Crown,
  Activity,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  MoreVertical,
  Eye
} from 'lucide-react';

export interface ContributorData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  department?: string;
  tasksCompleted: number;
  tasksTotal: number;
  hoursWorked: number;
  productivityScore: number;
  commitCount?: number;
  pullRequests?: number;
  codeReviews?: number;
  issuesResolved?: number;
  rating: number;
  trend: 'up' | 'down' | 'stable';
  isActive: boolean;
  joinDate: string;
  skills?: string[];
  projects: string[];
}

export interface TeamMetrics {
  totalContributors: number;
  activeContributors: number;
  averageProductivity: number;
  totalHours: number;
  totalTasksCompleted: number;
  topPerformer: ContributorData;
  teamVelocity: number;
  collaborationScore: number;
}

export interface ContributorActivity {
  date: string;
  contributor: string;
  tasks: number;
  hours: number;
  commits?: number;
  reviews?: number;
}

export interface TeamContributorsChartProps {
  contributors: ContributorData[];
  teamMetrics: TeamMetrics;
  activityData: ContributorActivity[];
  variant?: 'default' | 'compact' | 'detailed';
  chartType?: 'bar' | 'radar' | 'scatter' | 'pie' | 'line' | 'leaderboard';
  timeRange?: 'week' | 'month' | 'quarter' | 'year';
  showSkills?: boolean;
  showTrends?: boolean;
  groupBy?: 'department' | 'role' | 'project' | 'none';
  onContributorSelect?: (contributorId: string) => void;
  onExport?: (format: 'png' | 'pdf' | 'csv') => void;
  className?: string;
}

const ContributorCard: React.FC<{
  contributor: ContributorData;
  rank?: number;
  variant: 'default' | 'compact' | 'detailed';
  showSkills: boolean;
  onClick: () => void;
}> = ({ contributor, rank, variant, showSkills, onClick }) => {
  const { t } = useTranslation();
  const isCompact = variant === 'compact';
  const isDetailed = variant === 'detailed';

  const getProductivityColor = () => {
    if (contributor.productivityScore >= 85) return 'text-green-600 bg-green-100';
    if (contributor.productivityScore >= 70) return 'text-blue-600 bg-blue-100';
    if (contributor.productivityScore >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getTrendIcon = () => {
    switch (contributor.trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-600" />;
      default:
        return null;
    }
  };

  const getRankIcon = () => {
    if (rank === 1) return <Crown className="h-4 w-4 text-yellow-500" />;
    if (rank === 2) return <Award className="h-4 w-4 text-gray-400" />;
    if (rank === 3) return <Award className="h-4 w-4 text-orange-500" />;
    return null;
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardContent className={`p-${isCompact ? '4' : '6'}`}>
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className={isCompact ? 'h-10 w-10' : 'h-12 w-12'}>
                  <AvatarImage src={contributor.avatar} alt={contributor.name} />
                  <AvatarFallback>{contributor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {contributor.isActive && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {rank && getRankIcon()}
                  <h4 className={`font-medium ${isCompact ? 'text-sm' : ''}`}>
                    {contributor.name}
                  </h4>
                  {rank && (
                    <Badge variant="outline" className="text-xs">
                      #{rank}
                    </Badge>
                  )}
                </div>
                <p className={`text-gray-600 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                  {contributor.role}
                </p>
                {contributor.department && isDetailed && (
                  <p className="text-xs text-gray-500">{contributor.department}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {getTrendIcon()}
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Productivity Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${isCompact ? 'text-xs' : ''}`}>
                {t('productivityScore')}
              </span>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getProductivityColor()}`}>
                {contributor.productivityScore}%
              </div>
            </div>
            <Progress value={contributor.productivityScore} className="h-2" />
          </div>

          {/* Stats Grid */}
          <div className={`grid grid-cols-${isDetailed ? '3' : '2'} gap-4 text-center`}>
            <div>
              <p className={`font-medium ${isCompact ? 'text-sm' : ''}`}>
                {contributor.tasksCompleted}/{contributor.tasksTotal}
              </p>
              <p className={`text-gray-500 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                {t('tasks')}
              </p>
            </div>

            <div>
              <p className={`font-medium ${isCompact ? 'text-sm' : ''}`}>
                {contributor.hoursWorked}h
              </p>
              <p className={`text-gray-500 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                {t('hours')}
              </p>
            </div>

            {isDetailed && contributor.commitCount !== undefined && (
              <div>
                <p className={`font-medium ${isCompact ? 'text-sm' : ''}`}>
                  {contributor.commitCount}
                </p>
                <p className={`text-gray-500 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                  {t('commits')}
                </p>
              </div>
            )}
          </div>

          {/* Additional Metrics */}
          {isDetailed && (
            <div className="grid grid-cols-2 gap-4 pt-3 border-t">
              {contributor.pullRequests !== undefined && (
                <div className="text-center">
                  <p className="text-sm font-medium">{contributor.pullRequests}</p>
                  <p className="text-xs text-gray-500">{t('pullRequests')}</p>
                </div>
              )}

              {contributor.codeReviews !== undefined && (
                <div className="text-center">
                  <p className="text-sm font-medium">{contributor.codeReviews}</p>
                  <p className="text-xs text-gray-500">{t('reviews')}</p>
                </div>
              )}

              {contributor.issuesResolved !== undefined && (
                <div className="text-center">
                  <p className="text-sm font-medium">{contributor.issuesResolved}</p>
                  <p className="text-xs text-gray-500">{t('issues')}</p>
                </div>
              )}
            </div>
          )}

          {/* Skills */}
          {showSkills && contributor.skills && contributor.skills.length > 0 && (
            <div className="pt-3 border-t">
              <p className="text-xs font-medium text-gray-600 mb-2">{t('skills')}</p>
              <div className="flex flex-wrap gap-1">
                {contributor.skills.slice(0, 3).map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {contributor.skills.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{contributor.skills.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < contributor.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500">
              {t('since')} {new Date(contributor.joinDate).getFullYear()}
            </p>
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
            {`${entry.dataKey}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const TeamContributorsChart: React.FC<TeamContributorsChartProps> = ({
  contributors,
  teamMetrics,
  activityData,
  variant = 'default',
  chartType = 'bar',
  timeRange = 'month',
  showSkills = true,
  showTrends = true,
  groupBy = 'none',
  onContributorSelect,
  onExport,
  className = ''
}) => {
  const { t } = useTranslation();
  const [selectedMetric, setSelectedMetric] = useState<'productivity' | 'tasks' | 'hours' | 'commits'>('productivity');
  const [selectedChartType, setSelectedChartType] = useState(chartType);
  const [viewMode, setViewMode] = useState<'chart' | 'cards' | 'leaderboard'>('chart');

  const isCompact = variant === 'compact';

  // Sort contributors by selected metric
  const sortedContributors = [...contributors].sort((a, b) => {
    switch (selectedMetric) {
      case 'productivity':
        return b.productivityScore - a.productivityScore;
      case 'tasks':
        return b.tasksCompleted - a.tasksCompleted;
      case 'hours':
        return b.hoursWorked - a.hoursWorked;
      case 'commits':
        return (b.commitCount || 0) - (a.commitCount || 0);
      default:
        return b.productivityScore - a.productivityScore;
    }
  });

  // Prepare chart data
  const chartData = sortedContributors.slice(0, 10).map(contributor => ({
    name: contributor.name.split(' ')[0],
    productivity: contributor.productivityScore,
    tasks: contributor.tasksCompleted,
    hours: contributor.hoursWorked,
    commits: contributor.commitCount || 0,
    rating: contributor.rating * 20 // Scale to 100
  }));

  const radarData = sortedContributors.slice(0, 6).map(contributor => ({
    contributor: contributor.name.split(' ')[0],
    productivity: contributor.productivityScore,
    tasks: (contributor.tasksCompleted / contributor.tasksTotal) * 100,
    quality: contributor.rating * 20,
    collaboration: Math.random() * 40 + 60, // Mock data
    innovation: Math.random() * 40 + 50 // Mock data
  }));

  const scatterData = contributors.map(contributor => ({
    x: contributor.tasksCompleted,
    y: contributor.productivityScore,
    z: contributor.hoursWorked,
    name: contributor.name
  }));

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

  const renderChart = () => {
    const height = isCompact ? 250 : 350;

    switch (selectedChartType) {
      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="contributor" fontSize={12} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} fontSize={10} />
              <Radar
                dataKey="productivity"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.1}
              />
              <Radar
                dataKey="tasks"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.1}
              />
              <Radar
                dataKey="quality"
                stroke="#F59E0B"
                fill="#F59E0B"
                fillOpacity={0.1}
              />
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <ScatterChart data={scatterData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="x"
                name="Tasks Completed"
                fontSize={12}
              />
              <YAxis
                dataKey="y"
                name="Productivity Score"
                fontSize={12}
              />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={<CustomTooltip />}
              />
              <Scatter
                dataKey="y"
                fill="#3B82F6"
              />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'pie':
        const pieData = contributors.reduce((acc, contributor) => {
          const dept = contributor.department || 'Other';
          acc[dept] = (acc[dept] || 0) + contributor.tasksCompleted;
          return acc;
        }, {} as Record<string, number>);

        const pieChartData = Object.entries(pieData).map(([dept, tasks], index) => ({
          name: dept,
          value: tasks,
          fill: colors[index % colors.length]
        }));

        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                outerRadius={isCompact ? 80 : 120}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'line':
        const timelineData = activityData
          .reduce((acc, activity) => {
            const existing = acc.find(item => item.date === activity.date);
            if (existing) {
              existing.tasks += activity.tasks;
              existing.hours += activity.hours;
            } else {
              acc.push({
                date: activity.date,
                tasks: activity.tasks,
                hours: activity.hours
              });
            }
            return acc;
          }, [] as any[])
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="tasks"
                stroke="#3B82F6"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="hours"
                stroke="#10B981"
                strokeWidth={2}
              />
            </LineChart>
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
              <Bar
                dataKey={selectedMetric}
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              />
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
            {t('teamContributors')}
          </h2>
          <p className={`text-gray-600 ${isCompact ? 'text-sm' : ''}`}>
            {t('teamContributorsDescription')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="productivity">{t('productivity')}</SelectItem>
              <SelectItem value="tasks">{t('tasks')}</SelectItem>
              <SelectItem value="hours">{t('hours')}</SelectItem>
              <SelectItem value="commits">{t('commits')}</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'chart' ? 'cards' : viewMode === 'cards' ? 'leaderboard' : 'chart')}
          >
            {viewMode === 'chart' ? t('cardView') : viewMode === 'cards' ? t('leaderboard') : t('chartView')}
          </Button>

          <Button variant="outline" size="sm" onClick={() => onExport?.('png')}>
            <Download className="h-4 w-4 mr-2" />
            {t('export')}
          </Button>
        </div>
      </div>

      {/* Team Metrics */}
      <div className={`grid gap-4 ${isCompact ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-4'}`}>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('totalContributors')}</p>
                <p className="text-2xl font-bold text-blue-600">{teamMetrics.totalContributors}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('activeNow')}</p>
                <p className="text-2xl font-bold text-green-600">{teamMetrics.activeContributors}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Target className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('avgProductivity')}</p>
                <p className="text-2xl font-bold text-yellow-600">{teamMetrics.averageProductivity}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('totalHours')}</p>
                <p className="text-2xl font-bold text-purple-600">{teamMetrics.totalHours}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t('contributorAnalytics')}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={selectedChartType} onValueChange={setSelectedChartType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">{t('barChart')}</SelectItem>
                  <SelectItem value="radar">{t('radarChart')}</SelectItem>
                  <SelectItem value="scatter">{t('scatterChart')}</SelectItem>
                  <SelectItem value="pie">{t('pieChart')}</SelectItem>
                  <SelectItem value="line">{t('lineChart')}</SelectItem>
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
                <TabsTrigger value="performance">{t('performance')}</TabsTrigger>
                <TabsTrigger value="activity">{t('activity')}</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                {renderChart()}
              </TabsContent>

              <TabsContent value="performance" className="mt-6">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="productivity" fill="#3B82F6" />
                    <Bar dataKey="rating" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>

              <TabsContent value="activity" className="mt-6">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={activityData.slice(-30)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="tasks" stroke="#3B82F6" />
                    <Line type="monotone" dataKey="hours" stroke="#10B981" />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          ) : viewMode === 'cards' ? (
            <div className={`grid gap-4 ${
              variant === 'compact'
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {sortedContributors.map((contributor, index) => (
                <ContributorCard
                  key={contributor.id}
                  contributor={contributor}
                  rank={index + 1}
                  variant={variant}
                  showSkills={showSkills}
                  onClick={() => onContributorSelect?.(contributor.id)}
                />
              ))}
            </div>
          ) : (
            /* Leaderboard View */
            <div className="space-y-2">
              {sortedContributors.slice(0, 10).map((contributor, index) => (
                <div
                  key={contributor.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 cursor-pointer"
                  onClick={() => onContributorSelect?.(contributor.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-lg font-bold text-gray-400 w-6">
                      {index + 1}
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={contributor.avatar} alt={contributor.name} />
                      <AvatarFallback>{contributor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{contributor.name}</h4>
                      <p className="text-sm text-gray-600">{contributor.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">{contributor.productivityScore}%</p>
                      <p className="text-xs text-gray-500">{t('productivity')}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{contributor.tasksCompleted}</p>
                      <p className="text-xs text-gray-500">{t('tasks')}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{contributor.hoursWorked}h</p>
                      <p className="text-xs text-gray-500">{t('hours')}</p>
                    </div>
                    {getTrendIcon(contributor)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to get trend icon
const getTrendIcon = (contributor: ContributorData) => {
  switch (contributor.trend) {
    case 'up':
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    case 'down':
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    default:
      return null;
  }
};

export default TeamContributorsChart;