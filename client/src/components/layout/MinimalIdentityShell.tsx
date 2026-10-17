const MinimalIdentityShell = () => {
  const sections = [
    { id: "existing", label: "Existing site" },
    { id: "vision", label: "Vision" },
    { id: "architecture", label: "Architecture" },
    { id: "expressions", label: "Expressions" },
    { id: "evidence", label: "Evidence" },
    { id: "lineage", label: "Lineage" },
    { id: "contact", label: "Contact" },
  ];
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[#A3D1CA]/25 bg-[#103A43]/95 px-6 py-3 backdrop-blur-md md:px-12">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
        <a href={import.meta.env.BASE_URL} aria-label="five28hertz — home" className="flex shrink-0 items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-[#F8F3E8]"><img src={import.meta.env.BASE_URL + "assets/five28hertz%20Corporate%20Logo.png"} alt="" className="h-12 w-12 shrink-0 rounded-full sm:h-14 sm:w-14 object-cover shadow-[0_0_24px_rgba(43,195,182,0.25)]" /><span>five28hertz</span></a>
        <nav aria-label="Primary" className="hidden items-center gap-5 text-[11px] uppercase tracking-[0.16em] text-[#E3EFEA] xl:flex">
          {sections.map(({ id, label }) => <a key={id} href={import.meta.env.BASE_URL + (id === "vision" ? "vision/" : `#${id}`)} className="hover:underline focus-visible:underline">{label}</a>)}
        </nav>
        <details className="group relative ml-auto shrink-0 xl:hidden">
          <summary className="cursor-pointer list-none rounded border border-[#B6D4CF] px-3 py-2 text-xs uppercase tracking-[0.12em] text-[#F8F3E8] focus-visible:outline-2 focus-visible:outline-offset-2">Menu</summary>
          <nav aria-label="Mobile sections" className="absolute right-0 top-full mt-3 flex min-w-48 flex-col gap-1 border border-[#B6D4CF]/30 bg-[#103A43] p-3 shadow-lg">
            {sections.map(({ id, label }) => <a key={id} href={import.meta.env.BASE_URL + (id === "vision" ? "vision/" : `#${id}`)} className="px-3 py-2 text-sm text-[#F8F3E8] hover:underline focus-visible:underline">{label}</a>)}
          </nav>
        </details>
      </div>
    </header>
  );
};
export default MinimalIdentityShell;
