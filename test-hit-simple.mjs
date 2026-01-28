import puppeteer from 'puppeteer';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

console.log('=== Simple Enemy Hit Test ===\n');

const browser = await puppeteer.launch({
    headless: true,
    args: ['--disable-web-security', '--no-sandbox', '--disable-setuid-sandbox']
});
const page = await browser.newPage();

// Capture ALL console logs
const allLogs = [];
page.on('console', msg => {
    const text = msg.text();
    allLogs.push(text);
    // Only print specific logs to reduce noise
    if (text.includes('🎯') || text.includes('Throw') || text.includes('hit') ||
        text.includes('enemy') || text.includes('🔊') || text.includes('sound') ||
        text.includes('🧪') || text.includes('prerequisite')) {
        console.log('>>', text);
    }
});

page.on('pageerror', error => {
    console.log('❌ ERROR:', error.message);
});

console.log('Loading game...');
await page.goto('http://localhost:8000/game.html?level=1', { waitUntil: 'networkidle0' });

console.log('Waiting for "Merkle Man - Ready!" message...');

// Wait for the game to log "Merkle Man - Ready!"
let ready = false;
let readyWait = 0;
while (readyWait < 30 && !ready) {
    ready = allLogs.some(log => log.includes('Merkle Man - Ready!'));
    if (!ready) {
        await delay(1000);
        readyWait++;
    }
}

if (ready) {
    console.log(`✅ Game ready after ${readyWait} seconds`);
    await delay(2000); // Give animations time to fully initialize
} else {
    console.log('⚠️  Game did not log "Merkle Man - Ready!" after 30 seconds');
    console.log('\nRecent console logs:');
    allLogs.slice(-20).forEach(log => console.log('  ', log));
}

console.log('\nUnlocking audio...');
await page.click('body');
await delay(500);

console.log('\nSetting up test scenario...');
const result = await page.evaluate(() => {
    // Give player an item
    window.PlayerController.hasItem = true;
    window.PlayerController.isPickingUp = false;

    // Position enemy for hit (same lane, close distance)
    if (window.enemyModel && window.playerModel) {
        window.enemyModel.position.x = window.playerModel.position.x;
        window.enemyModel.position.z = window.playerModel.position.z - 8;
    }

    // Note: Not creating heldCanModel - let the game create it when throwing
    // The throw animation should still work with just hasItem = true

    // Log conditions
    console.log('🧪 Prerequisites check:');
    console.log('  playerMixer:', !!window.playerMixer);
    console.log('  throw animation:', !!window.playerAnimations?.throw);
    console.log('  hasItem:', window.PlayerController.hasItem);
    console.log('  isThrowing:', window.PlayerController.isThrowing);
    console.log('  heldCanModel:', !!window.heldCanModel);

    return {
        ready: !!window.playerMixer && !!window.playerAnimations?.throw,
        hasItem: window.PlayerController.hasItem,
        hasCan: !!window.heldCanModel
    };
});

console.log('Prerequisites:', result);

if (!result.ready) {
    console.log('\n⚠️  Game not ready - animations missing');
    console.log('\nShowing all console logs:');
    allLogs.forEach(log => console.log('  ', log));
    await browser.close();
    process.exit(1);
}

console.log('\nTriggering throw...');
await page.evaluate(() => {
    console.log('🧪 About to call startThrow()');
    window.PlayerController.startThrow();
    console.log('🧪 startThrow() called');
});

console.log('\nWaiting 8 seconds for animation...\n');
await delay(8000);

console.log('========================================');
console.log('All console logs from throw onwards:');
console.log('========================================');
const throwLogs = allLogs.slice(-50);
throwLogs.forEach((log, i) => console.log(`${i + 1}. ${log}`));

const hitDetected = allLogs.some(log => log.includes('🎯 Item hit enemy') || log.includes('Got em'));
const soundPlayed = allLogs.some(log => log.includes('🔊 Hit sound effect played'));

console.log('\n========================================');
console.log(hitDetected ? '✅ HIT DETECTED' : '❌ NO HIT DETECTED');
console.log(soundPlayed ? '✅ SOUND PLAYED' : '❌ SOUND DID NOT PLAY');
console.log('========================================\n');

await browser.close();
