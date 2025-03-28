import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Bed, Bath, Home, ArrowRight, Search, Filter, MapPin, Star, Calendar, CheckCircle, Zap, Leaf, Loader2, User, LogIn, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { Property } from '@shared/schema';
import { useAuth } from '@/hooks/use-auth';
import { usePermissions } from '@/hooks/use-permissions';

// Types for property and filter chips
type PropertyPreview = {
  id: number;
  name: string;
  location: string;
  imageUrl: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  rating: number;
  isCertified: boolean;
  hasSmartHome: boolean;
  isEcoFriendly: boolean;
};

type FilterChip = {
  id: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
};

// Define fallback demo properties first to avoid reference errors
const demoProperties: PropertyPreview[] = [
  {
    id: 1,
    name: "Modern Beachfront Villa",
    location: "Malibu, CA",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGx1eHVyeSUyMGhvbWV8ZW58MHx8MHx8fDA%3D",
    price: "$650/night",
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2800,
    rating: 4.9,
    isCertified: true,
    hasSmartHome: true,
    isEcoFriendly: true,
  },
  {
    id: 2,
    name: "Downtown Luxury Loft",
    location: "New York, NY",
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGx1eHVyeSUyMGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D",
    price: "$450/night",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1500,
    rating: 4.7,
    isCertified: true,
    hasSmartHome: true,
    isEcoFriendly: false,
  },
  {
    id: 3,
    name: "Mountain Retreat Cabin",
    location: "Aspen, CO",
    imageUrl: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FiaW58ZW58MHx8MHx8fDA%3D",
    price: "$380/night",
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1800,
    rating: 4.8,
    isCertified: false,
    hasSmartHome: false,
    isEcoFriendly: true,
  },
  {
    id: 4,
    name: "Lakeside Family Home",
    location: "Lake Tahoe, CA",
    imageUrl: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGFrZSUyMGhvdXNlfGVufDB8fDB8fHww",
    price: "$520/night",
    bedrooms: 5,
    bathrooms: 3,
    sqft: 3200,
    rating: 4.6,
    isCertified: true,
    hasSmartHome: false,
    isEcoFriendly: true,
  },
  {
    id: 5,
    name: "Contemporary Garden Cottage",
    location: "Portland, OR",
    imageUrl: "https://images.unsplash.com/photo-1599427303058-f04cbcf4756f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y290dGFnZXxlbnwwfHwwfHx8MA%3D%3D",
    price: "$280/night",
    bedrooms: 2,
    bathrooms: 1,
    sqft: 1200,
    rating: 4.5,
    isCertified: false,
    hasSmartHome: true,
    isEcoFriendly: true,
  },
  {
    id: 6,
    name: "Oceanfront Penthouse",
    location: "Miami, FL",
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXBhcnRtZW50fGVufDB8fDB8fHww",
    price: "$590/night",
    bedrooms: 3,
    bathrooms: 3,
    sqft: 2400,
    rating: 4.9,
    isCertified: true,
    hasSmartHome: true,
    isEcoFriendly: false,
  },
];

const GuestPortal = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const { permissions } = usePermissions();
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterChips, setFilterChips] = useState<FilterChip[]>([
    { id: 'certified', label: 'Certified', icon: <CheckCircle size={14} />, isActive: false },
    { id: 'smart-home', label: 'Smart Home', icon: <Zap size={14} />, isActive: false },
    { id: 'eco-friendly', label: 'Eco-Friendly', icon: <Leaf size={14} />, isActive: false },
  ]);
  
  // Fetch properties from API
  const { data: properties, isLoading, error } = useQuery<Property[]>({
    queryKey: ['/api/properties/available'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Format property previews from API data
  const getPropertyPreviews = (): PropertyPreview[] => {
    if (!properties) return [];
    
    console.log("[GuestPortal] Properties from API:", properties);
    
    return properties
      .filter(property => {
        const status = property.approvalStatus?.toUpperCase();
        console.log(`[GuestPortal] Property ${property.id} (${property.name}) approval status: ${status}`);
        return status === 'APPROVED';
      })
      .map(property => ({
        id: property.id,
        name: property.name,
        location: property.location,
        imageUrl: property.imageUrl || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGx1eHVyeSUyMGhvbWV8ZW58MHx8MHx8fDA%3D',
        price: property.nightlyRate ? `$${property.nightlyRate}/night` : 'Price on request',
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        sqft: property.squareFeet || 0,
        rating: 4.7, // Placeholder rating - would come from a reviews system in a real app
        isCertified: property.isCertified || false,
        hasSmartHome: property.features?.includes('smart_home') || false,
        isEcoFriendly: property.features?.includes('eco_friendly') || false,
      }));
  };
  
  // Navigate to property details
  const viewPropertyDetails = (propertyId: number) => {
    setLocation(`/property/${propertyId}`);
  };
  
  // Get API properties and use with fallback
  const apiProperties = getPropertyPreviews();
  const propertyPreviews = apiProperties.length > 0 ? apiProperties : demoProperties;
  
  // Toggle filter chip active state
  const toggleFilterChip = (id: string) => {
    setFilterChips(
      filterChips.map(chip => 
        chip.id === id ? { ...chip, isActive: !chip.isActive } : chip
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">
              <Home size={18} />
            </div>
            <span className="font-bold text-lg">Argento Homes</span>
          </div>
          
          {permissions.isAuthenticated ? (
            <div className="flex items-center gap-3">
              {permissions.isGuest && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setLocation('/bookings')}
                  className="text-gray-700"
                >
                  My Bookings
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/payment-public')}
                className="text-green-700"
              >
                <DollarSign size={16} className="mr-1" />
                Test Payment
              </Button>
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-medium">{user?.fullName || user?.username}</span>
              </div>
              <Button 
                size="sm" 
                className="bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300"
                onClick={() => setLocation('/')}
              >
                Dashboard
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-green-700"
                onClick={() => setLocation('/payment-public')}
              >
                <DollarSign size={16} className="mr-1" />
                Test Payment
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="border-blue-500 text-blue-500 hover:bg-blue-50"
                onClick={() => setLocation('/auth')}
              >
                <User size={16} className="mr-1" />
                Sign In
              </Button>
              <Button 
                size="sm"
                className="bg-blue-500 hover:bg-blue-600"
                onClick={() => setLocation('/auth')}
              >
                Register
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Hero Section with Search */}
      <div className="relative bg-blue-600 text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGx1eHVyeSUyMGhvbWUlMjBpbnRlcmlvcnxlbnwwfHwwfHx8MA%3D%3D')" 
          }}
        ></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Stay</h1>
            <p className="text-xl opacity-90 mb-8">
              Discover certified luxury properties with smart home features and eco-friendly amenities
            </p>
            
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <div className="relative flex-grow">
                <Input
                  type="text"
                  placeholder="Search by location, property type..."
                  className="pl-10 h-12 bg-white text-gray-900 rounded-lg w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
              <Button className="h-12 px-6 bg-emerald-600 hover:bg-emerald-700">
                Search
              </Button>
            </div>
          </div>
          
          {/* Filter Chips */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {filterChips.map(chip => (
              <Badge
                key={chip.id}
                variant={chip.isActive ? "default" : "outline"}
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-opacity-90 ${
                  chip.isActive 
                    ? 'bg-white text-blue-600' 
                    : 'bg-transparent text-white border-white hover:bg-white hover:bg-opacity-10'
                }`}
                onClick={() => toggleFilterChip(chip.id)}
              >
                <span className="mr-1">{chip.icon}</span>
                {chip.label}
              </Badge>
            ))}
            
            <Badge
              variant="outline"
              className="px-4 py-2 text-sm cursor-pointer bg-transparent text-white border-white hover:bg-white hover:bg-opacity-10"
            >
              <Filter size={14} className="mr-1" />
              More Filters
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Property Results */}
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Available Properties 
            <span className="text-gray-500 ml-2 text-lg font-normal">
              {isLoading ? "(Loading...)" : `(${propertyPreviews.length || 0})`}
            </span>
          </h2>
          
          <div className="flex gap-2">
            <Tabs defaultValue="grid">
              <TabsList className="bg-gray-100">
                <TabsTrigger value="grid" className="data-[state=active]:bg-white">
                  <div className="grid grid-cols-2 gap-0.5 h-4 w-4 mr-1"></div>
                  Grid
                </TabsTrigger>
                <TabsTrigger value="list" className="data-[state=active]:bg-white">
                  <div className="flex flex-col gap-0.5 h-4 w-4 mr-1">
                    <div className="h-0.5 w-full bg-current"></div>
                    <div className="h-0.5 w-full bg-current"></div>
                    <div className="h-0.5 w-full bg-current"></div>
                  </div>
                  List
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
            <p className="text-gray-500">Loading properties...</p>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="text-center p-6 border border-red-200 rounded-lg bg-red-50 mb-6">
            <h3 className="text-red-600 font-medium mb-2">Error loading properties</h3>
            <p className="text-gray-600 mb-4">
              We encountered an issue loading properties. Please try again later.
            </p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="border-red-300 text-red-600 hover:bg-red-100"
            >
              Retry
            </Button>
          </div>
        )}
        
        {/* No Results State */}
        {!isLoading && !error && propertyPreviews.length === 0 && (
          <div className="text-center p-8 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-gray-600 font-medium mb-2">No properties found</h3>
            <p className="text-gray-500">
              We couldn't find any properties matching your criteria. Try adjusting your filters.
            </p>
          </div>
        )}
        
        {/* Property Grid */}
        {!isLoading && !error && propertyPreviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {propertyPreviews.map(property => (
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 overflow-hidden">
                  {property.imageUrl && (
                    <img 
                      src={property.imageUrl} 
                      alt={property.name} 
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-0 left-0 right-0 p-4 flex justify-between">
                    <Badge className="bg-blue-500">
                      {property.price}
                    </Badge>
                    <div className="flex gap-1">
                      {property.isCertified && (
                        <Badge variant="outline" className="bg-white bg-opacity-90">
                          <CheckCircle size={14} className="mr-1 text-green-600" />
                          Certified
                        </Badge>
                      )}
                      {property.hasSmartHome && (
                        <Badge variant="outline" className="bg-white bg-opacity-90">
                          <Zap size={14} className="mr-1 text-amber-500" />
                        </Badge>
                      )}
                      {property.isEcoFriendly && (
                        <Badge variant="outline" className="bg-white bg-opacity-90">
                          <Leaf size={14} className="mr-1 text-emerald-600" />
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{property.name}</CardTitle>
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin size={14} className="mr-1" />
                    {property.location}
                  </div>
                </CardHeader>
                
                <CardContent className="pb-3">
                  <div className="flex justify-between text-sm text-gray-700">
                    <div className="flex items-center">
                      <Bed size={16} className="mr-1" />
                      <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
                    </div>
                    <div className="flex items-center">
                      <Bath size={16} className="mr-1" />
                      <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
                    </div>
                    <div className="flex items-center">
                      <Home size={16} className="mr-1" />
                      <span>{property.sqft} sqft</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between border-t pt-3">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                    <span className="text-sm font-medium">{property.rating}</span>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-blue-600 hover:text-blue-800 p-0" 
                    onClick={() => viewPropertyDetails(property.id)}
                  >
                    View Details <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        
        {/* Pagination (Placeholder) */}
        {!isLoading && !error && propertyPreviews.length > 0 && (
          <div className="mt-10 flex justify-center">
            <div className="flex space-x-1">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" className="bg-blue-50">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestPortal;