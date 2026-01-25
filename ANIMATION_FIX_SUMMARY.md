# FBX Animation Loop Fix - Summary

## Problem Solved
Mixamo FBX animations were flashing/disappearing when looping in Three.js

## Root Cause
The `mixamorigHips.position` animation track was moving the character in world space, causing visual glitches at loop boundaries.

## Solution Applied
```javascript
// Remove the position track before playing animation
clip.tracks = clip.tracks.filter(track => {
    if (track.name === 'mixamorigHips.position') {
        return false; // Remove it
    }
    return true; // Keep rotation tracks
});
```

Then manually position the model:
```javascript
model.position.set(0, 1.0, 0); // Lift character up
```

## Files Modified
- `game.js` - Added position track filter to both `loadPlayerCharacter()` and `loadEnemyCharacter()`
- `game.js` - Set Y position to 1.0 for both characters
- `game.js` - Updated camera lookAt to track player height
- `game.js` - Removed material color overrides to preserve original textures

## Result
✓ Smooth looping animation
✓ No flashing or disappearing
✓ Character properly positioned on ground
✓ Original skin/clothing textures visible

## Material/Texture Preference
**User prefers:** Keep original FBX textures without color modifications
- Downloaded Mixamo animations "With Skin"
- Removed `mat.color.setHex()` overrides
- Characters now show full texture details

## For Future Use
If you encounter similar FBX animation issues, you can invoke the skill:
```
/fbx-animation-loop-fix
```

Or just describe the issue and Claude will recognize the pattern.

---

**Date Solved:** 2026-01-23
**Method:** Ralph Wiggum debugging approach (systematic testing until proven fixed)
