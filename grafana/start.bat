@echo off
echo ============================================
echo   Claude Code Metrics - Grafana Dashboard
echo ============================================
echo.

cd /d "%~dp0"

REM Verificar que Docker esta corriendo
echo [1/5] Verificando Docker Desktop...
docker info >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERROR: Docker Desktop no esta ejecutandose.
    echo Por favor, inicia Docker Desktop y vuelve a intentarlo.
    echo.
    pause
    exit /b 1
)
echo       Docker OK

REM Detener contenedores previos si existen
echo [2/5] Deteniendo contenedores previos...
docker-compose down >nul 2>&1
timeout /t 2 /nobreak >nul

REM Iniciar servicios
echo [3/5] Iniciando servicios con Docker Compose...
docker-compose up -d

REM Esperar a que los servicios esten listos
echo [4/5] Esperando a que los servicios esten listos...
timeout /t 5 /nobreak >nul

REM Verificar que Grafana responde
:check_grafana
curl -s http://localhost:3000/api/health >nul 2>&1
if errorlevel 1 (
    echo       Esperando Grafana...
    timeout /t 2 /nobreak >nul
    goto check_grafana
)
echo       Grafana OK

REM Abrir navegador
echo [5/5] Abriendo Grafana en el navegador...
start http://localhost:3000

echo.
echo ============================================
echo   TODO LISTO!
echo ============================================
echo.
echo   - Grafana:     http://localhost:3000
echo                  Usuario: admin
echo                  Password: admin
echo.
echo   - Prometheus:  http://localhost:9090
echo.
echo   - OTel Collector:
echo       gRPC:      localhost:4317
echo       HTTP:      localhost:4318
echo.
echo Para enviar metricas de Claude Code, configura:
echo   CLAUDE_CODE_OTEL_ENDPOINT=http://localhost:4318
echo.
echo Presiona cualquier tecla para cerrar esta ventana
echo (los servicios seguiran ejecutandose en segundo plano)
pause >nul
