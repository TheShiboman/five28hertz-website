import { Progress } from '@/components/ui/progress';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyStatus } from '@/pages/properties';

interface PropertyCardProps {
  image: string;
  name: string;
  location: string;
  status: PropertyStatus;
  beds: number;
  baths: number;
  sqft: number;
  rating?: {
    value: number;
    count: number;
  };
  price?: string;
  certificationProgress?: number;
  onViewDetails?: () => void;
}

const PropertyCard = ({ 
  image, 
  name, 
  location, 
  status, 
  beds, 
  baths, 
  sqft, 
  rating, 
  price,
  certificationProgress,
  onViewDetails
}: PropertyCardProps) => {
  return (
    <div className="flex flex-col md:flex-row mb-5 border-b pb-5">
      <div className="w-full md:w-1/3 mb-3 md:mb-0">
        <img 
          src={image} 
          alt={name} 
          className="rounded-lg w-full h-36 object-cover"
        />
      </div>
      <div className="w-full md:w-2/3 md:pl-4 flex flex-col">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-lg font-semibold text-charcoal">{name}</h4>
            <p className="text-sm text-gray-500">{location}</p>
          </div>
          <span className={`
            text-xs px-2 py-1 rounded 
            ${status === 'certified' ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-700'}
          `}>
            {status === 'certified' ? 'Certified' : 'In Progress'}
          </span>
        </div>
        <div className="flex items-center mt-2 text-sm text-gray-600">
          <span className="mr-3"><i className="fas fa-bed mr-1"></i> {beds} beds</span>
          <span className="mr-3"><i className="fas fa-bath mr-1"></i> {baths} baths</span>
          <span><i className="fas fa-ruler-combined mr-1"></i> {sqft} sqft</span>
        </div>
        <div className="flex items-center justify-between mt-auto pt-3">
          {status === 'certified' && rating ? (
            <div className="flex items-center text-sm">
              <Star className="text-yellow-400 mr-1" size={16} />
              <span className="font-medium">{rating.value}</span>
              <span className="text-gray-500 ml-1">({rating.count} reviews)</span>
            </div>
          ) : (
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 mb-1">Certification Progress</span>
              <Progress value={certificationProgress} className="h-2 w-full" />
            </div>
          )}
          
          {status === 'certified' && price ? (
            <div className="text-sm">
              <span className="font-semibold text-blue-500">${price}</span>
              <span className="text-gray-500">/night</span>
            </div>
          ) : (
            <Button 
              variant="ghost" 
              className="text-sm text-blue-500 hover:text-blue-700 font-medium"
              onClick={onViewDetails}
            >
              Continue
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
