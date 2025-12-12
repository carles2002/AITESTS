@echo off
echo ============================================
echo   Reiniciando Servicios - Fix de Red
echo ============================================
echo.

cd /d "%~dp0"

echo [1/4] Deteniendo contenedores...
docker-compose down
timeout /t 2 /nobreak >nul

echo [2/4] Eliminando red antigua (si existe)...
docker network rm grafana_monitoring >nul 2>&1

echo [3/4] Iniciando servicios de nuevo...
docker-compose up -d

echo [4/4] Verificando red Docker...
echo.
docker network inspect grafana_monitoring --format "Network: {{.Name}}" 2>nul
docker network inspect grafana_monitoring --format "Containers:" 2>nul
docker network inspect grafana_monitoring --format "{{range .Containers}}  - {{.Name}}{{end}}" 2>nul

echo.
echo ============================================
echo   Servicios reiniciados
echo ============================================
echo.
echo Esperando 10 segundos para que los servicios esten listos...
timeout /t 10 /nobreak >nul

echo Abriendo Prometheus targets...
start http://localhost:9090/targets

echo.
echo Verifica que los targets esten UP (verde)
echo.
pause
