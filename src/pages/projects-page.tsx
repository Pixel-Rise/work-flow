import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Trash2,
  Pencil,
  MoreVertical,
  Plus,
  Dumbbell,
  ShoppingCart,
  School,
} from "lucide-react";
import { useTranslation } from "@/components/language-provider";

interface Phase {
  id: number;
  title: string;
  description: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  icon?: React.ElementType;
  phases: Phase[];
}

const initialProjects: Project[] = [
  {
    id: 1,
    name: "SalesFlow",
    description: "Customer relationship management system",
    icon: ShoppingCart,
    phases: [{ id: 1, title: "Design", description: "Figma and UI planning" }],
  },
  {
    id: 2,
    name: "Digital School",
    description: "Education management system",
    icon: School,
    phases: [{ id: 1, title: "Analysis", description: "Requirement gathering" }],
  },
  {
    id: 3,
    name: "Legenda Big Fit",
    description: "Fitness tracking mobile app",
    icon: Dumbbell,
    phases: [{ id: 1, title: "Research", description: "User persona and pain points" }],
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDrawerOpen, setDeleteDrawerOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [newPhaseTitle, setNewPhaseTitle] = useState("");
  const [newPhaseDescription, setNewPhaseDescription] = useState("");

  const t = useTranslation();

  const confirmDelete = () => {
    if (pendingDeleteId !== null) {
      setProjects(projects.filter((p) => p.id !== pendingDeleteId));
      setPendingDeleteId(null);
      setDeleteDrawerOpen(false);
    }
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setOpenDialog(true);
  };

  const addPhase = (projectId: number) => {
    if (!newPhaseTitle.trim()) return;
    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === projectId
          ? {
              ...proj,
              phases: [
                ...proj.phases,
                {
                  id: Date.now(),
                  title: newPhaseTitle,
                  description: newPhaseDescription,
                },
              ],
            }
          : proj
      )
    );
    setNewPhaseTitle("");
    setNewPhaseDescription("");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t("projects")}</h1>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> {t("add_project")}
        </Button>
      </div>

      {projects.map((project) => {
        const Icon = project.icon;
        return (
          <Card key={project.id}>
            <CardHeader className="flex flex-row justify-between items-center">
              <div className="flex items-center gap-3">
                {Icon && <Icon className="w-6 h-6 text-muted-foreground" />}
                <div>
                  <CardTitle>{project.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </div>
              </div>

              {/* ... menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEdit(project)}>
                    <Pencil className="w-4 h-4 mr-2" /> {t("edit")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => {
                      setPendingDeleteId(project.id);
                      setDeleteDrawerOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> {t("delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>

            <CardContent>
              <Accordion type="multiple">
                <AccordionItem value="phases">
                  <AccordionTrigger>{t("phases")}</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    {project.phases.map((phase) => (
                      <div key={phase.id} className="border p-2 rounded-md">
                        <div className="font-semibold">{phase.title}</div>
                        <div className="text-sm text-muted-foreground">{phase.description}</div>
                      </div>
                    ))}
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder={t("new_phase_title")}
                        value={newPhaseTitle}
                        onChange={(e) => setNewPhaseTitle(e.target.value)}
                      />
                      <Button onClick={() => addPhase(project.id)}>
                        <Plus className="w-4 h-4 mr-1" />
                        {t("add_phase")}
                      </Button>
                    </div>
                    <Textarea
                      placeholder={t("phase_description")}
                      value={newPhaseDescription}
                      onChange={(e) => setNewPhaseDescription(e.target.value)}
                      className="mt-2"
                    />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="documents">
                  <AccordionTrigger>{t("documents")}</AccordionTrigger>
                  <AccordionContent>{t("no_documents")}</AccordionContent>
                </AccordionItem>
        
              </Accordion>
            </CardContent>
          </Card>
        );
      })}

      {/* Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("edit_project")}</DialogTitle>
            <DialogDescription>{t("edit_project_description")}</DialogDescription>
          </DialogHeader>
          <Input
            defaultValue={selectedProject?.name}
            className="mb-2"
            onChange={(e) =>
              setSelectedProject((p) => p && { ...p, name: e.target.value })
            }
          />
          <Textarea
            defaultValue={selectedProject?.description}
            className="mb-4"
            onChange={(e) =>
              setSelectedProject((p) => p && { ...p, description: e.target.value })
            }
          />
          <DialogFooter>
            <Button type="submit" onClick={() => setOpenDialog(false)}>
              {t("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Drawer */}
      <Drawer open={deleteDrawerOpen} onOpenChange={setDeleteDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{t("are_you_sure")}</DrawerTitle>
            <DrawerDescription>{t("delete_project_confirmation")}</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="flex justify-center gap-2">
            <DrawerClose asChild>
              <Button variant="outline">{t("cancel")}</Button>
            </DrawerClose>
            <Button variant="destructive" onClick={confirmDelete}>
              {t("delete")}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
