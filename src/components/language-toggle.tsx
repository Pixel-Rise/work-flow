import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/components/language-provider";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {language.charAt(0).toUpperCase() + language.slice(1)}
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage("en")}>En</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("ru")}>Ru</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("uz")}>Uz</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
