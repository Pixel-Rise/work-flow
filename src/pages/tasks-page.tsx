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
import { ShoppingCart, School, Dumbbell } from "lucide-react";
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

    setFilteredTasks(filtered);
    setTasks(filtered);
  }, [projectId, phaseId]);

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
    setFilteredTasks(updatedTasks);
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
                    >
                    
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">{task.name}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {shortDateFormatter.format(task.startAt)} -{" "}
                        {dateFormatter.format(task.endAt)}
                      </div>
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
    </div>
  );
}
