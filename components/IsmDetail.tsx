import { ArrowLeft, BookOpen, HelpCircle, Lightbulb } from 'lucide-react';
import { Ism } from '../data/isms';

interface IsmDetailProps {
  ism: Ism;
  onBack: () => void;
}

const gridLabels = {
  ontology: { name: '场域', english: 'Ontology', desc: '世界观框架' },
  body: { name: '本体', english: 'Body', desc: '真实存在' },
  phenomenon: { name: '现象', english: 'Phenomenon', desc: '感知体验' },
  purpose: { name: '目的', english: 'Purpose', desc: '终极目标' },
};

export function IsmDetail({ ism, onBack }: IsmDetailProps) {
  const hasFourGrid = ism.fourGrid && Object.keys(ism.fourGrid).length > 0;
  const hasExtensions = ism.extensions && ism.extensions.length > 0;
  const hasQA = ism.qa && ism.qa.length > 0;

  return (
    <div className="animate-fadeInUp max-h-[70vh] overflow-y-auto pr-2">
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
      
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <span 
          className="font-mono text-sm px-2 py-1"
          style={{ background: '#000', color: '#fff' }}
        >
          {ism.code}
        </span>
        {ism.aliases && ism.aliases.length > 0 && (
          <span className="text-xs text-gray-500">
            别名: {ism.aliases.join(' / ')}
          </span>
        )}
      </div>
      
      {/* Name */}
      <h2 className="font-black text-2xl mb-4">{ism.name}</h2>
      
      {/* Divider */}
      <div className="h-px bg-black mb-4" />
      
      {/* Description */}
      <p className="text-gray-700 leading-relaxed mb-6">
        {ism.description}
      </p>
      
      {/* Four Grid Analysis */}
      {hasFourGrid && (
        <div className="mb-6">
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            四格分析
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {(['ontology', 'body', 'phenomenon', 'purpose'] as const).map((key) => {
              const item = ism.fourGrid[key];
              if (!item) return null;
              const label = gridLabels[key];
              return (
                <div
                  key={key}
                  className="p-3 text-xs group cursor-pointer hover:bg-gray-100 transition-colors"
                  style={{ border: '1px solid #ddd' }}
                  title={item.text}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="w-6 h-6 flex items-center justify-center font-bold text-white text-xs"
                      style={{ background: '#ff1493' }}
                    >
                      {item.value}
                    </span>
                    <span className="font-bold">{label.name}</span>
                    <span className="text-gray-400">({label.english})</span>
                  </div>
                  <p className="text-gray-600 line-clamp-3">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Knowledge Extensions */}
      {hasExtensions && (
        <div className="mb-6">
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            知识延伸
          </h3>
          <div className="space-y-2">
            {ism.extensions.map((ext, i) => (
              <div key={i} className="p-3 text-xs" style={{ background: '#f9f9f9', border: '1px solid #eee' }}>
                <div className="font-bold mb-1">{ext.title}</div>
                <p className="text-gray-600">{ext.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Q&A */}
      {hasQA && (
        <div className="mb-6">
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            问答
          </h3>
          <div className="space-y-3">
            {ism.qa.map((item, i) => (
              <div key={i} className="text-xs">
                <div className="font-bold mb-1 flex items-start gap-2">
                  <span className="text-[#ff1493]">Q{i + 1}:</span>
                  <span>{item.question}</span>
                </div>
                <div className="text-gray-600 pl-6">
                  <span className="text-gray-400">A:</span> {item.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Dimension Codes */}
      <div className="p-4" style={{ background: '#f5f5f5', border: '1px solid #000' }}>
        <h4 className="font-bold mb-3 text-sm">编码解析</h4>
        <div className="flex gap-2">
          {ism.code.split('-').map((element, index) => (
            <div key={index} className="flex flex-col items-center gap-1">
              <div
                className="w-10 h-10 flex items-center justify-center font-bold"
                style={{
                  background: element === '$' ? '#ff1493' : '#000',
                  color: '#fff',
                }}
              >
                {element}
              </div>
              <span className="text-xs text-gray-500">
                {['场域', '本体', '现象', '目的'][index]}
              </span>
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


