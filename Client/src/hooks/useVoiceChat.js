// hooks/useVoiceChat.js
import { useEffect, useRef, useState } from "react";
import { useLocalAudio } from "./useLocalAudio";
import { useMultiplayer } from "./useMultiplayer";

export function useVoiceChat(characterRef) {
  const localStream = useLocalAudio();
  const { room, players, sessionId } = useMultiplayer();
  const peerConnections = useRef(new Map());
  const [remoteStreams, setRemoteStreams] = useState(new Map());

  const MAX_CONNECTIONS = 5;

  // Helper: create or get existing peer connection
  function createPeerConnection(remoteId) {
    if (peerConnections.current.has(remoteId)) return peerConnections.current.get(remoteId);
    if (peerConnections.current.size >= MAX_CONNECTIONS) return null;

    const pc = new RTCPeerConnection();

    // Add local tracks
    if (localStream) {
      localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
    }

    // Handle remote track
    pc.ontrack = event => {
      setRemoteStreams(prev => new Map(prev).set(remoteId, event.streams[0]));
    };

    // Handle ICE candidates
    pc.onicecandidate = event => {
      if (event.candidate && room) {
        room.send("webrtc-ice", { to: remoteId, candidate: event.candidate });
      }
    };

    peerConnections.current.set(remoteId, pc);
    return pc;
  }

  // Cleanup peer connection
  function removePeerConnection(remoteId) {
    const pc = peerConnections.current.get(remoteId);
    if (pc) {
      pc.close();
      peerConnections.current.delete(remoteId);
      setRemoteStreams(prev => {
        const newMap = new Map(prev);
        newMap.delete(remoteId);
        return newMap;
      });
    }
  }

  // Handle incoming WebRTC signaling messages
  useEffect(() => {
    if (!room) return;
    let active = true;

    const handleOffer = async ({ from, offer }) => {
      if (!active) return;
      const pc = createPeerConnection(from);
      if (!pc) return;

      try {
        await pc.setRemoteDescription(offer);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        room.send("webrtc-answer", { to: from, answer });
      } catch (err) {
        console.error("Error handling offer:", err);
      }
    };

    const handleAnswer = async ({ from, answer }) => {
      if (!active) return;
      const pc = peerConnections.current.get(from);
      if (!pc) return;

      // Only set remote description if we're in "have-local-offer" state
      if (pc.signalingState === "have-local-offer") {
        try {
          await pc.setRemoteDescription(answer);
        } catch (err) {
          console.warn(`Failed to set remote answer from ${from}:`, err);
        }
      } else {
        console.warn(`Ignored answer from ${from}, signalingState=${pc.signalingState}`);
      }
    };

    const handleICE = async ({ from, candidate }) => {
      if (!active) return;
      const pc = peerConnections.current.get(from);
      if (pc && candidate) {
        try {
          await pc.addIceCandidate(candidate);
        } catch (err) {
          console.warn(`Failed to add ICE candidate from ${from}:`, err);
        }
      }
    };

    room.onMessage("webrtc-offer", handleOffer);
    room.onMessage("webrtc-answer", handleAnswer);
    room.onMessage("webrtc-ice", handleICE);

    return () => {
      active = false;
      peerConnections.current.forEach(pc => pc.close());
      peerConnections.current.clear();
      setRemoteStreams(new Map());
    };
  }, [room, localStream]);

  // Create offers to new players safely
  useEffect(() => {
    if (!room || !localStream) return;

    players.forEach(async player => {
      if (player.sessionId === sessionId) return;
      if (peerConnections.current.has(player.sessionId)) return;

      const pc = createPeerConnection(player.sessionId);
      if (!pc || pc.signalingState !== "stable") return;

      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        room.send("webrtc-offer", { to: player.sessionId, offer });
      } catch (err) {
        console.warn(`Failed to create offer for ${player.sessionId}:`, err);
      }
    });
  }, [players, room, localStream]);

  return { remoteStreams, createPeerConnection, removePeerConnection };
}
