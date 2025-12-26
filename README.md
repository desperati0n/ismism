# 主义主义 | Ism-ism

> 基于未明子「主义主义」理论的哲学意识形态检索工具

[![Deploy to GitHub Pages](https://github.com/desperati0n/ismism/actions/workflows/deploy.yml/badge.svg)](https://github.com/desperati0n/ismism/actions/workflows/deploy.yml)

## ✨ 在线体验

🔗 **[https://desperati0n.github.io/ismism/](https://desperati0n.github.io/ismism/)**

## 📖 什么是主义主义？

「主义主义」是未明子提出的一套哲学意识形态分析框架。通过四位数字编码 `X-X-X-X`，可以精确定位任意意识形态在哲学坐标系中的位置：

| 维度 | 含义 | 说明 |
|------|------|------|
| **场域 (Ontology)** | 世界观框架 | 1=统一 2=二元 3=中介 4=虚无 |
| **本体 (Body)** | 真实存在 | 构成世界的根本实在 |
| **现象 (Phenomenon)** | 感知体验 | 主体如何体验世界 |
| **目的 (Purpose)** | 终极目标 | 意识形态的最终指向 |

例如：`1-1-1-1` = 科学独断论，`2-1-1-1` = 阿派朗主义

## 🎯 功能特点

- 🔍 **编码检索** - 通过四位编码精确查找主义
- 🃏 **通配符搜索** - 使用 `$` 作为通配符（如 `1-$-$-1`）
- 📊 **四格分析** - 展示场域/本体/现象/目的的详细解读
- 📚 **知识延伸** - 相关概念、电影、思想家推荐
- ❓ **问答解析** - Q&A 形式深入理解核心观点
- 🎨 **实验风格 UI** - 黑白+粉色先锋设计

## 📊 数据统计

| 项目 | 数量 |
|------|------|
| 总主义数 | **192** |
| 1字头 (科学实在论系) | 64 |
| 2字头 (形而上学系) | 64 |
| 3字头 (现象学系) | 64 |
| 含四格分析 | 178 (93%) |
| 含知识延伸 | 51 |
| 含问答 | 16 |

## 🚀 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

应用将在 `http://localhost:5173` 启动

## 📁 项目结构

```
ismism/
├── App.tsx                 # 主应用组件
├── main.tsx                # 应用入口
├── components/
│   ├── GridSlider.tsx      # 四格滑动选择器
│   ├── IsmDetail.tsx       # 主义详情页（四格分析、问答等）
│   ├── ResultCard.tsx      # 搜索结果卡片
│   ├── SearchButton.tsx    # 搜索按钮
│   ├── TopNavigation.tsx   # 顶部导航
│   └── WaveTextBackground.tsx  # 波浪文字背景
├── data/
│   └── isms.ts             # 192个主义数据库
├── styles/
│   └── globals.css         # 全局样式
└── import_isms.py          # 数据导入脚本
```

## 🔧 数据来源

数据来自未明子的「主义主义」系列讲稿笔记，通过 `import_isms.py` 脚本解析 Obsidian Markdown 文件并提取：

- 核心论断
- 四格分析（场域/本体/现象/目的）
- 知识延伸
- 问答解析

## 📚 了解更多

- 🎬 [B站搜索「未明子」](https://search.bilibili.com/all?keyword=未明子)
- 🎬 [YouTube搜索「未明子」](https://www.youtube.com/results?search_query=未明子)

## 📄 License

MIT

---

*本项目仅作学习交流用途，理论内容版权归未明子所有。*

