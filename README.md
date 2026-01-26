# Merkle Man 🦷✨

A 3D action-adventure web game built with Three.js featuring multiple game modes, character animations, and mobile-optimized controls.

## Game Concept

You play as **Merkle Man**, a character on a mission to retrieve a stolen tooth from an opponent. The game features multiple missions with different gameplay styles:

### Game Modes
- **PROTOCOL ONE (Chase Mode)** - Vertical endless runner where you chase the enemy through a tunnel
- **PROTOCOL TWO (Shoot Mode)** - Urban maze navigation as a tactical officer
- **Animation Testing** - Debug mode for character animation development

## How to Play

### Controls

**Desktop:**
- **Arrow Keys** or **A/D** - Move left/right (Chase Mode)
- **Space** - Jump
- **E** - Pick up items
- **Mouse** - Throw items
- **WASD** - Movement (Shoot Mode)
- **Mouse** - Aim and shoot

**Mobile:**
- **Tap LEFT** side of screen - Move left (Chase Mode)
- **Tap RIGHT** side of screen - Move right
- **Virtual Joystick** - Movement (Shoot Mode)
- **Touch controls** - Aim and shoot

### Objective

**PROTOCOL ONE (Chase Mode):**
- Chase and catch the enemy running ahead of you
- Dodge obstacles (road rollers, graders, concrete barriers)
- Collect cola cans to throw at the enemy
- Don't lose all 3 lives!
- Reach the end of the tunnel to complete the mission

**PROTOCOL TWO (Shoot Mode):**
- Navigate through an urban maze environment
- Find the exit marker
- Avoid obstacles and navigate tight corridors
- Complete the mission to progress

### Obstacles & Collectibles

**Chase Mode:**
- **Concrete Barriers** - Stationary obstacles to avoid
- **Road Roller** - Moves horizontally across lanes
- **Road Grader** - Moves horizontally, larger hitbox
- **Cola Cans** - Collectible items you can pick up and throw at the enemy

## Running the Game

### Option 1: Local Server (Recommended for Development)

```bash
cd /Users/paulbridges/stevo
python3 -m http.server 8000
```

Then open in your browser:
```
http://localhost:8000
```

### Option 2: Deploy Online

**Vercel (Currently Configured):**
```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Deploy to production
vercel

# Or force production deployment
vercel --prod
```

**Netlify:**
1. Install Netlify CLI: `npm install -g netlify-cli`
2. Run: `netlify deploy`
3. Follow prompts to deploy

**GitHub Pages:**
1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Access at: `https://yourusername.github.io/repository-name`

## Project Structure

### Entry Points
- `index.html` - Landing page with hero section and theme music
- `game.html` - Game canvas where the 3D game renders
- `select-stage.html` - Level/mission selection screen

### Core Files
- `game.js` - Main game engine (7,590 lines, 293KB)
  - Game state management
  - Player and enemy controllers
  - Animation system (20 versions for debugging)
  - Collision detection
  - Obstacle and pickup systems
  - Maze generation
  - Gun/shooting mechanics
  - Music controller
  - UI system

### Assets
- **3D Models (.glb)** - Characters, vehicles, environments (~350MB)
- **Animations (.fbx)** - Mixamo character animations (~150MB)
- **Audio (.mp3)** - Theme music and level background music
- **Images (.png)** - Hero images, logos

### Documentation
- `CLAUDE_AGENT_GUIDE.md` - Master prompt for Claude AI assistance
- `ANIMATION_FIX_SUMMARY.md` - FBX animation loop fix documentation
- `ANIMATION_FIX_GUIDE.md` - Detailed animation debugging guide
- `SHOOT_IT_OUT_SETUP.md` - Level 2 setup and configuration
- `RALPH_COLLISION_TEST.md` - Collision detection testing notes

### Skills (Claude Code Integration)
Located in `.claude/skills/`:
- `animation-debugger.md` - Fix FBX animation issues
- `collision-optimizer.md` - Optimize collision detection
- `performance-profiler.md` - Improve game performance
- `asset-manager.md` - Manage 3D assets
- `mobile-tester.md` - Test mobile controls
- `code-cleaner.md` - Clean up code for production

## Technical Details

### Technology Stack

**Core Technologies:**
- **Three.js** v0.160.0 - 3D graphics rendering engine
- **Vanilla JavaScript** (ES6+ modules) - Game logic
- **HTML5/CSS3** - UI and styling
- **Tailwind CSS** - Utility-first CSS framework

**3D & Physics:**
- **Cannon-es** v0.20.0 - Physics engine (imported)
- **three-mesh-bvh** v0.7.3 - Bounding Volume Hierarchy for collision
- **FBXLoader** - Loads Mixamo character animations
- **GLTFLoader** - Loads 3D models

**UI & Mobile:**
- **GSAP** v3.12.2 - Animation library for UI transitions
- **Nipplejs** v0.10.1 - Virtual joystick for mobile controls
- **Lucide Icons** - Icon library

**Deployment:**
- **Vercel** - Hosting and deployment

### Architecture

The game uses a modular architecture with the following core systems:

1. **Game State Manager** - Central state management
2. **Player Controller** - 3-lane movement, jumping, item mechanics
3. **Enemy Controller** - AI behavior and animations
4. **Animation System** - 20 versions for debugging FBX issues
5. **Collision Detection** - AABB, BVH, and custom raycasting
6. **Obstacle System** - Object pooling for performance
7. **Pickup System** - Collectibles and throwing mechanics
8. **Music Controller** - Background music with session continuity
9. **Maze Controller** - Procedural maze generation for Level 2
10. **Gun/Shooting System** - Weapons for Level 2
11. **UI System** - Menus, HUD, game over screens
12. **Environment Manager** - Loads 3D environments

### Mobile Optimizations
- Portrait orientation for Level 1 (Chase Mode)
- Landscape orientation for Level 2 (Shoot Mode)
- Touch controls with visual feedback
- Virtual joystick for 360° movement
- Prevents default browser gestures
- Responsive canvas sizing
- No double-tap zoom
- No pull-to-refresh
- Optimized rendering for mobile GPUs

### Performance Targets
- **Desktop:** 60 FPS minimum
- **Mobile:** 30 FPS minimum
- **Load Time:** <5 seconds
- **Memory Usage:** <500MB

## Development

### Local Development

Start local server:
```bash
python3 -m http.server 8000
```

Access game:
```
http://localhost:8000
```

### Debug Mode

Debug mode is controlled by the `DEBUG` constant in `game.js` (line 746):

```javascript
const DEBUG = false; // Set to true for debugging
```

When enabled, shows:
- FPS counter
- Position tracking
- Collision visualization
- Console logging

### Debug Commands (Console)

```javascript
// Animation version testing
window.setAnimV1() // through window.setAnimV20()

// Collision debugging
window.enableCollisionDebug()
window.disableCollisionDebug()
toggleCollisionDebug(true)

// Access game objects
scene
player
enemy
shooterModel
```

### Testing

**Desktop:**
- Test in Chrome/Edge (primary)
- Test in Firefox and Safari
- Use keyboard/mouse controls
- Verify 60 FPS performance

**Mobile:**
- Test on iOS Safari and Android Chrome
- Test in both portrait and landscape
- Verify touch controls responsive
- Check 30+ FPS performance

## Browser Compatibility

**Tested on:**
- Chrome/Edge (desktop and mobile) ✅
- Safari (macOS and iOS) ✅
- Firefox (desktop and mobile) ✅

**Requires:**
- WebGL 2.0 support
- ES6+ JavaScript support
- HTML5 Canvas
- Web Audio API
- Touch events (for mobile)

## Known Issues

### Critical
- 20 animation versions exist for debugging (should consolidate to 1)
- Multiple collision detection implementations (should optimize)

### Medium Priority
- Car damage system not fully implemented (TODOs in code)
- Music continuity relies on sessionStorage (breaks in private browsing)
- No error handling for asset loading failures

### Low Priority
- Large asset sizes (~500MB total)
- No package.json for dependency management
- Asset paths are hardcoded

See `CLAUDE_AGENT_GUIDE.md` for comprehensive issue documentation.

## Common Development Tasks

### Adding a New 3D Model
1. Place `.glb` file in project root
2. Add loading code in `EnvironmentManager` (game.js lines 3805+)
3. Position and scale model
4. Test in game

### Adding a New Animation
1. Download from Mixamo "With Skin"
2. Place `.fbx` file in root
3. Remove `mixamorigHips.position` track (see ANIMATION_FIX_SUMMARY.md)
4. Add to character's animation actions
5. Test for smooth looping

### Adjusting Difficulty
- Obstacle spawn rate: Edit lines 3438-3552
- Enemy speed: Edit `EnemyController.speed`
- Player speed: Edit `PlayerController.laneChangeSpeed`
- Lives: Edit `GameState.lives`

### Adding Sound Effects
1. Add `.mp3` file to project root
2. Load via `AudioLoader`
3. Play on game events
4. Test volume levels

## Future Enhancements

Possible additions:
- [ ] More game modes and missions
- [ ] Multiplayer support
- [ ] Additional weapons and power-ups
- [ ] Character customization
- [ ] Achievements system
- [ ] Online leaderboards
- [ ] More environmental variety
- [ ] Story mode with cutscenes
- [ ] VR support

## Credits

**Game Concept:** Merkle Man - A 3D action-adventure game

**Technology:**
- Three.js - 3D rendering engine
- Mixamo - Character animations
- Various 3D models from Sketchfab and other sources
- Music and sound effects

**Development:**
- Built with vanilla JavaScript and Three.js
- Hosted on Vercel

## License

Free to use and modify for personal and educational purposes.

## Getting Help

### Documentation
1. Start with `CLAUDE_AGENT_GUIDE.md` for comprehensive overview
2. Check specific .md files for detailed topics
3. Review code comments in `game.js`

### Using Claude Code Skills
This project includes custom skills for common tasks:
- `/animation-debugger` - Fix animation issues
- `/collision-optimizer` - Fix collision detection
- `/performance-profiler` - Optimize performance
- `/asset-manager` - Manage 3D assets
- `/mobile-tester` - Test mobile controls
- `/code-cleaner` - Clean up code

### Support
For bugs, questions, or contributions, please create an issue in the repository.

---

**Have fun playing Merkle Man!** 🦷✨
