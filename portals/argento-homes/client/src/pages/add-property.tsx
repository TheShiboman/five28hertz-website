import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { InsertProperty } from '@shared/schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import SidebarLayout from '@/components/layouts/sidebar-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, Upload } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Link, useLocation } from 'wouter';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';

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
  { id: 'parking', label: 'Free Parking' },
  { id: 'pets', label: 'Pet Friendly' },
  { id: 'workspace', label: 'Dedicated Workspace' },
  { id: 'kitchen', label: 'Full Kitchen' },
  { id: 'tv', label: 'Smart TV' },
  { id: 'washer', label: 'Washer' },
  { id: 'dryer', label: 'Dryer' },
  { id: 'gym', label: 'Gym Access' },
  { id: 'fireplace', label: 'Fireplace' }
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
  minStay: z.coerce.number().min(1, "Minimum stay must be at least 1 night"),
  maxGuests: z.coerce.number().min(1, "Maximum guests must be at least 1"),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

const AddProperty = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      squareFeet: 1000,
      nightlyRate: 100,
      minStay: 1,
      maxGuests: 4
    },
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
      navigate('/properties');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to add property: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: PropertyFormValues) => {
    createPropertyMutation.mutate({
      ...data,
      userId: user?.id as number,
      isCertified: false,
      certificationProgress: 0,
    });
  };

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Create a URL for the file
    const url = URL.createObjectURL(file);
    setPreviewImage(url);
    form.setValue('imageUrl', url);
  };

  return (
    <SidebarLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-2"
              onClick={() => window.location.href = "/properties"}
            >
              <ChevronLeft size={18} />
              Back to Properties
            </Button>
            <h1 className="text-2xl font-semibold text-charcoal">Add New Property</h1>
          </div>
          <p className="text-gray-500">
            Fill out the form below to add a new property to your portfolio.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Property Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Basic Information</h3>
                  
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
                      name="propertyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  </div>

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

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="A beautiful property with ocean view..." 
                            className="min-h-[120px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Property Details */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-medium">Property Details</h3>
                  
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
                </div>

                {/* Features & Amenities */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-medium">Features & Amenities</h3>
                  <p className="text-sm text-gray-500">Select all the features your property offers.</p>
                  
                  <FormField
                    control={form.control}
                    name="features"
                    render={() => (
                      <FormItem>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-3">
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
                      </FormItem>
                    )}
                  />
                </div>

                {/* Property Image */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-medium">Property Image</h3>
                  
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Image</FormLabel>
                        <div className="space-y-4">
                          {previewImage && (
                            <div className="relative w-full h-60 bg-gray-100 rounded-md overflow-hidden">
                              <img 
                                src={previewImage} 
                                alt="Property preview" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          
                          <div className="flex flex-col sm:flex-row gap-4">
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
                              className="w-full sm:w-auto"
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Image
                            </Button>
                            <FormControl>
                              <Input
                                placeholder="Or enter image URL"
                                className="w-full sm:flex-1"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  if (e.target.value) {
                                    setPreviewImage(e.target.value);
                                  }
                                }}
                              />
                            </FormControl>
                          </div>
                          <FormDescription>
                            Upload a high-quality image of your property. Recommended size: 1200x800px.
                          </FormDescription>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Pricing & Availability */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-medium">Pricing & Availability</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="minStay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Stay (nights)</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="maxGuests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Guests</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-6">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => window.location.href = "/properties"}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-blue-500 hover:bg-blue-600"
                    disabled={createPropertyMutation.isPending}
                  >
                    {createPropertyMutation.isPending ? 'Saving...' : 'Save Property'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
};

export default AddProperty;