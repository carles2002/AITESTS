# AI Usage Tracker

Una herramienta web moderna y liviana para monitorizar el consumo de modelos de IA con seguimiento diario y análisis semanal. Sin base de datos, completamente funcional en XAMPP o cualquier servidor web básico.

## Características

### Dashboard en Tiempo Real
- **Uso Total (5h)**: Visualización del porcentaje de uso acumulado con barra de progreso
- **Coste Diario Total**: Cálculo del coste basado en 4.1€/día (8h de trabajo a 0.5€/h)
- **Coste Medio/Prompt**: Coste promedio de cada prompt ejecutado
- **Total Prompts**: Contador de prompts ejecutados hoy
- **Uso Medio/Prompt**: Consumo medio de cada prompt
- **Prompts/Hora**: Estimación de cuántos prompts puedes hacer por hora
- **Minutos/Prompt**: Cada cuántos minutos tienes disponible un prompt

### Funcionalidades Principales

#### Gestión Diaria
- Registro de prompts con timestamp automático
- Cálculo automático de consumo y coste por prompt
- Histórico completo del día con opción de eliminar prompts individuales
- **Reiniciar Sesión**: Borra el histórico de prompts y resetea el uso a 0%, pero mantiene el coste diario acumulado
- **Acabar el Día**: Guarda todas las estadísticas del día en el historial semanal y comienza un nuevo día

#### Análisis Semanal
- Almacenamiento automático de los últimos 7 días
- Estadísticas generales: coste total semanal, prompts totales, promedios diarios
- Desglose detallado por cada día
- Comparativa de rendimiento día a día

#### Exportación de Datos
- Exporta las estadísticas de la última semana en formato JSON
- Incluye resumen general y datos detallados de cada día
- Perfecto para análisis externos o backups

### Características Técnicas
- Persistencia de datos con localStorage (no requiere BD)
- Validaciones para evitar errores de entrada
- Diseño responsive para móviles, tablets y escritorio
- Alertas visuales para feedback del usuario
- Barra de progreso inteligente que cambia de color según el uso

## Modelo de Costes

El sistema está configurado para:
- **Coste diario**: 4.1€ por 8 horas de trabajo
- **Coste por hora**: 0.5€
- **Uso medido**: En bloques de 5 horas
- **Cálculo**: Cada punto porcentual de uso = 0.005€

### Ejemplo de Cálculos
```
Prompt consume 3.5% → Coste = 3.5 × 0.005€ = 0.0175€
16 prompts en 1 hora → 1 prompt cada 3.75 minutos
Promedio de 4% por prompt → ~25 prompts por 100% → ~25 prompts disponibles
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

1. **Ejecuta tu prompt** en la plataforma de IA
2. **Observa el porcentaje actual** que muestra la plataforma
3. **Introduce el porcentaje** en el campo "Porcentaje de Uso Actual"
   - Ejemplo: Si la plataforma muestra 15.5%, introduce `15.5`
4. **Haz clic en "Registrar Prompt"**
5. La aplicación calculará automáticamente:
   - Cuánto ha consumido ese prompt específico
   - El coste de ese prompt
   - Actualizará todas las estadísticas en tiempo real

### Ejemplo Práctico de un Día Completo

**Inicio del día:**
```
09:00 - Prompt 1: 0% → 3.2%
  Consumo: 3.2% (0.016€)

10:00 - Prompt 2: 3.2% → 7.5%
  Consumo: 4.3% (0.022€)

11:00 - Prompt 3: 7.5% → 12.1%
  Consumo: 4.6% (0.023€)
```

**Estadísticas actuales:**
- Uso total: 12.1%
- Coste diario: 0.061€
- Total prompts: 3
- Uso medio/prompt: 4.03%
- Prompts/hora estimados: ~24
- Minutos/prompt: ~2.5 minutos

**Final del día:**
- Click en "Acabar el Día"
- Datos guardados en historial semanal
- Sistema listo para el siguiente día

### Gestión de Sesiones

#### Reiniciar Sesión
**Cuándo usar**: Si quieres empezar a contar desde 0% pero mantener el registro del coste del día
```
Antes: Uso 45%, Coste 0.25€
Después: Uso 0%, Coste 0.25€ (conservado)
```

#### Acabar el Día
**Cuándo usar**: Al final de tu jornada laboral
- Guarda todas las estadísticas en el historial semanal
- Mantiene los últimos 7 días
- Resetea todo para el nuevo día
- Los días más antiguos se eliminan automáticamente (máximo 7 días)

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
- Uso total del día
- Coste total del día
- Total de prompts
- Uso medio por prompt
- Coste medio por prompt

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
      "totalUsage": 85.5,
      "totalCost": 0.43,
      "totalPrompts": 25,
      "avgPerPrompt": 3.42,
      "avgCostPerPrompt": 0.017,
      "prompts": [...]
    }
  ]
}
```

Este archivo JSON puedes:
- Importarlo en Excel/Google Sheets
- Analizarlo con Python/R
- Guardarlo como backup
- Compartirlo con tu equipo

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

// Estadísticas
Uso Medio/Prompt = Uso Total / Número de Prompts
Prompts/Hora = 100 / Uso Medio por Prompt
Minutos/Prompt = 60 / Prompts por Hora
Coste Medio/Prompt = Coste Total / Número de Prompts
```

### Almacenamiento (localStorage)

La aplicación guarda:
- **todayPrompts**: Array con todos los prompts del día actual
- **lastUsage**: Último porcentaje de uso registrado
- **dailyCost**: Coste acumulado del día actual
- **dailyHistory**: Array con los últimos 7 días (máximo)

**Importante**:
- Los datos persisten incluso si cierras el navegador
- Son específicos de cada navegador y dispositivo
- Al acabar el día, los datos se mueven al historial
- Solo se mantienen los últimos 7 días automáticamente

### Características de Diseño

- **Responsive**: Se adapta a móviles, tablets y escritorio
- **Progresivo**: La barra de progreso cambia de color:
  - Verde/Morado: 0-70%
  - Naranja: 70-90%
  - Rojo: 90-100%
- **Moderno**: Gradientes, sombras y animaciones suaves
- **Organizado**: Dashboard → Registro → Histórico del día → Estadísticas semanales

## Validaciones Implementadas

1. **Rango válido**: El porcentaje debe estar entre 0 y 100
2. **No retroceder**: No puedes introducir un porcentaje menor al anterior
3. **Campos requeridos**: Debes introducir un valor para registrar
4. **Confirmaciones**: Antes de borrar o finalizar datos importantes
5. **Validación al acabar día**: No permite acabar el día si no hay datos

## Casos de Uso

### Monitoreo en Tiempo Real
Controla tu consumo de créditos de IA minuto a minuto.

### Análisis de Eficiencia
Descubre qué tipos de prompts consumen más recursos.

### Planificación Diaria
Calcula cuántos prompts puedes hacer antes de agotar tu cuota de 5h.

### Control de Presupuesto
Mantén el control del gasto diario y semanal en servicios de IA.

### Optimización de Prompts
Identifica qué días eres más eficiente y ajusta tu forma de trabajar.

### Reporting Semanal
Exporta datos para reportes a tu equipo o manager.

## Flujo de Trabajo Recomendado

### Inicio del Día
1. Abre la aplicación
2. Verifica que estás en 0% (si es un día nuevo)
3. Comienza a trabajar normalmente

### Durante el Día
1. Ejecuta un prompt en tu plataforma de IA
2. Observa el % de uso actual
3. Regístralo inmediatamente en la app
4. Repite para cada prompt

### Final del Día
1. Revisa tus estadísticas del día
2. Click en "Acabar el Día"
3. Revisa el resumen semanal
4. (Opcional) Exporta datos si lo necesitas

### Cada Semana
1. Revisa las estadísticas semanales
2. Identifica patrones y mejoras
3. Exporta los datos antes de que se borren automáticamente
4. Ajusta tu estrategia de uso

## Compatibilidad

- ✅ Chrome/Edge (recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ✅ Cualquier navegador moderno con localStorage

## Personalización

### Cambiar Modelo de Coste

Edita las constantes al inicio del JavaScript (línea 475-480):

```javascript
const COST_PER_DAY = 4.1;      // Coste por día
const COST_PER_HOUR = 0.5;     // Coste por hora
const HOURS_PER_DAY = 8;       // Horas de trabajo al día
const USAGE_HOURS = 5;         // Horas de uso medidas
```

### Cambiar Días en Historial

Modifica la línea 751 para cambiar de 7 días a otro número:

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
R: Todos los datos se guardan automáticamente en localStorage y estarán disponibles cuando vuelvas a abrir.

**P: ¿Los datos del día actual se guardan automáticamente?**
R: Sí, cada prompt se guarda automáticamente. Solo necesitas "Acabar el Día" para moverlos al historial semanal.

**P: ¿Puedo usar esto en mi móvil?**
R: Sí, la aplicación es completamente responsive y funciona perfectamente en móviles.

**P: ¿Qué pasa después de 7 días?**
R: El día 8 eliminará automáticamente el día 1, manteniendo siempre los 7 días más recientes.

**P: ¿Puedo recuperar días antiguos?**
R: Si exportaste los datos antes, sí. Por eso recomendamos exportar semanalmente.

**P: ¿Por qué "Reiniciar Sesión" mantiene el coste?**
R: Porque el coste es diario (8h), mientras que el uso se resetea cada sesión de 5h. Así puedes hacer múltiples sesiones en un día sin perder el registro del coste total.

## Soporte

El archivo es completamente autocontenido y puede ser editado con cualquier editor de texto. Todos los cambios persisten automáticamente gracias a localStorage.

---

**Desarrollado para monitoreo profesional de consumo de modelos IA**
**Versión**: 2.0
**Última actualización**: Noviembre 2025
**Licencia**: Uso libre
