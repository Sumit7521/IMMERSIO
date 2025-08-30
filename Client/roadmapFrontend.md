# Part 2: Frontend Development (Detailed Edition with New Features)

The frontend is where your virtual world comes to life.  
It must be:
- Visually engaging
- Highly performant
- Intuitive to control on any device (4K desktop to smartphone)

---

## **Tech Stack**
- **Framework:** React (using Vite for a fast development environment)
- **3D Engine:** Three.js
- **React Renderer for Three.js:** React Three Fiber (R3F) for declarative, reusable components
- **Helpers for R3F:** Drei (pre-built controls, loaders, effects)
- **State Management:** Redux Toolkit for centralized global state
- **Real-time Client:** Socket.IO Client for backend connection
- **Avatars:** Ready Player Me SDK
- **Premium Music:** Spotify Web Playback SDK

---

## **Detailed Step-by-Step Approach**

### **1. Project Setup & Basic Scene**
- Initialize project:  
  `npm create vite@latest immersio-frontend -- --template react-ts`
- Install dependencies:  
  `npm install @react-three/fiber @react-three/drei three socket.io-client @reduxjs/toolkit react-redux`
- Create `components` directory with subfolders:
  - world
  - player
  - ui
  - networking
  - vehicles
- Create `store` directory:
  - Setup Redux store in `store.ts`
  - Add `features` subfolder (e.g., `playerSlice.ts`, `networkSlice.ts`)
- In `App.tsx`:
  - Wrap app with `<Provider>`
  - Setup R3F `<Canvas>` with:
    - Shadows
    - `<Sky>`, `<Environment>`, `<OrbitControls>` (from Drei)

---

### **2. Player Controller & Networking**
- **Redux slices:**
  - `playerSlice.ts`: manages player state (position, rotation, animation, isInVehicle, currentVehicleId)
  - `networkSlice.ts`: manages connection status and other players' data
- **Keyboard input:**
  - Custom hook `useKeyboardControls()`
  - Listens for `keydown` / `keyup`
  - Dispatches Redux actions (depends on walking or in-vehicle)
- **Player Component:**
  - Use `useSelector` for current input state
  - Update position in `useFrame` (multiply by delta for framerate independence)
- **Networking Component:**
  - `<SocketManager>` initializes Socket.IO and handles events
  - Dispatches actions to `networkSlice` on updates

---

### **3. Authentication Flow**
- **UI:** Login & Register forms (e.g., `react-hook-form`)
- **Auth slice:** `authSlice.ts` holds user profile, JWT, status
- **Secure storage:** JWT stored in `localStorage` and `authSlice`
- **API client:** Axios instance with interceptor for `Authorization: Bearer <token>`

---

### **4. Avatar Integration**
- `<AvatarCreator>` component (modal with Ready Player Me iframe)
- SDK callback provides `.glb` avatar URL
- `<Player>` uses `<Gltf>` + `<Suspense>` for async avatar loading

---

### **5. Minimap & Navigation**
- **Minimap UI:**  
  - 2D `<Minimap>` as overlay (`position: absolute`)  
  - Background: city map image
- **Position tracking:**  
  - Convert 3D coordinates (x, z) to 2D pixels
- **Markers:**  
  - Show icons for player, others, POIs (office, school, etc.)
- **Navigation:**  
  - Search bar + `navigationSlice.ts`
  - `<NavigationLine>` draws glowing line to destination

---

### **6. Vehicle System**
- Components: `<Car>`, `<Bike>`, `<Cycle>` (load 3D models + driving logic)
- **Entering/exiting:**
  - Invisible trigger box + "F" key
  - Dispatch `enterVehicle` action
- **State transition:**
  - `isInVehicle: true`, `currentVehicleId: <id>`
  - Hide `<Player>`, attach camera to vehicle
  - Input dispatches vehicle-specific actions
- **Networking:**  
  - Emit `vehicleMove` events; update others’ vehicles from `networkSlice`

---

### **7. WebRTC Client Logic**
- Add `RTCPeerConnection` state in `networkSlice` (ignore serializability check)
- **Proximity check:**  
  - If player near others → dispatch thunk to initiate WebRTC
- **Signaling/audio:**  
  - `<SocketManager>` handles signaling  
  - Play remote audio via `<audio>` element dynamically

---

### **8. Game Client (Car Racing)**
- **Client-side prediction:** Move car immediately, reconcile with server updates
- **Interpolation:** Smooth other cars’ movement with last two known positions

---

## **Frontend Scalability (Expanded & Detailed)**

### **Content Delivery Network (CDN)**
- **Analogy:** Assets served from closest local server → reduced latency
- **Implementation:** Hosting on Vercel, Netlify, AWS CloudFront

### **Asset Compression**
- Problem: Large 3D models & textures
- Solution:  
  - **Draco:** Compresses geometry (90–95% reduction)
  - **KTX2:** Compresses textures for direct GPU use
- Use `gltf-pipeline` in build process

### **Code Splitting (React.lazy)**
- Load only needed features dynamically:
  ```js
  const CarRacingZone = lazy(() => import('./CarRacingZone'));
  const OfficeInterior = lazy(() => import('./OfficeInterior'));
