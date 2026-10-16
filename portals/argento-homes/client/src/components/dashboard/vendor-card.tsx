import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VendorCardProps {
  icon: React.ReactNode;
  name: string;
  rating: number;
  reviewCount: number;
  description: string;
  onContact: () => void;
  onAssignTask?: () => void;
  onViewProfile?: () => void;
}

const VendorCard = ({ 
  icon, 
  name, 
  rating, 
  reviewCount, 
  description, 
  onContact,
  onAssignTask,
  onViewProfile
}: VendorCardProps) => {
  return (
    <div className="bg-white shadow-[0_2px_4px_rgba(0,0,0,0.05)] rounded-lg overflow-hidden group relative cursor-pointer">
      {/* Overlay for clickable behavior */}
      {onViewProfile && (
        <div 
          className="absolute inset-0 z-10 opacity-0" 
          onClick={onViewProfile}
          aria-label="View vendor profile"
        ></div>
      )}
      
      <div className="p-5">
        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white">
            {icon}
          </div>
          <div className="ml-3">
            <h4 className="font-semibold text-[#2E2E2E]">{name}</h4>
            <div className="flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    className={i < Math.floor(rating) ? "text-[#F39C12]" : "text-gray-300"} 
                    fill={i < Math.floor(rating) ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-1">({reviewCount})</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-[#2E2E2E]/80 mb-4">{description}</p>
        
        {/* View Profile Link - made visible on hover */}
        {onViewProfile && (
          <div className="text-center mb-3">
            <button 
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium transition-all z-20 relative"
              onClick={onViewProfile}
            >
              View Full Profile
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-2 relative z-20">
          <Button 
            className="py-2 bg-[#3498DB] text-white hover:bg-[#3498DB]/90 rounded-lg shadow-sm"
            onClick={(e) => {
              e.stopPropagation();
              onContact();
            }}
          >
            Contact
          </Button>
          <Button 
            className="py-2 bg-[#2ECC71] text-white hover:bg-[#2ECC71]/90 rounded-lg shadow-sm"
            onClick={(e) => {
              e.stopPropagation();
              if (onAssignTask) onAssignTask();
            }}
          >
            Assign Task
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VendorCard;
