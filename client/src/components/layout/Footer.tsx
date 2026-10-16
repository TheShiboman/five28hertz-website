import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { insertNewsletterSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { RiTwitterXFill, RiLinkedinFill, RiGithubFill } from "react-icons/ri";
import { trackNewsletterSubmission, trackCTAClick } from "@/lib/analytics";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const validatedEmail = insertNewsletterSchema.parse({ email });
      await apiRequest("POST", "/api/newsletter", validatedEmail);
      
      // Track the successful newsletter submission
      trackNewsletterSubmission();
      
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
      });
      setEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="relative border-t overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#06554E]/10 via-[#E25822]/10 to-[#BB3DB0]/10"></div>
      <div className="absolute inset-0 bg-[url('/assets/pattern.svg')] opacity-5"></div>
      <div className="container relative z-10 mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-md hover:shadow-[0_0_15px_rgba(248,162,39,0.2)] transition-all duration-300 overflow-hidden w-16 h-16 flex items-center justify-center">
                <img 
                  src="/assets/five28hertz-logo.png" 
                  alt="Five28hertz" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-playfair font-bold ml-3 brand-gradient-text inline-block">Five28hertz</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Creating innovative digital experiences that resonate at the perfect frequency.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2 relative group">
              <div className="flex-1 relative max-w-xs">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="max-w-xs border-[#1E6A7A]/20 focus-visible:ring-[#1E6A7A] bg-[#1E6A7A]/5 placeholder:text-muted-foreground/70 transition-all duration-300"
                  required
                />
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-gradient-to-r from-[#06554E] to-[#1E6A7A] hover:from-[#1E6A7A] hover:to-[#06554E] border-none text-white shadow-sm transition-all duration-300 group-hover:shadow-[0_0_12px_rgba(30,106,122,0.5)]"
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </Button>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#06554E]/0 to-[#1E6A7A]/0 rounded-lg opacity-0 group-hover:opacity-100 blur-sm group-hover:blur transition-all duration-500 group-hover:from-[#06554E]/20 group-hover:to-[#1E6A7A]/20 -z-10"></div>
            </form>
          </div>

          <div>
            <h4 className="font-bold mb-4">Navigation</h4>
            <div className="flex flex-col space-y-2">
              <Link href="/" className="hover:text-[#06554E] transition-colors">Home</Link>
              <Link href="/vision" className="hover:text-[#1E6A7A] transition-colors">Vision</Link>
              <Link href="/projects" className="hover:text-[#E25822] transition-colors">Projects</Link>
              <Link href="/legacy" className="hover:text-[#BB3DB0] transition-colors">Legacy</Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Connect</h4>
            <div className="flex flex-col space-y-3">
              <a 
                href="https://twitter.com/five28hertz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center hover:text-[#1DA1F2] transition-colors"
                onClick={() => trackCTAClick('Twitter Link', 'https://twitter.com/five28hertz')}
              >
                <RiTwitterXFill className="mr-2 text-lg" /> Twitter
              </a>
              <a 
                href="https://www.linkedin.com/company/101343351/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center hover:text-[#0A66C2] transition-colors"
                onClick={() => trackCTAClick('LinkedIn Link', 'https://www.linkedin.com/company/101343351/')}
              >
                <RiLinkedinFill className="mr-2 text-lg" /> LinkedIn
              </a>
              <a 
                href="https://github.com/five28hertz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center hover:text-[#333333] dark:hover:text-[#EFEFEF] transition-colors"
                onClick={() => trackCTAClick('GitHub Link', 'https://github.com/five28hertz')}
              >
                <RiGithubFill className="mr-2 text-lg" /> GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 text-center text-sm text-muted-foreground">
          <div className="h-px w-full mb-8 bg-gradient-to-r from-[#06554E]/20 via-[#E25822]/20 to-[#BB3DB0]/20"></div>
          <p>&copy; {new Date().getFullYear()} Five28hertz. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;