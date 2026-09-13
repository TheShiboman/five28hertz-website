const QuietFooter = () => {
  return (
    <footer className="bg-[#F6F2EA] px-6 pb-8 md:px-12">
      <div className="mx-auto flex max-w-6xl items-center justify-between border-t border-black/10 pt-6 text-[11px] uppercase tracking-[0.18em] text-[#7A817C]">
        <span>five28hertz</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
};

export default QuietFooter;
