import { Link } from 'wouter';
import { usePermissions } from '@/hooks/use-permissions';
import { AssetLogo } from '@/components/ui/asset-logo';
import { 
  Home, 
  Building, 
  Store, 
  MessageSquare, 
  User, 
  Calendar, 
  ShieldCheck, 
  CheckSquare, 
  Leaf,
  Users,
  ToggleRight,
  Award
} from 'lucide-react';

type MobileNavProps = {
  currentPath: string;
};

const MobileNav = ({ currentPath }: MobileNavProps) => {
  const { permissions } = usePermissions();
  // For mobile, we need to limit the number of items shown to avoid overcrowding
  // We'll use a scrollable horizontal layout to fit all items
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-brand z-50 md:hidden border-t border-brand-border/20">
      <div className="flex overflow-x-auto items-center h-20 text-brand-text px-1">
        {/* Home button with logo icon for brand recognition */}
        <Link href="/">
          <a className={`flex flex-col items-center justify-center px-4 h-full min-w-[72px] ${currentPath === '/' ? 'text-brand' : 'text-brand-text/80'}`}>
            <Home size={22} className={currentPath === '/' ? 'text-brand' : 'text-brand-text/80'} />
            <span className="text-xs mt-1 whitespace-nowrap font-medium">Home</span>
          </a>
        </Link>
        <NavItem 
          href="/properties"
          icon={<Building size={20} />}
          label="Properties"
          isActive={currentPath === '/properties'}
        />
        <NavItem 
          href="/properties/certification"
          icon={<Award size={20} />}
          label="Certification"
          isActive={currentPath === '/properties/certification'}
        />
        <NavItem 
          href="/marketplace"
          icon={<Store size={20} />}
          label="Marketplace"
          isActive={currentPath === '/marketplace'}
        />
        <NavItem 
          href="/bookings"
          icon={<Calendar size={20} />}
          label="Bookings"
          isActive={currentPath === '/bookings'}
        />
        <NavItem 
          href="/tasks"
          icon={<CheckSquare size={20} />}
          label="Tasks"
          isActive={currentPath === '/tasks'}
        />
        <NavItem 
          href="/messages"
          icon={<MessageSquare size={20} />}
          label="Messages"
          isActive={currentPath === '/messages'}
        />
        <NavItem 
          href="/sustainability"
          icon={<Leaf size={20} />}
          label="Sustainability"
          isActive={currentPath === '/sustainability'}
        />
        <NavItem 
          href="/smart-home"
          icon={<ToggleRight size={20} />}
          label="Smart Home"
          isActive={currentPath === '/smart-home'}
        />
        {permissions.canAccessAdminPanel && (
          <NavItem 
            href="/admin"
            icon={<ShieldCheck size={20} />}
            label="Admin"
            isActive={currentPath === '/admin'}
          />
        )}
        <NavItem 
          href="/guest"
          icon={<Users size={20} />}
          label="Guest Portal"
          isActive={currentPath === '/guest'}
        />
        <NavItem 
          href="/settings"
          icon={<User size={20} />}
          label="Profile"
          isActive={currentPath === '/settings'}
        />
      </div>
    </div>
  );
};

type NavItemProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
};

const NavItem = ({ href, icon, label, isActive }: NavItemProps) => (
  <Link href={href}>
    <a className={`flex flex-col items-center justify-center px-3 h-full min-w-[64px] ${isActive ? 'text-brand' : 'text-brand-text/80'}`}>
      <span className={`text-lg ${isActive ? 'text-brand' : 'text-brand-text/80'}`}>{icon}</span>
      <span className={`text-xs mt-1 whitespace-nowrap ${isActive ? 'font-medium' : ''}`}>{label}</span>
    </a>
  </Link>
);

export default MobileNav;
