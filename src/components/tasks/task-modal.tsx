import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/hooks/use-language";
import {
  Calendar,
  Clock,
  Flag,
  User,
  Tag,
  MessageSquare,
  Activity,
  CheckSquare,
  List,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Archive,
  MoreHorizontal,
  Play,
  Pause,
  CheckCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface TaskData {
  id: number;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "review" | "done" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  assignees: Array<{
    id: number;
    name: string;
    avatar?: string;
    email: string;
  }>;
  reporter: {
    id: number;
    name: string;
    avatar?: string;
    email: string;
  };
  project: {
    id: number;
    name: string;
    key: string;
  };
  phase?: {
    id: number;
    name: string;
  };
  tags: string[];
  dueDate?: string;
  startDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  progress: number; // 0-100
  subtasks: Array<{
    id: number;
    title: string;
    completed: boolean;
    assignee?: string;
  }>;
  checklist: Array<{
    id: number;
    text: string;
    completed: boolean;
  }>;
  comments: Array<{
    id: number;
    author: {
      name: string;
      avatar?: string;
    };
    content: string;
    timestamp: string;
    edited?: boolean;
  }>;
  attachments: Array<{
    id: number;
    name: string;
    size: string;
    url: string;
    type: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface TaskModalProps {
  task: TaskData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (task: TaskData) => void;
  onDelete?: (taskId: number) => void;
  onStatusChange?: (taskId: number, status: TaskData["status"]) => void;
  onAssign?: (taskId: number) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

const statusConfig = {
  todo: { color: "bg-gray-100 text-gray-800", icon: List, label: "to_do" },
  in_progress: { color: "bg-blue-100 text-blue-800", icon: Play, label: "in_progress" },
  review: { color: "bg-yellow-100 text-yellow-800", icon: Pause, label: "review" },
  done: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "done" },
  cancelled: { color: "bg-red-100 text-red-800", icon: Archive, label: "cancelled" }
};

const priorityConfig = {
  low: { color: "bg-green-100 text-green-800", icon: Flag },
  medium: { color: "bg-yellow-100 text-yellow-800", icon: Flag },
  high: { color: "bg-orange-100 text-orange-800", icon: Flag },
  urgent: { color: "bg-red-100 text-red-800", icon: Flag }
};

export function TaskModal({
  task,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  onStatusChange,
  onAssign,
  canEdit = false,
  canDelete = false
}: TaskModalProps) {
  const t = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");

  if (!task) return null;

  const statusInfo = statusConfig[task.status];
  const priorityInfo = priorityConfig[task.priority];
  const StatusIcon = statusInfo.icon;
  const PriorityIcon = priorityInfo.icon;

  const completedSubtasks = task.subtasks.filter(sub => sub.completed).length;
  const completedChecklist = task.checklist.filter(item => item.completed).length;

  const handleStatusChange = (newStatus: TaskData["status"]) => {
    if (onStatusChange) {
      onStatusChange(task.id, newStatus);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-muted-foreground">
                  {task.project.key}-{task.id}
                </span>
                <Badge className={statusInfo.color} variant="secondary">
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {t(statusInfo.label)}
                </Badge>
                <Badge className={priorityInfo.color} variant="secondary">
                  <PriorityIcon className="w-3 h-3 mr-1" />
                  {t(task.priority)}
                </Badge>
              </div>
              <DialogTitle className="text-xl font-semibold">
                {task.title}
              </DialogTitle>
              {task.description && (
                <DialogDescription className="mt-2">
                  {task.description}
                </DialogDescription>
              )}
            </div>

            {/* Action Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {canEdit && onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(task)}>
                    <Edit className="w-4 h-4 mr-2" />
                    {t("edit")}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(`${task.project.key}-${task.id}`)}>
                  <Copy className="w-4 h-4 mr-2" />
                  {t("copy_link")}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {t("open_in_new_tab")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {canDelete && onDelete && (
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => onDelete(task.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t("delete")}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
              <TabsTrigger value="subtasks">
                {t("subtasks")} ({completedSubtasks}/{task.subtasks.length})
              </TabsTrigger>
              <TabsTrigger value="comments">
                {t("comments")} ({task.comments.length})
              </TabsTrigger>
              <TabsTrigger value="activity">{t("activity")}</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="overview" className="h-full">
                <ScrollArea className="h-full pr-6">
                  <div className="space-y-6">
                    {/* Task Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-3">{t("details")}</h4>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{t("assignees")}:</span>
                              <div className="flex -space-x-1">
                                {task.assignees.map((assignee) => (
                                  <div
                                    key={assignee.id}
                                    className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium ring-2 ring-background"
                                    title={assignee.name}
                                  >
                                    {assignee.name.charAt(0).toUpperCase()}
                                  </div>
                                ))}
                                {onAssign && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-6 h-6 rounded-full p-0 ml-2"
                                    onClick={() => onAssign(task.id)}
                                  >
                                    +
                                  </Button>
                                )}
                              </div>
                            </div>

                            {task.dueDate && (
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">{t("due_date")}:</span>
                                <span className="text-sm">{formatDate(task.dueDate)}</span>
                              </div>
                            )}

                            {task.estimatedHours && (
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">{t("estimated")}:</span>
                                <span className="text-sm">{task.estimatedHours}h</span>
                                {task.actualHours && (
                                  <span className="text-sm text-muted-foreground">
                                    / {task.actualHours}h {t("actual")}
                                  </span>
                                )}
                              </div>
                            )}

                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{t("reporter")}:</span>
                              <span className="text-sm">{task.reporter.name}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">{t("project")}:</span>
                              <Badge variant="outline">{task.project.name}</Badge>
                              {task.phase && (
                                <>
                                  <span className="text-sm text-muted-foreground">•</span>
                                  <Badge variant="outline">{task.phase.name}</Badge>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Tags */}
                        {task.tags.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">{t("tags")}</h4>
                            <div className="flex flex-wrap gap-1">
                              {task.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  <Tag className="w-3 h-3 mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        {/* Status Actions */}
                        <div>
                          <h4 className="font-medium mb-3">{t("status_actions")}</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(statusConfig).map(([status, config]) => {
                              const Icon = config.icon;
                              const isActive = task.status === status;
                              return (
                                <Button
                                  key={status}
                                  variant={isActive ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handleStatusChange(status as TaskData["status"])}
                                  className="justify-start"
                                >
                                  <Icon className="w-3 h-3 mr-2" />
                                  {t(config.label)}
                                </Button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div>
                          <h4 className="font-medium mb-3">{t("progress")}</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{t("completion")}</span>
                              <span>{task.progress}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Timestamps */}
                        <div>
                          <h4 className="font-medium mb-2">{t("timestamps")}</h4>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <div>{t("created")}: {formatDateTime(task.createdAt)}</div>
                            <div>{t("updated")}: {formatDateTime(task.updatedAt)}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Checklist Preview */}
                    {task.checklist.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <CheckSquare className="w-4 h-4" />
                          {t("checklist")} ({completedChecklist}/{task.checklist.length})
                        </h4>
                        <div className="space-y-2">
                          {task.checklist.slice(0, 5).map((item) => (
                            <div key={item.id} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={item.completed}
                                readOnly
                                className="rounded"
                              />
                              <span className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                                {item.text}
                              </span>
                            </div>
                          ))}
                          {task.checklist.length > 5 && (
                            <div className="text-sm text-muted-foreground">
                              +{task.checklist.length - 5} {t("more_items")}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="subtasks" className="h-full">
                <ScrollArea className="h-full">
                  <div className="space-y-3 pr-6">
                    {task.subtasks.map((subtask) => (
                      <div key={subtask.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          readOnly
                          className="rounded"
                        />
                        <div className="flex-1">
                          <div className={`text-sm font-medium ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {subtask.title}
                          </div>
                          {subtask.assignee && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {t("assigned_to")}: {subtask.assignee}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {task.subtasks.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <List className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>{t("no_subtasks")}</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="comments" className="h-full">
                <ScrollArea className="h-full">
                  <div className="space-y-4 pr-6">
                    {task.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                          {comment.author.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{comment.author.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDateTime(comment.timestamp)}
                            </span>
                            {comment.edited && (
                              <span className="text-xs text-muted-foreground">{t("edited")}</span>
                            )}
                          </div>
                          <div className="text-sm text-foreground bg-muted/50 p-2 rounded">
                            {comment.content}
                          </div>
                        </div>
                      </div>
                    ))}
                    {task.comments.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>{t("no_comments")}</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="activity" className="h-full">
                <ScrollArea className="h-full">
                  <div className="text-center py-8 text-muted-foreground pr-6">
                    <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>{t("activity_log_coming_soon")}</p>
                  </div>
                </ScrollArea>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}