// content-script.js - Extrae el porcentaje de uso de Claude.ai

(function() {
  'use strict';

  console.log('[Claude Sync] Content script cargado en:', window.location.href);

  // Configuración de selectores (robustos con múltiples fallbacks)
  const SELECTORS = {
    // Intentar múltiples selectores por si la estructura cambia
    usagePercentage: [
      '[data-testid="usage-percentage"]',
      '.usage-percentage',
      '[aria-label*="usage"]',
      '[aria-label*="usado"]',
      'div:has-text("%")',  // Selector experimental
      '*'  // Último recurso: buscar en todos los elementos
    ],
    authIndicator: [
      '[data-testid="user-menu"]',
      '.user-profile',
      'button[aria-label*="Account"]',
      'button[aria-label*="Cuenta"]',
      '[data-testid="user-avatar"]'
    ],
  };

  // Configuración de timeouts
  const MAX_WAIT_TIME = 10000; // 10 segundos
  const CHECK_INTERVAL = 500;  // Revisar cada 500ms

  /**
   * Extrae el porcentaje de uso del DOM
   * @returns {number|null} Porcentaje como número o null si no se encuentra
   */
  function extractUsagePercentage() {
    console.log('[Claude Sync] Intentando extraer porcentaje...');

    // Estrategia 1: Buscar usando selectores específicos
    for (const selector of SELECTORS.usagePercentage.slice(0, -1)) {
      try {
        const elements = document.querySelectorAll(selector);

        for (const element of elements) {
          const text = element.textContent || element.innerText || '';
          const percentage = parsePercentageFromText(text);

          if (percentage !== null) {
            console.log('[Claude Sync] ✓ Porcentaje extraído con selector:', selector, '→', percentage);
            return percentage;
          }
        }
      } catch (error) {
        console.warn('[Claude Sync] Error con selector:', selector, error);
      }
    }

    // Estrategia 2: Buscar en todo el documento (último recurso)
    console.log('[Claude Sync] Intentando búsqueda exhaustiva en el DOM...');
    const allText = document.body.innerText || document.body.textContent || '';
    const percentage = parsePercentageFromText(allText);

    if (percentage !== null) {
      console.log('[Claude Sync] ✓ Porcentaje extraído de búsqueda exhaustiva:', percentage);
      return percentage;
    }

    console.warn('[Claude Sync] No se pudo extraer el porcentaje');
    return null;
  }

  /**
   * Parsea un porcentaje desde un texto
   * @param {string} text
   * @returns {number|null}
   */
  function parsePercentageFromText(text) {
    if (!text) return null;

    console.log('[Claude Sync] Analizando texto:', text.substring(0, 100) + '...');

    // Buscar patrón de porcentaje: "15.5%" o "15,5%" o "15.5 %"
    // También capturar variantes como "0% usado", "used 15.5%", etc.
    const patterns = [
      /(\d+[.,]\d+)\s*%/,      // "15.5%" o "15,5%"
      /(\d+)\s*%/,             // "15%"
      /(\d+[.,]\d+)\s*percent/i, // "15.5 percent"
      /(\d+)\s*percent/i       // "15 percent"
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);

      if (match) {
        // Convertir coma a punto para parseFloat
        const percentageStr = match[1].replace(',', '.');
        const percentage = parseFloat(percentageStr);

        if (!isNaN(percentage) && percentage >= 0 && percentage <= 100) {
          console.log('[Claude Sync] Match encontrado:', match[0], '→ parseado:', percentage);
          return percentage;
        }
      }
    }

    return null;
  }

  /**
   * Extrae el tiempo de reseteo ("Se restablece en X h Y min")
   * @returns {Object|null} {hours: number, minutes: number} o null si no se encuentra
   */
  function extractResetTime() {
    console.log('[Claude Sync] Intentando extraer tiempo de reseteo...');

    // Buscar el texto "Se restablece en" en toda la página
    const bodyText = document.body.innerText || document.body.textContent || '';

    // Regex para "Se restablece en X h Y min" o variaciones
    // Ejemplos: "Se restablece en 1 h 46 min", "Se restablece en 30 min", "Se restablece en 2 h"
    const timeRegex = /Se restablece en\s+(?:(\d+)\s*h\s*)?(?:(\d+)\s*min)?/i;
    const match = bodyText.match(timeRegex);

    if (match) {
      const hours = match[1] ? parseInt(match[1]) : 0;
      const minutes = match[2] ? parseInt(match[2]) : 0;

      console.log('[Claude Sync] ✓ Tiempo de reseteo extraído:', hours, 'h', minutes, 'min');

      return {
        hours: hours,
        minutes: minutes
      };
    }

    console.warn('[Claude Sync] No se encontró el texto de tiempo de reseteo');
    return null;
  }

  /**
   * Verifica si el usuario está autenticado
   * @returns {boolean}
   */
  function isAuthenticated() {
    for (const selector of SELECTORS.authIndicator) {
      const element = document.querySelector(selector);
      if (element) {
        console.log('[Claude Sync] ✓ Usuario autenticado (encontrado:', selector, ')');
        return true;
      }
    }

    // Verificación adicional: buscar elementos comunes en páginas autenticadas
    const authenticatedKeywords = ['settings', 'usage', 'account', 'profile'];
    const bodyText = (document.body.innerText || '').toLowerCase();

    for (const keyword of authenticatedKeywords) {
      if (bodyText.includes(keyword)) {
        console.log('[Claude Sync] ✓ Usuario probablemente autenticado (keyword:', keyword, ')');
        return true;
      }
    }

    console.warn('[Claude Sync] Usuario no autenticado');
    return false;
  }

  /**
   * Espera a que el porcentaje esté disponible en el DOM
   * @returns {Promise<number>}
   */
  function waitForUsagePercentage() {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      let attemptCount = 0;

      const checkInterval = setInterval(() => {
        attemptCount++;
        const elapsed = Date.now() - startTime;

        console.log(`[Claude Sync] Intento ${attemptCount} (${(elapsed / 1000).toFixed(1)}s transcurridos)...`);

        // Timeout
        if (elapsed > MAX_WAIT_TIME) {
          clearInterval(checkInterval);

          if (!isAuthenticated()) {
            console.error('[Claude Sync] Timeout: Usuario no autenticado');
            reject(new Error('NOT_AUTHENTICATED'));
          } else {
            console.error('[Claude Sync] Timeout: No se encontró el porcentaje');
            reject(new Error('TIMEOUT'));
          }
          return;
        }

        // Intentar extraer
        const percentage = extractUsagePercentage();

        if (percentage !== null) {
          clearInterval(checkInterval);
          console.log(`[Claude Sync] ✅ Éxito después de ${attemptCount} intentos (${(elapsed / 1000).toFixed(1)}s)`);
          resolve(percentage);
        }
      }, CHECK_INTERVAL);
    });
  }

  /**
   * Maneja solicitudes del background script
   */
  if (typeof browser !== 'undefined' && browser.runtime && browser.runtime.onMessage) {
    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log('[Claude Sync] Mensaje recibido:', message);

      if (message.action === 'extractUsage') {
        // Respuesta asíncrona
        waitForUsagePercentage()
          .then(percentage => {
            console.log('[Claude Sync] Porcentaje obtenido:', percentage);

            // También extraer el tiempo de reseteo
            const resetTime = extractResetTime();

            const response = {
              success: true,
              percentage: percentage,
              timestamp: new Date().toISOString()
            };

            // Añadir tiempo si se encontró
            if (resetTime) {
              response.resetTime = resetTime;
              console.log('[Claude Sync] Enviando respuesta exitosa con tiempo:', percentage, '%,', resetTime.hours, 'h', resetTime.minutes, 'min');
            } else {
              console.log('[Claude Sync] Enviando respuesta exitosa (sin tiempo):', percentage, '%');
            }

            sendResponse(response);
          })
          .catch(error => {
            console.error('[Claude Sync] Enviando respuesta de error:', error.message);
            sendResponse({
              success: false,
              error: error.message
            });
          });

        // Indicar que la respuesta será asíncrona
        return true;
      }
    });

    console.log('[Claude Sync] Content script inicializado correctamente (Firefox API)');
  } else if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    // Fallback para Chrome/Edge/Zen con Chrome API
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log('[Claude Sync] Mensaje recibido (Chrome API):', message);

      if (message.action === 'extractUsage') {
        waitForUsagePercentage()
          .then(percentage => {
            console.log('[Claude Sync] Porcentaje obtenido:', percentage);

            // También extraer el tiempo de reseteo
            const resetTime = extractResetTime();

            const response = {
              success: true,
              percentage: percentage,
              timestamp: new Date().toISOString()
            };

            // Añadir tiempo si se encontró
            if (resetTime) {
              response.resetTime = resetTime;
              console.log('[Claude Sync] Enviando respuesta exitosa con tiempo:', percentage, '%,', resetTime.hours, 'h', resetTime.minutes, 'min');
            } else {
              console.log('[Claude Sync] Enviando respuesta exitosa (sin tiempo):', percentage, '%');
            }

            sendResponse(response);
          })
          .catch(error => {
            console.error('[Claude Sync] Enviando respuesta de error:', error.message);
            sendResponse({
              success: false,
              error: error.message
            });
          });

        return true;
      }
    });

    console.log('[Claude Sync] Content script inicializado correctamente (Chrome API)');
  } else {
    console.error('[Claude Sync] ❌ API de extensión no disponible');
  }

})();
