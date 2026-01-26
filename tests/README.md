# Test Files

This directory contains test and debug HTML files for the Merkle Man game project.

## File Categories

### Animation Tests
- `v1.html` through `v10.html` - Animation version tests (V1-V10)
- `animation-test-simple.html` - Simple animation testing page
- `animation-test-detailed.html` - Detailed animation debugging
- `animation-test-fix.html` - Animation fix validation

### Collision Tests
- `debug-collisions.html` - Collision box visualization and debugging

### Gameplay Tests
- `test-fight-animation.html` - Fight/combat animation testing
- `test-shooter-pack.html` - Shooting mechanics testing
- `test-strafe-input-fix.html` - Strafe movement input testing
- `test-materials.html` - Material and texture testing

### Input/Control Tests
- `test-click-debug.html` - Click event debugging

### General Tests
- `tests.html` - General test menu/dashboard

## Running Tests

### Local Server Required
Test files must be run through a local server due to CORS restrictions on loading 3D assets:

```bash
cd /Users/paulbridges/stevo
python3 -m http.server 8000
```

Then navigate to:
```
http://localhost:8000/tests/[filename].html
```

### Common Test Scenarios

**Testing Animations:**
1. Open `animation-test-simple.html`
2. Check for flashing or disappearing at loop boundaries
3. Try different animation versions (v1-v10.html)
4. Verify mixamorigHips.position track removal

**Testing Collision:**
1. Open `debug-collisions.html`
2. Enable collision visualization
3. Check box alignment with models
4. Verify collision detection accuracy

**Testing Input:**
1. Open `test-click-debug.html`
2. Click on various screen areas
3. Verify event registration
4. Check for touch vs mouse events

## Notes

- These files are for development and debugging only
- Not included in production builds
- May reference older code versions
- Some tests may be outdated or broken
- Use CLAUDE_AGENT_GUIDE.md for context on testing

## Cleanup Recommendations

Consider removing test files that are:
- No longer needed
- Testing obsolete features
- Superseded by newer tests
- Broken and not worth fixing

## Related Documentation

- `ANIMATION_FIX_GUIDE.md` - Animation debugging process
- `RALPH_COLLISION_TEST.md` - Collision testing notes
- `.claude/skills/animation-debugger.md` - Animation debugging skill
- `.claude/skills/collision-optimizer.md` - Collision optimization skill
