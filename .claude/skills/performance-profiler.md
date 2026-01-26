# Performance Profiler Skill

**Purpose:** Diagnose and fix performance issues, optimize FPS, reduce memory usage

**When to use this skill:**
- Game running below 60 FPS on desktop or 30 FPS on mobile
- Stuttering or frame drops during gameplay
- High memory usage or memory leaks
- Slow load times

## Context

**Performance Targets:**
- Desktop: 60 FPS minimum
- Mobile: 30 FPS minimum
- Initial load: <5 seconds
- Memory usage: <500MB

**Current Status:**
- 584 console.log statements (now controlled by DEBUG flag)
- ~500MB of assets (3D models + animations)
- 20 animation version implementations (code bloat)
- Multiple collision detection versions

## Key Performance Bottlenecks

### 1. Asset Loading
- **Problem:** 350MB models + 150MB animations = long load times
- **Solutions:**
  - Compress textures (use JPG instead of PNG where possible)
  - Reduce polygon count on complex models
  - Use Draco compression for GLB files
  - Implement progressive loading (prioritize gameplay assets)
  - Add loading progress indicator

### 2. Rendering Performance
- **Problem:** Too many draw calls, complex materials, shadows
- **Solutions:**
  - Use object pooling for repeated obstacles
  - Implement frustum culling (don't render off-screen objects)
  - Reduce shadow quality or use baked shadows
  - Merge static geometry
  - Use instanced rendering for repeated objects

### 3. Physics/Collision
- **Problem:** Checking collision with all objects every frame
- **Solutions:**
  - Distance culling (only check nearby objects)
  - Spatial partitioning (BVH, octree)
  - Reduce collision check frequency for distant objects
  - Use simpler collision shapes (boxes instead of meshes)

### 4. Animation System
- **Problem:** 20 animation versions = code bloat and memory waste
- **Solutions:**
  - Identify working version and remove others
  - Optimize mixer.update() calls
  - Reduce bone count if possible

### 5. Console Logging
- **Status:** ✅ FIXED - Now controlled by DEBUG flag
- **Impact:** Console.log calls can slow down game loop significantly

## Your Tasks

### 1. Measure Current Performance

**FPS Measurement:**
```javascript
// Already built into game - check UI or console
// Look for FPS counter in HUD
```

**Chrome DevTools Profiling:**
1. Open DevTools (F12)
2. Go to Performance tab
3. Click Record
4. Play game for 10-15 seconds
5. Stop recording
6. Analyze results

**Memory Profiling:**
1. Open DevTools > Memory tab
2. Take heap snapshot
3. Play game for a minute
4. Take another snapshot
5. Compare for memory leaks

### 2. Identify Bottlenecks

**Look for:**
- Render time >16ms (causes FPS drop below 60)
- Long script execution blocks
- Excessive garbage collection
- Growing memory usage (memory leak)
- Too many draw calls (>100-200)

**Common culprits in this project:**
- Asset loading (FBX, GLB files)
- Animation mixer updates
- Collision detection loops
- Particle systems (muzzle flash, smoke)
- Shadow rendering

### 3. Apply Optimizations

**Quick Wins:**
- Set DEBUG = false (already done ✅)
- Remove unused code (20 animation versions)
- Enable asset compression
- Reduce texture sizes
- Lower shadow quality

**Medium Effort:**
- Implement object pooling for all obstacles
- Add frustum culling
- Optimize collision detection (distance culling)
- Reduce polygon count on heavy models

**Long Term:**
- Draco compression for GLB files
- Progressive asset loading
- Level of Detail (LOD) system
- Baked lighting instead of realtime shadows

### 4. Test & Verify

**Desktop Test:**
- Run game for 5 minutes
- FPS should stay 60+
- No stuttering or frame drops
- Smooth animations

**Mobile Test:**
- Test on actual device (not just emulator)
- FPS should stay 30+
- Touch controls responsive
- No overheating

## Profiling Commands

```bash
# Check asset sizes
cd /Users/paulbridges/stevo
du -sh *.glb *.fbx *.mp3

# List largest files
ls -lhS | head -20

# Count lines of code
wc -l game.js
```

```javascript
// In console - check renderer stats
console.log(renderer.info.render);
// Look at: calls, triangles, points, lines

// Check scene object count
console.log(scene.children.length);

// Memory usage (approximate)
console.log(performance.memory);
```

## Common Optimizations

### Reduce Model Complexity
```javascript
// In Blender:
// 1. Select model
// 2. Add Modifier > Decimate
// 3. Set ratio to 0.5 (50% fewer polygons)
// 4. Apply modifier
// 5. Re-export as GLB
```

### Compress Textures
```bash
# Convert PNG to JPG (smaller file size)
# Use online tools or ImageMagick
convert texture.png -quality 85 texture.jpg
```

### Object Pooling Pattern
```javascript
// Already implemented for obstacles (lines 3438-3552)
// Extend to other repeated objects:
// - Bullets/projectiles
// - Particles
// - UI elements
```

### Frustum Culling
```javascript
// Add to render loop:
scene.children.forEach(obj => {
    if (obj.isMesh) {
        obj.visible = frustum.intersectsObject(obj);
    }
});
```

## Testing Protocol

### Performance Regression Test
1. Measure baseline FPS before changes
2. Apply optimization
3. Measure new FPS
4. If FPS improved and game works correctly, keep change
5. If FPS same or game broken, revert

### Load Time Test
1. Clear browser cache (Ctrl+Shift+Delete)
2. Start timer
3. Load game.html
4. Stop timer when game playable
5. Target: <5 seconds

### Memory Leak Test
1. Take memory snapshot
2. Play game for 10 minutes
3. Take another snapshot
4. Memory should stabilize, not grow indefinitely

## Success Criteria

- ✅ Desktop FPS: 60+ steady
- ✅ Mobile FPS: 30+ steady
- ✅ Load time: <5 seconds
- ✅ Memory usage: <500MB stable
- ✅ No stuttering or frame drops
- ✅ Smooth gameplay experience

## Tools & Resources

**Browser DevTools:**
- Performance tab (profiling)
- Memory tab (heap snapshots)
- Rendering tab (FPS meter, paint flashing)

**External Tools:**
- Blender (model optimization)
- gltf-pipeline (GLB compression)
- ImageMagick (texture compression)

**Three.js Helpers:**
- renderer.info.render (draw call stats)
- Stats.js (FPS counter library)

## Notes

- **Always measure before optimizing** - Don't guess what's slow
- **Profile on target devices** - Desktop != mobile performance
- **One optimization at a time** - Know what actually helped
- **Test thoroughly after changes** - Don't break gameplay for FPS
- **Document what you tried** - Save time for future debugging
