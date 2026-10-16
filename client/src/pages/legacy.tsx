import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Legacy = () => {
  return (
    <div className="min-h-screen pt-20">
      {/* Introduction Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <div className="mb-12 flex justify-center">
              <img
                src="/assets/ProAct World - black background.png"
                alt="ProAct World Logo"
                className="h-40 w-auto"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-8 text-center">
              🌍 The Legacy – ProAct World
            </h1>
            <div className="text-center mb-12">
              <h2 className="text-2xl font-playfair mb-6">
                The Foundation That Built five28hertz
              </h2>
              <p className="text-lg text-muted-foreground">
                Before five28hertz became a movement for global transformation, it was built on the legacy of ProAct World—a pioneering force in direct marketing and business solutions across the Middle East.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ProAct World Story Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-playfair font-bold mb-6 text-center">
              🌟 The ProAct World Story
            </h2>
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
            <p className="text-lg text-muted-foreground">
              For two decades, ProAct World led the way in business transformation, serving as a launchpad for the future.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Business to Global Transformation Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-playfair font-bold mb-6 text-center">
              🚀 From Business to Global Transformation
            </h2>
            <p className="text-lg mb-6">
              The same principles that made ProAct World a leader—knowledge, ethics, leadership, and service—are now woven into five28hertz. Today, five28hertz expands beyond marketing into industries that transform lives:
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-muted-foreground">
                <span className="mt-1">✅</span>
                Technology & Innovation – ExchangeSphere: A peer-to-peer sharing economy platform.
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <span className="mt-1">✅</span>
                Real Estate & Hospitality – Argento Homes: AI-powered, luxury short-term stays.
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <span className="mt-1">✅</span>
                Sports & Lifestyle – QXT World: Redefining cue sports entertainment.
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <span className="mt-1">✅</span>
                Media & Wellness – 528Hz Blog & Podcast: Well-being, knowledge, and inspiration.
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Industry-Specific Clients Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-playfair font-bold mb-8 text-center">
              🌎 ProAct World's Legacy & Global Impact
            </h2>
            <h3 className="text-xl font-bold mb-6 text-center">
              🚀 Trusted by Industry Leaders
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-lg bg-card shadow-sm hover:shadow-md transition-all duration-300"
              >
                <h3 className="text-xl font-bold mb-4">🏭 FMCG & Consumer Goods</h3>
                <p className="text-muted-foreground mb-6">
                  Helping brands connect with consumers through direct marketing & activations.
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 items-center">
                  {[
                    {
                      src: "/assets/procter-and-gamble.png",
                      alt: "Procter & Gamble Logo"
                    },
                    {
                      src: "/assets/unilever.png",
                      alt: "Unilever Logo"
                    },
                    {
                      src: "/assets/mars-incorporated-4096.png",
                      alt: "Mars Logo"
                    },
                    {
                      src: "/assets/purepng.com-pepsico-logologobrand-logoiconslogos-251519939772eazsw.png",
                      alt: "PepsiCo Logo"
                    },
                    {
                      src: "/assets/coca-cola-logo-11.jpg",
                      alt: "Coca-Cola Logo"
                    },
                    {
                      src: "/assets/Nestle-Logo-1984-1995.png",
                      alt: "Nestlé Logo"
                    },
                    {
                      src: "/assets/Danone-logo.png",
                      alt: "Danone Logo"
                    },
                    {
                      src: "/assets/png-clipart-logo-henkel-lietuva-adhesive-graphics-henkel-logo-text-logo.png",
                      alt: "Henkel Logo"
                    },
                    {
                      src: "/assets/png-transparent-sc-johnson-hd-logo.png",
                      alt: "SC Johnson Logo"
                    },
                    {
                      src: "/assets/fonterra--600.png",
                      alt: "Fonterra Logo"
                    },
                    {
                      src: "/assets/ulker-logo.png",
                      alt: "Ülker Logo"
                    },
                    {
                      src: "/assets/Reckitt-Logo.png",
                      alt: "Reckitt Logo"
                    }
                  ].map((logo, index) => (
                    <motion.div
                      key={logo.alt}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center justify-center p-2 bg-white rounded-lg hover:shadow-md transition-all duration-300"
                    >
                      <img
                        src={logo.src}
                        alt={logo.alt}
                        className="h-12 w-auto object-contain"
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="p-6 rounded-lg bg-card shadow-sm hover:shadow-md transition-all duration-300"
              >
                <h3 className="text-xl font-bold mb-4">🏥 Healthcare & Pharmaceuticals</h3>
                <p className="text-muted-foreground mb-6">
                  Supporting healthcare leaders with awareness campaigns & patient engagement.
                </p>
                <div className="grid grid-cols-2 gap-6 items-center">
                  {[
                    {
                      src: "/assets/gs138g1ea-gsk-logo-gsk-logo-transparent-png-stickpng.png",
                      alt: "GSK Logo"
                    },
                    {
                      src: "/assets/16871779-sanofi_aventis_logo1.1910x1000.jpg",
                      alt: "Sanofi Aventis Logo"
                    }
                  ].map((logo, index) => (
                    <motion.div
                      key={logo.alt}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center justify-center p-4 bg-white rounded-lg hover:shadow-md transition-all duration-300"
                    >
                      <img
                        src={logo.src}
                        alt={logo.alt}
                        className="h-20 w-auto object-contain max-w-full"
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="p-6 rounded-lg bg-card shadow-sm hover:shadow-md transition-all duration-300"
              >
                <h3 className="text-xl font-bold mb-4">📡 Technology & Telecom</h3>
                <p className="text-muted-foreground mb-6">
                  Driving market penetration through digital engagement strategies.
                </p>
                <div className="grid grid-cols-3 gap-6 items-center">
                  {[
                    {
                      src: "/assets/Nokia-Logo.png",
                      alt: "Nokia Logo"
                    },
                    {
                      src: "/assets/cq5dam.web.1280.1280.png",
                      alt: "Orange Logo"
                    },
                    {
                      src: "/assets/etisalat-new-20229928.logowik.com.webp",
                      alt: "e& (Etisalat) Logo"
                    }
                  ].map((logo, index) => (
                    <motion.div
                      key={logo.alt}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center justify-center p-4 bg-white rounded-lg hover:shadow-md transition-all duration-300"
                    >
                      <img
                        src={logo.src}
                        alt={logo.alt}
                        className="h-16 w-auto object-contain max-w-full"
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
                className="p-6 rounded-lg bg-card shadow-sm hover:shadow-md transition-all duration-300"
              >
                <h3 className="text-xl font-bold mb-4">🏨 Hospitality & Real Estate</h3>
                <p className="text-muted-foreground mb-6">
                  Enhancing guest experiences & brand positioning.
                </p>
                <div className="grid grid-cols-2 gap-6 items-center">
                  {[
                    {
                      src: "/assets/em45ema7bcd-emaar-logo-emaar-properties-dubai-properties-for-sale-amp-investment.png",
                      alt: "Emaar Logo"
                    },
                    {
                      src: "/assets/IFA-Hotels-Resorts-Logo-Vector.jpg",
                      alt: "IFA Hotels & Resorts Logo"
                    }
                  ].map((logo, index) => (
                    <motion.div
                      key={logo.alt}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center justify-center p-4 bg-white rounded-lg hover:shadow-md transition-all duration-300"
                    >
                      <img
                        src={logo.src}
                        alt={logo.alt}
                        className="h-20 w-auto object-contain max-w-full"
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                viewport={{ once: true }}
                className="p-6 rounded-lg bg-card shadow-sm hover:shadow-md transition-all duration-300"
              >
                <h3 className="text-xl font-bold mb-4">⚽️ Sports & Lifestyle</h3>
                <p className="text-muted-foreground mb-6">
                  Building immersive brand experiences in sports marketing & lifestyle engagement.
                </p>
                <div className="grid grid-cols-2 gap-6 items-center">
                  {[
                    {
                      src: "/assets/BSA_LOGO_NEGRO1.jpg",
                      alt: "Barcelona Soccer Academy Logo"
                    },
                    {
                      src: "/assets/powerhorse-logo-portrait.jpg",
                      alt: "Power Horse Logo"
                    }
                  ].map((logo, index) => (
                    <motion.div
                      key={logo.alt}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center justify-center p-4 bg-white rounded-lg hover:shadow-md transition-all duration-300"
                    >
                      <img
                        src={logo.src}
                        alt={logo.alt}
                        className="h-20 w-auto object-contain max-w-full"
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Legacy;