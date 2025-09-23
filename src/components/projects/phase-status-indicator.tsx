import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslation } from "@/hooks/use-language";
import {
  CheckCircle,
  Circle,
  Clock,
  PlayCircle,
  PauseCircle,
  AlertCircle,
  XCircle,
  Calendar,
  Users,
  Target,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
import { cn } from "@/lib/utils";

export type PhaseStatus =
  | "not_started"
  | "active"
  | "paused"
  | "completed"
  | "blocked"
  | "cancelled"
  | "overdue"
  | "at_risk";

interface PhaseStatusIndicatorProps {
  status: PhaseStatus;
  progress?: number;
  dueDate?: string;
  taskCount?: number;
  completedTasks?: number;
  assigneeCount?: number;
  size?: "sm" | "md" | "lg";
  variant?: "badge" | "icon" | "full";
  showTooltip?: boolean;
  className?: string;
}

const statusConfig = {
  not_started: {
    icon: Circle,
    color: "text-gray-500",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-300",
    badge: "bg-gray-100 text-gray-700 border-gray-200",
    label: "not_started",
    description: "phase_not_started_desc"
  },
  active: {
    icon: PlayCircle,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-300",
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    label: "active",
    description: "phase_active_desc"
  },
  paused: {
    icon: PauseCircle,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-300",
    badge: "bg-yellow-100 text-yellow-700 border-yellow-200",
    label: "paused",
    description: "phase_paused_desc"
  },
  completed: {
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100",
    borderColor: "border-green-300",
    badge: "bg-green-100 text-green-700 border-green-200",
    label: "completed",
    description: "phase_completed_desc"
  },
  blocked: {
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-100",
    borderColor: "border-red-300",
    badge: "bg-red-100 text-red-700 border-red-200",
    label: "blocked",
    description: "phase_blocked_desc"
  },
  cancelled: {
    icon: Minus,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-300",
    badge: "bg-gray-100 text-gray-700 border-gray-200",
    label: "cancelled",
    description: "phase_cancelled_desc"
  },
  overdue: {
    icon: AlertCircle,
    color: "text-red-600",
    bgColor: "bg-red-100",
    borderColor: "border-red-300",
    badge: "bg-red-100 text-red-700 border-red-200",
    label: "overdue",
    description: "phase_overdue_desc"
  },
  at_risk: {
    icon: AlertCircle,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    borderColor: "border-orange-300",
    badge: "bg-orange-100 text-orange-700 border-orange-200",
    label: "at_risk",
    description: "phase_at_risk_desc"
  }
};

const sizeConfig = {
  sm: {
    icon: "w-3 h-3",
    badge: "text-xs px-1.5 py-0.5",
    text: "text-xs",
    container: "gap-1"
  },
  md: {
    icon: "w-4 h-4",
    badge: "text-sm px-2 py-1",
    text: "text-sm",
    container: "gap-2"
  },
  lg: {
    icon: "w-5 h-5",
    badge: "text-base px-3 py-1.5",
    text: "text-base",
    container: "gap-2"
  }
};

// Helper function to determine phase status
export function getPhaseStatus(
  progress: number,
  dueDate?: string,
  isActive?: boolean,
  isBlocked?: boolean,
  isCancelled?: boolean
): PhaseStatus {
  if (isCancelled) return "cancelled";
  if (isBlocked) return "blocked";

  const now = new Date();
  const due = dueDate ? new Date(dueDate) : null;

  if (progress === 100) return "completed";
  if (progress === 0 && !isActive) return "not_started";
  if (due && due < now && progress < 100) return "overdue";

  // At risk if close to deadline with low progress
  if (due && progress > 0 && progress < 100) {
    const timeLeft = due.getTime() - now.getTime();
    const daysLeft = timeLeft / (1000 * 60 * 60 * 24);

    if (daysLeft <= 3 && progress < 70) return "at_risk";
    if (daysLeft <= 1 && progress < 90) return "at_risk";
  }

  if (!isActive && progress > 0 && progress < 100) return "paused";
  if (isActive && progress < 100) return "active";

  return "not_started";
}

export function PhaseStatusIndicator({
  status,
  progress,
  dueDate,
  taskCount,
  completedTasks,
  assigneeCount,
  size = "md",
  variant = "badge",
  showTooltip = true,
  className
}: PhaseStatusIndicatorProps) {
  const t = useTranslation();

  const config = statusConfig[status];
  const sizeStyles = sizeConfig[size];
  const Icon = config.icon;

  const isOverdue = dueDate && new Date(dueDate) < new Date();
  const daysUntilDue = dueDate
    ? Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const tooltipContent = (
    <div className="space-y-2 max-w-xs">
      <div className="font-medium">{t(config.label)}</div>
      <div className="text-xs text-muted-foreground">{t(config.description)}</div>

      {progress !== undefined && (
        <div className="flex items-center gap-2 text-xs">
          <span>{t("progress")}:</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
      )}

      {taskCount !== undefined && completedTasks !== undefined && (
        <div className="flex items-center gap-2 text-xs">
          <Target className="w-3 h-3" />
          <span>{completedTasks}/{taskCount} {t("tasks")}</span>
        </div>
      )}

      {assigneeCount !== undefined && assigneeCount > 0 && (
        <div className="flex items-center gap-2 text-xs">
          <Users className="w-3 h-3" />
          <span>{assigneeCount} {t("assignees")}</span>
        </div>
      )}

      {dueDate && (
        <div className="flex items-center gap-2 text-xs">
          <Calendar className="w-3 h-3" />
          <span className={isOverdue ? "text-red-600" : ""}>
            {isOverdue
              ? `${Math.abs(daysUntilDue || 0)} ${t("days_overdue")}`
              : `${daysUntilDue} ${t("days_left")}`
            }
          </span>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    if (variant === "icon") {
      return (
        <div className={cn("flex items-center justify-center", className)}>
          <Icon className={cn(sizeStyles.icon, config.color)} />
        </div>
      );
    }

    if (variant === "badge") {
      return (
        <Badge
          variant="outline"
          className={cn(
            config.badge,
            sizeStyles.badge,
            "border gap-1 flex items-center w-fit",
            className
          )}
        >
          <Icon className={sizeStyles.icon} />
          {t(config.label)}
        </Badge>
      );
    }

    // Full variant
    return (
      <div className={cn("flex items-center", sizeStyles.container, className)}>
        <div
          className={cn(
            "flex items-center justify-center rounded-full border-2",
            config.borderColor,
            config.bgColor,
            "w-8 h-8"
          )}
        >
          <Icon className={cn("w-4 h-4", config.color)} />
        </div>

        <div className="flex-1 min-w-0">
          <div className={cn("font-medium", sizeStyles.text)}>
            {t(config.label)}
          </div>

          {progress !== undefined && (
            <div className={cn("text-muted-foreground flex items-center gap-1", sizeStyles.text)}>
              <span>{Math.round(progress)}%</span>
              {progress > 70 ? (
                <TrendingUp className="w-3 h-3 text-green-600" />
              ) : progress > 30 ? (
                <Minus className="w-3 h-3 text-yellow-600" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-600" />
              )}
            </div>
          )}
        </div>

        {/* Additional info */}
        <div className="flex flex-col items-end gap-1">
          {taskCount !== undefined && completedTasks !== undefined && (
            <div className={cn("text-muted-foreground", sizeStyles.text)}>
              {completedTasks}/{taskCount}
            </div>
          )}

          {isOverdue && (
            <Badge variant="destructive" className="text-xs">
              {Math.abs(daysUntilDue || 0)}d {t("overdue")}
            </Badge>
          )}
        </div>
      </div>
    );
  };

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>{renderContent()}</div>
          </TooltipTrigger>
          <TooltipContent>
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return renderContent();
}

// Group component for multiple phase statuses
interface PhaseStatusGroupProps {
  phases: Array<{
    id: number;
    status: PhaseStatus;
    title: string;
    progress?: number;
  }>;
  size?: "sm" | "md" | "lg";
  variant?: "badge" | "icon" | "full";
  maxShow?: number;
  className?: string;
}

export function PhaseStatusGroup({
  phases,
  size = "sm",
  variant = "icon",
  maxShow = 5,
  className
}: PhaseStatusGroupProps) {
  const t = useTranslation();
  const visiblePhases = phases.slice(0, maxShow);
  const hiddenCount = phases.length - maxShow;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {visiblePhases.map((phase) => (
        <TooltipProvider key={phase.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <PhaseStatusIndicator
                  status={phase.status}
                  progress={phase.progress}
                  size={size}
                  variant={variant}
                  showTooltip={false}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-xs">
                <div className="font-medium">{phase.title}</div>
                <div className="text-muted-foreground">{t(statusConfig[phase.status].label)}</div>
                {phase.progress !== undefined && (
                  <div>{t("progress")}: {Math.round(phase.progress)}%</div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}

      {hiddenCount > 0 && (
        <Badge variant="outline" className="text-xs">
          +{hiddenCount}
        </Badge>
      )}
    </div>
  );
}