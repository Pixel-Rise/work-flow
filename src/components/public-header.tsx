import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface PublicHeaderProps {
  isSettingsOpen?: boolean;
  onSettingsToggle?: () => void;
}

export function PublicHeader({ 
  isSettingsOpen = false, 
  onSettingsToggle 
}: PublicHeaderProps) {
  return (
    <header className="w-full rounded-t-2xl bg-background">
      <div className="flex h-14 items-center px-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="font-bold text-xl">Company</div>
        </div>

        {/* Right side - only settings */}
        <div className="flex items-center ml-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSettingsToggle}
            className={isSettingsOpen ? "bg-accent" : ""}
          >
            <Settings className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
