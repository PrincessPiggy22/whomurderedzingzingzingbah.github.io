const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playerHealthBar = document.getElementById('playerHealthFill');
const bossHealthBar = document.getElementById('bossHealthFill');
const attackButton = document.getElementById('attackButton');

// Images
const images = {};
const imageSources = {
    heart: '../sprites/Heart.png',
    lorax: '../sprites/Lorax.png',
    truffle: '../sprites/Truffle.png',
    bearThing: '../sprites/BearThing.png',
    axe: '../sprites/Axe.png',
    truffleTree: '../sprites/TruffleTree.png'
};

let imagesLoaded = 0;
const totalImages = Object.keys(imageSources).length;

function loadImage(key, src) {
    images[key] = new Image();
    images[key].src = src;
    images[key].onload = () => {
        console.log(`${src} loaded`);
        imagesLoaded++;
        if (imagesLoaded === totalImages) {
            console.log('All images loaded, starting game');
            initGame();
        }
    };
    images[key].onerror = () => {
        console.log(`Failed to load ${src}`);
        imagesLoaded++;
        if (imagesLoaded === totalImages) {
            console.log('All images processed, starting game');
            initGame();
        }
    };
}

for (const [key, src] of Object.entries(imageSources)) {
    loadImage(key, src);
}

// Fallback: start game after 5 seconds even if images don't load
setTimeout(() => {
    if (!gameStarted) {
        console.log('Starting game with unloaded images');
        initGame();
    }
}, 5000);

let gameStarted = false;

// Game variables
let player = { x: 400, y: 500, width: 20, height: 20, health: 100 };
let boss = { x: 350, y: 50, width: 100, height: 100, health: 200 };
let attacks = [];
let truffleTrees = [];
let keys = {};

let attackTimer = 0;
let attackInterval = 100; // frames between attacks
let attackCooldown = 0; // Cooldown for player attacks

let currentPhase = 'safe';
let phaseTimer = 0;
const phaseDuration = 240; // frames, about 4 seconds at 60fps
const phases = ['safe', 'truffle', 'bearThing', 'axe'];
let currentPhaseIndex = 0;
let axeDirection = 'outward';

const phaseText = document.getElementById('phaseText');
const phaseTimerDiv = document.getElementById('phaseTimer');

function initGame() {
    console.log('initGame called');
    gameStarted = true;
    updateHealthBars();
    updatePhaseText();
    gameLoop();
}

function updatePhaseText() {
    let text;
    switch (currentPhase) {
        case 'safe':
            text = 'Safe Phase - Attack the Boss!';
            break;
        case 'truffle':
            text = 'Truffle Attack!';
            break;
        case 'bearThing':
            text = 'BearThing Attack!';
            break;
        case 'axe':
            text = 'Axe Attack!';
            break;
    }
    phaseText.textContent = text;
}

function updateHealthBars() {
    playerHealthBar.style.width = `${(player.health / 100) * 100}%`;
    bossHealthBar.style.width = `${(boss.health / 200) * 100}%`;
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function update() {
    // Phase management
    phaseTimer++;
    const timeLeft = Math.ceil((phaseDuration - phaseTimer) / 60); // seconds
    phaseTimerDiv.textContent = `Time left: ${timeLeft}s`;
    if (phaseTimer >= phaseDuration) {
        console.log('Phase changing');
        currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
        currentPhase = phases[currentPhaseIndex];
        phaseTimer = 0;
        if (currentPhase === 'axe') {
            axeDirection = axeDirection === 'outward' ? 'inward' : 'outward';
        }
        updatePhaseText();
    }

    // Player movement
    if (keys.ArrowLeft || keys.a) player.x -= 5;
    if (keys.ArrowRight || keys.d) player.x += 5;
    if (keys.ArrowUp || keys.w) player.y -= 5;
    if (keys.ArrowDown || keys.s) player.y += 5;

    // Keep player in bounds
    player.x = Math.max(50, Math.min(730, player.x));
    player.y = Math.max(300, Math.min(530, player.y)); // Box area

    // Generate attacks
    if (currentPhase !== 'safe') {
        attackTimer++;
        if (attackTimer >= attackInterval) {
            generateAttack();
            attackTimer = 0;
        }
    }

    // Update attacks
    attacks.forEach((attack, index) => {
        attack.update();
        if (attack.offScreen()) {
            attacks.splice(index, 1);
        }
        // Check collision with player
        if (collides(attack, player)) {
            player.health -= 10;
            attacks.splice(index, 1);
            updateHealthBars();
            if (player.health <= 0) {
                alert('You lost! Restarting...');
                resetGame();
            }
        }
        // Check collision with truffle trees (for axes)
        if (attack instanceof Axe) {
            truffleTrees.forEach((tree, treeIndex) => {
                if (collides(attack, tree)) {
                    truffleTrees.splice(treeIndex, 1);
                    attacks.splice(index, 1);
                }
            });
        }
    });

    // Check win
    if (boss.health <= 0) {
        alert('You won! Returning to title...');
        window.location.href = '../index.html';
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw box
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 300, 700, 250);

    // Draw boss
    if (images.lorax.complete && images.lorax.naturalHeight !== 0) {
        ctx.drawImage(images.lorax, boss.x, boss.y, boss.width, boss.height);
    } else {
        ctx.fillStyle = 'green';
        ctx.fillRect(boss.x, boss.y, boss.width, boss.height);
    }

    // Draw player
    if (images.heart.complete && images.heart.naturalHeight !== 0) {
        ctx.drawImage(images.heart, player.x, player.y, player.width, player.height);
    } else {
        ctx.fillStyle = 'red';
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    // Draw attacks
    attacks.forEach(attack => attack.draw());
}

function generateAttack() {
    let attack;

    switch (currentPhase) {
        case 'truffle':
            // Spawn truffles above the box, shooting down
            for (let i = 0; i < 10; i++) {
                let x = 50 + i * 70;
                attacks.push(new Truffle(x, 250, 8));
            }
            // Spawn truffles underneath the box, shooting up
            for (let i = 0; i < 10; i++) {
                let x = 50 + i * 70;
                attacks.push(new Truffle(x, 600, -8));
            }
            break;
        case 'bearThing':
            attack = new BearThing(boss.x + boss.width / 2, boss.y + boss.height);
            attacks.push(attack);
            break;
        case 'axe':
            // Spawn multiple axes in a cone shape, alternating directions
            let targetXs;
            if (axeDirection === 'outward') {
                targetXs = [150, 250, 550, 650]; // Outward positions
            } else {
                targetXs = [350, 450]; // Inward positions towards middle
            }
            targetXs.forEach(targetX => {
                attacks.push(new Axe(boss.x + boss.width / 2, boss.y + boss.height, targetX));
            });
            break;
    }
}

class Truffle {
    constructor(x, y, speed) {
        this.x = x - 10;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.speed = speed;
    }
    update() {
        this.y += this.speed;
    }
    draw() {
        if (images.truffle.complete && images.truffle.naturalHeight !== 0) {
            ctx.drawImage(images.truffle, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = 'brown';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    offScreen() {
        return this.y > canvas.height || this.y + this.height < 0;
    }
}

class BearThing {
    constructor(x, y) {
        this.x = x - 15;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.speed = 2;
        this.direction = 1;
        this.zigTimer = 0;
    }
    update() {
        this.y += this.speed;
        this.zigTimer++;
        if (this.zigTimer % 20 === 0) {
            this.direction *= -1;
        }
        this.x += this.direction * 4; // Increased zigzag amplitude
    }
    draw() {
        if (images.bearThing.complete && images.bearThing.naturalHeight !== 0) {
            ctx.drawImage(images.bearThing, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = 'blue';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    offScreen() {
        return this.y > canvas.height;
    }
}

class TruffleTree {
    constructor(x, y) {
        this.x = x - 15;
        this.y = y - 40;
        this.width = 50;
        this.height = 40;
    }
    draw() {
        if (images.truffleTree.complete && images.truffleTree.naturalHeight !== 0) {
            ctx.drawImage(images.truffleTree, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = 'green';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

class Axe {
    constructor(x, y, targetX) {
        this.x = x - 10;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.speed = 4;
        this.dx = (targetX - x) / Math.sqrt((targetX - x)**2 + 100**2) * this.speed;
        this.dy = 100 / Math.sqrt((targetX - x)**2 + 100**2) * this.speed;
    }
    update() {
        this.x += this.dx;
        this.y += this.dy;
    }
    draw() {
        if (images.axe.complete && images.axe.naturalHeight !== 0) {
            ctx.drawImage(images.axe, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = 'gray';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    offScreen() {
        return this.x < 0 || this.x > canvas.width || this.y > canvas.height;
    }
}

function collides(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function resetGame() {
    player.health = 150;
    boss.health = 200;
    player.x = 400;
    player.y = 500;
    attacks = [];
    attackCooldown = 30;
    currentPhase = 'safe';
    currentPhaseIndex = 0;
    phaseTimer = 0;
    updateHealthBars();
    updatePhaseText();
}

// Event listeners
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        e.preventDefault();
        if (currentPhase === 'safe' && attackCooldown === 0) {
            const damage = 5; 
            boss.health -= damage;
            updateHealthBars();
            attackCooldown = 15; // 0.5 seconds cooldown at 60fps
        }
    }
});
document.addEventListener('keyup', (e) => {
    if (e.key === ' ') {
        attackCooldown = 0; // Reset cooldown on key release
    }
});