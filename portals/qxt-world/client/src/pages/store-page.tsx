import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cog, Table2, Shirt, Star, ShoppingBag, ThumbsUp, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function StorePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-[#C4A44E]">Equipment Store</h1>

      {/* Main Categories */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#C4A44E]">
              <Cog className="h-5 w-5 text-[#C4A44E]" />
              Cues & Accessories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#D4C28A] mb-4">
              Professional cues and accessories from top manufacturers.
            </p>
            <Button className="bg-[#C4A44E] hover:bg-[#D4C28A] text-white shadow-md transition-all duration-200">
              Browse Collection
            </Button>
          </CardContent>
        </Card>

        <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#C4A44E]">
              <Table2 className="h-5 w-5 text-[#C4A44E]" />
              Tables & Equipment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#D4C28A] mb-4">
              Tournament-grade tables and professional equipment.
            </p>
            <Button className="bg-[#C4A44E] hover:bg-[#D4C28A] text-white shadow-md transition-all duration-200">
              View Equipment
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Used Equipment Marketplace */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-[#C4A44E]">Used Equipment Marketplace</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg text-[#C4A44E]">Professional Cue Set</CardTitle>
              <Badge className="w-fit bg-[#C4A44E]/10 text-[#C4A44E] border-[#C4A44E]/20">Excellent Condition</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="aspect-square bg-[#041D21] rounded-lg border border-[#C4A44E]/20"></div>
                <div>
                  <p className="text-sm text-[#D4C28A]">Listed by John D.</p>
                  <p className="text-lg font-bold text-[#C4A44E] mt-2">$450</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="h-4 w-4 text-[#C4A44E]" />
                    <span className="text-sm text-[#D4C28A]">Seller Rating: 4.8/5</span>
                  </div>
                </div>
                <Button className="w-full bg-[#C4A44E] hover:bg-[#D4C28A] text-white shadow-md transition-all duration-200">
                  Contact Seller
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg text-[#C4A44E]">Tournament Break Cue</CardTitle>
              <Badge className="w-fit bg-[#C4A44E]/10 text-[#C4A44E] border-[#C4A44E]/20">Good Condition</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="aspect-square bg-[#041D21] rounded-lg border border-[#C4A44E]/20"></div>
                <div>
                  <p className="text-sm text-[#D4C28A]">Listed by Sarah W.</p>
                  <p className="text-lg font-bold text-[#C4A44E] mt-2">$280</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="h-4 w-4 text-[#C4A44E]" />
                    <span className="text-sm text-[#D4C28A]">Seller Rating: 4.9/5</span>
                  </div>
                </div>
                <Button className="w-full bg-[#C4A44E] hover:bg-[#D4C28A] text-white shadow-md transition-all duration-200">
                  Contact Seller
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg text-[#C4A44E]">Mini Practice Table</CardTitle>
              <Badge className="w-fit bg-[#C4A44E]/10 text-[#C4A44E] border-[#C4A44E]/20">Like New</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="aspect-square bg-[#041D21] rounded-lg border border-[#C4A44E]/20"></div>
                <div>
                  <p className="text-sm text-[#D4C28A]">Listed by Mike R.</p>
                  <p className="text-lg font-bold text-[#C4A44E] mt-2">$750</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="h-4 w-4 text-[#C4A44E]" />
                    <span className="text-sm text-[#D4C28A]">Seller Rating: 4.7/5</span>
                  </div>
                </div>
                <Button className="w-full bg-[#C4A44E] hover:bg-[#D4C28A] text-white shadow-md transition-all duration-200">
                  Contact Seller
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pro Recommendations */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-[#C4A44E]">Pro Recommendations</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#C4A44E]">
                <ThumbsUp className="h-5 w-5 text-[#C4A44E]" />
                Based on Your Style
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-[#C4A44E]">Pro Break Cue Series X</p>
                      <p className="text-sm text-[#D4C28A]">
                        Perfect for power break players
                      </p>
                    </div>
                    <Badge className="bg-[#C4A44E]/10 text-[#C4A44E] border-[#C4A44E]/20">98% Match</Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Users className="h-4 w-4 text-[#D4C28A]" />
                    <span className="text-sm text-[#D4C28A]">
                      47 players with similar style use this
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-[#C4A44E]">Custom Tip Selection</p>
                      <p className="text-sm text-[#D4C28A]">
                        Based on your spin control preference
                      </p>
                    </div>
                    <Badge className="bg-[#C4A44E]/10 text-[#C4A44E] border-[#C4A44E]/20">95% Match</Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Award className="h-4 w-4 text-[#D4C28A]" />
                    <span className="text-sm text-[#D4C28A]">
                      Pro player endorsed
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#C4A44E]">
                <Star className="h-5 w-5 text-[#C4A44E]" />
                Featured Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-[#041D21] rounded-lg border border-[#C4A44E]/20">
                  <p className="font-medium text-[#C4A44E]">AI-Recommended Equipment</p>
                  <ul className="list-disc list-inside mt-2 space-y-2 text-[#D4C28A]">
                    <li>Custom cue weight suggestions</li>
                    <li>Tip hardness recommendations</li>
                    <li>Shaft flexibility analysis</li>
                    <li>Grip style matching</li>
                  </ul>
                </div>
                <Button className="w-full bg-[#C4A44E] hover:bg-[#D4C28A] text-white shadow-md transition-all duration-200">
                  Get Personalized Recommendations
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Categories */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#C4A44E]">
              <Shirt className="h-5 w-5 text-[#C4A44E]" />
              Apparel & Merchandise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#D4C28A]">
              Official QXT World merchandise coming soon.
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#C4A44E]/20 bg-[#062128] shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#C4A44E]">
              <ShoppingBag className="h-5 w-5 text-[#C4A44E]" />
              Bundle Deals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#D4C28A]">
              Special equipment packages coming soon.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}