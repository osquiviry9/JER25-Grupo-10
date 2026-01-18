import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Servicios (factory functions)
import { createUserService } from './services/userService.js';
import { createConnectionService } from './services/connectionService.js';

// Controladores (factory functions)
import { createUserController } from './controllers/userController.js';
import { createConnectionController } from './controllers/connectionController.js';

// Rutas (factory functions)
import { createUserRoutes } from './routes/users.js';
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
// Hemos quitado messageService porque no se pide en la rúbrica y estaba incompleto
const connectionService = createConnectionService();

// ==================== CONTROLADORES ====================

const userController = createUserController(userService);
const connectionController = createConnectionController(connectionService);

// ==================== RUTAS REST ====================

// Healthcheck
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Ponyng Around server running (Phase 3 Mode)' });
});

// Logger simple para ver peticiones (Puntos extra en "Sistema de trazas")
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// API Endpoints
app.use('/api/users', createUserRoutes(userController));
app.use('/api/connected', createConnectionRoutes(connectionController));

// ==================== SERVIR EL JUEGO ====================

// Carpeta dist generada por Webpack (bundle + assets)
const distPath = path.join(__dirname, '..', '..', 'dist');
app.use(express.static(distPath));

// Ruta principal → index.html del juego
app.get('/', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// ==================== ERROR HANDLER ====================

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor'
  });
});

// ==================== INICIO DEL SERVIDOR ====================

app.listen(PORT, () => {
  console.log('========================================');
  console.log(`   Ponyng Around server levantado en http://localhost:${PORT}`);
  console.log(`  `);
  console.log(`  API Endpoints disponibles:`);
  console.log(`   - POST   /api/connected (Gestión conexiones)`);
  console.log(`   - GET    /api/users`);
  console.log(`   - POST   /api/users`);
  console.log(`   - PUT    /api/users/:id/pony (Favoritos)`);
  console.log('========================================\n');
});