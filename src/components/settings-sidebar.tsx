import { Palette, Monitor, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation, useLanguage } from "@/hooks/use-language";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect } from "react";
import { useTheme } from "@/components/theme-provider";
import { usePrimaryColor } from "@/components/primary-color-provider";
import { Moon, Sun, SunMoon } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

interface SettingsSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

// Language options
const languages = [
  { code: "en", name: "English" },
  { code: "ru", name: "Русский" },
  { code: "uz", name: "O'zbek" },
];

// Color options
const colors = [
  { value: "#3B82F6", name: "Blue", class: "bg-blue-500" },
  { value: "#10B981", name: "Emerald", class: "bg-emerald-500" },
  { value: "#F59E0B", name: "Amber", class: "bg-amber-500" },
  { value: "#EF4444", name: "Red", class: "bg-red-500" },
  { value: "#6366F1", name: "Indigo", class: "bg-indigo-500" },
  { value: "#8B5CF6", name: "Violet", class: "bg-violet-500" },
  { value: "#14B8A6", name: "Teal", class: "bg-teal-500" },
];

export function SettingsSidebar({
  isOpen = false,
  onClose,
  className,
}: SettingsSidebarProps) {
  const t = useTranslation();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { primaryColor, setPrimaryColor } = usePrimaryColor();
  const isMobile = useIsMobile();

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && onClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  // Settings content component
  const SettingsContent = () => (
    <div className="p-3 space-y-4">
      {/* Language Settings */}
      <div className="space-y-4">
        <div className="flex items-center gap-1">
          <Languages className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">{t("language")}</h3>
        </div>
        <div className="grid gap-2">
          {languages.map((lang) => (
            <Button
              key={lang.code}
              variant={language === lang.code ? "default" : "outline"}
              onClick={() => setLanguage(lang.code)}
              className={`w-full justify-start text-left h-8 px-2 ${
                language === lang.code ? "ring-1 ring-primary" : ""
              }`}
            >
              <span className="font-medium">{lang.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Theme Settings */}
      <div className="space-y-4">
        <div className="flex items-center gap-1">
          <Monitor className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">{t("theme")}</h3>
        </div>
        <div className="grid gap-2">
          <Button
            variant={theme === "light" ? "default" : "outline"}
            onClick={() => setTheme("light")}
            className={`w-full justify-start text-left h-8 px-2 ${
              theme === "light" ? "ring-1 ring-primary" : ""
            }`}
          >
            <Sun className="h-3 w-3 mr-1" />
            <span className="font-medium">{t("light_mode")}</span>
          </Button>
          <Button
            variant={theme === "dark" ? "default" : "outline"}
            onClick={() => setTheme("dark")}
            className={`w-full justify-start text-left h-8 px-2 ${
              theme === "dark" ? "ring-1 ring-primary" : ""
            }`}
          >
            <Moon className="h-3 w-3 mr-1" />
            <span className="font-medium">{t("dark_mode")}</span>
          </Button>
          <Button
            variant={theme === "system" ? "default" : "outline"}
            onClick={() => setTheme("system")}
            className={`w-full justify-start text-left h-8 px-2 ${
              theme === "system" ? "ring-1 ring-primary" : ""
            }`}
          >
            <SunMoon className="h-3 w-3 mr-1" />
            <span className="font-medium">{t("system_theme")}</span>
          </Button>
        </div>
      </div>

      {/* Primary Color Settings */}
      <div className="space-y-4">
        <div className="flex items-center gap-1">
          <Palette className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">{t("primary_color")}</h3>
        </div>
        <div className="space-y-4">
          {/* Color Grid */}
          <div className="grid grid-cols-2 gap-2">
            {colors.map((color) => (
              <Button
                key={color.value}
                variant="outline"
                onClick={() => setPrimaryColor(color.value)}
                className={`h-8 justify-start text-left px-2 ${
                  primaryColor === color.value ? "ring-1 ring-primary" : ""
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full mr-1 ${color.class}`}
                />
                <span className="font-medium">{color.name}</span>
              </Button>
            ))}
            <Button
              variant={!primaryColor ? "default" : "outline"}
              onClick={() => setPrimaryColor("")}
              className={`w-full h-8 justify-center text-left px-2 ${
                !primaryColor ? "ring-1 ring-primary" : ""
              }`}
            >
              <span className="font-medium">{t("default")}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile version using Sheet
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="w-full p-3">
          <SheetHeader>
            <SheetTitle>{t("site_settings")}</SheetTitle>
          </SheetHeader>
          <ScrollArea className="flex-1 h-full -mx-3">
            <SettingsContent />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop version using fixed sidebar
  return (
    <div
      className={`${className || 'fixed right-0 top-0 w-80 h-full'} bg-card transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-end p-5">
        <div className="flex items-center gap-1">
          <span className="font-semibold">{t("site_settings")}</span>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 h-full">
        <SettingsContent />
      </ScrollArea>
    </div>
  );
}
