@echo off
echo ========================================
echo   AI Usage Tracker - Detener Servicios
echo ========================================
echo.

echo Deteniendo Ollama...
taskkill /F /IM ollama.exe >nul 2>&1
taskkill /F /IM "ollama app.exe" >nul 2>&1

echo Deteniendo servidor web Python...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8080') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo ========================================
echo   Servicios detenidos correctamente
echo ========================================
echo.
pause
