const MinimalIdentityShell = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-40 px-6 py-5 md:px-12">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <a href="#orientation" className="text-xs font-medium uppercase tracking-[0.3em] text-[#17201D]/80 transition-opacity hover:opacity-60">
          five28hertz
        </a>
        <nav aria-label="Primary" className="hidden items-center gap-7 text-[11px] uppercase tracking-[0.22em] text-[#59615C] md:flex">
          <a href="#architecture" className="transition-opacity hover:opacity-60">Architecture</a>
          <a href="#expressions" className="transition-opacity hover:opacity-60">Expressions</a>
          <a href="#evidence" className="transition-opacity hover:opacity-60">Evidence</a>
          <a href="#lineage" className="transition-opacity hover:opacity-60">Lineage</a>
        </nav>
      </div>
    </header>
  );
};

export default MinimalIdentityShell;
