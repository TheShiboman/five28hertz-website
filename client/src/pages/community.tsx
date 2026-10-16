import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { RiArrowLeftLine, RiMailLine } from "react-icons/ri";
import { scrollToTop } from "@/lib/utils";
import { PresentationDeck } from "@/components/ui/presentation-deck";
import { ChatAssistant } from "@/components/ui/chat-assistant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Community = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 bg-gradient-to-br from-amber-400 to-[#F28E1C]">
        <div className="container mx-auto">
          <div className="absolute inset-0 bg-[url('/assets/pattern.svg')] opacity-10"></div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center relative z-10"
          >
            <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-6 text-white">
              Join Our Community
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Become part of our vibrant community of change-makers committed to a harmonious world.
            </p>
            <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-[#F28E1C]" asChild>
              <Link href="/get-started" onClick={scrollToTop}>
                <RiArrowLeftLine className="mr-2" /> Back to Options
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Community Presentation Deck */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-playfair font-bold mb-6 text-center text-gray-800">
              Discover the five28hertz Community
            </h2>
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
              <PresentationDeck 
                title="Community Overview"
                embedUrl="https://docs.google.com/presentation/d/e/2PACX-1vQVsA-zLRFYV8F5GxzFJYoU7xbnhFe4nwCvvD5LlmJ7OaBCMuHhQr-Bz0GyyHUMQeJl2BgF_cpRc8CN/embed?start=false&loop=false&delayms=3000"
                aspectRatio="16:9"
              />
              <div className="py-3 px-4 text-sm text-center text-gray-500 italic">
                Presented by five28hertz Community Team
              </div>
            </div>
          </motion.div>

          {/* AI Assistant Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <div className="max-w-3xl mx-auto rounded-xl border border-amber-200 bg-white shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 hover:border-amber-300">
              <Tabs defaultValue="assistant" className="w-full">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
                  <TabsTrigger value="presentation">Community Info</TabsTrigger>
                </TabsList>
                <TabsContent value="assistant" className="mt-4">
                  <ChatAssistant 
                    assistantType="community"
                    title="Community Companion – Ask Anything"
                    gradientFrom="[#F28E1C]"
                    gradientTo="amber-400"
                    iconColor="amber-600"
                    initialMessage="Hello and welcome to the five28hertz community! I'm here to help you learn about how to join and participate, member benefits, access to exclusive content, and our community guidelines. How can I assist you today?"
                    className="assistant-golden"
                  />
                  <div className="p-4 flex justify-center">
                    <Button variant="outline" size="sm" className="text-amber-600 border-amber-200 hover:bg-amber-50" asChild>
                      <a href="mailto:community@five28hertz.com">
                        <RiMailLine className="mr-2" /> Still have questions? Contact us
                      </a>
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="presentation" className="mt-4">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-amber-700">Community Overview</h3>
                    <div className="space-y-4 text-gray-700">
                      <p><strong>Our Mission:</strong> The five28hertz community stands for conscious living, sustainable innovation, and collective growth through collaborative efforts.</p>
                      <p><strong>Engagement Opportunities:</strong> Members engage through virtual events, in-person gatherings, collaborative projects, and idea-sharing platforms.</p>
                      <p><strong>Member Benefits:</strong> Access to exclusive content, early project involvement, connection with like-minded innovators, and resources for personal and professional growth.</p>
                      <p><strong>Impact Focus:</strong> Our community focuses on creating measurable positive change in areas of sustainability, conscious business, and harmonious living.</p>
                      <p><strong>Transformation Stories:</strong> Members regularly share their journeys of personal and professional transformation through our community platforms.</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <Button className="bg-gradient-to-r from-amber-400 to-[#F28E1C] hover:from-[#F28E1C] hover:to-amber-400 text-white px-8 py-6 text-lg shadow-md hover:shadow-lg transition-all" asChild>
              <Link href="/get-involved">Ready to Join the Movement? Connect with our Community Team</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Community;