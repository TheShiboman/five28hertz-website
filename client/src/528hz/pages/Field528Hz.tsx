const inquiries = [
  { title: "The Road to Happiness", href: "/road-to-happiness" },
  { title: "Echoes of Elysium", href: "/echoes-of-elysium" },
];

export default function Field528Hz() {
  return <section className="mx-auto max-w-4xl px-6 pb-28 pt-20 md:px-10"><p className="text-xs uppercase tracking-[0.28em] text-[#7faaa2]">Field</p><h1 className="mt-8 font-serif text-4xl md:text-6xl">Inquiries, not episodes.</h1><div className="mt-16 space-y-8">{inquiries.map((item) => <a key={item.href} href={item.href} className="block border-t border-white/10 pt-7 text-2xl font-serif transition-opacity hover:opacity-60">{item.title}<span className="ml-3 text-sm text-[#7faaa2]">→</span></a>)}</div></section>;
}
