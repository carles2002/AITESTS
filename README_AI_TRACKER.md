# AI Usage Tracker

Una herramienta web moderna y liviana para monitorizar el consumo de modelos de IA. Sin base de datos, completamente funcional en XAMPP o cualquier servidor web básico.

## Características

### Dashboard en Tiempo Real
- **Uso Total**: Visualización del porcentaje de uso acumulado con barra de progreso
- **Coste Total**: Cálculo automático del coste basado en 4.5€ por 5 horas
- **Total Prompts**: Contador de prompts ejecutados
- **Promedio por Prompt**: Consumo medio de cada prompt
- **Prompts/Hora**: Estimación de cuántos prompts puedes hacer por hora
- **Tiempo entre Prompts**: Cálculo de minutos entre cada prompt

### Funcionalidades
- Registro de prompts con timestamp automático
- Cálculo automático de consumo por prompt
- Cálculo de coste individual y total
- Histórico completo con opción de eliminar prompts individuales
- Persistencia de datos con localStorage (no requiere BD)
- Validaciones para evitar errores de entrada
- Diseño responsive para móviles y tablets
- Alertas visuales para feedback del usuario

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

1. **Observa el porcentaje actual** en tu plataforma de IA
2. **Introduce el porcentaje** en el campo "Porcentaje de Uso Actual"
   - Ejemplo: Si la plataforma muestra 15.5%, introduce `15.5`
3. **Haz clic en "Registrar Prompt"**
4. La aplicación calculará automáticamente:
   - Cuánto ha consumido ese prompt específico
   - El coste de ese prompt
   - Actualizará todas las estadísticas

### Ejemplo Práctico

**Situación inicial:**
- Uso actual: 0%
- Ejecutas un prompt
- La plataforma ahora muestra: 3.2%
- Introduces `3.2` y registras
- Resultado: Prompt consumió 3.2% (0.144€)

**Segundo prompt:**
- Uso actual: 3.2%
- Ejecutas otro prompt
- La plataforma ahora muestra: 7.5%
- Introduces `7.5` y registras
- Resultado: Prompt consumió 4.3% (0.194€)

### Botones de Gestión

- **Registrar Prompt**: Guarda el nuevo prompt y actualiza estadísticas
- **Reiniciar Sesión**: Borra el histórico pero mantiene el contador de uso
- **Borrar Todo**: Elimina todos los datos y reinicia a 0%

### Eliminar Prompts Individuales

En el histórico, cada prompt tiene un botón "Eliminar" que permite borrarlo individualmente. Los cálculos se ajustan automáticamente.

## Información Técnica

### Cálculos Realizados

```javascript
// Configuración base
Total de horas: 5h
Coste total: 4.5€
Coste por punto porcentual: 4.5€ / 100 = 0.045€

// Por cada prompt
Consumo = Uso Actual - Uso Anterior
Coste del Prompt = Consumo × 0.045€

// Estadísticas
Promedio por Prompt = Uso Total / Número de Prompts
Prompts por Hora = 100 / Promedio por Prompt
Minutos entre Prompts = 60 / Prompts por Hora
```

### Almacenamiento

Los datos se guardan en `localStorage` del navegador:
- **prompts**: Array con todos los prompts registrados
- **lastUsage**: Último porcentaje de uso registrado

**Nota**: Los datos persisten incluso si cierras el navegador, pero son específicos de cada navegador y dispositivo.

### Características de Diseño

- **Responsive**: Se adapta a móviles, tablets y escritorio
- **Progresivo**: La barra de progreso cambia de color según el uso:
  - Verde/Morado: 0-70%
  - Naranja: 70-90%
  - Rojo: 90-100%
- **Moderno**: Gradientes, sombras y animaciones suaves
- **Accesible**: Tamaños de fuente legibles y contraste adecuado

## Validaciones Implementadas

1. **Rango válido**: El porcentaje debe estar entre 0 y 100
2. **No retroceder**: No puedes introducir un porcentaje menor al anterior
3. **Campos requeridos**: Debes introducir un valor para registrar
4. **Confirmaciones**: Antes de borrar datos importantes

## Casos de Uso

### Monitoreo Básico
Ideal para controlar el consumo de créditos de IA en tiempo real.

### Análisis de Eficiencia
Descubre cuánto consumen tus diferentes tipos de prompts.

### Planificación
Calcula cuántos prompts puedes hacer antes de agotar tu cuota.

### Presupuesto
Mantén el control del gasto en servicios de IA.

## Compatibilidad

- ✅ Chrome/Edge (recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ✅ Cualquier navegador moderno con localStorage

## Personalización

### Cambiar Coste o Horas

Edita las constantes al inicio del JavaScript:

```javascript
const TOTAL_HOURS = 5;      // Cambia las horas
const TOTAL_COST = 4.5;     // Cambia el coste en €
```

### Cambiar Colores

Modifica los gradientes en el CSS:

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

## Soporte

Para problemas o sugerencias, el archivo es completamente autocontenido y puede ser editado con cualquier editor de texto.

---

**Desarrollado para monitoreo de consumo de modelos IA**
**Versión**: 1.0
**Licencia**: Uso libre
