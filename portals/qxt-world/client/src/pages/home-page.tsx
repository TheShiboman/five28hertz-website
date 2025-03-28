import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Trophy, Users, ShoppingBag, BookOpen, Video, Award } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useState } from "react";

export default function HomePage() {
  const { user } = useAuth();
  const [discipline, setDiscipline] = useState("snooker");

  const { data: tournaments } = useQuery({
    queryKey: ["/api/tournaments"],
  });

  const { data: products } = useQuery({
    queryKey: ["/api/products"],
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Discipline Selection */}
      <div className="mb-8">
        <Select value={discipline} onValueChange={setDiscipline}>
          <SelectTrigger className="w-[200px] border-[#c4a45b] text-[#c4a45b]">
            <SelectValue placeholder="Select Discipline" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="snooker">Snooker</SelectItem>
            <SelectItem value="pool">American Pool</SelectItem>
            <SelectItem value="chinese_pool">Chinese Pool</SelectItem>
            <SelectItem value="carom">Carom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Feature Tiles */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Link href="/tournaments">
          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <CardHeader>
              <Trophy className="h-12 w-12 text-[#c4a45b] mb-4" />
              <CardTitle>Tournaments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">View or create tournaments</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/leaderboards">
          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <CardHeader>
              <Users className="h-12 w-12 text-[#c4a45b] mb-4" />
              <CardTitle>Players & Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">View player stats and leaderboards</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/store">
          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <CardHeader>
              <ShoppingBag className="h-12 w-12 text-[#c4a45b] mb-4" />
              <CardTitle>Equipment Shop</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Browse professional equipment</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Upcoming Tournaments - Scrollable */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-[#c4a45b]">Upcoming Tournaments</h2>
        <ScrollArea className="w-full whitespace-nowrap rounded-md border border-[#c4a45b] shadow-gold">
          <div className="flex w-max space-x-4 p-4">
            {tournaments?.slice(0, 5).map((tournament: any) => (
              <Card key={tournament.id} className="w-[300px]">
                <CardHeader>
                  <CardTitle className="text-lg">{tournament.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Starts: {new Date(tournament.startDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm font-medium text-[#c4a45b]">
                    Prize Pool: ${tournament.prize.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-4 gap-4">
        <Link href="/training">
          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <CardContent className="flex items-center gap-2 p-4">
              <BookOpen className="h-5 w-5 text-[#c4a45b]" />
              <span>Training</span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/live-streaming">
          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <CardContent className="flex items-center gap-2 p-4">
              <Video className="h-5 w-5 text-[#c4a45b]" />
              <span>Live Matches</span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/community">
          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <CardContent className="flex items-center gap-2 p-4">
              <Users className="h-5 w-5 text-[#c4a45b]" />
              <span>Community</span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/academy">
          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <CardContent className="flex items-center gap-2 p-4">
              <Award className="h-5 w-5 text-[#c4a45b]" />
              <span>QXT Academy</span>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}