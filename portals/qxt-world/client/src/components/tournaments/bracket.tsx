import { Match, Tournament, User } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Loader2, Edit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface BracketProps {
  tournament: Tournament;
}

interface MatchWithPlayers extends Match {
  player1?: { id: number; fullName: string } | null;
  player2?: { id: number; fullName: string } | null;
  referee?: User | null;
  isLocked?: boolean; 
  notes?: string; 
  tableNumber?: number | null; 
}

interface UpdateMatchForm {
  score1: number | null;
  score2: number | null;
  frameCount: number;
  refereeId: string;
  startTime: Date;
  canDraw: boolean;
  tableNumber: number | null;
  notes: string;
}

export default function Bracket({ tournament }: BracketProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isReferee = user?.role === 'referee';
  const canEditScores = isAdmin || isReferee;

  const { data: matches = [], isLoading } = useQuery<MatchWithPlayers[]>({
    queryKey: [`/api/tournaments/${tournament.id}/matches`],
    refetchInterval: 5000,
  });

  const { data: referees = [] } = useQuery<User[]>({
    queryKey: ["/api/users"],
    select: (users) => users.filter(u => u.role === 'referee'),
  });

  const updateMatchMutation = useMutation({
    mutationFn: async ({ matchId, data }: { matchId: number; data: UpdateMatchForm }) => {
      await apiRequest("PATCH", `/api/matches/${matchId}`, {
        ...data,
        refereeId: data.refereeId ? parseInt(data.refereeId) : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/tournaments/${tournament.id}/matches`] });
      toast({
        title: "Match updated",
        description: "The match has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update match",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const matchesByRound = matches.reduce((acc: MatchWithPlayers[][], match) => {
    const roundIndex = match.round - 1;
    if (!acc[roundIndex]) {
      acc[roundIndex] = [];
    }
    acc[roundIndex].push(match);
    return acc;
  }, []);

  const EditMatchDialog = ({ match }: { match: MatchWithPlayers }) => {
    const form = useForm<UpdateMatchForm>({
      defaultValues: {
        score1: match.score1 ?? 0,
        score2: match.score2 ?? 0,
        frameCount: match.frameCount ?? 5,
        refereeId: match.refereeId?.toString() ?? "",
        startTime: match.startTime ? new Date(match.startTime) : new Date(),
        canDraw: match.canDraw ?? false,
        tableNumber: match.tableNumber ?? null,
        notes: match.notes ?? "",
      },
    });

    const onSubmit = (data: UpdateMatchForm) => {
      updateMatchMutation.mutate({ matchId: match.id, data });
    };

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Match Details</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {(isAdmin || isReferee) && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="score1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{match.player1?.fullName || 'Player 1'}</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            value={field.value ?? ''} 
                            onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="score2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{match.player2?.fullName || 'Player 2'}</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            value={field.value ?? ''} 
                            onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <FormField
                control={form.control}
                name="tableNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Table Number</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        value={field.value ?? ''} 
                        onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="frameCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Best of Frames</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frame count" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[3, 5, 7, 9, 11].map((count) => (
                          <SelectItem key={count} value={count.toString()}>
                            Best of {count}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="refereeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign Referee</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a referee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {referees.map((referee) => (
                          <SelectItem key={referee.id} value={referee.id.toString()}>
                            {referee.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Match Date & Time</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP HH:mm")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(tournament.startDate) ||
                            date > new Date(tournament.endDate)
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="canDraw"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Allow Draw</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Match Notes</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={updateMatchMutation.isPending}
              >
                {updateMatchMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Update Match'
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-8 p-4 min-w-[800px]">
        {matchesByRound.map((round, roundIndex) => (
          <div
            key={roundIndex}
            className="flex flex-col gap-8 relative"
            style={{
              marginTop: `${roundIndex * 32}px`
            }}
          >
            <div className="mb-4 text-sm font-medium text-muted-foreground">
              Round {roundIndex + 1}
            </div>
            {round.map((match) => (
              <div key={match.id} className="relative">
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      className={`w-64 relative ${
                        match.status === 'completed' ? 'border-primary/50' : ''
                      }`}
                    >
                      <EditMatchDialog match={match} />
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <motion.div
                            className={`p-2 rounded transition-colors ${
                              match.winner === match.player1Id ? 'bg-primary/10' : ''
                            }`}
                            animate={{
                              backgroundColor: match.winner === match.player1Id ? 'rgba(var(--primary), 0.1)' : 'transparent'
                            }}
                          >
                            <p className="font-medium">
                              {match.player1?.fullName || 'TBD'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {match.score1 ?? 0}
                            </p>
                          </motion.div>
                          <motion.div
                            className={`p-2 rounded transition-colors ${
                              match.winner === match.player2Id ? 'bg-primary/10' : ''
                            }`}
                            animate={{
                              backgroundColor: match.winner === match.player2Id ? 'rgba(var(--primary), 0.1)' : 'transparent'
                            }}
                          >
                            <p className="font-medium">
                              {match.player2?.fullName || 'TBD'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {match.score2 ?? 0}
                            </p>
                          </motion.div>
                          <div className="text-xs text-muted-foreground mt-2">
                            {match.referee && (
                              <p>Referee: {match.referee.fullName}</p>
                            )}
                            {match.frameCount && (
                              <p>Best of {match.frameCount}</p>
                            )}
                            {match.tableNumber && (
                              <p>Table: {match.tableNumber}</p>
                            )}
                            {match.notes && (
                              <p>Notes: {match.notes}</p>
                            )}
                            {match.status === 'scheduled' && match.startTime && (
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                              >
                                Scheduled: {format(new Date(match.startTime), "PPP HH:mm")}
                              </motion.span>
                            )}
                            {match.status === 'in_progress' && (
                              <motion.span
                                className="text-primary"
                                animate={{ opacity: [1, 0.5, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                In Progress
                              </motion.span>
                            )}
                            {match.status === 'completed' && (
                              <motion.span
                                className="text-green-600"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                              >
                                Completed
                              </motion.span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {match.nextMatchNumber > 0 && (
                      <motion.svg
                        className="absolute top-1/2 right-0 w-8 h-px"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <line
                          x1="0"
                          y1="0"
                          x2="32"
                          y2="0"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeDasharray="3,3"
                          className="text-muted-foreground"
                        />
                      </motion.svg>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}