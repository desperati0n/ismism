@echo off
REM 启动“主义主义”本地开发服务器并自动打开浏览器

REM 切换到当前脚本所在目录（ismism 项目根目录）
cd /d %~dp0

REM 如是第一次运行，可以先取消下一行注释执行依赖安装
REM call npm install

REM 在新终端窗口里启动 Vite 开发服务器
start "" cmd /c "npm run dev"

REM 等几秒让服务启动起来（如机器较慢可把 3 改大一点）
timeout /t 3 /nobreak >nul

REM 打开浏览器访问本地站点（Vite 默认是 5173 端口）
start "" http://localhost:5173

REM 保持当前窗口片刻（可按需要删掉）
timeout /t 2 >nul



