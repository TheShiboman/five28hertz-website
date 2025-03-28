import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { RiArrowLeftLine } from "react-icons/ri";
import { scrollToTop } from "@/lib/utils";

const Platforms = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 bg-gradient-to-br from-amber-500 to-orange-700">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-6 text-white">
              Platform Access
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Sign in to access your personalized dashboard and resources within our ecosystem.
            </p>
            <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-amber-600" asChild>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-8 rounded-xl shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              This page is coming soon!
            </h2>
            <p className="text-gray-600 mb-8">
              We're currently developing our platform login system. Soon, you'll be able to access your personalized dashboard directly through this page. In the meantime, please get in touch with us through our contact page.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <Link href="/get-involved">Contact Us</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Platforms;