# 互动功能服务接口文档

## 📋 概述

本项目的互动功能（点赞、评论、回复）已经通过服务层进行了抽象，便于后续接入真实数据库。

当前使用 **localStorage** 作为临时存储方案，所有数据仅保存在用户本地浏览器中。

---

## 🏗️ 架构设计

```
组件层 (Components)
    ↓ 调用
服务接口层 (interactionService)
    ↓ 实现
数据存储层 (localStorage / Supabase / Firebase 等)
```

### 优势

- ✅ **解耦设计**：组件不直接操作数据，只通过接口调用
- ✅ **易于替换**：切换数据源时只需修改 `interactionService.ts`
- ✅ **统一接口**：所有数据操作都返回 Promise，兼容异步 API
- ✅ **类型安全**：完整的 TypeScript 类型定义

---

## 📁 文件结构

```
/services/
  └── interactionService.ts    # 服务接口定义与实现
  └── README.md               # 本文档

/components/
  ├── IsmDetail.tsx           # 主义详情页（使用点赞服务）
  ├── CommentSection.tsx      # 评论区组件（使用评论服务）
  └── Comment.tsx             # 单条评论组件（使用回复服务）
```

---

## 🔌 接口说明

### 数据类型

```typescript
// 用户
interface User {
  id: string;
  name: string;
  avatar?: string;
}

// 回复（支持@功能）
interface Reply {
  id: string;
  author: User;
  content: string;
  timestamp: number;
  likes: number;
  likedByUser: boolean;
  replyToUser?: User;  // 回复目标用户
}

// 评论
interface Comment {
  id: string;
  author: User;
  content: string;
  timestamp: number;
  likes: number;
  likedByUser: boolean;
  replies: Reply[];
}

// 主义点赞
interface IsmLikes {
  totalLikes: number;
  isLikedByUser: boolean;
}
```

### 服务接口

```typescript
interface IInteractionService {
  // 用户相关
  getCurrentUser(): Promise<User>;
  setCurrentUser(user: User): Promise<void>;
  
  // 主义点赞
  getIsmLikes(ismCode: string): Promise<IsmLikes>;
  toggleIsmLike(ismCode: string): Promise<IsmLikes>;
  
  // 评论
  getComments(ismCode: string): Promise<Comment[]>;
  addComment(ismCode: string, content: string): Promise<Comment>;
  deleteComment(ismCode: string, commentId: string): Promise<void>;
  toggleCommentLike(ismCode: string, commentId: string): Promise<Comment>;
  
  // 回复
  addReply(ismCode: string, commentId: string, content: string, replyToUser?: User): Promise<Reply>;
  deleteReply(ismCode: string, commentId: string, replyId: string): Promise<void>;
  toggleReplyLike(ismCode: string, commentId: string, replyId: string): Promise<Reply>;
}
```

---

## 🚀 如何切换到真实数据库

### 方案一：Supabase（推荐）

#### 1. 创建 Supabase 项目并设计数据表

```sql
-- 用户表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 主义点赞表
CREATE TABLE ism_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ism_code TEXT NOT NULL,
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(ism_code, user_id)
);

-- 评论表
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ism_code TEXT NOT NULL,
  author_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 评论点赞表
CREATE TABLE comment_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comment_id UUID REFERENCES comments(id),
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- 回复表
CREATE TABLE replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comment_id UUID REFERENCES comments(id),
  author_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  reply_to_user_id UUID REFERENCES users(id),
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 回复点赞表
CREATE TABLE reply_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reply_id UUID REFERENCES replies(id),
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(reply_id, user_id)
);
```

#### 2. 创建 SupabaseInteractionService

```typescript
// /services/supabaseInteractionService.ts

import { createClient } from '@supabase/supabase-js';
import { IInteractionService, User, Comment, Reply, IsmLikes } from './interactionService';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export class SupabaseInteractionService implements IInteractionService {
  async getCurrentUser(): Promise<User> {
    // 实现 Supabase 用户获取逻辑
    const { data: { user } } = await supabase.auth.getUser();
    // ... 转换为 User 类型
  }
  
  async getIsmLikes(ismCode: string): Promise<IsmLikes> {
    // 查询 ism_likes 表
    const { data, error } = await supabase
      .from('ism_likes')
      .select('*')
      .eq('ism_code', ismCode);
    // ... 处理数据
  }
  
  // ... 实现其他方法
}
```

#### 3. 切换服务实例

```typescript
// /services/interactionService.ts

// 注释掉原来的实现
// export const interactionService = new LocalStorageInteractionService();

// 使用新的 Supabase 实现
import { SupabaseInteractionService } from './supabaseInteractionService';
export const interactionService = new SupabaseInteractionService();
```

---

### 方案二：Firebase

#### 1. 初始化 Firebase

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // 你的 Firebase 配置
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
```

#### 2. 创建 FirebaseInteractionService

```typescript
export class FirebaseInteractionService implements IInteractionService {
  async getComments(ismCode: string): Promise<Comment[]> {
    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef, where('ismCode', '==', ismCode));
    const snapshot = await getDocs(q);
    // ... 转换数据
  }
  
  // ... 实现其他方法
}
```

---

### 方案三：自定义后端 API

```typescript
export class RestAPIInteractionService implements IInteractionService {
  private baseUrl = 'https://your-api.com';
  
  async getComments(ismCode: string): Promise<Comment[]> {
    const response = await fetch(`${this.baseUrl}/comments?ismCode=${ismCode}`);
    return await response.json();
  }
  
  async addComment(ismCode: string, content: string): Promise<Comment> {
    const response = await fetch(`${this.baseUrl}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ismCode, content }),
    });
    return await response.json();
  }
  
  // ... 实现其他方法
}
```

---

## 💡 使用示例

### 在组件中使用

```typescript
import { interactionService } from '../services/interactionService';

// 获取评论
const comments = await interactionService.getComments('1-2-3-4');

// 添加评论
const newComment = await interactionService.addComment('1-2-3-4', '这是我的评论');

// 点赞评论
await interactionService.toggleCommentLike('1-2-3-4', commentId);

// 添加回复（带@功能）
await interactionService.addReply(
  '1-2-3-4',        // ismCode
  commentId,        // 评论ID
  '@用户123 我同意你的观点', // 内容
  { id: 'xxx', name: '用户123' } // 被回复的用户
);
```

---

## ✅ 功能清单

### 已实现功能

- [x] 主义详情页点赞功能
- [x] 发表评论
- [x] 点赞评论
- [x] 回复评论
- [x] 回复别人的回复（@功能）
- [x] 点赞回复
- [x] 时间格式化显示
- [x] 用户名自动生成
- [x] 数据持久化（localStorage）

### 待实现功能（切换数据库后可扩展）

- [ ] 用户认证与登录
- [ ] 实时评论更新
- [ ] 评论删除功能
- [ ] 评论编辑功能
- [ ] 评论举报功能
- [ ] @用户自动补全
- [ ] 评论表情功能
- [ ] 评论排序（热门/最新）
- [ ] 分页加载

---

## 📝 注意事项

1. **当前 localStorage 限制**：
   - 数据仅存储在用户本地浏览器
   - 不同用户之间无法看到彼此的互动
   - 清除浏览器数据会丢失所有记录

2. **切换数据库前的准备**：
   - 确保新的实现类完全符合 `IInteractionService` 接口
   - 进行充分的测试
   - 考虑数据迁移方案

3. **安全性考虑**：
   - 添加用户认证
   - 实现内容审核
   - 防止恶意刷赞/刷评论
   - 设置频率限制（Rate Limiting）

---

## 🤝 贡献指南

如果你要添加新的互动功能：

1. 在 `interactionService.ts` 中更新接口定义
2. 在当前实现类中添加方法
3. 更新组件以使用新功能
4. 更新本文档

---

## 📞 联系方式

如有问题或建议，请在项目中提出 Issue。
