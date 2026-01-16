/**
 * Service para gestionar las conexiones activas de usuarios
 */
export function createConnectionService() {
  const connectedSessions = new Map();

  // Configuración de timeout (5 segundos sin actividad = desconectado)
  const CONNECTION_TIMEOUT = 5000; 
  const CLEANUP_INTERVAL = 2000;   

  // Limpiar sesiones inactivas periódicamente
  const cleanupInterval = setInterval(() => {
    const now = Date.now();

    for (const [sessionId, lastSeen] of connectedSessions.entries()) {
      if (now - lastSeen > CONNECTION_TIMEOUT) {
        console.log(`🔴 [${new Date().toLocaleTimeString()}] Jugador DESCONECTADO (Timeout) | ID: ${sessionId.slice(-5)}`);
        
        connectedSessions.delete(sessionId);
      }
    }
  }, CLEANUP_INTERVAL);

  return {
    /**
     * Registrar/actualizar una sesión conectada.
     */
    updateConnection(sessionId) {
      const now = Date.now();
      
      if (!connectedSessions.has(sessionId)) {
          console.log(`🟢 [${new Date().toLocaleTimeString()}] ¡NUEVO JUGADOR Conectado! | ID: ${sessionId.slice(-5)}`);
      }

      connectedSessions.set(sessionId, now);
      return connectedSessions.size;
    },

    removeConnection(sessionId) {
      if (connectedSessions.has(sessionId)) {
          console.log(`¡¡ATENCIÓN!! [${new Date().toLocaleTimeString()}] Jugador salió voluntariamente | ID: ${sessionId.slice(-5)}`);
      }
      connectedSessions.delete(sessionId);
    },

    getConnectedCount() {
      return connectedSessions.size;
    },

    stopCleanup() {
      clearInterval(cleanupInterval);
    }
  };
}