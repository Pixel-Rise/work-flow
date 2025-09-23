import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/use-language";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Target,
  Calendar,
  Timer
} from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

function StatsCard({ title, value, subtitle, icon: Icon, trend, color = "text-primary" }: StatsCardProps) {
  const t = useTranslation();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            <Badge
              variant={trend.isPositive ? "default" : "destructive"}
              className="text-xs"
            >
              <TrendingUp className={`w-3 h-3 mr-1 ${!trend.isPositive ? 'rotate-180' : ''}`} />
              {Math.abs(trend.value)}%
            </Badge>
            <span className="text-xs text-muted-foreground ml-2">
              {t("from_last_week")}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardStats() {
  const t = useTranslation();

  const stats = [
    {
      title: t("total_work_time"),
      value: "38.5h",
      subtitle: t("this_week"),
      icon: Clock,
      trend: { value: 12, isPositive: true },
      color: "text-primary"
    },
    {
      title: t("completed_tasks"),
      value: 23,
      subtitle: "8 " + t("this_week"),
      icon: CheckCircle,
      trend: { value: 8, isPositive: true },
      color: "text-chart-1"
    },
    {
      title: t("active_projects"),
      value: 5,
      subtitle: "2 " + t("due_this_week"),
      icon: Target,
      trend: { value: 25, isPositive: true },
      color: "text-chart-3"
    },
    {
      title: t("team_members"),
      value: 12,
      subtitle: "3 " + t("online_now"),
      icon: Users,
      color: "text-chart-4"
    },
    {
      title: t("productivity_score"),
      value: "87%",
      subtitle: t("above_average"),
      icon: TrendingUp,
      trend: { value: 5, isPositive: true },
      color: "text-chart-1"
    },
    {
      title: t("pending_tasks"),
      value: 14,
      subtitle: "3 " + t("overdue"),
      icon: AlertCircle,
      trend: { value: 15, isPositive: false },
      color: "text-destructive"
    },
    {
      title: t("avg_daily_hours"),
      value: "7.7h",
      subtitle: t("target") + ": 8h",
      icon: Timer,
      trend: { value: 3, isPositive: true },
      color: "text-chart-2"
    },
    {
      title: t("days_worked"),
      value: "5/5",
      subtitle: t("this_week"),
      icon: Calendar,
      color: "text-chart-5"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
}