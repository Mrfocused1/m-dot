import puppeteer from 'puppeteer';

/**
 * Comprehensive test to verify sound effects in the game
 * Enables debug logging to capture sound messages
 */

(async () => {
    console.log('=== Sound Effect Test Script ===\n');

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--autoplay-policy=no-user-gesture-required']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    const allLogs = [];
    const soundLogs = [];

    page.on('console', msg => {
        const text = msg.text();
        const logEntry = '[' + msg.type() + '] ' + text;
        allLogs.push({ time: Date.now(), text: logEntry });

        if (text.toLowerCase().includes('sound') || text.includes('audio') || text.includes('Hit')) {
            soundLogs.push(logEntry);
            console.log('>>> ' + text);
        }
    });

    try {
        console.log('1. Loading game...');
        await page.goto('http://localhost:8000/game.html?level=1', {
            waitUntil: 'domcontentloaded',
            timeout: 30000
        });

        // Wait for loading to complete
        for (let i = 0; i < 60; i++) {
            await new Promise(r => setTimeout(r, 1000));
            const status = await page.evaluate(() => {
                const text = document.body.innerText;
                if (text.includes('LOADING')) {
                    const match = text.match(/(\d+)%/);
                    return match ? match[1] + '%' : 'loading';
                }
                if (text.includes('READY_TO_START')) return 'ready';
                return 'unknown';
            });
            process.stdout.write('\r   Status: ' + status + '     ');
            if (status === 'ready') break;
        }
        console.log('\n   Game loaded!');

        // Enable debug logging BEFORE any sound interactions
        console.log('\n2. Enabling debug logging...');
        await page.evaluate(() => {
            if (window._enableProductionLogging) {
                window._enableProductionLogging(true);
                console.log('DEBUG LOGGING ENABLED');
            }
        });

        await page.screenshot({ path: '/tmp/sound-test-1-ready.png' });

        // User interaction to unlock audio
        console.log('\n3. Clicking to unlock audio...');
        await page.click('canvas');
        await new Promise(r => setTimeout(r, 500));

        // Call startGame
        console.log('\n4. Starting game via startGame()...');
        await page.evaluate(() => {
            if (typeof startGame === 'function') {
                startGame();
            }
        });

        await new Promise(r => setTimeout(r, 2000));
        await page.screenshot({ path: '/tmp/sound-test-2-started.png' });

        // Let the game run
        console.log('\n5. Playing game for 15 seconds...');
        for (let i = 0; i < 15; i++) {
            const keys = ['ArrowLeft', 'ArrowRight', 'Space', 'ArrowUp'];
            const key = keys[Math.floor(Math.random() * keys.length)];
            await page.keyboard.press(key);
            await new Promise(r => setTimeout(r, 1000));
            process.stdout.write('\r   Playing... ' + (i + 1) + '/15 seconds');
        }
        console.log('');

        await page.screenshot({ path: '/tmp/sound-test-3-playing.png' });

        // Rapid lane changes to try to hit enemy
        console.log('\n6. Rapid lane changes...');
        for (let i = 0; i < 30; i++) {
            await page.keyboard.down('ArrowLeft');
            await new Promise(r => setTimeout(r, 50));
            await page.keyboard.up('ArrowLeft');
            await page.keyboard.down('ArrowRight');
            await new Promise(r => setTimeout(r, 50));
            await page.keyboard.up('ArrowRight');
        }

        await new Promise(r => setTimeout(r, 2000));
        await page.screenshot({ path: '/tmp/sound-test-4-final.png' });

    } catch (err) {
        console.error('\nError: ' + err.message);
        await page.screenshot({ path: '/tmp/sound-test-error.png' });
    }

    // Summary
    console.log('\n========================================');
    console.log('               TEST RESULTS');
    console.log('========================================\n');

    console.log('SOUND-RELATED LOGS (' + soundLogs.length + '):');
    if (soundLogs.length === 0) {
        console.log('  (none detected)');
    } else {
        soundLogs.forEach((log, i) => console.log('  ' + (i+1) + '. ' + log));
    }

    const soundInit = soundLogs.some(l => l.includes('SoundController initialized'));
    const soundUnlocked = soundLogs.some(l => l.includes('unlocked'));
    const soundPlayed = soundLogs.some(l => l.includes('played successfully'));
    const waitingForInteraction = soundLogs.some(l => l.includes('Waiting for user interaction'));

    console.log('\nSTATUS:');
    console.log('  [' + (soundInit ? 'X' : ' ') + '] SoundController initialized');
    console.log('  [' + (waitingForInteraction ? 'X' : ' ') + '] Waiting for user interaction');
    console.log('  [' + (soundUnlocked ? 'X' : ' ') + '] Sound unlocked after interaction');
    console.log('  [' + (soundPlayed ? 'X' : ' ') + '] Hit sound played successfully');

    console.log('\nALL LOGS (' + allLogs.length + '):');
    allLogs.slice(-30).forEach(l => console.log('  ' + l.text));

    await browser.close();
    console.log('\nTest complete.');
})();
