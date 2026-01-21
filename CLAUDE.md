# CLAUDE.md - Notas de Desarrollo AI Usage Tracker

Este archivo documenta las decisiones de implementación y notas técnicas para futuras referencias y mantenimiento.

## Estructura del Proyecto

```
AITESTS/
├── ai-usage-tracker.html    # Aplicación principal (HTML/CSS/JS autocontenido)
├── iniciar-tracker.bat      # Script de inicio automático (Windows)
├── detener-tracker.bat      # Script para detener servicios (Windows)
├── README_AI_TRACKER.md     # Documentación de usuario
└── CLAUDE.md                # Notas de desarrollo (este archivo)
```

## Historial de Cambios

### v2.3 - Tiempo Restante Personalizado (Diciembre 2025)

**Funcionalidad añadida:**
- Editor de tiempo restante personalizado en la píldora "Tiempo Restante"
- Inputs editables para horas y minutos con botones "Aplicar" y "Resetear"
- Recálculo automático de prompts por hora basado en tiempo personalizado
- Indicador visual (⚙️) cuando se usa tiempo personalizado

**Decisiones de diseño:**

1. **Solo para sesión actual**: El tiempo personalizado solo afecta a la sesión actual. Al completar la sesión o iniciar un nuevo día, se resetea automáticamente al cálculo por defecto (5 horas desde el inicio de sesión).

2. **Persistencia en localStorage**: Se guarda una nueva clave:
   - `customEndTime`: timestamp (milisegundos) | null (usar cálculo automático)
   - Se guarda como timestamp (hora de finalización) para que el tiempo vaya bajando automáticamente

3. **Reseteo automático**: El tiempo personalizado se limpia automáticamente en:
   - `resetSession()`: Al iniciar una nueva sesión (5h)
   - `endDay()`: Al finalizar el día y empezar uno nuevo

4. **Integración con cálculos existentes**: Los cálculos de:
   - Prompts por hora (uniforme/adaptado)
   - Prompts proyectadas (necesarias/al ritmo actual)
   - Tiempo restante de sesión

   Todos usan el tiempo personalizado si está definido, caso contrario usan el cálculo automático.

**Código añadido (secciones principales):**

- **HTML** (líneas ~828-842): Estructura de inputs y botones en stat-card "Tiempo Restante"

- **CSS** (líneas ~97-168): Estilos para `.time-editor`, `.time-input`, `.time-input-group`, `.btn-apply-time`, `.btn-reset-time`

- **Variables globales** (línea ~1183):
  ```javascript
  let customEndTime = null; // Hora de finalización personalizada (timestamp en ms, null = usar cálculo automático)
  ```

- **Funciones** (líneas ~2806-2920):
  - `initializeCustomTimeListeners()`: Configura event listeners
  - `applyCustomTime()`: Calcula hora de finalización (ahora + tiempo ingresado) y la guarda
  - `resetCustomTime()`: Limpia el tiempo personalizado y restaura cálculo automático
  - `updateCustomTimeInputs()`: Calcula tiempo restante desde ahora hasta customEndTime y actualiza inputs

- **Función auxiliar** (líneas ~1117-1129):
  - `removeStorageItem()`: Función segura para eliminar keys del storage

- **Modificación en `updateTodayStats()`** (líneas ~1315-1337): Lógica para calcular tiempo restante desde customEndTime

- **Auto-actualización** (líneas ~3200-3204): setInterval que actualiza estadísticas cada minuto para que el tiempo vaya bajando automáticamente

**Uso:**
1. Introducir horas y/o minutos en los inputs de la píldora "Tiempo Restante"
2. Presionar "Aplicar" → Se guarda la hora de finalización (ahora + tiempo ingresado)
3. El tiempo restante muestra un icono ⚙️ y va bajando automáticamente cada minuto
4. Los inputs también se actualizan automáticamente mostrando el tiempo que queda
5. Presionar "Resetear" para volver al cálculo automático

**Nota importante:** El tiempo baja automáticamente porque se guarda como timestamp de finalización, no como duración estática. Cada minuto se recalcula la diferencia entre "ahora" y la hora de finalización guardada.

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

### v3.0 - Sincronización Automática con Claude.ai (Enero 2026)

**Funcionalidad añadida:**
- Botón "Sincronizar desde Claude.ai" en formulario de registro
- Extrae automáticamente el porcentaje de uso actual desde `claude.ai/settings/usage`
- Auto-rellena el campo de entrada con el valor sincronizado
- Respeta modo "consumido" vs "restante" con conversión automática

**Tecnología:**
- Extensión de Firefox WebExtension (compatible con Zen Browser)
- 3 archivos principales: manifest.json, content-script.js, background.js
- Comunicación vía browser.runtime API

**Decisiones de diseño:**

1. **Sincronización manual**: Solo cuando el usuario presiona el botón, no automática. Evita saturar Claude.ai con requests y da control al usuario.

2. **Extracción robusta del DOM**: Múltiples selectores de fallback para adaptarse a cambios en la estructura de Claude.ai. Si un selector falla, intenta con los siguientes automáticamente.

3. **Manejo de autenticación**: Si el usuario no está logueado en Claude.ai, abre automáticamente la página de login y espera que el usuario inicie sesión.

4. **Estados visuales del botón**: El botón muestra 4 estados con iconos animados:
   - 🔄 Azul (idle): Listo para sincronizar
   - ⏳ Gris (syncing): Procesando, con icono rotando
   - ✓ Verde (success): Completado, muestra el valor extraído
   - ✗ Rojo (error): Error, muestra mensaje específico

5. **Conversión automática según modo**: Si el tracker está en modo "% Restante", convierte automáticamente el valor (100 - valor_consumido).

6. **Apertura temporal de pestaña**: La extensión abre `claude.ai/settings/usage` en una nueva pestaña, extrae el porcentaje, y cierra la pestaña automáticamente. Proceso completo en 3-5 segundos.

**Estructura de archivos (nueva carpeta):**
```
AITRACKER/extension/
├── manifest.json          # Configuración de la extensión
├── content-script.js      # Extracción del DOM de Claude.ai
├── background.js          # Gestión de pestañas y comunicación
└── README_EXTENSION.md    # Documentación de instalación y uso
```

**Código añadido en ai-usage-tracker.html:**

- **HTML** (línea ~959): Botón y contenedor de estado
  ```html
  <div class="sync-button-container">
      <button id="syncFromClaudeBtn" class="btn-sync" onclick="syncFromClaude()">
          <span class="sync-icon">🔄</span>
          <span class="sync-text">Sincronizar desde Claude.ai</span>
      </button>
      <span id="syncStatus" class="sync-status"></span>
  </div>
  ```

- **CSS** (líneas ~298-375): Estilos para `.btn-sync`, `.sync-status`, estados (syncing, success, error), y animación de rotación del icono

- **JS Variables** (línea ~2381): `let isSyncing = false;`

- **JS Funciones** (líneas ~2371-2604):
  - `isExtensionInstalled()`: Verifica si la extensión está cargada
  - `updateSyncButtonState(state, message)`: Actualiza UI del botón según estado
  - `requestUsageFromExtension()`: Envía mensaje a la extensión para solicitar sincronización
  - `syncFromClaude()`: Función principal (230 líneas) que orquesta todo el proceso

**Flujo de sincronización:**
1. Usuario presiona botón "Sincronizar"
2. Tracker verifica que extensión está instalada
3. Envía mensaje a la extensión: `{action: 'syncUsage'}`
4. Extensión abre `claude.ai/settings/usage` en nueva pestaña
5. Espera carga completa (incluye delay de 2s para renderizado React)
6. Content script extrae porcentaje del DOM con regex flexible
7. Cierra pestaña automáticamente
8. Devuelve resultado al tracker
9. Tracker valida y rellena el campo `#currentUsage`
10. Resalta campo con fondo verde temporal (2s)
11. Muestra alerta de éxito

**Manejo de errores:**
- **Extensión no instalada**: Alerta inmediata con instrucciones de instalación
- **Usuario no autenticado**: Abre `claude.ai/login` automáticamente, muestra mensaje
- **Timeout (>10s)**: Cierra pestaña, muestra error, sugiere verificar conexión
- **Selectores no funcionan**: Error "No se encontró porcentaje", sugiere reportar el problema
- **Porcentaje inválido**: Validación adicional, rechaza valores fuera de rango 0-100

**Uso:**
1. Instalar extensión desde `extension/manifest.json` usando `about:debugging` en Firefox/Zen Browser
2. Verificar que aparece "AI Usage Tracker - Claude Sync" en lista de extensiones
3. Abrir ai-usage-tracker.html
4. Presionar "🔄 Sincronizar desde Claude.ai"
5. Esperar 5-10 segundos mientras extrae el %
6. Revisar valor auto-rellenado en el campo
7. Presionar "Registrar Prompt" para guardar

**Selectores del DOM utilizados (con fallbacks):**
```javascript
const SELECTORS = {
  usagePercentage: [
    '[data-testid="usage-percentage"]',
    '.usage-percentage',
    '[aria-label*="usage"]',
    '[aria-label*="usado"]',
    '*' // Búsqueda exhaustiva como último recurso
  ],
  authIndicator: [
    '[data-testid="user-menu"]',
    '.user-profile',
    'button[aria-label*="Account"]'
  ]
};
```

**Regex de extracción:**
- Patrón: `/(\d+[.,]\d+|\d+)\s*%/`
- Soporta: "15.5%", "15,5%", "15%", "15.5 %"
- Normaliza comas a puntos antes de parsear

**Configuración importante:**
- Extension ID en manifest.json: `"id": "claude-sync@aitracker"`
- Extension ID en tracker HTML: `const EXTENSION_ID = 'claude-sync@aitracker';`
- Ambos deben coincidir exactamente

**Nota sobre compatibilidad:**
- Diseñado para Firefox y Zen Browser (manifest_version: 2)
- Zen Browser es un fork de Firefox, por lo que es totalmente compatible
- Para Chrome/Edge se requeriría adaptar a manifest_version: 3

**Limitaciones conocidas:**
- Requiere que el usuario esté autenticado en Claude.ai
- Dependiente de la estructura HTML de Claude.ai (puede romperse con actualizaciones)
- Timeout de 10 segundos para páginas lentas
- No funciona en modo offline

**Mejoras futuras planeadas:**
- v3.2: Auto-detección de modelo usado (Sonnet/Haiku/Opus)
- v3.3: Sincronización periódica automática cada X minutos
- v3.4: Popup de extensión con estadísticas rápidas
- v3.5: Soporte para Chrome/Edge (manifest v3)

### v3.1 - Sincronización Automática del Tiempo Restante (Enero 2026)

**Funcionalidad añadida:**
- Botón "📋" en la tarjeta "Tiempo Restante" que extrae automáticamente el tiempo de reseteo desde Claude.ai
- Extrae el texto "Se restablece en X h Y min" directamente desde `claude.ai/settings/usage`
- Auto-rellena y auto-aplica el tiempo personalizado sin necesidad de confirmación
- Usa la misma extensión de Firefox que el botón de sincronización de porcentaje

**Tecnología:**
- Extensión actualizada para extraer ambos datos: porcentaje y tiempo de reseteo
- Modificaciones en: content-script.js, background.js, ai-usage-tracker.html
- Reutiliza la infraestructura existente de la v3.0

**Decisiones de diseño:**

1. **Reutilización de extensión**: El botón usa la misma extensión que el de porcentaje, en una sola llamada obtiene ambos datos (porcentaje y tiempo).

2. **Extracción del DOM con regex**: Busca el texto "Se restablece en X h Y min" en toda la página usando regex flexible: `/Se restablece en\s+(?:(\d+)\s*h\s*)?(?:(\d+)\s*min)?/i`

3. **Auto-aplicación inmediata**: Como el botón de porcentaje, aplica automáticamente el tiempo sin que el usuario tenga que presionar "Aplicar".

4. **Feedback visual**: Los inputs se resaltan con gradiente azul durante 800ms para confirmar la acción.

5. **Manejo de errores robusto**: Valida que la extensión esté instalada, que el usuario esté autenticado, y que se haya encontrado el tiempo.

**Código modificado:**

- **content-script.js** (líneas ~109-138):
  - Nueva función: `extractResetTime()` que busca "Se restablece en X h Y min" en el DOM
  - Modificación en handlers de mensajes (líneas ~216-251 y ~260-293) para devolver `resetTime` junto con `percentage`

- **background.js** (líneas ~120-135):
  - Modificación para incluir `resetTime` en la respuesta al tracker si está disponible

- **ai-usage-tracker.html** (líneas ~3296-3407):
  - Reescritura completa de `copyCurrentTimeToInputs()` para usar la extensión
  - Ahora es una función `async` que:
    1. Verifica extensión instalada
    2. Llama a `requestUsageFromExtension()`
    3. Extrae `response.resetTime`
    4. Valida los valores
    5. Auto-rellena inputs
    6. Auto-aplica el tiempo
    7. Actualiza estadísticas

**Flujo de uso:**
1. Usuario presiona el botón "📋" en la tarjeta "Tiempo Restante"
2. Extensión abre `claude.ai/settings/usage` en nueva pestaña
3. Extrae tanto el porcentaje como "Se restablece en X h Y min"
4. Cierra la pestaña automáticamente
5. Rellena los inputs de horas/minutos
6. Aplica automáticamente el tiempo personalizado
7. Muestra alerta de éxito
8. **Tiempo total del proceso: ~5-8 segundos**

**Manejo de errores:**
- **Extensión no instalada**: Alerta con mensaje de instalación
- **Usuario no autenticado**: Abre `claude.ai/login` automáticamente
- **Tiempo no encontrado**: Mensaje "No se encontró el tiempo de reseteo"
- **Timeout**: Mensaje de error si tarda más de 10 segundos

**Uso:**
1. Extensión ya instalada desde v3.0
2. Presionar botón "📋" en tarjeta "Tiempo Restante"
3. Esperar 5-8 segundos
4. El tiempo se aplica automáticamente
5. Continuar trabajando con el tiempo personalizado aplicado

**Limitaciones:**
- Requiere que Claude.ai muestre el texto "Se restablece en X h Y min" en español
- Si Claude.ai cambia el formato del texto, la regex puede fallar
- Solo funciona con sesión activa en Claude.ai

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
| `customEndTime` | number | null | Timestamp de hora de finalización personalizada (null = automático) |

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

1. **Configurar CORS** (IMPORTANTE):
   ```powershell
   # En PowerShell como Administrador
   [System.Environment]::SetEnvironmentVariable('OLLAMA_ORIGINS', '*', 'Machine')

   # O bien, para sesión actual:
   $env:OLLAMA_ORIGINS="*"
   ```

2. Asegurar que Ollama está corriendo: `ollama serve`
3. Verificar modelo instalado: `ollama list`
4. Si no está gemma3:1b: `ollama pull gemma3:1b`
5. Abrir la aplicación y registrar al menos un prompt
6. En "Estadísticas del Día Actual", presionar "Regenerar"

### Troubleshooting

**Error 403 / CORS blocked:**
- Causa: Ollama no tiene configurado CORS
- Solución: Configurar `OLLAMA_ORIGINS=*` antes de iniciar Ollama
- Verificar: Abrir consola del navegador (F12) y ver si hay errores de CORS

## Dependencias Externas

- **Ollama**: http://localhost:11434 (opcional, la app funciona sin él)
- Ninguna otra dependencia externa. Todo el código es vanilla HTML/CSS/JS.

---

*Última actualización: Enero 2026*
