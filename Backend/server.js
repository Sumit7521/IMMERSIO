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

// --- Colyseus server (Metaverse multiplayer) ---
const colyseusHttpServer = createServer(app);
const gameServer = new ColyseusServer({
  transport: new WebSocketTransport({ server: colyseusHttpServer }),
});
gameServer.define('metaverse_room', MetaverseRoom);

// --- Colyseus monitor ---
app.use('/colyseus', monitor());

// --- Socket.IO server (AI Classroom + Meet) ---
const socketIOHttpServer = createServer(app);
initSocket(socketIOHttpServer);

// --- Ports ---
const COLYSEUS_PORT = process.env.PORT || 3000;
const SOCKET_IO_PORT = process.env.SOCKET_PORT || 3001;

// --- Start Colyseus server ---
colyseusHttpServer.listen(COLYSEUS_PORT, () => {
  console.log(`🎮 Colyseus server running on port ${COLYSEUS_PORT}`);
  console.log(`📊 Monitor: http://localhost:${COLYSEUS_PORT}/colyseus`);
});

// --- Start Socket.IO server ---
socketIOHttpServer.listen(SOCKET_IO_PORT, () => {
  console.log(`🌐 Socket.IO server running on port ${SOCKET_IO_PORT}`);
  console.log(`🚀 Ready for AI Classroom & Meetings`);
});
