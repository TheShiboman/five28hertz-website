import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const Projects = () => {
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
              Our <span className="text-[#06554E]">Brands</span> & <span className="text-[#F8A227]">Projects</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Explore our growing ecosystem of purpose-driven platforms—each designed to elevate human experience, spark innovation, and promote well-being through technology, creativity, and sustainability.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="space-y-24">
            {/* QXT World */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto relative group"
            >
              <div className="rounded-2xl bg-white/50 dark:bg-black/30 p-8 shadow-lg border border-[#0D2747]/10 relative overflow-hidden backdrop-blur-sm">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0D2747]/5 to-[#1A3A66]/5 opacity-30"></div>
                
                {/* Decorative Elements - Cue Ball & Lines */}
                <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-[#C8AA6E]/0 via-[#C8AA6E]/50 to-[#C8AA6E]/0 opacity-30"></div>
                <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-[#C8AA6E]/0 via-[#C8AA6E]/30 to-[#C8AA6E]/0 opacity-20"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-r from-[#0D2747]/10 to-[#C8AA6E]/10 blur-3xl"></div>
                
                <div className="relative z-10">
                  {/* Header with Logo */}
                  <div className="flex flex-col md:flex-row items-center justify-between mb-12">
                    <div className="flex items-center mb-6 md:mb-0">
                      <div className="bg-gradient-to-b from-[#0D2747] to-[#1A3A66] rounded-xl shadow-lg p-1 mr-6 w-24 h-24 overflow-hidden flex-shrink-0">
                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 h-full flex items-center justify-center">
                          <img
                            src="/assets/QXT World Logo.png"
                            alt="QXT World Logo"
                            className="w-full h-auto object-contain drop-shadow-lg"
                          />
                        </div>
                      </div>
                      <div>
                        <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#0D2747] to-[#1A3A66] dark:from-white dark:to-[#C8AA6E]">
                          QXT World
                        </h2>
                        <h3 className="text-xl text-[#1A3A66] dark:text-[#C8AA6E] font-semibold">
                          Cueing a New Era in Competitive Sports.
                        </h3>
                      </div>
                    </div>
                    
                    <div className="md:w-1/3 md:flex justify-end hidden">
                      <div className="bg-[#C8AA6E]/10 dark:bg-[#C8AA6E]/5 backdrop-blur-sm p-3 rounded-lg flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-[#0D2747]"></div>
                        <div className="font-semibold text-[#0D2747] dark:text-[#C8AA6E]">LIVE</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Main Content Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
                    {/* Left Column - Content and Image */}
                    <div className="lg:col-span-3 space-y-6">
                      {/* Description */}
                      <div className="bg-gradient-to-r from-[#F8F9FB] to-[#F2F3F5] dark:from-[#0D2747]/20 dark:to-[#0D2747]/10 p-6 rounded-xl shadow-sm border border-[#C8AA6E]/10">
                        <p className="text-lg leading-relaxed text-[#314E7A] dark:text-slate-200">
                          QXT World revolutionizes cue sports with real-time scoring, AI integration, and a global tournament ecosystem. Built for players, fans, and event organizers, QXT World brings precision, performance, and innovation to every corner of the game.
                        </p>
                      </div>
                      
                      {/* Image Section */}
                      <div className="relative overflow-hidden rounded-xl shadow-md aspect-video">
                        <img 
                          src="https://images.unsplash.com/photo-1615147342761-9238e15d8b96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                          alt="QXT World Tournament" 
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0D2747]/80 to-transparent opacity-60"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                            <p className="text-white font-medium text-sm">NEXT EVENT: World Championship Series - June 2025</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Metrics */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gradient-to-b from-[#0D2747]/5 to-[#0D2747]/10 dark:from-[#0D2747]/20 dark:to-[#0D2747]/30 rounded-xl p-4 text-center">
                          <p className="text-xl font-bold text-[#0D2747] dark:text-[#C8AA6E]">42+</p>
                          <p className="text-sm text-[#314E7A] dark:text-slate-300">Countries</p>
                        </div>
                        <div className="bg-gradient-to-b from-[#0D2747]/5 to-[#0D2747]/10 dark:from-[#0D2747]/20 dark:to-[#0D2747]/30 rounded-xl p-4 text-center">
                          <p className="text-xl font-bold text-[#0D2747] dark:text-[#C8AA6E]">5,000+</p>
                          <p className="text-sm text-[#314E7A] dark:text-slate-300">Players</p>
                        </div>
                        <div className="bg-gradient-to-b from-[#0D2747]/5 to-[#0D2747]/10 dark:from-[#0D2747]/20 dark:to-[#0D2747]/30 rounded-xl p-4 text-center">
                          <p className="text-xl font-bold text-[#0D2747] dark:text-[#C8AA6E]">120+</p>
                          <p className="text-sm text-[#314E7A] dark:text-slate-300">Events</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Column - Features */}
                    <div className="lg:col-span-2 self-stretch">
                      <div className="bg-gradient-to-b from-[#0D2747] to-[#1A3A66] rounded-xl shadow-lg h-full text-white relative p-6 flex flex-col">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C8AA6E]/70 via-[#C8AA6E] to-[#C8AA6E]/70"></div>
                        
                        <h4 className="text-xl font-bold mb-6 border-b border-white/20 pb-3 flex items-center gap-2">
                          <span className="h-2 w-2 bg-[#C8AA6E] rounded-full"></span>
                          Platform Features
                        </h4>
                        
                        <div className="space-y-5 flex-grow">
                          <div className="flex items-start gap-3 bg-white/5 hover:bg-white/10 p-3 rounded-lg transition-colors">
                            <div className="mt-1 bg-[#C8AA6E]/20 p-2 rounded-full text-sm flex-shrink-0 flex items-center justify-center w-8 h-8">
                              <span className="text-[#C8AA6E]">🏆</span>
                            </div>
                            <div>
                              <h5 className="font-medium text-white">Real-Time Tournament Scoring</h5>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3 bg-white/5 hover:bg-white/10 p-3 rounded-lg transition-colors">
                            <div className="mt-1 bg-[#C8AA6E]/20 p-2 rounded-full text-sm flex-shrink-0 flex items-center justify-center w-8 h-8">
                              <span className="text-[#C8AA6E]">👤</span>
                            </div>
                            <div>
                              <h5 className="font-medium text-white">Player Profiles with Ranking Metrics</h5>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3 bg-white/5 hover:bg-white/10 p-3 rounded-lg transition-colors">
                            <div className="mt-1 bg-[#C8AA6E]/20 p-2 rounded-full text-sm flex-shrink-0 flex items-center justify-center w-8 h-8">
                              <span className="text-[#C8AA6E]">📺</span>
                            </div>
                            <div>
                              <h5 className="font-medium text-white">Livestream & Marketplace Integration</h5>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3 bg-white/5 hover:bg-white/10 p-3 rounded-lg transition-colors">
                            <div className="mt-1 bg-[#C8AA6E]/20 p-2 rounded-full text-sm flex-shrink-0 flex items-center justify-center w-8 h-8">
                              <span className="text-[#C8AA6E]">📊</span>
                            </div>
                            <div>
                              <h5 className="font-medium text-white">Club & Federation Management Dashboard</h5>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-white/20">
                          <Button 
                            className="w-full bg-[#C8AA6E] hover:bg-[#D9BB7F] text-[#0D2747] hover:text-[#0D2747] font-bold"
                            asChild
                          >
                            <Link href="https://qxt-dev.web.app" target="_blank">
                              Visit Portal
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Testimonial */}
                  <div className="bg-gradient-to-r from-[#0D2747]/10 to-[#C8AA6E]/10 dark:from-[#0D2747]/20 dark:to-[#C8AA6E]/20 p-6 rounded-xl">
                    <p className="text-lg text-center font-medium text-[#0D2747] dark:text-[#C8AA6E]">
                      "QXT World represents the perfect fusion of tradition and technology, bringing cue sports into the digital age."
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Hover Effect Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#0D2747]/0 via-[#245091]/0 to-[#C8AA6E]/0 rounded-2xl blur-xl opacity-0 group-hover:opacity-70 transition-all duration-1000 group-hover:from-[#0D2747]/20 group-hover:via-[#245091]/20 group-hover:to-[#C8AA6E]/20 -z-10"></div>
            </motion.div>

            {/* Argento Homes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto relative group"
            >
              <div className="rounded-2xl bg-white/50 dark:bg-black/30 p-8 shadow-lg border border-[#4A6741]/10 relative overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-[#4A6741]/5 to-[#8BA888]/5 opacity-30"></div>
                <div className="relative z-10">
                  {/* Logo and Header Section */}
                  <div className="text-center mb-12">
                    <div className="flex justify-center">
                      <div className="mb-8 bg-white/70 dark:bg-black/40 rounded-xl shadow-lg group-hover:shadow-[0_0_20px_rgba(74,103,65,0.4)] transition-all duration-500 w-24 h-24 overflow-hidden">
                        <img
                          src="/assets/Argento Homes Logo.png"
                          alt="Argento Homes Logo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4 text-center">
                      Argento Homes
                    </h2>
                    <h3 className="text-xl text-[#4A6741] mb-6 text-center font-semibold">
                      Reimagining Living, Empowering Sustainability.
                    </h3>
                  </div>
                  
                  {/* Main Content Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    {/* Description Column */}
                    <div className="lg:col-span-2 space-y-6">
                      <div className="bg-[#F5F8F5] dark:bg-[#2A3328]/60 p-6 rounded-xl shadow-sm">
                        <p className="text-lg leading-relaxed">
                          Argento Homes redefines modern real estate by integrating smart living, sustainable practices, and community-centered design. From digital home management to green certification workflows, Argento empowers developers, homeowners, and vendors to co-create value at every stage of the property lifecycle.
                        </p>
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-4 mt-4">
                        <div className="md:w-1/2">
                          <img 
                            src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                            alt="Sustainable home exterior" 
                            className="rounded-lg shadow-md w-full h-48 object-cover"
                          />
                        </div>
                        <div className="md:w-1/2">
                          <img 
                            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                            alt="Smart home interior" 
                            className="rounded-lg shadow-md w-full h-48 object-cover"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Features Column */}
                    <div className="bg-gradient-to-b from-[#F5F8F5] to-[#E8F0E5] dark:from-[#2A3328]/60 dark:to-[#3D4A39]/40 p-6 rounded-xl shadow-sm space-y-5">
                      <h4 className="font-semibold text-xl text-[#4A6741] border-b border-[#4A6741]/20 pb-2 mb-4">Key Features</h4>
                      
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 bg-[#4A6741]/10 p-2 rounded-full text-lg flex-shrink-0">
                            <span className="text-[#4A6741]">📊</span>
                          </div>
                          <div>
                            <h5 className="font-medium text-[#4A6741]">Smart Home Control Dashboard</h5>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="mt-1 bg-[#4A6741]/10 p-2 rounded-full text-lg flex-shrink-0">
                            <span className="text-[#4A6741]">🔑</span>
                          </div>
                          <div>
                            <h5 className="font-medium text-[#4A6741]">Booking & Guest Management</h5>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="mt-1 bg-[#4A6741]/10 p-2 rounded-full text-lg flex-shrink-0">
                            <span className="text-[#4A6741]">🌿</span>
                          </div>
                          <div>
                            <h5 className="font-medium text-[#4A6741]">Green Certification Workflow</h5>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="mt-1 bg-[#4A6741]/10 p-2 rounded-full text-lg flex-shrink-0">
                            <span className="text-[#4A6741]">🛒</span>
                          </div>
                          <div>
                            <h5 className="font-medium text-[#4A6741]">Vendor Marketplace & Sustainability Tracker</h5>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 mt-4 border-t border-[#4A6741]/20">
                        <Button 
                          className="w-full bg-[#4A6741] hover:bg-[#5D7F52] transition-colors duration-300"
                          asChild
                        >
                          <Link href="/portals/argento-homes" target="_blank">
                            Visit Portal
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Testimonial/Quote Section */}
                  <div className="bg-gradient-to-r from-[#4A6741]/10 to-[#8BA888]/10 p-6 rounded-xl mt-4">
                    <p className="text-lg text-center font-medium text-[#2C3E29]">
                      "Argento Homes represents the future of sustainable living where technology enhances our connection to nature and each other."
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-[#4A6741]/0 to-[#8BA888]/0 rounded-2xl blur-xl opacity-0 group-hover:opacity-70 transition-all duration-1000 group-hover:from-[#4A6741]/20 group-hover:to-[#8BA888]/20 -z-10"></div>
            </motion.div>

            {/* ExchangeSphere */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto relative group"
            >
              <div className="rounded-2xl bg-white/50 dark:bg-black/30 p-8 shadow-lg border border-[#1E6A7A]/10 relative overflow-hidden backdrop-blur-sm">
                {/* Oceanic & Celestial Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#1E6A7A]/5 to-[#3B5F9A]/5 opacity-30"></div>
                
                {/* Animated Stars (Celestial Elements) */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(20)].map((_, i) => (
                    <div 
                      key={i}
                      className="absolute rounded-full bg-white"
                      style={{
                        width: `${Math.random() * 3 + 1}px`,
                        height: `${Math.random() * 3 + 1}px`,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        opacity: Math.random() * 0.5 + 0.2,
                        animation: `twinkle ${Math.random() * 4 + 3}s infinite ease-in-out ${Math.random() * 5}s`
                      }}
                    />
                  ))}
                </div>
                
                <div className="relative z-10">
                  {/* Header Section */}
                  <div className="text-center mb-10">
                    <div className="flex justify-center">
                      <div className="mb-8 bg-gradient-to-b from-[#1E6A7A]/70 to-[#3B5F9A]/70 dark:from-[#1E6A7A]/40 dark:to-[#3B5F9A]/40 rounded-xl shadow-lg group-hover:shadow-[0_0_30px_rgba(30,106,122,0.4)] transition-all duration-500 w-24 h-24 overflow-hidden flex items-center justify-center">
                        <img
                          src="/assets/ExchangeSphere Logo.png"
                          alt="ExchangeSphere Logo"
                          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#1E6A7A] to-[#3B5F9A]">
                      ExchangeSphere
                    </h2>
                    <h3 className="text-xl text-[#1E6A7A] mb-6 text-center font-semibold">
                      Where Dreams Meet Opportunity.
                    </h3>
                  </div>
                  
                  {/* Main Content Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
                    {/* Left Column - Description & Image */}
                    <div className="md:col-span-7 space-y-6">
                      {/* Description Card */}
                      <div className="bg-gradient-to-r from-[#EAF5F7] to-[#EEF2F9] dark:from-[#182A30]/70 dark:to-[#1E293E]/70 p-6 rounded-xl shadow-sm">
                        <p className="text-lg leading-relaxed text-[#2A4D5A] dark:text-gray-200">
                          ExchangeSphere connects individuals and organizations around the world through shared dreams, impactful goals, and collaborative exchanges. It's a personal and professional growth platform with purpose-driven journaling, vision matching, and opportunity discovery.
                        </p>
                      </div>
                      
                      {/* Portal Screenshot/Image */}
                      <div className="overflow-hidden rounded-xl shadow-md">
                        <img 
                          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                          alt="ExchangeSphere community collaboration" 
                          className="w-full h-64 object-cover object-center transform group-hover:scale-105 transition-transform duration-1000"
                        />
                      </div>
                      
                      {/* Quote/Testimonial */}
                      <div className="bg-gradient-to-r from-[#1E6A7A]/10 to-[#3B5F9A]/10 rounded-xl p-6">
                        <p className="text-center text-[#2A4D5A] dark:text-gray-100 italic font-medium">
                          "ExchangeSphere is where inspiration becomes action and individual visions create collective impact."
                        </p>
                      </div>
                    </div>
                    
                    {/* Right Column - Features & CTA */}
                    <div className="md:col-span-5">
                      <div className="bg-gradient-to-b from-[#F5FAFC] to-[#F0F4FA] dark:from-[#1A2C33]/70 dark:to-[#1D2537]/70 rounded-xl shadow-md p-6 h-full flex flex-col">
                        <h4 className="text-xl font-bold mb-6 text-[#1E6A7A] border-b border-[#1E6A7A]/20 pb-3">
                          Platform Features
                        </h4>
                        
                        {/* Features List */}
                        <div className="space-y-5 flex-grow">
                          <div className="flex items-start gap-4">
                            <div className="bg-gradient-to-r from-[#1E6A7A]/20 to-[#3B5F9A]/20 p-3 rounded-full text-lg flex-shrink-0">
                              <span className="text-[#1E6A7A]">📝</span>
                            </div>
                            <div>
                              <h5 className="font-medium text-[#1E6A7A]">Personalized Bucket List & Life Goals</h5>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-4">
                            <div className="bg-gradient-to-r from-[#1E6A7A]/20 to-[#3B5F9A]/20 p-3 rounded-full text-lg flex-shrink-0">
                              <span className="text-[#3B5F9A]">🔍</span>
                            </div>
                            <div>
                              <h5 className="font-medium text-[#1E6A7A]">Dream-to-Opportunity Matching</h5>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-4">
                            <div className="bg-gradient-to-r from-[#1E6A7A]/20 to-[#3B5F9A]/20 p-3 rounded-full text-lg flex-shrink-0">
                              <span className="text-[#1E6A7A]">🔄</span>
                            </div>
                            <div>
                              <h5 className="font-medium text-[#1E6A7A]">Real-Time Exchange Board</h5>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-4">
                            <div className="bg-gradient-to-r from-[#1E6A7A]/20 to-[#3B5F9A]/20 p-3 rounded-full text-lg flex-shrink-0">
                              <span className="text-[#3B5F9A]">💡</span>
                            </div>
                            <div>
                              <h5 className="font-medium text-[#1E6A7A]">Community-Driven Idea Sharing</h5>
                            </div>
                          </div>
                        </div>
                        
                        {/* CTA Button */}
                        <div className="mt-8 pt-4 border-t border-[#1E6A7A]/20">
                          <Button 
                            className="w-full bg-gradient-to-r from-[#1E6A7A] to-[#3B5F9A] hover:from-[#1C6270] hover:to-[#344F82] text-white shadow-md"
                            asChild
                          >
                            <Link href="https://exchangesphere-test.web.app" target="_blank">
                              Visit Portal
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Animated Hover Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#1E6A7A]/0 via-[#295E87]/0 to-[#3B5F9A]/0 rounded-2xl blur-xl opacity-0 group-hover:opacity-70 transition-all duration-1000 group-hover:from-[#1E6A7A]/20 group-hover:via-[#295E87]/20 group-hover:to-[#3B5F9A]/20 -z-10"></div>
            </motion.div>
            
            {/* Add keyframes for the twinkling stars - implemented through global CSS */}
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes twinkle {
                0%, 100% { opacity: 0.2; transform: scale(1); }
                50% { opacity: 0.7; transform: scale(1.3); }
              }
            `}} />

            {/* 528Hz Blog & Podcast */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto relative group"
            >
              <div className="rounded-2xl bg-white/50 dark:bg-black/30 p-8 shadow-lg border border-[#6A50A7]/10 relative overflow-hidden backdrop-blur-sm">
                {/* Ambient Wave Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#6A50A7]/5 to-[#8B6AAD]/5 opacity-30"></div>
                
                {/* Sound Wave Animation Elements */}
                <div className="absolute left-0 right-0 bottom-0 h-32 overflow-hidden opacity-20">
                  <div className="flex items-end justify-around h-full">
                    {[...Array(40)].map((_, i) => (
                      <div 
                        key={i}
                        className="bg-gradient-to-t from-[#6A50A7] to-[#8B6AAD] w-1 rounded-t-full"
                        style={{
                          height: `${Math.sin(i * 0.5) * 50 + 50}%`,
                          animationDuration: `${Math.random() * 2 + 1}s`,
                          animationDelay: `${i * 0.05}s`,
                          animation: 'soundwave 2s ease-in-out infinite alternate'
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="relative z-10">
                  {/* Header Section */}
                  <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
                    <div className="md:w-1/3 flex justify-center">
                      {/* Logo with Audio Visual Effect */}
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#6A50A7]/30 to-[#8B6AAD]/30 rounded-full blur-xl transform scale-110 animate-pulse"></div>
                        <div className="relative h-36 w-36 rounded-full bg-gradient-to-b from-[#6A50A7]/10 to-[#8B6AAD]/10 p-2 shadow-xl flex items-center justify-center overflow-hidden">
                          <div className="absolute inset-0 bg-white/50 dark:bg-black/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/20 dark:border-white/10"></div>
                          <img
                            src="/assets/528Hz Blog & Podcast Logo Canva.png"
                            alt="528Hz Blog & Podcast Logo"
                            className="w-32 h-32 object-cover relative rounded-full transform hover:scale-105 transition-all duration-500"
                          />
                          
                          {/* Circular Audio Indicator */}
                          <div className="absolute inset-0 rounded-full border-4 border-[#6A50A7]/20">
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#6A50A7]"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:w-2/3 text-center md:text-left">
                      <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-[#6A50A7] to-[#8B6AAD]">
                        528Hz Blog & Podcast
                      </h2>
                      <h3 className="text-xl text-[#6A50A7] mb-4 font-semibold">
                        Tune Into Transformation.
                      </h3>
                      <div className="inline-flex items-center gap-2 bg-[#6A50A7]/10 dark:bg-[#6A50A7]/20 rounded-full px-4 py-1.5 text-xs font-medium text-[#6A50A7]">
                        <span className="h-2 w-2 rounded-full bg-[#6A50A7] animate-pulse"></span>
                        LATEST EPISODE AVAILABLE NOW
                      </div>
                    </div>
                  </div>
                  
                  {/* Main Content Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
                    {/* Left Column - Description & Episodes */}
                    <div className="lg:col-span-8 space-y-6">
                      {/* Description */}
                      <div className="bg-gradient-to-r from-[#F6F4FA] to-[#F9F5FC] dark:from-[#2D2440]/50 dark:to-[#322546]/50 p-6 rounded-xl shadow-sm border border-[#6A50A7]/10">
                        <p className="text-lg leading-relaxed text-[#4A3B6D] dark:text-slate-200">
                          The 528Hz Blog & Podcast amplifies voices, stories, and insights that resonate with purpose, innovation, and human potential. Rooted in the five28hertz vision of harmony through transformation, this platform explores topics that inspire personal and collective growth — one frequency at a time.
                        </p>
                      </div>
                      
                      {/* Featured Episodes */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-[#6A50A7] flex items-center gap-2">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2"/>
                            <path d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5"/>
                            <path d="M18 15C19.6569 15 21 13.6569 21 12C21 10.3431 19.6569 9 18 9C16.3431 9 15 10.3431 15 12C15 13.6569 16.3431 15 18 15Z" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5"/>
                          </svg>
                          Featured Content
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white/60 dark:bg-[#2D2440]/30 rounded-xl overflow-hidden shadow-sm group hover:shadow-md transition-all">
                            <div className="h-40 overflow-hidden relative">
                              <div className="absolute inset-0 bg-gradient-to-t from-[#6A50A7]/50 to-transparent opacity-80 z-10"></div>
                              <img 
                                src="https://images.unsplash.com/photo-1581368135153-a506cf13531c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                alt="Meditation and frequencies" 
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                              />
                              <div className="absolute left-4 bottom-4 z-20">
                                <div className="flex items-center gap-2 text-white">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M9.5 16V8L16 12L9.5 16Z" fill="currentColor"/>
                                  </svg>
                                  <span className="text-sm font-medium">PODCAST</span>
                                </div>
                              </div>
                            </div>
                            <div className="p-4">
                              <h5 className="font-medium mb-1 text-[#4A3B6D]">Sound Healing & Modern Science</h5>
                              <p className="text-sm text-[#6A50A7]/70 line-clamp-2">Exploring the intersection of ancient sound practices and contemporary scientific research.</p>
                            </div>
                          </div>
                          
                          <div className="bg-white/60 dark:bg-[#2D2440]/30 rounded-xl overflow-hidden shadow-sm group hover:shadow-md transition-all">
                            <div className="h-40 overflow-hidden relative">
                              <div className="absolute inset-0 bg-gradient-to-t from-[#6A50A7]/50 to-transparent opacity-80 z-10"></div>
                              <img 
                                src="https://images.unsplash.com/photo-1589903308904-1010c2294adc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                alt="Person writing in journal" 
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                              />
                              <div className="absolute left-4 bottom-4 z-20">
                                <div className="flex items-center gap-2 text-white">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M7 7H17" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M7 12H17" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M7 17H13" stroke="currentColor" strokeWidth="2"/>
                                  </svg>
                                  <span className="text-sm font-medium">BLOG</span>
                                </div>
                              </div>
                            </div>
                            <div className="p-4">
                              <h5 className="font-medium mb-1 text-[#4A3B6D]">The Journaling Revolution</h5>
                              <p className="text-sm text-[#6A50A7]/70 line-clamp-2">How daily reflective writing transforms personal growth and creative potential.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Column - Features & CTA */}
                    <div className="lg:col-span-4">
                      <div className="bg-gradient-to-b from-[#6A50A7] to-[#8B6AAD] rounded-xl shadow-md h-full text-white relative p-6 flex flex-col">
                        {/* Audio Wave Design Element */}
                        <div className="absolute top-0 left-0 right-0 h-8 overflow-hidden">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute -top-20 w-full opacity-10">
                            <path fill="#ffffff" fillOpacity="1" d="M0,160L30,154.7C60,149,120,139,180,138.7C240,139,300,149,360,149.3C420,149,480,139,540,133.3C600,128,660,128,720,144C780,160,840,192,900,192C960,192,1020,160,1080,154.7C1140,149,1200,171,1260,176C1320,181,1380,171,1410,165.3L1440,160L1440,0L1410,0C1380,0,1320,0,1260,0C1200,0,1140,0,1080,0C1020,0,960,0,900,0C840,0,780,0,720,0C660,0,600,0,540,0C480,0,420,0,360,0C300,0,240,0,180,0C120,0,60,0,30,0L0,0Z"></path>
                          </svg>
                        </div>
                        
                        <h4 className="text-xl font-bold mb-6 border-b border-white/20 pb-3">
                          Content Features
                        </h4>
                        
                        <div className="space-y-4 flex-grow">
                          <div className="flex items-start gap-3 bg-white/5 hover:bg-white/10 p-3 rounded-lg transition-colors">
                            <div className="mt-1 bg-white/10 p-2 rounded-full flex-shrink-0 flex items-center justify-center w-8 h-8">
                              <span>📝</span>
                            </div>
                            <div>
                              <h5 className="font-medium text-white">Weekly Blog Articles on Innovation & Wellness</h5>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3 bg-white/5 hover:bg-white/10 p-3 rounded-lg transition-colors">
                            <div className="mt-1 bg-white/10 p-2 rounded-full flex-shrink-0 flex items-center justify-center w-8 h-8">
                              <span>🎙️</span>
                            </div>
                            <div>
                              <h5 className="font-medium text-white">Interviews with Visionaries and Changemakers</h5>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3 bg-white/5 hover:bg-white/10 p-3 rounded-lg transition-colors">
                            <div className="mt-1 bg-white/10 p-2 rounded-full flex-shrink-0 flex items-center justify-center w-8 h-8">
                              <span>✍️</span>
                            </div>
                            <div>
                              <h5 className="font-medium text-white">Community-Submitted Stories</h5>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3 bg-white/5 hover:bg-white/10 p-3 rounded-lg transition-colors">
                            <div className="mt-1 bg-white/10 p-2 rounded-full flex-shrink-0 flex items-center justify-center w-8 h-8">
                              <span>🎧</span>
                            </div>
                            <div>
                              <h5 className="font-medium text-white">Embedded Listening & Reading Experience</h5>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-white/20">
                          <Button 
                            className="w-full bg-white hover:bg-gray-100 text-[#6A50A7] hover:text-[#8B6AAD] font-bold shadow-md"
                            asChild
                          >
                            <Link href="/portals/528hz-blog-podcast" target="_blank">
                              Visit Portal
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quote Section */}
                  <div className="bg-gradient-to-r from-[#6A50A7]/10 to-[#8B6AAD]/10 p-6 rounded-xl flex items-center justify-center">
                    <div className="max-w-3xl text-center">
                      <div className="flex justify-center mb-4">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#6A50A7]/50">
                          <path d="M10 11H6C4.89543 11 4 10.1046 4 9V7C4 5.89543 4.89543 5 6 5H8C9.10457 5 10 5.89543 10 7V11ZM10 11V13C10 15.2091 8.20914 17 6 17V15M20 11H16C14.8954 11 14 10.1046 14 9V7C14 5.89543 14.8954 5 16 5H18C19.1046 5 20 5.89543 20 7V11ZM20 11V13C20 15.2091 18.2091 17 16 17V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <p className="text-lg font-medium text-[#4A3B6D] dark:text-slate-200 italic">
                        "528Hz is known as the 'Miracle Tone' - a frequency that resonates with the heart of everything. Our content aims to hit that same frequency in your life, creating ripples of positive transformation."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Hover Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#6A50A7]/0 via-[#7B5DA9]/0 to-[#8B6AAD]/0 rounded-2xl blur-xl opacity-0 group-hover:opacity-70 transition-all duration-1000 group-hover:from-[#6A50A7]/20 group-hover:via-[#7B5DA9]/20 group-hover:to-[#8B6AAD]/20 -z-10"></div>
            </motion.div>
            
            {/* Add keyframes for the sound wave animation */}
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes soundwave {
                0% { height: 10%; }
                100% { height: 90%; }
              }
            `}} />

          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto text-center mt-16 relative group"
          >
            <div className="py-16 px-8 rounded-2xl bg-white/50 dark:bg-black/30 shadow-lg border border-[#06554E]/10 relative overflow-hidden backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-[#06554E]/5 via-[#E25822]/5 to-[#BB3DB0]/5 opacity-30"></div>
              
              <div className="relative z-10">
                <h2 className="text-3xl font-playfair font-bold mb-6">Have a Project in Mind?</h2>
                <p className="text-muted-foreground mb-8">
                  We're always excited to collaborate on new and challenging projects.
                </p>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-[#06554E] to-[#1E6A7A] hover:from-[#1E6A7A] hover:to-[#06554E] border-none text-white shadow-md hover:shadow-[0_0_15px_rgba(6,85,78,0.4)] transition-all duration-300"
                  asChild
                >
                  <Link href="/get-involved">Start a Project</Link>
                </Button>
              </div>
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-[#06554E]/0 via-[#E25822]/0 to-[#BB3DB0]/0 rounded-2xl blur-xl opacity-0 group-hover:opacity-70 transition-all duration-1000 group-hover:from-[#06554E]/10 group-hover:via-[#E25822]/10 group-hover:to-[#BB3DB0]/10 -z-10"></div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Projects;