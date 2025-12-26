import { useEffect, useRef } from 'react';

interface WaveTextBackgroundProps {
  className?: string;
}

export function WaveTextBackground({ className = '' }: WaveTextBackgroundProps) {
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  
  const stripes = [
    { top: '5%', rotate: -10, speed: 0.5 },
    { top: '22%', rotate: -6, speed: -0.4 },
    { top: '40%', rotate: -14, speed: 0.6 },
    { top: '56%', rotate: -4, speed: -0.35 },
    { top: '72%', rotate: -12, speed: 0.45 },
    { top: '88%', rotate: -8, speed: -0.55 },
  ];

  useEffect(() => {
    const text = '主义 · ';
    const animationFrames: number[] = [];
    
    canvasRefs.current.forEach((canvas, index) => {
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // 设置canvas尺寸
      const height = Math.max(28, Math.min(44, window.innerWidth * 0.04));
      canvas.height = height;
      canvas.width = window.innerWidth * 3;
      
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = `900 ${Math.max(14, Math.min(22, window.innerWidth * 0.025))}px "Noto Sans SC", "Microsoft YaHei", sans-serif`;
      ctx.fillStyle = '#fff';
      ctx.textBaseline = 'middle';
      
      // 测量文字宽度
      const textWidth = ctx.measureText(text).width;
      const repeatCount = Math.ceil(canvas.width / textWidth) + 2;
      
      let offset = 0;
      const speed = stripes[index].speed;
      
      const animate = () => {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        
        for (let i = 0; i < repeatCount; i++) {
          ctx.fillText(text, (i * textWidth) + offset, canvas.height / 2);
        }
        
        offset += speed;
        if (offset > textWidth) offset -= textWidth;
        if (offset < -textWidth) offset += textWidth;
        
        animationFrames[index] = requestAnimationFrame(animate);
      };
      
      animate();
    });
    
    return () => {
      animationFrames.forEach(id => cancelAnimationFrame(id));
    };
  }, []);

  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`} style={{ overflow: 'hidden' }}>
      {stripes.map((stripe, index) => (
        <canvas
          key={index}
          ref={el => { canvasRefs.current[index] = el; }}
          style={{
            position: 'absolute',
            top: stripe.top,
            left: '50%',
            transform: `translateX(-50%) rotate(${stripe.rotate}deg)`,
            width: '300vmax',
            height: 'clamp(28px, 4vw, 44px)',
          }}
        />
      ))}
    </div>
  );
}
