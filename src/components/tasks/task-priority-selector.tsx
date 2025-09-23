import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/hooks/use-language";
import { Flag, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

interface TaskPrioritySelectorProps {
  value?: TaskPriority;
  onValueChange: (priority: TaskPriority) => void;
  placeholder?: string;
  disabled?: boolean;
  variant?: "default" | "badge" | "compact";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

const priorityConfig: Record<TaskPriority, {
  label: string;
  color: string;
  bgColor: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  weight: number;
}> = {
  low: {
    label: "low",
    color: "text-green-700",
    bgColor: "bg-green-100 border-green-200",
    icon: Flag,
    description: "low_priority_desc",
    weight: 1
  },
  medium: {
    label: "medium",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100 border-yellow-200",
    icon: Flag,
    description: "medium_priority_desc",
    weight: 2
  },
  high: {
    label: "high",
    color: "text-orange-700",
    bgColor: "bg-orange-100 border-orange-200",
    icon: Flag,
    description: "high_priority_desc",
    weight: 3
  },
  urgent: {
    label: "urgent",
    color: "text-red-700",
    bgColor: "bg-red-100 border-red-200",
    icon: Flag,
    description: "urgent_priority_desc",
    weight: 4
  }
};

const sizeConfig = {
  sm: {
    trigger: "h-8 px-2 text-xs",
    badge: "text-xs px-1.5 py-0.5",
    icon: "w-3 h-3"
  },
  md: {
    trigger: "h-9 px-3 text-sm",
    badge: "text-sm px-2 py-1",
    icon: "w-4 h-4"
  },
  lg: {
    trigger: "h-10 px-4 text-base",
    badge: "text-base px-3 py-1.5",
    icon: "w-5 h-5"
  }
};

export function TaskPrioritySelector({
  value,
  onValueChange,
  placeholder,
  disabled = false,
  variant = "default",
  size = "md",
  showIcon = true,
  className
}: TaskPrioritySelectorProps) {
  const t = useTranslation();
  const [open, setOpen] = useState(false);

  const selectedPriority = value ? priorityConfig[value] : null;
  const sizeStyles = sizeConfig[size];

  if (variant === "badge" && selectedPriority) {
    const Icon = selectedPriority.icon;

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "justify-between border",
              selectedPriority.bgColor,
              selectedPriority.color,
              sizeStyles.badge,
              className
            )}
          >
            <div className="flex items-center gap-1">
              {showIcon && <Icon className={sizeStyles.icon} />}
              <span>{t(selectedPriority.label)}</span>
            </div>
            <ChevronDown className="w-3 h-3 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-0">
          <Command>
            <CommandInput placeholder={t("search_priority")} />
            <CommandList>
              <CommandEmpty>{t("no_priority_found")}</CommandEmpty>
              <CommandGroup>
                {Object.entries(priorityConfig)
                  .sort(([, a], [, b]) => b.weight - a.weight) // Sort by weight (urgent first)
                  .map(([priority, config]) => {
                    const Icon = config.icon;
                    const isSelected = value === priority;

                    return (
                      <CommandItem
                        key={priority}
                        value={priority}
                        onSelect={() => {
                          onValueChange(priority as TaskPriority);
                          setOpen(false);
                        }}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <Icon className={cn("w-4 h-4", config.color)} />
                          <div className="flex-1">
                            <div className="font-medium">{t(config.label)}</div>
                            <div className="text-xs text-muted-foreground">
                              {t(config.description)}
                            </div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4" />}
                      </CommandItem>
                    );
                  })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }

  if (variant === "compact") {
    return (
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger className={cn(sizeStyles.trigger, className)}>
          <SelectValue
            placeholder={placeholder || t("select_priority")}
          >
            {selectedPriority && (
              <div className="flex items-center gap-1">
                {showIcon && <Flag className={cn(sizeStyles.icon, selectedPriority.color)} />}
                <span>{t(selectedPriority.label)}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(priorityConfig)
            .sort(([, a], [, b]) => b.weight - a.weight)
            .map(([priority, config]) => {
              const Icon = config.icon;

              return (
                <SelectItem key={priority} value={priority}>
                  <div className="flex items-center gap-2">
                    <Icon className={cn("w-4 h-4", config.color)} />
                    <span>{t(config.label)}</span>
                  </div>
                </SelectItem>
              );
            })}
        </SelectContent>
      </Select>
    );
  }

  // Default variant
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "justify-between",
            sizeStyles.trigger,
            className
          )}
        >
          {selectedPriority ? (
            <div className="flex items-center gap-2">
              {showIcon && (
                <selectedPriority.icon className={cn(sizeStyles.icon, selectedPriority.color)} />
              )}
              <Badge
                variant="secondary"
                className={cn(selectedPriority.bgColor, selectedPriority.color, "border")}
              >
                {t(selectedPriority.label)}
              </Badge>
            </div>
          ) : (
            <span className="text-muted-foreground">
              {placeholder || t("select_priority")}
            </span>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0">
        <Command>
          <CommandInput placeholder={t("search_priority")} />
          <CommandList>
            <CommandEmpty>{t("no_priority_found")}</CommandEmpty>
            <CommandGroup>
              {Object.entries(priorityConfig)
                .sort(([, a], [, b]) => b.weight - a.weight)
                .map(([priority, config]) => {
                  const Icon = config.icon;
                  const isSelected = value === priority;

                  return (
                    <CommandItem
                      key={priority}
                      value={priority}
                      onSelect={() => {
                        onValueChange(priority as TaskPriority);
                        setOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className={cn("p-2 rounded-lg", config.bgColor)}>
                          <Icon className={cn("w-4 h-4", config.color)} />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium flex items-center gap-2">
                            {t(config.label)}
                            <Badge
                              variant="outline"
                              className={cn("text-xs", config.color)}
                            >
                              P{config.weight}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {t(config.description)}
                          </div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4" />}
                    </CommandItem>
                  );
                })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Utility functions
export function getPriorityColor(priority: TaskPriority): string {
  return priorityConfig[priority].color;
}

export function getPriorityBgColor(priority: TaskPriority): string {
  return priorityConfig[priority].bgColor;
}

export function getPriorityWeight(priority: TaskPriority): number {
  return priorityConfig[priority].weight;
}

export function comparePriorities(a: TaskPriority, b: TaskPriority): number {
  return getPriorityWeight(b) - getPriorityWeight(a);
}

// Simple priority display component
interface PriorityDisplayProps {
  priority: TaskPriority;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  variant?: "badge" | "text";
  className?: string;
}

export function PriorityDisplay({
  priority,
  size = "sm",
  showIcon = true,
  variant = "badge",
  className
}: PriorityDisplayProps) {
  const t = useTranslation();
  const config = priorityConfig[priority];
  const Icon = config.icon;
  const sizeStyles = sizeConfig[size];

  if (variant === "text") {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {showIcon && <Icon className={cn(sizeStyles.icon, config.color)} />}
        <span className={cn("font-medium", config.color)}>
          {t(config.label)}
        </span>
      </div>
    );
  }

  return (
    <Badge
      variant="secondary"
      className={cn(
        config.bgColor,
        config.color,
        "border gap-1 flex items-center w-fit",
        sizeStyles.badge,
        className
      )}
    >
      {showIcon && <Icon className={sizeStyles.icon} />}
      {t(config.label)}
    </Badge>
  );
}