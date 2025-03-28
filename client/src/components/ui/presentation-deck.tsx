import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Maximize2Icon, Minimize2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PresentationDeckProps {
  title: string;
  embedUrl: string;
  embedId?: string;
  aspectRatio?: "16:9" | "4:3" | "1:1";
  className?: string;
}

export function PresentationDeck({
  title,
  embedUrl,
  embedId,
  aspectRatio = "16:9",
  className,
}: PresentationDeckProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Calculate aspect ratio padding
  const aspectRatioPadding = {
    "16:9": "56.25%", // (9 / 16) * 100
    "4:3": "75%",     // (3 / 4) * 100
    "1:1": "100%"     // Square
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div 
      className={cn(
        "rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900",
        isFullscreen ? "fixed inset-0 z-50 p-4 md:p-8 bg-white/95 dark:bg-black/95" : "",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800">
        <h3 className="font-medium text-base truncate">{title}</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleFullscreen}
          className="h-8 w-8 p-0 rounded-full"
        >
          {isFullscreen ? (
            <Minimize2Icon className="h-4 w-4" />
          ) : (
            <Maximize2Icon className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Presentation frame */}
      <div className="relative w-full" style={{ paddingBottom: aspectRatioPadding[aspectRatio] }}>
        <iframe
          src={embedUrl}
          frameBorder="0"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          title={title}
        />
      </div>

      {/* Optional footer */}
      <div className="p-3 bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 dark:text-gray-400 text-center">
        Presentation by five28hertz
      </div>
    </div>
  );
}