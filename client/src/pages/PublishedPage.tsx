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
  return <main className="published-page relative min-h-screen pt-36 pb-28">
    <div className="absolute left-0 top-0 h-1 w-full field-spectrum" aria-hidden="true" />
    <div className="mx-auto max-w-5xl px-6 md:px-12">
      <a className="field-back text-xs uppercase tracking-widest" href={base}>← Return to the parent orientation</a>
      <div className="mt-12 flex items-center gap-4"><span className="field-orbit-mark" aria-hidden="true" /><span className="text-xs uppercase tracking-[0.25em] text-[#35616B]">From the existing five28hertz field</span></div>
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
