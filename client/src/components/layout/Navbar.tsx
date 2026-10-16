import { Link, useLocation } from "wouter";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageDropdown from "@/components/ui/language-dropdown";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  // Handle scroll to top function when already on the same page
  const handleScrollToTop = useCallback((path: string) => (e: React.MouseEvent) => {
    if (location === path) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  // Define NavItem type
  type NavItem = {
    path: string;
    label: string;
    onClick?: (e: React.MouseEvent) => void;
  };

  const navItems: NavItem[] = [
    { path: "/", label: "Home", onClick: handleScrollToTop("/") },
    { path: "/vision", label: "Vision & Purpose", onClick: handleScrollToTop("/vision") },
    { path: "/projects", label: "Our Brands & Projects", onClick: handleScrollToTop("/projects") },
    { path: "/legacy", label: "Legacy", onClick: handleScrollToTop("/legacy") },
    { path: "/blog", label: "528Hz Blog & Podcast", onClick: handleScrollToTop("/blog") },
    { path: "/get-involved", label: "Get Involved", onClick: handleScrollToTop("/get-involved") },
  ];

  return (
    <nav className="fixed w-full z-40 bg-[#1E6A7A]/80 border-b border-white/10 backdrop-blur-sm shadow-md">
      <div className="container mx-auto px-6 py-3 relative">
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center -ml-2 absolute top-0"
            onClick={handleScrollToTop("/")}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-[0_0_15px_rgba(248,162,39,0.2)] transition-all duration-300 overflow-hidden w-20 h-20 flex items-center justify-center">
              <img 
                src="/assets/five28hertz-logo.png" 
                alt="Five28hertz" 
                className="w-full h-full object-cover"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 ml-auto">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                onClick={item.onClick}
                className={`text-xs font-medium px-2 py-1.5 rounded relative group transition-all duration-300 ${
                  location === item.path
                    ? "text-white bg-white/10" 
                    : "text-white/80 hover:text-white"
                }`}
              >
                {item.label}
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#06554E] via-[#E25822] to-[#BB3DB0] transition-all duration-300 group-hover:w-full ${location === item.path ? 'w-full' : ''}`}></span>
              </Link>
            ))}
            <LanguageDropdown />
            <Button 
              className="bg-gradient-to-r from-[#34A399] to-[#1E6A7A] hover:from-[#1E6A7A] hover:to-[#34A399] text-white border border-white/20 shadow-sm hover:shadow-[0_0_10px_rgba(30,106,122,0.5)] transition-all duration-300 ml-2"
              size="sm"
              asChild
            >
              <Link href="/get-started" onClick={handleScrollToTop("/get-started")}>Get Started</Link>
            </Button>
            <Button 
              className="bg-[#285e5e] hover:bg-[#1e4a4a] text-white shadow-sm hover:shadow-md hover:font-medium transition-all duration-300 ml-2"
              size="sm"
              asChild
            >
              <Link href="/signin">Login / Register</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-white/80 hover:text-white hover:shadow-[0_0_8px_rgba(30,106,122,0.6)] transition-all duration-300 ml-auto"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden py-4 space-y-1"
          >
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                onClick={item.onClick}
                className={`block py-2 px-3 text-xs rounded-md relative group transition-all duration-300 ${
                  location === item.path
                    ? "text-white bg-white/10" 
                    : "text-white/80 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#06554E] via-[#E25822] to-[#BB3DB0] transition-all duration-300 group-hover:w-full ${location === item.path ? 'w-full' : ''}`}></span>
              </Link>
            ))}
            <div className="py-2 px-3 mt-1">
              <LanguageDropdown />
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-[#34A399] to-[#1E6A7A] hover:from-[#1E6A7A] hover:to-[#34A399] text-white border border-white/20 shadow-sm hover:shadow-[0_0_10px_rgba(30,106,122,0.5)] transition-all duration-300 mt-2"
              size="sm"
              asChild
            >
              <Link href="/get-started" onClick={handleScrollToTop("/get-started")}>Get Started</Link>
            </Button>
            <Button 
              className="w-full bg-[#285e5e] hover:bg-[#1e4a4a] text-white shadow-sm hover:shadow-md hover:font-medium transition-all duration-300 mt-2"
              size="sm"
              asChild
            >
              <Link href="/signin">Login / Register</Link>
            </Button>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;