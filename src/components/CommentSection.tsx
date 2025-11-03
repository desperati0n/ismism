import { useState, useEffect } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { Comment } from './Comment';
import { interactionService, Comment as CommentType } from '../services/interactionService';

interface CommentSectionProps {
  ismCode: string;
}

export function CommentSection({ ismCode }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 加载数据
  useEffect(() => {
    loadData();
  }, [ismCode]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [commentsData, user] = await Promise.all([
        interactionService.getComments(ismCode),
        interactionService.getCurrentUser(),
      ]);
      setComments(commentsData);
      setUserName(user.name);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 发布新评论
  const handleSubmitComment = async () => {
    if (!newComment.trim() || isLoading) return;

    setIsLoading(true);
    try {
      await interactionService.addComment(ismCode, newComment);
      setNewComment('');
      await loadData(); // 重新加载数据
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 点赞评论
  const handleLikeComment = async (commentId: string) => {
    try {
      await interactionService.toggleCommentLike(ismCode, commentId);
      await loadData();
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };

  // 添加回复
  const handleAddReply = async (commentId: string, content: string, replyToUserName?: string) => {
    try {
      // 如果有 replyToUserName，说明是回复某人的回复
      const comment = comments.find(c => c.id === commentId);
      let replyToUser = undefined;
      
      if (replyToUserName && comment) {
        // 查找被回复的用户
        const targetReply = comment.replies.find(r => r.author.name === replyToUserName);
        if (targetReply) {
          replyToUser = targetReply.author;
        }
      }
      
      await interactionService.addReply(ismCode, commentId, content, replyToUser);
      await loadData();
    } catch (error) {
      console.error('Failed to add reply:', error);
    }
  };

  // 点赞回复
  const handleLikeReply = async (commentId: string, replyId: string) => {
    try {
      await interactionService.toggleReplyLike(ismCode, commentId, replyId);
      await loadData();
    } catch (error) {
      console.error('Failed to like reply:', error);
    }
  };

  return (
    <div className="mt-8 space-y-6">
      {/* 评论输入区 */}
      <div className="rounded-xl p-6 bg-white/5 border border-white/10">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-[#4A90E2]/20 flex items-center justify-center flex-shrink-0">
            <span className="text-[#4A90E2]">{userName.charAt(0)}</span>
          </div>
          <div className="flex-1">
            <div className="text-sm text-white/50 mb-2">{userName}</div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="写下你的想法..."
              disabled={isLoading}
              className="
                w-full min-h-[100px] p-3 rounded-lg
                bg-white/5 border border-white/10
                text-white placeholder:text-white/30
                focus:outline-none focus:border-[#4A90E2]/50
                resize-none
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleSubmitComment();
                }
              }}
            />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-xs text-white/30">
            按 Cmd/Ctrl + Enter 快速发送
          </div>
          <button
            onClick={handleSubmitComment}
            disabled={!newComment.trim() || isLoading}
            className="
              flex items-center gap-2 px-4 py-2 rounded-lg
              bg-[#4A90E2] hover:bg-[#5BA0F2]
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-150
            "
          >
            <Send className="w-4 h-4" />
            <span>{isLoading ? '发送中...' : '发送'}</span>
          </button>
        </div>
      </div>

      {/* 评论列表 */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-white/70">
          <MessageCircle className="w-5 h-5" />
          <span>共 {comments.length} 条评论</span>
        </div>
        
        {isLoading && comments.length === 0 ? (
          <div className="text-center text-white/30 py-12">
            加载中...
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center text-white/30 py-12">
            还没有评论，来发表第一条吧！
          </div>
        ) : (
          comments.map(comment => (
            <Comment
              key={comment.id}
              comment={comment}
              onLike={() => handleLikeComment(comment.id)}
              onReply={(content, replyToUserName) => handleAddReply(comment.id, content, replyToUserName)}
              onLikeReply={(replyId) => handleLikeReply(comment.id, replyId)}
            />
          ))
        )}
      </div>
    </div>
  );
}
