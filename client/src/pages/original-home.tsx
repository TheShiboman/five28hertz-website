import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import ClientsSection from "@/components/sections/ClientsSection";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] pt-32 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-[#34A399] via-[#2A8A8F] to-[#1E6A7A] opacity-85" />
        <div className="absolute inset-0 bg-[url('/assets/pattern.svg')] opacity-10" />
        <div className="container relative mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-8 text-white">
              Empowering a Harmonious World Through Transformative Experiences
            </h1>
            <p className="text-xl text-white/90 mb-6 leading-relaxed">
              Welcome to five28hertz, a movement dedicated to crafting transformative experiences that enhance well-being, promote innovation, and shape a harmonious world.
            </p>
            <p className="text-lg text-white/80 mb-10">
              Our approach is rooted in science, innovation, and human connection, creating solutions that empower individuals, businesses, and communities.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" variant="secondary" className="hover-glow" asChild>
                <Link href="/vision">Explore Our Vision</Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="bg-transparent border-white text-white hover:bg-white hover:text-[#34A399]" 
                asChild
              >
                <Link href="/get-involved">Join the Movement</Link>
              </Button>
              <Button 
                variant="default" 
                size="lg" 
                className="bg-white text-[#34A399] hover:bg-white/90" 
                asChild
              >
                <Link href="/get-started">Get Started</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section id="vision" className="py-24 px-4 bg-gradient-to-br from-background via-accent/5 to-background">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-playfair font-bold mb-8 text-center">
              Our Vision & Purpose
            </h2>
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

          {/* Why five28hertz */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mb-16 p-8 bg-muted/30 rounded-lg"
          >
            <h3 className="text-2xl font-playfair font-bold mb-6 text-center">
              Why <span className="brand-gradient-text">five28hertz</span>?
            </h3>
            <p className="text-lg text-muted-foreground text-center">
              The name five28hertz is inspired by the 528 Hz frequency, known as the "frequency of transformation." Just as this frequency is associated with healing, balance, and energy, our mission is to create experiences that uplift individuals, businesses, and society as a whole.
            </p>
          </motion.div>

          {/* Core Pillars */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h3 className="text-2xl font-playfair font-bold mb-8 text-center">
              Our Core Pillars
            </h3>
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
                  <h4 className="text-xl font-bold mb-3">
                    ✅ {pillar.title}
                  </h4>
                  <p className="text-muted-foreground">{pillar.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-playfair font-bold mb-6">
              Our Brands & Projects
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Explore our growing ecosystem of purpose-driven platforms—each designed to elevate human experience, spark innovation, and promote well-being through technology, creativity, and sustainability.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* QXT World */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-card p-8 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <div className="mb-6 flex justify-center">
                <img
                  src="/assets/QXT World Logo.png"
                  alt="QXT World Logo"
                  className="h-24 w-auto"
                />
              </div>
              <h3 className="text-2xl font-playfair font-bold mb-3 text-center">
                🎱 QXT World
              </h3>
              <h4 className="text-lg text-primary mb-4 text-center">
                The Future of Cue Sports
              </h4>
              <p className="text-muted-foreground mb-4">
                Revolutionizing the cue sports landscape with digital intelligence and immersive entertainment.
              </p>
              <Button className="w-full mt-4" variant="outline" asChild>
                <Link href="/projects">View Project</Link>
              </Button>
            </motion.div>

            {/* Argento Homes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-card p-8 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <div className="mb-6 flex justify-center">
                <img
                  src="/assets/Argento Homes Logo.png"
                  alt="Argento Homes Logo"
                  className="h-24 w-auto"
                />
              </div>
              <h3 className="text-2xl font-playfair font-bold mb-3 text-center">
                🏡 Argento Homes
              </h3>
              <h4 className="text-lg text-primary mb-4 text-center">
                Conscious Hospitality. Reimagined.
              </h4>
              <p className="text-muted-foreground mb-4">
                Designing soulful, tech-enabled stays that feel like home and heal like a retreat.
              </p>
              <Button className="w-full mt-4" variant="outline" asChild>
                <Link href="/projects">View Project</Link>
              </Button>
            </motion.div>

            {/* ExchangeSphere */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-card p-8 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <h3 className="text-2xl font-playfair font-bold mb-3 text-center">
                🔄 ExchangeSphere
              </h3>
              <h4 className="text-lg text-primary mb-4 text-center">
                The Future of the Sharing Economy
              </h4>
              <p className="text-muted-foreground mb-4">
                A transformative peer-to-peer marketplace where trust, generosity, and value intersect.
              </p>
              <Button className="w-full mt-4" variant="outline" asChild>
                <Link href="/projects">View Project</Link>
              </Button>
            </motion.div>

            {/* 528Hz Blog & Podcast */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-card p-8 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <div className="mb-6 flex justify-center">
                <img
                  src="/assets/528Hz Blog & Podcast Logo Canva.png"
                  alt="528Hz Blog & Podcast Logo"
                  className="h-24 w-auto"
                />
              </div>
              <h3 className="text-2xl font-playfair font-bold mb-3 text-center">
                🎙 528Hz Blog & Podcast
              </h3>
              <h4 className="text-lg text-primary mb-4 text-center">
                The Pulse of Transformation
              </h4>
              <p className="text-muted-foreground mb-4">
                Sharing voices, values, and visions that shape a better world.
              </p>
              <Button className="w-full mt-4" variant="outline" asChild>
                <Link href="/blog">View Project</Link>
              </Button>
            </motion.div>
          </div>
          
          <div className="text-center mt-16">
            <Button size="lg" asChild>
              <Link href="/projects">View All Projects</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Legacy Section */}
      <section id="legacy" className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="mb-12 flex justify-center">
              <img
                src="/assets/ProAct World - black background.png"
                alt="ProAct World Logo"
                className="h-32 w-auto"
              />
            </div>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-8 text-center">
              🌍 The Legacy – ProAct World
            </h2>
            <div className="text-center mb-12">
              <h3 className="text-2xl font-playfair mb-6">
                The Foundation That Built five28hertz
              </h3>
              <p className="text-lg text-muted-foreground">
                Before five28hertz became a movement for global transformation, it was built on the legacy of ProAct World—a pioneering force in direct marketing and business solutions across the Middle East.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h3 className="text-2xl font-playfair font-bold mb-6 text-center">
              🌟 The ProAct World Story
            </h3>
            <p className="text-lg mb-6">
              Founded in 1998, ProAct World revolutionized consumer engagement, business intelligence, and data-driven marketing. With global brands like Procter & Gamble, ExxonMobil, Coca-Cola, Nokia, Visa, and many more, it reshaped the industry through:
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-muted-foreground">
                <span className="mt-1">✅</span>
                People-to-people marketing & consumer activation.
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <span className="mt-1">✅</span>
                Trade marketing & retail innovation.
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <span className="mt-1">✅</span>
                Strategic CRM, data analytics, and GIS mapping.
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <span className="mt-1">✅</span>
                Large-scale education & community engagement programs.
              </li>
            </ul>
          </motion.div>
          
          <div className="text-center mt-16">
            <Button size="lg" variant="outline" asChild>
              <Link href="/legacy">View Legacy & Clients</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Legacy Clients Section */}
      <ClientsSection />

      {/* Get Involved Section */}
      <section id="get-involved" className="py-24 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-playfair font-bold mb-6">
              Get Involved
            </h2>
            <p className="text-xl mb-4">
              Join us in creating meaningful digital experiences and making a positive impact.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto bg-white text-foreground p-8 rounded-lg shadow-lg"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Your Email*"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Textarea
                  placeholder="Your Message*"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>
              <div className="text-center">
                <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90">
                  Send Message
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;