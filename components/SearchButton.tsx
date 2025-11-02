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
        w-[120px] h-[120px] rounded-xl
        bg-[#4A90E2] hover:bg-[#5BA0F2]
        flex items-center justify-center
        transition-all duration-150
        ${isPressed ? 'scale-95 bg-[#3A80D2]' : ''}
      `}
      style={!isPressed ? { boxShadow: '0 0 15px rgba(74, 144, 226, 0.3)' } : {}}
      aria-label="Search"
    >
      <Search className="w-8 h-8 text-white" strokeWidth={2.5} />
    </button>
  );
}

