@echo off
title UNSAID Anonymous Feedback Server
echo ====================================================
echo Starting UNSAID Anonymous Feedback on http://localhost:3000
echo ====================================================
cd /d "%~dp0"
call npm.cmd run dev
pause
