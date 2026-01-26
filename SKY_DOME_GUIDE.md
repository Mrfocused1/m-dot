# Sky Dome Implementation Guide

## Overview

The sky dome has been successfully added to Level 1 (Chase Mode) to create an immersive background that fills in the blue gaps and creates an illusion of movement.

## How It Works

### Concept
- A large 3D dome model encompasses the entire game scene
- The dome rotates slowly around the Y-axis (vertical axis)
- As the dome rotates, it creates the illusion that you're traveling through a world
- The road, player, and obstacles are inside the dome
- The dome renders behind everything else (renderOrder: -1)

### Visualization
```
        Sky Dome (rotating ↻)
              ↓
      ┌─────────────────┐
      │   ☁️  ☁️  ☁️   │  ← Dome with sky/clouds texture
      │                 │
      │   🏃 Road 🛣️   │  ← Player runs inside dome
      │   Obstacles     │
      └─────────────────┘
    Rotates slowly clockwise
```

## Configuration

The sky dome can be customized using the `SKY_DOME_CONFIG` object in `game.js` (around line 806):

```javascript
const SKY_DOME_CONFIG = {
    enabled: true,              // Enable/disable sky dome
    rotationSpeed: 0.0005,      // Slow rotation (radians per frame)
    scale: 100,                 // Size of dome (should encompass whole scene)
    renderOrder: -1             // Render behind everything else
};
```

### Settings Explained

#### `enabled` (boolean)
- **Default:** `true`
- **Purpose:** Turn sky dome on/off
- **Use case:** Disable for debugging or if you prefer solid color background
- **Example:**
  ```javascript
  enabled: false  // Disables sky dome, shows blue background
  ```

#### `rotationSpeed` (number in radians)
- **Default:** `0.0005` (very slow)
- **Purpose:** How fast the dome rotates
- **Use case:** Adjust speed of motion illusion
- **Examples:**
  ```javascript
  rotationSpeed: 0.0003  // Slower, more subtle
  rotationSpeed: 0.0005  // Default, good balance
  rotationSpeed: 0.001   // Faster, more noticeable
  rotationSpeed: 0.002   // Very fast, might be dizzying
  rotationSpeed: 0       // No rotation, static dome
  ```

#### `scale` (number)
- **Default:** `100`
- **Purpose:** Size of the dome
- **Use case:** Make dome bigger/smaller to fit scene
- **Important:** Should be large enough to encompass camera far plane (~1000 units)
- **Examples:**
  ```javascript
  scale: 50   // Smaller, might see edges
  scale: 100  // Default, good for most cases
  scale: 200  // Larger, ensures no visible edges
  ```

#### `renderOrder` (number)
- **Default:** `-1`
- **Purpose:** Render priority (negative = render first/behind)
- **Use case:** Ensure dome renders behind everything
- **Don't change unless:** You have specific rendering requirements

## File Location

**Sky Dome Model:**
`/Users/paulbridges/Downloads/sky_dome_demo.glb`

**Important:** If you move the file, update the path in `game.js` around line 4093:
```javascript
loader.load(
    '/Users/paulbridges/Downloads/sky_dome_demo.glb',  // ← Update this path
```

## Implementation Details

### Loading (game.js ~line 4086)
The sky dome loads when `EnvironmentManager.init()` is called:
```javascript
init() {
    this.loadRoadModel();
    this.loadSkyDome();  // ← Loads sky dome
    scene.background = new THREE.Color(0x87CEEB);
    // ... lights, fog, etc.
}
```

### Rotation (game.js ~line 7315)
The dome rotates in the `animate()` function:
```javascript
// Rotate sky dome for motion illusion (only in Level 1)
if (skyDome && SKY_DOME_CONFIG.enabled && GameState.selectedLevel === 'chase') {
    skyDome.rotation.y += SKY_DOME_CONFIG.rotationSpeed;
}
```

### Key Features
1. **BackSide rendering:** Dome is viewed from inside
   ```javascript
   child.material.side = THREE.BackSide;
   ```

2. **No shadows:** Dome doesn't cast or receive shadows
   ```javascript
   child.receiveShadow = false;
   child.castShadow = false;
   ```

3. **Only in Level 1:** Dome only shows in Chase Mode
   ```javascript
   GameState.selectedLevel === 'chase'
   ```

## Testing & Debugging

### Test the Sky Dome

1. **Start local server:**
   ```bash
   cd /Users/paulbridges/stevo
   python3 -m http.server 8000
   ```

2. **Open game:**
   ```
   http://localhost:8000
   ```

3. **Select PROTOCOL ONE (Chase Mode)**

4. **Look around:**
   - You should see the sky dome texture filling the background
   - Blue color should still show through if dome has gaps
   - Dome should rotate slowly

### Debug Commands (Console)

```javascript
// Check if sky dome loaded
console.log(skyDome);

// Check config
console.log(SKY_DOME_CONFIG);

// Temporarily disable
SKY_DOME_CONFIG.enabled = false;

// Re-enable
SKY_DOME_CONFIG.enabled = true;

// Adjust rotation speed on the fly
SKY_DOME_CONFIG.rotationSpeed = 0.001;  // Faster

// Stop rotation
SKY_DOME_CONFIG.rotationSpeed = 0;

// Access dome directly
skyDome.visible = false;  // Hide dome
skyDome.visible = true;   // Show dome
```

### Common Issues & Solutions

#### Issue: Dome not visible
**Possible causes:**
1. Path to GLB file incorrect
2. Dome too small (increase `scale`)
3. Dome disabled in config
4. Model failed to load (check console)

**Solutions:**
```javascript
// Check console for errors
// Try increasing scale
SKY_DOME_CONFIG.scale = 200;

// Verify file exists
ls -la /Users/paulbridges/Downloads/sky_dome_demo.glb
```

#### Issue: Dome rotating too fast/slow
**Solution:**
```javascript
// Adjust rotation speed
SKY_DOME_CONFIG.rotationSpeed = 0.0003;  // Slower
SKY_DOME_CONFIG.rotationSpeed = 0.001;   // Faster
```

#### Issue: Can see edges of dome
**Solution:**
```javascript
// Increase scale
SKY_DOME_CONFIG.scale = 200;  // Bigger dome
```

#### Issue: Dome blocks view of game
**Cause:** renderOrder too high
**Solution:**
```javascript
SKY_DOME_CONFIG.renderOrder = -1;  // Should be negative
```

## Customization Ideas

### Different Sky Domes
Replace `sky_dome_demo.glb` with different dome models:
- Starry night sky
- Sunset/sunrise
- Cloudy sky
- Space/nebula
- City skyline

### Animation Variations

#### Reverse rotation (counter-clockwise)
```javascript
rotationSpeed: -0.0005  // Negative = reverse
```

#### Pulsing scale (breathing effect)
Add to animate function:
```javascript
if (skyDome) {
    const pulse = Math.sin(Date.now() * 0.001) * 5;
    skyDome.scale.setScalar(SKY_DOME_CONFIG.scale + pulse);
}
```

#### Tilt dome for perspective
```javascript
skyDome.rotation.x = Math.PI * 0.1;  // Slight tilt
```

### Multiple Domes (Layered)
Load multiple domes at different scales:
- Inner dome: clouds (scale: 50)
- Outer dome: stars (scale: 150)

## Performance Notes

### Impact
- **Low:** Sky dome is just one model, minimal performance cost
- **Efficient:** Static geometry, simple rotation
- **Memory:** ~2-5MB depending on dome texture size

### Optimization
If performance is an issue:
1. Use lower-resolution textures on dome
2. Reduce polygon count of dome model
3. Disable on mobile:
   ```javascript
   const isMobile = /Android|iPhone/i.test(navigator.userAgent);
   SKY_DOME_CONFIG.enabled = !isMobile;
   ```

## Integration with Other Systems

### Works with:
- ✅ Blue background (fallback if dome fails)
- ✅ Fog (creates depth with dome)
- ✅ Lighting (dome receives scene lighting)
- ✅ All Level 1 mechanics (obstacles, pickups, etc.)

### Doesn't affect:
- ✅ Collision detection
- ✅ Player movement
- ✅ Enemy AI
- ✅ Performance (minimal impact)

## Future Enhancements

Ideas for expanding the sky dome system:

1. **Dynamic sky:** Change dome based on game progress
   - Morning → Day → Evening → Night

2. **Weather effects:** Different domes for weather
   - Sunny, cloudy, rainy, stormy

3. **Procedural rotation:** Speed up as player runs faster
   ```javascript
   rotationSpeed: 0.0005 * GameState.currentSpeed;
   ```

4. **Shader effects:** Animated clouds, moving sun/moon

5. **Level-specific domes:** Different dome for each level
   - Level 1: Sky/clouds
   - Level 2: Urban skyline
   - Level 3: Space/stars

## Credits

**Implementation:** Sky dome system with rotation
**Model:** `/Users/paulbridges/Downloads/sky_dome_demo.glb`
**Technique:** Classic game dev trick used in endless runners

---

**Questions or issues?** Check console for errors or adjust `SKY_DOME_CONFIG` settings!
