import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Leaf } from 'lucide-react';

interface SustainabilityTrackerProps {
  energyEfficiency: number;
  waterConservation: number;
  wasteReduction: number;
  onImprove: () => void;
}

const SustainabilityTracker = ({ 
  energyEfficiency, 
  waterConservation, 
  wasteReduction,
  onImprove
}: SustainabilityTrackerProps) => {
  return (
    <div className="p-5">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <div className="text-sm font-medium text-gray-700">Energy Efficiency</div>
          <div className="text-sm font-medium text-charcoal">{energyEfficiency}%</div>
        </div>
        <Progress value={energyEfficiency} className="h-2 w-full bg-gray-200" indicatorClassName="bg-emerald-500" />
      </div>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <div className="text-sm font-medium text-gray-700">Water Conservation</div>
          <div className="text-sm font-medium text-charcoal">{waterConservation}%</div>
        </div>
        <Progress value={waterConservation} className="h-2 w-full bg-gray-200" indicatorClassName="bg-emerald-500" />
      </div>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <div className="text-sm font-medium text-gray-700">Waste Reduction</div>
          <div className="text-sm font-medium text-charcoal">{wasteReduction}%</div>
        </div>
        <Progress value={wasteReduction} className="h-2 w-full bg-gray-200" indicatorClassName="bg-emerald-500" />
      </div>
      <div className="pt-2 flex items-center justify-center">
        <Button 
          className="px-4 py-2 bg-emerald-500 text-white hover:bg-emerald-600"
          onClick={onImprove}
        >
          <Leaf className="mr-2" size={16} />
          Improve Sustainability
        </Button>
      </div>
    </div>
  );
};

export default SustainabilityTracker;
