// hooks/useLocalAudio.js
import { useEffect, useState } from "react";

/**
 * Hook: useLocalAudio
 * - Requests mic access
 * - Returns the MediaStream
 * - Cleans up when component unmounts
 */
export function useLocalAudio() {
  const [stream, setStream] = useState(null);

  useEffect(() => {
    let active = true;
    let localStream;

    async function initMic() {
      try {
        console.log("🎤 Requesting microphone access...");
        localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (active) {
          console.log("✅ Microphone stream acquired:", localStream);
          setStream(localStream);
        }
      } catch (err) {
        console.error("❌ Failed to access microphone:", err);
      }
    }

    initMic();

    return () => {
      active = false;
      if (localStream) {
        console.log("🛑 Stopping local audio tracks");
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return stream;
}
