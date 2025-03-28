import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Book, Video, Trophy, Target, Brain, Crosshair, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TrainingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Training & Development</h1>

      <div className="space-y-8">
        {/* AI Training Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Shot Training AI</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Pattern Recognition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  AI-powered pattern recognition system analyzes your shots and provides real-time feedback.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Shot angle analysis</li>
                  <li>Spin detection</li>
                  <li>Power consistency tracking</li>
                  <li>Success rate predictions</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crosshair className="h-5 w-5 text-primary" />
                  Shot Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Get personalized shot recommendations based on your playing style and skill level.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Personalized drills</li>
                  <li>Progressive difficulty</li>
                  <li>Technique refinement</li>
                  <li>Performance tracking</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tactical Play Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Tactical Play Analysis</h2>
          <Tabs defaultValue="snooker" className="space-y-4">
            <TabsList>
              <TabsTrigger value="snooker">Snooker</TabsTrigger>
              <TabsTrigger value="pool">Pool</TabsTrigger>
              <TabsTrigger value="carom">Carom</TabsTrigger>
            </TabsList>

            <TabsContent value="snooker">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Snooker Tactics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Break Building</h3>
                      <p className="text-muted-foreground">Learn optimal break-building patterns and color sequences.</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Safety Play</h3>
                      <p className="text-muted-foreground">Master defensive strategies and snooker placements.</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Position Play</h3>
                      <p className="text-muted-foreground">Advanced cue ball control for maximum point accumulation.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pool">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Pool Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Pattern Play</h3>
                      <p className="text-muted-foreground">Strategic ball patterns for consistent run-outs.</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Banking Techniques</h3>
                      <p className="text-muted-foreground">Advanced rail shots and geometric principles.</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Speed Control</h3>
                      <p className="text-muted-foreground">Master speed and spin for precise position play.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="carom">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Carom Techniques
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Rail Systems</h3>
                      <p className="text-muted-foreground">Learn systematic approaches to rail shots and positions.</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Cushion Play</h3>
                      <p className="text-muted-foreground">Advanced cushion techniques for complex positions.</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Diamond Systems</h3>
                      <p className="text-muted-foreground">Master geometric principles for consistent scoring.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Original Training Features */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-primary" />
                AI-Generated Training Plans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Personalized training plans based on your match performance coming soon.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5 text-primary" />
                Skill-Based Drills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Cue control, positional play, and break-building challenges coming soon.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Coaching Hub
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Connect with certified coaches for online/offline training coming soon.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                Video Library
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Pro player tutorials, match analysis, and technique guides coming soon.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}