import { useState, useEffect } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  X,
  Save,
  RotateCcw
} from "lucide-react";
import { ProjectFormData } from "./create-project-modal";

interface EditProjectFormProps {
  project: ProjectFormData & { id: number };
  onSaveProject: (project: ProjectFormData & { id: number }) => void;
  onCancel?: () => void;
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

export function EditProjectForm({ project, onSaveProject, onCancel }: EditProjectFormProps) {
  const t = useTranslation();
  const [formData, setFormData] = useState<ProjectFormData & { id: number }>(project);
  const [originalData] = useState<ProjectFormData & { id: number }>(project);
  const [newTag, setNewTag] = useState("");
  const [newMember, setNewMember] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const isChanged = JSON.stringify(formData) !== JSON.stringify(originalData);
    setHasChanges(isChanged);
  }, [formData, originalData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onSaveProject(formData);
  };

  const handleReset = () => {
    setFormData(originalData);
    setNewTag("");
    setNewMember("");
    setHasChanges(false);
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconComponent className="w-5 h-5" />
          {t("edit_project")}
          {hasChanges && (
            <Badge variant="secondary" className="ml-auto">
              {t("unsaved_changes")}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
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
              <Button type="button" onClick={addTag} variant="outline" size="sm">
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
              <Button type="button" onClick={addTeamMember} variant="outline" size="sm">
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

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              type="submit"
              disabled={!formData.name.trim() || !hasChanges}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {t("save_changes")}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={!hasChanges}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              {t("reset")}
            </Button>

            {onCancel && (
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                className="ml-auto"
              >
                {t("cancel")}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}