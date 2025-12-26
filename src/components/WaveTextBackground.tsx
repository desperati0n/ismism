interface WaveTextBackgroundProps {
  className?: string;
}

export function WaveTextBackground({ className = '' }: WaveTextBackgroundProps) {
  // 静态斜条纹方案 - 用超大容器确保覆盖
  const stripes = [
    { top: '5%', rotate: -10 },
    { top: '22%', rotate: -6 },
    { top: '40%', rotate: -14 },
    { top: '56%', rotate: -4 },
    { top: '72%', rotate: -12 },
    { top: '88%', rotate: -8 },
  ];

  // 生成足够长的文字
  const text = '主义 · '.repeat(80);

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
            width: '250vmax',
            height: 'clamp(28px, 4vw, 44px)',
            background: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          <span
            style={{
              color: '#fff',
              fontSize: 'clamp(14px, 2.5vw, 22px)',
              fontWeight: 900,
              fontFamily: "'Noto Sans SC', 'Microsoft YaHei', sans-serif",
              letterSpacing: '0.1em',
            }}
          >
            {text}
          </span>
        </div>
      ))}
    </div>
  );
}
