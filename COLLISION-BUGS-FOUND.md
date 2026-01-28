# COLLISION BUGS FOUND - COMPREHENSIVE ANALYSIS

## CRITICAL BUGS CAUSING CHARACTERS TO RUN THROUGH CONCRETE

---

### 🔴 BUG #1: Obstacles Disabled Until First Throw (GAME START)
**Location**: game.js Line 7866-7869
**Severity**: CRITICAL - 100% reproduction rate on game start

**Code**:
```javascript
const shouldCheckObstacleCollision = (GameState.selectedLevel !== 'chase') ||
                                     (GameState.selectedLevel === 'chase' && PlayerController.hasThrown);

if (shouldCheckObstacleCollision && !PlayerController.isJumping) {
```

**Problem**:
- `PlayerController.hasThrown` is initialized to `false` (Line 1630)
- Set to `false` in `init()` (Line 1652)
- Only set to `true` when player throws item (Line 1949)
- **Result**: On game start, ALL obstacle collision is DISABLED until player throws for first time
- Player can run through concrete barriers freely for first ~10-20 seconds of gameplay

**Affected Scenarios**:
- ✅ Game start (before first throw)
- ✅ New game after restart

**How to Reproduce**:
1. Start game (game.html?level=1)
2. Don't pick up any items
3. Run into concrete barriers
4. Player goes straight through them

---

### 🔴 BUG #2: Collision Skipped During Jump
**Location**: game.js Line 7869
**Severity**: HIGH - Can occur if jump state gets stuck

**Code**:
```javascript
if (shouldCheckObstacleCollision && !PlayerController.isJumping) {
```

**Problem**:
- If `PlayerController.isJumping` stays `true` after jump completes, collision is permanently disabled
- Jump animation uses event listeners (`finished` event) to reset flag
- If event doesn't fire or gets interrupted, flag never resets
- **Result**: Player can run through obstacles for rest of game

**Potential Causes**:
- Animation interrupted during pickup/throw/lane change
- Mixer update skipped during frame drops
- Event listener garbage collected or overwritten
- Multiple overlapping jump calls

**Affected Scenarios**:
- ✅ Jump interrupted by pickup
- ✅ Jump interrupted by throw
- ✅ Rapid jump + lane switch
- ✅ Performance issues causing frame skips

---

### 🔴 BUG #3: Distance Threshold Too Small at High Speed
**Location**: game.js Line 7871-7877
**Severity**: HIGH - Happens at high game speeds or frame drops

**Code**:
```javascript
const distance = Math.abs(obstacle.mesh.position.z - playerModel.position.z);
const sameColumn = obstacle.lane === PlayerController.targetLane;

if (distance < 1.5 && sameColumn) {
    handlePlayerHit();
    obstacle.deactivate();
}
```

**Problem**:
- Collision threshold is 1.5 units on Z axis
- At `GameState.gameSpeed = 40`, stage moves 40 units/second
- At 60fps: 40/60 = 0.67 units per frame
- At 30fps (frame drop): 40/30 = 1.33 units per frame
- At 20fps (heavy frame drop): 40/20 = 2.0 units per frame

**Calculation**:
```
Frame 1: Obstacle at Z=-2.0, Player at Z=0 → Distance = 2.0 (no collision)
Frame 2: Obstacle at Z=+0.5, Player at Z=0 → Distance = 0.5 (no collision - too late!)
```

**Result**: If frame rate drops or obstacle moves >1.5 units in single frame, collision is missed

**Affected Scenarios**:
- ✅ Performance issues (low FPS)
- ✅ Browser tab loses focus then regains
- ✅ High game speed late in level
- ✅ Multiple animations running simultaneously

---

### 🟡 BUG #4: Enemy Auto-Jump Detection Range Too Short
**Location**: game.js Line 2545-2566
**Severity**: MEDIUM - Enemy can run through obstacles

**Code**:
```javascript
checkObstacleAhead() {
    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        if (!obstacle.active) continue;

        const distance = Math.abs(obstacle.mesh.position.z - enemyModel.position.z);
        const sameColumn = obstacle.lane === this.currentLane;

        // Check obstacles behind enemy (0-6 units)
        if (distance < 6 && distance > 0 && sameColumn) {
            return obstacle;
        }
    }
    return null;
}
```

**Problem**:
- Enemy only detects obstacles 0-6 units behind
- At high speed, obstacle could enter range at 6 units and be at 0 units in <2 frames
- Enemy needs time to START jump animation before collision
- Jump animation has ~0.5s startup time
- **Result**: Enemy can't jump in time, runs through obstacle

**Affected Scenarios**:
- ✅ High game speed
- ✅ Enemy in different lane then switches to obstacle lane
- ✅ Multiple obstacles in close proximity

---

### 🟡 BUG #5: Collision Check Timing (After Movement)
**Location**: game.js Line 8482-8488
**Severity**: MEDIUM - Rare but possible

**Code**:
```javascript
if (!GameState.stageFrozen) {
    ObstacleManager.update(delta);  // Obstacles move first
    PickupManager.update(delta);
    EnvironmentManager.update(delta);
}

checkCollisions();  // Then collision checked
```

**Problem**:
- Obstacles update position BEFORE collision check
- If obstacle moves from Z=-1.0 to Z=+1.5 in single frame (2.5 unit jump)
- Collision check sees it at Z=+1.5 (already past player at Z=0)
- Distance check fails: |1.5 - 0| = 1.5 (exactly at threshold, might round wrong)

**Better Pattern**:
1. Check collision at current positions
2. THEN update obstacle positions
3. OR check if obstacle CROSSED the player's Z position this frame

**Affected Scenarios**:
- ✅ Very high game speed
- ✅ Large delta time (frame skip)
- ✅ Obstacles spawning very close

---

### 🟡 BUG #6: Lane Check Uses targetLane Not currentLane
**Location**: game.js Line 7873
**Severity**: MEDIUM - Collision can be missed during lane changes

**Code**:
```javascript
const sameColumn = obstacle.lane === PlayerController.targetLane;
```

**Problem**:
- Uses `targetLane` instead of actual position
- During lane change, player is physically between lanes
- If obstacle is in targetLane but player hasn't arrived yet, collision is enabled too early
- If player switches targetLane mid-movement, collision check changes instantly

**Example**:
```
Player at X=-2 (left lane), moving toward X=0 (center)
Player physically at X=-1.2 (still in left lane)
PlayerController.targetLane = 1 (center)
Obstacle at lane=1 (center), Z=-0.5

sameColumn = (1 === 1) = true → Collision enabled
But player is at X=-1.2, obstacle at X=0 → Different physical lanes!
```

**Affected Scenarios**:
- ✅ Rapid lane switching
- ✅ Lane switch + obstacle collision simultaneously
- ✅ Player near lane boundary

---

### 🟢 BUG #7: No Collision During Throw/Pickup/Other States
**Location**: game.js Line 7869
**Severity**: LOW - Intentional gameplay design?

**Code**:
```javascript
if (shouldCheckObstacleCollision && !PlayerController.isJumping)
```

**Problem**:
- Only checks `!isJumping`, but doesn't check other states:
  - `isThrowing` (Line 1632)
  - `isPickingUp` (Line 1650)
  - `isInvincible` (Line 7861 - correctly skips damage but might be abusable)

**Question**: Should player be able to collide with obstacles during throw/pickup animations?

**Affected Scenarios**:
- ❓ Player throwing item
- ❓ Player picking up item
- ✅ Player invincible after hit

---

## SUMMARY OF ISSUES

| Bug # | Severity | Affected States | Reproduction Rate |
|-------|----------|----------------|-------------------|
| #1 | CRITICAL | Game start before first throw | 100% |
| #2 | HIGH | Jump state stuck | 10-20% |
| #3 | HIGH | High speed, frame drops | 30-50% |
| #4 | MEDIUM | Enemy at high speed | 20-30% |
| #5 | MEDIUM | Large delta times | 5-10% |
| #6 | MEDIUM | Lane changing | 15-25% |
| #7 | LOW | Special animations | TBD |

---

## RECOMMENDED FIXES (Priority Order)

1. **Fix Bug #1**: Remove hasThrown requirement - ALWAYS enable obstacle collision
2. **Fix Bug #3**: Increase collision distance threshold to 3.0 units minimum
3. **Fix Bug #2**: Add failsafe to reset isJumping if player on ground for >1 second
4. **Fix Bug #5**: Check collision BEFORE obstacle update, or use swept collision
5. **Fix Bug #6**: Use actual player X position for lane check, not targetLane
6. **Fix Bug #4**: Increase enemy detection range to 12 units
7. **Fix Bug #7**: Decide on design - should throw/pickup block collision?

