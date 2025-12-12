# Claude Code Metrics - Grafana Dashboard

Dashboard de Grafana para visualizar métricas de OpenTelemetry de Claude Code.

> Last updated: 2025-12-12

## Requisitos

- Docker Desktop instalado y ejecutándose
- Claude Code con telemetría habilitada

## Inicio Rápido

### 1. Iniciar los servicios

```bash
# Windows
start.bat

# O con docker-compose directamente
docker-compose up -d
```

### 2. Configurar Claude Code para enviar métricas

Configura la variable de entorno para que Claude Code envíe telemetría:

```bash
# Windows (PowerShell)
$env:CLAUDE_CODE_ENABLE_TELEMETRY="1"

# O en settings.json de Claude Code
{
  "telemetry": {
    "enabled": true
  }
}
```

### 3. Acceder a Grafana

- **URL**: http://localhost:3000
- **Usuario**: admin
- **Password**: admin

El dashboard "Claude Code Metrics" estará disponible en la carpeta "Claude Code".

## Servicios

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| Grafana | 3000 | Visualización de métricas |
| Prometheus | 9090 | Almacenamiento de métricas |
| OTel Collector (gRPC) | 4317 | Receptor OTLP gRPC |
| OTel Collector (HTTP) | 4318 | Receptor OTLP HTTP |

## Métricas Disponibles

El dashboard muestra:

- **Tokens de Entrada/Salida**: Rate de tokens procesados
- **Total Tokens**: Contadores acumulados
- **Peticiones API**: Número de llamadas a la API
- **Latencia**: Tiempo de respuesta promedio
- **Uso de Herramientas**: Frecuencia de uso por herramienta

## Detener Servicios

```bash
# Windows
stop.bat

# O con docker-compose
docker-compose down
```

## Troubleshooting

### No aparecen métricas

1. Verifica que Claude Code está enviando telemetría:
   ```bash
   curl http://localhost:8889/metrics
   ```

2. Revisa los logs del collector:
   ```bash
   docker logs otel-collector
   ```

3. Verifica que Prometheus está scrapeando:
   - Accede a http://localhost:9090/targets
   - El target `claude-code-metrics` debe estar UP

### Error de conexión Docker

Asegúrate de que Docker Desktop está ejecutándose antes de iniciar los servicios.
