# Shoot it Out - Level 2 Setup

## ✅ Assets Ready

### Character Model
- **Officer.fbx** (24MB with textures)
- Professional tactical officer character
- Embedded textures and materials

### Animations (5 Core)
1. **Rifle Run.fbx** (223KB) - Running with weapon
2. **Rifle Idle.fbx** (390KB) - Standing ready/aiming
3. **Firing Rifle.fbx** (253KB) - Shooting animation
4. **Strafe.fbx** (211KB) - Side movement
5. **Death.fbx** (388KB) - Getting hit/dying

### Additional Available (in Downloads)
- Jump forward/backward
- Walking variations
- Run backwards
- Start/stop walking
- Walking to dying

## ✅ UI Updated

**Level Selection Screen:**
- "Chase the Opp" - Stage 1 (working) 🏃
- "Shoot it Out" - Stage 2 (placeholder) 🔫
- Both cards are clickable and styled

## 🎮 Gameplay Plan for "Shoot it Out"

### Core Mechanics

**Player:**
- Runs forward automatically (like Chase mode)
- Tap LEFT = strafe left
- Tap RIGHT = strafe right
- Auto-fires continuously (or hold to shoot)

**Enemy:**
- Tactical officer running toward you
- Fires at player position
- Player must dodge bullets by strafing

**Win Condition:**
- Survive waves of enemies
- Hit enemies to score points
- 3 lives (get hit = lose life)

### Technical Implementation

**Phase 1: Character Setup**
- Load Officer character with rifle animations
- Apply same FBX fixes (remove position track)
- Set up animation mixer and states

**Phase 2: Shooting Mechanics**
- Create bullet projectiles (simple spheres)
- Raycast or sphere collision for hits
- Muzzle flash effect
- Hit detection

**Phase 3: Enemy AI**
- Spawn enemies at distance
- Move toward player
- Shoot at player position
- Dodge logic (optional)

**Phase 4: Polish**
- Health bars
- Bullet tracers
- Sound effects (optional)
- Score multipliers

## 📋 Next Steps

1. Build shooting mechanics prototype
2. Test Officer character loading
3. Implement basic combat
4. Add enemy spawning
5. Polish and balance

## 🔧 Technical Notes

**Same Fixes Apply:**
- Remove `mixamorigHips.position` track
- Set Y position to lift character
- Keep original textures
- FPS: 30, same as current setup

**New Systems Needed:**
- Bullet physics
- Hit detection (raycasting)
- Enemy spawn manager
- Shooting input handler
- Health/damage system

---

**Status:** Ready to build
**Assets:** ✅ Complete
**UI:** ✅ Updated
**Code:** 🚧 Framework ready, mechanics pending
