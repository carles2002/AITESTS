// tracker-bridge.js - Puente entre la página web del tracker y la extensión

(function() {
  'use strict';

  console.log('[Bridge] Tracker bridge cargado en:', window.location.href);

  // Determinar qué API usar
  const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

  // SOLUCIÓN: Inyectar código en el contexto de la página web (no aislado)
  const script = document.createElement('script');
  script.textContent = `
    (function() {
      console.log('[Bridge Page] Script inyectado en contexto de página');

      // Exponer API en el contexto de la página
      window.claudeSyncExtension = {
        installed: true,
        version: '1.0.0',

        async syncUsage() {
          console.log('[Bridge Page] syncUsage() llamado');

          return new Promise((resolve, reject) => {
            // Enviar evento personalizado al content script
            const requestId = Date.now() + '_' + Math.random();

            const responseHandler = (event) => {
              if (event.detail && event.detail.requestId === requestId) {
                window.removeEventListener('claudeSync:response', responseHandler);
                console.log('[Bridge Page] Respuesta recibida:', event.detail.response);
                resolve(event.detail.response);
              }
            };

            window.addEventListener('claudeSync:response', responseHandler);

            // Timeout de 30 segundos
            setTimeout(() => {
              window.removeEventListener('claudeSync:response', responseHandler);
              reject(new Error('Timeout esperando respuesta de la extensión'));
            }, 30000);

            // Disparar evento para el content script
            window.dispatchEvent(new CustomEvent('claudeSync:request', {
              detail: { requestId: requestId }
            }));
          });
        }
      };

      console.log('[Bridge Page] window.claudeSyncExtension expuesto');
    })();
  `;

  // Inyectar el script en el DOM para que se ejecute en el contexto de la página
  (document.head || document.documentElement).appendChild(script);
  script.remove(); // Limpiar el script tag después de ejecutar

  console.log('[Bridge] Script inyectado en contexto de página');

  // Content script escucha eventos desde el contexto de la página
  window.addEventListener('claudeSync:request', async (event) => {
    console.log('[Bridge Content] Evento claudeSync:request recibido:', event.detail);

    const requestId = event.detail.requestId;

    try {
      console.log('[Bridge Content] Enviando mensaje a background...');
      const response = await browserAPI.runtime.sendMessage({
        action: 'syncUsage'
      });

      console.log('[Bridge Content] Respuesta del background:', response);

      // Enviar respuesta de vuelta al contexto de la página
      // Usar cloneInto para permitir acceso desde el contexto de la página
      const eventDetail = {
        requestId: requestId,
        response: response
      };

      window.dispatchEvent(new CustomEvent('claudeSync:response', {
        detail: cloneInto(eventDetail, window)
      }));
    } catch (error) {
      console.error('[Bridge Content] Error:', error);

      const errorDetail = {
        requestId: requestId,
        response: {
          success: false,
          error: 'BRIDGE_ERROR',
          message: error.message
        }
      };

      window.dispatchEvent(new CustomEvent('claudeSync:response', {
        detail: cloneInto(errorDetail, window)
      }));
    }
  });

  console.log('[Bridge] Listeners configurados correctamente');
})();
