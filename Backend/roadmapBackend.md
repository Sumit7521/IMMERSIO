```md
# Part 1: Backend Development (Detailed Edition)

## Role of Backend
- Authoritative engine for the world:
  - Manages user data
  - Synchronizes players
  - Runs game logic
  - Handles secure operations

---

## Tech Stack
- **Runtime:** Node.js  
  - Non-blocking, event-driven; handles thousands of connections efficiently.
- **Framework:** Express.js  
  - Minimal but structured REST API layer for auth and payments.
- **Database:** MongoDB with Mongoose  
  - Flexible document structure; schema validation & hooks.
- **Real-time Communication:** Socket.IO  
  - WebSocket + fallbacks; supports reconnection & rooms (lobbies).
- **Authentication:** JWT & Passport.js  
  - Stateless, modular authentication.
- **Physics Engine:** Cannon-es  
  - Lightweight JS-based 3D physics engine; authoritative server-side physics.
- **Payments:** Stripe SDK  
  - Secure subscriptions and payment handling.
- **Google Login Integration:**  
  - Use Passport.js with `passport-google-oauth20` for OAuth 2.0.  
  - Flow:
    1. Redirect users to Google for authentication.
    2. Google returns user profile info.
    3. Server checks/creates user in DB and returns JWT.
- **Google Play Games Integration:**  
  - Validate ID tokens from Google Play Games Services API.
  - Server verifies token signature and extracts player ID.
  - Map to existing user account or create new entry.

---

## Recommended Project Structure
```

/immersio-backend
\|-- /config        # DB connection, env variables
\|-- /controllers   # Request handlers (e.g., authController.js)
\|-- /models        # Mongoose schemas (e.g., User.js)
\|-- /routes        # API routes (e.g., authRoutes.js)
\|-- /services      # Business logic (e.g., socketManager.js, physicsEngine.js)
\|-- server.js      # Entry point
\|-- package.json

```

---

## Step-by-Step Development

### 1. Initial Setup
- Initialize: `npm init -y`
- Install: `npm install express mongoose socket.io jsonwebtoken bcryptjs passport passport-jwt passport-google-oauth20`
- Create `server.js`:
  - Express app
  - MongoDB connection
  - Integrate Socket.IO
- Define models in `/models` (e.g., User.js with username, email, passwordHash, worldData)
- Create `/routes` and `/controllers` (e.g., authRoutes.js, authController.js)

---

### 2. Authentication Service
- **Email/Password:**
  - Register: hash password (`bcrypt.hash()`), save user.
  - Login: verify (`bcrypt.compare()`), issue JWT (`jwt.sign()`).
- **Google Login:**
  - Setup Passport Google OAuth strategy.
  - Redirect users to Google login.
  - Verify callback, create/find user, return JWT.
- **Google Play Games Login:**
  - Accept token from client.
  - Validate with Google Play Games API.
  - Link/lookup user, return JWT.

---

### 3. Real-time Synchronization Core
- `socketManager.js` for Socket.IO logic.
- Pass Socket.IO instance in `server.js`.
- Listeners:
  - `'connection'`: log `socket.id`.
  - `'playerMove'`: broadcast to others (`socket.broadcast.emit('playerMoved', data)`).

---

### 4. WebRTC Signaling
- In `socketManager.js`, listen for:
  - `'webrtc-offer'`
  - `'webrtc-answer'`
  - `'webrtc-ice-candidate'`
- Forward payloads via `io.to(targetSocketId).emit(...)`.

---

### 5. Authoritative Car Racing Server
- `physicsEngine.js` manages Cannon-es worlds.
- On race start:
  - Create race instance in DB.
  - Players join Socket.IO room (`socket.join(raceId)`).
- Physics loop:
  - Apply `playerInput` to cars.
  - Step world (e.g., 20 ticks/sec).
  - Broadcast `gameStateUpdate` to room.

---

### 6. Payment Integration (Stripe)
- Create `paymentsController.js` and `paymentRoutes.js`.
- **Checkout:**
  - Use Stripe SDK.
  - Return session URL.
- **Webhook:**
  - Verify Stripe signature.
  - On `checkout.session.completed`: update user `isPremium: true`.

---

## Backend Scalability Principles

### 1. Stateless Architecture (Redis)
- **Problem:** Local memory doesn’t sync across servers.
- **Solution:** Use Redis for shared session/state.
  - Key example: `position:user123`
  - Update/query Redis instead of server memory.

### 2. Database Scaling
- **Indexing:** `{ index: true }` on email, username.
- **Read Replicas:** Primary handles writes; replicas handle reads.

### 3. Horizontal Scaling
- Containerize with Docker.
- Configure autoscaling:
  - Scale up if CPU >70% (5 min)
  - Scale down if CPU <30% (10 min)
- Load balancer distributes traffic.

### 4. Microservices & Sharding
- **Microservices:**  
  - Separate services (Auth, Chat, Game).  
  - Independent databases; communicate via APIs/message queues (RabbitMQ/Kafka).
- **Sharding (Zones):**
  - Gateway directs clients to correct game server.
  - Seamless handoff when players cross zones.

---

```

---