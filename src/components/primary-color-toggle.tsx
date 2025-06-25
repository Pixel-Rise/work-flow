import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Palette, Check, Pipette } from "lucide-react";
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
          className="relative w-8 h-8 rounded-full cursor-pointer border"
          title="Custom color"
        >
          <label className="absolute inset-0 flex items-center justify-center cursor-pointer">
            <input
              type="color"
              className="opacity-0 w-full h-full cursor-pointer"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              aria-label="Pick a custom color"
            />
            <Pipette className="absolute inset-0 m-auto w-4 h-4" />
          </label>
        </button>
      </PopoverContent>
    </Popover>
  );
}
