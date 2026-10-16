import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Property } from '@shared/schema';
import { useAuth } from '@/hooks/use-auth';
import SidebarLayout from '@/components/layouts/sidebar-layout';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { 
  Wifi, 
  Lightbulb, 
  Lock, 
  Thermometer, 
  Clock, 
  Info, 
  ToggleLeft, 
  ToggleRight, 
  RefreshCw,
  ArrowRight,
  Building,
  BarChart3
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Types for smart home features
interface SmartHomeFeature {
  id: string;
  name: string;
  type: 'wifi' | 'light' | 'lock' | 'thermostat';
  enabled: boolean;
  value?: number; // For thermostat
  location?: string; // Room or area
  lastUpdated: Date;
}

// Types for activity logs
interface ActivityLog {
  id: string;
  feature: string;
  action: string; // 'turned on', 'turned off', 'adjusted'
  timestamp: Date;
  user: string;
}

export default function SmartHomePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  
  // Mock data for smart home features (in real app would be fetched from API)
  const [features, setFeatures] = useState<SmartHomeFeature[]>([
    {
      id: '1',
      name: 'Main WiFi',
      type: 'wifi',
      enabled: true,
      location: 'Whole Property',
      lastUpdated: new Date(),
    },
    {
      id: '2',
      name: 'Guest WiFi',
      type: 'wifi',
      enabled: false,
      location: 'Whole Property',
      lastUpdated: new Date(),
    },
    {
      id: '3',
      name: 'Living Room Lights',
      type: 'light',
      enabled: true,
      location: 'Living Room',
      lastUpdated: new Date(),
    },
    {
      id: '4',
      name: 'Kitchen Lights',
      type: 'light',
      enabled: false,
      location: 'Kitchen',
      lastUpdated: new Date(),
    },
    {
      id: '5',
      name: 'Bedroom Lights',
      type: 'light',
      enabled: false,
      location: 'Master Bedroom',
      lastUpdated: new Date(),
    },
    {
      id: '6',
      name: 'Front Door Lock',
      type: 'lock',
      enabled: true, // true = locked, false = unlocked
      location: 'Main Entrance',
      lastUpdated: new Date(),
    },
    {
      id: '7',
      name: 'Back Door Lock',
      type: 'lock',
      enabled: true,
      location: 'Back Entrance',
      lastUpdated: new Date(),
    },
    {
      id: '8',
      name: 'Main Thermostat',
      type: 'thermostat',
      enabled: true,
      value: 72,
      location: 'Living Room',
      lastUpdated: new Date(),
    },
  ]);
  
  // Activity logs
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    {
      id: '1',
      feature: 'Main WiFi',
      action: 'turned on',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      user: 'System',
    },
    {
      id: '2',
      feature: 'Front Door Lock',
      action: 'locked',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      user: 'System',
    },
  ]);
  
  // Get user properties
  const { data: properties = [], isLoading: isLoadingProperties } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
    enabled: !!user,
  });
  
  // Initialize selected property
  useEffect(() => {
    if (properties && properties.length > 0 && !selectedProperty) {
      setSelectedProperty(properties[0].id);
    }
  }, [properties, selectedProperty]);
  
  // Toggle a feature on/off
  function toggleFeature(id: string) {
    setFeatures(prevFeatures => 
      prevFeatures.map(feature => {
        if (feature.id === id) {
          // Create an activity log entry
          const action = feature.type === 'lock'
            ? (!feature.enabled ? 'locked' : 'unlocked')
            : (!feature.enabled ? 'turned on' : 'turned off');
            
          const newLog: ActivityLog = {
            id: Date.now().toString(),
            feature: feature.name,
            action,
            timestamp: new Date(),
            user: user?.username || 'Unknown',
          };
          
          setActivityLogs(prev => [newLog, ...prev]);
          
          // Show toast message
          toast({
            title: `${feature.name} ${action}`,
            description: `The ${feature.name.toLowerCase()} has been ${action}`,
          });
          
          return {
            ...feature,
            enabled: !feature.enabled,
            lastUpdated: new Date(),
          };
        }
        return feature;
      })
    );
  }
  
  // Adjust thermostat
  function adjustThermostat(id: string, value: number) {
    setFeatures(prevFeatures => 
      prevFeatures.map(feature => {
        if (feature.id === id) {
          // Create an activity log entry
          const newLog: ActivityLog = {
            id: Date.now().toString(),
            feature: feature.name,
            action: `set to ${value}°F`,
            timestamp: new Date(),
            user: user?.username || 'Unknown',
          };
          
          setActivityLogs(prev => [newLog, ...prev]);
          
          // Show toast message
          toast({
            title: `${feature.name} adjusted`,
            description: `The temperature has been set to ${value}°F`,
          });
          
          return {
            ...feature,
            value,
            lastUpdated: new Date(),
          };
        }
        return feature;
      })
    );
  }
  
  // Get the icon for a feature type
  function getFeatureIcon(type: string, enabled: boolean, className = "h-5 w-5") {
    switch(type) {
      case 'wifi':
        return <Wifi className={`${className} ${enabled ? 'text-green-500' : 'text-gray-400'}`} />;
      case 'light':
        return <Lightbulb className={`${className} ${enabled ? 'text-yellow-400' : 'text-gray-400'}`} />;
      case 'lock':
        return <Lock className={`${className} ${enabled ? 'text-blue-500' : 'text-gray-400'}`} />;
      case 'thermostat':
        return <Thermometer className={`${className} ${enabled ? 'text-red-500' : 'text-gray-400'}`} />;
      default:
        return <Info className={className} />;
    }
  }
  
  // Get the status text for a feature
  function getFeatureStatus(feature: SmartHomeFeature) {
    switch(feature.type) {
      case 'wifi':
        return feature.enabled ? 'Online' : 'Offline';
      case 'light':
        return feature.enabled ? 'On' : 'Off';
      case 'lock':
        return feature.enabled ? 'Locked' : 'Unlocked';
      case 'thermostat':
        return feature.enabled ? `${feature.value}°F` : 'Off';
      default:
        return feature.enabled ? 'On' : 'Off';
    }
  }
  
  // Filter features by type
  function getFeaturesByType(type: string) {
    return features.filter(feature => feature.type === type);
  }
  
  return (
    <SidebarLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Smart Home Controls</h1>
            <p className="text-gray-500">Monitor and control smart home features for your properties</p>
          </div>
          
          {properties && properties.length > 0 && (
            <div className="flex items-center">
              <Select
                value={selectedProperty?.toString()}
                onValueChange={(value) => setSelectedProperty(parseInt(value))}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select a property" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id.toString()}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All Devices</TabsTrigger>
            <TabsTrigger value="wifi">WiFi</TabsTrigger>
            <TabsTrigger value="lights">Lights</TabsTrigger>
            <TabsTrigger value="locks">Locks</TabsTrigger>
            <TabsTrigger value="climate">Thermostat</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <Card key={feature.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="flex items-center text-lg">
                        {getFeatureIcon(feature.type, feature.enabled, "h-5 w-5 mr-2")}
                        {feature.name}
                      </CardTitle>
                      <Badge variant={feature.enabled ? "default" : "outline"}>
                        {getFeatureStatus(feature)}
                      </Badge>
                    </div>
                    <CardDescription>{feature.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Last updated: {format(feature.lastUpdated, 'PP h:mm a')}
                      </span>
                      
                      {feature.type === 'thermostat' ? (
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => feature.value && adjustThermostat(feature.id, feature.value - 1)}
                            disabled={!feature.enabled || (feature.value && feature.value <= 60) ? true : false}
                          >
                            -
                          </Button>
                          <span className="text-lg font-medium w-12 text-center">
                            {feature.value}°F
                          </span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => feature.value && adjustThermostat(feature.id, feature.value + 1)}
                            disabled={!feature.enabled || (feature.value && feature.value >= 85) ? true : false}
                          >
                            +
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">
                            {feature.enabled ? 'On' : 'Off'}
                          </span>
                          <Switch
                            checked={feature.enabled}
                            onCheckedChange={() => toggleFeature(feature.id)}
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="wifi" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFeaturesByType('wifi').map((feature) => (
                <Card key={feature.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="flex items-center text-lg">
                        <Wifi className={`h-5 w-5 mr-2 ${feature.enabled ? 'text-green-500' : 'text-gray-400'}`} />
                        {feature.name}
                      </CardTitle>
                      <Badge variant={feature.enabled ? "default" : "outline"}>
                        {feature.enabled ? 'Online' : 'Offline'}
                      </Badge>
                    </div>
                    <CardDescription>{feature.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Last updated: {format(feature.lastUpdated, 'PP h:mm a')}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">
                          {feature.enabled ? 'On' : 'Off'}
                        </span>
                        <Switch
                          checked={feature.enabled}
                          onCheckedChange={() => toggleFeature(feature.id)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="lights" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFeaturesByType('light').map((feature) => (
                <Card key={feature.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="flex items-center text-lg">
                        <Lightbulb className={`h-5 w-5 mr-2 ${feature.enabled ? 'text-yellow-400' : 'text-gray-400'}`} />
                        {feature.name}
                      </CardTitle>
                      <Badge variant={feature.enabled ? "default" : "outline"}>
                        {feature.enabled ? 'On' : 'Off'}
                      </Badge>
                    </div>
                    <CardDescription>{feature.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Last updated: {format(feature.lastUpdated, 'PP h:mm a')}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">
                          {feature.enabled ? 'On' : 'Off'}
                        </span>
                        <Switch
                          checked={feature.enabled}
                          onCheckedChange={() => toggleFeature(feature.id)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="locks" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFeaturesByType('lock').map((feature) => (
                <Card key={feature.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="flex items-center text-lg">
                        <Lock className={`h-5 w-5 mr-2 ${feature.enabled ? 'text-blue-500' : 'text-gray-400'}`} />
                        {feature.name}
                      </CardTitle>
                      <Badge variant={feature.enabled ? "default" : "secondary"} className={feature.enabled ? "bg-blue-500" : ""}>
                        {feature.enabled ? 'Locked' : 'Unlocked'}
                      </Badge>
                    </div>
                    <CardDescription>{feature.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Last updated: {format(feature.lastUpdated, 'PP h:mm a')}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">
                          {feature.enabled ? 'Locked' : 'Unlocked'}
                        </span>
                        <Switch
                          checked={feature.enabled}
                          onCheckedChange={() => toggleFeature(feature.id)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="climate" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFeaturesByType('thermostat').map((feature) => (
                <Card key={feature.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="flex items-center text-lg">
                        <Thermometer className={`h-5 w-5 mr-2 ${feature.enabled ? 'text-red-500' : 'text-gray-400'}`} />
                        {feature.name}
                      </CardTitle>
                      <Badge variant={feature.enabled ? "default" : "outline"} className={feature.enabled ? "bg-red-500" : ""}>
                        {feature.enabled ? `${feature.value}°F` : 'Off'}
                      </Badge>
                    </div>
                    <CardDescription>{feature.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-500">
                        Last updated: {format(feature.lastUpdated, 'PP h:mm a')}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">
                          {feature.enabled ? 'On' : 'Off'}
                        </span>
                        <Switch
                          checked={feature.enabled}
                          onCheckedChange={() => toggleFeature(feature.id)}
                        />
                      </div>
                    </div>
                    
                    {feature.enabled && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Temperature</span>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => feature.value && adjustThermostat(feature.id, feature.value - 1)}
                              disabled={(feature.value && feature.value <= 60) ? true : false}
                            >
                              -
                            </Button>
                            <span className="text-lg font-medium w-12 text-center">
                              {feature.value}°F
                            </span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => feature.value && adjustThermostat(feature.id, feature.value + 1)}
                              disabled={(feature.value && feature.value >= 85) ? true : false}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="activity" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Activity Log</CardTitle>
                <CardDescription>
                  Recent smart home device activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityLogs.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No activity yet</h3>
                      <p className="text-gray-500">
                        Start interacting with your smart home devices to see activity here.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {activityLogs.map((log) => (
                        <div key={log.id} className="py-3 flex items-start">
                          <div className="mr-4 mt-0.5">
                            {log.action.includes('on') || log.action.includes('locked') ? (
                              <ToggleRight className="h-5 w-5 text-green-500" />
                            ) : log.action.includes('off') || log.action.includes('unlocked') ? (
                              <ToggleLeft className="h-5 w-5 text-gray-400" />
                            ) : log.action.includes('set') ? (
                              <Thermometer className="h-5 w-5 text-red-500" />
                            ) : (
                              <Info className="h-5 w-5 text-blue-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="font-medium">
                                {log.feature} {log.action}
                              </span>
                              <span className="text-sm text-gray-500">
                                {format(log.timestamp, 'h:mm a')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">
                              By: {log.user}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="outline" className="w-full" onClick={() => {
                  // Clear logs (in real app would be an API call)
                  if (confirm('Are you sure you want to clear activity logs?')) {
                    setActivityLogs([]);
                    toast({
                      title: 'Activity logs cleared',
                      description: 'All activity logs have been cleared.',
                    });
                  }
                }}>
                  Clear Activity Log
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
}