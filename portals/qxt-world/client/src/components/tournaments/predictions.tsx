import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Tournament, User } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Trophy, Medal } from "lucide-react";
import { useState } from "react";

interface PredictionsProps {
  tournament: Tournament;
}

interface LeaderboardEntry {
  user: User;
  points: number;
}

export default function Predictions({ tournament }: PredictionsProps) {
  const { user } = useAuth();
  const [selectedWinnerId, setSelectedWinnerId] = useState<number | null>(null);

  const { data: predictions = [] } = useQuery({
    queryKey: [`/api/tournaments/${tournament.id}/predictions`],
  });

  const { data: leaderboard = [] } = useQuery<LeaderboardEntry[]>({
    queryKey: [`/api/tournaments/${tournament.id}/leaderboard`],
  });

  const { data: users = [] } = useQuery({
    queryKey: ["/api/users"],
  });

  const predictionMutation = useMutation({
    mutationFn: async (predictedWinnerId: number) => {
      await apiRequest("POST", "/api/predictions", {
        tournamentId: tournament.id,
        predictedWinnerId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/tournaments/${tournament.id}/predictions`],
      });
      queryClient.invalidateQueries({
        queryKey: [`/api/tournaments/${tournament.id}/leaderboard`],
      });
    },
  });

  const userPrediction = predictions.find(
    (p: any) => p.userId === user?.id
  );

  return (
    <div className="space-y-8">
      {tournament.status === "upcoming" && !userPrediction && (
        <Card>
          <CardHeader>
            <CardTitle>Make Your Prediction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {users.map((player: User) => (
                  <Button
                    key={player.id}
                    variant={selectedWinnerId === player.id ? "default" : "outline"}
                    onClick={() => setSelectedWinnerId(player.id)}
                    className="justify-start"
                  >
                    {player.fullName}
                  </Button>
                ))}
              </div>
              <Button
                onClick={() => selectedWinnerId && predictionMutation.mutate(selectedWinnerId)}
                disabled={!selectedWinnerId || predictionMutation.isPending}
                className="w-full"
              >
                Submit Prediction
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Prediction Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.user.id}
                className="flex items-center justify-between p-4 bg-accent rounded-lg"
              >
                <div className="flex items-center gap-4">
                  {index < 3 && (
                    <Medal className={`h-5 w-5 ${
                      index === 0 ? "text-yellow-500" :
                      index === 1 ? "text-gray-400" :
                      "text-amber-600"
                    }`} />
                  )}
                  <span className="font-medium">{entry.user.fullName}</span>
                </div>
                <span className="text-lg font-bold">{entry.points} points</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}