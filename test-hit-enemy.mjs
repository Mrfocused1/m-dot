import puppeteer from 'puppeteer';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

console.log('=== Direct Enemy Hit Test ===\n');

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

// Capture console logs and errors
const soundLogs = [];
const allLogs = [];
const errors = [];

page.on('console', msg => {
    const text = msg.text();
    allLogs.push(text);

    // Capture sound-related and hit-related logs
    if (text.includes('🔊') || text.includes('sound') || text.includes('Hit') ||
        text.includes('Item hit') || text.includes('🎯') || text.includes('enemy') ||
        text.includes('Got em') || text.includes('🧪') || text.includes('Player state')) {
        soundLogs.push(text);
        console.log('>>>', text);
    }
});

page.on('pageerror', error => {
    errors.push(error.message);
    console.log('❌ PAGE ERROR:', error.message);
});

console.log('1. Loading game...');
await page.goto('http://localhost:8000/game.html?level=1', { waitUntil: 'networkidle0' });
console.log('   Page loaded, waiting for game to initialize...\n');

// Wait for intro animation to complete and game to start
// The intro animation takes several seconds, plus asset loading time
await delay(15000); // Wait 15 seconds for intro animation + asset loading

// Check if GameState exists
const gameState = await page.evaluate(() => {
    return {
        exists: typeof window.GameState !== 'undefined',
        isRunning: window.GameState?.isRunning,
        playerExists: typeof window.PlayerController !== 'undefined',
        enemyModelExists: typeof window.enemyModel !== 'undefined',
        playerModelExists: typeof window.playerModel !== 'undefined'
    };
});
console.log('   Game state:', gameState);

if (errors.length > 0) {
    console.log('\n❌ JavaScript errors detected:');
    errors.forEach((err, i) => console.log(`  ${i + 1}. ${err}`));
}

if (!gameState.exists || !gameState.playerExists) {
    console.log('\n⚠️  Game failed to initialize. Showing last 30 console logs:');
    allLogs.slice(-30).forEach((log, i) => {
        console.log(`  ${i + 1}. ${log}`);
    });
    await browser.close();
    process.exit(1);
}

console.log('2. Unlocking audio...');
await page.click('body');
await delay(500);

console.log('3. Giving player an item...');
await page.evaluate(() => {
    window.PlayerController.hasItem = true;
    window.PlayerController.isPickingUp = false;
    console.log('Player hasItem:', window.PlayerController.hasItem);
});

console.log('4. Positioning enemy for guaranteed hit...');
await page.evaluate(() => {
    // Position enemy in same lane as player (matching X position)
    // and within hit detection range (< 3.5 units)
    if (window.enemyModel && window.playerModel) {
        // Same lane (X coordinate)
        window.enemyModel.position.x = window.playerModel.position.x;

        // Position 8 units ahead (Z coordinate) - within throw range
        window.enemyModel.position.z = window.playerModel.position.z - 8;

        console.log('✅ Enemy positioned for hit:');
        console.log('  Player X:', window.playerModel.position.x);
        console.log('  Enemy X:', window.enemyModel.position.x);
        console.log('  Player Z:', window.playerModel.position.z);
        console.log('  Enemy Z:', window.enemyModel.position.z);
        console.log('  Distance:', window.playerModel.position.distanceTo(window.enemyModel.position).toFixed(2));
    }
});

console.log('5. Checking throw prerequisites...');
const throwPrecheck = await page.evaluate(() => {
    // Check all conditions required for throw
    const playerMixer = window.playerMixer;
    const playerAnimations = window.playerAnimations;

    console.log('🧪 Throw prerequisites:');
    console.log('  playerMixer exists:', !!playerMixer);
    console.log('  playerAnimations exists:', !!playerAnimations);
    console.log('  playerAnimations.throw exists:', !!playerAnimations?.throw);
    console.log('  heldCanModel exists:', !!window.heldCanModel);
    console.log('  PlayerController.hasItem:', window.PlayerController.hasItem);
    console.log('  PlayerController.isThrowing:', window.PlayerController.isThrowing);

    return {
        ready: !!playerMixer && !!playerAnimations?.throw && window.PlayerController.hasItem && !window.PlayerController.isThrowing
    };
});

if (!throwPrecheck.ready) {
    console.log('⚠️  Throw conditions not met! Creating heldCanModel...');

    await page.evaluate(() => {
        // Create a held can model if it doesn't exist
        if (!window.heldCanModel && window.colaCanTemplate) {
            window.heldCanModel = window.colaCanTemplate.clone();
            window.heldCanModel.scale.set(1.0, 1.0, 1.0);
            window.heldCanModel.visible = true;
            if (window.playerModel) {
                window.playerModel.add(window.heldCanModel);
                console.log('✅ Created heldCanModel');
            }
        }
    });
}

console.log('6. Throwing item...');
await page.evaluate(() => {
    console.log('🧪 Calling startThrow()...');
    window.PlayerController.startThrow();
});

console.log('7. Waiting for hit detection (8 seconds)...');
await delay(8000);

console.log('\n========================================');
console.log('           TEST RESULTS');
console.log('========================================\n');

const hasUnlocked = soundLogs.some(log => log.includes('unlocked'));
const hasPlayed = soundLogs.some(log => log.includes('played successfully'));

console.log('Sound Logs Captured:', soundLogs.length);
soundLogs.forEach((log, i) => console.log(`  ${i + 1}. ${log}`));

console.log('\nSTATUS:');
console.log(hasUnlocked ? '  [X] Audio unlocked' : '  [ ] Audio unlocked');
console.log(hasPlayed ? '  [X] Hit sound played' : '  [ ] Hit sound played');

if (hasPlayed) {
    console.log('\n✅ SUCCESS! Hit sound effect is working!');
} else {
    console.log('\n⚠️  Hit sound did not play (enemy may not have been hit)');

    // Show last 20 console logs for debugging
    console.log('\nLast 20 console logs:');
    allLogs.slice(-20).forEach((log, i) => {
        console.log(`  ${i + 1}. ${log}`);
    });
}

await browser.close();
