import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { usePermissions } from '@/hooks/use-permissions';
import { useLocation, useRoute } from 'wouter';
import SidebarLayout from '@/components/layouts/sidebar-layout';
import { Property, Task, Booking, Message, SustainabilityMetric, InsertBooking, PaymentStatus } from '@shared/schema';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Home,
  MapPin,
  ArrowLeft,
  CheckCircle,
  Leaf,
  Sparkles,
  Calendar,
  MessageCircle,
  Settings,
  Wifi,
  Lock,
  Lightbulb,
  Camera,
  Award,
  DollarSign,
  PanelLeft,
  ArrowUpRight,
  Edit,
  Thermometer,
  CreditCard
} from 'lucide-react';
import { PropertyStatus } from './properties';
import { useToast } from '@/hooks/use-toast';
import { AvailabilityCalendar } from '@/components/property/availability-calendar';
import { PropertyReviews } from '@/components/reviews/property-reviews';
import { hasDateRangeConflict, getBlockedDates } from '@/components/property/availability-utils';
import { PriceBreakdown } from '@/components/booking/price-breakdown';
import { PaymentModal } from '@/components/booking/payment-modal';
import { formatCurrency, calculateNights } from '@/lib/utils';

// Define a schema for booking form validation
const bookingFormSchema = z.object({
  guestName: z.string().min(3, "Name must be at least 3 characters"),
  guestEmail: z.string().email("Please enter a valid email address"),
  guestPhone: z.string().optional(),
  checkIn: z.string().refine(val => !!val, "Check-in date is required"),
  checkOut: z.string().refine(val => !!val, "Check-out date is required"),
  numGuests: z.coerce.number().min(1, "At least 1 guest required").max(20, "Maximum 20 guests allowed"),
  notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const PropertyDetails = () => {
  // Handle both routes: protected '/properties/:id' and public '/property/:id'
  const [propertiesMatch, propertiesParams] = useRoute('/properties/:id');
  const [propertyMatch, propertyParams] = useRoute('/property/:id');
  
  // Extract property ID from either route
  const propertyId = propertiesMatch 
    ? parseInt(propertiesParams?.id || '0') 
    : propertyMatch 
      ? parseInt(propertyParams?.id || '0') 
      : 0;
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const userPermissions = usePermissions();
  
  // Dialog state
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [bookingFormData, setBookingFormData] = useState<BookingFormValues | null>(null);

  // Fetch property data (try authenticated endpoint first, then public if unauthorized)
  const { data: property, isLoading: isLoadingProperty, error: propertyError } = useQuery<Property>({
    queryKey: [`/api/properties/${propertyId}`],
    enabled: propertyId > 0 && user !== null,
  });
  
  // Fetch public property data for unauthenticated users or if auth endpoint fails
  const { data: publicProperty, isLoading: isLoadingPublicProperty } = useQuery<Property>({
    queryKey: [`/api/properties/public/${propertyId}`],
    enabled: propertyId > 0 && (user === null || propertyError !== null),
  });
  
  // Use either authenticated or public property data
  const propertyData = property || publicProperty;
  const isLoadingPropertyData = isLoadingProperty || isLoadingPublicProperty;

  // Fetch property tasks
  const { data: tasks = [], isLoading: isLoadingTasks } = useQuery<Task[]>({
    queryKey: [`/api/properties/${propertyId}/tasks`],
    enabled: propertyId > 0,
  });

  // Fetch property bookings
  const { data: bookings = [], isLoading: isLoadingBookings } = useQuery<Booking[]>({
    queryKey: [`/api/properties/${propertyId}/bookings`],
    enabled: propertyId > 0,
  });

  // Fetch property sustainability metrics
  const { data: sustainabilityMetrics, isLoading: isLoadingMetrics } = useQuery<SustainabilityMetric>({
    queryKey: [`/api/properties/${propertyId}/sustainability`],
    enabled: propertyId > 0,
  });

  // Determine if messages related to this property exist (simplified version)
  const { data: messages = [], isLoading: isLoadingMessages } = useQuery<Message[]>({
    queryKey: ['/api/messages'],
    enabled: propertyId > 0,
  });

  // Filter messages related to this property (in real app, would have property-specific endpoint)
  const propertyMessages = messages.slice(0, 3);

  // Handle back navigation
  const handleBack = () => {
    window.location.href = "/properties";
  };

  // Handle property edit
  const handleEdit = () => {
    toast({
      title: "Edit Property",
      description: "Property editing will be available soon."
    });
  };

  // Setup booking form with react-hook-form
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      checkIn: "",
      checkOut: "",
      numGuests: 1,
      notes: "",
    },
  });

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: async (data: InsertBooking) => {
      const res = await apiRequest("POST", `/api/bookings`, data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking successful!",
        description: "Your booking has been confirmed.",
      });
      setBookingDialogOpen(false);
      form.reset();
      // Invalidate bookings query to refresh the list
      queryClient.invalidateQueries({ queryKey: [`/api/properties/${propertyId}/bookings`] });
    },
    onError: (error: Error) => {
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle booking submission
  const onSubmitBooking = (values: BookingFormValues) => {
    const checkInDate = new Date(values.checkIn);
    const checkOutDate = new Date(values.checkOut);
    
    // Validation for dates
    if (checkInDate >= checkOutDate) {
      form.setError("checkOut", {
        type: "manual",
        message: "Check-out date must be after check-in date",
      });
      return;
    }
    
    // Check for booking conflicts
    const blockedDates = getBlockedDates(bookings);
    if (hasDateRangeConflict(checkInDate, checkOutDate, blockedDates)) {
      toast({
        title: "Booking conflict",
        description: "These dates are not available. Please select different dates.",
        variant: "destructive",
      });
      return;
    }
    
    // Save form data and open payment modal
    setBookingFormData(values);
    setBookingDialogOpen(false);
    setPaymentModalOpen(true);
  };
  
  // Handle payment completion
  const handlePaymentComplete = (success: boolean, paymentIntentId?: string) => {
    if (!bookingFormData || !success) {
      setPaymentModalOpen(false);
      return;
    }
    
    const checkInDate = new Date(bookingFormData.checkIn);
    const checkOutDate = new Date(bookingFormData.checkOut);
    
    // Calculate the total price - default to 100 if propertyData or nightlyRate is undefined
    const nightlyRate = propertyData?.nightlyRate || 100;
    const nights = calculateNights(checkInDate, checkOutDate);
    const cleaningFee = 85;
    const serviceFee = 60;
    const taxRate = 8.5;
    const subtotal = nights * nightlyRate;
    const taxAmount = Math.round(subtotal * (taxRate / 100));
    const totalPrice = subtotal + cleaningFee + serviceFee + taxAmount;
    
    // Prepare booking data
    const bookingData: InsertBooking = {
      propertyId,
      guestName: bookingFormData.guestName,
      guestEmail: bookingFormData.guestEmail,
      guestPhone: bookingFormData.guestPhone || null,
      checkIn: bookingFormData.checkIn,
      checkOut: bookingFormData.checkOut,
      numGuests: bookingFormData.numGuests,
      totalPrice,
      cleaningFee,
      serviceFee,
      taxAmount,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: "Credit Card",
      paymentDate: new Date(),
      transactionId: paymentIntentId || `pi_${Date.now()}`, // Use actual payment intent ID or fallback
      status: "confirmed", // Confirmed since payment is successful
      notes: bookingFormData.notes || null,
    };
    
    // Submit booking
    createBookingMutation.mutate(bookingData);
    setPaymentModalOpen(false);
  };

  // Handle action buttons
  const handleCreateTask = () => {
    toast({
      title: "Create Task",
      description: "Task creation form will open soon."
    });
  };

  const handleCreateBooking = () => {
    if (userPermissions.permissions.isAuthenticated) {
      setBookingDialogOpen(true);
    } else {
      toast({
        title: "Authentication Required",
        description: "Please sign in or register to book this property.",
        variant: "default",
      });
      setLocation('/auth');
    }
  };

  const handleSmartHome = (action: string) => {
    toast({
      title: "Smart Home",
      description: `${action} action will be available soon.`
    });
  };

  if (isLoadingPropertyData) {
    return (
      <SidebarLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 mb-6">
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="h-6 w-40 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-80 bg-gray-200 animate-pulse rounded-lg"></div>
              <div className="h-40 bg-gray-200 animate-pulse rounded-lg"></div>
            </div>
            <div className="space-y-6">
              <div className="h-60 bg-gray-200 animate-pulse rounded-lg"></div>
              <div className="h-40 bg-gray-200 animate-pulse rounded-lg"></div>
            </div>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  if (!propertyData) {
    return (
      <SidebarLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <Button variant="outline" size="sm" onClick={handleBack} className="mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="py-12">
            <Home className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Property Not Found</h2>
            <p className="text-gray-500 mb-8">The property you're looking for doesn't exist or you don't have permission to view it.</p>
            <Button onClick={handleBack}>Return to Properties</Button>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  const images = [
    propertyData.imageUrl || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
  ];

  return (
    <SidebarLayout>
      {/* Payment Modal */}
      {bookingFormData && (
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          onPaymentSuccess={(paymentIntentId) => {
            // Store the paymentIntentId and mark as successful
            handlePaymentComplete(true, paymentIntentId);
          }}
          propertyId={propertyId}
          checkIn={new Date(bookingFormData.checkIn)}
          checkOut={new Date(bookingFormData.checkOut)}
          nightlyRate={propertyData.nightlyRate || 100}
          cleaningFee={85}
          serviceFee={60}
          taxRate={8.5}
        />
      )}
      
      {/* Booking Dialog */}
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Book Your Stay</DialogTitle>
            <DialogDescription>
              Fill out the form below to book your stay at {propertyData?.name}.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitBooking)} className="space-y-4">
              <FormField
                control={form.control}
                name="guestName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="guestEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="guestPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 234 567 8900" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="checkIn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Check-in Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="checkOut"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Check-out Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="numGuests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Guests</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={1} 
                        max={20} 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Requests (optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any special requests or requirements..."
                        className="resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setBookingDialogOpen(false)} 
                  type="button"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createBookingMutation.isPending}
                >
                  {createBookingMutation.isPending ? (
                    <>Processing...</>
                  ) : (
                    <>Book Now</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <div className="container mx-auto px-4 py-8">
        {/* Back button and header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{propertyData.name}</h1>
              <div className="flex items-center text-gray-500 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{propertyData.location}</span>
              </div>
            </div>
          </div>
          <div className="flex mt-4 md:mt-0 space-x-2">
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            {propertyData.isCertified ? (
              <Badge className="bg-green-500 hover:bg-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Certified
              </Badge>
            ) : (
              <Badge variant="outline" className="border-amber-500 text-amber-600">
                Certification in Progress
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left and Center */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Carousel */}
            <Card>
              <CardContent className="p-0 overflow-hidden rounded-t-lg">
                <Carousel className="w-full">
                  <CarouselContent>
                    {images.map((img, index) => (
                      <CarouselItem key={index}>
                        <div className="p-1">
                          <img 
                            src={img} 
                            alt={`${propertyData.name} - image ${index + 1}`} 
                            className="rounded-lg w-full h-[350px] object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Property Specs */}
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-6">
                    <div className="text-center">
                      <div className="flex flex-col items-center">
                        <Home className="h-5 w-5 text-blue-500 mb-2" />
                        <span className="text-sm font-medium">{propertyData.bedrooms || 0} Bedrooms</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex flex-col items-center">
                        <Sparkles className="h-5 w-5 text-blue-500 mb-2" />
                        <span className="text-sm font-medium">{propertyData.bathrooms || 0} Bathrooms</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex flex-col items-center">
                        <PanelLeft className="h-5 w-5 text-blue-500 mb-2" />
                        <span className="text-sm font-medium">{propertyData.squareFeet || 0} sq.ft</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex flex-col items-center">
                        <DollarSign className="h-5 w-5 text-green-500 mb-2" />
                        <span className="text-sm font-medium">${propertyData.nightlyRate || 0}/night</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex flex-col items-center">
                        <Award className="h-5 w-5 text-amber-500 mb-2" />
                        <span className="text-sm font-medium">{propertyData.propertyType || 'Apartment'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">Description</h3>
                    <p className="text-gray-600">{propertyData.description || 'No description available for this property.'}</p>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">Features</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {(propertyData.features || []).map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>{feature}</span>
                        </div>
                      ))}
                      {(propertyData.features || []).length === 0 && (
                        <span className="text-gray-500">No features listed</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs for Tasks, Bookings, Messages */}
            <Card>
              <CardContent className="p-0">
                <Tabs defaultValue="tasks">
                  <div className="border-b border-gray-200">
                    <TabsList className="w-full justify-start rounded-none border-b border-gray-200 bg-transparent p-0">
                      <TabsTrigger 
                        value="tasks" 
                        className="rounded-t-lg rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
                      >
                        Tasks
                      </TabsTrigger>
                      <TabsTrigger 
                        value="bookings" 
                        className="rounded-t-lg rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
                      >
                        Bookings
                      </TabsTrigger>
                      <TabsTrigger 
                        value="messages" 
                        className="rounded-t-lg rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
                      >
                        Messages
                      </TabsTrigger>
                      <TabsTrigger 
                        value="reviews" 
                        className="rounded-t-lg rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
                      >
                        Reviews
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  {/* Tasks Tab */}
                  <TabsContent value="tasks" className="pt-4 px-4 pb-2">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Property Tasks</h3>
                      <Button size="sm" onClick={handleCreateTask}>
                        <span className="mr-2">+</span>
                        Add Task
                      </Button>
                    </div>
                    
                    {isLoadingTasks ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-16 bg-gray-100 animate-pulse rounded"></div>
                        ))}
                      </div>
                    ) : tasks.length > 0 ? (
                      <div className="space-y-4">
                        {tasks.map((task) => (
                          <div key={task.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                            <div className="flex justify-between">
                              <div>
                                <h4 className="font-medium">{task.title}</h4>
                                <p className="text-sm text-gray-500 mt-1">{task.description || 'No description'}</p>
                              </div>
                              <div className="flex items-start">
                                <Badge 
                                  className={
                                    task.status === 'completed' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 
                                    task.status === 'in_progress' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' : 
                                    'bg-amber-100 text-amber-800 hover:bg-amber-100'
                                  }
                                >
                                  {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('_', ' ')}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-gray-500">
                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                              </span>
                              <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full">
                                {task.type}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Settings className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                        <p>No tasks yet for this property</p>
                        <Button className="mt-4" size="sm" onClick={handleCreateTask}>
                          Create First Task
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  {/* Bookings Tab */}
                  <TabsContent value="bookings" className="pt-4 px-4 pb-2">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Upcoming Bookings</h3>
                      <Button size="sm" onClick={handleCreateBooking}>
                        <span className="mr-2">+</span>
                        Add Booking
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      {/* Availability Calendar */}
                      <div className="md:col-span-1">
                        <AvailabilityCalendar bookings={bookings} className="h-full" />
                      </div>

                      {/* Bookings List */}
                      <div className="md:col-span-2">
                        {isLoadingBookings ? (
                          <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="h-24 bg-gray-100 animate-pulse rounded"></div>
                            ))}
                          </div>
                        ) : bookings.length > 0 ? (
                          <div className="space-y-4">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Booked Dates</h4>
                            {bookings.map((booking) => (
                              <div key={booking.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                                <div className="flex justify-between">
                                  <div>
                                    <h4 className="font-medium">{booking.guestName}</h4>
                                    <p className="text-sm text-gray-500 mt-1">{booking.guestEmail}</p>
                                    <p className="text-sm mt-1">
                                      <span className="text-gray-700">
                                        {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                                      </span>
                                      <span className="text-gray-500 ml-2">
                                        ({booking.numGuests || 1} {(booking.numGuests || 1) === 1 ? 'guest' : 'guests'})
                                      </span>
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <span className="font-bold text-lg">${booking.totalPrice}</span>
                                    <Badge 
                                      className={
                                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800 hover:bg-green-100 block mt-2' : 
                                        booking.status === 'pending' ? 'bg-amber-100 text-amber-800 hover:bg-amber-100 block mt-2' : 
                                        'bg-red-100 text-red-800 hover:bg-red-100 block mt-2'
                                      }
                                    >
                                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                    </Badge>
                                  </div>
                                </div>
                                {booking.notes && (
                                  <div className="mt-2 pt-2 border-t border-gray-100">
                                    <p className="text-sm text-gray-600">{booking.notes}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                            <p>No bookings yet for this property</p>
                            <Button className="mt-4" size="sm" onClick={handleCreateBooking}>
                              Create First Booking
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Messages Tab */}
                  <TabsContent value="messages" className="pt-4 px-4 pb-2">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Property Messages</h3>
                      <Button size="sm" variant="outline">
                        View All Messages
                      </Button>
                    </div>
                    
                    {isLoadingMessages ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-16 bg-gray-100 animate-pulse rounded"></div>
                        ))}
                      </div>
                    ) : propertyMessages.length > 0 ? (
                      <div className="space-y-4">
                        {/* For simplicity, we're using mock message data here */}
                        <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                              <span className="text-blue-700 font-medium">SJ</span>
                            </div>
                            <div>
                              <div className="flex items-center">
                                <h4 className="font-medium">Sarah Johnson</h4>
                                <span className="text-xs text-gray-500 ml-2">2h ago</span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                Just confirmed the cleaning service for next week at the property.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                              <span className="text-green-700 font-medium">MT</span>
                            </div>
                            <div>
                              <div className="flex items-center">
                                <h4 className="font-medium">Michael Torres</h4>
                                <span className="text-xs text-gray-500 ml-2">Yesterday</span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                The smart home installation is complete. Let me know if you'd like to schedule a walkthrough.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <MessageCircle className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                        <p>No messages related to this property</p>
                        <Button className="mt-4" size="sm" variant="outline">
                          Go to Messages
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                  
                  {/* Reviews Tab */}
                  <TabsContent value="reviews" className="pt-4 px-4 pb-2">
                    <PropertyReviews propertyId={propertyId} showAddReview={true} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Content - Right */}
          <div className="space-y-6">
            {/* Booking Card - For guests and non-authenticated users */}
            {(userPermissions.permissions.isGuest || !userPermissions.permissions.isAuthenticated) && (
              <Card className="border-blue-200 bg-blue-50/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">${propertyData?.nightlyRate || 0}<span className="text-sm text-gray-500 font-normal"> / night</span></CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Price breakdown */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>${propertyData?.nightlyRate || 0} × 7 nights</span>
                        <span>${(propertyData?.nightlyRate || 0) * 7}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Cleaning fee</span>
                        <span>$85</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Service fee</span>
                        <span>$60</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${(propertyData?.nightlyRate || 0) * 7 + 145}</span>
                      </div>
                    </div>
                    
                    {/* Availability Calendar Preview */}
                    <div className="pt-3">
                      <h4 className="text-sm font-medium mb-2">Availability</h4>
                      <div className="flex items-center justify-between text-sm bg-white p-3 rounded-lg border border-gray-200">
                        <Calendar className="h-4 w-4 text-blue-500 mr-1" />
                        <span className="flex-grow">Check the calendar for available dates</span>
                        <ArrowUpRight className="h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                  <Button 
                    onClick={handleCreateBooking} 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    Book Now
                  </Button>
                  <div className="text-center text-xs text-gray-500">
                    You won't be charged yet
                  </div>
                </CardFooter>
              </Card>
            )}
            
            {/* Certification Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-amber-500" />
                  Certification Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                {propertyData.isCertified ? (
                  <div className="text-center py-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-green-700 mb-1">Fully Certified</h3>
                    <p className="text-sm text-gray-600">
                      This property meets all certification requirements and standards.
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Certification Progress</span>
                        <span className="text-sm font-medium">{propertyData.certificationProgress || 0}%</span>
                      </div>
                      <Progress value={propertyData.certificationProgress || 0} className="h-2" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${(propertyData.certificationProgress || 0) >= 25 ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <CheckCircle className={`h-3 w-3 ${(propertyData.certificationProgress || 0) >= 25 ? 'text-green-600' : 'text-gray-400'}`} />
                        </div>
                        <div className="ml-3">
                          <span className={`text-sm ${(propertyData.certificationProgress || 0) >= 25 ? 'text-gray-900' : 'text-gray-500'}`}>Basic Info</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${(propertyData.certificationProgress || 0) >= 50 ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <CheckCircle className={`h-3 w-3 ${(propertyData.certificationProgress || 0) >= 50 ? 'text-green-600' : 'text-gray-400'}`} />
                        </div>
                        <div className="ml-3">
                          <span className={`text-sm ${(propertyData.certificationProgress || 0) >= 50 ? 'text-gray-900' : 'text-gray-500'}`}>Safety Standards</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${(propertyData.certificationProgress || 0) >= 75 ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <CheckCircle className={`h-3 w-3 ${(propertyData.certificationProgress || 0) >= 75 ? 'text-green-600' : 'text-gray-400'}`} />
                        </div>
                        <div className="ml-3">
                          <span className={`text-sm ${(propertyData.certificationProgress || 0) >= 75 ? 'text-gray-900' : 'text-gray-500'}`}>Amenities Verification</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${(propertyData.certificationProgress || 0) >= 100 ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <CheckCircle className={`h-3 w-3 ${(propertyData.certificationProgress || 0) >= 100 ? 'text-green-600' : 'text-gray-400'}`} />
                        </div>
                        <div className="ml-3">
                          <span className={`text-sm ${(propertyData.certificationProgress || 0) >= 100 ? 'text-gray-900' : 'text-gray-500'}`}>Final Inspection</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              {!propertyData.isCertified && (
                <CardFooter className="border-t pt-4 flex justify-center">
                  <Button variant="outline" className="w-full">
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    Continue Certification
                  </Button>
                </CardFooter>
              )}
            </Card>

            {/* Sustainability Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Leaf className="h-5 w-5 mr-2 text-green-500" />
                  Sustainability
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingMetrics ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-8 bg-gray-100 animate-pulse rounded"></div>
                    ))}
                  </div>
                ) : sustainabilityMetrics ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Energy Efficiency</span>
                        <span className="text-sm font-medium">{sustainabilityMetrics.energyEfficiency || 0}%</span>
                      </div>
                      <Progress value={sustainabilityMetrics.energyEfficiency || 0} className="h-2 bg-gray-100" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Water Conservation</span>
                        <span className="text-sm font-medium">{sustainabilityMetrics.waterConservation || 0}%</span>
                      </div>
                      <Progress value={sustainabilityMetrics.waterConservation || 0} className="h-2 bg-gray-100" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Waste Reduction</span>
                        <span className="text-sm font-medium">{sustainabilityMetrics.wasteReduction || 0}%</span>
                      </div>
                      <Progress value={sustainabilityMetrics.wasteReduction || 0} className="h-2 bg-gray-100" />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p>No sustainability data available</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="outline" className="w-full">
                  <Leaf className="h-4 w-4 mr-2" />
                  Improve Sustainability
                </Button>
              </CardFooter>
            </Card>

            {/* Smart Home Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-blue-500" />
                  Smart Home
                </CardTitle>
                <CardDescription>Control smart devices remotely</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <Wifi className="h-4 w-4 text-blue-600" />
                      </div>
                      <span>WiFi</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleSmartHome('WiFi settings')}>Configure</Button>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                        <Thermometer className="h-4 w-4 text-amber-600" />
                      </div>
                      <span>Thermostat</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleSmartHome('Thermostat control')}>Control</Button>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <Lock className="h-4 w-4 text-green-600" />
                      </div>
                      <span>Smart Locks</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleSmartHome('Smart lock access')}>Manage</Button>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                        <Lightbulb className="h-4 w-4 text-yellow-600" />
                      </div>
                      <span>Lighting</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleSmartHome('Lighting control')}>Control</Button>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                        <Camera className="h-4 w-4 text-purple-600" />
                      </div>
                      <span>Cameras</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleSmartHome('Security camera access')}>View</Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Smart Home Dashboard
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default PropertyDetails;