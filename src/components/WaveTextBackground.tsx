interface WaveTextBackgroundProps {
  className?: string;
}

export function WaveTextBackground({ className = '' }: WaveTextBackgroundProps) {
  const stripes = [
    { top: '5%', rotate: -10, duration: 25 },
    { top: '22%', rotate: -6, duration: 30 },
    { top: '40%', rotate: -14, duration: 22 },
    { top: '56%', rotate: -4, duration: 28 },
    { top: '72%', rotate: -12, duration: 26 },
    { top: '88%', rotate: -8, duration: 24 },
  ];

  // 单组文字，会被复制两份
  const textUnit = '主义 · '.repeat(40);

  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`} style={{ overflow: 'hidden' }}>
      {stripes.map((stripe, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: stripe.top,
            left: '50%',
            transform: `translateX(-50%) rotate(${stripe.rotate}deg)`,
            width: '300vmax',
            height: 'clamp(28px, 4vw, 44px)',
            background: '#000',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          {/* 邪修：两个完全相同的文字块背靠背，用 animation 无限滚动 */}
          <div
            style={{
              display: 'flex',
              animation: `marquee-${index % 2 === 0 ? 'left' : 'right'} ${stripe.duration}s linear infinite`,
            }}
          >
            {[0, 1].map((i) => (
              <span
                key={i}
                style={{
                  color: '#fff',
                  fontSize: 'clamp(14px, 2.5vw, 22px)',
                  fontWeight: 900,
                  fontFamily: "'Noto Sans SC', 'Microsoft YaHei', sans-serif",
                  letterSpacing: '0.1em',
                  whiteSpace: 'nowrap',
                  paddingRight: '4em',
                }}
              >
                {textUnit}
              </span>
            ))}
          </div>
        </div>
      ))}
      
      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
