// hooks/useMultiplayer.js
import { useState, useEffect, useRef } from 'react';
import { Client } from 'colyseus.js';

export const useMultiplayer = (userId, avatarUrl) => {
  const [room, setRoom] = useState(null);
  const [players, setPlayers] = useState(new Map());
  const [connected, setConnected] = useState(false);
  const clientRef = useRef(null);
  const lastSentData = useRef({});

  useEffect(() => {
    const connect = async () => {
      try {
        const client = new Client('ws://localhost:3000');
        clientRef.current = client;

        const room = await client.joinOrCreate('metaverse_room', { userId, avatarUrl });
        setRoom(room);
        setConnected(true);

        // Wait for room to be ready
        await new Promise((resolve) => {
          if (room.state) resolve();
          else room.onStateChange.once(() => resolve());
        });

        // Listen for state changes
        room.onStateChange((state) => {
          const playersMap = new Map();
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
                avatarUrl: player.avatarUrl || ''
              });
            });
          }
          setPlayers(playersMap);

          console.log("📥 Received state from server:", Array.from(playersMap.values()));
        });
      } catch (error) {
        console.log(error)
        setConnected(false);
      }
    };

    connect();

    return () => {
      if (room) {
        room.leave();
        setConnected(false);
      }
    };
  }, [userId, avatarUrl]);

  const sendPlayerUpdate = (x, y, z, rotationY, animation, avatarUrlToSend = avatarUrl) => {
    if (!room || !connected) return;

    const data = { x, y, z, rotationY, animation, avatarUrl: avatarUrlToSend };
    const lastData = lastSentData.current;

    const hasChanged =
      Math.abs(data.x - (lastData.x || 0)) > 0.01 ||
      Math.abs(data.y - (lastData.y || 0)) > 0.01 ||
      Math.abs(data.z - (lastData.z || 0)) > 0.01 ||
      Math.abs(data.rotationY - (lastData.rotationY || 0)) > 0.01 ||
      data.animation !== lastData.animation ||
      data.avatarUrl !== lastData.avatarUrl;

    if (hasChanged) {
      // ✅ Only keep this debug log
      console.log("📤 Sending player update:", data);

      room.send("move", data);
      lastSentData.current = data;
    }
  };

  return {
    room,
    players,
    connected,
    sendPlayerUpdate,
    sessionId: room?.sessionId
  };
};
