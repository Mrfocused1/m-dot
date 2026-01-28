# COMPREHENSIVE COLLISION FIX PROMPT

Fix all cases where the player or enemy runs through concrete barriers. The collision system MUST work 100% of the time under ALL circumstances.

## YOUR TASK:
1. Use the Explore agent to thoroughly understand the current collision implementation
2. Identify ALL code paths where collision detection might fail
3. Test and fix EVERY scenario listed below
4. Use systematic debugging - add logging, test each fix, verify it works
5. Do NOT stop until collision works perfectly in ALL scenarios

## CRITICAL SCENARIOS TO TEST & FIX:

### A. GAME START CONDITIONS:
- [ ] Player collision when game first loads
- [ ] Enemy collision when game first loads
- [ ] Collision when assets are still loading
- [ ] Collision after intro animation completes
- [ ] Collision if game loads from cache (fast path)

### B. ENEMY RESPAWN CONDITIONS:
- [ ] Enemy collision immediately after respawn
- [ ] Enemy collision during respawn animation
- [ ] Enemy collision after death animation completes
- [ ] Player collision during enemy respawn sequence
- [ ] Collision during "Got em!" text display

### C. THROW & HIT CONDITIONS:
- [ ] Player collision during throw animation
- [ ] Enemy collision when hit by item
- [ ] Collision during slow motion effect
- [ ] Collision after slow motion ends
- [ ] Collision when item misses enemy
- [ ] Collision after miss and return to gameplay

### D. ANIMATION STATE CHANGES:
- [ ] Collision when player jumps
- [ ] Collision when player picks up item
- [ ] Collision when player switches lanes
- [ ] Collision during enemy look-behind animation
- [ ] Collision during enemy jump animation
- [ ] Collision during any animation transition

### E. MOVEMENT & POSITIONING:
- [ ] Collision at different game speeds
- [ ] Collision when stage is frozen (gameSpeed = 0)
- [ ] Collision at different player Z positions
- [ ] Collision at different enemy Z positions
- [ ] Collision in left lane (X = -2)
- [ ] Collision in center lane (X = 0)
- [ ] Collision in right lane (X = 2)

### F. TIMING & RACE CONDITIONS:
- [ ] Collision before obstacle mesh loads
- [ ] Collision if collision system initializes late
- [ ] Collision during rapid lane switches
- [ ] Collision frame-perfect at obstacle spawn
- [ ] Collision if collision detection skips frames

### G. EDGE CASES:
- [ ] Multiple obstacles in close proximity
- [ ] Collision at exact lane boundaries
- [ ] Collision with half-spawned obstacles
- [ ] Collision after tab/window loses focus
- [ ] Collision after game pause/resume (if applicable)

## REQUIRED INVESTIGATION:

1. **Find all collision implementations:**
   - Search for: raycast, collision, obstacle, barrier, intersect
   - Identify which collision system is active (V1, V2, BVH, etc.)
   - Check if multiple systems conflict

2. **Find all places that modify position:**
   - Player position updates
   - Enemy position updates
   - Lane switching logic
   - Respawn positioning
   - Any direct position.set() or position.z modifications

3. **Find all state flags that might disable collision:**
   - isJumping, isThrowing, isPickingUp flags
   - gameSpeed = 0 conditions
   - stageFrozen flag
   - Any "ignore collision" logic

4. **Check collision detection timing:**
   - Is collision checked every frame in animate()?
   - Can collision be skipped during certain states?
   - Are there race conditions between position updates and collision checks?

## DEBUGGING APPROACH:

1. Add comprehensive logging to collision detection:
   ```javascript
   console.log('🚧 Collision check:', {
       playerZ: playerModel.position.z,
       obstacleZ: obstacle.position.z,
       distance: Math.abs(playerModel.position.z - obstacle.position.z),
       playerLane: PlayerController.currentLane,
       obstacleLane: /* obstacle lane */,
       gameSpeed: GameState.gameSpeed,
       isJumping: PlayerController.isJumping
   });
   ```

2. Add barrier hit detection:
   ```javascript
   // If player passes through barrier (Z position goes past obstacle without collision)
   if (playerPassedThroughBarrier) {
       console.error('❌ COLLISION FAILED - Player ran through concrete!', {
           playerZ: playerModel.position.z,
           obstacleZ: obstacle.position.z,
           /* all relevant state */
       });
   }
   ```

3. Test each scenario systematically:
   - Implement fix
   - Add logging
   - Test in game
   - Verify logs show collision detected
   - Test 5+ times to ensure consistency
   - Move to next scenario

## EXPECTED OUTCOME:

- [ ] Collision works on game start (tested 5+ times)
- [ ] Collision works after enemy respawn (tested 5+ times)
- [ ] Collision works after throw/hit (tested 5+ times)
- [ ] Collision works after miss (tested 5+ times)
- [ ] Collision works in all lanes (tested each lane 3+ times)
- [ ] Collision works during all animations (tested each)
- [ ] No edge cases where characters run through barriers
- [ ] All collision detection logs show proper detection
- [ ] Code is thoroughly commented explaining fixes

## DELIVERABLES:

1. Complete analysis of current collision system
2. List of ALL bugs found with explanations
3. Fix for each bug with testing confirmation
4. Updated collision detection code
5. Test results for all scenarios above
6. Commit message documenting all fixes

## IMPORTANT RULES:

- NEVER say "collision should work now" without testing
- NEVER assume a fix works - test it multiple times
- NEVER skip scenarios - test ALL of them
- If you can't test in browser, create detailed verification scripts
- Use git commits after each major fix so progress is saved
- If collision STILL fails after fixes, keep investigating - don't give up

Under NO circumstance should the player or enemy EVER run through concrete barriers. This is the #1 priority.
