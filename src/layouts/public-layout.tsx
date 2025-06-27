import { PublicHeader } from "@/components/public-header";
import { useState } from "react";
import { SettingsSidebar } from "@/components/settings-sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="h-screen w-screen lg:p-3 bg-card overflow-hidden fixed inset-0">
      <div className="h-full w-full flex overflow-hidden">
        {/* Main content area */}
        <div className={`bg-card flex-1 flex flex-col transition-all duration-300 ${
          isSettingsOpen && !isMobile ? 'mr-80' : 'mr-0'
        }`}>
          <div className="bg-background lg:border lg:rounded-2xl flex flex-col h-full">
            <PublicHeader 
              isSettingsOpen={isSettingsOpen}
              onSettingsToggle={() => setIsSettingsOpen(!isSettingsOpen)}
            />
            <main className="flex-1 rounded-b-2xl overflow-auto ">
              {children}
            </main>
          </div>
        </div>
        
        {/* Settings Sidebar */}
        <SettingsSidebar 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)}
          className={isMobile ? undefined : "absolute right-3 top-3 bottom-3 w-80 rounded-xl"}
        />
        
        {/* Mobile Overlay */}
        {isSettingsOpen && isMobile && (
          <div 
            className="absolute inset-0 bg-black/50 z-40"
            onClick={() => setIsSettingsOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
