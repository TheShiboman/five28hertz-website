import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <img 
        src="/QXT World Logo.png" 
        alt="QXT World"
        className="h-16 w-auto transform scale-110 relative z-50"
        style={{
          filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
        }}
      />
    </div>
  );
}