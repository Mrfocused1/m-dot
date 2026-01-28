import puppeteer from 'puppeteer';

(async () => {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    // Capture console logs
    const consoleLogs = [];
    page.on('console', msg => {
        const logEntry = '[' + msg.type() + '] ' + msg.text();
        consoleLogs.push(logEntry);
        console.log('CONSOLE: ' + logEntry);
    });

    console.log('Navigating to localhost:8000/game.html?level=1...');

    try {
        // Use domcontentloaded instead of networkidle0 for games that keep loading
        await page.goto('http://localhost:8000/game.html?level=1', {
            waitUntil: 'domcontentloaded',
            timeout: 15000
        });

        console.log('DOM loaded, waiting for game initialization...');

        // Wait a bit for the game to initialize
        await new Promise(resolve => setTimeout(resolve, 3000));

        console.log('Page loaded successfully!');
        const title = await page.title();
        console.log('Page title: ' + title);

        // Take a screenshot
        await page.screenshot({ path: '/tmp/game-screenshot.png', fullPage: false });
        console.log('Screenshot saved to /tmp/game-screenshot.png');

        // Check if canvas exists (for games)
        const hasCanvas = await page.evaluate(() => !!document.querySelector('canvas'));
        console.log('Has canvas element: ' + hasCanvas);

        // Try to get canvas dimensions
        const canvasInfo = await page.evaluate(() => {
            const canvas = document.querySelector('canvas');
            if (canvas) {
                return { width: canvas.width, height: canvas.height };
            }
            return null;
        });
        console.log('Canvas info: ' + JSON.stringify(canvasInfo));

        // Try clicking on the canvas to interact
        const canvasElement = await page.$('canvas');
        if (canvasElement) {
            console.log('Clicking on canvas...');
            await canvasElement.click();
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Take another screenshot after click
            await page.screenshot({ path: '/tmp/game-screenshot-after-click.png', fullPage: false });
            console.log('Screenshot after click saved');
        }

        // Try pressing some keys
        console.log('Pressing spacebar...');
        await page.keyboard.press('Space');
        await new Promise(resolve => setTimeout(resolve, 500));

        console.log('Pressing arrow keys...');
        await page.keyboard.press('ArrowUp');
        await new Promise(resolve => setTimeout(resolve, 500));

        // Final screenshot
        await page.screenshot({ path: '/tmp/game-screenshot-final.png', fullPage: false });
        console.log('Final screenshot saved');

    } catch (err) {
        console.error('Error: ' + err.message);
        // Still try to take a screenshot on error
        try {
            await page.screenshot({ path: '/tmp/game-screenshot-error.png', fullPage: false });
            console.log('Error screenshot saved');
        } catch (e) {}
    }

    console.log('\n--- All Console logs captured ---');
    consoleLogs.forEach(log => console.log(log));

    await browser.close();
    console.log('Browser closed.');
})();
