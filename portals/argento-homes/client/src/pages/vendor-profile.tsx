import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { 
  Briefcase, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Award, 
  Clock, 
  MessageSquare, 
  ChevronLeft 
} from 'lucide-react';
import SidebarLayout from '@/components/layouts/sidebar-layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Vendor, InsertMessage } from '@shared/schema';
import AssignTaskDialog from '@/components/modals/assign-task-dialog';

interface VendorWithDetails extends Omit<Vendor, 'businessName'> {
  fullName?: string;
  email?: string;
  businessName?: string;
}

interface Review {
  id: number;
  authorName: string;
  rating: number;
  date: string;
  comment: string;
}

const VendorProfile = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isAssignTaskDialogOpen, setIsAssignTaskDialogOpen] = useState(false);
  const [isContactLoading, setIsContactLoading] = useState(false);
  
  // Get vendor ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const vendorId = Number(urlParams.get('id'));
  
  // Fetch vendor data
  const { data: vendor, isLoading, error } = useQuery<VendorWithDetails>({
    queryKey: ['/api/vendors', vendorId],
    queryFn: async () => {
      const res = await fetch(`/api/vendors/${vendorId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch vendor');
      }
      return res.json();
    },
    enabled: !isNaN(vendorId) && vendorId > 0,
  });
  
  // Create message mutation
  const createMessageMutation = useMutation({
    mutationFn: async (data: InsertMessage) => {
      const res = await apiRequest('POST', '/api/messages', data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
      setIsContactLoading(false);
      toast({
        title: "Message sent!",
        description: `You have started a conversation with ${vendor?.businessName || vendor?.fullName || `Vendor #${vendor?.id}`}`,
      });
      // Navigate to messages page
      setLocation('/messages');
    },
    onError: (error: Error) => {
      setIsContactLoading(false);
      toast({
        title: "Error starting conversation",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Mock reviews data - in a real app these would come from an API
  const reviews: Review[] = [
    {
      id: 1,
      authorName: 'Sarah Johnson',
      rating: 5,
      date: '2025-02-15',
      comment: 'Excellent service! Very professional and thorough with their work. Would definitely hire again for my property cleaning needs.'
    },
    {
      id: 2,
      authorName: 'Michael Rodriguez',
      rating: 4,
      date: '2025-01-28',
      comment: 'Great work overall. They were a bit late to arrive but the quality of service made up for it. My vacation rental looks spotless now.'
    },
    {
      id: 3,
      authorName: 'Emily Chen',
      rating: 5,
      date: '2024-12-10',
      comment: 'This vendor is amazing! They went above and beyond what was expected. My guests have commented on how clean and well-maintained the property is.'
    }
  ];
  
  const handleBack = () => {
    setLocation('/marketplace');
  };
  
  const handleContact = () => {
    if (!user || !vendor || !vendor.userId) {
      toast({
        title: "Error",
        description: "Could not start conversation. Please try again later.",
        variant: "destructive",
      });
      return;
    }
    
    setIsContactLoading(true);
    
    // Create initial message to vendor
    const initialMessage: InsertMessage = {
      senderId: user.id,
      receiverId: vendor.userId, // Use vendor's userId (not vendor.id which is the vendor record ID)
      content: `Hello, I'm interested in your ${vendor.category} services for my properties.`,
      isRead: false,
    };
    
    createMessageMutation.mutate(initialMessage);
  };
  
  const handleAssignTask = () => {
    setIsAssignTaskDialogOpen(true);
  };
  
  const handleCloseAssignTaskDialog = () => {
    setIsAssignTaskDialogOpen(false);
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <SidebarLayout>
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <Button 
            variant="ghost" 
            onClick={handleBack} 
            className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Marketplace
          </Button>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">Loading vendor profile...</h2>
            <p className="mt-2 text-gray-500">Please wait while we fetch the vendor information.</p>
          </div>
        </div>
      </SidebarLayout>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <SidebarLayout>
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <Button 
            variant="ghost" 
            onClick={handleBack} 
            className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Marketplace
          </Button>
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-700">Error loading vendor</h2>
            <p className="mt-2 text-gray-500">{error instanceof Error ? error.message : 'Failed to load vendor data'}</p>
            <Button onClick={handleBack} className="mt-6">
              Return to Marketplace
            </Button>
          </div>
        </div>
      </SidebarLayout>
    );
  }
  
  // Show not found state
  if (!vendor) {
    return (
      <SidebarLayout>
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <Button 
            variant="ghost" 
            onClick={handleBack} 
            className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Marketplace
          </Button>
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-700">Vendor not found</h2>
            <p className="mt-2 text-gray-500">The vendor you're looking for doesn't exist or has been removed.</p>
            <Button onClick={handleBack} className="mt-6">
              Return to Marketplace
            </Button>
          </div>
        </div>
      </SidebarLayout>
    );
  }
  
  return (
    <SidebarLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <Button 
          variant="ghost" 
          onClick={handleBack} 
          className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Marketplace
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vendor Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-24 w-24 rounded-full bg-blue-500 text-white flex items-center justify-center mb-4">
                    <Briefcase size={40} />
                  </div>
                  
                  <h1 className="text-2xl font-bold text-gray-900">
                    {vendor.businessName || vendor.fullName || `Vendor #${vendor.id}`}
                  </h1>
                  
                  <div className="flex items-center mt-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          className={i < Math.floor((vendor.rating || 0) / 20) ? "text-yellow-400" : "text-gray-300"} 
                          fill={i < Math.floor((vendor.rating || 0) / 20) ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                      ({vendor.reviewCount || 0} reviews)
                    </span>
                  </div>
                  
                  <Badge className="mt-3 bg-blue-100 text-blue-600 hover:bg-blue-200 px-3 py-1 capitalize">
                    {vendor.category}
                  </Badge>
                  
                  <Separator className="my-6" />
                  
                  <div className="space-y-4 w-full">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-sm text-gray-600 text-left">
                        123 Business Avenue, Suite 101, San Francisco, CA 94103
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                      <span className="text-sm text-gray-600">
                        (555) 123-4567
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                      <span className="text-sm text-gray-600">
                        {vendor.email || 'contact@vendor.com'}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                      <span className="text-sm text-gray-600">
                        Available: Mon-Sat, 8AM-6PM
                      </span>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="grid grid-cols-2 gap-3 w-full">
                    <Button 
                      onClick={handleContact}
                      className="bg-blue-500 hover:bg-blue-600"
                      disabled={isContactLoading}
                    >
                      {isContactLoading ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-blue-50 border-t-transparent"></div>
                          Sending...
                        </>
                      ) : "Contact"}
                    </Button>
                    <Button 
                      onClick={handleAssignTask}
                      className="bg-emerald-500 hover:bg-emerald-600"
                    >
                      Assign Task
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Additional Information Card */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Credentials & Certification</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Award className="h-5 w-5 text-emerald-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <span className="text-sm font-medium text-gray-800 block">Certified Professional</span>
                      <span className="text-xs text-gray-500">Industry Standard Certification</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-emerald-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <span className="text-sm font-medium text-gray-800 block">5+ Years Experience</span>
                      <span className="text-xs text-gray-500">In vacation rental services</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MessageSquare className="h-5 w-5 text-emerald-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <span className="text-sm font-medium text-gray-800 block">Fast Response</span>
                      <span className="text-xs text-gray-500">Avg. response time: 2 hours</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Vendor Details and Reviews */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="mt-0">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">About {vendor.businessName || vendor.fullName || `Vendor #${vendor.id}`}</h2>
                    <p className="text-gray-700 mb-4">
                      {vendor.description || 
                      `We are a professional service provider specializing in high-quality solutions for vacation rental property owners. 
                      With years of experience in the industry, we understand the unique challenges that property owners face 
                      and offer tailored services to meet your specific needs.`}
                    </p>
                    <p className="text-gray-700 mb-4">
                      Our team consists of trained professionals who are dedicated to delivering exceptional results on every project. 
                      We pride ourselves on our attention to detail, reliability, and commitment to customer satisfaction.
                    </p>
                    <p className="text-gray-700">
                      Whether you need regular maintenance, one-time services, or emergency assistance, 
                      we are here to help ensure your property is always in top condition for your guests.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="services" className="mt-0">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Services</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-medium text-gray-900 mb-2">Standard Service</h3>
                        <ul className="text-sm text-gray-600 space-y-2">
                          <li className="flex items-start">
                            <span className="text-emerald-500 mr-2">✓</span>
                            Complete property inspection
                          </li>
                          <li className="flex items-start">
                            <span className="text-emerald-500 mr-2">✓</span>
                            Basic maintenance and repairs
                          </li>
                          <li className="flex items-start">
                            <span className="text-emerald-500 mr-2">✓</span>
                            Regular service reports
                          </li>
                        </ul>
                        <p className="mt-3 text-sm font-medium text-gray-900">Starting at $75/visit</p>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-medium text-gray-900 mb-2">Premium Service</h3>
                        <ul className="text-sm text-gray-600 space-y-2">
                          <li className="flex items-start">
                            <span className="text-emerald-500 mr-2">✓</span>
                            All Standard Service features
                          </li>
                          <li className="flex items-start">
                            <span className="text-emerald-500 mr-2">✓</span>
                            Advanced maintenance solutions
                          </li>
                          <li className="flex items-start">
                            <span className="text-emerald-500 mr-2">✓</span>
                            24/7 emergency response
                          </li>
                        </ul>
                        <p className="mt-3 text-sm font-medium text-gray-900">Starting at $125/visit</p>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-medium text-gray-900 mb-2">Custom Solutions</h3>
                        <ul className="text-sm text-gray-600 space-y-2">
                          <li className="flex items-start">
                            <span className="text-emerald-500 mr-2">✓</span>
                            Tailored to your property needs
                          </li>
                          <li className="flex items-start">
                            <span className="text-emerald-500 mr-2">✓</span>
                            Flexible scheduling options
                          </li>
                          <li className="flex items-start">
                            <span className="text-emerald-500 mr-2">✓</span>
                            Combined service packages
                          </li>
                        </ul>
                        <p className="mt-3 text-sm font-medium text-gray-900">Contact for pricing</p>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-medium text-gray-900 mb-2">Annual Contract</h3>
                        <ul className="text-sm text-gray-600 space-y-2">
                          <li className="flex items-start">
                            <span className="text-emerald-500 mr-2">✓</span>
                            Discounted service rates
                          </li>
                          <li className="flex items-start">
                            <span className="text-emerald-500 mr-2">✓</span>
                            Priority scheduling
                          </li>
                          <li className="flex items-start">
                            <span className="text-emerald-500 mr-2">✓</span>
                            Dedicated account manager
                          </li>
                        </ul>
                        <p className="mt-3 text-sm font-medium text-gray-900">10-15% savings on all services</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-0">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">Customer Reviews</h2>
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={18} 
                              className={i < Math.floor((vendor.rating || 0) / 20) ? "text-yellow-400" : "text-gray-300"} 
                              fill={i < Math.floor((vendor.rating || 0) / 20) ? "currentColor" : "none"}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {(vendor.rating || 0) / 20} out of 5
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {reviews.map(review => (
                        <div key={review.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-gray-900">{review.authorName}</h3>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                          <div className="flex mb-3">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={14} 
                                className={i < review.rating ? "text-yellow-400" : "text-gray-300"} 
                                fill={i < review.rating ? "currentColor" : "none"}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="portfolio" className="mt-0">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Portfolio</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div key={item} className="overflow-hidden rounded-lg border">
                          <div className="h-40 bg-gray-200 flex items-center justify-center text-gray-400">
                            <span className="text-sm">Project Image {item}</span>
                          </div>
                          <div className="p-3">
                            <h4 className="font-medium text-sm text-gray-900">Project Example {item}</h4>
                            <p className="text-xs text-gray-500 mt-1">Completed: January 2025</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Assign Task Dialog */}
      {vendor && (
        <AssignTaskDialog
          vendorId={vendor.id}
          vendorName={vendor.businessName || vendor.fullName || `Vendor #${vendor.id}`}
          isOpen={isAssignTaskDialogOpen}
          onClose={handleCloseAssignTaskDialog}
        />
      )}
    </SidebarLayout>
  );
};

export default VendorProfile;