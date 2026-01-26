# Mobile Tester Skill

**Purpose:** Test and optimize mobile controls, touch input, and responsive design

**When to use this skill:**
- Touch controls not working
- Testing on phones/tablets
- Virtual joystick issues
- Mobile performance problems
- Responsive layout needs fixing

## Context

**Mobile Support:**
- Level 1: Portrait mode with left/right tap controls
- Level 2: Landscape mode with virtual joystick (Nipplejs)
- Target: 30+ FPS on mid-range mobile devices
- Prevents browser gestures (zoom, scroll, pull-to-refresh)

**Key Technologies:**
- Touch events (touchstart, touchmove, touchend)
- Nipplejs library (virtual joystick)
- CSS touch-action: none (disable default gestures)
- Orientation detection

## Key Files
- `game.js` lines 929-1203: Input System
- `game.js` lines 3145-3429: HorizontalControls (mobile joystick)
- `index.html`, `game.html`, `select-stage.html`: Mobile viewport settings

## Common Issues & Solutions

### Issue 1: Touch Controls Not Responding
**Symptoms:** Taps not registering, delayed response, controls feel "laggy"

**Possible causes:**
1. UI overlays blocking touch events
2. Touch events not attached to canvas
3. Default browser gestures interfering
4. Event listeners not passive

**Debug:**
```javascript
// Add to test touch events
canvas.addEventListener('touchstart', (e) => {
    console.log('Touch detected:', e.touches[0].clientX, e.touches[0].clientY);
    e.preventDefault();
}, { passive: false });
```

**Solutions:**
- Attach events directly to canvas
- Set `touch-action: none` on canvas
- Use `{ passive: false }` for preventDefault()
- Ensure z-index hierarchy correct

### Issue 2: Virtual Joystick Not Working
**Symptoms:** Joystick doesn't appear or movement not registered

**Check:**
1. Nipplejs library loaded?
2. Joystick initialized after DOM ready?
3. Joystick container div exists?
4. CSS positioning correct?

**Debug:**
```javascript
// Check if joystick exists
console.log('Joystick manager:', joystickManager);

// Test joystick events
joystickManager.on('move', (evt, data) => {
    console.log('Joystick move:', data.angle.degree, data.force);
});
```

### Issue 3: Portrait/Landscape Orientation Issues
**Symptoms:** Layout broken when rotating device, controls in wrong position

**Solutions:**
```javascript
// Detect orientation change
window.addEventListener('orientationchange', () => {
    location.reload(); // Simple solution
});

// Or handle dynamically
function handleOrientationChange() {
    if (window.innerWidth > window.innerHeight) {
        // Landscape mode
        GameState.isHorizontalMode = true;
    } else {
        // Portrait mode
        GameState.isHorizontalMode = false;
    }
    // Reposition UI elements
    resizeCanvas();
}
```

### Issue 4: Unwanted Browser Gestures
**Symptoms:** Page zooms, scrolls, or refreshes during gameplay

**Prevention:**
```css
/* In CSS */
canvas {
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
}

body {
    overscroll-behavior: none;
    overflow: hidden;
}
```

```javascript
// In JavaScript
document.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });

document.addEventListener('gesturestart', (e) => {
    e.preventDefault();
});
```

### Issue 5: Performance on Mobile
**Symptoms:** FPS drops below 30, stuttering, overheating

**Optimizations:**
- Reduce shadow quality
- Lower resolution (renderer.setPixelRatio(1) instead of 2)
- Reduce polygon count on models
- Limit particles and effects
- Use mobile-specific graphics settings

```javascript
// Detect mobile and adjust quality
const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);

if (isMobile) {
    renderer.setPixelRatio(1); // Lower resolution
    renderer.shadowMap.enabled = false; // Disable shadows
    // Reduce particle counts, effect quality, etc.
}
```

## Your Tasks

### 1. Test Touch Controls

**Portrait Mode (Level 1):**
1. Load game on mobile device
2. Start Level 1 (Chase Mode)
3. Tap left side of screen - player should move left
4. Tap right side of screen - player should move right
5. Verify tap zones are appropriate size
6. Check for delayed response or missed taps

**Expected behavior:**
- Instant response to taps
- Clear visual feedback
- No accidental browser gestures
- Smooth lane transitions

### 2. Test Virtual Joystick

**Landscape Mode (Level 2):**
1. Load game and rotate to landscape
2. Start Level 2 (Shoot Mode)
3. Verify joystick appears in corner
4. Drag joystick in all directions
5. Verify character moves accordingly
6. Test edge cases (release joystick, move to edge of screen)

**Expected behavior:**
- Joystick appears in correct position
- Smooth 360° movement
- Returns to center when released
- Visual feedback clear

### 3. Test Orientation Changes

**Test sequence:**
1. Load game in portrait
2. Rotate to landscape
3. Rotate back to portrait
4. Check for layout issues, broken controls
5. Verify game still playable after rotation

**Expected behavior:**
- Layout adjusts correctly
- Controls repositioned appropriately
- Game state preserved
- No visual glitches

### 4. Test on Multiple Devices

**Device categories to test:**
- **Small phone** (iPhone SE, small Android)
- **Large phone** (iPhone Pro Max, large Android)
- **Tablet** (iPad, Android tablet)
- **Different OS** (iOS vs Android)

**What to check:**
- Screen size scaling
- Touch target sizes (minimum 44x44px)
- Performance (FPS)
- Control positioning
- Text readability

### 5. Performance Testing

**Steps:**
1. Play game for 5 minutes on device
2. Monitor FPS (should stay 30+)
3. Check for overheating
4. Test battery drain
5. Check for memory leaks (app shouldn't grow indefinitely)

**If performance poor:**
- Lower graphics quality
- Reduce asset sizes
- Optimize code (see performance-profiler.md)

## Testing Checklist

### Pre-Testing Setup
- [ ] Device connected to same network as dev machine
- [ ] Game running on local server (python -m http.server)
- [ ] Access game at http://[YOUR-IP]:8000 on mobile
- [ ] Enable remote debugging (Chrome DevTools for Android, Safari for iOS)

### Touch Controls Test
- [ ] Left tap moves left
- [ ] Right tap moves right
- [ ] No accidental zoom/scroll
- [ ] Response time <100ms
- [ ] No missed taps

### Virtual Joystick Test
- [ ] Joystick appears correctly
- [ ] All directions work
- [ ] Smooth movement
- [ ] Returns to center
- [ ] Visual feedback clear

### Orientation Test
- [ ] Portrait layout correct
- [ ] Landscape layout correct
- [ ] Rotation handled smoothly
- [ ] Controls repositioned
- [ ] Game playable in both modes

### Performance Test
- [ ] 30+ FPS sustained
- [ ] No stuttering
- [ ] No overheating
- [ ] Battery drain acceptable
- [ ] Memory stable

### Compatibility Test
- [ ] Works on iOS Safari
- [ ] Works on Android Chrome
- [ ] Works on different screen sizes
- [ ] Touch targets adequate size
- [ ] Text readable

## Mobile Debugging

### Remote Debugging Setup

**Android (Chrome):**
1. Enable USB debugging on Android device
2. Connect via USB
3. Open chrome://inspect on desktop Chrome
4. Click "Inspect" on your device
5. Use DevTools as normal

**iOS (Safari):**
1. Enable Web Inspector on iOS (Settings > Safari > Advanced)
2. Connect via USB
3. Open Safari on Mac
4. Develop menu > [Your Device] > [Page]
5. Use Web Inspector

### Console Logging on Mobile
```javascript
// Create visible debug output on screen
const debugDiv = document.createElement('div');
debugDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0,0,0,0.8);
    color: lime;
    padding: 10px;
    font-family: monospace;
    font-size: 12px;
    z-index: 10000;
    max-height: 200px;
    overflow: auto;
`;
document.body.appendChild(debugDiv);

function mobileLog(msg) {
    debugDiv.innerHTML += msg + '<br>';
    debugDiv.scrollTop = debugDiv.scrollHeight;
}

// Use in game
mobileLog('Touch detected at: ' + x + ',' + y);
```

### Touch Event Visualization
```javascript
// Show touch points visually
canvas.addEventListener('touchstart', (e) => {
    Array.from(e.touches).forEach(touch => {
        const dot = document.createElement('div');
        dot.style.cssText = `
            position: fixed;
            left: ${touch.clientX - 25}px;
            top: ${touch.clientY - 25}px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: rgba(255,0,0,0.5);
            pointer-events: none;
            z-index: 10000;
        `;
        document.body.appendChild(dot);
        setTimeout(() => dot.remove(), 500);
    });
});
```

## Mobile Optimization Tips

### 1. Reduce Pixel Ratio
```javascript
if (isMobile) {
    renderer.setPixelRatio(1); // Instead of window.devicePixelRatio
}
```

### 2. Disable Expensive Effects
```javascript
if (isMobile) {
    renderer.shadowMap.enabled = false;
    // Reduce particles
    // Simplify materials
}
```

### 3. Optimize Asset Loading
```javascript
// Load lower-poly models for mobile
const modelPath = isMobile ? 'model-low.glb' : 'model-high.glb';
```

### 4. Adjust Camera
```javascript
// Reduce render distance on mobile
if (isMobile) {
    camera.far = 500; // Instead of 1000
}
```

## Success Criteria

- ✅ Touch controls responsive (<100ms latency)
- ✅ Virtual joystick works smoothly
- ✅ No unwanted browser gestures
- ✅ Works in both portrait and landscape
- ✅ 30+ FPS on mid-range devices
- ✅ Tested on iOS and Android
- ✅ No crashes or freezes
- ✅ Battery drain reasonable

## Notes

- **Always test on real devices** - Emulators not accurate for touch
- **Use remote debugging** - Essential for console access
- **Target 30 FPS minimum** - Mobile GPUs weaker than desktop
- **Touch targets 44x44px minimum** - Apple's HIG recommendation
- **Test in poor network conditions** - Asset loading may fail
- **Consider data usage** - 500MB assets = expensive on mobile data
