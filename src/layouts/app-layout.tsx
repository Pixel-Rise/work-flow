// layouts/AppLayout.tsx
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { PrimaryColorToggle } from "@/components/primary-color-toggle";
import { useTitle } from "@/components/title-provider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { title } = useTitle();

  return (
    <SidebarProvider>
      <div className="flex w-full">
        <div className="relative">
          <AppSidebar />
        </div>
        <main className="flex-1">
          {/* Navbar */}
          <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border/20 bg-background/80 backdrop-blur-md px-4 py-3">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold text-foreground">{title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ModeToggle />
              <PrimaryColorToggle />
            </div>
          </header>

          {/* Main content */}
          <div className="min-h-[calc(100vh-61px)] overflow-auto p-3">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
