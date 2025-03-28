import { Match } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useWebSocket } from "@/hooks/use-websocket";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

interface ScoreboardProps {
  match: Match;
}

export default function Scoreboard({ match }: ScoreboardProps) {
  const { sendMessage } = useWebSocket();
  const [score1, setScore1] = useState(match.score1);
  const [score2, setScore2] = useState(match.score2);

  const updateScore = (player: 1 | 2, increment: boolean) => {
    const newScore = increment 
      ? (player === 1 ? score1 + 1 : score2 + 1)
      : (player === 1 ? Math.max(0, score1 - 1) : Math.max(0, score2 - 1));

    if (player === 1) {
      setScore1(newScore);
    } else {
      setScore2(newScore);
    }

    sendMessage({
      type: 'UPDATE_SCORE',
      matchId: match.id,
      score1: player === 1 ? newScore : score1,
      score2: player === 2 ? newScore : score2
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-2xl font-bold mb-4">Player 1</h3>
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateScore(1, false)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-6xl font-bold">{score1}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateScore(1, true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-2xl font-bold mb-4">Player 2</h3>
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateScore(2, false)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-6xl font-bold">{score2}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateScore(2, true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
