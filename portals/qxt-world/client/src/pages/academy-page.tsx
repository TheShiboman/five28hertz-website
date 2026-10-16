import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Book, Video, Award, Users, Star, Clock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AcademyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-[#C4A44E]">QXT World Academy</h1>

      {/* Courses & Certifications Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-[#C4A44E]">Courses & Certifications</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#C4A44E]">
                <GraduationCap className="h-5 w-5 text-[#C4A44E]" />
                Professional Referee
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#D4C28A]" />
                  <span className="text-sm text-[#D4C28A]">6 weeks course</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-[#D4C28A]" />
                  <span className="text-sm text-[#D4C28A]">International certification</span>
                </div>
                <p className="text-sm text-[#D4C28A] mb-4">
                  Become a certified professional referee with international recognition.
                </p>
                <Button className="w-full bg-[#C4A44E] hover:bg-[#D4C28A] text-white shadow-md transition-all duration-200">
                  Enroll Now
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#C4A44E]">
                <Book className="h-5 w-5 text-[#C4A44E]" />
                Advanced Coaching
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#D4C28A]" />
                  <span className="text-sm text-[#D4C28A]">12 weeks course</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-[#D4C28A]" />
                  <span className="text-sm text-[#D4C28A]">Level 3 Certification</span>
                </div>
                <p className="text-sm text-[#D4C28A] mb-4">
                  Master advanced coaching techniques and player development.
                </p>
                <Button className="w-full bg-[#C4A44E] hover:bg-[#D4C28A] text-white shadow-md transition-all duration-200">
                  Enroll Now
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#C4A44E]">
                <Video className="h-5 w-5 text-[#C4A44E]" />
                Training Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#D4C28A]" />
                  <span className="text-sm text-[#D4C28A]">4 weeks course</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-[#D4C28A]" />
                  <span className="text-sm text-[#D4C28A]">Digital Certificate</span>
                </div>
                <p className="text-sm text-[#D4C28A] mb-4">
                  Learn to assess and develop training programs for players.
                </p>
                <Button className="w-full bg-[#C4A44E] hover:bg-[#D4C28A] text-white shadow-md transition-all duration-200">
                  Enroll Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Coaching Marketplace */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-[#C4A44E]">Coaching Marketplace</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Featured Coaches */}
          <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#C4A44E]">
                <Users className="h-5 w-5 text-[#C4A44E]" />
                Featured Coaches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-[#C4A44E]">James Wilson</p>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-[#C4A44E]" />
                        <span className="text-sm text-[#D4C28A]">4.9/5</span>
                      </div>
                    </div>
                    <Badge className="bg-[#C4A44E]/10 text-[#C4A44E] border-[#C4A44E]/20">Pro Coach</Badge>
                  </div>
                  <p className="text-sm text-[#D4C28A] mb-4">
                    Former national champion with 15+ years coaching experience
                  </p>
                  <Button variant="outline" className="w-full border-[#C4A44E] text-[#C4A44E] hover:bg-[#C4A44E]/10">
                    View Profile
                  </Button>
                </div>

                <div className="p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-[#C4A44E]">Sarah Chen</p>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-[#C4A44E]" />
                        <span className="text-sm text-[#D4C28A]">4.8/5</span>
                      </div>
                    </div>
                    <Badge className="bg-[#C4A44E]/10 text-[#C4A44E] border-[#C4A44E]/20">Elite Coach</Badge>
                  </div>
                  <p className="text-sm text-[#D4C28A] mb-4">
                    Specialized in youth development and tournament preparation
                  </p>
                  <Button variant="outline" className="w-full border-[#C4A44E] text-[#C4A44E] hover:bg-[#C4A44E]/10">
                    View Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking & Packages */}
          <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#C4A44E]">
                <CreditCard className="h-5 w-5 text-[#C4A44E]" />
                Coaching Packages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                  <h3 className="font-medium text-[#C4A44E] mb-2">One-on-One Training</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm text-[#D4C28A] mb-4">
                    <li>Personalized training sessions</li>
                    <li>Video analysis and feedback</li>
                    <li>Custom practice routines</li>
                  </ul>
                  <Button className="w-full bg-[#C4A44E] hover:bg-[#D4C28A] text-white shadow-md transition-all duration-200">
                    Book Session
                  </Button>
                </div>

                <div className="p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                  <h3 className="font-medium text-[#C4A44E] mb-2">Group Training</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm text-[#D4C28A] mb-4">
                    <li>Small group sessions (3-4 players)</li>
                    <li>Tournament preparation</li>
                    <li>Competitive drills and exercises</li>
                  </ul>
                  <Button className="w-full bg-[#C4A44E] hover:bg-[#D4C28A] text-white shadow-md transition-all duration-200">
                    Join Group
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Academy Features */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#C4A44E]">
              <Book className="h-5 w-5 text-[#C4A44E]" />
              Grassroots Development
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#D4C28A]">
              School and youth programs coming soon.
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#C4A44E]">
              <Award className="h-5 w-5 text-[#C4A44E]" />
              Q School & Q Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#D4C28A]">
              Professional tour qualification pathway coming soon.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}