// hooks/useMultiplayer.js
import { useState, useEffect, useRef } from 'react'
import { Client } from 'colyseus.js'

export const useMultiplayer = (userId, avatarId) => {
  const [room, setRoom] = useState(null)
  const [players, setPlayers] = useState(new Map())
  const [connected, setConnected] = useState(false)
  const clientRef = useRef(null)
  const lastSentData = useRef({})

  useEffect(() => {
    const connect = async () => {
      try {
        const client = new Client('ws://localhost:3000')
        clientRef.current = client

        const room = await client.joinOrCreate('metaverse_room', {
          userId,
          avatarId
        })

        setRoom(room)
        setConnected(true)

        // Wait for room to be ready
        await new Promise((resolve) => {
          if (room.state) {
            resolve()
          } else {
            room.onStateChange.once(() => resolve())
          }
        })

        // Listen for state changes
        room.onStateChange((state) => {
          const playersMap = new Map()
          if (state.players) {
            state.players.forEach((player, sessionId) => {
              playersMap.set(sessionId, {
                sessionId,
                x: player.x,
                y: player.y,
                z: player.z,
                rotationY: player.rotationY,
                animation: player.animation,
                userId: player.userId,
                avatarId: player.avatarId
              })
            })
          }
          setPlayers(playersMap)
        })

        // Listen for player additions
        if (room.state && room.state.players) {
          room.state.players.onAdd = (player, sessionId) => {
            console.log(`Player ${sessionId} joined`)
          }

          // Listen for player removals
          room.state.players.onRemove = (player, sessionId) => {
            console.log(`Player ${sessionId} left`)
          }
        }

        room.onMessage("welcome", (message) => {
          console.log("Connected to room:", message.sessionId)
        })

      } catch (error) {
        console.error("Failed to connect to multiplayer server:", error)
        setConnected(false)
      }
    }

    connect()

    return () => {
      if (room) {
        room.leave()
        setConnected(false)
      }
    }
  }, [userId, avatarId])

  const sendPlayerUpdate = (x, y, z, rotationY, animation) => {
    if (!room || !connected) return

    // Throttle updates to avoid spam
    const data = { x, y, z, rotationY, animation }
    const lastData = lastSentData.current
    
    const hasChanged = 
      Math.abs(data.x - (lastData.x || 0)) > 0.01 ||
      Math.abs(data.y - (lastData.y || 0)) > 0.01 ||
      Math.abs(data.z - (lastData.z || 0)) > 0.01 ||
      Math.abs(data.rotationY - (lastData.rotationY || 0)) > 0.01 ||
      data.animation !== lastData.animation

    if (hasChanged) {
      room.send("move", data)
      lastSentData.current = data
    }
  }

  return {
    room,
    players,
    connected,
    sendPlayerUpdate,
    sessionId: room?.sessionId
  }
}