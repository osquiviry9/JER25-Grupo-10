/**
 * Service para gestionar las conexiones activas de usuarios
 */
export function createConnectionService() {
  // Map para almacenar sesiones conectadas: sessionId -> timestamp de última conexión
  const connectedSessions = new Map();

  // Configuración de timeout (5 segundos sin actividad = desconectado)
  const CONNECTION_TIMEOUT = 5000; // 5 segundos en milisegundos
  const CLEANUP_INTERVAL = 2000;   // Limpiar cada 2 segundos

  // Limpiar sesiones inactivas periódicamente
  const cleanupInterval = setInterval(() => {
    const now = Date.now();

    for (const [sessionId, lastSeen] of connectedSessions.entries()) {
      if (now - lastSeen > CONNECTION_TIMEOUT) {
        connectedSessions.delete(sessionId);
      }
    }
  }, CLEANUP_INTERVAL);

  return {
    /**
     * Registrar/actualizar una sesión conectada.
     * Si la sesión ya existe, solo actualiza el timestamp.
     * Devuelve el número de sesiones activas.
     * @param {string} sessionId
     * @returns {number}
     */
    updateConnection(sessionId) {
      const now = Date.now();
      connectedSessions.set(sessionId, now);
      return connectedSessions.size;
    },

    /**
     * Eliminar una sesión concreta
     * @param {string} sessionId
     */
    removeConnection(sessionId) {
      connectedSessions.delete(sessionId);
    },

    /**
     * Obtener el número de sesiones activas
     * @returns {number}
     */
    getConnectedCount() {
      return connectedSessions.size;
    },

    /**
     * Detener el cleanup interval (útil para testing o shutdown)
     */
    stopCleanup() {
      clearInterval(cleanupInterval);
    }
  };
}
