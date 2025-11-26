@echo off
echo ========================================
echo   AI Usage Tracker - Inicializador
echo ========================================
echo.

REM Detener procesos previos
echo [1/5] Deteniendo procesos previos...
taskkill /F /IM ollama.exe >nul 2>&1
taskkill /F /IM "ollama app.exe" >nul 2>&1
taskkill /F /IM python.exe /FI "WINDOWTITLE eq *http.server*" >nul 2>&1
timeout /t 2 /nobreak >nul

REM Configurar CORS para Ollama
echo [2/5] Configurando CORS para Ollama...
set OLLAMA_ORIGINS=*

REM Iniciar Ollama con CORS habilitado
echo [3/5] Iniciando Ollama con CORS habilitado...
start /B ollama serve
timeout /t 3 /nobreak >nul

REM Iniciar servidor web Python
echo [4/5] Iniciando servidor web en http://localhost:8080...
cd /d "%~dp0"
start /B python -m http.server 8080
timeout /t 2 /nobreak >nul

REM Abrir navegador
echo [5/5] Abriendo navegador...
start http://localhost:8080/ai-usage-tracker.html

echo.
echo ========================================
echo   TODO LISTO!
echo ========================================
echo.
echo - Tracker: http://localhost:8080/ai-usage-tracker.html
echo - Ollama: http://localhost:11434 (CORS habilitado)
echo.
echo Presiona cualquier tecla para cerrar esta ventana
echo (los servicios seguiran ejecutandose en segundo plano)
pause >nul
