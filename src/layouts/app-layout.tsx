// layouts/AppLayout.tsx
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { PrimaryColorToggle } from "@/components/primary-color-toggle";

export default function AppLayout({ children }: { children: React.ReactNode }) {

  return (
    <SidebarProvider>
      <div className="flex w-full">
        <div className="relative">
          <AppSidebar />
        </div>
        <main className="flex-1 p-4">
          <SidebarTrigger />
          <div className="fixed top-0 right-0 flex gap-2 p-2 z-50">
            <LanguageToggle />
            <ModeToggle />
            <PrimaryColorToggle />
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
