import { MoreHorizontal } from 'lucide-react';

interface TopNavigationProps {
  currentSearch: string;
  onReset: () => void;
}

export function TopNavigation({ currentSearch, onReset }: TopNavigationProps) {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-14"
      style={{
        backgroundColor: 'rgba(245, 245, 245, 0.9)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="h-full px-6 flex items-center justify-between max-w-[1920px] mx-auto">
        {/* Logo */}
        <h1 
          className="font-black text-xl tracking-tight cursor-pointer"
          onClick={onReset}
        >
          主义主义
        </h1>
        
        {/* 右侧菜单按钮 */}
        <button
          className="dot-black"
          onClick={onReset}
          aria-label="Menu"
        >
          <MoreHorizontal className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}

