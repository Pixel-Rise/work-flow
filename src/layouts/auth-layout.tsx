import { ModeToggle } from "@/components/mode-toggle";
import { LanguageToggle } from "@/components/language-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <div className="fixed top-0 right-0 flex gap-2 p-2 z-50">
        <LanguageToggle />
        <ModeToggle />
      </div>
      {children}
    </div>
  );
}
