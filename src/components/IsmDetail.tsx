import { ArrowLeft } from 'lucide-react';
import { Ism } from '../data/isms';

interface IsmDetailProps {
  ism: Ism;
  onBack: () => void;
}

export function IsmDetail({ ism, onBack }: IsmDetailProps) {
  return (
    <div className="animate-fadeInUp">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="
          flex items-center gap-2 mb-6
          text-gray-500 hover:text-black
          transition-colors duration-150
          text-sm
        "
      >
        <ArrowLeft className="w-4 h-4" />
        <span>返回</span>
      </button>
      
      {/* Code Display */}
      <div className="mb-4">
        <span 
          className="font-mono text-sm px-2 py-1"
          style={{ background: '#000', color: '#fff' }}
        >
          {ism.code}
        </span>
      </div>
      
      {/* Name */}
      <h2 className="font-black text-2xl mb-4">{ism.name}</h2>
      
      {/* Divider */}
      <div className="h-px bg-black mb-4" />
      
      {/* Description */}
      <p className="text-gray-700 leading-relaxed mb-6">
        {ism.description}
      </p>
      
      {/* Dimension Analysis */}
      <div className="p-4" style={{ background: '#f5f5f5', border: '1px solid #000' }}>
        <h4 className="font-bold mb-3 text-sm">哲学维度</h4>
        <div className="flex gap-2">
          {ism.code.split('-').map((element, index) => (
            <div
              key={index}
              className="w-10 h-10 flex items-center justify-center font-bold"
              style={{
                background: element === '$' ? '#ff1493' : '#000',
                color: '#fff',
              }}
            >
              {element}
            </div>
          ))}
        </div>
      </div>
      
      {/* Note for $ */}
      {ism.code.includes('$') && (
        <div className="mt-4 text-sm text-gray-600">
          <span className="text-[#ff1493] font-bold">$</span> = 主体性缺失 / 通配符
        </div>
      )}
    </div>
  );
}
