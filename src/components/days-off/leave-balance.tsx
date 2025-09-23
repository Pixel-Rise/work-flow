import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Plus,
  RefreshCw,
  Eye
} from 'lucide-react';

export interface LeaveBalanceData {
  type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'emergency';
  allocated: number;
  used: number;
  pending: number;
  remaining: number;
  carriedOver: number;
  expires?: string;
  accrualRate?: number;
  nextAccrual?: string;
  color: string;
}

export interface LeaveBalanceProps {
  balances: LeaveBalanceData[];
  variant?: 'default' | 'compact' | 'detailed';
  showHistory?: boolean;
  showProjections?: boolean;
  onRequestLeave?: (type: string) => void;
  onViewHistory?: (type: string) => void;
  className?: string;
}

const BalanceCard: React.FC<{
  balance: LeaveBalanceData;
  variant: 'default' | 'compact' | 'detailed';
  onRequest?: () => void;
  onViewHistory?: () => void;
}> = ({ balance, variant, onRequest, onViewHistory }) => {
  const { t } = useTranslation();
  const isCompact = variant === 'compact';
  const isDetailed = variant === 'detailed';

  const utilizationRate = (balance.used / balance.allocated) * 100;
  const totalUsed = balance.used + balance.pending;
  const effectiveRate = (totalUsed / balance.allocated) * 100;

  const getStatusColor = () => {
    if (balance.remaining <= 2) return 'text-red-600 bg-red-100';
    if (balance.remaining <= 5) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getProgressColor = () => {
    if (effectiveRate >= 90) return 'bg-red-500';
    if (effectiveRate >= 70) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className={`p-${isCompact ? '4' : '6'}`}>
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: balance.color }}
              />
              <div>
                <h3 className={`font-medium ${isCompact ? 'text-sm' : ''}`}>
                  {t(`leaveType.${balance.type}`)}
                </h3>
                {isDetailed && balance.nextAccrual && (
                  <p className="text-xs text-gray-500">
                    {t('nextAccrual')}: {new Date(balance.nextAccrual).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            <Badge variant="outline" className={`text-xs ${getStatusColor()}`}>
              {balance.remaining} {t('left')}
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{t('used')}</span>
              <span className="font-medium">
                {balance.used}/{balance.allocated}
              </span>
            </div>

            <div className="relative">
              <Progress
                value={utilizationRate}
                className="h-2"
              />
              {balance.pending > 0 && (
                <Progress
                  value={effectiveRate}
                  className="h-1 mt-1 opacity-50"
                />
              )}
            </div>

            {balance.pending > 0 && (
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{t('includingPending')}</span>
                <span>{balance.pending} {t('pending')}</span>
              </div>
            )}
          </div>

          {/* Statistics Grid */}
          <div className={`grid ${isDetailed ? 'grid-cols-3' : 'grid-cols-2'} gap-3 text-center`}>
            <div>
              <p className={`font-medium ${isCompact ? 'text-sm' : ''}`}>
                {balance.allocated}
              </p>
              <p className={`text-gray-500 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                {t('allocated')}
              </p>
            </div>

            <div>
              <p className={`font-medium ${isCompact ? 'text-sm' : ''}`}>
                {balance.used}
              </p>
              <p className={`text-gray-500 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                {t('used')}
              </p>
            </div>

            {isDetailed && (
              <div>
                <p className={`font-medium ${isCompact ? 'text-sm' : ''}`}>
                  {balance.carriedOver}
                </p>
                <p className={`text-gray-500 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                  {t('carriedOver')}
                </p>
              </div>
            )}
          </div>

          {/* Warnings */}
          {balance.expires && new Date(balance.expires) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) && (
            <div className="flex items-center gap-2 p-2 rounded bg-yellow-50 text-yellow-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs">
                {t('expiresOn')}: {new Date(balance.expires).toLocaleDateString()}
              </span>
            </div>
          )}

          {balance.remaining <= 2 && (
            <div className="flex items-center gap-2 p-2 rounded bg-red-50 text-red-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs">{t('lowBalance')}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={onRequest}
              size="sm"
              className="flex-1"
              disabled={balance.remaining <= 0}
            >
              <Plus className="h-3 w-3 mr-1" />
              {t('request')}
            </Button>

            {onViewHistory && (
              <Button
                onClick={onViewHistory}
                variant="outline"
                size="sm"
              >
                <Eye className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Additional Info */}
          {isDetailed && balance.accrualRate && (
            <div className="pt-2 border-t text-xs text-gray-500">
              <div className="flex items-center justify-between">
                <span>{t('accrualRate')}</span>
                <span>{balance.accrualRate} {t('daysPerMonth')}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const SummaryStats: React.FC<{
  balances: LeaveBalanceData[];
  variant: 'default' | 'compact' | 'detailed';
}> = ({ balances, variant }) => {
  const { t } = useTranslation();
  const isCompact = variant === 'compact';

  const totalAllocated = balances.reduce((sum, b) => sum + b.allocated, 0);
  const totalUsed = balances.reduce((sum, b) => sum + b.used, 0);
  const totalPending = balances.reduce((sum, b) => sum + b.pending, 0);
  const totalRemaining = balances.reduce((sum, b) => sum + b.remaining, 0);

  const overallUtilization = (totalUsed / totalAllocated) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {t('leaveSummary')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`grid gap-4 ${isCompact ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-4'}`}>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className={`font-bold ${isCompact ? 'text-lg' : 'text-2xl'} text-green-600`}>
                {totalUsed}
              </span>
            </div>
            <p className={`text-gray-600 ${isCompact ? 'text-xs' : 'text-sm'}`}>
              {t('daysUsed')}
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <span className={`font-bold ${isCompact ? 'text-lg' : 'text-2xl'} text-yellow-600`}>
                {totalPending}
              </span>
            </div>
            <p className={`text-gray-600 ${isCompact ? 'text-xs' : 'text-sm'}`}>
              {t('daysPending')}
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span className={`font-bold ${isCompact ? 'text-lg' : 'text-2xl'} text-blue-600`}>
                {totalRemaining}
              </span>
            </div>
            <p className={`text-gray-600 ${isCompact ? 'text-xs' : 'text-sm'}`}>
              {t('daysRemaining')}
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span className={`font-bold ${isCompact ? 'text-lg' : 'text-2xl'} text-purple-600`}>
                {overallUtilization.toFixed(0)}%
              </span>
            </div>
            <p className={`text-gray-600 ${isCompact ? 'text-xs' : 'text-sm'}`}>
              {t('utilization')}
            </p>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{t('overallProgress')}</span>
            <span className="text-gray-600">
              {totalUsed + totalPending}/{totalAllocated} {t('days')}
            </span>
          </div>
          <Progress
            value={(totalUsed + totalPending) / totalAllocated * 100}
            className="h-3"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export const LeaveBalance: React.FC<LeaveBalanceProps> = ({
  balances,
  variant = 'default',
  showHistory = true,
  showProjections = false,
  onRequestLeave,
  onViewHistory,
  className = ''
}) => {
  const { t } = useTranslation();
  const isCompact = variant === 'compact';

  // Calculate upcoming expirations
  const upcomingExpirations = balances.filter(b => {
    if (!b.expires) return false;
    const expiryDate = new Date(b.expires);
    const threeMonthsFromNow = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    return expiryDate <= threeMonthsFromNow && b.remaining > 0;
  });

  // Calculate projections (if enabled)
  const projectedBalances = balances.map(balance => {
    if (!balance.accrualRate || !showProjections) return balance;

    const monthsRemaining = 12 - new Date().getMonth();
    const projectedAccrual = balance.accrualRate * monthsRemaining;
    const projectedTotal = balance.remaining + projectedAccrual;

    return {
      ...balance,
      projected: projectedTotal
    };
  });

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`font-bold ${isCompact ? 'text-lg' : 'text-2xl'} text-gray-900`}>
            {t('leaveBalance')}
          </h2>
          <p className={`text-gray-600 ${isCompact ? 'text-sm' : ''}`}>
            {t('leaveBalanceDescription')}
          </p>
        </div>

        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          {t('refresh')}
        </Button>
      </div>

      {/* Warnings */}
      {upcomingExpirations.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <h3 className="font-medium text-yellow-900">{t('upcomingExpirations')}</h3>
          </div>
          <div className="space-y-1">
            {upcomingExpirations.map((balance) => (
              <p key={balance.type} className="text-sm text-yellow-800">
                {t(`leaveType.${balance.type}`)}: {balance.remaining} {t('days')} {t('expireOn')} {new Date(balance.expires!).toLocaleDateString()}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <SummaryStats balances={balances} variant={variant} />

      {/* Balance Cards */}
      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="current">{t('currentBalance')}</TabsTrigger>
          {showProjections && (
            <TabsTrigger value="projected">{t('yearEndProjection')}</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="current" className="space-y-4 mt-6">
          <div className={`grid gap-4 ${
            isCompact
              ? 'grid-cols-1 md:grid-cols-2'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {balances.map((balance) => (
              <BalanceCard
                key={balance.type}
                balance={balance}
                variant={variant}
                onRequest={() => onRequestLeave?.(balance.type)}
                onViewHistory={showHistory ? () => onViewHistory?.(balance.type) : undefined}
              />
            ))}
          </div>
        </TabsContent>

        {showProjections && (
          <TabsContent value="projected" className="space-y-4 mt-6">
            <div className={`grid gap-4 ${
              isCompact
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {projectedBalances.map((balance: any) => (
                <Card key={balance.type}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: balance.color }}
                        />
                        <h3 className="font-medium">
                          {t(`leaveType.${balance.type}`)}
                        </h3>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{t('currentBalance')}</span>
                          <span className="font-medium">{balance.remaining}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{t('projectedAccrual')}</span>
                          <span className="font-medium text-green-600">
                            +{balance.projected - balance.remaining}
                          </span>
                        </div>
                        <div className="flex items-center justify-between border-t pt-2">
                          <span className="text-sm font-medium">{t('yearEndBalance')}</span>
                          <span className="font-bold text-blue-600">{balance.projected}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default LeaveBalance;