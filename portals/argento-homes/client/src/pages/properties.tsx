import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Link } from 'wouter';
import SidebarLayout from '@/components/layouts/sidebar-layout';
import PropertyCard from '@/components/dashboard/property-card';
import { Button } from '@/components/ui/button';
import { Plus, Home, Search, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useRef } from 'react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { InsertProperty, Property } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

export type PropertyStatus = 'certified' | 'in_progress';

// Property types
const propertyTypes = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'villa', label: 'Villa' },
  { value: 'cabin', label: 'Cabin' },
  { value: 'condo', label: 'Condominium' },
  { value: 'townhouse', label: 'Townhouse' }
];

// Property features/amenities
const propertyFeatures = [
  { id: 'wifi', label: 'WiFi' },
  { id: 'pool', label: 'Swimming Pool' },
  { id: 'ac', label: 'Air Conditioning' },
  { id: 'heating', label: 'Heating' },
  { id: 'parking', label: 'Free Parking' },
  { id: 'workspace', label: 'Dedicated Workspace' },
  { id: 'kitchen', label: 'Full Kitchen' },
  { id: 'washer', label: 'Washer & Dryer' },
  { id: 'tv', label: 'TV' },
  { id: 'patio', label: 'Patio or Balcony' },
  { id: 'gym', label: 'Fitness Center' },
  { id: 'bbq', label: 'BBQ Grill' }
];

// Form schema for adding a new property
const propertyFormSchema = z.object({
  name: z.string().min(3, "Property name must be at least 3 characters"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  description: z.string().min(10, "Description should be at least 10 characters").max(500, "Description is too long").optional(),
  propertyType: z.string().default("apartment"),
  features: z.array(z.string()).default([]),
  imageUrl: z.string().optional(),
  bedrooms: z.coerce.number().min(0, "Bedrooms cannot be negative"),
  bathrooms: z.coerce.number().min(0, "Bathrooms cannot be negative"),
  squareFeet: z.coerce.number().min(100, "Square feet must be at least 100"),
  nightlyRate: z.coerce.number().min(1, "Nightly rate must be at least 1"),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

const Properties = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);

  // For image upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // Form for adding a new property
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      name: '',
      location: '',
      description: '',
      propertyType: 'apartment',
      features: [],
      imageUrl: '',
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 500,
      nightlyRate: 100,
    },
  });
  
  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Create a URL for the file
    const url = URL.createObjectURL(file);
    setPreviewImage(url);
    
    // Update the form state
    form.setValue('imageUrl', url);
  };

  // Fetch properties
  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });

  // Create property mutation
  const createPropertyMutation = useMutation({
    mutationFn: async (data: InsertProperty) => {
      const res = await apiRequest('POST', '/api/properties', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      toast({
        title: 'Property Added',
        description: 'Your property has been successfully added.',
      });
      setIsAddPropertyOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to add property: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Filter properties based on search query
  const filteredProperties = properties.filter(property => 
    property.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    property.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle adding a new property
  const onSubmit = (data: PropertyFormValues) => {
    createPropertyMutation.mutate({
      ...data,
      userId: user?.id as number,
      isCertified: false,
      certificationProgress: 0,
    });
  };

  // Handle viewing property details
  const handleViewProperty = (propertyId: number) => {
    // Navigate to property details page
    window.location.href = `/properties/${propertyId}`;
  };

  return (
    <SidebarLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6 bg-[#FAFAFA] bg-gradient-to-b from-[#FAFAFA] to-[#EAEAEA] min-h-screen">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-semibold text-charcoal mb-4 sm:mb-0">My Properties</h1>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search properties..."
                className="pl-8 border-[#EAEAEA] focus:border-[#2ECC71] focus:ring-[#2ECC71]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button 
              className="bg-[#2ECC71] hover:bg-[#27AE60] text-white font-medium rounded-md"
              onClick={() => window.location.href = "/properties/add"}
            >
              <Plus size={18} className="mr-2" /> Add Property
            </Button>
            
            <Dialog open={isAddPropertyOpen} onOpenChange={setIsAddPropertyOpen}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add a New Property</DialogTitle>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Property Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Beachfront Villa" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input placeholder="Miami, FL" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="A beautiful property with oceanview..." 
                              className="min-h-[80px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="propertyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select property type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {propertyTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Image</FormLabel>
                          <div className="flex flex-col gap-3">
                            {previewImage && (
                              <div className="relative w-full h-40 bg-gray-100 rounded-md overflow-hidden">
                                <img 
                                  src={previewImage} 
                                  alt="Property preview" 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <FormControl>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  ref={fileInputRef}
                                  onChange={handleImageUpload}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="w-full h-10 px-4"
                                >
                                  <Upload className="mr-2 h-4 w-4" />
                                  Upload Image
                                </Button>
                                <Input
                                  placeholder="Or enter image URL"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    if (e.target.value) {
                                      setPreviewImage(e.target.value);
                                    }
                                  }}
                                />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Upload a high-quality image of your property.
                            </FormDescription>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="features"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel>Features & Amenities</FormLabel>
                            <FormDescription>
                              Select all the features your property offers.
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
                            {propertyFeatures.map((feature) => (
                              <FormField
                                key={feature.id}
                                control={form.control}
                                name="features"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={feature.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(feature.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, feature.id])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== feature.id
                                                  )
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {feature.label}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <FormField
                        control={form.control}
                        name="bedrooms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bedrooms</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="bathrooms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bathrooms</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" step="0.5" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="squareFeet"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Square Feet</FormLabel>
                            <FormControl>
                              <Input type="number" min="100" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="nightlyRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nightly Rate ($)</FormLabel>
                            <FormControl>
                              <Input type="number" min="1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsAddPropertyOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-[#2ECC71] hover:bg-[#27AE60] text-white font-medium rounded-md" disabled={createPropertyMutation.isPending}>
                        {createPropertyMutation.isPending ? 'Adding...' : 'Add Property'}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="w-full h-[350px] animate-pulse">
                <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                <CardContent className="p-5">
                  <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <Card className="w-full py-16">
            <CardContent className="flex flex-col items-center justify-center text-center p-6">
              <Home size={64} className="text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No Properties Found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery 
                  ? "No properties match your search criteria. Try a different search."
                  : "You don't have any properties yet. Add your first property to get started."}
              </p>
              {!searchQuery && (
                <Button 
                  className="bg-[#2ECC71] hover:bg-[#27AE60] text-white font-medium rounded-md"
                  onClick={() => window.location.href = "/properties/add"}
                >
                  <Plus size={18} className="mr-2" /> Add Your First Property
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden rounded-2xl border border-[#EAEAEA] bg-white hover:shadow-md transition-shadow duration-200">
                <div className="h-48 w-full">
                  <img 
                    src={property.imageUrl || "https://images.unsplash.com/photo-1502672023488-70e25813eb80?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80"} 
                    alt={property.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg text-[#2E2E2E]">{property.name}</h3>
                      <p className="text-sm text-[#7F8C8D]">{property.location}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded flex items-center ${
                      property.isCertified 
                        ? 'bg-[#C0C0C0] text-[#2E2E2E] font-medium' 
                        : 'bg-[#EAEAEA] text-[#2E2E2E]'
                    }`}>
                      {property.isCertified && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {property.isCertified ? 'Certified' : 'In Progress'}
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    <span className="inline-block bg-[#C0C0C0] text-[#2E2E2E] text-xs px-2 py-1 rounded-full mr-1 mb-1 font-medium">
                      {propertyTypes.find(t => t.value === property.propertyType)?.label || 'Apartment'}
                    </span>
                    {property.features && property.features.slice(0, 3).map(feature => (
                      <span key={feature} className="inline-block bg-[#C0C0C0] text-[#2E2E2E] text-xs px-2 py-1 rounded-full mr-1 mb-1">
                        {propertyFeatures.find(f => f.id === feature)?.label || feature}
                      </span>
                    ))}
                    {property.features && property.features.length > 3 && (
                      <span className="inline-block bg-[#C0C0C0] text-[#2E2E2E] text-xs px-2 py-1 rounded-full mr-1 mb-1">
                        +{property.features.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center mb-3 text-sm text-[#7F8C8D]">
                    <span className="mr-3 font-medium">{property.bedrooms} beds</span>
                    <span className="mr-3 font-medium">{property.bathrooms} baths</span>
                    <span className="font-medium">{property.squareFeet} sqft</span>
                  </div>
                  
                  {property.isCertified ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#2ECC71] mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="font-medium text-[#2E2E2E]">4.9</span>
                        <span className="text-[#7F8C8D] ml-1">(32 reviews)</span>
                      </div>
                      <div className="text-sm">
                        <span className="px-2 py-1 bg-[#2ECC71] text-white font-medium rounded">${property.nightlyRate}</span>
                        <span className="text-[#7F8C8D] ml-1">/night</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <span className="text-xs text-[#7F8C8D] mb-1 font-medium">Certification Progress</span>
                      <div className="w-full bg-[#EAEAEA] rounded-full h-2">
                        <div 
                          className="bg-[#2ECC71] h-2 rounded-full" 
                          style={{ width: `${property.certificationProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full mt-4 bg-[#2ECC71] hover:bg-[#27AE60] text-white font-medium rounded-md"
                    onClick={() => handleViewProperty(property.id)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default Properties;
