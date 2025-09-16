import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useTranslation } from "@/hooks/use-language";
import {
  User,
  Users,
  ChevronDown,
  Check,
  X,
  Plus,
  UserPlus,
  Mail,
  Crown
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  isOnline: boolean;
  workload?: number; // 0-100 percentage
  department?: string;
}

interface TaskAssigneeSelectorProps {
  value?: number[]; // Array of user IDs
  onValueChange: (assigneeIds: number[]) => void;
  teamMembers: TeamMember[];
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
  maxAssignees?: number;
  variant?: "default" | "compact" | "avatar-only";
  size?: "sm" | "md" | "lg";
  showWorkload?: boolean;
  showOnlineStatus?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: {
    trigger: "h-8 px-2 text-xs",
    avatar: "w-5 h-5",
    icon: "w-3 h-3"
  },
  md: {
    trigger: "h-9 px-3 text-sm",
    avatar: "w-6 h-6",
    icon: "w-4 h-4"
  },
  lg: {
    trigger: "h-10 px-4 text-base",
    avatar: "w-8 h-8",
    icon: "w-5 h-5"
  }
};

export function TaskAssigneeSelector({
  value = [],
  onValueChange,
  teamMembers,
  placeholder,
  disabled = false,
  multiple = true,
  maxAssignees = 5,
  variant = "default",
  size = "md",
  showWorkload = true,
  showOnlineStatus = true,
  className
}: TaskAssigneeSelectorProps) {
  const t = useTranslation();
  const [open, setOpen] = useState(false);

  const selectedMembers = teamMembers.filter(member => value.includes(member.id));
  const sizeStyles = sizeConfig[size];

  const handleSelect = (memberId: number) => {
    if (multiple) {
      if (value.includes(memberId)) {
        // Remove assignee
        onValueChange(value.filter(id => id !== memberId));
      } else {
        // Add assignee (respect max limit)
        if (value.length < maxAssignees) {
          onValueChange([...value, memberId]);
        }
      }
    } else {
      // Single selection
      onValueChange(value.includes(memberId) ? [] : [memberId]);
      setOpen(false);
    }
  };

  const removeAssignee = (memberId: number) => {
    onValueChange(value.filter(id => id !== memberId));
  };

  const getWorkloadColor = (workload: number) => {
    if (workload >= 90) return "text-red-600";
    if (workload >= 70) return "text-orange-600";
    if (workload >= 50) return "text-yellow-600";
    return "text-green-600";
  };

  // Avatar-only variant
  if (variant === "avatar-only") {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {selectedMembers.map((member) => (
          <div key={member.id} className="relative group">
            <Avatar className={cn(sizeStyles.avatar, "ring-2 ring-background cursor-pointer")}>
              {member.avatar ? (
                <AvatarImage src={member.avatar} alt={member.name} />
              ) : null}
              <AvatarFallback className="text-xs font-medium">
                {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {showOnlineStatus && (
              <div
                className={cn(
                  "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background",
                  member.isOnline ? "bg-green-500" : "bg-gray-400"
                )}
              />
            )}
            {multiple && (
              <button
                onClick={() => removeAssignee(member.id)}
                className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <X className="w-2 h-2" />
              </button>
            )}
          </div>
        ))}

        {(!multiple || value.length < maxAssignees) && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                disabled={disabled}
                className={cn(
                  "rounded-full p-0 border-dashed",
                  sizeStyles.avatar
                )}
              >
                <Plus className={sizeStyles.icon} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
              <AssigneeList
                teamMembers={teamMembers}
                selectedIds={value}
                onSelect={handleSelect}
                showWorkload={showWorkload}
                showOnlineStatus={showOnlineStatus}
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
              sizeStyles.trigger,
              className
            )}
          >
            {selectedMembers.length > 0 ? (
              <div className="flex items-center gap-1">
                <Users className={sizeStyles.icon} />
                <span>{selectedMembers.length} {t("selected")}</span>
              </div>
            ) : (
              <span className="text-muted-foreground">
                {placeholder || t("select_assignees")}
              </span>
            )}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0">
          <AssigneeList
            teamMembers={teamMembers}
            selectedIds={value}
            onSelect={handleSelect}
            showWorkload={showWorkload}
            showOnlineStatus={showOnlineStatus}
            t={t}
          />
        </PopoverContent>
      </Popover>
    );
  }

  // Default variant
  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "justify-between min-h-10 h-auto",
              sizeStyles.trigger,
              className
            )}
          >
            <div className="flex items-center gap-2 flex-wrap">
              {selectedMembers.length === 0 ? (
                <span className="text-muted-foreground">
                  {placeholder || t("select_assignees")}
                </span>
              ) : (
                selectedMembers.slice(0, 3).map((member) => (
                  <div key={member.id} className="flex items-center gap-1 bg-secondary rounded px-1.5 py-0.5">
                    <Avatar className="w-4 h-4">
                      {member.avatar ? (
                        <AvatarImage src={member.avatar} alt={member.name} />
                      ) : null}
                      <AvatarFallback className="text-xs">
                        {member.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium">{member.name.split(' ')[0]}</span>
                    {multiple && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeAssignee(member.id);
                        }}
                        className="hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))
              )}
              {selectedMembers.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{selectedMembers.length - 3}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 ml-2">
              {multiple && value.length < maxAssignees && (
                <UserPlus className="w-4 h-4 text-muted-foreground" />
              )}
              <ChevronDown className="w-4 h-4 shrink-0 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0">
          <AssigneeList
            teamMembers={teamMembers}
            selectedIds={value}
            onSelect={handleSelect}
            showWorkload={showWorkload}
            showOnlineStatus={showOnlineStatus}
            multiple={multiple}
            maxAssignees={maxAssignees}
            t={t}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

// Internal component for assignee list
interface AssigneeListProps {
  teamMembers: TeamMember[];
  selectedIds: number[];
  onSelect: (memberId: number) => void;
  showWorkload: boolean;
  showOnlineStatus: boolean;
  multiple?: boolean;
  maxAssignees?: number;
  t: (key: string) => string;
}

function AssigneeList({
  teamMembers,
  selectedIds,
  onSelect,
  showWorkload,
  showOnlineStatus,
  multiple = true,
  maxAssignees = 5,
  t
}: AssigneeListProps) {
  const getWorkloadColor = (workload: number) => {
    if (workload >= 90) return "text-red-600";
    if (workload >= 70) return "text-orange-600";
    if (workload >= 50) return "text-yellow-600";
    return "text-green-600";
  };

  // Group members by department
  const groupedMembers = teamMembers.reduce((acc, member) => {
    const dept = member.department || 'Other';
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(member);
    return acc;
  }, {} as Record<string, TeamMember[]>);

  // Sort groups and members
  const sortedGroups = Object.entries(groupedMembers).sort(([a], [b]) =>
    a === 'Other' ? 1 : b === 'Other' ? -1 : a.localeCompare(b)
  );

  return (
    <Command>
      <CommandInput placeholder={t("search_team_members")} />
      <CommandList>
        <CommandEmpty>{t("no_team_members_found")}</CommandEmpty>

        {/* Selection info */}
        {multiple && selectedIds.length > 0 && (
          <div className="px-2 py-1 text-xs text-muted-foreground border-b">
            {selectedIds.length}/{maxAssignees} {t("selected")}
          </div>
        )}

        {sortedGroups.map(([department, members]) => (
          <CommandGroup key={department} heading={department}>
            {members
              .sort((a, b) => {
                // Sort by online status, then by name
                if (a.isOnline !== b.isOnline) return a.isOnline ? -1 : 1;
                return a.name.localeCompare(b.name);
              })
              .map((member) => {
                const isSelected = selectedIds.includes(member.id);
                const canSelect = !isSelected && (selectedIds.length < maxAssignees || !multiple);
                const isDisabled = !canSelect && !isSelected;

                return (
                  <CommandItem
                    key={member.id}
                    value={`${member.name} ${member.email} ${member.department}`}
                    onSelect={() => onSelect(member.id)}
                    disabled={isDisabled}
                    className={cn(
                      "cursor-pointer",
                      isSelected && "bg-accent",
                      isDisabled && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="relative">
                        <Avatar className="w-8 h-8">
                          {member.avatar ? (
                            <AvatarImage src={member.avatar} alt={member.name} />
                          ) : null}
                          <AvatarFallback className="text-xs font-medium">
                            {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {showOnlineStatus && (
                          <div
                            className={cn(
                              "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background",
                              member.isOnline ? "bg-green-500" : "bg-gray-400"
                            )}
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm truncate">
                            {member.name}
                          </span>
                          {member.role === 'admin' && (
                            <Crown className="w-3 h-3 text-yellow-600" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{member.email}</span>
                        </div>
                        {showWorkload && member.workload !== undefined && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {t("workload")}:
                            </span>
                            <span className={cn("text-xs font-medium", getWorkloadColor(member.workload))}>
                              {member.workload}%
                            </span>
                          </div>
                        )}
                      </div>
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

// Utility component for displaying selected assignees
interface AssigneeDisplayProps {
  assignees: TeamMember[];
  maxShow?: number;
  size?: "sm" | "md" | "lg";
  showOnlineStatus?: boolean;
  onRemove?: (memberId: number) => void;
  className?: string;
}

export function AssigneeDisplay({
  assignees,
  maxShow = 5,
  size = "md",
  showOnlineStatus = true,
  onRemove,
  className
}: AssigneeDisplayProps) {
  const sizeStyles = sizeConfig[size];
  const visibleAssignees = assignees.slice(0, maxShow);
  const hiddenCount = assignees.length - maxShow;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {visibleAssignees.map((assignee) => (
        <div key={assignee.id} className="relative group">
          <Avatar className={cn(sizeStyles.avatar, "ring-2 ring-background")}>
            {assignee.avatar ? (
              <AvatarImage src={assignee.avatar} alt={assignee.name} />
            ) : null}
            <AvatarFallback className="text-xs font-medium">
              {assignee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {showOnlineStatus && (
            <div
              className={cn(
                "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background",
                assignee.isOnline ? "bg-green-500" : "bg-gray-400"
              )}
            />
          )}
          {onRemove && (
            <button
              onClick={() => onRemove(assignee.id)}
              className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <X className="w-2 h-2" />
            </button>
          )}
        </div>
      ))}

      {hiddenCount > 0 && (
        <Avatar className={cn(sizeStyles.avatar, "bg-muted")}>
          <AvatarFallback className="text-xs">+{hiddenCount}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}