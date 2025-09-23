import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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
  CheckSquare,
  Square,
  GripVertical,
  Copy,
  ChevronUp,
  ChevronDown,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChecklistItem {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  order: number;
}

interface TaskChecklistProps {
  items: ChecklistItem[];
  onItemAdd: (text: string) => void;
  onItemUpdate: (id: number, updates: Partial<ChecklistItem>) => void;
  onItemDelete: (id: number) => void;
  onItemToggle: (id: number, completed: boolean) => void;
  onItemsReorder?: (items: ChecklistItem[]) => void;
  canEdit?: boolean;
  showProgress?: boolean;
  variant?: "default" | "compact" | "minimal";
  title?: string;
  className?: string;
}

export function TaskChecklist({
  items,
  onItemAdd,
  onItemUpdate,
  onItemDelete,
  onItemToggle,
  onItemsReorder,
  canEdit = true,
  showProgress = true,
  variant = "default",
  title,
  className
}: TaskChecklistProps) {
  const t = useTranslation();
  const [newItemText, setNewItemText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Sort items by order and completion status
  const sortedItems = [...items].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1; // Completed items go to bottom
    }
    return a.order - b.order;
  });

  const handleAddItem = () => {
    if (!newItemText.trim()) return;
    onItemAdd(newItemText.trim());
    setNewItemText("");
  };

  const handleStartEdit = (item: ChecklistItem) => {
    setEditingId(item.id);
    setEditingText(item.text);
  };

  const handleSaveEdit = () => {
    if (editingId && editingText.trim()) {
      onItemUpdate(editingId, { text: editingText.trim() });
    }
    setEditingId(null);
    setEditingText("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const handleDuplicateItem = (item: ChecklistItem) => {
    onItemAdd(`${item.text} (${t("copy")})`);
  };

  const moveItem = (id: number, direction: "up" | "down") => {
    if (!onItemsReorder) return;

    const currentIndex = sortedItems.findIndex(item => item.id === id);
    if (currentIndex === -1) return;

    const newItems = [...sortedItems];
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    // Swap items
    [newItems[currentIndex], newItems[targetIndex]] = [newItems[targetIndex], newItems[currentIndex]];

    // Update order
    const reorderedItems = newItems.map((item, index) => ({
      ...item,
      order: index
    }));

    onItemsReorder(reorderedItems);
  };

  // Minimal variant - just checkboxes with text
  if (variant === "minimal") {
    return (
      <div className={cn("space-y-2", className)}>
        {sortedItems.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <button
              onClick={() => canEdit && onItemToggle(item.id, !item.completed)}
              disabled={!canEdit}
              className="flex-shrink-0"
            >
              {item.completed ? (
                <CheckSquare className="w-4 h-4 text-green-600" />
              ) : (
                <Square className="w-4 h-4 text-muted-foreground hover:text-primary" />
              )}
            </button>
            <span
              className={cn(
                "text-sm flex-1",
                item.completed && "line-through text-muted-foreground"
              )}
            >
              {item.text}
            </span>
          </div>
        ))}

        {canEdit && (
          <div className="flex gap-2 pt-2">
            <Input
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder={t("add_checklist_item")}
              onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
              className="h-8"
            />
            <Button onClick={handleAddItem} size="sm" variant="outline">
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
              <span className="text-muted-foreground">
                {title || t("checklist")} ({completedCount}/{totalCount})
              </span>
              <Badge variant="outline" className="text-xs">
                {Math.round(completionPercentage)}%
              </Badge>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        )}

        {/* Items List */}
        <div className="space-y-1">
          {sortedItems.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center gap-2 p-2 rounded hover:bg-muted/30 transition-colors group"
            >
              <button
                onClick={() => canEdit && onItemToggle(item.id, !item.completed)}
                disabled={!canEdit}
              >
                {item.completed ? (
                  <CheckSquare className="w-4 h-4 text-green-600" />
                ) : (
                  <Square className="w-4 h-4 text-muted-foreground hover:text-primary" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                {editingId === item.id ? (
                  <div className="flex gap-1">
                    <Input
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
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
                  <span
                    className={cn(
                      "text-sm truncate",
                      item.completed && "line-through text-muted-foreground"
                    )}
                  >
                    {item.text}
                  </span>
                )}
              </div>

              {canEdit && editingId !== item.id && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleStartEdit(item)}>
                        <Edit className="w-3 h-3 mr-2" />
                        {t("edit")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicateItem(item)}>
                        <Copy className="w-3 h-3 mr-2" />
                        {t("duplicate")}
                      </DropdownMenuItem>
                      {onItemsReorder && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => moveItem(item.id, "up")}
                            disabled={index === 0}
                          >
                            <ChevronUp className="w-3 h-3 mr-2" />
                            {t("move_up")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => moveItem(item.id, "down")}
                            disabled={index === sortedItems.length - 1}
                          >
                            <ChevronDown className="w-3 h-3 mr-2" />
                            {t("move_down")}
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onItemDelete(item.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-3 h-3 mr-2" />
                        {t("delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add New Item */}
        {canEdit && (
          <div className="flex gap-2">
            <Input
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder={t("add_checklist_item")}
              onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
              className="h-8"
            />
            <Button onClick={handleAddItem} size="sm" variant="outline">
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
            <CheckSquare className="w-4 h-4" />
            {title || t("checklist")} ({completedCount}/{totalCount})
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
        {/* Items List */}
        <div className="space-y-2">
          {sortedItems.map((item, index) => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors group"
            >
              {/* Drag Handle */}
              {canEdit && onItemsReorder && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                </div>
              )}

              {/* Checkbox */}
              <button
                onClick={() => canEdit && onItemToggle(item.id, !item.completed)}
                disabled={!canEdit}
                className="mt-0.5"
              >
                {item.completed ? (
                  <CheckSquare className="w-5 h-5 text-green-600" />
                ) : (
                  <Square className="w-5 h-5 text-muted-foreground hover:text-primary" />
                )}
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {editingId === item.id ? (
                  <div className="flex gap-2">
                    <Input
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
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
                  <div className="space-y-1">
                    <div
                      className={cn(
                        "text-sm font-medium",
                        item.completed && "line-through text-muted-foreground"
                      )}
                    >
                      {item.text}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t("created")} {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              {canEdit && editingId !== item.id && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleStartEdit(item)}>
                        <Edit className="w-4 h-4 mr-2" />
                        {t("edit")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicateItem(item)}>
                        <Copy className="w-4 h-4 mr-2" />
                        {t("duplicate")}
                      </DropdownMenuItem>
                      {onItemsReorder && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => moveItem(item.id, "up")}
                            disabled={index === 0}
                          >
                            <ChevronUp className="w-4 h-4 mr-2" />
                            {t("move_up")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => moveItem(item.id, "down")}
                            disabled={index === sortedItems.length - 1}
                          >
                            <ChevronDown className="w-4 h-4 mr-2" />
                            {t("move_down")}
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onItemDelete(item.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        {t("delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <CheckSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">{t("no_checklist_items")}</p>
            <p className="text-xs mt-1">{t("add_items_to_track_progress")}</p>
          </div>
        )}

        {/* Add New Item */}
        {canEdit && (
          <div className="flex gap-2">
            <Input
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder={t("add_checklist_item")}
              onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
            />
            <Button onClick={handleAddItem} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              {t("add")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Progress summary component for checklist
interface ChecklistProgressProps {
  items: ChecklistItem[];
  showDetails?: boolean;
  className?: string;
}

export function ChecklistProgress({
  items,
  showDetails = false,
  className
}: ChecklistProgressProps) {
  const t = useTranslation();
  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (totalCount === 0) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground flex items-center gap-1">
          <CheckSquare className="w-3 h-3" />
          {t("checklist")}
        </span>
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

// Quick completion status component
interface ChecklistStatusProps {
  items: ChecklistItem[];
  size?: "sm" | "md";
  className?: string;
}

export function ChecklistStatus({
  items,
  size = "sm",
  className
}: ChecklistStatusProps) {
  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;

  if (totalCount === 0) return null;

  const isComplete = completedCount === totalCount;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {isComplete ? (
        <CheckCircle2 className={cn("text-green-600", size === "sm" ? "w-3 h-3" : "w-4 h-4")} />
      ) : (
        <CheckSquare className={cn("text-muted-foreground", size === "sm" ? "w-3 h-3" : "w-4 h-4")} />
      )}
      <span className={cn("font-medium", size === "sm" ? "text-xs" : "text-sm")}>
        {completedCount}/{totalCount}
      </span>
    </div>
  );
}