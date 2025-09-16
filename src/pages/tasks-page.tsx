import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from "@/components/ui/shadcn-io/kanban";
import type { DragEndEvent } from "@/components/ui/shadcn-io/kanban";
import { subDays } from "date-fns";
import { useTranslation } from "@/hooks/use-language";
import { usePageTitle } from "@/hooks/use-title";
import { ShoppingCart, School, Dumbbell, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskModal } from "@/components/tasks/task-modal";
import { CreateTaskForm } from "@/components/tasks/create-task-form";
import { TaskFilters, TaskFilterState } from "@/components/tasks/task-filters";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import me from "@/assets/avatar.jpg";

const today = new Date();

interface Task {
  id: number;
  title: string;
  status: "cancel" | "to_do" | "in_progress" | "on_staging" | "done";
  projectId: number;
  phaseId: number;
  startAt?: Date;
  endAt?: Date;
  name: string;
  description?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  assigneeId?: number;
  tags?: string[];
  subtasks?: { id: number; title: string; completed: boolean }[];
  checklist?: { id: number; text: string; completed: boolean }[];
  estimatedHours?: number;
  actualHours?: number;
}

interface Contributor {
  id: number;
  name: string;
  image?: string;
  contribution: number; // percentage
}

interface Phase {
  id: number;
  title: string;
  progress: number; // 0 to 100
  tasks: Task[];
}

interface Project {
  id: number;
  name: string;
  icon?: React.ElementType;
  phases: Phase[];
  contributors: Contributor[];
}

const sampleProjects: Project[] = [
  {
    id: 1,
    name: "SalesFlow",
    icon: ShoppingCart,
    phases: [
      {
        id: 1,
        title: "Design",
        progress: 100,
        tasks: [
          {
            id: 1,
            title: "Wireframes",
            name: "Wireframes Design",
            status: "done",
            projectId: 1,
            phaseId: 1,
            startAt: subDays(today, 15),
            endAt: subDays(today, 10),
          },
          {
            id: 2,
            title: "Mockups",
            name: "UI Mockups",
            status: "done",
            projectId: 1,
            phaseId: 1,
            startAt: subDays(today, 10),
            endAt: subDays(today, 5),
          },
        ],
      },
      {
        id: 2,
        title: "Development",
        progress: 50,
        tasks: [
          {
            id: 3,
            title: "Backend",
            name: "Backend Development",
            status: "in_progress",
            projectId: 1,
            phaseId: 2,
            startAt: subDays(today, 7),
            endAt: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
          },
          {
            id: 4,
            title: "Frontend",
            name: "Frontend Development",
            status: "to_do",
            projectId: 1,
            phaseId: 2,
            startAt: today,
            endAt: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000),
          },
        ],
      },
    ],
    contributors: [
      { id: 1, name: "Azizbek", image: me, contribution: 60 },
      { id: 2, name: "Ali", contribution: 40 },
      { id: 3, name: "Laylo", contribution: 30 },
      { id: 4, name: "Bek", contribution: 20 },
    ],
  },
  {
    id: 2,
    name: "Legenda Big Fit",
    icon: Dumbbell,
    phases: [
      {
        id: 1,
        title: "NFC Integration",
        progress: 50,
        tasks: [
          {
            id: 5,
            title: "NFC Research",
            name: "NFC Technology Research",
            status: "in_progress",
            projectId: 2,
            phaseId: 1,
            startAt: subDays(today, 5),
            endAt: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
          },
          {
            id: 6,
            title: "NFC Implementation",
            name: "NFC Feature Implementation",
            status: "to_do",
            projectId: 2,
            phaseId: 1,
            startAt: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
            endAt: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000),
          },
        ],
      },
    ],
    contributors: [
      { id: 1, name: "Azizbek", image: me, contribution: 60 },
      { id: 4, name: "Bek", contribution: 20 },
    ],
  },
  {
    id: 3,
    name: "Digital School",
    icon: School,
    phases: [
      {
        id: 1,
        title: "Planning",
        progress: 80,
        tasks: [
          {
            id: 7,
            title: "Requirements",
            name: "Requirements Analysis",
            status: "done",
            projectId: 3,
            phaseId: 1,
            startAt: subDays(today, 20),
            endAt: subDays(today, 15),
          },
          {
            id: 8,
            title: "Research",
            name: "Market Research",
            status: "on_staging",
            projectId: 3,
            phaseId: 1,
            startAt: subDays(today, 12),
            endAt: subDays(today, 2),
          },
        ],
      },
    ],
    contributors: [{ id: 3, name: "Bek", contribution: 100 }],
  },
];

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

export default function TasksPage() {
  const t = useTranslation();

  const exampleStatuses = [
    { id: "cancel", name: t("cancel"), color: "#F87171" },
    { id: "to_do", name: t("to_do"), color: "#9CA3AF" },
    { id: "in_progress", name: t("in_progress"), color: "#60A5FA" },
    { id: "on_staging", name: t("on_staging"), color: "#FACC15" },
    { id: "done", name: t("done"), color: "#34D399" },
  ];

  // sampleProjects dan barcha tasklarni olib chiqish
  const getAllTasks = (): Task[] => {
    const allTasks: Task[] = [];
    sampleProjects.forEach((project) => {
      project.phases.forEach((phase) => {
        allTasks.push(...phase.tasks);
      });
    });
    return allTasks;
  };

  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentPhase, setCurrentPhase] = useState<Phase | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<TaskFilterState>({
    search: '',
    projects: [],
    assignees: [],
    priorities: [],
    statuses: [],
    tags: [],
    dateRange: {},
    showCompleted: true,
    showArchived: false
  });

  const params = useParams();
  const [searchParams] = useSearchParams();

  const projectId = params.projectId ? parseInt(params.projectId) : null;
  const phaseId = searchParams.get("phase")
    ? parseInt(searchParams.get("phase")!)
    : null;

  useEffect(() => {
    if (!projectId) return;

    // Loyihani topish
    const project = sampleProjects.find((p) => p.id === projectId);
    if (!project) return;

    setCurrentProject(project);

    // Barcha tasklarni olish
    const allTasks = getAllTasks();

    // ProjectId bo'yicha filter qilish
    let filtered = allTasks.filter(
      (task: Task) => task.projectId === projectId
    );

    // Agar phase parametri bo'lsa, phase bo'yicha ham filter qilish
    if (phaseId) {
      const phase = project.phases.find((p) => p.id === phaseId);
      setCurrentPhase(phase || null);
      filtered = filtered.filter((task: Task) => task.phaseId === phaseId);
    } else {
      setCurrentPhase(null);
    }

    setTasks(filtered);
    applyFilters(filtered);
  }, [projectId, phaseId]);

  // Apply filters to tasks
  const applyFilters = (tasksToFilter: Task[]) => {
    let filtered = [...tasksToFilter];

    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(task =>
        task.name.toLowerCase().includes(search) ||
        task.description?.toLowerCase().includes(search)
      );
    }

    // Status filter
    if (filters.statuses.length > 0) {
      filtered = filtered.filter(task =>
        filters.statuses.includes(task.status as any)
      );
    }

    // Priority filter
    if (filters.priorities.length > 0) {
      filtered = filtered.filter(task =>
        task.priority && filters.priorities.includes(task.priority)
      );
    }

    // Assignee filter
    if (filters.assignees.length > 0) {
      filtered = filtered.filter(task =>
        task.assigneeId && filters.assignees.includes(task.assigneeId)
      );
    }

    // Tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(task =>
        task.tags && task.tags.some(tag => filters.tags.includes(tag))
      );
    }

    // Show completed filter
    if (!filters.showCompleted) {
      filtered = filtered.filter(task => task.status !== 'done');
    }

    setFilteredTasks(filtered);
  };

  // Re-apply filters when filters change
  useEffect(() => {
    applyFilters(tasks);
  }, [filters, tasks]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const newStatus = over.id as
      | "cancel"
      | "to_do"
      | "in_progress"
      | "on_staging"
      | "done";
    if (!exampleStatuses.find((s) => s.id === newStatus)) return;

    const updatedTasks = tasks.map((task: Task) =>
      task.id === parseInt(active.id as string)
        ? { ...task, status: newStatus }
        : task
    );

    setTasks(updatedTasks);
    applyFilters(updatedTasks);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskCreate = (taskData: any) => {
    const newTask: Task = {
      id: Date.now(),
      name: taskData.title,
      title: taskData.title,
      description: taskData.description,
      status: 'to_do',
      projectId: projectId!,
      phaseId: phaseId || 1,
      priority: taskData.priority,
      assigneeId: taskData.assigneeId,
      tags: taskData.tags,
      startAt: taskData.startDate,
      endAt: taskData.dueDate,
      estimatedHours: taskData.estimatedHours,
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    applyFilters(updatedTasks);
    setIsCreateTaskOpen(false);
  };

  const handleTaskUpdate = (taskId: number, updates: Partial<Task>) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    );
    setTasks(updatedTasks);
    applyFilters(updatedTasks);
  };

  const handleTaskDelete = (taskId: number) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    applyFilters(updatedTasks);
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  };

  // Set page title
  usePageTitle(
    `${t("tasks")}${currentProject?.name ? " - " + currentProject.name : ""}${
      currentPhase ? " - " + currentPhase.title : ""
    }`
  );

  // Loading state
  if (!projectId) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  return (
    <div className="flex pt-2 flex-col h-full">
      {/* Header with Actions */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">
            {currentProject?.name} {currentPhase && `- ${currentPhase.title}`}
          </h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            {t("filters")}
          </Button>
        </div>

        <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t("createTask")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t("createNewTask")}</DialogTitle>
            </DialogHeader>
            <CreateTaskForm
              projectId={projectId!}
              phaseId={phaseId}
              onSubmit={handleTaskCreate}
              onCancel={() => setIsCreateTaskOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-4">
          <TaskFilters
            filters={filters}
            onFiltersChange={setFilters}
            variant="default"
            availableProjects={sampleProjects.map(p => ({ id: p.id, name: p.name }))}
            availableAssignees={sampleProjects.flatMap(p => p.contributors).map(c => ({ id: c.id, name: c.name, avatar: c.image }))}
            availableTags={['urgent', 'bug', 'feature', 'improvement', 'docs']}
            className="bg-card p-4 rounded-lg border"
          />
        </div>
      )}

      {/* Kanban Board */}
      <KanbanProvider
        onDragEnd={handleDragEnd}
        className="flex flex-col w-full space-y-4 h-full kanban-container"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 h-full kanban-container">
          {exampleStatuses.map((status) => (
            <KanbanBoard
              key={status.id}
              id={status.id}
              className="bg-card h-full flex flex-col"
            >
              <KanbanHeader name={t(status.id)} color={status.color} />
              <KanbanCards className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 kanban-card-container">
                {filteredTasks
                  .filter((task: Task) => task.status === status.id)
                  .map((task: Task, index: number) => (
                    <KanbanCard
                      key={task.id}
                      id={task.id.toString()}
                      name={task.name}
                      parent={status.id}
                      index={index}
                      className="cursor-pointer bg-accent mb-2"
                      onClick={() => handleTaskClick(task)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">{task.name}</div>
                        {task.priority && (
                          <div className={`w-2 h-2 rounded-full ${
                            task.priority === 'urgent' ? 'bg-red-500' :
                            task.priority === 'high' ? 'bg-orange-500' :
                            task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`} />
                        )}
                      </div>

                      {task.description && (
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {task.description}
                        </div>
                      )}

                      {(task.startAt || task.endAt) && (
                        <div className="text-xs text-muted-foreground mt-2">
                          {task.startAt && shortDateFormatter.format(task.startAt)} -{" "}
                          {task.endAt && dateFormatter.format(task.endAt)}
                        </div>
                      )}

                      {task.tags && task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {task.tags.slice(0, 2).map((tag, i) => (
                            <span key={i} className="inline-block px-1 py-0.5 text-xs bg-primary/10 text-primary rounded">
                              {tag}
                            </span>
                          ))}
                          {task.tags.length > 2 && (
                            <span className="text-xs text-muted-foreground">+{task.tags.length - 2}</span>
                          )}
                        </div>
                      )}

                      <div className="text-xs text-muted-foreground mt-1">
                        Project: {task.projectId} | Phase: {task.phaseId}
                      </div>
                    </KanbanCard>
                  ))}
              </KanbanCards>
            </KanbanBoard>
          ))}
        </div>
      </KanbanProvider>

      {/* Task Modal */}
      {selectedTask && (
        <TaskModal
          task={{
            id: selectedTask.id.toString(),
            title: selectedTask.name,
            description: selectedTask.description || '',
            status: selectedTask.status,
            priority: selectedTask.priority || 'medium',
            assignee: selectedTask.assigneeId ? {
              id: selectedTask.assigneeId.toString(),
              name: sampleProjects.flatMap(p => p.contributors).find(c => c.id === selectedTask.assigneeId)?.name || 'Unknown',
              avatar: sampleProjects.flatMap(p => p.contributors).find(c => c.id === selectedTask.assigneeId)?.image
            } : undefined,
            dueDate: selectedTask.endAt,
            tags: selectedTask.tags || [],
            project: {
              id: selectedTask.projectId.toString(),
              name: currentProject?.name || 'Unknown Project'
            },
            subtasks: selectedTask.subtasks || [],
            checklist: selectedTask.checklist || [],
            estimatedHours: selectedTask.estimatedHours,
            actualHours: selectedTask.actualHours
          }}
          isOpen={isTaskModalOpen}
          onClose={() => {
            setIsTaskModalOpen(false);
            setSelectedTask(null);
          }}
          onUpdate={(updates) => handleTaskUpdate(selectedTask.id, updates)}
          onDelete={() => handleTaskDelete(selectedTask.id)}
        />
      )}
    </div>
  );
}
