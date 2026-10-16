import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { Booking, InsertBooking, Property } from "@shared/schema";
import { CalendarX, Clock, Edit, Tag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { getBlockedDates, isDateBlocked } from "@/components/property/availability-utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Create a form schema based on the booking schema from the shared schema
const bookingFormSchema = z.object({
  propertyId: z.number(),
  guestName: z.string().min(2, "Guest name must be at least 2 characters"),
  guestEmail: z.string().email("Please enter a valid email address"),
  guestPhone: z.string().optional(),
  checkIn: z.date({ required_error: "Check-in date is required" }),
  checkOut: z.date({ required_error: "Check-out date is required" }),
  numGuests: z.number().min(1, "Number of guests must be at least 1").default(1),
  totalPrice: z.number().min(1, "Please enter a valid price"),
  status: z.enum(['confirmed', 'pending', 'cancelled'], {
    required_error: "Please select a booking status",
  }),
  notes: z.string().optional(),
}).refine(data => {
  if (data.checkIn && data.checkOut) {
    return data.checkOut > data.checkIn;
  }
  return true;
}, {
  message: "Check-out date must be after check-in date",
  path: ["checkOut"]
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

export default function BookingsPage() {
  const { user } = useAuth();
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  
  // Query to fetch properties owned by the user
  const { data: properties, isLoading: isLoadingProperties } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
    enabled: !!user,
  });
  
  // Query to fetch all bookings
  const { data: allBookings = [], isLoading: isLoadingAllBookings } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
    enabled: !!user,
  });
  
  // Query to fetch bookings for the selected property
  const { data: propertyBookings = [], isLoading: isLoadingPropertyBookings } = useQuery<Booking[]>({
    queryKey: ["/api/properties", selectedProperty, "bookings"],
    queryFn: async () => {
      if (!selectedProperty) return [];
      const res = await fetch(`/api/properties/${selectedProperty}/bookings`);
      if (!res.ok) {
        console.error("Failed to fetch property bookings:", res.status, res.statusText);
        throw new Error("Failed to fetch bookings");
      }
      return res.json();
    },
    enabled: !!selectedProperty,
  });
  
  // Use property bookings if a property is selected, otherwise show all bookings
  const bookings = selectedProperty ? propertyBookings : allBookings;
  const isLoadingBookings = selectedProperty ? isLoadingPropertyBookings : isLoadingAllBookings;
  
  // Mutation to create a new booking
  const createBookingMutation = useMutation({
    mutationFn: async (data: InsertBooking) => {
      const res = await apiRequest("POST", `/api/bookings`, data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking created",
        description: "The booking has been created successfully.",
      });
      setIsCreatingBooking(false);
      // Invalidate both the specific property bookings and all bookings
      if (selectedProperty) {
        queryClient.invalidateQueries({ queryKey: ["/api/properties", selectedProperty, "bookings"] });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
    },
    onError: (error: Error | { status?: number; message?: string }) => {
      // Check if this is a booking conflict error (HTTP 409)
      const isConflictError = 
        typeof error === 'object' && 
        error !== null && 
        'status' in error && 
        error.status === 409;
      
      toast({
        title: isConflictError ? "Booking Conflict" : "Error creating booking",
        description: isConflictError 
          ? "The selected dates conflict with an existing booking. Please choose different dates."
          : error.message || "An unknown error occurred",
        variant: "destructive",
      });
    },
  });
  
  // Mutation to cancel a booking
  const cancelBookingMutation = useMutation({
    mutationFn: async (bookingId: number) => {
      const res = await apiRequest("POST", `/api/bookings/${bookingId}/cancel`, {});
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking cancelled",
        description: "The booking has been cancelled successfully.",
      });
      // Invalidate both the specific property bookings and all bookings
      if (selectedProperty) {
        queryClient.invalidateQueries({ queryKey: ["/api/properties", selectedProperty, "bookings"] });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error cancelling booking",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Keep track of blocked dates
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  
  // Update blocked dates when property or bookings change
  useEffect(() => {
    if (propertyBookings?.length) {
      // Get all blocked dates from existing bookings
      const dates = getBlockedDates(propertyBookings);
      setBlockedDates(dates);
    } else {
      setBlockedDates([]);
    }
  }, [propertyBookings]);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      propertyId: selectedProperty || undefined,
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      checkIn: new Date(),
      checkOut: new Date(new Date().setDate(new Date().getDate() + 1)),
      numGuests: 1,
      totalPrice: 0,
      status: "confirmed", // Default to confirmed
      notes: "",
    },
  });
  
  function onSubmit(data: BookingFormValues) {
    createBookingMutation.mutate({
      ...data,
      checkIn: data.checkIn.toISOString(),
      checkOut: data.checkOut.toISOString(),
      // Use the status from the form
      status: data.status
    } as InsertBooking);
  }
  
  function handleCancelBooking(bookingId: number) {
    if (confirm("Are you sure you want to cancel this booking?")) {
      cancelBookingMutation.mutate(bookingId);
    }
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Bookings Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>My Properties</CardTitle>
            <CardDescription>Select a property to view its bookings</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingProperties ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-2">
                {properties?.map((property) => (
                  <Button
                    key={property.id}
                    variant={selectedProperty === property.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => {
                      setSelectedProperty(property.id);
                      form.setValue("propertyId", property.id);
                    }}
                  >
                    {property.name}
                  </Button>
                ))}
                {!properties?.length && (
                  <div className="text-center py-4 text-muted-foreground">
                    No properties found. Add a property first.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="md:col-span-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Bookings</CardTitle>
                <CardDescription>
                  {selectedProperty
                    ? "Manage bookings for this property"
                    : "Select a property to view bookings"}
                </CardDescription>
              </div>
              
              {selectedProperty && (
                <Dialog open={isCreatingBooking} onOpenChange={setIsCreatingBooking}>
                  <DialogTrigger asChild>
                    <Button>Add Booking</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Add New Booking</DialogTitle>
                      <DialogDescription>
                        Create a new booking for this property. Fill out all the required fields.
                      </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="guestName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Guest Name</FormLabel>
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
                                  <Input placeholder="john@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="guestPhone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="+1 123 456 7890" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
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
                                    {...field} 
                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="checkIn"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Check-in Date</FormLabel>
                                <FormControl>
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => {
                                      // Disable dates in the past
                                      if (date < new Date()) return true;
                                      
                                      // Disable dates that are already booked
                                      return isDateBlocked(date, blockedDates);
                                    }}
                                    initialFocus
                                  />
                                </FormControl>
                                <FormMessage />
                                {blockedDates.length > 0 && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Dates marked as disabled are already booked
                                  </p>
                                )}
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="checkOut"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Check-out Date</FormLabel>
                                <FormControl>
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => {
                                      // Disable dates in the past
                                      if (date < new Date()) return true;
                                      
                                      // Disable dates that are before or on the check-in date
                                      const checkInDate = form.getValues().checkIn;
                                      if (checkInDate && date <= checkInDate) return true;
                                      
                                      // Disable dates that are already booked
                                      // (guests check out on the same day new guests can check in)
                                      return isDateBlocked(date, blockedDates);
                                    }}
                                    initialFocus
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="totalPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Total Price ($)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min={0} 
                                  step={0.01} 
                                  {...field} 
                                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Booking Status</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="confirmed">Confirmed</SelectItem>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Notes (Optional)</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Any special requests or notes about the booking" 
                                  className="resize-none" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <DialogFooter>
                          <Button 
                            variant="outline" 
                            type="button" 
                            onClick={() => setIsCreatingBooking(false)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            disabled={createBookingMutation.isPending}
                          >
                            {createBookingMutation.isPending ? (
                              <>
                                <div className="animate-spin mr-2 h-4 w-4 border-b-2 border-current"></div>
                                Creating Booking...
                              </>
                            ) : (
                              "Create Booking"
                            )}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              )}
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="list" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="list">List View</TabsTrigger>
                  <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                </TabsList>
                
                <TabsContent value="list">
                  {isLoadingBookings ? (
                    <div className="flex items-center justify-center h-60">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                  ) : !bookings?.length ? (
                    <div className="text-center py-12 border rounded-lg">
                      <CalendarX className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No bookings found</h3>
                      <p className="text-muted-foreground">
                        {selectedProperty 
                          ? "This property doesn't have any bookings yet. Create one to get started."
                          : "Select a property to view its bookings."}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <Card key={booking.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle>{booking.guestName}</CardTitle>
                                <CardDescription>{booking.guestEmail}</CardDescription>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  booking.status === 'confirmed' 
                                    ? 'bg-green-100 text-green-700' 
                                    : booking.status === 'cancelled' 
                                    ? 'bg-red-100 text-red-700' 
                                    : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          
                          <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <div className="text-muted-foreground">Check-in</div>
                                <div className="font-medium">
                                  {format(new Date(booking.checkIn), 'PP')}
                                </div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Check-out</div>
                                <div className="font-medium">
                                  {format(new Date(booking.checkOut), 'PP')}
                                </div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Guests</div>
                                <div className="font-medium">{booking.numGuests}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Total Price</div>
                                <div className="font-medium">${booking.totalPrice}</div>
                              </div>
                            </div>
                            
                            {booking.notes && (
                              <div className="mt-4 border-t pt-4">
                                <div className="text-muted-foreground mb-1">Notes:</div>
                                <div>{booking.notes}</div>
                              </div>
                            )}
                          </CardContent>
                          
                          <CardFooter className="flex justify-end gap-2">
                            {booking.status !== 'cancelled' && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleCancelBooking(booking.id)}
                                disabled={cancelBookingMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Cancel Booking
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // This would open an edit dialog in a real implementation
                                toast({
                                  title: "Edit functionality",
                                  description: "Editing bookings is not implemented in this demo.",
                                });
                              }}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="calendar">
                  {isLoadingBookings ? (
                    <div className="flex items-center justify-center h-60">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                  ) : !bookings?.length ? (
                    <div className="text-center py-12 border rounded-lg">
                      <CalendarX className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No bookings found</h3>
                      <p className="text-muted-foreground">
                        {selectedProperty 
                          ? "This property doesn't have any bookings yet. Create one to get started."
                          : "Select a property to view its bookings."}
                      </p>
                    </div>
                  ) : (
                    <div className="border rounded-lg p-4">
                      <div className="mb-4">
                        <h3 className="text-lg font-medium mb-1">Booking Calendar</h3>
                        <p className="text-sm text-muted-foreground">
                          Red dates are booked. Gray dates are in the past.
                        </p>
                      </div>
                      
                      <div className="flex justify-center">
                        <Calendar
                          mode="multiple"
                          selected={blockedDates}
                          modifiers={{
                            booked: blockedDates
                          }}
                          modifiersStyles={{
                            booked: { backgroundColor: 'rgba(239, 68, 68, 0.15)', color: 'rgb(185, 28, 28)' }
                          }}
                          className="rounded-md border w-auto"
                          disabled={(date) => date < new Date()}
                          disableNavigation={false}
                        />
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="text-md font-medium mb-2">Upcoming Bookings</h4>
                        <div className="space-y-3 mt-2">
                          {bookings
                            .filter(booking => booking.status === 'confirmed' && new Date(booking.checkIn) >= new Date())
                            .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime())
                            .slice(0, 3)
                            .map(booking => (
                              <div 
                                key={booking.id} 
                                className="flex justify-between p-3 border rounded-md bg-gray-50"
                              >
                                <div>
                                  <p className="font-medium">{booking.guestName}</p>
                                  <p className="text-sm text-gray-600">
                                    {format(new Date(booking.checkIn), 'PPP')} - {format(new Date(booking.checkOut), 'PPP')}
                                  </p>
                                </div>
                                <div className="flex items-center">
                                  <span className="font-semibold">${booking.totalPrice}</span>
                                </div>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}