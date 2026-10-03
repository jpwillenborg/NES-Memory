import { useEffect, useState } from 'react';
import Navigation from './components/Navbar';
import HeroSection from './components/HeroSection';
import GameSelector from './components/GameSelector';
import ComparisonGrid from './components/ComparisonGrid';
import LoadingCard from './components/LoadingCard';
import Footer from './components/Footer';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/\$/, '');

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [games, setGames] = useState([]);
  const [selectedGames, setSelectedGames] = useState([]);
  const [sortBy, setSortBy] = useState('date-oldest');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!API_BASE_URL) {
      setError('The game data service is not configured for this deployment.');
      setIsLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    fetch(`${API_BASE_URL}/api/games`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          const problem = await response.json().catch(() => ({}));
          throw new Error(problem.detail || 'The game data service could not be reached.');
        }
        return response.json();
      })
      .then(setGames)
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError(requestError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

  const sortedGames = [...games].sort((first, second) => {
    if (sortBy === 'name-asc') return first.name.localeCompare(second.name);
    if (sortBy === 'size-desc') return second.sizeInKb - first.sizeInKb;
    if (sortBy === 'size-asc') return first.sizeInKb - second.sizeInKb;
    
    const dateOrder = new Date(first.releaseDate) - new Date(second.releaseDate);
    if (dateOrder === 0) {
      if (first.name === "Super Mario Bros.") return -1;
      if (second.name === "Super Mario Bros.") return 1;
    }
    return sortBy === 'date-newest' ? -dateOrder : dateOrder;
  });

  const toggleGame = (game) => {
    setSelectedGames((current) => {
      const existingIndex = current.findIndex((selected) => selected.name === game.name);
      if (existingIndex >= 0) return current.filter((_, index) => index !== existingIndex);
      return [...current, game].slice(-2);
    });
  };

  const firstGame = selectedGames[0];
  const secondGame = selectedGames[1];
  const memoryDifference = firstGame && secondGame ? Math.abs(firstGame.sizeInKb - secondGame.sizeInKb) : 0;

  return (
    <div className="app-shell flex flex-col min-h-screen w-full max-w-full overflow-x-hidden box-border bg-[#090d16]">
      <Navigation isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

      <div className="w-full box-border relative z-10 px-6 sm:px-8 md:px-[40px] lg:px-6 pt-[125px] md:pt-[140px] lg:pt-[160px] pb-16 md:pb-[80px] lg:pb-[140px] max-w-full overflow-x-hidden flex-grow flex flex-col justify-center">
        <main role="main" className="max-w-[1024px] mx-auto w-full box-border">
          <div id="nes-matrix-wrapper" className="w-full relative">
            <HeroSection />

            {!isLoading && error && (
              <div className="bg-red-900/20 border border-red-500/40 p-4 rounded-lg text-red-400 mb-6 font-mono text-sm" role="alert">
                {error}
              </div>
            )}

            {isLoading && <LoadingCard />}

            {!isLoading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] items-stretch mt-12 md:mt-6 lg:mt-[24px] max-[767px]:mt-2">
                <div className="order-1 md:order-none col-span-1">
                  <GameSelector 
                    sortedGames={sortedGames}
                    selectedGames={selectedGames}
                    onToggle={toggleGame}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    onReset={() => setSelectedGames([])}
                  />
                </div>
                <div className="order-2 md:order-none col-span-1 md:col-span-2">
                  <ComparisonGrid 
                    firstGame={firstGame}
                    secondGame={secondGame}
                    difference={memoryDifference}
                  />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
