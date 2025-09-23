import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/use-language";
import {
  Briefcase,
  ShoppingCart,
  School,
  Dumbbell,
  Building2,
  Smartphone,
  Globe,
  Palette,
  Code,
  Database,
  Zap,
  Heart,
  X
} from "lucide-react";

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject: (project: ProjectFormData) => void;
}

export interface ProjectFormData {
  name: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  icon: string;
  tags: string[];
  estimatedDuration: string;
  startDate: string;
  endDate: string;
  teamMembers: string[];
}

const projectIcons = [
  { id: "briefcase", icon: Briefcase, label: "Business" },
  { id: "shopping-cart", icon: ShoppingCart, label: "E-commerce" },
  { id: "school", icon: School, label: "Education" },
  { id: "dumbbell", icon: Dumbbell, label: "Fitness" },
  { id: "building", icon: Building2, label: "Construction" },
  { id: "smartphone", icon: Smartphone, label: "Mobile App" },
  { id: "globe", icon: Globe, label: "Web" },
  { id: "palette", icon: Palette, label: "Design" },
  { id: "code", icon: Code, label: "Development" },
  { id: "database", icon: Database, label: "Data" },
  { id: "zap", icon: Zap, label: "Automation" },
  { id: "heart", icon: Heart, label: "Healthcare" },
];

const projectCategories = [
  "web_development",
  "mobile_app",
  "design",
  "marketing",
  "data_analysis",
  "automation",
  "research",
  "other"
];

const priorityColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800"
};

export function CreateProjectModal({ open, onOpenChange, onCreateProject }: CreateProjectModalProps) {
  const t = useTranslation();
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    description: "",
    category: "",
    priority: "medium",
    icon: "briefcase",
    tags: [],
    estimatedDuration: "",
    startDate: "",
    endDate: "",
    teamMembers: []
  });
  const [newTag, setNewTag] = useState("");
  const [newMember, setNewMember] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onCreateProject(formData);
    handleReset();
    onOpenChange(false);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      priority: "medium",
      icon: "briefcase",
      tags: [],
      estimatedDuration: "",
      startDate: "",
      endDate: "",
      teamMembers: []
    });
    setNewTag("");
    setNewMember("");
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addTeamMember = () => {
    if (newMember.trim() && !formData.teamMembers.includes(newMember.trim())) {
      setFormData(prev => ({
        ...prev,
        teamMembers: [...prev.teamMembers, newMember.trim()]
      }));
      setNewMember("");
    }
  };

  const removeTeamMember = (memberToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter(member => member !== memberToRemove)
    }));
  };

  const selectedIcon = projectIcons.find(icon => icon.id === formData.icon);
  const IconComponent = selectedIcon?.icon || Briefcase;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconComponent className="w-5 h-5" />
            {t("create_new_project")}
          </DialogTitle>
          <DialogDescription>
            {t("create_project_description")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="name">{t("project_name")} *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder={t("enter_project_name")}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">{t("description")}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder={t("describe_your_project")}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-2">
              <Label>{t("category")}</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("select_category")} />
                </SelectTrigger>
                <SelectContent>
                  {projectCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {t(category)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label>{t("priority")}</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: "low" | "medium" | "high" | "urgent") =>
                  setFormData(prev => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <Badge className={priorityColors.low}>{t("low")}</Badge>
                  </SelectItem>
                  <SelectItem value="medium">
                    <Badge className={priorityColors.medium}>{t("medium")}</Badge>
                  </SelectItem>
                  <SelectItem value="high">
                    <Badge className={priorityColors.high}>{t("high")}</Badge>
                  </SelectItem>
                  <SelectItem value="urgent">
                    <Badge className={priorityColors.urgent}>{t("urgent")}</Badge>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Project Icon */}
          <div className="space-y-2">
            <Label>{t("project_icon")}</Label>
            <div className="grid grid-cols-6 gap-2">
              {projectIcons.map((iconItem) => {
                const Icon = iconItem.icon;
                return (
                  <button
                    key={iconItem.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, icon: iconItem.id }))}
                    className={`
                      p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1
                      ${formData.icon === iconItem.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs">{iconItem.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="startDate">{t("start_date")}</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label htmlFor="endDate">{t("end_date")}</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>{t("tags")}</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder={t("add_tag")}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline">
                {t("add")}
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Team Members */}
          <div className="space-y-2">
            <Label>{t("team_members")}</Label>
            <div className="flex gap-2">
              <Input
                value={newMember}
                onChange={(e) => setNewMember(e.target.value)}
                placeholder={t("add_team_member")}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTeamMember())}
              />
              <Button type="button" onClick={addTeamMember} variant="outline">
                {t("add")}
              </Button>
            </div>
            {formData.teamMembers.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.teamMembers.map((member) => (
                  <Badge key={member} variant="outline" className="gap-1">
                    {member}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeTeamMember(member)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("cancel")}
            </Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              {t("reset")}
            </Button>
            <Button type="submit" disabled={!formData.name.trim()}>
              {t("create_project")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}