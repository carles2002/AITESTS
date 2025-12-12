@echo off
echo ============================================
echo   Verificacion de Metricas - Claude Code
echo ============================================
echo.

echo [1/4] Verificando servicios Docker...
docker ps --filter "name=otel-collector" --filter "name=prometheus" --filter "name=grafana" --format "table {{.Names}}\t{{.Status}}"
echo.

echo [2/4] Verificando metricas en OTel Collector...
echo Endpoint: http://localhost:8889/metrics
curl -s http://localhost:8889/metrics | findstr "claude_code"
if errorlevel 1 (
    echo       No se encontraron metricas de Claude Code aun
    echo       Usa Claude Code y vuelve a verificar
) else (
    echo       Metricas encontradas!
)
echo.

echo [3/4] Verificando targets en Prometheus...
echo Endpoint: http://localhost:9090/api/v1/targets
curl -s http://localhost:9090/api/v1/targets | findstr "claude-code-metrics"
echo.

echo [4/4] Accesos rapidos:
echo.
echo   - Metricas del Collector: http://localhost:8889/metrics
echo   - Prometheus Targets:     http://localhost:9090/targets
echo   - Prometheus Query:       http://localhost:9090/graph
echo   - Grafana Dashboard:      http://localhost:3000
echo.
echo ============================================
pause
