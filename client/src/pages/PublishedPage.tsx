import { useMemo } from "react";
import pages from "@/data/live-pages.json";
import { useEffect } from "react";

const entries = [
  { path: "/vision", label: "Vision" },
  
  { path: "/field", label: "The Field" },
  { path: "/interior/translation-premise", label: "The Translation Premise" },
  { path: "/interior/anti-fragmentation", label: "The Anti-Fragmentation Thesis" },
  { path: "/interior/cyclical-journey", label: "The Cyclical Journey" },
];

export default function PublishedPage({ path }: { path: string }) {
  useEffect(() => { document.title = "five28hertz — " + (entries.find(x => x.path === path)?.label || "Published writings"); window.scrollTo(0,0); }, [path]);
  const content = (pages as Record<string,string>)[path];
  const base = import.meta.env.BASE_URL;
  const isVision = path === "/vision";
  const visionContent = useMemo(() => {
    if (!isVision || !content) return "";
    // Preserve original Vision prose; compose its existing six titled sections.
    const sections = content.split(/(?=<h2\b)/i);
    const intro = sections.shift() || "";
    const ending = sections.length ? sections[sections.length - 1] : "";
    const lastHeading = ending.indexOf("Continue<p>");
    if (lastHeading >= 0) sections[sections.length - 1] = ending.slice(0, lastHeading);
    return '<div class="vision-story__opening">' + intro.replace(/<\/p>\s*·\s*(?=<)/g, '</p>') + '</div>' +
      sections.map((section, i) => '<section class="vision-story__chapter vision-story__chapter--' + (i % 3) + '">' +
        '<div class="vision-story__chapter-number" aria-hidden="true">' + String(i + 1).padStart(2, "0") + '</div>' +
        '<div class="vision-story__chapter-body">' + section.replace(/<\/p>\s*·\s*(?=<)/g, '</p>') + '</div></section>').join("");
  }, [content, isVision]);
  const fieldContent = useMemo(() => {
    if (path !== "/field" || !content) return content;
    const normalized = content.replace(/produced<br\s*\/?>(?:<\/br>)?recognition/g, "produced recognition");
    const start = content.indexOf('Address<a href="mailto:')
    const end = content.indexOf('<p>What this is</p>', start)
    const address = content.slice(start,end).replace('Address<a ', 'Address <a ')
    const archiveStart = content.indexOf('Interior Archive', end)
    const archiveIntro = content.slice(archiveStart + 'Interior Archive'.length, content.indexOf('<a href="/interior/', archiveStart))
    const essayLinks = Array.from(content.slice(archiveStart).matchAll(/<a href="(\/interior\/[^"]+)">(\d\d)(.*?)Essay [^<]*<\/a>/g))
    if (essayLinks.length !== 3) throw new Error("Field archive source no longer matches expected three essays");
    const cards = essayLinks.map((m) => `<a class="field-archive__card" href="${m[1]}"><span class="field-archive__number">${m[2]}</span><span class="field-archive__title">${m[3]}</span><span class="field-archive__footer">Essay · Threshold <span aria-hidden="true">↗</span></span></a>`).join("");
    return content.slice(0,start).replace(/produced<br><\/br>recognition/g, "produced recognition") +
      `<section class="field-correspondence"><h2>Correspondence</h2><p class="field-correspondence__address">${address}</p></section>` +
      '<section class="field-correspondence__about"><h2>What this is</h2>' +
      content.slice(end + '<p>What this is</p>'.length, archiveStart) + '</section>' +
      `<section class="field-archive" aria-labelledby="field-archive-heading"><h2 id="field-archive-heading">Interior Archive</h2>${archiveIntro}<div class="field-archive__grid">${cards}</div></section>`;
  }, [content, path]);
  if (!content) return <main className="mx-auto max-w-4xl px-6 pt-40 pb-28"><h1>Page not found</h1><a href={base}>Return to orientation</a></main>;
  return <main className={"published-page relative min-h-screen pb-28" + (isVision ? " vision-editorial" : path === "/field" ? " field-editorial" : "")}>
    <section className={isVision ? "vision-editorial__hero relative overflow-hidden px-6 pb-12 pt-36 md:px-12 md:pb-16 md:pt-40" : "field-page-hero relative overflow-hidden px-6 pb-12 pt-36 md:px-12 md:pb-16 md:pt-40"}>
      {!isVision && <div className="field-page-hero__ring" aria-hidden="true" />}
      <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
        <div className="relative z-10 max-w-2xl">
          <a className="text-xs uppercase tracking-[0.22em] text-[#C7E9E2] underline underline-offset-8" href={base}>← five28hertz / the Core</a>
          <p className="mt-12 text-xs uppercase tracking-[0.32em] text-[#E9BC86]">An expression of the parent field</p>
          <h1 className="mt-5 font-playfair text-[clamp(2.7rem,5vw,5.5rem)] leading-tight text-[#FFF8E9]">{entries.find(x=>x.path===path)?.label}</h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-[#CDE5DF]">A distinct perspective, held within one evolving architecture.</p>
        </div>
        <div className={isVision ? "vision-editorial__core relative z-10 mx-auto shrink-0" : "field-page-hero__core relative z-10 mx-auto w-56 shrink-0 md:mx-0 md:w-72"}>{<img src={base + (isVision ? "assets/original-five28hertz-logo.svg?vision-core=corporate-v2" : "assets/original-five28hertz-logo.svg?corporate-core=approved-v1")} alt="five28hertz corporate Core" className="block w-full h-auto" />}</div>
      </div>
    </section>
    <div className="h-2 w-full field-spectrum" aria-hidden="true" />
    <div className="published-page__aura" aria-hidden="true" />
    <div className={isVision ? "vision-editorial__reading mx-auto max-w-5xl px-6 pt-16 md:px-12" : "mx-auto max-w-5xl px-6 pt-16 md:px-12"}>
      <a className="field-back text-xs uppercase tracking-widest" href={base}>← Return to the parent orientation</a>
      <div className="relative mt-12 flex items-center gap-4"><span className="field-orbit-mark" aria-hidden="true" /><span className="text-xs uppercase tracking-[0.25em] text-[#35616B]">From the existing five28hertz field</span></div>
      <article className="field-prose mt-12" dangerouslySetInnerHTML={{__html:(isVision ? visionContent : fieldContent).replace(/href="\/(.*?)"/g, (_match, route:string) => `href="${base}${route}"`)}} />
      {path === "/field" ? (
        <nav aria-label="Return to the parent pages" className="site-continuation">
          <h2>Return to the Core</h2>
          <div className="site-continuation__links"><a href={base + "vision/"}>Vision ↗</a></div>
        </nav>
      ) : (
        <nav aria-label="Continue exploring the parent" className="site-continuation">
          <h2>Continue exploring</h2>
          <div className="site-continuation__links">
            {entries.filter(x => ["/vision", "/field"].includes(x.path) && x.path !== path).map(x => (
              <a href={base + x.path.slice(1) + "/"} key={x.path}>{x.label} <span aria-hidden="true">↗</span></a>
            ))}
          </div>
        </nav>
      )}
    </div>
  </main>;
}
