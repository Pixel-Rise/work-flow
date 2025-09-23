import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-language";
import {
  TrendingUp,
  TrendingDown,
  Target,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectProgressProps {
  progress: number; // 0-100
  totalTasks?: number;
  completedTasks?: number;
  overdueTasks?: number;
  startDate?: string;
  endDate?: string;
  teamMembers?: number;
  showDetails?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "compact" | "detailed";
  className?: string;
}

export function ProjectProgress({
  progress,
  totalTasks = 0,
  completedTasks = 0,
  overdueTasks = 0,
  startDate,
  endDate,
  teamMembers = 0,
  showDetails = true,
  size = "md",
  variant = "default",
  className
}: ProjectProgressProps) {
  const t = useTranslation();

  // Calculate metrics
  const inProgressTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Date calculations
  const now = new Date();
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  const isOverdue = end ? end < now && progress < 100 : false;
  const daysRemaining = end ? Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;
  const totalDays = start && end ? Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) : null;

  // Progress color based on status
  const getProgressColor = () => {
    if (isOverdue) return "bg-red-500";
    if (progress >= 90) return "bg-green-500";
    if (progress >= 70) return "bg-blue-500";
    if (progress >= 40) return "bg-yellow-500";
    return "bg-orange-500";
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      progress: "h-1.5",
      text: "text-xs",
      badge: "text-xs px-1.5 py-0.5",
      spacing: "space-y-1"
    },
    md: {
      progress: "h-2",
      text: "text-sm",
      badge: "text-xs px-2 py-1",
      spacing: "space-y-2"
    },
    lg: {
      progress: "h-3",
      text: "text-base",
      badge: "text-sm px-2.5 py-1",
      spacing: "space-y-3"
    }
  };

  const config = sizeConfig[size];

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <div className="flex-1">
          <Progress
            value={progress}
            className={cn("w-full", config.progress)}
          />
        </div>
        <div className={cn("font-medium", config.text)}>
          {Math.round(progress)}%
        </div>
        {isOverdue && (
          <Badge variant="destructive" className={config.badge}>
            <AlertTriangle className="w-3 h-3 mr-1" />
            {t("overdue")}
          </Badge>
        )}
      </div>
    );
  }

  if (variant === "detailed") {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className={config.spacing}>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                <span className={cn("font-medium", config.text)}>
                  {t("project_progress")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn("font-bold", config.text)}>
                  {Math.round(progress)}%
                </span>
                {progress > 50 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-orange-600" />
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <Progress
                value={progress}
                className={cn("w-full", config.progress)}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{t("started")}</span>
                <span>{t("target")}</span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span className={cn("text-muted-foreground", config.text)}>
                    {t("completed")}
                  </span>
                </div>
                <div className={cn("font-medium", config.text)}>
                  {completedTasks}/{totalTasks} {t("tasks")}
                </div>
              </div>

              {overdueTasks > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-red-600" />
                    <span className={cn("text-muted-foreground", config.text)}>
                      {t("overdue")}
                    </span>
                  </div>
                  <div className={cn("font-medium text-red-600", config.text)}>
                    {overdueTasks} {t("tasks")}
                  </div>
                </div>
              )}

              {teamMembers > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-blue-600" />
                    <span className={cn("text-muted-foreground", config.text)}>
                      {t("team")}
                    </span>
                  </div>
                  <div className={cn("font-medium", config.text)}>
                    {teamMembers} {t("members")}
                  </div>
                </div>
              )}

              {daysRemaining !== null && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-orange-600" />
                    <span className={cn("text-muted-foreground", config.text)}>
                      {t("remaining")}
                    </span>
                  </div>
                  <div className={cn("font-medium", config.text, isOverdue && "text-red-600")}>
                    {isOverdue ? `${Math.abs(daysRemaining)} ${t("days_overdue")}` : `${daysRemaining} ${t("days")}`}
                  </div>
                </div>
              )}
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-1">
              {progress === 100 && (
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {t("completed")}
                </Badge>
              )}
              {isOverdue && (
                <Badge variant="destructive">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {t("overdue")}
                </Badge>
              )}
              {!isOverdue && progress > 0 && progress < 100 && (
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  <Clock className="w-3 h-3 mr-1" />
                  {t("in_progress")}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <div className={cn(config.spacing, className)}>
      {/* Progress header */}
      <div className="flex items-center justify-between">
        <span className={cn("text-muted-foreground", config.text)}>
          {t("progress")}
        </span>
        <span className={cn("font-medium", config.text)}>
          {Math.round(progress)}%
        </span>
      </div>

      {/* Progress bar */}
      <Progress
        value={progress}
        className={cn("w-full", config.progress)}
      />

      {/* Details */}
      {showDetails && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {totalTasks > 0 && (
              <span className={cn("text-muted-foreground", config.text)}>
                {completedTasks}/{totalTasks} {t("tasks")}
              </span>
            )}
            {teamMembers > 0 && (
              <span className={cn("text-muted-foreground", config.text)}>
                {teamMembers} {t("members")}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isOverdue && (
              <Badge variant="destructive" className={config.badge}>
                {t("overdue")}
              </Badge>
            )}
            {overdueTasks > 0 && !isOverdue && (
              <Badge variant="secondary" className={config.badge}>
                {overdueTasks} {t("overdue")}
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}