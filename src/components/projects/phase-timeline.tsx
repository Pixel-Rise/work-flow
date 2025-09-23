import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "@/hooks/use-language";
import {
  CheckCircle,
  Circle,
  Clock,
  PlayCircle,
  PauseCircle,
  AlertCircle,
  Calendar,
  Target,
  Users,
  ChevronRight,
  Plus,
  Edit
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface PhaseData {
  id: number;
  title: string;
  description?: string;
  status: "upcoming" | "active" | "paused" | "completed" | "overdue";
  progress: number; // 0-100
  startDate?: string;
  endDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  assignees?: string[];
  taskCount?: number;
  completedTasks?: number;
  dependencies?: number[]; // Phase IDs this phase depends on
}

interface PhaseTimelineProps {
  phases: PhaseData[];
  currentPhaseId?: number;
  showProgress?: boolean;
  showDetails?: boolean;
  onPhaseClick?: (phase: PhaseData) => void;
  onEditPhase?: (phase: PhaseData) => void;
  onAddPhase?: () => void;
  className?: string;
}

const statusConfig = {
  upcoming: {
    icon: Circle,
    color: "text-gray-400",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-200",
    badge: "bg-gray-100 text-gray-700"
  },
  active: {
    icon: PlayCircle,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-200",
    badge: "bg-blue-100 text-blue-700"
  },
  paused: {
    icon: PauseCircle,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-200",
    badge: "bg-yellow-100 text-yellow-700"
  },
  completed: {
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100",
    borderColor: "border-green-200",
    badge: "bg-green-100 text-green-700"
  },
  overdue: {
    icon: AlertCircle,
    color: "text-red-600",
    bgColor: "bg-red-100",
    borderColor: "border-red-200",
    badge: "bg-red-100 text-red-700"
  }
};

function PhaseItem({
  phase,
  isLast,
  isCurrent,
  showProgress,
  showDetails,
  onPhaseClick,
  onEditPhase
}: {
  phase: PhaseData;
  isLast: boolean;
  isCurrent: boolean;
  showProgress: boolean;
  showDetails: boolean;
  onPhaseClick?: (phase: PhaseData) => void;
  onEditPhase?: (phase: PhaseData) => void;
}) {
  const t = useTranslation();
  const config = statusConfig[phase.status];
  const Icon = config.icon;

  const isClickable = onPhaseClick !== undefined;
  const canEdit = onEditPhase !== undefined;

  return (
    <div className="relative flex gap-4">
      {/* Timeline Line */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all",
            config.borderColor,
            config.bgColor,
            isCurrent && "ring-2 ring-primary ring-offset-2"
          )}
        >
          <Icon className={cn("w-4 h-4", config.color)} />
        </div>
        {!isLast && (
          <div className={cn("w-px h-16 mt-2", config.color === "text-green-600" ? "bg-green-300" : "bg-gray-300")} />
        )}
      </div>

      {/* Phase Content */}
      <div className="flex-1 pb-8">
        <div
          className={cn(
            "space-y-3 p-4 rounded-lg border transition-all",
            config.borderColor,
            isClickable && "cursor-pointer hover:shadow-md",
            isCurrent && "ring-1 ring-primary"
          )}
          onClick={() => isClickable && onPhaseClick(phase)}
        >
          {/* Phase Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-base">{phase.title}</h4>
                <Badge className={config.badge} variant="secondary">
                  {t(phase.status)}
                </Badge>
                {isCurrent && (
                  <Badge variant="outline" className="text-xs">
                    {t("current")}
                  </Badge>
                )}
              </div>
              {phase.description && (
                <p className="text-sm text-muted-foreground">{phase.description}</p>
              )}
            </div>

            <div className="flex items-center gap-1">
              {canEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditPhase(phase);
                  }}
                >
                  <Edit className="w-3 h-3" />
                </Button>
              )}
              {isClickable && (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {showProgress && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("progress")}</span>
                <span className="font-medium">{Math.round(phase.progress)}%</span>
              </div>
              <Progress value={phase.progress} className="h-2" />
            </div>
          )}

          {/* Phase Details */}
          {showDetails && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              {/* Duration */}
              {phase.startDate && phase.endDate && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{t("duration")}</span>
                  </div>
                  <div className="font-medium">
                    {new Date(phase.startDate).toLocaleDateString()} -
                    <br />
                    {new Date(phase.endDate).toLocaleDateString()}
                  </div>
                </div>
              )}

              {/* Tasks */}
              {phase.taskCount !== undefined && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Target className="w-3 h-3" />
                    <span>{t("tasks")}</span>
                  </div>
                  <div className="font-medium">
                    {phase.completedTasks || 0}/{phase.taskCount}
                  </div>
                </div>
              )}

              {/* Hours */}
              {phase.estimatedHours !== undefined && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{t("hours")}</span>
                  </div>
                  <div className="font-medium">
                    {phase.actualHours || 0}/{phase.estimatedHours}h
                  </div>
                </div>
              )}

              {/* Assignees */}
              {phase.assignees && phase.assignees.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="w-3 h-3" />
                    <span>{t("assignees")}</span>
                  </div>
                  <div className="font-medium">
                    {phase.assignees.length} {t("members")}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Assignees List (if detailed) */}
          {showDetails && phase.assignees && phase.assignees.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {phase.assignees.slice(0, 3).map((assignee, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {assignee}
                </Badge>
              ))}
              {phase.assignees.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{phase.assignees.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function PhaseTimeline({
  phases,
  currentPhaseId,
  showProgress = true,
  showDetails = true,
  onPhaseClick,
  onEditPhase,
  onAddPhase,
  className
}: PhaseTimelineProps) {
  const t = useTranslation();

  if (phases.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Clock className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">{t("no_phases")}</h3>
          <p className="text-muted-foreground mb-4">{t("add_first_phase")}</p>
          {onAddPhase && (
            <Button onClick={onAddPhase}>
              <Plus className="w-4 h-4 mr-2" />
              {t("add_phase")}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {t("project_timeline")}
          </CardTitle>
          {onAddPhase && (
            <Button variant="outline" size="sm" onClick={onAddPhase}>
              <Plus className="w-4 h-4 mr-2" />
              {t("add_phase")}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-0">
        {phases.map((phase, index) => (
          <PhaseItem
            key={phase.id}
            phase={phase}
            isLast={index === phases.length - 1}
            isCurrent={phase.id === currentPhaseId}
            showProgress={showProgress}
            showDetails={showDetails}
            onPhaseClick={onPhaseClick}
            onEditPhase={onEditPhase}
          />
        ))}
      </CardContent>
    </Card>
  );
}