import React from 'react';
import { Logo } from '@/components/logo';
import { Loader2 } from 'lucide-react';

interface SplashScreenProps {
  message?: string;
}

export function SplashScreen({ message = 'Loading...' }: SplashScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background dark:bg-[#001428]">
      <div className="animate-pulse flex flex-col items-center">
        <div className="mb-6">
          <Logo size="lg" withText={false} />
        </div>
        <h1 className="text-3xl font-bold mb-2 text-primary">ExchangeSphere</h1>
        <p className="text-muted-foreground mb-6">A CONNECTED WORLD</p>
        <div className="flex items-center">
          <Loader2 className="h-5 w-5 mr-2 animate-spin text-primary" />
          <p className="text-foreground">{message}</p>
        </div>
      </div>
      
      {/* Harmonic Flow thematic elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-1/4 top-1/4 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full bg-gradient-to-r from-teal-500/20 to-emerald-500/20 blur-xl"></div>
        <div className="absolute right-1/4 bottom-1/4 translate-x-1/2 translate-y-1/2 w-48 h-48 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 blur-xl"></div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 blur-2xl"></div>
      </div>
    </div>
  );
}