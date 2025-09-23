import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/use-language";
import {
  AlertTriangle,
  Trash2,
  FileX,
  Users,
  Calendar,
  Target
} from "lucide-react";

interface DeleteProjectConfirmProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  project: {
    id: number;
    name: string;
    description?: string;
    taskCount?: number;
    teamMemberCount?: number;
    phaseCount?: number;
    documentCount?: number;
    status?: string;
    endDate?: string;
  };
}

export function DeleteProjectConfirm({
  open,
  onOpenChange,
  onConfirm,
  project
}: DeleteProjectConfirmProps) {
  const t = useTranslation();

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const hasActiveContent =
    (project.taskCount && project.taskCount > 0) ||
    (project.teamMemberCount && project.teamMemberCount > 0) ||
    (project.phaseCount && project.phaseCount > 0) ||
    (project.documentCount && project.documentCount > 0);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div className="flex-1">
              <AlertDialogTitle className="text-left">
                {t("delete_project")}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-left">
                {t("delete_project_warning")}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        {/* Project Details */}
        <div className="space-y-4 py-4">
          <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Trash2 className="w-5 h-5 text-destructive mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-destructive">{project.name}</h4>
                {project.description && (
                  <p className="text-sm text-destructive/80 mt-1">{project.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Project Statistics */}
          {hasActiveContent && (
            <div className="space-y-3">
              <h5 className="font-medium text-sm text-muted-foreground">
                {t("project_contains")}:
              </h5>
              <div className="grid grid-cols-2 gap-3">
                {project.taskCount !== undefined && project.taskCount > 0 && (
                  <div className="flex items-center gap-2 p-2 bg-chart-4/10 rounded border border-chart-4/20">
                    <Target className="w-4 h-4 text-chart-4" />
                    <span className="text-sm">
                      <strong>{project.taskCount}</strong> {t("tasks")}
                    </span>
                  </div>
                )}

                {project.teamMemberCount !== undefined && project.teamMemberCount > 0 && (
                  <div className="flex items-center gap-2 p-2 bg-primary/10 rounded border border-primary/20">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm">
                      <strong>{project.teamMemberCount}</strong> {t("members")}
                    </span>
                  </div>
                )}

                {project.phaseCount !== undefined && project.phaseCount > 0 && (
                  <div className="flex items-center gap-2 p-2 bg-chart-3/10 rounded border border-chart-3/20">
                    <Calendar className="w-4 h-4 text-chart-3" />
                    <span className="text-sm">
                      <strong>{project.phaseCount}</strong> {t("phases")}
                    </span>
                  </div>
                )}

                {project.documentCount !== undefined && project.documentCount > 0 && (
                  <div className="flex items-center gap-2 p-2 bg-chart-1/10 rounded border border-chart-1/20">
                    <FileX className="w-4 h-4 text-chart-1" />
                    <span className="text-sm">
                      <strong>{project.documentCount}</strong> {t("documents")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Project Status */}
          {project.status && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{t("status")}:</span>
              <Badge variant={
                project.status === "active" ? "default" :
                project.status === "completed" ? "secondary" :
                "outline"
              }>
                {t(project.status)}
              </Badge>
            </div>
          )}

          {/* End Date */}
          {project.endDate && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {t("end_date")}: {project.endDate}
              </span>
            </div>
          )}

          {/* Warning Message */}
          <div className="p-4 bg-chart-4/10 border border-chart-4/20 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-chart-4 mt-0.5" />
              <div className="text-sm text-chart-4">
                <p className="font-medium mb-1">{t("warning")}!</p>
                <ul className="space-y-1 text-sm">
                  <li>• {t("delete_warning_permanent")}</li>
                  <li>• {t("delete_warning_data_loss")}</li>
                  <li>• {t("delete_warning_team_access")}</li>
                  {hasActiveContent && <li>• {t("delete_warning_active_content")}</li>}
                </ul>
              </div>
            </div>
          </div>

          {/* Confirmation Input */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {t("delete_confirmation_text", { projectName: project.name })}
            </p>
          </div>
        </div>

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel>
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive hover:bg-destructive/90 focus:ring-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {t("delete_forever")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}