// layouts/AppLayout.tsx
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SettingsSidebar } from "@/components/settings-sidebar";
import { SiteHeader } from "@/components/site-header";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        {/* Left Sidebar */}
        <AppSidebar />
        
        {/* Main Content */}
        <div className={`bg-card lg:pt-3 lg:pb-3 lg:pr-3 flex-1 flex flex-col transition-all duration-300 ${
          isSettingsOpen && !isMobile ? 'mr-80' : 'mr-0'
        }`}>
          <div className="bg-background  lg:rounded-2xl flex flex-col h-full">
            <SiteHeader 
            onSettingsToggle={() => setIsSettingsOpen(!isSettingsOpen)}
            isSettingsOpen={isSettingsOpen}
          />
          <main className="flex-1 overflow-auto pr-3 pl-3 pb-3">
            {children}
          </main>
          </div>
        </div>
        
        {/* Right Settings Sidebar */}
        <SettingsSidebar 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)}
        />
        
        {/* Mobile Overlay */}
        {isSettingsOpen && isMobile && (
          <div 
            className="fixed inset-0 bg-card z-40"
            onClick={() => setIsSettingsOpen(false)}
          />
        )}
      </div>
    </SidebarProvider>
  );
}
