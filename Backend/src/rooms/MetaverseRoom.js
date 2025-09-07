// src/rooms/MetaverseRoom.js
const { Room } = require('colyseus')
const { Schema, MapSchema, type } = require('@colyseus/schema')

class Player extends Schema {
  constructor() {
    super()
    this.x = 0
    this.y = 2
    this.z = 0
    this.rotationY = 0
    this.animation = 'idle'
    this.userId = ''
    this.avatarId = ''
    this.lastUpdate = Date.now()
  }
}

// Define schema types for Player
type("number")(Player.prototype, "x")
type("number")(Player.prototype, "y")
type("number")(Player.prototype, "z")
type("number")(Player.prototype, "rotationY")
type("string")(Player.prototype, "animation")
type("string")(Player.prototype, "userId")
type("string")(Player.prototype, "avatarId")
type("number")(Player.prototype, "lastUpdate")

class MetaverseState extends Schema {
  constructor() {
    super()
    this.players = new MapSchema()
    this.roomId = ''
    this.maxPlayers = 20
  }
}

// Define schema types for MetaverseState
type({ map: Player })(MetaverseState.prototype, "players")
type("string")(MetaverseState.prototype, "roomId")
type("number")(MetaverseState.prototype, "maxPlayers")

class MetaverseRoom extends Room {
  maxClients = 20

  onCreate(options) {
    console.log("🏠 MetaverseRoom created with options:", options)
    
    this.setState(new MetaverseState())
    this.state.roomId = this.roomId
    
    // Set up message handlers
    this.onMessage("move", (client, message) => {
      try {
        const player = this.state.players.get(client.sessionId)
        if (player && this.isValidPosition(message)) {
          player.x = message.x
          player.y = message.y
          player.z = message.z
          player.rotationY = message.rotationY
          player.animation = message.animation || 'idle'
          player.lastUpdate = Date.now()
        }
      } catch (error) {
        console.error("❌ Error handling move message:", error)
      }
    })

    // Optional: Clean up inactive players
    this.setSimulationInterval((deltaTime) => {
      this.checkInactivePlayers()
    }, 5000) // Check every 5 seconds

    console.log("✅ MetaverseRoom initialized successfully")
  }

  onJoin(client, options) {
    console.log(`👋 Client ${client.sessionId} joined with options:`, options)
    
    try {
      // Create new player
      const player = new Player()
      player.userId = options.userId || client.sessionId
      player.avatarId = options.avatarId || 'default'
      player.lastUpdate = Date.now()
      
      // Add some random spawn position to avoid overlap
      const spawnRadius = 5
      const angle = Math.random() * Math.PI * 2
      player.x = Math.cos(angle) * spawnRadius
      player.z = Math.sin(angle) * spawnRadius
      player.y = 2
      
      // Add to state
      this.state.players.set(client.sessionId, player)
      
      // Send welcome message
      client.send("welcome", { 
        sessionId: client.sessionId,
        playerId: player.userId,
        spawnPosition: { x: player.x, y: player.y, z: player.z }
      })

      console.log(`✅ Player ${client.sessionId} (${player.userId}) joined successfully. Total players: ${this.state.players.size}`)
      
    } catch (error) {
      console.error("❌ Error in onJoin:", error)
      client.leave(1000, "Server error during join")
    }
  }

  onLeave(client, consented) {
    console.log(`👋 Client ${client.sessionId} left ${consented ? 'voluntarily' : 'unexpectedly'}`)
    
    try {
      const player = this.state.players.get(client.sessionId)
      if (player) {
        console.log(`🗑️ Removing player ${player.userId} (${client.sessionId})`)
        this.state.players.delete(client.sessionId)
      }
      
      console.log(`📊 Remaining players: ${this.state.players.size}`)
      
    } catch (error) {
      console.error("❌ Error in onLeave:", error)
    }
  }

  onDispose() {
    console.log("🏠 MetaverseRoom disposed")
  }

  // Helper methods
  isValidPosition(message) {
    return (
      typeof message.x === 'number' && 
      typeof message.y === 'number' && 
      typeof message.z === 'number' && 
      typeof message.rotationY === 'number' &&
      !isNaN(message.x) && !isNaN(message.y) && !isNaN(message.z) && !isNaN(message.rotationY) &&
      Math.abs(message.x) < 1000 && // Reasonable bounds
      Math.abs(message.y) < 1000 &&
      Math.abs(message.z) < 1000
    )
  }

  checkInactivePlayers() {
    const now = Date.now()
    const timeout = 30000 // 30 seconds

    this.state.players.forEach((player, sessionId) => {
      if (now - player.lastUpdate > timeout) {
        console.log(`⏰ Removing inactive player ${sessionId}`)
        const client = this.clients.find(c => c.sessionId === sessionId)
        if (client) {
          client.leave(1001, "Inactivity timeout")
        }
      }
    })
  }
}

module.exports = MetaverseRoom