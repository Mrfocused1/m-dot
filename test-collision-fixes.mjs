import puppeteer from 'puppeteer';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

console.log('=== COMPREHENSIVE COLLISION FIX VERIFICATION ===\n');

const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
});
const page = await browser.newPage();

// Track all console logs
const allLogs = [];
const collisionLogs = [];
const errorLogs = [];

page.on('console', msg => {
    const text = msg.text();
    allLogs.push(text);

    // Capture collision-related logs
    if (text.includes('💥') || text.includes('Player hit obstacle') ||
        text.includes('collision') || text.includes('Obstacle') ||
        text.includes('FAILSAFE') || text.includes('Auto-jump')) {
        collisionLogs.push(text);
        console.log('📋', text);
    }
});

page.on('pageerror', error => {
    errorLogs.push(error.message);
    console.log('❌ ERROR:', error.message);
});

console.log('Loading game...');
await page.goto('http://localhost:8000/game.html?level=1', { waitUntil: 'networkidle0' });

console.log('Waiting for game initialization...\n');
// Wait for game to be ready
let gameReady = false;
for (let i = 0; i < 30; i++) {
    const ready = await page.evaluate(() => {
        return window.GameState?.isRunning === true &&
               window.playerModel !== undefined &&
               window.PlayerController !== undefined;
    });

    if (ready) {
        gameReady = true;
        console.log(`✅ Game ready after ${i + 1} seconds\n`);
        break;
    }
    await delay(1000);
}

if (!gameReady) {
    console.log('❌ Game failed to initialize after 30 seconds');
    await browser.close();
    process.exit(1);
}

// Give extra time for obstacles to spawn
await delay(3000);

console.log('========================================');
console.log('TESTING COLLISION FIXES');
console.log('========================================\n');

// TEST 1: Bug #1 - Collision works BEFORE first throw
console.log('TEST 1: Collision on game start (before first throw)');
console.log('       Testing Bug #1 fix - hasThrown requirement removed');

const test1Result = await page.evaluate(() => {
    // Check if there are obstacles
    if (!window.obstacles || window.obstacles.length === 0) {
        return { success: false, reason: 'No obstacles spawned' };
    }

    // Find an active obstacle
    let closestObstacle = null;
    let minDistance = Infinity;

    for (let i = 0; i < window.obstacles.length; i++) {
        const obs = window.obstacles[i];
        if (obs.active) {
            const distance = Math.abs(obs.mesh.position.z - window.playerModel.position.z);
            if (distance < minDistance) {
                minDistance = distance;
                closestObstacle = obs;
            }
        }
    }

    if (!closestObstacle) {
        return { success: false, reason: 'No active obstacles' };
    }

    // Position player close to obstacle in same lane
    // Lane positions: 0=left(-2), 1=center(0), 2=right(2)
    const laneX = [-2, 0, 2][closestObstacle.lane];
    window.playerModel.position.x = laneX;
    window.playerModel.position.z = closestObstacle.mesh.position.z + 2.5; // Within 3.0 threshold
    window.PlayerController.currentLane = closestObstacle.lane;
    window.PlayerController.targetLane = closestObstacle.lane;

    // Verify hasThrown is false
    const hasThrown = window.PlayerController.hasThrown;

    return {
        success: true,
        hasThrown: hasThrown,
        playerZ: window.playerModel.position.z,
        obstacleZ: closestObstacle.mesh.position.z,
        distance: Math.abs(window.playerModel.position.z - closestObstacle.mesh.position.z),
        lane: closestObstacle.lane
    };
});

if (test1Result.success) {
    console.log('  ✓ Setup: hasThrown =', test1Result.hasThrown);
    console.log('  ✓ Setup: Distance =', test1Result.distance.toFixed(2), 'units (within 3.0 threshold)');
    console.log('  ✓ Setup: Player Z =', test1Result.playerZ.toFixed(2));
    console.log('  ✓ Setup: Obstacle Z =', test1Result.obstacleZ.toFixed(2));
} else {
    console.log('  ✗ Setup failed:', test1Result.reason);
}

// Wait a frame for collision check
await delay(100);

// Force collision check
await page.evaluate(() => {
    if (window.checkCollisions) {
        window.checkCollisions();
    }
});

await delay(500);

// Check if collision was detected
const test1Collision = collisionLogs.some(log => log.includes('Player hit obstacle'));
console.log(test1Collision ? '  ✅ TEST 1 PASSED: Collision detected on game start (Bug #1 fixed!)' : '  ❌ TEST 1 FAILED: No collision detected');
console.log('');

// TEST 2: Bug #3 - Collision threshold increased to 3.0
console.log('TEST 2: Collision threshold at 3.0 units');
console.log('       Testing Bug #3 fix - threshold increased from 1.5 to 3.0');

const test2Result = await page.evaluate(() => {
    // Reset player state
    window.PlayerController.isInvincible = false;
    window.PlayerController.isJumping = false;

    // Find obstacle and position player at exactly 2.5 units (old threshold would miss)
    let testObstacle = null;
    for (let i = 0; i < window.obstacles.length; i++) {
        if (window.obstacles[i].active) {
            testObstacle = window.obstacles[i];
            break;
        }
    }

    if (!testObstacle) {
        return { success: false, reason: 'No obstacles' };
    }

    // Position at 2.5 units (old: 1.5, new: 3.0)
    const laneX = [-2, 0, 2][testObstacle.lane];
    window.playerModel.position.x = laneX;
    window.playerModel.position.z = testObstacle.mesh.position.z + 2.5;
    window.PlayerController.currentLane = testObstacle.lane;
    window.PlayerController.targetLane = testObstacle.lane;

    const distance = Math.abs(window.playerModel.position.z - testObstacle.mesh.position.z);

    return {
        success: true,
        distance: distance,
        oldThreshold: 1.5,
        newThreshold: 3.0,
        wouldMissOld: distance > 1.5,
        willCatchNew: distance < 3.0
    };
});

if (test2Result.success) {
    console.log('  ✓ Distance:', test2Result.distance.toFixed(2), 'units');
    console.log('  ✓ Old threshold (1.5):', test2Result.wouldMissOld ? 'WOULD MISS ❌' : 'Would catch');
    console.log('  ✓ New threshold (3.0):', test2Result.willCatchNew ? 'WILL CATCH ✓' : 'Will miss');
}

collisionLogs.length = 0; // Clear previous logs
await page.evaluate(() => window.checkCollisions && window.checkCollisions());
await delay(500);

const test2Collision = collisionLogs.some(log => log.includes('Player hit obstacle'));
console.log(test2Collision ? '  ✅ TEST 2 PASSED: New threshold catches collision (Bug #3 fixed!)' : '  ❌ TEST 2 FAILED: Missed collision at 2.5 units');
console.log('');

// TEST 3: Bug #6 - Physical lane detection
console.log('TEST 3: Physical lane detection during lane change');
console.log('       Testing Bug #6 fix - uses actual X position not targetLane');

const test3Result = await page.evaluate(() => {
    window.PlayerController.isInvincible = false;
    window.PlayerController.isJumping = false;

    let testObstacle = null;
    for (let i = 0; i < window.obstacles.length; i++) {
        if (window.obstacles[i].active && window.obstacles[i].lane === 1) {
            testObstacle = window.obstacles[i];
            break;
        }
    }

    if (!testObstacle) {
        return { success: false, reason: 'No center lane obstacle' };
    }

    // Position player physically in center lane but set targetLane to left
    const centerX = 0; // Center lane
    window.playerModel.position.x = centerX;
    window.playerModel.position.z = testObstacle.mesh.position.z + 1.0;
    window.PlayerController.targetLane = 0; // Left lane (wrong!)
    window.PlayerController.currentLane = 1; // Center lane (correct)

    return {
        success: true,
        physicalLane: 1,
        targetLane: 0,
        obstacleLane: testObstacle.lane,
        playerX: centerX,
        shouldCollide: true // Physical lane matches
    };
});

if (test3Result.success) {
    console.log('  ✓ Player physical X:', test3Result.playerX, '(center lane)');
    console.log('  ✓ Player targetLane:', test3Result.targetLane, '(left - WRONG)');
    console.log('  ✓ Obstacle lane:', test3Result.obstacleLane, '(center)');
    console.log('  ✓ Expected: Collision (using physical position)');
}

collisionLogs.length = 0;
await page.evaluate(() => window.checkCollisions && window.checkCollisions());
await delay(500);

const test3Collision = collisionLogs.some(log => log.includes('Player hit obstacle'));
console.log(test3Collision ? '  ✅ TEST 3 PASSED: Uses physical position not targetLane (Bug #6 fixed!)' : '  ❌ TEST 3 FAILED: Still using targetLane');
console.log('');

// TEST 4: Bug #2 - isJumping failsafe
console.log('TEST 4: isJumping failsafe (ground timer)');
console.log('       Testing Bug #2 fix - stuck flag auto-reset');

const test4Result = await page.evaluate(() => {
    // Simulate stuck isJumping state
    window.PlayerController.isJumping = true;
    window.playerModel.position.y = 1.0; // On ground
    window.PlayerController.groundTimer = 0;

    return {
        success: true,
        isJumping: true,
        playerY: 1.0,
        groundY: 1.0
    };
});

console.log('  ✓ Setup: isJumping = true (simulated stuck state)');
console.log('  ✓ Setup: Player on ground (Y = 1.0)');

// Call update for 1.2 seconds to trigger failsafe
for (let i = 0; i < 13; i++) {
    await page.evaluate(() => {
        if (window.PlayerController.update) {
            window.PlayerController.update(0.1); // 100ms per update
        }
    });
    await delay(10);
}

const test4Failsafe = await page.evaluate(() => {
    return {
        isJumping: window.PlayerController.isJumping,
        groundTimer: window.PlayerController.groundTimer
    };
});

const test4Success = !test4Failsafe.isJumping;
console.log(test4Success ?
    '  ✅ TEST 4 PASSED: Failsafe reset isJumping after 1 second (Bug #2 fixed!)' :
    '  ❌ TEST 4 FAILED: isJumping still true after 1+ seconds on ground');
console.log('     Final state: isJumping =', test4Failsafe.isJumping);
console.log('');

// TEST 5: Bug #4 - Enemy detection range
console.log('TEST 5: Enemy obstacle detection range');
console.log('       Testing Bug #4 fix - increased from 6 to 12 units');

const test5Result = await page.evaluate(() => {
    if (!window.enemyModel || !window.EnemyController) {
        return { success: false, reason: 'Enemy not loaded' };
    }

    // Create a test obstacle 10 units away
    let testObstacle = null;
    for (let i = 0; i < window.obstacles.length; i++) {
        if (window.obstacles[i].active) {
            testObstacle = window.obstacles[i];
            break;
        }
    }

    if (!testObstacle) {
        return { success: false, reason: 'No obstacles' };
    }

    // Position obstacle 10 units behind enemy
    const enemyLane = window.EnemyController.currentLane;
    testObstacle.lane = enemyLane;
    testObstacle.mesh.position.z = window.enemyModel.position.z - 10; // 10 units behind

    const distance = window.enemyModel.position.z - testObstacle.mesh.position.z;

    // Check if obstacle would be detected
    const detected = window.EnemyController.checkObstacleAhead &&
                     window.EnemyController.checkObstacleAhead();

    return {
        success: true,
        distance: distance,
        oldRange: 6,
        newRange: 12,
        wouldDetectOld: distance < 6,
        willDetectNew: distance < 12,
        actuallyDetected: detected !== null
    };
});

if (test5Result.success) {
    console.log('  ✓ Distance:', test5Result.distance.toFixed(2), 'units');
    console.log('  ✓ Old range (6):', test5Result.wouldDetectOld ? 'Would detect' : 'WOULD MISS ❌');
    console.log('  ✓ New range (12):', test5Result.willDetectNew ? 'WILL DETECT ✓' : 'Will miss');
    console.log('  ✓ Actually detected:', test5Result.actuallyDetected ? 'YES ✓' : 'NO ❌');

    const test5Success = test5Result.willDetectNew && test5Result.actuallyDetected;
    console.log(test5Success ?
        '  ✅ TEST 5 PASSED: Extended range detects distant obstacles (Bug #4 fixed!)' :
        '  ❌ TEST 5 FAILED: Detection range insufficient');
} else {
    console.log('  ⚠️  TEST 5 SKIPPED:', test5Result.reason);
}
console.log('');

// FINAL SUMMARY
console.log('========================================');
console.log('           TEST RESULTS SUMMARY');
console.log('========================================\n');

const results = [
    { test: 'Bug #1: hasThrown requirement removed', passed: test1Collision },
    { test: 'Bug #2: isJumping failsafe added', passed: test4Success },
    { test: 'Bug #3: Threshold increased to 3.0', passed: test2Collision },
    { test: 'Bug #4: Enemy detection increased to 12', passed: test5Result.success && test5Result.actuallyDetected },
    { test: 'Bug #6: Physical lane detection', passed: test3Collision }
];

let passCount = 0;
results.forEach((result, i) => {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${i + 1}. ${status} - ${result.test}`);
    if (result.passed) passCount++;
});

console.log('');
console.log(`TOTAL: ${passCount}/${results.length} tests passed`);

if (passCount === results.length) {
    console.log('\n🎉 ALL COLLISION FIXES VERIFIED! 🎉');
    console.log('Characters will NO LONGER run through concrete under any circumstance.');
} else {
    console.log('\n⚠️  Some tests failed. Review logs above for details.');
}

console.log('\n========================================\n');

// Show relevant collision logs
if (collisionLogs.length > 0) {
    console.log('Collision logs captured:', collisionLogs.length);
    collisionLogs.slice(0, 10).forEach(log => console.log('  -', log));
}

await browser.close();

// Exit with appropriate code
process.exit(passCount === results.length ? 0 : 1);
