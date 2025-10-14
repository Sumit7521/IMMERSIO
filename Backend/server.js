// server.js
import 'dotenv/config';
import { createServer } from 'http';
import { Server as ColyseusServer } from 'colyseus';
import { WebSocketTransport } from '@colyseus/ws-transport';
import { monitor } from '@colyseus/monitor';
import connectDB from './src/db/db.js';
import MetaverseRoom from './src/rooms/MetaverseRoom.js';
import { initSocket } from './src/sockets/socketInit.js';
import app from './src/app.js';

// --- Database connection ---
connectDB();

// --- Create HTTP + WebSocket server ---
const server = createServer(app);

// --- Initialize Socket.IO (AI Classroom + Meet) ---
initSocket(server);

// --- Initialize Colyseus (Metaverse multiplayer) ---
const gameServer = new ColyseusServer({
  transport: new WebSocketTransport({ server }),
});
gameServer.define('metaverse_room', MetaverseRoom);

// --- Colyseus monitor (for dev) ---
app.use('/colyseus', monitor());

// --- Start server ---
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Socket.IO ready for AI Classroom & Meetings`);
  console.log(`🎮 Colyseus ready for Metaverse multiplayer`);
  console.log(`📊 Monitor: http://localhost:${PORT}/colyseus`);
});
