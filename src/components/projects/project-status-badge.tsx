import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/use-language";
import {
  Clock,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  AlertCircle,
  Archive,
  Calendar,
  Timer
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ProjectStatus =
  | "planning"
  | "active"
  | "on_hold"
  | "completed"
  | "cancelled"
  | "archived"
  | "overdue"
  | "at_risk";

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

const statusConfig = {
  planning: {
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Clock,
    label: "planning"
  },
  active: {
    color: "bg-green-100 text-green-800 border-green-200",
    icon: Play,
    label: "active"
  },
  on_hold: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Pause,
    label: "on_hold"
  },
  completed: {
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: CheckCircle,
    label: "completed"
  },
  cancelled: {
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
    label: "cancelled"
  },
  archived: {
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: Archive,
    label: "archived"
  },
  overdue: {
    color: "bg-red-100 text-red-800 border-red-200",
    icon: Calendar,
    label: "overdue"
  },
  at_risk: {
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: AlertCircle,
    label: "at_risk"
  }
};

const sizeConfig = {
  sm: {
    badge: "text-xs px-2 py-1",
    icon: "w-3 h-3"
  },
  md: {
    badge: "text-sm px-2.5 py-1",
    icon: "w-3.5 h-3.5"
  },
  lg: {
    badge: "text-base px-3 py-1.5",
    icon: "w-4 h-4"
  }
};

export function ProjectStatusBadge({
  status,
  size = "md",
  showIcon = true,
  className
}: ProjectStatusBadgeProps) {
  const t = useTranslation();

  const config = statusConfig[status];
  const sizeStyles = sizeConfig[size];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        config.color,
        sizeStyles.badge,
        "font-medium border gap-1 flex items-center w-fit",
        className
      )}
    >
      {showIcon && <Icon className={sizeStyles.icon} />}
      {t(config.label)}
    </Badge>
  );
}

// Helper function to determine project status based on dates and progress
export function getProjectStatus(
  startDate?: string,
  endDate?: string,
  progress?: number,
  isActive?: boolean
): ProjectStatus {
  const now = new Date();
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  // If project is marked as inactive
  if (isActive === false) {
    return "archived";
  }

  // If project is completed (100% progress)
  if (progress === 100) {
    return "completed";
  }

  // If project hasn't started yet
  if (start && start > now) {
    return "planning";
  }

  // If project is overdue
  if (end && end < now && progress !== 100) {
    return "overdue";
  }

  // If project is at risk (close to deadline with low progress)
  if (end && progress !== undefined) {
    const timeLeft = end.getTime() - now.getTime();
    const totalTime = start ? end.getTime() - start.getTime() : 0;
    const timeProgress = totalTime > 0 ? 1 - (timeLeft / totalTime) : 0;

    // If time progress is > 70% but actual progress < 50%
    if (timeProgress > 0.7 && progress < 50) {
      return "at_risk";
    }
  }

  // Default to active if project is in progress
  return "active";
}

// Batch component for multiple status badges
interface ProjectStatusGroupProps {
  statuses: ProjectStatus[];
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

export function ProjectStatusGroup({
  statuses,
  size = "sm",
  showIcon = false,
  className
}: ProjectStatusGroupProps) {
  if (statuses.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {statuses.map((status, index) => (
        <ProjectStatusBadge
          key={`${status}-${index}`}
          status={status}
          size={size}
          showIcon={showIcon}
        />
      ))}
    </div>
  );
}