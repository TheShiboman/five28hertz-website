import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const Vision = () => {
  return (
    <div className="min-h-screen pt-20">
      {/* Mission & Philosophy Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-8 text-center">
              Our <span className="text-[#06554E]">Mission</span> & <span className="text-[#F8A227]">Philosophy</span>
            </h1>
            <div className="text-center mb-12">
              <p className="text-xl mb-6">
                At five28hertz, our vision is simple yet profound:
              </p>
              <p className="text-2xl md:text-3xl font-playfair text-primary mb-8">
                ✨ Empowering a harmonious world through transformative experiences.
              </p>
              <p className="text-lg text-muted-foreground">
                We believe that every aspect of life—technology, business, wellness, entertainment, and knowledge—can be optimized to promote human well-being and positive global impact.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why five28hertz? Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-[#f0f7f6]">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-playfair font-bold mb-6 text-center">
              Why <span className="text-[#06554E]">five28<span className="text-[#F8A227]">hertz</span></span>?
            </h2>
            <p className="text-lg text-muted-foreground text-center">
              The name five28hertz is inspired by the 528 Hz frequency, known as the "frequency of transformation." Just as this frequency is associated with healing, balance, and energy, our mission is to create experiences that uplift individuals, businesses, and society as a whole.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Pillars Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-playfair font-bold mb-12 text-center">
              Our <span className="text-[#06554E]">Core <span className="text-[#F8A227]">Pillars</span></span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Innovation & Technology",
                  description: "Creating futuristic, impactful solutions."
                },
                {
                  title: "Wellness & Well-Being",
                  description: "Designing experiences that enhance quality of life."
                },
                {
                  title: "Sustainability & Ethics",
                  description: "Building solutions that contribute positively to the world."
                },
                {
                  title: "Community & Collaboration",
                  description: "Bringing people together for shared growth."
                }
              ].map((pillar, index) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-lg bg-card shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <h3 className={`text-xl font-bold mb-3 ${index % 2 === 0 ? 'text-[#06554E]' : 'text-[#F8A227]'}`}>
                    ✅ {pillar.title}
                  </h3>
                  <p className="text-muted-foreground">{pillar.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#06554E] to-[#0A7E75] text-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl font-playfair font-bold mb-6">
              🚀 Join Our Movement
            </h2>
            <p className="text-lg mb-8">
              Learn more about our movement and join us in shaping the future.
            </p>
            <Button 
              size="lg" 
              asChild
              className="bg-[#F8A227] hover:bg-[#E08D0A] text-white border-none"
            >
              <Link href="/get-involved">Get Involved</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Vision;