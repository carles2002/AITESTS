# CLAUDE.md - Notas de Desarrollo AI Usage Tracker

Este archivo documenta las decisiones de implementación y notas técnicas para futuras referencias y mantenimiento.

## Estructura del Proyecto

```
AITESTS/
├── ai-usage-tracker.html    # Aplicación principal (HTML/CSS/JS autocontenido)
├── README_AI_TRACKER.md     # Documentación de usuario
└── CLAUDE.md                # Notas de desarrollo (este archivo)
```

## Historial de Cambios

### v2.2 - Ollama AI Recommendations (Noviembre 2025)

**Funcionalidad añadida:**
- Integración con Ollama para generar recomendaciones de IA basadas en estadísticas diarias
- Widget de recomendaciones en la sección "Estadísticas del Día Actual"
- Toggle estilo iOS para activar/desactivar la funcionalidad
- Botón "Regenerar" para solicitar nuevas recomendaciones bajo demanda

**Decisiones de diseño:**

1. **Solo regeneración manual**: Las recomendaciones NO se generan automáticamente al actualizar la página o registrar prompts. Solo se generan cuando el usuario presiona "Regenerar" para evitar saturar Ollama y mejorar la experiencia de usuario.

2. **Mantener controles visibles cuando está desactivado**: Cuando el toggle está OFF, la sección de recomendaciones sigue visible con el título, toggle y botón "Regenerar" (deshabilitado), pero el contenido muestra el mensaje "Recomendaciones desactivadas".

3. **Persistencia en localStorage**: Se guardan dos claves adicionales:
   - `recommendationsEnabled`: boolean (true por defecto)
   - `ollamaRecommendation`: string con la última recomendación generada

4. **Timeout de 30 segundos**: Para evitar bloqueos si Ollama no responde.

5. **Modelo por defecto**: `gemma3:1b` - modelo ligero y rápido para respuestas concisas.

**Código añadido (secciones principales):**

- **CSS** (líneas ~536-732): Estilos para `.recommendations-section`, `.switch`, `.slider-toggle`, `.btn-regenerate`, estados de loading y error.

- **Variables globales** (líneas ~941-949):
  ```javascript
  const OLLAMA_URL = 'http://localhost:11434/api/generate';
  const OLLAMA_MODEL = 'gemma3:1b';
  const OLLAMA_TIMEOUT = 30000;
  let recommendationsEnabled = ...;
  let ollamaRecommendation = ...;
  let isGeneratingRecommendation = false;
  ```

- **Funciones de Ollama** (líneas ~2334-2536):
  - `initializeRecommendationsListeners()`: Configura event listeners
  - `handleRecommendationToggle()`: Maneja el cambio de estado del toggle
  - `collectDailyStats()`: Recopila estadísticas del día actual
  - `generateOllamaRecommendation()`: Llamada async a la API de Ollama

- **HTML Template** (dentro de `updateTodayStats()`): Template condicional que se renderiza solo si `recommendationsEnabled === true`.

**Manejo de errores:**
- Timeout (AbortController con 30s)
- Conexión fallida (Failed to fetch / NetworkError)
- Errores HTTP
- Respuesta vacía de Ollama

## Arquitectura de Datos

### localStorage Keys

| Clave | Tipo | Descripción |
|-------|------|-------------|
| `currentSessionNumber` | number | Número de sesión actual (1 o 2) |
| `currentSessionPrompts` | array | Prompts de la sesión en curso |
| `lastUsage` | number | Último porcentaje de uso |
| `dailyCost` | number | Coste acumulado del día |
| `completedSessions` | array | Sesiones completadas del día |
| `dailyHistory` | array | Historial de últimos 7 días |
| `inputMode` | string | 'consumed' o 'remaining' |
| `recommendationsEnabled` | string | 'true' o 'false' |
| `ollamaRecommendation` | string | Última recomendación generada |

### Prompt Object Structure

```javascript
{
  timestamp: "2025-11-26T10:30:00.000Z",
  usage: 15.5,        // % acumulado
  consumed: 5.2,      // % consumido en este prompt
  cost: 0.026,        // coste en €
  model: "Sonnet"     // Sonnet | Haiku | Opus
}
```

## Notas de Mantenimiento

### Para cambiar el modelo de Ollama
Modificar la constante en línea ~942:
```javascript
const OLLAMA_MODEL = 'gemma3:1b';  // Cambiar por otro modelo
```

### Para ajustar el timeout
Modificar la constante en línea ~944:
```javascript
const OLLAMA_TIMEOUT = 30000;  // milisegundos
```

### Para modificar el prompt enviado a Ollama
Buscar la función `generateOllamaRecommendation()` (~línea 2434) y modificar el template literal del prompt.

## Testing

Para probar la integración con Ollama:

1. Asegurar que Ollama está corriendo: `ollama serve`
2. Verificar modelo instalado: `ollama list`
3. Si no está gemma3:1b: `ollama pull gemma3:1b`
4. Abrir la aplicación y registrar al menos un prompt
5. En "Estadísticas del Día Actual", presionar "Regenerar"

## Dependencias Externas

- **Ollama**: http://localhost:11434 (opcional, la app funciona sin él)
- Ninguna otra dependencia externa. Todo el código es vanilla HTML/CSS/JS.

---

*Última actualización: Noviembre 2025*
