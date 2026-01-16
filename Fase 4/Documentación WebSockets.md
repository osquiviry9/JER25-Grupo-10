# Documentación WebSockets Fase 4

Esta sección detalla la arquitectura de red implementada para el modo multijugador en tiempo real.  
La comunicación se basa en el protocolo **WebSocket** (utilizando la librería `ws` en **Node.js**) y mensajes estructurados en formato **JSON**.

## 1. Arquitectura de Mensajería

El servidor actúa como un **Broadcaster**  con gestión de estado de salas.  
No simula la física completa, sino que sincroniza los estados y eventos críticos entre los clientes.

Todos los mensajes siguen esta estructura base:

```json
{
  "type": "NOMBRE_DEL_EVENTO",
  "payload": {
    "dato1": "valor",
    "dato2": "valor"
  }
}
```



## 2. Diagramas de Flujo 

### A. Flujo de Conexión y Matchmaking

El siguiente diagrama ilustra cómo dos jugadores se unen a la cola pública y son emparejados por el servidor en una nueva sala.

![Diagrama de flujo de conexión y matchmaking](FotosWS/FlujoConexion.png)
*Figura: Flujo de conexión y matchmaking entre jugadores y servidor.*

### B. Sincronización de Partida (Race Loop)

Una vez en la carrera, la sincronización garantiza que ambos vean los mismos obstáculos y movimientos.
Se puede ver en el siguiente diagrama:

![Diagrama de la sincronización de la partida](FotosWS/FlujoSync.png)
*Figura: Sincronización de los jugadores y servidor en la partida.*

## 3. Catálogo de eventos

## Gestión de Salas (LobbyScene)

| Tipo de Mensaje       | Dirección              | Descripción                                                                 |
|----------------------|------------------------|------------------------------------------------------------------------------|
| joinQueue          | Cliente → Servidor     | Solicita unirse a la cola de emparejamiento pública.                         |
| queueStatus      | Servidor → Cliente     | Confirma que el jugador está esperando rival.                                |
| matchFound       | Servidor → Cliente     | Notifica que se ha encontrado partida. Incluye roomId y role (player1 / player2). |
| createPrivateRoom  | Cliente → Servidor     | Solicita crear una sala privada. Devuelve un código de 4 letras.             |
| joinPrivateRoom   | Cliente → Servidor     | Solicita unirse a una sala privada específica mediante código.               |


## Selección de Personaje (OnlineSelectScene)

| Tipo de Mensaje            | Dirección              | Descripción                                                                 |
|----------------------------|------------------------|------------------------------------------------------------------------------|
| characterSelect        | Cliente → Servidor     | Envía el índice del personaje seleccionado y si ha confirmado (confirmed: true). |
| characterSelectUpdate    | Servidor → Cliente     | Retransmite la elección al rival para actualizar su interfaz en tiempo real. |
| startGame               | Cliente → Servidor     | Señal enviada cuando ambos están listos.                                    |
| startGameSignal          | Servidor → Cliente     | Ordena a ambos clientes cambiar a la escena de juego (RaceScene).         |


## Durante el Juego (RaceScene)

| Tipo de Mensaje           | Dirección                    | Descripción                                                                 |
|---------------------------|------------------------------|------------------------------------------------------------------------------|
| gameSync                | P1 → Servidor → P2           | El Player 1 genera la semilla del nivel (obstáculos) y la envía al Player 2 para que el mapa sea idéntico. |
| playerUpdate           | Cliente → Servidor           | Envía posición Y, % de progreso y vidas. Se envía cada 50 ms (throttling) para evitar saturación. |
| raceEvent               | Cliente → Servidor           | Sincroniza acciones puntuales: jump, accel, kawiki (ataque).           |
| opponentDisconnected    | Servidor → Cliente           | Informa si el rival cerró la conexión. Otorga la victoria automática al jugador restante. |


## 4. Técnicas de Compensación de Lag

Para cumplir con los requisitos de fluidez en tiempo real, se han implementado las siguientes estrategias en el cliente (RaceScene.js):

1. **Interpolación Lineal**  
   Al recibir una actualización de posición del rival (playerUpdate), no se teletransporta el sprite inmediatamente.  
   Si la diferencia de posición es mayor a 50px, se aplica un *Tween* de 100 ms para suavizar el movimiento visual.

2. **Throttling**  
   El envío de paquetes de posición se limita a intervalos de 50 ms para no sobrecargar el ancho de banda,  
   mientras que los eventos críticos (raceEvent) se envían instantáneamente.

   3. **Client-Side Prediction**  
   El jugador local se mueve instantáneamente sin esperar confirmación del servidor, garantizando  
   “cero latencia” en el control propio.




