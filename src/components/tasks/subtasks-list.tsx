import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/hooks/use-language";
import {
  Plus,
  X,
  Check,
  MoreHorizontal,
  Edit,
  Trash2,
  User,
  Calendar,
  Clock,
  Flag,
  Target,
  CheckCircle2,
  Circle,
  PlayCircle,
  PauseCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskAssigneeSelector, type TeamMember } from "./task-assignee-selector";
import { TaskPrioritySelector, type TaskPriority } from "./task-priority-selector";
import { TaskDueDatePicker } from "./task-due-date-picker";

export interface Subtask {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  assigneeIds: number[];
  priority?: TaskPriority;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  createdAt: string;
  updatedAt: string;
  parentTaskId: number;
}

interface SubtasksListProps {
  subtasks: Subtask[];
  teamMembers: TeamMember[];
  onSubtaskAdd: (title: string) => void;
  onSubtaskUpdate: (id: number, updates: Partial<Subtask>) => void;
  onSubtaskDelete: (id: number) => void;
  onSubtaskToggle: (id: number, completed: boolean) => void;
  canEdit?: boolean;
  showProgress?: boolean;
  variant?: "default" | "compact" | "minimal";
  className?: string;
}

const priorityColors = {
  low: "text-green-600",
  medium: "text-yellow-600",
  high: "text-orange-600",
  urgent: "text-red-600"
};

export function SubtasksList({
  subtasks,
  teamMembers,
  onSubtaskAdd,
  onSubtaskUpdate,
  onSubtaskDelete,
  onSubtaskToggle,
  canEdit = true,
  showProgress = true,
  variant = "default",
  className
}: SubtasksListProps) {
  const t = useTranslation();
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const completedCount = subtasks.filter(s => s.completed).length;
  const totalCount = subtasks.length;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    onSubtaskAdd(newSubtaskTitle.trim());
    setNewSubtaskTitle("");
  };

  const handleStartEdit = (subtask: Subtask) => {
    setEditingId(subtask.id);
    setEditingTitle(subtask.title);
  };

  const handleSaveEdit = () => {
    if (editingId && editingTitle.trim()) {
      onSubtaskUpdate(editingId, { title: editingTitle.trim() });
    }
    setEditingId(null);
    setEditingTitle("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const getAssigneeNames = (assigneeIds: number[]) => {
    return teamMembers
      .filter(member => assigneeIds.includes(member.id))
      .map(member => member.name);
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  // Minimal variant - just checkboxes with titles
  if (variant === "minimal") {
    return (
      <div className={cn("space-y-2", className)}>
        {subtasks.map((subtask) => (
          <div key={subtask.id} className="flex items-center gap-2">
            <button
              onClick={() => canEdit && onSubtaskToggle(subtask.id, !subtask.completed)}
              className="flex-shrink-0"
              disabled={!canEdit}
            >
              {subtask.completed ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <Circle className="w-4 h-4 text-muted-foreground hover:text-primary" />
              )}
            </button>
            <span
              className={cn(
                "text-sm flex-1",
                subtask.completed && "line-through text-muted-foreground"
              )}
            >
              {subtask.title}
            </span>
            {subtask.assigneeIds.length > 0 && (
              <div className="flex -space-x-1">
                {subtask.assigneeIds.slice(0, 2).map((assigneeId) => {
                  const member = teamMembers.find(m => m.id === assigneeId);
                  if (!member) return null;
                  return (
                    <Avatar key={assigneeId} className="w-5 h-5 ring-1 ring-background">
                      {member.avatar ? (
                        <AvatarImage src={member.avatar} alt={member.name} />
                      ) : null}
                      <AvatarFallback className="text-xs">
                        {member.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  );
                })}
                {subtask.assigneeIds.length > 2 && (
                  <div className="w-5 h-5 bg-muted rounded-full flex items-center justify-center text-xs">
                    +{subtask.assigneeIds.length - 2}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {canEdit && (
          <div className="flex gap-2 pt-2">
            <Input
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              placeholder={t("add_subtask")}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
              className="h-8"
            />
            <Button onClick={handleAddSubtask} size="sm" variant="outline">
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Compact variant
  if (variant === "compact") {
    return (
      <div className={cn("space-y-3", className)}>
        {/* Progress Summary */}
        {showProgress && totalCount > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("subtasks_progress")}</span>
              <span className="font-medium">{completedCount}/{totalCount}</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        )}

        {/* Subtasks List */}
        <div className="space-y-2">
          {subtasks.map((subtask) => (
            <div
              key={subtask.id}
              className="flex items-center gap-3 p-2 rounded border hover:bg-muted/30 transition-colors"
            >
              <button
                onClick={() => canEdit && onSubtaskToggle(subtask.id, !subtask.completed)}
                disabled={!canEdit}
              >
                {subtask.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <Circle className="w-4 h-4 text-muted-foreground hover:text-primary" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                {editingId === subtask.id ? (
                  <div className="flex gap-2">
                    <Input
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit();
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                      className="h-7 text-sm"
                      autoFocus
                    />
                    <Button onClick={handleSaveEdit} size="sm" variant="ghost">
                      <Check className="w-3 h-3" />
                    </Button>
                    <Button onClick={handleCancelEdit} size="sm" variant="ghost">
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className={cn(
                      "text-sm font-medium truncate",
                      subtask.completed && "line-through text-muted-foreground"
                    )}>
                      {subtask.title}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {subtask.assigneeIds.length > 0 && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {getAssigneeNames(subtask.assigneeIds).slice(0, 2).join(", ")}
                          {subtask.assigneeIds.length > 2 && ` +${subtask.assigneeIds.length - 2}`}
                        </span>
                      )}

                      {subtask.dueDate && (
                        <span className={cn(
                          "flex items-center gap-1",
                          isOverdue(subtask.dueDate) && "text-red-600"
                        )}>
                          <Calendar className="w-3 h-3" />
                          {new Date(subtask.dueDate).toLocaleDateString()}
                        </span>
                      )}

                      {subtask.priority && (
                        <Flag className={cn("w-3 h-3", priorityColors[subtask.priority])} />
                      )}
                    </div>
                  </div>
                )}
              </div>

              {canEdit && editingId !== subtask.id && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleStartEdit(subtask)}>
                      <Edit className="w-3 h-3 mr-2" />
                      {t("edit")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onSubtaskDelete(subtask.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-3 h-3 mr-2" />
                      {t("delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ))}
        </div>

        {/* Add New Subtask */}
        {canEdit && (
          <div className="flex gap-2">
            <Input
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              placeholder={t("add_subtask")}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
              className="h-8"
            />
            <Button onClick={handleAddSubtask} size="sm" variant="outline">
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Default variant - full featured
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            {t("subtasks")} ({completedCount}/{totalCount})
          </CardTitle>
          {showProgress && (
            <Badge variant="outline">
              {Math.round(completionPercentage)}% {t("complete")}
            </Badge>
          )}
        </div>
        {showProgress && totalCount > 0 && (
          <Progress value={completionPercentage} className="h-2" />
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {subtasks.map((subtask) => (
          <div
            key={subtask.id}
            className="space-y-3 p-4 border rounded-lg hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => canEdit && onSubtaskToggle(subtask.id, !subtask.completed)}
                disabled={!canEdit}
                className="mt-0.5"
              >
                {subtask.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground hover:text-primary" />
                )}
              </button>

              <div className="flex-1 min-w-0 space-y-2">
                {editingId === subtask.id ? (
                  <div className="flex gap-2">
                    <Input
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit();
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                      className="flex-1"
                      autoFocus
                    />
                    <Button onClick={handleSaveEdit} size="sm">
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button onClick={handleCancelEdit} size="sm" variant="outline">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className={cn(
                      "text-sm font-medium",
                      subtask.completed && "line-through text-muted-foreground"
                    )}>
                      {subtask.title}
                    </div>

                    {subtask.description && (
                      <p className="text-xs text-muted-foreground">
                        {subtask.description}
                      </p>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {subtask.assigneeIds.length > 0 && (
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <div className="flex -space-x-1">
                            {subtask.assigneeIds.slice(0, 3).map((assigneeId) => {
                              const member = teamMembers.find(m => m.id === assigneeId);
                              if (!member) return null;
                              return (
                                <Avatar key={assigneeId} className="w-4 h-4 ring-1 ring-background">
                                  {member.avatar ? (
                                    <AvatarImage src={member.avatar} alt={member.name} />
                                  ) : null}
                                  <AvatarFallback className="text-xs">
                                    {member.name.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              );
                            })}
                          </div>
                          {subtask.assigneeIds.length > 3 && (
                            <span>+{subtask.assigneeIds.length - 3}</span>
                          )}
                        </div>
                      )}

                      {subtask.dueDate && (
                        <div className={cn(
                          "flex items-center gap-1",
                          isOverdue(subtask.dueDate) && !subtask.completed && "text-red-600"
                        )}>
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(subtask.dueDate).toLocaleDateString()}</span>
                        </div>
                      )}

                      {subtask.estimatedHours && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{subtask.estimatedHours}h</span>
                          {subtask.actualHours && (
                            <span className="text-muted-foreground">
                              / {subtask.actualHours}h
                            </span>
                          )}
                        </div>
                      )}

                      {subtask.priority && (
                        <Flag className={cn("w-3 h-3", priorityColors[subtask.priority])} />
                      )}
                    </div>
                  </>
                )}
              </div>

              {canEdit && editingId !== subtask.id && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleStartEdit(subtask)}>
                      <Edit className="w-4 h-4 mr-2" />
                      {t("edit")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onSubtaskDelete(subtask.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {t("delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        ))}

        {/* Empty State */}
        {subtasks.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">{t("no_subtasks_yet")}</p>
            <p className="text-xs mt-1">{t("break_down_task_into_smaller_parts")}</p>
          </div>
        )}

        {/* Add New Subtask */}
        {canEdit && (
          <div className="flex gap-2">
            <Input
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              placeholder={t("add_subtask")}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
            />
            <Button onClick={handleAddSubtask} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              {t("add")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Progress summary component
interface SubtasksProgressProps {
  subtasks: Subtask[];
  showDetails?: boolean;
  className?: string;
}

export function SubtasksProgress({
  subtasks,
  showDetails = false,
  className
}: SubtasksProgressProps) {
  const t = useTranslation();
  const completedCount = subtasks.filter(s => s.completed).length;
  const totalCount = subtasks.length;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (totalCount === 0) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{t("subtasks")}</span>
        <span className="font-medium">{completedCount}/{totalCount}</span>
      </div>
      <Progress value={completionPercentage} className="h-2" />
      {showDetails && (
        <div className="text-xs text-muted-foreground">
          {Math.round(completionPercentage)}% {t("complete")}
        </div>
      )}
    </div>
  );
}