import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  BookmarkIcon,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Download,
  Trash2,
  Star,
  Calendar,
  BarChart,
  LineChart,
  PieChart
} from 'lucide-react';

interface SavedReport {
  id: string;
  name: string;
  description?: string;
  chartType: 'bar' | 'line' | 'pie' | 'area';
  dataSource: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  isFavorite: boolean;
  isShared: boolean;
  tags: string[];
  views: number;
  size: string;
}

interface SavedReportsProps {
  reports: SavedReport[];
  onView?: (reportId: string) => void;
  onEdit?: (reportId: string) => void;
  onDelete?: (reportId: string) => void;
  onDownload?: (reportId: string) => void;
  onToggleFavorite?: (reportId: string) => void;
  variant?: 'default' | 'compact';
  className?: string;
}

const ChartTypeIcon: React.FC<{ type: string; className?: string }> = ({ type, className = "h-4 w-4" }) => {
  const iconMap = {
    bar: BarChart,
    line: LineChart,
    pie: PieChart,
    area: BarChart
  };
  const Icon = iconMap[type as keyof typeof iconMap] || BarChart;
  return <Icon className={className} />;
};

const ReportCard: React.FC<{
  report: SavedReport;
  variant: 'default' | 'compact';
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDownload: () => void;
  onToggleFavorite: () => void;
}> = ({ report, variant, onView, onEdit, onDelete, onDownload, onToggleFavorite }) => {
  const { t } = useTranslation();
  const isCompact = variant === 'compact';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className={`p-${isCompact ? '4' : '6'}`}>
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 flex-1">
              <ChartTypeIcon type={report.chartType} />
              <div className="flex-1 min-w-0">
                <h4 className={`font-medium truncate ${isCompact ? 'text-sm' : ''}`}>
                  {report.name}
                </h4>
                {report.description && !isCompact && (
                  <p className="text-sm text-gray-600 truncate">{report.description}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleFavorite}
                className="h-6 w-6 p-0"
              >
                <Star className={`h-3 w-3 ${report.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onView}>
                    <Eye className="h-4 w-4 mr-2" />
                    {t('view')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    {t('edit')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    {t('download')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onDelete} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t('delete')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Tags */}
          {report.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {report.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {report.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{report.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Meta Information */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(report.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{report.views}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {report.isShared && (
                <Badge variant="outline" className="text-xs">
                  {t('shared')}
                </Badge>
              )}
              <span className="text-xs">{report.size}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={onView} size="sm" className="flex-1">
              <Eye className="h-3 w-3 mr-1" />
              {t('view')}
            </Button>
            <Button onClick={onDownload} variant="outline" size="sm">
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const SavedReports: React.FC<SavedReportsProps> = ({
  reports,
  onView,
  onEdit,
  onDelete,
  onDownload,
  onToggleFavorite,
  variant = 'default',
  className = ''
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'favorites' | 'shared' | 'recent'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'views'>('date');

  const isCompact = variant === 'compact';

  // Filter and sort reports
  const filteredReports = reports
    .filter(report => {
      if (searchQuery && !report.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      switch (filterType) {
        case 'favorites':
          return report.isFavorite;
        case 'shared':
          return report.isShared;
        case 'recent':
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return new Date(report.updatedAt) >= weekAgo;
        default:
          return true;
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'views':
          return b.views - a.views;
        case 'date':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

  const favoriteReports = reports.filter(r => r.isFavorite);
  const recentReports = reports.filter(r => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(r.updatedAt) >= weekAgo;
  });

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`font-bold ${isCompact ? 'text-lg' : 'text-2xl'} text-gray-900`}>
            {t('savedReports')}
          </h2>
          <p className={`text-gray-600 ${isCompact ? 'text-sm' : ''}`}>
            {t('savedReportsDescription')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t('searchReports')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-48"
            />
          </div>

          {/* Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {t(`filter.${filterType}`)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterType('all')}>
                {t('all')} ({reports.length})
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('favorites')}>
                {t('favorites')} ({favoriteReports.length})
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('shared')}>
                {t('shared')} ({reports.filter(r => r.isShared).length})
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('recent')}>
                {t('recent')} ({recentReports.length})
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Quick Stats */}
      {!isCompact && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <BookmarkIcon className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{reports.length}</p>
                  <p className="text-sm text-gray-600">{t('totalReports')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Star className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold">{favoriteReports.length}</p>
                  <p className="text-sm text-gray-600">{t('favorites')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{recentReports.length}</p>
                  <p className="text-sm text-gray-600">{t('thisWeek')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Eye className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {reports.reduce((sum, r) => sum + r.views, 0)}
                  </p>
                  <p className="text-sm text-gray-600">{t('totalViews')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reports Grid */}
      <div className={`grid gap-4 ${
        isCompact
          ? 'grid-cols-1 md:grid-cols-2'
          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      }`}>
        {filteredReports.map((report) => (
          <ReportCard
            key={report.id}
            report={report}
            variant={variant}
            onView={() => onView?.(report.id)}
            onEdit={() => onEdit?.(report.id)}
            onDelete={() => onDelete?.(report.id)}
            onDownload={() => onDownload?.(report.id)}
            onToggleFavorite={() => onToggleFavorite?.(report.id)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredReports.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <BookmarkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || filterType !== 'all'
                ? t('noReportsFound')
                : t('noSavedReports')
              }
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || filterType !== 'all'
                ? t('tryDifferentFilters')
                : t('createFirstReport')
              }
            </p>
            {(!searchQuery && filterType === 'all') && (
              <Button>
                {t('createReport')}
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SavedReports;