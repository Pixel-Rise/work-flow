import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Search, Filter, Download, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';

export interface LeaveHistoryItem {
  id: string;
  type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'emergency';
  startDate: string;
  endDate: string;
  days: number;
  status: 'approved' | 'rejected' | 'pending' | 'cancelled';
  reason: string;
  submittedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedReason?: string;
}

export interface LeaveHistoryProps {
  history: LeaveHistoryItem[];
  onViewDetails: (id: string) => void;
  onExport?: () => void;
  variant?: 'default' | 'compact';
  className?: string;
}

export const LeaveHistory: React.FC<LeaveHistoryProps> = ({
  history,
  onViewDetails,
  onExport,
  variant = 'default',
  className = ''
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const isCompact = variant === 'compact';

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t(`leaveType.${item.type}`).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesType = filterType === 'all' || item.type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      vacation: 'bg-blue-100 text-blue-800',
      sick: 'bg-red-100 text-red-800',
      personal: 'bg-green-100 text-green-800',
      maternity: 'bg-purple-100 text-purple-800',
      emergency: 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {t('leaveHistory')}
            </CardTitle>
            {onExport && (
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                {t('export')}
              </Button>
            )}
          </div>
        </CardHeader>

        {/* Filters */}
        <CardContent className="border-t pt-6">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t('searchHistory')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder={t('filterByStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allStatuses')}</SelectItem>
                <SelectItem value="approved">{t('approved')}</SelectItem>
                <SelectItem value="rejected">{t('rejected')}</SelectItem>
                <SelectItem value="pending">{t('pending')}</SelectItem>
                <SelectItem value="cancelled">{t('cancelled')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder={t('filterByType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allTypes')}</SelectItem>
                <SelectItem value="vacation">{t('leaveType.vacation')}</SelectItem>
                <SelectItem value="sick">{t('leaveType.sick')}</SelectItem>
                <SelectItem value="personal">{t('leaveType.personal')}</SelectItem>
                <SelectItem value="maternity">{t('leaveType.maternity')}</SelectItem>
                <SelectItem value="emergency">{t('leaveType.emergency')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* History List */}
          <div className="space-y-3">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{t('noHistoryFound')}</p>
              </div>
            ) : (
              filteredHistory.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className={`p-${isCompact ? '4' : '6'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        {/* Header Row */}
                        <div className="flex items-center gap-3">
                          <Badge className={`text-xs ${getTypeColor(item.type)}`}>
                            {t(`leaveType.${item.type}`)}
                          </Badge>
                          <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(item.status)}
                              {t(item.status)}
                            </div>
                          </Badge>
                        </div>

                        {/* Date Range */}
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">{t('period')}: </span>
                            {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">{t('duration')}: </span>
                            {item.days} {item.days === 1 ? t('day') : t('days')}
                          </div>
                        </div>

                        {/* Reason */}
                        <div>
                          <span className="text-sm font-medium text-gray-600">{t('reason')}: </span>
                          <span className="text-sm">{item.reason}</span>
                        </div>

                        {/* Additional Info */}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div>
                            {t('submitted')}: {new Date(item.submittedAt).toLocaleDateString()}
                          </div>
                          {item.approvedAt && item.approvedBy && (
                            <div>
                              {t('approvedBy')} {item.approvedBy} {t('on')} {new Date(item.approvedAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>

                        {/* Rejection Reason */}
                        {item.status === 'rejected' && item.rejectedReason && (
                          <div className="p-2 bg-red-50 border border-red-200 rounded text-sm">
                            <span className="font-medium text-red-800">{t('rejectionReason')}: </span>
                            <span className="text-red-700">{item.rejectedReason}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewDetails(item.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          {t('details')}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveHistory;