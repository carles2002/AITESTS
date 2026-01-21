// background.js - Gestiona la comunicación entre content script y la app tracker

(function() {
  'use strict';

  console.log('[Claude Sync BG] Background script iniciado');

  const CLAUDE_USAGE_URL = 'https://claude.ai/settings/usage';
  const CLAUDE_LOGIN_URL = 'https://claude.ai/login';

  // Determinar qué API usar (Firefox browser o Chrome chrome)
  const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

  /**
   * Abre la página de uso de Claude en una nueva pestaña
   * @returns {Promise<Tab>}
   */
  async function openClaudeUsagePage() {
    console.log('[Claude Sync BG] Abriendo pestaña:', CLAUDE_USAGE_URL);
    return browserAPI.tabs.create({
      url: CLAUDE_USAGE_URL,
      active: false  // No robar el foco
    });
  }

  /**
   * Abre la página de login de Claude
   */
  async function openClaudeLoginPage() {
    console.log('[Claude Sync BG] Abriendo login:', CLAUDE_LOGIN_URL);
    return browserAPI.tabs.create({
      url: CLAUDE_LOGIN_URL,
      active: true  // Darle foco para que el usuario inicie sesión
    });
  }

  /**
   * Extrae el porcentaje de uso desde una pestaña de Claude
   * @param {number} tabId
   * @returns {Promise<Object>}
   */
  async function extractUsageFromTab(tabId) {
    try {
      console.log('[Claude Sync BG] Enviando mensaje al content script en tab:', tabId);

      const response = await browserAPI.tabs.sendMessage(tabId, {
        action: 'extractUsage'
      });

      console.log('[Claude Sync BG] Respuesta del content script:', response);
      return response;
    } catch (error) {
      console.error('[Claude Sync BG] Error al comunicar con content script:', error);
      throw error;
    }
  }

  /**
   * Espera a que una pestaña termine de cargar
   * @param {number} tabId
   * @returns {Promise<void>}
   */
  function waitForTabLoad(tabId) {
    return new Promise((resolve) => {
      console.log('[Claude Sync BG] Esperando carga de tab:', tabId);

      const listener = (updatedTabId, changeInfo, tab) => {
        if (updatedTabId === tabId && changeInfo.status === 'complete') {
          console.log('[Claude Sync BG] Tab cargada:', tabId);
          browserAPI.tabs.onUpdated.removeListener(listener);
          resolve();
        }
      };

      browserAPI.tabs.onUpdated.addListener(listener);

      // Timeout de seguridad (15 segundos)
      setTimeout(() => {
        console.warn('[Claude Sync BG] Timeout de carga de pestaña');
        browserAPI.tabs.onUpdated.removeListener(listener);
        resolve();
      }, 15000);
    });
  }

  /**
   * Maneja mensajes desde la página del tracker
   */
  browserAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('[Claude Sync BG] Mensaje recibido:', message, 'de:', sender);

    if (message.action === 'syncUsage') {
      console.log('[Claude Sync BG] Iniciando sincronización...');

      // Handler asíncrono
      (async () => {
        let tab = null;

        try {
          // 1. Abrir página de uso de Claude
          tab = await openClaudeUsagePage();
          console.log('[Claude Sync BG] Pestaña creada:', tab.id);

          // 2. Esperar a que la página cargue
          await waitForTabLoad(tab.id);
          console.log('[Claude Sync BG] Página cargada completamente');

          // 3. Esperar un poco más para asegurar que React ha renderizado
          console.log('[Claude Sync BG] Esperando renderizado React (2s)...');
          await new Promise(resolve => setTimeout(resolve, 2000));

          // 4. Extraer porcentaje
          console.log('[Claude Sync BG] Extrayendo porcentaje...');
          const result = await extractUsageFromTab(tab.id);

          // 5. Cerrar la pestaña
          console.log('[Claude Sync BG] Cerrando pestaña:', tab.id);
          await browserAPI.tabs.remove(tab.id);

          if (result.success) {
            console.log('[Claude Sync BG] ✅ Sincronización exitosa:', result);

            const response = {
              success: true,
              percentage: result.percentage,
              timestamp: result.timestamp
            };

            // Añadir tiempo de reseteo si está disponible
            if (result.resetTime) {
              response.resetTime = result.resetTime;
              console.log('[Claude Sync BG] Tiempo de reseteo incluido:', result.resetTime.hours, 'h', result.resetTime.minutes, 'min');
            }

            sendResponse(response);
          } else if (result.error === 'NOT_AUTHENTICATED') {
            console.warn('[Claude Sync BG] Usuario no autenticado, abriendo login');
            // Abrir login en vez de cerrar
            await openClaudeLoginPage();
            sendResponse({
              success: false,
              error: 'NOT_AUTHENTICATED',
              message: 'Por favor, inicia sesión en Claude.ai'
            });
          } else {
            console.error('[Claude Sync BG] Error del content script:', result.error);
            sendResponse({
              success: false,
              error: result.error,
              message: 'No se pudo extraer el porcentaje de uso'
            });
          }
        } catch (error) {
          console.error('[Claude Sync BG] Error general:', error);

          // Intentar cerrar la pestaña si se creó
          if (tab && tab.id) {
            try {
              await browserAPI.tabs.remove(tab.id);
            } catch (e) {
              console.warn('[Claude Sync BG] No se pudo cerrar pestaña:', e);
            }
          }

          sendResponse({
            success: false,
            error: 'UNKNOWN_ERROR',
            message: error.message || 'Error desconocido'
          });
        }
      })();

      return true; // Respuesta asíncrona
    }
  });

  // También escuchar mensajes externos (desde la página web)
  if (browserAPI.runtime.onMessageExternal) {
    browserAPI.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
      console.log('[Claude Sync BG] Mensaje externo recibido:', message, 'de:', sender);

      // Reutilizar el mismo handler
      if (message.action === 'syncUsage') {
        // Delegar al handler principal
        browserAPI.runtime.onMessage.dispatch(message, sender, sendResponse);
        return true;
      }
    });
  }

  console.log('[Claude Sync BG] Background script inicializado correctamente');
})();
