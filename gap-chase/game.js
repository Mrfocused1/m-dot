// ============================================================================
// GAP CHASE - Horizontal Endless Runner
// Get your tooth back from the thief!
// ============================================================================

const DEBUG = false;

// ============================================================================
// CANVAS SETUP
// ============================================================================

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Design resolution (logical pixels) - landscape oriented
const DESIGN_WIDTH = 800;
const DESIGN_HEIGHT = 450;

// Actual device pixel ratio handling
let scale = 1;
let offsetX = 0;
let offsetY = 0;

function resizeCanvas() {
    // Get actual screen dimensions
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Calculate scale to fit design resolution while maintaining aspect ratio
    const scaleX = screenWidth / DESIGN_WIDTH;
    const scaleY = screenHeight / DESIGN_HEIGHT;
    scale = Math.min(scaleX, scaleY);

    // Set canvas to actual screen size for crisp rendering
    canvas.width = screenWidth;
    canvas.height = screenHeight;

    // Center the game view
    offsetX = (screenWidth - DESIGN_WIDTH * scale) / 2;
    offsetY = (screenHeight - DESIGN_HEIGHT * scale) / 2;
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', () => setTimeout(resizeCanvas, 100));

// ============================================================================
// GAME CONSTANTS
// ============================================================================

const GRAVITY = 1800;              // Pixels per second squared
const JUMP_VELOCITY = -600;        // Initial upward velocity (negative = up)
const DOUBLE_JUMP_VELOCITY = -500; // Slightly weaker second jump
const GROUND_Y = 350;              // Y position of ground surface
const SCROLL_SPEED_INITIAL = 200;  // Starting scroll speed (pixels/sec)
const SCROLL_SPEED_MAX = 500;      // Maximum scroll speed
const SCROLL_ACCELERATION = 5;     // Speed increase per second

// ============================================================================
// GAME STATE
// ============================================================================

const GameState = {
    // Timing
    lastTime: 0,
    deltaTime: 0,
    gameTime: 0,  // Total time since game started

    // Game status
    isRunning: false,
    isPaused: false,

    // Screen state machine
    screen: 'START', // 'START', 'PLAYING', 'GAMEOVER'

    // Scoring
    score: 0,
    highScore: 0,
    distanceTraveled: 0,
    gapsCleared: 0,

    // Difficulty progression
    currentScrollSpeed: SCROLL_SPEED_INITIAL,
    difficultyLevel: 1,

    // New high score flag
    isNewHighScore: false,

    reset() {
        this.gameTime = 0;
        this.score = 0;
        this.distanceTraveled = 0;
        this.gapsCleared = 0;
        this.currentScrollSpeed = SCROLL_SPEED_INITIAL;
        this.difficultyLevel = 1;
        this.isNewHighScore = false;
        this.isRunning = true;
        this.screen = 'PLAYING';
    }
};

// ============================================================================
// INPUT SYSTEM
// ============================================================================

const Input = {
    // Current frame state
    jumpPressed: false,
    jumpJustPressed: false,  // True only on the frame touch started

    // Previous frame state (for edge detection)
    _prevJumpPressed: false,

    // Touch tracking
    touchStartTime: 0,
    touchId: null,

    // Jump buffering (allow input slightly before landing)
    jumpBuffer: 0,
    JUMP_BUFFER_TIME: 100,  // ms

    init() {
        // Touch events
        canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        canvas.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
        canvas.addEventListener('touchcancel', this.handleTouchEnd.bind(this), { passive: false });

        // Mouse fallback for desktop
        canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));

        // Keyboard support (spacebar)
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
    },

    handleTouchStart(e) {
        e.preventDefault();
        if (this.touchId === null) {
            this.touchId = e.changedTouches[0].identifier;
            this.jumpPressed = true;
            this.touchStartTime = performance.now();
        }
    },

    handleTouchEnd(e) {
        e.preventDefault();
        for (const touch of e.changedTouches) {
            if (touch.identifier === this.touchId) {
                this.jumpPressed = false;
                this.touchId = null;
            }
        }
    },

    handleMouseDown(e) {
        this.jumpPressed = true;
    },

    handleMouseUp(e) {
        this.jumpPressed = false;
    },

    handleKeyDown(e) {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
            e.preventDefault();
            this.jumpPressed = true;
        }
    },

    handleKeyUp(e) {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
            this.jumpPressed = false;
        }
    },

    update(dt) {
        // Edge detection: was not pressed, now is pressed
        this.jumpJustPressed = this.jumpPressed && !this._prevJumpPressed;

        // Update jump buffer
        if (this.jumpJustPressed) {
            this.jumpBuffer = this.JUMP_BUFFER_TIME;
        } else if (this.jumpBuffer > 0) {
            this.jumpBuffer -= dt;
        }

        // Store for next frame
        this._prevJumpPressed = this.jumpPressed;
    },

    // Check if jump was requested (includes buffer)
    consumeJump() {
        if (this.jumpBuffer > 0) {
            this.jumpBuffer = 0;
            return true;
        }
        return false;
    },

    reset() {
        this.jumpPressed = false;
        this.jumpJustPressed = false;
        this._prevJumpPressed = false;
        this.jumpBuffer = 0;
        this.touchId = null;
    }
};

// ============================================================================
// CAMERA / WORLD SYSTEM
// ============================================================================

const Camera = {
    // World position (left edge of visible area)
    worldX: 0,

    update(dt) {
        // In endless runner, world scrolls at constant (increasing) speed
        const dtSeconds = dt / 1000;
        this.worldX += GameState.currentScrollSpeed * dtSeconds;

        // Update distance traveled (for scoring)
        GameState.distanceTraveled = Math.floor(this.worldX);
    },

    // Check if a world position is visible on screen
    isVisible(worldX, width = 0) {
        const screenX = worldX - this.worldX;
        return screenX + width > -50 && screenX < DESIGN_WIDTH + 50;
    },

    reset() {
        this.worldX = 0;
    }
};

// ============================================================================
// PLAYER
// ============================================================================

const Player = {
    // Position (in design coordinates)
    x: 150,              // Fixed horizontal position
    y: GROUND_Y,
    width: 40,
    height: 60,

    // Physics
    velocityY: 0,

    // Jump state machine
    jumpState: 'GROUNDED',  // 'GROUNDED', 'JUMPING', 'FALLING', 'DOUBLE_JUMPING'
    canDoubleJump: false,

    // Coyote time (grace period after leaving ground)
    coyoteTimer: 0,
    COYOTE_TIME: 80,  // ms

    // Animation
    animFrame: 0,
    animTimer: 0,

    // Landing squash effect
    squashFactor: 1,

    init() {
        this.x = 150;
        this.y = GROUND_Y - this.height;
        this.velocityY = 0;
        this.jumpState = 'GROUNDED';
        this.canDoubleJump = false;
        this.coyoteTimer = 0;
        this.squashFactor = 1;
    },

    update(dt) {
        const dtSeconds = dt / 1000;

        // Update coyote timer
        if (this.jumpState === 'GROUNDED') {
            this.coyoteTimer = this.COYOTE_TIME;
        } else if (this.coyoteTimer > 0) {
            this.coyoteTimer -= dt;
        }

        // Handle jump input
        this.handleJumpInput();

        // Apply gravity (always, unless grounded and not jumping)
        if (this.jumpState !== 'GROUNDED') {
            this.velocityY += GRAVITY * dtSeconds;

            // Terminal velocity cap
            if (this.velocityY > 1000) {
                this.velocityY = 1000;
            }
        }

        // Update position
        this.y += this.velocityY * dtSeconds;

        // Update animation
        this.updateAnimation(dt);

        // Update squash recovery
        if (this.squashFactor < 1) {
            this.squashFactor = Math.min(1, this.squashFactor + dtSeconds * 5);
        }
    },

    handleJumpInput() {
        // Check if jump input is available
        const wantsToJump = Input.consumeJump();

        if (!wantsToJump) return;

        switch (this.jumpState) {
            case 'GROUNDED':
                this.performJump();
                break;

            case 'JUMPING':
            case 'FALLING':
                // Check coyote time for first jump
                if (this.coyoteTimer > 0 && !this.canDoubleJump) {
                    // Coyote jump (counts as first jump)
                    this.performJump();
                } else if (this.canDoubleJump) {
                    // Double jump
                    this.performDoubleJump();
                }
                break;

            case 'DOUBLE_JUMPING':
                // No more jumps available
                break;
        }
    },

    performJump() {
        this.velocityY = JUMP_VELOCITY;
        this.jumpState = 'JUMPING';
        this.canDoubleJump = true;
        this.coyoteTimer = 0;

        // Slight stretch effect
        this.squashFactor = 1.2;
    },

    performDoubleJump() {
        this.velocityY = DOUBLE_JUMP_VELOCITY;
        this.jumpState = 'DOUBLE_JUMPING';
        this.canDoubleJump = false;

        // Visual feedback
        this.squashFactor = 1.15;
    },

    land(groundY) {
        // Called when landing on ground/platform
        this.y = groundY - this.height;
        this.velocityY = 0;
        this.jumpState = 'GROUNDED';
        this.canDoubleJump = false;
        this.coyoteTimer = this.COYOTE_TIME;

        // Squash effect on landing
        const impactSpeed = Math.abs(this.velocityY);
        this.squashFactor = Math.max(0.7, 1 - impactSpeed / 2000);
    },

    startFalling() {
        // Called when walking off an edge
        if (this.jumpState === 'GROUNDED') {
            this.jumpState = 'FALLING';
        }
    },

    updateAnimation(dt) {
        this.animTimer += dt;

        if (this.jumpState === 'GROUNDED') {
            // Running animation
            if (this.animTimer >= 100) {
                this.animTimer -= 100;
                this.animFrame = (this.animFrame + 1) % 4;
            }
        } else {
            // Jumping pose
            this.animFrame = this.velocityY < 0 ? 0 : 1;
        }
    },

    getBoundingBox() {
        const padding = 5;
        return {
            x: this.x + padding,
            y: this.y + padding,
            width: this.width - padding * 2,
            height: this.height - padding * 2
        };
    },

    render() {
        ctx.save();

        // Apply squash/stretch
        const centerX = this.x + this.width / 2;
        const bottomY = this.y + this.height;

        ctx.translate(centerX, bottomY);
        ctx.scale(2 - this.squashFactor, this.squashFactor);
        ctx.translate(-centerX, -bottomY);

        // Body
        ctx.fillStyle = '#4fc3f7';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Head
        ctx.fillStyle = '#ffcc80';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + 15, 12, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2 - 4, this.y + 13, 2, 0, Math.PI * 2);
        ctx.arc(this.x + this.width / 2 + 4, this.y + 13, 2, 0, Math.PI * 2);
        ctx.fill();

        // Mouth with gap
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x + this.width / 2 - 6, this.y + 20, 12, 6);
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x + this.width / 2 - 5, this.y + 21, 3, 4);  // Left tooth
        ctx.fillRect(this.x + this.width / 2 + 2, this.y + 21, 3, 4);   // Right tooth

        // Legs
        ctx.fillStyle = '#1565c0';
        if (this.jumpState === 'GROUNDED') {
            const legOffset = Math.sin(this.animFrame * Math.PI / 2) * 3;
            ctx.fillRect(this.x + 8, this.y + this.height - 15 + legOffset, 8, 15 - legOffset);
            ctx.fillRect(this.x + this.width - 16, this.y + this.height - 15 - legOffset, 8, 15 + legOffset);
        } else {
            // Tucked legs while jumping
            ctx.fillRect(this.x + 10, this.y + this.height - 12, 8, 12);
            ctx.fillRect(this.x + this.width - 18, this.y + this.height - 12, 8, 12);
        }

        ctx.restore();
    }
};

// ============================================================================
// BACKGROUND (Parallax)
// ============================================================================

const Background = {
    layers: [
        {
            color: '#0a0a20',
            elements: [],
            speed: 0.1,
            yOffset: 0
        },
        {
            color: '#151530',
            elements: [],
            speed: 0.3,
            yOffset: 150
        },
        {
            color: '#202045',
            elements: [],
            speed: 0.6,
            yOffset: 280
        }
    ],

    init() {
        this.generateLayerElements();
    },

    generateLayerElements() {
        // Far layer: stars
        for (let i = 0; i < 15; i++) {
            this.layers[0].elements.push({
                type: 'star',
                x: Math.random() * DESIGN_WIDTH * 3,
                y: Math.random() * 100 + 20,
                size: Math.random() * 2 + 1
            });
        }

        // Mid layer: hills
        for (let i = 0; i < 8; i++) {
            this.layers[1].elements.push({
                type: 'building',
                x: i * 200,
                y: 0,
                width: 60 + Math.random() * 40,
                height: 50 + Math.random() * 80
            });
        }

        // Near layer: bushes
        for (let i = 0; i < 15; i++) {
            this.layers[2].elements.push({
                type: 'bush',
                x: i * 150,
                y: 0,
                width: 30 + Math.random() * 20,
                height: 20 + Math.random() * 15
            });
        }
    },

    update(dt) {
        // Layers auto-scroll based on camera
    },

    render() {
        for (let i = 0; i < this.layers.length; i++) {
            const layer = this.layers[i];
            const parallaxOffset = Camera.worldX * layer.speed;

            ctx.save();

            for (const element of layer.elements) {
                let screenX = element.x - parallaxOffset;

                // Wrap elements
                const wrapWidth = DESIGN_WIDTH * 3;
                screenX = ((screenX % wrapWidth) + wrapWidth) % wrapWidth - DESIGN_WIDTH;

                this.renderElement(element, screenX, layer.yOffset);
            }

            ctx.restore();
        }
    },

    renderElement(element, x, yOffset) {
        switch (element.type) {
            case 'star':
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.beginPath();
                ctx.arc(x, element.y, element.size, 0, Math.PI * 2);
                ctx.fill();
                break;

            case 'building':
                ctx.fillStyle = '#252550';
                ctx.fillRect(x, yOffset + (100 - element.height), element.width, element.height);
                break;

            case 'bush':
                ctx.fillStyle = '#1a3020';
                ctx.beginPath();
                ctx.ellipse(x + element.width / 2, yOffset + GROUND_Y - element.height / 2,
                           element.width / 2, element.height / 2, 0, 0, Math.PI * 2);
                ctx.fill();
                break;
        }
    },

    reset() {
        this.layers.forEach(layer => layer.elements = []);
        this.generateLayerElements();
    }
};

// ============================================================================
// PLATFORM / GAP GENERATION
// ============================================================================

const PlatformManager = {
    platforms: [],
    POOL_SIZE: 15,

    nextPlatformX: 0,
    lastGapWidth: 0,
    gapsSinceLastSafe: 0,

    MIN_GAP_WIDTH: 60,
    MAX_GAP_WIDTH_BASE: 150,
    MIN_PLATFORM_WIDTH: 100,
    MAX_PLATFORM_WIDTH: 400,

    patterns: {
        easy: [
            { gap: 60, platform: 200 },
            { gap: 80, platform: 150 }
        ],
        medium: [
            { gap: 100, platform: 120 },
            { gap: 120, platform: 100 }
        ],
        hard: [
            { gap: 140, platform: 80 },
            { gap: 150, platform: 90 }
        ],
        rest: [
            { gap: 40, platform: 300 },
            { gap: 50, platform: 250 }
        ]
    },

    init() {
        this.platforms = [];
        for (let i = 0; i < this.POOL_SIZE; i++) {
            this.platforms.push({
                worldX: 0,
                width: 0,
                active: false,
                passed: false
            });
        }

        this.createInitialGround();
    },

    createInitialGround() {
        const platform = this.acquirePlatform();
        platform.worldX = 0;
        platform.width = 600;
        platform.active = true;
        platform.passed = true;

        this.nextPlatformX = 600;
    },

    acquirePlatform() {
        for (const platform of this.platforms) {
            if (!platform.active) {
                return platform;
            }
        }
        const newPlatform = { worldX: 0, width: 0, active: false, passed: false };
        this.platforms.push(newPlatform);
        return newPlatform;
    },

    releasePlatform(platform) {
        platform.active = false;
        platform.passed = false;
    },

    update(dt) {
        const visibleRight = Camera.worldX + DESIGN_WIDTH + 200;

        while (this.nextPlatformX < visibleRight) {
            this.generateNextSegment();
        }

        for (const platform of this.platforms) {
            if (!platform.active) continue;

            if (platform.worldX + platform.width < Camera.worldX - 100) {
                this.releasePlatform(platform);
                continue;
            }

            if (!platform.passed && platform.worldX < Player.x + Camera.worldX) {
                platform.passed = true;
                this.onGapCleared();
            }
        }

        this.handlePlayerCollision();
    },

    generateNextSegment() {
        const difficulty = this.calculateDifficulty();

        let gapWidth, platformWidth;

        if (this.gapsSinceLastSafe >= 5) {
            const rest = this.patterns.rest[Math.floor(Math.random() * this.patterns.rest.length)];
            gapWidth = rest.gap;
            platformWidth = rest.platform;
            this.gapsSinceLastSafe = 0;
        } else {
            if (Math.random() < 0.6) {
                const patternSet = this.selectPatternSet(difficulty);
                const pattern = patternSet[Math.floor(Math.random() * patternSet.length)];
                gapWidth = pattern.gap;
                platformWidth = pattern.platform;
            } else {
                const result = this.generateProcedural(difficulty);
                gapWidth = result.gap;
                platformWidth = result.platform;
            }
            this.gapsSinceLastSafe++;
        }

        gapWidth = this.validateGapWidth(gapWidth);

        const platform = this.acquirePlatform();
        platform.worldX = this.nextPlatformX + gapWidth;
        platform.width = platformWidth;
        platform.active = true;
        platform.passed = false;

        this.lastGapWidth = gapWidth;
        this.nextPlatformX = platform.worldX + platform.width;
    },

    calculateDifficulty() {
        const timeFactor = Math.min(1, GameState.gameTime / 120000);
        const scoreFactor = Math.min(1, GameState.score / 5000);
        return (timeFactor + scoreFactor) / 2;
    },

    selectPatternSet(difficulty) {
        if (difficulty < 0.3) return this.patterns.easy;
        if (difficulty < 0.6) return this.patterns.medium;
        return this.patterns.hard;
    },

    generateProcedural(difficulty) {
        const maxSafeGap = this.calculateMaxJumpableGap();
        const minGap = this.MIN_GAP_WIDTH;
        const maxGap = minGap + (maxSafeGap - minGap) * difficulty;
        const gapWidth = minGap + Math.random() * (maxGap - minGap);

        const minPlatform = this.MIN_PLATFORM_WIDTH;
        const maxPlatform = this.MAX_PLATFORM_WIDTH;
        const platformWidth = maxPlatform - (maxPlatform - minPlatform) * difficulty * Math.random();

        return { gap: gapWidth, platform: platformWidth };
    },

    calculateMaxJumpableGap() {
        const scrollSpeed = GameState.currentScrollSpeed;
        const totalAirTime = 0.9;
        const maxDistance = scrollSpeed * totalAirTime * 0.85;
        return Math.min(maxDistance, this.MAX_GAP_WIDTH_BASE + GameState.difficultyLevel * 20);
    },

    validateGapWidth(gapWidth) {
        const maxJumpable = this.calculateMaxJumpableGap();
        return Math.min(gapWidth, maxJumpable);
    },

    handlePlayerCollision() {
        const playerWorldX = Camera.worldX + Player.x;
        const playerBottom = Player.y + Player.height;
        const playerCenterX = playerWorldX + Player.width / 2;

        let platformFound = null;

        // Find platform that player's center is over
        for (const platform of this.platforms) {
            if (!platform.active) continue;

            // Check if player's center X is within platform horizontal bounds
            if (playerCenterX >= platform.worldX && playerCenterX <= platform.worldX + platform.width) {
                platformFound = platform;
                break;
            }
        }

        if (platformFound) {
            // Player is horizontally over a platform
            // Check if they should land on it (must be near ground level AND falling/descending)
            if (playerBottom >= GROUND_Y - 10 && playerBottom <= GROUND_Y + 15 && Player.velocityY >= 0) {
                // Land on platform only if not already grounded
                if (Player.jumpState !== 'GROUNDED') {
                    Player.land(GROUND_Y);
                }
            }
        } else {
            // NO PLATFORM under player's center - they're over a gap!
            // Force them to start falling immediately
            if (Player.jumpState === 'GROUNDED' || playerBottom <= GROUND_Y + 5) {
                // If player is grounded or near ground level, force fall state
                Player.jumpState = 'FALLING';
                Player.canDoubleJump = true;

                // Give downward velocity if they don't have much
                if (Player.velocityY < 100) {
                    Player.velocityY = 100;
                }
            }
        }

        // Check if fallen below screen (game over)
        if (Player.y > DESIGN_HEIGHT + 100) {
            this.onPlayerFellInGap();
        }
    },

    onGapCleared() {
        GameState.gapsCleared++;
        GameState.score += 10;
    },

    onPlayerFellInGap() {
        gameOver();
    },

    render() {
        ctx.fillStyle = '#3d3d6b';

        for (const platform of this.platforms) {
            if (!platform.active) continue;

            const screenX = platform.worldX - Camera.worldX;

            if (screenX + platform.width < 0 || screenX > DESIGN_WIDTH) continue;

            ctx.fillRect(screenX, GROUND_Y, platform.width, DESIGN_HEIGHT - GROUND_Y);

            ctx.fillStyle = '#5d5d8b';
            ctx.fillRect(screenX, GROUND_Y, platform.width, 3);
            ctx.fillStyle = '#3d3d6b';
        }
    },

    reset() {
        for (const platform of this.platforms) {
            platform.active = false;
            platform.passed = false;
        }
        this.nextPlatformX = 0;
        this.lastGapWidth = 0;
        this.gapsSinceLastSafe = 0;
        this.createInitialGround();
    }
};

// ============================================================================
// ENEMY (The Tooth Thief)
// ============================================================================

const Enemy = {
    relativeX: 300,
    y: GROUND_Y - 60,
    width: 40,
    height: 60,

    baseRelativeX: 300,
    bobAmplitude: 20,
    bobFrequency: 2,

    animFrame: 0,
    animTimer: 0,

    isJumping: false,
    jumpTimer: 0,

    init() {
        this.relativeX = 300;
        this.y = GROUND_Y - this.height;
        this.isJumping = false;
        this.jumpTimer = 0;
    },

    update(dt) {
        // Horizontal bobbing
        const bobOffset = Math.sin(GameState.gameTime / 1000 * this.bobFrequency) * this.bobAmplitude;
        this.relativeX = this.baseRelativeX + bobOffset;

        this.baseRelativeX = 300 + GameState.difficultyLevel * 20;

        // Jump animation
        if (this.isJumping) {
            this.jumpTimer += dt;
            const jumpDuration = 600;
            const jumpHeight = 80;
            const progress = this.jumpTimer / jumpDuration;

            if (progress < 1) {
                this.y = GROUND_Y - this.height - jumpHeight * Math.sin(progress * Math.PI);
            } else {
                this.y = GROUND_Y - this.height;
                this.isJumping = false;
                this.jumpTimer = 0;
            }
        }

        // Check for gaps ahead and jump over them
        if (!this.isJumping) {
            const enemyWorldX = Camera.worldX + Player.x + this.relativeX;
            const enemyCenterX = enemyWorldX + this.width / 2;
            const lookAheadDistance = 100; // Look 100px ahead
            const checkX = enemyCenterX + lookAheadDistance;

            // Check if there's a platform at the look-ahead position
            let platformAhead = false;
            for (const platform of PlatformManager.platforms) {
                if (!platform.active) continue;

                if (checkX >= platform.worldX && checkX <= platform.worldX + platform.width) {
                    platformAhead = true;
                    break;
                }
            }

            // Check if there's a platform at current position
            let platformCurrent = false;
            for (const platform of PlatformManager.platforms) {
                if (!platform.active) continue;

                if (enemyCenterX >= platform.worldX && enemyCenterX <= platform.worldX + platform.width) {
                    platformCurrent = true;
                    break;
                }
            }

            // If on a platform now but no platform ahead, there's a gap - jump!
            if (platformCurrent && !platformAhead) {
                this.isJumping = true;
                this.jumpTimer = 0;
            }
        }

        // Animation
        this.animTimer += dt;
        if (this.animTimer >= 80) {
            this.animTimer -= 80;
            this.animFrame = (this.animFrame + 1) % 4;
        }
    },

    render() {
        const screenX = Player.x + this.relativeX;

        ctx.save();

        // Body
        ctx.fillStyle = '#ef5350';
        ctx.fillRect(screenX, this.y, this.width, this.height);

        // Head
        ctx.fillStyle = '#ffcc80';
        ctx.beginPath();
        ctx.arc(screenX + this.width / 2, this.y + 15, 12, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(screenX + this.width / 2 - 6, this.y + 13, 2, 0, Math.PI * 2);
        ctx.arc(screenX + this.width / 2 - 1, this.y + 13, 2, 0, Math.PI * 2);
        ctx.fill();

        // Mouth with stolen tooth
        ctx.fillStyle = '#000';
        ctx.fillRect(screenX + this.width / 2 - 6, this.y + 20, 12, 6);
        ctx.fillStyle = '#fff';
        ctx.fillRect(screenX + this.width / 2 - 5, this.y + 21, 10, 4);

        // Tongue
        ctx.fillStyle = '#ff7070';
        ctx.fillRect(screenX + this.width / 2 - 2, this.y + 25, 4, 2);

        // Legs
        ctx.fillStyle = '#b71c1c';
        const legOffset = this.isJumping ? 0 : Math.sin(this.animFrame * Math.PI / 2) * 3;
        ctx.fillRect(screenX + 8, this.y + this.height - 15 + legOffset, 8, 15 - legOffset);
        ctx.fillRect(screenX + this.width - 16, this.y + this.height - 15 - legOffset, 8, 15 + legOffset);

        ctx.restore();
    },

    reset() {
        this.init();
    }
};

// ============================================================================
// SCORE MANAGER
// ============================================================================

const ScoreManager = {
    distanceScore: 0,
    gapBonus: 0,
    comboMultiplier: 1,
    consecutiveGaps: 0,

    update(dt) {
        const newDistance = Math.floor(Camera.worldX / 10);
        if (newDistance > this.distanceScore) {
            const pointsEarned = newDistance - this.distanceScore;
            this.distanceScore = newDistance;
            GameState.score += pointsEarned;
        }
    },

    onGapCleared() {
        this.consecutiveGaps++;
        this.comboMultiplier = Math.min(5, 1 + this.consecutiveGaps * 0.5);

        const basePoints = 10;
        const bonus = Math.floor(basePoints * this.comboMultiplier);

        this.gapBonus += bonus;
        GameState.score += bonus;
    },

    reset() {
        this.distanceScore = 0;
        this.gapBonus = 0;
        this.comboMultiplier = 1;
        this.consecutiveGaps = 0;
    }
};

// ============================================================================
// DIFFICULTY MANAGER
// ============================================================================

const DifficultyManager = {
    update(dt) {
        const dtSeconds = dt / 1000;

        const speedIncrease = SCROLL_ACCELERATION * dtSeconds;
        GameState.currentScrollSpeed = Math.min(
            SCROLL_SPEED_MAX,
            GameState.currentScrollSpeed + speedIncrease
        );

        const newLevel = Math.floor(GameState.gameTime / 15000) + 1;
        if (newLevel > GameState.difficultyLevel) {
            GameState.difficultyLevel = newLevel;
        }
    },

    reset() {
        GameState.currentScrollSpeed = SCROLL_SPEED_INITIAL;
        GameState.difficultyLevel = 1;
    }
};

// ============================================================================
// UI MANAGER
// ============================================================================

const UI = {
    render() {
        switch (GameState.screen) {
            case 'START':
                this.renderStartScreen();
                break;
            case 'PLAYING':
                this.renderHUD();
                break;
            case 'GAMEOVER':
                this.renderHUD();
                this.renderGameOverOverlay();
                break;
        }
    },

    renderStartScreen() {
        ctx.fillStyle = '#0a0a20';
        ctx.fillRect(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);

        ctx.fillStyle = '#4fc3f7';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('GAP CHASE', DESIGN_WIDTH / 2, DESIGN_HEIGHT / 3 - 20);

        ctx.fillStyle = '#ffffff';
        ctx.font = '18px Arial';
        ctx.fillText('Get your tooth back!', DESIGN_WIDTH / 2, DESIGN_HEIGHT / 3 + 20);

        ctx.fillStyle = '#888888';
        ctx.font = '14px Arial';
        const instructions = [
            'TAP to JUMP',
            'TAP AGAIN for DOUBLE JUMP',
            'Avoid falling in gaps!'
        ];
        instructions.forEach((text, i) => {
            ctx.fillText(text, DESIGN_WIDTH / 2, DESIGN_HEIGHT * 0.6 + i * 25);
        });

        if (GameState.highScore > 0) {
            ctx.fillStyle = '#ffeb3b';
            ctx.font = '16px Arial';
            ctx.fillText(`High Score: ${GameState.highScore}`, DESIGN_WIDTH / 2, DESIGN_HEIGHT * 0.82);
        }

        ctx.fillStyle = '#4fc3f7';
        ctx.font = 'bold 20px Arial';
        const pulse = Math.sin(performance.now() / 500) * 0.3 + 0.7;
        ctx.globalAlpha = pulse;
        ctx.fillText('TAP TO START', DESIGN_WIDTH / 2, DESIGN_HEIGHT * 0.92);
        ctx.globalAlpha = 1;

        ctx.textAlign = 'left';
    },

    renderHUD() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(10, 10, 140, 50);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`${GameState.score}`, 20, 42);

        ctx.fillStyle = '#888888';
        ctx.font = '12px Arial';
        ctx.fillText(`${Math.floor(GameState.distanceTraveled)}m`, 20, 55);

        ctx.textAlign = 'right';
        ctx.fillStyle = '#4fc3f7';
        ctx.font = '16px Arial';
        ctx.fillText(`Gaps: ${GameState.gapsCleared}`, DESIGN_WIDTH - 20, 30);

        ctx.textAlign = 'left';
    },

    renderGameOverOverlay() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);

        ctx.fillStyle = '#ef5350';
        ctx.font = 'bold 42px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', DESIGN_WIDTH / 2, DESIGN_HEIGHT / 3);

        ctx.fillStyle = '#888888';
        ctx.font = '16px Arial';
        ctx.fillText('You fell in a gap!', DESIGN_WIDTH / 2, DESIGN_HEIGHT / 3 + 35);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px Arial';
        ctx.fillText(`Score: ${GameState.score}`, DESIGN_WIDTH / 2, DESIGN_HEIGHT / 2);

        ctx.fillStyle = '#888888';
        ctx.font = '16px Arial';
        ctx.fillText(`Distance: ${Math.floor(GameState.distanceTraveled)}m`, DESIGN_WIDTH / 2, DESIGN_HEIGHT / 2 + 35);
        ctx.fillText(`Gaps Cleared: ${GameState.gapsCleared}`, DESIGN_WIDTH / 2, DESIGN_HEIGHT / 2 + 55);

        if (GameState.isNewHighScore) {
            ctx.fillStyle = '#ffeb3b';
            ctx.font = 'bold 20px Arial';
            ctx.fillText('NEW HIGH SCORE!', DESIGN_WIDTH / 2, DESIGN_HEIGHT * 0.72);
        } else if (GameState.highScore > 0) {
            ctx.fillStyle = '#888888';
            ctx.font = '16px Arial';
            ctx.fillText(`Best: ${GameState.highScore}`, DESIGN_WIDTH / 2, DESIGN_HEIGHT * 0.72);
        }

        ctx.fillStyle = '#4fc3f7';
        ctx.font = 'bold 18px Arial';
        const pulse = Math.sin(performance.now() / 500) * 0.3 + 0.7;
        ctx.globalAlpha = pulse;
        ctx.fillText('TAP TO PLAY AGAIN', DESIGN_WIDTH / 2, DESIGN_HEIGHT * 0.88);
        ctx.globalAlpha = 1;

        ctx.textAlign = 'left';
    }
};

// ============================================================================
// GAME LOOP
// ============================================================================

const FIXED_TIMESTEP = 1000 / 60;
let accumulator = 0;

function gameLoop(timestamp) {
    if (GameState.lastTime === 0) {
        GameState.lastTime = timestamp;
    }

    GameState.deltaTime = timestamp - GameState.lastTime;
    GameState.lastTime = timestamp;

    if (GameState.deltaTime > 250) {
        GameState.deltaTime = 250;
    }

    accumulator += GameState.deltaTime;

    while (accumulator >= FIXED_TIMESTEP) {
        update(FIXED_TIMESTEP);
        accumulator -= FIXED_TIMESTEP;
    }

    render();

    requestAnimationFrame(gameLoop);
}

function update(dt) {
    Input.update(dt);

    switch (GameState.screen) {
        case 'START':
            if (Input.jumpJustPressed) {
                resetGame();
            }
            break;

        case 'PLAYING':
            GameState.gameTime += dt;
            DifficultyManager.update(dt);
            Camera.update(dt);
            Background.update(dt);
            PlatformManager.update(dt);
            Player.update(dt);
            Enemy.update(dt);
            ScoreManager.update(dt);
            break;

        case 'GAMEOVER':
            if (Input.jumpJustPressed) {
                resetGame();
            }
            break;
    }
}

function render() {
    ctx.fillStyle = '#0a0a20';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    switch (GameState.screen) {
        case 'START':
            UI.renderStartScreen();
            break;

        case 'PLAYING':
        case 'GAMEOVER':
            Background.render();
            PlatformManager.render();
            Enemy.render();
            Player.render();
            UI.render();
            break;
    }

    ctx.restore();

    if (DEBUG) {
        ctx.fillStyle = '#00ff00';
        ctx.font = '12px monospace';
        ctx.fillText(`FPS: ${Math.round(1000 / GameState.deltaTime)}`, 10, canvas.height - 45);
        ctx.fillText(`Jump: ${Player.jumpState}`, 10, canvas.height - 30);
        ctx.fillText(`Speed: ${Math.round(GameState.currentScrollSpeed)}`, 10, canvas.height - 15);
    }
}

// ============================================================================
// GAME STATE FUNCTIONS
// ============================================================================

function resetGame() {
    GameState.reset();
    Camera.reset();
    Background.reset();
    PlatformManager.reset();
    Player.init();
    Enemy.reset();
    ScoreManager.reset();
    DifficultyManager.reset();
    Input.reset();
}

function gameOver() {
    GameState.screen = 'GAMEOVER';
    GameState.isRunning = false;
    checkAndSaveHighScore();
}

function checkAndSaveHighScore() {
    if (GameState.score > GameState.highScore) {
        GameState.highScore = GameState.score;
        GameState.isNewHighScore = true;
        localStorage.setItem('gapchase_highscore', GameState.highScore.toString());
    }
}

function loadHighScore() {
    const saved = localStorage.getItem('gapchase_highscore');
    GameState.highScore = saved ? parseInt(saved, 10) : 0;
}

// ============================================================================
// INITIALIZATION
// ============================================================================

function initGame() {
    console.log('Gap Chase - Initializing...');

    loadHighScore();
    resizeCanvas();

    Input.init();
    Background.init();
    PlatformManager.init();
    Player.init();
    Enemy.init();

    GameState.screen = 'START';

    requestAnimationFrame(gameLoop);

    console.log('Gap Chase - Ready!');
}

// ============================================================================
// MOBILE OPTIMIZATIONS
// ============================================================================

document.body.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

document.addEventListener('contextmenu', (e) => e.preventDefault());

// ============================================================================
// START
// ============================================================================

if (document.readyState === 'complete') {
    initGame();
} else {
    window.addEventListener('load', initGame);
}
