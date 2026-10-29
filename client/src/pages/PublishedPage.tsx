import { useMemo } from "react";
import pages from "@/data/live-pages.json";
import { useEffect } from "react";

const entries = [
  { path: "/vision", label: "Purpose" },
  
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
    const cleanVision = content.replace(/<\/p>\s*[^<\w\s]\s*(?=<h2\b)/gi, "</p>").replace(/<br><\/br>/g, "</p><p>");
    const sections = cleanVision.slice(cleanVision.search(/<h2\b/i)).split(/(?=<h2\b)/i);
    const intro = "";
    const ending = sections.length ? sections[sections.length - 1] : "";
    const lastHeading = ending.indexOf("Continue<p>");
    if (lastHeading >= 0) sections[sections.length - 1] = ending.slice(0, lastHeading);
    return '<div class="vision-story__opening">' + intro.replace(/<\/p>\s*·\s*(?=<)/g, '</p>') + '</div>' +
      sections.map((section, i) => '<section id="purpose-chapter-' + (i + 1) + '" class="vision-story__chapter vision-story__chapter--' + (i % 3) + '">' +
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
  if (path === "/field") {
    // Composition changes only. All public-facing source prose is drawn from live-pages.json.
    const heading = content.match(/<h1>([\s\S]*?)<\/h1>/)?.[1].replace(/<br\s*\/?>(?:<\/br>)?/gi, " ");
    const firstParagraphs = Array.from(content.slice(0, content.indexOf("Address<a")).matchAll(/<p>([\s\S]*?)<\/p>/g));
    const intro = firstParagraphs.slice(1).map(x => x[1]);
    const aboutStart = content.indexOf("<p>What this is</p>");
    const archiveStart = content.indexOf("Interior Archive", aboutStart);
    const about = content.slice(aboutStart + "<p>What this is</p>".length, archiveStart);
    const archiveHtml = content.slice(archiveStart + "Interior Archive".length);
    const archiveIntro = archiveHtml.slice(0, archiveHtml.indexOf('<a href="/interior/'));
    const chapters = Array.from(archiveHtml.matchAll(/<a href="(\/interior\/[^"]+)">(\d\d)(.*?)Essay [^<]*<\/a>/g));
    if (!heading || intro.length !== 2 || chapters.length !== 3 || !about.includes("<ul>")) throw new Error("Field source shape changed: stop and reconcile before rendering");
    return <main className="field-experience">
      <section className="field-experience__arrival" aria-labelledby="field-arrival-title">
        <div className="field-experience__atmosphere" aria-hidden="true"><i/><i/><i/></div>
        <div className="field-experience__arrival-inner">
          <p className="field-experience__eyebrow">FIVE28HERTZ / THE FIELD</p>
          <div className="field-experience__arrival-copy">
            <h1 id="field-arrival-title" dangerouslySetInnerHTML={{__html:heading}} />
            <div className="field-experience__opening" dangerouslySetInnerHTML={{__html:intro[1]}} />
          </div>
          <div className="field-experience__arrival-bottom">
            <a href="#field-read" className="field-experience__descend">Enter the writings <span aria-hidden="true">↓</span></a>
          </div>
        </div>
      </section>
      <section className="field-experience__writings" id="field-read" aria-labelledby="field-writings-title">
        <div className="field-experience__writings-heading">
          <p className="field-experience__eyebrow">THREE FOUNDATIONAL ESSAYS</p>
          <h2 id="field-writings-title">Interior Archive</h2>
          <div className="field-experience__archive-intro" dangerouslySetInnerHTML={{__html:archiveIntro}} />
        </div>
        <div className="field-experience__chapters">
          {chapters.map((chapter,i) => <a key={chapter[1]} className={"field-experience__chapter field-experience__chapter--"+(i+1)} href={base+chapter[1].slice(1)+"/"}>
            <span className="field-experience__chapter-index">{chapter[2]} / 03</span>
            <span className="field-experience__chapter-name">{chapter[3]}</span>
            <span className="field-experience__chapter-action">Enter this essay <span aria-hidden="true">↗</span></span>
          </a>)}
        </div>
      </section>
      <section className="field-experience__exchange" aria-labelledby="field-exchange-title">
        <div className="field-experience__exchange-inner">
          <div className="field-experience__exchange-heading">
            <p className="field-experience__eyebrow">AN OPEN POSSIBILITY</p>
            <h2 id="field-exchange-title">Correspondence</h2>
            
          </div>
          <div className="field-experience__exchange-prose">
            <p className="field-experience__exchange-explainer" dangerouslySetInnerHTML={{__html:intro[0]}} />
            <h3>What this is</h3>
            <div dangerouslySetInnerHTML={{__html:about}} />
            <a className="field-experience__address" href="mailto:field@five28hertz.com">field@five28hertz.com <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>
      <nav className="field-experience__continuation" aria-label="Continue exploring five28hertz"><a href={base+"vision/"}>Explore Purpose <span aria-hidden="true">↗</span></a></nav>
    </main>;
  }
  if (!content) return <main className="mx-auto max-w-4xl px-6 pt-40 pb-28"><h1>Page not found</h1><a href={base}>Return to orientation</a></main>;
  return <main className={"published-page relative min-h-screen pb-28" + (isVision ? " vision-editorial" : path === "/field" ? " field-editorial" : "")}>
    <section className={isVision ? "vision-editorial__hero relative overflow-hidden px-6 pb-12 pt-36 md:px-12 md:pb-16 md:pt-40" : "field-page-hero relative overflow-hidden px-6 pb-12 pt-36 md:px-12 md:pb-16 md:pt-40"}>
      {!isVision && <div className="field-page-hero__ring" aria-hidden="true" />}
      <div className={isVision ? "vision-hero__composition relative mx-auto flex max-w-6xl flex-col items-start gap-8 md:flex-row md:items-center md:justify-between" : "relative mx-auto flex max-w-6xl flex-col items-start gap-8 md:flex-row md:items-center md:justify-between"}>
        {isVision && <div className={isVision ? "vision-editorial__core relative z-10 mx-auto shrink-0" : "field-page-hero__core relative z-10 mx-auto w-56 shrink-0 md:mx-0 md:w-72"}>{<img src={base + (isVision ? "assets/original-five28hertz-logo.svg?vision-core=corporate-v2" : "assets/original-five28hertz-logo.svg?corporate-core=approved-v1")} alt="five28hertz corporate Core" className="block w-full h-auto" />}</div>}
        <div className="relative z-10 max-w-2xl">
          {!isVision && <h1 className="mt-5 font-playfair text-[clamp(2.7rem,5vw,5.5rem)] leading-tight text-[#FFF8E9]">{entries.find(x=>x.path===path)?.label}</h1>}
          {isVision ? <div className="purpose-opening text-[#D6EAE5]">
            <p>five28hertz exists because not everything meaningful can be rushed, optimized, or sold.</p>
            <p>It exists as a response to a world that has learned how to scale almost everything — except wisdom, coherence, and inner truth. A world fluent in execution, yet increasingly detached from purpose. A world where speed is rewarded, but sense-making is postponed.</p>
            <p>five28hertz begins from a different premise:</p>
            <p>That before anything is built, something must be <strong>remembered</strong>.</p>
          </div> : <p className="mt-6 max-w-lg vision-hero__subtitle text-[#CDE5DF]">A distinct perspective, held within one evolving architecture.</p>}
        </div>
        {!isVision && <div className={isVision ? "vision-editorial__core relative z-10 mx-auto shrink-0" : "field-page-hero__core relative z-10 mx-auto w-56 shrink-0 md:mx-0 md:w-72"}>{<img src={base + (isVision ? "assets/original-five28hertz-logo.svg?vision-core=corporate-v2" : "assets/original-five28hertz-logo.svg?corporate-core=approved-v1")} alt="five28hertz corporate Core" className="block w-full h-auto" />}</div>}
      </div>
    </section>
    <div className="h-2 w-full field-spectrum" aria-hidden="true" />
    <div className="published-page__aura" aria-hidden="true" />
    <div className={isVision ? "vision-editorial__reading mx-auto max-w-5xl px-6 pt-16 md:px-12" : "mx-auto max-w-5xl px-6 pt-16 md:px-12"}>
      <article className="field-prose mt-12" dangerouslySetInnerHTML={{__html:(isVision ? visionContent : fieldContent).replace(/href="\/(.*?)"/g, (_match, route:string) => `href="${base}${route}"`)}} />
      {path === "/field" ? (
        <nav aria-label="Return to the parent pages" className="site-continuation">

          <div className="site-continuation__links"><a href={base + "vision/"}>Explore Purpose ↗</a></div>
        </nav>
      ) : (
        <nav aria-label="Continue exploring the parent" className="site-continuation">
          {isVision ? (
            <a className="purpose-continuation-link" href={base + "architecture/"}>
              From purpose to form <span className="purpose-continuation-arrow" aria-hidden="true">↗</span>
            </a>
          ) : (
            <>
    
              <div className="site-continuation__links">
                {entries.filter(x => ["/vision", "/field"].includes(x.path) && x.path !== path).map(x => (
                  <a href={base + x.path.slice(1) + "/"} key={x.path}>{x.label} <span aria-hidden="true">↗</span></a>
                ))}
              </div>
            </>
          )}
        </nav>
      )}
    </div>
  </main>;
}
