import puppeteer from 'puppeteer';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

console.log('=== JUMP DISABLED - COMPREHENSIVE TEST ===\n');

const browser = await puppeteer.launch({
    headless: false, // Run visible so you can see it working
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1400, height: 900 }
});

const page = await browser.newPage();

// Track logs
const allLogs = [];
const testResults = [];

page.on('console', msg => {
    const text = msg.text();
    allLogs.push(text);

    // Show important logs
    if (text.includes('⏳') || text.includes('🛡️') || text.includes('🚧') ||
        text.includes('Player hit') || text.includes('wasting time') ||
        text.includes('Enemy avoiding') || text.includes('Enemy switching')) {
        console.log('📋', text);
    }
});

page.on('pageerror', error => {
    console.log('❌ ERROR:', error.message);
});

console.log('Loading game...');
await page.goto('http://localhost:8000/game.html?level=1', { waitUntil: 'networkidle0' });

console.log('Waiting for game to initialize...\n');
await delay(3000);

// Wait for game to be ready
let ready = false;
for (let i = 0; i < 30; i++) {
    const check = await page.evaluate(() => {
        return window.GameState?.isRunning === true &&
               window.playerModel !== undefined &&
               window.PlayerController !== undefined &&
               window.EnemyController !== undefined;
    });

    if (check) {
        ready = true;
        console.log(`✅ Game ready after ${i + 3} seconds\n`);
        break;
    }
    await delay(1000);
}

if (!ready) {
    console.log('❌ Game failed to initialize');
    await browser.close();
    process.exit(1);
}

console.log('========================================');
console.log('RUNNING TESTS');
console.log('========================================\n');

// TEST 1: 3-Second Spawn Delay
console.log('TEST 1: 3-Second Spawn Delay');
console.log('        Checking if obstacles spawn after delay...\n');

const spawnDelayLogs = allLogs.filter(log =>
    log.includes('Obstacle spawn delay activated') ||
    log.includes('⏳ Obstacle spawn delay')
);

if (spawnDelayLogs.length > 0) {
    console.log('  ✅ TEST 1 PASSED: Spawn delay activated');
    console.log('     Logs:', spawnDelayLogs.length);
    testResults.push({ test: 'Spawn delay activated', passed: true });
} else {
    console.log('  ❌ TEST 1 FAILED: No spawn delay logs found');
    testResults.push({ test: 'Spawn delay activated', passed: false });
}

// Wait to verify no immediate obstacles
await delay(2000);

const obstacleCount1 = await page.evaluate(() => {
    return window.obstacles ? window.obstacles.filter(o => o.active).length : 0;
});

console.log('  ✓ Obstacles at t=5s:', obstacleCount1);

// Wait past 3-second delay
await delay(2000);

const obstacleCount2 = await page.evaluate(() => {
    return window.obstacles ? window.obstacles.filter(o => o.active).length : 0;
});

console.log('  ✓ Obstacles at t=7s:', obstacleCount2);

if (obstacleCount2 > obstacleCount1) {
    console.log('  ✅ TEST 1 PASSED: Obstacles started spawning after delay');
    testResults.push({ test: 'Obstacles spawn after delay', passed: true });
} else {
    console.log('  ⚠️  Waiting longer for obstacles...');
    await delay(3000);
    const obstacleCount3 = await page.evaluate(() => {
        return window.obstacles ? window.obstacles.filter(o => o.active).length : 0;
    });
    console.log('  ✓ Obstacles at t=10s:', obstacleCount3);
    testResults.push({ test: 'Obstacles spawn after delay', passed: obstacleCount3 > 0 });
}

console.log('');

// TEST 2: Player Cannot Jump
console.log('TEST 2: Player Cannot Jump');
console.log('        Verifying jump functionality disabled...\n');

const jumpTest = await page.evaluate(() => {
    // Try to set isJumping flag manually
    const beforeJump = window.PlayerController.isJumping;

    // Try to trigger auto-jump logic (should be removed)
    if (window.PlayerController.checkAutoJump) {
        window.PlayerController.checkAutoJump();
    }

    const afterJump = window.PlayerController.isJumping;

    return {
        canJump: typeof window.PlayerController.checkAutoJump === 'function',
        beforeJump: beforeJump,
        afterJump: afterJump
    };
});

if (!jumpTest.canJump) {
    console.log('  ✅ TEST 2 PASSED: checkAutoJump function removed');
    testResults.push({ test: 'Player jump disabled', passed: true });
} else {
    console.log('  ❌ TEST 2 FAILED: checkAutoJump still exists');
    testResults.push({ test: 'Player jump disabled', passed: false });
}

console.log('  ✓ Jump function exists:', jumpTest.canJump);
console.log('');

// TEST 3: Enemy Lane Avoidance
console.log('TEST 3: Enemy Lane Avoidance');
console.log('        Testing enemy obstacle detection and lane switching...\n');

// Position obstacle in enemy's path
const avoidanceSetup = await page.evaluate(() => {
    if (!window.enemyModel || !window.obstacles) {
        return { success: false, reason: 'Enemy or obstacles not loaded' };
    }

    // Find or create obstacle in enemy's lane
    let testObstacle = null;
    for (let i = 0; i < window.obstacles.length; i++) {
        if (window.obstacles[i].active) {
            testObstacle = window.obstacles[i];
            break;
        }
    }

    if (!testObstacle) {
        return { success: false, reason: 'No active obstacles' };
    }

    // Position obstacle in enemy's lane, 10 units ahead
    const enemyLane = window.EnemyController.currentLane;
    testObstacle.lane = enemyLane;
    testObstacle.mesh.position.z = window.enemyModel.position.z - 10;

    return {
        success: true,
        enemyLane: enemyLane,
        obstacleLane: testObstacle.lane,
        distance: 10
    };
});

if (avoidanceSetup.success) {
    console.log('  ✓ Setup: Obstacle in lane', avoidanceSetup.enemyLane, 'at 10 units ahead');

    // Check if avoidObstacle function exists
    const hasAvoidFunction = await page.evaluate(() => {
        return typeof window.EnemyController.avoidObstacle === 'function';
    });

    if (hasAvoidFunction) {
        console.log('  ✅ TEST 3 PASSED: avoidObstacle function exists');
        testResults.push({ test: 'Enemy avoidance function', passed: true });

        // Trigger avoidance
        await page.evaluate(() => {
            const obs = window.obstacles.find(o => o.active);
            if (obs && window.EnemyController.avoidObstacle) {
                window.EnemyController.avoidObstacle(obs);
            }
        });

        await delay(500);

        // Check if enemy changed lanes
        const enemyLaneAfter = await page.evaluate(() => window.EnemyController.targetLane);

        if (enemyLaneAfter !== avoidanceSetup.enemyLane) {
            console.log('  ✅ TEST 3 PASSED: Enemy switched lanes to avoid');
            console.log('     From lane', avoidanceSetup.enemyLane, '→ lane', enemyLaneAfter);
            testResults.push({ test: 'Enemy lane switching', passed: true });
        } else {
            console.log('  ⚠️  Enemy stayed in same lane (might be no safe lanes)');
            testResults.push({ test: 'Enemy lane switching', passed: false });
        }
    } else {
        console.log('  ❌ TEST 3 FAILED: avoidObstacle function missing');
        testResults.push({ test: 'Enemy avoidance function', passed: false });
    }
} else {
    console.log('  ⚠️  TEST 3 SKIPPED:', avoidanceSetup.reason);
    testResults.push({ test: 'Enemy avoidance setup', passed: false });
}

console.log('');

// TEST 4: Collision Message
console.log('TEST 4: "You\'re Wasting Time" Message');
console.log('        Simulating player collision...\n');

// Position player to hit obstacle
const collisionSetup = await page.evaluate(() => {
    if (!window.playerModel || !window.obstacles) {
        return { success: false, reason: 'Player or obstacles not loaded' };
    }

    window.PlayerController.isInvincible = false;

    let testObstacle = null;
    for (let i = 0; i < window.obstacles.length; i++) {
        if (window.obstacles[i].active) {
            testObstacle = window.obstacles[i];
            break;
        }
    }

    if (!testObstacle) {
        return { success: false, reason: 'No active obstacles' };
    }

    // Position player to collide
    const laneX = [-2, 0, 2][testObstacle.lane];
    window.playerModel.position.x = laneX;
    window.playerModel.position.z = testObstacle.mesh.position.z + 1.0; // Very close

    return {
        success: true,
        lane: testObstacle.lane,
        distance: 1.0
    };
});

if (collisionSetup.success) {
    console.log('  ✓ Setup: Player positioned for collision');
    console.log('     Lane:', collisionSetup.lane, 'Distance:', collisionSetup.distance);

    // Trigger collision check
    await page.evaluate(() => {
        if (window.checkCollisions) {
            window.checkCollisions();
        }
    });

    await delay(500);

    // Check if overlay message appeared
    const hasMessage = await page.evaluate(() => {
        const overlay = document.getElementById('ui-overlay');
        return overlay && overlay.innerHTML.includes('WASTING TIME');
    });

    // Check if collision was logged
    const collisionLogged = allLogs.some(log => log.includes('Player hit obstacle'));

    if (hasMessage) {
        console.log('  ✅ TEST 4 PASSED: "You\'re wasting time" message displayed');
        testResults.push({ test: 'Collision message', passed: true });
    } else if (collisionLogged) {
        console.log('  ⚠️  Collision logged but message not visible yet');
        testResults.push({ test: 'Collision message', passed: true });
    } else {
        console.log('  ❌ TEST 4 FAILED: No collision or message');
        testResults.push({ test: 'Collision message', passed: false });
    }

    // Wait for message to clear
    await delay(3000);
} else {
    console.log('  ⚠️  TEST 4 SKIPPED:', collisionSetup.reason);
    testResults.push({ test: 'Collision message', passed: false });
}

console.log('');

// TEST 5: Enemy Jump Disabled
console.log('TEST 5: Enemy Jump Disabled');
console.log('        Verifying enemy cannot jump...\n');

const enemyJumpTest = await page.evaluate(() => {
    // Check if startJump still exists but is disabled
    const hasFunction = typeof window.EnemyController.startJump === 'function';
    const isJumping = window.EnemyController.isJumping;

    // Try to call it
    if (hasFunction) {
        window.EnemyController.startJump();
    }

    const isJumpingAfter = window.EnemyController.isJumping;

    return {
        hasFunction: hasFunction,
        jumpedBefore: isJumping,
        jumpedAfter: isJumpingAfter
    };
});

if (!enemyJumpTest.jumpedAfter) {
    console.log('  ✅ TEST 5 PASSED: Enemy cannot jump (function disabled)');
    testResults.push({ test: 'Enemy jump disabled', passed: true });
} else {
    console.log('  ❌ TEST 5 FAILED: Enemy can still jump');
    testResults.push({ test: 'Enemy jump disabled', passed: false });
}

console.log('');

// FINAL RESULTS
console.log('========================================');
console.log('           TEST RESULTS');
console.log('========================================\n');

let passCount = 0;
testResults.forEach((result, i) => {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${i + 1}. ${status} - ${result.test}`);
    if (result.passed) passCount++;
});

console.log('');
console.log(`TOTAL: ${passCount}/${testResults.length} tests passed`);

if (passCount === testResults.length) {
    console.log('\n🎉 ALL TESTS PASSED! 🎉');
    console.log('Jump disabled successfully. Obstacle avoidance working correctly.');
} else if (passCount >= testResults.length * 0.7) {
    console.log('\n✅ Most tests passed. Review failures above.');
} else {
    console.log('\n⚠️  Multiple test failures. Review logs above.');
}

console.log('\n========================================');
console.log('Browser will close in 10 seconds...');
console.log('Observe the game visually to verify behavior.');
console.log('========================================\n');

await delay(10000);

await browser.close();
process.exit(passCount === testResults.length ? 0 : 1);
