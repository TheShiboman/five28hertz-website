import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

// Categorized client lists
const fmcgClients = [
  {
    name: "Procter & Gamble",
    logo: "/assets/procter-and-gamble.png"
  },
  {
    name: "Unilever",
    logo: "/assets/unilever.png"
  },
  {
    name: "Mars",
    logo: "/assets/mars-incorporated-4096.png"
  },
  {
    name: "PepsiCo",
    logo: "/assets/purepng.com-pepsico-logologobrand-logoiconslogos-251519939772eazsw.png"
  },
  {
    name: "Coca-Cola",
    logo: "/assets/coca-cola-logo-11.jpg"
  },
  {
    name: "Nestlé",
    logo: "/assets/Nestle-Logo-1984-1995.png"
  },
  {
    name: "Danone",
    logo: "/assets/Danone-logo.png"
  },
  {
    name: "Reckitt",
    logo: "/assets/Reckitt-Logo.png"
  }
];

const techClients = [
  {
    name: "Nokia",
    logo: "/assets/Nokia-Logo.png"
  },
  {
    name: "Orange",
    logo: "/assets/cq5dam.web.1280.1280.png"
  },
  {
    name: "Etisalat",
    logo: "/assets/etisalat-new-20229928.logowik.com.webp"
  }
];

const healthcareClients = [
  {
    name: "GSK",
    logo: "/assets/gs138g1ea-gsk-logo-gsk-logo-transparent-png-stickpng.png"
  },
  {
    name: "Sanofi Aventis",
    logo: "/assets/16871779-sanofi_aventis_logo1.1910x1000.jpg"
  }
];

const realEstateClients = [
  {
    name: "Emaar",
    logo: "/assets/em45ema7bcd-emaar-logo-emaar-properties-dubai-properties-for-sale-amp-investment.png"
  },
  {
    name: "IFA Hotels & Resorts",
    logo: "/assets/IFA-Hotels-Resorts-Logo-Vector.jpg"
  }
];

export default function ClientsSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-[#f0f7f6]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
            Our <span className="text-[#06554E]">Global <span className="text-[#F8A227]">Clients</span></span>
          </h2>
          <p className="text-base text-muted-foreground mb-8">
            Over two decades of transformative collaborations across industries
          </p>
        </motion.div>

        {/* FMCG & Consumer Goods */}
        <div className="mb-16">
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-xl font-bold mb-6 text-center text-[#06554E]"
          >
            🏭 FMCG & Consumer Goods
          </motion.h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {fmcgClients.map((client, index) => (
              <motion.div
                key={client.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="flex items-center justify-center p-4 h-24 bg-white border border-transparent hover:shadow-md hover:border-[#06554E]/30 transition-all duration-300">
                  <img
                    src={client.logo}
                    alt={`${client.name} logo`}
                    className="w-auto max-h-16 object-contain opacity-85 hover:opacity-100 transition-opacity duration-200"
                  />
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Technology & Telecom */}
        <div className="mb-16">
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-xl font-bold mb-6 text-center text-[#F8A227]"
          >
            📡 Technology & Telecom
          </motion.h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {techClients.map((client, index) => (
              <motion.div
                key={client.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="flex items-center justify-center p-4 h-24 bg-white border border-transparent hover:shadow-md hover:border-[#F8A227]/30 transition-all duration-300">
                  <img
                    src={client.logo}
                    alt={`${client.name} logo`}
                    className="w-auto max-h-16 object-contain opacity-85 hover:opacity-100 transition-opacity duration-200"
                  />
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Healthcare & Pharmaceuticals */}
        <div className="mb-16">
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-xl font-bold mb-6 text-center text-[#06554E]"
          >
            🏥 Healthcare & Pharmaceuticals
          </motion.h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {healthcareClients.map((client, index) => (
              <motion.div
                key={client.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="flex items-center justify-center p-4 h-24 bg-white border border-transparent hover:shadow-md hover:border-[#06554E]/30 transition-all duration-300">
                  <img
                    src={client.logo}
                    alt={`${client.name} logo`}
                    className="w-auto max-h-16 object-contain opacity-85 hover:opacity-100 transition-opacity duration-200"
                  />
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Real Estate & Hospitality */}
        <div>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-xl font-bold mb-6 text-center text-[#F8A227]"
          >
            🏨 Real Estate & Hospitality
          </motion.h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {realEstateClients.map((client, index) => (
              <motion.div
                key={client.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="flex items-center justify-center p-4 h-24 bg-white border border-transparent hover:shadow-md hover:border-[#F8A227]/30 transition-all duration-300">
                  <img
                    src={client.logo}
                    alt={`${client.name} logo`}
                    className="w-auto max-h-16 object-contain opacity-85 hover:opacity-100 transition-opacity duration-200"
                  />
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}