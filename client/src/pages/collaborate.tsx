import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { RiArrowLeftLine, RiMailLine } from "react-icons/ri";
import { scrollToTop } from "@/lib/utils";
import { PresentationDeck } from "@/components/ui/presentation-deck";
import { ChatAssistant } from "@/components/ui/chat-assistant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Collaborate = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 bg-gradient-to-br from-red-600 to-[#E25822]">
        <div className="container mx-auto">
          <div className="absolute inset-0 bg-[url('/assets/pattern.svg')] opacity-10"></div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center relative z-10"
          >
            <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-6 text-white">
              Strategic Partnership
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Explore partnership opportunities to amplify impact through collaborative initiatives and shared resources.
            </p>
            <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-[#E25822]" asChild>
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
          {/* Partnership Presentation Deck */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-playfair font-bold mb-6 text-center text-gray-800">
              Partnering for Impact – Overview
            </h2>
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
              <PresentationDeck 
                title="Strategic Partnership Overview"
                embedUrl="https://docs.google.com/presentation/d/e/2PACX-1vSAydFCWstbIN-GbIvTXCYlS_YU5u8GcS2WaZcpB4IbZU1QwRUIwR_SitKKWZs5-zc81hnvs-JJ4TQI/embed?start=false&loop=false&delayms=3000"
                aspectRatio="16:9"
              />
              <div className="py-3 px-4 text-sm text-center text-gray-500 italic">
                Presented by five28hertz Partnership Team
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
            <div className="max-w-3xl mx-auto rounded-xl border border-red-200 bg-white shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 hover:border-red-300">
              <Tabs defaultValue="assistant" className="w-full">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
                  <TabsTrigger value="presentation">Partnership Info</TabsTrigger>
                </TabsList>
                <TabsContent value="assistant" className="mt-4">
                  <ChatAssistant 
                    assistantType="partner"
                    title="Partnership Consultant – Ask Anything"
                    gradientFrom="[#E25822]"
                    gradientTo="red-600"
                    iconColor="red-600"
                    initialMessage="Welcome to five28hertz strategic partnerships! I can help you understand how to initiate a partnership, what we look for in collaborators, our proposal process, and how we create mutual value. What would you like to know about collaborating with us?"
                    className="assistant-red"
                  />
                  <div className="p-4 flex justify-center">
                    <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50" asChild>
                      <a href="mailto:collaborate@five28hertz.com">
                        <RiMailLine className="mr-2" /> Still have questions? Contact us
                      </a>
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="presentation" className="mt-4">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-red-700">Partnership Framework</h3>
                    <div className="space-y-4 text-gray-700">
                      <p><strong>Partnership Model:</strong> five28hertz collaborates with organizations that share our vision of creating harmony, joy, and balance through purpose-driven initiatives.</p>
                      <p><strong>Benefits of Collaboration:</strong> Access to our conscious business ecosystem, co-creation opportunities, shared resources, amplified impact, and cross-platform visibility.</p>
                      <p><strong>Ideal Partners:</strong> We align with organizations focused on sustainability, conscious business practices, technological innovation, community development, and holistic wellbeing.</p>
                      <p><strong>Success Stories:</strong> Our collaborative approach has yielded transformative solutions in areas including sustainable technologies, mindful consumption platforms, and social impact programs.</p>
                      <p><strong>Proposal Process:</strong> Initial meeting, alignment assessment, co-creation workshop, proposal development, and implementation planning with clear milestones and success metrics.</p>
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
            <Button className="bg-gradient-to-r from-red-600 to-[#E25822] hover:from-[#E25822] hover:to-red-600 text-white px-8 py-6 text-lg" asChild>
              <Link href="/get-involved">
                <RiMailLine className="mr-2" /> Have a collaboration idea? Let's co-create something great
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Collaborate;