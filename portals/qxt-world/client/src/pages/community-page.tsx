import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, Video, Newspaper, Swords, Award, BadgeCheck, Trophy, MapPin, Search, Heart, DollarSign, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

export default function CommunityPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-[#C4A44E]">Community & Social Hub</h1>

      {/* Player Challenges Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-[#C4A44E]">Player Challenges</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#C4A44E]">
                <Swords className="h-5 w-5 text-[#C4A44E]" />
                Active Challenges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-[#C4A44E]">Friendly Match Challenge</p>
                      <p className="text-sm text-[#D4C28A]">From: John Smith</p>
                    </div>
                    <div className="space-x-2">
                      <Button className="bg-[#C4A44E] hover:bg-[#D4C28A] text-white shadow-md transition-all duration-200" size="sm">Accept</Button>
                      <Button variant="outline" className="border-[#C4A44E] text-[#C4A44E] hover:bg-[#C4A44E]/10" size="sm">Decline</Button>
                    </div>
                  </div>
                  <p className="text-sm text-[#D4C28A]">Best of 3 frames - Snooker</p>
                </div>
                <Button className="w-full bg-[#C4A44E] hover:bg-[#D4C28A] text-white shadow-md transition-all duration-200">Create New Challenge</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#C4A44E]">
                <Trophy className="h-5 w-5 text-[#C4A44E]" />
                Challenge History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                  <div>
                    <p className="font-medium text-[#C4A44E]">vs. Mike Johnson</p>
                    <p className="text-sm text-[#D4C28A]">Won 2-1</p>
                  </div>
                  <span className="text-sm text-[#D4C28A]">2 days ago</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                  <div>
                    <p className="font-medium text-[#C4A44E]">vs. Sarah Williams</p>
                    <p className="text-sm text-[#D4C28A]">Lost 1-2</p>
                  </div>
                  <span className="text-sm text-[#D4C28A]">1 week ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-[#C4A44E]">Achievements & Badges</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#C4A44E]">
                <Award className="h-5 w-5 text-[#C4A44E]" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                  <BadgeCheck className="h-8 w-8 text-[#C4A44E]" />
                  <div>
                    <p className="font-medium text-[#C4A44E]">Century Break</p>
                    <p className="text-sm text-[#D4C28A]">Break of 100+ points</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                  <BadgeCheck className="h-8 w-8 text-[#C4A44E]" />
                  <div>
                    <p className="font-medium text-[#C4A44E]">Tournament Victor</p>
                    <p className="text-sm text-[#D4C28A]">Won first tournament</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#C4A44E]">
                <Trophy className="h-5 w-5 text-[#C4A44E]" />
                Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                  <p className="font-medium text-[#C4A44E]">Matches Played</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-2xl font-bold text-[#C4A44E]">28/50</p>
                    <p className="text-sm text-[#D4C28A]">Next: Veteran Badge</p>
                  </div>
                </div>
                <div className="p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                  <p className="font-medium text-[#C4A44E]">Tournament Wins</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-2xl font-bold text-[#C4A44E]">3/5</p>
                    <p className="text-sm text-[#D4C28A]">Next: Champion Badge</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#C4A44E]">
                <BadgeCheck className="h-5 w-5 text-[#C4A44E]" />
                Badge Collection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <Award className="h-8 w-8 text-[#C4A44E] mx-auto mb-2" />
                  <p className="text-xs text-[#D4C28A]">Elite</p>
                </div>
                <div className="text-center">
                  <Award className="h-8 w-8 text-[#C4A44E] mx-auto mb-2" />
                  <p className="text-xs text-[#D4C28A]">Pro</p>
                </div>
                <div className="text-center">
                  <Award className="h-8 w-8 text-[#C4A44E] mx-auto mb-2" />
                  <p className="text-xs text-[#D4C28A]">Veteran</p>
                </div>
                <div className="text-center">
                  <Award className="h-8 w-8 text-[#C4A44E] mx-auto mb-2" />
                  <p className="text-xs text-[#D4C28A]">Rookie</p>
                </div>
                <div className="text-center opacity-50">
                  <Award className="h-8 w-8 text-[#D4C28A] mx-auto mb-2" />
                  <p className="text-xs text-[#D4C28A]">Locked</p>
                </div>
                <div className="text-center opacity-50">
                  <Award className="h-8 w-8 text-[#D4C28A] mx-auto mb-2" />
                  <p className="text-xs text-[#D4C28A]">Locked</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Clubs & Venues Directory */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-[#C4A44E]">Clubs & Venues</h2>
        <div className="space-y-6">
          {/* Search & Filter */}
          <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#C4A44E]">
                <Search className="h-5 w-5 text-[#C4A44E]" />
                Find Venues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Input 
                  placeholder="Search by location or name" 
                  className="border-[#C4A44E] focus:border-[#D4C28A] focus:ring-[#C4A44E] focus:ring-opacity-50 bg-[#062128] transition-all duration-200"
                />
                <Select>
                  <SelectTrigger className="border-[#C4A44E] text-[#C4A44E]">
                    <SelectValue placeholder="Facilities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="snooker">Snooker Tables</SelectItem>
                    <SelectItem value="pool">Pool Tables</SelectItem>
                    <SelectItem value="coaching">Coaching Available</SelectItem>
                    <SelectItem value="tournament">Tournament Venue</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="border-[#C4A44E] text-[#C4A44E]">
                    <SelectValue placeholder="Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="3">3+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Venue Listings */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[#C4A44E]">Elite Snooker Club</CardTitle>
                  <Badge className="bg-[#C4A44E]/10 text-[#C4A44E] border-[#C4A44E]/20">Official Partner</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#D4C28A]">
                  <MapPin className="h-4 w-4 text-[#C4A44E]" />
                  <span>Downtown Sports Complex</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-[#C4A44E]" />
                    <span className="text-[#D4C28A]">4.8/5 (124 reviews)</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-[#C4A44E]">Facilities:</p>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="border-[#C4A44E] text-[#D4C28A]">12 Snooker Tables</Badge>
                      <Badge variant="outline" className="border-[#C4A44E] text-[#D4C28A]">Pro Coaching</Badge>
                      <Badge variant="outline" className="border-[#C4A44E] text-[#D4C28A]">Tournament Ready</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-[#C4A44E] hover:bg-[#D4C28A] text-white shadow-md transition-all duration-200">Book Now</Button>
                    <Button variant="outline" className="border-[#C4A44E] text-[#C4A44E] hover:bg-[#C4A44E]/10">View Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[#C4A44E]">City Pool Academy</CardTitle>
                  <Badge variant="outline" className="border-[#C4A44E] text-[#D4C28A]">Applying for Partnership</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#D4C28A]">
                  <MapPin className="h-4 w-4 text-[#C4A44E]" />
                  <span>Westside Recreation Center</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-[#C4A44E]" />
                    <span className="text-[#D4C28A]">4.6/5 (89 reviews)</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-[#C4A44E]">Facilities:</p>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="border-[#C4A44E] text-[#D4C28A]">8 Pool Tables</Badge>
                      <Badge variant="outline" className="border-[#C4A44E] text-[#D4C28A]">4 Snooker Tables</Badge>
                      <Badge variant="outline" className="border-[#C4A44E] text-[#D4C28A]">Pro Shop</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-[#C4A44E] hover:bg-[#D4C28A] text-white shadow-md transition-all duration-200">Book Now</Button>
                    <Button variant="outline" className="border-[#C4A44E] text-[#C4A44E] hover:bg-[#C4A44E]/10">View Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Player Crowdfunding */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-[#C4A44E]">Support Players</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#C4A44E]">
                <Heart className="h-5 w-5 text-[#C4A44E]" />
                Featured Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-[#C4A44E]">James Wilson</p>
                      <p className="text-sm text-[#D4C28A]">Junior Championship Journey</p>
                    </div>
                    <Badge variant="outline" className="border-[#C4A44E] text-[#D4C28A]">Rising Star</Badge>
                  </div>
                  <Progress value={75} className="h-2 mb-2" indicatorClassName="bg-[#C4A44E]" />
                  <div className="flex justify-between text-sm mb-4">
                    <span className="text-[#C4A44E]">$3,750 raised</span>
                    <span className="text-[#D4C28A]">of $5,000 goal</span>
                  </div>
                  <Button className="w-full bg-[#C4A44E] hover:bg-[#D4C28A] text-white shadow-md transition-all duration-200">Support Campaign</Button>
                </div>

                <div className="p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-[#C4A44E]">Sarah Chen</p>
                      <p className="text-sm text-[#D4C28A]">International Tournament Fund</p>
                    </div>
                    <Badge variant="outline" className="border-[#C4A44E] text-[#D4C28A]">Pro Player</Badge>
                  </div>
                  <Progress value={40} className="h-2 mb-2" indicatorClassName="bg-[#C4A44E]" />
                  <div className="flex justify-between text-sm mb-4">
                    <span className="text-[#C4A44E]">$2,000 raised</span>
                    <span className="text-[#D4C28A]">of $5,000 goal</span>
                  </div>
                  <Button className="w-full bg-[#C4A44E] hover:bg-[#D4C28A] text-white shadow-md transition-all duration-200">Support Campaign</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#C4A44E]">
                <DollarSign className="h-5 w-5 text-[#C4A44E]" />
                Top Supporters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                  <div className="flex items-center gap-3">
                    <Award className="h-8 w-8 text-[#C4A44E]" />
                    <div>
                      <p className="font-medium text-[#C4A44E]">John Miller</p>
                      <p className="text-sm text-[#D4C28A]">$1,500 total contributions</p>
                    </div>
                  </div>
                  <Badge className="bg-[#C4A44E]/10 text-[#C4A44E] border-[#C4A44E]/20">Diamond Supporter</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                  <div className="flex items-center gap-3">
                    <Award className="h-8 w-8 text-[#C4A44E]" />
                    <div>
                      <p className="font-medium text-[#C4A44E]">Emma Thompson</p>
                      <p className="text-sm text-[#D4C28A]">$750 total contributions</p>
                    </div>
                  </div>
                  <Badge className="bg-[#C4A44E]/10 text-[#C4A44E] border-[#C4A44E]/20">Platinum Supporter</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Original Community Features */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#C4A44E]">
              <MessageSquare className="h-5 w-5 text-[#C4A44E]" />
              Discussion Forums
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#D4C28A]">
              Join topic-based cue sports discussions coming soon.
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#C4A44E]">
              <Video className="h-5 w-5 text-[#C4A44E]" />
              Content Sharing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#D4C28A]">
              Share your match highlights and best shots coming soon.
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#C4A44E]">
              <Newspaper className="h-5 w-5 text-[#C4A44E]" />
              News & Blog
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#D4C28A]">
              Latest cue sports news and insights coming soon.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}