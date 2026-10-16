import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { SustainabilityMetric, Property, insertSustainabilityMetricSchema } from '@shared/schema';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import SidebarLayout from '@/components/layouts/sidebar-layout';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Leaf,
  Droplets,
  Trash2,
  BarChart3,
  RefreshCw,
  Building,
  BadgeCheck,
  Info,
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const sustainabilityFormSchema = insertSustainabilityMetricSchema.extend({
  propertyId: z.number().min(1, {
    message: 'Please select a property',
  }),
  energyEfficiency: z.number().min(0).max(100),
  waterConservation: z.number().min(0).max(100),
  wasteReduction: z.number().min(0).max(100),
});

type SustainabilityFormValues = z.infer<typeof sustainabilityFormSchema>;

export default function SustainabilityPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const [calculatingScore, setCalculatingScore] = useState(false);
  const { toast } = useToast();

  const form = useForm<SustainabilityFormValues>({
    resolver: zodResolver(sustainabilityFormSchema),
    defaultValues: {
      propertyId: 0,
      energyEfficiency: 0,
      waterConservation: 0,
      wasteReduction: 0,
    },
  });

  const { data: metrics = [], isLoading: isLoadingMetrics } = useQuery<SustainabilityMetric[]>({
    queryKey: ['/api/sustainability'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: properties = [], isLoading: isLoadingProperties } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const createMetricMutation = useMutation({
    mutationFn: async (data: SustainabilityFormValues) => {
      const res = await apiRequest('POST', '/api/sustainability', data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sustainability'] });
      setOpenDialog(false);
      form.reset();
      toast({
        title: 'Metrics updated',
        description: 'Sustainability metrics have been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  function onSubmit(data: SustainabilityFormValues) {
    createMetricMutation.mutate(data);
  }

  function getPropertyMetrics(propertyId: number) {
    return metrics.find(m => m.propertyId === propertyId);
  }

  function getPropertyName(propertyId: number) {
    const property = properties.find(p => p.id === propertyId);
    return property ? property.name : 'Unknown Property';
  }

  function getOverallScore(metric: SustainabilityMetric) {
    const energy = metric.energyEfficiency || 0;
    const water = metric.waterConservation || 0;
    const waste = metric.wasteReduction || 0;
    return Math.round((energy + water + waste) / 3);
  }

  function getScoreColor(score: number) {
    if (score >= 80) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  }

  function getScoreLabel(score: number) {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Average';
    if (score >= 20) return 'Poor';
    return 'Critical';
  }

  const handleSelectProperty = (propertyId: number) => {
    setSelectedProperty(propertyId);
    const existingMetric = getPropertyMetrics(propertyId);
    if (existingMetric) {
      form.setValue('propertyId', propertyId);
      form.setValue('energyEfficiency', existingMetric.energyEfficiency || 0);
      form.setValue('waterConservation', existingMetric.waterConservation || 0);
      form.setValue('wasteReduction', existingMetric.wasteReduction || 0);
    } else {
      form.setValue('propertyId', propertyId);
      form.setValue('energyEfficiency', 0);
      form.setValue('waterConservation', 0);
      form.setValue('wasteReduction', 0);
    }
    setOpenDialog(true);
  };

  return (
    <SidebarLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sustainability Tracker</h1>
            <p className="text-gray-500">Monitor and improve the sustainability metrics of your properties</p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="mb-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Leaf className="h-5 w-5 mr-2 text-green-500" />
                    Avg. Energy Efficiency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {metrics.length > 0 
                      ? Math.round(metrics.reduce((sum, m) => sum + (m.energyEfficiency || 0), 0) / metrics.length)
                      : 0}%
                  </div>
                  <Progress 
                    value={metrics.length > 0 
                      ? Math.round(metrics.reduce((sum, m) => sum + (m.energyEfficiency || 0), 0) / metrics.length)
                      : 0} 
                    className="h-2 mt-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Droplets className="h-5 w-5 mr-2 text-blue-500" />
                    Avg. Water Conservation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {metrics.length > 0 
                      ? Math.round(metrics.reduce((sum, m) => sum + (m.waterConservation || 0), 0) / metrics.length)
                      : 0}%
                  </div>
                  <Progress 
                    value={metrics.length > 0 
                      ? Math.round(metrics.reduce((sum, m) => sum + (m.waterConservation || 0), 0) / metrics.length)
                      : 0} 
                    className="h-2 mt-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <RefreshCw className="h-5 w-5 mr-2 text-purple-500" />
                    Avg. Waste Reduction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {metrics.length > 0 
                      ? Math.round(metrics.reduce((sum, m) => sum + (m.wasteReduction || 0), 0) / metrics.length)
                      : 0}%
                  </div>
                  <Progress 
                    value={metrics.length > 0 
                      ? Math.round(metrics.reduce((sum, m) => sum + (m.wasteReduction || 0), 0) / metrics.length)
                      : 0} 
                    className="h-2 mt-2"
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Sustainability Summary</h3>
              
              {metrics.length === 0 ? (
                <div className="text-center py-8">
                  <Leaf className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No sustainability data</h3>
                  <p className="text-gray-500 mb-4">
                    Start by adding sustainability metrics to your properties.
                  </p>
                  <Button onClick={() => properties.length > 0 && handleSelectProperty(properties[0].id)}>
                    Add Metrics
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-medium flex items-center">
                        <BadgeCheck className="h-5 w-5 mr-2 text-green-500" />
                        Most Sustainable Property
                      </h4>
                      {(() => {
                        if (metrics.length === 0) return null;
                        const bestMetric = metrics.reduce((best, current) => 
                          getOverallScore(current) > getOverallScore(best) ? current : best, metrics[0]);
                        return (
                          <div className="mt-2">
                            <div className="font-semibold">{getPropertyName(bestMetric.propertyId)}</div>
                            <div className="flex items-center mt-1">
                              <div className="mr-2">Overall Score:</div>
                              <div className={`font-bold ${getScoreColor(getOverallScore(bestMetric))}`}>
                                {getOverallScore(bestMetric)}%
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="bg-red-50 rounded-lg p-4">
                      <h4 className="font-medium flex items-center">
                        <Info className="h-5 w-5 mr-2 text-red-500" />
                        Needs Improvement
                      </h4>
                      {(() => {
                        if (metrics.length === 0) return null;
                        const worstMetric = metrics.reduce((worst, current) => 
                          getOverallScore(current) < getOverallScore(worst) ? current : worst, metrics[0]);
                        return (
                          <div className="mt-2">
                            <div className="font-semibold">{getPropertyName(worstMetric.propertyId)}</div>
                            <div className="flex items-center mt-1">
                              <div className="mr-2">Overall Score:</div>
                              <div className={`font-bold ${getScoreColor(getOverallScore(worstMetric))}`}>
                                {getOverallScore(worstMetric)}%
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="properties" className="pt-4">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">Property Sustainability Metrics</h3>
                <p className="text-sm text-gray-500">View and update sustainability metrics for your properties</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {properties.map((property) => {
                  const metrics = getPropertyMetrics(property.id);
                  const hasMetrics = !!metrics;
                  const overallScore = hasMetrics ? getOverallScore(metrics) : 0;
                  
                  return (
                    <Card key={property.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center">
                          <Building className="h-5 w-5 mr-2 text-blue-500" />
                          {property.name}
                        </CardTitle>
                        <CardDescription>{property.location}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-0">
                        {hasMetrics ? (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Overall Score</span>
                              <div className="flex items-center">
                                <span className={`font-bold text-xl ${getScoreColor(overallScore)} mr-2`}>
                                  {overallScore}%
                                </span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-6 w-6" 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleSelectProperty(property.id);
                                        }}
                                      >
                                        <RefreshCw className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Update metrics</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Energy Efficiency</span>
                                <span>{metrics.energyEfficiency || 0}%</span>
                              </div>
                              <Progress value={metrics.energyEfficiency || 0} className="h-1" />
                              
                              <div className="flex justify-between text-sm">
                                <span>Water Conservation</span>
                                <span>{metrics.waterConservation || 0}%</span>
                              </div>
                              <Progress value={metrics.waterConservation || 0} className="h-1" />
                              
                              <div className="flex justify-between text-sm">
                                <span>Waste Reduction</span>
                                <span>{metrics.wasteReduction || 0}%</span>
                              </div>
                              <Progress value={metrics.wasteReduction || 0} className="h-1" />
                            </div>
                          </div>
                        ) : (
                          <div className="py-4 text-center">
                            <p className="text-gray-500 mb-2">No sustainability data available</p>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleSelectProperty(property.id)}
                        >
                          {hasMetrics ? 'Update Metrics' : 'Add Metrics'}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}

                {properties.length === 0 && !isLoadingProperties && (
                  <div className="col-span-3 text-center py-8">
                    <Building className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No properties found</h3>
                    <p className="text-gray-500">
                      Add properties to start tracking sustainability metrics.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="pt-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Sustainability Recommendations</h3>
              
              <div className="space-y-6">
                <div className="border-l-4 border-green-500 pl-4 py-1">
                  <h4 className="text-lg font-medium flex items-center">
                    <Leaf className="h-5 w-5 mr-2 text-green-500" />
                    Energy Efficiency Recommendations
                  </h4>
                  <ul className="mt-2 space-y-2 list-disc list-inside text-gray-700">
                    <li>Install smart thermostats to optimize heating and cooling schedules</li>
                    <li>Upgrade to LED lighting throughout all properties</li>
                    <li>Improve insulation and seal air leaks in windows and doors</li>
                    <li>Consider solar panel installation for long-term energy savings</li>
                    <li>Set up automated energy monitoring systems</li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-500 pl-4 py-1">
                  <h4 className="text-lg font-medium flex items-center">
                    <Droplets className="h-5 w-5 mr-2 text-blue-500" />
                    Water Conservation Recommendations
                  </h4>
                  <ul className="mt-2 space-y-2 list-disc list-inside text-gray-700">
                    <li>Install low-flow toilets, faucets, and showerheads</li>
                    <li>Implement a rainwater harvesting system for landscaping</li>
                    <li>Fix any leaks promptly and conduct regular plumbing maintenance</li>
                    <li>Install smart water meters to detect unusual usage</li>
                    <li>Use drought-resistant landscaping to reduce irrigation needs</li>
                  </ul>
                </div>

                <div className="border-l-4 border-purple-500 pl-4 py-1">
                  <h4 className="text-lg font-medium flex items-center">
                    <RefreshCw className="h-5 w-5 mr-2 text-purple-500" />
                    Waste Reduction Recommendations
                  </h4>
                  <ul className="mt-2 space-y-2 list-disc list-inside text-gray-700">
                    <li>Set up comprehensive recycling programs in all properties</li>
                    <li>Provide composting options for organic waste</li>
                    <li>Use recycled or sustainable materials for renovations</li>
                    <li>Implement digital documentation to reduce paper usage</li>
                    <li>Partner with recycling services for proper disposal of large items</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Update metrics dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Sustainability Metrics</DialogTitle>
            <DialogDescription>
              Adjust the sustainability metrics for {selectedProperty ? getPropertyName(selectedProperty) : 'your property'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="energyEfficiency"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel>Energy Efficiency</FormLabel>
                      <span className="text-sm font-medium">{field.value}%</span>
                    </div>
                    <FormControl>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[field.value]}
                        onValueChange={(values) => field.onChange(values[0])}
                      />
                    </FormControl>
                    <FormDescription>
                      Measure of energy-saving technologies and practices
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="waterConservation"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel>Water Conservation</FormLabel>
                      <span className="text-sm font-medium">{field.value}%</span>
                    </div>
                    <FormControl>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[field.value]}
                        onValueChange={(values) => field.onChange(values[0])}
                      />
                    </FormControl>
                    <FormDescription>
                      Measure of water-saving fixtures and practices
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="wasteReduction"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel>Waste Reduction</FormLabel>
                      <span className="text-sm font-medium">{field.value}%</span>
                    </div>
                    <FormControl>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[field.value]}
                        onValueChange={(values) => field.onChange(values[0])}
                      />
                    </FormControl>
                    <FormDescription>
                      Measure of recycling and waste management practices
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex flex-col sm:flex-row gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setCalculatingScore(true);
                      
                      // Calculate overall score based on current form values
                      const energy = form.getValues('energyEfficiency') || 0;
                      const water = form.getValues('waterConservation') || 0;
                      const waste = form.getValues('wasteReduction') || 0;
                      const score = Math.round((energy + water + waste) / 3);
                      
                      // Show notification with calculated score
                      setTimeout(() => {
                        setCalculatingScore(false);
                        toast({
                          title: 'Score Calculated',
                          description: `The overall sustainability score is ${score}% (${getScoreLabel(score)})`,
                        });
                      }, 500);
                    }}
                    disabled={calculatingScore || createMetricMutation.isPending}
                    className="w-full sm:w-auto"
                  >
                    {calculatingScore ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Calculating...
                      </>
                    ) : (
                      <>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Calculate Score
                      </>
                    )}
                  </Button>
                </div>
                <Button
                  type="submit"
                  disabled={createMetricMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  {createMetricMutation.isPending ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-b-2 border-current"></div>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </SidebarLayout>
  );
}