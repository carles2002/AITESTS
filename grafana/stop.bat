@echo off
echo ============================================
echo   Claude Code Metrics - Detener Servicios
echo ============================================
echo.

cd /d "%~dp0"

echo [1/2] Deteniendo contenedores...
docker-compose down

echo [2/2] Limpiando...
echo.
echo ============================================
echo   Servicios detenidos correctamente
echo ============================================
echo.
echo Presiona cualquier tecla para cerrar
pause >nul
