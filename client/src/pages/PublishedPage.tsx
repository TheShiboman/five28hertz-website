import { useMemo } from "react";
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
  const isVision = path === "/vision";
  const visionContent = useMemo(() => {
    if (!isVision || !content) return "";
    const parser = /(<p\b[^>]*>[\s\S]*?<\/p>)/gi;
    let n = 0;
    return content.replace(/<\/p>\s*·\s*(?=<(?:h2|p)\b)/g, '</p><hr class="vision-editorial__separator" aria-hidden="true" />').replace(parser, (paragraph: string) => {
      const current = n++;
      const label = current === 0 ? "Opening premise" : current === 1 ? "The context" : current === 4 ? "The purpose" : current === 7 ? "The horizon" : "";
      return label ? `<div class="vision-editorial__passage"><span class="vision-editorial__label">${label}</span>${paragraph}</div>` : paragraph;
    });
  }, [content, isVision]);

  const fieldContent = useMemo(() => {
    if (path !== "/field" || !content) return content;
    const start = content.indexOf('Address<a href="mailto:')
    const end = content.indexOf('<p>What this is</p>', start)
    const address = content.slice(start,end).replace('Address<a ', 'Address <a ')
    const archiveStart = content.indexOf('Interior Archive', end)
    const archiveIntro = content.slice(archiveStart + 'Interior Archive'.length, content.indexOf('<a href="/interior/', archiveStart))
    const essayLinks = Array.from(content.slice(archiveStart).matchAll(/<a href="(\/interior\/[^"]+)">(\d\d)(.*?)Essay [^<]*<\/a>/g))
    if (essayLinks.length !== 3) throw new Error("Field archive source no longer matches expected three essays");
    const cards = essayLinks.map((m) => `<a class="field-archive__card" href="${m[1]}"><span class="field-archive__number">${m[2]}</span><span class="field-archive__title">${m[3]}</span><span class="field-archive__footer">Essay · Threshold <span aria-hidden="true">↗</span></span></a>`).join("");
    return content.slice(0,start) +
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
      {path === "/interior/translation-premise" ? (
        <nav aria-label="Continue exploring the five28hertz field" className="translation-journey mt-24 border-t border-[#234C56]/20 pt-10">
          <span className="translation-journey__eyebrow">Where the thought leads</span>
          <h2>Continue the exploration</h2>
          <p className="translation-journey__intro">The premise is a beginning, not a conclusion. Follow the question that stays with you.</p>
          <div className="translation-journey__grid">
            <a className="translation-journey__card translation-journey__card--primary" href={base + "interior/anti-fragmentation/"}>
              <span className="translation-journey__index">01 · The next essay</span>
              <strong>The Anti-Fragmentation Thesis</strong>
              <span className="translation-journey__description">What happens when the structures meant to hold our lives pull them apart?</span>
              <span className="translation-journey__action">Explore the thesis <span aria-hidden="true">↗</span></span>
            </a>
            <a className="translation-journey__card" href={base + "interior/cyclical-journey/"}>
              <span className="translation-journey__index">02 · Another perspective</span>
              <strong>The Cyclical Journey</strong>
              <span className="translation-journey__description">What changes when a journey is understood as an unfolding cycle?</span>
              <span className="translation-journey__action">Follow the journey <span aria-hidden="true">↗</span></span>
            </a>
            <a className="translation-journey__card" href={base + "field/"}>
              <span className="translation-journey__index">03 · From reading to contact</span>
              <strong>The Field</strong>
              <span className="translation-journey__description">If something here resonated, discover the space for genuine correspondence.</span>
              <span className="translation-journey__action">Enter the Field <span aria-hidden="true">↗</span></span>
            </a>
          </div>
          <div className="translation-journey__return"><span>Or return to the foundations</span><a href={base + "vision/"}>Vision ↗</a><a href={base + "legacy/"}>The Instruments ↗</a></div>
        </nav>
      ) : path === "/interior/anti-fragmentation" ? (
        <nav aria-label="Continue exploring the anti-fragmentation thesis" className="translation-journey mt-24 border-t border-[#234C56]/20 pt-10">
          <span className="translation-journey__eyebrow">Beyond fragmentation</span>
          <h2>Where does coherence lead?</h2>
          <p className="translation-journey__intro">The thesis names the fracture. Continue with another perspective, return to the premise, or open a conversation.</p>
          <div className="translation-journey__grid">
            <a className="translation-journey__card translation-journey__card--primary" href={base + "interior/cyclical-journey/"}>
              <span className="translation-journey__index">01 · Continue the archive</span>
              <strong>The Cyclical Journey</strong>
              <span className="translation-journey__description">What might become possible when development is understood as a continuing cycle?</span>
              <span className="translation-journey__action">Follow the journey <span aria-hidden="true">↗</span></span>
            </a>
            <a className="translation-journey__card" href={base + "interior/translation-premise/"}>
              <span className="translation-journey__index">02 · Return to the beginning</span>
              <strong>The Translation Premise</strong>
              <span className="translation-journey__description">Revisit the relationship between inner meaning and the structures that carry it.</span>
              <span className="translation-journey__action">Revisit the premise <span aria-hidden="true">↗</span></span>
            </a>
            <a className="translation-journey__card" href={base + "field/"}>
              <span className="translation-journey__index">03 · From recognition to contact</span>
              <strong>The Field</strong>
              <span className="translation-journey__description">If the argument touched something real, discover the space for correspondence.</span>
              <span className="translation-journey__action">Reach the Field <span aria-hidden="true">↗</span></span>
            </a>
          </div>
          <div className="translation-journey__return"><span>Or return to the foundations</span><a href={base + "vision/"}>Vision ↗</a><a href={base + "legacy/"}>The Instruments ↗</a></div>
        </nav>
      ) : (
        <nav aria-label="Continue exploring the five28hertz field" className="translation-journey mt-24 border-t border-[#234C56]/20 pt-10">
          <span className="translation-journey__eyebrow">Continue the exploration</span>
          <h2>Where might the journey lead?</h2>
          <p className="translation-journey__intro">Follow a connected thought, explore another perspective, or return to the foundations.</p>
          <div className="translation-journey__grid">
            {entries.filter(x => x.path !== path && !["/vision", "/legacy"].includes(x.path)).slice(0, 3).map((x, i) => (
              <a key={x.path} className={"translation-journey__card" + (i === 0 ? " translation-journey__card--primary" : "")} href={base + x.path.slice(1) + "/"}>
                <span className="translation-journey__index">{String(i + 1).padStart(2, "0")} · {i === 0 ? "Continue reading" : "Another perspective"}</span>
                <strong>{x.label}</strong>
                <span className="translation-journey__description">{({
                  "/field": "From reflection to correspondence: enter the space for genuine contact.",
                  "/interior/translation-premise": "Explore the relationship between inner meaning and the structures that carry it.",
                  "/interior/anti-fragmentation": "Consider what happens when the structures meant to hold our lives pull them apart.",
                  "/interior/cyclical-journey": "Discover what changes when a journey is understood as an unfolding cycle."
                } as Record<string, string>)[x.path]}</span>
                <span className="translation-journey__action">Explore this perspective <span aria-hidden="true">↗</span></span>
              </a>
            ))}
          </div>
          <div className="translation-journey__return"><span>Or return to the foundations</span>{entries.filter(x => ["/vision", "/legacy"].includes(x.path) && x.path !== path).map(x => <a key={x.path} href={base + x.path.slice(1) + "/"}>{x.label} ↗</a>)}</div>
        </nav>
      )}
    </div>
  </main>;
}
