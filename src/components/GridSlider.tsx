import { useState } from 'react';

interface GridSliderProps {
  index: number;
  value: string;
  onChange: (value: string) => void;
}

export function GridSlider({ index, value, onChange }: GridSliderProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const isFirstSlider = index === 0;
  const elements = ['1', '2', '3', '4', '$'];
  
  const currentIndex = elements.indexOf(value);
  
  const handleClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    const newIndex = currentIndex === elements.length - 1 ? 0 : currentIndex + 1;
    onChange(elements[newIndex]);
    setTimeout(() => setIsAnimating(false), 150);
  };
  
  const isSpecialDollar = isFirstSlider && value === '$';
  const isDollar = value === '$';
  
  return (
    <button
      onClick={handleClick}
      className={`
        w-[44px] h-[44px] sm:w-[52px] sm:h-[52px] md:w-[60px] md:h-[60px]
        flex items-center justify-center
        transition-all duration-150
        hover:scale-110 active:scale-95
        cursor-pointer
        ${isAnimating ? 'scale-95' : ''}
      `}
      style={{
        background: '#fff',
        border: '2px solid #000',
      }}
    >
      <span
        className={`
          text-lg sm:text-xl md:text-2xl font-black
          transition-all duration-150
          ${isAnimating ? 'opacity-0 transform -translate-y-1' : 'opacity-100'}
        `}
        style={{
          color: isSpecialDollar || isDollar ? '#ff1493' : '#000',
        }}
      >
        {value}
      </span>
    </button>
  );
}
