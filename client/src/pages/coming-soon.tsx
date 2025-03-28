import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const ComingSoon = () => {
  return (
    <div className="min-h-screen pt-20">
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6">
              Coming Soon
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              We're working on something exciting! Our project submission portal will be available soon.
            </p>
            <Button variant="outline" size="lg" asChild>
              <Link href="/projects">Back to Projects</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ComingSoon;
