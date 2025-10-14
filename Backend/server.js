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

// --- Create a single HTTP server for both Colyseus and Socket.IO ---
const PORT = process.env.PORT || 3000;
const httpServer = createServer(app);

// --- Colyseus server (Metaverse multiplayer) ---
const gameServer = new ColyseusServer({
  transport: new WebSocketTransport({ server: httpServer }),
});
gameServer.define('metaverse_room', MetaverseRoom);

// --- Colyseus monitor ---
app.use('/colyseus', monitor());

// --- Socket.IO server (AI Classroom + Meet) ---
initSocket(httpServer); // Attach Socket.IO to the same HTTP server

// --- Start HTTP server ---
httpServer.listen(PORT, () => {
  console.log(`🎮 Colyseus server running`);
  console.log(`🌐 Socket.IO server running`);
  console.log(`🚀 Ready for AI Classroom & Meetings`);
  console.log(`📊 Colyseus Monitor available at /colyseus`);
});
