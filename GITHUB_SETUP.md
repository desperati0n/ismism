# GitHub 发布和同步指南

本指南将帮助你把这个项目发布到 GitHub 并保持同步。

## 📋 前置准备

1. **确保已安装 Git**
   ```bash
   git --version
   ```
   如果没有，请前往 https://git-scm.com/ 下载安装

2. **确保已注册 GitHub 账号**
   如果没有，请前往 https://github.com/ 注册

## 🚀 步骤 1：在 GitHub 上创建新仓库

1. 登录 GitHub
2. 点击右上角的 `+` 号，选择 `New repository`
3. 填写仓库信息：
   - **Repository name**: `ismism` 或 `zhuyi-zhuyi`（你喜欢的名字）
   - **Description**: 主义主义 - 哲学理论体系交互式网页
   - **Visibility**: 选择 Public（公开）或 Private（私有）
   - **不要**勾选 "Initialize this repository with a README"（因为我们本地已有代码）
4. 点击 `Create repository`

## 📦 步骤 2：初始化本地 Git 仓库

打开终端，进入项目目录：

```bash
cd works\vibecoding\ismism
```

### 2.1 初始化 Git（如果还没有初始化）

```bash
git init
```

### 2.2 配置 Git 用户信息（如果还没有配置）

```bash
git config --global user.name "你的GitHub用户名"
git config --global user.email "你的GitHub邮箱"
```

或者只为这个项目配置：

```bash
git config user.name "你的GitHub用户名"
git config user.email "你的GitHub邮箱"
```

## 📝 步骤 3：添加文件到 Git

### 3.1 添加所有文件

```bash
git add .
```

### 3.2 查看将要提交的文件

```bash
git status
```

### 3.3 提交文件

```bash
git commit -m "Initial commit: 主义主义项目初始化"
```

## 🔗 步骤 4：连接到 GitHub 远程仓库

### 4.1 添加远程仓库

将 `YOUR_USERNAME` 和 `YOUR_REPO_NAME` 替换为你的实际信息：

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

例如：
```bash
git remote add origin https://github.com/yourusername/ismism.git
```

### 4.2 验证远程仓库

```bash
git remote -v
```

应该显示你的远程仓库地址。

## 📤 步骤 5：推送到 GitHub

### 5.1 设置默认分支为 main（如果还没有）

```bash
git branch -M main
```

### 5.2 推送到 GitHub

```bash
git push -u origin main
```

如果是第一次推送，GitHub 可能会要求你登录。按照提示操作即可。

## 🔄 步骤 6：日常更新和同步

每次修改代码后，使用以下命令同步到 GitHub：

### 6.1 查看修改的文件

```bash
git status
```

### 6.2 添加修改的文件

```bash
git add .
```

或者只添加特定文件：

```bash
git add App.tsx components/GridSlider.tsx
```

### 6.3 提交修改

```bash
git commit -m "描述你的修改内容"
```

例如：
```bash
git commit -m "修复搜索逻辑：正确处理第一个格子的$"
git commit -m "添加新的主义模块"
git commit -m "优化UI样式"
```

### 6.4 推送到 GitHub

```bash
git push
```

## 📥 步骤 7：从 GitHub 同步到本地（如果有多台设备）

如果在其他设备上修改了代码，或者想获取最新版本：

```bash
git pull
```

这会自动合并远程的更改到本地。

## 🌿 分支管理（可选，高级用法）

### 创建新分支

```bash
git checkout -b feature/new-feature
```

### 切换分支

```bash
git checkout main
```

### 合并分支到 main

```bash
git checkout main
git merge feature/new-feature
```

## 🔍 常用 Git 命令速查

```bash
# 查看提交历史
git log

# 查看当前状态
git status

# 撤销工作区的修改
git restore <file>

# 查看远程仓库
git remote -v

# 拉取最新代码
git pull

# 推送代码
git push
```

## ⚠️ 常见问题

### 问题 1：推送时要求输入用户名密码

**解决方案**：使用 Personal Access Token (PAT)

1. 前往 GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
2. 生成新 token，勾选 `repo` 权限
3. 使用 token 作为密码推送

或者配置 SSH 密钥（推荐）：

```bash
# 生成 SSH 密钥
ssh-keygen -t ed25519 -C "your_email@example.com"

# 复制公钥内容
cat ~/.ssh/id_ed25519.pub
```

然后将公钥添加到 GitHub Settings > SSH and GPG keys

使用 SSH 地址连接：
```bash
git remote set-url origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
```

### 问题 2：推送被拒绝（rejected）

**原因**：远程仓库有本地没有的提交

**解决方案**：
```bash
git pull --rebase origin main
git push
```

### 问题 3：.gitignore 不生效

**解决方案**：
```bash
# 清除缓存
git rm -r --cached .
git add .
git commit -m "Update .gitignore"
```

## 📚 推荐的 GitHub 工作流

1. **修改代码前**：先拉取最新代码 `git pull`
2. **修改代码**
3. **测试代码**：确保项目可以正常运行
4. **提交代码**：`git add .` → `git commit -m "描述"` → `git push`

## 🎯 下一步

项目发布到 GitHub 后，你可以：

1. **添加 README 徽章**：显示构建状态、版本等信息
2. **配置 GitHub Pages**：部署静态网站
3. **使用 GitHub Actions**：自动化构建和部署
4. **添加 Issues 和 Projects**：管理任务和功能请求

---

**提示**：如果遇到任何问题，可以查看 Git 官方文档或 GitHub 帮助文档。

