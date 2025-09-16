import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  BarChart,
  PieChart,
  LineChart,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  CheckSquare,
  Target,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  Plus,
  Eye,
  Settings
} from 'lucide-react';

export interface ReportSummary {
  id: string;
  title: string;
  value: string | number;
  change: {
    value: number;
    trend: 'up' | 'down' | 'stable';
    period: string;
  };
  icon: React.ReactElement;
  color: string;
}

export interface QuickReport {
  id: string;
  name: string;
  description: string;
  type: 'chart' | 'table' | 'metric';
  chartType?: 'bar' | 'line' | 'pie' | 'area';
  lastUpdated: string;
  isFavorite: boolean;
  tags: string[];
}

export interface ReportsOverviewProps {
  summaryData: ReportSummary[];
  quickReports: QuickReport[];
  variant?: 'default' | 'compact' | 'dashboard';
  showSummaryCards?: boolean;
  showQuickReports?: boolean;
  showRecentActivity?: boolean;
  selectedPeriod?: string;
  onPeriodChange?: (period: string) => void;
  onCreateReport?: () => void;
  onViewReport?: (reportId: string) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  className?: string;
}

const SummaryCard: React.FC<{
  summary: ReportSummary;
  variant: 'default' | 'compact' | 'dashboard';
}> = ({ summary, variant }) => {
  const { t } = useTranslation();
  const isCompact = variant === 'compact';
  const isDashboard = variant === 'dashboard';

  const getTrendIcon = () => {
    switch (summary.change.trend) {
      case 'up':
        return <TrendingUp className={`h-4 w-4 text-green-600 ${isCompact ? 'h-3 w-3' : ''}`} />;
      case 'down':
        return <TrendingDown className={`h-4 w-4 text-red-600 ${isCompact ? 'h-3 w-3' : ''}`} />;
      default:
        return <div className={`h-4 w-4 ${isCompact ? 'h-3 w-3' : ''}`} />;
    }
  };

  const getTrendColor = () => {
    switch (summary.change.trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card className={isDashboard ? 'border-0 shadow-sm' : ''}>
      <CardContent className={`p-${isCompact ? '4' : '6'}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className={`p-2 rounded-lg bg-${summary.color}-100`}>
                {React.cloneElement(summary.icon, {
                  className: `h-${isCompact ? '4' : '5'} w-${isCompact ? '4' : '5'} text-${summary.color}-600`
                })}
              </div>
              {!isCompact && (
                <div>
                  <p className="text-sm font-medium text-gray-600">{summary.title}</p>
                </div>
              )}
            </div>

            {isCompact && (
              <p className="text-xs font-medium text-gray-600 mb-2">{summary.title}</p>
            )}

            <div className="flex items-end gap-2">
              <p className={`font-bold ${isCompact ? 'text-xl' : 'text-2xl'} text-gray-900`}>
                {summary.value}
              </p>
              <div className={`flex items-center gap-1 ${getTrendColor()}`}>
                {getTrendIcon()}
                <span className={`font-medium ${isCompact ? 'text-xs' : 'text-sm'}`}>
                  {Math.abs(summary.change.value)}%
                </span>
              </div>
            </div>

            <p className={`${isCompact ? 'text-xs' : 'text-sm'} text-gray-500 mt-1`}>
              {t('vs')} {summary.change.period}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const QuickReportCard: React.FC<{
  report: QuickReport;
  onView: () => void;
  variant: 'default' | 'compact' | 'dashboard';
}> = ({ report, onView, variant }) => {
  const { t } = useTranslation();
  const isCompact = variant === 'compact';

  const getTypeIcon = () => {
    switch (report.type) {
      case 'chart':
        return report.chartType === 'pie' ? <PieChart /> :
               report.chartType === 'line' ? <LineChart /> : <BarChart />;
      case 'table':
        return <CheckSquare />;
      case 'metric':
        return <Target />;
      default:
        return <BarChart />;
    }
  };

  return (
    <Card className="group hover:shadow-md transition-shadow cursor-pointer" onClick={onView}>
      <CardContent className={`p-${isCompact ? '4' : '6'}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1 rounded bg-gray-100 group-hover:bg-blue-100 transition-colors">
                {React.cloneElement(getTypeIcon(), {
                  className: `h-4 w-4 text-gray-600 group-hover:text-blue-600`
                })}
              </div>
              <Badge variant="outline" className="text-xs">
                {t(`reportType.${report.type}`)}
              </Badge>
            </div>

            <h4 className={`font-medium mb-1 ${isCompact ? 'text-sm' : ''}`}>{report.name}</h4>
            <p className={`text-gray-600 mb-3 ${isCompact ? 'text-xs' : 'text-sm'}`}>
              {report.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {report.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {report.tags.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{report.tags.length - 2}
                  </Badge>
                )}
              </div>

              <Button variant="ghost" size="sm" className="h-6 px-2">
                <Eye className="h-3 w-3 mr-1" />
                {t('view')}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <p className="text-xs text-gray-500">
            {t('updated')}: {new Date(report.lastUpdated).toLocaleDateString()}
          </p>
          {report.isFavorite && (
            <div className="text-yellow-500">★</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const ReportsOverview: React.FC<ReportsOverviewProps> = ({
  summaryData,
  quickReports,
  variant = 'default',
  showSummaryCards = true,
  showQuickReports = true,
  showRecentActivity = true,
  selectedPeriod = 'last30days',
  onPeriodChange,
  onCreateReport,
  onViewReport,
  onRefresh,
  isLoading = false,
  className = ''
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const periods = [
    { value: 'today', label: t('today') },
    { value: 'yesterday', label: t('yesterday') },
    { value: 'last7days', label: t('last7days') },
    { value: 'last30days', label: t('last30days') },
    { value: 'last90days', label: t('last90days') },
    { value: 'thisYear', label: t('thisYear') }
  ];

  const isCompact = variant === 'compact';
  const isDashboard = variant === 'dashboard';

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`font-bold ${isCompact ? 'text-lg' : 'text-2xl'} text-gray-900`}>
            {t('reports')}
          </h2>
          <p className={`text-gray-600 ${isCompact ? 'text-sm' : ''}`}>
            {t('reportsDescription')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Period Selector */}
          <Select value={selectedPeriod} onValueChange={onPeriodChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t('selectPeriod')} />
            </SelectTrigger>
            <SelectContent>
              {periods.map((period) => (
                <SelectItem key={period.value} value={period.value}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Actions */}
          <Button variant="outline" onClick={onRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {t('refresh')}
          </Button>

          <Button onClick={onCreateReport}>
            <Plus className="h-4 w-4 mr-2" />
            {t('createReport')}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {showSummaryCards && (
        <div className={`grid gap-${isCompact ? '4' : '6'} ${
          isCompact ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
        }`}>
          {summaryData.map((summary) => (
            <SummaryCard
              key={summary.id}
              summary={summary}
              variant={variant}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
          <TabsTrigger value="reports">{t('quickReports')}</TabsTrigger>
          <TabsTrigger value="activity">{t('recentActivity')}</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {t('keyMetrics')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                    <div className="flex items-center gap-3">
                      <CheckSquare className="h-5 w-5 text-green-600" />
                      <span className="font-medium">{t('completionRate')}</span>
                    </div>
                    <span className="text-lg font-bold text-green-600">87%</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">{t('avgTimePerTask')}</span>
                    </div>
                    <span className="text-lg font-bold text-blue-600">2.4h</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">{t('activeContributors')}</span>
                    </div>
                    <span className="text-lg font-bold text-purple-600">12</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  {t('recentReports')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quickReports.slice(0, 4).map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer"
                      onClick={() => onViewReport?.(report.id)}
                    >
                      <div className="flex items-center gap-3">
                        {React.cloneElement(getTypeIcon(report), {
                          className: 'h-4 w-4 text-gray-500'
                        })}
                        <div>
                          <p className="text-sm font-medium">{report.name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(report.lastUpdated).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Eye className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Quick Reports Tab */}
        <TabsContent value="reports" className="space-y-6 mt-6">
          {showQuickReports && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{t('quickReports')}</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    {t('filter')}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className={`grid gap-${isCompact ? '4' : '6'} ${
                viewMode === 'grid'
                  ? isCompact
                    ? 'grid-cols-1 md:grid-cols-2'
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              }`}>
                {quickReports.map((report) => (
                  <QuickReportCard
                    key={report.id}
                    report={report}
                    onView={() => onViewReport?.(report.id)}
                    variant={variant}
                  />
                ))}
              </div>
            </>
          )}
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6 mt-6">
          {showRecentActivity && (
            <Card>
              <CardHeader>
                <CardTitle>{t('recentActivity')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg border">
                    <div className="p-1 rounded bg-green-100">
                      <Download className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {t('reportExported', { reportName: 'Project Progress Q4' })}
                      </p>
                      <p className="text-xs text-gray-500">2 {t('hoursAgo')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg border">
                    <div className="p-1 rounded bg-blue-100">
                      <Plus className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {t('newReportCreated', { reportName: 'Team Productivity' })}
                      </p>
                      <p className="text-xs text-gray-500">5 {t('hoursAgo')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg border">
                    <div className="p-1 rounded bg-purple-100">
                      <RefreshCw className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {t('reportUpdated', { reportName: 'Task Status Overview' })}
                      </p>
                      <p className="text-xs text-gray-500">{t('yesterday')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper function for report type icons
const getTypeIcon = (report: QuickReport) => {
  switch (report.type) {
    case 'chart':
      return report.chartType === 'pie' ? <PieChart /> :
             report.chartType === 'line' ? <LineChart /> : <BarChart />;
    case 'table':
      return <CheckSquare />;
    case 'metric':
      return <Target />;
    default:
      return <BarChart />;
  }
};

export default ReportsOverview;