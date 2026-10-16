import React from 'react';
import { Link, useLocation } from 'wouter';
import { Home, Search, User, Calendar } from 'lucide-react';

// Custom MessageSquare component to avoid import issues
function MessageSquare({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
    </svg>
  );
}

export function MobileNav() {
  const [location] = useLocation();
  
  return (
    <div className="fixed bottom-0 inset-x-0 bg-white shadow-lg border-t md:hidden">
      <div className="flex justify-between px-4 pt-2 pb-2">
        <Link href="/dashboard">
          <a className={`flex flex-col items-center ${location === '/dashboard' ? 'text-primary' : 'text-gray-500'}`}>
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
          </a>
        </Link>
        <Link href="/explore">
          <a className={`flex flex-col items-center ${location === '/explore' ? 'text-primary' : 'text-gray-500'}`}>
            <Search className="h-6 w-6" />
            <span className="text-xs mt-1">Explore</span>
          </a>
        </Link>
        <Link href="/bookings">
          <a className={`flex flex-col items-center ${location === '/bookings' ? 'text-primary' : 'text-gray-500'}`}>
            <Calendar className="h-6 w-6" />
            <span className="text-xs mt-1">Bookings</span>
          </a>
        </Link>
        <Link href="/messages">
          <a className={`flex flex-col items-center ${location === '/messages' ? 'text-primary' : 'text-gray-500'}`}>
            <MessageSquare className="h-6 w-6" />
            <span className="text-xs mt-1">Messages</span>
          </a>
        </Link>
        <Link href="/profile">
          <a className={`flex flex-col items-center ${location === '/profile' ? 'text-primary' : 'text-gray-500'}`}>
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Profile</span>
          </a>
        </Link>
      </div>
    </div>
  );
}
