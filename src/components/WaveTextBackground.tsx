interface WaveTextBackgroundProps {
  className?: string;
}

export function WaveTextBackground({ className = '' }: WaveTextBackgroundProps) {
  // 使用纯CSS实现斜条纹背景，不会有断裂问题
  const stripes = [
    { top: '8%', rotate: -12 },
    { top: '24%', rotate: -6 },
    { top: '42%', rotate: -15 },
    { top: '58%', rotate: -8 },
    { top: '74%', rotate: -10 },
    { top: '90%', rotate: -5 },
  ];

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
      {stripes.map((stripe, index) => (
        <div
          key={index}
          className="absolute stripe-band"
          style={{
            top: stripe.top,
            left: '-50%',
            width: '200%',
            height: 'clamp(24px, 4vw, 40px)',
            transform: `rotate(${stripe.rotate}deg)`,
            background: '#000',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          <div 
            className="stripe-text-container"
            style={{
              display: 'flex',
              animation: `stripe-scroll ${20 + index * 3}s linear infinite`,
              animationDirection: index % 2 === 0 ? 'normal' : 'reverse',
            }}
          >
            {/* 重复两组文字实现无缝滚动 */}
            {[0, 1].map((group) => (
              <span
                key={group}
                className="text-white font-black whitespace-nowrap"
                style={{
                  fontSize: 'clamp(12px, 2vw, 20px)',
                  fontFamily: "'Noto Sans SC', 'Microsoft YaHei', sans-serif",
                  letterSpacing: '0.05em',
                  paddingRight: '2em',
                }}
              >
                {'主义 · '.repeat(50)}
              </span>
            ))}
          </div>
        </div>
      ))}
      
      {/* 添加CSS动画 */}
      <style>{`
        @keyframes stripe-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
