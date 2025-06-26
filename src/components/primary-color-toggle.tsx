import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Palette, Check } from "lucide-react";
import { usePrimaryColor } from "@/components/primary-color-provider";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const colors = [
  "#3B82F6", // Blue – universal, calm, professional
  "#10B981", // Emerald – fresh, modern
  "#F59E0B", // Amber – attention-grabbing, warm
  "#EF4444", // Red – alerts, destructive actions
  "#6366F1", // Indigo – creative, modern feel
  "#8B5CF6", // Violet – elegant and unique
  "#14B8A6", // Teal – balance, tech-oriented
];

export function PrimaryColorToggle() {
  const { primaryColor, setPrimaryColor } = usePrimaryColor();
  const [isPopoverOpen, setPopoverOpen] = useState(false);

  return (
    <Popover open={isPopoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Palette className="text-primary" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto grid grid-cols-4 gap-2 p-2" align="end">
        {colors.map((color) => (
          <button
            key={color}
            className={`relative w-8 h-8 rounded-full border-2 cursor-pointer ${
              primaryColor === color ? "border" : "border-transparent"
            }`}
            style={{ backgroundColor: color }}
            onClick={() => setPrimaryColor(color)}
            title={`Select ${color}`}
          >
            {primaryColor === color && (
              <Check className="absolute inset-0 m-auto w-4 h-4 text-white" />
            )}
          </button>
        ))}

        <button
          className="relative w-8 h-8 rounded-full cursor-pointer border-2 border-dashed border-muted-foreground/50 hover:border-muted-foreground/80 transition-colors"
          onClick={() => setPrimaryColor("")}
          title="Reset to default color"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-primary" />
          </div>
        </button>
      </PopoverContent>
    </Popover>
  );
}
