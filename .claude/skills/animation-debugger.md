# Animation Debugger Skill

**Purpose:** Fix FBX animation loop issues, character flashing, and Mixamo import problems

**When to use this skill:**
- Character models flash or disappear during animation loops
- Animation doesn't play at all
- Character position jumps unexpectedly
- Mixamo FBX animations behave incorrectly

## Context

This project uses Mixamo FBX character animations with Three.js. There's a known issue where the `mixamorigHips.position` track causes characters to flash/disappear at loop boundaries.

## Key Files
- `game.js` lines 18-262: Animation version selector system (V1-V20)
- `ANIMATION_FIX_SUMMARY.md`: Documentation of the solution
- `ANIMATION_FIX_GUIDE.md`: Detailed debugging guide

## Common Issues & Solutions

### Issue 1: Character Flashing at Loop Boundary
**Symptom:** Character disappears briefly when animation loops
**Cause:** `mixamorigHips.position` track moving character in world space
**Solution:**
```javascript
clip.tracks = clip.tracks.filter(track =>
    track.name !== 'mixamorigHips.position'
);
model.position.set(0, 1.0, 0); // Manual positioning
```

### Issue 2: Animation Not Playing
**Symptoms:** Character frozen, no movement
**Debug steps:**
1. Check if mixer.update(delta) is being called
2. Verify action.isRunning() returns true
3. Check action.enabled === true
4. Verify timeScale !== 0

### Issue 3: Multiple Animation Versions
**Context:** The codebase has 20 animation version implementations (V1-V20)
**Task:** Identify which version is actively used and clean up the rest
**Test:** Use `window.setAnimV1()` through `window.setAnimV20()` in console

## Your Tasks

1. **Read documentation first:**
   - Read ANIMATION_FIX_SUMMARY.md
   - Read ANIMATION_FIX_GUIDE.md
   - Understand the mixamorigHips.position issue

2. **Diagnose the problem:**
   - Check console for animation-related errors
   - Identify which animation version is active
   - Test animation in isolation (animation-test-simple.html)

3. **Apply the fix:**
   - Remove position tracks from FBX clips
   - Manually position characters at Y=1.0
   - Ensure smooth looping

4. **Verify the solution:**
   - Watch full animation loop 3-4 times
   - Check for flashing/disappearing
   - Verify character stays at correct height
   - Test in both Chase and Shoot modes

## Debug Commands

```javascript
// Test animation versions
window.setAnimV1()  // through V20

// Check mixer state
console.log(playerMixer._actions)
console.log(enemyMixer._actions)

// Check specific action
const action = playerAnimations['run'];
console.log('Running:', action.isRunning());
console.log('Enabled:', action.enabled);
console.log('Weight:', action.getEffectiveWeight());
console.log('TimeScale:', action.getEffectiveTimeScale());
```

## Testing Protocol

1. Load game.html in browser
2. Start Level 1 (Chase Mode)
3. Observe player running animation for 10+ seconds
4. Check for any flashing or disappearing
5. Trigger jump animation - verify smooth transition
6. Pick up item - verify "run holding" animation
7. Throw item - verify throw animation and return to run
8. Test enemy animations (normal run, look behind)

## Success Criteria

- ✅ No character flashing or disappearing
- ✅ Smooth animation loops
- ✅ All transitions work correctly
- ✅ Character positioned correctly on ground
- ✅ Original textures visible (not overridden)

## Notes

- Always test in actual game context, not just isolated tests
- Mixamo exports "With Skin" - preserve textures
- Animation system has 20 versions - only one should be active
- Consider consolidating to single working version for production
