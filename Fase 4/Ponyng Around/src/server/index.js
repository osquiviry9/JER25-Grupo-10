import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { WebSocketServer } from 'ws';

// Servicios (factory functions)
import { createUserService } from './services/userService.js';
import { createMessageService } from './services/messageService.js';
import { createConnectionService } from './services/connectionService.js';

// Controladores (factory functions)
import { createUserController } from './controllers/userController.js';
import { createMessageController } from './controllers/messageController.js';
import { createConnectionController } from './controllers/connectionController.js';

// Rutas (factory functions)
import { createUserRoutes } from './routes/users.js';
import { createMessageRoutes } from './routes/messages.js';
import { createConnectionRoutes } from './routes/connections.js';

// ==================== CONFIG BÁSICA ====================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Necesario para leer JSON en body

app.use(express.json());

// ==================== SERVICIOS ====================

const userService = createUserService();
const messageService = createMessageService();
const connectionService = createConnectionService();

// ==================== CONTROLADORES ====================

const userController = createUserController(userService);
const messageController = createMessageController(messageService);
const connectionController = createConnectionController(connectionService);

// ==================== RUTAS REST ====================

// Healthcheck
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Ponyng Around server running' });
});

// API REST
console.log(userController);

app.use('/api/users', createUserRoutes(userController));
app.use('/api/messages', createMessageRoutes(messageController));
app.use('/api/connected', createConnectionRoutes(connectionController));

// ==================== SERVIR EL JUEGO ====================

// Carpeta dist generada por Webpack (bundle + assets)
const distPath = path.join(__dirname, '..', '..', 'dist');
app.use(express.static(distPath));

// Ruta principal → index.html del juego
app.get('/', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// ==================== SERVIDOR HTTP + WEBSOCKETS ====================

// Creamos el servidor HTTP a partir de la app de Express
const server = http.createServer(app);

// Creamos el servidor WebSocket sobre el mismo servidor HTTP
const wss = new WebSocketServer({ server });

// Estructuras para matchmaking muy simple (2 jugadores)
let waitingPlayer = null; // socket que está esperando rival
let nextRoomId = 1;

function createRoomId() {
  const id = `room_${nextRoomId}`;
  nextRoomId += 1;
  return id;
}

// Pequeño helper para mandar JSON por WebSocket
function wsSend(ws, obj) {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(obj));
  }
}

// Cuando un cliente WebSocket se conecta
wss.on('connection', (ws) => {
  console.log('Nuevo cliente WebSocket conectado');

  // Metadatos de la conexión
  ws.roomId = null;
  ws.role = null; // 'player1' | 'player2'

  ws.on('message', (data) => {
    let msg;

    try {
      msg = JSON.parse(data.toString());
    } catch (err) {
      console.error('- Mensaje inválido (no es JSON):', data.toString());
      return;
    }

    const { type, payload } = msg;
    // console.log('📩 Mensaje WS recibido:', msg);

    switch (type) {
      // Cliente quiere entrar en la cola de emparejamiento
      case 'joinQueue': {
        if (waitingPlayer == null) {
          // Nadie esperando → este se queda en la cola
          waitingPlayer = ws;
          ws.role = 'player1';
          console.log('- Cliente se pone a la cola (player1 en espera)');

          wsSend(ws, {
            type: 'queueStatus',
            payload: { status: 'waiting' }
          });
        } else {
          // Ya había alguien esperando → emparejamos
          const roomId = createRoomId();
          const player1 = waitingPlayer;
          const player2 = ws;

          waitingPlayer = null;

          player1.roomId = roomId;
          player1.role = 'player1';

          player2.roomId = roomId;
          player2.role = 'player2';

          console.log(`- Sala creada: ${roomId} (player1 + player2)`);

          // Avisamos a ambos de que hay partida
          wsSend(player1, {
            type: 'matchFound',
            payload: {
              roomId,
              role: 'player1'
            }
          });

          wsSend(player2, {
            type: 'matchFound',
            payload: {
              roomId,
              role: 'player2'
            }
          });
        }
        break;
      }

      // Cliente abandona la cola (por ejemplo, se vuelve al menú)
      case 'leaveQueue': {
        if (waitingPlayer === ws) {
          waitingPlayer = null;
          console.log('- Cliente salió de la cola de espera');
        }
        break;
      }

      // Actualización del estado del jugador (posición, velocidad, etc.)
      // Esto lo reenviamos al rival en la misma sala
      case 'playerUpdate': {
        const { roomId, state } = payload || {};
        if (!roomId || !state) return;

        // Buscamos al rival en la misma sala
        wss.clients.forEach((client) => {
          if (
            client !== ws &&
            client.readyState === client.OPEN &&
            client.roomId === roomId
          ) {
            wsSend(client, {
              type: 'playerUpdate',
              payload: {
                from: ws.role,
                state
              }
            });
          }
        });
        break;
      }

      // Evento genérico de la carrera (colisión, powerUp, fin de carrera, etc.)
      case 'raceEvent': {
        const { roomId, event } = payload || {};
        if (!roomId || !event) return;

        // reenviamos al rival
        wss.clients.forEach((client) => {
          if (
            client !== ws &&
            client.readyState === client.OPEN &&
            client.roomId === roomId
          ) {
            wsSend(client, {
              type: 'raceEvent',
              payload: {
                from: ws.role,
                event
              }
            });
          }
        });
        break;
      }

      default:
        console.warn('- Tipo de mensaje WS no reconocido:', type);
    }
  });

  ws.on('close', () => {
    console.log('🔌 Cliente WebSocket desconectado');

    // Si estaba esperando en la cola, lo quitamos
    if (waitingPlayer === ws) {
      waitingPlayer = null;
    }

    // Podríamos notificar al rival de que su oponente se ha desconectado:
    const { roomId } = ws;
    if (roomId) {
      wss.clients.forEach((client) => {
        if (
          client !== ws &&
          client.readyState === client.OPEN &&
          client.roomId === roomId
        ) {
          wsSend(client, {
            type: 'opponentDisconnected',
            payload: { roomId }
          });
        }
      });
    }
  });
});

// ==================== ERROR HANDLER ====================

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor'
  });
});

// ==================== INICIO DEL SERVIDOR ====================

server.listen(PORT, () => {
  console.log('========================================');
  console.log(`   Ponyng Around server levantado en http://localhost:${PORT}`);
  console.log(`   Juego: http://localhost:${PORT}`);
  console.log(`  `);
  console.log(`  API Endpoints disponibles:`);
  console.log(`   - GET    /health`);
  console.log(`   - POST   /api/connected`);
  console.log(`   - GET    /api/users`);
  console.log(`   - POST   /api/users`);
  console.log(`   - GET    /api/users/:id`);
  console.log(`   - PUT    /api/users/:id`);
  console.log(`   - DELETE /api/users/:id`);
  console.log(`   - GET    /api/messages`);
  console.log(`   - POST   /api/messages`);
  console.log('========================================\n');
});
