import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartTypeSelector } from './chart-type-selector';
import { DataSourceSelector } from './data-source-selector';
import { Plus, Save, Eye, Settings } from 'lucide-react';

interface ReportConfig {
  name: string;
  chartType: string;
  dataSource: string;
  filters: Record<string, any>;
  timeRange: string;
}

interface ReportBuilderProps {
  onSave?: (config: ReportConfig) => void;
  onPreview?: (config: ReportConfig) => void;
  className?: string;
}

export const ReportBuilder: React.FC<ReportBuilderProps> = ({
  onSave,
  onPreview,
  className = ''
}) => {
  const { t } = useTranslation();
  const [config, setConfig] = useState<ReportConfig>({
    name: '',
    chartType: 'bar',
    dataSource: 'tasks',
    filters: {},
    timeRange: 'month'
  });

  const handleSave = () => {
    if (onSave && config.name) {
      onSave(config);
    }
  };

  const handlePreview = () => {
    if (onPreview) {
      onPreview(config);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t('reportBuilder')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">{t('reportName')}</label>
            <Input
              value={config.name}
              onChange={(e) => setConfig({ ...config, name: e.target.value })}
              placeholder={t('enterReportName')}
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t('chartType')}</label>
            <ChartTypeSelector
              value={config.chartType}
              onChange={(chartType) => setConfig({ ...config, chartType })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t('dataSource')}</label>
            <DataSourceSelector
              value={config.dataSource}
              onChange={(dataSource) => setConfig({ ...config, dataSource })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t('timeRange')}</label>
            <Select
              value={config.timeRange}
              onValueChange={(timeRange) => setConfig({ ...config, timeRange })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">{t('thisWeek')}</SelectItem>
                <SelectItem value="month">{t('thisMonth')}</SelectItem>
                <SelectItem value="quarter">{t('thisQuarter')}</SelectItem>
                <SelectItem value="year">{t('thisYear')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handlePreview} variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              {t('preview')}
            </Button>
            <Button onClick={handleSave} disabled={!config.name}>
              <Save className="h-4 w-4 mr-2" />
              {t('saveReport')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportBuilder;