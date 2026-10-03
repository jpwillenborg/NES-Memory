export default function Footer() {
  return (
    <footer className="w-full border-t border-[#1a2333]/70 bg-[#090d16] py-[0.75rem] px-4 md:px-16 lg:px-16 xl:px-0 mt-auto leading-normal flex-shrink-0 relative z-20 md:absolute md:bottom-0 md:left-0 md:h-[45px] max-[849px]:fixed max-[849px]:bottom-0 max-[849px]:left-0 lg:relative lg:h-auto">
      <div className="max-w-[1280px] mx-auto flex flex-col items-center justify-center text-center gap-0.5 md:flex-row md:justify-between md:text-left md:gap-2 font-mono text-[#a0aec0]/65 text-[0.75rem] md:text-[1.05rem] tracking-[0.25px] h-full">
        <div>John Willenborg © 2026</div>
        <div>Built using React, Tailwind, and a .NET Core Web API.</div>
      </div>
    </footer>
  );
}
