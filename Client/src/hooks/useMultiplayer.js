// hooks/useMultiplayer.js
import { useState, useEffect, useRef } from 'react';
import { Client } from 'colyseus.js';

export const useMultiplayer = (userId, avatarUrl) => {
  const [players, setPlayers] = useState(new Map());
  const [connected, setConnected] = useState(false);
  const roomRef = useRef(null);
  const clientRef = useRef(null);
  const lastSentData = useRef({});

  useEffect(() => {
    let isMounted = true;

    const connect = async () => {
      try {
        const client = new Client('wss://immersio-rwyc.onrender.com');
        clientRef.current = client;

        const room = await client.joinOrCreate('metaverse_room', { userId, avatarUrl });
        roomRef.current = room;
        if (!isMounted) return;
        setConnected(true);

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
        });

        // Optional: handle leave/disconnect events
        room.onLeave(() => {
          if (isMounted) setConnected(false);
        });

      } catch (error) {
        console.error("❌ Multiplayer connection error:", error);
        if (isMounted) setConnected(false);
      }
    };

    connect();

    return () => {
      isMounted = false;
      const room = roomRef.current;
      if (room && room.leave) room.leave();
      setConnected(false);
    };
  }, [userId, avatarUrl]); // ✅ room removed from deps

  const sendPlayerUpdate = (x, y, z, rotationY, animation, avatarUrlToSend = avatarUrl) => {
    const room = roomRef.current;
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
      room.send("move", data);
      lastSentData.current = data;
    }
  };

  return {
    room: roomRef.current,
    players,
    connected,
    sendPlayerUpdate,
    sessionId: roomRef.current?.sessionId
  };
};
