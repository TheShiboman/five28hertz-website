import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { RiArrowLeftLine, RiMailLine } from "react-icons/ri";
import { scrollToTop } from "@/lib/utils";
import { PresentationDeck } from "@/components/ui/presentation-deck";
import { ChatAssistant } from "@/components/ui/chat-assistant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Invest = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 bg-gradient-to-br from-blue-500 to-[#1E6A7A]">
        <div className="container mx-auto">
          <div className="absolute inset-0 bg-[url('/assets/pattern.svg')] opacity-10"></div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center relative z-10"
          >
            <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-6 text-white">
              Conscious Investment
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Invest in purpose-driven ventures that create lasting positive impact on our communities and environment.
            </p>
            <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-[#1E6A7A]" asChild>
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
          {/* Presentation Deck */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-playfair font-bold mb-6 text-center text-gray-800">
              Investment Opportunity Overview
            </h2>
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
              <PresentationDeck 
                title="Conscious Investor Journey"
                embedUrl="https://docs.google.com/presentation/d/e/2PACX-1vQpGY4hzwkXUc9RQP7Ft7XbnIdmPtf6WO8IEXMQh1QkCgoWN_Q6zU5tl9we6QVfglLzGvnQoPvUBQk-/embed?start=false&loop=false&delayms=3000"
                aspectRatio="16:9"
              />
            </div>
          </motion.div>

          {/* AI Assistant Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <div className="max-w-3xl mx-auto rounded-xl border border-blue-200 bg-white shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 hover:border-blue-300">
              <Tabs defaultValue="assistant" className="w-full">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
                  <TabsTrigger value="presentation">Presentation</TabsTrigger>
                </TabsList>
                <TabsContent value="assistant" className="mt-4">
                  <ChatAssistant 
                    assistantType="investor"
                    title="Investment Guide – Ask Anything"
                    gradientFrom="[#1E6A7A]"
                    gradientTo="blue-500"
                    iconColor="blue-600"
                    initialMessage="Hello! I'm your Investment Guide for five28hertz. I can help you understand our investment process, purpose-driven criteria, due diligence, and how to connect with our investment team. What would you like to know about conscious investing with us?"
                    className="assistant-ocean"
                  />
                  <div className="p-4 flex justify-center">
                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50" asChild>
                      <a href="mailto:invest@five28hertz.com">
                        <RiMailLine className="mr-2" /> Still have questions? Contact us
                      </a>
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="presentation" className="mt-4">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-blue-700">Investment Philosophy</h3>
                    <div className="space-y-4 text-gray-700">
                      <p><strong>What We Fund:</strong> Purpose-driven ventures focused on creating positive social and environmental impact while generating sustainable returns.</p>
                      <p><strong>Investment Criteria:</strong> Business models that promote balance, harmony, and joy through innovative solutions to real-world challenges.</p>
                      <p><strong>Impact Expectations:</strong> Measurable positive impact on communities, environments, and individuals' quality of life, with clear metrics for success.</p>
                      <p><strong>Return Principles:</strong> Patient capital with expectations for both financial sustainability and mission alignment, focused on long-term growth.</p>
                      <p><strong>Due Diligence:</strong> Rigorous assessment of business model viability, impact potential, team capabilities, and alignment with five28hertz values.</p>
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
            <Button className="bg-gradient-to-r from-blue-500 to-[#1E6A7A] hover:from-[#1E6A7A] hover:to-blue-500 text-white px-8 py-6 text-lg" asChild>
              <Link href="/get-involved">Ready to Connect? Contact Our Investment Team</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Invest;