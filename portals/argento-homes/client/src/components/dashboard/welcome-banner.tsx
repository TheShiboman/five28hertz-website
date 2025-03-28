import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { Building, ArrowRight } from 'lucide-react';

interface WelcomeBannerProps {
  onAddProperty?: () => void;
  onViewProperties?: () => void;
}

const WelcomeBanner = ({ onAddProperty, onViewProperties }: WelcomeBannerProps) => {
  const { user } = useAuth();
  
  // Get first name
  const firstName = user?.fullName ? user.fullName.split(' ')[0] : 'there';

  return (
    <div className="bg-[#EAEAEA] rounded-lg p-6 md:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-semibold text-[#2E2E2E] font-poppins mb-2">
            Welcome back, {firstName}!
          </h2>
          <p className="text-[#2E2E2E]/80 max-w-xl">
            Manage your properties, review bookings, and connect with vendors all in one place. 
            Need help getting started? Check out our <span className="text-[#2ECC71] font-medium">quick guide</span>.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 self-stretch sm:self-auto">
          {onAddProperty && (
            <Button 
              className="bg-[#3498DB] hover:bg-[#3498DB]/90 text-white rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition-all"
              onClick={onAddProperty}
            >
              <Building className="mr-2 h-4 w-4" />
              Add Property
            </Button>
          )}
          
          {onViewProperties && (
            <Button 
              className="bg-[#2ECC71] hover:bg-[#2ECC71]/90 text-white rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition-all"
              onClick={onViewProperties}
            >
              View Properties
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;