import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

const GetInvolved = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // For now, we'll use mailto as a fallback but with proper validation
    const mailtoLink = `mailto:contact@five28hertz.com?subject=Contact from ${name}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoLink;

    // Clear form
    setName("");
    setEmail("");
    setMessage("");
  };

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
              Get Involved
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join us in creating meaningful digital experiences and making a positive impact.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#06554E]/5 via-[#1E6A7A]/5 to-[#E25822]/5"></div>
        <div className="absolute inset-0 bg-[url('/assets/pattern.svg')] opacity-5"></div>
        <div className="container relative z-10 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl mx-auto bg-white/60 dark:bg-black/30 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-[#1E6A7A]/10"
          >
            <h2 className="text-2xl font-playfair font-bold mb-6 text-center">Contact Us</h2>
            <form onSubmit={handleSubmit} className="space-y-6 relative group">
              <div className="relative group">
                <Input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/70 dark:bg-black/20 border-[#1E6A7A]/20 focus-visible:ring-[#1E6A7A] transition-all duration-300 placeholder:text-muted-foreground/70"
                />
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#06554E]/0 to-[#1E6A7A]/0 rounded-md opacity-0 group-focus-within:opacity-100 blur group-focus-within:blur-md transition-all duration-500 group-focus-within:from-[#06554E]/10 group-focus-within:to-[#1E6A7A]/10 -z-10"></div>
              </div>

              <div className="relative group">
                <Input
                  type="email"
                  placeholder="Your Email*"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/70 dark:bg-black/20 border-[#1E6A7A]/20 focus-visible:ring-[#1E6A7A] transition-all duration-300 placeholder:text-muted-foreground/70"
                />
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#06554E]/0 to-[#1E6A7A]/0 rounded-md opacity-0 group-focus-within:opacity-100 blur group-focus-within:blur-md transition-all duration-500 group-focus-within:from-[#06554E]/10 group-focus-within:to-[#1E6A7A]/10 -z-10"></div>
              </div>

              <div className="relative group">
                <Textarea
                  placeholder="Your Message*"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[150px] bg-white/70 dark:bg-black/20 border-[#1E6A7A]/20 focus-visible:ring-[#1E6A7A] transition-all duration-300 placeholder:text-muted-foreground/70"
                />
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#06554E]/0 to-[#1E6A7A]/0 rounded-md opacity-0 group-focus-within:opacity-100 blur group-focus-within:blur-md transition-all duration-500 group-focus-within:from-[#06554E]/10 group-focus-within:to-[#1E6A7A]/10 -z-10"></div>
              </div>

              <div className="text-center mt-8">
                <Button 
                  type="submit" 
                  size="lg"
                  className="bg-gradient-to-r from-[#06554E] to-[#1E6A7A] hover:from-[#1E6A7A] hover:to-[#06554E] border-none text-white shadow-md hover:shadow-[0_0_15px_rgba(6,85,78,0.4)] transition-all duration-300"
                >
                  Send Message
                </Button>
                <div className="mt-4 text-sm text-muted-foreground">
                  We'll get back to you as soon as possible.
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default GetInvolved;