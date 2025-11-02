import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GridSliderProps {
  index: number;
  value: string;
  onChange: (value: string) => void;
}

export function GridSlider({ index, value, onChange }: GridSliderProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // 第一个格子的 $ 是特殊的（代表"主体性缺失"），其他格子的 $ 是通配符
  const isFirstSlider = index === 0;
  const elements = ['1', '2', '3', '4', '$'];
  
  const currentIndex = elements.indexOf(value);
  
  const handlePrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    const newIndex = currentIndex === 0 ? elements.length - 1 : currentIndex - 1;
    onChange(elements[newIndex]);
    setTimeout(() => setIsAnimating(false), 300);
  };
  
  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    const newIndex = currentIndex === elements.length - 1 ? 0 : currentIndex + 1;
    onChange(elements[newIndex]);
    setTimeout(() => setIsAnimating(false), 300);
  };
  
  // 判断是否显示特殊的 $（第一个格子且值为 $）
  const isSpecialDollar = isFirstSlider && value === '$';
  const isDollar = value === '$';
  
  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`
          w-[120px] h-[120px] rounded-xl
          flex items-center justify-center
          bg-white/5 border-2 border-white/20
          transition-all duration-150
          ${isHovered ? 'border-[#4A90E2]/80 bg-white/10' : ''}
          ${isSpecialDollar ? 'border-[#FF6B6B]/30' : ''}
        `}
        style={
          isHovered && !isSpecialDollar
            ? { boxShadow: '0 0 20px rgba(74, 144, 226, 0.5)' }
            : isSpecialDollar && isHovered
            ? { boxShadow: '0 0 20px rgba(255, 107, 107, 0.3)' }
            : {}
        }
      >
        {/* 左箭头按钮 */}
        {isHovered && (
          <button
            onClick={handlePrevious}
            className="absolute left-2 p-1 rounded hover:bg-white/10 transition-colors duration-150"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4 text-white/50" />
          </button>
        )}
        
        {/* 当前显示的元素 */}
        <div
          className={`
            text-[40px] leading-none transition-all duration-300
            ${isAnimating ? 'opacity-0 transform translate-y-2' : 'opacity-100'}
            ${isSpecialDollar ? 'text-[#FF6B6B]' : isDollar ? 'text-[#FFD700]' : 'text-white'}
          `}
          style={{ fontWeight: 700 }}
        >
          {value}
        </div>
        
        {/* 右箭头按钮 */}
        {isHovered && (
          <button
            onClick={handleNext}
            className="absolute right-2 p-1 rounded hover:bg-white/10 transition-colors duration-150"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4 text-white/50" />
          </button>
        )}
      </div>
    </div>
  );
}

