import React from 'react';
import { Moon, Search, Sun, Volume2, VolumeX } from 'lucide-react';
import { terminalAudio } from '../../utils/audio';

interface HeaderProps {
  activeScreen: 'terminal' | 'screener' | 'portfolio' | 'news';
  onNavigate: (screen: 'terminal' | 'screener' | 'portfolio' | 'news') => void;
  onOpenCommandPalette: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isAudioEnabled: boolean;
  onToggleAudio: () => void;
  cashBalance: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeScreen,
  onNavigate,
  onOpenCommandPalette,
  isDarkMode,
  onToggleTheme,
  isAudioEnabled,
  onToggleAudio,
  cashBalance,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-4 lg:px-6 py-2.5 bg-white dark:bg-[#0e1118] border-b border-[#e0e3eb] dark:border-[#242938] select-none shrink-0">
      {/* Zone 1: Brand Wordmark (Single text element) */}
      <div className="flex items-center gap-3 shrink-0">
        <a
          href="#terminal"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('terminal');
          }}
          className="text-base font-bold tracking-tight text-[#131722] dark:text-white whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <div className="w-5 h-5 rounded bg-[#2962ff] flex items-center justify-center text-white text-xs font-black">
            FT
          </div>
          <span>Financial Terminal</span>
        </a>
        <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-semibold text-[#089981] font-mono-tabular">
          <span className="w-1.5 h-1.5 rounded-full bg-[#089981] animate-pulse" />
          <span>MARKETS OPEN</span>
        </div>
      </div>

      {/* Zone 2: Navigation Links (4-5 single-line clean text links with active indicator) */}
      <nav className="flex items-center gap-6 text-xs font-semibold">
        <button
          onClick={() => onNavigate('terminal')}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
            activeScreen === 'terminal'
              ? 'text-[#2962ff] border-b-2 border-[#2962ff]'
              : 'text-[#434656] dark:text-[#a0a5b8] hover:text-[#131722] dark:hover:text-white'
          }`}
        >
          Terminal
        </button>
        <button
          onClick={() => onNavigate('screener')}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
            activeScreen === 'screener'
              ? 'text-[#2962ff] border-b-2 border-[#2962ff]'
              : 'text-[#434656] dark:text-[#a0a5b8] hover:text-[#131722] dark:hover:text-white'
          }`}
        >
          Screener
        </button>
        <button
          onClick={() => onNavigate('portfolio')}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
            activeScreen === 'portfolio'
              ? 'text-[#2962ff] border-b-2 border-[#2962ff]'
              : 'text-[#434656] dark:text-[#a0a5b8] hover:text-[#131722] dark:hover:text-white'
          }`}
        >
          Portfolio
        </button>
        <button
          onClick={() => onNavigate('news')}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
            activeScreen === 'news'
              ? 'text-[#2962ff] border-b-2 border-[#2962ff]'
              : 'text-[#434656] dark:text-[#a0a5b8] hover:text-[#131722] dark:hover:text-white'
          }`}
        >
          News & Macro
        </button>
      </nav>

      {/* Zone 3: Actions (Command Search, Audio, Theme, Cash Balance) */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Command Search button */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-2.5 py-1 text-xs text-[#737687] bg-[#f0f3fa] dark:bg-[#161b26] hover:bg-[#eaedfd] dark:hover:bg-[#1e2330] rounded-full border border-[#e0e3eb] dark:border-[#242938] transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden md:inline text-[11px]">Search Ticker</span>
          <kbd className="hidden md:inline-block px-1.5 py-0.2 bg-white dark:bg-[#242938] text-[9px] font-mono rounded border border-[#e0e3eb] dark:border-[#2a3040]">
            ⌘K
          </kbd>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={onToggleAudio}
          className="p-1.5 text-[#737687] hover:text-[#131722] dark:hover:text-white rounded hover:bg-[#f0f3fa] dark:hover:bg-[#161b26] transition-colors"
          title={isAudioEnabled ? 'Mute terminal audio' : 'Unmute terminal audio'}
        >
          {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-1.5 text-[#737687] hover:text-[#131722] dark:hover:text-white rounded hover:bg-[#f0f3fa] dark:hover:bg-[#161b26] transition-colors"
          title={isDarkMode ? 'Switch to Light mode' : 'Switch to Dark mode'}
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Paper Account Balance Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-[#eaedfd]/70 dark:bg-[#161b26] border border-[#e0e3eb] dark:border-[#242938] rounded text-xs font-mono-tabular">
          <span className="text-[#737687] text-[10px] font-sans">Cash:</span>
          <span className="font-bold text-[#131722] dark:text-white">
            ${cashBalance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
        </div>
      </div>
    </header>
  );
};
