/**
 * 互动服务接口层
 * 这个文件定义了所有互动功能的接口，便于后续切换到真实数据库
 * 
 * 使用方式：
 * 1. 当前使用 localStorage 作为临时存储
 * 2. 后续可以替换为 Supabase、Firebase 或其他后端服务
 * 3. 只需修改这个文件的实现，不需要改动组件代码
 */

// ==================== 数据类型定义 ====================

export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export interface Reply {
  id: string;
  author: User;
  content: string;
  timestamp: number;
  likes: number;
  likedByUser: boolean;
  replyToUser?: User; // 回复的目标用户（用于@功能）
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  timestamp: number;
  likes: number;
  likedByUser: boolean;
  replies: Reply[];
}

export interface IsmLikes {
  totalLikes: number;
  isLikedByUser: boolean;
}

// ==================== 接口定义 ====================

/**
 * 互动服务接口
 * 所有方法都返回 Promise，便于后续改为异步 API 调用
 */
export interface IInteractionService {
  // 用户相关
  getCurrentUser(): Promise<User>;
  setCurrentUser(user: User): Promise<void>;
  
  // 主义点赞相关
  getIsmLikes(ismCode: string): Promise<IsmLikes>;
  toggleIsmLike(ismCode: string): Promise<IsmLikes>;
  
  // 评论相关
  getComments(ismCode: string): Promise<Comment[]>;
  addComment(ismCode: string, content: string): Promise<Comment>;
  deleteComment(ismCode: string, commentId: string): Promise<void>;
  toggleCommentLike(ismCode: string, commentId: string): Promise<Comment>;
  
  // 回复相关
  addReply(ismCode: string, commentId: string, content: string, replyToUser?: User): Promise<Reply>;
  deleteReply(ismCode: string, commentId: string, replyId: string): Promise<void>;
  toggleReplyLike(ismCode: string, commentId: string, replyId: string): Promise<Reply>;
}

// ==================== LocalStorage 实现 ====================

class LocalStorageInteractionService implements IInteractionService {
  private readonly USER_KEY = 'current_user';
  
  async getCurrentUser(): Promise<User> {
    const saved = localStorage.getItem(this.USER_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    
    // 生成新用户
    const newUser: User = {
      id: `user-${Date.now()}-${Math.random()}`,
      name: `用户${Math.floor(Math.random() * 10000)}`,
    };
    await this.setCurrentUser(newUser);
    return newUser;
  }
  
  async setCurrentUser(user: User): Promise<void> {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }
  
  async getIsmLikes(ismCode: string): Promise<IsmLikes> {
    const key = `ism-likes-${ismCode}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
    return { totalLikes: 0, isLikedByUser: false };
  }
  
  async toggleIsmLike(ismCode: string): Promise<IsmLikes> {
    const current = await this.getIsmLikes(ismCode);
    const newLikes: IsmLikes = {
      totalLikes: current.isLikedByUser ? current.totalLikes - 1 : current.totalLikes + 1,
      isLikedByUser: !current.isLikedByUser,
    };
    
    const key = `ism-likes-${ismCode}`;
    localStorage.setItem(key, JSON.stringify(newLikes));
    return newLikes;
  }
  
  async getComments(ismCode: string): Promise<Comment[]> {
    const key = `comments-${ismCode}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  }
  
  private async saveComments(ismCode: string, comments: Comment[]): Promise<void> {
    const key = `comments-${ismCode}`;
    localStorage.setItem(key, JSON.stringify(comments));
  }
  
  async addComment(ismCode: string, content: string): Promise<Comment> {
    const user = await this.getCurrentUser();
    const comments = await this.getComments(ismCode);
    
    const newComment: Comment = {
      id: `comment-${Date.now()}-${Math.random()}`,
      author: user,
      content: content.trim(),
      timestamp: Date.now(),
      likes: 0,
      likedByUser: false,
      replies: [],
    };
    
    comments.unshift(newComment);
    await this.saveComments(ismCode, comments);
    return newComment;
  }
  
  async deleteComment(ismCode: string, commentId: string): Promise<void> {
    const comments = await this.getComments(ismCode);
    const filtered = comments.filter(c => c.id !== commentId);
    await this.saveComments(ismCode, filtered);
  }
  
  async toggleCommentLike(ismCode: string, commentId: string): Promise<Comment> {
    const comments = await this.getComments(ismCode);
    const updated = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: comment.likedByUser ? comment.likes - 1 : comment.likes + 1,
          likedByUser: !comment.likedByUser,
        };
      }
      return comment;
    });
    
    await this.saveComments(ismCode, updated);
    const updatedComment = updated.find(c => c.id === commentId);
    if (!updatedComment) throw new Error('Comment not found');
    return updatedComment;
  }
  
  async addReply(
    ismCode: string,
    commentId: string,
    content: string,
    replyToUser?: User
  ): Promise<Reply> {
    const user = await this.getCurrentUser();
    const comments = await this.getComments(ismCode);
    
    const newReply: Reply = {
      id: `reply-${Date.now()}-${Math.random()}`,
      author: user,
      content: content.trim(),
      timestamp: Date.now(),
      likes: 0,
      likedByUser: false,
      replyToUser,
    };
    
    const updated = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...comment.replies, newReply],
        };
      }
      return comment;
    });
    
    await this.saveComments(ismCode, updated);
    return newReply;
  }
  
  async deleteReply(ismCode: string, commentId: string, replyId: string): Promise<void> {
    const comments = await this.getComments(ismCode);
    const updated = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: comment.replies.filter(r => r.id !== replyId),
        };
      }
      return comment;
    });
    await this.saveComments(ismCode, updated);
  }
  
  async toggleReplyLike(ismCode: string, commentId: string, replyId: string): Promise<Reply> {
    const comments = await this.getComments(ismCode);
    let updatedReply: Reply | null = null;
    
    const updated = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: comment.replies.map(reply => {
            if (reply.id === replyId) {
              const newReply = {
                ...reply,
                likes: reply.likedByUser ? reply.likes - 1 : reply.likes + 1,
                likedByUser: !reply.likedByUser,
              };
              updatedReply = newReply;
              return newReply;
            }
            return reply;
          }),
        };
      }
      return comment;
    });
    
    await this.saveComments(ismCode, updated);
    if (!updatedReply) throw new Error('Reply not found');
    return updatedReply;
  }
}

// ==================== 导出服务实例 ====================

/**
 * 全局互动服务实例
 * 
 * 切换到真实数据库时，只需替换这个实例即可：
 * export const interactionService = new SupabaseInteractionService();
 */
export const interactionService = new LocalStorageInteractionService();

// ==================== 使用示例 ====================

/**
 * 组件中使用示例：
 * 
 * import { interactionService } from '../services/interactionService';
 * 
 * // 获取评论
 * const comments = await interactionService.getComments(ismCode);
 * 
 * // 添加评论
 * const newComment = await interactionService.addComment(ismCode, content);
 * 
 * // 点赞评论
 * const updated = await interactionService.toggleCommentLike(ismCode, commentId);
 */
