dataflow pipeline

[Keyboard / Mouse Input]
        │
        ▼
CharacterController.js
    ├─> calculates movement, rotation, animation
    ├─> updates local Avatar (your player)
    └─> sendPlayerUpdate(x, y, z, rotationY, animation, avatarUrl)
            │
            ▼
    useMultiplayer.js
        ├─> checks for changes (position/rotation/etc)
        ├─> room.send("move", data)  // goes to Colyseus server
        └─> maintains local players Map from server state

---------------- SERVER ----------------
Colyseus Room (metaverse_room)
    ├─> receives "move" messages
    ├─> updates state.players[sessionId]
    └─> broadcasts new state to all clients
----------------------------------------

[Other Clients]
        │
        ▼
useMultiplayer.js
    ├─> room.onStateChange(state)
    └─> builds Map(sessionId → player data)

CharacterController.js
    ├─> loops through players Map
    ├─> skips own sessionId
    └─> <RemotePlayer player={player} />

RemotePlayer.js
    ├─> smooths position + rotation with lerp
    └─> <Avatar avatarUrl={player.avatarUrl} currentAction={player.animation} />

Avatar.js
    ├─> loads GLTF model (from avatarUrl)
    ├─> loads animation clips (idle, walk, run, jump)
    └─> plays correct animation (based on player.animation)
