import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

export function Nav({ className }: { className?: string }) {
  return (
    <nav className={cn(
      "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 relative", 
      className
    )}>
      <div className="container mx-auto flex h-24 items-center px-4 relative">
        <div className="absolute left-4 -top-8">
          <Logo />
        </div>
        <div className="flex-1" />
      </div>
    </nav>
  );
}