import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Tournament, insertTournamentSchema, disciplineTypes, tournamentFormats } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trophy, Users, Calendar, Loader2, Timer, History, BarChart } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { cueSportsDisciplines, matchTypes } from "@shared/schema";
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { VenueDialog } from "@/components/venue-dialog";

export default function TournamentPage() {
  const { user } = useAuth();
  const [venueDialogOpen, setVenueDialogOpen] = React.useState(false);
  const [tournamentDialogOpen, setTournamentDialogOpen] = React.useState(false);

  const { data: tournaments = [], isLoading } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
  });

  const { data: venues = [], refetch: refetchVenues } = useQuery({
    queryKey: ["/api/venues"],
  });

  const { data: registeredPlayers = [] } = useQuery({
    queryKey: ["/api/tournaments", "registrations"],
    enabled: user?.role === 'admin' || user?.role === 'referee',
  });

  const { data: allPlayers = [] } = useQuery({
    queryKey: ["/api/users"],
    enabled: user?.role === 'admin' || user?.role === 'referee',
  });

  const registerPlayerMutation = useMutation({
    mutationFn: async ({ tournamentId, userId }: { tournamentId: number; userId: number }) => {
      await apiRequest("POST", `/api/tournaments/${tournamentId}/register-player`, { userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
      toast({
        title: "Success",
        description: "Player registered successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to register player",
        variant: "destructive"
      });
    }
  });

  const selfRegisterMutation = useMutation({
    mutationFn: async (tournamentId: number) => {
      await apiRequest("POST", `/api/tournaments/${tournamentId}/register`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
      toast({
        title: "Success",
        description: "Successfully registered for tournament.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to register for tournament",
        variant: "destructive"
      });
    }
  });

  const form = useForm({
    resolver: zodResolver(insertTournamentSchema),
    defaultValues: {
      name: "",
      discipline: "Snooker",
      disciplineType: "Full Reds",
      matchType: "Single",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      registrationDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      format: "Single Elimination",
      participants: "32",
      prize: "1000",
      participationFee: "20",
      description: "",
      venueId: undefined,
      organizerDetails: {
        contactEmail: user?.email || "",
        contactPhone: "",
        website: ""
      }
    }
  });

  const onSubmit = async (values: any) => {
    try {
      console.log('Form state:', form.formState);
      console.log('Form errors:', form.formState.errors);
      console.log('Submitting values:', values);

      const formattedData = {
        name: values.name,
        discipline: values.discipline,
        disciplineType: values.disciplineType,
        matchType: values.matchType,
        organizerId: user!.id,
        venueId: values.venueId ? parseInt(values.venueId) : undefined,
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
        status: "upcoming",
        format: values.format,
        participants: parseInt(values.participants),
        registrationDeadline: new Date(values.registrationDeadline).toISOString(),
        currentParticipants: 0,
        prize: parseInt(values.prize),
        participationFee: parseInt(values.participationFee),
        description: values.description || "",
        type: values.matchType,
        organizerDetails: {
          contactEmail: values.organizerDetails.contactEmail || user?.email || "",
          contactPhone: values.organizerDetails.contactPhone || "",
          website: values.organizerDetails.website || ""
        }
      };

      const response = await apiRequest("POST", "/api/tournaments", formattedData);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create tournament');
      }

      await queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
      toast({
        title: "Success",
        description: "Tournament created successfully.",
      });
      setTournamentDialogOpen(false);
      form.reset();
    } catch (error: any) {
      console.error("Failed to create tournament:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create tournament. Please ensure all required fields are filled correctly.",
        variant: "destructive"
      });
    }
  };

  const selectedDiscipline = form.watch("discipline") as keyof typeof disciplineTypes;

  React.useEffect(() => {
    form.setValue("disciplineType", disciplineTypes[selectedDiscipline][0]);
  }, [selectedDiscipline, form]);

  const renderRegistrationButtons = (tournament: Tournament) => {
    if (user?.role === 'admin' || user?.role === 'referee') {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Manage Registrations</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Tournament Registrations</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Register New Player</h3>
                <Select onValueChange={(userId) => {
                  registerPlayerMutation.mutate({
                    tournamentId: tournament.id,
                    userId: parseInt(userId)
                  });
                }}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select a player" />
                  </SelectTrigger>
                  <SelectContent>
                    {allPlayers.map((player: any) => (
                      <SelectItem key={player.id} value={player.id.toString()}>
                        {player.fullName || player.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Player</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registeredPlayers.map((registration: any) => (
                    <TableRow key={registration.id}>
                      <TableCell>{registration.user?.fullName || registration.user?.username}</TableCell>
                      <TableCell className="capitalize">{registration.status}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Remove</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>
      );
    } else if (user?.role === 'player') {
      return (
        <Button
          onClick={() => selfRegisterMutation.mutate(tournament.id)}
          disabled={
            tournament.currentParticipants >= tournament.participants ||
            new Date(tournament.registrationDeadline) < new Date()
          }
        >
          Register
        </Button>
      );
    }
    return null;
  };

  const ongoing = tournaments.filter(t => t.status === 'in_progress');
  const upcoming = tournaments.filter(t => t.status === 'upcoming');
  const past = tournaments.filter(t => t.status === 'completed');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-[#C4A44E]">Tournaments & Matches</h1>
        {(user?.role === "admin" || user?.role === "referee") && (
          <div className="flex gap-2">
            <Dialog open={tournamentDialogOpen} onOpenChange={setTournamentDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#C4A44E] hover:bg-[#D4C28A] text-white shadow-lg transition-all duration-200 border border-[#C4A44E]/20">
                  Create Tournament
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-[#041D21] border border-[#C4A44E] shadow-[0_0_15px_rgba(196,164,78,0.1)]">
                <DialogHeader>
                  <DialogTitle className="text-[#C4A44E]">Create New Tournament</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form 
                    onSubmit={form.handleSubmit(onSubmit)} 
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#C4A44E]">Tournament Name</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Enter tournament name" 
                              className="border-[#C4A44E] focus:border-[#D4C28A] focus:ring-[#C4A44E] focus:ring-opacity-50 bg-[#062128] transition-all duration-200"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="discipline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#C4A44E]">Discipline</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select discipline" />
                              </SelectTrigger>
                              <SelectContent>
                                {cueSportsDisciplines.map((discipline) => (
                                  <SelectItem key={discipline} value={discipline}>
                                    {discipline}
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
                        name="disciplineType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#C4A44E]">Discipline Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                {disciplineTypes[selectedDiscipline].map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>


                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="matchType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#C4A44E]">Match Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select match type" />
                              </SelectTrigger>
                              <SelectContent>
                                {matchTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
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
                        name="format"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#C4A44E]">Tournament Format</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select format" />
                              </SelectTrigger>
                              <SelectContent>
                                {tournamentFormats.map((format) => (
                                  <SelectItem key={format} value={format}>
                                    {format}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#C4A44E]">Start Date</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type="date" 
                                  {...field} 
                                  className="border-[#C4A44E] focus:border-[#D4C28A] focus:ring-[#C4A44E] focus:ring-opacity-50 bg-[#062128] transition-all duration-200 pl-10 [&::-webkit-calendar-picker-indicator]:bg-[#C4A44E] [&::-webkit-calendar-picker-indicator]:hover:bg-[#D4C28A] [&::-webkit-calendar-picker-indicator]:rounded [&::-webkit-calendar-picker-indicator]:p-1 [&::-webkit-calendar-picker-indicator]:shadow-[0_0_5px_rgba(196,164,78,0.3)] [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                />
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#C4A44E] pointer-events-none" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#C4A44E]">End Date</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type="date" 
                                  {...field} 
                                  className="border-[#C4A44E] focus:border-[#D4C28A] focus:ring-[#C4A44E] focus:ring-opacity-50 bg-[#062128] transition-all duration-200 pl-10 [&::-webkit-calendar-picker-indicator]:bg-[#C4A44E] [&::-webkit-calendar-picker-indicator]:hover:bg-[#D4C28A] [&::-webkit-calendar-picker-indicator]:rounded [&::-webkit-calendar-picker-indicator]:p-1 [&::-webkit-calendar-picker-indicator]:shadow-[0_0_5px_rgba(196,164,78,0.3)] [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                />
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#C4A44E] pointer-events-none" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="registrationDeadline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#C4A44E]">Registration Deadline</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type="date" 
                                  {...field} 
                                  className="border-[#C4A44E] focus:border-[#D4C28A] focus:ring-[#C4A44E] focus:ring-opacity-50 bg-[#062128] transition-all duration-200 pl-10 [&::-webkit-calendar-picker-indicator]:bg-[#C4A44E] [&::-webkit-calendar-picker-indicator]:hover:bg-[#D4C28A] [&::-webkit-calendar-picker-indicator]:rounded [&::-webkit-calendar-picker-indicator]:p-1 [&::-webkit-calendar-picker-indicator]:shadow-[0_0_5px_rgba(196,164,78,0.3)] [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                />
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#C4A44E] pointer-events-none" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-[#C4A44E]">Venue Details</h3>
                      </div>
                      <FormField
                        control={form.control}
                        name="venueId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#C4A44E]">Select Venue</FormLabel>
                            <Select onValueChange={field.onChange}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a venue" />
                              </SelectTrigger>
                              <SelectContent>
                                {venues.map((venue: any) => (
                                  <SelectItem key={venue.id} value={venue.id.toString()}>
                                    {venue.name} - {venue.city}, {venue.country}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="participants"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#C4A44E]">Number of Participants</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} min="2" className="border-[#C4A44E] focus:border-[#D4C28A] focus:ring-[#C4A44E] focus:ring-opacity-50 bg-[#062128] transition-all duration-200" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="prize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#C4A44E]">Prize Pool ($)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} min="0" className="border-[#C4A44E] focus:border-[#D4C28A] focus:ring-[#C4A44E] focus:ring-opacity-50 bg-[#062128] transition-all duration-200" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="participationFee"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#C4A44E]">Entry Fee ($)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} min="0" className="border-[#C4A44E] focus:border-[#D4C28A] focus:ring-[#C4A44E] focus:ring-opacity-50 bg-[#062128] transition-all duration-200" />
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
                          <FormLabel className="text-[#C4A44E]">Description</FormLabel>
                          <FormControl>
                            <textarea
                              {...field}
                              className="w-full p-2 border rounded-md bg-background min-h-[100px] border-[#C4A44E] focus:border-[#D4C28A] focus:ring-[#C4A44E] focus:ring-opacity-50 bg-[#062128] transition-all duration-200"
                              placeholder="Enter tournament description"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="organizerDetails.contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#C4A44E]">Contact Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} className="border-[#C4A44E] focus:border-[#D4C28A] focus:ring-[#C4A44E] focus:ring-opacity-50 bg-[#062128] transition-all duration-200" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="organizerDetails.contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#C4A44E]">Contact Phone</FormLabel>
                          <FormControl>
                            <Input type="tel" {...field} className="border-[#C4A44E] focus:border-[#D4C28A] focus:ring-[#C4A44E] focus:ring-opacity-50 bg-[#062128] transition-all duration-200" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="organizerDetails.website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#C4A44E]">Website</FormLabel>
                          <FormControl>
                            <Input type="url" {...field} className="border-[#C4A44E] focus:border-[#D4C28A] focus:ring-[#C4A44E] focus:ring-opacity-50 bg-[#062128] transition-all duration-200" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      {Object.keys(form.formState.errors).length > 0 && (
                        <div className="text-sm text-destructive space-y-1">
                          <p>Please fix the following errors:</p>
                          {Object.entries(form.formState.errors).map(([key, error]: [string, any]) => {
                            const errorMessage = error.message || 
                              (key === "organizerDetails" ? "Please fill in all organizer contact details" : 
                               `${key.charAt(0).toUpperCase() + key.slice(1)} is required`);
                            return (
                              <p key={key}>• {errorMessage}</p>
                            );
                          })}
                        </div>
                      )}
                      <Button 
                        type="submit" 
                        className="w-full bg-[#C4A44E] hover:bg-[#D4C28A] text-white shadow-md transition-all duration-200"
                        disabled={form.formState.isSubmitting}
                      >
                        {form.formState.isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          'Create Tournament'
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <VenueDialog 
              open={venueDialogOpen}
              onOpenChange={setVenueDialogOpen}
              onSuccess={refetchVenues}
            />
          </div>
        )}
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 border-b border-[#C4A44E]/20">
          <TabsTrigger 
            value="ongoing" 
            className="flex items-center gap-2 text-[#D4C28A] data-[state=active]:text-[#C4A44E] data-[state=active]:border-b-2 data-[state=active]:border-[#C4A44E]"
          >
            <Timer className="h-4 w-4" />
            Live Matches
          </TabsTrigger>
          <TabsTrigger 
            value="upcoming"
            className="flex items-center gap-2 text-[#D4C28A] data-[state=active]:text-[#C4A44E] data-[state=active]:border-b-2 data-[state=active]:border-[#C4A44E]"
          >
            <Calendar className="h-4 w-4" />
            Upcoming
          </TabsTrigger>
          <TabsTrigger 
            value="past"
            className="flex items-center gap-2 text-[#D4C28A] data-[state=active]:text-[#C4A44E] data-[state=active]:border-b-2 data-[state=active]:border-[#C4A44E]"
          >
            <History className="h-4 w-4" />
            Past Tournaments
          </TabsTrigger>
          <TabsTrigger 
            value="analysis"
            className="flex items-center gap-2 text-[#D4C28A] data-[state=active]:text-[#C4A44E] data-[state=active]:border-b-2 data-[state=active]:border-[#C4A44E]"
          >
            <BarChart className="h-4 w-4" />
            Match Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ongoing">
          <div className="space-y-6">
            {ongoing.length > 0 ? (
              ongoing.map(tournament => (
                <Card key={tournament.id} className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-[#C4A44E]" />
                        <CardTitle className="text-[#C4A44E]">{tournament.name}</CardTitle>
                      </div>
                      <div className="flex gap-2">
                        {user?.role === 'admin' && tournament.status === 'upcoming' && (
                          <Button
                            onClick={async () => {
                              try {
                                await apiRequest("POST", `/api/tournaments/${tournament.id}/start`);
                                queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
                                toast({
                                  title: "Tournament Started",
                                  description: "The tournament has been started and matches have been generated.",
                                });
                              } catch (error: any) {
                                toast({
                                  title: "Error",
                                  description: error.message || "Failed to start tournament",
                                  variant: "destructive"
                                });
                              }
                            }}
                          >
                            Start Tournament
                          </Button>
                        )}
                        {renderRegistrationButtons(tournament)}
                      </div>
                    </div>
                    <div className="text-sm text-[#D4C28A]">
                      {tournament.description}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-[#D4C28A]" />
                          <span className="text-sm text-[#D4C28A]">
                            {new Date(tournament.startDate).toLocaleDateString()} -
                            {new Date(tournament.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-[#D4C28A]" />
                          <span className="text-sm text-[#D4C28A]">
                            {tournament.currentParticipants} / {tournament.participants} participants
                          </span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-lg font-bold text-[#C4A44E]">
                            Prize Pool: ${tournament.prize.toLocaleString()}
                          </p>
                          <p className="text-sm text-[#D4C28A]">
                            Entry Fee: ${tournament.participationFee.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-[#C4A44E]">Format</p>
                          <p className="text-sm text-[#D4C28A]">{tournament.format}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#C4A44E]">Registration Deadline</p>
                          <p className="text-sm text-[#D4C28A]">
                            {new Date(tournament.registrationDeadline).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#C4A44E]">Status</p>
                          <p className="text-sm text-[#D4C28A] capitalize">{tournament.status}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-[#D4C28A]">No live matches at the moment.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="upcoming">
          <div className="space-y-6">
            {upcoming.length > 0 ? (
              upcoming.map(tournament => (
                <Card key={tournament.id} className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-[#C4A44E]" />
                        <CardTitle className="text-[#C4A44E]">{tournament.name}</CardTitle>
                      </div>
                      <div className="flex gap-2">
                        {user?.role === 'admin' && tournament.status === 'upcoming' && (
                          <Button
                            onClick={async () => {
                              try {
                                await apiRequest("POST", `/api/tournaments/${tournament.id}/start`);
                                queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
                                toast({
                                  title: "Tournament Started",
                                  description: "The tournament has been started and matches have been generated.",
                                });
                              } catch (error: any) {
                                toast({
                                  title: "Error",
                                  description: error.message || "Failed to start tournament",
                                  variant: "destructive"
                                });
                              }
                            }}
                          >
                            Start Tournament
                          </Button>
                        )}
                        {renderRegistrationButtons(tournament)}
                      </div>
                    </div>
                    <div className="text-sm text-[#D4C28A]">
                      {tournament.description}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-[#D4C28A]" />
                          <span className="text-sm text-[#D4C28A]">
                            {new Date(tournament.startDate).toLocaleDateString()} -
                            {new Date(tournament.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-[#D4C28A]" />
                          <span className="text-sm text-[#D4C28A]">
                            {tournament.currentParticipants} / {tournament.participants} participants
                          </span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-lg font-bold text-[#C4A44E]">
                            Prize Pool: ${tournament.prize.toLocaleString()}
                          </p>
                          <p className="text-sm text-[#D4C28A]">
                            Entry Fee: ${tournament.participationFee.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-[#C4A44E]">Format</p>
                          <p className="text-sm text-[#D4C28A]">{tournament.format}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#C4A44E]">Registration Deadline</p>
                          <p className="text-sm text-[#D4C28A]">
                            {new Date(tournament.registrationDeadline).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#C4A44E]">Status</p>
                          <p className="text-sm text-[#D4C28A] capitalize">{tournament.status}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-[#D4C28A]">No upcoming tournaments.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="past">
          <div className="space-y-6">
            {past.length > 0 ? (
              past.map(tournament => (
                <Card key={tournament.id} className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-[#C4A44E]" />
                        <CardTitle className="text-[#C4A44E]">{tournament.name}</CardTitle>
                      </div>
                      <div className="flex gap-2">
                        {renderRegistrationButtons(tournament)}
                      </div>
                    </div>
                    <div className="text-sm text-[#D4C28A]">
                      {tournament.description}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-[#D4C28A]" />
                          <span className="text-sm text-[#D4C28A]">
                            {new Date(tournament.startDate).toLocaleDateString()} -
                            {new Date(tournament.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-[#D4C28A]" />
                          <span className="text-sm text-[#D4C28A]">
                            {tournament.currentParticipants} / {tournament.participants} participants
                          </span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-lg font-bold text-[#C4A44E]">
                            Prize Pool: ${tournament.prize.toLocaleString()}
                          </p>
                          <p className="text-sm text-[#D4C28A]">
                            Entry Fee: ${tournament.participationFee.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-[#C4A44E]">Format</p>
                          <p className="text-sm text-[#D4C28A]">{tournament.format}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#C4A44E]">Registration Deadline</p>
                          <p className="text-sm text-[#D4C28A]">
                            {new Date(tournament.registrationDeadline).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#C4A44E]">Status</p>
                          <p className="text-sm text-[#D4C28A] capitalize">{tournament.status}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-[#D4C28A]">No past tournaments.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analysis">
          <div className="space-y-6">
            <p className="text-center text-[#D4C28A]">Match analysis feature coming soon.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}