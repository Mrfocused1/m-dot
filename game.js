// ============================================================================
// MERKLE MAN - 3D Chase & Shoot Game
// ============================================================================

import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ============================================================================
// PRODUCTION CONSOLE WRAPPER
// Conditionally disables console logs when DEBUG = false for production
// ============================================================================
const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info
};

// Will be enabled/disabled based on DEBUG constant (line ~718)
window._enableProductionLogging = function(enable) {
    if (enable) {
        console.log = originalConsole.log;
        console.warn = originalConsole.warn;
        console.info = originalConsole.info;
        // Keep console.error always enabled for critical errors
    } else {
        console.log = () => {};
        console.warn = () => {};
        console.info = () => {};
        // Keep console.error always enabled for critical errors
    }
};

// Note: This will be called after DEBUG constant is defined (line ~718)

// ============================================================================
// ANIMATION VERSION SELECTOR SYSTEM
// Based on Three.js AnimationAction research:
// - https://threejs.org/docs/pages/AnimationAction.html
// - https://github.com/mrdoob/three.js/issues/10912 (enabled/weight bug)
// - https://github.com/mrdoob/three.js/issues/11147 (crossFade timeScale bug)
// - https://discourse.threejs.org/t/animationmixer-not-animating/38793
// ============================================================================

window.animationVersion = 1;

// Version 1: Simple Direct Play - Just play() without any weight management
window.setAnimV1 = () => {
    window.animationVersion = 1;
    console.log('%c Animation Version 1: Simple Direct Play', 'color: #4fc3f7; font-weight: bold');
    console.log('Just call play() without any weight or state management');
};

// Version 2: Stop All Other Actions First - Explicitly stop all animations before playing
window.setAnimV2 = () => {
    window.animationVersion = 2;
    console.log('%c Animation Version 2: Stop All Other Actions First', 'color: #4fc3f7; font-weight: bold');
    console.log('Explicitly stop() all animations except target before playing');
};

// Version 3: Use Halt Instead of Stop - halt() gradually slows animation to stop
window.setAnimV3 = () => {
    window.animationVersion = 3;
    console.log('%c Animation Version 3: Use Halt Instead of Stop', 'color: #4fc3f7; font-weight: bold');
    console.log('Use halt(0) to completely disable an action immediately');
};

// Version 4: Weight-based Instant Switch - Set weights directly without transitions
window.setAnimV4 = () => {
    window.animationVersion = 4;
    console.log('%c Animation Version 4: Weight-based Instant Switch', 'color: #4fc3f7; font-weight: bold');
    console.log('Set target weight to 1, all others to 0 instantly (no stop/play)');
};

// Version 5: No Reset, Just Play - Don't call reset(), just play from current time
window.setAnimV5 = () => {
    window.animationVersion = 5;
    console.log('%c Animation Version 5: No Reset, Just Play', 'color: #4fc3f7; font-weight: bold');
    console.log('Skip reset(), just call play() to continue from current position');
};

// Version 6: Reset Time Separately - Set time=0 manually instead of reset()
window.setAnimV6 = () => {
    window.animationVersion = 6;
    console.log('%c Animation Version 6: Reset Time Separately', 'color: #4fc3f7; font-weight: bold');
    console.log('Manually set time=0 and enabled=true instead of calling reset()');
};

// Version 7: Disable Then Re-enable - Toggle enabled property
window.setAnimV7 = () => {
    window.animationVersion = 7;
    console.log('%c Animation Version 7: Disable Then Re-enable', 'color: #4fc3f7; font-weight: bold');
    console.log('Set enabled=false on all actions, then enabled=true on target');
};

// Version 8: Force Time Scale Every Frame - Ensure timeScale stays at 1
window.setAnimV8 = () => {
    window.animationVersion = 8;
    console.log('%c Animation Version 8: Force Time Scale', 'color: #4fc3f7; font-weight: bold');
    console.log('Explicitly set timeScale=1 on every call to ensure animation runs');
};

// Version 9: Manual Weight Update - Directly manage _effectiveWeight
window.setAnimV9 = () => {
    window.animationVersion = 9;
    console.log('%c Animation Version 9: Manual Weight Update', 'color: #4fc3f7; font-weight: bold');
    console.log('Bypass official API, directly set weight and call play');
};

// Version 10: Nuclear Reset - Stop mixer, recreate actions, start fresh
window.setAnimV10 = () => {
    window.animationVersion = 10;
    console.log('%c Animation Version 10: Nuclear Reset', 'color: #4fc3f7; font-weight: bold');
    console.log('Full mixer.stopAllAction() and complete action reset');
};

// ============================================================================
// VERSIONS 11-20: DEEP DIAGNOSTIC APPROACHES
// These target ROOT CAUSES not transition methods
// ============================================================================

// Version 11: Force Mixer Update in updateAnimation
// Hypothesis: Mixer.update() not being called or delta=0
window.setAnimV11 = () => {
    window.animationVersion = 11;
    console.log('%c Animation Version 11: Force Mixer Update', 'color: #ff9800; font-weight: bold');
    console.log('Explicitly call mixer.update(0.016) in updateAnimation to ensure time advances');
};

// Version 12: Recreate Action Each Transition
// Hypothesis: Cached actions become stale or corrupted
window.setAnimV12 = () => {
    window.animationVersion = 12;
    console.log('%c Animation Version 12: Recreate Actions', 'color: #ff9800; font-weight: bold');
    console.log('Create new clipAction() for every transition instead of reusing');
};

// Version 13: Validate and Log Animation Tracks
// Hypothesis: Clips loaded from separate FBX files have mismatched bone names
window.setAnimV13 = () => {
    window.animationVersion = 13;
    console.log('%c Animation Version 13: Track Validation', 'color: #ff9800; font-weight: bold');
    console.log('Validate that animation tracks match model skeleton bones');
};

// Version 14: Force Action Activation State
// Hypothesis: Actions are not being properly scheduled in the mixer
window.setAnimV14 = () => {
    window.animationVersion = 14;
    console.log('%c Animation Version 14: Force Activation', 'color: #ff9800; font-weight: bold');
    console.log('Use internal _mixer methods to force action activation');
};

// Version 15: Direct Mixer._actions Manipulation
// Hypothesis: Actions array state is inconsistent
window.setAnimV15 = () => {
    window.animationVersion = 15;
    console.log('%c Animation Version 15: Direct Mixer Access', 'color: #ff9800; font-weight: bold');
    console.log('Directly inspect and manipulate mixer._actions array');
};

// Version 16: Clone Clips Before Use
// Hypothesis: Shared clip references cause state corruption
window.setAnimV16 = () => {
    window.animationVersion = 16;
    console.log('%c Animation Version 16: Clone Clips', 'color: #ff9800; font-weight: bold');
    console.log('Clone animation clips to avoid shared state issues');
};

// Version 17: Bypass officerActions Object
// Hypothesis: The officerActions object structure is causing issues
window.setAnimV17 = () => {
    window.animationVersion = 17;
    console.log('%c Animation Version 17: Bypass officerActions', 'color: #ff9800; font-weight: bold');
    console.log('Store actions in window.debugActions instead of officerActions');
};

// Version 18: Force Loop Mode Every Update
// Hypothesis: Loop settings are being reset or overridden
window.setAnimV18 = () => {
    window.animationVersion = 18;
    console.log('%c Animation Version 18: Force Loop Mode', 'color: #ff9800; font-weight: bold');
    console.log('Reset loop mode to LoopRepeat on every update call');
};

// Version 19: Manual Skeleton Pose Update
// Hypothesis: Animation system is working but skeleton is not updating
window.setAnimV19 = () => {
    window.animationVersion = 19;
    console.log('%c Animation Version 19: Manual Skeleton', 'color: #ff9800; font-weight: bold');
    console.log('Manually rotate bones if actions fail - proves skeleton works');
};

// Version 20: Exhaustive Debug Mode
// Hypothesis: Need complete visibility into animation system state
window.setAnimV20 = () => {
    window.animationVersion = 20;
    console.log('%c Animation Version 20: EXHAUSTIVE DEBUG', 'color: #ff0000; font-weight: bold');
    console.log('Log EVERYTHING - mixer state, action state, clip state, bindings');
};

// Helper to show current version
window.showAnimVersion = () => {
    console.log(`Current animation version: ${window.animationVersion}`);
    console.log('Available versions: setAnimV1() through setAnimV20()');
    console.log('V1-V10: Transition method variations');
    console.log('V11-V20: Deep diagnostic approaches');
};

// Diagnostic helper: Dump complete animation state
window.dumpAnimState = () => {
    console.log('%c === COMPLETE ANIMATION STATE DUMP ===', 'color: #ff0000; font-weight: bold; font-size: 16px');

    // Check mixer
    if (typeof shooterMixer === 'undefined' || !shooterMixer) {
        console.error('❌ shooterMixer is undefined or null!');
        return;
    }

    console.log('1. MIXER STATE:');
    console.log('   - Time:', shooterMixer.time);
    console.log('   - TimeScale:', shooterMixer.timeScale);
    console.log('   - _actions count:', shooterMixer._actions ? shooterMixer._actions.length : 'undefined');
    console.log('   - _bindings count:', shooterMixer._bindings ? shooterMixer._bindings.length : 'undefined');

    console.log('\n2. OFFICER ACTIONS:');
    if (typeof officerActions !== 'undefined') {
        ['idle', 'run', 'shoot'].forEach(name => {
            const action = officerActions[name];
            if (action) {
                console.log(`   ${name.toUpperCase()}:`, {
                    enabled: action.enabled,
                    paused: action.paused,
                    time: action.time,
                    timeScale: action.timeScale,
                    weight: action.weight,
                    effectiveWeight: action.getEffectiveWeight(),
                    effectiveTimeScale: action.getEffectiveTimeScale(),
                    clipDuration: action.getClip() ? action.getClip().duration : 'no clip',
                    clipTracks: action.getClip() ? action.getClip().tracks.length : 'no clip',
                    loop: action.loop,
                    repetitions: action.repetitions
                });
            } else {
                console.error(`   ❌ ${name} action is null/undefined!`);
            }
        });
        console.log('   Current:', officerActions.current);
    } else {
        console.error('❌ officerActions is undefined!');
    }

    console.log('\n3. SHOOTER MODEL:');
    if (typeof shooterModel !== 'undefined' && shooterModel) {
        console.log('   - Position:', shooterModel.position);
        console.log('   - Visible:', shooterModel.visible);
        // Find skeleton
        let skeleton = null;
        shooterModel.traverse((child) => {
            if (child.isSkinnedMesh && child.skeleton) {
                skeleton = child.skeleton;
            }
        });
        if (skeleton) {
            console.log('   - Skeleton bones count:', skeleton.bones.length);
            console.log('   - First 5 bone names:', skeleton.bones.slice(0, 5).map(b => b.name));
        } else {
            console.error('   ❌ No skeleton found in model!');
        }
    } else {
        console.error('❌ shooterModel is undefined!');
    }

    console.log('\n4. MIXER INTERNAL STATE:');
    if (shooterMixer._actions && shooterMixer._actions.length > 0) {
        shooterMixer._actions.forEach((action, i) => {
            console.log(`   Action[${i}]:`, {
                clipName: action.getClip() ? action.getClip().name : 'no clip',
                enabled: action.enabled,
                weight: action.getEffectiveWeight()
            });
        });
    }

    console.log('%c === END DUMP ===', 'color: #ff0000; font-weight: bold');
};

// Watch bone positions to see if they're changing
window.watchBones = () => {
    if (!shooterModel) {
        console.error('No shooterModel!');
        return;
    }

    let legBone = null;
    let hipsBone = null;

    shooterModel.traverse((child) => {
        if (child.isBone) {
            if (child.name.toLowerCase().includes('leftupleg') || child.name === 'mixamorigLeftUpLeg') {
                legBone = child;
            }
            if (child.name.toLowerCase().includes('hips') || child.name === 'mixamorigHips') {
                hipsBone = child;
            }
        }
    });

    if (!legBone) {
        console.error('Could not find leg bone to watch');
        return;
    }

    console.log('%c Starting bone watch (5 seconds)...', 'color: #00ff00; font-weight: bold');
    console.log('Watching bone:', legBone.name);

    const startRotation = legBone.quaternion.clone();
    let frameCount = 0;
    let rotationChanged = false;

    const watchInterval = setInterval(() => {
        frameCount++;
        const currentRotation = legBone.quaternion;

        // Check if rotation has changed
        if (!currentRotation.equals(startRotation)) {
            rotationChanged = true;
        }

        if (frameCount % 30 === 0) { // Log every 0.5 seconds
            console.log(`[Frame ${frameCount}] ${legBone.name} rotation:`, {
                x: currentRotation.x.toFixed(4),
                y: currentRotation.y.toFixed(4),
                z: currentRotation.z.toFixed(4),
                w: currentRotation.w.toFixed(4),
                changed: rotationChanged
            });
        }

        if (frameCount >= 300) { // 5 seconds at 60fps
            clearInterval(watchInterval);
            console.log('%c Bone watch complete', 'color: #00ff00; font-weight: bold');
            console.log(rotationChanged
                ? '✅ Bone rotation DID change - skeleton is being animated'
                : '❌ Bone rotation did NOT change - animation not affecting skeleton!');
        }
    }, 1000 / 60);
};

// Force play the run animation with maximum verbosity
window.forceRunAnim = () => {
    console.log('%c FORCING RUN ANIMATION', 'color: #ff0000; font-weight: bold; font-size: 16px');

    if (!shooterMixer) {
        console.error('No shooter mixer!');
        return;
    }

    if (!officerActions.run) {
        console.error('No run action!');
        return;
    }

    const runAction = officerActions.run;
    const clip = runAction.getClip();

    console.log('1. Clip info:', {
        name: clip.name,
        duration: clip.duration,
        tracks: clip.tracks.length
    });

    // Log first few track names
    console.log('2. First 5 tracks:');
    clip.tracks.slice(0, 5).forEach((track, i) => {
        console.log(`   Track[${i}]: ${track.name}`);
    });

    // Stop ALL actions
    console.log('3. Stopping all actions...');
    shooterMixer.stopAllAction();

    // Configure run action
    console.log('4. Configuring run action...');
    runAction.reset();
    runAction.time = 0;
    runAction.enabled = true;
    runAction.paused = false;
    runAction.setEffectiveWeight(1);
    runAction.setEffectiveTimeScale(1);
    runAction.setLoop(THREE.LoopRepeat, Infinity);

    console.log('5. Calling play()...');
    runAction.play();

    console.log('6. Final state:', {
        isRunning: runAction.isRunning(),
        isScheduled: runAction.isScheduled(),
        weight: runAction.getEffectiveWeight(),
        enabled: runAction.enabled
    });

    officerActions.current = 'run';

    console.log('7. Starting bone watch to verify animation...');
    window.watchBones();
};

// Test if the mixer update is actually being called
window.testMixerUpdate = () => {
    console.log('%c TESTING MIXER UPDATE', 'color: #ff9800; font-weight: bold');

    if (!shooterMixer) {
        console.error('No shooter mixer!');
        return;
    }

    const startTime = shooterMixer.time;
    console.log('Mixer time at start:', startTime);

    // Wait a bit then check
    setTimeout(() => {
        const endTime = shooterMixer.time;
        console.log('Mixer time after 1 second:', endTime);
        console.log('Time advanced:', endTime - startTime);

        if (endTime > startTime) {
            console.log('✅ Mixer IS being updated (time advances)');
        } else {
            console.error('❌ Mixer is NOT being updated! (time not advancing)');
        }
    }, 1000);
};

// Check if animation tracks match skeleton bones
window.checkTrackBinding = () => {
    console.log('%c CHECKING TRACK BINDINGS', 'color: #ff9800; font-weight: bold');

    if (!shooterModel || !officerActions.run) {
        console.error('Missing model or run action!');
        return;
    }

    // Get all bone names from model
    const boneNames = new Set();
    shooterModel.traverse((child) => {
        if (child.isBone) {
            boneNames.add(child.name);
        }
    });

    console.log('Model bones:', boneNames.size);

    // Get track bone names from animation
    const clip = officerActions.run.getClip();
    const trackBones = new Set();
    const missingBones = [];

    clip.tracks.forEach((track) => {
        // Track name format: "boneName.property" (e.g., "mixamorigHips.quaternion")
        const boneName = track.name.split('.')[0];
        trackBones.add(boneName);

        if (!boneNames.has(boneName)) {
            missingBones.push(boneName);
        }
    });

    console.log('Animation track bones:', trackBones.size);
    console.log('Bones in both:', [...trackBones].filter(b => boneNames.has(b)).length);

    if (missingBones.length > 0) {
        console.error(`❌ ${missingBones.length} bones in animation NOT found in model:`);
        console.error('Missing bones:', [...new Set(missingBones)]);
    } else {
        console.log('✅ All animation bones found in model skeleton');
    }

    // Check for binding issues in mixer
    if (shooterMixer._bindingsByRootAndName) {
        const rootBindings = shooterMixer._bindingsByRootAndName.get(shooterModel);
        if (rootBindings) {
            console.log('Mixer bindings for model:', rootBindings.size || Object.keys(rootBindings).length);
        } else {
            console.error('❌ No mixer bindings for shooterModel!');
        }
    }
};

console.log('%c Animation Fix Versions Loaded!', 'color: #4fc3f7; font-weight: bold; font-size: 14px');
console.log('Test different approaches: setAnimV1() through setAnimV20()');
console.log('Show current: showAnimVersion()');
console.log('%c DIAGNOSTIC TOOLS:', 'color: #ff9800; font-weight: bold');
console.log('  dumpAnimState() - Full state dump');
console.log('  watchBones() - Watch if leg bones move');
console.log('  forceRunAnim() - Force play run animation');
console.log('  testMixerUpdate() - Verify mixer.update() is called');
console.log('  checkTrackBinding() - Verify animation tracks match skeleton');

// LOADING SCREEN SYSTEM
// Old "GAP TAG" loading screen removed - now using Street Fighter-style loading screen in select-stage.html

// STAGE 2 LOADING SCREEN (Level-specific)
// Stage 1 loading screen removed - using select-stage.html loading screen instead

const Stage2LoadingScreen = {
    overlay: null,
    isComplete: false,
    startTime: 0,
    minDisplayTime: 1000, // Minimum 1 second display time

    show() {
        this.isComplete = false;
        this.startTime = Date.now();

        // Create loading screen overlay
        this.overlay = document.createElement('div');
        this.overlay.id = 'stage2-loading-screen';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: #000;
            color: #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
        `;
        this.overlay.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 48px; margin-bottom: 15px; color: #2196f3;">🚗 STAGE 2</div>
                <div style="font-size: 20px; margin-bottom: 30px; color: #888;">Loading Tunnel...</div>
                <div style="width: 300px; height: 6px; background: #333; border-radius: 3px; overflow: hidden; margin-bottom: 20px;">
                    <div id="stage2-loading-bar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #2196f3, #1976d2); transition: width 0.3s;"></div>
                </div>
                <div id="stage2-loading-text" style="font-size: 18px; color: #888;">Loading... 0%</div>
            </div>
        `;
        document.body.appendChild(this.overlay);
        console.log('Stage 2 loading screen shown');
    },

    updateProgress(percentage) {
        const bar = document.getElementById('stage2-loading-bar');
        const text = document.getElementById('stage2-loading-text');
        if (bar) bar.style.width = percentage + '%';
        if (text) text.textContent = `Loading... ${percentage}%`;
        console.log(`Stage 2 loading progress: ${percentage}%`);
    },

    complete() {
        if (this.isComplete) return;
        this.isComplete = true;

        // Calculate how long we've been displaying
        const elapsed = Date.now() - this.startTime;
        const remainingTime = Math.max(0, this.minDisplayTime - elapsed);

        console.log(`Stage 2 loading complete. Elapsed: ${elapsed}ms, Remaining: ${remainingTime}ms`);

        // Wait for minimum display time before fading out
        setTimeout(() => {
            if (!this.overlay) return;

            // Fade out loading screen
            this.overlay.style.transition = 'opacity 0.5s';
            this.overlay.style.opacity = '0';

            setTimeout(() => {
                if (this.overlay && this.overlay.parentNode) {
                    this.overlay.parentNode.removeChild(this.overlay);
                    this.overlay = null;
                }
            }, 500);
        }, remainingTime);
    }
};

// SHARED LOADER WITH PROGRESS TRACKING (Initial Load)
// No loading screen on game.html - using select-stage.html loading screen instead
const loadingManager = new THREE.LoadingManager();
let assetsLoaded = false;

loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    const progress = Math.round((itemsLoaded / itemsTotal) * 100);
    console.log(`🔄 Loading: ${progress}% (${itemsLoaded}/${itemsTotal})`);
};
loadingManager.onLoad = () => {
    console.log('✅ All assets loaded!');
    assetsLoaded = true;

    // Show UI now that loading is complete
    setTimeout(() => {
        if (GameState.screen === 'START') {
            UI.updateUI();
        }
    }, 300);
};
const sharedGLTFLoader = new GLTFLoader(loadingManager);
const sharedFBXLoader = new FBXLoader(loadingManager);

// STAGE 1 LOADER WITH SEPARATE PROGRESS TRACKING
// Stage 1 loading manager removed - characters load directly
const stage1GLTFLoader = new GLTFLoader();
const stage1FBXLoader = new FBXLoader();

// STAGE 2 LOADER WITH SEPARATE PROGRESS TRACKING
const stage2LoadingManager = new THREE.LoadingManager();
let stage2AssetsLoaded = false;

stage2LoadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    const progress = Math.round((itemsLoaded / itemsTotal) * 100);
    console.log(`🔄 Stage 2 Loading: ${progress}% (${itemsLoaded}/${itemsTotal})`);
    Stage2LoadingScreen.updateProgress(progress);
};
stage2LoadingManager.onLoad = () => {
    console.log('✅ All Stage 2 assets loaded!');
    stage2AssetsLoaded = true;

    // Pre-warm shooting mechanics to avoid first-shot lag
    setTimeout(() => {
        warmupShootingMechanics();
    }, 100);

    // Complete Stage 2 loading screen
    setTimeout(() => {
        // Update UI BEFORE fading out loading screen so playing screen is ready underneath
        if (GameState.selectedLevel === 'shoot' || GameState.selectedLevel === 'shoot-horizontal') {
            UI.updateUI();
        }

        Stage2LoadingScreen.complete();

        // Initialize horizontal controls AFTER loading screen fades out
        // Loading screen takes 1000ms min + 500ms fade + 500ms remove = ~2000ms total
        if (GameState.isHorizontalMode) {
            setTimeout(() => {
                console.log('[Stage2] Initializing horizontal controls after loading complete');
                HorizontalControls.init();
            }, 2000);
        }
    }, 800); // Increased delay to allow warmup to complete
};
const stage2GLTFLoader = new GLTFLoader(stage2LoadingManager);
const stage2FBXLoader = new FBXLoader(stage2LoadingManager);

// Pre-warm shooting mechanics to prevent first-shot lag
let isWarmingUp = false; // Flag to suppress shoot logs during warmup

function warmupShootingMechanics() {
    console.log('🔥 Warming up shooting mechanics...');
    isWarmingUp = true;

    // Wait for officer, gun, AND animations to be fully loaded
    const checkReady = setInterval(() => {
        if (!shooterModel || !muzzleFlash || !subMachineGun || !window.animationsReady) {
            console.log('⏳ Waiting for officer, gun, and animations to load...');
            return;
        }

        clearInterval(checkReady);

        // Trigger shoot function multiple times to pre-compile shaders and initialize buffers
        let warmupCount = 0;
        const maxWarmups = 5;

        const warmupInterval = setInterval(() => {
            if (warmupCount >= maxWarmups) {
                clearInterval(warmupInterval);

                // Clean up all warmup objects after a brief delay
                setTimeout(() => {
                    cleanupWarmupObjects();
                    isWarmingUp = false;

                    // CRITICAL FIX: Reset animation to idle after warmup
                    // Warmup shooting sets current to 'shoot', need to reset to idle
                    if (officerActions.idle) {
                        // Make sure idle is playing
                        if (!officerActions.idle.isRunning()) {
                            officerActions.idle.reset();
                            officerActions.idle.play();
                        }
                        officerActions.current = 'idle';
                        console.log('✅ Animation reset to idle after warmup (current:', officerActions.current, ')');
                    }

                    console.log('✅ Shooting mechanics warmed up - ready to play!');
                }, 100);
                return;
            }

            // Trigger shoot (this creates bullets, smoke, casings, muzzle flash)
            if (MazeController && typeof MazeController.shoot === 'function') {
                MazeController.shoot();
                warmupCount++;
            }
        }, 100); // 100ms between each warmup shot
    }, 50); // Check every 50ms
}

function cleanupWarmupObjects() {
    // Remove all bullets created during warmup
    bullets.forEach(bullet => {
        if (bullet && bullet.parent) {
            scene.remove(bullet);
        }
        // Dispose geometry and material to prevent memory leaks
        if (bullet && bullet.geometry) bullet.geometry.dispose();
        if (bullet && bullet.material) bullet.material.dispose();
    });
    bullets.length = 0;

    // Remove all smoke particles created during warmup
    smokeParticles.forEach(smoke => {
        if (smoke && smoke.parent) {
            scene.remove(smoke);
        }
        // Dispose geometry and material to prevent memory leaks
        if (smoke && smoke.geometry) smoke.geometry.dispose();
        if (smoke && smoke.material) smoke.material.dispose();
    });
    smokeParticles.length = 0;

    // Remove all bullet casings created during warmup
    bulletCasings.forEach(casing => {
        if (casing && casing.parent) {
            scene.remove(casing);
        }
        // Dispose geometry and material to prevent memory leaks
        if (casing && casing.geometry) casing.geometry.dispose();
        if (casing && casing.material) casing.material.dispose();
    });
    bulletCasings.length = 0;

    console.log('🧹 Warmup objects cleaned up');
}

// Debug mode
const DEBUG = false;

// Enable/disable console logging based on DEBUG mode (reduces noise in production)
window._enableProductionLogging(DEBUG);

// ============================================================================
// LEVEL CONFIGURATION - STARTING POSITIONS
// ============================================================================
// IMPORTANT: These are the verified starting positions for each game mode
// DO NOT CHANGE unless explicitly updated by the user

const LEVEL_CONFIG = {
    // ANIMATION TESTING MODE (Tunnel)
    // ⭐ PERFECT SIZE CONFIRMED - 2026-01-24 at 17:37
    // Tunnel scale: (100, 100, 100) - DO NOT CHANGE
    // Starting position: X: -29.05, Z: -200.28 (user's saved position)
    ANIMATION_TESTING_START: {
        x: -48.66,   // User's preferred starting position (centered view)
        y: 1.0,
        z: -231.69,  // User's exact starting Z from dashboard
        rotation: 0,  // Face toward exit (positive Z direction)
        description: 'Inside tunnel - user preferred centered starting position'
    }
};

// ============================================================================
// THREE.JS SETUP
// ============================================================================

let scene, camera, renderer;
let player, enemy;
let playerMixer, enemyMixer;
let playerModel, enemyModel;
let playerAnimations = {}; // Store run, jump, pickup, throw animations
let enemyAnimations = {}; // Store run, lookBehind animations
let currentPlayerAnimation = null;
let enemyLookBehindTriggered = false; // Track if look-behind animation has been triggered
let colaCanTemplate = null; // Template for thrown cola can
let heldCanModel = null; // Can model attached to player's hand when holding
let clock;

// Game world
const LANE_WIDTH = 3;
const LANE_POSITIONS = [-LANE_WIDTH, 0, LANE_WIDTH];
const GAME_SPEED = 15;

// Pickup control
let pickupsEnabled = false; // Will be enabled 2 seconds after game starts

// Loading progress tracking (for preload mode)
const loadingProgress = {
    // Core models
    playerModel: false,
    enemyModel: false,
    colaCanModel: false,
    skyDome: false,

    // Player animations (critical for gameplay)
    playerJumpAnim: false,
    playerPickupAnim: false,
    playerThrowAnim: false,
    playerHoldingAnim: false,

    // Enemy animations (critical for cinematic)
    enemyLookBehindAnim: false,
    enemyDeathAnim: false,
    enemyJumpAnim: false,

    update() {
        // Count all critical assets (11 total)
        const total = 11;
        const loaded = (this.playerModel ? 1 : 0) +
                      (this.enemyModel ? 1 : 0) +
                      (this.colaCanModel ? 1 : 0) +
                      (this.skyDome ? 1 : 0) +
                      (this.playerJumpAnim ? 1 : 0) +
                      (this.playerPickupAnim ? 1 : 0) +
                      (this.playerThrowAnim ? 1 : 0) +
                      (this.playerHoldingAnim ? 1 : 0) +
                      (this.enemyLookBehindAnim ? 1 : 0) +
                      (this.enemyDeathAnim ? 1 : 0) +
                      (this.enemyJumpAnim ? 1 : 0);
        const progress = Math.round((loaded / total) * 100);

        // Send progress to parent window if in preload mode
        const urlParams = new URLSearchParams(window.location.search);
        const isPreloading = urlParams.get('preload') === 'true';
        if (isPreloading && window.parent) {
            window.parent.postMessage({
                type: 'GAME_LOAD_PROGRESS',
                progress: progress
            }, '*');
            console.log(`📦 Loading progress: ${progress}% (${loaded}/${total} assets loaded)`);
        }
    }
};

// Help overlay
let helpOverlayVisible = false;

// Shooting game variables (now maze exploration)
let shooterModel, shooterMixer;
let bullets = [];
let enemies = [];
let mazeWalls = [];
let exitMarker = null;

// Urban environment
let urbanEnvironment = null;
let environmentColliders = []; // Collision boxes for environment objects
let debugCollisionBoxes = []; // Visual wireframes for debugging

// Sky dome for Level 1 background
let skyDome = null;
const SKY_DOME_CONFIG = {
    enabled: true,              // Enable/disable sky dome
    rotationSpeed: 0.001,       // Slow rotation (radians per frame) - increased for visibility
    scale: 200,                 // Size of dome (optimized for texture clarity)
    renderOrder: -999           // Render first (behind everything else)
};

// Maze layout (1 = wall, 0 = corridor, 2 = exit)
const MAZE_LAYOUT = [
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,0,1,0,0,0,1],
    [1,1,1,0,1,1,1,1,0,1,1,1],
    [1,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,1,1,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1]
];

const TILE_SIZE = 3;
const WALL_HEIGHT = 3;

// ============================================================================
// MUSIC CONTROLLER
// ============================================================================

const MusicController = {
    level1Music: null,
    currentlyPlaying: null,
    pendingPlay: null, // Track which music should play on user interaction
    interactionListenersAdded: false,

    init() {
        this.level1Music = document.getElementById('level1-music');
        if (this.level1Music) {
            this.level1Music.volume = 0.5; // Set volume to 50%
        }
    },

    // Add event listeners for user interaction to unlock audio
    addInteractionListeners() {
        if (this.interactionListenersAdded) return;
        this.interactionListenersAdded = true;

        const playOnInteraction = () => {
            if (this.pendingPlay) {
                this.pendingPlay.play().then(() => {
                    console.log('🎵 Music started after user interaction');
                    this.currentlyPlaying = this.pendingPlay;
                    this.pendingPlay = null;
                }).catch(e => console.log('Music play failed:', e));
            }
            // Remove listeners after first successful interaction
            document.removeEventListener('click', playOnInteraction);
            document.removeEventListener('touchstart', playOnInteraction);
            document.removeEventListener('keydown', playOnInteraction);
            this.interactionListenersAdded = false;
        };

        document.addEventListener('click', playOnInteraction);
        document.addEventListener('touchstart', playOnInteraction);
        document.addEventListener('keydown', playOnInteraction);
        console.log('🎵 Waiting for user interaction to play music...');
    },

    playLevel1Music() {
        // Re-get the element in case it wasn't available during init
        if (!this.level1Music) {
            this.level1Music = document.getElementById('level1-music');
        }

        if (!this.level1Music) {
            console.warn('⚠️ Level 1 music element not found');
            return;
        }

        console.log('🎵 Starting Level 1 music - game is now visible');

        // Function to start Level 1 music after intro stops
        const startLevel1Music = () => {
            // Set volume and play level 1 music
            this.level1Music.volume = 0.5;
            this.level1Music.currentTime = 0; // Start from beginning

            const playPromise = this.level1Music.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log('🎵 Level 1 music playing');
                        this.currentlyPlaying = this.level1Music;
                        this.pendingPlay = null;
                    })
                    .catch(err => {
                        console.log('🎵 Music autoplay blocked, will play on user interaction:', err);
                        // Store reference to play on first user interaction
                        this.pendingPlay = this.level1Music;
                        this.addInteractionListeners();
                    });
            }
        };

        // Stop intro music if it's still playing from loading screen
        const introMusic = document.getElementById('intro-music');
        if (introMusic && !introMusic.paused) {
            console.log('🎵 Stopping intro music (fading out)');
            // Fade out intro music smoothly
            const fadeOut = setInterval(() => {
                if (introMusic.volume > 0.05) {
                    introMusic.volume -= 0.05;
                } else {
                    introMusic.pause();
                    introMusic.currentTime = 0;
                    clearInterval(fadeOut);
                    console.log('🎵 Intro music stopped completely');

                    // NOW start Level 1 music after intro is fully stopped
                    startLevel1Music();
                }
            }, 50);
        } else {
            // No intro music playing, start Level 1 immediately
            startLevel1Music();
        }

        sessionStorage.removeItem('introMusicPlaying');
        sessionStorage.removeItem('introMusicTime');
    },

    stopAll() {
        if (this.level1Music) {
            this.level1Music.pause();
            this.level1Music.currentTime = 0;
        }
        this.currentlyPlaying = null;
        this.pendingPlay = null; // Clear pending play when stopping
        console.log('🎵 All music stopped');
    },

    pause() {
        if (this.currentlyPlaying) {
            this.currentlyPlaying.pause();
            console.log('🎵 Music paused');
        }
    },

    resume() {
        if (this.currentlyPlaying) {
            this.currentlyPlaying.play().catch(err => {
                console.log('Music resume failed:', err);
            });
            console.log('🎵 Music resumed');
        }
    }
};

// ============================================================================
// GAME STATE
// ============================================================================

const GameState = {
    isRunning: false,
    isPaused: false,
    isGameOver: false,
    currentMode: 'CHASE',
    score: 0,
    highScore: 0,
    lives: 3,
    maxLives: 3,
    screen: 'START',
    isNewHighScore: false,
    gameSpeed: GAME_SPEED,
    selectedLevel: null, // 'chase', 'shoot', or 'shoot-horizontal'
    stageCompleted: false, // Track if player reached the end
    isHorizontalMode: false, // True when playing Stage 2 Mobile (horizontal/landscape mode)
    timeScale: 1.0, // Slow motion multiplier (1.0 = normal speed, 0.3 = slow mo)
    stageFrozen: false // True when stage should stop moving (during enemy fall animation)
};

// ============================================================================
// INPUT SYSTEM
// ============================================================================

const Input = {
    touchActive: false,
    touchSide: null,
    touchX: 0,
    touchY: 0,
    inputProcessed: false,
    canvas: null,
    wasSwipe: false, // Track if current touch was a swipe (not a tap)

    init() {
        console.log('Input system initializing...');

        // CRITICAL FIX: Attach events to canvas element, not document
        // This prevents UI overlays from blocking input events
        // The canvas reference is set after renderer is created
        this.canvas = renderer.domElement;
        this.canvas.id = 'gameCanvas';
        this.canvas.style.touchAction = 'none'; // Prevent browser touch gestures

        // Touch events on canvas with passive: false to allow preventDefault
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });

        // Mouse events on canvas
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));

        // Keyboard events must stay on document (canvas doesn't receive key events without focus)
        document.addEventListener('keydown', this.handleKeyDown.bind(this));

        // Make canvas focusable for better event handling
        this.canvas.tabIndex = 1;
        this.canvas.style.outline = 'none';

        console.log('Input system initialized! Event listeners attached to canvas:', this.canvas.id);
    },

    handleTouchStart(e) {
        // Skip default touch handling in horizontal mode - HorizontalControls handles it
        if (GameState.isHorizontalMode) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();
        const touch = e.touches[0];
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
        this.touchStartTime = Date.now();
        this.wasSwipe = false; // Reset swipe flag on new touch

        // CRITICAL FIX FOR MOBILE MUSIC: Try to play pending music on first touch
        // This is needed because stopPropagation() prevents document-level listeners from firing
        if (MusicController.pendingPlay) {
            MusicController.pendingPlay.play().then(() => {
                console.log('🎵 Music started on mobile touch!');
                MusicController.currentlyPlaying = MusicController.pendingPlay;
                MusicController.pendingPlay = null;
            }).catch(e => console.log('🎵 Music play attempt failed:', e));
        }

        // CRITICAL FIX: Auto-recovery if touchend doesn't fire (mobile browser bug)
        // Clear any existing timeout first
        if (this.touchResetTimeout) {
            clearTimeout(this.touchResetTimeout);
        }

        // Failsafe: Auto-clear touch state after 3 seconds
        this.touchResetTimeout = setTimeout(() => {
            if (this.touchActive) {
                console.warn('⚠️ AUTO-RECOVERY: Touch stuck for 3+ seconds, force clearing');
                this.touchActive = false;
                this.inputProcessed = false;
                this.wasSwipe = false;
            }
        }, 3000);

        console.log('Touch START at:', this.touchStartX, this.touchStartY);
    },

    handleTouchMove(e) {
        // Skip default touch handling in horizontal mode - HorizontalControls handles it
        if (GameState.isHorizontalMode) {
            return;
        }

        // Prevent scrolling/zooming while touching the game canvas
        e.preventDefault();
        e.stopPropagation();

        if (!this.touchStartX) return;

        const touch = e.touches[0];
        const deltaX = touch.clientX - this.touchStartX;
        const deltaY = touch.clientY - this.touchStartY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Only process if moved at least 30px (prevents accidental swipes)
        if (distance < 30) return;

        // Calculate angle to determine 8-directional movement
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        // Determine if swipe is more diagonal (both components significant) or cardinal (one dominant)
        const ratio = Math.min(absDeltaX, absDeltaY) / Math.max(absDeltaX, absDeltaY);
        const isDiagonal = ratio > 0.4; // If ratio > 0.4, treat as diagonal

        // Handle all 8 directions
        if (isDiagonal) {
            // DIAGONAL MOVEMENTS
            if (deltaY < 0 && deltaX > 0) {
                // UP-RIGHT
                console.log('📱 Swipe UP-RIGHT (diagonal)');
                MazeController.keysPressed.up = true;
                MazeController.keysPressed.right = true;
                MazeController.keysPressed.down = false;
                MazeController.keysPressed.left = false;
            } else if (deltaY < 0 && deltaX < 0) {
                // UP-LEFT
                console.log('📱 Swipe UP-LEFT (diagonal)');
                MazeController.keysPressed.up = true;
                MazeController.keysPressed.left = true;
                MazeController.keysPressed.down = false;
                MazeController.keysPressed.right = false;
            } else if (deltaY > 0 && deltaX > 0) {
                // DOWN-RIGHT
                console.log('📱 Swipe DOWN-RIGHT (diagonal)');
                MazeController.keysPressed.down = true;
                MazeController.keysPressed.right = true;
                MazeController.keysPressed.up = false;
                MazeController.keysPressed.left = false;
            } else if (deltaY > 0 && deltaX < 0) {
                // DOWN-LEFT
                console.log('📱 Swipe DOWN-LEFT (diagonal)');
                MazeController.keysPressed.down = true;
                MazeController.keysPressed.left = true;
                MazeController.keysPressed.up = false;
                MazeController.keysPressed.right = false;
            }
        } else {
            // CARDINAL DIRECTIONS (pure up/down/left/right)
            if (deltaY < 0 && absDeltaY > absDeltaX) {
                // PURE UP (forward)
                console.log('📱 Swipe UP (pure) - run forward');
                MazeController.keysPressed.up = true;
                MazeController.keysPressed.down = false;
                MazeController.keysPressed.left = false;
                MazeController.keysPressed.right = false;
            } else if (deltaY > 0 && absDeltaY > absDeltaX) {
                // PURE DOWN (backward)
                console.log('📱 Swipe DOWN (pure) - run backward');
                MazeController.keysPressed.down = true;
                MazeController.keysPressed.up = false;
                MazeController.keysPressed.left = false;
                MazeController.keysPressed.right = false;
            } else if (deltaX < 0 && absDeltaX > absDeltaY) {
                // PURE LEFT
                console.log('📱 Swipe LEFT (pure)');
                MazeController.keysPressed.left = true;
                MazeController.keysPressed.right = false;
                MazeController.keysPressed.up = false;
                MazeController.keysPressed.down = false;

                // Level 1 (chase mode) lane change
                if (GameState.selectedLevel === 'chase') {
                    this.touchSide = 'LEFT';
                    this.touchActive = true;
                    this.inputProcessed = false;
                    this.wasSwipe = true; // Mark as swipe to prevent throw
                    console.log('📱 Level 1: LEFT lane change triggered');
                }
            } else if (deltaX > 0 && absDeltaX > absDeltaY) {
                // PURE RIGHT
                console.log('📱 Swipe RIGHT (pure)');
                MazeController.keysPressed.right = true;
                MazeController.keysPressed.left = false;
                MazeController.keysPressed.up = false;
                MazeController.keysPressed.down = false;

                // Level 1 (chase mode) lane change
                if (GameState.selectedLevel === 'chase') {
                    this.touchSide = 'RIGHT';
                    this.touchActive = true;
                    this.inputProcessed = false;
                    this.wasSwipe = true; // Mark as swipe to prevent throw
                    console.log('📱 Level 1: RIGHT lane change triggered');
                }
            }
        }

        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
    },

    handleTouchEnd(e) {
        // Skip default touch handling in horizontal mode - HorizontalControls handles it
        if (GameState.isHorizontalMode) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        // CRITICAL FIX: Clear the auto-recovery timeout since touch ended normally
        if (this.touchResetTimeout) {
            clearTimeout(this.touchResetTimeout);
            this.touchResetTimeout = null;
        }

        const touchDuration = Date.now() - this.touchStartTime;
        const touch = e.changedTouches[0];
        const deltaX = Math.abs(touch.clientX - this.touchStartX);
        const deltaY = Math.abs(touch.clientY - this.touchStartY);
        const totalDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // TAP detection: short duration + minimal movement + NOT a swipe = tap to shoot/throw
        // FIXED: Added !this.wasSwipe check to prevent throw during lane change swipes
        if (touchDuration < 200 && totalDistance < 20 && !this.wasSwipe) {
            if (GameState.selectedLevel === 'shoot' && GameState.screen === 'PLAYING') {
                console.log('📱 TAP detected - SHOOT!');
                MazeController.shoot();
            } else if (GameState.selectedLevel === 'chase' && GameState.screen === 'PLAYING' && PlayerController.hasItem) {
                console.log('📱 TAP detected - THROW!');
                PlayerController.startThrow();
            }
        } else if (this.wasSwipe) {
            console.log('📱 Swipe detected - ignoring throw (wasSwipe=true)');
        }

        // For Level 1 (chase mode), clear touch state after processing
        if (GameState.selectedLevel === 'chase') {
            setTimeout(() => {
                this.touchActive = false;
                this.touchSide = null;
            }, 100);
        }

        // For Level 2, DON'T clear movement - character continues moving in last swiped direction
        // Movement only stops when user swipes in the opposite direction

        this.touchStartX = null;
        this.touchStartY = null;
        this.touchStartTime = 0;
    },

    handleMouseDown(e) {
        // Only process left mouse button
        if (e.button !== 0) return;

        e.preventDefault();
        e.stopPropagation();

        console.log('Mouse DOWN on canvas:', e.clientX, e.clientY);

        // In shoot mode, clicking triggers shooting
        if (GameState.selectedLevel === 'shoot' && GameState.screen === 'PLAYING') {
            MazeController.shoot();
            return;
        }

        // In chase mode, clicking changes lanes
        this.touchX = e.clientX;
        this.touchY = e.clientY;
        this.touchActive = true;
        this.touchSide = this.touchX < window.innerWidth / 2 ? 'LEFT' : 'RIGHT';
        console.log('Input.handleMouseDown: touchSide=' + this.touchSide + ', x=' + this.touchX + ', touchActive=' + this.touchActive);
    },

    handleMouseUp(e) {
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();

        // Don't immediately clear - let game loop process it first
        setTimeout(() => {
            this.touchActive = false;
            this.touchSide = null;
        }, 100);
    },

    handleKeyDown(e) {
        // Toggle help overlay
        if (e.key === 'h' || e.key === 'H') {
            toggleHelpOverlay();
            return;
        }

        // Throw with spacebar when holding item (Level 1)
        if (e.key === ' ' || e.key === 'Spacebar') {
            if (GameState.selectedLevel === 'chase' && GameState.screen === 'PLAYING' && PlayerController.hasItem) {
                e.preventDefault();
                console.log('⌨️ SPACEBAR - THROW!');
                PlayerController.startThrow();
            }
            return;
        }

        if (e.key === 'ArrowLeft') {
            this.touchSide = 'LEFT';
            this.touchActive = true;
            setTimeout(() => { this.touchActive = false; }, 100);
        } else if (e.key === 'ArrowRight') {
            this.touchSide = 'RIGHT';
            this.touchActive = true;
            setTimeout(() => { this.touchActive = false; }, 100);
        }
    }
};

// ============================================================================
// PLAYER CONTROLLER
// ============================================================================

const PlayerController = {
    currentLane: 1,
    targetLane: 1,
    laneChangeSpeed: 10,
    isInvincible: false,
    invincibilityTimer: 0,
    previousTargetLane: 1,
    isJumping: false,
    jumpStartY: 1.0,
    isPickingUp: false,
    hasItem: false,
    hasThrown: false, // Track if player has thrown at least once (enables obstacle collision)
    _autoJumpLoggedOnce: false, // Debug flag
    isThrowing: false,
    savedGameSpeed: 0,
    throwTimeout: null,
    pickupTimeout: null,
    activeThrownItem: null, // Reference to the currently thrown item
    isFollowingThrowItem: false, // Camera follow state
    isFollowingEnemyReaction: false, // Camera close-up on enemy hit reaction
    throwCameraTimer: 0, // Timer for camera follow duration
    throwResultShown: false, // Whether we've shown the throw result text

    init() {
        this.currentLane = 1;
        this.targetLane = 1;
        this.previousTargetLane = 1;
        this.isInvincible = false;
        this.invincibilityTimer = 0;
        this.isJumping = false;
        this.jumpStartY = 1.0;
        this.isPickingUp = false;
        this.hasItem = false;
        this.hasThrown = false; // Reset throw state for new game
        this._autoJumpLoggedOnce = false;
        this.isThrowing = false;
        this.savedGameSpeed = 0;
        this.activeThrownItem = null;
        this.isFollowingThrowItem = false;
        this.isFollowingEnemyReaction = false;
        this.throwCameraTimer = 0;
        this.throwResultShown = false;
        // Clear any existing throw timeout
        if (this.throwTimeout) {
            clearTimeout(this.throwTimeout);
            this.throwTimeout = null;
        }
    },

    update(dt) {
        // Auto-jump when approaching a barrier
        // In chase mode: obstacles are safe UNTIL player throws for the first time
        // After first throw, auto-jump is enabled to avoid obstacles
        const shouldCheckAutoJump = (GameState.selectedLevel !== 'chase') ||
                                    (GameState.selectedLevel === 'chase' && this.hasThrown);

        // DEBUG: Log auto-jump check status (only once when hasThrown changes)
        if (this.hasThrown && !this._autoJumpLoggedOnce) {
            console.log('✅ Auto-jump NOW ENABLED (hasThrown=true)');
            this._autoJumpLoggedOnce = true;
        }

        if (!this.isJumping && playerModel && shouldCheckAutoJump) {
            this.checkAutoJump();
        }

        // Handle lane change input
        // CRITICAL FIX: Don't allow lane changes during throw or pickup animations
        if (Input.touchActive && !Input.inputProcessed && !this.isJumping && !this.isThrowing && !this.isPickingUp) {
            if (Input.touchSide === 'LEFT' && this.targetLane > 0) {
                this.targetLane--;
                Input.inputProcessed = true;
            } else if (Input.touchSide === 'RIGHT' && this.targetLane < 2) {
                this.targetLane++;
                Input.inputProcessed = true;
            }
        }

        if (!Input.touchActive) {
            Input.inputProcessed = false;
        }

        // Track lane changes
        if (this.targetLane !== this.previousTargetLane) {
            this.previousTargetLane = this.targetLane;
        }

        // Smooth lane movement
        if (playerModel) {
            const targetX = LANE_POSITIONS[this.targetLane];
            const diff = targetX - playerModel.position.x;

            if (Math.abs(diff) > 0.01) {
                playerModel.position.x += diff * this.laneChangeSpeed * dt;
            } else {
                playerModel.position.x = targetX;
            }
        }

        // Update invincibility
        if (this.isInvincible) {
            this.invincibilityTimer -= dt;
            if (this.invincibilityTimer <= 0) {
                this.isInvincible = false;
                this.invincibilityTimer = 0;
            }
        }

        // Update throw camera follow timer
        if (this.isFollowingThrowItem) {
            this.throwCameraTimer += dt;
            // End camera follow after 10 seconds (should be plenty of time for throw + result + fade)
            if (this.throwCameraTimer >= 10.0) {
                console.log('📷 Camera follow timeout (10 seconds reached)');
                this.endThrowCameraFollow();
            }
        }
    },

    checkAutoJump() {
        // Check if there's a barrier ahead in the current lane
        for (let i = 0; i < obstacles.length; i++) {
            const obstacle = obstacles[i];
            if (!obstacle.active) continue;

            const sameColumn = obstacle.lane === this.targetLane;
            // Negative distance = obstacle is ahead (obstacle.z < player.z)
            const distance = obstacle.mesh.position.z - playerModel.position.z;

            // DEBUG: Log obstacles in same lane
            if (sameColumn && distance < 0 && distance > -10) {
                console.log(`🚧 Obstacle in lane ${this.targetLane}: distance=${distance.toFixed(2)}, player.z=${playerModel.position.z.toFixed(2)}, obstacle.z=${obstacle.mesh.position.z.toFixed(2)}`);
            }

            // Trigger jump when obstacle is 2-6 units ahead (increased range for better detection)
            if (sameColumn && distance < -2.0 && distance > -6.0) {
                console.log(`🦘 Auto-jump triggered! Obstacle ${distance.toFixed(2)} units ahead in lane ${this.targetLane}`);
                this.startJump();
                break;
            }
        }
    },

    startJump() {
        if (!playerMixer || !playerAnimations.jump) return;

        console.log('🦘 Auto-jump triggered!');
        this.isJumping = true;
        this.jumpStartY = playerModel ? playerModel.position.y : 1.0;

        // Fade out current animation
        const currentAnim = playerAnimations[currentPlayerAnimation];
        if (currentAnim) {
            currentAnim.fadeOut(0.1);
        }

        // Play jump animation
        // CRITICAL: stop() and enabled=true are required for LoopOnce animations
        // Without these, the 'finished' event won't fire on subsequent plays
        playerAnimations.jump.stop();
        playerAnimations.jump.reset();
        playerAnimations.jump.enabled = true;
        playerAnimations.jump.fadeIn(0.1);
        playerAnimations.jump.play();
        currentPlayerAnimation = 'jump';
    },

    finishJump() {
        console.log('🦘 Jump finished!');
        this.isJumping = false;

        // Return to appropriate run animation based on whether holding an item
        if (this.hasItem) {
            this.switchToHoldingRunAnimation();
        } else {
            this.switchToRunAnimation();
        }
    },

    startPickup() {
        // EMERGENCY CLEANUP: If we're still in a throw state, force cleanup
        // This prevents frozen movement bug on mobile
        if (this.isThrowing) {
            console.warn('⚠️ EMERGENCY: startPickup called while still throwing - forcing throw cleanup!');
            this.isThrowing = false;
            if (this.throwTimeout) {
                clearTimeout(this.throwTimeout);
                this.throwTimeout = null;
            }
            // Restore game speed if it's stuck at 0
            if (GameState.gameSpeed === 0) {
                GameState.gameSpeed = this.savedGameSpeed || GAME_SPEED;
                console.log('⚡ EMERGENCY: Restored game speed to', GameState.gameSpeed);
            }
        }

        // Reset hasItem to allow pickup (in case previous throw didn't clean up properly)
        if (this.hasItem && !this.isPickingUp) {
            console.warn('⚠️ EMERGENCY: hasItem was still true - resetting to allow pickup');
            this.hasItem = false;
        }

        if (!playerMixer || !playerAnimations.pickup || this.isPickingUp || this.hasItem) return;

        console.log('✨ Pickup started!');
        this.isPickingUp = true;

        // Clear any existing pickup timeout
        if (this.pickupTimeout) {
            clearTimeout(this.pickupTimeout);
            this.pickupTimeout = null;
        }

        // If pickup interrupts a jump, clear jumping state so movement isn't blocked
        if (this.isJumping) {
            console.log('✨ Pickup interrupted jump - clearing jump state');
            this.isJumping = false;
        }

        // Fade out current animation
        const currentAnim = playerAnimations[currentPlayerAnimation];
        if (currentAnim) {
            currentAnim.fadeOut(0.1);
        }

        // Play pickup animation
        // IMPORTANT: stop() before reset() ensures the 'finished' event can fire again
        // CRITICAL: enabled = true is required for LoopOnce animations with clampWhenFinished
        playerAnimations.pickup.stop();
        playerAnimations.pickup.reset();
        playerAnimations.pickup.enabled = true;
        playerAnimations.pickup.fadeIn(0.1);
        playerAnimations.pickup.play();
        currentPlayerAnimation = 'pickup';

        // Get animation duration
        const clipDuration = playerAnimations.pickup.getClip().duration || 1.0;

        // Fallback timeout: ensure finishPickup is called even if animation event doesn't fire
        const timeoutMs = (clipDuration + 0.5) * 1000; // Add 500ms buffer
        console.log(`✨ Setting pickup timeout fallback: ${timeoutMs}ms (clip duration: ${clipDuration}s)`);

        this.pickupTimeout = setTimeout(() => {
            if (this.isPickingUp) {
                console.log('✨ Pickup timeout fallback triggered - forcing finishPickup()');
                this.finishPickup();
            }
        }, timeoutMs);
    },

    finishPickup() {
        // Prevent multiple calls (from both animation event and timeout)
        if (!this.isPickingUp) {
            console.log('✨ finishPickup called but not picking up - ignoring');
            return;
        }

        console.log('✨ Pickup finished!');

        // Clear the timeout if it exists
        if (this.pickupTimeout) {
            clearTimeout(this.pickupTimeout);
            this.pickupTimeout = null;
        }

        this.isPickingUp = false;
        this.hasItem = true;

        // Stop the pickup animation to ensure clean state for next time
        if (playerAnimations.pickup) {
            playerAnimations.pickup.stop();
        }

        // CRITICAL FIX: Attach visible can to player's hand
        if (colaCanTemplate && playerModel && !heldCanModel) {
            heldCanModel = colaCanTemplate.clone();
            // MOBILE FIX: Much larger scale for better visibility (2.0x instead of 1.0x)
            heldCanModel.scale.set(2.0, 2.0, 2.0);

            // Position can relative to player (in their hand area)
            // Player is rotated 180° (Math.PI), so local -Z is forward in world space
            // MOBILE FIX: Very forward (-1.2) and at shoulder height (1.6) for maximum visibility
            heldCanModel.position.set(0.7, 1.6, -1.2); // Right side, shoulder height, very forward
            heldCanModel.rotation.set(0, 0, 0.2); // Slight tilt for natural hold

            // Make sure it's visible
            heldCanModel.visible = true;
            heldCanModel.traverse((child) => {
                if (child.isMesh) {
                    child.visible = true;
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            // Add to player model so it moves with the player
            playerModel.add(heldCanModel);
            console.log('🥤 Can attached to player hand (mobile-optimized: scale 2.0, forward -1.2)');
            console.log('   Position:', heldCanModel.position);
            console.log('   Scale:', heldCanModel.scale);
            console.log('   Visible:', heldCanModel.visible);
            console.log('   In scene via player:', playerModel.children.includes(heldCanModel));
        }

        // Switch to holding run animation
        this.switchToHoldingRunAnimation();
        console.log('✨ Pickup cleanup complete. States: isThrowing=' + this.isThrowing + ', hasItem=' + this.hasItem + ', isPickingUp=' + this.isPickingUp);
    },

    startThrow() {
        // CRITICAL FIX: Force-clear pickup state to prevent state conflicts
        if (this.isPickingUp) {
            console.warn('⚠️ FORCE CLEAR: isPickingUp was true when starting throw');
            this.isPickingUp = false;
            if (this.pickupTimeout) {
                clearTimeout(this.pickupTimeout);
                this.pickupTimeout = null;
            }
        }

        if (!playerMixer || !playerAnimations.throw || !this.hasItem || this.isThrowing) return;

        console.log('🎯 Throw started!');
        console.log('   Held can exists:', !!heldCanModel);
        if (heldCanModel) {
            console.log('   Held can visible:', heldCanModel.visible);
            console.log('   Held can position:', heldCanModel.position);
        }
        this.isThrowing = true;
        this.hasItem = false; // CRITICAL: Clear immediately, don't wait for finishThrow
        this.hasThrown = true; // Enable obstacle collision after first throw

        // Clear any existing throw timeout
        if (this.throwTimeout) {
            clearTimeout(this.throwTimeout);
            this.throwTimeout = null;
        }

        // Stop player movement during throw
        this.savedGameSpeed = GameState.gameSpeed;
        GameState.gameSpeed = 0;

        // Enemy runs away during throw
        EnemyController.isRunningAway = true;

        // If throw interrupts a jump, clear jumping state so movement isn't blocked
        if (this.isJumping) {
            console.log('🎯 Throw interrupted jump - clearing jump state');
            this.isJumping = false;
        }

        // Fade out current animation
        const currentAnim = playerAnimations[currentPlayerAnimation];
        if (currentAnim) {
            currentAnim.fadeOut(0.1);
        }

        // Play throw animation
        // IMPORTANT: stop() before reset() ensures the 'finished' event can fire again
        // CRITICAL: enabled = true is required for LoopOnce animations with clampWhenFinished
        // After the first play, Three.js sets enabled=false, preventing subsequent 'finished' events
        playerAnimations.throw.stop();
        playerAnimations.throw.reset();
        playerAnimations.throw.enabled = true;
        playerAnimations.throw.fadeIn(0.1);
        playerAnimations.throw.play();
        currentPlayerAnimation = 'throw';

        // Get animation duration
        const clipDuration = playerAnimations.throw.getClip().duration || 1.0;

        // MOBILE FIX: Delay projectile spawn until 95% through animation (was 75%)
        // This keeps the held can visible throughout nearly the entire throw motion
        const itemSpawnDelay = clipDuration * 0.95 * 1000; // Convert to milliseconds
        console.log(`🎯 Item will spawn in ${itemSpawnDelay}ms (95% of ${clipDuration}s animation)`);

        setTimeout(() => {
            if (this.isThrowing) {
                this.createThrownItem();
            }
        }, itemSpawnDelay);

        // Fallback timeout: ensure finishThrow is called even if animation event doesn't fire
        const timeoutMs = (clipDuration + 0.5) * 1000; // Add 500ms buffer
        console.log(`🎯 Setting throw timeout fallback: ${timeoutMs}ms (clip duration: ${clipDuration}s)`);

        this.throwTimeout = setTimeout(() => {
            if (this.isThrowing) {
                console.log('🎯 Throw timeout fallback triggered - forcing finishThrow()');
                this.finishThrow();
            }
        }, timeoutMs);
    },

    finishThrow() {
        // Prevent multiple calls (from both animation event and timeout)
        if (!this.isThrowing) {
            console.log('🎯 finishThrow called but not throwing - ignoring');
            return;
        }

        console.log('🎯 Throw finished! Resetting states...');

        // Clear the timeout if it exists
        if (this.throwTimeout) {
            clearTimeout(this.throwTimeout);
            this.throwTimeout = null;
        }

        // Reset all throw-related states
        this.isThrowing = false;
        this.hasItem = false;

        // CRITICAL FIX: Reset Input system to prevent frozen controls
        Input.touchActive = false;
        Input.inputProcessed = false;
        Input.touchSide = null;
        Input.wasSwipe = false;
        console.log('🎹 Input system reset after throw');

        // Restore game speed (CRITICAL FIX: never restore to 0)
        if (this.savedGameSpeed > 0) {
            GameState.gameSpeed = this.savedGameSpeed;
        } else {
            console.warn('⚠️ savedGameSpeed was 0, using GAME_SPEED default');
            GameState.gameSpeed = GAME_SPEED;
        }
        GameState.timeScale = 1.0; // Ensure normal time scale

        // Stop enemy from running away
        EnemyController.isRunningAway = false;

        // Stop the throw animation to ensure clean state for next time
        if (playerAnimations.throw) {
            playerAnimations.throw.stop();
        }

        // Return to normal run animation
        this.switchToRunAnimation();

        console.log('🎯 Throw cleanup complete. States: isThrowing=' + this.isThrowing + ', hasItem=' + this.hasItem + ', isPickingUp=' + this.isPickingUp);
    },

    createThrownItem() {
        if (!playerModel) return;

        // CRITICAL FIX: Remove held can from player's hand now that projectile is being created
        if (heldCanModel && playerModel) {
            console.log('🥤 Removing held can (at 95% of throw animation)');
            playerModel.remove(heldCanModel);
            heldCanModel = null;
            console.log('🥤 Held can removed - projectile taking over');
        } else {
            console.warn('⚠️ No held can to remove when creating projectile!');
        }

        // Reset look-behind trigger for this new throw
        enemyLookBehindTriggered = false;

        let thrownItem;

        // Use cola can model if available, otherwise fall back to golden sphere
        if (colaCanTemplate) {
            thrownItem = colaCanTemplate.clone();
            // REDUCED SIZE: Scale down to 0.8 instead of 1.5 (less obtrusive, easier to see enemy)
            thrownItem.scale.set(0.8, 0.8, 0.8);
            console.log('🥤 Throwing cola can (scale: 0.8)');
        } else {
            // Fallback: Create a golden sphere as the thrown item
            const geometry = new THREE.SphereGeometry(0.3, 16, 16);
            const material = new THREE.MeshStandardMaterial({
                color: 0xffd700,
                emissive: 0xffd700,
                emissiveIntensity: 0.5,
                metalness: 0.8,
                roughness: 0.2
            });
            thrownItem = new THREE.Mesh(geometry, material);
            console.log('🎯 Throwing sphere (cola can not loaded)');
        }

        // Position at player's hand
        thrownItem.position.copy(playerModel.position);
        thrownItem.position.y += 2; // Slightly above player

        // CRITICAL: Ensure thrown item is always visible
        thrownItem.visible = true;
        thrownItem.traverse((child) => {
            if (child.isMesh) {
                child.visible = true;
                child.castShadow = true;
                child.receiveShadow = true;
                // Ensure material is visible
                if (child.material) {
                    child.material.visible = true;
                    child.material.opacity = 1.0;
                }
            }
        });

        scene.add(thrownItem);
        console.log('🥤 Thrown item added to scene, visible:', thrownItem.visible);

        // Store reference for camera follow
        this.activeThrownItem = thrownItem;
        this.isFollowingThrowItem = true;
        this.throwCameraTimer = 0;

        // Store the lane (X position) the item was thrown from
        const throwLaneX = thrownItem.position.x;

        // Animate the throw
        const throwSpeed = 25; // Speed of thrown item (reduced from 40 for better visibility)
        const throwStartZ = thrownItem.position.z;
        const throwDistance = 50; // Distance to travel

        // Debug: Log initial positions
        console.log(`🎯 Throw started - Item at Z: ${thrownItem.position.z.toFixed(2)}, Enemy at Z: ${enemyModel ? enemyModel.position.z.toFixed(2) : 'N/A'}, Distance: ${enemyModel ? thrownItem.position.distanceTo(enemyModel.position).toFixed(2) : 'N/A'}`);


        const animateThrow = () => {
            if (!thrownItem.parent) {
                // Item was removed - end camera follow
                this.endThrowCameraFollow();
                return;
            }

            // Move forward
            thrownItem.position.z -= throwSpeed * 0.016; // Approximate 60fps

            // Rotate for effect
            thrownItem.rotation.x += 0.2;
            thrownItem.rotation.y += 0.15;

            // Check collision with enemy FIRST (before distance check)
            if (enemyModel) {
                const distance = thrownItem.position.distanceTo(enemyModel.position);

                // Debug: log positions and distance
                if (Math.random() < 0.1) { // Log 10% of frames to avoid spam
                    console.log(`🎯 Throw check - Item Z: ${thrownItem.position.z.toFixed(2)}, Enemy Z: ${enemyModel.position.z.toFixed(2)}, Distance: ${distance.toFixed(2)}`);
                }

                // Trigger look-behind animation when item gets close (but hasn't hit yet)
                if (distance < 7.5 && !enemyLookBehindTriggered && enemyAnimations.lookBehind) {
                    console.log('👀 Enemy looks behind! Distance:', distance.toFixed(2));
                    // Stop run animation and play look-behind
                    if (enemyAnimations.run) enemyAnimations.run.stop();
                    enemyAnimations.lookBehind.reset();
                    enemyAnimations.lookBehind.play();
                    enemyLookBehindTriggered = true;
                }

                if (distance < 3.5) { // Increased hit detection radius from 2.0 to 3.5
                    // Check if enemy is in the same lane as the thrown item
                    const enemyX = enemyModel.position.x;
                    const laneDistance = Math.abs(enemyX - throwLaneX);
                    const sameLane = laneDistance < 1.5; // Within 1.5 units = same lane

                    if (!sameLane) {
                        console.log('🎯 Item passed near enemy but different lane - Distance:', distance, 'Lane distance:', laneDistance.toFixed(2), 'MISS');
                        // Don't register hit, continue animation
                    } else {
                        console.log('🎯 Item hit enemy! Distance:', distance, 'Lane distance:', laneDistance.toFixed(2));

                        // VANISH THE CAN IMMEDIATELY - remove from scene
                        scene.remove(thrownItem);
                        console.log('💨 Can vanished on impact');

                        // HIDE ALL PICKUPS ON THE GROUND
                        pickups.forEach(pickup => {
                            if (pickup.mesh) {
                                pickup.mesh.visible = false;
                            }
                        });
                        console.log('👻 All pickups hidden');

                        // STOP STAGE MOVEMENT COMPLETELY
                        GameState.gameSpeed = 0;
                        GameState.stageFrozen = true; // New flag to prevent stage updates
                        console.log('🛑 Stage movement frozen');

                        // SLOW MOTION EFFECT - watch enemy death reaction
                        GameState.timeScale = 0.3; // Slow to 30% speed
                        console.log('🎬 Slow motion activated!');

                        // Switch camera focus to ENEMY (not the can)
                        this.activeThrownItem = null; // Stop following can
                        this.isFollowingEnemyReaction = true; // New flag for enemy close-up
                        console.log('📷 Camera switched to enemy close-up');

                        EnemyController.takeDamage();

                        // Hold slow motion for 3 seconds to see full death animation
                        setTimeout(() => {
                            GameState.timeScale = 1.0; // Restore normal animation speed
                            // NOTE: Keep stage frozen and gameSpeed at 0 until "Got em!" text finishes
                            // This will be restored in fadeAndReturnToGameplay()
                            console.log('🎬 Normal animation speed restored (stage still frozen for "Got em!" text)');

                            this.isFollowingEnemyReaction = false; // End enemy close-up

                            // Show all pickups again
                            pickups.forEach(pickup => {
                                if (pickup.mesh && pickup.active) {
                                    pickup.mesh.visible = true;
                                }
                            });
                            console.log('👁️ Pickups visible again');

                            // Show "Got em!" text and fade (stage stays frozen during this)
                            this.showThrowResult(true);
                        }, 3000);

                        return; // STOP animation loop - can hit!
                    }
                }
            }

            // Check if item has traveled far enough (ONLY if no hit)
            if (Math.abs(thrownItem.position.z - throwStartZ) > throwDistance) {
                console.log('🎯 Item missed - traveled too far. Final distance from enemy:',
                    enemyModel ? thrownItem.position.distanceTo(enemyModel.position).toFixed(2) : 'N/A');
                scene.remove(thrownItem);
                // Show "Missed!" text and fade
                this.showThrowResult(false);
                return;
            }

            requestAnimationFrame(animateThrow);
        };

        animateThrow();
    },

    endThrowCameraFollow() {
        console.log('📷 Ending throw camera follow');
        this.isFollowingThrowItem = false;
        this.isFollowingEnemyReaction = false;
        this.activeThrownItem = null;
        this.throwCameraTimer = 0;
        this.throwResultShown = false;
        GameState.timeScale = 1.0; // Ensure normal speed is restored
        GameState.stageFrozen = false; // Ensure stage is unfrozen
    },

    showThrowResult(hit) {
        if (this.throwResultShown) return; // Only show once per throw
        this.throwResultShown = true;

        // Clear the throw timeout - we'll handle cleanup in fadeAndReturnToGameplay
        if (this.throwTimeout) {
            clearTimeout(this.throwTimeout);
            this.throwTimeout = null;
            console.log('🎯 Cleared throw timeout - cinematic sequence will handle cleanup');
        }

        // Hide player model during victory text display
        if (playerModel) {
            playerModel.visible = false;
            console.log('👤 Player hidden during "Got em!" text');
        }

        // Create overlay for throw result
        const overlay = document.createElement('div');
        overlay.id = 'throw-result-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            pointer-events: none;
        `;

        const text = document.createElement('div');
        text.style.cssText = `
            font-family: 'Orbitron', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            font-size: 80px;
            font-weight: 900;
            text-transform: uppercase;
            color: ${hit ? '#00ff41' : '#ff4444'};
            text-shadow: 0 0 30px ${hit ? 'rgba(0, 255, 65, 0.8)' : 'rgba(255, 68, 68, 0.8)'};
            opacity: 0;
            transform: scale(0.5);
            transition: all 0.3s ease-out;
        `;
        text.textContent = hit ? 'Got em!' : 'Missed!';

        overlay.appendChild(text);
        document.body.appendChild(overlay);

        // Animate text in
        setTimeout(() => {
            text.style.opacity = '1';
            text.style.transform = 'scale(1)';
        }, 50);

        // Hold for 1 second, then fade screen and return to gameplay
        setTimeout(() => {
            this.fadeAndReturnToGameplay(overlay);
        }, 1500);
    },

    fadeAndReturnToGameplay(resultOverlay) {
        console.log('🎬 Starting fade and return to gameplay sequence');

        // Create black fade overlay
        const fadeOverlay = document.createElement('div');
        fadeOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: black;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
            pointer-events: none;
        `;
        document.body.appendChild(fadeOverlay);

        // Fade to black
        setTimeout(() => {
            fadeOverlay.style.opacity = '1';
        }, 50);

        // After fade to black, clean up and return to gameplay
        setTimeout(() => {
            console.log('🎬 Fade to black complete - cleaning up and returning to gameplay');

            // Remove result text
            if (resultOverlay && resultOverlay.parentNode) {
                resultOverlay.parentNode.removeChild(resultOverlay);
            }

            // End camera follow and return to normal
            this.endThrowCameraFollow();
            this.finishThrow();

            // FORCE reset all throw states to ensure pickups work again
            this.isThrowing = false;
            this.hasItem = false;
            this.isPickingUp = false;
            GameState.timeScale = 1.0;
            GameState.stageFrozen = false; // Unfreeze stage NOW (after "Got em!" text)
            // CRITICAL FIX: Restore game speed from saved value or default
            GameState.gameSpeed = this.savedGameSpeed || GAME_SPEED;

            // CRITICAL FIX: Reset Input system to prevent frozen controls
            Input.touchActive = false;
            Input.inputProcessed = false;
            Input.touchSide = null;
            Input.wasSwipe = false;

            console.log('⚡ Game speed restored:', GameState.gameSpeed);
            console.log('▶️ Stage movement resumed (after "Got em!" text)');
            console.log('🎹 Input system reset');
            console.log('🎬 FORCED state reset: isThrowing=false, hasItem=false, isPickingUp=false, gameSpeed=', GameState.gameSpeed);

            // Force player back to run animation
            this.switchToRunAnimation();

            // Restore player visibility after "Got em!" text sequence
            if (playerModel) {
                playerModel.visible = true;
                console.log('👤 Player visible again - returning to gameplay');
            }

            // Reset enemy animation back to run (only if not playing death animation)
            if (enemyAnimations.death && enemyAnimations.death.isRunning()) {
                // Death animation is playing, don't interrupt it
                console.log('💀 Death animation still playing, not resetting to run');
            } else if (enemyAnimations.lookBehind && enemyAnimations.run) {
                enemyAnimations.lookBehind.stop();
                if (enemyAnimations.death) enemyAnimations.death.stop();

                // CRITICAL FIX: Reset enemy model transform to prevent lopsided running
                // Death animation may have altered rotation/position/scale - restore to initial state
                if (enemyModel) {
                    // Reset root model transform
                    enemyModel.rotation.y = Math.PI; // Face away from player (180 degrees)
                    enemyModel.position.set(0, 1.0, -15); // Reset to starting position (center lane, X=0)
                    enemyModel.scale.set(0.01, 0.01, 0.01); // Reset to correct scale

                    // CRITICAL FIX: Reset ALL bone transforms to bind pose
                    // Death animation affects skeleton bones, causing lopsided/tilted body
                    enemyModel.traverse((child) => {
                        if (child.isBone) {
                            // Reset bone rotation to identity (no rotation)
                            child.quaternion.set(0, 0, 0, 1);
                            // Reset bone position to origin (relative to parent)
                            child.position.set(0, 0, 0);
                            // Keep scale at 1
                            child.scale.set(1, 1, 1);
                        }
                    });

                    console.log('🔄 Enemy model transform reset (rotation, position, scale, bones)');
                }

                // CRITICAL FIX: Reset enemy lane to center lane (lane 1)
                // If enemy was in a different lane when hit, this prevents respawn to the side
                EnemyController.currentLane = 1;
                EnemyController.targetLane = 1;
                console.log('🔄 Enemy lane reset to center (lane 1)');

                enemyAnimations.run.reset();
                enemyAnimations.run.play();
                console.log('👀 Enemy animation reset to run');
            }
            enemyLookBehindTriggered = false;

            console.log('🎬 States after cleanup: isThrowing=' + this.isThrowing + ', hasItem=' + this.hasItem + ', isPickingUp=' + this.isPickingUp + ', gameSpeed=' + GameState.gameSpeed);

            // Fade back in
            setTimeout(() => {
                fadeOverlay.style.opacity = '0';
                console.log('🎬 Fading back in - gameplay should resume');

                // Remove fade overlay after transition
                setTimeout(() => {
                    if (fadeOverlay && fadeOverlay.parentNode) {
                        fadeOverlay.parentNode.removeChild(fadeOverlay);
                    }
                    console.log('🎬 Fade sequence complete - back to normal gameplay');
                }, 500);
            }, 100);
        }, 500);
    },


    switchToRunAnimation() {
        if (!playerMixer || !playerAnimations.run) return;

        const currentAnim = playerAnimations[currentPlayerAnimation];
        if (currentAnim) {
            currentAnim.fadeOut(0.2);
        }

        playerAnimations.run.reset();
        playerAnimations.run.fadeIn(0.2);
        playerAnimations.run.play();
        currentPlayerAnimation = 'run';
    },

    switchToHoldingRunAnimation() {
        if (!playerMixer || !playerAnimations.runHolding) return;

        const currentAnim = playerAnimations[currentPlayerAnimation];
        if (currentAnim) {
            currentAnim.fadeOut(0.2);
        }

        playerAnimations.runHolding.reset();
        playerAnimations.runHolding.fadeIn(0.2);
        playerAnimations.runHolding.play();
        currentPlayerAnimation = 'runHolding';
        console.log('Switched to holding run animation');
    }
};

// ============================================================================
// ENEMY CONTROLLER
// ============================================================================

const EnemyController = {
    currentLane: 1,
    targetLane: 1,
    laneChangeSpeed: 8,
    laneChangeTimer: 0,
    laneChangeInterval: 2,
    distanceFromPlayer: -15, // Behind player in chase mode
    isRunningAway: false, // When true, enemy runs away during throw
    runAwaySpeed: 5, // Speed when running away (reduced from 20 so thrown item can reach)
    health: 5,
    maxHealth: 5,
    isJumping: false, // RALPH FIX: Track if enemy is jumping over obstacle
    jumpStartY: 1.0,

    init() {
        this.currentLane = 1;
        this.targetLane = 1;
        this.laneChangeTimer = 0;
        this.isRunningAway = false;
        this.health = this.maxHealth;
        this.isJumping = false;
    },

    // RALPH FIX: Check if there's an obstacle approaching from behind
    checkObstacleAhead() {
        if (!enemyModel) return null;

        for (let i = 0; i < obstacles.length; i++) {
            const obstacle = obstacles[i];
            if (!obstacle.active) continue;

            const sameColumn = obstacle.lane === this.currentLane;
            // FIX: Obstacles approach from behind (lower z), so check distance from enemy to obstacle
            const distance = enemyModel.position.z - obstacle.mesh.position.z;

            // Check if obstacle is behind and approaching (within jump range of 0-6 units)
            if (distance > 0 && distance < 6 && sameColumn) {
                console.log(`🚧 Obstacle detected! Lane ${obstacle.lane}, distance: ${distance.toFixed(2)}`);
                return obstacle;
            }
        }
        return null;
    },

    // RALPH FIX: Jump over obstacle
    startJump() {
        if (this.isJumping || !enemyModel || !enemyAnimations.jump) return;

        console.log('🦘 Enemy jumping over obstacle!');
        this.isJumping = true;
        this.jumpStartY = enemyModel.position.y;

        // Stop current animations and play jump
        if (enemyAnimations.run) enemyAnimations.run.stop();
        if (enemyAnimations.lookBehind) enemyAnimations.lookBehind.stop();

        enemyAnimations.jump.reset();
        enemyAnimations.jump.play();
        console.log('🦘 Playing jump animation');

        // Animation will handle the movement, but we track when it ends
        const jumpDuration = enemyAnimations.jump.getClip().duration;

        // Return to run animation after jump completes
        setTimeout(() => {
            this.isJumping = false;
            if (enemyAnimations.run) {
                enemyAnimations.run.reset();
                enemyAnimations.run.play();
                console.log('🦘 Enemy landed, back to running');
            }
        }, jumpDuration * 1000);
    },

    // RALPH FIX: Update jump state - now handled by animation
    updateJump(dt) {
        // Animation mixer handles the jump movement
        // This method can be used for any additional jump logic if needed
    },

    takeDamage() {
        if (this.health > 0) {
            this.health--;
            console.log(`🎯 Enemy hit! Health: ${this.health}/${this.maxHealth}`);

            // Play death/hit animation
            if (enemyAnimations.death) {
                // Stop current animations
                if (enemyAnimations.run) enemyAnimations.run.stop();
                if (enemyAnimations.lookBehind) enemyAnimations.lookBehind.stop();

                // Play death animation
                enemyAnimations.death.reset();
                enemyAnimations.death.play();
                console.log('💀 Playing death/hit animation');
            }

            // Update health bar
            UI.updateEnemyHealthBar();

            // Check if enemy is defeated
            if (this.health <= 0) {
                this.onDefeated();
            }
        }
    },

    onDefeated() {
        console.log('🎉 Enemy defeated!');
        GameState.isRunning = false;

        // Show victory screen
        setTimeout(() => {
            this.showVictoryScreen();
        }, 500);
    },

    showVictoryScreen() {
        console.log('🎉 Showing victory - demo complete');

        // Stop Level 1 music
        MusicController.stopAll();

        const overlay = UI.overlay;
        overlay.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; color: white; text-align: center; background: rgba(0,0,0,0.9); padding: 20px;">
                <h1 style="font-size: clamp(32px, 8vw, 64px); color: #00ff41; margin-bottom: 30px; font-family: 'Orbitron', sans-serif; text-shadow: 0 0 20px rgba(0, 255, 65, 0.8);">MISSION COMPLETED</h1>
                <p style="font-size: clamp(18px, 4vw, 28px); margin-bottom: 20px;">You caught Soundboy!</p>
                <p style="font-size: clamp(16px, 3.5vw, 24px); margin-bottom: 10px;">Score: ${GameState.score}</p>

                <div style="margin-top: 40px; margin-bottom: 30px; padding: 30px; background: rgba(0, 255, 65, 0.1); border: 2px solid #00ff41; border-radius: 12px; max-width: 600px;">
                    <p style="font-size: clamp(18px, 4vw, 24px); color: #00ff41; margin-bottom: 20px; font-weight: bold;">Thank you for playing the demo!</p>
                    <p style="font-size: clamp(14px, 3vw, 18px); color: #ffffff; margin-bottom: 15px;">For more information:</p>
                    <p style="font-size: clamp(16px, 3.5vw, 20px); color: #00f3ff; margin-bottom: 8px;">
                        <a href="https://twitter.com/bolalogos" target="_blank" style="color: #00f3ff; text-decoration: none; hover: text-decoration: underline;">@bolalogos</a>
                    </p>
                    <p style="font-size: clamp(14px, 3vw, 18px); color: #ffffff;">
                        <a href="mailto:logosbola@gmail.com" style="color: #ffffff; text-decoration: none;">logosbola@gmail.com</a>
                    </p>
                </div>

                <button onclick="window.location.href='select-stage.html'" style="margin-top: 20px; padding: 15px 40px; background: #00ff41; color: #000; border: none; border-radius: 8px; font-size: clamp(14px, 3vw, 18px); font-weight: bold; cursor: pointer; font-family: 'Orbitron', sans-serif; text-transform: uppercase; transition: all 0.3s;">
                    Return to Menu
                </button>
            </div>
        `;
    },

    update(dt) {
        // RALPH FIX: Check for obstacles ahead and jump
        if (!this.isJumping) {
            const obstacleAhead = this.checkObstacleAhead();
            if (obstacleAhead) {
                this.startJump();
            }
        }

        // RALPH FIX: Update jump state
        if (this.isJumping) {
            this.updateJump(dt);
        }

        // Lane change logic - ONLY when not jumping (prevents "flying" look)
        if (!this.isJumping) {
            this.laneChangeTimer += dt;

            if (this.laneChangeTimer >= this.laneChangeInterval) {
                this.laneChangeTimer = 0;
                const rand = Math.random();

                if (rand < 0.33 && this.targetLane > 0) {
                    this.targetLane--;
                } else if (rand > 0.66 && this.targetLane < 2) {
                    this.targetLane++;
                }

                this.laneChangeInterval = 1.5 + Math.random() * 1.5;
            }
        }

        // Smooth lane movement - ONLY when not jumping
        if (enemyModel && !this.isJumping) {
            const targetX = LANE_POSITIONS[this.targetLane];
            const diff = targetX - enemyModel.position.x;

            if (Math.abs(diff) > 0.01) {
                enemyModel.position.x += diff * this.laneChangeSpeed * dt;
            } else {
                enemyModel.position.x = targetX;
                this.currentLane = this.targetLane; // RALPH FIX: Update current lane when movement complete
            }

            // Position behind/ahead of player based on mode
            if (this.isRunningAway) {
                // Enemy runs away during throw
                enemyModel.position.z -= this.runAwaySpeed * dt;
            } else {
                const targetZ = GameState.currentMode === 'CHASE' ? this.distanceFromPlayer : -this.distanceFromPlayer;
                enemyModel.position.z = targetZ;
            }
        }
    }
};

// ============================================================================
// MAZE CONTROLLER (for Maze Exploration mode)
// ============================================================================

const MazeController = {
    velocity: { x: 0, z: 0 },
    speed: 8,
    keysPressed: { up: false, down: false, left: false, right: false },
    manualRotation: null, // For manual direction control

    // Shooting cooldown to prevent rapid fire causing freezes
    lastShotTime: 0,
    shootCooldown: 150, // Milliseconds between shots (150ms = ~6.7 shots per second)

    // Animation state management
    shootAnimTimeout: null, // Track the animation restoration timeout
    pendingAnimation: 'idle', // Animation to return to after shooting

    // Array size limits to prevent memory issues
    MAX_BULLETS: 50,
    MAX_SMOKE_PARTICLES: 100,
    MAX_BULLET_CASINGS: 200,

    init() {
        this.velocity = { x: 0, z: 0 };
        this.manualRotation = null;
        this.pendingAnimation = 'idle';
        console.log('Animation Controller initialized');

        // Add keyboard listeners
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
    },

    handleKeyDown(e) {
        // Toggle help overlay
        if (e.key === 'h' || e.key === 'H') {
            toggleHelpOverlay();
            return;
        }

        // Prevent default browser behavior for game keys (especially spacebar which scrolls page)
        if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
        }

        switch(e.key) {
            case 'ArrowUp':
                this.keysPressed.up = true;
                break;
            case 'ArrowDown':
                this.keysPressed.down = true;
                break;
            case 'ArrowLeft':
                this.keysPressed.left = true;
                break;
            case 'ArrowRight':
                this.keysPressed.right = true;
                break;
            case ' ':
                // Spacebar - shoot
                this.shoot();
                break;

            // MANUAL DIRECTION CONTROLS
            case '1':
                // Face UP (north, toward -Z)
                this.manualRotation = 0;
                console.log('Manual rotation: FORWARD (0°)');
                break;
            case '2':
                // Face RIGHT (east, toward +X)
                this.manualRotation = Math.PI / 2;
                console.log('Manual rotation: RIGHT (90°)');
                break;
            case '3':
                // Face DOWN (south, toward +Z)
                this.manualRotation = Math.PI;
                console.log('Manual rotation: BACKWARD (180°)');
                break;
            case '4':
                // Face LEFT (west, toward -X)
                this.manualRotation = -Math.PI / 2;
                console.log('Manual rotation: LEFT (-90°)');
                break;
            case '0':
                // Clear manual rotation OR switch to V0 if Shift is held
                if (event.shiftKey) {
                    CollisionSystem.setVersion(0);
                } else {
                    this.manualRotation = null;
                    console.log('Manual rotation: CLEARED (auto mode)');
                }
                break;
            case '5':
                CollisionSystem.setVersion(1);
                break;
            case '6':
                CollisionSystem.setVersion(2);
                break;
        }
    },

    shoot() {
        // Rate limiting - prevent shooting too fast which causes freezes
        const now = Date.now();
        if (!isWarmingUp && now - this.lastShotTime < this.shootCooldown) {
            return; // Still in cooldown
        }
        this.lastShotTime = now;

        if (!isWarmingUp) {
            console.log('BANG! Officer shooting...');
        }

        // Alternate flash color between yellow and white
        if (muzzleFlash) {
            const flashColor = flashColorToggle ? 0xffff00 : 0xffffff; // Yellow or white
            muzzleFlash.material.color.setHex(flashColor);

            // Update point light color too
            if (muzzleFlash.children[0]) {
                muzzleFlash.children[0].color.setHex(flashColor);
            }

            muzzleFlash.visible = true;
            flashColorToggle = !flashColorToggle; // Toggle for next shot

            // Hide after short duration
            setTimeout(() => {
                if (muzzleFlash) muzzleFlash.visible = false;
            }, 50); // 50ms flash
        }

        // Fire bullet projectile (remove oldest if at limit)
        if (bullets.length >= this.MAX_BULLETS) {
            const oldBullet = bullets.shift(); // Remove oldest
            scene.remove(oldBullet);
            if (oldBullet.geometry) oldBullet.geometry.dispose();
            if (oldBullet.material) oldBullet.material.dispose();
        }
        this.fireBullet();

        // Create smoke particles (remove oldest if at limit)
        if (smokeParticles.length >= this.MAX_SMOKE_PARTICLES) {
            const oldSmoke = smokeParticles.shift(); // Remove oldest
            scene.remove(oldSmoke);
            if (oldSmoke.geometry) oldSmoke.geometry.dispose();
            if (oldSmoke.material) oldSmoke.material.dispose();
        }
        this.createSmokeEffect();

        // Eject bullet casing (remove oldest if at limit)
        if (bulletCasings.length >= this.MAX_BULLET_CASINGS) {
            const oldCasing = bulletCasings.shift(); // Remove oldest
            scene.remove(oldCasing);
            if (oldCasing.geometry) oldCasing.geometry.dispose();
            if (oldCasing.material) oldCasing.material.dispose();
        }
        this.ejectBulletCasing();

        // Play shooting animation if available
        if (officerActions.shoot) {
            // Clear any pending animation restoration timeout
            if (this.shootAnimTimeout) {
                clearTimeout(this.shootAnimTimeout);
                this.shootAnimTimeout = null;
            }

            const shootAction = officerActions.shoot;
            const currentAnim = officerActions.current;
            const currentAction = officerActions[currentAnim];

            // If already shooting, just reset the animation time to replay
            if (currentAnim === 'shoot') {
                shootAction.time = 0;
                return; // Continue with current shoot animation
            }

            // CRITICAL: Properly set up shoot animation BEFORE crossfade
            // This prevents T-pose by ensuring weight is 1 before transition
            shootAction.reset();
            shootAction.setEffectiveTimeScale(1);
            shootAction.setEffectiveWeight(1);
            shootAction.setLoop(THREE.LoopOnce, 1);
            shootAction.clampWhenFinished = true;
            shootAction.enabled = true;  // Ensure animation is enabled
            shootAction.play();

            // Crossfade from current animation to shoot
            // Use false for warp to prevent timeScale corruption
            if (currentAction) {
                currentAction.crossFadeTo(shootAction, 0.1, false);
            }

            officerActions.current = 'shoot';

            // Store what animation to return to based on current movement
            const isMoving = this.keysPressed.up || this.keysPressed.down ||
                             this.keysPressed.left || this.keysPressed.right;
            this.pendingAnimation = isMoving ? 'run' : 'idle';

            // Return to appropriate animation after shoot completes
            const animDuration = shootAction._clip ? shootAction._clip.duration * 1000 : 300;
            this.shootAnimTimeout = setTimeout(() => {
                this.shootAnimTimeout = null;

                // Only transition if still in shoot animation
                if (officerActions.current !== 'shoot') return;

                // Re-check movement state at the time of transition
                const currentlyMoving = this.keysPressed.up || this.keysPressed.down ||
                                        this.keysPressed.left || this.keysPressed.right;
                const returnAnim = currentlyMoving ? 'run' : 'idle';

                const returnAction = officerActions[returnAnim];
                if (!returnAction) return;

                // CRITICAL: Set up return animation properly BEFORE crossfade
                returnAction.reset();
                returnAction.setEffectiveTimeScale(1);
                returnAction.setEffectiveWeight(1);
                returnAction.enabled = true;  // Ensure animation is enabled
                returnAction.play();

                // Crossfade back to movement/idle animation
                shootAction.crossFadeTo(returnAction, 0.15, false);

                officerActions.current = returnAnim;
            }, animDuration);
        }
    },

    createSmokeEffect() {
        if (!subMachineGun) return;

        // Get world position of gun barrel (where muzzle flash is)
        const barrelPos = new THREE.Vector3();
        if (muzzleFlash) {
            muzzleFlash.getWorldPosition(barrelPos);
        } else {
            subMachineGun.getWorldPosition(barrelPos);
        }

        // Create 5-8 smoke particles
        const numParticles = 5 + Math.floor(Math.random() * 4);
        for (let i = 0; i < numParticles; i++) {
            const smokeGeometry = new THREE.SphereGeometry(0.3, 8, 8);
            const smokeMaterial = new THREE.MeshBasicMaterial({
                color: 0x888888,
                transparent: true,
                opacity: 0.6
            });
            const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial);

            // Position at gun barrel
            smoke.position.copy(barrelPos);

            // Add random velocity (spread outward from gun)
            const spread = 0.5;
            smoke.userData.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * spread,
                Math.random() * 2 + 1, // Upward bias
                -Math.random() * 2 - 1 // Forward (in shooting direction)
            );

            // Rotate velocity based on shooter's rotation
            smoke.userData.velocity.applyAxisAngle(new THREE.Vector3(0, 1, 0), shooterModel.rotation.y);

            smoke.userData.lifetime = 0;
            smoke.userData.maxLifetime = 1.0 + Math.random() * 0.5; // 1-1.5 seconds

            scene.add(smoke);
            smokeParticles.push(smoke);
        }
    },

    fireBullet() {
        if (!muzzleFlash || !shooterModel) return;

        // Get muzzle flash world position (gun barrel tip)
        const barrelPos = new THREE.Vector3();
        muzzleFlash.getWorldPosition(barrelPos);

        // Create bullet (very small silver cylinder/capsule - realistic bullet size)
        const bulletGeometry = new THREE.CapsuleGeometry(0.015, 0.08, 4, 8);
        const bulletMaterial = new THREE.MeshStandardMaterial({
            color: 0xc0c0c0, // Silver color
            metalness: 0.9,
            roughness: 0.1,
            emissive: 0x404040 // Slight glow
        });
        const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);

        // Position at gun barrel tip
        bullet.position.copy(barrelPos);

        // Calculate shooting direction (forward from officer's facing direction)
        const shootAngle = shooterModel.rotation.y;
        const bulletSpeed = 50; // Very fast
        bullet.userData.velocity = new THREE.Vector3(
            Math.sin(shootAngle) * bulletSpeed,
            0, // Straight ahead (no drop for now)
            Math.cos(shootAngle) * bulletSpeed
        );

        // Orient bullet in direction of travel
        bullet.rotation.x = Math.PI / 2; // Point capsule forward
        bullet.rotation.y = shootAngle;

        bullet.userData.lifetime = 0;
        bullet.userData.maxLifetime = 3; // 3 seconds max range

        scene.add(bullet);
        bullets.push(bullet);

        console.log('Bullet fired!');
    },

    ejectBulletCasing() {
        if (!subMachineGun || !shooterModel) return;

        // Get gun position in world space
        const gunPos = new THREE.Vector3();
        subMachineGun.getWorldPosition(gunPos);

        // Create bullet casing (very small cylinder - realistic shell casing size)
        const casingGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.04, 8);
        const casingMaterial = new THREE.MeshStandardMaterial({
            color: 0xd4af37, // Golden brass color
            metalness: 0.8,
            roughness: 0.2
        });
        const casing = new THREE.Mesh(casingGeometry, casingMaterial);
        casing.castShadow = true;

        // Position at gun (slightly to the right for ejection port)
        casing.position.copy(gunPos);
        casing.position.y += 0.5; // Slightly higher

        // Ejection velocity (to the right and up)
        const ejectSpeed = 3;
        const ejectAngle = shooterModel.rotation.y + Math.PI / 2; // 90 degrees right
        casing.userData.velocity = new THREE.Vector3(
            Math.cos(ejectAngle) * ejectSpeed + (Math.random() - 0.5),
            2 + Math.random(), // Upward
            Math.sin(ejectAngle) * ejectSpeed + (Math.random() - 0.5)
        );

        // Random rotation velocity for tumbling effect
        casing.userData.rotationVelocity = new THREE.Vector3(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
        );

        casing.userData.onGround = false;
        casing.userData.lifetime = 0;

        scene.add(casing);
        bulletCasings.push(casing);
    },

    handleKeyUp(e) {
        switch(e.key) {
            case 'ArrowUp':
                this.keysPressed.up = false;
                break;
            case 'ArrowDown':
                this.keysPressed.down = false;
                break;
            case 'ArrowLeft':
                this.keysPressed.left = false;
                break;
            case 'ArrowRight':
                this.keysPressed.right = false;
                break;
        }
    },

    update(delta) {
        if (!shooterModel) return;

        // Calculate velocity based on key presses
        this.velocity.x = 0;
        this.velocity.z = 0;

        // RALPH FIX: Tunnel now runs entrance (low Z) to exit (high Z)
        // So forward = positive Z (toward exit)
        if (this.keysPressed.up) {
            this.velocity.z += this.speed;
            if (!this._debugKeyLogged) {
                console.log('[DEBUG] Arrow Up pressed, velocity.z:', this.velocity.z, 'speed:', this.speed);
                this._debugKeyLogged = true;
            }
        } else if (this._debugKeyLogged) {
            this._debugKeyLogged = false;
        }
        if (this.keysPressed.down) this.velocity.z -= this.speed;
        if (this.keysPressed.left) this.velocity.x += this.speed;
        if (this.keysPressed.right) this.velocity.x -= this.speed;

        // Normalize diagonal movement
        if (this.velocity.x !== 0 && this.velocity.z !== 0) {
            const factor = 1 / Math.sqrt(2);
            this.velocity.x *= factor;
            this.velocity.z *= factor;
        }

        // Calculate new position
        const newX = shooterModel.position.x + this.velocity.x * delta;
        const newZ = shooterModel.position.z + this.velocity.z * delta;

        // Check collision with environment
        const characterRadius = 0.5; // Officer collision radius

        // Use CollisionSystem (supports multiple versions)
        if (!CollisionSystem.checkCollision(newX, newZ, characterRadius)) {
            // No collision - update position
            shooterModel.position.x = newX;
            shooterModel.position.z = newZ;
        } else {
            // Collision detected - try sliding along walls
            // Try X movement only
            if (!CollisionSystem.checkCollision(newX, shooterModel.position.z, characterRadius)) {
                shooterModel.position.x = newX;
            }
            // Try Z movement only
            if (!CollisionSystem.checkCollision(shooterModel.position.x, newZ, characterRadius)) {
                shooterModel.position.z = newZ;
            }
        }

        // Keep within bounds - allow full tunnel traversal
        const maxBound = 250; // Increased to accommodate tunnel (extends to ±200)
        const entranceBoundary = -232; // Entrance wall - cannot go backward past this

        shooterModel.position.x = Math.max(-maxBound, Math.min(maxBound, shooterModel.position.x));
        shooterModel.position.z = Math.max(entranceBoundary, Math.min(maxBound, shooterModel.position.z)); // Blocked at entrance

        // Zero backward velocity if at entrance wall
        if (shooterModel.position.z <= entranceBoundary && this.velocity.z < 0) {
            this.velocity.z = 0; // Stop backward movement
        }

        // Check if character is moving
        const isMoving = this.velocity.x !== 0 || this.velocity.z !== 0;

        // Rotate character - use manual rotation if set, otherwise use movement direction
        if (this.manualRotation !== null) {
            // Manual rotation mode (use number keys 1-4)
            shooterModel.rotation.y = this.manualRotation;
        } else if (isMoving) {
            // Auto rotation based on movement direction
            const angle = Math.atan2(this.velocity.x, this.velocity.z);
            shooterModel.rotation.y = angle;
        }

        // Switch between idle and run animations
        this.updateAnimation(isMoving);
    },

    updateAnimation(isMoving) {
        // CRITICAL FIX: Don't run until all animations are loaded
        if (!window.animationsReady) {
            return; // Wait for all animations to load
        }

        const targetAnim = isMoving ? 'run' : 'idle';

        // Debug logging when movement state changes
        if (this._lastLoggedMoving !== isMoving) {
            console.log(`[V${window.animationVersion}] Movement: ${isMoving}, Target: ${targetAnim}, Current: ${officerActions.current}`);
            this._lastLoggedMoving = isMoving;
        }

        // If shooting, store pending animation but don't switch
        if (officerActions.current === 'shoot') {
            this.pendingAnimation = targetAnim;
            return;
        }

        // Skip if no change needed
        if (officerActions.current === targetAnim) return;

        const targetAction = officerActions[targetAnim];
        const currentAction = officerActions[officerActions.current];

        // Null check for target action
        if (!targetAction) {
            console.error(`[V${window.animationVersion}] Target action '${targetAnim}' is null!`);
            return;
        }

        // ========================================================================
        // 10 DIFFERENT ANIMATION FIX APPROACHES
        // Based on Three.js documentation and community solutions
        // ========================================================================
        switch(window.animationVersion) {

            // ----------------------------------------------------------------
            // VERSION 1: Simple Direct Play
            // Research: Most basic approach - just call play() and let Three.js handle it
            // The play() method automatically enables the action and starts it
            // Ref: https://threejs.org/docs/pages/AnimationAction.html
            // ----------------------------------------------------------------
            case 1:
                console.log(`[V1] Simple Direct Play: ${targetAnim}`);
                targetAction.play();
                officerActions.current = targetAnim;
                break;

            // ----------------------------------------------------------------
            // VERSION 2: Stop All Other Actions First
            // Research: Sometimes animations conflict because multiple actions are playing
            // Explicitly stop() all other animations to ensure clean state
            // Note: stop() resets action state including time position
            // Ref: https://github.com/mrdoob/three.js/issues/19328
            // ----------------------------------------------------------------
            case 2:
                console.log(`[V2] Stop All Others First: ${targetAnim}`);
                // Stop ALL animations except target
                Object.keys(officerActions).forEach(key => {
                    if (key !== 'current' && key !== targetAnim && officerActions[key]) {
                        officerActions[key].stop();
                    }
                });
                // Now play target
                targetAction.reset();
                targetAction.play();
                officerActions.current = targetAnim;
                break;

            // ----------------------------------------------------------------
            // VERSION 3: Use Halt Instead of Stop
            // Research: halt(time) gradually decelerates animation to stop
            // With time=0, it stops immediately but differently than stop()
            // halt() is designed to gracefully stop while stop() is more abrupt
            // Ref: https://discoverthreejs.com/book/first-steps/animation-system/
            // ----------------------------------------------------------------
            case 3:
                console.log(`[V3] Halt Then Play: ${targetAnim}`);
                if (currentAction) {
                    currentAction.halt(0);  // Immediate halt
                }
                targetAction.reset();
                targetAction.play();
                officerActions.current = targetAnim;
                break;

            // ----------------------------------------------------------------
            // VERSION 4: Weight-based Instant Switch (No Stop/Play)
            // Research: The animation weight system determines influence
            // Setting weight=0 makes an action have no effect
            // Setting weight=1 makes it fully active
            // Key insight: Action must be playing for weight to have effect!
            // Ref: https://github.com/mrdoob/three.js/issues/6178
            // ----------------------------------------------------------------
            case 4:
                console.log(`[V4] Weight Switch: ${targetAnim}`);
                // Ensure all actions are playing (weights control visibility)
                Object.keys(officerActions).forEach(key => {
                    if (key !== 'current' && officerActions[key]) {
                        const action = officerActions[key];
                        if (key === targetAnim) {
                            action.setEffectiveWeight(1);
                            action.play();  // Must be playing for weight to work!
                        } else {
                            action.setEffectiveWeight(0);
                        }
                    }
                });
                officerActions.current = targetAnim;
                break;

            // ----------------------------------------------------------------
            // VERSION 5: No Reset, Just Play
            // Research: reset() can cause issues by resetting internal state
            // Sometimes you just want to continue from current position
            // If action was paused, play() resumes; if stopped, starts from 0
            // Ref: https://threejs.org/docs/#api/en/animation/AnimationAction.stop
            // ----------------------------------------------------------------
            case 5:
                console.log(`[V5] No Reset, Just Play: ${targetAnim}`);
                if (currentAction) {
                    currentAction.stop();
                }
                // Skip reset() entirely - just configure and play
                targetAction.enabled = true;
                targetAction.setEffectiveWeight(1);
                targetAction.setEffectiveTimeScale(1);
                targetAction.play();
                officerActions.current = targetAnim;
                break;

            // ----------------------------------------------------------------
            // VERSION 6: Reset Time Separately (Manual Time Control)
            // Research: reset() does several things at once (time, weight, enabled, etc)
            // Here we manually control just what we need
            // Setting time=0 restarts the animation
            // Ref: https://github.com/mrdoob/three.js/issues/19535
            // ----------------------------------------------------------------
            case 6:
                console.log(`[V6] Manual Time Reset: ${targetAnim}`);
                if (currentAction) {
                    currentAction.enabled = false;
                    currentAction.setEffectiveWeight(0);
                }
                // Manual time reset instead of reset() method
                targetAction.time = 0;
                targetAction.enabled = true;
                targetAction.paused = false;
                targetAction.setEffectiveWeight(1);
                targetAction.setEffectiveTimeScale(1);
                targetAction.play();
                officerActions.current = targetAnim;
                break;

            // ----------------------------------------------------------------
            // VERSION 7: Disable Then Re-enable
            // Research: The enabled property controls if action has any effect
            // However, there's a known bug where enabled=false doesn't properly
            // affect _effectiveWeight (GitHub issue #10912)
            // This version explicitly handles both enabled AND weight
            // Ref: https://github.com/mrdoob/three.js/issues/10912
            // ----------------------------------------------------------------
            case 7:
                console.log(`[V7] Disable/Re-enable: ${targetAnim}`);
                // Disable ALL actions first
                Object.keys(officerActions).forEach(key => {
                    if (key !== 'current' && officerActions[key]) {
                        officerActions[key].enabled = false;
                        officerActions[key].setEffectiveWeight(0);
                    }
                });
                // Re-enable and configure target
                targetAction.enabled = true;
                targetAction.reset();
                targetAction.setEffectiveWeight(1);
                targetAction.setEffectiveTimeScale(1);
                targetAction.play();
                officerActions.current = targetAnim;
                break;

            // ----------------------------------------------------------------
            // VERSION 8: Force Time Scale Every Frame
            // Research: timeScale can get corrupted by crossFade operations
            // The crossFadeTo() method modifies timeScale and doesn't reset it
            // Explicitly setting timeScale=1 ensures animation runs at normal speed
            // Ref: https://github.com/mrdoob/three.js/issues/11147
            // ----------------------------------------------------------------
            case 8:
                console.log(`[V8] Force TimeScale: ${targetAnim}`);
                if (currentAction) {
                    currentAction.stop();
                    // Also reset its timeScale in case it was corrupted
                    currentAction.setEffectiveTimeScale(1);
                }
                // Force ALL timeScales to 1 (in case of corruption)
                targetAction.timeScale = 1;
                targetAction.setEffectiveTimeScale(1);
                targetAction.reset();
                targetAction.setEffectiveWeight(1);
                targetAction.enabled = true;
                targetAction.paused = false;
                targetAction.play();
                // Also ensure the mixer's timeScale is 1
                if (shooterMixer) {
                    shooterMixer.timeScale = 1;
                }
                officerActions.current = targetAnim;
                break;

            // ----------------------------------------------------------------
            // VERSION 9: Manual Weight Update (Bypass setEffectiveWeight)
            // Research: The official setEffectiveWeight might not always work
            // due to internal state issues. Direct property access might help.
            // Also ensure the action is properly scheduled for playback.
            // Ref: https://discourse.threejs.org/t/animation-weight-problem-threejs/59119
            // ----------------------------------------------------------------
            case 9:
                console.log(`[V9] Manual Weight: ${targetAnim}`);
                if (currentAction) {
                    currentAction.weight = 0;
                    currentAction.enabled = false;
                    currentAction.stop();
                }
                // Direct property manipulation
                targetAction.weight = 1;
                targetAction.timeScale = 1;
                targetAction.enabled = true;
                targetAction.paused = false;
                targetAction.time = 0;
                // Force-sync effective values
                targetAction.setEffectiveWeight(1);
                targetAction.setEffectiveTimeScale(1);
                targetAction.play();
                officerActions.current = targetAnim;
                break;

            // ----------------------------------------------------------------
            // VERSION 10: Nuclear Reset (Complete Mixer Reset)
            // Research: When all else fails, completely reset the mixer state
            // stopAllAction() stops all actions controlled by the mixer
            // Then recreate a clean state and restart target animation
            // Warning: This is the most aggressive approach
            // Ref: https://discourse.threejs.org/t/mixer-update-doest-not-start-update-animation/9327
            // ----------------------------------------------------------------
            case 10:
                console.log(`[V10] Nuclear Reset: ${targetAnim}`);
                if (shooterMixer) {
                    // Stop everything on the mixer
                    shooterMixer.stopAllAction();
                    // Reset mixer time (fresh start)
                    shooterMixer.setTime(0);
                }
                // Fully reconfigure the target action from scratch
                targetAction.reset();
                targetAction.time = 0;
                targetAction.timeScale = 1;
                targetAction.weight = 1;
                targetAction.enabled = true;
                targetAction.paused = false;
                targetAction.setEffectiveWeight(1);
                targetAction.setEffectiveTimeScale(1);
                targetAction.setLoop(THREE.LoopRepeat, Infinity);
                targetAction.play();
                officerActions.current = targetAnim;
                break;

            // ================================================================
            // VERSIONS 11-20: DEEP DIAGNOSTIC APPROACHES
            // These target ROOT CAUSES not just transition methods
            // ================================================================

            // ----------------------------------------------------------------
            // VERSION 11: Force Mixer Update in updateAnimation
            // Hypothesis: The mixer.update() call might not be receiving delta
            // or might be getting 0. Force an update here to prove mixer works.
            // ----------------------------------------------------------------
            case 11:
                console.log(`[V11] Force Mixer Update: ${targetAnim}`);
                console.log('[V11] DIAGNOSTIC: Forcing mixer.update(0.016) directly');

                // First, do a standard transition
                if (currentAction) {
                    currentAction.stop();
                }
                targetAction.reset();
                targetAction.setEffectiveWeight(1);
                targetAction.setEffectiveTimeScale(1);
                targetAction.enabled = true;
                targetAction.play();

                // Now FORCE the mixer to update right here
                if (shooterMixer) {
                    const preTime = shooterMixer.time;
                    shooterMixer.update(0.016); // Force ~60fps frame
                    const postTime = shooterMixer.time;
                    console.log(`[V11] Mixer time: ${preTime.toFixed(4)} -> ${postTime.toFixed(4)}`);

                    // Also log the action state AFTER update
                    console.log(`[V11] Action time after update: ${targetAction.time.toFixed(4)}`);
                }

                officerActions.current = targetAnim;
                break;

            // ----------------------------------------------------------------
            // VERSION 12: Recreate Action Each Transition
            // Hypothesis: Cached clipAction() returns stale action objects.
            // clipAction() with same clip returns same action - maybe corrupted.
            // ----------------------------------------------------------------
            case 12:
                console.log(`[V12] Recreate Action: ${targetAnim}`);

                // Get the clip from current action
                const clip12 = targetAction.getClip();
                if (!clip12) {
                    console.error('[V12] Target action has no clip!');
                    break;
                }

                console.log(`[V12] Creating FRESH action from clip: ${clip12.name}`);

                // Stop and uncache the old action
                targetAction.stop();
                shooterMixer.uncacheAction(clip12);

                // Create a brand new action
                const freshAction = shooterMixer.clipAction(clip12);
                freshAction.setLoop(THREE.LoopRepeat, Infinity);
                freshAction.reset();
                freshAction.setEffectiveWeight(1);
                freshAction.setEffectiveTimeScale(1);
                freshAction.enabled = true;
                freshAction.play();

                // Update the reference
                officerActions[targetAnim] = freshAction;
                officerActions.current = targetAnim;

                console.log(`[V12] New action created, isRunning: ${freshAction.isRunning()}`);
                break;

            // ----------------------------------------------------------------
            // VERSION 13: Validate Animation Tracks Match Skeleton
            // Hypothesis: FBX animations from separate files have different
            // bone names than the Officer.fbx model skeleton.
            // ----------------------------------------------------------------
            case 13:
                console.log(`[V13] Track Validation: ${targetAnim}`);

                // Get skeleton bone names from model
                let skeletonBones13 = [];
                if (shooterModel) {
                    shooterModel.traverse((child) => {
                        if (child.isSkinnedMesh && child.skeleton) {
                            skeletonBones13 = child.skeleton.bones.map(b => b.name);
                        }
                    });
                }

                console.log(`[V13] Model has ${skeletonBones13.length} bones`);
                console.log(`[V13] First 10 bones:`, skeletonBones13.slice(0, 10));

                // Get track names from animation clip
                const clip13 = targetAction.getClip();
                if (clip13) {
                    const trackNames = clip13.tracks.map(t => {
                        // Track names are like "boneName.quaternion" or "boneName.position"
                        return t.name.split('.')[0];
                    });
                    const uniqueTrackBones = [...new Set(trackNames)];

                    console.log(`[V13] Clip has ${clip13.tracks.length} tracks`);
                    console.log(`[V13] Unique bones in tracks:`, uniqueTrackBones.slice(0, 10));

                    // Check for mismatches
                    const missingBones = uniqueTrackBones.filter(tb => !skeletonBones13.includes(tb));
                    if (missingBones.length > 0) {
                        console.error(`[V13] ❌ MISMATCH! Animation tracks reference ${missingBones.length} bones not in skeleton:`);
                        console.error(`[V13] Missing:`, missingBones.slice(0, 10));
                    } else {
                        console.log(`[V13] ✅ All animation bones found in skeleton`);
                    }
                }

                // Still try to play
                if (currentAction) currentAction.stop();
                targetAction.reset();
                targetAction.setEffectiveWeight(1);
                targetAction.play();
                officerActions.current = targetAnim;
                break;

            // ----------------------------------------------------------------
            // VERSION 14: Force Action Activation State
            // Hypothesis: Action is not being scheduled by the mixer properly.
            // Use getMixer() to verify and _activate() to force.
            // ----------------------------------------------------------------
            case 14:
                console.log(`[V14] Force Activation: ${targetAnim}`);

                // Check if action is bound to our mixer
                const actionMixer = targetAction.getMixer();
                if (actionMixer !== shooterMixer) {
                    console.error('[V14] ❌ Action mixer mismatch!');
                    console.log('[V14] Action mixer:', actionMixer);
                    console.log('[V14] Expected mixer:', shooterMixer);
                }

                // Check if action is in the mixer's actions list
                const inActions = shooterMixer._actions.includes(targetAction);
                console.log(`[V14] Action in mixer._actions: ${inActions}`);

                // Stop current
                if (currentAction) {
                    currentAction.stop();
                }

                // Configure target
                targetAction.reset();
                targetAction.enabled = true;
                targetAction.setEffectiveWeight(1);
                targetAction.setEffectiveTimeScale(1);
                targetAction.play();

                // Check isScheduled (internal state)
                console.log(`[V14] Action isRunning: ${targetAction.isRunning()}`);
                console.log(`[V14] Action isScheduled: ${targetAction.isScheduled()}`);

                officerActions.current = targetAnim;
                break;

            // ----------------------------------------------------------------
            // VERSION 15: Direct Mixer._actions Manipulation
            // Hypothesis: The internal actions array has stale/corrupt entries.
            // Log complete state and try to understand what mixer sees.
            // ----------------------------------------------------------------
            case 15:
                console.log(`[V15] Direct Mixer Access: ${targetAnim}`);

                console.log('[V15] === MIXER INTERNAL STATE ===');
                console.log(`[V15] _actions count: ${shooterMixer._actions.length}`);
                console.log(`[V15] _nActiveActions: ${shooterMixer._nActiveActions}`);

                // Log all actions in the mixer
                shooterMixer._actions.forEach((action, i) => {
                    const actionClip = action.getClip();
                    console.log(`[V15] Action[${i}]: clip="${actionClip ? actionClip.name : 'null'}", enabled=${action.enabled}, weight=${action.getEffectiveWeight().toFixed(3)}, running=${action.isRunning()}`);
                });

                // Force all weights to 0 except target
                shooterMixer._actions.forEach((action) => {
                    if (action === targetAction) {
                        action.enabled = true;
                        action.setEffectiveWeight(1);
                        action.timeScale = 1;
                        action.reset();
                        action.play();
                    } else {
                        action.enabled = false;
                        action.setEffectiveWeight(0);
                    }
                });

                console.log(`[V15] After manipulation: target weight=${targetAction.getEffectiveWeight()}`);
                officerActions.current = targetAnim;
                break;

            // ----------------------------------------------------------------
            // VERSION 16: Clone Clips Before Use
            // Hypothesis: Using same clip reference causes state sharing issues.
            // Clone the clip to get an independent instance.
            // ----------------------------------------------------------------
            case 16:
                console.log(`[V16] Clone Clips: ${targetAnim}`);

                const originalClip16 = targetAction.getClip();
                if (!originalClip16) {
                    console.error('[V16] No clip found!');
                    break;
                }

                // Clone the clip
                const clonedClip = THREE.AnimationClip.parse(THREE.AnimationClip.toJSON(originalClip16));
                clonedClip.name = originalClip16.name + '_clone_' + Date.now();

                console.log(`[V16] Cloned clip: ${clonedClip.name}`);
                console.log(`[V16] Tracks: ${clonedClip.tracks.length}, Duration: ${clonedClip.duration}`);

                // Create action from cloned clip
                const clonedAction = shooterMixer.clipAction(clonedClip);
                clonedAction.setLoop(THREE.LoopRepeat, Infinity);
                clonedAction.reset();
                clonedAction.setEffectiveWeight(1);
                clonedAction.setEffectiveTimeScale(1);
                clonedAction.enabled = true;
                clonedAction.play();

                // Stop current
                if (currentAction) currentAction.stop();

                officerActions.current = targetAnim;
                console.log(`[V16] Cloned action isRunning: ${clonedAction.isRunning()}`);
                break;

            // ----------------------------------------------------------------
            // VERSION 17: Bypass officerActions Object
            // Hypothesis: The officerActions object structure causes issues.
            // Store directly in window for independent reference.
            // ----------------------------------------------------------------
            case 17:
                console.log(`[V17] Bypass officerActions: ${targetAnim}`);

                // Initialize debug storage
                if (!window.debugActions) {
                    window.debugActions = {};
                    console.log('[V17] Created window.debugActions storage');
                }

                // Copy action to window
                window.debugActions[targetAnim] = targetAction;
                const debugAction = window.debugActions[targetAnim];

                console.log(`[V17] Action reference check: same object? ${debugAction === targetAction}`);

                // Stop current via window reference if exists
                if (window.debugActions.current && window.debugActions[window.debugActions.current]) {
                    window.debugActions[window.debugActions.current].stop();
                }

                // Play via window reference
                debugAction.reset();
                debugAction.setEffectiveWeight(1);
                debugAction.setEffectiveTimeScale(1);
                debugAction.enabled = true;
                debugAction.play();

                window.debugActions.current = targetAnim;
                officerActions.current = targetAnim;

                console.log(`[V17] Debug action isRunning: ${debugAction.isRunning()}`);
                break;

            // ----------------------------------------------------------------
            // VERSION 18: Force Loop Mode Every Update
            // Hypothesis: Loop settings are being overridden elsewhere.
            // Set loop mode aggressively on every call.
            // ----------------------------------------------------------------
            case 18:
                console.log(`[V18] Force Loop Mode: ${targetAnim}`);

                // Log current loop state
                console.log(`[V18] Before - loop: ${targetAction.loop}, repetitions: ${targetAction.repetitions}`);

                // Stop current
                if (currentAction) currentAction.stop();

                // Set ALL loop-related properties
                targetAction.setLoop(THREE.LoopRepeat, Infinity);
                targetAction.loop = THREE.LoopRepeat;
                targetAction.repetitions = Infinity;
                targetAction.clampWhenFinished = false;

                // Configure and play
                targetAction.reset();
                targetAction.time = 0;
                targetAction.enabled = true;
                targetAction.paused = false;
                targetAction.setEffectiveWeight(1);
                targetAction.setEffectiveTimeScale(1);
                targetAction.play();

                // Log after
                console.log(`[V18] After - loop: ${targetAction.loop}, repetitions: ${targetAction.repetitions}`);
                console.log(`[V18] LoopRepeat constant: ${THREE.LoopRepeat}`);

                officerActions.current = targetAnim;
                break;

            // ----------------------------------------------------------------
            // VERSION 19: Manual Skeleton Pose Update
            // Hypothesis: Animation mixer works but skeleton doesn't update.
            // Manually rotate a visible bone to prove skeleton can change.
            // ----------------------------------------------------------------
            case 19:
                console.log(`[V19] Manual Skeleton Pose: ${targetAnim}`);

                // Find skeleton and bones
                let skeleton19 = null;
                let rightArm = null;
                let spine = null;

                if (shooterModel) {
                    shooterModel.traverse((child) => {
                        if (child.isSkinnedMesh && child.skeleton) {
                            skeleton19 = child.skeleton;
                        }
                        // Look for arm bone to manipulate
                        if (child.isBone) {
                            if (child.name.toLowerCase().includes('rightarm') ||
                                child.name.toLowerCase().includes('right_arm') ||
                                child.name === 'mixamorigRightArm') {
                                rightArm = child;
                            }
                            if (child.name.toLowerCase().includes('spine')) {
                                spine = child;
                            }
                        }
                    });
                }

                if (skeleton19) {
                    console.log(`[V19] Found skeleton with ${skeleton19.bones.length} bones`);
                }

                if (rightArm) {
                    console.log(`[V19] Found right arm bone: ${rightArm.name}`);
                    console.log(`[V19] Current rotation:`, rightArm.rotation);

                    // Manually rotate the arm to prove skeleton works
                    // This should cause a visible change if skeleton is functional
                    const testRotation = (Date.now() / 1000) % (Math.PI * 2);
                    rightArm.rotation.z = testRotation;
                    console.log(`[V19] SET rotation.z to ${testRotation.toFixed(3)}`);
                } else {
                    console.warn('[V19] Could not find right arm bone');
                    if (spine) {
                        console.log(`[V19] Trying spine: ${spine.name}`);
                        spine.rotation.y = Math.sin(Date.now() / 500) * 0.5;
                    }
                }

                // Also try normal animation play
                if (currentAction) currentAction.stop();
                targetAction.reset();
                targetAction.setEffectiveWeight(1);
                targetAction.play();
                officerActions.current = targetAnim;
                break;

            // ----------------------------------------------------------------
            // VERSION 20: Exhaustive Debug Mode
            // Hypothesis: We need to see EVERYTHING to find the root cause.
            // Log absolutely everything about the animation system.
            // ----------------------------------------------------------------
            case 20:
                console.log('%c[V20] EXHAUSTIVE DEBUG MODE', 'color: #ff0000; font-weight: bold; font-size: 14px');

                console.log('=== 1. TRANSITION DETAILS ===');
                console.log(`Target: ${targetAnim}`);
                console.log(`Current: ${officerActions.current}`);
                console.log(`Target action exists: ${!!targetAction}`);
                console.log(`Current action exists: ${!!currentAction}`);

                console.log('\n=== 2. TARGET ACTION STATE ===');
                if (targetAction) {
                    const clip20 = targetAction.getClip();
                    console.log('Clip name:', clip20 ? clip20.name : 'NULL');
                    console.log('Clip duration:', clip20 ? clip20.duration : 'N/A');
                    console.log('Clip tracks:', clip20 ? clip20.tracks.length : 'N/A');
                    console.log('Action enabled:', targetAction.enabled);
                    console.log('Action paused:', targetAction.paused);
                    console.log('Action time:', targetAction.time);
                    console.log('Action timeScale:', targetAction.timeScale);
                    console.log('Action weight:', targetAction.weight);
                    console.log('Effective weight:', targetAction.getEffectiveWeight());
                    console.log('Effective timeScale:', targetAction.getEffectiveTimeScale());
                    console.log('Loop mode:', targetAction.loop, '(LoopRepeat=', THREE.LoopRepeat, ')');
                    console.log('Is running:', targetAction.isRunning());
                    console.log('Is scheduled:', targetAction.isScheduled());
                }

                console.log('\n=== 3. MIXER STATE ===');
                if (shooterMixer) {
                    console.log('Mixer exists: YES');
                    console.log('Mixer time:', shooterMixer.time);
                    console.log('Mixer timeScale:', shooterMixer.timeScale);
                    console.log('_actions count:', shooterMixer._actions.length);
                    console.log('_nActiveActions:', shooterMixer._nActiveActions);
                    console.log('_bindings:', shooterMixer._bindings ? shooterMixer._bindings.length : 'undefined');
                    console.log('_bindingsByRootAndName:', shooterMixer._bindingsByRootAndName ? Object.keys(shooterMixer._bindingsByRootAndName).length : 'undefined');
                } else {
                    console.error('Mixer exists: NO!!!');
                }

                console.log('\n=== 4. ALL ACTIONS STATE ===');
                ['idle', 'run', 'shoot'].forEach(name => {
                    const act = officerActions[name];
                    if (act) {
                        console.log(`${name.toUpperCase()}: enabled=${act.enabled}, weight=${act.getEffectiveWeight().toFixed(3)}, time=${act.time.toFixed(3)}, running=${act.isRunning()}`);
                    } else {
                        console.error(`${name.toUpperCase()}: NULL!`);
                    }
                });

                console.log('\n=== 5. MODEL STATE ===');
                if (shooterModel) {
                    console.log('Model exists: YES');
                    console.log('Model visible:', shooterModel.visible);
                    console.log('Model position:', shooterModel.position.x.toFixed(2), shooterModel.position.y.toFixed(2), shooterModel.position.z.toFixed(2));

                    let meshCount = 0;
                    let skinnedMeshCount = 0;
                    let boneCount = 0;
                    shooterModel.traverse((child) => {
                        if (child.isMesh) meshCount++;
                        if (child.isSkinnedMesh) skinnedMeshCount++;
                        if (child.isBone) boneCount++;
                    });
                    console.log('Meshes:', meshCount);
                    console.log('SkinnedMeshes:', skinnedMeshCount);
                    console.log('Bones:', boneCount);
                } else {
                    console.error('Model exists: NO!!!');
                }

                console.log('\n=== 6. PERFORMING TRANSITION ===');

                // Do the transition with logging
                if (currentAction) {
                    console.log('Stopping current action...');
                    currentAction.stop();
                }

                console.log('Resetting target action...');
                targetAction.reset();

                console.log('Setting weight to 1...');
                targetAction.setEffectiveWeight(1);

                console.log('Setting timeScale to 1...');
                targetAction.setEffectiveTimeScale(1);

                console.log('Setting enabled to true...');
                targetAction.enabled = true;

                console.log('Calling play()...');
                targetAction.play();

                console.log('\n=== 7. POST-TRANSITION STATE ===');
                console.log('Target now running:', targetAction.isRunning());
                console.log('Target now scheduled:', targetAction.isScheduled());
                console.log('Target weight:', targetAction.getEffectiveWeight());
                console.log('Target time:', targetAction.time);

                officerActions.current = targetAnim;
                console.log('%c=== DEBUG COMPLETE ===', 'color: #ff0000; font-weight: bold');
                break;

            // ----------------------------------------------------------------
            // DEFAULT: Original implementation as fallback
            // ----------------------------------------------------------------
            default:
                console.log(`[Default] Original Implementation: ${targetAnim}`);
                if (currentAction) {
                    currentAction.stop();
                }
                targetAction.reset();
                targetAction.setEffectiveTimeScale(1);
                targetAction.setEffectiveWeight(1);
                targetAction.enabled = true;
                targetAction.play();
                officerActions.current = targetAnim;
        }

        // Log final state for debugging
        console.log(`[V${window.animationVersion}] Switched to ${targetAnim}:`, {
            weight: targetAction.getEffectiveWeight(),
            timeScale: targetAction.getEffectiveTimeScale(),
            enabled: targetAction.enabled,
            paused: targetAction.paused,
            time: targetAction.time.toFixed(3)
        });
    }
};

// ============================================================================
// HORIZONTAL CONTROLS - Mobile joystick and buttons for Stage 2 Mobile
// ============================================================================

const HorizontalControls = {
    joystick: null,
    joystickContainer: null,
    shootButton: null,
    actionButton: null,
    isActive: false,

    init() {
        if (this.isActive) {
            console.log('[HorizontalControls] Already active, skipping init');
            return;
        }

        console.log('[HorizontalControls] Initializing...');

        // Check if nipplejs is available
        if (typeof nipplejs === 'undefined') {
            console.error('[HorizontalControls] nipplejs not loaded!');
            return;
        }

        // Create joystick container
        this.joystickContainer = document.createElement('div');
        this.joystickContainer.id = 'joystick-zone';
        this.joystickContainer.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 30px;
            width: 150px;
            height: 150px;
            z-index: 1000;
            pointer-events: all;
        `;
        document.body.appendChild(this.joystickContainer);

        // Create joystick using nipplejs
        this.joystick = nipplejs.create({
            zone: this.joystickContainer,
            mode: 'static',
            position: { left: '75px', bottom: '75px' },
            color: 'rgba(255, 255, 255, 0.5)',
            size: 120,
            threshold: 0.2,
            fadeTime: 0
        });

        // Joystick event handlers
        this.joystick.on('move', (evt, data) => {
            this.handleJoystickMove(data);
        });

        this.joystick.on('end', () => {
            this.handleJoystickEnd();
        });

        // Create shoot button (bottom right)
        this.shootButton = document.createElement('div');
        this.shootButton.id = 'shoot-button';
        this.shootButton.innerHTML = '🔫';
        this.shootButton.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 70px;
            height: 70px;
            border-radius: 50%;
            background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
            border: 3px solid rgba(255, 255, 255, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            z-index: 1000;
            pointer-events: all;
            cursor: pointer;
            user-select: none;
            -webkit-user-select: none;
            -webkit-tap-highlight-color: transparent;
            box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4);
        `;
        document.body.appendChild(this.shootButton);

        // Create action button (above shoot button)
        this.actionButton = document.createElement('div');
        this.actionButton.id = 'action-button';
        this.actionButton.innerHTML = '⚡';
        this.actionButton.style.cssText = `
            position: fixed;
            bottom: 120px;
            right: 35px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
            border: 3px solid rgba(255, 255, 255, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            z-index: 1000;
            pointer-events: all;
            cursor: pointer;
            user-select: none;
            -webkit-user-select: none;
            -webkit-tap-highlight-color: transparent;
            box-shadow: 0 4px 15px rgba(33, 150, 243, 0.4);
        `;
        document.body.appendChild(this.actionButton);

        // Button event handlers with visual feedback
        this.shootButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.shootButton.style.transform = 'scale(0.9)';
            this.shootButton.style.boxShadow = '0 2px 8px rgba(255, 107, 53, 0.6)';
            MazeController.shoot();
        }, { passive: false });

        this.shootButton.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.shootButton.style.transform = 'scale(1)';
            this.shootButton.style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.4)';
        }, { passive: false });

        this.shootButton.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.shootButton.style.transform = 'scale(0.9)';
            MazeController.shoot();
        });

        this.shootButton.addEventListener('mouseup', () => {
            this.shootButton.style.transform = 'scale(1)';
        });

        this.actionButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.actionButton.style.transform = 'scale(0.9)';
            this.actionButton.style.boxShadow = '0 2px 8px rgba(33, 150, 243, 0.6)';
            this.handleAction();
        }, { passive: false });

        this.actionButton.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.actionButton.style.transform = 'scale(1)';
            this.actionButton.style.boxShadow = '0 4px 15px rgba(33, 150, 243, 0.4)';
        }, { passive: false });

        this.actionButton.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.actionButton.style.transform = 'scale(0.9)';
            this.handleAction();
        });

        this.actionButton.addEventListener('mouseup', () => {
            this.actionButton.style.transform = 'scale(1)';
        });

        this.isActive = true;
        console.log('[HorizontalControls] Initialized successfully');
    },

    handleJoystickMove(data) {
        if (!data || !data.angle || data.force === undefined) return;

        // Get angle in degrees (0 = right, 90 = up, 180 = left, 270 = down)
        const angle = data.angle.degree;
        const force = data.force;

        // Only process if force is above threshold
        if (force < 0.2) {
            this.handleJoystickEnd();
            return;
        }

        console.log(`[Joystick] angle: ${angle.toFixed(1)}°, force: ${force.toFixed(2)}`);

        // Map angle to 8 directions and set MazeController.keysPressed
        // nipplejs angles: 0/360 = right, 90 = up, 180 = left, 270 = down
        // We need to map these to our movement system

        // Reset all keys first
        MazeController.keysPressed.up = false;
        MazeController.keysPressed.down = false;
        MazeController.keysPressed.left = false;
        MazeController.keysPressed.right = false;

        // 8 directions with 45 degree segments
        // Right: 337.5 - 22.5
        // Up-Right: 22.5 - 67.5
        // Up: 67.5 - 112.5
        // Up-Left: 112.5 - 157.5
        // Left: 157.5 - 202.5
        // Down-Left: 202.5 - 247.5
        // Down: 247.5 - 292.5
        // Down-Right: 292.5 - 337.5

        if (angle >= 337.5 || angle < 22.5) {
            // Right
            MazeController.keysPressed.right = true;
        } else if (angle >= 22.5 && angle < 67.5) {
            // Up-Right
            MazeController.keysPressed.up = true;
            MazeController.keysPressed.right = true;
        } else if (angle >= 67.5 && angle < 112.5) {
            // Up
            MazeController.keysPressed.up = true;
        } else if (angle >= 112.5 && angle < 157.5) {
            // Up-Left
            MazeController.keysPressed.up = true;
            MazeController.keysPressed.left = true;
        } else if (angle >= 157.5 && angle < 202.5) {
            // Left
            MazeController.keysPressed.left = true;
        } else if (angle >= 202.5 && angle < 247.5) {
            // Down-Left
            MazeController.keysPressed.down = true;
            MazeController.keysPressed.left = true;
        } else if (angle >= 247.5 && angle < 292.5) {
            // Down
            MazeController.keysPressed.down = true;
        } else if (angle >= 292.5 && angle < 337.5) {
            // Down-Right
            MazeController.keysPressed.down = true;
            MazeController.keysPressed.right = true;
        }
    },

    handleJoystickEnd() {
        // Clear all movement keys when joystick is released
        MazeController.keysPressed.up = false;
        MazeController.keysPressed.down = false;
        MazeController.keysPressed.left = false;
        MazeController.keysPressed.right = false;
    },

    handleAction() {
        // Action button - can be used for sprint, interact, etc.
        // For now, just log it
        console.log('[HorizontalControls] Action button pressed');
        // Future: could toggle sprint, interact with objects, etc.
    },

    destroy() {
        console.log('[HorizontalControls] Destroying...');

        // Destroy nipplejs joystick
        if (this.joystick) {
            this.joystick.destroy();
            this.joystick = null;
        }

        // Remove joystick container
        if (this.joystickContainer && this.joystickContainer.parentNode) {
            this.joystickContainer.parentNode.removeChild(this.joystickContainer);
            this.joystickContainer = null;
        }

        // Remove shoot button
        if (this.shootButton && this.shootButton.parentNode) {
            this.shootButton.parentNode.removeChild(this.shootButton);
            this.shootButton = null;
        }

        // Remove action button
        if (this.actionButton && this.actionButton.parentNode) {
            this.actionButton.parentNode.removeChild(this.actionButton);
            this.actionButton = null;
        }

        // Clear any held keys
        MazeController.keysPressed.up = false;
        MazeController.keysPressed.down = false;
        MazeController.keysPressed.left = false;
        MazeController.keysPressed.right = false;

        this.isActive = false;
        console.log('[HorizontalControls] Destroyed');
    }
};


// ============================================================================
// OBSTACLES
// ============================================================================

const obstacles = [];
const obstaclePool = [];
let barrierModelTemplate = null; // 3D model template for concrete barriers
let roadRollerTemplate = null; // 3D model template for road roller
let roadGraderTemplate = null; // 3D model template for road grader
let obstacleModels = []; // Array of all loaded obstacle models

class Obstacle {
    constructor() {
        const geometry = new THREE.BoxGeometry(1.5, 2, 1.5);
        const material = new THREE.MeshLambertMaterial({ color: 0x66bb6a });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.active = false;
        this.lane = 0;
        this.type = null; // 'barrier', 'roller', 'grader'
        this.canMoveHorizontally = false; // Whether obstacle can move left/right
        this.horizontalDirection = 0; // -1 for left, 1 for right, 0 for none
        this.horizontalSpeed = 2; // Speed of horizontal movement
    }

    // Replace placeholder mesh with 3D model
    replaceWithModel(modelTemplate, obstacleType) {
        if (!modelTemplate) return;

        const wasActive = this.active;
        const currentLane = this.lane;
        const currentZ = this.mesh.position.z;

        // Remove old placeholder mesh if it's in the scene
        if (this.active) {
            scene.remove(this.mesh);
        }

        // Clone the 3D model
        this.mesh = modelTemplate.clone();
        this.type = obstacleType;

        // Set movement based on type
        // Barriers: no horizontal movement
        // Vehicles: can move horizontally
        this.canMoveHorizontally = (obstacleType === 'roller' || obstacleType === 'grader');

        // Randomly choose horizontal direction for vehicles
        if (this.canMoveHorizontally) {
            this.horizontalDirection = Math.random() < 0.5 ? -1 : 1; // Random left or right
        } else {
            this.horizontalDirection = 0; // No horizontal movement for barriers
        }

        // Rotate horizontally (90 degrees on Y axis)
        this.mesh.rotation.y = Math.PI / 2;

        // Enable shadows on all children
        this.mesh.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        // Restore state if it was active
        if (wasActive) {
            this.lane = currentLane;
            this.active = true;
            this.mesh.position.x = LANE_POSITIONS[this.lane];
            this.mesh.position.y = 0; // On the ground
            this.mesh.position.z = currentZ;
            scene.add(this.mesh);
        }
    }

    activate(lane, zPosition, useRandomModel = true) {
        // ONLY assign a model if this obstacle doesn't have one yet (first time use)
        if (useRandomModel && obstacleModels.length > 0 && this.type === null) {
            // Only one model now - concrete barrier
            const randomModel = barrierModelTemplate;
            this.replaceWithModel(randomModel, 'barrier');
        }

        this.lane = lane;
        this.mesh.position.x = LANE_POSITIONS[lane];
        this.mesh.position.y = 0; // All models sit on ground
        this.mesh.position.z = zPosition;
        this.active = true;

        scene.add(this.mesh);
    }

    deactivate() {
        this.active = false;
        scene.remove(this.mesh);

        // Remove from obstacles array
        const index = obstacles.indexOf(this);
        if (index > -1) {
            obstacles.splice(index, 1);
        }
    }

    update(dt) {
        if (this.active) {
            // Barriers move with the road (same speed) - attached to road surface
            this.mesh.position.z += GameState.gameSpeed * dt;

            // Remove barriers that passed the camera
            if (this.mesh.position.z > 15) {
                this.deactivate();
            }
        }
    }
}

// ============================================================================
// PICKUPS
// ============================================================================

const pickups = [];
const pickupPool = [];
let pickupModelTemplate = null; // 3D model template for pickup items
let pickupsCollected = 0;

class Pickup {
    constructor() {
        // Create placeholder golden sphere
        const geometry = new THREE.SphereGeometry(0.5, 16, 16);
        const material = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            emissive: 0xffd700,
            emissiveIntensity: 0.3,
            metalness: 0.8,
            roughness: 0.2
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.active = false;
        this.lane = 0;
        this.rotationSpeed = 2; // Rotation speed for visual effect
    }

    replaceWithModel(modelTemplate) {
        if (!modelTemplate) return;

        const wasActive = this.active;
        const currentLane = this.lane;
        const currentZ = this.mesh.position.z;

        if (this.active) {
            scene.remove(this.mesh);
        }

        this.mesh = modelTemplate.clone();
        this.type = 'pickup';

        if (wasActive) {
            this.lane = currentLane;
            this.mesh.position.set(LANE_POSITIONS[this.lane], 0.6, currentZ);  // Raised to sit on ground
            scene.add(this.mesh);
        }
    }

    activate(lane, zPosition) {
        // Replace with cola can model if available and not already replaced
        if (pickupModelTemplate && this.mesh.geometry && this.mesh.geometry.type === 'SphereGeometry') {
            this.replaceWithModel(pickupModelTemplate);
        }

        this.active = true;
        this.lane = lane;
        this.mesh.position.set(LANE_POSITIONS[lane], 0.6, zPosition);  // Raised to sit on ground
        scene.add(this.mesh);
    }

    deactivate() {
        this.active = false;
        scene.remove(this.mesh);

        const index = pickups.indexOf(this);
        if (index > -1) {
            pickups.splice(index, 1);
        }
    }

    update(dt) {
        if (this.active) {
            // Hide pickups when player already has an item
            this.mesh.visible = !PlayerController.hasItem;

            // Move with the road
            this.mesh.position.z += GameState.gameSpeed * dt;

            // Rotate for visual effect
            this.mesh.rotation.y += this.rotationSpeed * dt;

            // Remove pickups that passed the camera
            if (this.mesh.position.z > 15) {
                this.deactivate();
            }
        }
    }
}

const PickupManager = {
    spawnTimer: 0,
    spawnInterval: 8.0, // Spawn pickups every 8 seconds

    init() {
        // Create pickup pool
        for (let i = 0; i < 15; i++) {
            pickupPool.push(new Pickup());
        }
        console.log('Pickup pool initialized:', pickupPool.length, 'pickups');
    },

    reset() {
        pickups.forEach(pickup => {
            scene.remove(pickup.mesh);
        });
        pickups.length = 0;
        this.spawnTimer = 0;
        pickupsCollected = 0;
    },

    spawn() {
        const pickup = pickupPool.find(p => !p.active);
        if (pickup) {
            const lane = Math.floor(Math.random() * 3);
            pickup.activate(lane, -50);
            pickups.push(pickup);
        }
    },

    update(dt) {
        this.spawnTimer += dt;

        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnTimer = 0;
            this.spawn();
        }

        // Update all active pickups
        pickups.forEach(pickup => pickup.update(dt));
    }
};

const ObstacleManager = {
    spawnTimer: 0,
    spawnInterval: 1.5,

    init() {
        // Create obstacle pool with placeholder meshes
        for (let i = 0; i < 20; i++) {
            obstaclePool.push(new Obstacle());
        }

        // Load 3D obstacle models
        this.loadObstacleModels();
    },

    loadObstacleModels() {
        console.log('Loading obstacle models...');

        const loader = stage1GLTFLoader;

        // Load concrete barrier
        loader.load(
            'concrete_road_barrier_photoscanned.glb',
            (gltf) => {
                barrierModelTemplate = gltf.scene;

                const box = new THREE.Box3().setFromObject(barrierModelTemplate);
                const size = box.getSize(new THREE.Vector3());

                // Scale to appropriate gameplay size
                const targetHeight = 1.2;
                const scale = targetHeight / size.y;
                barrierModelTemplate.scale.set(scale, scale, scale);

                obstacleModels.push(barrierModelTemplate);
                console.log('✅ Concrete barrier loaded');
                console.log('🎮 Obstacle ready! Only concrete barriers will spawn');
            },
            (xhr) => {
                if (xhr.lengthComputable) {
                    const percent = (xhr.loaded / xhr.total * 100).toFixed(2);
                    console.log('Barrier loading: ' + percent + '%');
                }
            },
            (error) => {
                console.error('❌ Error loading barrier:', error);
            }
        );
    },

    spawn() {
        const obstacle = obstaclePool.find(o => !o.active);
        if (obstacle) {
            const lane = Math.floor(Math.random() * 3);
            obstacle.activate(lane, -50);
            obstacles.push(obstacle);
        }
    },

    update(dt) {
        this.spawnTimer += dt;

        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnTimer = 0;
            this.spawn();
        }

        obstacles.forEach(obs => obs.update(dt));
    },

    reset() {
        obstacles.forEach(obs => obs.deactivate());
        obstacles.length = 0;
        this.spawnTimer = 0;
    }
};

// ============================================================================
// ENVIRONMENT (Road/Path)
// ============================================================================

const roadSegments = [];
let roadModels = []; // Array to hold 3D road model instances
let roadModelTemplate = null; // Loaded GLB template to clone
let roadSegmentLength = 20; // Will be calculated from road model bounding box

class RoadSegment {
    constructor(zPosition) {
        const geometry = new THREE.PlaneGeometry(15, 20);
        const material = new THREE.MeshLambertMaterial({
            color: 0x404040,
            side: THREE.DoubleSide
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.position.y = 0;
        this.mesh.position.z = zPosition;
        this.mesh.receiveShadow = true;
        scene.add(this.mesh);

        // Lane markers
        this.createLaneMarkers(zPosition);
    }

    createLaneMarkers(zPosition) {
        const markerGeometry = new THREE.BoxGeometry(0.2, 0.1, 2);
        const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

        // Left lane marker
        const leftMarker = new THREE.Mesh(markerGeometry, markerMaterial);
        leftMarker.position.set(-LANE_WIDTH / 2, 0.05, zPosition);
        scene.add(leftMarker);

        // Right lane marker
        const rightMarker = new THREE.Mesh(markerGeometry, markerMaterial);
        rightMarker.position.set(LANE_WIDTH / 2, 0.05, zPosition);
        scene.add(rightMarker);
    }

    update(dt) {
        this.mesh.position.z += GameState.gameSpeed * dt;

        if (this.mesh.position.z > 20) {
            this.mesh.position.z -= 60;
        }
    }
}

const EnvironmentManager = {
    init() {
        // Load 3D road model first
        this.loadRoadModel();

        // Load sky dome for immersive background
        this.loadSkyDome();

        // Set bright background for Level 1 (fallback if sky dome doesn't load)
        scene.background = new THREE.Color(0x87CEEB); // Sky blue

        // Add bright lights for daytime scene
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2); // Increased from 0.6
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // Increased from 0.8
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.left = -20;
        directionalLight.shadow.camera.right = 20;
        directionalLight.shadow.camera.top = 20;
        directionalLight.shadow.camera.bottom = -20;
        scene.add(directionalLight);

        // Light fog for depth (sky blue to match background)
        // DISABLED: Fog hides the sky dome
        // scene.fog = new THREE.Fog(0x87CEEB, 50, 150);
    },

    loadRoadModel() {
        console.log('Loading 3D road model...');

        const loader = stage1GLTFLoader;

        loader.load(
            'road_hd.glb',
            // onLoad
            (gltf) => {
                roadModelTemplate = gltf.scene;

                console.log('Road HD model loaded successfully');

                // Calculate bounding box to understand size
                const box = new THREE.Box3().setFromObject(roadModelTemplate);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());

                // Store the road segment length (Z-axis dimension)
                roadSegmentLength = size.z;

                console.log('Road model size:', {
                    x: size.x.toFixed(2),
                    y: size.y.toFixed(2),
                    z: size.z.toFixed(2)
                });
                console.log('Road segment length (Z):', roadSegmentLength.toFixed(2));
                console.log('Road model center:', {
                    x: center.x.toFixed(2),
                    y: center.y.toFixed(2),
                    z: center.z.toFixed(2)
                });

                // Create multiple road segments for seamless looping
                this.createRoadSegments();

                // Create collision walls on both sides of the road
                this.createRoadColliders(roadModelTemplate);
            },
            // onProgress
            (xhr) => {
                if (xhr.lengthComputable) {
                    const percent = (xhr.loaded / xhr.total * 100).toFixed(2);
                    console.log('Road loading: ' + percent + '%');
                }
            },
            // onError
            (error) => {
                console.error('Error loading road model:', error);
                // Fallback to simple road segments
                this.createFallbackRoad();
            }
        );
    },

    createRoadSegments() {
        // Calculate number of segments needed for seamless looping
        // View distance is ~60 units, add 2 extra segments for buffer
        const viewDistance = 60;
        const numSegments = Math.ceil(viewDistance / roadSegmentLength) + 2;

        console.log('Creating road segments:');
        console.log('  Segment length:', roadSegmentLength.toFixed(2));
        console.log('  View distance:', viewDistance);
        console.log('  Number of segments:', numSegments);

        for (let i = 0; i < numSegments; i++) {
            const roadClone = roadModelTemplate.clone();

            // Position segments using actual segment length
            roadClone.position.set(0, 0, -roadSegmentLength * i);

            // Enable shadows
            roadClone.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            scene.add(roadClone);
            roadModels.push(roadClone);
        }

        console.log('✅ Created', roadModels.length, 'road segments for seamless looping');
    },

    createFallbackRoad() {
        // Fallback to simple road if GLB fails to load
        console.log('Using fallback simple road');
        for (let i = 0; i < 3; i++) {
            roadSegments.push(new RoadSegment(-20 * i));
        }
    },

    createRoadColliders(roadModel) {
        console.log('=== CREATING ROAD COLLISION WALLS ===');

        // Get bounding box for road dimensions
        const box = new THREE.Box3().setFromObject(roadModel);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        console.log('Road bounds:', {
            center: { x: center.x.toFixed(2), y: center.y.toFixed(2), z: center.z.toFixed(2) },
            size: { x: size.x.toFixed(2), y: size.y.toFixed(2), z: size.z.toFixed(2) }
        });

        const wallThickness = 2;      // Thin walls
        const wallHeight = 10;        // Tall walls
        const roadLength = 100;       // Extended length for looping road

        // Position walls based on the road's visual edges
        // Lane system: LANE_POSITIONS = [-3, 0, 3] with LANE_WIDTH = 3
        // We want walls outside the playable lanes
        const roadHalfWidth = size.x / 2;

        // Place walls at the visual edges of the road
        const leftWallX = center.x - roadHalfWidth;    // Left edge
        const rightWallX = center.x + roadHalfWidth;   // Right edge

        console.log('Lane system: 3 lanes at X positions [-3, 0, 3]');
        console.log('Wall positions:');
        console.log('  Left wall X:', leftWallX.toFixed(2));
        console.log('  Right wall X:', rightWallX.toFixed(2));
        console.log('  Road visual width:', size.x.toFixed(2));
        console.log('  Playable area: X=-3 to X=+3 (6 units)');

        // Left wall - runs along the entire road length
        addCollider(
            leftWallX,             // X position (left edge)
            0,                     // Z position (center, will extend forward and back)
            wallThickness,         // Width of wall
            roadLength,            // Depth (extends along road)
            wallHeight,            // Height
            'Road Left Wall'
        );

        // Right wall - runs along the entire road length
        addCollider(
            rightWallX,            // X position (right edge)
            0,                     // Z position (center, will extend forward and back)
            wallThickness,         // Width of wall
            roadLength,            // Depth (extends along road)
            wallHeight,            // Height
            'Road Right Wall'
        );

        console.log('✅ Road collision walls created - player confined to road');

        // Hide collision boxes by default
        toggleCollisionDebug(false);
    },

    update(dt) {
        // Update 3D road models with seamless looping
        const loopDistance = roadSegmentLength * roadModels.length;
        const roadSpeed = GameState.gameSpeed; // Road moves at constant speed synchronized with barriers

        roadModels.forEach(roadModel => {
            // Move road toward camera (player running forward)
            roadModel.position.z += roadSpeed * dt;

            // Seamless loop: when segment passes camera, move it to the back
            if (roadModel.position.z > roadSegmentLength) {
                roadModel.position.z -= loopDistance;
            }
        });

        // Update fallback road segments if they exist
        roadSegments.forEach(segment => segment.update(dt));
    },

    loadSkyDome() {
        if (!SKY_DOME_CONFIG.enabled) {
            console.log('Sky dome disabled in config');
            return;
        }

        console.log('🌤️ Starting sky dome load...');
        console.log('   File: sky_dome_demo.glb');
        console.log('   Scale:', SKY_DOME_CONFIG.scale);

        const loader = new GLTFLoader();
        loader.load(
            'sky_dome_demo.glb',
            // onLoad
            (gltf) => {
                console.log('✅ Sky dome GLB loaded successfully!');
                skyDome = gltf.scene;

                // Get dome info
                const box = new THREE.Box3().setFromObject(skyDome);
                const size = box.getSize(new THREE.Vector3());
                console.log('   Original size:', size.x.toFixed(2), 'x', size.y.toFixed(2), 'x', size.z.toFixed(2));

                // Scale the dome to encompass the entire scene
                skyDome.scale.setScalar(SKY_DOME_CONFIG.scale);
                console.log('   Scaled to:', SKY_DOME_CONFIG.scale);

                // Position at origin
                skyDome.position.set(0, 0, 0);

                // Count meshes
                let meshCount = 0;

                // Configure materials for visibility
                skyDome.traverse((child) => {
                    if (child.isMesh) {
                        meshCount++;

                        console.log(`   Processing mesh "${child.name}":`, {
                            hasMaterial: !!child.material,
                            isArray: Array.isArray(child.material),
                            materialCount: Array.isArray(child.material) ? child.material.length : 1
                        });

                         // FIX BLURRINESS: Improve texture quality with best filtering settings
                        const applyTextureEnhancements = (texture) => {
                            if (!texture) return;

                            // Enable maximum anisotropic filtering (reduces blur at angles)
                            texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

                            // Use BEST texture filtering for sharpness
                            texture.minFilter = THREE.LinearMipMapLinearFilter;
                            texture.magFilter = THREE.LinearFilter;

                            // Generate mipmaps for better quality at different distances
                            texture.generateMipmaps = true;

                            // Ensure texture wraps properly (no edge artifacts)
                            texture.wrapS = THREE.RepeatWrapping;
                            texture.wrapT = THREE.RepeatWrapping;

                            // Force texture update
                            texture.needsUpdate = true;
                        };

                        // Handle both single materials and material arrays (for multi-material meshes)
                        const materials = Array.isArray(child.material) ? child.material : [child.material];

                        materials.forEach((mat, index) => {
                            // Clone material to avoid affecting original
                            const clonedMaterial = mat.clone();

                            // CRITICAL: Use DoubleSide for maximum visibility (both inside and outside)
                            clonedMaterial.side = THREE.DoubleSide;

                            // Ensure material is visible
                            clonedMaterial.visible = true;
                            clonedMaterial.transparent = false;
                            clonedMaterial.opacity = 1.0;

                            // For emissive materials (self-glowing), boost emission
                            if (clonedMaterial.emissive) {
                                clonedMaterial.emissive.setHex(0xffffff);
                                clonedMaterial.emissiveIntensity = 2.0;
                            }

                            // Apply texture enhancements to ALL texture maps
                            ['emissiveMap', 'map', 'normalMap', 'roughnessMap', 'metalnessMap', 'alphaMap', 'aoMap'].forEach(mapName => {
                                if (clonedMaterial[mapName]) {
                                    applyTextureEnhancements(clonedMaterial[mapName]);
                                    console.log(`     Enhanced ${mapName} on material ${index}`);
                                }
                            });

                            // Enable depth test but disable depth write (render behind everything)
                            clonedMaterial.depthTest = true;
                            clonedMaterial.depthWrite = false;

                            // Force material update
                            clonedMaterial.needsUpdate = true;

                            // Assign back to mesh
                            if (Array.isArray(child.material)) {
                                child.material[index] = clonedMaterial;
                            } else {
                                child.material = clonedMaterial;
                            }
                        });

                        // Render first (behind everything)
                        child.renderOrder = -999;

                        // No shadows on sky
                        child.receiveShadow = false;
                        child.castShadow = false;

                        // Make sure mesh is visible
                        child.visible = true;

                        const firstMat = Array.isArray(child.material) ? child.material[0] : child.material;
                        console.log('   Configured mesh:', child.name || 'unnamed');
                        console.log('     Material count:', materials.length);
                        console.log('     Material type:', firstMat.type);
                        console.log('     Emissive:', firstMat.emissive ? firstMat.emissive.getHexString() : 'none');
                        console.log('     Has emissiveMap:', !!firstMat.emissiveMap);
                    }
                });

                console.log('   Total meshes:', meshCount);

                // Make sure sky dome itself is visible
                skyDome.visible = true;

                // Add to scene
                scene.add(skyDome);

                // Expose to window for debugging
                window.skyDome = skyDome;

                console.log('✅ Sky dome added to scene!');
                console.log('   Position:', skyDome.position.x, skyDome.position.y, skyDome.position.z);
                console.log('   Scale:', skyDome.scale.x);
                console.log('   Visible:', skyDome.visible);
                console.log('   In scene:', scene.children.includes(skyDome));
                console.log('💡 Access via window.skyDome in console');

                // Track loading progress
                loadingProgress.skyDome = true;
                loadingProgress.update();
            },
            // onProgress
            (xhr) => {
                if (xhr.lengthComputable) {
                    const percent = (xhr.loaded / xhr.total * 100).toFixed(2);
                    console.log('   Loading sky dome: ' + percent + '%');
                }
            },
            // onError
            (error) => {
                console.error('❌ Error loading sky dome:', error);
                console.error('   Path: sky_dome_demo.glb');
                console.log('   Falling back to solid color background');

                // Still mark as loaded to not block progress
                loadingProgress.skyDome = true;
                loadingProgress.update();
            }
        );
    }
};

// ============================================================================
// CHARACTER LOADING
// ============================================================================

// Check if Stage 1 assets are loaded and start game if ready
function checkStage1AssetsLoaded() {
    // CRITICAL FIX: Check ALL assets are loaded, not just models
    const allAssetsLoaded = loadingProgress.playerModel &&
                           loadingProgress.enemyModel &&
                           loadingProgress.colaCanModel &&
                           loadingProgress.skyDome &&
                           loadingProgress.playerJumpAnim &&
                           loadingProgress.playerPickupAnim &&
                           loadingProgress.playerThrowAnim &&
                           loadingProgress.playerHoldingAnim &&
                           loadingProgress.enemyLookBehindAnim &&
                           loadingProgress.enemyDeathAnim &&
                           loadingProgress.enemyJumpAnim;

    if (allAssetsLoaded && GameState.selectedLevel === 'chase' && !GameState.isRunning) {
        console.log('✅ ALL Stage 1 assets loaded (11/11), starting game');
        GameState.isRunning = true;
        UI.updateUI();

        // Expose game objects to window for testing/debugging
        // Use getters for variables that change at runtime
        Object.defineProperty(window, 'playerModel', { get: () => playerModel });
        Object.defineProperty(window, 'enemyModel', { get: () => enemyModel });
        Object.defineProperty(window, 'colaCanTemplate', { get: () => colaCanTemplate });
        Object.defineProperty(window, 'heldCanModel', { get: () => heldCanModel });
        window.PlayerController = PlayerController;
        window.pickups = pickups;
        window.obstacles = obstacles;
        window.GameState = GameState;
        Object.defineProperty(window, 'camera', { get: () => camera });
        Object.defineProperty(window, 'scene', { get: () => scene });
        console.log('🔧 Game objects exposed to window for testing (with getters for dynamic values)');

        // If in preload mode, notify parent window
        const urlParams = new URLSearchParams(window.location.search);
        const isPreloading = urlParams.get('preload') === 'true';
        if (isPreloading && window.parent) {
            console.log('📡 Sending GAME_FULLY_LOADED message to parent (all 11 assets verified)');
            window.parent.postMessage({ type: 'GAME_FULLY_LOADED' }, '*');
        } else {
            // Normal game start - enable pickups after 2 seconds
            setTimeout(() => {
                pickupsEnabled = true;
            }, 2000);

            // Start music after a brief delay to ensure everything is ready
            setTimeout(() => {
                MusicController.playLevel1Music();
            }, 100);
        }
    }
}

function loadPlayerCharacter() {
    const loader = stage1FBXLoader;

    // Load main running animation
    loader.load('jammer_run.fbx', (fbx) => {
        playerModel = fbx;
        playerModel.scale.set(0.01, 0.01, 0.01);
        playerModel.position.set(0, 1.0, 0);
        playerModel.rotation.y = Math.PI;

        playerModel.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        scene.add(playerModel);

        playerMixer = new THREE.AnimationMixer(playerModel);

        if (fbx.animations && fbx.animations.length > 0) {
            const clip = normalizeAndCleanAnimation(fbx.animations[0], 'PLAYER RUN');
            playerAnimations.run = playerMixer.clipAction(clip);
            playerAnimations.run.setLoop(THREE.LoopRepeat, Infinity);
            playerAnimations.run.timeScale = 1.0;
            playerAnimations.run.play();
            currentPlayerAnimation = 'run';
        }

        console.log('Player character loaded');

        // Track loading progress
        loadingProgress.playerModel = true;
        loadingProgress.update();

        // Load jump, pickup, holding, and throw animations
        loadPlayerJumpAnimation();
        loadPlayerPickupAnimation();
        loadPlayerHoldingRunAnimation();
        loadPlayerThrowAnimation();

        // Check if both characters are loaded to start game
        checkStage1AssetsLoaded();
    }, undefined, (error) => {
        console.error('Error loading player FBX:', error);
        createFallbackPlayer();
        // Still check in case enemy is loaded
        checkStage1AssetsLoaded();
    });
}


// CRITICAL FIX: Single animation finished handler to prevent listener accumulation
// This handler is set up ONCE and routes to the correct finish method
function setupPlayerAnimationFinishedHandler() {
    // Remove any existing listener first (cleanup)
    if (window._playerAnimationFinishedHandler) {
        playerMixer.removeEventListener('finished', window._playerAnimationFinishedHandler);
    }

    // Create named handler function
    window._playerAnimationFinishedHandler = (e) => {
        if (e.action === playerAnimations.jump) {
            PlayerController.finishJump();
        } else if (e.action === playerAnimations.pickup) {
            PlayerController.finishPickup();
        } else if (e.action === playerAnimations.throw) {
            PlayerController.finishThrow();
        }
    };

    // Add listener once
    playerMixer.addEventListener('finished', window._playerAnimationFinishedHandler);
    console.log('✅ Player animation finished handler registered (single listener)');
}

function loadPlayerJumpAnimation() {
    const loader = stage1FBXLoader;

    loader.load('jammer_jump.fbx', (fbx) => {
        if (fbx.animations && fbx.animations.length > 0) {
            const clip = normalizeAndCleanAnimation(fbx.animations[0], 'PLAYER JUMP');

            playerAnimations.jump = playerMixer.clipAction(clip);
            playerAnimations.jump.setLoop(THREE.LoopOnce);
            playerAnimations.jump.clampWhenFinished = true;

            // Ensure handler is set up (idempotent - safe to call multiple times)
            setupPlayerAnimationFinishedHandler();

            console.log('Jump animation loaded');

            // Track loading progress
            loadingProgress.playerJumpAnim = true;
            loadingProgress.update();
            checkStage1AssetsLoaded();
        }
    }, undefined, (error) => {
        console.warn('Jump animation not loaded:', error);
    });
}

function loadPlayerPickupAnimation() {
    const loader = stage1FBXLoader;

    loader.load('jammer_pickup.fbx', (fbx) => {
        if (fbx.animations && fbx.animations.length > 0) {
            const clip = normalizeAndCleanAnimation(fbx.animations[0], 'PLAYER PICKUP');

            playerAnimations.pickup = playerMixer.clipAction(clip);
            playerAnimations.pickup.setLoop(THREE.LoopOnce);
            playerAnimations.pickup.clampWhenFinished = true;

            // Ensure handler is set up (idempotent - safe to call multiple times)
            setupPlayerAnimationFinishedHandler();

            console.log('Pickup animation loaded');

            // Track loading progress
            loadingProgress.playerPickupAnim = true;
            loadingProgress.update();
            checkStage1AssetsLoaded();
        }
    }, undefined, (error) => {
        console.warn('Pickup animation not loaded:', error);
    });
}

function loadPlayerHoldingRunAnimation() {
    const loader = stage1FBXLoader;

    loader.load('jammer_run_holding.fbx', (fbx) => {
        if (fbx.animations && fbx.animations.length > 0) {
            const clip = normalizeAndCleanAnimation(fbx.animations[0], 'PLAYER RUN HOLDING');

            playerAnimations.runHolding = playerMixer.clipAction(clip);
            playerAnimations.runHolding.setLoop(THREE.LoopRepeat, Infinity);
            playerAnimations.runHolding.timeScale = 1.0;

            console.log('Run holding animation loaded');

            // Track loading progress
            loadingProgress.playerHoldingAnim = true;
            loadingProgress.update();
            checkStage1AssetsLoaded();
        }
    }, undefined, (error) => {
        console.warn('Run holding animation not loaded:', error);
    });
}

function loadPlayerThrowAnimation() {
    const loader = stage1FBXLoader;

    loader.load('jammer_throw.fbx', (fbx) => {
        if (fbx.animations && fbx.animations.length > 0) {
            const clip = normalizeAndCleanAnimation(fbx.animations[0], 'PLAYER THROW');

            playerAnimations.throw = playerMixer.clipAction(clip);
            playerAnimations.throw.setLoop(THREE.LoopOnce);
            playerAnimations.throw.clampWhenFinished = true;

            // Ensure handler is set up (idempotent - safe to call multiple times)
            setupPlayerAnimationFinishedHandler();

            console.log('Throw animation loaded');

            // Track loading progress
            loadingProgress.playerThrowAnim = true;
            loadingProgress.update();
            checkStage1AssetsLoaded();
        }
    }, undefined, (error) => {
        console.warn('Throw animation not loaded:', error);
    });
}

function normalizeAndCleanAnimation(clip, debugName) {
    console.log(`=== ${debugName} Animation Debug Info ===`);
    console.log('Clip duration:', clip.duration);
    console.log('Number of tracks:', clip.tracks.length);

    // Normalize track times
    let minTime = Infinity;
    clip.tracks.forEach(track => {
        const trackMinTime = track.times[0];
        if (trackMinTime < minTime) {
            minTime = trackMinTime;
        }
    });

    if (minTime > 0.001) {
        console.log(`${debugName}: Normalizing animation - removing offset of:`, minTime);
        clip.tracks.forEach(track => {
            for (let i = 0; i < track.times.length; i++) {
                track.times[i] -= minTime;
            }
        });
        clip.duration = clip.tracks.reduce((max, track) => {
            return Math.max(max, track.times[track.times.length - 1]);
        }, 0);
        console.log(`${debugName}: New duration after normalization:`, clip.duration);
    }

    // Remove Hips position track
    const originalTrackCount = clip.tracks.length;
    clip.tracks = clip.tracks.filter(track => {
        if (track.name === 'mixamorigHips.position') {
            console.log(`${debugName}: ❌ Removing:`, track.name);
            return false;
        }
        return true;
    });
    console.log(`${debugName}: Removed ${originalTrackCount - clip.tracks.length} track(s), kept ${clip.tracks.length}`);

    return clip;
}

function createFallbackPlayer() {
    const geometry = new THREE.BoxGeometry(1, 2, 1);
    const material = new THREE.MeshLambertMaterial({ color: 0x4fc3f7 });
    playerModel = new THREE.Mesh(geometry, material);
    playerModel.position.set(0, 1.0, 0);
    playerModel.castShadow = true;
    scene.add(playerModel);
    // Check if both characters are loaded to start game
    checkStage1AssetsLoaded();
}

function loadEnemyCharacter() {
    const loader = stage1FBXLoader;

    loader.load('Fast Run-3.fbx', (fbx) => {
        enemyModel = fbx;
        enemyModel.scale.set(0.01, 0.01, 0.01);
        enemyModel.position.set(0, 1.0, -15); // Lifted up by 1 unit so feet are on ground
        enemyModel.rotation.y = Math.PI;

        enemyModel.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                // Keep original material with textures
            }
        });

        scene.add(enemyModel);

        // Setup animation mixer
        enemyMixer = new THREE.AnimationMixer(enemyModel);

        // Load run animation from the main FBX
        if (fbx.animations && fbx.animations.length > 0) {
            const runClip = normalizeAndCleanAnimation(fbx.animations[0], 'ENEMY RUN');
            enemyAnimations.run = enemyMixer.clipAction(runClip);
            enemyAnimations.run.setLoop(THREE.LoopRepeat, Infinity);
            enemyAnimations.run.clampWhenFinished = false;
            enemyAnimations.run.timeScale = 1.0;
            enemyAnimations.run.reset();
            enemyAnimations.run.play();
            console.log('ENEMY: Run animation loaded, duration:', runClip.duration);
        }

        // Load look-behind animation from separate file
        loader.load('Look Behind Run.fbx', (lookBehindFbx) => {
            if (lookBehindFbx.animations && lookBehindFbx.animations.length > 0) {
                const lookBehindClip = normalizeAndCleanAnimation(lookBehindFbx.animations[0], 'ENEMY LOOK BEHIND');
                enemyAnimations.lookBehind = enemyMixer.clipAction(lookBehindClip);
                enemyAnimations.lookBehind.setLoop(THREE.LoopRepeat, Infinity);
                enemyAnimations.lookBehind.clampWhenFinished = false;
                enemyAnimations.lookBehind.timeScale = 1.0;
                console.log('ENEMY: Look-behind animation loaded, duration:', lookBehindClip.duration);

                // Track loading progress
                loadingProgress.enemyLookBehindAnim = true;
                loadingProgress.update();
                checkStage1AssetsLoaded();
            }
        }, undefined, (error) => {
            console.warn('⚠️ Error loading look-behind animation:', error);
        });

        // Load death/hit animation from separate file
        loader.load('Death.fbx', (deathFbx) => {
            if (deathFbx.animations && deathFbx.animations.length > 0) {
                const deathClip = normalizeAndCleanAnimation(deathFbx.animations[0], 'ENEMY DEATH');
                enemyAnimations.death = enemyMixer.clipAction(deathClip);
                enemyAnimations.death.setLoop(THREE.LoopOnce, 1); // Play once
                enemyAnimations.death.clampWhenFinished = true; // Hold on last frame
                enemyAnimations.death.timeScale = 1.0;
                console.log('ENEMY: Death/Hit animation loaded, duration:', deathClip.duration);

                // Track loading progress
                loadingProgress.enemyDeathAnim = true;
                loadingProgress.update();
                checkStage1AssetsLoaded();
            }
        }, undefined, (error) => {
            console.warn('⚠️ Error loading death animation:', error);
        });

        // Load jump animation for obstacle avoidance
        loader.load('Jumping.fbx', (jumpFbx) => {
            if (jumpFbx.animations && jumpFbx.animations.length > 0) {
                const jumpClip = normalizeAndCleanAnimation(jumpFbx.animations[0], 'ENEMY JUMP');
                enemyAnimations.jump = enemyMixer.clipAction(jumpClip);
                enemyAnimations.jump.setLoop(THREE.LoopOnce, 1); // Play once per jump
                enemyAnimations.jump.clampWhenFinished = false; // Don't hold on last frame
                enemyAnimations.jump.timeScale = 1.0;
                console.log('ENEMY: Jump animation loaded, duration:', jumpClip.duration);

                // Track loading progress
                loadingProgress.enemyJumpAnim = true;
                loadingProgress.update();
                checkStage1AssetsLoaded();
            }
        }, undefined, (error) => {
            console.warn('⚠️ Error loading jump animation:', error);
        });

        console.log('Enemy character loaded');

        // Track loading progress
        loadingProgress.enemyModel = true;
        loadingProgress.update();

        // Check if both characters are loaded to start game
        checkStage1AssetsLoaded();
    }, undefined, (error) => {
        console.error('Error loading enemy FBX:', error);
        // Fallback to simple cube
        createFallbackEnemy();
        // Still check in case player is loaded
        checkStage1AssetsLoaded();
    });
}

function createFallbackEnemy() {
    const geometry = new THREE.BoxGeometry(1, 2, 1);
    const material = new THREE.MeshLambertMaterial({ color: 0xef5350 });
    enemyModel = new THREE.Mesh(geometry, material);
    enemyModel.position.set(0, 1.0, -15);
    enemyModel.castShadow = true;
    scene.add(enemyModel);
    // Check if both characters are loaded to start game
    checkStage1AssetsLoaded();
}

function loadColaCanModel() {
    const loader = stage1GLTFLoader;

    loader.load('simple_cola_can.glb', (gltf) => {
        colaCanTemplate = gltf.scene;
        colaCanTemplate.scale.set(1.5, 1.5, 1.5); // Scale up the can

        // Enable shadows on the can
        colaCanTemplate.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        // Also use cola can for pickup items on the ground
        pickupModelTemplate = colaCanTemplate.clone();
        pickupModelTemplate.scale.set(0.4, 0.4, 0.4); // Smaller size for pickups on ground

        // Replace existing pickups with cola can model
        pickups.forEach(pickup => {
            pickup.replaceWithModel(pickupModelTemplate);
        });

        console.log('Cola can model loaded for throws and pickups');

        // Track loading progress
        loadingProgress.colaCanModel = true;
        loadingProgress.update();
    }, undefined, (error) => {
        console.warn('⚠️ Error loading cola can model:', error);
        // If can fails to load, thrown item will fall back to sphere
        // Still mark as loaded to not block progress
        loadingProgress.colaCanModel = true;
        loadingProgress.update();
    });
}

// ============================================================================
// SHOOTING GAME - OFFICER CHARACTER
// ============================================================================

// Officer animation actions
let officerActions = {
    idle: null,
    run: null,
    shoot: null,
    current: null
};

// Submachine gun model
let subMachineGun = null;
let muzzleFlash = null; // Yellow flash at gun tip
let smokeParticles = []; // Smoke particles from gun
let bulletCasings = []; // Shell casings on ground
let flashColorToggle = true; // Alternate between yellow and white

// Gun rotation controls for dashboard
// Settings for different facing directions
const GunConfigs = {
    // Officer facing RIGHT (positive X direction, 90°)
    right: {
        rotationX: -10 * Math.PI / 180,  // -10°
        rotationY: 180 * Math.PI / 180,   // 180°
        rotationZ: 85 * Math.PI / 180,    // 85°
        positionX: -15.0,
        positionY: 31.5,
        positionZ: 1.0,
        scale: 0.25,
    },
    // Officer facing LEFT (negative X direction, 270°/-90°)
    left: {
        rotationX: -10 * Math.PI / 180,  // -10°
        rotationY: 180 * Math.PI / 180,   // 180°
        rotationZ: 85 * Math.PI / 180,    // 85°
        positionX: -15.0,
        positionY: 31.5,
        positionZ: 1.0,
        scale: 0.25,
    },
    // Officer facing FORWARD/UP (negative Z direction, 0°)
    forward: {
        rotationX: -10 * Math.PI / 180,  // -10°
        rotationY: 180 * Math.PI / 180,   // 180°
        rotationZ: 85 * Math.PI / 180,    // 85°
        positionX: -15.0,
        positionY: 31.5,
        positionZ: 1.0,
        scale: 0.25,
    },
    // Officer facing BACKWARD/DOWN (positive Z direction, 180°)
    backward: {
        rotationX: -10 * Math.PI / 180,  // -10°
        rotationY: 180 * Math.PI / 180,   // 180°
        rotationZ: 85 * Math.PI / 180,    // 85°
        positionX: -15.0,
        positionY: 31.5,
        positionZ: 1.0,
        scale: 0.25,
    }
};

const GunControls = {
    rotationX: -10 * Math.PI / 180,  // -10°
    rotationY: 180 * Math.PI / 180,   // 180°
    rotationZ: 85 * Math.PI / 180,    // 85°
    positionX: -15.0,
    positionY: 31.5,
    positionZ: 1.0,
    scale: 0.25,
    currentDirection: 'right',  // Track current direction

    updateForDirection(direction) {
        // Update gun settings based on officer's facing direction
        if (direction !== this.currentDirection) {
            const config = GunConfigs[direction];
            if (config) {
                this.rotationX = config.rotationX;
                this.rotationY = config.rotationY;
                this.rotationZ = config.rotationZ;
                this.positionX = config.positionX;
                this.positionY = config.positionY;
                this.positionZ = config.positionZ;
                this.scale = config.scale;
                this.currentDirection = direction;
                console.log('Gun config switched to:', direction);
            }
        }
    },

    applyRotation() {
        if (subMachineGun) {
            subMachineGun.rotation.set(this.rotationX, this.rotationY, this.rotationZ);
            subMachineGun.position.set(this.positionX, this.positionY, this.positionZ);
            subMachineGun.scale.set(this.scale, this.scale, this.scale);
        }
    },

    reset() {
        this.rotationX = -10 * Math.PI / 180;  // -10°
        this.rotationY = 180 * Math.PI / 180;   // 180°
        this.rotationZ = 85 * Math.PI / 180;    // 85°
        this.positionX = -15.0;
        this.positionY = 31.5;
        this.positionZ = 1.0;
        this.scale = 0.25;
        this.applyRotation();
    }
};

function loadSubMachineGun() {
    if (!shooterModel) {
        console.error('Cannot load gun: officer model not loaded yet');
        return;
    }

    const loader = stage2GLTFLoader;

    console.log('Loading M4A1 rifle...');

    loader.load(
        'm4a1/scene.gltf',
        // onLoad
        (gltf) => {
            console.log('M4A1 loaded successfully');

            subMachineGun = gltf.scene;

            // Scale the gun much smaller to match officer hands
            subMachineGun.scale.set(0.15, 0.15, 0.15);

            // Enable shadows on all meshes
            subMachineGun.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            // Find the right hand bone
            let rightHand = null;
            shooterModel.traverse((child) => {
                if (child.isBone && child.name === 'mixamorigRightHand') {
                    rightHand = child;
                    console.log('Found right hand bone:', child.name);
                }
            });

            if (rightHand) {
                // Attach gun to right hand bone
                rightHand.add(subMachineGun);

                // Position and rotation - these values worked before
                subMachineGun.position.set(0, -2, -5);
                subMachineGun.rotation.set(-Math.PI / 2, 0, 0);

                console.log('M4A1 attached to right hand');
            } else {
                console.warn('Right hand bone not found, adding gun to officer model');
                shooterModel.add(subMachineGun);
                subMachineGun.position.set(0.5, 1.2, 0);
            }

            // Create muzzle flash - bright sphere at gun barrel tip
            const flashGeometry = new THREE.SphereGeometry(3, 12, 12);
            const flashMaterial = new THREE.MeshBasicMaterial({
                color: 0xffff00, // Bright yellow (will alternate with white)
                transparent: true,
                opacity: 1.0
            });
            muzzleFlash = new THREE.Mesh(flashGeometry, flashMaterial);

            // Position at gun barrel tip (nozzle)
            muzzleFlash.position.set(0, 0, -40); // Forward along gun barrel at nozzle

            // Add bright point light for glow effect
            const flashLight = new THREE.PointLight(0xffff00, 5, 80);
            muzzleFlash.add(flashLight);

            // Attach to gun
            subMachineGun.add(muzzleFlash);

            // Start invisible
            muzzleFlash.visible = false;

            console.log('Muzzle flash created at barrel tip');

        },
        // onProgress
        (xhr) => {
            if (xhr.lengthComputable) {
                const percent = (xhr.loaded / xhr.total * 100).toFixed(2);
                console.log('M4A1 loading: ' + percent + '%');
            }
        },
        // onError
        (error) => {
            console.error('Error loading M4A1:', error);
        }
    );
}

function loadOfficerCharacter() {
    const loader = stage2FBXLoader;

    console.log('Loading Officer character for Maze mode...');

    // Load the Officer model first
    loader.load('Officer.fbx', (fbx) => {
        shooterModel = fbx;
        shooterModel.scale.set(0.01, 0.01, 0.01);
        // Position will be set after tunnel loads - use temp position for now
        shooterModel.position.set(0, 1.0, 0);
        shooterModel.rotation.y = Math.PI; // Face forward down the tunnel (toward positive Z)

        console.log('Officer loaded at position:', shooterModel.position.x, shooterModel.position.z);

        // Keep original textures
        shooterModel.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        scene.add(shooterModel);

        // Expose shooterModel to window for debugging/testing
        window.shooterModel = shooterModel;

        // RALPH FIX: If tunnel already loaded, position officer inside it now
        if (urbanEnvironment) {
            console.log('Officer loaded AFTER tunnel - positioning now...');

            // Use configured starting position
            const startPos = LEVEL_CONFIG.ANIMATION_TESTING_START;

            shooterModel.position.set(startPos.x, startPos.y, startPos.z);
            shooterModel.rotation.y = startPos.rotation;

            camera.position.set(startPos.x, startPos.y + 3, startPos.z - 8);
            camera.lookAt(startPos.x, startPos.y + 0.5, startPos.z + 10);

            console.log('Officer positioned at STARTING POINT:', startPos.description);
            console.log('Position - X=' + startPos.x.toFixed(2) + ', Y=' + startPos.y.toFixed(2) + ', Z=' + startPos.z.toFixed(2));
        } else {
            console.log('Officer loaded BEFORE tunnel - will be positioned when tunnel loads');
        }

        // Load submachine gun and attach to hand
        loadSubMachineGun();

        // Setup animation mixer
        shooterMixer = new THREE.AnimationMixer(shooterModel);

        // Load multiple animations
        let animationsLoaded = 0;
        const totalAnimations = 3; // run, idle, shoot

        function checkAllAnimationsLoaded() {
            animationsLoaded++;
            if (animationsLoaded === totalAnimations) {
                // CRITICAL: Set flag that animations are ready
                window.animationsReady = true;

                // Start with idle animation
                if (officerActions.idle) {
                    officerActions.idle.play();
                    officerActions.current = 'idle';
                }

                // Initialize maze controller
                MazeController.init();
                console.log('✅ Officer ready with animations! All 3 loaded.');
            }
        }

        // Load Rifle Run animation
        loader.load('Rifle Run.fbx', (animFbx) => {
            if (animFbx.animations && animFbx.animations.length > 0) {
                const clip = animFbx.animations[0];

                console.log('=== OFFICER RUN Animation ===');
                console.log('Duration:', clip.duration);

                // Remove position track
                clip.tracks = clip.tracks.filter(track => track.name !== 'mixamorigHips.position');

                // Create action
                officerActions.run = shooterMixer.clipAction(clip);
                officerActions.run.setLoop(THREE.LoopRepeat, Infinity);
                // Initialize with weight 0 (inactive until needed)
                officerActions.run.setEffectiveWeight(0);
                officerActions.run.setEffectiveTimeScale(1);

                console.log('✅ Run animation loaded and initialized:', {
                    clip: clip.name,
                    duration: clip.duration,
                    weight: officerActions.run.getEffectiveWeight(),
                    timeScale: officerActions.run.getEffectiveTimeScale()
                });
            }
            checkAllAnimationsLoaded();
        }, undefined, (error) => {
            console.error('Error loading Rifle Run:', error);
            checkAllAnimationsLoaded();
        });

        // Load Rifle Idle animation
        loader.load('Rifle Idle.fbx', (animFbx) => {
            if (animFbx.animations && animFbx.animations.length > 0) {
                const clip = animFbx.animations[0];

                console.log('=== OFFICER IDLE Animation ===');
                console.log('Duration:', clip.duration);

                // Remove position track
                clip.tracks = clip.tracks.filter(track => track.name !== 'mixamorigHips.position');

                // Create action
                officerActions.idle = shooterMixer.clipAction(clip);
                officerActions.idle.setLoop(THREE.LoopRepeat, Infinity);
                // Idle starts active, others start inactive
                officerActions.idle.setEffectiveWeight(1);
                officerActions.idle.setEffectiveTimeScale(1);

                console.log('Idle animation loaded');
            }
            checkAllAnimationsLoaded();
        }, undefined, (error) => {
            console.error('Error loading Rifle Idle:', error);
            checkAllAnimationsLoaded();
        });

        // Load Shooting animation
        loader.load('Firing Rifle.fbx', (animFbx) => {
            if (animFbx.animations && animFbx.animations.length > 0) {
                const clip = animFbx.animations[0];

                console.log('=== OFFICER SHOOT Animation ===');
                console.log('Duration:', clip.duration);

                // Remove position track
                clip.tracks = clip.tracks.filter(track => track.name !== 'mixamorigHips.position');

                // Create action
                officerActions.shoot = shooterMixer.clipAction(clip);
                officerActions.shoot.setLoop(THREE.LoopOnce, 1);
                officerActions.shoot.clampWhenFinished = true;
                // Initialize inactive
                officerActions.shoot.setEffectiveWeight(0);
                officerActions.shoot.setEffectiveTimeScale(1);

                console.log('Shoot animation loaded');
            }
            checkAllAnimationsLoaded();
        }, undefined, (error) => {
            console.error('Error loading Firing Rifle:', error);
            checkAllAnimationsLoaded();
        });

    }, undefined, (error) => {
        console.error('Error loading Officer model:', error);

        // Create a fallback character
        const geometry = new THREE.CapsuleGeometry(0.4, 1.2, 8, 16);
        const material = new THREE.MeshLambertMaterial({ color: 0x2196f3 });
        shooterModel = new THREE.Mesh(geometry, material);
        shooterModel.position.set(TILE_SIZE * 1.5, 1.0, TILE_SIZE * 1.5);
        shooterModel.castShadow = true;
        scene.add(shooterModel);

        // Initialize maze controller with fallback
        MazeController.init();

        console.log('Created fallback character (Officer load failed)');
    });
}

// ============================================================================
// MAZE BUILDING
// ============================================================================

function buildTestingGround() {
    console.log('Building testing ground...');

    // Clear any existing elements
    mazeWalls.forEach(wall => scene.remove(wall));
    mazeWalls = [];
    if (exitMarker) scene.remove(exitMarker);

    // Skip creating test floor - tunnel environment has its own floor
    console.log('Skipping test floor - using tunnel road surface');

    // Load urban environment
    loadUrbanEnvironment();
}

// ============================================================================
// URBAN ENVIRONMENT LOADING
// ============================================================================

function setupUrbanLighting() {
    console.log('Setting up tunnel lighting...');

    // PITCH BLACK - Makes outside of tunnel invisible
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 100, 400); // Black fog - increased to see entire tunnel (was 10, 50)

    // BRIGHT DAYLIGHT LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffacd, 2.0);
    sunLight.position.set(50, 100, 50);
    sunLight.castShadow = true;
    sunLight.shadow.camera.left = -200;
    sunLight.shadow.camera.right = 200;
    sunLight.shadow.camera.top = 200;
    sunLight.shadow.camera.bottom = -200;
    scene.add(sunLight);

    // RALPH: Floor will be created AFTER tunnel loads to match exact tunnel position

    console.log('Tunnel lighting setup complete');
}

function loadUrbanEnvironment() {
    console.log('Loading tunnel road environment...');

    // Setup atmospheric lighting first
    setupUrbanLighting();

    const loader = stage2GLTFLoader;

    loader.load(
        'tunnel-road.glb',
        // onLoad
        (gltf) => {
            urbanEnvironment = gltf.scene;

            // STEP TRACKER DATA:
            // User walked X: -38.11 to +10.93 (about 49 units)
            // User walked Z: -208.07 to +189.46 (about 397 units)
            // User's starting position: X: -29.05, Z: -200.28
            //
            // Original scale (80, 80, 15) was too small:
            //   - Visual walls around X=+/-3 didn't contain user at X=-29
            //   - Z from -198 to +198 put user at Z=-200 just outside
            //
            // ⭐ PERFECT SIZE - User confirmed 2026-01-24 at 17:37
            // DO NOT CHANGE THIS SCALE - This is the ideal tunnel size
            urbanEnvironment.scale.set(100, 100, 100);  // PERFECT TUNNEL SIZE
            urbanEnvironment.position.set(-13.5, 0, 0); // Shift left to center user's asymmetric path

            // Rotate on Y-axis to change from horizontal to extending forward/backward
            urbanEnvironment.rotation.x = 0;
            urbanEnvironment.rotation.y = Math.PI / 2; // Rotate 90 degrees to extend along Z-axis
            urbanEnvironment.rotation.z = 0;

            console.log('Tunnel positioned at:', urbanEnvironment.position);
            console.log('Tunnel rotation:', urbanEnvironment.rotation);
            console.log('Tunnel scale:', urbanEnvironment.scale);

            // RALPH: Remove built-in floor texture
            console.log('=== TUNNEL MODEL MESH ANALYSIS ===');
            const meshesToRemove = [];
            urbanEnvironment.traverse((child) => {
                if (child.isMesh) {
                    const bbox = new THREE.Box3().setFromObject(child);
                    const size = bbox.getSize(new THREE.Vector3());
                    const center = bbox.getCenter(new THREE.Vector3());

                    console.log('MESH:', child.name || 'unnamed');
                    console.log('  Type:', child.type);
                    console.log('  Size:', size.x.toFixed(2), 'x', size.y.toFixed(2), 'x', size.z.toFixed(2));
                    console.log('  Position:', child.position.x.toFixed(2), child.position.y.toFixed(2), child.position.z.toFixed(2));
                    console.log('  Center:', center.x.toFixed(2), center.y.toFixed(2), center.z.toFixed(2));
                    console.log('  Material:', child.material?.type || 'none');

                    // Crop out structures outside tunnel bounds
                    // Based on step tracker data: user walks X: -38 to +11
                    // Collision walls are at X: -43.5 (left) and +16.5 (right)
                    // Keep only structures within playable tunnel: X: -45 to +18
                    const minX = -45;
                    const maxX = 18;

                    if (center.x > maxX) {
                        console.log('  ❌ CROPPING RIGHT - outside bounds (X:', center.x.toFixed(2), '> maxX:', maxX, ')');
                        meshesToRemove.push(child);
                        return;
                    }

                    if (center.x < minX) {
                        console.log('  ❌ CROPPING LEFT - outside bounds (X:', center.x.toFixed(2), '< minX:', minX, ')');
                        meshesToRemove.push(child);
                        return;
                    }

                    console.log('  ✅ KEEPING');
                    console.log('---');

                    // TUNNEL VISIBILITY FIX: Keep original texture but enable DoubleSide
                    if (child.material) {
                        // Clone material to avoid modifying shared material
                        child.material = child.material.clone();
                        child.material.side = THREE.DoubleSide;  // Render both sides for visibility
                        console.log('Tunnel material: kept original texture, enabled DoubleSide for:', child.name);
                    }

                    // Setup shadows
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            // Remove cropped meshes
            console.log('=== CROPPING RESULTS ===');
            console.log('Total meshes analyzed:', meshesToRemove.length + ' removed');
            console.log('Cropping bounds: X from -45 to +18');
            meshesToRemove.forEach(mesh => {
                if (mesh.parent) {
                    mesh.parent.remove(mesh);
                    console.log('Removed:', mesh.name || 'unnamed');
                }
            });
            console.log('✅ Cropping complete:', meshesToRemove.length, 'meshes removed');

            scene.add(urbanEnvironment);

            console.log('Tunnel road loaded');

            // RALPH: NARROW floor strip - like a red carpet runway
            const box = new THREE.Box3().setFromObject(urbanEnvironment);

            // FIX: Adjust tunnel Y position so its floor is at Y=0
            // The tunnel model's geometry has its floor at some positive Y value
            // which gets scaled by 800, putting the tunnel way above the character
            const tunnelMinY = box.min.y;
            const tunnelMaxY = box.max.y;
            console.log('=== TUNNEL Y BOUNDS BEFORE ADJUSTMENT ===');
            console.log('Tunnel min Y (floor):', tunnelMinY.toFixed(2));
            console.log('Tunnel max Y (ceiling):', tunnelMaxY.toFixed(2));
            console.log('Tunnel height:', (tunnelMaxY - tunnelMinY).toFixed(2));

            // Move the tunnel down so its floor (minY) is at Y=0
            // This puts the character INSIDE the tunnel instead of below it
            urbanEnvironment.position.y = -tunnelMinY;
            console.log('Adjusted tunnel Y position to:', urbanEnvironment.position.y.toFixed(2));

            // Recompute bounding box after Y adjustment
            const boxAfter = new THREE.Box3().setFromObject(urbanEnvironment);
            console.log('=== TUNNEL Y BOUNDS AFTER ADJUSTMENT ===');
            console.log('Tunnel min Y (floor):', boxAfter.min.y.toFixed(2));
            console.log('Tunnel max Y (ceiling):', boxAfter.max.y.toFixed(2));

            const tunnelMinZ = boxAfter.min.z;
            const tunnelMaxZ = boxAfter.max.z;
            const tunnelLength = tunnelMaxZ - tunnelMinZ;
            const tunnelCenterZ = (tunnelMinZ + tunnelMaxZ) / 2;

            // ⭐ STAGE 2: OLD Cylindrical collision wall - DISABLED
            // Now using CollisionSystem with 3 versions: V0 (Original), V1 (BVH), V2 (Raycasting)
            console.log('🎯 STAGE 2 SKIPPED: Using CollisionSystem instead of old red cylinder');

            // OLD CODE - REMOVED (was creating visible red cylinder)
            // const wallMaterial = new THREE.MeshBasicMaterial({
            //     color: 0xff0000,
            //     transparent: true,
            //     opacity: 0.3,
            //     side: THREE.DoubleSide
            // });
            // const tunnelRadius = 30;
            // const tunnelCollisionGeometry = new THREE.CylinderGeometry(...);
            // tunnelCollisionGeometry.rotateX(Math.PI / 2);
            // const tunnelCollisionWall = new THREE.Mesh(tunnelCollisionGeometry, wallMaterial);
            // tunnelCollisionWall.position.set(0, 6, 0);
            // scene.add(tunnelCollisionWall);

            console.log('✅ Old red collision wall DISABLED - using invisible CollisionSystem');

            // Calculate bounding box for collision (using adjusted box)
            const size = boxAfter.getSize(new THREE.Vector3());
            const center = boxAfter.getCenter(new THREE.Vector3());

            console.log('Tunnel bounds:', {
                center: { x: center.x.toFixed(2), y: center.y.toFixed(2), z: center.z.toFixed(2) },
                size: { x: size.x.toFixed(2), y: size.y.toFixed(2), z: size.z.toFixed(2) }
            });

            // Calculate tunnel start and end positions
            const tunnelStart = center.z - (size.z / 2);
            const tunnelEnd = center.z + (size.z / 2);
            console.log('Tunnel extends from Z=' + tunnelStart.toFixed(2) + ' to Z=' + tunnelEnd.toFixed(2));

            // Reposition officer near the EXIT end but still fully enclosed
            if (shooterModel) {
                // Calculate from bounding box (this worked before)
                const box = new THREE.Box3().setFromObject(urbanEnvironment);
                const tunnelMinZ = box.min.z;
                const tunnelMaxZ = box.max.z;
                const tunnelLength = tunnelMaxZ - tunnelMinZ;

                console.log('=== TUNNEL DIMENSIONS ===');
                console.log('Tunnel MinZ (ENTRANCE):', tunnelMinZ.toFixed(2));
                console.log('Tunnel MaxZ (EXIT):', tunnelMaxZ.toFixed(2));
                console.log('Tunnel Length:', tunnelLength.toFixed(2), 'units');

                // Use configured starting position for Animation Testing mode
                const startPos = LEVEL_CONFIG.ANIMATION_TESTING_START;

                console.log('=== STARTING POSITION ===');
                console.log('Using saved starting point:', startPos.description);
                console.log('Position - X:', startPos.x.toFixed(2), 'Y:', startPos.y.toFixed(2), 'Z:', startPos.z.toFixed(2));

                shooterModel.position.set(startPos.x, startPos.y, startPos.z);
                shooterModel.rotation.y = startPos.rotation;

                console.log('Officer ACTUAL position:', {
                    x: shooterModel.position.x.toFixed(2),
                    y: shooterModel.position.y.toFixed(2),
                    z: shooterModel.position.z.toFixed(2)
                });

                // Camera BEHIND officer (lower Z = behind when facing positive Z)
                // TUNNEL VISIBILITY FIX: Lower camera height to see walls on sides better
                camera.position.set(startPos.x, startPos.y + 1.5, startPos.z - 6);
                camera.lookAt(startPos.x, startPos.y + 0.5, startPos.z + 20);

                console.log('Camera position:', {
                    x: camera.position.x.toFixed(2),
                    y: camera.position.y.toFixed(2),
                    z: camera.position.z.toFixed(2)
                });
                console.log('Camera looking at (toward exit):', {
                    x: startPos.x.toFixed(2),
                    y: (startPos.y + 0.5).toFixed(2),
                    z: (startPos.z + 10).toFixed(2)
                });
            } else {
                console.log('WARNING: Officer not loaded yet when tunnel finished loading');
            }

            // Create collision areas for the tunnel
            createTunnelColliders();

            // Initialize CollisionSystem with tunnel mesh
            CollisionSystem.init(urbanEnvironment);

            // Load all cars in parallel for faster loading
            const carLoadPromises = [
                loadPorscheCar(),
                loadBMWM8Car(),
                loadBMW_X6M_V1_MassiveScale(),
                loadVW_TCross_V2_Bigger_OnFloor(),
                loadVW_TCross_TSI_V2(),
                // Audi RS6 - Disabled (invisible collision box at Z=-135)
                // Range Rover - Disabled (removed at Z=-63)
                loadMercA45_V2(),
                loadFordFiesta_V2()
            ];

            Promise.all(carLoadPromises).then(() => {
                console.log('🚗 All 7 cars loaded successfully!');
            });

            // Add distance markers so user can see progress
            // addTunnelMarkers(tunnelStart, tunnelEnd);
        },
        // onProgress
        (xhr) => {
            if (xhr.lengthComputable) {
                const percent = (xhr.loaded / xhr.total * 100).toFixed(2);
                console.log('Tunnel road loading: ' + percent + '%');
            }
        },
        // onError
        (error) => {
            console.error('Error loading tunnel road:', error);
        }
    );
}

// ============================================================================
// PORSCHE CAR LOADING
// ============================================================================

let porscheCar = null;

function loadPorscheCar() {
    console.log('Loading Porsche 911 Carrera 4S...');

    const loader = sharedGLTFLoader;

    loader.load(
        'porsche.glb',
        // onLoad
        (gltf) => {
            porscheCar = gltf.scene;

            // Position at user's current location: X: -35, Z: -210
            // Y: 1.5 to sit on road surface (was sinking at Y: 0)
            porscheCar.position.set(-43, 1.5, -210);

            // Scale the car appropriately (adjust if needed)
            porscheCar.scale.set(1.5, 1.5, 1.5);

            // Rotate to face forward (toward positive Z)
            porscheCar.rotation.y = 0;

            // Add to scene
            scene.add(porscheCar);

            // Enable shadows
            porscheCar.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            // Add collision box for the car
            // Porsche 911 is roughly 4.5m long, 1.8m wide, 1.3m tall
            const carLength = 6.75;  // 4.5m * 1.5 scale
            const carWidth = 2.7;    // 1.8m * 1.5 scale
            const carHeight = 2.0;   // 1.3m * 1.5 scale

            // FIX: Collision box position must match visual car position
            // Car is at X: -43, Z: -210, so collider must be at the same position
            addCollider(
                -43,              // X position (matches porscheCar.position.x)
                -210,             // Z position (matches porscheCar.position.z)
                carWidth,         // Width (perpendicular to Z)
                carLength,        // Depth (along Z axis)
                carHeight,        // Height
                'Porsche 911 Carrera 4S',
                0                 // Rotation (facing forward)
            );

            console.log('✅ Porsche 911 loaded at X: -43, Z: -210 with collision (FIX: collider now matches visual position)');
        },
        // onProgress
        (xhr) => {
            if (xhr.lengthComputable) {
                const percent = (xhr.loaded / xhr.total * 100).toFixed(2);
                console.log('Porsche loading: ' + percent + '%');
            }
        },
        // onError
        (error) => {
            console.error('Error loading Porsche:', error);
        }
    );
}

// ============================================================================
// HAZARD LIGHTS SYSTEM - For all cars
// ============================================================================

let hazardLights = []; // Array to store all hazard light objects
let hazardLightTimer = 0;
const HAZARD_FLASH_SPEED = 0.5; // Flash every 0.5 seconds

function addHazardLightsToCar(carObject, carName) {
    if (!carObject) {
        console.error('Cannot add hazard lights - car object is null');
        return;
    }

    console.log('🔍 Finding light meshes in ' + carName);

    const carLights = {
        left: [],
        right: []
    };

    // Search for light-related meshes in the car model
    const lightMeshes = [];
    carObject.traverse((child) => {
        if (child.isMesh) {
            const name = child.name.toLowerCase();
            // Look for meshes with "light", "lamp", "headlight", "taillight", "brake", "signal" in name
            if (name.includes('light') || name.includes('lamp') || name.includes('head') ||
                name.includes('tail') || name.includes('brake') || name.includes('signal') ||
                name.includes('indicator') || name.includes('blinker')) {
                console.log('  Found light mesh:', child.name, 'pos:', child.position);
                lightMeshes.push(child);
            }
        }
    });

    if (lightMeshes.length === 0) {
        console.log('⚠️ No light meshes found by name. Searching by position...');

        // Get car bounding box to find front/rear
        const box = new THREE.Box3().setFromObject(carObject);
        const size = new THREE.Vector3();
        box.getSize(size);

        // Find meshes at the front and rear corners (likely to be lights)
        carObject.traverse((child) => {
            if (child.isMesh && child.material) {
                const worldPos = new THREE.Vector3();
                child.getWorldPosition(worldPos);

                // Check if mesh is at edges (potential light location)
                const localPos = carObject.worldToLocal(worldPos.clone());
                const atFront = localPos.z > size.z * 0.3;
                const atRear = localPos.z < -size.z * 0.3;
                const atSide = Math.abs(localPos.x) > size.x * 0.3;

                if ((atFront || atRear) && atSide) {
                    console.log('  Found edge mesh (potential light):', child.name, 'local pos:', localPos);
                    lightMeshes.push(child);
                }
            }
        });
    }

    // Create hazard light effect for found meshes
    lightMeshes.forEach((mesh, index) => {
        const worldPos = new THREE.Vector3();
        mesh.getWorldPosition(worldPos);
        const localPos = carObject.worldToLocal(worldPos.clone());

        // Determine if it's left or right side based on X position
        const side = localPos.x < 0 ? 'left' : 'right';

        // Store original material
        const originalMaterial = mesh.material.clone();

        // Create orange hazard material
        const hazardMaterial = new THREE.MeshBasicMaterial({
            color: 0xff6600,
            emissive: 0xff6600,
            emissiveIntensity: 1
        });

        // Create point light at mesh position
        const pointLight = new THREE.PointLight(0xff6600, 0, 10);
        pointLight.position.copy(mesh.position);
        mesh.add(pointLight);

        carLights[side].push({
            mesh: mesh,
            originalMaterial: originalMaterial,
            hazardMaterial: hazardMaterial,
            light: pointLight,
            name: mesh.name
        });

        console.log('  ✅ Added hazard to mesh:', mesh.name, 'side:', side);
    });

    if (carLights.left.length === 0 && carLights.right.length === 0) {
        console.error('❌ No suitable light meshes found for ' + carName);
        return;
    }

    // Store car lights in global array
    hazardLights.push({
        carName: carName,
        carObject: carObject,
        lights: carLights
    });

    console.log('✅ Added hazard lights to ' + carName + ' (' + (carLights.left.length + carLights.right.length) + ' meshes)');
}

function updateHazardLights(delta) {
    hazardLightTimer += delta;

    // Toggle lights every HAZARD_FLASH_SPEED seconds (alternate left-right pattern)
    if (hazardLightTimer >= HAZARD_FLASH_SPEED) {
        hazardLightTimer = 0;

        hazardLights.forEach(carLightSet => {
            // Determine which side to light up
            const leftOn = Math.floor(Date.now() / 500) % 2 === 0; // Alternate every 500ms

            // Turn on left side meshes, turn off right side (or vice versa)
            carLightSet.lights.left.forEach(lightObj => {
                if (leftOn) {
                    // Switch to orange hazard material
                    lightObj.mesh.material = lightObj.hazardMaterial;
                    lightObj.light.intensity = 5;
                } else {
                    // Switch back to original material
                    lightObj.mesh.material = lightObj.originalMaterial;
                    lightObj.light.intensity = 0;
                }
            });

            carLightSet.lights.right.forEach(lightObj => {
                if (!leftOn) {
                    // Switch to orange hazard material
                    lightObj.mesh.material = lightObj.hazardMaterial;
                    lightObj.light.intensity = 5;
                } else {
                    // Switch back to original material
                    lightObj.mesh.material = lightObj.originalMaterial;
                    lightObj.light.intensity = 0;
                }
            });
        });
    }
}


// ============================================================================
// BMW M8 COUPE LOADING - 10 VERSIONS FOR TESTING
// ============================================================================

let bmwM8Car = null;

function loadBMWM8Car() {
    // Check URL parameter for BMW version (?bmw=1, ?bmw=2, etc.)
    const urlParams = new URLSearchParams(window.location.search);
    const bmwVersion = parseInt(urlParams.get('bmw')) || 0;

    console.log('🚗 Loading BMW M8 Coupe - Version ' + bmwVersion);

    // Route to appropriate version
    // NOTE: X6M is loaded separately via loadBMW_X6M_V1_MassiveScale() - use ?x6m=1 for X6M
    // To load BOTH cars: ?bmw=1&x6m=1
    switch(bmwVersion) {
        case 1: loadBMW_V1_ScaleInvestigation(); break;
        case 2: loadBMW_V2_YPositionFix(); break;
        case 3: loadBMW_V3_TexturesFolder(); break;
        case 4: loadBMW_V4_FlattenHierarchy(); break;
        case 5: loadBMW_V5_SimpleMaterial(); break;
        case 6: loadBMW_V6_RemoveCameras(); break;
        case 7: loadBMW_V7_ForceVisible(); break;
        case 8: loadBMW_V8_NoHelper(); break;
        case 9: loadBMW_V9_ExtremeScale(); break;
        case 10: loadBMW_V10_CenterGeometry(); break;
        default:
            console.log('No BMW M8 version specified (bmw=' + bmwVersion + ')');
            console.log('Use ?bmw=1 through ?bmw=10 for M8 Coupe');
            console.log('Use ?x6m=1 through ?x6m=10 for X6M Competition');
            console.log('For BOTH cars: ?bmw=1&x6m=1');
            // Don't return - let loadBMW_X6M_V1_MassiveScale() be called separately
            return;
    }
}

function loadBMW_V1_ScaleInvestigation() {
    console.log('BMW M8 with realistic scale');
    console.log('Attempting to load M8 from: 2020-bmw-m8-coupe/source/2020_bmw_m8_coupe.glb');
    const loader = sharedGLTFLoader;

    loader.load('2020-bmw-m8-coupe/source/2020_bmw_m8_coupe.glb',
        // onLoad
        (gltf) => {
            console.log('M8 GLB file loaded successfully!', gltf);
        bmwM8Car = gltf.scene;
        bmwM8Car.position.set(-28, 0.5, -167); // Left lane, between walls
        bmwM8Car.scale.set(1.6, 1.6, 1.6); // Reduced scale
        scene.add(bmwM8Car);

        // Enable shadows and use original materials (or dark gray if materials missing)
        bmwM8Car.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;

                // Keep original material if it exists and looks good, otherwise use dark gray
                if (child.material) {
                    // Original materials should work now that scale is correct
                    child.material.side = THREE.DoubleSide;
                    child.material.needsUpdate = true;
                } else {
                    // Fallback to realistic dark gray/black car color
                    child.material = new THREE.MeshStandardMaterial({
                        color: 0x1a1a1a, // Dark gray/black (realistic BMW color)
                        metalness: 0.8,
                        roughness: 0.2,
                        side: THREE.DoubleSide
                    });
                }
            }
        });

        // FIX: Collision box position must match visual car position
        // Car is at X: -28, Z: -167, so collider must be at the same position
        addCollider(-28, -167, 2.87, 7.29, 2.1, 'BMW M8 Coupe', 0);

        // Add hazard lights
        addHazardLightsToCar(bmwM8Car, 'BMW M8 Coupe');

        console.log('✅ BMW M8 loaded at X: -28, Y: 0.5, Z: -167 with collision (FIX: collider now matches visual position)');
    },
    // onProgress
    (xhr) => {
        if (xhr.lengthComputable) {
            const percent = (xhr.loaded / xhr.total * 100).toFixed(2);
            console.log('M8 loading progress: ' + percent + '%');
        }
    },
    // onError
    (error) => {
        console.error('❌ M8 Load Error:', error);
        console.error('Error details:', error.message, error.stack);
    });
}







// BMW X6M Competition
let bmwX6M = null;

function loadBMW_X6M_V1_MassiveScale() {
    console.log('Loading X6M with scale 150 (same as M8)');
    console.log('Attempting to load bmw_x6m.glb from:', window.location.origin + '/bmw_x6m.glb');
    const loader = sharedGLTFLoader;

    loader.load('bmw_x6m.glb',
        // onLoad
        (gltf) => {
            console.log('X6M GLB file loaded successfully!', gltf);
        bmwX6M = gltf.scene;
        // Position in tunnel between Range Rover and VW T-Cross
        bmwX6M.position.set(-14, 1.5, -85);
        bmwX6M.scale.set(1.5, 1.5, 1.5);
        scene.add(bmwX6M);

        // Use original materials from the model
        bmwX6M.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                // Keep original material but ensure it renders properly
                if (child.material) {
                    child.material.side = THREE.DoubleSide;
                    child.material.needsUpdate = true;
                }
            }
        });

        // FIX: Collision box position must match visual car position
        // Car is at X: -14, Z: -85, so collider must be at the same position
        addCollider(-14, -85, 4.305, 10.935, 3.15, 'BMW X6M Competition', 0);

        // Hazard lights removed per user request
        // addHazardLightsToCar(bmwX6M, 'BMW X6M Competition');

        console.log('✅ X6M loaded at X: -14, Z: -85 with collision (FIX: collider now matches visual position)');
    },
    // onProgress
    (xhr) => {
        if (xhr.lengthComputable) {
            const percent = (xhr.loaded / xhr.total * 100).toFixed(2);
            console.log('X6M loading progress: ' + percent + '%');
        }
    },
    // onError
    (error) => {
        console.error('❌ X6M V1 Load Error:', error);
        console.error('Error details:', error.message, error.stack);
    });
}










// Volkswagen T-Cross - Testing implementation
let vwTCross = null;

// New tunnel cars - 5 additional vehicles
let vwTCrossTSI = null; // Now holds Range Rover Evoque #2 - duplicate
let audiRS6 = null;
let roverEvoque = null;
let mercA45 = null;
let fordFiesta = null;

function loadVW_TCross_V2_Bigger_OnFloor() {
    console.log('Loading VW T-Cross - 1.5x scale, on floor');
    console.log('Attempting to load from: vw_tcross.glb');

    const loader = sharedGLTFLoader;

    loader.load('vw_tcross.glb',
        // onLoad
        (gltf) => {
            console.log('VW T-Cross GLB file loaded successfully!', gltf);
            vwTCross = gltf.scene;

            // Position at player's location: X: -35, Z: -110, Y: 0.1 (on floor)
            vwTCross.position.set(-22, 0.1, -110);

            // Scale 1.5x (like X6M)
            vwTCross.scale.set(1.5, 1.5, 1.5);

            scene.add(vwTCross);

            // Use original materials with DoubleSide
            vwTCross.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    if (child.material) {
                        child.material.side = THREE.DoubleSide;
                        child.material.needsUpdate = true;
                    }
                }
            });

            // FIX: Collision box position must match visual car position
            // Car is at X: -22, Z: -110, so collider must be at the same position
            addCollider(-22, -110, 2.7, 6.15, 2.4, 'Volkswagen T-Cross', 0);

            // Add hazard lights
            addHazardLightsToCar(vwTCross, 'Volkswagen T-Cross');

            // Initialize damage system for this car
            // initCarDamageState(vwTCross, 'Volkswagen T-Cross'); // TODO: Implement damage system

            console.log('✅ VW T-Cross loaded at X: -22, Y: 0.1, Z: -110 with collision (FIX: collider now matches visual position)');
            console.log('Car should be on the floor and slightly bigger. Production version.');
        },
        // onProgress
        (xhr) => {
            if (xhr.lengthComputable) {
                const percent = (xhr.loaded / xhr.total * 100).toFixed(2);
                console.log('VW T-Cross loading progress: ' + percent + '%');
            }
        },
        // onError
        (error) => {
            console.error('❌ VW T-Cross V2 Load Error:', error);
            console.error('Error details:', error.message, error.stack);
            console.error('File path attempted: vw_tcross.glb');
        }
    );
}

// ============================================================
// Range Rover Evoque #2 - Car #5 in tunnel (formerly VW T-Cross TSI)
// ============================================================

function loadVW_TCross_TSI_V2() {
    console.log('Loading Range Rover Evoque #2 (duplicate)');
    const loader = sharedGLTFLoader;

    loader.load('rover_evoque.glb',
        (gltf) => {
            console.log('Range Rover Evoque #2 loaded successfully!', gltf);
            vwTCrossTSI = gltf.scene;

            // Position at proper tunnel location
            vwTCrossTSI.position.set(-31, 0.5, -185);
            // Model is microscopic (0.02 units), need ~200x scale to make it car-sized
            vwTCrossTSI.scale.set(200, 200, 200);
            scene.add(vwTCrossTSI);

            // Use original materials
            vwTCrossTSI.traverse((child) => {
                child.visible = true;
                child.frustumCulled = false;
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    if (child.material) {
                        child.material.side = THREE.DoubleSide;
                        child.material.needsUpdate = true;
                    }
                }
            });

            addCollider(-31, -185, 2.85, 6.53, 2.42, 'Range Rover Evoque #2', 0);
            addHazardLightsToCar(vwTCrossTSI, 'Range Rover Evoque #2');

            console.log('✅ Range Rover Evoque #2 loaded at X: -31, Y: 0.5, Z: -185 with scale 200x (model is microscopic)');
        },
        (xhr) => {
            if (xhr.lengthComputable) {
                const percent = (xhr.loaded / xhr.total * 100).toFixed(2);
                console.log('Range Rover Evoque #2 loading: ' + percent + '%');
            }
        },
        (error) => {
            console.error('❌ Range Rover Evoque #2 V2 Load Error:', error);
        }
    );
}

// ============================================================
// Audi RS6 Avant - Car #6 in tunnel
// ============================================================













// ============================================================
// Range Rover Evoque - Car #7 in tunnel
// ============================================================











// ============================================================
// Mercedes A45 AMG - Car #8 in tunnel
// ============================================================


function loadMercA45_V2() {
    console.log('Loading Mercedes A45 AMG - 1.5x scale production version');
    const loader = sharedGLTFLoader;

    loader.load('merc_a45.glb',
        (gltf) => {
            console.log('Mercedes A45 AMG loaded successfully!', gltf);
            mercA45 = gltf.scene;
            mercA45.position.set(-11, 0.2, -35);
            mercA45.scale.set(0.3, 0.3, 0.3);
            scene.add(mercA45);

            mercA45.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    if (child.material) {
                        child.material.side = THREE.DoubleSide;
                        child.material.needsUpdate = true;
                    }
                }
            });

            // FIX: Collision box position must match visual car position
            // Car is at X: -11, Z: -35, so collider must be at the same position
            addCollider(-11, -35, 2.69, 6.54, 2.18, 'Mercedes A45 AMG', 0);
            addHazardLightsToCar(mercA45, 'Mercedes A45 AMG');
            // initCarDamageState(mercA45, 'Mercedes A45 AMG'); // TODO: Implement damage system

            console.log('✅ Mercedes A45 AMG loaded at X: -11, Y: 0.2, Z: -35 with collision (FIX: collider now matches visual position)');
        },
        (xhr) => {
            if (xhr.lengthComputable) {
                const percent = (xhr.loaded / xhr.total * 100).toFixed(2);
                console.log('Mercedes A45 AMG loading: ' + percent + '%');
            }
        },
        (error) => {
            console.error('❌ Mercedes A45 AMG V2 Load Error:', error);
        }
    );
}

// ============================================================
// Ford Fiesta Zetec S - Car #9 in tunnel
// ============================================================


function loadFordFiesta_V2() {
    console.log('Loading Ford Fiesta Zetec S - 1.5x scale production version');
    const loader = sharedGLTFLoader;

    loader.load('ford_fiesta.glb',
        (gltf) => {
            console.log('Ford Fiesta loaded successfully!', gltf);
            fordFiesta = gltf.scene;
            fordFiesta.position.set(-35, 0.1, -10);
            fordFiesta.scale.set(1.5, 1.5, 1.5);
            scene.add(fordFiesta);

            fordFiesta.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    if (child.material) {
                        child.material.side = THREE.DoubleSide;
                        child.material.needsUpdate = true;
                    }
                }
            });

            addCollider(-35, -10, 2.58, 5.94, 2.22, 'Ford Fiesta Zetec S', 0);
            addHazardLightsToCar(fordFiesta, 'Ford Fiesta Zetec S');
            // initCarDamageState(fordFiesta, 'Ford Fiesta Zetec S'); // TODO: Implement damage system

            console.log('✅ Ford Fiesta loaded at X: -35, Y: 0.1, Z: -10 with scale 1.5x');
        },
        (xhr) => {
            if (xhr.lengthComputable) {
                const percent = (xhr.loaded / xhr.total * 100).toFixed(2);
                console.log('Ford Fiesta loading: ' + percent + '%');
            }
        },
        (error) => {
            console.error('❌ Ford Fiesta V2 Load Error:', error);
        }
    );
}

function createTunnelColliders() {
    // Add collision boxes for tunnel walls - TIGHT to visual structure only
    if (!urbanEnvironment) {
        console.log('Cannot create tunnel colliders - environment not loaded');
        return;
    }

    // Get bounding box for tunnel length
    const box = new THREE.Box3().setFromObject(urbanEnvironment);
    const tunnelMinZ = box.min.z;
    const tunnelMaxZ = box.max.z;
    const tunnelLength = tunnelMaxZ - tunnelMinZ;
    const tunnelCenterZ = (tunnelMinZ + tunnelMaxZ) / 2;

    console.log('=== TUNNEL DIMENSIONS ===');
    console.log('Z range (length):', tunnelMinZ.toFixed(2), 'to', tunnelMaxZ.toFixed(2));

    const wallThickness = 2;      // Thin walls
    const wallHeight = 10;        // Tall walls

    // COLLISION WALLS based on step tracker data
    // User walked X: -38.11 to +10.93
    // Scale 800 gives visual walls at approximately X=+/-30 (before shift)
    // With shift of -13.5:
    // Left wall: -30 + (-13.5) = -43.5 (contains user at X=-38)
    // Right wall: +30 + (-13.5) = +16.5 (contains user at X=+11)
    const leftWallX = -43.5;    // Left wall position (shifted)
    const rightWallX = 16.5;    // Right wall position (shifted)

    // OLD COLLISION WALLS - DISABLED (using new CollisionSystem versions instead)
    // Left wall - at visible tunnel left edge
    // addCollider(
    //     leftWallX,             // X position (visible structure left)
    //     tunnelCenterZ,         // Z position (center of tunnel)
    //     wallThickness,         // Width of wall
    //     tunnelLength,          // Depth (extends full tunnel length)
    //     wallHeight,            // Height
    //     'Tunnel Left Wall (Visible Structure)'
    // );

    // Right wall - at visible tunnel right edge
    // addCollider(
    //     rightWallX,            // X position (visible structure right)
    //     tunnelCenterZ,         // Z position (center of tunnel)
    //     wallThickness,         // Width of wall
    //     tunnelLength,          // Depth (extends full tunnel length)
    //     wallHeight,            // Height
    //     'Tunnel Right Wall (Visible Structure)'
    // );

    // ENTRANCE WALL - Blocks backward movement out of tunnel
    // User's starting position is at Z: -231.69, add wall slightly behind to prevent exiting
    const entranceWallZ = -232;  // Slightly behind starting position
    const tunnelWidth = rightWallX - leftWallX;  // Width from left to right wall
    const tunnelCenterX = (leftWallX + rightWallX) / 2;  // Center X position

    addCollider(
        tunnelCenterX,         // X position (center of tunnel)
        entranceWallZ,         // Z position (at entrance, behind starting point)
        tunnelWidth,           // Width (spans full tunnel width)
        wallThickness,         // Depth (thin wall perpendicular to Z)
        wallHeight,            // Height
        'Tunnel Entrance Wall (Blocks Backward Exit)'
    );

    console.log('=== ENTRANCE WALL ADDED at Z=' + entranceWallZ + ' ===');
    console.log('Prevents character from exiting tunnel backwards');
    console.log('=== OLD COLLISION WALLS DISABLED - Using CollisionSystem versions ===');
    console.log('Left wall was at X=' + leftWallX);
    console.log('Right wall was at X=' + rightWallX);
    console.log('Playable width: 60 units (contains step tracker X range -38 to +11)');

    // Hide collision boxes by default - ALWAYS hidden
    toggleCollisionDebug(false);

    // Also hide them after a delay to catch any late additions
    setTimeout(() => toggleCollisionDebug(false), 1000);
}

function addWallMarkers(leftX, rightX, tunnelMinZ, tunnelMaxZ) {
    console.log('Adding visual wall markers at EXACT tunnel edges...');

    // Add markers every 30 units along the walls
    const markerInterval = 30;
    const numMarkers = Math.floor((tunnelMaxZ - tunnelMinZ) / markerInterval);

    for (let i = 0; i <= numMarkers; i++) {
        const zPos = tunnelMinZ + (i * markerInterval);

        // Left wall marker (bright cyan sphere) - at EXACT left edge
        const leftMarkerGeometry = new THREE.SphereGeometry(1.5, 8, 8);
        const leftMarkerMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            emissive: 0x00ffff,
            emissiveIntensity: 1
        });
        const leftMarker = new THREE.Mesh(leftMarkerGeometry, leftMarkerMaterial);
        leftMarker.position.set(leftX, 2, zPos);
        scene.add(leftMarker);

        // Right wall marker (bright magenta sphere) - at EXACT right edge
        const rightMarkerGeometry = new THREE.SphereGeometry(1.5, 8, 8);
        const rightMarkerMaterial = new THREE.MeshBasicMaterial({
            color: 0xff00ff,
            emissive: 0xff00ff,
            emissiveIntensity: 1
        });
        const rightMarker = new THREE.Mesh(rightMarkerGeometry, rightMarkerMaterial);
        rightMarker.position.set(rightX, 2, zPos);
        scene.add(rightMarker);
    }

    console.log(`Added ${numMarkers * 2} wall markers at EXACT positions:`);
    console.log(`  CYAN (left) at X=${leftX.toFixed(2)}`);
    console.log(`  MAGENTA (right) at X=${rightX.toFixed(2)}`);
}

function addTunnelMarkers(tunnelStart, tunnelEnd) {
    // Add distance markers every 20 units with different colors
    console.log('Adding tunnel distance markers...');

    const markerInterval = 20;
    const totalDistance = tunnelEnd - tunnelStart;
    const numMarkers = Math.floor(totalDistance / markerInterval);

    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff'];

    for (let i = 0; i <= numMarkers; i++) {
        const zPos = tunnelStart + (i * markerInterval);
        const distance = Math.abs(zPos - tunnelStart);
        const color = colors[i % colors.length];

        console.log('Creating marker ' + i + ' at Z=' + zPos.toFixed(2) + ' showing "' + distance + 'm"');

        // Create marker text
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 256;

        // Draw background
        context.fillStyle = '#000000';
        context.fillRect(0, 0, 512, 256);

        // Draw text in alternating colors
        context.fillStyle = color;
        context.font = 'Bold 100px Arial';
        context.textAlign = 'center';
        context.fillText(distance + 'm', 256, 160);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);

        sprite.position.set(-5, 5, zPos); // Left wall, higher up
        sprite.scale.set(3, 1.5, 1); // Reasonable size
        scene.add(sprite);

        // Add duplicate on right side
        const sprite2 = sprite.clone();
        sprite2.position.set(5, 5, zPos);
        scene.add(sprite2);
    }

    // Add EXIT marker at the end
    const exitCanvas = document.createElement('canvas');
    const exitContext = exitCanvas.getContext('2d');
    exitCanvas.width = 512;
    exitCanvas.height = 256;

    exitContext.fillStyle = '#000000';
    exitContext.fillRect(0, 0, 512, 256);
    exitContext.fillStyle = '#00ff00';
    exitContext.font = 'Bold 120px Arial';
    exitContext.textAlign = 'center';
    exitContext.fillText('START', 256, 180);

    const exitTexture = new THREE.CanvasTexture(exitCanvas);
    const exitSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: exitTexture }));
    exitSprite.position.set(0, 5, tunnelEnd - 10);
    exitSprite.scale.set(6, 3, 1); // Reasonable size
    scene.add(exitSprite);

    // Add bright light at exit
    const exitLight = new THREE.PointLight(0x00ff00, 5, 80);
    exitLight.position.set(0, 3, tunnelEnd - 5);
    scene.add(exitLight);

    console.log('Added ' + (numMarkers + 1) + ' distance markers and exit sign');
}

function addCollider(x, z, width, depth, height, label = '', rotationY = 0) {
    const collider = {
        x: x,
        z: z,
        width: width,
        depth: depth,
        height: height,
        label: label,
        rotationY: rotationY // Rotation in degrees
    };

    environmentColliders.push(collider);

    // Create debug visualization (wireframe box) - BRIGHT AND VISIBLE
    const debugGeometry = new THREE.BoxGeometry(width, height, depth);
    const debugMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true,
        transparent: false,  // Make it fully opaque
        opacity: 1.0,
        depthTest: false,    // Render on top of everything
        depthWrite: false
    });
    const debugBox = new THREE.Mesh(debugGeometry, debugMaterial);
    debugBox.position.set(x, height / 2, z);
    debugBox.rotation.y = THREE.MathUtils.degToRad(rotationY);
    debugBox.renderOrder = 999; // Render last (on top)
    debugBox.visible = false; // Hidden by default
    scene.add(debugBox);
    debugCollisionBoxes.push(debugBox);

    // Also add a solid colored box to make it even more visible
    const solidGeometry = new THREE.BoxGeometry(width * 0.9, height * 0.9, depth * 0.9);
    const solidMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
    });
    const solidBox = new THREE.Mesh(solidGeometry, solidMaterial);
    solidBox.position.set(x, height / 2, z);
    solidBox.rotation.y = THREE.MathUtils.degToRad(rotationY);
    solidBox.visible = false; // Hidden by default
    scene.add(solidBox);
    debugCollisionBoxes.push(solidBox);

    console.log(`✅ Collider added: ${label || 'Unnamed'} at X=${x}, Z=${z} (Width=${width}, Depth=${depth}, Height=${height}, Rotation=${rotationY}°)`);
}

function toggleCollisionDebug(show) {
    debugCollisionBoxes.forEach(box => {
        box.visible = show;
    });
}

// FIX: Added collision debug flag - set to true to see collision checks in console
let _collisionDebugEnabled = false;
window.enableCollisionDebug = () => { _collisionDebugEnabled = true; console.log('Collision debugging ENABLED'); };
window.disableCollisionDebug = () => { _collisionDebugEnabled = false; console.log('Collision debugging DISABLED'); };

// Show/hide collision wall wireframes
window.showCollisionWalls = () => {
    toggleCollisionDebug(true);
    console.log('✅ Collision walls VISIBLE (red wireframes)');
};
window.hideCollisionWalls = () => {
    toggleCollisionDebug(false);
    console.log('✅ Collision walls HIDDEN');
};

function checkEnvironmentCollision(newX, newZ, radius = 0.5) {
    for (const collider of environmentColliders) {
        const halfWidth = collider.width / 2;
        const halfDepth = collider.depth / 2;

        // Handle rotated boxes (OBB collision)
        if (collider.rotationY && collider.rotationY !== 0) {
            // Transform player position to box's local space
            const angleRad = -THREE.MathUtils.degToRad(collider.rotationY);
            const cos = Math.cos(angleRad);
            const sin = Math.sin(angleRad);

            // Translate to box origin
            const dx = newX - collider.x;
            const dz = newZ - collider.z;

            // Rotate to box's local space
            const localX = dx * cos - dz * sin;
            const localZ = dx * sin + dz * cos;

            // Now do AABB collision in local space
            const closestX = Math.max(-halfWidth, Math.min(localX, halfWidth));
            const closestZ = Math.max(-halfDepth, Math.min(localZ, halfDepth));

            const distanceX = localX - closestX;
            const distanceZ = localZ - closestZ;
            const distanceSquared = distanceX * distanceX + distanceZ * distanceZ;

            if (distanceSquared < (radius * radius)) {
                // FIX: Debug log when collision is detected with a car
                if (_collisionDebugEnabled) {
                    console.log(`[COLLISION] Hit ${collider.label} at X=${newX.toFixed(1)}, Z=${newZ.toFixed(1)}`);
                }
                return true; // Collision detected!
            }
        } else {
            // Standard AABB collision (no rotation)
            const closestX = Math.max(collider.x - halfWidth, Math.min(newX, collider.x + halfWidth));
            const closestZ = Math.max(collider.z - halfDepth, Math.min(newZ, collider.z + halfDepth));

            const distanceX = newX - closestX;
            const distanceZ = newZ - closestZ;
            const distanceSquared = distanceX * distanceX + distanceZ * distanceZ;

            if (distanceSquared < (radius * radius)) {
                // FIX: Debug log when collision is detected with a car (AABB case)
                if (_collisionDebugEnabled) {
                    console.log(`[COLLISION] Hit ${collider.label} at X=${newX.toFixed(1)}, Z=${newZ.toFixed(1)}`);
                }
                return true; // Collision detected!
            }
        }
    }
    return false; // No collision
}

// RALPH: Expose for debugging
window.checkEnvironmentCollision = checkEnvironmentCollision;

// ============================================================================
// COLLISION SYSTEM - 10 Different Implementations
// ============================================================================

const CollisionSystem = {
    currentVersion: 0, // 0 = original, 1-10 = new versions
    tunnelMesh: null,
    implementations: {},
    debugVisualization: [],

    init(tunnelScene) {
        this.tunnelMesh = tunnelScene;
        console.log('🎯 Initializing CollisionSystem with', Object.keys(this.implementations).length, 'versions');

        // Check URL parameter for version (e.g., ?v=2 or ?version=5)
        const urlParams = new URLSearchParams(window.location.search);
        let urlVersion = urlParams.get('v') || urlParams.get('version');

        // DEFAULT: Use V2 if no parameter specified
        if (urlVersion === null) {
            urlVersion = '2';
            console.log('📍 Using (Multi-Directional Raycasting)');
        }

        if (urlVersion !== null) {
            const versionNum = parseInt(urlVersion);
            if (versionNum >= 0 && versionNum <= 2) {
                this.currentVersion = versionNum;
                console.log('📍 Using collision version: V' + versionNum);
            } else {
                console.warn('⚠️ Invalid collision version:', versionNum, '(only V0, V1, V2 are available). Defaulting to V2.');
                this.currentVersion = 2;
            }
        }

        // Initialize current version
        if (this.implementations[this.currentVersion] && this.implementations[this.currentVersion].init) {
            this.implementations[this.currentVersion].init(tunnelScene);
        }

        // Show which version is active
        if (this.currentVersion !== 0) {
            this.showVersionNotification(this.currentVersion);
        }
    },

    setVersion(version) {
        if (version < 0 || version > 2) {
            console.error('Invalid version:', version, '(only V0, V1, V2 are available)');
            return;
        }

        // Cleanup old version
        if (this.implementations[this.currentVersion] && this.implementations[this.currentVersion].cleanup) {
            this.implementations[this.currentVersion].cleanup();
        }

        this.currentVersion = version;
        console.log('🔄 Switched to collision V' + version + ':', this.getVersionName(version));

        // Update URL parameter
        const url = new URL(window.location);
        if (version === 0) {
            url.searchParams.delete('v');
        } else {
            url.searchParams.set('v', version);
        }
        window.history.pushState({}, '', url);

        // Initialize new version
        if (this.tunnelMesh && this.implementations[version] && this.implementations[version].init) {
            this.implementations[version].init(this.tunnelMesh);
        }

        // Show notification
        this.showVersionNotification(version);
    },

    checkCollision(newX, newZ, radius = 0.5) {
        if (this.currentVersion === 0) {
            // Use original collision function
            return checkEnvironmentCollision(newX, newZ, radius);
        }

        const impl = this.implementations[this.currentVersion];
        if (impl && impl.checkCollision) {
            return impl.checkCollision(new THREE.Vector3(newX, 1.0, newZ), radius);
        }

        return false;
    },

    getVersionName(version) {
        const names = {
            0: 'Original (Simple Walls)',
            1: 'BVH with three-mesh-bvh',
            2: 'Multi-Directional Raycasting'
        };
        return names[version] || 'Unknown';
    },

    showVersionNotification(version) {
        // Disabled - loading screen replaces this
        console.log(`🎯 COLLISION SYSTEM - Version ${version}: ${this.getVersionName(version)}`);
    }
};

// Expose globally for console access
window.CollisionSystem = CollisionSystem;
window.setCollisionVersion = (v) => CollisionSystem.setVersion(v);


// ============================================================================
// ============================================================================

CollisionSystem.implementations[2] = {
    raycaster: null,
    rayCount: 12,
    rayLength: 2.0,
    rayDirections: [],
    tunnelMeshes: [],

    init(tunnelScene) {
        console.log('Setting up multi-directional raycasting...');
        this.raycaster = new THREE.Raycaster();
        this.rayDirections = [];
        this.tunnelMeshes = [];

        // Pre-compute ray directions in 360°
        for (let i = 0; i < this.rayCount; i++) {
            const angle = (i / this.rayCount) * Math.PI * 2;
            this.rayDirections.push(new THREE.Vector3(
                Math.cos(angle), 0, Math.sin(angle)
            ));
        }

        tunnelScene.traverse((child) => {
            if (child.isMesh) {
                this.tunnelMeshes.push(child);
            }
        });

        console.log('✅ V2:', this.rayCount, 'rays ready, tracking', this.tunnelMeshes.length, 'meshes');
    },

    checkCollision(position, radius) {
        const origin = position.clone();
        origin.y = 1.0; // Cast at player height

        // First check raycasting against tunnel mesh
        for (const dir of this.rayDirections) {
            this.raycaster.set(origin, dir);
            this.raycaster.far = this.rayLength;

            const hits = this.raycaster.intersectObjects(this.tunnelMeshes, false);

            if (hits.length > 0 && hits[0].distance < radius + 0.5) {
                return true; // Wall detected
            }
        }

        // Also check environmentColliders (like entrance wall)
        if (checkEnvironmentCollision(position.x, position.z, radius)) {
            return true; // Entrance wall or other collider detected
        }

        return false;
    },

    cleanup() {
        this.tunnelMeshes = [];
    }
};


// ============================================================================
// ============================================================================

CollisionSystem.implementations[1] = {
    bvhMeshes: [],
    playerCapsule: null,

    init(tunnelScene) {
        console.log('Initializing BVH collision...');

        // Check if library is loaded
        if (typeof window.MeshBVHLib === 'undefined') {
            console.warn('⚠️ V1: three-mesh-bvh library not loaded. Add to importmap in index.html');
            console.warn('This version will fall back to simple raycasting.');
            // Fallback to simple collision
            this.useFallback = true;
            return;
        }

        this.bvhMeshes = [];

        tunnelScene.traverse((child) => {
            if (child.isMesh && child.geometry) {
                // Compute BVH for mesh
                child.geometry.computeBoundsTree();
                this.bvhMeshes.push(child);
            }
        });

        console.log('✅ BVH computed for', this.bvhMeshes.length, 'meshes');
    },

    checkCollision(position, radius) {
        if (this.useFallback) {
            // Fallback to environment colliders
            return checkEnvironmentCollision(position.x, position.z, radius);
        }

        // BVH-based collision would go here
        // For now, use environment colliders check
        if (checkEnvironmentCollision(position.x, position.z, radius)) {
            return true; // Entrance wall or other collider detected
        }

        return false;
    },

    cleanup() {
        this.bvhMeshes.forEach(mesh => {
            if (mesh.geometry.disposeBoundsTree) {
                mesh.geometry.disposeBoundsTree();
            }
        });
        this.bvhMeshes = [];
    }
};


// ============================================================================
// DEBUG POSITION DASHBOARD
// ============================================================================

let debugDashboard = null;

// ============================================================================
// STEP TRACKER - Records position trail for collision wall placement
// ============================================================================

let stepTracker = {
    isRecording: false,
    steps: [],
    lastRecordedPos: null,
    recordInterval: 0.1, // Record every 0.1 seconds
    timeSinceLastRecord: 0,
    startTime: null,
    minDistance: 0.5, // Only record if moved at least 0.5 units

    start() {
        this.isRecording = true;
        this.steps = [];
        this.lastRecordedPos = null;
        this.startTime = Date.now();
        this.timeSinceLastRecord = 0;
        console.log('📍 Step Tracker: Recording STARTED');
        updateStepTrackerUI();
    },

    stop() {
        this.isRecording = false;
        console.log('📍 Step Tracker: Recording STOPPED');
        console.log('Total steps recorded:', this.steps.length);
        this.exportData();
        updateStepTrackerUI();
    },

    reset() {
        this.steps = [];
        this.lastRecordedPos = null;
        this.timeSinceLastRecord = 0;
        console.log('📍 Step Tracker: Data RESET');
        updateStepTrackerUI();
    },

    record(delta) {
        if (!this.isRecording || !shooterModel) return;

        this.timeSinceLastRecord += delta;

        // Record at intervals
        if (this.timeSinceLastRecord >= this.recordInterval) {
            const currentPos = {
                x: shooterModel.position.x,
                y: shooterModel.position.y,
                z: shooterModel.position.z
            };

            // Only record if moved significantly or first position
            if (!this.lastRecordedPos || this.hasMovedSignificantly(currentPos)) {
                const timeElapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);

                this.steps.push({
                    step: this.steps.length + 1,
                    time: timeElapsed,
                    x: currentPos.x.toFixed(2),
                    y: currentPos.y.toFixed(2),
                    z: currentPos.z.toFixed(2),
                    distance: this.lastRecordedPos ? this.calculateDistance(currentPos) : 0
                });

                this.lastRecordedPos = currentPos;
                updateStepTrackerUI();
            }

            this.timeSinceLastRecord = 0;
        }
    },

    hasMovedSignificantly(currentPos) {
        if (!this.lastRecordedPos) return true;

        const dx = currentPos.x - this.lastRecordedPos.x;
        const dy = currentPos.y - this.lastRecordedPos.y;
        const dz = currentPos.z - this.lastRecordedPos.z;
        const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);

        return distance >= this.minDistance;
    },

    calculateDistance(currentPos) {
        const dx = currentPos.x - this.lastRecordedPos.x;
        const dy = currentPos.y - this.lastRecordedPos.y;
        const dz = currentPos.z - this.lastRecordedPos.z;
        return Math.sqrt(dx*dx + dy*dy + dz*dz).toFixed(2);
    },

    exportData() {
        console.log('=== STEP TRACKER DATA EXPORT ===');
        console.log('Total Steps:', this.steps.length);
        console.log('Duration:', ((Date.now() - this.startTime) / 1000).toFixed(2), 'seconds');
        console.log('\nPosition Data:');
        this.steps.forEach(step => {
            console.log(`Step ${step.step}: X=${step.x}, Y=${step.y}, Z=${step.z} (${step.time}s, moved ${step.distance}m)`);
        });

        // Calculate bounds
        if (this.steps.length > 0) {
            const xValues = this.steps.map(s => parseFloat(s.x));
            const zValues = this.steps.map(s => parseFloat(s.z));

            console.log('\n=== COLLISION BOUNDS ===');
            console.log('X Range:', Math.min(...xValues).toFixed(2), 'to', Math.max(...xValues).toFixed(2));
            console.log('Z Range:', Math.min(...zValues).toFixed(2), 'to', Math.max(...zValues).toFixed(2));
        }
    },

    getTotalDistance() {
        return this.steps.reduce((sum, step) => sum + parseFloat(step.distance), 0).toFixed(2);
    },

    getBounds() {
        if (this.steps.length === 0) return null;

        const xValues = this.steps.map(s => parseFloat(s.x));
        const zValues = this.steps.map(s => parseFloat(s.z));

        return {
            minX: Math.min(...xValues).toFixed(2),
            maxX: Math.max(...xValues).toFixed(2),
            minZ: Math.min(...zValues).toFixed(2),
            maxZ: Math.max(...zValues).toFixed(2)
        };
    }
};

let stepTrackerDashboard = null;

function createDebugDashboard() {
    if (debugDashboard) return; // Already created

    const dashboard = document.createElement('div');
    dashboard.id = 'debug-dashboard';
    dashboard.style.cssText = `
        display: none;
        position: fixed;
        top: 80px;
        right: 20px;
        background: rgba(0, 0, 0, 0.85);
        color: #00ff00;
        font-family: 'Courier New', monospace;
        font-size: 14px;
        padding: 15px;
        border: 2px solid #00ff00;
        border-radius: 8px;
        z-index: 1000;
        min-width: 300px;
        pointer-events: auto;
    `;

    dashboard.innerHTML = `
        <div style="font-weight: bold; font-size: 16px; margin-bottom: 10px; color: #ffff00;">
            🎯 DEBUG POSITION TRACKER
        </div>
        <div style="margin-bottom: 8px;">
            <strong>Position:</strong><br>
            X: <span id="debug-pos-x">0.00</span><br>
            Y: <span id="debug-pos-y">0.00</span><br>
            Z: <span id="debug-pos-z">0.00</span>
        </div>
        <div style="margin-bottom: 8px;">
            <strong>Rotation:</strong> <span id="debug-rot-y">0.00</span>°
        </div>
        <div style="margin-bottom: 8px;">
            <strong>Velocity:</strong><br>
            X: <span id="debug-vel-x">0.00</span><br>
            Z: <span id="debug-vel-z">0.00</span>
        </div>
        <hr style="border-color: #00ff00; margin: 10px 0;">
        <div style="font-weight: bold; margin-bottom: 5px;">TELEPORT TO:</div>
        <div style="margin-bottom: 5px;">
            X: <input type="number" id="teleport-x" step="0.1" value="0" style="width: 70px; background: #222; color: #0f0; border: 1px solid #0f0; padding: 2px;">
            Y: <input type="number" id="teleport-y" step="0.1" value="1" style="width: 70px; background: #222; color: #0f0; border: 1px solid #0f0; padding: 2px;">
            Z: <input type="number" id="teleport-z" step="0.1" value="0" style="width: 70px; background: #222; color: #0f0; border: 1px solid #0f0; padding: 2px;">
        </div>
        <button id="teleport-btn" style="
            background: #00ff00;
            color: #000;
            border: none;
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            width: 100%;
            margin-top: 5px;
        ">TELEPORT NOW</button>
        <div style="margin-top: 10px; font-size: 11px; color: #888;">
            Quick presets:<br>
            <button class="preset-btn" data-x="${LEVEL_CONFIG.ANIMATION_TESTING_START.x}" data-y="${LEVEL_CONFIG.ANIMATION_TESTING_START.y}" data-z="${LEVEL_CONFIG.ANIMATION_TESTING_START.z}">STARTING POINT</button>
            <button class="preset-btn" data-x="0" data-y="1" data-z="0">Tunnel center</button>
        </div>
    `;

    // Add preset button styles
    const style = document.createElement('style');
    style.textContent = `
        .preset-btn {
            background: #333;
            color: #0f0;
            border: 1px solid #0f0;
            padding: 4px 8px;
            margin: 2px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 10px;
        }
        .preset-btn:hover {
            background: #0f0;
            color: #000;
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(dashboard);
    debugDashboard = dashboard;

    // Add teleport button functionality
    document.getElementById('teleport-btn').addEventListener('click', () => {
        if (!shooterModel) return;

        const x = parseFloat(document.getElementById('teleport-x').value);
        const y = parseFloat(document.getElementById('teleport-y').value);
        const z = parseFloat(document.getElementById('teleport-z').value);

        shooterModel.position.set(x, y, z);
        console.log(`TELEPORTED to X:${x.toFixed(2)}, Y:${y.toFixed(2)}, Z:${z.toFixed(2)}`);
    });

    // Add preset button functionality
    dashboard.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('teleport-x').value = btn.dataset.x;
            document.getElementById('teleport-y').value = btn.dataset.y;
            document.getElementById('teleport-z').value = btn.dataset.z;
        });
    });

    console.log('Debug dashboard created');
}

function updateDebugDashboard() {
    if (!debugDashboard || !shooterModel) return;

    // Update position
    document.getElementById('debug-pos-x').textContent = shooterModel.position.x.toFixed(2);
    document.getElementById('debug-pos-y').textContent = shooterModel.position.y.toFixed(2);
    document.getElementById('debug-pos-z').textContent = shooterModel.position.z.toFixed(2);

    // Update rotation (convert from radians to degrees)
    const rotDeg = (shooterModel.rotation.y * 180 / Math.PI).toFixed(2);
    document.getElementById('debug-rot-y').textContent = rotDeg;

    // Update velocity
    if (MazeController.velocity) {
        document.getElementById('debug-vel-x').textContent = MazeController.velocity.x.toFixed(2);
        document.getElementById('debug-vel-z').textContent = MazeController.velocity.z.toFixed(2);
    }
}

function removeDebugDashboard() {
    if (debugDashboard) {
        debugDashboard.remove();
        debugDashboard = null;
    }
}

// ============================================================================
// STEP TRACKER DASHBOARD UI
// ============================================================================

function createStepTrackerDashboard() {
    if (stepTrackerDashboard) return; // Already created

    const dashboard = document.createElement('div');
    dashboard.id = 'step-tracker-dashboard';
    dashboard.style.cssText = `
        display: none;
        position: fixed;
        top: 80px;
        left: 20px;
        background: rgba(0, 0, 0, 0.9);
        color: #00ff00;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        padding: 15px;
        border: 2px solid #ff6600;
        border-radius: 8px;
        z-index: 1000;
        width: 350px;
        max-height: 80vh;
        overflow-y: auto;
        pointer-events: auto;
    `;

    dashboard.innerHTML = `
        <div style="font-weight: bold; font-size: 16px; margin-bottom: 10px; color: #ff6600;">
            📍 STEP TRACKER
        </div>

        <div style="margin-bottom: 10px; padding: 10px; background: rgba(255,102,0,0.1); border: 1px solid #ff6600; border-radius: 4px;">
            <div style="font-weight: bold; margin-bottom: 5px;">STATUS: <span id="tracker-status" style="color: #ffff00;">READY</span></div>
            <div style="display: flex; gap: 5px; margin-bottom: 5px;">
                <button id="tracker-start-btn" style="
                    flex: 1;
                    background: #00ff00;
                    color: #000;
                    border: none;
                    padding: 8px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 12px;
                ">START</button>
                <button id="tracker-stop-btn" style="
                    flex: 1;
                    background: #ff0000;
                    color: #fff;
                    border: none;
                    padding: 8px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 12px;
                " disabled>STOP</button>
            </div>
            <button id="tracker-reset-btn" style="
                width: 100%;
                background: #666;
                color: #fff;
                border: none;
                padding: 6px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
            ">RESET DATA</button>
        </div>

        <div style="margin-bottom: 10px; padding: 8px; background: rgba(0,255,0,0.05); border: 1px solid #0f0; border-radius: 4px;">
            <div style="font-weight: bold; margin-bottom: 5px; color: #ffff00;">SUMMARY:</div>
            <div>Steps: <span id="tracker-step-count" style="color: #fff;">0</span></div>
            <div>Distance: <span id="tracker-distance" style="color: #fff;">0.00</span>m</div>
            <div>Time: <span id="tracker-time" style="color: #fff;">0.00</span>s</div>
        </div>

        <div id="tracker-bounds" style="display: none; margin-bottom: 10px; padding: 8px; background: rgba(255,255,0,0.1); border: 1px solid #ff0; border-radius: 4px;">
            <div style="font-weight: bold; margin-bottom: 5px; color: #ffff00;">COLLISION BOUNDS:</div>
            <div style="font-size: 11px;">
                X: <span id="tracker-min-x">0</span> to <span id="tracker-max-x">0</span><br>
                Z: <span id="tracker-min-z">0</span> to <span id="tracker-max-z">0</span>
            </div>
        </div>

        <div style="margin-bottom: 5px; font-weight: bold; border-bottom: 1px solid #ff6600; padding-bottom: 5px;">
            RECORDED STEPS:
        </div>

        <div id="tracker-steps-list" style="
            max-height: 300px;
            overflow-y: auto;
            font-size: 11px;
            line-height: 1.4;
        ">
            <div style="color: #888; text-align: center; padding: 20px;">
                No steps recorded yet.<br>
                Click START to begin tracking.
            </div>
        </div>

        <div style="margin-top: 10px; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; font-size: 10px; color: #888;">
            💡 TIP: Walk the path, click STOP, then screenshot this panel to send collision data.
        </div>
    `;

    document.body.appendChild(dashboard);
    stepTrackerDashboard = dashboard;

    // Add button event listeners
    document.getElementById('tracker-start-btn').addEventListener('click', () => {
        stepTracker.start();
        document.getElementById('tracker-start-btn').disabled = true;
        document.getElementById('tracker-stop-btn').disabled = false;
    });

    document.getElementById('tracker-stop-btn').addEventListener('click', () => {
        stepTracker.stop();
        document.getElementById('tracker-start-btn').disabled = false;
        document.getElementById('tracker-stop-btn').disabled = true;
    });

    document.getElementById('tracker-reset-btn').addEventListener('click', () => {
        if (confirm('Reset all recorded steps?')) {
            stepTracker.reset();
            document.getElementById('tracker-start-btn').disabled = false;
            document.getElementById('tracker-stop-btn').disabled = true;
        }
    });

    console.log('Step Tracker Dashboard created');
}

function updateStepTrackerUI() {
    if (!stepTrackerDashboard) return;

    // Update status
    const statusEl = document.getElementById('tracker-status');
    if (stepTracker.isRecording) {
        statusEl.textContent = '🔴 RECORDING';
        statusEl.style.color = '#ff0000';
    } else if (stepTracker.steps.length > 0) {
        statusEl.textContent = '✅ COMPLETED';
        statusEl.style.color = '#00ff00';
    } else {
        statusEl.textContent = 'READY';
        statusEl.style.color = '#ffff00';
    }

    // Update summary
    document.getElementById('tracker-step-count').textContent = stepTracker.steps.length;
    document.getElementById('tracker-distance').textContent = stepTracker.getTotalDistance();

    if (stepTracker.startTime) {
        const elapsed = ((Date.now() - stepTracker.startTime) / 1000).toFixed(2);
        document.getElementById('tracker-time').textContent = elapsed;
    }

    // Update bounds (if we have data)
    const bounds = stepTracker.getBounds();
    if (bounds) {
        document.getElementById('tracker-bounds').style.display = 'block';
        document.getElementById('tracker-min-x').textContent = bounds.minX;
        document.getElementById('tracker-max-x').textContent = bounds.maxX;
        document.getElementById('tracker-min-z').textContent = bounds.minZ;
        document.getElementById('tracker-max-z').textContent = bounds.maxZ;
    } else {
        document.getElementById('tracker-bounds').style.display = 'none';
    }

    // Update steps list
    const listEl = document.getElementById('tracker-steps-list');
    if (stepTracker.steps.length === 0) {
        listEl.innerHTML = `
            <div style="color: #888; text-align: center; padding: 20px;">
                No steps recorded yet.<br>
                Click START to begin tracking.
            </div>
        `;
    } else {
        let html = '<table style="width: 100%; border-collapse: collapse;">';
        html += '<tr style="background: rgba(255,102,0,0.2); font-weight: bold;"><td>#</td><td>X</td><td>Y</td><td>Z</td><td>Dist</td></tr>';

        // Show last 20 steps (most recent first)
        const recentSteps = stepTracker.steps.slice(-20).reverse();
        recentSteps.forEach(step => {
            html += `
                <tr style="border-bottom: 1px solid rgba(255,102,0,0.2);">
                    <td>${step.step}</td>
                    <td>${step.x}</td>
                    <td>${step.y}</td>
                    <td>${step.z}</td>
                    <td style="color: #888;">${step.distance}</td>
                </tr>
            `;
        });

        if (stepTracker.steps.length > 20) {
            html += `<tr><td colspan="5" style="color: #888; text-align: center; padding: 5px;">... showing last 20 of ${stepTracker.steps.length} steps</td></tr>`;
        }

        html += '</table>';
        listEl.innerHTML = html;
    }
}

function removeStepTrackerDashboard() {
    if (stepTrackerDashboard) {
        stepTrackerDashboard.remove();
        stepTrackerDashboard = null;
    }
}

// ============================================================================
// COLLISION DETECTION
// ============================================================================

function checkCollisions() {
    if (!playerModel) return;

    // Check pickup collisions (only if pickups are enabled)
    // Don't pick up if already have an item, picking up, throwing, or pickups disabled
    if (pickupsEnabled && !PlayerController.isPickingUp && !PlayerController.isThrowing && !PlayerController.hasItem) {
        pickups.forEach(pickup => {
            if (pickup.active) {
                // Use actual position-based collision for reliable pickup detection
                const pickupPos = pickup.mesh.position;
                const playerPos = playerModel.position;

                // Check X distance (must be in same lane - within 1.5 units)
                const xDistance = Math.abs(pickupPos.x - playerPos.x);
                // Check Z distance (increased threshold for game speed reliability)
                const zDistance = Math.abs(pickupPos.z - playerPos.z);

                // RALPH FIX: Increased Z threshold from 2.5 to 3.5 for better detection at high speeds
                // Collision: within same lane (X < 1.5) and close enough on Z axis (< 3.5)
                if (xDistance < 1.5 && zDistance < 3.5) {
                    console.log(`✨ Pickup collision detected! xDist=${xDistance.toFixed(2)}, zDist=${zDistance.toFixed(2)}, pickupZ=${pickupPos.z.toFixed(2)}, playerZ=${playerPos.z.toFixed(2)}`);
                    // Collect pickup
                    GameState.score += 100;
                    pickupsCollected++;
                    console.log(`✨ Pickup collected! +100 (Total: ${pickupsCollected})`);

                    // Play pickup animation
                    PlayerController.startPickup();

                    // Remove pickup
                    pickup.deactivate();
                }
            }
        });
    }

    // Skip damage collisions if invincible
    if (PlayerController.isInvincible) return;

    // Check obstacle collisions
    // In chase mode: obstacles are safe UNTIL player throws for the first time
    // After first throw in chase mode, obstacles become dangerous
    const shouldCheckObstacleCollision = (GameState.selectedLevel !== 'chase') ||
                                         (GameState.selectedLevel === 'chase' && PlayerController.hasThrown);

    if (shouldCheckObstacleCollision && !PlayerController.isJumping) {
        obstacles.forEach(obstacle => {
            if (obstacle.active) {
                const distance = Math.abs(obstacle.mesh.position.z - playerModel.position.z);
                const sameColumn = obstacle.lane === PlayerController.targetLane;

                if (distance < 1.5 && sameColumn) {
                    console.log('💥 Player hit obstacle!');
                    handlePlayerHit();
                    obstacle.deactivate();
                }
            }
        });
    }

    // Check enemy collision
    if (enemyModel) {
        const distance = playerModel.position.distanceTo(enemyModel.position);
        if (distance < 2) {
            if (GameState.currentMode === 'CHASE') {
                GameState.score += 1000;
                console.log('Caught enemy! +1000');
                enemyModel.position.z = -20;
            } else {
                handlePlayerHit();
            }
        }
    }
}

function handlePlayerHit() {
    // GameState.lives--; // DISABLED - Unlimited lives for testing
    PlayerController.isInvincible = true;
    PlayerController.invincibilityTimer = 2;

    console.log(`Hit! Lives: ${GameState.lives} (unlimited)`);

    // Game over disabled with unlimited lives
    // if (GameState.lives <= 0) {
    //     gameOver();
    // }
}

// ============================================================================
// HELP OVERLAY
// ============================================================================

function toggleHelpOverlay() {
    helpOverlayVisible = !helpOverlayVisible;

    let helpDiv = document.getElementById('help-overlay');
    let backdrop = document.getElementById('help-backdrop');

    if (helpOverlayVisible) {
        // Create backdrop if it doesn't exist
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.id = 'help-backdrop';
            backdrop.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                z-index: 9999;
            `;
            backdrop.onclick = toggleHelpOverlay; // Click backdrop to close
            document.body.appendChild(backdrop);
        }

        // Create help overlay if it doesn't exist
        if (!helpDiv) {
            helpDiv = document.createElement('div');
            helpDiv.id = 'help-overlay';
            helpDiv.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.95);
                color: white;
                padding: 30px 40px;
                border-radius: 15px;
                border: 2px solid #4fc3f7;
                z-index: 10000;
                font-family: Arial, sans-serif;
                max-width: 500px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.8);
                pointer-events: auto;
            `;
            document.body.appendChild(helpDiv);
        }

        // Set content based on current level
        const isLevel1 = GameState.selectedLevel === 'chase';
        const isLevel2 = GameState.selectedLevel === 'shoot';

        helpDiv.innerHTML = `
            <h2 style="color: #4fc3f7; margin-bottom: 20px; text-align: center;">
                ${isLevel1 ? '🏃 Stage 1 Controls' : '🚗 Stage 2 Controls'}
            </h2>

            ${isLevel1 ? `
                <div style="margin-bottom: 15px;">
                    <div style="font-weight: bold; margin-bottom: 10px;">⌨️ Keyboard:</div>
                    <div style="margin-left: 20px; line-height: 1.8;">
                        <div><span style="color: #4fc3f7;">←</span> Arrow Left - Move to left lane</div>
                        <div><span style="color: #4fc3f7;">→</span> Arrow Right - Move to right lane</div>
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <div style="font-weight: bold; margin-bottom: 10px;">🖱️ Mouse:</div>
                    <div style="margin-left: 20px; line-height: 1.8;">
                        <div>Click left side of screen - Move left</div>
                        <div>Click right side of screen - Move right</div>
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <div style="font-weight: bold; margin-bottom: 10px;">📱 Touch:</div>
                    <div style="margin-left: 20px; line-height: 1.8;">
                        <div>Tap left side - Move left</div>
                        <div>Tap right side - Move right</div>
                    </div>
                </div>

                <div style="margin-bottom: 15px; padding: 15px; background: rgba(79, 195, 247, 0.1); border-radius: 8px; border-left: 3px solid #4fc3f7;">
                    <div style="font-weight: bold; margin-bottom: 5px; color: #4fc3f7;">💡 Tip:</div>
                    <div style="font-size: 14px; line-height: 1.6;">Jammer automatically jumps over barriers in his path!</div>
                </div>
            ` : `
                <div style="margin-bottom: 15px;">
                    <div style="font-weight: bold; margin-bottom: 10px;">⌨️ Keyboard:</div>
                    <div style="margin-left: 20px; line-height: 1.8;">
                        <div><span style="color: #4fc3f7;">↑ ↓ ← →</span> Arrow Keys - Move (8 directions)</div>
                        <div><span style="color: #4fc3f7;">Space</span> - Shoot</div>
                        <div style="opacity: 0.6; font-size: 12px; margin-top: 5px;">Advanced: 1-4 keys for manual rotation</div>
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <div style="font-weight: bold; margin-bottom: 10px;">🖱️ Mouse:</div>
                    <div style="margin-left: 20px; line-height: 1.8;">
                        <div>Click - Shoot</div>
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <div style="font-weight: bold; margin-bottom: 10px;">📱 Touch:</div>
                    <div style="margin-left: 20px; line-height: 1.8;">
                        <div>Swipe - Move in 8 directions</div>
                        <div>Tap - Shoot</div>
                    </div>
                </div>
            `}

            <div style="text-align: center; margin-top: 25px; padding-top: 20px; border-top: 1px solid #333; color: #888; font-size: 14px;">
                Press <span style="color: #4fc3f7;">H</span> to close
            </div>
        `;

        helpDiv.style.display = 'block';
        backdrop.style.display = 'block';
    } else {
        // Hide help overlay and backdrop
        if (helpDiv) {
            helpDiv.style.display = 'none';
        }
        if (backdrop) {
            backdrop.style.display = 'none';
        }
    }
}

// Also close help overlay with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && helpOverlayVisible) {
        toggleHelpOverlay();
    }
});

// ============================================================================
// UI OVERLAY
// ============================================================================

const UI = {
    overlay: null,

    init() {
        this.overlay = document.getElementById('ui-overlay');
        this.updateUI();
    },

    updateUI() {
        if (GameState.screen === 'START') {
            // START screen no longer shown - user navigates through index.html and select-stage.html
            // Keep overlay empty
            this.overlay.innerHTML = '';
        } else if (GameState.screen === 'PLAYING') {
            const modeColor = GameState.selectedLevel === 'shoot' ? 'rgba(33, 150, 243, 0.8)' :
                             GameState.currentMode === 'CHASE' ? 'rgba(79, 195, 247, 0.8)' : 'rgba(239, 83, 80, 0.8)';
            const modeText = GameState.selectedLevel === 'shoot' ? '🎬 ANIMATION TESTING' :
                            GameState.currentMode === 'CHASE' ? 'CHASE MODE' : '!!! RUN AWAY !!!';

            // Enemy health bar (only for chase mode)
            const healthBar = GameState.selectedLevel === 'chase' ? `
                <div style="position: absolute; top: 20px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.7); padding: 12px 20px; border-radius: 12px; min-width: 250px;">
                    <div style="color: #ef5350; font-size: 14px; margin-bottom: 8px; text-align: center; font-weight: bold;">OPPONENT</div>
                    <div style="width: 100%; height: 24px; background: rgba(255,255,255,0.2); border-radius: 12px; overflow: hidden; border: 2px solid rgba(255,255,255,0.3);">
                        <div id="enemy-health-bar" style="width: ${(EnemyController.health / EnemyController.maxHealth) * 100}%; height: 100%; background: linear-gradient(90deg, #ef5350, #e53935); transition: width 0.3s ease;"></div>
                    </div>
                </div>
            ` : '';

            // Show controls hint
            const controlsHint = `
                <div style="position: absolute; bottom: 20px; right: 20px; background: rgba(0,0,0,0.6); color: #888; padding: 8px 12px; border-radius: 8px; font-size: 12px; pointer-events: none;">
                    Press <span style="color: #4fc3f7;">H</span> for help
                </div>
            `;

            this.overlay.innerHTML = `
                <div style="display: none; position: absolute; top: 0; left: 0; width: 100%; padding: 10px; text-align: center; background: ${modeColor}; color: white; font-size: 24px; font-weight: bold;">
                    ${modeText}
                </div>
                ${healthBar}
                ${controlsHint}
            `;
        } else if (GameState.screen === 'GAMEOVER') {
            this.overlay.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; color: white; text-align: center; background: rgba(0,0,0,0.8);">
                    <h1 style="font-size: 48px; color: #ef5350; margin-bottom: 30px;">GAME OVER</h1>
                    <p style="font-size: 28px; margin-bottom: 10px;">Score: ${GameState.score}</p>
                    ${GameState.isNewHighScore ?
                        '<p style="font-size: 24px; color: #ffeb3b;">NEW HIGH SCORE!</p>' :
                        '<p style="font-size: 18px; color: #888;">Best: ' + GameState.highScore + '</p>'}
                    <p style="font-size: 24px; color: #4fc3f7; margin-top: 60px; pointer-events: all; cursor: pointer;" onclick="resetGame()">CLICK TO PLAY AGAIN</p>
                </div>
            `;
        }
    },

    updateEnemyHealthBar() {
        const healthBar = document.getElementById('enemy-health-bar');
        if (healthBar) {
            const healthPercent = (EnemyController.health / EnemyController.maxHealth) * 100;
            healthBar.style.width = healthPercent + '%';
        }
    }
};

// ============================================================================
// GAME FLOW
// ============================================================================

function selectLevel(level) {
    GameState.selectedLevel = level;
    console.log('Selected level:', level);

    if (level === 'chase') {
        GameState.isHorizontalMode = false;
        startGame();
    } else if (level === 'shoot') {
        GameState.isHorizontalMode = false;
        startShootingGame();
    } else if (level === 'shoot-horizontal') {
        GameState.isHorizontalMode = true;
        startShootingGame();
    }
}

function startGame() {
    // Default to chase mode if no level selected
    if (!GameState.selectedLevel) {
        GameState.selectedLevel = 'chase';
    }

    // Remove debug dashboards (only for Animation Testing mode)
    removeDebugDashboard();
    removeStepTrackerDashboard();

    console.log('Starting Stage 1...');

    GameState.screen = 'PLAYING';
    GameState.isRunning = false; // Keep game paused until loading completes
    GameState.score = 0;
    GameState.lives = 3;
    GameState.stageFrozen = false; // Ensure stage is not frozen at start
    PlayerController.init();
    EnemyController.init();
    ObstacleManager.reset();
    PickupManager.reset();

    // Check if characters are already loaded
    const charactersAlreadyLoaded = playerModel && enemyModel;

    if (charactersAlreadyLoaded) {
        // Characters already loaded, start game immediately
        console.log('Stage 1 assets already loaded, starting immediately');
        GameState.isRunning = true;
        UI.updateUI();

        // Enable pickups after 2 seconds (game is now visible)
        setTimeout(() => {
            pickupsEnabled = true;
        }, 2000);

        // Start music after a brief delay to ensure everything is ready
        setTimeout(() => {
            MusicController.playLevel1Music();
        }, 100);
    } else {
        // Load characters if needed - game will start when both are loaded
        console.log('Loading Stage 1 characters...');

        // Load Jammer character for Level 1 if not already loaded
        if (!playerModel) {
            loadPlayerCharacter();
        }
        // Load enemy character for Level 1 if not already loaded
        if (!enemyModel) {
            loadEnemyCharacter();
        }
        // Load cola can for throwing
        if (!colaCanTemplate) {
            loadColaCanModel();
        }

        // Characters will load asynchronously
        // Game will start when both finish loading via checkStage1AssetsLoaded()
    }

    console.log('Starting game with level:', GameState.selectedLevel);
}

function startShootingGame() {
    // Don't override selectedLevel - it's already set by selectLevel()
    // Keep it as 'shoot' or 'shoot-horizontal' as selected
    if (!GameState.selectedLevel || GameState.selectedLevel === 'chase') {
        GameState.selectedLevel = 'shoot';
    }
    GameState.screen = 'PLAYING';
    GameState.isRunning = true;
    GameState.score = 0;
    GameState.lives = 3;
    GameState.stageCompleted = false; // Reset stage completion

    console.log('Starting Animation Testing mode...');
    console.log('Horizontal mode:', GameState.isHorizontalMode);

    // Stop level 1 music when switching to level 2
    MusicController.stopAll();

    // Show Stage 2 loading screen
    Stage2LoadingScreen.show();

    // Clear any existing chase mode objects
    if (playerModel) scene.remove(playerModel);
    if (enemyModel) scene.remove(enemyModel);
    obstacles.forEach(obs => obs.deactivate());
    obstacles.length = 0;

    // Clear road segments (simple)
    roadSegments.forEach(segment => {
        scene.remove(segment.mesh);
    });
    roadSegments.length = 0;

    // Clear 3D road models
    roadModels.forEach(roadModel => {
        scene.remove(roadModel);
    });
    roadModels.length = 0;

    // Build the testing ground
    buildTestingGround();

    // RALPH FIX: Don't set hardcoded camera position here
    // Camera will be positioned correctly when tunnel/officer finish loading
    // Initial default camera (will be overridden)
    camera.position.set(0, 8, 15);
    camera.lookAt(0, 0, 0);

    // Load officer character
    loadOfficerCharacter();

    // Don't initialize horizontal controls here - wait for loading to complete
    // They will be initialized in stage2LoadingManager.onLoad

    // Don't update UI yet - wait for Stage 2 loading to complete
    // UI.updateUI();

    // Debug dashboards removed for production
    // createDebugDashboard();
    // createStepTrackerDashboard();
}

function gameOver() {
    GameState.screen = 'GAMEOVER';
    GameState.isRunning = false;

    // Stop all music
    MusicController.stopAll();

    if (GameState.score > GameState.highScore) {
        GameState.highScore = GameState.score;
        GameState.isNewHighScore = true;
        localStorage.setItem('gaptag_highscore', GameState.highScore);
    } else {
        GameState.isNewHighScore = false;
    }

    UI.updateUI();
}

function resetGame() {
    // Clean up horizontal controls if they were active
    if (HorizontalControls.isActive) {
        HorizontalControls.destroy();
    }
    GameState.isHorizontalMode = false;

    // Clean up held can if it exists
    if (heldCanModel && playerModel) {
        playerModel.remove(heldCanModel);
        heldCanModel = null;
        console.log('🥤 Held can cleaned up on game reset');
    }

    startGame();
}

function loadHighScore() {
    const saved = localStorage.getItem('gaptag_highscore');
    GameState.highScore = saved ? parseInt(saved, 10) : 0;
}

function triggerStageCompletion() {
    if (GameState.stageCompleted) return; // Prevent retriggering

    GameState.stageCompleted = true;
    GameState.isRunning = false;

    console.log('🎉 STAGE COMPLETED!');

    // Create black overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: black;
        opacity: 0;
        z-index: 10000;
        transition: opacity 2s ease-in;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    // Create completion message (hidden initially)
    const message = document.createElement('div');
    message.style.cssText = `
        color: white;
        font-size: 48px;
        font-family: Arial, sans-serif;
        font-weight: bold;
        text-align: center;
        opacity: 0;
        transition: opacity 1s ease-in;
        text-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
    `;
    message.textContent = 'STAGE COMPLETED';

    overlay.appendChild(message);
    document.body.appendChild(overlay);

    // Trigger fade to black
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 50);

    // Show message after fade completes
    setTimeout(() => {
        message.style.opacity = '1';
    }, 2500);
}

// ============================================================================
// MAIN GAME LOOP
// ============================================================================

function animate() {
    requestAnimationFrame(animate);

    const rawDelta = clock.getDelta();
    const delta = rawDelta * GameState.timeScale; // Apply slow motion

    // EMERGENCY SAFETY CHECK: Detect and fix stuck gameSpeed
    // Track when gameSpeed was set to 0
    if (GameState.gameSpeed === 0) {
        if (!GameState.gameSpeedZeroTime) {
            GameState.gameSpeedZeroTime = Date.now();
        }

        const timeStuck = Date.now() - GameState.gameSpeedZeroTime;

        // If gameSpeed 0 but not throwing/frozen, recover immediately
        if (!PlayerController.isThrowing && !GameState.stageFrozen) {
            console.error('🚨 EMERGENCY: gameSpeed stuck at 0 outside of throw/freeze state! Auto-recovering...');
            GameState.gameSpeed = GAME_SPEED;
            GameState.gameSpeedZeroTime = null;
            console.log('⚡ EMERGENCY: Restored gameSpeed to', GAME_SPEED);
        }
        // If stuck for more than 10 seconds even while "throwing", force recovery
        else if (timeStuck > 10000) {
            console.error('🚨 EMERGENCY: gameSpeed stuck at 0 for 10+ seconds! Forcing recovery...');
            console.error('   isThrowing:', PlayerController.isThrowing, 'stageFrozen:', GameState.stageFrozen);
            GameState.gameSpeed = GAME_SPEED;
            GameState.gameSpeedZeroTime = null;
            // Also force clear stuck states
            PlayerController.isThrowing = false;
            PlayerController.hasItem = false;
            PlayerController.isPickingUp = false;
            GameState.stageFrozen = false;
            console.log('⚡ EMERGENCY: Forced full state reset');
        }
    } else {
        // gameSpeed is not 0, clear the timer
        GameState.gameSpeedZeroTime = null;
    }

    // Always update animations so they loop smoothly regardless of game state
    if (playerMixer) playerMixer.update(delta);
    if (enemyMixer) enemyMixer.update(delta);
    if (shooterMixer) {
        shooterMixer.update(delta);
        // Debug: Log mixer state occasionally
        if (!window._mixerDebugCounter) window._mixerDebugCounter = 0;
        window._mixerDebugCounter++;
        if (window._mixerDebugCounter % 120 === 0) { // Every ~2 seconds at 60fps
            console.log('[MIXER DEBUG] Shooter mixer updating, delta:', delta.toFixed(4), 'actions:', shooterMixer._actions.length);
        }
    }

    // Rotate sky dome for motion illusion (only in Level 1)
    if (skyDome && SKY_DOME_CONFIG.enabled && GameState.selectedLevel === 'chase') {
        skyDome.rotation.y += SKY_DOME_CONFIG.rotationSpeed;

        // Make sky dome follow camera (stay centered on player)
        skyDome.position.x = camera.position.x;
        skyDome.position.y = camera.position.y;
        skyDome.position.z = camera.position.z;
    }

    // Update hazard lights flashing
    // updateHazardLights(delta); // Disabled - removing amber lights per user request

    // Apply gun controls every frame for real-time dashboard updates
    if (subMachineGun && GameState.selectedLevel === 'shoot') {
        // Auto-detect officer facing direction and update gun accordingly
        if (shooterModel) {
            const rotation = shooterModel.rotation.y;
            // Normalize rotation to 0-2π range
            const normalizedRotation = ((rotation % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);

            // Determine direction based on rotation (in degrees for clarity)
            const degrees = normalizedRotation * 180 / Math.PI;
            let direction = 'forward';

            // Forward: 315° to 45° (0° ± 45°)
            if (degrees >= 315 || degrees < 45) {
                direction = 'forward';
            }
            // Right: 45° to 135° (90° ± 45°)
            else if (degrees >= 45 && degrees < 135) {
                direction = 'right';
            }
            // Backward: 135° to 225° (180° ± 45°)
            else if (degrees >= 135 && degrees < 225) {
                direction = 'backward';
            }
            // Left: 225° to 315° (270° ± 45°)
            else if (degrees >= 225 && degrees < 315) {
                direction = 'left';
            }

            GunControls.updateForDirection(direction);
        }

        subMachineGun.rotation.set(GunControls.rotationX, GunControls.rotationY, GunControls.rotationZ);
        subMachineGun.position.set(GunControls.positionX, GunControls.positionY, GunControls.positionZ);
        subMachineGun.scale.set(GunControls.scale, GunControls.scale, GunControls.scale);
    }

    if (GameState.screen === 'PLAYING' && GameState.isRunning) {
        // Update score
        GameState.score += Math.floor(delta * 10);

        if (GameState.selectedLevel === 'chase') {
            // CHASE MODE logic
            PlayerController.update(delta);
            EnemyController.update(delta);

            // Only update stage elements if not frozen (during enemy fall animation)
            if (!GameState.stageFrozen) {
                ObstacleManager.update(delta);
                PickupManager.update(delta);
                EnvironmentManager.update(delta);
            }

            checkCollisions();

            // Update camera to follow player, thrown item, or enemy reaction
            if (PlayerController.isFollowingEnemyReaction && enemyModel) {
                // ENEMY HIT REACTION CLOSE-UP - zoom in on enemy
                const enemy = enemyModel;
                const closeUpDistance = 5; // Much closer to enemy
                const sideOffset = 3; // Slightly to side for better angle
                const cameraHeight = 2; // At chest/face level

                camera.position.x = enemy.position.x + sideOffset;
                camera.position.y = enemy.position.y + cameraHeight;
                camera.position.z = enemy.position.z + closeUpDistance; // Behind enemy, looking forward

                // Look at enemy's upper body/face
                camera.lookAt(enemy.position.x, enemy.position.y + 1.5, enemy.position.z);
            } else if (PlayerController.isFollowingThrowItem && PlayerController.activeThrownItem) {
                // Cinematic camera - SIDE VIEW to see can traveling toward enemy
                const item = PlayerController.activeThrownItem;
                const sideOffset = 6; // Reduced from 8 - closer to see enemy better
                const cameraHeight = 1.5; // Slightly higher view
                const depthOffset = 2; // Closer to capture both can and enemy

                camera.position.x = item.position.x + sideOffset; // Move camera to the SIDE
                camera.position.y = item.position.y + cameraHeight;
                camera.position.z = item.position.z + depthOffset; // Slightly behind to capture both

                // Look slightly ahead of item to see enemy in frame
                camera.lookAt(item.position.x, item.position.y, item.position.z - 8);
            } else if (playerModel) {
                // CLOSE-UP camera following player FROM BEHIND (user requested this view as default)
                // Camera positioned directly behind player, looking forward
                const sideOffset = 0; // NO side offset - directly behind
                const cameraHeight = 3; // Higher for better view over shoulder
                const behindDistance = 6; // 6 units behind player

                camera.position.x = playerModel.position.x + sideOffset;
                camera.position.y = playerModel.position.y + cameraHeight;
                camera.position.z = playerModel.position.z + behindDistance;

                // Look at player's upper body/head area
                camera.lookAt(playerModel.position.x, playerModel.position.y + 1.5, playerModel.position.z);
            }

            // Only update UI for chase mode (score display)
            UI.updateUI();
        } else if (GameState.selectedLevel === 'shoot') {
            // ANIMATION TESTING MODE
            MazeController.update(delta);

            // Check for stage completion
            if (!GameState.stageCompleted && camera.position.z >= 150) {
                triggerStageCompletion();
            }

            // Update bullets
            for (let i = bullets.length - 1; i >= 0; i--) {
                const bullet = bullets[i];
                bullet.userData.lifetime += delta;

                // Move bullet
                bullet.position.add(bullet.userData.velocity.clone().multiplyScalar(delta));

                // Remove if expired or out of bounds
                if (bullet.userData.lifetime >= bullet.userData.maxLifetime ||
                    Math.abs(bullet.position.x) > 100 ||
                    Math.abs(bullet.position.z) > 100) {
                    scene.remove(bullet);
                    // Dispose geometry and material to prevent memory leaks
                    if (bullet.geometry) bullet.geometry.dispose();
                    if (bullet.material) bullet.material.dispose();
                    bullets.splice(i, 1);
                }
            }

            // Update smoke particles
            for (let i = smokeParticles.length - 1; i >= 0; i--) {
                const smoke = smokeParticles[i];
                smoke.userData.lifetime += delta;

                // Move smoke
                smoke.position.add(smoke.userData.velocity.clone().multiplyScalar(delta));

                // Expand and fade out
                const lifeProgress = smoke.userData.lifetime / smoke.userData.maxLifetime;
                smoke.scale.setScalar(1 + lifeProgress * 2); // Grow larger
                smoke.material.opacity = 0.6 * (1 - lifeProgress); // Fade out

                // Slow down
                smoke.userData.velocity.multiplyScalar(0.95);

                // Remove if expired
                if (smoke.userData.lifetime >= smoke.userData.maxLifetime) {
                    scene.remove(smoke);
                    // Dispose geometry and material to prevent memory leaks
                    if (smoke.geometry) smoke.geometry.dispose();
                    if (smoke.material) smoke.material.dispose();
                    smokeParticles.splice(i, 1);
                }
            }

            // Update bullet casings
            const gravity = -9.8;
            const groundLevel = 0.15; // Height of casing cylinder when on ground
            const bounceDamping = 0.4; // Energy loss on bounce

            for (let i = bulletCasings.length - 1; i >= 0; i--) {
                const casing = bulletCasings[i];
                casing.userData.lifetime += delta;

                if (!casing.userData.onGround) {
                    // Apply gravity
                    casing.userData.velocity.y += gravity * delta;

                    // Update position
                    casing.position.add(casing.userData.velocity.clone().multiplyScalar(delta));

                    // Rotate (tumbling)
                    casing.rotation.x += casing.userData.rotationVelocity.x * delta;
                    casing.rotation.y += casing.userData.rotationVelocity.y * delta;
                    casing.rotation.z += casing.userData.rotationVelocity.z * delta;

                    // Check if hit ground
                    if (casing.position.y <= groundLevel) {
                        casing.position.y = groundLevel;

                        // Bounce
                        if (Math.abs(casing.userData.velocity.y) > 0.5) {
                            casing.userData.velocity.y = -casing.userData.velocity.y * bounceDamping;
                            casing.userData.velocity.x *= 0.8;
                            casing.userData.velocity.z *= 0.8;
                            casing.userData.rotationVelocity.multiplyScalar(0.6);
                        } else {
                            // Settled on ground
                            casing.userData.onGround = true;
                            casing.userData.velocity.set(0, 0, 0);
                            casing.userData.rotationVelocity.set(0, 0, 0);
                        }
                    }
                }

                // Remove old casings after 30 seconds
                if (casing.userData.lifetime > 30) {
                    scene.remove(casing);
                    // Dispose geometry and material to prevent memory leaks
                    if (casing.geometry) casing.geometry.dispose();
                    if (casing.material) casing.material.dispose();
                    bulletCasings.splice(i, 1);
                }
            }

            // Update car damage system (smoke, fire, bullet collision)
            // updateCarDamageSystem(delta); // TODO: Implement damage system

            // Camera follows character from behind - tunnel runs along Z-axis at Y=-5
            if (shooterModel) {
                const cameraOffsetY = 3;   // Height above character
                const cameraOffsetZ = 6;   // Distance behind character (reduced from 12 for closer view)

                // RALPH FIX: Character now faces toward EXIT (positive Z)
                // So camera should be BEHIND (lower Z) looking FORWARD (higher Z)
                camera.position.set(
                    shooterModel.position.x,
                    shooterModel.position.y + cameraOffsetY,
                    shooterModel.position.z - cameraOffsetZ  // BEHIND = lower Z
                );

                // Look ahead toward the exit (positive Z direction)
                camera.lookAt(
                    shooterModel.position.x,
                    shooterModel.position.y,
                    shooterModel.position.z + 20  // FORWARD = higher Z
                );
            } else {
                // Default camera position
                camera.position.set(0, 8, 15);
                camera.lookAt(0, 0, 0);
            }

            // DO NOT call UI.updateUI() every frame for shoot mode!
            // This would destroy and recreate the gun dashboard sliders,
            // making them impossible to interact with.
            // The UI is set once when starting shoot mode.

            // RALPH: Update debug position dashboard
            updateDebugDashboard();

            // RALPH: Record step tracker data
            stepTracker.record(delta);
        }
    }

    renderer.render(scene, camera);
}

// ============================================================================
// INITIALIZATION
// ============================================================================

function init() {
    console.log('Merkle Man - Initializing...');

    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky blue - bright default

    // RALPH: Expose scene for debugging
    window.scene = scene;

    // Create camera (3rd person view)
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        5000  // Increased far plane to see sky dome
    );
    // Initial close-up camera position (will update to follow player)
    camera.position.set(3, 3, 5);
    camera.lookAt(0, 1.5, 0);

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Enhanced rendering for realistic lighting
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2; // Slightly brighter exposure
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    document.body.appendChild(renderer.domElement);

    // Clock for animations
    clock = new THREE.Clock();

    // Initialize systems
    Input.init();
    UI.init();
    MusicController.init();
    loadHighScore();
    // createCarDashboard(); // Disabled - using position tracker instead

    // No intro music - removed per user request

    // Check URL parameters - auto-start Animation Testing if collision version specified
    const urlParams = new URLSearchParams(window.location.search);
    let collisionVersion = urlParams.get('v') || urlParams.get('version');

    // DEFAULT: If no parameter, auto-use V2 collision
    if (collisionVersion === null) {
        collisionVersion = '2';
        console.log('🎯 No URL parameter - defaulting to V2 collision');

        // Update URL to show ?v=2
        const url = new URL(window.location);
        url.searchParams.set('v', '2');
        window.history.replaceState({}, '', url);
    }

    // Check if user wants to auto-start a specific mode
    const modeParam = urlParams.get('mode');
    const shouldAutoStart = modeParam === 'test';

    // Always initialize environment and characters for level selection
    EnvironmentManager.init();
    ObstacleManager.init();
    PickupManager.init();
    // loadPlayerCharacter(); // Disabled - only showing officer character
    // loadEnemyCharacter(); // Disabled - only showing officer character

    // No loading screen on game.html - using select-stage.html loading screen instead
    // Just update UI if on start screen
    setTimeout(() => {
        if (GameState.screen === 'START') {
            UI.updateUI();
        }
    }, 500);

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Check if this is a preload (loading in background iframe)
    const preloadParam = urlParams.get('preload');
    const isPreloading = preloadParam === 'true';

    if (isPreloading) {
        console.log('🔄 Preloading game assets in background...');
        // Preload mode: just load assets, don't start game
        const levelParam = urlParams.get('level');
        if (levelParam === '1') {
            // Preload Level 1 assets
            GameState.selectedLevel = 'chase';
            if (!playerModel) loadPlayerCharacter();
            if (!enemyModel) loadEnemyCharacter();
            if (!colaCanTemplate) loadColaCanModel();
            // Sky dome already loaded by EnvironmentManager.init()
        }
        // Start animation loop but don't show UI
        animate();
        console.log('✅ Preload started - assets loading in background');
        return;
    }

    // Check for level parameter and auto-start the game
    const levelParam = urlParams.get('level');
    if (levelParam === '1') {
        console.log('🎯 Auto-starting Mission 01 (Chase Mode)');
        setTimeout(() => {
            startGame();
        }, 100);
    } else if (levelParam === '2') {
        console.log('🎯 Auto-starting Mission 02 (Shoot Mode)');
        setTimeout(() => {
            startShootingGame();
        }, 100);
    } else if (shouldAutoStart) {
        // Auto-start Animation Testing only if mode=test parameter is present
        console.log('🎯 Auto-starting Animation Testing mode (mode=test detected)');
        startShootingGame();
    } else {
        console.log('📋 Level selection menu will show after loading completes');
        GameState.screen = 'START';
        GameState.isRunning = false;
        // Don't call UI.updateUI() here - it will be called after loading completes
    }

    // Start animation loop
    animate();

    console.log('Merkle Man - Ready!');
}

// ============================================================================
// CAR DASHBOARD CONTROLS
// ============================================================================


// Make functions and car objects global for UI
window.selectLevel = selectLevel;
window.startGame = startGame;
window.resetGame = resetGame;

// Expose car objects for dashboard (they update when loaded)
window.getCarObjects = () => ({
    bmwM8Car,
    bmwX6M,
    porscheCar,
    vwTCross,
    vwTCrossTSI,
    audiRS6,
    roverEvoque,
    mercA45,
    fordFiesta
});

// No initial loading screen - using select-stage.html loading screen instead

// Start when ready
if (document.readyState === 'complete') {
    init();
} else {
    window.addEventListener('load', init);
}
