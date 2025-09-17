import { useState, useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslation } from "@/hooks/use-translation";
import {
  Tag,
  X,
  Plus,
  Hash,
  ChevronDown,
  Check,
  CheckCircle,
  Palette,
  Star,
  AlertCircle,
  Code,
  Bug,
  Lightbulb,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TagOption {
  id: string;
  label: string;
  color?: string;
  category?: string;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
}

interface TaskTagsInputProps {
  value: string[];
  onValueChange: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  maxTags?: number;
  variant?: "default" | "compact" | "minimal";
  size?: "sm" | "md" | "lg";
  allowCustomTags?: boolean;
  predefinedTags?: TagOption[];
  tagColors?: Record<string, string>;
  className?: string;
}

const defaultPredefinedTags: TagOption[] = [
  {
    id: "frontend",
    label: "Frontend",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    category: "Development",
    icon: Code,
    description: "User interface development"
  },
  {
    id: "backend",
    label: "Backend",
    color: "bg-green-100 text-green-800 border-green-200",
    category: "Development",
    icon: Code,
    description: "Server-side development"
  },
  {
    id: "bug",
    label: "Bug",
    color: "bg-red-100 text-red-800 border-red-200",
    category: "Issue",
    icon: Bug,
    description: "Bug fix or error resolution"
  },
  {
    id: "feature",
    label: "Feature",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    category: "Enhancement",
    icon: Lightbulb,
    description: "New feature development"
  },
  {
    id: "urgent",
    label: "Urgent",
    color: "bg-red-100 text-red-800 border-red-200",
    category: "Priority",
    icon: Zap,
    description: "Requires immediate attention"
  },
  {
    id: "documentation",
    label: "Documentation",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    category: "Content",
    icon: Star,
    description: "Documentation updates"
  },
  {
    id: "testing",
    label: "Testing",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    category: "QA",
    icon: CheckCircle,
    description: "Testing and quality assurance"
  },
  {
    id: "design",
    label: "Design",
    color: "bg-pink-100 text-pink-800 border-pink-200",
    category: "UI/UX",
    icon: Palette,
    description: "Design and user experience"
  }
];

const sizeConfig = {
  sm: {
    input: "h-8 px-2 text-xs",
    badge: "text-xs px-1.5 py-0.5",
    icon: "w-3 h-3"
  },
  md: {
    input: "h-9 px-3 text-sm",
    badge: "text-sm px-2 py-1",
    icon: "w-4 h-4"
  },
  lg: {
    input: "h-10 px-4 text-base",
    badge: "text-base px-3 py-1.5",
    icon: "w-5 h-5"
  }
};

export function TaskTagsInput({
  value = [],
  onValueChange,
  placeholder,
  disabled = false,
  maxTags = 10,
  variant = "default",
  size = "md",
  allowCustomTags = true,
  predefinedTags = defaultPredefinedTags,
  tagColors,
  className
}: TaskTagsInputProps) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const sizeStyles = sizeConfig[size];

  const getTagColor = (tag: string) => {
    // Check if tag is predefined and has custom color
    const predefined = predefinedTags.find(t => t.id === tag || t.label === tag);
    if (predefined?.color) return predefined.color;

    // Check custom colors
    if (tagColors?.[tag]) return tagColors[tag];

    // Default colors based on tag content
    const hash = tag.split("").reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);

    const colors = [
      "bg-blue-100 text-blue-800 border-blue-200",
      "bg-green-100 text-green-800 border-green-200",
      "bg-purple-100 text-purple-800 border-purple-200",
      "bg-orange-100 text-orange-800 border-orange-200",
      "bg-pink-100 text-pink-800 border-pink-200",
      "bg-indigo-100 text-indigo-800 border-indigo-200",
      "bg-teal-100 text-teal-800 border-teal-200",
      "bg-cyan-100 text-cyan-800 border-cyan-200"
    ];

    return colors[Math.abs(hash) % colors.length];
  };

  const addTag = (tagValue: string) => {
    const trimmedValue = tagValue.trim().toLowerCase();
    if (!trimmedValue || value.includes(trimmedValue) || value.length >= maxTags) {
      return;
    }

    onValueChange([...value, trimmedValue]);
    setInputValue("");
  };

  const removeTag = (tagToRemove: string) => {
    onValueChange(value.filter(tag => tag !== tagToRemove));
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (allowCustomTags && inputValue.trim()) {
        addTag(inputValue);
      }
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  const handleTagSelect = (tagId: string) => {
    const predefinedTag = predefinedTags.find(t => t.id === tagId);
    const tagValue = predefinedTag?.label.toLowerCase() || tagId;

    if (value.includes(tagValue)) {
      removeTag(tagValue);
    } else {
      addTag(tagValue);
    }
  };

  // Group predefined tags by category
  const groupedTags = predefinedTags.reduce((acc, tag) => {
    const category = tag.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(tag);
    return acc;
  }, {} as Record<string, TagOption[]>);

  // Minimal variant
  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center gap-1 flex-wrap", className)}>
        {value.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className={cn(
              "gap-1 border",
              getTagColor(tag),
              sizeStyles.badge
            )}
          >
            <Hash className={sizeStyles.icon} />
            {tag}
            {!disabled && (
              <button
                onClick={() => removeTag(tag)}
                className="hover:text-destructive"
              >
                <X className="w-2 h-2" />
              </button>
            )}
          </Badge>
        ))}

        {!disabled && value.length < maxTags && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn("gap-1 h-6 px-2 text-xs border-dashed border")}
              >
                <Plus className="w-3 h-3" />
                {t("add_tag")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
              <TagSelectorContent
                predefinedTags={predefinedTags}
                groupedTags={groupedTags}
                selectedTags={value}
                onTagSelect={handleTagSelect}
                allowCustomTags={allowCustomTags}
                onCustomTagAdd={addTag}
                t={t}
              />
            </PopoverContent>
          </Popover>
        )}
      </div>
    );
  }

  // Compact variant
  if (variant === "compact") {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "justify-between",
              sizeStyles.input,
              className
            )}
          >
            {value.length > 0 ? (
              <div className="flex items-center gap-1">
                <Tag className={sizeStyles.icon} />
                <span>{value.length} {t("tags")}</span>
              </div>
            ) : (
              <span className="text-muted-foreground">
                {placeholder || t("add_tags")}
              </span>
            )}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0">
          <TagSelectorContent
            predefinedTags={predefinedTags}
            groupedTags={groupedTags}
            selectedTags={value}
            onTagSelect={handleTagSelect}
            allowCustomTags={allowCustomTags}
            onCustomTagAdd={addTag}
            t={t}
          />
        </PopoverContent>
      </Popover>
    );
  }

  // Default variant
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap gap-2 min-h-8">
        {value.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className={cn(
              "gap-1 border",
              getTagColor(tag),
              sizeStyles.badge
            )}
          >
            <Hash className={sizeStyles.icon} />
            {tag}
            {!disabled && (
              <button
                onClick={() => removeTag(tag)}
                className="hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </Badge>
        ))}
      </div>

      {!disabled && value.length < maxTags && (
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder={placeholder || t("type_tag_and_press_enter")}
              disabled={disabled}
              className={sizeStyles.input}
            />
            {allowCustomTags && inputValue && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Badge variant="outline" className="text-xs">
                  {t("press_enter")}
                </Badge>
              </div>
            )}
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn("gap-1", sizeStyles.input)}
              >
                <Tag className={sizeStyles.icon} />
                {t("browse")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
              <TagSelectorContent
                predefinedTags={predefinedTags}
                groupedTags={groupedTags}
                selectedTags={value}
                onTagSelect={handleTagSelect}
                allowCustomTags={allowCustomTags}
                onCustomTagAdd={addTag}
                t={t}
              />
            </PopoverContent>
          </Popover>
        </div>
      )}

      {value.length >= maxTags && (
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {t("max_tags_reached", { max: maxTags })}
        </div>
      )}
    </div>
  );
}

// Internal tag selector content
interface TagSelectorContentProps {
  predefinedTags: TagOption[];
  groupedTags: Record<string, TagOption[]>;
  selectedTags: string[];
  onTagSelect: (tagId: string) => void;
  allowCustomTags: boolean;
  onCustomTagAdd: (tag: string) => void;
  t: (key: string) => string;
}

function TagSelectorContent({
  predefinedTags,
  groupedTags,
  selectedTags,
  onTagSelect,
  allowCustomTags,
  onCustomTagAdd,
  t
}: TagSelectorContentProps) {
  const [customInput, setCustomInput] = useState("");

  const handleCustomAdd = () => {
    if (customInput.trim()) {
      onCustomTagAdd(customInput.trim());
      setCustomInput("");
    }
  };

  return (
    <Command>
      <CommandInput
        placeholder={t("search_tags")}
        value={customInput}
        onValueChange={setCustomInput}
      />
      <CommandList>
        <CommandEmpty>
          {allowCustomTags && customInput.trim() ? (
            <div className="p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCustomAdd}
                className="w-full justify-start gap-2"
              >
                <Plus className="w-4 h-4" />
                {t("create_tag")}: "{customInput.trim()}"
              </Button>
            </div>
          ) : (
            t("no_tags_found")
          )}
        </CommandEmpty>

        {/* Popular/Recent Tags */}
        <CommandGroup heading={t("popular_tags")}>
          {predefinedTags.slice(0, 6).map((tag) => {
            const isSelected = selectedTags.includes(tag.label.toLowerCase());
            const Icon = tag.icon || Tag;

            return (
              <CommandItem
                key={tag.id}
                value={`${tag.label} ${tag.description || ""}`}
                onSelect={() => onTagSelect(tag.id)}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={cn("p-1.5 rounded", tag.color)}>
                    <Icon className="w-3 h-3" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{tag.label}</div>
                    {tag.description && (
                      <div className="text-xs text-muted-foreground">
                        {tag.description}
                      </div>
                    )}
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4" />}
              </CommandItem>
            );
          })}
        </CommandGroup>

        {/* Grouped Tags */}
        {Object.entries(groupedTags).map(([category, tags]) => (
          <CommandGroup key={category} heading={category}>
            {tags.map((tag) => {
              const isSelected = selectedTags.includes(tag.label.toLowerCase());
              const Icon = tag.icon || Tag;

              return (
                <CommandItem
                  key={tag.id}
                  value={`${tag.label} ${tag.description || ""}`}
                  onSelect={() => onTagSelect(tag.id)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span>{tag.label}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4" />}
                </CommandItem>
              );
            })}
          </CommandGroup>
        ))}
      </CommandList>
    </Command>
  );
}

// Utility function to get tag suggestions
export function getTagSuggestions(existingTags: string[], allTags: TagOption[]): TagOption[] {
  return allTags.filter(tag =>
    !existingTags.some(existing =>
      existing.toLowerCase() === tag.label.toLowerCase()
    )
  );
}

// Display component for read-only tag list
interface TagsDisplayProps {
  tags: string[];
  maxShow?: number;
  size?: "sm" | "md" | "lg";
  tagColors?: Record<string, string>;
  className?: string;
}

export function TagsDisplay({
  tags,
  maxShow = 5,
  size = "sm",
  tagColors,
  className
}: TagsDisplayProps) {
  const sizeStyles = sizeConfig[size];
  const visibleTags = tags.slice(0, maxShow);
  const hiddenCount = tags.length - maxShow;

  const getTagColor = (tag: string) => {
    if (tagColors?.[tag]) return tagColors[tag];

    const hash = tag.split("").reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);

    const colors = [
      "bg-blue-100 text-blue-800 border-blue-200",
      "bg-green-100 text-green-800 border-green-200",
      "bg-purple-100 text-purple-800 border-purple-200",
      "bg-orange-100 text-orange-800 border-orange-200",
    ];

    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className={cn("flex items-center gap-1 flex-wrap", className)}>
      {visibleTags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className={cn(
            "gap-1 border",
            getTagColor(tag),
            sizeStyles.badge
          )}
        >
          <Hash className={sizeStyles.icon} />
          {tag}
        </Badge>
      ))}

      {hiddenCount > 0 && (
        <Badge variant="outline" className={sizeStyles.badge}>
          +{hiddenCount}
        </Badge>
      )}
    </div>
  );
}