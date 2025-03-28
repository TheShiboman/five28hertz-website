import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const Blog = () => {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6">
              528Hz Blog & Podcast
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join us as we explore transformative insights on innovation, wellness, and global trends.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Latest Episodes & Articles */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-playfair font-bold mb-8 text-center">
              🎧 Latest Episodes & Articles
            </h2>
            <div className="space-y-6 text-center">
              <p className="text-lg mb-4">
                Insights on innovation, wellness, business transformation, and global trends.
              </p>
              <p className="text-lg text-muted-foreground">
                Interviews with industry leaders, visionaries, and experts.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Get Involved Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-playfair font-bold mb-8 text-center">
              🤝 Get Involved – Join the Movement
            </h2>
            <h3 className="text-xl font-bold mb-6 text-center">
              ✨ Ways to Engage
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-lg bg-card shadow-sm hover:shadow-md transition-all duration-300 text-center"
              >
                <h4 className="font-bold mb-3">Partner with Us</h4>
                <p className="text-muted-foreground text-sm">
                  Business & investment opportunities
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="p-6 rounded-lg bg-card shadow-sm hover:shadow-md transition-all duration-300 text-center"
              >
                <h4 className="font-bold mb-3">Join Our Team</h4>
                <p className="text-muted-foreground text-sm">
                  Careers at five28hertz
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="p-6 rounded-lg bg-card shadow-sm hover:shadow-md transition-all duration-300 text-center"
              >
                <h4 className="font-bold mb-3">Stay Connected</h4>
                <p className="text-muted-foreground text-sm">
                  Newsletter sign-up & social media links
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl font-playfair font-bold mb-6">
              📍 Join Our Journey
            </h2>
            <p className="text-lg mb-8">
              "Be part of the transformation. Let's create a world of well-being, innovation, and purpose together."
            </p>
            <Button 
              variant="secondary" 
              size="lg" 
              asChild
              className="hover:bg-white/90"
            >
              <Link href="/get-involved">Get Started</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Blog;