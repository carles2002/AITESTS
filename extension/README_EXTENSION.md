# Claude Sync Extension - Instalación y Uso

Extensión de Firefox/Zen Browser que sincroniza automáticamente el porcentaje de uso de Claude.ai con el AI Usage Tracker.

## Requisitos

- Firefox 90+ o Zen Browser
- AI Usage Tracker instalado y ejecutándose
- Cuenta de Claude.ai con sesión activa

## Instalación

### Opción 1: Instalación con about:debugging (⭐ Recomendado - Funciona Siempre)

**IMPORTANTE**: Firefox/Zen Browser no permite instalar extensiones no firmadas arrastrando el .xpi. Usa este método en su lugar:

#### Método Recomendado: Instalación desde about:debugging

1. **Abrir Zen Browser o Firefox**

2. **Ir a la página de depuración**:
   - Escribe en la barra de direcciones: `about:debugging#/runtime/this-firefox`
   - Presiona Enter

3. **Cargar la extensión**:
   - Click en **"Cargar complemento temporal..."** (o "Load Temporary Add-on...")
   - Navega a la carpeta: `c:\REPO\AITRACKER\extension\`
   - Selecciona el archivo **`manifest.json`**
   - Click en "Abrir"

4. **Verificar instalación**:
   - Deberías ver "AI Usage Tracker - Claude Sync" en la lista
   - Estado: "Habilitado" o "Enabled"

5. **Abrir el tracker**:
   - Ve a: `http://localhost:8080/ai-usage-tracker.html`
   - (o ejecuta `iniciar-tracker.bat` si no está corriendo)

6. **Probar**:
   - Haz clic en "🔄 Sincronizar desde Claude.ai"
   - Debe funcionar correctamente

**Nota**: Este método mantiene la extensión instalada mientras el navegador esté abierto. Si cierras el navegador, deberás repetir estos pasos.

---

#### Método B: Instalación Manual desde about:addons

1. Abrir Zen Browser o Firefox
2. Navegar a `about:addons`
3. Hacer clic en el ícono de engranaje ⚙️ (arriba a la derecha)
4. Seleccionar **"Install Add-on From File..."**
5. Navegar a `c:\REPO\AITRACKER\`
6. Seleccionar `claude-sync.xpi`
7. Confirmar instalación

---

### Opción 2: Desarrollo/Temporal (Para Desarrolladores)

Esta opción es ideal para pruebas o desarrollo. La extensión se desinstala automáticamente al cerrar el navegador.

1. Abrir Zen Browser o Firefox
2. Navegar a `about:debugging#/runtime/this-firefox`
3. Click en "Load Temporary Add-on" (Cargar complemento temporal)
4. Navegar a la carpeta `AITRACKER/extension/`
5. Seleccionar el archivo `manifest.json`
6. Verificar que aparece "AI Usage Tracker - Claude Sync" en la lista

**Nota**: Cada vez que cierres el navegador, deberás repetir estos pasos.

### Opción 2: Permanente (Firefox Add-ons)

Esta opción permite instalar la extensión de forma permanente.

**Método A: Empaquetado local (desarrollo)**
1. Comprimir todos los archivos de la carpeta `extension/` en un archivo `.zip`
2. Renombrar la extensión de `.zip` a `.xpi`
3. En Firefox, ir a `about:addons`
4. Click en el ícono de engranaje ⚙️
5. Seleccionar "Install Add-on From File"
6. Seleccionar el archivo `.xpi` creado

**Método B: Publicación oficial (futuro)**
[Pendiente de publicación en Firefox Add-ons]

## Uso

### Sincronización Básica

1. Abre el AI Usage Tracker en tu navegador
2. Localiza el botón "🔄 Sincronizar desde Claude.ai" debajo del campo de porcentaje
3. Presiona el botón
4. La extensión:
   - Abre automáticamente `claude.ai/settings/usage` en una nueva pestaña
   - Extrae el porcentaje de uso actual
   - Cierra la pestaña automáticamente
   - Rellena el campo de entrada con el valor extraído
5. Revisa el valor auto-rellenado
6. Presiona "Registrar Prompt" para guardar

**Tiempo estimado**: 5-10 segundos

### Estados del Botón

El botón cambia de aspecto según el estado de la sincronización:

- **🔄 Azul** (Reposo): Listo para sincronizar
- **⏳ Gris** (Sincronizando): Procesando, botón deshabilitado
- **✓ Verde** (Éxito): Sincronización completada, muestra el valor extraído
- **✗ Rojo** (Error): Falló la sincronización, muestra mensaje de error

### Modos de Entrada

La extensión respeta el modo de entrada configurado en el tracker:

- **Modo "% Consumido"**: Muestra el valor tal como aparece en Claude.ai
- **Modo "% Restante"**: Convierte automáticamente (100 - valor_consumido)

Ejemplo: Si Claude.ai muestra "15.5% usado"
- Modo Consumido → Campo muestra `15.50`
- Modo Restante → Campo muestra `84.50`

## Solución de Problemas

### Error: "Extensión no instalada"

**Síntoma**: Al presionar "Sincronizar", aparece este error inmediatamente.

**Causa**: La extensión no está cargada o fue desinstalada.

**Solución**:
1. Verificar en `about:debugging#/runtime/this-firefox` que la extensión aparece en la lista
2. Si no aparece, reinstalar siguiendo los pasos de instalación
3. Recargar la página del tracker (F5)

### Error: "Por favor, inicia sesión en Claude.ai primero"

**Síntoma**: Se abre una nueva pestaña con `claude.ai/login`.

**Causa**: No hay sesión activa en Claude.ai.

**Solución**:
1. Iniciar sesión en la pestaña que se abrió automáticamente
2. Cerrar la pestaña de login
3. Volver al tracker
4. Presionar "Sincronizar" nuevamente

### Error: "Timeout: La página tardó demasiado en cargar"

**Síntoma**: Después de 10-15 segundos, aparece este error.

**Causas posibles**:
- Conexión a internet lenta
- Claude.ai experimentando problemas
- Página cargando muy lentamente

**Solución**:
1. Verificar conexión a internet
2. Intentar abrir `claude.ai/settings/usage` manualmente para ver si carga
3. Esperar un momento y reintentar
4. Si persiste, registrar el prompt manualmente

### Error: "No se encontró el porcentaje"

**Síntoma**: La extensión no pudo localizar el porcentaje en la página.

**Causa**: La estructura HTML de Claude.ai cambió.

**Solución**:
1. Verificar manualmente que en `claude.ai/settings/usage` aparece el porcentaje
2. Reportar el problema (ver sección "Reportar Problemas")
3. Mientras tanto, registrar prompts manualmente
4. Esperar actualización de la extensión

### El botón no aparece en el tracker

**Síntoma**: No hay botón "Sincronizar desde Claude.ai" en el formulario.

**Causa**: El archivo HTML del tracker no se actualizó correctamente.

**Solución**:
1. Verificar que estás usando la versión actualizada de `ai-usage-tracker.html`
2. Recargar la página con caché limpio (Ctrl+Shift+R)
3. Verificar en la consola del navegador (F12) si hay errores JavaScript

## Permisos Requeridos

La extensión solicita los siguientes permisos:

| Permiso | Propósito |
|---------|-----------|
| `activeTab` | Para interactuar con la pestaña activa |
| `tabs` | Para abrir y cerrar pestañas de Claude.ai |
| `*://claude.ai/*` | Para acceder a páginas de Claude.ai |

**Nota de privacidad**: La extensión **NO** almacena ningún dato personal ni información de sesión. Solo extrae el porcentaje de uso visible en la página.

## Desinstalación

### Extensión Temporal
1. Cerrar el navegador (se desinstala automáticamente)

### Extensión Permanente
1. Ir a `about:addons`
2. Buscar "AI Usage Tracker - Claude Sync"
3. Click en los tres puntos (⋮)
4. Seleccionar "Remove" (Eliminar)

## Debugging

### Ver Logs de la Extensión

**Background Script**:
1. Ir a `about:debugging#/runtime/this-firefox`
2. Buscar "AI Usage Tracker - Claude Sync"
3. Click en "Inspect" (Inspeccionar)
4. Abrir la pestaña "Console"
5. Los logs comienzan con `[Claude Sync BG]`

**Content Script**:
1. Abrir `claude.ai/settings/usage` manualmente
2. Presionar F12 para abrir herramientas de desarrollo
3. Ir a la pestaña "Console"
4. Los logs comienzan con `[Claude Sync]`

**Tracker HTML**:
1. Con el tracker abierto, presionar F12
2. Ir a la pestaña "Console"
3. Los logs comienzan con `[Tracker]`

### Logs Esperados (Sincronización Exitosa)

```
[Tracker] Iniciando sincronización con Claude.ai...
[Claude Sync BG] Mensaje recibido: {action: "syncUsage"}
[Claude Sync BG] Abriendo pestaña: https://claude.ai/settings/usage
[Claude Sync BG] Pestaña creada: 1234
[Claude Sync BG] Esperando renderizado React (2s)...
[Claude Sync] Content script cargado en: https://claude.ai/settings/usage
[Claude Sync] Intentando extraer porcentaje...
[Claude Sync] ✓ Porcentaje extraído: 15.5
[Claude Sync BG] ✅ Sincronización exitosa
[Tracker] Respuesta de la extensión: {success: true, percentage: 15.5}
[Tracker] ✓ Sincronización completada exitosamente
```

## Reportar Problemas

Si encuentras un problema no listado aquí:

1. **Recopilar información**:
   - Navegador y versión (Zen Browser / Firefox XX)
   - Logs de la consola (ver sección Debugging)
   - Captura de pantalla del error

2. **Crear un issue en GitHub**:
   - [Enlace al repositorio]
   - Incluir toda la información recopilada
   - Describir pasos para reproducir el problema

3. **Workaround temporal**:
   - Continuar registrando prompts manualmente
   - Esperar actualización de la extensión

## Limitaciones Conocidas

- La extensión solo funciona si el usuario está autenticado en Claude.ai
- Requiere que `claude.ai/settings/usage` sea accesible
- Dependiente de la estructura HTML de Claude.ai (puede romperse con actualizaciones)
- No funciona en modo offline
- Timeout de 10 segundos para páginas lentas

## Preguntas Frecuentes

**¿Puedo usar la extensión en Chrome/Edge?**
La extensión está diseñada para Firefox/Zen Browser. Para Chrome/Edge necesitarías adaptar el manifest a `manifest_version: 3`.

**¿La extensión consume muchos recursos?**
No. Solo se activa cuando presionas el botón "Sincronizar" y se cierra inmediatamente después.

**¿Puedo automatizar la sincronización cada X minutos?**
Actualmente no está soportado. Es una mejora futura planeada (v1.2).

**¿Qué pasa si Claude.ai cambia su interfaz?**
La extensión puede dejar de funcionar. Reporta el problema y espera una actualización.

**¿Por qué la extensión abre una pestaña visible?**
Para seguridad y transparencia. Algunas versiones futuras podrían hacerlo en background.

## Actualizaciones

### v1.0.0 (Inicial)
- Sincronización manual desde Claude.ai
- Soporte para Firefox y Zen Browser
- Detección de autenticación
- Manejo de errores básico
- Múltiples selectores de fallback

### Roadmap Futuro
- v1.1: Auto-detección de modelo usado (Sonnet/Haiku/Opus)
- v1.2: Sincronización periódica automática
- v1.3: Popup con estadísticas rápidas
- v1.4: Soporte para Chrome/Edge

---

**Desarrollado para**: AI Usage Tracker v3.0
**Licencia**: [Especificar]
**Soporte**: [Email/GitHub]
