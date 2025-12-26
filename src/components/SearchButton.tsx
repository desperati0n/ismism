import { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchButtonProps {
  onClick: () => void;
}

export function SearchButton({ onClick }: SearchButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  
  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => {
    setIsPressed(false);
    onClick();
  };
  
  return (
    <button
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setIsPressed(false)}
      className={`
        w-[44px] h-[44px] sm:w-[52px] sm:h-[52px] md:w-[60px] md:h-[60px]
        flex items-center justify-center
        transition-all duration-150
        hover:scale-110
        ${isPressed ? 'scale-95' : ''}
      `}
      style={{
        background: '#000',
      }}
      aria-label="Search"
    >
      <Search className="w-4 h-4 sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 text-white" strokeWidth={2.5} />
    </button>
  );
}
