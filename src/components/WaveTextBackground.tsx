interface WaveTextBackgroundProps {
  className?: string;
}

export function WaveTextBackground({ className = '' }: WaveTextBackgroundProps) {
  // 生成超长的"主义"文字 - 确保任何屏幕宽度都不会断
  const baseText = '主义'.repeat(100);
  
  const ribbons = [
    { rotate: -8, top: '5%', delay: 0, reverse: false },
    { rotate: -5, top: '18%', delay: 0.5, reverse: true },
    { rotate: -12, top: '32%', delay: 1, reverse: false },
    { rotate: -3, top: '48%', delay: 1.5, reverse: true },
    { rotate: -10, top: '62%', delay: 2, reverse: false },
    { rotate: -6, top: '76%', delay: 2.5, reverse: true },
    { rotate: -9, top: '88%', delay: 3, reverse: false },
  ];

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
      {ribbons.map((ribbon, index) => (
        <div
          key={index}
          className="absolute text-ribbon-wrapper"
          style={{
            top: ribbon.top,
            transform: `rotate(${ribbon.rotate}deg)`,
            width: '500vw',
            left: '-200vw',
          }}
        >
          <div
            className={`text-ribbon ${ribbon.reverse ? 'animate-scroll-reverse' : 'animate-scroll'}`}
            style={{
              animationDelay: `${ribbon.delay}s`,
              animationDuration: `${15 + index * 2}s`,
            }}
          >
            <div
              className="flex items-center whitespace-nowrap ribbon-band"
              style={{
                background: '#000',
              }}
            >
              <span
                className="text-white font-black tracking-tight whitespace-nowrap ribbon-text"
                style={{
                  fontFamily: "'Noto Sans SC', 'Microsoft YaHei', sans-serif",
                }}
              >
                {baseText}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
