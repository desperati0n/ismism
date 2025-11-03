interface TopNavigationProps {
  currentSearch: string;
  onReset: () => void;
}

export function TopNavigation({ currentSearch, onReset }: TopNavigationProps) {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-16"
      style={{
        backgroundColor: 'rgba(15, 15, 26, 0.9)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="h-full px-8 flex items-center justify-between max-w-[1920px] mx-auto">
        {/* Logo / Title */}
        <div>
          <h2 className="text-white">主义主义</h2>
        </div>
        
        {/* Current Search Display */}
        <div className="text-white/70">
          搜索: {currentSearch}
        </div>
        
        {/* Reset Button */}
        <button
          onClick={onReset}
          className="
            h-10 px-4 rounded-lg
            bg-transparent border border-white/20
            text-white
            hover:border-[#4A90E2]/80 hover:bg-white/5
            transition-all duration-150
          "
        >
          重置
        </button>
      </div>
    </div>
  );
}
