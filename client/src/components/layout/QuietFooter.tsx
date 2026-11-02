const QuietFooter = () => {
  return (
    <footer className="bg-[#103A43] px-6 pb-8 md:px-12">
      <div className="mx-auto flex max-w-6xl items-center justify-between border-t border-[#D8ECE7]/30 pt-6 text-[11px] uppercase tracking-[0.18em] text-[#E3EFEA]">
        <span>five28hertz</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
};

export default QuietFooter;
