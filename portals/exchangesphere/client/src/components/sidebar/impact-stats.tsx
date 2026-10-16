import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/progress-bar';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Exchange, BucketListItem } from '@shared/schema';

interface ImpactStatsProps {
  userId: number;
}

export function ImpactStats({ userId }: ImpactStatsProps) {
  const { data: exchanges } = useQuery<Exchange[]>({
    queryKey: ['/api/exchanges'],
    enabled: !!userId,
  });
  
  const { data: bucketList } = useQuery<BucketListItem[]>({
    queryKey: ['/api/bucket-list'],
    enabled: !!userId,
  });
  
  const completedExchanges = exchanges?.filter(ex => ex.status === 'completed') || [];
  const completedBucketItems = bucketList?.filter(item => item.completed) || [];
  
  // Calculate total time in hours from completed exchanges
  const timeCredits = completedExchanges.reduce((total, exchange) => {
    return total + (exchange.duration || 0) / 60;
  }, 0);
  
  return (
    <Card className="bg-white rounded-xl shadow-sm p-5 mb-6">
      <CardContent className="p-0">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Your Impact</h3>
        <div className="space-y-4">
          <ProgressBar
            value={completedExchanges.length}
            max={50}
            label="Exchanges"
            color="primary"
          />
          
          <ProgressBar
            value={Math.round(timeCredits)}
            max={60}
            label="Time Credits"
            color="secondary"
          />
          
          <ProgressBar
            value={completedBucketItems.length}
            max={bucketList?.length || 10}
            label="Bucket List"
            color="accent"
          />
          
          <div className="pt-2 flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600">
              <CheckCircle2 className="h-5 w-5 mr-1 text-green-500" />
              <span>3 Badges Earned</span>
            </div>
            <Button variant="link" className="text-primary hover:text-green-700 p-0">
              View All
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
