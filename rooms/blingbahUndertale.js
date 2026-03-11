const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playerHealthBar = document.getElementById('playerHealthFill');
const bossHealthBar = document.getElementById('bossHealthFill');
const attackButton = document.getElementById('attackButton');

// Images
const images = {};
const imageSources = {
    heart: '../sprites/Heart.png',
    blingbah: '../sprites/Blingbah.png',
    redChip: '../sprites/RedPokerChips.jpg',
    blueChip: '../sprites/BluePokerChip.jpg',
    greenChip: '../sprites/GreenPokerChip.png'
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
let boss = { x: 350, y: 50, width: 100, height: 100, health: 200, maxHealth: 200 };
let attacks = [];
let keys = {};

let attackTimer = 0;
let attackInterval = 60; // frames between attacks (was 100)
let attackCooldown = 0; // Cooldown for player attacks

let currentPhase = 'safe';
let phaseTimer = 0;
const phaseDuration = 180; // frames, about 3 seconds at 60fps (was 240)
const phases = ['safe', 'red', 'blue', 'green'];
let currentPhaseIndex = 0;

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
        case 'red':
            text = 'Red Chips!';
            break;
        case 'blue':
            text = 'Blue Chips!';
            break;
        case 'green':
            text = 'Green Chips!';
            break;
    }
    phaseText.textContent = text;
}

function updateHealthBars() {
    playerHealthBar.style.width = `${(player.health / 100) * 100}%`;
    bossHealthBar.style.width = `${(boss.health / boss.maxHealth) * 100}%`;
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
        currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
        currentPhase = phases[currentPhaseIndex];
        phaseTimer = 0;
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
            if (attack instanceof RedChip) {
                player.health -= 5;
            } else if (attack instanceof BlueChip) {
                player.health -= 10;
                attacks.push(new Explosion(attack.x, attack.y));
            } else if (attack instanceof GreenChip) {
                const dmg = 5;
                player.health -= dmg;
                if (boss.health < boss.maxHealth) {
                    boss.health = Math.min(boss.maxHealth, boss.health + dmg);
                }
            }
            attacks.splice(index, 1);
            updateHealthBars();
            if (player.health <= 0) {
                alert('You lost! Restarting...');
                resetGame();
            }
        }
    });

    // Check win
    if (boss.health <= 0) {
        alert('You defeated Blingbah!');
        window.location.href = 'DomeCar2.html';
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw box
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 300, 700, 250);

    // Draw boss
    if (images.blingbah && images.blingbah.complete && images.blingbah.naturalHeight !== 0) {
        ctx.drawImage(images.blingbah, boss.x, boss.y, boss.width, boss.height);
    } else {
        ctx.fillStyle = 'purple';
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
    switch (currentPhase) {
        case 'red':
            // shoot many red chips quickly toward the player's current x
            for (let i = 0; i < 10; i++) {
                const targetX = player.x + (Math.random() * 60 - 30);
                attacks.push(new RedChip(boss.x + boss.width / 2, boss.y + boss.height, targetX));
            }
            break;
        case 'blue':
            // single blue chip aimed at player
            attacks.push(new BlueChip(boss.x + boss.width / 2, boss.y + boss.height, player.x));
            break;
        case 'green':
            // single green chip, slower
            attacks.push(new GreenChip(boss.x + boss.width / 2, boss.y + boss.height, player.x));
            break;
    }
}

class RedChip {
    constructor(x, y, targetX) {
        this.x = x - 10;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.speed = 10; // even faster
        const dx = targetX - x;
        const dy = 300; // always move downwards
        const dist = Math.sqrt(dx * dx + dy * dy);
        this.dx = (dx / dist) * this.speed;
        this.dy = (dy / dist) * this.speed;
    }
    update() {
        this.x += this.dx;
        this.y += this.dy;
    }
    draw() {
        if (images.redChip && images.redChip.complete && images.redChip.naturalHeight !== 0) {
            ctx.drawImage(images.redChip, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    offScreen() {
        return this.x < 0 || this.x > canvas.width || this.y > canvas.height;
    }
}

class BlueChip {
    constructor(x, y, targetX) {
        this.x = x - 15; // adjust for larger size
        this.y = y;
        this.width = 30; // bigger chip
        this.height = 30;
        this.speed = 9; // even faster
        const dx = targetX - x;
        const dy = 300;
        const dist = Math.sqrt(dx * dx + dy * dy);
        this.dx = (dx / dist) * this.speed;
        this.dy = (dy / dist) * this.speed;
    }
    update() {
        this.x += this.dx;
        this.y += this.dy;
    }
    draw() {
        if (images.blueChip && images.blueChip.complete && images.blueChip.naturalHeight !== 0) {
            ctx.drawImage(images.blueChip, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = 'blue';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    offScreen() {
        return this.x < 0 || this.x > canvas.width || this.y > canvas.height;
    }
}

class GreenChip {
    constructor(x, y, targetX) {
        this.x = x - 10;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.speed = 8; // faster
        const dx = targetX - x;
        const dy = 300;
        const dist = Math.sqrt(dx * dx + dy * dy);
        this.dx = (dx / dist) * this.speed;
        this.dy = (dy / dist) * this.speed;
    }
    update() {
        this.x += this.dx;
        this.y += this.dy;
    }
    draw() {
        if (images.greenChip && images.greenChip.complete && images.greenChip.naturalHeight !== 0) {
            ctx.drawImage(images.greenChip, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = 'green';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    offScreen() {
        return this.x < 0 || this.x > canvas.width || this.y > canvas.height;
    }
}

class Explosion {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
    }
    update() {
        this.radius += 2;
    }
    draw() {
        ctx.fillStyle = 'orange';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
    offScreen() {
        return this.radius > 30;
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
    boss.health = boss.maxHealth;
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