import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { useTitle } from "@/hooks/use-title"

interface SiteHeaderProps {
  onSettingsToggle?: () => void;
  isSettingsOpen?: boolean;
}

export function SiteHeader({ onSettingsToggle, isSettingsOpen }: SiteHeaderProps) {
  const { title } = useTitle();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 h-4"
        />
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onSettingsToggle}
          className={isSettingsOpen ? "bg-accent" : ""}
        >
          <Settings />
          <span className="sr-only">Settings</span>
        </Button>
      </div>
    </header>
  )
}
