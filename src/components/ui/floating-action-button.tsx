import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function FloatingActionButton({
  onClick,
  children,
  className,
}: FloatingActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 z-40 shadow-lg hover:shadow-xl transition-shadow",
        className
      )}
    >
      {children}
    </Button>
  );
}
