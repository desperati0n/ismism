import { useState, useEffect } from 'react';
import { ArrowLeft, ThumbsUp } from 'lucide-react';
import { Ism } from '../data/isms';
import { CommentSection } from './CommentSection';
import { interactionService } from '../services/interactionService';

interface IsmDetailProps {
  ism: Ism;
  onBack: () => void;
}

export function IsmDetail({ ism, onBack }: IsmDetailProps) {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // 加载点赞数据
  useEffect(() => {
    loadLikes();
  }, [ism.code]);

  const loadLikes = async () => {
    try {
      const likesData = await interactionService.getIsmLikes(ism.code);
      setLikes(likesData.totalLikes);
      setIsLiked(likesData.isLikedByUser);
    } catch (error) {
      console.error('Failed to load likes:', error);
    }
  };

  // 处理点赞
  const handleLike = async () => {
    try {
      const newLikesData = await interactionService.toggleIsmLike(ism.code);
      setLikes(newLikesData.totalLikes);
      setIsLiked(newLikesData.isLikedByUser);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };
  return (
    <div className="w-full max-w-[900px] mx-auto animate-fadeInUp">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="
          flex items-center gap-2 mb-8
          text-white/70 hover:text-white
          transition-colors duration-150
        "
      >
        <ArrowLeft className="w-5 h-5" />
        <span>返回搜索结果</span>
      </button>
      
      {/* Detail Card */}
      <div
        className="
          rounded-xl p-8
          bg-white/5 border border-white/10
        "
      >
        {/* Code Display */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
            <span className="text-white/50 text-sm">编码：</span>
            <span className="text-[#4A90E2] font-mono">{ism.code}</span>
          </div>
        </div>
        
        {/* Name */}
        <h2 className="mb-6 text-white">{ism.name}</h2>
        
        {/* Divider */}
        <div className="h-px bg-white/10 mb-6"></div>
        
        {/* Description */}
        <div className="space-y-4">
          <h3 className="text-white/90">详细说明</h3>
          <p className="text-white/70 leading-relaxed text-lg">
            {ism.description}
          </p>
        </div>
        
        {/* Additional Info Section */}
        <div className="mt-8 p-6 rounded-lg bg-white/[0.02] border border-white/5">
          <h4 className="text-white/80 mb-4">哲学维度解析</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {ism.code.split('-').map((element, index) => (
              <div key={index} className="flex items-center gap-3">
                <div
                  className={`
                    w-10 h-10 rounded-lg
                    flex items-center justify-center
                    ${element === '$' && index === 0 ? 'bg-[#FF6B6B]/20 text-[#FF6B6B]' : 
                      element === '$' ? 'bg-[#FFD700]/20 text-[#FFD700]' : 
                      'bg-[#4A90E2]/20 text-[#4A90E2]'}
                  `}
                  style={{ fontWeight: 700 }}
                >
                  {element}
                </div>
                <div className="text-white/60">
                  {index === 0 && '第一维度'}
                  {index === 1 && '第二维度'}
                  {index === 2 && '第三维度'}
                  {index === 3 && '第四维度'}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Philosophy Note */}
        {ism.code.includes('$') && (
          <div className="mt-6 p-4 rounded-lg bg-[#4A90E2]/10 border border-[#4A90E2]/20">
            <p className="text-sm text-white/60">
              {ism.code.startsWith('$') ? (
                <>
                  💡 此主义包含<span className="text-[#FF6B6B]">主体性缺失（$）</span>作为核心特征，代表了一种特殊的哲学状态。
                </>
              ) : (
                <>
                  💡 此主义包含<span className="text-[#FFD700]">通配符（$）</span>，表示在该维度上保持开放性和灵活性。
                </>
              )}
            </p>
          </div>
        )}
        
        {/* Like Button */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <button
            onClick={handleLike}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-lg
              transition-all duration-150
              ${isLiked 
                ? 'bg-[#4A90E2] text-white shadow-lg shadow-[#4A90E2]/30' 
                : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
              }
            `}
          >
            <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{isLiked ? '已赞' : '赞同'}</span>
            {likes > 0 && (
              <span className={`ml-1 ${isLiked ? 'text-white/90' : 'text-white/50'}`}>
                · {likes}
              </span>
            )}
          </button>
        </div>
      </div>
      
      {/* Comment Section */}
      <CommentSection ismCode={ism.code} />
    </div>
  );
}
