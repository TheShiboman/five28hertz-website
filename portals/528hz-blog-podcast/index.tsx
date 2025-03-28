import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Sound wave animation component
const SoundWave = () => {
  return (
    <div className="flex items-end justify-center gap-0.5 h-12">
      {[...Array(40)].map((_, i) => (
        <div 
          key={i}
          className="bg-[#6A50A7] w-1 rounded-t-full"
          style={{
            height: `${Math.sin(i * 0.5) * 50 + 30}%`,
            animationDuration: `${Math.random() * 1.5 + 0.7}s`,
            animationDelay: `${i * 0.02}s`,
            animation: 'soundwave 1.5s ease-in-out infinite alternate'
          }}
        />
      ))}
      <style jsx>{`
        @keyframes soundwave {
          0% { height: 30%; }
          100% { height: 90%; }
        }
      `}</style>
    </div>
  );
};

// Featured episode component
const FeaturedEpisode = ({ title, image, duration, date, description, category }) => {
  return (
    <Card className="overflow-hidden border-[#6A50A7]/20 transition-all duration-300 hover:shadow-md">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <Badge variant="outline" className="bg-[#6A50A7] text-white border-none">{category}</Badge>
        </div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-playfair text-[#6A50A7]">{title}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{duration}</span>
            <span>•</span>
            <span>{date}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-2">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Play
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
            </svg>
            Save
          </Button>
        </div>
        <Button variant="link" className="text-[#6A50A7]">
          Read More
        </Button>
      </CardFooter>
    </Card>
  );
};

// Article preview component
const ArticlePreview = ({ title, author, date, image, snippet, readTime, category }) => {
  return (
    <Card className="overflow-hidden flex flex-col md:flex-row border-[#6A50A7]/20 transition-all duration-300 hover:shadow-md">
      <div className="md:w-1/3 relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="md:w-2/3 p-5">
        <Badge className="mb-2 bg-[#6A50A7]/10 text-[#6A50A7] hover:bg-[#6A50A7]/20">{category}</Badge>
        <h3 className="text-xl font-playfair font-bold mb-2 text-[#4A3B6D]">{title}</h3>
        <p className="text-muted-foreground mb-4 line-clamp-2">{snippet}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${author}`} />
              <AvatarFallback>{author[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{author}</span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">{date}</span>
          </div>
          <span className="text-xs text-muted-foreground">{readTime} min read</span>
        </div>
      </div>
    </Card>
  );
};

export default function Blog528HzPortal() {
  const [currentCategory, setCurrentCategory] = useState("all");

  const featuredEpisodes = [
    {
      title: "The Science of 528Hz Frequency",
      image: "https://images.unsplash.com/photo-1590374489273-7db8c73d0edb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      duration: "32 min",
      date: "Mar 21, 2025",
      description: "Exploring the historical and scientific background of the 528Hz frequency and its supposed healing properties.",
      category: "Science"
    },
    {
      title: "Entrepreneur Stories: Path to Purpose",
      image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      duration: "45 min",
      date: "Mar 14, 2025",
      description: "Interviews with purpose-driven entrepreneurs who transformed their industries through conscious innovation.",
      category: "Business"
    },
    {
      title: "Sound Healing Meditation Practice",
      image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      duration: "28 min",
      date: "Mar 7, 2025",
      description: "A guided meditation utilizing the 528Hz frequency to help listeners connect with their creative center.",
      category: "Wellness"
    }
  ];

  const articles = [
    {
      title: "How Sound Frequency Affects Human Consciousness",
      author: "Dr. Elena Michaels",
      date: "Mar 25, 2025",
      image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      snippet: "Recent research indicates that specific sound frequencies can alter brainwave patterns, potentially enhancing creativity and emotional well-being.",
      readTime: 8,
      category: "Research"
    },
    {
      title: "Community Spotlight: The Global 528 Movement",
      author: "James Wilson",
      date: "Mar 18, 2025",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      snippet: "How communities around the world are incorporating the principles of harmonic resonance into social innovation projects.",
      readTime: 5,
      category: "Community"
    },
    {
      title: "Creative Inspiration Through Sound: Artist Profiles",
      author: "Sophia Chen",
      date: "Mar 10, 2025",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      snippet: "Meet the artists and musicians who incorporate specific frequencies into their creative process to unlock new dimensions of expression.",
      readTime: 6,
      category: "Arts"
    }
  ];

  useEffect(() => {
    // Add page-specific animations or effects
    document.title = "528Hz Blog & Podcast | five28hertz";
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8FE] dark:bg-[#1A1625]">
      {/* Header/Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-r from-[#6A50A7] to-[#8B6AAD] text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1478147427282-58a87a120781?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] opacity-10 bg-cover bg-center"></div>
        
        {/* Wave Animation in Background */}
        <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20">
          <SoundWave />
        </div>
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3 flex justify-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl transform scale-110 animate-pulse"></div>
                <div className="relative h-48 w-48 rounded-full bg-white/10 p-3 shadow-xl flex items-center justify-center">
                  <img
                    src="/assets/528Hz Blog & Podcast Logo Canva.png"
                    alt="528Hz Blog & Podcast Logo"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </motion.div>
            </div>
            
            <div className="md:w-2/3 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4">
                  528Hz Blog & Podcast
                </h1>
                <h2 className="text-xl md:text-2xl mb-6 font-light">
                  Tune Into Transformation: Stories, Insights & Sound Healing
                </h2>
                <p className="text-lg text-white/80 max-w-2xl">
                  The 528Hz frequency is known as the "Miracle Tone" that resonates at the heart of everything. 
                  Our content aims to create that same resonance in your life, inspiring growth and positive transformation.
                </p>
                
                <div className="flex flex-wrap gap-4 mt-8 justify-center md:justify-start">
                  <Button className="bg-white text-[#6A50A7] hover:bg-white/90 hover:text-[#8B6AAD]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polygon points="10 8 16 12 10 16 10 8"></polygon>
                    </svg>
                    Latest Episode
                  </Button>
                  <Button variant="outline" className="border-white text-white hover:bg-white/20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="3" y1="9" x2="21" y2="9"></line>
                      <line x1="9" y1="21" x2="9" y2="9"></line>
                    </svg>
                    Browse Categories
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Featured Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-playfair font-bold text-[#4A3B6D] dark:text-white">Featured Episodes</h2>
            <Button variant="ghost" className="text-[#6A50A7]">
              View All
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                <path d="m9 18 6-6-6-6"></path>
              </svg>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEpisodes.map((episode, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <FeaturedEpisode {...episode} />
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* Content Tabs Section */}
        <section className="mb-16">
          <Tabs defaultValue="articles" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-[#6A50A7]/10 dark:bg-[#6A50A7]/20">
                <TabsTrigger value="articles">Articles</TabsTrigger>
                <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
                <TabsTrigger value="meditations">Meditations</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="articles" className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-[#4A3B6D] dark:text-white">Latest Articles</h3>
                <div className="flex gap-2">
                  {["all", "Research", "Community", "Arts", "Wellness"].map((category) => (
                    <Badge 
                      key={category}
                      variant={currentCategory === category ? "default" : "outline"}
                      className={`cursor-pointer ${currentCategory === category ? 'bg-[#6A50A7]' : 'hover:bg-[#6A50A7]/10'}`}
                      onClick={() => setCurrentCategory(category)}
                    >
                      {category === "all" ? "All" : category}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-6">
                {articles.map((article, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ArticlePreview {...article} />
                  </motion.div>
                ))}
              </div>
              
              <div className="flex justify-center mt-8">
                <Button variant="outline" className="text-[#6A50A7] border-[#6A50A7]/30 hover:bg-[#6A50A7]/10 hover:border-[#6A50A7]">
                  Load More Articles
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="podcasts">
              <div className="bg-[#6A50A7]/5 dark:bg-[#6A50A7]/10 rounded-xl p-10 text-center">
                <h3 className="text-xl font-semibold text-[#4A3B6D] dark:text-white mb-3">Full Podcast Archive</h3>
                <p className="text-muted-foreground mb-6">Browse our complete collection of podcast episodes exploring transformation, innovation, and purpose.</p>
                <Button className="bg-[#6A50A7] hover:bg-[#8B6AAD]">Coming Soon</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="meditations">
              <div className="bg-[#6A50A7]/5 dark:bg-[#6A50A7]/10 rounded-xl p-10 text-center">
                <h3 className="text-xl font-semibold text-[#4A3B6D] dark:text-white mb-3">Guided Sound Meditations</h3>
                <p className="text-muted-foreground mb-6">Experience our library of guided meditations using 528Hz and other healing frequencies.</p>
                <Button className="bg-[#6A50A7] hover:bg-[#8B6AAD]">Coming Soon</Button>
              </div>
            </TabsContent>
          </Tabs>
        </section>
        
        {/* Newsletter Section */}
        <section className="mb-16">
          <div className="rounded-xl bg-gradient-to-r from-[#6A50A7]/10 to-[#8B6AAD]/10 p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-playfair font-bold mb-4 text-[#4A3B6D] dark:text-white">Subscribe to Our Frequency</h2>
              <p className="text-muted-foreground mb-8">
                Get the latest articles, podcast episodes, and transformation resources delivered directly to your inbox.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="max-w-md border-[#6A50A7]/30 focus:border-[#6A50A7] focus:ring-[#6A50A7]"
                />
                <Button className="bg-[#6A50A7] hover:bg-[#8B6AAD]">
                  Subscribe
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground mt-4">
                By subscribing, you agree to our Privacy Policy and consent to receive updates from five28hertz.
              </p>
            </div>
          </div>
        </section>
        
        {/* Quote Section */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto bg-[#6A50A7]/5 dark:bg-[#6A50A7]/10 rounded-xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 left-4 text-6xl font-serif">"</div>
              <div className="absolute bottom-4 right-4 text-6xl font-serif">"</div>
            </div>
            
            <div className="relative z-10 text-center">
              <p className="text-xl md:text-2xl font-playfair italic text-[#4A3B6D] dark:text-white mb-6">
                "The 528Hz frequency is not just a sound—it's a vibration that reminds us of our connection to the universal flow of creation and transformation."
              </p>
              
              <div className="flex items-center justify-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-[#6A50A7]/20">
                  <AvatarImage src="https://api.dicebear.com/7.x/micah/svg?seed=John" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <h4 className="font-semibold text-[#4A3B6D] dark:text-white">Dr. Jonathan Dawes</h4>
                  <p className="text-sm text-muted-foreground">Sound Researcher & Podcast Host</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-[#6A50A7] text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/assets/528Hz Blog & Podcast Logo Canva.png"
                  alt="528Hz Blog & Podcast Logo"
                  className="w-10 h-10 rounded-full"
                />
                <h3 className="text-xl font-bold">528Hz Blog & Podcast</h3>
              </div>
              <p className="text-white/80 mb-6">
                Part of the five28hertz ecosystem, dedicated to amplifying voices and insights that resonate with purpose.
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </Button>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="text-lg font-semibold mb-4">Explore</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-white/80 hover:text-white">Articles</Link></li>
                <li><Link href="#" className="text-white/80 hover:text-white">Podcasts</Link></li>
                <li><Link href="#" className="text-white/80 hover:text-white">Meditations</Link></li>
                <li><Link href="#" className="text-white/80 hover:text-white">Resources</Link></li>
              </ul>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="text-lg font-semibold mb-4">Categories</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-white/80 hover:text-white">Science</Link></li>
                <li><Link href="#" className="text-white/80 hover:text-white">Wellness</Link></li>
                <li><Link href="#" className="text-white/80 hover:text-white">Business</Link></li>
                <li><Link href="#" className="text-white/80 hover:text-white">Community</Link></li>
              </ul>
            </div>
            
            <div className="md:col-span-4">
              <h4 className="text-lg font-semibold mb-4">five28hertz Ecosystem</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-white/80 hover:text-white">five28hertz Main Site</Link></li>
                <li><Link href="/portals/exchangesphere" className="text-white/80 hover:text-white">ExchangeSphere</Link></li>
                <li><Link href="/portals/argento-homes" className="text-white/80 hover:text-white">Argento Homes</Link></li>
                <li><Link href="/portals/qxt-world" className="text-white/80 hover:text-white">QXT World</Link></li>
              </ul>
            </div>
          </div>
          
          <Separator className="my-8 bg-white/20" />
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm">
              © 2025 five28hertz. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="#" className="text-white/60 text-sm hover:text-white">Privacy Policy</Link>
              <Link href="#" className="text-white/60 text-sm hover:text-white">Terms of Service</Link>
              <Link href="#" className="text-white/60 text-sm hover:text-white">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}