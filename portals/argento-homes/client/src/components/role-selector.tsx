import { useState } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useAuth } from '@/hooks/use-auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Home, Wrench, TrendingUp } from 'lucide-react';
import { UserRole } from '@shared/schema';

interface RoleSelectorProps {
  className?: string;
}

const RoleSelector = ({ className }: RoleSelectorProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>(user?.role || UserRole.PROPERTY_OWNER);

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
    // In a real implementation, this would update the user's role via an API call
    console.log('Role changed to:', value);
  };

  return (
    <div className={`${className || ''}`}>
      <div className="flex flex-wrap items-center justify-between">
        <h2 className="text-lg font-semibold text-charcoal">
          {user?.role === UserRole.PROPERTY_OWNER && 'Property Owner Dashboard'}
          {user?.role === UserRole.VENDOR && 'Vendor Dashboard'}
          {user?.role === UserRole.DEVELOPER && 'Developer/Investor Dashboard'}
        </h2>
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <span className="text-sm text-gray-500">Switch Role:</span>
          <Select value={user?.role} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-[180px] border-platinum">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={UserRole.PROPERTY_OWNER}>Property Owner</SelectItem>
                <SelectItem value={UserRole.VENDOR}>Vendor</SelectItem>
                <SelectItem value={UserRole.DEVELOPER}>Developer/Investor</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile Role Selector Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Your Role</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <RoleOption 
              icon={<Home size={24} />}
              title="Property Owner"
              description="Manage your properties and bookings"
              isSelected={selectedRole === UserRole.PROPERTY_OWNER}
              onClick={() => handleRoleChange(UserRole.PROPERTY_OWNER)}
            />
            <RoleOption 
              icon={<Wrench size={24} />}
              title="Vendor"
              description="Offer services and manage jobs"
              isSelected={selectedRole === UserRole.VENDOR}
              onClick={() => handleRoleChange(UserRole.VENDOR)}
            />
            <RoleOption 
              icon={<TrendingUp size={24} />}
              title="Developer/Investor"
              description="Discover opportunities and manage projects"
              isSelected={selectedRole === UserRole.DEVELOPER}
              onClick={() => handleRoleChange(UserRole.DEVELOPER)}
            />
          </div>
          <Button className="w-full" onClick={() => setOpen(false)}>
            Continue
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface RoleOptionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

const RoleOption = ({ icon, title, description, isSelected, onClick }: RoleOptionProps) => (
  <div 
    className={`p-4 border rounded-lg flex items-center text-left cursor-pointer ${
      isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
    }`}
    onClick={onClick}
  >
    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
      isSelected ? 'bg-blue-500 text-white' : 'bg-gray-200 text-charcoal'
    }`}>
      {icon}
    </div>
    <div>
      <h4 className="font-medium text-charcoal">{title}</h4>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  </div>
);

export default RoleSelector;
