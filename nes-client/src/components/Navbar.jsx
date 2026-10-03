import { useEffect } from 'react';

const NAV_LINKS = [
  { href: 'https://jpwillenborg.com', label: 'Overview' },
  { href: 'https://jpwillenborg.com', label: 'Tech Stack' },
  { href: 'https://jpwillenborg.com', label: 'Web Apps' },
  { href: 'https://jpwillenborg.com', label: 'Game Dev' },
  { href: 'https://jpwillenborg.com', label: '3D Modeling' }
];

export default function Navigation({ isOpen, setIsOpen }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    
    const handleResize = () => {
      if (window.matchMedia('(min-width: 1040px)').matches) setIsOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, setIsOpen]);

  return (
    <header>
      <nav aria-label="Main Navigation" className="fixed top-0 left-0 w-full z-50 py-[1.25rem] bg-[#06090f] transition-colors duration-200 ease-in-out">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between w-full m-0">
            <div className="w-1/2 min-[1040px]:w-1/4 text-left">
              <a href="https://jpwillenborg.com" className="text-[1.75rem] font-bold text-white no-underline tracking-tight inline-block lowercase font-sans">
                john<span className="text-portfolio-cyan">.</span>willenborg
              </a>
            </div>

            <div className="hidden min-[1040px]:flex min-[1040px]:w-1/2 justify-center items-center">
              <div className="flex gap-[2.75rem]">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="no-underline font-mono text-[#a0aec0] opacity-85 hover:text-portfolio-cyan hover:opacity-100 transition-all duration-200 text-[1.05rem] font-normal tracking-normal inline-block text-center"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="w-1/2 min-[1040px]:w-1/4 text-right flex justify-end items-center">
              <a href="https://jpwillenborg.com" className="hidden min-[1040px]:block bg-portfolio-cyan text-[#090d16] font-sans font-medium text-[0.85rem] tracking-[0.01em] rounded-[6px] px-[1.25rem] py-[0.45rem] shadow-[0_0_16px_4px_rgba(0,0,0,0.35)] no-underline hover:bg-[#66efff] transition-all duration-200">
                Let's Connect
              </a>
              <button
                type="button"
                className="bg-transparent border-0 outline-none p-0 min-[1040px]:hidden text-[1.75rem] no-underline cursor-pointer rounded-[4px]"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-expanded={isOpen}
                aria-controls="nes-mobile-nav"
                aria-label="Toggle mobile navigation menu"
              >
                <span className="text-[#a0aec0] opacity-85 hover:text-portfolio-cyan transition-all duration-200">
                  {isOpen ? '✕' : '☰'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div id="nes-mobile-nav" aria-label="Mobile navigation" className="fixed inset-0 w-full h-full z-40 flex flex-col justify-center items-center min-[1040px]:hidden gap-8 bg-[#090d16]">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="no-underline text-white font-mono font-bold text-[1.35rem] md:text-[1.65rem] tracking-wide hover:text-portfolio-cyan transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a 
            href="https://jpwillenborg.com" 
            onClick={() => setIsOpen(false)} 
            className="no-underline text-portfolio-cyan font-mono font-bold text-[1.35rem] md:text-[1.65rem] tracking-wide hover:text-[#66efff] transition-colors"
          >
            Let's Connect
          </a>
        </div>
      )}
    </header>
  );
}
