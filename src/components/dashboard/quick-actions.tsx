import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/use-language";
import {
  Plus,
  Clock,
  Calendar,
  MessageCircle,
  BarChart3,
  Settings,
  Search,
  Upload,
  Download,
  RefreshCw
} from "lucide-react";

interface QuickAction {
  id: string;
  icon: React.ElementType;
  label: string;
  description: string;
  color: string;
  badgeCount?: number;
  onClick: () => void;
}

export function QuickActions() {
  const t = useTranslation();

  const quickActions: QuickAction[] = [
    {
      id: "create_task",
      icon: Plus,
      label: t("create_task"),
      description: t("add_new_task_to_project"),
      color: "text-blue-600 bg-blue-50 hover:bg-blue-100",
      onClick: () => console.log("Create task")
    },
    {
      id: "log_time",
      icon: Clock,
      label: t("log_time"),
      description: t("manually_log_work_hours"),
      color: "text-green-600 bg-green-50 hover:bg-green-100",
      onClick: () => console.log("Log time")
    },
    {
      id: "create_report",
      icon: BarChart3,
      label: t("create_report"),
      description: t("generate_progress_report"),
      color: "text-purple-600 bg-purple-50 hover:bg-purple-100",
      onClick: () => console.log("Create report")
    },
    {
      id: "schedule_meeting",
      icon: Calendar,
      label: t("schedule_meeting"),
      description: t("book_team_meeting"),
      color: "text-orange-600 bg-orange-50 hover:bg-orange-100",
      badgeCount: 3,
      onClick: () => console.log("Schedule meeting")
    },
    {
      id: "team_chat",
      icon: MessageCircle,
      label: t("team_chat"),
      description: t("open_team_discussion"),
      color: "text-indigo-600 bg-indigo-50 hover:bg-indigo-100",
      badgeCount: 5,
      onClick: () => console.log("Team chat")
    },
    {
      id: "upload_file",
      icon: Upload,
      label: t("upload_file"),
      description: t("add_project_documents"),
      color: "text-cyan-600 bg-cyan-50 hover:bg-cyan-100",
      onClick: () => console.log("Upload file")
    },
    {
      id: "export_data",
      icon: Download,
      label: t("export_data"),
      description: t("download_project_data"),
      color: "text-gray-600 bg-gray-50 hover:bg-gray-100",
      onClick: () => console.log("Export data")
    },
    {
      id: "settings",
      icon: Settings,
      label: t("settings"),
      description: t("configure_preferences"),
      color: "text-slate-600 bg-slate-50 hover:bg-slate-100",
      onClick: () => console.log("Settings")
    }
  ];

  const primaryActions = quickActions.slice(0, 4);
  const secondaryActions = quickActions.slice(4);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-emerald-600" />
          {t("quick_actions")}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Primary Actions - Large buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {primaryActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant="ghost"
                className={`h-auto p-4 flex flex-col items-start text-left space-y-2 ${action.color} border border-transparent hover:border-current/20`}
                onClick={action.onClick}
              >
                <div className="flex items-center justify-between w-full">
                  <Icon className="w-5 h-5" />
                  {action.badgeCount && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0">
                      {action.badgeCount}
                    </Badge>
                  )}
                </div>
                <div className="space-y-1 text-left">
                  <div className="font-medium text-sm">{action.label}</div>
                  <div className="text-xs opacity-70">{action.description}</div>
                </div>
              </Button>
            );
          })}
        </div>

        {/* Secondary Actions - Compact buttons */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">{t("more_actions")}</h4>
          <div className="grid grid-cols-1 gap-1">
            {secondaryActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="ghost"
                  size="sm"
                  className={`justify-start h-auto p-3 ${action.color} border border-transparent hover:border-current/20`}
                  onClick={action.onClick}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium">{action.label}</div>
                    <div className="text-xs opacity-70">{action.description}</div>
                  </div>
                  {action.badgeCount && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0">
                      {action.badgeCount}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Quick Search */}
        <div className="pt-2 border-t">
          <Button
            variant="outline"
            className="w-full justify-start text-muted-foreground"
            onClick={() => console.log("Quick search")}
          >
            <Search className="w-4 h-4 mr-2" />
            {t("search_projects_tasks")}...
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}