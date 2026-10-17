import pages from "@/data/live-pages.json";
import { useEffect } from "react";

const entries = [
  { path: "/vision", label: "Vision" },
  { path: "/legacy", label: "The Instruments" },
  { path: "/field", label: "The Field" },
  { path: "/interior/translation-premise", label: "The Translation Premise" },
  { path: "/interior/anti-fragmentation", label: "The Anti-Fragmentation Thesis" },
  { path: "/interior/cyclical-journey", label: "The Cyclical Journey" },
];

export default function PublishedPage({ path }: { path: string }) {
  useEffect(() => { document.title = "five28hertz — " + (entries.find(x => x.path === path)?.label || "Published writings"); window.scrollTo(0,0); }, [path]);
  const content = (pages as Record<string,string>)[path];
  const base = import.meta.env.BASE_URL;
  if (!content) return <main className="mx-auto max-w-4xl px-6 pt-40 pb-28"><h1>Page not found</h1><a href={base}>Return to orientation</a></main>;
  return <main className="published-page relative min-h-screen pb-28">
    <section className="field-page-hero relative overflow-hidden px-6 pb-12 pt-36 md:px-12 md:pb-16 md:pt-40">
      <div className="field-page-hero__ring" aria-hidden="true" />
      <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
        <div className="relative z-10 max-w-2xl">
          <a className="text-xs uppercase tracking-[0.22em] text-[#C7E9E2] underline underline-offset-8" href={base}>← five28hertz / the Core</a>
          <p className="mt-12 text-xs uppercase tracking-[0.32em] text-[#E9BC86]">An expression of the parent field</p>
          <h1 className="mt-5 font-playfair text-[clamp(2.7rem,5vw,5.5rem)] leading-tight text-[#FFF8E9]">{entries.find(x=>x.path===path)?.label}</h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-[#CDE5DF]">A distinct perspective, held within one evolving architecture.</p>
        </div>
        <img src={base + "assets/five28hertz-spiral-cutout.png"} alt="" className="field-page-hero__core relative z-10 mx-auto h-auto w-56 shrink-0 md:mx-0 md:w-72" />
      </div>
    </section>
    <div className="h-2 w-full field-spectrum" aria-hidden="true" />
    <div className="published-page__aura" aria-hidden="true" />
    <div className="mx-auto max-w-5xl px-6 pt-16 md:px-12">
      <a className="field-back text-xs uppercase tracking-widest" href={base}>← Return to the parent orientation</a>
      <div className="relative mt-12 flex items-center gap-4"><span className="field-orbit-mark" aria-hidden="true" /><span className="text-xs uppercase tracking-[0.25em] text-[#35616B]">From the existing five28hertz field</span></div>
      <article className="field-prose mt-12" dangerouslySetInnerHTML={{__html:content.replace(/href="\/(.*?)"/g, (_match, route:string) => `href="${base}${route}"`)}} />
      <nav aria-label="Explore preserved writings" className="mt-24 border-t border-[#234C56]/20 pt-10">
        <h2 className="text-2xl">Continue through the field</h2>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {entries.filter(x=>x.path!==path).map(x=><a className="field-essay-link" href={base + x.path.slice(1) + "/"} key={x.path}>{x.label}<span aria-hidden="true"> ↗</span></a>)}
        </div>
      </nav>
    </div>
  </main>;
}
