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
    <header className="fixed inset-x-0 top-0 z-40 border-b border-black/10 bg-[#FCFAF6]/95 px-6 py-5 backdrop-blur-sm md:px-12">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <a href={import.meta.env.BASE_URL} aria-label="five28hertz — home" className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-[#17201D]"><img src={import.meta.env.BASE_URL + "assets/five28hertz%20Corporate%20Logo.png"} alt="" className="h-11 w-11 rounded-full object-cover" /><span>five28hertz</span></a>
        <nav aria-label="Primary" className="hidden items-center gap-7 text-[11px] uppercase tracking-[0.22em] text-[#414943] md:flex">
          {sections.map(({ id, label }) => <a key={id} href={import.meta.env.BASE_URL + (id === "vision" ? "vision/" : `#${id}`)} className="hover:underline focus-visible:underline">{label}</a>)}
        </nav>
        <details className="group relative md:hidden">
          <summary className="cursor-pointer list-none rounded border border-[#414943] px-3 py-2 text-xs uppercase tracking-[0.12em] text-[#17201D] focus-visible:outline-2 focus-visible:outline-offset-2">Menu</summary>
          <nav aria-label="Mobile sections" className="absolute right-0 top-full mt-3 flex min-w-48 flex-col gap-1 border border-black/15 bg-[#FCFAF6] p-3 shadow-lg">
            {sections.map(({ id, label }) => <a key={id} href={import.meta.env.BASE_URL + (id === "vision" ? "vision/" : `#${id}`)} className="px-3 py-2 text-sm text-[#17201D] hover:underline focus-visible:underline">{label}</a>)}
          </nav>
        </details>
      </div>
    </header>
  );
};
export default MinimalIdentityShell;
