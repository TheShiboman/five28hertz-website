import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Film, Play, Star, BookOpen, Upload, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LiveStreamingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-[#C4A44E]">Live Streaming</h1>

      <div className="space-y-8">
        {/* Main Features */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#C4A44E]">
                <Video className="h-5 w-5 text-[#C4A44E]" />
                Live Tournament Broadcasts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#D4C28A]">
                Official QXT World tournament streams coming soon.
              </p>
            </CardContent>
          </Card>

          <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#C4A44E]">
                <Film className="h-5 w-5 text-[#C4A44E]" />
                Match Highlights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#D4C28A]">
                AI-generated highlight clips coming soon.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Player Insights & Commentary */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-[#C4A44E]">Player Insights & Commentary</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#C4A44E]">
                  <BookOpen className="h-5 w-5 text-[#C4A44E]" />
                  Match Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-[#C4A44E]">QXT Championship Final</p>
                      <Badge className="bg-[#C4A44E]/10 text-[#C4A44E] border-[#C4A44E]/20">Pro Analysis</Badge>
                    </div>
                    <p className="text-sm text-[#D4C28A] mb-4">
                      Break-building patterns and tactical decisions explained by professional analysts
                    </p>
                    <Button variant="outline" className="w-full border-[#C4A44E] text-[#C4A44E] hover:bg-[#C4A44E]/10">Watch Analysis</Button>
                  </div>

                  <div className="p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-[#C4A44E]">Masters Semi-Final</p>
                      <Badge className="bg-[#C4A44E]/10 text-[#C4A44E] border-[#C4A44E]/20">Featured</Badge>
                    </div>
                    <p className="text-sm text-[#D4C28A] mb-4">
                      Key moments and strategic insights from the match
                    </p>
                    <Button variant="outline" className="w-full border-[#C4A44E] text-[#C4A44E] hover:bg-[#C4A44E]/10">Watch Analysis</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#C4A44E]">
                  <MessageSquare className="h-5 w-5 text-[#C4A44E]" />
                  Expert Commentary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 text-[#C4A44E]" />
                      <p className="font-medium text-[#C4A44E]">Pro Player Commentary</p>
                    </div>
                    <p className="text-sm text-[#D4C28A]">
                      Frame-by-frame analysis from champion players
                    </p>
                  </div>

                  <div className="p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-[#C4A44E]" />
                      <p className="font-medium text-[#C4A44E]">Live Commentary</p>
                    </div>
                    <p className="text-sm text-[#D4C28A]">
                      Real-time insights during tournament matches
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* User Uploads */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-[#C4A44E]">Community Uploads</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#C4A44E]">
                  <Upload className="h-5 w-5 text-[#C4A44E]" />
                  Share Your Matches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-[#D4C28A]">
                    Upload and share your match recordings with the community
                  </p>
                  <Button className="w-full bg-[#C4A44E] hover:bg-[#D4C28A] text-white shadow-md transition-all duration-200">Upload Match</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-[#C4A44E]">Club Championship</CardTitle>
                <Badge className="w-fit bg-[#C4A44E]/10 text-[#C4A44E] border-[#C4A44E]/20">Featured Upload</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="aspect-video bg-[#041D21] rounded-lg border border-[#C4A44E]/20"></div>
                  <div>
                    <p className="text-sm text-[#D4C28A]">Uploaded by Mark S.</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="h-4 w-4 text-[#C4A44E]" />
                      <span className="text-sm text-[#D4C28A]">4.8/5 Rating</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-[#C4A44E] text-[#C4A44E] hover:bg-[#C4A44E]/10">Watch Now</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-[#C4A44E]">Local Tournament</CardTitle>
                <Badge className="w-fit bg-[#C4A44E]/10 text-[#C4A44E] border-[#C4A44E]/20">Recent Upload</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="aspect-video bg-[#041D21] rounded-lg border border-[#C4A44E]/20"></div>
                  <div>
                    <p className="text-sm text-[#D4C28A]">Uploaded by Chris L.</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="h-4 w-4 text-[#C4A44E]" />
                      <span className="text-sm text-[#D4C28A]">4.6/5 Rating</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-[#C4A44E] text-[#C4A44E] hover:bg-[#C4A44E]/10">Watch Now</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}