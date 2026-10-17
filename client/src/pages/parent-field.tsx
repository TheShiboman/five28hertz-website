import { motion } from "framer-motion";

const expressions = [
  {
    name: "QXT World",
    state: "PRODUCTION CORE · PILOT VALIDATION",
    body: "A connective operating layer for cue sports — bringing players, competition, venues, organizers and the wider ecosystem into one trusted experience.",
    proof: "Its certified match-persistence foundation and production capabilities are established; full organizer and real-event experience validation remains ahead.",
    href: "https://qxtworld.com",
  },
  {
    name: "528Hz Studio",
    state: "THE VOICE · HORIZON 1",
    body: "The creative and philosophical expression of five28hertz — a listening room for work that holds space for depth and gives it a voice.",
    proof: "Beginning with the Founder's own bodies of work; designed to evolve from voice, to studio, to creative network.",
    href: "https://528hz.studio",
  },
  {
    name: "Argento Homes",
    state: "FORMING",
    body: "A hospitality expression built around a simple standard: a place should feel like home before it merely functions like property.",
    proof: "Its first property-readiness framework has taken technical form. Real-property delivery, guest experience and certification remain to be demonstrated.",
  },
];

const evidence = [
  {
    label: "QXT World",
    title: "A certified operating foundation, with real-world validation still ahead.",
    body: "QXT World has progressed from its first certified competitive-match milestone to a functioning production platform with structured competition state and historical-evidence capabilities. These achievements establish technical capability. Demonstrating the complete experience for organizers, players, officials and witnesses remains a separate validation frontier.",
  },
  {
    label: "528Hz Studio",
    title: "From content idea to governed creative expression.",
    body: "528Hz Studio now has a sovereign purpose, voice and creative architecture of its own — with the Founder's work serving as the first place that architecture is tested.",
  },
  {
    label: "DreamWeaver OS",
    title: "From accumulated thought to coordinated action.",
    body: "DreamWeaver OS now carries context, decisions and execution across the five28hertz architecture so that what has already been learned does not have to be rediscovered before the next action can begin.",
  },
];

const reveal = {
  initial: false,
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6 },
};

const ParentField = () => {
  return (
    <div className="bg-[#FCFAF6] text-[#17201D] selection:bg-[#D9C89E]/60">
      <section id="orientation" className="relative isolate min-h-screen flex items-center overflow-hidden px-6 py-28 md:px-12">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-24 h-[30rem] w-[30rem] rounded-full border border-[#B9AC91]/20 bg-[radial-gradient(circle,rgba(216,204,178,0.17)_0%,rgba(252,250,246,0)_70%)] blur-2xl motion-safe:animate-[fieldBreath_24s_ease-in-out_infinite] md:h-[42rem] md:w-[42rem]" />
        <motion.div {...reveal} className="relative mx-auto w-full max-w-6xl">
          <p className="mb-8 text-xs uppercase tracking-[0.35em] text-[#414943]">five28hertz</p>
          <h1 className="max-w-5xl font-playfair text-5xl font-medium leading-[1.04] md:text-7xl lg:text-8xl">
            Ideas become real when they are given a form true enough to live.
          </h1>
          <p className="mt-10 max-w-3xl text-lg leading-8 text-[#46504A] md:text-xl">
            five28hertz is a living architecture for turning thoughts, dreams and aspirations into independent expressions — each allowed to find its own form, meet reality, and evolve through what it proves.
          </p>
          <p className="mt-16 text-sm tracking-[0.18em] text-[#414943]">Different expressions. One coherent source.</p>
        </motion.div>
      </section>

      <section id="existing" className="border-t border-black/10 bg-[#F4F0E8] px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="mb-5 text-xs uppercase tracking-[0.3em] text-[#414943]">The existing five28hertz experience</p>
          <h2 className="max-w-4xl font-playfair text-4xl md:text-6xl">The work already here remains.</h2>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-[#46504A]">This new orientation adds a way into five28hertz. It does not supersede the existing Vision, Instruments, Field or Interior Archive. Those writings and pathways retain their own place and identity.</p>
          <div className="mt-12 grid gap-px bg-black/10 md:grid-cols-2">
            {[
              {name:"Vision",description:"The existing full statement of purpose, vision, structure, unfinishedness, invitation and stewardship.",href:"/vision"},
              {name:"The Instruments",description:"The existing expression portraits, retained as their own published text rather than rewritten into the new overview.",href:"/legacy"},
              {name:"The Field",description:"The original threshold for correspondence, with its own invitation and address.",href:"/field"},
              {name:"Interior Archive",description:"The Translation Premise, The Anti-Fragmentation Thesis and The Cyclical Journey.",href:"/interior/translation-premise"},
            ].map(item => (
              <a key={item.name} href={item.href.startsWith("/") ? import.meta.env.BASE_URL + item.href.slice(1) : item.href} className="block bg-[#F4F0E8] p-7 transition-colors hover:bg-[#ECE5D9] focus-visible:outline-2 focus-visible:outline-offset-2">
                <h3 className="font-playfair text-2xl">{item.name} <span aria-hidden="true">↗</span></h3>
                <p className="mt-4 leading-7 text-[#414943]">{item.description}</p>
                <span className="mt-5 block text-xs uppercase tracking-[0.18em] text-[#554724]">Explore integrated page</span>
              </a>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-sm leading-6 text-[#46504A]">These preserved writings now appear within the shared review design. Their final fidelity remains subject to Founder acceptance.</p>
        </div>
      </section>

      <section id="architecture" className="border-t border-black/10 px-6 py-28 md:px-12 md:py-36">
        <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1.3fr_0.7fr]">
          <motion.div {...reveal}>
            <p className="mb-5 text-xs uppercase tracking-[0.3em] text-[#414943]">Living Architecture</p>
            <h2 className="font-playfair text-4xl md:text-6xl">A living architecture</h2>
            <div className="mt-10 max-w-3xl space-y-7 text-lg leading-8 text-[#46504A]">
              <p>five28hertz begins with a simple conviction: what is deeply true should be given the chance to become real.</p>
              <p>An idea is held long enough to become coherent. Coherence becomes form. Form becomes an independent expression. Reality then decides what that expression earns the right to become next.</p>
              <p className="text-[#17201D]">The parent holds the source and the frame. Each expression develops its own purpose, experience and path into the world.</p>
            </div>
          </motion.div>

          <motion.aside {...reveal} className="self-end border-l border-black/15 pl-7 lg:pl-9">
            <p className="text-xs uppercase tracking-[0.3em] text-[#414943]">Operating architecture</p>
            <h3 className="mt-5 font-playfair text-3xl">DreamWeaver OS</h3>
            <p className="mt-6 leading-7 text-[#46504A]">
              DreamWeaver OS is the operating architecture behind five28hertz. It preserves accumulated thought and context, keeps decisions connected to purpose, and helps ideas move from intention into coordinated, verifiable execution.
            </p>
          </motion.aside>
        </div>
      </section>

      <section id="expressions" className="border-t border-black/10 px-6 py-28 md:px-12 md:py-36">
        <div className="mx-auto max-w-6xl">
          <motion.div {...reveal} className="max-w-3xl">
            <p className="mb-5 text-xs uppercase tracking-[0.3em] text-[#414943]">Expressions</p>
            <h2 className="font-playfair text-4xl md:text-6xl">Expressions</h2>
            <p className="mt-7 text-lg leading-8 text-[#46504A]">Each expression begins from the same source, then becomes responsible for its own truth.</p>
          </motion.div>

          <div className="mt-20 divide-y divide-black/10 border-y border-black/10">
            {expressions.map((expression, index) => {
              const Wrapper = expression.href ? "a" : "div";
              const props = expression.href
                ? { href: expression.href, target: "_blank", rel: "noreferrer" }
                : {};

              return (
                <motion.div key={expression.name} {...reveal}>
                  <Wrapper {...props} className="grid gap-6 py-10 transition-opacity hover:opacity-70 md:grid-cols-[0.75fr_1.25fr] md:py-14">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-[#554724]">{expression.state}</p>
                      <h3 className="mt-4 font-playfair text-3xl md:text-4xl">{expression.name}</h3>
                    </div>
                    <div className="max-w-2xl">
                      <p className="text-lg leading-8">{expression.body}</p>
                      <p className="mt-5 leading-7 text-[#414943]">{expression.proof}</p>
                    </div>
                  </Wrapper>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="evidence" className="border-t border-black/10 bg-[#F4F0E8] px-6 py-28 md:px-12 md:py-36">
        <div className="mx-auto max-w-6xl">
          <motion.div {...reveal} className="max-w-4xl">
            <p className="mb-5 text-xs uppercase tracking-[0.3em] text-[#414943]">Evidence</p>
            <h2 className="font-playfair text-4xl md:text-6xl">What has become real</h2>
            <p className="mt-7 text-xl leading-8 text-[#46504A]">The architecture is not proved by how much it describes. It is proved by what can stand.</p>
          </motion.div>

          <div className="mt-20 grid gap-px bg-black/10 md:grid-cols-3">
            {evidence.map((item) => (
              <motion.article key={item.label} {...reveal} className="bg-[#F4F0E8] p-8 md:p-10">
                <p className="text-xs uppercase tracking-[0.28em] text-[#554724]">{item.label}</p>
                <h3 className="mt-6 font-playfair text-2xl leading-tight md:text-3xl">{item.title}</h3>
                <p className="mt-7 leading-7 text-[#414943]">{item.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="lineage" className="border-t border-black/10 px-6 py-28 md:px-12 md:py-36">
        <motion.div {...reveal} className="mx-auto max-w-5xl">
          <p className="mb-5 text-xs uppercase tracking-[0.3em] text-[#414943]">Lineage</p>
          <h2 className="max-w-4xl font-playfair text-4xl md:text-6xl">Before five28hertz, there was ProAct World.</h2>
          <div className="mt-10 max-w-3xl space-y-7 text-lg leading-8 text-[#46504A]">
            <p>For two decades, ProAct World was the Founder's arena for turning strategy into lived experience — across direct marketing, consumer engagement, business intelligence and large-scale execution.</p>
            <p>That history is not a separate promise about the future. It is part of the experience from which five28hertz learned how ideas meet people, systems and reality.</p>
            <p className="text-[#17201D]">The name changed. The instinct to turn thought into something people can actually experience did not.</p>
          </div>
        </motion.div>
      </section>

      <section id="contact" className="border-t border-black/10 px-6 py-32 md:px-12 md:py-40">
        <motion.div {...reveal} className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-xl font-playfair text-3xl leading-tight md:text-5xl">When something here resonates, the address is enough.</p>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.28em] text-[#414943]">Quiet contact</p>
            <a className="mt-4 inline-block text-2xl tracking-tight underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 md:text-3xl" href="mailto:field@five28hertz.com">field@five28hertz.com</a>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default ParentField;
