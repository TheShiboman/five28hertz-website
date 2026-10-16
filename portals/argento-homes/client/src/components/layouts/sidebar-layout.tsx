import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { usePermissions } from '@/hooks/use-permissions';
import MobileNav from './mobile-nav';
import { 
  Home, Building, Store, Calendar, CheckSquare, MessageSquare, 
  Leaf, Settings, HelpCircle, LogOut, ShieldCheck, Users,
  ToggleRight, Wifi, Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AssetLogo } from '@/components/ui/asset-logo';

type SidebarItemProps = {
  href: string;
  icon: ReactNode;
  label: string;
  active: boolean;
  badge?: number;
  onClick?: () => void;
};

const SidebarItem = ({ href, icon, label, active, badge, onClick }: SidebarItemProps) => (
  <Link href={href}>
    <a 
      className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-all ${
        active 
          ? 'bg-brand text-white shadow-sm' 
          : 'hover:bg-brand/10 text-brand-text/90'
      }`}
      onClick={onClick}
    >
      <span className={`mr-3 ${active ? 'text-white' : 'text-brand-text/80'}`}>
        {icon}
      </span>
      <span className={`${active ? 'font-medium text-white' : 'text-brand-text/90'}`}>{label}</span>
      {badge !== undefined && (
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ml-auto ${
          active ? 'bg-white text-brand' : 'bg-brand text-white'
        }`}>
          {badge}
        </span>
      )}
    </a>
  </Link>
);

type SidebarLayoutProps = {
  children: ReactNode;
};

const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { permissions } = usePermissions();
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  // First two characters of the user's full name for avatar
  const userInitials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="flex h-screen overflow-hidden bg-brand-background">
      {/* Sidebar (visible on medium and larger screens) */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-[#FAFAFA] shadow-sm">
          <div className="flex items-center justify-end h-28 border-b border-[#C0C0C0]/20 px-3">
            <div className="flex flex-col items-end">
              <AssetLogo variant="large" />
            </div>
          </div>
          <div className="flex flex-col flex-grow px-4 py-4">
            <div className="text-xs font-semibold text-[#2E2E2E]/60 tracking-wider mb-4 font-poppins">MAIN MENU</div>
            <SidebarItem 
              href="/" 
              icon={<Home size={18} />} 
              label="Dashboard" 
              active={location === '/'} 
            />
            <SidebarItem 
              href="/properties" 
              icon={<Building size={18} />} 
              label="Properties" 
              active={location === '/properties'} 
            />
            <SidebarItem 
              href="/property-certification" 
              icon={<Award size={18} className="text-amber-500" />} 
              label="Certification" 
              active={location === '/property-certification'} 
            />
            <SidebarItem 
              href="/marketplace" 
              icon={<Store size={18} />} 
              label="Marketplace" 
              active={location === '/marketplace'} 
            />
            <SidebarItem 
              href="/bookings" 
              icon={<Calendar size={18} />} 
              label="Bookings" 
              active={location === '/bookings'} 
            />
            <SidebarItem 
              href="/tasks" 
              icon={<CheckSquare size={18} />} 
              label="Tasks" 
              active={location === '/tasks'} 
            />
            <SidebarItem 
              href="/messages" 
              icon={<MessageSquare size={18} />} 
              label="Messages" 
              active={location === '/messages'} 
              badge={4}
            />
            <SidebarItem 
              href="/sustainability" 
              icon={<Leaf size={18} className="text-emerald-500" />} 
              label="Sustainability" 
              active={location === '/sustainability'} 
            />
            
            <SidebarItem 
              href="/smart-home" 
              icon={<ToggleRight size={18} className="text-cyan-500" />} 
              label="Smart Home" 
              active={location === '/smart-home'} 
            />
            
            {/* For debugging only - temporarily showing admin panel regardless of permission */}
            <SidebarItem 
              href="/admin" 
              icon={<ShieldCheck size={18} className="text-purple-500" />} 
              label="Admin Panel" 
              active={location === '/admin'} 
            />
            {/* Original conditional rendering:
            {permissions.canAccessAdminPanel && (
              <SidebarItem 
                href="/admin" 
                icon={<ShieldCheck size={18} className="text-purple-500" />} 
                label="Admin Panel" 
                active={location === '/admin'} 
              />
            )}
            */}
            
            <SidebarItem 
              href="/guest" 
              icon={<Users size={18} className="text-blue-500" />} 
              label="Guest Portal" 
              active={location === '/guest'} 
            />
            
            <div className="mt-auto">
              <div className="text-xs font-semibold text-brand-text/60 tracking-wider mb-4 font-poppins">ACCOUNT</div>
              <SidebarItem 
                href="/settings" 
                icon={<Settings size={18} />} 
                label="Settings" 
                active={location === '/settings'} 
              />
              <SidebarItem 
                href="/help" 
                icon={<HelpCircle size={18} />} 
                label="Help" 
                active={location === '/help'} 
              />
              <div 
                className="flex items-center px-4 py-3 mb-2 rounded-lg hover:bg-brand/5 transition-all cursor-pointer"
                onClick={handleLogout}
              >
                <span className="mr-3 text-brand-text/80">
                  <LogOut size={18} />
                </span>
                <span className="text-brand-text/90">Logout</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white z-10 border-b border-[#C0C0C0]">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Mobile Logo - Right Aligned */}
              <div className="flex-1 flex justify-end md:hidden">
                <AssetLogo variant="small" />
              </div>
              
              {/* Centered title text - replaces logo in header */}
              <div className="hidden md:block flex-1 text-center">
                <h1 className="text-xl font-semibold text-brand-text font-poppins">Argento Homes Portal</h1>
              </div>
              
              {/* User controls - Right aligned when on desktop */}
              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="text-brand-text rounded-full hover:bg-brand/10">
                  <span className="sr-only">Notifications</span>
                  <span className="relative">
                    <span className="absolute top-0 right-0 w-2 h-2 bg-brand rounded-full"></span>
                    <span className="absolute top-0 right-0 w-2 h-2 bg-brand rounded-full animate-ping"></span>
                  </span>
                  <span className="i-lucide-bell h-5 w-5"></span>
                </Button>
                <div className="ml-4 relative flex items-center">
                  <div className="h-8 w-8 rounded-full bg-brand text-white flex items-center justify-center shadow-sm">
                    <span className="text-sm font-medium">{userInitials}</span>
                  </div>
                  <span className="ml-2 text-sm font-medium text-brand-text hidden md:block">
                    {user?.fullName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile Navigation (visible on small screens) */}
      <MobileNav currentPath={location} />
    </div>
  );
};

export default SidebarLayout;
