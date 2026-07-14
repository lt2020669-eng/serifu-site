@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 正在启动台本站本地服务器...
node serve.js
pause
