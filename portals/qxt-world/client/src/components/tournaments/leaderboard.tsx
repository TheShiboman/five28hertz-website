import { useQuery } from "@tanstack/react-query";
import { Tournament, User } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Medal, Trophy } from "lucide-react";

interface LeaderboardProps {
  tournament: Tournament;
}

interface LeaderboardEntry {
  user: User;
  points: number;
}

export default function Leaderboard({ tournament }: LeaderboardProps) {
  const { data: leaderboard = [], isLoading, error } = useQuery<LeaderboardEntry[]>({
    queryKey: [`/api/tournaments/${tournament.id}/leaderboard`],
  });

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Tournament Prediction Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin text-primary">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Tournament Prediction Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Failed to load leaderboard
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Tournament Prediction Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        {leaderboard.length > 0 ? (
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
                  <div>
                    <p className="font-medium">{entry.user.fullName}</p>
                    <p className="text-sm text-muted-foreground">
                      Rank #{index + 1}
                    </p>
                  </div>
                </div>
                <span className="text-lg font-bold">{entry.points} points</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No predictions made yet for this tournament
          </p>
        )}
      </CardContent>
    </Card>
  );
}