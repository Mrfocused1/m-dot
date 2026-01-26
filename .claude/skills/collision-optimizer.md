# Collision Optimizer Skill

**Purpose:** Fix collision detection issues, improve accuracy, and optimize performance

**When to use this skill:**
- Player passes through obstacles
- Collisions detected when shouldn't be (false positives)
- Collision system causing performance drops
- Need to add collision to new objects

## Context

The game uses multiple collision detection methods:
- AABB (Axis-Aligned Bounding Box) - Fast, simple box detection
- BVH (Bounding Volume Hierarchy) via three-mesh-bvh - Optimized spatial queries
- Custom raycasting - For precise directional detection

## Key Files
- `game.js` lines 5965-6069: Collision detection logic
- `RALPH_COLLISION_TEST.md`: Collision testing notes and known issues
- `debug-collisions.html`: Visual collision box debugger

## Debug Tools

### Visual Debugging
```javascript
// Show collision boxes as wireframes
toggleCollisionDebug(true)   // Show boxes
toggleCollisionDebug(false)  // Hide boxes

// Enable console logging
window.enableCollisionDebug()
window.disableCollisionDebug()
```

### Access Collision Data
```javascript
// Inspect collision boxes
debugCollisionBoxes.forEach(box => {
    console.log('Position:', box.position);
    console.log('Rotation:', box.rotation);
    console.log('Scale:', box.scale);
});
```

## Common Issues & Solutions

### Issue 1: Player Passes Through Obstacles
**Symptoms:** Character walks/runs through barriers or cars
**Possible causes:**
1. Collision box not positioned correctly
2. Collision box too small
3. Player moving too fast (tunneling)
4. Collision check not running every frame

**Debug steps:**
1. Enable visual debug: `toggleCollisionDebug(true)`
2. Check if collision boxes align with visible models
3. Verify collision check runs in game loop
4. Add console logs to collision detection code

**Solutions:**
- Adjust collision box size and position
- Use continuous collision detection for fast movement
- Increase collision check frequency

### Issue 2: False Positive Collisions
**Symptoms:** Collision detected when player not touching object
**Causes:**
- Collision box too large
- Rotation not properly applied
- Multiple overlapping collision boxes

**Solution:**
- Reduce collision box size slightly (leave small gap)
- Verify rotation applied correctly
- Remove duplicate collision boxes

### Issue 3: Performance Issues
**Symptoms:** FPS drops when many obstacles on screen
**Causes:**
- Checking collision with all objects every frame
- Not using spatial partitioning
- Creating new collision objects instead of pooling

**Solutions:**
- Only check nearby objects (distance culling)
- Use BVH for spatial queries
- Implement object pooling for collision boxes
- Reduce collision check frequency for distant objects

## Your Tasks

1. **Understand current system:**
   - Read RALPH_COLLISION_TEST.md
   - Review collision code (lines 5965-6069)
   - Identify which collision method is active

2. **Enable debug visualization:**
   - Run `toggleCollisionDebug(true)` in console
   - Verify boxes align with visual models
   - Check box sizes are appropriate

3. **Test collision accuracy:**
   - Walk directly into each obstacle type
   - Check edge cases (corners, rotated objects)
   - Verify collisions register consistently
   - Test at different speeds

4. **Optimize if needed:**
   - Profile collision detection performance
   - Implement distance culling if not present
   - Consider consolidating multiple collision versions

5. **Document findings:**
   - Update RALPH_COLLISION_TEST.md with results
   - Note any remaining issues
   - Suggest future improvements

## Testing Protocol

### Basic Collision Test
1. Start Level 1 (Chase Mode)
2. Enable debug: `toggleCollisionDebug(true)`
3. Run into concrete barrier - should stop player
4. Try to walk around - should be blocked
5. Jump over barrier - should clear it

### Advanced Collision Test
1. Test road roller (moving obstacle)
2. Test road grader (moving obstacle)
3. Test enemy collision (should trigger game events)
4. Test pickup collision (should collect item)
5. Test throw collision (projectile hits enemy)

### Performance Test
1. Spawn multiple obstacles
2. Check FPS counter (should stay 60+ on desktop)
3. Profile with Chrome DevTools
4. Identify any collision-related bottlenecks

## Success Criteria

- ✅ All obstacle collisions detected accurately
- ✅ No false positives (collisions when not touching)
- ✅ No false negatives (passing through when shouldn't)
- ✅ Collision boxes visually align with models
- ✅ Performance stays at 60 FPS with many obstacles
- ✅ Collision system is documented and maintainable

## Known Issues (from RALPH_COLLISION_TEST.md)

- Router logic for V1/V2 collision versions needs debugging
- Both versions may be loading simultaneously
- Need to verify which collision method is most accurate

## Notes

- AABB is fastest but least accurate (good for simple boxes)
- BVH is best for complex models with many polygons
- Raycasting is precise but more expensive
- Consider hybrid approach: AABB for initial check, BVH for precision
- Always profile before optimizing - measure, don't guess
