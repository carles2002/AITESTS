# AI Usage Tracker

Una herramienta web moderna y liviana para monitorizar el consumo de modelos de IA con seguimiento de múltiples sesiones diarias y análisis semanal. Sin base de datos, completamente funcional en XAMPP o cualquier servidor web básico.

## Características

### Dashboard en Tiempo Real
- **Uso Sesión Actual (5h)**: Visualización del porcentaje de uso acumulado de la sesión con barra de progreso
- **Coste Diario Total**: Cálculo del coste de TODAS las sesiones del día (4.1€/día para 8h)
- **Coste Medio/Prompt**: Coste promedio considerando todas las sesiones del día
- **Total Prompts Hoy**: Contador de todos los prompts de todas las sesiones
- **Uso Medio/Prompt**: Consumo medio de la sesión actual
- **Prompts/Hora**: Estimación de cuántos prompts puedes hacer por hora
- **Minutos/Prompt**: Cada cuántos minutos tienes disponible un prompt
- **Indicador de Sesión**: Muestra "Sesión 1 de 2" o "Sesión 2 de 2"

### Funcionalidades Principales

#### Gestión de Sesiones Múltiples
Claude tiene límites de uso que se resetean cada 5 horas, permitiendo 2 sesiones por día:
- **Sesión 1**: Primera ventana de 5h
- **Sesión 2**: Segunda ventana de 5h (después de 5h desde la primera)
- Los límites de uso (%) se resetean cada sesión
- El coste se acumula a través de todas las sesiones del día

#### Registro de Prompts
- Registro con timestamp automático
- Cálculo automático de consumo y coste por prompt
- Histórico completo de la sesión actual
- Opción de eliminar prompts individuales

#### "Nueva Sesión (5h)"
**Comportamiento correcto del reseteo de límites de Claude:**
- Guarda INTERNAMENTE todos los datos de la sesión actual
- Limpia VISUALMENTE el histórico para la nueva sesión
- Resetea el uso a 0% (porque Claude resetea los límites cada 5h)
- **MANTIENE** el coste diario acumulado
- Incrementa el contador de sesión (Sesión 1 → Sesión 2)
- Los datos guardados internamente se exportan al acabar el día

#### "Acabar el Día"
- Guarda TODAS las sesiones del día (completadas + actual) en el historial semanal
- Mantiene los últimos 7 días automáticamente
- Resetea todo para el nuevo día
- Los días antiguos se eliminan automáticamente (máximo 7 días)

#### Análisis Semanal
- Almacenamiento automático de los últimos 7 días
- Estadísticas generales: coste total semanal, prompts totales, promedios diarios
- Desglose detallado por día con todas sus sesiones
- Información por sesión: número de prompts y uso total

#### Exportación de Datos
- Exporta las estadísticas de la última semana en formato JSON
- Incluye resumen general y datos detallados de cada día
- Cada día contiene TODAS sus sesiones con todos los prompts
- Perfecto para análisis externos o backups

### Características Técnicas
- Persistencia de datos con localStorage (no requiere BD)
- Gestión automática de múltiples sesiones por día
- Validaciones para evitar errores de entrada
- Diseño responsive para móviles, tablets y escritorio
- Alertas visuales para feedback del usuario
- Barra de progreso inteligente que cambia de color según el uso

## Modelo de Costes y Límites

El sistema está configurado para reflejar el comportamiento real de Claude:

### Límites de Uso (cada 5h)
- **Sesiones disponibles**: 2 por día
- **Duración por sesión**: 5 horas
- **Reseteo**: Los límites (%) se resetean automáticamente cada 5h
- **Total teórico**: 10h de límites (aunque solo uses 8h reales)

### Coste Diario (8h de trabajo real)
- **Coste diario**: 4.1€ por 8 horas de trabajo real
- **Coste por hora**: 0.5€
- **Cálculo**: Cada punto porcentual de uso = 0.005€
- **Acumulación**: El coste se suma a través de todas las sesiones del día

### Ejemplo de Cálculos
```
Sesión 1 - Prompt consume 3.5% → Coste = 3.5 × 0.005€ = 0.0175€
Sesión 2 - Prompt consume 4.2% → Coste = 4.2 × 0.005€ = 0.021€
Coste total del día = 0.0175€ + 0.021€ + ... = acumulado

Si tienes 16 prompts en 1 hora → 1 prompt cada 3.75 minutos
Promedio de 4% por prompt → ~25 prompts por 100% → ~25 prompts disponibles por sesión
```

## Instalación

### Opción 1: XAMPP
1. Copia `ai-usage-tracker.html` a la carpeta `htdocs` de XAMPP
2. Inicia Apache desde el panel de control de XAMPP
3. Abre el navegador y ve a: `http://localhost/ai-usage-tracker.html`

### Opción 2: Servidor Python
```bash
# En el directorio del archivo:
python -m http.server 8000

# Abre: http://localhost:8000/ai-usage-tracker.html
```

### Opción 3: Abrir Directamente
Simplemente abre el archivo `ai-usage-tracker.html` con tu navegador favorito (doble clic).

## Cómo Usar

### Registrar un Prompt

1. **Ejecuta tu prompt** en Claude
2. **Observa el porcentaje actual** que muestra Claude en la interfaz
3. **Introduce el porcentaje** en el campo "Porcentaje de Uso Actual"
   - Ejemplo: Si Claude muestra 15.5%, introduce `15.5`
4. **Haz clic en "Registrar Prompt"**
5. La aplicación calculará automáticamente:
   - Cuánto ha consumido ese prompt específico
   - El coste de ese prompt
   - Actualizará todas las estadísticas en tiempo real

### Ejemplo Práctico de un Día Completo con 2 Sesiones

**SESIÓN 1 (Mañana - 09:00 a 14:00)**
```
09:00 - Prompt 1: 0% → 3.2%
  Consumo: 3.2% (0.016€)

10:00 - Prompt 2: 3.2% → 7.5%
  Consumo: 4.3% (0.022€)

11:00 - Prompt 3: 7.5% → 12.1%
  Consumo: 4.6% (0.023€)

... continúa hasta 14:00 ...

14:00 - Uso total sesión 1: 45.5%
```

**Dashboard muestra:**
- Uso Sesión Actual: 45.5%
- Coste Diario Total: 0.23€
- Total Prompts Hoy: 15
- Sesión: 1 de 2

**Click en "Nueva Sesión (5h)"**
```
✓ Sesión 1 guardada internamente (15 prompts, 45.5%)
✓ Vista limpiada para nueva sesión
✓ Uso reseteado a 0%
✓ Coste diario mantenido: 0.23€
✓ Ahora en Sesión 2 de 2
```

**SESIÓN 2 (Tarde - 15:00 a 18:00)**
```
15:00 - Prompt 1: 0% → 2.8%
  Consumo: 2.8% (0.014€)

16:00 - Prompt 2: 2.8% → 6.5%
  Consumo: 3.7% (0.019€)

... continúa hasta 18:00 ...

18:00 - Uso total sesión 2: 38.2%
```

**Dashboard muestra:**
- Uso Sesión Actual: 38.2%
- Coste Diario Total: 0.42€ (sesión 1 + sesión 2)
- Total Prompts Hoy: 27 (15 de sesión 1 + 12 de sesión 2)
- Sesión: 2 de 2

**Click en "Acabar el Día"**
```
✓ Día finalizado
✓ 2 sesiones guardadas
✓ 27 prompts totales
✓ Coste total: 0.42€
✓ Datos en historial semanal
✓ Nuevo día comenzado
```

### Gestión de Sesiones

#### Nueva Sesión (5h)
**Cuándo usar**: Después de 5 horas, cuando Claude ha reseteado tus límites

**Qué hace:**
1. Guarda internamente la sesión actual con todos sus datos
2. Limpia la vista del histórico (solo visual)
3. Resetea el uso a 0%
4. Mantiene el coste diario acumulado
5. Cambia a la siguiente sesión

**Importante**: Los datos guardados NO se pierden, se conservan internamente y se exportan al acabar el día.

```
Antes: Sesión 1 - Uso 45%, Coste 0.23€, 15 prompts
Click "Nueva Sesión (5h)"
Después: Sesión 2 - Uso 0%, Coste 0.23€ (conservado), histórico limpio (visual)

Internamente: Sesión 1 guardada con sus 15 prompts y 45% de uso
```

#### Acabar el Día
**Cuándo usar**: Al final de tu jornada laboral (después de 8h de trabajo)

**Qué hace:**
1. Guarda la sesión actual (si tiene datos)
2. Toma TODAS las sesiones del día (completadas + actual)
3. Calcula los totales del día
4. Guarda todo en el historial semanal
5. Resetea completamente para el nuevo día

### Estadísticas Semanales

Después de acabar varios días, verás:

**Resumen General:**
- Coste total semanal
- Total de prompts ejecutados
- Coste medio por día
- Prompts medio por día

**Desglose por Día:**
Cada día muestra:
- Fecha completa
- Número de sesiones realizadas
- Coste total del día
- Total de prompts
- Coste medio por prompt
- **Desglose por sesión:**
  - Sesión 1: X prompts, Y% uso
  - Sesión 2: X prompts, Y% uso

### Exportar Datos

1. Click en el botón "📊 Exportar Datos"
2. Se descargará un archivo JSON con formato:

```json
{
  "exportDate": "2025-11-13T10:30:00.000Z",
  "summary": {
    "totalDays": 7,
    "totalCost": 2.45,
    "totalPrompts": 156,
    "avgDailyCost": 0.35,
    "avgDailyPrompts": 22.3
  },
  "dailyData": [
    {
      "date": "2025-11-13",
      "totalCost": 0.42,
      "totalPrompts": 27,
      "avgCostPerPrompt": 0.016,
      "sessions": [
        {
          "sessionNumber": 1,
          "startTime": "2025-11-13T09:00:00.000Z",
          "endTime": "2025-11-13T14:00:00.000Z",
          "totalUsage": 45.5,
          "prompts": [
            {
              "timestamp": "2025-11-13T09:00:00.000Z",
              "usage": 3.2,
              "consumed": 3.2,
              "cost": 0.016
            },
            ...
          ]
        },
        {
          "sessionNumber": 2,
          "startTime": "2025-11-13T15:00:00.000Z",
          "endTime": "2025-11-13T18:00:00.000Z",
          "totalUsage": 38.2,
          "prompts": [...]
        }
      ]
    }
  ]
}
```

Este archivo JSON puedes:
- Importarlo en Excel/Google Sheets
- Analizarlo con Python/R para estudios detallados
- Guardarlo como backup
- Ver el detalle de cada prompt de cada sesión

## Información Técnica

### Cálculos Realizados

```javascript
// Configuración
Coste por día: 4.1€ (8h de trabajo)
Coste por hora: 0.5€
Coste por punto porcentual: 0.005€

// Por cada prompt
Consumo = Uso Actual - Uso Anterior
Coste del Prompt = Consumo × 0.005€

// Por sesión
Al hacer "Nueva Sesión": Se guarda la sesión en completedSessions[]
Uso se resetea a 0%
Coste diario se mantiene sumando

// Estadísticas
Uso Medio/Prompt = Uso Total Sesión / Número de Prompts Sesión
Prompts/Hora = 100 / Uso Medio por Prompt
Minutos/Prompt = 60 / Prompts por Hora
Coste Medio/Prompt = Coste Total Día / Todos los Prompts del Día
```

### Almacenamiento (localStorage)

La aplicación guarda:
- **currentSessionNumber**: Número de sesión actual (1 o 2)
- **currentSessionPrompts**: Array con prompts de la sesión actual
- **lastUsage**: Último porcentaje de uso de la sesión actual
- **dailyCost**: Coste acumulado del día (todas las sesiones)
- **completedSessions**: Array con sesiones ya completadas del día
- **dailyHistory**: Array con los últimos 7 días (máximo)

**Importante**:
- Los datos persisten incluso si cierras el navegador
- Son específicos de cada navegador y dispositivo
- Las sesiones completadas se guardan internamente hasta acabar el día
- Solo se mantienen los últimos 7 días automáticamente

### Características de Diseño

- **Responsive**: Se adapta a móviles, tablets y escritorio
- **Indicador de sesión**: Badge visual mostrando "Sesión X de 2"
- **Progresivo**: La barra de progreso cambia de color:
  - Verde/Morado: 0-70%
  - Naranja: 70-90%
  - Rojo: 90-100%
- **Moderno**: Gradientes, sombras y animaciones suaves
- **Organizado**: Dashboard → Registro → Histórico sesión actual → Estadísticas semanales

## Validaciones Implementadas

1. **Rango válido**: El porcentaje debe estar entre 0 y 100
2. **No retroceder**: No puedes introducir un porcentaje menor al anterior en la misma sesión
3. **Campos requeridos**: Debes introducir un valor para registrar
4. **Confirmaciones**: Antes de cambiar sesión o acabar el día
5. **Validación al cambiar sesión**: No permite si no hay datos
6. **Validación al acabar día**: No permite acabar el día si no hay datos

## Casos de Uso

### Monitoreo en Tiempo Real
Controla tu consumo de créditos de Claude minuto a minuto.

### Análisis de Eficiencia por Sesión
Descubre si eres más eficiente por la mañana (sesión 1) o por la tarde (sesión 2).

### Planificación de Sesiones
Calcula cuántos prompts puedes hacer en cada sesión de 5h antes de agotar el límite.

### Control de Presupuesto
Mantén el control del gasto diario y semanal en Claude.

### Optimización de Prompts
Identifica qué sesiones son más productivas y ajusta tu forma de trabajar.

### Reporting Semanal Detallado
Exporta datos completos con desglose por sesión para análisis profundos.

## Flujo de Trabajo Recomendado

### Inicio del Día (Sesión 1)
1. Abre la aplicación
2. Verifica que estás en "Sesión 1 de 2"
3. Comienza a trabajar con Claude

### Durante la Sesión 1 (0-5h)
1. Ejecuta un prompt en Claude
2. Observa el % de uso actual en Claude
3. Regístralo inmediatamente en la app
4. Repite para cada prompt

### Cambio de Sesión (después de 5h)
1. Claude resetea tus límites automáticamente
2. Click en "Nueva Sesión (5h)"
3. Confirma el cambio
4. La app limpia la vista y comienza Sesión 2
5. Los datos de Sesión 1 están guardados internamente

### Durante la Sesión 2 (5-10h, usas 3h más)
1. Continúa registrando prompts igual que antes
2. El coste diario sigue acumulándose
3. Puedes ver el total de prompts de ambas sesiones en el dashboard

### Final del Día (después de 8h de trabajo)
1. Revisa tus estadísticas del día
2. Click en "Acabar el Día"
3. Revisa el resumen: X sesiones, Y prompts totales
4. Revisa las estadísticas semanales actualizadas
5. (Opcional) Exporta datos si lo necesitas

### Cada Semana
1. Revisa las estadísticas semanales
2. Compara días con 1 sesión vs 2 sesiones
3. Identifica patrones y mejoras
4. Exporta los datos antes de que se borren automáticamente
5. Analiza el JSON con herramientas externas
6. Ajusta tu estrategia de uso

## Compatibilidad

- ✅ Chrome/Edge (recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ✅ Cualquier navegador moderno con localStorage

## Personalización

### Cambiar Modelo de Coste

Edita las constantes al inicio del JavaScript (línea 497-502):

```javascript
const COST_PER_DAY = 4.1;      // Coste por día
const COST_PER_HOUR = 0.5;     // Coste por hora
const HOURS_PER_DAY = 8;       // Horas de trabajo al día
const USAGE_HOURS = 5;         // Horas por sesión
```

### Cambiar Días en Historial

Modifica la línea 850 para cambiar de 7 días a otro número:

```javascript
if (dailyHistory.length > 7) {  // Cambiar 7 por el número deseado
    dailyHistory = dailyHistory.slice(0, 7);
}
```

### Cambiar Colores

Modifica los gradientes en el CSS:

```css
/* Gradiente principal */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

## Preguntas Frecuentes

**P: ¿Qué pasa si cierro el navegador?**
R: Todos los datos se guardan automáticamente en localStorage y estarán disponibles cuando vuelvas a abrir, incluyendo las sesiones completadas del día.

**P: ¿Los datos de la Sesión 1 se pierden al empezar la Sesión 2?**
R: NO. Los datos se guardan internamente en `completedSessions` y se exportan al acabar el día. Solo se limpia la vista para que empieces desde 0%.

**P: ¿Puedo ver los prompts de la Sesión 1 mientras estoy en la Sesión 2?**
R: No visualmente en el histórico (para mantenerlo limpio), pero están guardados internamente y puedes verlos al exportar o en las estadísticas semanales después de acabar el día.

**P: ¿Qué pasa si solo hago 1 sesión al día?**
R: Perfecto, simplemente no uses "Nueva Sesión (5h)". Al acabar el día se guardará solo 1 sesión.

**P: ¿Puedo hacer 3 sesiones?**
R: La app está diseñada para 2 sesiones (límite de Claude), pero técnicamente podrías incrementar el número. Sin embargo, Claude solo permite 2 ventanas de 5h.

**P: ¿Qué pasa después de 7 días?**
R: El día 8 eliminará automáticamente el día 1, manteniendo siempre los 7 días más recientes.

**P: ¿Puedo recuperar días antiguos?**
R: Si exportaste los datos antes, sí. Por eso recomendamos exportar semanalmente.

**P: ¿Por qué el coste no se resetea con "Nueva Sesión"?**
R: Porque el coste es diario (8h de trabajo total), mientras que el uso se resetea cada sesión de 5h (límite de Claude). Así puedes hacer múltiples sesiones en un día sin perder el registro del coste total.

**P: Si tengo 16 prompts en 1 hora, ¿cuántos minutos tengo por prompt?**
R: 60 minutos / 16 prompts = 3.75 minutos por prompt. La app calcula esto automáticamente.

## Recomendaciones con IA (Ollama)

La aplicación incluye una funcionalidad de recomendaciones inteligentes basadas en IA que analiza tus estadísticas del día y genera consejos personalizados para optimizar tu consumo.

### Requisitos

- **Ollama** instalado y ejecutándose localmente
- Modelo **gemma3:1b** descargado en Ollama

### Instalación de Ollama

1. Descarga e instala Ollama desde: https://ollama.ai/
2. Ejecuta en terminal: `ollama pull gemma3:1b`
3. Asegúrate de que Ollama esté ejecutándose: `ollama serve`
4. Verifica que esté disponible en: `http://localhost:11434`

### Uso de las Recomendaciones

1. **Activar/Desactivar**: Usa el toggle (switch) para mostrar u ocultar las recomendaciones
   - Cuando está desactivado, se muestra el mensaje "Recomendaciones desactivadas" y el botón Regenerar se deshabilita
   - Cuando está activado, puedes ver las recomendaciones y generar nuevas
2. **Regenerar**: Presiona el botón "Regenerar" para obtener una nueva recomendación basada en tus estadísticas actuales
3. **Ubicación**: Las recomendaciones aparecen en la sección "Estadísticas del Día Actual"

### Características

- **Recomendaciones personalizadas**: Basadas en prompts realizados, uso, coste, modelos utilizados y hora pico de actividad
- **40-50 palabras**: Consejos concisos y prácticos
- **Persistencia**: La última recomendación se guarda en localStorage
- **Manejo de errores**: Mensajes claros si Ollama no está disponible
- **Timeout**: 30 segundos máximo de espera

### Preguntas Frecuentes sobre Ollama

**P: ¿Qué pasa si Ollama no está ejecutándose?**
R: Verás un mensaje de error indicando que no se puede conectar. Las demás funcionalidades de la app seguirán funcionando normalmente.

**P: ¿Puedo usar otro modelo de Ollama?**
R: Sí, puedes cambiar la constante `OLLAMA_MODEL` en el código JavaScript. Busca la línea `const OLLAMA_MODEL = 'gemma3:1b';` y cámbiala por el modelo que prefieras.

**P: ¿Las recomendaciones se generan automáticamente?**
R: No, solo se generan cuando presionas el botón "Regenerar" para evitar llamadas innecesarias a la API.

## Soporte

El archivo es completamente autocontenido y puede ser editado con cualquier editor de texto. Todos los cambios persisten automáticamente gracias a localStorage.

---

**Desarrollado para monitoreo profesional de consumo de Claude AI**
**Versión**: 2.2 - Ollama AI Recommendations
**Última actualización**: Noviembre 2025
**Licencia**: Uso libre
