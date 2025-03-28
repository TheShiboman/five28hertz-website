import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { motion, AnimatePresence } from "framer-motion";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Vision from "@/pages/vision";
import Projects from "@/pages/projects";
import Legacy from "@/pages/legacy";
import Blog from "@/pages/blog";
import GetInvolved from "@/pages/get-involved";
import GetStarted from "@/pages/get-started";
import ComingSoon from "@/pages/coming-soon";
import SubmitIdea from "@/pages/submit-idea";
import Invest from "@/pages/invest";
import Community from "@/pages/community";
import Collaborate from "@/pages/collaborate";
import Platforms from "@/pages/platforms";
import TestChat from "@/pages/test-chat";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/ui/cursor";
import { useEffect } from "react";
import { initGA, pageview } from "@/lib/analytics";
import { LanguageProvider } from "@/contexts/LanguageContext";

function Router() {
  const [location] = useLocation();
  
  // Track page views whenever location changes
  useEffect(() => {
    const pageName = location === '/' ? 'Home' : location.substring(1).charAt(0).toUpperCase() + location.substring(2);
    pageview(location, `Five28hertz - ${pageName}`);
  }, [location]);
  
  return (
    <AnimatePresence mode="wait">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/vision" component={Vision} />
        <Route path="/projects" component={Projects} />
        <Route path="/legacy" component={Legacy} />
        <Route path="/blog" component={Blog} />
        <Route path="/get-involved" component={GetInvolved} />
        <Route path="/get-started" component={GetStarted} />
        <Route path="/coming-soon" component={ComingSoon} />
        <Route path="/submit-idea" component={SubmitIdea} />
        <Route path="/invest" component={Invest} />
        <Route path="/community" component={Community} />
        <Route path="/collaborate" component={Collaborate} />
        <Route path="/platforms" component={Platforms} />
        <Route path="/test-chat" component={TestChat} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  // Initialize Google Analytics
  useEffect(() => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (measurementId) {
      initGA(measurementId);
    } else {
      console.warn('Google Analytics Measurement ID not provided');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <CustomCursor />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;