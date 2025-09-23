import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/use-language";
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronDown,
  X,
  AlertTriangle,
  CheckCircle,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, addDays, addWeeks, addMonths, isToday, isTomorrow, isThisWeek, isPast, differenceInDays } from "date-fns";

interface TaskDueDatePickerProps {
  value?: string; // ISO date string
  onValueChange: (date?: string) => void;
  placeholder?: string;
  disabled?: boolean;
  variant?: "default" | "compact" | "badge";
  size?: "sm" | "md" | "lg";
  showTimeOptions?: boolean;
  showQuickOptions?: boolean;
  minDate?: Date;
  className?: string;
}

const quickOptions = [
  {
    id: "today",
    label: "today",
    getValue: () => new Date(),
    icon: Zap,
    color: "bg-blue-100 text-blue-700"
  },
  {
    id: "tomorrow",
    label: "tomorrow",
    getValue: () => addDays(new Date(), 1),
    icon: CalendarIcon,
    color: "bg-green-100 text-green-700"
  },
  {
    id: "next_week",
    label: "next_week",
    getValue: () => addWeeks(new Date(), 1),
    icon: Clock,
    color: "bg-purple-100 text-purple-700"
  },
  {
    id: "next_month",
    label: "next_month",
    getValue: () => addMonths(new Date(), 1),
    icon: CalendarIcon,
    color: "bg-orange-100 text-orange-700"
  }
];

const sizeConfig = {
  sm: {
    trigger: "h-8 px-2 text-xs",
    icon: "w-3 h-3",
    badge: "text-xs px-1.5 py-0.5"
  },
  md: {
    trigger: "h-9 px-3 text-sm",
    icon: "w-4 h-4",
    badge: "text-sm px-2 py-1"
  },
  lg: {
    trigger: "h-10 px-4 text-base",
    icon: "w-5 h-5",
    badge: "text-base px-3 py-1.5"
  }
};

export function TaskDueDatePicker({
  value,
  onValueChange,
  placeholder,
  disabled = false,
  variant = "default",
  size = "md",
  showTimeOptions = false,
  showQuickOptions = true,
  minDate,
  className
}: TaskDueDatePickerProps) {
  const t = useTranslation();
  const [open, setOpen] = useState(false);

  const selectedDate = value ? new Date(value) : undefined;
  const sizeStyles = sizeConfig[size];

  const formatDate = (date: Date) => {
    if (isToday(date)) return t("today");
    if (isTomorrow(date)) return t("tomorrow");
    if (isThisWeek(date)) return format(date, "EEEE"); // Day name
    return format(date, "MMM d, yyyy");
  };

  const getDateStatus = (date: Date) => {
    if (isPast(date) && !isToday(date)) {
      return { status: "overdue", color: "text-red-600", bgColor: "bg-red-100" };
    }

    const daysUntil = differenceInDays(date, new Date());
    if (daysUntil <= 1) {
      return { status: "urgent", color: "text-orange-600", bgColor: "bg-orange-100" };
    }
    if (daysUntil <= 7) {
      return { status: "soon", color: "text-yellow-600", bgColor: "bg-yellow-100" };
    }

    return { status: "normal", color: "text-green-600", bgColor: "bg-green-100" };
  };

  const handleQuickSelect = (optionId: string) => {
    const option = quickOptions.find(o => o.id === optionId);
    if (option) {
      const date = option.getValue();
      onValueChange(date.toISOString());
      setOpen(false);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    onValueChange(date?.toISOString());
    if (!showTimeOptions) {
      setOpen(false);
    }
  };

  const clearDate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange(undefined);
  };

  // Badge variant
  if (variant === "badge" && selectedDate) {
    const dateStatus = getDateStatus(selectedDate);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "border gap-2",
              dateStatus.bgColor,
              dateStatus.color,
              sizeStyles.badge,
              className
            )}
          >
            <CalendarIcon className={sizeStyles.icon} />
            <span>{formatDate(selectedDate)}</span>
            <button
              onClick={clearDate}
              className="hover:bg-black/10 rounded p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <DatePickerContent
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onQuickSelect={handleQuickSelect}
            showQuickOptions={showQuickOptions}
            showTimeOptions={showTimeOptions}
            minDate={minDate}
            t={t}
          />
        </PopoverContent>
      </Popover>
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
            {selectedDate ? (
              <div className="flex items-center gap-2">
                <CalendarIcon className={sizeStyles.icon} />
                <span>{formatDate(selectedDate)}</span>
              </div>
            ) : (
              <span className="text-muted-foreground">
                {placeholder || t("set_due_date")}
              </span>
            )}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <DatePickerContent
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onQuickSelect={handleQuickSelect}
            showQuickOptions={showQuickOptions}
            showTimeOptions={showTimeOptions}
            minDate={minDate}
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
              "justify-between",
              sizeStyles.trigger,
              className
            )}
          >
            <div className="flex items-center gap-2">
              <CalendarIcon className={sizeStyles.icon} />
              {selectedDate ? (
                <div className="flex items-center gap-2">
                  <span>{formatDate(selectedDate)}</span>
                  {(() => {
                    const status = getDateStatus(selectedDate);
                    if (status.status === "overdue") {
                      return <AlertTriangle className="w-3 h-3 text-red-600" />;
                    }
                    if (status.status === "urgent") {
                      return <Clock className="w-3 h-3 text-orange-600" />;
                    }
                    return <CheckCircle className="w-3 h-3 text-green-600" />;
                  })()}
                </div>
              ) : (
                <span className="text-muted-foreground">
                  {placeholder || t("set_due_date")}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {selectedDate && (
                <button
                  onClick={clearDate}
                  className="hover:text-destructive p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
              <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <DatePickerContent
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onQuickSelect={handleQuickSelect}
            showQuickOptions={showQuickOptions}
            showTimeOptions={showTimeOptions}
            minDate={minDate}
            t={t}
          />
        </PopoverContent>
      </Popover>

      {selectedDate && (
        <div className="text-xs text-muted-foreground">
          {(() => {
            const status = getDateStatus(selectedDate);
            if (status.status === "overdue") {
              return (
                <div className="flex items-center gap-1 text-red-600">
                  <AlertTriangle className="w-3 h-3" />
                  <span>{t("overdue")}</span>
                </div>
              );
            }
            if (status.status === "urgent") {
              return (
                <div className="flex items-center gap-1 text-orange-600">
                  <Clock className="w-3 h-3" />
                  <span>{t("due_soon")}</span>
                </div>
              );
            }
            const days = differenceInDays(selectedDate, new Date());
            return (
              <div className="flex items-center gap-1 text-muted-foreground">
                <CalendarIcon className="w-3 h-3" />
                <span>{days} {t("days_remaining")}</span>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// Internal content component
interface DatePickerContentProps {
  selectedDate?: Date;
  onDateSelect: (date: Date | undefined) => void;
  onQuickSelect: (optionId: string) => void;
  showQuickOptions: boolean;
  showTimeOptions: boolean;
  minDate?: Date;
  t: (key: string) => string;
}

function DatePickerContent({
  selectedDate,
  onDateSelect,
  onQuickSelect,
  showQuickOptions,
  showTimeOptions,
  minDate,
  t
}: DatePickerContentProps) {
  const [timeValue, setTimeValue] = useState("09:00");

  return (
    <div className="space-y-4 p-4">
      {/* Quick Options */}
      {showQuickOptions && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">{t("quick_options")}</h4>
          <div className="grid grid-cols-2 gap-2">
            {quickOptions.map((option) => {
              const Icon = option.icon;
              const optionDate = option.getValue();
              const isDisabled = minDate && optionDate < minDate;

              return (
                <Button
                  key={option.id}
                  variant="ghost"
                  size="sm"
                  disabled={isDisabled}
                  onClick={() => onQuickSelect(option.id)}
                  className={cn(
                    "justify-start gap-2 h-auto p-2",
                    option.color
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <div className="text-left">
                    <div className="text-xs font-medium">{t(option.label)}</div>
                    <div className="text-xs opacity-70">
                      {format(optionDate, "MMM d")}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Calendar */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">{t("select_date")}</h4>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          disabled={(date) => {
            if (minDate && date < minDate) return true;
            return false;
          }}
          initialFocus
          className="rounded-md border"
        />
      </div>

      {/* Time Options */}
      {showTimeOptions && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">{t("time")}</h4>
          <Select value={timeValue} onValueChange={setTimeValue}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 24 }, (_, i) => {
                const hour = i.toString().padStart(2, '0');
                return (
                  <SelectItem key={i} value={`${hour}:00`}>
                    {hour}:00
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Clear Option */}
      {selectedDate && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDateSelect(undefined)}
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <X className="w-4 h-4 mr-2" />
          {t("clear_due_date")}
        </Button>
      )}
    </div>
  );
}

// Utility functions
export function getDueDateStatus(date: string | Date) {
  const dueDate = typeof date === 'string' ? new Date(date) : date;

  if (isPast(dueDate) && !isToday(dueDate)) {
    return "overdue";
  }

  const daysUntil = differenceInDays(dueDate, new Date());
  if (daysUntil <= 1) return "urgent";
  if (daysUntil <= 7) return "soon";

  return "normal";
}

export function formatDueDate(date: string | Date, locale = "en") {
  const dueDate = typeof date === 'string' ? new Date(date) : date;

  if (isToday(dueDate)) return "Today";
  if (isTomorrow(dueDate)) return "Tomorrow";
  if (isThisWeek(dueDate)) return format(dueDate, "EEEE");

  return format(dueDate, "MMM d, yyyy");
}