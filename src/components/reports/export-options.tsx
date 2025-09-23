import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Download, FileImage, FileText, File, Mail, Link, Settings } from 'lucide-react';

interface ExportConfig {
  format: 'png' | 'pdf' | 'csv' | 'xlsx' | 'json';
  quality?: 'low' | 'medium' | 'high';
  size?: 'small' | 'medium' | 'large';
  includeData?: boolean;
  includeCharts?: boolean;
  customName?: string;
  email?: string;
  shareUrl?: boolean;
}

interface ExportOptionsProps {
  onExport?: (config: ExportConfig) => void;
  onShare?: (config: ExportConfig) => void;
  isLoading?: boolean;
  variant?: 'default' | 'compact';
  className?: string;
}

const exportFormats = [
  { key: 'png', label: 'PNG Image', icon: FileImage, description: 'High quality image' },
  { key: 'pdf', label: 'PDF Document', icon: FileText, description: 'Printable document' },
  { key: 'csv', label: 'CSV Data', icon: File, description: 'Raw data export' },
  { key: 'xlsx', label: 'Excel File', icon: File, description: 'Spreadsheet format' },
  { key: 'json', label: 'JSON Data', icon: File, description: 'Structured data' }
];

export const ExportOptions: React.FC<ExportOptionsProps> = ({
  onExport,
  onShare,
  isLoading = false,
  variant = 'default',
  className = ''
}) => {
  const { t } = useTranslation();
  const [config, setConfig] = useState<ExportConfig>({
    format: 'png',
    quality: 'high',
    size: 'medium',
    includeData: true,
    includeCharts: true,
    customName: '',
    email: '',
    shareUrl: false
  });

  const isCompact = variant === 'compact';

  const handleExport = () => {
    if (onExport) {
      onExport(config);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(config);
    }
  };

  const selectedFormat = exportFormats.find(f => f.key === config.format);

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            {t('exportOptions')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Format Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">{t('exportFormat')}</label>
            <Select
              value={config.format}
              onValueChange={(format: any) => setConfig({ ...config, format })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {exportFormats.map((format) => (
                  <SelectItem key={format.key} value={format.key}>
                    <div className="flex items-center gap-2">
                      <format.icon className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{format.label}</div>
                        <div className="text-xs text-gray-500">{format.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quality Settings */}
          {(config.format === 'png' || config.format === 'pdf') && (
            <div>
              <label className="text-sm font-medium mb-2 block">{t('quality')}</label>
              <Select
                value={config.quality}
                onValueChange={(quality: any) => setConfig({ ...config, quality })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{t('low')} - {t('smallFile')}</SelectItem>
                  <SelectItem value="medium">{t('medium')} - {t('balanced')}</SelectItem>
                  <SelectItem value="high">{t('high')} - {t('bestQuality')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Size Options */}
          {config.format === 'png' && (
            <div>
              <label className="text-sm font-medium mb-2 block">{t('imageSize')}</label>
              <Select
                value={config.size}
                onValueChange={(size: any) => setConfig({ ...config, size })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">800x600 - {t('small')}</SelectItem>
                  <SelectItem value="medium">1200x900 - {t('medium')}</SelectItem>
                  <SelectItem value="large">1920x1440 - {t('large')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Include Options */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('includeInExport')}</label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeData"
                  checked={config.includeData}
                  onCheckedChange={(checked: any) =>
                    setConfig({ ...config, includeData: checked })
                  }
                />
                <label htmlFor="includeData" className="text-sm">
                  {t('includeRawData')}
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeCharts"
                  checked={config.includeCharts}
                  onCheckedChange={(checked: any) =>
                    setConfig({ ...config, includeCharts: checked })
                  }
                />
                <label htmlFor="includeCharts" className="text-sm">
                  {t('includeCharts')}
                </label>
              </div>
            </div>
          </div>

          {/* Custom Name */}
          <div>
            <label className="text-sm font-medium mb-2 block">{t('fileName')}</label>
            <Input
              value={config.customName}
              onChange={(e) => setConfig({ ...config, customName: e.target.value })}
              placeholder={t('reportFileName')}
            />
          </div>

          {!isCompact && (
            <>
              {/* Email Export */}
              <div>
                <label className="text-sm font-medium mb-2 block">{t('emailTo')}</label>
                <Input
                  type="email"
                  value={config.email}
                  onChange={(e) => setConfig({ ...config, email: e.target.value })}
                  placeholder={t('emailAddress')}
                />
              </div>

              {/* Share URL */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="shareUrl"
                  checked={config.shareUrl}
                  onCheckedChange={(checked: any) =>
                    setConfig({ ...config, shareUrl: checked })
                  }
                />
                <label htmlFor="shareUrl" className="text-sm">
                  {t('generateShareableLink')}
                </label>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleExport}
              disabled={isLoading}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              {isLoading ? t('exporting') : t('export')}
            </Button>

            {!isCompact && config.email && (
              <Button
                onClick={handleShare}
                variant="outline"
                disabled={isLoading}
              >
                <Mail className="h-4 w-4 mr-2" />
                {t('email')}
              </Button>
            )}

            {!isCompact && config.shareUrl && (
              <Button
                onClick={handleShare}
                variant="outline"
                disabled={isLoading}
              >
                <Link className="h-4 w-4 mr-2" />
                {t('share')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Export Buttons */}
      {isCompact && (
        <div className="flex gap-2">
          {exportFormats.slice(0, 3).map((format) => (
            <Button
              key={format.key}
              variant="outline"
              size="sm"
              onClick={() => {
                setConfig({ ...config, format: format.key as any });
                handleExport();
              }}
              className="flex-1"
            >
              <format.icon className="h-3 w-3 mr-1" />
              {format.label.split(' ')[0]}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExportOptions;