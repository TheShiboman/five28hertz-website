import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format, parse, addDays } from "date-fns";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Loader2, Plus, Edit, Trash, Clock, Calendar as CalendarIcon } from "lucide-react";

// Types from schema
import {
  UserAvailabilityPreferences,
  WeeklyAvailability,
  SpecificDateAvailability,
  BlockedTimePeriod,
} from "@shared/schema";

// Zod schemas for form validation
const weeklyAvailabilitySchema = z.object({
  dayOfWeek: z.coerce.number().min(0).max(6),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  isActive: z.boolean().default(true),
});

const specificDateSchema = z.object({
  date: z.date(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  isAvailable: z.boolean().default(true),
  note: z.string().optional(),
});

const blockedTimeSchema = z.object({
  startDateTime: z.date(),
  endDateTime: z.date(),
  reason: z.string().optional(),
  isRecurring: z.boolean().default(false),
  recurringPattern: z.string().optional(),
});

const preferencesSchema = z.object({
  timezone: z.string(),
  allowCalendarSync: z.boolean().default(false),
});

type WeeklyAvailabilityFormValues = z.infer<typeof weeklyAvailabilitySchema>;
type SpecificDateFormValues = z.infer<typeof specificDateSchema>;
type BlockedTimeFormValues = z.infer<typeof blockedTimeSchema>;
type PreferencesFormValues = z.infer<typeof preferencesSchema>;

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const timezones = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney",
  "Pacific/Auckland",
];

export function AvailabilityTab({ userId }: { userId: number }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("weekly");
  const [isAddingWeekly, setIsAddingWeekly] = useState(false);
  const [isAddingSpecific, setIsAddingSpecific] = useState(false);
  const [isAddingBlocked, setIsAddingBlocked] = useState(false);
  const [editingWeeklyId, setEditingWeeklyId] = useState<number | null>(null);
  const [editingSpecificId, setEditingSpecificId] = useState<number | null>(null);
  const [editingBlockedId, setEditingBlockedId] = useState<number | null>(null);

  // Fetch preferences
  const {
    data: preferences,
    isLoading: isLoadingPrefs,
    error: prefsError,
  } = useQuery<UserAvailabilityPreferences>({
    queryKey: ["/api/availability/preferences"],
    enabled: !!userId && (user?.id === userId),
  });

  // Fetch weekly availability
  const {
    data: weeklyAvailability,
    isLoading: isLoadingWeekly,
    error: weeklyError,
  } = useQuery<WeeklyAvailability[]>({
    queryKey: ["/api/availability/weekly"],
    enabled: !!userId && (user?.id === userId),
  });

  // Fetch specific date availability
  const {
    data: specificDateAvailability,
    isLoading: isLoadingSpecific,
    error: specificError,
  } = useQuery<SpecificDateAvailability[]>({
    queryKey: ["/api/availability/specific-dates"],
    enabled: !!userId && (user?.id === userId),
  });

  // Fetch blocked time periods
  const {
    data: blockedTimePeriods,
    isLoading: isLoadingBlocked,
    error: blockedError,
  } = useQuery<BlockedTimePeriod[]>({
    queryKey: ["/api/availability/blocked-times"],
    enabled: !!userId && (user?.id === userId),
  });

  // Forms
  const weeklyForm = useForm<WeeklyAvailabilityFormValues>({
    resolver: zodResolver(weeklyAvailabilitySchema),
    defaultValues: {
      dayOfWeek: 1, // Monday
      startTime: "09:00",
      endTime: "17:00",
      isActive: true,
    },
  });

  const specificForm = useForm<SpecificDateFormValues>({
    resolver: zodResolver(specificDateSchema),
    defaultValues: {
      date: new Date(),
      startTime: "09:00",
      endTime: "17:00",
      isAvailable: true,
      note: "",
    },
  });

  const blockedForm = useForm<BlockedTimeFormValues>({
    resolver: zodResolver(blockedTimeSchema),
    defaultValues: {
      startDateTime: new Date(),
      endDateTime: addDays(new Date(), 1),
      reason: "",
      isRecurring: false,
      recurringPattern: "",
    },
  });

  const preferencesForm = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      timezone: "America/New_York",
      allowCalendarSync: false,
    },
  });

  // Update forms with preferences data when available
  useEffect(() => {
    if (preferences) {
      preferencesForm.reset({
        timezone: preferences.timezone || "America/New_York",
        allowCalendarSync: preferences.allowCalendarSync || false,
      });
    }
  }, [preferences, preferencesForm]);

  // Mutations
  const createWeeklyMutation = useMutation({
    mutationFn: async (data: WeeklyAvailabilityFormValues) => {
      const res = await apiRequest("POST", "/api/availability/weekly", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/availability/weekly"] });
      toast({
        title: "Weekly availability added",
        description: "Your weekly availability has been updated.",
      });
      setIsAddingWeekly(false);
      weeklyForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateWeeklyMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: WeeklyAvailabilityFormValues }) => {
      const res = await apiRequest("PATCH", `/api/availability/weekly/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/availability/weekly"] });
      toast({
        title: "Weekly availability updated",
        description: "Your weekly availability has been updated.",
      });
      setEditingWeeklyId(null);
      weeklyForm.reset({
        dayOfWeek: 1,
        startTime: "09:00",
        endTime: "17:00",
        isActive: true,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteWeeklyMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/availability/weekly/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/availability/weekly"] });
      toast({
        title: "Weekly availability deleted",
        description: "Your weekly availability has been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createSpecificMutation = useMutation({
    mutationFn: async (data: SpecificDateFormValues) => {
      const res = await apiRequest("POST", "/api/availability/specific-dates", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/availability/specific-dates"] });
      toast({
        title: "Specific date availability added",
        description: "Your availability for this date has been saved.",
      });
      setIsAddingSpecific(false);
      specificForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateSpecificMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: SpecificDateFormValues }) => {
      const res = await apiRequest("PATCH", `/api/availability/specific-dates/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/availability/specific-dates"] });
      toast({
        title: "Specific date availability updated",
        description: "Your availability for this date has been updated.",
      });
      setEditingSpecificId(null);
      specificForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteSpecificMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/availability/specific-dates/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/availability/specific-dates"] });
      toast({
        title: "Specific date availability deleted",
        description: "Your availability for this date has been removed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createBlockedMutation = useMutation({
    mutationFn: async (data: BlockedTimeFormValues) => {
      const res = await apiRequest("POST", "/api/availability/blocked-times", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/availability/blocked-times"] });
      toast({
        title: "Blocked time added",
        description: "Your blocked time period has been saved.",
      });
      setIsAddingBlocked(false);
      blockedForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateBlockedMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: BlockedTimeFormValues }) => {
      const res = await apiRequest("PATCH", `/api/availability/blocked-times/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/availability/blocked-times"] });
      toast({
        title: "Blocked time updated",
        description: "Your blocked time period has been updated.",
      });
      setEditingBlockedId(null);
      blockedForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteBlockedMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/availability/blocked-times/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/availability/blocked-times"] });
      toast({
        title: "Blocked time deleted",
        description: "Your blocked time period has been removed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (data: PreferencesFormValues) => {
      const res = await apiRequest("POST", "/api/availability/preferences", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/availability/preferences"] });
      toast({
        title: "Preferences updated",
        description: "Your availability preferences have been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Form submission handlers
  const onWeeklySubmit = (data: WeeklyAvailabilityFormValues) => {
    if (editingWeeklyId) {
      updateWeeklyMutation.mutate({ id: editingWeeklyId, data });
    } else {
      createWeeklyMutation.mutate(data);
    }
  };

  const onSpecificSubmit = (data: SpecificDateFormValues) => {
    if (editingSpecificId) {
      updateSpecificMutation.mutate({ id: editingSpecificId, data });
    } else {
      createSpecificMutation.mutate(data);
    }
  };

  const onBlockedSubmit = (data: BlockedTimeFormValues) => {
    if (editingBlockedId) {
      updateBlockedMutation.mutate({ id: editingBlockedId, data });
    } else {
      createBlockedMutation.mutate(data);
    }
  };

  const onPreferencesSubmit = (data: PreferencesFormValues) => {
    updatePreferencesMutation.mutate(data);
  };

  // Edit handlers
  const handleEditWeekly = (availability: WeeklyAvailability) => {
    weeklyForm.reset({
      dayOfWeek: availability.dayOfWeek,
      startTime: availability.startTime.substring(0, 5), // Format from HH:MM:SS to HH:MM
      endTime: availability.endTime.substring(0, 5), // Format from HH:MM:SS to HH:MM
      isActive: availability.isActive,
    });
    setEditingWeeklyId(availability.id);
    setIsAddingWeekly(true);
  };

  const handleEditSpecific = (availability: SpecificDateAvailability) => {
    specificForm.reset({
      date: new Date(availability.date),
      startTime: availability.startTime.substring(0, 5),
      endTime: availability.endTime.substring(0, 5),
      isAvailable: availability.isAvailable,
      note: availability.note || "",
    });
    setEditingSpecificId(availability.id);
    setIsAddingSpecific(true);
  };

  const handleEditBlocked = (blocked: BlockedTimePeriod) => {
    blockedForm.reset({
      startDateTime: new Date(blocked.startDateTime),
      endDateTime: new Date(blocked.endDateTime),
      reason: blocked.reason || "",
      isRecurring: blocked.isRecurring,
      recurringPattern: blocked.recurringPattern || "",
    });
    setEditingBlockedId(blocked.id);
    setIsAddingBlocked(true);
  };

  // Format time display
  const formatTime = (time: string) => {
    if (!time) return "";
    
    // If time is already in 12-hour format or doesn't have seconds, just return it
    if (time.length <= 5 || time.includes("AM") || time.includes("PM")) {
      return time;
    }
    
    // Convert from 24-hour format to 12-hour format
    try {
      const [hours, minutes] = time.split(":").map(Number);
      const period = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
      return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
    } catch (error) {
      return time; // Fallback to original time if parsing fails
    }
  };

  // Only show this tab if the current user is viewing their own profile
  if (user?.id !== userId) {
    return null;
  }

  // Loading state
  if (isLoadingPrefs || isLoadingWeekly || isLoadingSpecific || isLoadingBlocked) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="weekly">Weekly Schedule</TabsTrigger>
          <TabsTrigger value="specific">Specific Dates</TabsTrigger>
          <TabsTrigger value="blocked">Blocked Times</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Weekly Schedule Tab */}
        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Weekly Availability</span>
                <Button onClick={() => { setIsAddingWeekly(true); setEditingWeeklyId(null); }}>
                  <Plus className="h-4 w-4 mr-2" /> Add Time Slot
                </Button>
              </CardTitle>
              <CardDescription>
                Set your recurring weekly availability for skill exchanges.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {weeklyAvailability?.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Day</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>End Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {weeklyAvailability.map((slot) => (
                      <TableRow key={slot.id}>
                        <TableCell>{dayNames[slot.dayOfWeek]}</TableCell>
                        <TableCell>{formatTime(slot.startTime)}</TableCell>
                        <TableCell>{formatTime(slot.endTime)}</TableCell>
                        <TableCell>
                          <span className={slot.isActive ? "text-green-500" : "text-gray-400"}>
                            {slot.isActive ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleEditWeekly(slot)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="text-destructive" 
                            onClick={() => deleteWeeklyMutation.mutate(slot.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No weekly availability set. Add your first time slot.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weekly Availability Dialog */}
          <Dialog open={isAddingWeekly} onOpenChange={setIsAddingWeekly}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingWeeklyId ? "Edit Weekly Availability" : "Add Weekly Availability"}
                </DialogTitle>
                <DialogDescription>
                  Set your recurring availability for skill exchanges.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...weeklyForm}>
                <form onSubmit={weeklyForm.handleSubmit(onWeeklySubmit)} className="space-y-4">
                  <FormField
                    control={weeklyForm.control}
                    name="dayOfWeek"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Day of Week</FormLabel>
                        <Select 
                          value={field.value.toString()} 
                          onValueChange={(value) => field.onChange(parseInt(value))}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a day" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {dayNames.map((day, index) => (
                              <SelectItem key={day} value={index.toString()}>
                                {day}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={weeklyForm.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={weeklyForm.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={weeklyForm.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Active</FormLabel>
                          <FormDescription>
                            Toggle to enable or disable this time slot without removing it.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsAddingWeekly(false);
                        weeklyForm.reset();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createWeeklyMutation.isPending || updateWeeklyMutation.isPending}>
                      {(createWeeklyMutation.isPending || updateWeeklyMutation.isPending) && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {editingWeeklyId ? "Update" : "Add"} Time Slot
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Specific Dates Tab */}
        <TabsContent value="specific" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Specific Date Availability</span>
                <Button onClick={() => { setIsAddingSpecific(true); setEditingSpecificId(null); }}>
                  <Plus className="h-4 w-4 mr-2" /> Add Specific Date
                </Button>
              </CardTitle>
              <CardDescription>
                Set your availability for specific dates that override your weekly schedule.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {specificDateAvailability?.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Availability</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {specificDateAvailability.map((slot) => (
                      <TableRow key={slot.id}>
                        <TableCell>{format(new Date(slot.date), "MMM d, yyyy")}</TableCell>
                        <TableCell>{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</TableCell>
                        <TableCell>
                          <span className={slot.isAvailable ? "text-green-500" : "text-destructive"}>
                            {slot.isAvailable ? "Available" : "Unavailable"}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">{slot.note}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleEditSpecific(slot)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="text-destructive" 
                            onClick={() => deleteSpecificMutation.mutate(slot.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No specific date availability set.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Specific Date Dialog */}
          <Dialog open={isAddingSpecific} onOpenChange={setIsAddingSpecific}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingSpecificId ? "Edit Specific Date" : "Add Specific Date"}
                </DialogTitle>
                <DialogDescription>
                  Set your availability for a specific date.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...specificForm}>
                <form onSubmit={specificForm.handleSubmit(onSpecificSubmit)} className="space-y-4">
                  <FormField
                    control={specificForm.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          className="rounded-md border"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={specificForm.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={specificForm.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={specificForm.control}
                    name="isAvailable"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Available</FormLabel>
                          <FormDescription>
                            Uncheck if you want to mark this time as unavailable.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={specificForm.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Note (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Only available for photography exchanges" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsAddingSpecific(false);
                        specificForm.reset();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createSpecificMutation.isPending || updateSpecificMutation.isPending}>
                      {(createSpecificMutation.isPending || updateSpecificMutation.isPending) && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {editingSpecificId ? "Update" : "Add"} Specific Date
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Blocked Times Tab */}
        <TabsContent value="blocked" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Blocked Time Periods</span>
                <Button onClick={() => { setIsAddingBlocked(true); setEditingBlockedId(null); }}>
                  <Plus className="h-4 w-4 mr-2" /> Add Blocked Time
                </Button>
              </CardTitle>
              <CardDescription>
                Add periods when you're not available for exchanges.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {blockedTimePeriods?.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Start</TableHead>
                      <TableHead>End</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Recurring</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blockedTimePeriods.map((period) => (
                      <TableRow key={period.id}>
                        <TableCell>
                          {format(new Date(period.startDateTime), "MMM d, yyyy h:mm a")}
                        </TableCell>
                        <TableCell>
                          {format(new Date(period.endDateTime), "MMM d, yyyy h:mm a")}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">{period.reason}</TableCell>
                        <TableCell>{period.isRecurring ? "Yes" : "No"}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleEditBlocked(period)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="text-destructive" 
                            onClick={() => deleteBlockedMutation.mutate(period.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No blocked time periods set.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Blocked Time Dialog */}
          <Dialog open={isAddingBlocked} onOpenChange={setIsAddingBlocked}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingBlockedId ? "Edit Blocked Time" : "Add Blocked Time"}
                </DialogTitle>
                <DialogDescription>
                  Add a period when you're not available for skill exchanges.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...blockedForm}>
                <form onSubmit={blockedForm.handleSubmit(onBlockedSubmit)} className="space-y-4">
                  <div className="space-y-4">
                    <FormField
                      control={blockedForm.control}
                      name="startDateTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date & Time</FormLabel>
                          <div className="grid grid-cols-2 gap-2">
                            <FormControl>
                              <Input 
                                type="date" 
                                value={format(field.value, "yyyy-MM-dd")}
                                onChange={(e) => {
                                  const date = new Date(e.target.value);
                                  const currentDate = field.value;
                                  currentDate.setFullYear(date.getFullYear());
                                  currentDate.setMonth(date.getMonth());
                                  currentDate.setDate(date.getDate());
                                  field.onChange(new Date(currentDate));
                                }}
                              />
                            </FormControl>
                            <FormControl>
                              <Input 
                                type="time" 
                                value={format(field.value, "HH:mm")}
                                onChange={(e) => {
                                  const [hours, minutes] = e.target.value.split(':').map(Number);
                                  const currentDate = field.value;
                                  currentDate.setHours(hours);
                                  currentDate.setMinutes(minutes);
                                  field.onChange(new Date(currentDate));
                                }}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={blockedForm.control}
                      name="endDateTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date & Time</FormLabel>
                          <div className="grid grid-cols-2 gap-2">
                            <FormControl>
                              <Input 
                                type="date" 
                                value={format(field.value, "yyyy-MM-dd")}
                                onChange={(e) => {
                                  const date = new Date(e.target.value);
                                  const currentDate = field.value;
                                  currentDate.setFullYear(date.getFullYear());
                                  currentDate.setMonth(date.getMonth());
                                  currentDate.setDate(date.getDate());
                                  field.onChange(new Date(currentDate));
                                }}
                              />
                            </FormControl>
                            <FormControl>
                              <Input 
                                type="time" 
                                value={format(field.value, "HH:mm")}
                                onChange={(e) => {
                                  const [hours, minutes] = e.target.value.split(':').map(Number);
                                  const currentDate = field.value;
                                  currentDate.setHours(hours);
                                  currentDate.setMinutes(minutes);
                                  field.onChange(new Date(currentDate));
                                }}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={blockedForm.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Doctor's appointment" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={blockedForm.control}
                    name="isRecurring"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Recurring</FormLabel>
                          <FormDescription>
                            Is this a recurring event (e.g., weekly class)?
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  {blockedForm.watch("isRecurring") && (
                    <FormField
                      control={blockedForm.control}
                      name="recurringPattern"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recurring Pattern</FormLabel>
                          <Select 
                            value={field.value || ""} 
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a pattern" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="biweekly">Bi-weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsAddingBlocked(false);
                        blockedForm.reset();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createBlockedMutation.isPending || updateBlockedMutation.isPending}>
                      {(createBlockedMutation.isPending || updateBlockedMutation.isPending) && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {editingBlockedId ? "Update" : "Add"} Blocked Time
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Availability Preferences</CardTitle>
              <CardDescription>
                Set your timezone and calendar integration preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...preferencesForm}>
                <form onSubmit={preferencesForm.handleSubmit(onPreferencesSubmit)} className="space-y-4">
                  <FormField
                    control={preferencesForm.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timezone</FormLabel>
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your timezone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timezones.map((tz) => (
                              <SelectItem key={tz} value={tz}>
                                {tz.replace("_", " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={preferencesForm.control}
                    name="allowCalendarSync"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Enable Calendar Integration</FormLabel>
                          <FormDescription>
                            Allow ExchangeSphere to sync with your external calendar.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  {preferencesForm.watch("allowCalendarSync") && (
                    <Card className="border-dashed">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">External Calendar Integration</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col gap-4">
                          <Button variant="outline" className="flex justify-start">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            Connect Google Calendar
                          </Button>
                          <Button variant="outline" className="flex justify-start">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            Connect Apple Calendar (iCal)
                          </Button>
                          <Button variant="outline" className="flex justify-start">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            Connect Outlook Calendar
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-4">
                          Note: Calendar integration is coming soon. You'll be notified when it's available.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={updatePreferencesMutation.isPending}
                  >
                    {updatePreferencesMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Preferences
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}