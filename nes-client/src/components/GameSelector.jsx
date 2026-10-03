const SORT_OPTIONS = [
  { value: 'date-oldest', label: 'Release Date (Oldest)' },
  { value: 'date-newest', label: 'Release Date (Newest)' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'size-asc', label: 'Size (Smallest First)' },
  { value: 'size-desc', label: 'Size (Largest First)' }
];

export default function GameSelector({ sortedGames, selectedGames, onToggle, sortBy, onSortChange, onReset }) {
  return (
    <div className="col-span-1 flex flex-col h-full space-y-[24px] max-w-full">
      <div className="bg-[#111823] p-4 lg:p-5 rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.25)] flex flex-col justify-center gap-2.5 flex-shrink-0 md:h-[115px] lg:h-auto">
        <span className="text-[0.8rem] lg:text-[1rem] font-mono font-bold text-[#a0aec0] uppercase tracking-wider block text-left pl-[4px]">
          Sort All Games By:
        </span>
        <div className="grid grid-cols-[1fr_auto] gap-[8px] lg:gap-[10px] w-full items-center">
          <div className="relative w-full">
            <select
              id="matrix-sort-dropdown"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none bg-[#090d16] text-white text-[0.8rem] md:text-[0.9rem] rounded-[6px] md:rounded-[8px] cursor-pointer block hover:border-portfolio-cyan/40 transition-colors h-9 md:h-10 w-full pl-[10px] md:pl-[14px] pr-8 box-border border border-transparent"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[0.65rem] text-[#a0aec0]">&#9660;</div>
          </div>
          <button
            type="button"
            id="reset-sorting"
            onClick={onReset}
            className="bg-[#090d16] text-[#a0aec0] font-medium text-[0.8rem] md:text-[0.85rem] rounded-[6px] md:rounded-[8px] px-3 md:px-4 flex items-center justify-center hover:bg-[#161f2d] hover:text-white hover:border-portfolio-cyan/40 active:scale-95 transition-all duration-150 transform flex-shrink-0 h-9 md:h-10"
          >
            <span className="-mt-[2px]">Reset</span>
          </button>
        </div>
      </div>

      <div className="bg-[#111823] p-3 lg:p-4 rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.25)] flex-grow h-auto max-h-[320px] md:max-h-none lg:max-h-none md:h-[500px] lg:h-0 min-h-[240px] flex flex-col overflow-hidden md:translate-y-0 lg:translate-y-0">
        <div className="w-full flex-grow flex flex-col gap-2 md:gap-3 overflow-y-auto pr-1 md:pr-2 portfolio-scrollbar" id="game-selection-list">
          {sortedGames.map((game) => {
            const selectedIndex = selectedGames.findIndex((selected) => selected.name === game.name);
            const selectedBorder = selectedIndex === 0 
              ? 'border-portfolio-cyan bg-[#141d2a]' 
              : selectedIndex === 1 
              ? 'border-portfolio-purple bg-[#141d2a]' 
              : 'border-transparent';

            return (
              <button
                type="button"
                key={game.name}
                aria-pressed={selectedIndex >= 0}
                onClick={() => onToggle(game)}
                className={`w-full text-left bg-[#090d16] rounded-[8px] md:rounded-[10px] p-3 flex items-center gap-3 md:gap-4 transition-all duration-150 ease-out hover:bg-[#141e2e] active:scale-[0.99] transform cursor-pointer shadow-md flex-shrink-0 border-2 ${selectedBorder}`}
              >
                <div className="flex-shrink-0 w-10 md:w-14 h-auto min-h-[3rem] md:min-h-[4rem] rounded-[2px] overflow-hidden flex items-center justify-center">
                  {game.coverUrl && (
                    <img src={game.coverUrl} alt="" loading="lazy" className="w-full h-auto max-h-12 md:max-h-16 object-contain opacity-80 hover:opacity-100 transition-opacity shadow-none" />
                  )}
                </div>
                <div className="flex-grow text-left min-w-0 w-full overflow-hidden">
                  <h2 className="text-white font-bold text-[0.9rem] md:text-[1.05rem] m-0 tracking-tight leading-tight truncate block">{game.name}</h2>
                  <span className="text-[#a0aec0] text-[0.75rem] md:text-[0.85rem] font-mono block pt-0.5 md:pt-1 truncate">{game.mapperChip} | {game.releaseLabel}</span>
                </div>
                <div className="flex-shrink-0 text-right flex flex-col gap-0.5 items-end">
                  <span className="bg-black/40 px-1.5 py-0.5 rounded-[3px] font-mono text-[0.75rem] md:text-[0.85rem] font-bold text-white">{game.sizeInKb} K</span>
                  <span className={`text-[0.7rem] md:text-[0.85rem] font-mono font-bold tracking-wider uppercase ${selectedIndex === 0 ? 'text-portfolio-cyan' : selectedIndex === 1 ? 'text-portfolio-purple' : 'text-[#475569]'}`}>
                    {selectedIndex < 0 ? 'Idle' : `Cart ${selectedIndex === 0 ? 'A' : 'B'}`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
