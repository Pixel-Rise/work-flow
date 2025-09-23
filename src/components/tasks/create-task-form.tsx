import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/hooks/use-language";
import {
  Plus,
  X,
  Save,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Target
} from "lucide-react";

// Import our custom components
import { TaskPrioritySelector, type TaskPriority } from "./task-priority-selector";
import { TaskAssigneeSelector, type TeamMember } from "./task-assignee-selector";
import { TaskDueDatePicker } from "./task-due-date-picker";
import { TaskTagsInput } from "./task-tags-input";

export interface CreateTaskFormData {
  title: string;
  description: string;
  priority: TaskPriority;
  assignees: number[];
  projectId: number;
  phaseId?: number;
  tags: string[];
  dueDate?: string;
  estimatedHours?: number;
  subtasks: Array<{
    id: number;
    title: string;
    assigneeId?: number;
  }>;
  checklist: Array<{
    id: number;
    text: string;
  }>;
}

interface Project {
  id: number;
  name: string;
  key: string;
  phases: Array<{
    id: number;
    name: string;
  }>;
}

interface CreateTaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: CreateTaskFormData) => void;
  projects: Project[];
  teamMembers: TeamMember[];
  defaultProjectId?: number;
  defaultPhaseId?: number;
  variant?: "modal" | "inline";
  className?: string;
}

export function CreateTaskForm({
  open,
  onOpenChange,
  onSubmit,
  projects,
  teamMembers,
  defaultProjectId,
  defaultPhaseId,
  variant = "modal",
  className
}: CreateTaskFormProps) {
  const t = useTranslation();

  const [formData, setFormData] = useState<CreateTaskFormData>({
    title: "",
    description: "",
    priority: "medium",
    assignees: [],
    projectId: defaultProjectId || 0,
    phaseId: defaultPhaseId,
    tags: [],
    dueDate: undefined,
    estimatedHours: undefined,
    subtasks: [],
    checklist: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newSubtask, setNewSubtask] = useState("");
  const [newChecklistItem, setNewChecklistItem] = useState("");

  const selectedProject = projects.find(p => p.id === formData.projectId);
  const availablePhases = selectedProject?.phases || [];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = t("task_title_required");
    }

    if (!formData.projectId) {
      newErrors.projectId = t("project_required");
    }

    if (formData.assignees.length === 0) {
      newErrors.assignees = t("at_least_one_assignee_required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
    handleReset();

    if (variant === "modal") {
      onOpenChange(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      assignees: [],
      projectId: defaultProjectId || 0,
      phaseId: defaultPhaseId,
      tags: [],
      dueDate: undefined,
      estimatedHours: undefined,
      subtasks: [],
      checklist: []
    });
    setErrors({});
    setNewSubtask("");
    setNewChecklistItem("");
  };

  const addSubtask = () => {
    if (!newSubtask.trim()) return;

    setFormData(prev => ({
      ...prev,
      subtasks: [
        ...prev.subtasks,
        {
          id: Date.now(),
          title: newSubtask.trim(),
          assigneeId: undefined
        }
      ]
    }));
    setNewSubtask("");
  };

  const removeSubtask = (id: number) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter(sub => sub.id !== id)
    }));
  };

  const addChecklistItem = () => {
    if (!newChecklistItem.trim()) return;

    setFormData(prev => ({
      ...prev,
      checklist: [
        ...prev.checklist,
        {
          id: Date.now(),
          text: newChecklistItem.trim()
        }
      ]
    }));
    setNewChecklistItem("");
  };

  const removeChecklistItem = (id: number) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.filter(item => item.id !== id)
    }));
  };

  const handleProjectChange = (projectId: string) => {
    const id = parseInt(projectId);
    setFormData(prev => ({
      ...prev,
      projectId: id,
      phaseId: undefined // Reset phase when project changes
    }));
  };

  const FormContent = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">{t("task_title")} *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder={t("enter_task_title")}
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && (
            <div className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.title}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">{t("description")}</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder={t("describe_task_details")}
            rows={3}
          />
        </div>
      </div>

      {/* Project and Phase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t("project")} *</Label>
          <Select
            value={formData.projectId.toString()}
            onValueChange={handleProjectChange}
          >
            <SelectTrigger className={errors.projectId ? "border-red-500" : ""}>
              <SelectValue placeholder={t("select_project")} />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id.toString()}>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                      {project.key}
                    </span>
                    <span>{project.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.projectId && (
            <div className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.projectId}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>{t("phase")}</Label>
          <Select
            value={formData.phaseId?.toString() || ""}
            onValueChange={(value) => setFormData(prev => ({
              ...prev,
              phaseId: value ? parseInt(value) : undefined
            }))}
            disabled={!selectedProject || availablePhases.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("select_phase_optional")} />
            </SelectTrigger>
            <SelectContent>
              {availablePhases.map((phase) => (
                <SelectItem key={phase.id} value={phase.id.toString()}>
                  {phase.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Priority and Assignees */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t("priority")}</Label>
          <TaskPrioritySelector
            value={formData.priority}
            onValueChange={(priority) => setFormData(prev => ({ ...prev, priority }))}
          />
        </div>

        <div className="space-y-2">
          <Label>{t("assignees")} *</Label>
          <TaskAssigneeSelector
            value={formData.assignees}
            onValueChange={(assignees) => setFormData(prev => ({ ...prev, assignees }))}
            teamMembers={teamMembers}
            className={errors.assignees ? "border-red-500" : ""}
          />
          {errors.assignees && (
            <div className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.assignees}
            </div>
          )}
        </div>
      </div>

      {/* Due Date and Estimated Hours */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t("due_date")}</Label>
          <TaskDueDatePicker
            value={formData.dueDate}
            onValueChange={(date) => setFormData(prev => ({ ...prev, dueDate: date }))}
            minDate={new Date()}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="estimatedHours">{t("estimated_hours")}</Label>
          <div className="relative">
            <Input
              id="estimatedHours"
              type="number"
              min="0.5"
              step="0.5"
              value={formData.estimatedHours || ""}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                estimatedHours: e.target.value ? parseFloat(e.target.value) : undefined
              }))}
              placeholder="8"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              {t("hours")}
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label>{t("tags")}</Label>
        <TaskTagsInput
          value={formData.tags}
          onValueChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
        />
      </div>

      <Separator />

      {/* Subtasks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium flex items-center gap-2">
            <Target className="w-4 h-4" />
            {t("subtasks")} ({formData.subtasks.length})
          </Label>
        </div>

        {formData.subtasks.length > 0 && (
          <div className="space-y-2">
            {formData.subtasks.map((subtask) => (
              <div key={subtask.id} className="flex items-center gap-2 p-2 border rounded-lg">
                <CheckCircle className="w-4 h-4 text-muted-foreground" />
                <span className="flex-1 text-sm">{subtask.title}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSubtask(subtask.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Input
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            placeholder={t("add_subtask")}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
          />
          <Button type="button" onClick={addSubtask} variant="outline">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Separator />

      {/* Checklist */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {t("checklist")} ({formData.checklist.length})
          </Label>
        </div>

        {formData.checklist.length > 0 && (
          <div className="space-y-2">
            {formData.checklist.map((item) => (
              <div key={item.id} className="flex items-center gap-2 p-2 border rounded-lg">
                <input type="checkbox" disabled className="rounded" />
                <span className="flex-1 text-sm">{item.text}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeChecklistItem(item.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Input
            value={newChecklistItem}
            onChange={(e) => setNewChecklistItem(e.target.value)}
            placeholder={t("add_checklist_item")}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addChecklistItem())}
          />
          <Button type="button" onClick={addChecklistItem} variant="outline">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-2 pt-4">
        {variant === "modal" && (
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {t("cancel")}
          </Button>
        )}

        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("reset")}
        </Button>

        <Button type="submit">
          <Save className="w-4 h-4 mr-2" />
          {t("create_task")}
        </Button>
      </div>
    </form>
  );

  if (variant === "inline") {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            {t("create_new_task")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormContent />
        </CardContent>
      </Card>
    );
  }

  // Modal variant
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            {t("create_new_task")}
          </DialogTitle>
          <DialogDescription>
            {t("fill_task_details_description")}
          </DialogDescription>
        </DialogHeader>

        <FormContent />
      </DialogContent>
    </Dialog>
  );
}

// Quick create task button component
interface QuickCreateTaskProps {
  onCreateTask: (formData: CreateTaskFormData) => void;
  projects: Project[];
  teamMembers: TeamMember[];
  defaultProjectId?: number;
  defaultPhaseId?: number;
  variant?: "button" | "fab";
  className?: string;
}

export function QuickCreateTask({
  onCreateTask,
  projects,
  teamMembers,
  defaultProjectId,
  defaultPhaseId,
  variant = "button",
  className
}: QuickCreateTaskProps) {
  const t = useTranslation();
  const [open, setOpen] = useState(false);

  if (variant === "fab") {
    return (
      <>
        <Button
          onClick={() => setOpen(true)}
          className={cn(
            "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50",
            className
          )}
        >
          <Plus className="w-6 h-6" />
        </Button>

        <CreateTaskForm
          open={open}
          onOpenChange={setOpen}
          onSubmit={onCreateTask}
          projects={projects}
          teamMembers={teamMembers}
          defaultProjectId={defaultProjectId}
          defaultPhaseId={defaultPhaseId}
        />
      </>
    );
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className={className}>
        <Plus className="w-4 h-4 mr-2" />
        {t("create_task")}
      </Button>

      <CreateTaskForm
        open={open}
        onOpenChange={setOpen}
        onSubmit={onCreateTask}
        projects={projects}
        teamMembers={teamMembers}
        defaultProjectId={defaultProjectId}
        defaultPhaseId={defaultPhaseId}
      />
    </>
  );
}