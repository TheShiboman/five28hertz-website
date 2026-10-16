import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { scrollToTop } from "@/lib/utils";
import { trackCTAClick } from "@/lib/analytics";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] pt-32 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E6A7A] via-[#1A5F70] to-[#155465] opacity-85" />
        <div className="absolute inset-0 bg-[url('/assets/pattern.svg')] opacity-10" />
        <div className="container relative mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-8 text-white">
              Empowering a Harmonious World Through Transformative Experiences
            </h1>
            <p className="text-xl text-white/90 mb-6 leading-relaxed">
              Welcome to five28hertz, a movement dedicated to crafting transformative experiences that enhance well-being, promote innovation, and shape a harmonious world.
            </p>
            <p className="text-lg text-white/80 mb-10">
              Our approach is rooted in science, innovation, and human connection, creating solutions that empower individuals, businesses, and communities.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg" 
                className="btn-teal hover-glow shadow-md" 
                asChild
              >
                <Link 
                  href="/vision" 
                  onClick={(e) => {
                    scrollToTop();
                    trackCTAClick('Explore Our Vision', '/vision');
                  }}
                >
                  Explore Our Vision
                </Link>
              </Button>
              <Button 
                size="lg" 
                className="bg-transparent border-2 border-white text-white hover:bg-white/20 hover:border-white/80 shadow-md" 
                asChild
              >
                <Link 
                  href="/get-involved" 
                  onClick={(e) => {
                    scrollToTop();
                    trackCTAClick('Join the Movement', '/get-involved');
                  }}
                >
                  Join the Movement
                </Link>
              </Button>
              <Button 
                size="lg" 
                className="btn-golden hover-glow shadow-md" 
                asChild
              >
                <Link 
                  href="/get-started" 
                  onClick={(e) => {
                    scrollToTop();
                    trackCTAClick('Get Started', '/get-started');
                  }}
                >
                  Get Started
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Highlights Section */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-16 text-center text-gray-800">
              Key <span className="text-[#06554E]">High<span className="text-[#F8A227]">lights</span></span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {/* Vision & Purpose */}
              <Link 
                href="/vision" 
                onClick={(e) => {
                  scrollToTop();
                  trackCTAClick('Key Highlight: Vision & Purpose', '/vision');
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="highlight-card highlight-card-ocean"
                >
                  <div>
                    <h3 className="text-lg font-bold mb-3 text-[#1E6A7A]">
                      Our Vision & Purpose
                    </h3>
                    <p className="text-sm text-gray-600 mb-8">
                      The philosophy behind five28hertz
                    </p>
                  </div>
                  <div className="w-12 h-1 bg-[#1E6A7A]"></div>
                </motion.div>
              </Link>

              {/* Brands & Projects */}
              <Link 
                href="/projects" 
                onClick={(e) => {
                  scrollToTop();
                  trackCTAClick('Key Highlight: Brands & Projects', '/projects');
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="highlight-card highlight-card-golden"
                >
                  <div>
                    <h3 className="text-lg font-bold mb-3 text-[#F8A227]">
                      Our Brands & Projects
                    </h3>
                    <p className="text-sm text-gray-600 mb-8">
                      Innovations shaping the future
                    </p>
                  </div>
                  <div className="w-12 h-1 bg-[#F8A227]"></div>
                </motion.div>
              </Link>

              {/* Legacy */}
              <Link 
                href="/legacy" 
                onClick={(e) => {
                  scrollToTop();
                  trackCTAClick('Key Highlight: Legacy', '/legacy');
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="highlight-card highlight-card-red"
                >
                  <div>
                    <h3 className="text-lg font-bold mb-3 text-[#B91C1C]">
                      The Legacy of ProAct World
                    </h3>
                    <p className="text-sm text-gray-600 mb-8">
                      Honoring the foundation of our journey
                    </p>
                  </div>
                  <div className="w-12 h-1 bg-[#B91C1C]"></div>
                </motion.div>
              </Link>

              {/* Join the Movement */}
              <Link 
                href="/get-involved" 
                onClick={(e) => {
                  scrollToTop();
                  trackCTAClick('Key Highlight: Join the Movement', '/get-involved');
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="highlight-card highlight-card-teal"
                >
                  <div>
                    <h3 className="text-lg font-bold mb-3 text-[#06554E]">
                      Join the Movement
                    </h3>
                    <p className="text-sm text-gray-600 mb-8">
                      Get involved in shaping the future
                    </p>
                  </div>
                  <div className="w-12 h-1 bg-[#06554E]"></div>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;