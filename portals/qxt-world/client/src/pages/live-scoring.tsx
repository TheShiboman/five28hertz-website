import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Scoreboard from "@/components/scoring/scoreboard";
import { useWebSocket } from "@/hooks/use-websocket";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function LiveScoring() {
  const { id } = useParams();
  const { subscribeToScore } = useWebSocket();
  const [liveScore, setLiveScore] = useState<any>(null);

  const { data: match, isLoading } = useQuery({
    queryKey: ["/api/matches", id],
  });

  useEffect(() => {
    if (match) {
      setLiveScore(match);
    }
  }, [match]);

  useEffect(() => {
    subscribeToScore((data) => {
      if (data.match.id === parseInt(id!)) {
        setLiveScore(data.match);
      }
    });
  }, [id, subscribeToScore]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!match) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">Match not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Live Scoring - Match #{id}</CardTitle>
        </CardHeader>
        <CardContent>
          <Scoreboard
            match={liveScore || match}
          />
        </CardContent>
      </Card>
    </div>
  );
}
