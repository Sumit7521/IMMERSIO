# IMMERSIO JavaScript File Structure Guide
## Complete JavaScript/JSX Implementation

---

## 🏗️ **ROOT LEVEL CONFIGURATION**
```
immersio/
├── README.md                    # Project setup, features, and documentation
├── package.json                 # Root workspace configuration for monorepo
├── docker-compose.yml           # Local development environment (MongoDB, Redis, etc.)
├── docker-compose.prod.yml      # Production deployment configuration
├── .gitignore                   # Exclude node_modules, .env, dist folders
├── .env.example                 # Environment variables template
├── .eslintrc.js                 # JavaScript code style rules
├── .prettierrc                  # Code formatting configuration
└── docs/                        # Project documentation
    ├── API.md                   # REST API endpoints documentation
    ├── deployment.md            # How to deploy to production
    ├── development.md           # Local development setup guide
    └── architecture.md          # System design overview
```

---

## 📦 **SHARED UTILITIES (`packages/`)**
*Code shared between frontend and backend*

```
packages/
├── shared/
│   ├── package.json             # Shared utilities dependencies
│   ├── src/
│   │   ├── types/               # Data structure definitions (using JSDoc)
│   │   │   ├── user.js          # User object structure and validation
│   │   │   ├── world.js         # 3D world position and state definitions
│   │   │   ├── game.js          # Game session and player data structures
│   │   │   └── index.js         # Export all type definitions
│   │   ├── constants/           # Application-wide constants
│   │   │   ├── events.js        # Socket.IO event names and types
│   │   │   ├── config.js        # Default configuration values
│   │   │   ├── endpoints.js     # API endpoint URLs
│   │   │   └── index.js         # Export all constants
│   │   └── utils/               # Shared utility functions
│   │       ├── validation.js    # Input validation helpers
│   │       ├── crypto.js        # Encryption/hashing utilities
│   │       ├── helpers.js       # General purpose functions
│   │       └── index.js         # Export all utilities
│   └── dist/                    # Compiled/bundled output
│
└── database/                    # Database management tools
    ├── package.json             # Database dependencies (mongodb, mongoose)
    ├── migrations/              # Database schema changes over time
    │   ├── 001_initial_users.js # Create users collection
    │   ├── 002_add_houses.js    # Add houses collection
    │   └── 003_game_system.js   # Add gaming features
    ├── seeds/                   # Sample data for development
    │   ├── users.js             # Test user accounts
    │   ├── houses.js            # Sample virtual houses
    │   └── world.js             # Initial world state
    └── scripts/
        ├── backup.js            # MongoDB backup automation
        ├── restore.js           # Database restore functionality
        └── migrate.js           # Run database migrations
```

---

## 🖥️ **BACKEND SERVER (`apps/backend/`)**
*Node.js/Express server handling all business logic*

### **Core Application Files**
```
apps/backend/
├── package.json                 # Backend dependencies (express, mongoose, socket.io)
├── Dockerfile                   # Development container setup
├── Dockerfile.prod             # Production container setup
├── .env.example                # Backend environment variables template
├── .eslintrc.js                # Backend-specific linting rules
├── server.js                   # Server entry point - starts HTTP and Socket.IO
├── app.js                      # Express app configuration and middleware
└── src/
```

### **Configuration Management (`src/config/`)**
*External service connections and app settings*
```
├── src/config/
│   ├── database.js              # MongoDB connection with Mongoose
│   ├── redis.js                 # Redis caching connection setup
│   ├── stripe.js                # Stripe payment processing config
│   ├── jwt.js                   # JSON Web Token configuration
│   ├── cors.js                  # Cross-origin resource sharing setup
│   └── index.js                 # Export all configurations
```

### **API Request Handlers (`src/controllers/`)**
*Process HTTP requests and return responses*
```
├── src/controllers/
│   ├── auth.controller.js       # Handle login, register, logout requests
│   │                            # - POST /auth/login: Validate credentials, return JWT
│   │                            # - POST /auth/register: Create new user account
│   │                            # - POST /auth/logout: Invalidate user session
│   ├── user.controller.js       # User profile and settings management
│   │                            # - GET /users/profile: Get user data
│   │                            # - PUT /users/profile: Update user information
│   │                            # - GET /users/friends: Get friends list
│   ├── world.controller.js      # 3D world state and player positions
│   │                            # - GET /world/state: Get current world status
│   │                            # - POST /world/position: Update player position
│   │                            # - GET /world/players: Get online players
│   ├── house.controller.js      # Virtual house management
│   │                            # - GET /houses/mine: Get user's house data
│   │                            # - PUT /houses/customize: Update house interior
│   │                            # - POST /houses/visit: Visit another user's house
│   ├── game.controller.js       # Car racing and mini-games
│   │                            # - POST /games/create: Start new game session
│   │                            # - POST /games/join: Join existing game
│   │                            # - GET /games/leaderboard: Get high scores
│   ├── payment.controller.js    # Stripe subscription management
│   │                            # - POST /payments/subscribe: Create subscription
│   │                            # - POST /payments/webhook: Handle Stripe events
│   │                            # - GET /payments/status: Check subscription status
│   ├── admin.controller.js      # Admin panel functionality
│   │                            # - GET /admin/users: List all users
│   │                            # - PUT /admin/users/:id/ban: Ban/unban users
│   │                            # - GET /admin/analytics: Get usage statistics
│   └── index.js                 # Export all controllers
```

### **Business Logic (`src/services/`)**
*Core functionality used by controllers*
```
├── src/services/
│   ├── auth.service.js          # Authentication business logic
│   │                            # - validateUser(): Check login credentials
│   │                            # - generateToken(): Create JWT tokens
│   │                            # - verifyToken(): Validate JWT tokens
│   ├── user.service.js          # User data operations
│   │                            # - createUser(): Register new user
│   │                            # - updateProfile(): Modify user data
│   │                            # - addFriend(): Handle friend requests
│   ├── world.service.js         # 3D world synchronization
│   │                            # - updatePlayerPosition(): Sync player locations
│   │                            # - getNearbyPlayers(): Find players in proximity
│   │                            # - broadcastWorldEvent(): Notify all players
│   ├── physics.service.js       # Server-side physics calculations
│   │                            # - calculateCarPhysics(): Racing game physics
│   │                            # - validateMovement(): Prevent cheating
│   │                            # - handleCollisions(): Process object collisions
│   ├── voice.service.js         # WebRTC voice chat coordination
│   │                            # - createRoom(): Set up voice chat room
│   │                            # - handleSignaling(): Manage WebRTC signaling
│   │                            # - manageProximity(): Distance-based voice
│   ├── payment.service.js       # Stripe integration
│   │                            # - createSubscription(): Handle premium upgrades
│   │                            # - processWebhook(): Handle payment events
│   │                            # - cancelSubscription(): Handle cancellations
│   ├── email.service.js         # Email notifications
│   │                            # - sendWelcomeEmail(): New user welcome
│   │                            # - sendPasswordReset(): Password recovery
│   │                            # - sendFriendRequest(): Friend notifications
│   └── index.js                 # Export all services
```

### **Database Models (`src/models/`)**
*MongoDB collection schemas using Mongoose*
```
├── src/models/
│   ├── User.js                  # User account data model
│   │                            # Fields: email, username, password, avatar, position
│   │                            # Methods: validatePassword(), toJSON(), addFriend()
│   ├── House.js                 # Virtual house data model  
│   │                            # Fields: ownerId, address, customizations, visitors
│   │                            # Methods: addFurniture(), setPrivacy(), recordVisit()
│   ├── World.js                 # 3D world state model
│   │                            # Fields: activeUsers, worldEvents, serverStatus
│   │                            # Methods: addPlayer(), removePlayer(), logEvent()
│   ├── Game.js                  # Game session model
│   │                            # Fields: type, players, gameState, results
│   │                            # Methods: addPlayer(), startGame(), endGame()
│   ├── Friend.js                # Friend relationship model
│   │                            # Fields: senderId, receiverId, status, requestDate
│   │                            # Methods: accept(), reject(), block()
│   ├── Subscription.js          # Premium subscription model
│   │                            # Fields: userId, stripeId, plan, status, dates
│   │                            # Methods: isActive(), cancel(), upgrade()
│   ├── ChatMessage.js           # Chat message model
│   │                            # Fields: senderId, recipientId, message, timestamp
│   │                            # Methods: markAsRead(), edit(), delete()
│   └── index.js                 # Export all models
```

### **Security & Validation (`src/middleware/`)**
*Functions that run before route handlers*
```
├── src/middleware/
│   ├── auth.middleware.js       # JWT token validation
│   │                            # - requireAuth(): Verify user is logged in
│   │                            # - extractUser(): Get user from token
│   │                            # - checkPermissions(): Verify user permissions
│   ├── validation.middleware.js # Request data validation
│   │                            # - validateLogin(): Check login form data
│   │                            # - validateProfile(): Verify profile updates
│   │                            # - sanitizeInput(): Clean user input
│   ├── rateLimit.middleware.js  # API abuse prevention
│   │                            # - loginRateLimit(): Limit login attempts
│   │                            # - apiRateLimit(): General API rate limiting
│   │                            # - gameRateLimit(): Prevent game spam
│   ├── error.middleware.js      # Error handling and logging
│   │                            # - notFound(): Handle 404 errors
│   │                            # - errorHandler(): Process all errors
│   │                            # - logError(): Write errors to logs
│   ├── admin.middleware.js      # Admin permission checking
│   │                            # - requireAdmin(): Verify admin privileges
│   │                            # - requireModerator(): Check moderator access
│   └── index.js                 # Export all middleware
```

### **API Routes (`src/routes/`)**
*URL endpoint definitions*
```
├── src/routes/
│   ├── auth.routes.js           # Authentication endpoints
│   │                            # POST /auth/login, /auth/register, /auth/logout
│   │                            # GET /auth/verify, /auth/refresh
│   ├── user.routes.js           # User management endpoints
│   │                            # GET /users/profile, /users/friends
│   │                            # PUT /users/profile, /users/settings
│   │                            # POST /users/friend-request
│   ├── world.routes.js          # 3D world endpoints
│   │                            # GET /world/state, /world/players
│   │                            # POST /world/position, /world/event
│   ├── game.routes.js           # Gaming endpoints
│   │                            # POST /games/create, /games/join
│   │                            # GET /games/leaderboard, /games/history
│   ├── payment.routes.js        # Payment processing endpoints
│   │                            # POST /payments/subscribe, /payments/cancel
│   │                            # POST /payments/webhook (Stripe webhooks)
│   ├── admin.routes.js          # Admin panel endpoints
│   │                            # GET /admin/users, /admin/analytics
│   │                            # PUT /admin/users/:id, /admin/settings
│   └── index.js                 # Combine and export all routes
```

### **Real-time Communication (`src/sockets/`)**
*WebSocket event handlers for live features*
```
├── src/sockets/
│   ├── world.socket.js          # Player position synchronization
│   │                            # Events: player_move, player_join, player_leave
│   │                            # Broadcasts position updates to nearby players
│   ├── voice.socket.js          # Voice chat room management
│   │                            # Events: join_voice, leave_voice, voice_signal
│   │                            # Handles WebRTC signaling for voice chat
│   ├── game.socket.js           # Live game updates
│   │                            # Events: game_update, race_position, game_end
│   │                            # Synchronizes game state between players
│   ├── chat.socket.js           # Text messaging system
│   │                            # Events: send_message, private_message, typing
│   │                            # Handles public and private messaging
│   └── index.js                 # Socket.IO setup and event routing
```

### **Utilities (`src/utils/`)**
*Helper functions and utilities*
```
├── src/utils/
│   ├── logger.js                # Logging system (Winston or similar)
│   │                            # Functions: logInfo(), logError(), logDebug()
│   ├── encryption.js            # Password hashing and encryption
│   │                            # Functions: hashPassword(), comparePassword()
│   ├── email.js                 # Email sending functionality
│   │                            # Functions: sendEmail(), createTemplate()
│   ├── file-upload.js           # File upload handling (Multer)
│   │                            # Functions: uploadAvatar(), uploadHouseImage()
│   └── helpers.js               # General utility functions
│                                # Functions: generateId(), formatDate(), sanitize()
```

---

## 🌐 **FRONTEND APPLICATION (`apps/frontend/`)**
*React application for the user interface*

### **Core Application Setup**
```
apps/frontend/
├── package.json                 # Frontend dependencies (react, three, etc.)
├── Dockerfile                   # Development container setup
├── Dockerfile.prod             # Production container optimization
├── index.html                   # Main HTML file with React mount point
├── vite.config.js              # Build tool configuration (Vite bundler)
├── .eslintrc.js                # Frontend linting rules (React specific)
├── postcss.config.js           # CSS processing configuration
├── tailwind.config.js          # Tailwind CSS styling configuration
└── src/
    ├── main.jsx                 # App entry point - renders React app
    └── App.jsx                  # Main app component with routing
```

### **Static Assets (`public/`)**
*Files served directly to users without processing*
```
├── public/
│   ├── models/                  # 3D model files (.glb, .gltf format)
│   │   ├── avatars/            # Character models from Ready Player Me
│   │   │   ├── male_base.glb   # Default male avatar
│   │   │   └── female_base.glb # Default female avatar  
│   │   ├── houses/             # Virtual house 3D models
│   │   │   ├── apartment.glb   # Small apartment model
│   │   │   ├── house.glb       # Medium house model
│   │   │   └── mansion.glb     # Large mansion model
│   │   ├── vehicles/           # Car models for racing game
│   │   │   ├── sports_car.glb  # Fast racing car
│   │   │   └── suv.glb         # Slower but stable vehicle
│   │   └── environment/        # World environment models
│   │       ├── trees.glb       # Various tree models
│   │       ├── buildings.glb   # City buildings
│   │       └── terrain.glb     # Ground and landscape
│   ├── textures/               # Image files for 3D surfaces
│   │   ├── grass.jpg           # Ground texture
│   │   ├── concrete.jpg        # Building texture
│   │   └── wood.jpg            # Furniture texture
│   ├── sounds/                 # Audio files for the game
│   │   ├── background.mp3      # Ambient background music
│   │   ├── car_engine.wav      # Racing sound effects
│   │   └── notification.wav    # UI sound effects
│   └── icons/                  # UI icons and images
│       ├── logo.png            # IMMERSIO logo
│       ├── avatar-icon.svg     # User avatar placeholder
│       └── game-icons/         # Game-specific icons
```

### **User Interface Components (`src/components/`)**

#### **Basic UI Elements (`src/components/ui/`)**
```
├── src/components/ui/
│   ├── Button.jsx              # Reusable button component
│   │                           # Props: variant, size, onClick, disabled
│   │                           # Variants: primary, secondary, danger
│   ├── Modal.jsx               # Popup window component
│   │                           # Props: isOpen, onClose, title, children
│   │                           # Features: backdrop click, ESC key close
│   ├── LoadingSpinner.jsx      # Loading animation component
│   │                           # Props: size, color, message
│   │                           # Used during API calls and asset loading
│   ├── Input.jsx               # Form input component
│   │                           # Props: type, placeholder, value, onChange
│   │                           # Features: validation, error messages
│   ├── Toast.jsx               # Notification message component
│   │                           # Props: type, message, duration
│   │                           # Types: success, error, warning, info
│   └── index.js                # Export all UI components
```

#### **Authentication (`src/components/auth/`)**
```
├── src/components/auth/
│   ├── LoginForm.jsx           # User login interface
│   │                           # Fields: email/username, password
│   │                           # Features: remember me, forgot password
│   │                           # Validation: real-time form validation
│   ├── RegisterForm.jsx        # New user registration
│   │                           # Fields: username, email, password, confirm
│   │                           # Features: password strength, terms agreement
│   │                           # Validation: email format, password rules
│   ├── ForgotPassword.jsx      # Password reset interface
│   │                           # Fields: email
│   │                           # Features: send reset email, confirmation
│   ├── AuthGuard.jsx           # Protected route wrapper
│   │                           # Redirects to login if not authenticated
│   │                           # Checks JWT token validity
│   └── index.js                # Export authentication components
```

#### **3D World (`src/components/world/`)**
```
├── src/components/world/
│   ├── World.jsx               # Main 3D scene container
│   │                           # Features: Three.js scene setup, lighting
│   │                           # Physics: Cannon.js physics world
│   │                           # Camera: First/third person controls
│   ├── Player.jsx              # Other players in the world
│   │                           # Features: avatar rendering, name tags
│   │                           # Animation: walking, idle, gestures
│   │                           # Position: real-time position sync
│   ├── LocalPlayer.jsx         # Current user's avatar
│   │                           # Controls: WASD movement, mouse look
│   │                           # Mobile: virtual joystick controls
│   │                           # Physics: collision detection
│   ├── Environment.jsx         # Buildings, trees, terrain
│   │                           # Features: optimized rendering (LOD)
│   │                           # Collision: invisible collision meshes
│   │                           # Performance: instanced rendering for trees
│   ├── House.jsx               # Virtual house interior/exterior
│   │                           # Features: furniture placement, lighting
│   │                           # Interaction: clickable objects
│   │                           # Customization: color/texture changes
│   ├── Sky.jsx                 # Skybox and lighting
│   │                           # Features: day/night cycle, weather
│   │                           # Lighting: dynamic sun position
│   └── index.js                # Export world components
```

#### **Avatar System (`src/components/avatar/`)**
```
├── src/components/avatar/
│   ├── AvatarCreator.jsx       # Character creation interface
│   │                           # Integration: Ready Player Me SDK
│   │                           # Features: face customization, clothing
│   │                           # Preview: 3D avatar preview
│   ├── AvatarDisplay.jsx       # Show user's avatar
│   │                           # Features: 3D model rendering
│   │                           # Animation: idle animations
│   │                           # Interaction: rotation controls
│   ├── AvatarSelector.jsx      # Choose from saved avatars
│   │                           # Features: avatar gallery, preview
│   │                           # Management: save, delete, rename
│   └── index.js                # Export avatar components
```

#### **Voice Communication (`src/components/voice/`)**
```
├── src/components/voice/
│   ├── VoiceChat.jsx           # Voice communication controls
│   │                           # Features: mute/unmute, volume control
│   │                           # Proximity: distance-based volume
│   │                           # UI: speaking indicators, connection status
│   ├── VoiceSettings.jsx       # Audio configuration
│   │                           # Settings: microphone, speaker selection
│   │                           # Testing: mic test, echo cancellation
│   │                           # Quality: audio quality settings
│   ├── VoiceRoom.jsx           # Voice chat room management
│   │                           # Features: join/leave rooms
│   │                           # Users: show room participants
│   └── index.js                # Export voice components
```

#### **Gaming System (`src/components/games/`)**
```
├── src/components/games/
│   ├── CarRacing.jsx           # Racing game interface
│   │                           # Features: speedometer, position display
│   │                           # Controls: keyboard/touch controls
│   │                           # Physics: car physics simulation
│   ├── GameLobby.jsx           # Game selection and waiting area
│   │                           # Features: game browser, create game
│   │                           # Matchmaking: join suitable games
│   │                           # Settings: game configuration
│   ├── GameHUD.jsx             # In-game user interface
│   │                           # Features: score, timer, minimap
│   │                           # Status: player positions, game state
│   ├── Leaderboard.jsx         # High scores and statistics
│   │                           # Features: top players, personal stats
│   │                           # Filters: by game type, time period
│   └── index.js                # Export game components
```

#### **Social Features (`src/components/social/`)**
```
├── src/components/social/
│   ├── FriendsList.jsx         # Friends management
│   │                           # Features: friend list, online status
│   │                           # Actions: add, remove, block friends
│   │                           # Search: find users by username
│   ├── Chat.jsx                # Text messaging system
│   │                           # Features: public chat, private messages
│   │                           # Moderation: profanity filter, reporting
│   │                           # History: message history, search
│   ├── Phone.jsx               # Virtual phone interface
│   │                           # Features: contacts, call history
│   │                           # Voice calls: initiate voice calls
│   │                           # UI: phone-like interface design
│   ├── NotificationPanel.jsx   # In-game notifications
│   │                           # Features: friend requests, messages
│   │                           # Settings: notification preferences
│   └── index.js                # Export social components
```

#### **Premium Features (`src/components/premium/`)**
```
├── src/components/premium/
│   ├── SubscriptionPanel.jsx   # Premium upgrade interface
│   │                           # Features: subscription plans, pricing
│   │                           # Payment: Stripe integration
│   │                           # Benefits: feature comparison
│   ├── SpotifyPlayer.jsx       # Music control integration
│   │                           # Features: play/pause, track selection
│   │                           # Social: share now playing
│   │                           # Settings: volume, auto-play
│   ├── PremiumBadge.jsx        # Premium user indicator
│   │                           # Features: visual premium status
│   │                           # Display: special styling, animations
│   └── index.js                # Export premium components
```

#### **Admin Panel (`src/components/admin/`)**
```
├── src/components/admin/
│   ├── Dashboard.jsx           # Admin overview interface
│   │                           # Metrics: user count, server status
│   │                           # Charts: usage analytics, revenue
│   │                           # Quick actions: common admin tasks
│   ├── UserManagement.jsx      # Manage users interface
│   │                           # Features: user search, ban/unban
│   │                           # Data: user profiles, activity logs
│   │                           # Actions: modify user permissions
│   ├── Analytics.jsx           # Usage statistics and reports
│   │                           # Charts: user growth, engagement
│   │                           # Exports: data export, report generation
│   │                           # Filters: date ranges, user segments
│   ├── ServerStatus.jsx        # Server monitoring
│   │                           # Metrics: CPU, memory, connections
│   │                           # Alerts: server health warnings
│   │                           # Controls: server management actions
│   └── index.js                # Export admin components
```

### **React Hooks (`src/hooks/`)**
*Custom React hooks for reusable logic*
```
├── src/hooks/
│   ├── useAuth.js              # Authentication state management
│   │                           # Functions: login(), logout(), register()
│   │                           # State: user, isLoading, error
│   │                           # Auto: token refresh, session validation
│   ├── useSocket.js            # WebSocket connection management
│   │                           # Functions: emit(), on(), off()
│   │                           # State: connected, reconnecting
│   │                           # Auto: connection recovery, heartbeat
│   ├── useVoice.js             # Voice chat functionality
│   │                           # Functions: joinRoom(), leaveRoom(), mute()
│   │                           # State: speaking, muted, participants
│   │                           # WebRTC: peer connection management
│   ├── useGame.js              # Game state management
│   │                           # Functions: joinGame(), leaveGame(), updateState()
│   │                           # State: gameState, players, score
│   │                           # Sync: real-time game synchronization
│   ├── useLocalStorage.js      # Browser storage utility
│   │                           # Functions: setValue(), getValue(), removeValue()
│   │                           # Features: JSON serialization, change events
│   ├── useApi.js               # API request management
│   │                           # Functions: get(), post(), put(), delete()
│   │                           # Features: loading states, error handling
│   └── index.js                # Export all hooks
```

### **State Management (`src/store/`)**
*Redux Toolkit for global state*
```
├── src/store/
│   ├── index.js                # Redux store configuration
│   │                           # Setup: store creation, middleware
│   │                           # DevTools: Redux DevTools integration
│   ├── slices/                 # State slices (Redux Toolkit)
│   │   ├── auth.slice.js       # User authentication state
│   │   │                       # State: user, token, isAuthenticated
│   │   │                       # Actions: login, logout, updateProfile
│   │   ├── world.slice.js      # 3D world state
│   │   │                       # State: players, worldEvents, serverTime
│   │   │                       # Actions: updatePlayerPosition, addPlayer
│   │   ├── user.slice.js       # User profile and preferences
│   │   │                       # State: profile, settings, friends
│   │   │                       # Actions: updateSettings, addFriend
│   │   ├── game.slice.js       # Game session state
│   │   │                       # State: currentGame, score, leaderboard
│   │   │                       # Actions: joinGame, updateScore, endGame
│   │   ├── chat.slice.js       # Chat and messaging state
│   │   │                       # State: messages, contacts, unreadCount
│   │   │                       # Actions: sendMessage, markAsRead
│   │   └── index.js            # Export all slices
│   └── middleware/             # Custom Redux middleware
│       ├── socket.middleware.js # Handle WebSocket events in Redux
│       │                       # Features: emit actions, listen for events
│       │                       # Sync: sync Redux state with Socket.IO
│       ├── api.middleware.js   # API request middleware
│       │                       # Features: automatic token attachment
│       │                       # Error handling: global error processing
│       └── index.js            # Export all middleware
```

### **API Services (`src/services/`)**
*Functions to communicate with backend*
```
├── src/services/
│   ├── api.service.js          # HTTP requests to backend
│   │                           # Functions: get(), post(), put(), delete()
│   │                           # Features: token attachment, error handling
│   │                           # Endpoints: user, world, game, payment APIs
│   ├── socket.service.js       # WebSocket connection handling
│   │                           # Functions: connect(), disconnect(), emit()
│   │                           # Events: world updates, chat messages
│   │                           # Reconnection: automatic reconnection logic
│   ├── webrtc.service.js       # Voice chat peer connections
│   │                           # Functions: createPeerConnection(), handleOffer()
│   │                           # Features: ICE candidate handling, media streams
│   │                           # Proximity: distance-based voice quality
│   ├── spotify.service.js      # Spotify API integration
│   │                           # Functions: authenticate(), playTrack(), pause()
│   │                           # Features: playlist management, now playing
│   │                           # Premium: premium user features only
│   ├── storage.service.js      # Local data persistence
│   │                           # Functions: saveSettings(), loadSettings()
│   │                           # Features: encrypted storage, data migration
│   └── index.js                # Export all services
```

### **Utilities and Helpers (`src/utils/`)**
*General utility functions*
```
├── src/utils/
│   ├── three.helpers.js        # Three.js utility functions
│   │                           # Functions: loadModel(), setupLighting()
│   │                           # Performance: model optimization, LOD
│   │                           # Math: vector calculations, rotations
│   ├── physics.helpers.js      # Physics calculation helpers
│   │                           # Functions: calculateDistance(), checkCollision()
│   │                           # Movement: smooth interpolation, prediction
│   │                           # Validation: client-side physics validation
│   ├── validation.js           # Form and data validation
│   │                           # Functions: validateEmail(), validatePassword()
│   │                           # Rules: username format, input sanitization
│   │                           # Real-time: live form validation feedback
│   ├── constants.js            # Frontend constants and configurations
│   │                           # Values: API endpoints, default settings
│   │                           # Enums: user roles, game states, UI themes
│   │                           # Config: Three.js settings, physics constants
│   ├── formatters.js           # Data formatting utilities
│   │                           # Functions: formatDate(), formatCurrency()
│   │                           # Display: user-friendly data presentation
│   │                           # Localization: number and date formatting
│   └── helpers.js              # General utility functions
│                               # Functions: debounce(), throttle(), deepClone()
│                               # Performance: optimization helpers
│                               # DOM: element manipulation utilities
```

### **Styling (`src/styles/`)**
*CSS and styling configuration*
```
├── src/styles/
│   ├── globals.css             # Global CSS styles and Tailwind imports
│   │                           # Base: reset styles, typography
│   │                           # Tailwind: @tailwind directives
│   │                           # Custom: global utility classes
│   ├── components.css          # Component-specific styles
│   │                           # 3D: Three.js canvas styling
│   │                           # UI: custom component styles
│   │                           # Animations: CSS animations and transitions
│   ├── themes.css              # Light/dark theme variables
│   │                           # Variables: CSS custom properties
│   │                           # Themes: light mode, dark mode colors
│   │                           # Responsive: breakpoint definitions
│   └── mobile.css              # Mobile-specific styling overrides
│                               # Touch: touch-friendly UI elements
│                               # Layout: mobile layout adjustments
│                               # Performance: mobile optimizations
```

### **Testing (`src/tests/`)**
*Frontend testing files*
```
└── src/tests/
    ├── components/             # Component testing
    │   ├── auth/
    │   │   ├── LoginForm.test.js        # Test login form functionality
    │   │   └── RegisterForm.test.js     # Test registration form
    │   ├── world/
    │   │   ├── World.test.js            # Test 3D world rendering
    │   │   └── Player.test.js           # Test player component
    │   └── ui/
    │       ├── Button.test.js           # Test button component
    │       └── Modal.test.js            # Test modal component
    ├── hooks/                  # Custom hooks testing
    │   ├── useAuth.test.js              # Test authentication hook
    │   ├── useSocket.test.js            # Test WebSocket hook
    │   └── useGame.test.js              # Test game state hook
    ├── utils/                  # Utility function testing
    │   ├── validation.test.js           # Test validation functions
    │   └── helpers.test.js              # Test helper functions
    ├── services/               # Service testing
    │   ├── api.service.test.js          # Test API service
    │   └── socket.service.test.js       # Test Socket service
    └── fixtures/               # Test data and mocks
        ├── users.js                     # Mock user data
        ├── games.js                     # Mock game data
        └── world.js                     # Mock world state
```

---

## 🔧 **ADMIN PANEL (`apps/admin-panel/`)**
*Separate React app for administration*

```
apps/admin-panel/
├── package.json                # Admin panel dependencies
├── Dockerfile                  # Admin panel container setup
├── vite.config.js             # Admin-specific build configuration
├── src/
│   ├── main.jsx               # Admin app entry point
│   ├── App.jsx                # Admin app with protected routes
│   ├── components/
│   │   ├── Dashboard/
│   │   │   ├── Overview.jsx            # Server statistics overview
│   │   │   ├── UserMetrics.jsx         # User growth charts
│   │   │   ├── RevenueChart.jsx        # Revenue analytics
│   │   │   └── ServerHealth.jsx        # Server status monitoring
│   │   ├── Users/
│   │   │   ├── UserList.jsx            # Paginated user list
│   │   │   ├── UserDetail.jsx          # Individual user management
│   │   │   ├── BanManager.jsx          # User banning interface
│   │   │   └── RoleManager.jsx         # User role assignment
│   │   ├── Analytics/
│   │   │   ├── UsageReports.jsx        # Usage statistics reports
│   │   │   ├── GameAnalytics.jsx       # Game performance metrics
│   │   │   ├── PaymentReports.jsx      # Subscription analytics
│   │   │   └── ExportData.jsx          # Data export functionality
│   │   ├── Settings/
│   │   │   ├── ServerConfig.jsx        # Server configuration
│   │   │   ├── GameSettings.jsx        # Game parameter tuning
│   │   │   └── MaintenanceMode.jsx     # Maintenance mode toggle
│   │   └── Layout/
│   │       ├── Sidebar.jsx             # Admin navigation sidebar
│   │       ├── Header.jsx              # Admin header with user menu
│   │       └── Layout.jsx              # Admin layout wrapper
│   ├── pages/
│   │   ├── login.jsx                   # Admin login page
│   │   ├── dashboard.jsx               # Main dashboard page
│   │   ├── users.jsx                   # User management page
│   │   ├── analytics.jsx               # Analytics page
│   │   └── settings.jsx                # Settings page
│   ├── hooks/
│   │   ├── useAdmin.js                 # Admin authentication hook
│   │   ├── useAnalytics.js             # Analytics data hook
│   │   └── useUsers.js                 # User management hook
│   ├── services/
│   │   ├── admin.api.js                # Admin API requests
│   │   └── analytics.service.js        # Analytics data processing
│   └── utils/
│       ├── chart.helpers.js            # Chart configuration utilities
│       └── export.helpers.js           # Data export utilities
```

---

## 🏗️ **INFRASTRUCTURE (`infrastructure/`)**
*Deployment and server management*

### **Docker Configuration (`docker/`)**
```
infrastructure/
├── docker/
│   ├── backend.Dockerfile      # Backend container definition
│   │                           # Base: Node.js 18 Alpine Linux
│   │                           # Setup: install dependencies, copy source
│   │                           # Security: non-root user, minimal packages
│   ├── frontend.Dockerfile     # Frontend container definition
│   │                           # Build: multi-stage build (build + serve)
│   │                           # Optimization: static file compression
│   │                           # Server: Nginx for static file serving
│   ├── nginx.Dockerfile        # Reverse proxy container
│   │                           # Configuration: load balancing, SSL
│   │                           # Performance: static file caching
│   │                           # Security: rate limiting, DDoS protection
│   └── redis.Dockerfile        # Custom Redis configuration
│                               # Persistence: data backup configuration
│                               # Memory: optimized memory settings
│                               # Security: password protection
```

### **Kubernetes Deployment (`kubernetes/`)**
```
├── kubernetes/
│   ├── namespace.yaml          # Kubernetes namespace definition
│   │                           # Organization: separate environments
│   │                           # Resources: resource quotas, limits
│   ├── configmap.yaml          # Configuration data
│   │                           # Settings: app configuration, env vars
│   │                           # Secrets: database connections, API keys
│   ├── backend-deployment.yaml # Backend pod deployment
│   │                           # Replicas: multiple backend instances
│   │                           # Resources: CPU/memory limits
│   │                           # Health: readiness/liveness probes
│   ├── frontend-deployment.yaml # Frontend pod deployment
│   │                           # Static: static file serving
│   │                           # CDN: integration with CDN
│   ├── redis-deployment.yaml   # Redis cache deployment
│   │                           # Persistence: persistent volume claims
│   │                           # Backup: automated backup jobs
│   ├── mongodb-deployment.yaml # MongoDB database deployment
│   │                           # Replication: MongoDB replica set
│   │                           # Backup: regular database backups
│   ├── ingress.yaml           # External traffic routing
│   │                           # SSL: automatic SSL certificate
│   │                           # Routing: subdomain routing rules
│   │                           # Load balancing: traffic distribution
│   └── services.yaml          # Internal service networking
│                               # Discovery: service discovery setup
│                               # Ports: port mappings and protocols
```

### **Infrastructure as Code (`terraform/`)**
```
├── terraform/
│   ├── main.tf                 # Main infrastructure definition
│   │                           # Cloud: AWS/GCP/Azure resource setup
│   │                           # Networking: VPC, subnets, security groups
│   │                           # Compute: EC2 instances, load balancers
│   ├── variables.tf            # Configuration variables
│   │                           # Environment: staging, production configs
│   │                           # Scaling: auto-scaling parameters
│   ├── outputs.tf              # Infrastructure output values
│   │                           # Endpoints: service URLs, IP addresses
│   │                           # Credentials: access keys, certificates
│   ├── modules/
│   │   ├── database/           # Database infrastructure module
│   │   ├── networking/         # Network infrastructure module
│   │   └── security/           # Security configuration module
│   └── environments/
│       ├── staging.tfvars      # Staging environment variables
│       └── production.tfvars   # Production environment variables
```

### **Web Server Configuration (`nginx/`)**
```
└── nginx/
    ├── nginx.conf              # Main Nginx configuration
    │                           # Performance: gzip compression, caching
    │                           # Security: headers, rate limiting
    │                           # Proxy: reverse proxy configuration
    ├── sites-available/
    │   ├── immersio.conf       # Main site configuration
    │   └── admin.conf          # Admin panel configuration
    ├── ssl/                    # SSL certificate storage
    │   ├── cert.pem            # SSL certificate
    │   └── private.key         # SSL private key
    └── conf.d/
        ├── security.conf       # Security headers configuration
        ├── gzip.conf          # Compression settings
        └── cache.conf         # Static file caching rules
```

---

## 🤖 **AUTOMATION SCRIPTS (`scripts/`)**
*Development and deployment automation*

```
scripts/
├── deploy.sh                   # Automated deployment script
│                               # Functions: build, test, deploy
│                               # Environments: staging, production
│                               # Rollback: deployment rollback capability
├── backup.sh                   # Database backup automation
│                               # Frequency: daily automated backups
│                               # Storage: cloud storage upload
│                               # Retention: backup rotation policy
├── migrate.sh                  # Database migration runner
│                               # Migrations: run pending migrations
│                               # Rollback: migration rollback support
│                               # Validation: migration integrity checks
├── setup-dev.sh               # Development environment setup
│                               # Dependencies: install all dependencies
│                               # Database: setup local MongoDB/Redis
│                               # Configuration: create .env files
├── test.sh                     # Run all tests
│                               # Types: unit, integration, e2e tests
│                               # Coverage: code coverage reports
│                               # CI: continuous integration support
├── build.sh                    # Build all applications
│                               # Optimization: production builds
│                               # Assets: optimize images, compress files
│                               # Docker: build container images
└── monitor.sh                  # Server monitoring script
                                # Health: check server health
                                # Alerts: send notifications on issues
                                # Logs: aggregate and analyze logs
```

---

## 📊 **MONITORING AND LOGGING**

### **Log Files (Generated at Runtime)**
```
logs/
├── backend/
│   ├── error.log               # Backend error logs
│   ├── access.log              # API access logs
│   ├── socket.log              # WebSocket connection logs
│   └── game.log                # Game-specific event logs
├── frontend/
│   ├── console.log             # Frontend JavaScript errors
│   └── performance.log         # Performance metrics
├── nginx/
│   ├── access.log              # Web server access logs
│   └── error.log               # Web server error logs
└── database/
    ├── mongodb.log             # Database operation logs
    └── queries.log             # Slow query logs
```

### **Configuration Files for Monitoring**
```
monitoring/
├── prometheus.yml              # Metrics collection configuration
├── grafana/
│   ├── dashboards/
│   │   ├── system-metrics.json         # Server performance dashboard
│   │   ├── user-analytics.json         # User behavior dashboard
│   │   └── game-performance.json       # Game metrics dashboard
│   └── datasources/
│       └── prometheus.yml              # Data source configuration
└── alerts/
    ├── server-alerts.yml               # Server health alerts
    ├── user-alerts.yml                 # User activity alerts
    └── game-alerts.yml                 # Game performance alerts
```

---

## 🔐 **SECURITY AND CONFIGURATION**

### **Environment Configuration Examples**

#### **Backend Environment Variables (.env)**
```bash
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/immersio_dev
MONGODB_TEST_URI=mongodb://localhost:27017/immersio_test
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12

# External APIs
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
READY_PLAYER_ME_APP_ID=your_rpm_app_id

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
FROM_EMAIL=noreply@immersio.com

# Server Configuration
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
API_BASE_URL=http://localhost:3000/api

# File Storage
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif

# Monitoring
SENTRY_DSN=your_sentry_dsn_here
LOG_LEVEL=debug
LOG_TO_FILE=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOGIN_RATE_LIMIT_MAX=5
```

#### **Frontend Environment Variables (.env)**
```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
VITE_CDN_URL=http://localhost:3000/static

# External Services
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
VITE_READY_PLAYER_ME_SUBDOMAIN=your_rpm_subdomain

# App Configuration
VITE_APP_NAME=IMMERSIO
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=development

# Feature Flags
VITE_ENABLE_VOICE_CHAT=true
VITE_ENABLE_PREMIUM_FEATURES=true
VITE_ENABLE_ANALYTICS=false

# Performance
VITE_ENABLE_PERFORMANCE_MONITORING=true
VITE_MAX_TEXTURE_SIZE=2048
VITE_PHYSICS_FPS=60
```

---

## 📚 **KEY ENTRY POINTS FOR DEVELOPMENT**

### **Starting Development (First Time Setup)**
1. **Root Setup**: Run `npm install` in root directory
2. **Backend Setup**: Navigate to `apps/backend/`, copy `.env.example` to `.env`, run `npm install`
3. **Frontend Setup**: Navigate to `apps/frontend/`, copy `.env.example` to `.env`, run `npm install`
4. **Database**: Start MongoDB and Redis locally
5. **Run**: Use `npm run dev` in both backend and frontend directories

### **Key Files to Understand First**
1. **`apps/backend/server.js`** - Backend entry point
2. **`apps/frontend/src/main.jsx`** - Frontend entry point  
3. **`packages/shared/src/types/`** - Data structures used everywhere
4. **`apps/backend/src/models/`** - Database schemas
5. **`apps/frontend/src/components/world/World.jsx`** - Main 3D scene

### **Adding New Features**
1. **Database**: Add/modify models in `apps/backend/src/models/`
2. **API**: Create controllers and routes in `apps/backend/src/`
3. **Frontend**: Create components in `apps/frontend/src/components/`
4. **Real-time**: Add socket events in `apps/backend/src/sockets/`
5. **State**: Add Redux slices in `apps/frontend/src/store/slices/`

This structure provides a scalable, maintainable codebase using JavaScript/JSX that can handle thousands of concurrent users while supporting all the features described in the IMMERSIO project requirements.