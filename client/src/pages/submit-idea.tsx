import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { RiArrowLeftLine, RiMailLine } from "react-icons/ri";
import { scrollToTop } from "@/lib/utils";
import { PresentationDeck } from "@/components/ui/presentation-deck";
import { ChatAssistant } from "@/components/ui/chat-assistant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SubmitIdea = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 bg-gradient-to-br from-emerald-500 to-[#06554E]">
        <div className="container mx-auto">
          <div className="absolute inset-0 bg-[url('/assets/pattern.svg')] opacity-10"></div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center relative z-10"
          >
            <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-6 text-white">
              Submit Your Idea
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Share your vision with us and join the movement to create a harmonious world through innovative ideas.
            </p>
            <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-[#06554E]" asChild>
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
              How to Submit Your Visionary Idea
            </h2>
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
              <PresentationDeck 
                title="Visionary Innovator Journey"
                embedUrl="https://docs.google.com/presentation/d/e/2PACX-1vRNTXcMTiLJ5lHEOK1Ov-C-SXAofcfLlD1ldn8U48orq54H1-1XSh6KvbdXCQhAmrLcQkBc-lBaRwL9/embed?start=false&loop=false&delayms=3000"
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
            <div className="max-w-3xl mx-auto rounded-xl border border-emerald-200 bg-white shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 hover:border-emerald-300">
              <Tabs defaultValue="assistant" className="w-full">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
                  <TabsTrigger value="presentation">Presentation</TabsTrigger>
                </TabsList>
                <TabsContent value="assistant" className="mt-4">
                  <ChatAssistant 
                    assistantType="visionary"
                    title="Innovation Advisor – Ask Anything"
                    gradientFrom="[#06554E]"
                    gradientTo="emerald-500"
                    iconColor="emerald-600"
                    initialMessage="Hello, visionary! I'm here to help you develop your innovative ideas. Ask me about our submission process, eligibility criteria, evaluation timeline, or how to align your vision with five28hertz's philosophy."
                    className="assistant-teal"
                  />
                  <div className="p-4 flex justify-center">
                    <Button variant="outline" size="sm" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50" asChild>
                      <a href="mailto:hello@five28hertz.com">
                        <RiMailLine className="mr-2" /> Still have questions? Contact us
                      </a>
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="presentation" className="mt-4">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-emerald-700">Submission Guidelines</h3>
                    <div className="space-y-4 text-gray-700">
                      <p><strong>What we're looking for:</strong> Innovative ideas that promote harmony, joy, and balance in our world.</p>
                      <p><strong>Eligibility:</strong> Open to individuals and organizations committed to positive impact.</p>
                      <p><strong>Evaluation Criteria:</strong> Alignment with five28hertz values, feasibility, scalability, and potential impact.</p>
                      <p><strong>Timeline:</strong> Submissions reviewed quarterly, with initial feedback within 4 weeks.</p>
                      <p><strong>Process:</strong> Submit your idea through this portal, participate in a screening call, and if selected, join our incubation program.</p>
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
            <Button className="bg-gradient-to-r from-emerald-500 to-[#06554E] hover:from-[#06554E] hover:to-emerald-500 text-white px-8 py-6 text-lg" asChild>
              <Link href="/get-involved">Ready to Submit? Contact Us Now</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SubmitIdea;