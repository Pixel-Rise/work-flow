import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-language";
import {
  CheckCircle,
  Clock,
  Play,
  ArrowRight,
  Calendar,
  User
} from "lucide-react";

interface Task {
  id: number;
  title: string;
  project: string;
  status: "todo" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  progress: number;
  dueDate: string;
  assignee: string;
  tags: string[];
}

const sampleTasks: Task[] = [
  {
    id: 1,
    title: "User Authentication System",
    project: "SalesFlow",
    status: "in_progress",
    priority: "high",
    progress: 75,
    dueDate: "2025-09-18",
    assignee: "Azizbek",
    tags: ["backend", "security"]
  },
  {
    id: 2,
    title: "Dashboard UI Design",
    project: "Digital School",
    status: "review",
    priority: "medium",
    progress: 90,
    dueDate: "2025-09-16",
    assignee: "Ali",
    tags: ["ui", "design"]
  },
  {
    id: 3,
    title: "API Documentation",
    project: "SalesFlow",
    status: "todo",
    priority: "low",
    progress: 0,
    dueDate: "2025-09-25",
    assignee: "Bek",
    tags: ["docs", "api"]
  },
  {
    id: 4,
    title: "NFC Integration",
    project: "Legenda Big Fit",
    status: "in_progress",
    priority: "urgent",
    progress: 45,
    dueDate: "2025-09-15",
    assignee: "Laylo",
    tags: ["mobile", "nfc"]
  }
];

const statusConfig = {
  todo: { color: "text-gray-600", bg: "bg-gray-100", label: "to_do" },
  in_progress: { color: "text-blue-600", bg: "bg-blue-100", label: "in_progress" },
  review: { color: "text-yellow-600", bg: "bg-yellow-100", label: "review" },
  done: { color: "text-green-600", bg: "bg-green-100", label: "done" },
};

const priorityConfig = {
  low: { color: "text-green-600", bg: "bg-green-100" },
  medium: { color: "text-yellow-600", bg: "bg-yellow-100" },
  high: { color: "text-orange-600", bg: "bg-orange-100" },
  urgent: { color: "text-red-600", bg: "bg-red-100" },
};

function TaskItem({ task }: { task: Task }) {
  const t = useTranslation();
  const status = statusConfig[task.status];
  const priority = priorityConfig[task.priority];

  const isOverdue = new Date(task.dueDate) < new Date();
  const isDueSoon = new Date(task.dueDate).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000;

  return (
    <div className="p-4 border rounded-lg hover:bg-muted/30 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-medium text-sm mb-1">{task.title}</h4>
          <p className="text-xs text-muted-foreground">{task.project}</p>
        </div>
        <div className="flex items-center gap-1">
          <Badge
            variant="secondary"
            className={`text-xs ${status.color} ${status.bg}`}
          >
            {t(status.label)}
          </Badge>
          <Badge
            variant="secondary"
            className={`text-xs ${priority.color} ${priority.bg}`}
          >
            {t(task.priority)}
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{t("progress")}</span>
          <span className="font-medium">{task.progress}%</span>
        </div>
        <Progress value={task.progress} className="h-2" />
      </div>

      <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span className={isOverdue ? "text-red-600 font-medium" : isDueSoon ? "text-orange-600" : ""}>
              {task.dueDate}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>{task.assignee}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {task.tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs px-1 py-0">
              {tag}
            </Badge>
          ))}
          {task.tags.length > 2 && (
            <span className="text-xs text-muted-foreground">+{task.tags.length - 2}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export function TaskProgressWidget() {
  const t = useTranslation();

  const completedTasks = sampleTasks.filter(task => task.status === "done").length;
  const totalTasks = sampleTasks.length;
  const inProgressTasks = sampleTasks.filter(task => task.status === "in_progress").length;
  const overdueTasks = sampleTasks.filter(task => new Date(task.dueDate) < new Date()).length;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            {t("task_progress")}
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-xs">
            {t("view_all")}
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
            <div className="text-xs text-green-700">{t("completed")}</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{inProgressTasks}</div>
            <div className="text-xs text-blue-700">{t("in_progress")}</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{overdueTasks}</div>
            <div className="text-xs text-red-700">{t("overdue")}</div>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t("overall_progress")}</span>
            <span className="font-medium">{Math.round((completedTasks / totalTasks) * 100)}%</span>
          </div>
          <Progress value={(completedTasks / totalTasks) * 100} className="h-2" />
        </div>

        {/* Recent Tasks */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">{t("recent_tasks")}</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {sampleTasks.slice(0, 4).map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button size="sm" className="flex-1">
            <Play className="w-3 h-3 mr-1" />
            {t("start_task")}
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Clock className="w-3 h-3 mr-1" />
            {t("log_time")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}