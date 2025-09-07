// server.js
const app = require('./src/app')
const connectDB = require('./src/db/db')
const { createServer } = require('http')
const { Server } = require('colyseus')
const { monitor } = require('@colyseus/monitor')
const { WebSocketTransport } = require('@colyseus/ws-transport')
const MetaverseRoom = require('./src/rooms/MetaverseRoom')
require('dotenv').config()

// Connect to database first
connectDB()

// Create HTTP server
const server = createServer(app)

// Create Colyseus server
const gameServer = new Server({
  transport: new WebSocketTransport({
    server: server
  })
})

// Register room handlers
gameServer.define('metaverse_room', MetaverseRoom)

// Optional: Monitor panel (for development)
app.use('/colyseus', monitor())

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`)
  console.log(`📊 Colyseus monitor available at http://localhost:${PORT}/colyseus`)
  console.log(`🌐 WebSocket server ready for multiplayer connections`)
})