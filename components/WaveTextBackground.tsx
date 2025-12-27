/**
 * WaveTextBackground - 波浪文字背景组件
 * 
 * 功能：创建多条倾斜滚动的"主义"文字条带作为装饰背景
 * 灵感来源：前卫实验设计风格
 */

interface WaveTextBackgroundProps {
  className?: string;
}

export function WaveTextBackground({ className = '' }: WaveTextBackgroundProps) {
  // 生成重复的"主义"文字
  const ismText = '主义主义主义主义主义主义主义主义主义主义主义主义主义主义主义主义主义主义主义主义';
  
  // 多条文字带的配置：不同角度、位置、速度
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
          className="absolute left-0 right-0 text-ribbon-wrapper"
          style={{
            top: ribbon.top,
            transform: `rotate(${ribbon.rotate}deg)`,
            width: '200%',
            left: '-50%',
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
              className="flex items-center"
              style={{
                background: '#000',
                padding: '8px 0',
              }}
            >
              <span
                className="text-white font-black tracking-tight"
                style={{
                  fontSize: '24px',
                  fontFamily: "'Noto Sans SC', 'Microsoft YaHei', sans-serif",
                }}
              >
                {ismText}{ismText}{ismText}{ismText}
              </span>
            </div>
            <div
              className="flex items-center"
              style={{
                background: '#000',
                padding: '8px 0',
              }}
            >
              <span
                className="text-white font-black tracking-tight"
                style={{
                  fontSize: '24px',
                  fontFamily: "'Noto Sans SC', 'Microsoft YaHei', sans-serif",
                }}
              >
                {ismText}{ismText}{ismText}{ismText}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
