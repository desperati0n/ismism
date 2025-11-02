# 主义主义 (Zhuyi Zhuyi)

一个交互式网页应用，用于展示和探索哲学理论体系。

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 📁 项目结构

```
works/vibecoding/
├── App.tsx                 # 主应用组件
├── main.tsx                # 应用入口
├── index.html              # HTML 模板
├── components/             # React 组件
│   ├── GridSlider.tsx      # 可滑动格子组件
│   ├── SearchButton.tsx    # 搜索按钮
│   ├── ResultCard.tsx      # 结果卡片
│   └── TopNavigation.tsx   # 顶部导航栏
├── data/                   # 数据文件
│   └── isms.ts             # 主义数据库和搜索逻辑
├── styles/                 # 样式文件
│   └── globals.css         # 全局样式和动画
├── package.json           # 项目配置
├── tsconfig.json          # TypeScript 配置
├── vite.config.ts         # Vite 配置
└── tailwind.config.js     # Tailwind CSS 配置
```

## 🎮 使用说明

1. **滑动格子**：鼠标悬停在格子上，点击左右箭头切换元素 (1, 2, 3, 4, $)
2. **搜索**：选择好组合后点击蓝色搜索按钮
3. **重置**：点击顶部导航栏的"重置"按钮恢复初始状态
4. **通配符**：
   - 第一个格子的 `$` 代表"主体性缺失"，显示为珊瑚红色
   - 其他格子的 `$` 作为通配符使用，显示为金色

## 🛠️ 技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Tailwind CSS** - 样式框架
- **Lucide React** - 图标库

## 📝 特性

- ✅ 4 个可滑动的格子组件
- ✅ 支持精确匹配和通配符搜索
- ✅ 第一个格子的 `$` 特殊处理（主体性缺失）
- ✅ 平滑的动画效果
- ✅ 响应式设计
- ✅ 符合设计系统规范

## 📄 许可证

MIT

