export default function HeroSection() {
  return (
    <div className="flex flex-col pb-6 -mb-8 max-w-full">
      <div className="text-left w-full">
        <span className="block mb-0 font-mono text-[1.1rem] text-portfolio-cyan font-normal tracking-normal">
          // Memory Comparison
        </span>
        
        <h1 className="m-0 pt-1 font-sans text-[2.1rem] font-semibold text-white leading-tight tracking-normal break-words max-w-full">
          NES Mapper Benchmark Tool
        </h1>
        
        <div className="text-[#a0aec0] text-[1.05rem] leading-[1.65] mt-10 mb-16 block w-full max-w-full">
          <p className="m-0 break-words">
            A React/Vite visualizer hosted on Apache, backed by a controller-based ASP.NET Core Web API on Render. The API retrieves and caches IGDB release data and pairs it with curated NES cartridge-capacity and mapper estimates for side-by-side comparison.
          </p>
          <p className="m-0 pt-4 break-words">
            Select two games from the list to see how <span className="text-portfolio-cyan font-semibold">CARTRIDGE A</span> and <span className="text-portfolio-purple font-semibold">CARTRIDGE B</span> compare in terms of memory footprint.
          </p>
        </div>
      </div>
    </div>
  );
}
