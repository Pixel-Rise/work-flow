import { useState } from "react";
import { useTranslation } from "@/components/language-provider";
import { usePageTitle } from "@/components/title-provider";
import { Link } from "react-router-dom";
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
  Upload,
  FileText,
  Download,
  X,
} from "lucide-react";
import { FloatingActionButton } from "@/components/ui/floating-action-button";

interface Phase {
  id: number;
  title: string;
  description: string;
}

interface Document {
  id: number;
  name: string;
  size: string;
  uploadDate: string;
  url: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  icon?: React.ElementType;
  phases: Phase[];
  documents: Document[];
}

const initialProjects: Project[] = [
  {
    id: 1,
    name: "SalesFlow",
    description: "Customer relationship management system",
    icon: ShoppingCart,
    phases: [{ id: 1, title: "Design", description: "Figma and UI planning" }],
    documents: [
      { id: 1, name: "Project Requirements.pdf", size: "2.3 MB", uploadDate: "2025-06-20", url: "#" },
      { id: 2, name: "Design Mockups.fig", size: "15.7 MB", uploadDate: "2025-06-22", url: "#" },
    ],
  },
  {
    id: 2,
    name: "Digital School",
    description: "Education management system",
    icon: School,
    phases: [{ id: 1, title: "Analysis", description: "Requirement gathering" }],
    documents: [
      { id: 3, name: "User Stories.docx", size: "1.2 MB", uploadDate: "2025-06-21", url: "#" },
    ],
  },
  {
    id: 3,
    name: "Legenda Big Fit",
    description: "Fitness tracking mobile app",
    icon: Dumbbell,
    phases: [{ id: 1, title: "Research", description: "User persona and pain points" }],
    documents: [],
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
  const [showAddPhaseForm, setShowAddPhaseForm] = useState<{ [key: number]: boolean }>({});

  const t = useTranslation();
  
  // Set page title
  usePageTitle(t("projects"));

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
    setShowAddPhaseForm(prev => ({ ...prev, [projectId]: false }));
  };

  const cancelAddPhase = (projectId: number) => {
    setNewPhaseTitle("");
    setNewPhaseDescription("");
    setShowAddPhaseForm(prev => ({ ...prev, [projectId]: false }));
  };

  const showAddForm = (projectId: number) => {
    setShowAddPhaseForm(prev => ({ ...prev, [projectId]: true }));
  };

  const handleFileUpload = (projectId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const newDocument: Document = {
        id: Date.now() + Math.random(),
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
        url: URL.createObjectURL(file),
      };

      setProjects((prev) =>
        prev.map((proj) =>
          proj.id === projectId
            ? { ...proj, documents: [...proj.documents, newDocument] }
            : proj
        )
      );
    });
  };

  const deleteDocument = (projectId: number, documentId: number) => {
    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === projectId
          ? { ...proj, documents: proj.documents.filter(doc => doc.id !== documentId) }
          : proj
      )
    );
  };

  const downloadDocument = (document: Document) => {
    const link = window.document.createElement('a');
    link.href = document.url;
    link.download = document.name;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  return (
    <div className="space-y-3">
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
                      <div key={phase.id} className="border p-3 rounded-md">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="font-semibold">{phase.title}</div>
                            <div className="text-sm text-muted-foreground">{phase.description}</div>
                          </div>
                          <Link to={`/tasks/${project.id}?phase=${phase.id}`}>
                            <Button size="sm" variant="outline">
                              {t("tasks")}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                    
                    {!showAddPhaseForm[project.id] ? (
                      <Button 
                        variant="outline" 
                        className="w-full mt-4"
                        onClick={() => showAddForm(project.id)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {t("add_phase")}
                      </Button>
                    ) : (
                      <div className="space-y-3 mt-4 p-4 border rounded-lg bg-muted/20">
                        <div className="flex gap-2">
                          <Input
                            placeholder={t("new_phase_title")}
                            value={newPhaseTitle}
                            onChange={(e) => setNewPhaseTitle(e.target.value)}
                          />
                          <Button onClick={() => addPhase(project.id)}>
                            <Plus className="w-4 h-4 mr-1" />
                            {t("add")}
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => cancelAddPhase(project.id)}
                          >
                            {t("cancel")}
                          </Button>
                        </div>
                        <Textarea
                          placeholder={t("phase_description")}
                          value={newPhaseDescription}
                          onChange={(e) => setNewPhaseDescription(e.target.value)}
                        />
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="documents">
                  <AccordionTrigger>{t("documents")}</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    {/* Upload Section */}
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground/50 mb-2" />
                        <label htmlFor={`file-upload-${project.id}`} className="cursor-pointer">
                          <Button variant="outline" className="w-full sm:w-auto">
                            <Upload className="w-4 h-4 mr-2" />
                            {t("upload_files")}
                          </Button>
                        </label>
                        <input
                          id={`file-upload-${project.id}`}
                          type="file"
                          multiple
                          className="hidden"
                          onChange={(e) => handleFileUpload(project.id, e)}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, ZIP
                        </p>
                      </div>
                    </div>

                    {/* Documents List */}
                    {project.documents.length > 0 ? (
                      <div className="space-y-2">
                        <div className="hidden sm:grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground border-b pb-2">
                          <div className="col-span-5">{t("file_name")}</div>
                          <div className="col-span-2">{t("file_size")}</div>
                          <div className="col-span-3">{t("upload_date")}</div>
                          <div className="col-span-2">{t("actions")}</div>
                        </div>
                        {project.documents.map((document) => (
                          <div
                            key={document.id}
                            className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                              <div className="sm:col-span-5 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <span className="text-sm font-medium truncate" title={document.name}>
                                  {document.name}
                                </span>
                              </div>
                              <div className="sm:col-span-2 text-xs sm:text-sm text-muted-foreground">
                                <span className="sm:hidden font-medium">{t("file_size")}: </span>
                                {document.size}
                              </div>
                              <div className="sm:col-span-3 text-xs sm:text-sm text-muted-foreground">
                                <span className="sm:hidden font-medium">{t("upload_date")}: </span>
                                {document.uploadDate}
                              </div>
                              <div className="sm:col-span-2 flex gap-1 justify-start sm:justify-end">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => downloadDocument(document)}
                                >
                                  <Download className="w-3 h-3 mr-1" />
                                  <span className="hidden sm:inline">{t("download")}</span>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => deleteDocument(project.id, document.id)}
                                >
                                  <X className="w-3 h-3 mr-1" />
                                  <span className="hidden sm:inline">{t("delete")}</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="mx-auto h-12 w-12 mb-2 opacity-50" />
                        <p>{t("no_documents")}</p>
                      </div>
                    )}
                  </AccordionContent>
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
          <DrawerFooter>
            <div className="flex flex-row justify-center items-center gap-2">
            <DrawerClose asChild>
              <Button variant="outline">{t("cancel")}</Button>
            </DrawerClose>
            <Button variant={"destructive"}  onClick={confirmDelete}>
              {t("delete")}
            </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <FloatingActionButton className="h-12 w-12 border">
        <Plus size={65} />
      </FloatingActionButton>
    </div>
  );
}
