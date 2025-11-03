import { useState } from 'react';
import { ThumbsUp, MessageCircle, Send } from 'lucide-react';
import { Comment as CommentType, Reply } from '../services/interactionService';

interface CommentProps {
  comment: CommentType;
  onLike: () => void;
  onReply: (content: string, replyToUserName?: string) => void;
  onLikeReply: (replyId: string) => void;
}

export function Comment({ comment, onLike, onReply, onLikeReply }: CommentProps) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | undefined>(undefined);

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    
    const date = new Date(timestamp);
    return date.toLocaleDateString('zh-CN');
  };

  const handleSubmitReply = () => {
    if (!replyContent.trim()) return;
    onReply(replyContent, replyingTo);
    setReplyContent('');
    setShowReplyInput(false);
    setReplyingTo(undefined);
  };

  // 回复主评论
  const handleReplyToComment = () => {
    setReplyingTo(undefined);
    setShowReplyInput(true);
  };

  // 回复某条回复
  const handleReplyToReply = (userName: string) => {
    setReplyingTo(userName);
    setShowReplyInput(true);
    setReplyContent(`@${userName} `);
  };

  return (
    <div className="rounded-xl p-6 bg-white/5 border border-white/10 animate-fadeInUp">
      {/* 主评论 */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-[#4A90E2]/20 flex items-center justify-center flex-shrink-0">
          <span className="text-[#4A90E2]">{comment.author.name.charAt(0)}</span>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-white/90">{comment.author.name}</span>
            <span className="text-white/30 text-xs">·</span>
            <span className="text-white/30 text-xs">{formatTime(comment.timestamp)}</span>
          </div>
          
          <p className="text-white/70 mb-4 leading-relaxed">{comment.content}</p>
          
          {/* 操作按钮 */}
          <div className="flex items-center gap-4">
            <button
              onClick={onLike}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                transition-all duration-150
                ${comment.likedByUser 
                  ? 'bg-[#4A90E2]/20 text-[#4A90E2]' 
                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70'
                }
              `}
            >
              <ThumbsUp className={`w-4 h-4 ${comment.likedByUser ? 'fill-current' : ''}`} />
              <span className="text-sm">{comment.likes > 0 ? comment.likes : '赞'}</span>
            </button>
            
            <button
              onClick={handleReplyToComment}
              className="
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                bg-white/5 text-white/50
                hover:bg-white/10 hover:text-white/70
                transition-all duration-150
              "
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">回复</span>
            </button>
          </div>
        </div>
      </div>

      {/* 回复列表 */}
      {comment.replies.length > 0 && (
        <div className="mt-4 ml-[52px] space-y-3">
          {comment.replies.map(reply => (
            <div key={reply.id} className="flex items-start gap-3 animate-fadeInUp">
              <div className="w-8 h-8 rounded-full bg-[#FFD700]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[#FFD700] text-sm">{reply.author.name.charAt(0)}</span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white/80 text-sm">{reply.author.name}</span>
                  {reply.replyToUser && (
                    <>
                      <span className="text-white/30 text-xs">回复</span>
                      <span className="text-[#4A90E2] text-sm">@{reply.replyToUser.name}</span>
                    </>
                  )}
                  <span className="text-white/30 text-xs">·</span>
                  <span className="text-white/30 text-xs">{formatTime(reply.timestamp)}</span>
                </div>
                
                <p className="text-white/60 text-sm mb-2 leading-relaxed">{reply.content}</p>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onLikeReply(reply.id)}
                    className={`
                      flex items-center gap-1 px-2 py-1 rounded
                      transition-all duration-150 text-xs
                      ${reply.likedByUser 
                        ? 'bg-[#4A90E2]/20 text-[#4A90E2]' 
                        : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60'
                      }
                    `}
                  >
                    <ThumbsUp className={`w-3 h-3 ${reply.likedByUser ? 'fill-current' : ''}`} />
                    {reply.likes > 0 && <span>{reply.likes}</span>}
                  </button>
                  
                  <button
                    onClick={() => handleReplyToReply(reply.author.name)}
                    className="
                      flex items-center gap-1 px-2 py-1 rounded
                      bg-white/5 text-white/40
                      hover:bg-white/10 hover:text-white/60
                      transition-all duration-150 text-xs
                    "
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>回复</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 回复输入框 */}
      {showReplyInput && (
        <div className="mt-4 ml-[52px] animate-fadeInUp">
          <div className="flex items-start gap-2">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={replyingTo ? `回复 @${replyingTo}...` : `回复 ${comment.author.name}...`}
              className="
                flex-1 min-h-[80px] p-3 rounded-lg
                bg-white/5 border border-white/10
                text-white placeholder:text-white/30
                focus:outline-none focus:border-[#4A90E2]/50
                resize-none text-sm
              "
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleSubmitReply();
                }
              }}
              autoFocus
            />
            <div className="flex flex-col gap-2">
              <button
                onClick={handleSubmitReply}
                disabled={!replyContent.trim()}
                className="
                  px-3 py-2 rounded-lg
                  bg-[#4A90E2] hover:bg-[#5BA0F2]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-150
                "
              >
                <Send className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setShowReplyInput(false);
                  setReplyContent('');
                  setReplyingTo(undefined);
                }}
                className="
                  px-3 py-2 rounded-lg
                  bg-white/5 hover:bg-white/10
                  text-white/50 text-xs
                  transition-all duration-150
                "
              >
                取消
              </button>
            </div>
          </div>
          {replyingTo && (
            <div className="mt-2 text-xs text-white/40">
              正在回复 <span className="text-[#4A90E2]">@{replyingTo}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
