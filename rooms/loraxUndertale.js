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
    axe: '../sprites/Axe.png'
};

let imagesLoaded = 0;
const totalImages = Object.keys(imageSources).length;

function loadImage(key, src) {
    images[key] = new Image();
    images[key].src = src;
    images[key].onload = () => {
        imagesLoaded++;
        if (imagesLoaded === totalImages) {
            initGame();
        }
    };
}

for (const [key, src] of Object.entries(imageSources)) {
    loadImage(key, src);
}

// Game variables
let player = { x: 400, y: 500, width: 20, height: 20, health: 100 };
let boss = { x: 350, y: 50, width: 100, height: 100, health: 200 };
let attacks = [];
let keys = {};

let attackTimer = 0;
let attackInterval = 100; // frames between attacks

let currentPhase = 'safe';
let phaseTimer = 0;
const phaseDuration = 300; // frames, about 5 seconds at 60fps
const phases = ['safe', 'truffle', 'bearThing', 'axe'];

const phaseText = document.getElementById('phaseText');

function initGame() {
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

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function update() {
    // Phase management
    phaseTimer++;
    if (phaseTimer >= phaseDuration) {
        let newPhase;
        do {
            newPhase = phases[Math.floor(Math.random() * phases.length)];
        } while (newPhase === currentPhase); // Avoid same phase consecutively
        currentPhase = newPhase;
        phaseTimer = 0;
        updatePhaseText();
    }

    // Player movement
    if (keys.ArrowLeft || keys.a) player.x -= 5;
    if (keys.ArrowRight || keys.d) player.x += 5;
    if (keys.ArrowUp || keys.w) player.y -= 5;
    if (keys.ArrowDown || keys.s) player.y += 5;

    // Keep player in bounds
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    player.y = Math.max(300, Math.min(canvas.height - player.height, player.y)); // Box area

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
    ctx.drawImage(images.lorax, boss.x, boss.y, boss.width, boss.height);

    // Draw player
    ctx.drawImage(images.heart, player.x, player.y, player.width, player.height);

    // Draw attacks
    attacks.forEach(attack => attack.draw());
}

function generateAttack() {
    let attack;

    switch (currentPhase) {
        case 'truffle':
            attack = new Truffle(boss.x + boss.width / 2, boss.y + boss.height);
            break;
        case 'bearThing':
            attack = new BearThing(boss.x + boss.width / 2, boss.y + boss.height);
            break;
        case 'axe':
            attack = new Axe(boss.x + boss.width / 2, boss.y + boss.height, player.x + player.width / 2);
            break;
    }
    attacks.push(attack);
}

class Truffle {
    constructor(x, y) {
        this.x = x - 10;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.speed = 3;
    }
    update() {
        this.y += this.speed;
    }
    draw() {
        ctx.drawImage(images.truffle, this.x, this.y, this.width, this.height);
    }
    offScreen() {
        return this.y > canvas.height;
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
        this.x += this.direction * 2;
    }
    draw() {
        ctx.drawImage(images.bearThing, this.x, this.y, this.width, this.height);
    }
    offScreen() {
        return this.y > canvas.height;
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
        ctx.drawImage(images.axe, this.x, this.y, this.width, this.height);
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
    player.health = 100;
    boss.health = 200;
    player.x = 400;
    player.y = 500;
    attacks = [];
    updateHealthBars();
}

// Event listeners
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

attackButton.addEventListener('click', () => {
    const damage = Math.floor(Math.random() * 20) + 10; // 10-30 damage
    boss.health -= damage;
    updateHealthBars();
});