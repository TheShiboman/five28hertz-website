import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  RiUserHeartLine, 
  RiLightbulbLine, 
  RiBriefcaseLine, 
  RiTeamLine 
} from "react-icons/ri";
import { trackCTAClick } from "@/lib/analytics";
import { scrollToTop } from "@/lib/utils";
import { PresentationDeck } from "@/components/ui/presentation-deck";
import { ChatAssistant } from "@/components/ui/chat-assistant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define our user types with presentation deck information
const userTypes = [
  {
    title: "Visionary Innovator",
    icon: RiLightbulbLine,
    description: "Have a transformative idea that aligns with our vision? Submit your project proposal.",
    cta: "Submit Project Idea",
    link: "/submit-idea",
    color: "from-emerald-500 to-[#06554E]",
    tileClass: "journey-tile-teal",
    assistantType: "visionary" as const,
    assistantTitle: "Innovation Advisor",
    assistantGradientFrom: "[#06554E]",
    assistantGradientTo: "emerald-500",
    assistantIconColor: "emerald-600",
    assistantInitialMessage: "Hello, visionary! I'm here to help you develop your innovative ideas. Feel free to ask me about sustainable business models, technology integration, or how to align your vision with five28hertz.",
    presentationTitle: "Visionary Innovator Journey",
    presentationUrl: "https://docs.google.com/presentation/d/e/2PACX-1vRNTXcMTiLJ5lHEOK1Ov-C-SXAofcfLlD1ldn8U48orq54H1-1XSh6KvbdXCQhAmrLcQkBc-lBaRwL9/embed?start=false&loop=false&delayms=3000"
  },
  {
    title: "Conscious Investor",
    icon: RiBriefcaseLine,
    description: "Looking to invest in purpose-driven ventures that create positive impact? Let's connect.",
    cta: "Express Interest",
    link: "/invest",
    color: "from-blue-500 to-[#1E6A7A]",
    tileClass: "journey-tile-ocean",
    assistantType: "investor" as const,
    assistantTitle: "Investment Guide",
    assistantGradientFrom: "[#1E6A7A]",
    assistantGradientTo: "blue-500",
    assistantIconColor: "blue-600",
    assistantInitialMessage: "Welcome, conscious investor! I'm here to guide you through impact investment opportunities at five28hertz. What aspects of purpose-driven investing interest you most?",
    presentationTitle: "Conscious Investor Overview",
    presentationUrl: "https://docs.google.com/presentation/d/e/2PACX-1vRu4zxn7bP-pZQFKABdYPA1_KMD4EqVQmOlHDHyQgqUYuZ5ZMGJ4mLjh-HI34X1PlE_JNRo_1gzL6AH/embed?start=false&loop=false&delayms=3000"
  },
  {
    title: "Community Member",
    icon: RiUserHeartLine,
    description: "Join our vibrant community of change-makers committed to a harmonious world.",
    cta: "Join Community",
    link: "/community",
    color: "from-amber-400 to-[#F28E1C]",
    tileClass: "journey-tile-golden",
    assistantType: "community" as const,
    assistantTitle: "Community Guide",
    assistantGradientFrom: "[#F28E1C]",
    assistantGradientTo: "amber-400", 
    assistantIconColor: "amber-600",
    assistantInitialMessage: "Hello and welcome to our community! I'm here to help you connect with like-minded individuals and discover ways to engage with five28hertz. How would you like to contribute to our ecosystem?",
    presentationTitle: "Community Membership Benefits",
    presentationUrl: "https://docs.google.com/presentation/d/e/2PACX-1vQJuZA-nGDZvyz8b8DSk5Tn1R3CkP0Y5EfDC9FMa3SiNhQEDGbS4yfRCVKWUDT2rCOF9YkJmrGhOiGI/embed?start=false&loop=false&delayms=3000"
  },
  {
    title: "Strategic Partner",
    icon: RiTeamLine,
    description: "Explore partnership opportunities to amplify impact through collaborative initiatives.",
    cta: "Explore Partnership",
    link: "/collaborate",
    color: "from-red-600 to-[#E25822]",
    tileClass: "journey-tile-red",
    assistantType: "partner" as const,
    assistantTitle: "Partnership Advisor",
    assistantGradientFrom: "[#E25822]",
    assistantGradientTo: "red-600",
    assistantIconColor: "red-700",
    assistantInitialMessage: "Welcome, potential partner! I'm here to explore how our organizations might collaborate to create greater impact together. What type of partnership are you interested in?",
    presentationTitle: "Strategic Partnership Framework",
    presentationUrl: "https://docs.google.com/presentation/d/e/2PACX-1vRIDUt6UMtZcWc2JNc2YKDejh_c6g-iVlPwF9fNnmPCeEwPLmW7CoI-XPr3fPtVUKGR-MdNqHgMMvzZ/embed?start=false&loop=false&delayms=3000" 
  }
];

const GetStarted = () => {
  const [expandedTile, setExpandedTile] = useState<number | null>(null);

  const toggleTileExpansion = (index: number) => {
    if (expandedTile === index) {
      setExpandedTile(null);
    } else {
      setExpandedTile(index);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-12 md:mb-16 px-4"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold mb-4 md:mb-6">
              Get Started with <span className="brand-gradient-text">five28hertz</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground">
              Whether you're an innovator, investor, or community member, discover how you can engage with our ecosystem and contribute to creating a harmonious world.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 sm:gap-x-8 sm:gap-y-8 max-w-6xl mx-auto">
            {userTypes.map((userType, index) => (
              <div key={userType.title} className="flex flex-col h-full">
                {/* Journey Tile */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className={`group journey-tile ${userType.tileClass} mb-4 min-h-[300px] rounded-xl shadow-md`}
                  onClick={() => toggleTileExpansion(index)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${userType.color} opacity-95 group-hover:opacity-100 transition-all duration-300 group-hover:saturate-[1.15] rounded-xl`}></div>
                  <div className="absolute inset-0 bg-[url('/assets/pattern.svg')] opacity-10 group-hover:opacity-25 transition-all duration-300 rounded-xl"></div>
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-10 transition-all duration-300 rounded-xl"></div>
                  <div className="relative p-6 sm:p-8 h-full flex flex-col justify-between">
                    <div className="mb-4 p-3 bg-white/20 rounded-full w-fit group-hover:bg-white/30 transition-all duration-300 transform group-hover:scale-110">
                      <userType.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:translate-x-1 transition-transform duration-300">{userType.title}</h3>
                      <p className="text-white/90 mb-6">{userType.description}</p>
                    </div>
                    <Button 
                      variant="secondary" 
                      size="lg"
                      className="w-full justify-center bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white border-white/30 transition-all duration-300 transform hover:translate-y-[-2px]"
                      asChild
                    >
                      <Link 
                        href={userType.link}
                        onClick={(e) => {
                          e.stopPropagation();  // Prevent tile expansion when clicking the link
                          scrollToTop();
                          trackCTAClick(`Get Started Tile: ${userType.title}`, userType.link);
                        }}
                      >
                        {userType.cta}
                      </Link>
                    </Button>
                  </div>
                </motion.div>
                
                {/* Expanded Content - Presentation and Assistant */}
                {expandedTile === index && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="rounded-xl overflow-hidden mb-8"
                  >
                    <Tabs defaultValue="presentation" className="w-full">
                      <TabsList className="w-full grid grid-cols-2">
                        <TabsTrigger value="presentation">Presentation</TabsTrigger>
                        <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
                      </TabsList>
                      <TabsContent value="presentation" className="mt-4">
                        <PresentationDeck 
                          title={userType.presentationTitle}
                          embedUrl={userType.presentationUrl}
                          aspectRatio="16:9"
                        />
                      </TabsContent>
                      <TabsContent value="assistant" className="mt-4">
                        <ChatAssistant 
                          assistantType={userType.assistantType}
                          title={userType.assistantTitle}
                          gradientFrom={userType.assistantGradientFrom}
                          gradientTo={userType.assistantGradientTo}
                          iconColor={userType.assistantIconColor}
                          initialMessage={userType.assistantInitialMessage}
                          className={`assistant-${userType.assistantType}`}
                        />
                      </TabsContent>
                    </Tabs>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-16 sm:py-20 px-4 bg-accent/5">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-playfair font-bold mb-4 sm:mb-6">
              Your Journey with five28hertz
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Our platform is designed to connect, empower, and transform. No matter your path, we're here to support your journey toward positive impact.
            </p>
          </motion.div>

          <div className="flex flex-col space-y-8 sm:space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="p-6 sm:p-8 bg-[#06554E]/5 backdrop-blur-sm rounded-lg shadow-md relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#06554E]/5 to-[#1E6A7A]/5 opacity-50"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Have Questions?</h3>
                <p className="text-muted-foreground mb-4">
                  Our team is ready to assist you with any inquiries about joining our ecosystem or exploring collaboration opportunities.
                </p>
                <Button 
                  className="bg-gradient-to-r from-[#06554E] to-[#1E6A7A] hover:from-[#1E6A7A] hover:to-[#06554E] text-white border-white/10 shadow-sm transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(6,85,78,0.4)]" 
                  asChild
                >
                  <Link 
                    href="/get-involved"
                    onClick={() => {
                      scrollToTop();
                      trackCTAClick('Contact Us', '/get-involved');
                    }}
                  >
                    Contact Us
                  </Link>
                </Button>
              </div>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#06554E]/0 to-[#1E6A7A]/0 rounded-lg opacity-0 group-hover:opacity-100 blur group-hover:blur-md transition-all duration-500 group-hover:from-[#06554E]/20 group-hover:to-[#1E6A7A]/20 -z-10"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="p-6 sm:p-8 bg-[#1E6A7A]/5 backdrop-blur-sm rounded-lg shadow-md relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#34A399]/5 to-[#1E6A7A]/10 opacity-50"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
                <p className="text-muted-foreground mb-4">
                  Subscribe to our newsletter to receive updates on new initiatives, projects, and opportunities to get involved.
                </p>
                <Button 
                  className="bg-gradient-to-r from-[#34A399] to-[#1E6A7A] hover:from-[#1E6A7A] hover:to-[#34A399] text-white border-white/10 shadow-sm transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(30,106,122,0.4)]" 
                  asChild
                >
                  <Link 
                    href="/get-involved?subscribe=true"
                    onClick={() => {
                      scrollToTop();
                      trackCTAClick('Subscribe Now', '/get-involved?subscribe=true');
                    }}
                  >
                    Subscribe Now
                  </Link>
                </Button>
              </div>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#34A399]/0 to-[#1E6A7A]/0 rounded-lg opacity-0 group-hover:opacity-100 blur group-hover:blur-md transition-all duration-500 group-hover:from-[#34A399]/20 group-hover:to-[#1E6A7A]/20 -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GetStarted;