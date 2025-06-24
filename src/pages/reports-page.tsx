import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ShoppingCart, School } from "lucide-react";
import me from "@/assets/avatar.jpg";
import { useTranslation } from "@/components/language-provider";

interface Task {
  id: number;
  title: string;
  status: "cancel" | "todo" | "in_progress" | "on_staging" | "done";
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
          { id: 1, title: "Wireframes", status: "done" },
          { id: 2, title: "Mockups", status: "done" },
        ],
      },
      {
        id: 2,
        title: "Development",
        progress: 50,
        tasks: [
          { id: 3, title: "Backend", status: "in_progress" },
          { id: 4, title: "Frontend", status: "todo" },
        ],
      },
    ],
    contributors: [
      { id: 1, name: "Azizbek", image: me, contribution: 60 },
      { id: 2, name: "Ali", contribution: 40 },
    ],
  },
  {
    id: 2,
    name: "Digital School",
    icon: School,
    phases: [
      {
        id: 1,
        title: "Planning",
        progress: 80,
        tasks: [
          { id: 1, title: "Requirements", status: "done" },
          { id: 2, title: "Research", status: "on_staging" },
        ],
      },
    ],
    contributors: [{ id: 3, name: "Bek", contribution: 100 }],
  },
];

export default function ReportsPage() {
  const t = useTranslation();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">{t("project_reports")}</h1>

      {sampleProjects.map((project) => {
        const allTasks = project.phases.flatMap((p) => p.tasks);
        const taskStats = {
          todo: allTasks.filter((t) => t.status === "todo").length,
          in_progress: allTasks.filter((t) => t.status === "in_progress")
            .length,
          done: allTasks.filter((t) => t.status === "done").length,
          on_staging: allTasks.filter((t) => t.status === "on_staging").length,
          cancel: allTasks.filter((t) => t.status === "cancel").length,
        };

        const overallProgress =
          project.phases.reduce((acc, phase) => acc + phase.progress, 0) /
          project.phases.length;

        const currentPhase = project.phases[0]?.title || t("no_phase");

        const taskSummary = [
          {
            name: t("cancel"),
            value: taskStats.cancel,
            borderColor: "border-red-400",
          },
          {
            name: t("to_do"),
            value: taskStats.todo,
            borderColor: "border-gray-400",
          },
          {
            name: t("in_progress"),
            value: taskStats.in_progress,
            borderColor: "border-blue-400",
          },
          {
            name: t("on_staging"),
            value: taskStats.on_staging,
            borderColor: "border-yellow-400",
          },
          {
            name: t("done"),
            value: taskStats.done,
            borderColor: "border-green-400",
          },
        ];

        const Icon = project.icon;

        return (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex items-center gap-3">
                {Icon && <Icon className="w-6 h-6 text-muted-foreground" />}
                <CardTitle className="text-xl">{project.name}</CardTitle>
                <p className="text-sm text-muted-foreground ml-auto">
                  {t("current_phase")}: {currentPhase}
                </p>
              </div>

              <Progress value={overallProgress} className="mt-2" />
              <p className="text-sm text-muted-foreground mt-1">
                {t("overall_progress")}: {Math.round(overallProgress)}%
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap justify-between gap-4">
                {taskSummary.map((status) => (
                  <div
                    key={status.name}
                    className={`flex-1 min-w-[120px] p-4 rounded-lg text-center shadow border-2 ${status.borderColor}`}
                  >
                    <p className="text-lg font-semibold text-muted-foreground">
                      {status.name}
                    </p>
                    <p className="text-3xl font-bold text-primary">
                      {status.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="relative">
                <h3 className="text-lg font-semibold mb-2">
                  {t("contributors")}
                </h3>
                <div className="flex gap-2 p-1">
                  {project.contributors.map((c) => (
                    <div
                      key={c.id}
                      className="flex flex-row items-center gap-2"
                    >
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src={c.image} alt={c.image} />
                        <AvatarFallback>{c.name[0]}</AvatarFallback>
                      </Avatar>
                      <p className=" mt-1 text-muted-foreground text-center">
                        {c.name}
                      </p>
                      <Badge className="ml-2">{c.contribution}%</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
