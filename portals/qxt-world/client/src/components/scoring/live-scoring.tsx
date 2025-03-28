import { useEffect, useState } from "react";
import { Match, Tournament } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface LiveScoringProps {
  match: Match;
  tournament: Tournament;
}

export default function LiveScoring({ match, tournament }: LiveScoringProps) {
  const { user } = useAuth();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [frameScore1, setFrameScore1] = useState<number>(0);
  const [frameScore2, setFrameScore2] = useState<number>(0);
  const [currentFrame, setCurrentFrame] = useState<number>(1);

  // Connect to WebSocket
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("Connected to WebSocket");
      // Identify the user to the WebSocket server
      if (user) {
        ws.send(JSON.stringify({ type: 'IDENTIFY', userId: user.id }));
      }
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'SCORE_UPDATE' && data.matchId === match.id) {
        queryClient.invalidateQueries({ queryKey: [`/api/tournaments/${tournament.id}/matches`] });
      }
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [user, match.id, tournament.id]);

  const updateScoreMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PATCH", `/api/matches/${match.id}`, {
        score1: match.score1 + (frameScore1 > frameScore2 ? 1 : 0),
        score2: match.score2 + (frameScore2 > frameScore1 ? 1 : 0),
        status: 'in_progress',
      });

      // Send WebSocket update
      if (socket) {
        socket.send(JSON.stringify({
          type: 'SCORE_UPDATE',
          matchId: match.id,
          score1: frameScore1,
          score2: frameScore2,
          frameNumber: currentFrame,
          status: 'in_progress'
        }));
      }
    },
    onSuccess: () => {
      toast({
        title: "Frame Score Updated",
        description: `Frame ${currentFrame} score has been recorded.`,
      });
      setCurrentFrame(prev => prev + 1);
      setFrameScore1(0);
      setFrameScore2(0);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update score",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const completeMatchMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PATCH", `/api/matches/${match.id}`, {
        status: 'completed',
      });

      if (socket) {
        socket.send(JSON.stringify({
          type: 'SCORE_UPDATE',
          matchId: match.id,
          status: 'completed'
        }));
      }
    },
    onSuccess: () => {
      toast({
        title: "Match Completed",
        description: "The match has been marked as completed.",
      });
    },
  });

  if (!user || (user.role !== 'admin' && user.role !== 'referee')) {
    return null;
  }

  const maxFrames = match.frameCount || 5;
  const isMatchComplete = (match.score1 || 0) + (match.score2 || 0) >= Math.ceil(maxFrames / 2);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Scoring - Frame {currentFrame}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">
              {match.player1?.fullName || 'Player 1'}
            </label>
            <Input
              type="number"
              value={frameScore1}
              onChange={(e) => setFrameScore1(parseInt(e.target.value) || 0)}
              min={0}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">
              {match.player2?.fullName || 'Player 2'}
            </label>
            <Input
              type="number"
              value={frameScore2}
              onChange={(e) => setFrameScore2(parseInt(e.target.value) || 0)}
              min={0}
              className="mt-1"
            />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <Button
            onClick={() => updateScoreMutation.mutate()}
            disabled={
              updateScoreMutation.isPending ||
              isMatchComplete ||
              (frameScore1 === frameScore2) ||
              currentFrame > maxFrames
            }
            className="w-full"
          >
            {updateScoreMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Update Frame Score'
            )}
          </Button>

          {isMatchComplete && (
            <Button
              onClick={() => completeMatchMutation.mutate()}
              disabled={completeMatchMutation.isPending}
              variant="secondary"
              className="w-full"
            >
              {completeMatchMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Complete Match'
              )}
            </Button>
          )}
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          Match Score: {match.score1 || 0} - {match.score2 || 0}
          <br />
          Best of {maxFrames} frames
        </div>
      </CardContent>
    </Card>
  );
}
