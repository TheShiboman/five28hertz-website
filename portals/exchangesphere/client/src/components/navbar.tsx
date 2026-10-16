import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { UserAvatar } from '@/components/user-avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from '@/components/theme-toggle';
import { NotificationIcon } from '@/components/notification-icon';

export function Navbar() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  if (!user) return null;
  
  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard">
              <a className="flex-shrink-0 flex items-center">
                <Logo />
              </a>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/dashboard">
              <a className={`px-3 py-2 text-sm font-medium ${
                location === '/dashboard' ? 'text-primary' : 'text-foreground hover:text-primary'
              } transition-colors`}>
                Dashboard
              </a>
            </Link>
            <Link href="/messages">
              <a className={`px-3 py-2 text-sm font-medium ${
                location === '/messages' ? 'text-primary' : 'text-foreground hover:text-primary'
              } transition-colors`}>
                Messages
              </a>
            </Link>
            <Link href="/community">
              <a className={`px-3 py-2 text-sm font-medium ${
                location === '/community' ? 'text-primary' : 'text-foreground hover:text-primary'
              } transition-colors`}>
                Community
              </a>
            </Link>
            <Link href="/bookings">
              <a className={`px-3 py-2 text-sm font-medium ${
                location === '/bookings' ? 'text-primary' : 'text-foreground hover:text-primary'
              } transition-colors`}>
                Bookings
              </a>
            </Link>
            <Link href="/impact">
              <a className={`px-3 py-2 text-sm font-medium ${
                location === '/impact' ? 'text-primary' : 'text-foreground hover:text-primary'
              } transition-colors`}>
                Impact
              </a>
            </Link>
            
            <div className="relative ml-4">
              <NotificationIcon className="text-foreground" />
            </div>
            
            <div className="ml-2">
              <ThemeToggle />
            </div>
            
            <div className="ml-3 relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="bg-background rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    <UserAvatar
                      src={user.avatarUrl || undefined}
                      name={user.fullName}
                      size="md"
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <a className="cursor-pointer">Profile</a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <a className="cursor-pointer">Dashboard</a>
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <a className="cursor-pointer">Admin Dashboard</a>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="flex md:hidden items-center">
            <NotificationIcon className="text-foreground" />
            <ThemeToggle className="ml-2" />
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground/70 ml-2">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center py-4">
                    <Logo />
                  </div>
                  
                  <div className="flex-1 mt-8 flex flex-col gap-6">
                    <Link href="/dashboard">
                      <a className={`text-lg font-medium ${
                        location === '/dashboard' ? 'text-primary' : 'text-foreground'
                      }`}>
                        Dashboard
                      </a>
                    </Link>
                    <Link href="/profile">
                      <a className={`text-lg font-medium ${
                        location === '/profile' ? 'text-primary' : 'text-foreground'
                      }`}>
                        Profile
                      </a>
                    </Link>
                    <Link href="/messages">
                      <a className={`text-lg font-medium ${
                        location === '/messages' ? 'text-primary' : 'text-foreground'
                      }`}>
                        Messages
                      </a>
                    </Link>
                    <Link href="/community">
                      <a className={`text-lg font-medium ${
                        location === '/community' ? 'text-primary' : 'text-foreground'
                      }`}>
                        Community
                      </a>
                    </Link>
                    <Link href="/bookings">
                      <a className={`text-lg font-medium ${
                        location === '/bookings' ? 'text-primary' : 'text-foreground'
                      }`}>
                        Bookings
                      </a>
                    </Link>
                    <Link href="/impact">
                      <a className={`text-lg font-medium ${
                        location === '/impact' ? 'text-primary' : 'text-foreground'
                      }`}>
                        Impact
                      </a>
                    </Link>
                    {user.role === 'admin' && (
                      <Link href="/admin">
                        <a className={`text-lg font-medium ${
                          location === '/admin' ? 'text-primary' : 'text-foreground'
                        }`}>
                          Admin Dashboard
                        </a>
                      </Link>
                    )}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="mt-auto mb-8"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
