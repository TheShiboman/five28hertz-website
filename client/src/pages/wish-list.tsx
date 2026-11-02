import { motion } from "framer-motion";
import { ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const ARTIFACT_URL = "https://claude.ai/artifact/7aeDP3iQHCfeUYcqaFqSjJ";

const WishList = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[#0E0B10] flex flex-col"
    >
      {/* Header */}
      <div className="pt-28 pb-6 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-[#C9923A]" />
          <span className="text-xs font-medium tracking-widest uppercase text-[#C9923A]">
            My World
          </span>
          <Sparkles className="h-5 w-5 text-[#C9923A]" />
        </div>
        <h1 className="text-3xl md:text-4xl font-light text-white mb-3 tracking-wide">
          My Abundance Wish List
        </h1>
        <p className="text-white/50 text-sm max-w-md mx-auto">
          Every piece of hardware, software & space upgrade — mapped from today to full-glory vision.
        </p>
        <Button
          className="mt-5 bg-[#C9923A]/20 hover:bg-[#C9923A]/30 text-[#C9923A] border border-[#C9923A]/30 hover:border-[#C9923A]/60 transition-all duration-300 gap-2"
          size="sm"
          onClick={() => window.open(ARTIFACT_URL, "_blank", "noopener,noreferrer")}
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open Full Screen
        </Button>
      </div>

      {/* Embedded Artifact */}
      <div className="flex-1 px-4 pb-8">
        <div className="max-w-6xl mx-auto h-[75vh] rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60">
          <iframe
            src={ARTIFACT_URL}
            title="My Abundance Wish List"
            className="w-full h-full border-0"
            allow="clipboard-write"
            loading="lazy"
          />
        </div>
        <p className="text-center text-white/25 text-xs mt-4">
          Wish list lives at{" "}
          <a
            href={ARTIFACT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-white/50 transition-colors"
          >
            claude.ai/artifact/7aeDP3iQHCfeUYcqaFqSjJ
          </a>
        </p>
      </div>
    </motion.div>
  );
};

export default WishList;
