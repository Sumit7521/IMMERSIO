import React, { useEffect, useRef } from "react";

const AvatarCreator = ({ onAvatarExport }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;

    const subscribe = (event) => {
      if (!event.data) return;

      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;

        if (data.source === "readyplayerme") {
          // Avatar exported
          if (data.eventName === "v1.avatar.exported") {
            const avatarUrl = data.data.url;
            console.log("✅ Avatar exported:", avatarUrl);

            if (onAvatarExport) onAvatarExport(avatarUrl);
          }

          // Subscribe to all events
          if (data.eventName === "v1.frame.ready") {
            iframe.contentWindow.postMessage(
              JSON.stringify({
                target: "readyplayerme",
                type: "subscribe",
                eventName: "v1.**",
              }),
              "*"
            );
          }
        }
      } catch (err) {
        console.error("RPM Event Error:", err);
      }
    };

    window.addEventListener("message", subscribe);
    return () => window.removeEventListener("message", subscribe);
  }, [onAvatarExport]);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <iframe
        ref={iframeRef}
        title="Ready Player Me Avatar Creator"
        src={`https://readyplayer.me/avatar?frameApi&clearCache=${Date.now()}`} 
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        allow="camera *; microphone *"
      />
    </div>
  );
};

export default AvatarCreator;
