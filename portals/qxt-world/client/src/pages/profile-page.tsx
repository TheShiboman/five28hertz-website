import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { User } from "@shared/schema";
import { toast } from "@/hooks/use-toast";
import { Award, BarChart, ChevronUp, Clock, Medal, Star, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link2, Globe, Shield, FileText, Headphones, MessageSquare } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EditProfileDialog } from "@/components/edit-profile-dialog";

export default function ProfilePage() {
  const { user } = useAuth();

  const updateRoleMutation = useMutation({
    mutationFn: async (role: string) => {
      const response = await apiRequest("PATCH", `/api/users/${user!.id}`, { role });
      return response.json();
    },
    onSuccess: (updatedUser: User) => {
      queryClient.setQueryData(["/api/user"], updatedUser);
      toast({
        title: "Role Updated",
        description: "Your role has been successfully updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-[#C4A44E]">Profile Settings</h1>
        <EditProfileDialog />
      </div>

      <div className="space-y-6">
        {/* User Bio Section */}
        <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-4">
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "Profile"}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div>
                <CardTitle className="text-[#C4A44E]">{user.displayName || "Player Profile"}</CardTitle>
                <p className="text-sm text-[#D4C28A]">{user.email}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[#C4A44E]">Bio</label>
                  <Textarea
                    placeholder="Tell us about your cue sports journey..."
                    className="mt-1 border-[#C4A44E] focus:border-[#D4C28A] focus:ring-[#C4A44E] focus:ring-opacity-50 bg-[#062128] transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#C4A44E]">Social Links</label>
                  <div className="grid sm:grid-cols-2 gap-4 mt-1">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-[#C4A44E]" />
                      <Input
                        placeholder="Website URL"
                        className="border-[#C4A44E] focus:border-[#D4C28A] focus:ring-[#C4A44E] focus:ring-opacity-50 bg-[#062128] transition-all duration-200"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Link2 className="h-4 w-4 text-[#C4A44E]" />
                      <Input
                        placeholder="Social media link"
                        className="border-[#C4A44E] focus:border-[#D4C28A] focus:ring-[#C4A44E] focus:ring-opacity-50 bg-[#062128] transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2 text-[#C4A44E]">Career Highlights</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#041D21] rounded-lg text-center border border-[#C4A44E]/20">
                    <p className="text-2xl font-bold text-[#C4A44E]">127</p>
                    <p className="text-sm text-[#D4C28A]">Highest Break</p>
                  </div>
                  <div className="p-4 bg-[#041D21] rounded-lg text-center border border-[#C4A44E]/20">
                    <p className="text-2xl font-bold text-[#C4A44E]">15</p>
                    <p className="text-sm text-[#D4C28A]">Titles Won</p>
                  </div>
                  <div className="p-4 bg-[#041D21] rounded-lg text-center border border-[#C4A44E]/20">
                    <p className="text-2xl font-bold text-[#C4A44E]">5</p>
                    <p className="text-sm text-[#D4C28A]">Years Pro</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tournament Resume */}
        <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#C4A44E]">
              <FileText className="h-5 w-5 text-[#C4A44E]" />
              Tournament Resume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-[#C4A44E]">QXT World Championship 2024</p>
                    <p className="text-sm text-[#D4C28A]">Quarter-Finals</p>
                  </div>
                  <Badge className="bg-[#C4A44E]/10 text-[#C4A44E] border-[#C4A44E]/20">Major Event</Badge>
                </div>
                <div className="mt-4 text-sm text-[#D4C28A]">
                  <p>• Highest Break: 98</p>
                  <p>• Win Rate: 75%</p>
                  <p>• Notable Wins: 2 seeded players</p>
                </div>
              </div>

              <div className="p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-[#C4A44E]">Regional Masters 2024</p>
                    <p className="text-sm text-[#D4C28A]">Winner</p>
                  </div>
                  <Badge className="bg-[#C4A44E]/10 text-[#C4A44E] border-[#C4A44E]/20">Regional</Badge>
                </div>
                <div className="mt-4 text-sm text-[#D4C28A]">
                  <p>• Highest Break: 87</p>
                  <p>• Win Rate: 85%</p>
                  <p>• Clean sweep in finals (4-0)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sponsorship Application */}
        <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#C4A44E]">
              <Award className="h-5 w-5 text-[#C4A44E]" />
              Sponsorship Application
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                <h3 className="font-medium mb-4 text-[#C4A44E]">Application Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[#D4C28A]">Profile Completion</span>
                    <span className="text-sm text-[#D4C28A]">85%</span>
                  </div>
                  <Progress value={85} className="h-2 bg-[#041D21]" indicatorClassName="bg-[#C4A44E]" />
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-[#C4A44E]">Requirements Met:</p>
                  <ul className="list-disc list-inside text-sm text-[#D4C28A]">
                    <li>Verified Player Status</li>
                    <li>Tournament Experience</li>
                    <li>Social Media Presence</li>
                  </ul>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Button className="w-full bg-[#C4A44E] hover:bg-[#D4C28A] text-white shadow-md transition-all duration-200">
                  Apply for Sponsorship
                </Button>
                <Button variant="outline" className="w-full border-[#C4A44E] text-[#C4A44E] hover:bg-[#C4A44E]/10">
                  View Guidelines
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Center */}
        <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#C4A44E]">
              <Headphones className="h-5 w-5 text-[#C4A44E]" />
              Support Center
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                  <MessageSquare className="h-6 w-6 text-[#C4A44E] mb-2" />
                  <h3 className="font-medium text-[#C4A44E]">Live Chat Support</h3>
                  <p className="text-sm text-[#D4C28A] mt-2">
                    Connect with our support team for immediate assistance
                  </p>
                  <Button className="w-full mt-4 bg-[#C4A44E] hover:bg-[#D4C28A] text-white shadow-md transition-all duration-200">
                    Start Chat
                  </Button>
                </div>
                <div className="p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                  <FileText className="h-6 w-6 text-[#C4A44E] mb-2" />
                  <h3 className="font-medium text-[#C4A44E]">Help Center</h3>
                  <p className="text-sm text-[#D4C28A] mt-2">
                    Browse FAQs and documentation
                  </p>
                  <Button variant="outline" className="w-full mt-4 border-[#C4A44E] text-[#C4A44E] hover:bg-[#C4A44E]/10">
                    View Articles
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Achievements */}
        <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#C4A44E]">
              <Trophy className="h-5 w-5 text-[#C4A44E]" />
              Personal Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Recent Achievements */}
              <div className="space-y-4">
                <h3 className="font-medium text-[#C4A44E]">Recent Achievements</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                    <Medal className="h-8 w-8 text-[#C4A44E]" />
                    <div>
                      <p className="font-medium text-[#C4A44E]">Century Break</p>
                      <p className="text-sm text-[#D4C28A]">Achieved 2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                    <Award className="h-8 w-8 text-[#C4A44E]" />
                    <div>
                      <p className="font-medium text-[#C4A44E]">Tournament Winner</p>
                      <p className="text-sm text-[#D4C28A]">Achieved 1 week ago</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Tracking */}
              <div className="space-y-4">
                <h3 className="font-medium text-[#C4A44E]">Achievement Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-[#D4C28A]">Master Break Builder</span>
                      <span className="text-sm text-[#D4C28A]">75%</span>
                    </div>
                    <Progress value={75} className="h-2 bg-[#041D21]" indicatorClassName="bg-[#C4A44E]" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-[#D4C28A]">Tournament Specialist</span>
                      <span className="text-sm text-[#D4C28A]">40%</span>
                    </div>
                    <Progress value={40} className="h-2 bg-[#041D21]" indicatorClassName="bg-[#C4A44E]" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Match History & Analytics */}
        <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#C4A44E]">
              <BarChart className="h-5 w-5 text-[#C4A44E]" />
              Match History & Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Performance Overview */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 bg-[#041D21] rounded-lg text-center border border-[#C4A44E]/20">
                  <Star className="h-6 w-6 text-[#C4A44E] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-[#C4A44E]">76%</p>
                  <p className="text-sm text-[#D4C28A]">Win Rate</p>
                </div>
                <div className="p-4 bg-[#041D21] rounded-lg text-center border border-[#C4A44E]/20">
                  <ChevronUp className="h-6 w-6 text-[#C4A44E] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-[#C4A44E]">112</p>
                  <p className="text-sm text-[#D4C28A]">Highest Break</p>
                </div>
                <div className="p-4 bg-[#041D21] rounded-lg text-center border border-[#C4A44E]/20">
                  <Clock className="h-6 w-6 text-[#C4A44E] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-[#C4A44E]">45</p>
                  <p className="text-sm text-[#D4C28A]">Matches Played</p>
                </div>
              </div>

              {/* Recent Matches */}
              <div>
                <h3 className="font-medium mb-4 text-[#C4A44E]">Recent Matches</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                    <div>
                      <p className="font-medium text-[#C4A44E]">vs. John Smith</p>
                      <p className="text-sm text-[#D4C28A]">Won 3-1</p>
                    </div>
                    <Badge className="bg-green-500/10 text-green-500">Victory</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                    <div>
                      <p className="font-medium text-[#C4A44E]">vs. Sarah Chen</p>
                      <p className="text-sm text-[#D4C28A]">Lost 2-3</p>
                    </div>
                    <Badge className="bg-red-500/10 text-red-500">Defeat</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                    <div>
                      <p className="font-medium text-[#C4A44E]">vs. Mike Johnson</p>
                      <p className="text-sm text-[#D4C28A]">Won 4-2</p>
                    </div>
                    <Badge className="bg-green-500/10 text-green-500">Victory</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {user.role === "admin" && (
          <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#C4A44E]">Administration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-[#D4C28A]">
                  As an administrator, you have access to:
                </p>
                <ul className="list-disc list-inside text-sm text-[#D4C28A]">
                  <li>Creating and managing tournaments</li>
                  <li>Managing user roles and permissions</li>
                  <li>Approving tournament registrations</li>
                  <li>System-wide settings and configurations</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}