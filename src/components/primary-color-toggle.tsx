import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Palette, Check } from "lucide-react";
import { usePrimaryColor } from "@/components/primary-color-provider";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const colors = [
  { value: "#3B82F6", name: "Blue", lightForeground: "#FFFFFF", darkForeground: "#FFFFFF" },
  { value: "#10B981", name: "Emerald", lightForeground: "#FFFFFF", darkForeground: "#FFFFFF" },
  { value: "#F59E0B", name: "Amber", lightForeground: "#000000", darkForeground: "#000000" },
  { value: "#EF4444", name: "Red", lightForeground: "#FFFFFF", darkForeground: "#FFFFFF" },
  { value: "#6366F1", name: "Indigo", lightForeground: "#FFFFFF", darkForeground: "#FFFFFF" },
  { value: "#8B5CF6", name: "Violet", lightForeground: "#FFFFFF", darkForeground: "#FFFFFF" },
  { value: "#14B8A6", name: "Teal", lightForeground: "#FFFFFF", darkForeground: "#FFFFFF" },
];

export function PrimaryColorToggle() {
  const { primaryColor, setPrimaryColor } = usePrimaryColor();
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const getForegroundColor = (color: typeof colors[0]) => {
    return isDark ? color.darkForeground : color.lightForeground;
  };

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
            key={color.value}
            className={`relative w-8 h-8 rounded-full border-2 cursor-pointer transition-all hover:scale-110 ${
              primaryColor === color.value ? "border-ring shadow-lg" : "border-transparent"
            }`}
            style={{ backgroundColor: color.value }}
            onClick={() => setPrimaryColor(color.value)}
            title={`${color.name} - Primary: ${color.value}, Text: ${getForegroundColor(color)}`}
          >
            {primaryColor === color.value && (
              <Check 
                className="absolute inset-0 m-auto w-4 h-4" 
                style={{ color: getForegroundColor(color) }}
              />
            )}
          </button>
        ))}

        <button
          className="relative w-8 h-8 rounded-full cursor-pointer border-2 border-dashed border-muted-foreground/50 hover:border-muted-foreground/80 hover:scale-110 transition-all"
          onClick={() => setPrimaryColor("")}
          title="Reset to default Blue color"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-primary" />
          </div>
        </button>
      </PopoverContent>
    </Popover>
  );
}
