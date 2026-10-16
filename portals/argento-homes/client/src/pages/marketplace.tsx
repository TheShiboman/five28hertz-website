import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import SidebarLayout from '@/components/layouts/sidebar-layout';
import VendorCard from '@/components/dashboard/vendor-card';
import AssignTaskDialog from '@/components/modals/assign-task-dialog';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  Sparkles, 
  Wrench, 
  Home, 
  Paintbrush, 
  Utensils, 
  Camera, 
  Search,
  PaintBucket,
  Clock,
  Truck,
  Flag,
  UserPlus,
  Loader2
} from 'lucide-react';
import { Vendor, ApprovalStatus, insertVendorSchema } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { queryClient, apiRequest } from '@/lib/queryClient';

const vendorIcons: Record<string, React.ReactNode> = {
  'cleaning': <Sparkles size={24} />,
  'maintenance': <Wrench size={24} />,
  'smart_home': <Home size={24} />,
  'interior_design': <PaintBucket size={24} />,
  'photography': <Camera size={24} />,
  'catering': <Utensils size={24} />,
  'furniture': <Paintbrush size={24} />,
  'concierge': <Clock size={24} />,
  'transportation': <Truck size={24} />,
  'experiences': <Flag size={24} />
};

// Vendor categories
const vendorCategories = [
  { id: 'all', name: 'All Categories' },
  { id: 'cleaning', name: 'Cleaning Services' },
  { id: 'maintenance', name: 'Maintenance' },
  { id: 'smart_home', name: 'Smart Home' },
  { id: 'interior_design', name: 'Interior Design' },
  { id: 'photography', name: 'Photography' },
  { id: 'catering', name: 'Catering Services' },
  { id: 'furniture', name: 'Furniture Rental' },
  { id: 'concierge', name: 'Concierge Services' },
  { id: 'transportation', name: 'Transportation' },
  { id: 'experiences', name: 'Guest Experiences' }
];

interface VendorWithDetails extends Vendor {
  fullName?: string;
  email?: string;
}

// Form schema for vendor application
const vendorFormSchema = insertVendorSchema.extend({
  businessName: z.string().min(2, {
    message: "Business name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
});

type VendorFormValues = z.infer<typeof vendorFormSchema>;

const Marketplace = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAssignTaskDialogOpen, setIsAssignTaskDialogOpen] = useState(false);
  const [isVendorDialogOpen, setIsVendorDialogOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<{ id: number; name: string } | null>(null);

  // Fetch all vendors
  const { data: vendors = [], isLoading } = useQuery<VendorWithDetails[]>({
    queryKey: ['/api/vendors'],
  });

  // Filter vendors based on search query and category
  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = 
      vendor.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      vendor.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      vendor.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || vendor.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Handler for contacting a vendor
  const handleContactVendor = (vendorId: number) => {
    toast({
      title: "Contact Vendor",
      description: "Message form will open for this vendor soon.",
    });
  };
  
  // Handler for viewing vendor profile
  const handleViewVendorProfile = (vendorId: number) => {
    window.location.href = `/vendor-profile?id=${vendorId}`;
  };
  
  // Handler for opening the assign task dialog
  const handleAssignTask = (vendor: { id: number; name: string }) => {
    setSelectedVendor(vendor);
    setIsAssignTaskDialogOpen(true);
  };
  
  // Handler for closing the assign task dialog
  const handleCloseAssignTaskDialog = () => {
    setIsAssignTaskDialogOpen(false);
    setSelectedVendor(null);
  };

  // Form setup for vendor application
  const form = useForm<VendorFormValues>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues: {
      userId: user?.id,
      businessName: "",
      category: "",
      description: "",
      approvalStatus: ApprovalStatus.PENDING,
    },
  });
  
  // Mutation for submitting vendor application
  const vendorApplicationMutation = useMutation({
    mutationFn: async (data: VendorFormValues) => {
      const res = await apiRequest('POST', '/api/vendors', data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/vendors'] });
      setIsVendorDialogOpen(false);
      form.reset();
      toast({
        title: "Application Submitted!",
        description: "Your vendor application has been submitted for review. We'll notify you once it's approved.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Handler for submitting vendor application form
  function onSubmitVendorApplication(data: VendorFormValues) {
    // We don't need to set approvalStatus here since the server sets it to PENDING by default
    vendorApplicationMutation.mutate(data);
  }

  return (
    <SidebarLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-semibold text-charcoal mb-4 md:mb-0">Vendor Marketplace</h1>
          
          <div className="relative w-full md:w-auto md:min-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search vendors, services..."
              className="pl-10 pr-4 py-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all" onValueChange={setSelectedCategory} className="mb-8">
          <div className="overflow-x-auto pb-2">
            <TabsList className="mb-8 w-auto inline-flex">
              {vendorCategories.map(category => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="px-4 py-2"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {vendorCategories.map(category => (
            <TabsContent key={category.id} value={category.id}>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <Card key={i} className="rounded-lg shadow animate-pulse">
                      <CardContent className="p-5">
                        <div className="flex items-center mb-4">
                          <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                          <div className="ml-3 space-y-1">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-200 rounded"></div>
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        </div>
                        <div className="h-8 bg-gray-200 rounded mt-4"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredVendors.length === 0 ? (
                <Card className="rounded-lg shadow">
                  <CardContent className="p-8 text-center">
                    <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors found</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                      {searchQuery 
                        ? "We couldn't find any vendors matching your search criteria. Try adjusting your search."
                        : "There are no vendors available in this category at the moment."}
                    </p>
                    {searchQuery && (
                      <Button 
                        variant="outline" 
                        onClick={() => setSearchQuery('')}
                        className="mx-auto"
                      >
                        Clear Search
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredVendors.map((vendor) => (
                    <VendorCard
                      key={vendor.id}
                      icon={vendorIcons[vendor.category] || <Sparkles size={24} />}
                      name={vendor.businessName || vendor.fullName || `Vendor #${vendor.id}`}
                      rating={(vendor.rating || 0) / 20} // Convert 0-100 rating to 0-5 scale
                      reviewCount={vendor.reviewCount || 0}
                      description={vendor.description || "No description available"}
                      onContact={() => handleContactVendor(vendor.id)}
                      onAssignTask={() => handleAssignTask({ 
                        id: vendor.id, 
                        name: vendor.businessName || vendor.fullName || `Vendor #${vendor.id}`
                      })}
                      onViewProfile={() => handleViewVendorProfile(vendor.id)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-12">
          <h2 className="text-xl font-semibold text-charcoal mb-6">Featured Vendors</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-blue-50 border-blue-100 overflow-hidden">
              <div className="h-3 bg-blue-500 w-full"></div>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-blue-500 text-white flex items-center justify-center">
                    <Sparkles size={32} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-gray-900">CleanPro Services</h3>
                    <div className="flex items-center">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">(124 reviews)</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mb-6">
                  Award-winning cleaning services specialized for vacation rentals. 
                  Using eco-friendly products and offering 100% satisfaction guarantee.
                </p>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <Button className="py-2" onClick={() => handleContactVendor(1)}>
                    Contact
                  </Button>
                  <Button 
                    className="py-2 bg-emerald-500 hover:bg-emerald-600" 
                    onClick={() => handleAssignTask({id: 1, name: "CleanPro Services"})}
                  >
                    Assign Task
                  </Button>
                </div>
                <Button 
                  variant="link" 
                  className="w-full text-blue-600 hover:text-blue-800"
                  onClick={() => handleViewVendorProfile(1)}
                >
                  View Full Profile
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-100 overflow-hidden">
              <div className="h-3 bg-emerald-500 w-full"></div>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <Home size={32} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-gray-900">EcoStay Solutions</h3>
                    <div className="flex items-center">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">(98 reviews)</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mb-6">
                  Sustainability-focused solutions for vacation rentals. Energy-efficient devices, 
                  water conservation systems, and sustainability certification.
                </p>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <Button className="py-2 bg-emerald-500 hover:bg-emerald-600" onClick={() => handleContactVendor(2)}>
                    Contact
                  </Button>
                  <Button 
                    className="py-2 bg-emerald-600 hover:bg-emerald-700" 
                    onClick={() => handleAssignTask({id: 2, name: "EcoStay Solutions"})}
                  >
                    Assign Task
                  </Button>
                </div>
                <Button 
                  variant="link" 
                  className="w-full text-blue-600 hover:text-blue-800"
                  onClick={() => handleViewVendorProfile(2)}
                >
                  View Full Profile
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-yellow-50 border-yellow-100 overflow-hidden">
              <div className="h-3 bg-yellow-500 w-full"></div>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-yellow-500 text-white flex items-center justify-center">
                    <PaintBucket size={32} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-gray-900">Designer Spaces</h3>
                    <div className="flex items-center">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'} fill-current`} viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">(76 reviews)</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mb-6">
                  Expert interior design services that maximize rental appeal and guest satisfaction.
                  Specialized in photo-ready, durable, and stylish vacation rental designs.
                </p>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <Button className="py-2 bg-yellow-500 hover:bg-yellow-600" onClick={() => handleContactVendor(3)}>
                    Contact
                  </Button>
                  <Button 
                    className="py-2 bg-emerald-500 hover:bg-emerald-600" 
                    onClick={() => handleAssignTask({id: 3, name: "Designer Spaces"})}
                  >
                    Assign Task
                  </Button>
                </div>
                <Button 
                  variant="link" 
                  className="w-full text-blue-600 hover:text-blue-800"
                  onClick={() => handleViewVendorProfile(3)}
                >
                  View Full Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8 mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Are you a service provider?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Join our platform to connect with property owners and grow your business. 
            Gain access to a network of premium short-term rental properties.
          </p>
          <Button 
            className="bg-blue-500 hover:bg-blue-600 px-8"
            onClick={() => setIsVendorDialogOpen(true)}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Register as a Vendor
          </Button>
        </div>
      </div>
      
      {/* Assign Task Dialog */}
      {selectedVendor && (
        <AssignTaskDialog
          vendorId={selectedVendor.id}
          vendorName={selectedVendor.name}
          isOpen={isAssignTaskDialogOpen}
          onClose={handleCloseAssignTaskDialog}
        />
      )}
      
      {/* Vendor Application Dialog */}
      <Dialog open={isVendorDialogOpen} onOpenChange={setIsVendorDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Apply to become a vendor</DialogTitle>
            <DialogDescription>
              Fill out the form below to apply as a service provider on our platform.
              Your application will be reviewed by our team.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitVendorApplication)} className="space-y-6">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your business name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vendorCategories.filter(c => c.id !== 'all').map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your services, experience, and why property owners should work with you..."
                        rows={5}
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Be detailed to increase your chances of approval.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsVendorDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={vendorApplicationMutation.isPending}
                >
                  {vendorApplicationMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Submit Application
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </SidebarLayout>
  );
};

export default Marketplace;
