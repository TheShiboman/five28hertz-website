import { Switch, Route, Link } from "wouter";
import { motion } from "framer-motion";
import Home528Hz from "./pages/Home528Hz";
import Field528Hz from "./pages/Field528Hz";
import Philosophy528Hz from "./pages/Philosophy528Hz";
import Voices528Hz from "./pages/Voices528Hz";
import About528Hz from "./pages/About528Hz";

const links = [
  ["/", "528Hz"],
  ["/field", "Field"],
  ["/philosophy", "Philosophy"],
  ["/voices", "Voices"],
  ["/about", "About"],
] as const;

export default function App528Hz() {
  return (
    <div className="min-h-screen bg-[#0d1110] text-[#e9eee9] selection:bg-[#34A399]/30">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8 md:px-10">
        <Link href="/" className="font-serif text-xl tracking-[0.18em]">528Hz</Link>
        <nav className="hidden gap-7 text-xs tracking-[0.16em] text-[#aeb8b2] md:flex">
          {links.map(([href, label]) => <Link key={href} href={href} className="transition-opacity hover:opacity-60">{label}</Link>)}
        </nav>
      </header>
      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        <Switch>
          <Route path="/" component={Home528Hz} />
          <Route path="/field" component={Field528Hz} />
          <Route path="/philosophy" component={Philosophy528Hz} />
          <Route path="/voices" component={Voices528Hz} />
          <Route path="/about" component={About528Hz} />
          <Route component={Home528Hz} />
        </Switch>
      </motion.main>
      <footer className="mx-auto max-w-6xl px-6 py-20 md:px-10">
        <div className="border-t border-white/10 pt-8 text-xs tracking-[0.12em] text-[#7f8983]">
          five28hertz · a voice station
        </div>
      </footer>
    </div>
  );
}
