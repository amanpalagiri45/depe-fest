@echo off
title AIMEX 2K26 Local Server
echo Starting AIMEX 2K26 Local Server...
echo Open your browser at: http://localhost:8000/
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
