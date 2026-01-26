# MERKLE MAN - Claude Agent Master Prompt

**Version:** 1.0
**Last Updated:** 2026-01-26
**Project Type:** 3D Web-Based Action Game

---

## 🎮 PROJECT OVERVIEW

**Merkle Man** is a 3D action-adventure game built with Three.js featuring multiple game modes, character animations, and mobile-optimized controls.

### Quick Facts
- **Location:** `/Users/paulbridges/stevo`
- **Main File:** `game.js` (7,590 lines, 293KB)
- **Tech Stack:** Three.js, Vanilla JavaScript, GSAP, Tailwind CSS
- **Deployment:** Vercel
- **Total Assets:** ~500MB (3D models + animations)

### Game Modes
1. **CHASE MODE (Level 1)** - Vertical endless runner, chase enemy through tunnel
2. **SHOOT MODE (Level 2)** - Urban maze navigation as tactical officer
3. **ANIMATION TEST** - Debug mode for character animation development

---

## 🏗️ ARCHITECTURE & KEY SYSTEMS

### Entry Points
- **index.html** - Landing page with hero section and theme music
- **game.html** - Game canvas container with Three.js renderer
- **select-stage.html** - Level/mission selection screen (Street Fighter style)

### Core Systems in game.js

#### 1. Game State Manager (lines 908-925)
```javascript
const GameState = {
    isRunning, isPaused, isGameOver,
    currentMode: 'CHASE' | 'SHOOT',
    score, highScore, lives,
    screen: 'START' | 'GAME' | 'GAME_OVER',
    selectedLevel: 'chase' | 'shoot' | 'shoot-horizontal',
    stageCompleted: boolean
}
```
**Purpose:** Central state management for game flow
**Agent Tasks:** Level progression, game over handling, state transitions

---

#### 2. Player Controller (lines 1205-1783)
```javascript
const PlayerController = {
    currentLane, targetLane, laneChangeSpeed: 8,
    isJumping, hasItem, isThrowing,
    isInvincible, invincibilityTimer: 2000ms
}
```
**Features:**
- 3-lane movement system (z positions: -3, 0, +3)
- Smooth lane transitions with easing
- Jump mechanics with gravity
- Item pickup and throwing
- Invincibility frames after damage

**Agent Tasks:** Movement refinement, control responsiveness, jump tuning

---

#### 3. Enemy Controller (lines 1785-1904)
**Behavior:**
- AI lane switching (random with delays)
- Speed adjustments based on player distance
- "Look Behind Run" animation when item thrown
- Dynamic positioning (ahead in CHASE, behind in HUNTED)

**Agent Tasks:** AI improvement, behavior patterns, difficulty balancing

---

#### 4. Animation System (lines 18-262)
**⚠️ CRITICAL COMPLEXITY:** 20 different animation version implementations (V1-V20)

**Known Issue:** Mixamo FBX animations flash/disappear at loop boundaries
**Root Cause:** `mixamorigHips.position` track moves character in world space
**Solution Applied:**
```javascript
clip.tracks = clip.tracks.filter(track =>
    track.name !== 'mixamorigHips.position'
);
model.position.set(0, 1.0, 0); // Manual positioning
```

**Reference:** See `ANIMATION_FIX_SUMMARY.md` for full details

**Agent Tasks:**
- Clean up 19 unused animation versions
- Identify which version is actively used
- Optimize animation transitions
- Debug new FBX imports

---

#### 5. Collision Detection (lines 5965-6069)
**Methods:**
- AABB (Axis-Aligned Bounding Box)
- BVH (Bounding Volume Hierarchy) via three-mesh-bvh
- Custom raycasting
- Multiple versions for testing

**Debug Tools:**
```javascript
window.enableCollisionDebug()  // Log collisions to console
toggleCollisionDebug(true)     // Show wireframe boxes
```

**Agent Tasks:** Consolidate collision versions, optimize performance, improve accuracy

---

#### 6. Obstacle System (lines 3438-3552)
```javascript
class Obstacle {
    mesh, active, lane, type,
    canMoveHorizontally,
    horizontalDirection, horizontalSpeed
}
```

**Obstacle Types:**
- **Barriers** - Stationary concrete barriers
- **Roller** - Road roller (moves horizontally)
- **Grader** - Road grader (moves horizontally)

**Features:** Object pooling for performance

**Agent Tasks:** Spawn rate tuning, new obstacle types, procedural patterns

---

#### 7. Pickup System (lines 3554-3676)
- Cola can models on ground
- Collection triggers throw ability
- Hidden when player holds item
- Thrown projectiles have cinematic camera follow

**Agent Tasks:** New pickup types, throw physics tuning

---

#### 8. Music Controller (lines 797-907)
```javascript
const MusicController = {
    level1Music: 'level1-music.mp3',
    themeMusic: 'merkleman-theme.mp3',
    currentlyPlaying, pendingPlay
}
```

**Features:**
- SessionStorage for music continuity across pages
- Fade in/out transitions
- Auto-resume on page navigation

**Agent Tasks:** Sound effects integration, dynamic music system

---

#### 9. Maze Controller (lines 1906-3143)
- 11x12 tile-based procedural maze
- Wall and corridor generation
- Exit marker placement
- Used in Level 2 (Shoot Mode)

**Agent Tasks:** New maze layouts, difficulty progression

---

#### 10. Gun/Shooting System (lines 4340-4523)
```javascript
const GunConfigs = {
    subMachineGun: { fireRate, damage, recoil },
    rifleConfig: { fireRate, damage, recoil }
}
```

**Effects:** Muzzle flash, smoke particles, shell casings, zoom

**Agent Tasks:** Weapon balancing, new weapon types, particle optimization

---

#### 11. UI System (lines 6905-7565)
- Start screen with magnetic buttons
- Game over screen with high scores
- Stage completion fade-to-black
- HUD (score, lives, FPS)
- Debug dashboard (toggle-able)

**Agent Tasks:** UI polish, mobile responsiveness, new screens

---

#### 12. Environment Manager (lines 3805-4007)
**Loads:**
- Tunnel environment (Level 1)
- Berlin station urban maze (Level 2)
- Road segments (procedural generation)
- Vehicle obstacles (cars, construction equipment)
- **Sky dome** (rotating 3D background for Level 1)

**Sky Dome System (NEW):**
- Immersive 3D background dome that rotates
- Replaces flat blue background with textured scenery
- Creates illusion of movement
- Configurable via `SKY_DOME_CONFIG` object
- See `SKY_DOME_GUIDE.md` for full documentation

**Agent Tasks:** New environments, lighting improvements, sky dome customization

---

#### 13. Input System (lines 929-1203)
**Desktop:** Keyboard (Arrow/WASD) and mouse
**Mobile:** Touch controls with canvas-based events

**Features:**
- Prevents browser gestures (zoom, scroll, pull-to-refresh)
- Virtual joystick (Nipplejs) for Level 2
- Portrait mode (Level 1) vs Landscape (Level 2)

**Agent Tasks:** Control refinement, gamepad support, accessibility

---

## 🐛 KNOWN ISSUES & BUGS

### 🔴 Critical (Fix Immediately)
1. **DEBUG = true** (line 718) - Must be `false` for production
2. **584 console.log statements** - Performance impact, cluttered console
3. **20 animation versions** - Code bloat, only need 1 working version

### 🟡 Medium Priority
4. **TODO: Car damage system** (lines 5461, 5594, 5640, 7424) - Disabled/unimplemented
5. **Router logic bug** (RALPH_COLLISION_TEST.md:72) - Needs debugging
6. **Outdated README.md** - Still references "Gap Tag" instead of "Merkle Man"
7. **No package.json** - All dependencies via CDN, no version locking
8. **No error handling** for asset loading failures (FBX/GLB files)

### 🟢 Low Priority
9. **Backup files clutter** - .bak, .backup files in root
10. **Test files unorganized** - 10+ HTML test files in root directory
11. **Hardcoded asset paths** - Should use config file
12. **Music relies on sessionStorage** - Breaks in private browsing
13. **Large asset sizes** - 350MB models + 150MB animations

---

## 📁 FILE STRUCTURE

```
/Users/paulbridges/stevo/
├── index.html                    # Landing page
├── game.html                     # Game canvas
├── select-stage.html             # Level selection
├── game.js                       # MAIN GAME ENGINE (7,590 lines)
│
├── CHARACTER ANIMATIONS (.fbx)
│   ├── jammer_run.fbx            # Player running
│   ├── jammer_jump.fbx           # Player jump
│   ├── jammer_pickup.fbx         # Item pickup
│   ├── jammer_throw.fbx          # Throwing
│   ├── jammer_run_holding.fbx    # Run with item
│   ├── Fast Run-3.fbx            # Enemy run
│   ├── Look Behind Run.fbx       # Enemy look back
│   ├── Officer.fbx               # Level 2 character
│   ├── Rifle Run.fbx             # Tactical movement
│   └── Others...
│
├── 3D MODELS (.glb)
│   ├── simple_cola_can.glb       # Throwable pickup
│   ├── porsche.glb               # Drivable car
│   ├── road_roller.glb           # Obstacle
│   ├── road_grader.glb           # Obstacle
│   ├── concrete_road_barrier_*.glb
│   ├── tunnel-road.glb           # Level 1 environment
│   ├── berlin-station.glb        # Level 2 urban maze
│   └── Others...
│
├── AUDIO
│   ├── merkleman-theme.mp3       # Landing page music
│   └── level1-music.mp3          # Level 1 background
│
├── DOCUMENTATION
│   ├── ANIMATION_FIX_SUMMARY.md  # FBX animation loop fixes
│   ├── ANIMATION_FIX_GUIDE.md    # Animation debugging guide
│   ├── SHOOT_IT_OUT_SETUP.md     # Level 2 setup docs
│   ├── RALPH_COLLISION_TEST.md   # Collision testing notes
│   └── CLAUDE_AGENT_GUIDE.md     # This file
│
├── TEST FILES (should be in /tests/)
│   ├── v1.html - v10.html
│   ├── animation-test-*.html
│   ├── debug-*.html
│   └── test-*.html
│
├── gap-chase/                    # Legacy 2D endless runner
└── 2020-bmw-m8-coupe/            # BMW M8 model folder
```

---

## 🔧 TECHNOLOGY STACK

### Core Dependencies (CDN)
- **Three.js** v0.160.0 - 3D rendering engine
- **Cannon-es** v0.20.0 - Physics engine (imported, underutilized)
- **three-mesh-bvh** v0.7.3 - Collision detection optimization
- **Nipplejs** v0.10.1 - Virtual joystick for mobile
- **GSAP** v3.12.2 - UI animation library
- **Tailwind CSS** v4.x - Utility CSS framework
- **Lucide Icons** - Icon library

### Asset Loaders
- **FBXLoader** - Mixamo character animations
- **GLTFLoader** - 3D models

### Fonts
- **Orbitron** - Futuristic display font
- **Rajdhani** - UI text font

---

## 🚀 DEVELOPMENT COMMANDS

### Local Development
```bash
cd /Users/paulbridges/stevo
python3 -m http.server 8000
open http://localhost:8000
```

### Deployment
```bash
vercel        # Deploy to production
vercel --prod # Force production deployment
```

### Git Workflow
```bash
git add .
git commit -m "Description of changes"
git push origin main
```

---

## 🤖 SPECIALIZED AGENT RECOMMENDATIONS

When working on this project, create these specialized agents for specific domains:

### 1. 🎬 Animation Debugger Agent
**When to use:** FBX animation issues, character flashing, loop problems
**Skills:** FBXLoader, Three.js AnimationMixer, Mixamo quirks
**Files:** lines 18-262, ANIMATION_FIX_SUMMARY.md
**Tools:** window.setAnimV1() through V20(), animation version testing

### 2. 💥 Collision Optimizer Agent
**When to use:** Collision inaccuracy, performance drops, false positives
**Skills:** AABB, BVH, spatial partitioning, raycasting
**Files:** lines 5965-6069, RALPH_COLLISION_TEST.md
**Tools:** window.enableCollisionDebug(), toggleCollisionDebug()

### 3. 📦 Asset Manager Agent
**When to use:** Loading new 3D models, textures, audio
**Skills:** GLTFLoader, FBXLoader, asset optimization, compression
**Files:** lines 3805-4007 (EnvironmentManager)
**Tools:** Three.js loaders, Blender for model editing

### 4. ⚡ Performance Profiler Agent
**When to use:** Low FPS, stuttering, memory leaks
**Skills:** Chrome DevTools, profiling, code optimization
**Tasks:** Remove console.logs, optimize draw calls, reduce polygon count
**Target:** 60 FPS desktop, 30+ FPS mobile

### 5. 📱 Mobile UX Agent
**When to use:** Touch control issues, responsive design problems
**Skills:** Touch events, virtual joystick, orientation handling
**Files:** lines 929-1203 (Input), lines 3145-3429 (HorizontalControls)
**Test devices:** iOS Safari, Android Chrome

### 6. 📝 Documentation Writer Agent
**When to use:** After major changes, for onboarding new developers
**Skills:** Technical writing, markdown, code commenting
**Files:** All .md files, inline comments in game.js
**Style:** Clear, concise, newbie-friendly

### 7. 🎨 Level Designer Agent
**When to use:** Creating new levels, modifying maze layouts
**Skills:** Procedural generation, game design, 3D environment composition
**Files:** lines 1906-3143 (MazeController), lines 3438-3552 (Obstacles)
**Tools:** Manual tile editing, spawn rate adjustment

### 8. 🎵 Audio Engineer Agent
**When to use:** Adding music, sound effects, audio bugs
**Skills:** Web Audio API, music continuity, audio formats
**Files:** lines 797-907 (MusicController)
**Formats:** MP3 (music), OGG (effects)

### 9. 🧹 Code Cleanup Agent
**When to use:** Before production deployment, code review
**Skills:** Dead code removal, console.log cleanup, file organization
**Tasks:** Remove debug statements, delete backups, organize tests
**Standards:** ESLint-compatible, production-ready

### 10. 🌐 Deployment Agent
**When to use:** Pushing to production, environment configuration
**Skills:** Vercel CLI, environment variables, CI/CD
**Files:** .vercel/project.json
**Commands:** vercel deploy, domain management

---

## 🎯 COMMON AGENT TASKS

### Task: Fix Animation Loops
```markdown
1. Read ANIMATION_FIX_SUMMARY.md
2. Identify which animation version is active (V1-V20)
3. Check if mixamorigHips.position track is removed
4. Test animation in animation-test-simple.html
5. Verify no flashing at loop boundaries
```

### Task: Add New 3D Model
```markdown
1. Place .glb file in root directory
2. Add GLTFLoader import in EnvironmentManager (lines 3805+)
3. Create load function following existing pattern
4. Position and scale model in scene
5. Test in tests.html or create new test page
```

### Task: Adjust Difficulty
```markdown
1. Obstacle spawn rate: Edit lines 3438-3552
2. Enemy speed: Edit EnemyController.speed
3. Player speed: Edit PlayerController.laneChangeSpeed
4. Lives count: Edit GameState.lives initialization
5. Invincibility duration: Edit PlayerController.invincibilityTimer
```

### Task: Debug Collision Issues
```markdown
1. Enable debug: window.enableCollisionDebug()
2. Show wireframes: toggleCollisionDebug(true)
3. Read RALPH_COLLISION_TEST.md
4. Check collision boxes align with visual models
5. Test with debug-collisions.html
```

### Task: Add Sound Effect
```markdown
1. Add .mp3/.ogg file to root directory
2. Create AudioLoader in game.js
3. Add to MusicController or create SoundController
4. Play on game events (collision, pickup, throw)
5. Test volume levels and timing
```

### Task: Optimize Performance
```markdown
1. Run Chrome DevTools Performance profiler
2. Identify bottlenecks (rendering, physics, scripts)
3. Reduce polygon count on heavy models
4. Use object pooling for repeated objects
5. Remove debug console.logs
6. Test on target devices
```

---

## 🧪 TESTING PROTOCOL

### Desktop Testing
1. Chrome/Edge (primary)
2. Firefox (secondary)
3. Safari (macOS)
4. Test all 3 game modes
5. Verify keyboard/mouse controls
6. Check 60 FPS performance

### Mobile Testing
1. iOS Safari (iPhone)
2. Android Chrome (various devices)
3. Portrait orientation (Level 1)
4. Landscape orientation (Level 2)
5. Touch controls responsiveness
6. Virtual joystick accuracy
7. Check 30+ FPS performance

### Pre-Deployment Checklist
- [ ] DEBUG = false
- [ ] All console.logs removed/commented
- [ ] Assets loading without errors
- [ ] Music plays correctly
- [ ] Collision detection accurate
- [ ] Animations loop smoothly
- [ ] Mobile controls responsive
- [ ] High score persistence works
- [ ] No JavaScript errors in console
- [ ] Tested on 3+ devices

---

## 🔐 SECURITY & BEST PRACTICES

### Security
- ✅ All assets loaded from same origin
- ✅ No external API calls
- ✅ No user data collection
- ✅ SessionStorage only for music state
- ⚠️ No input sanitization (not needed for single-player)

### Code Style
- Use ES6+ modules (import/export)
- Prefer const over let
- Avoid global variables (use GameState)
- Use object pooling for repeated objects
- Comment complex logic only
- Remove console.logs before production

### Performance Targets
- **Desktop:** 60 FPS minimum
- **Mobile:** 30 FPS minimum
- **Load Time:** <5 seconds initial
- **Asset Size:** Optimize to <300MB total
- **Memory:** <500MB RAM usage

---

## 📊 PROJECT STATISTICS

| Metric | Value |
|--------|-------|
| Main Game File | 293KB (7,590 lines) |
| Total 3D Models | 20+ (.glb files) |
| Total Animations | 15+ (.fbx files) |
| Asset Size | ~500MB total |
| Console Logs | 584 (needs cleanup) |
| Animation Versions | 20 (needs consolidation) |
| Collision Versions | Multiple (needs optimization) |
| Test Files | 10+ HTML files |
| Documentation Files | 5 .md files |

---

## 🚨 COMMON PITFALLS & SOLUTIONS

### Pitfall 1: Animation Flashing
**Symptom:** Character disappears/flashes at animation loop
**Cause:** Mixamo FBX position track
**Solution:** Remove mixamorigHips.position track, manually position model
**Reference:** ANIMATION_FIX_SUMMARY.md

### Pitfall 2: Collision Not Detecting
**Symptom:** Player passes through obstacles
**Cause:** Collision boxes not aligned with visual models
**Solution:** Use toggleCollisionDebug(true) to visualize boxes
**Debug:** window.enableCollisionDebug()

### Pitfall 3: Music Stops Between Pages
**Symptom:** Music restarts when navigating
**Cause:** Page reload kills audio context
**Solution:** sessionStorage tracking + MusicController resume
**Limitation:** Doesn't work in private browsing

### Pitfall 4: Mobile Controls Unresponsive
**Symptom:** Taps not registering on mobile
**Cause:** UI overlays blocking canvas events
**Solution:** Attach events to canvas with touch-action: none
**Files:** lines 929-1203

### Pitfall 5: Low FPS on Mobile
**Symptom:** Game stutters on phones
**Cause:** Too many polygons, particles, or draw calls
**Solution:** Reduce model complexity, limit particles, use object pooling
**Target:** 30 FPS minimum

---

## 📞 GETTING HELP

### Documentation Priority
1. **CLAUDE_AGENT_GUIDE.md** (this file) - Overview & systems
2. **SKY_DOME_GUIDE.md** - Sky dome background system (NEW)
3. **ANIMATION_FIX_SUMMARY.md** - Animation issues
4. **ANIMATION_FIX_GUIDE.md** - Detailed animation debugging
5. **SHOOT_IT_OUT_SETUP.md** - Level 2 documentation
6. **RALPH_COLLISION_TEST.md** - Collision testing notes

### Debug Commands (Console)
```javascript
// Animation versions
window.setAnimV1() through window.setAnimV20()

// Collision debugging
window.enableCollisionDebug()
window.disableCollisionDebug()
toggleCollisionDebug(true)

// Access objects
window.scene
window.player
window.enemy
window.shooterModel
```

### When Stuck
1. Check relevant .md documentation first
2. Search game.js for relevant system (Ctrl+F)
3. Look for console errors (F12)
4. Enable debug visualizations
5. Test in isolated HTML test file
6. Ask Claude with specific error messages

---

## 🎓 BEGINNER-FRIENDLY EXPLANATIONS

### What is Three.js?
A JavaScript library that makes WebGL (3D graphics in browsers) easy to use. Think of it as a game engine for the web.

### What are FBX files?
3D animation files from Mixamo (free character animation service). They contain skeleton bones and movement data.

### What are GLB files?
3D model files (like .obj or .fbx but better for web). They include geometry, textures, and materials in one file.

### What is object pooling?
Instead of creating/destroying objects constantly (slow), we reuse them. Like having a pool of obstacles ready to activate/deactivate.

### What is AABB collision?
Axis-Aligned Bounding Box - Simple box around objects to detect overlaps. Fast but not perfectly accurate.

### What is a game loop?
A function that runs 60 times per second, updating game logic and rendering graphics. Core of any game engine.

### What is sessionStorage?
Browser storage that persists data for one session (until tab closes). Used here for music continuity.

---

## 🔄 VERSION HISTORY

**v1.0** (2026-01-26) - Initial master prompt creation
- Documented all 13 core systems
- Identified 15+ known issues
- Created 10 specialized agent recommendations
- Added testing protocols and common tasks

---

## 📝 NOTES FOR AGENTS

### When Working on This Project:
1. **Always read relevant .md docs first** before making changes
2. **Test on both desktop and mobile** after modifications
3. **Check console for errors** - should be clean (no red)
4. **Verify animations don't flash** - Common regression
5. **Maintain 3-lane system** - Core mechanic for Level 1
6. **Preserve music continuity** - sessionStorage logic is fragile
7. **Keep collision accurate** - User experience depends on it

### Communication Style:
- Be specific about line numbers when referencing code
- Use file paths for clarity
- Explain "why" not just "what" for changes
- Test before claiming completion
- Document any new bugs discovered

### Code Philosophy:
- **Simplicity over cleverness** - This codebase is already complex
- **Don't over-engineer** - Keep solutions focused and minimal
- **Preserve working systems** - If it works, be careful changing it
- **Mobile-first** - Always consider touch controls and performance

---

**END OF MASTER PROMPT**

When in doubt, refer to this guide. Keep it updated as the project evolves.
