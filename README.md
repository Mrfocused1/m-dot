# Gap Tag 🦷

A vertical endless runner mobile game where you chase an enemy who has your missing tooth!

## Game Concept

You play as a character with a tooth gap, chasing an enemy who stole your tooth. The game alternates between two modes:
- **CHASE MODE**: Run upward chasing the enemy above you
- **HUNTED MODE**: The enemy chases you! Run and survive for 10 seconds

## How to Play

### Controls
- **Tap LEFT** side of screen: Move to the left lane
- **Tap RIGHT** side of screen: Move to the right lane

### Objective
- Chase and catch the enemy to score points (+1000)
- Avoid obstacles (toothbrushes, dental floss, mirrors)
- Survive HUNTED mode to earn bonus points (+500)
- Don't lose all 3 lives!

### Obstacles
- **Toothbrush** (green): Stationary dental hazard
- **Dental Floss** (yellow): Moves side to side
- **Mirror** (blue): Reflects your gap shame

## Running the Game

### Option 1: Local Server (Current Setup)

The game is currently running on `http://localhost:8000`

```bash
# Server is already running, just open in browser:
open http://localhost:8000
```

To start a new server:
```bash
cd /Users/paulbridges/stevo
python3 -m http.server 8000
```

### Option 2: Deploy Online

You can deploy this game to any static hosting service:

**Netlify (Recommended)**:
1. Install Netlify CLI: `npm install -g netlify-cli`
2. Run: `netlify deploy`
3. Follow prompts to deploy
4. Get a public URL like: `https://gap-tag.netlify.app`

**Vercel**:
1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel`
3. Get a public URL

**GitHub Pages**:
1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Access at: `https://yourusername.github.io/repository-name`

## Files

- `index.html` - Main HTML file with canvas element
- `game.js` - Complete game logic (all systems in one file)
- `README.md` - This file

## Technical Details

### Architecture
- Vanilla JavaScript (no frameworks)
- HTML5 Canvas for rendering
- Fixed timestep game loop (60 FPS)
- Object pooling for obstacles
- LocalStorage for high score persistence

### Mobile Optimizations
- Portrait orientation only
- Touch controls with visual feedback
- Prevents default browser gestures
- Responsive canvas sizing
- No double-tap zoom
- No pull-to-refresh

### Game Systems
1. **Input System**: Touch and mouse support
2. **Player Character**: 3-lane movement with smooth transitions
3. **Enemy AI**: Random lane switching, position changes based on mode
4. **Mode Manager**: Alternates between CHASE and HUNTED modes
5. **Obstacle System**: Procedural spawning with object pooling
6. **Collision Detection**: AABB (bounding box) collision
7. **Scoring System**: Distance-based + bonus points
8. **Lives System**: 3 lives with invincibility frames after hit
9. **UI System**: Start screen, game over screen, HUD elements

## Development

### Debug Mode
Set `DEBUG = true` in `game.js` to see:
- FPS counter
- Current screen state
- Current mode
- Score
- Touch input visualization

### Testing
- Desktop: Use mouse clicks (left/right half of screen)
- Mobile: Use touch input
- Test in portrait orientation for best experience

## Browser Compatibility

Tested on:
- Chrome/Edge (desktop and mobile)
- Safari (desktop and iOS)
- Firefox (desktop and mobile)

Requires:
- HTML5 Canvas support
- LocalStorage support
- Touch events (for mobile)

## Future Enhancements

Possible additions:
- Sound effects and background music
- Power-ups (speed boost, shield, etc.)
- Multiple character skins
- Difficulty levels
- Online leaderboards
- Achievements system
- Social sharing

## Credits

Built with:
- HTML5 Canvas API
- Vanilla JavaScript
- Research from MDN Web Docs, GitHub tutorials, and game development patterns

Game concept: "Gap Tag" - A mockery game centered around a tooth gap character.

## License

Free to use and modify. Have fun!