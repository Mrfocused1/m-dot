# Gap Chase 🦷🏃

A horizontal endless runner game where you chase down the thief who stole your tooth!

## 🎮 Gameplay

You play as a character with a tooth gap, desperately chasing an enemy who has your missing tooth. Jump over procedurally generated gaps in the ground while the game speeds up over time!

### How to Play

- **Tap anywhere** to jump
- **Tap again in mid-air** for a double jump
- Jump over gaps in the ground - don't fall!
- Chase the tooth thief running ahead
- Survive as long as possible and set high scores

## 🎯 Controls

| Platform | Control |
|----------|---------|
| Mobile | Tap anywhere on screen |
| Desktop | Click mouse, Spacebar, or Up Arrow |

## ✨ Features

- **Smooth horizontal scrolling** with parallax backgrounds
- **Physics-based jumping** with realistic gravity
- **Double jump mechanic** - tap again in mid-air
- **Procedural gap generation** - always fair, never impossible
- **Progressive difficulty** - speed increases over time
- **Coyote time** - forgiving jump timing at ledge edges
- **Jump buffering** - responsive controls
- **Local high score** persistence
- **Mobile-optimized** - best in landscape orientation
- **Tooth gap theme** - mockery game concept

## 🎨 Game Mechanics

### Jump State Machine
- **GROUNDED** - Standing on platform
- **JUMPING** - First jump (tap once)
- **FALLING** - Descending or ran off edge
- **DOUBLE_JUMPING** - Second jump used (tap again)

### Coyote Time
You can still jump for 80ms after running off an edge - no frustrating missed jumps!

### Jump Buffering
Press jump up to 100ms before landing and it will register immediately upon landing.

### Difficulty Progression
- Scroll speed increases from 200 to 500 pixels/second
- Gap width increases with difficulty
- Platforms become shorter
- Every 5 gaps, you get a "rest" gap (easy jump)

## 📁 Files

- `index.html` - HTML5 structure with mobile meta tags and landscape orientation
- `game.js` - Complete game logic (~1100 lines of vanilla JavaScript)
- `README.md` - This file

## 🚀 Running Locally

1. Start a local server:
   ```bash
   cd /Users/paulbridges/stevo/gap-chase
   python3 -m http.server 8000
   ```

2. Open in your browser:
   ```
   http://localhost:8000
   ```

3. For mobile testing, use your local IP:
   ```
   http://YOUR_IP:8000
   ```

## 🌐 Deploying Online

Deploy to any static hosting service:

**Vercel (Recommended):**
```bash
cd /Users/paulbridges/stevo/gap-chase
npx vercel --prod
```

**Netlify:**
```bash
npx netlify-cli deploy --dir=. --prod
```

**GitHub Pages:**
1. Create a GitHub repository
2. Push the gap-chase folder
3. Enable Pages in settings

## 🔧 Technical Details

### Architecture
- **Vanilla JavaScript** - No frameworks, pure JS
- **HTML5 Canvas** - 2D rendering
- **Fixed timestep** - 60 updates per second
- **Object pooling** - Efficient platform reuse
- **Design resolution** - 800x450 (scales to any screen)
- **Parallax scrolling** - 3 background layers

### Physics
- Gravity: 1800 px/s²
- Jump velocity: -600 px/s
- Double jump: -500 px/s
- Terminal velocity cap
- Frame-independent physics

### Procedural Generation
- Pattern-based + random generation
- Physics-validated (all gaps are jumpable)
- Difficulty-scaled gap sizing
- Mix of easy, medium, hard patterns
- Safety mechanisms (rest gaps every 5 jumps)

## 🎯 Scoring

- **Distance** - 1 point per 10 pixels traveled
- **Gaps cleared** - 10 points per gap
- **Combo multiplier** - Up to 5x for consecutive gaps
- **High score** - Saved to localStorage

## 📱 Mobile Optimizations

- Portrait mode shows rotation prompt
- No pinch-zoom
- No double-tap zoom
- No pull-to-refresh
- No context menu on long-press
- Touch-optimized hitboxes
- Responsive canvas scaling

## 🐛 Known Features

- **Coyote Time** - Grace period after running off edge
- **Jump Buffering** - Pre-input jump before landing
- **Forgiving hitboxes** - 5px padding on player
- **Delta time capping** - Prevents physics breaks on tab switch
- **Pool auto-expansion** - Never runs out of platforms

## 🎓 Lessons from Gap Tag

This game builds on lessons learned from the vertical endless runner "Gap Tag":
- Better initialization order (no TDZ errors)
- Proper state machine for screens
- Clean object pooling
- Fixed timestep physics
- Mobile-first design
- Comprehensive testing at each phase

## 🏆 High Score Tips

1. **Use double jump wisely** - Save it for wide gaps
2. **Jump early** - Coyote time is your friend
3. **Stay calm** - Speed increases gradually
4. **Watch ahead** - See gaps coming
5. **Take rest gaps** - Every 5th gap is easier

## 📝 Credits

- Built following detailed Opus implementation plan
- Research from HTML5 game development tutorials
- Inspired by classic endless runners
- Part of the Gap-toothed game series

## 🎮 Related Games

- **Gap Tag** - Vertical endless runner (tap left/right to move lanes)
- **Gap Chase** - Horizontal endless runner (this game!)

---

**Have fun chasing your tooth!** 🦷✨
