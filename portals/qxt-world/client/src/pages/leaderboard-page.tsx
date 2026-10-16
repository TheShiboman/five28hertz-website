import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, MapPin, Trophy, TrendingUp, BarChart, Activity, Target, DollarSign, Users, Star, Link, Award } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LeaderboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-[#C4A44E]">Leaderboards & Rankings</h1>

      <div className="space-y-8">
        {/* Main Rankings */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#C4A44E]">
                <Globe className="h-5 w-5 text-[#C4A44E]" />
                Global Rankings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#D4C28A]">
                International player rankings coming soon.
              </p>
            </CardContent>
          </Card>

          <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#C4A44E]">
                <MapPin className="h-5 w-5 text-[#C4A44E]" />
                Regional & Club Rankings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#D4C28A]">
                Local rankings and club standings coming soon.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Hub */}
        <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#C4A44E]">
              <Activity className="h-5 w-5 text-[#C4A44E]" />
              Performance Hub
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="border-b border-[#C4A44E]/20">
                <TabsTrigger 
                  value="overview"
                  className="text-[#D4C28A] data-[state=active]:text-[#C4A44E] data-[state=active]:border-b-2 data-[state=active]:border-[#C4A44E]"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="tournament"
                  className="text-[#D4C28A] data-[state=active]:text-[#C4A44E] data-[state=active]:border-b-2 data-[state=active]:border-[#C4A44E]"
                >
                  Tournament Stats
                </TabsTrigger>
                <TabsTrigger 
                  value="detailed"
                  className="text-[#D4C28A] data-[state=active]:text-[#C4A44E] data-[state=active]:border-b-2 data-[state=active]:border-[#C4A44E]"
                >
                  Detailed Analysis
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                    <p className="text-sm font-medium text-[#C4A44E]">Win Rate</p>
                    <p className="text-2xl font-bold text-[#C4A44E]">76%</p>
                    <p className="text-xs text-[#D4C28A]">Last 30 days</p>
                  </div>
                  <div className="p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                    <p className="text-sm font-medium text-[#C4A44E]">Average Break</p>
                    <p className="text-2xl font-bold text-[#C4A44E]">45</p>
                    <p className="text-xs text-[#D4C28A]">Points</p>
                  </div>
                  <div className="p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                    <p className="text-sm font-medium text-[#C4A44E]">Tournament Wins</p>
                    <p className="text-2xl font-bold text-[#C4A44E]">3</p>
                    <p className="text-xs text-[#D4C28A]">This season</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tournament">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                    <div>
                      <p className="font-medium text-[#C4A44E]">QXT Spring Championship</p>
                      <p className="text-sm text-[#D4C28A]">Quarter-finalist</p>
                    </div>
                    <Trophy className="h-5 w-5 text-[#C4A44E]" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                    <div>
                      <p className="font-medium text-[#C4A44E]">Club Masters Series</p>
                      <p className="text-sm text-[#D4C28A]">Winner</p>
                    </div>
                    <Trophy className="h-5 w-5 text-[#C4A44E]" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="detailed">
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-[#C4A44E]" />
                        <p className="font-medium text-[#C4A44E]">Pot Success Rate</p>
                      </div>
                      <p className="text-2xl font-bold text-[#C4A44E]">82%</p>
                    </div>
                    <div className="p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart className="h-4 w-4 text-[#C4A44E]" />
                        <p className="font-medium text-[#C4A44E]">Safety Play Success</p>
                      </div>
                      <p className="text-2xl font-bold text-[#C4A44E]">71%</p>
                    </div>
                  </div>
                  <p className="text-sm text-[#D4C28A]">
                    Detailed performance metrics and trend analysis coming soon.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Sponsorship Hub */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-[#C4A44E]">Sponsorship Hub</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Sponsored Players */}
            <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#C4A44E]">
                  <Star className="h-5 w-5 text-[#C4A44E]" />
                  Featured Sponsored Players
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-[#C4A44E]">James Wilson</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-[#C4A44E] text-[#D4C28A]">Rising Star</Badge>
                          <Badge className="bg-[#C4A44E]/10 text-[#C4A44E] border-[#C4A44E]/20">QXT Sponsored</Badge>
                        </div>
                      </div>
                      <Link className="h-5 w-5 text-[#C4A44E]" />
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <img src="/sponsor-logo-1.svg" alt="Sponsor 1" className="h-8 opacity-80 hover:opacity-100 transition-opacity" />
                      <img src="/sponsor-logo-2.svg" alt="Sponsor 2" className="h-8 opacity-80 hover:opacity-100 transition-opacity" />
                      <img src="/sponsor-logo-3.svg" alt="Sponsor 3" className="h-8 opacity-80 hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  <div className="p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-[#C4A44E]">Sarah Chen</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-[#C4A44E] text-[#D4C28A]">Pro Player</Badge>
                          <Badge className="bg-[#C4A44E]/10 text-[#C4A44E] border-[#C4A44E]/20">Elite Sponsor</Badge>
                        </div>
                      </div>
                      <Link className="h-5 w-5 text-[#C4A44E]" />
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <img src="/sponsor-logo-4.svg" alt="Sponsor 4" className="h-8 opacity-80 hover:opacity-100 transition-opacity" />
                      <img src="/sponsor-logo-5.svg" alt="Sponsor 5" className="h-8 opacity-80 hover:opacity-100 transition-opacity" />
                      <img src="/sponsor-logo-6.svg" alt="Sponsor 6" className="h-8 opacity-80 hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sponsorship Opportunities */}
            <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#C4A44E]">
                  <DollarSign className="h-5 w-5 text-[#C4A44E]" />
                  Sponsorship Marketplace
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-[#C4A44E]">For Sponsors</p>
                        <p className="text-sm text-[#D4C28A]">Connect with top talent</p>
                      </div>
                      <Award className="h-5 w-5 text-[#C4A44E]" />
                    </div>
                    <div className="space-y-2 mt-4">
                      <p className="text-sm text-[#C4A44E]">Benefits:</p>
                      <ul className="list-disc list-inside text-sm text-[#D4C28A]">
                        <li>Brand visibility on player profiles</li>
                        <li>Match highlight promotions</li>
                        <li>Tournament presence</li>
                        <li>Exclusive content rights</li>
                      </ul>
                    </div>
                    <Button className="w-full mt-4 bg-[#C4A44E] hover:bg-[#D4C28A] text-white shadow-md transition-all duration-200">
                      Become a Sponsor
                    </Button>
                  </div>

                  <div className="p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-[#C4A44E]">For Players</p>
                        <p className="text-sm text-[#D4C28A]">Get sponsored</p>
                      </div>
                      <Users className="h-5 w-5 text-[#C4A44E]" />
                    </div>
                    <div className="space-y-2 mt-4">
                      <p className="text-sm text-[#C4A44E]">Requirements:</p>
                      <ul className="list-disc list-inside text-sm text-[#D4C28A]">
                        <li>Minimum ranking requirements</li>
                        <li>Active tournament participation</li>
                        <li>Social media presence</li>
                        <li>Professional conduct</li>
                      </ul>
                    </div>
                    <Button className="w-full mt-4 bg-[#C4A44E] hover:bg-[#D4C28A] text-white shadow-md transition-all duration-200">
                      Apply for Sponsorship
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}