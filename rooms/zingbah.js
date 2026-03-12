let respawnLockTimer = 0; // frames where player cannot move

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playerHealthBar = document.getElementById('playerHealthFill');
const bossHealthBar = document.getElementById('bossHealthFill');

// Images
const images = {};
const imageSources = {
    heart: '../sprites/Heart.png',
    zingbah: '../sprites/Zingbah.png',
    ball: '../sprites/BluePokerChip.jpg' // reused as thrown ball
};

let imagesLoaded = 0;
const totalImages = Object.keys(imageSources).length;

function loadImage(key, src) {
    images[key] = new Image();
    images[key].src = src;
    images[key].onload = () => {
        imagesLoaded++;
        if (imagesLoaded === totalImages) initGame();
    };
    images[key].onerror = () => {
        imagesLoaded++;
        if (imagesLoaded === totalImages) initGame();
    };
}

for (const [k, s] of Object.entries(imageSources)) loadImage(k, s);

setTimeout(() => {
    if (!gameStarted) initGame();
}, 5000);

let gameStarted = false;

let player = { x: 400, y: 500, width: 20, height: 20, health: 100 };
let boss = { x: 350, y: 50, width: 100, height: 100, health: 200, maxHealth: 200 };
let attacks = [];
let keys = {};

let attackTimer = 0;
let attackCooldown = 0;

let currentPhase = 'safe';
let phaseTimer = 0;
const safePhaseDuration = 180;
const attackPhaseDuration = 300;
const phases = ['safe', 'ball', 'beam', 'rapid'];
let currentPhaseIndex = 0;

let beamSide = 'left';

const phaseText = document.getElementById('phaseText');
const phaseTimerDiv = document.getElementById('phaseTimer');

function initGame() {
    gameStarted = true;
    updateHealthBars();
    updatePhaseText();
    gameLoop();
}

function updatePhaseText() {
    let text;
    switch (currentPhase) {
        case 'safe': text = 'Safe Phase - Attack the Boss!'; break;
        case 'ball': text = 'Thrown Ball!'; break;
        case 'beam': text = 'Beam Attack!'; break;
        case 'rapid': text = 'Rapid Tiny Balls!'; break;
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
    phaseTimer++;

    if (respawnLockTimer > 0) {
    respawnLockTimer--;
    }

    const duration = (currentPhase === 'safe') ? safePhaseDuration : attackPhaseDuration;
    const timeLeft = Math.ceil((duration - phaseTimer) / 60);
    phaseTimerDiv.textContent = `Time left: ${timeLeft}s`;
    if (phaseTimer >= duration) {
        currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
        currentPhase = phases[currentPhaseIndex];
        phaseTimer = 0;
        updatePhaseText();
    }

    // movement
    if (respawnLockTimer === 0) {
    if (keys.ArrowLeft || keys.a) player.x -= 5;
    if (keys.ArrowRight || keys.d) player.x += 5;
    if (keys.ArrowUp || keys.w) player.y -= 5;
    if (keys.ArrowDown || keys.s) player.y += 5;
}

    player.x = Math.max(50, Math.min(730, player.x));
    player.y = Math.max(300, Math.min(530, player.y));

    if (currentPhase !== 'safe') {
        attackTimer++;
        if (attackTimer >= (currentPhase === 'beam' ? 120 : 60)) {
            generateAttack();
            attackTimer = 0;
        }
    }

    // iterate backwards so splicing is safe and allow early exit on reset
    for (let i = attacks.length - 1; i >= 0; i--) {
        const attack = attacks[i];
        attack.update();

        if (attack.offScreen()) {
            attacks.splice(i, 1);
            continue;
        }

        if (attack.collidesWithPlayer && collides(attack, player)) {
            attack.onHitPlayer && attack.onHitPlayer();
            attacks.splice(i, 1);
            updateHealthBars();
            if (player.health <= 0) {
                alert('You lost! Restarting...');
                resetGame();
                return; // bail out of update entirely
            }
            continue;
        }

        // beam has own collision check
        if (attack instanceof Beam && attack.checkPlayer(player)) {
            player.health = 0;
            updateHealthBars();
            alert('You got swept by the beam!');
            resetGame();
            return; // bail out
        }
    }

    if (boss.health <= 0) {
        alert('You defeated ZingZingZingbah!');
        window.location.href = 'DomeCar2.html';
    }
}

function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle='white'; ctx.lineWidth=2;
    ctx.strokeRect(50,300,700,250);

    if (images.zingbah && images.zingbah.complete && images.zingbah.naturalHeight!==0) {
        ctx.drawImage(images.zingbah, boss.x, boss.y, boss.width, boss.height);
    } else {
        ctx.fillStyle='purple'; ctx.fillRect(boss.x,boss.y,boss.width,boss.height);
    }

    if (images.heart.complete && images.heart.naturalHeight!==0) {
        ctx.drawImage(images.heart, player.x, player.y, player.width, player.height);
    } else {
        ctx.fillStyle='red'; ctx.fillRect(player.x,player.y,player.width,player.height);
    }

    attacks.forEach(a=>a.draw());
}

function generateAttack() {
    switch (currentPhase) {
        case 'ball':
            attacks.push(new ThrownBall(boss.x + boss.width/2, boss.y + boss.height, player.x));
            break;
        case 'beam':
            attacks.push(new Beam(beamSide));
            beamSide = beamSide === 'left' ? 'right' : 'left';
            break;
        case 'rapid':
            for (let i=0;i<8;i++) attacks.push(new TinyBall(boss.x + boss.width/2, boss.y + boss.height, player));
            break;
    }
}

class ThrownBall {
    constructor(x,y,targetX){
        this.x=x-10; this.y=y; this.width=20; this.height=20;
        this.speed=5; this.life=0;
        const dx=targetX-x; const dy=300; const dist=Math.sqrt(dx*dx+dy*dy)||1;
        this.dx=(dx/dist)*this.speed; this.dy=(dy/dist)*this.speed;
        this.collidesWithPlayer=true;
        this.onHitPlayer=()=>{
            // reduce health but leave at least 1 so only beam can kill instantly
            player.health = Math.max(1, player.health - 10);
            attacks.push(new Explosion(this.x,this.y));
        };
    }
    update(){
        this.x+=this.dx;
        this.y+=this.dy;
        this.life++;
        if(this.life>=60){attacks.push(new Explosion(this.x,this.y)); this.removed=true;}
    }
    draw(){
        if(images.ball && images.ball.complete && images.ball.naturalHeight!==0)
            ctx.drawImage(images.ball,this.x,this.y,this.width,this.height);
        else{ctx.fillStyle='blue';ctx.fillRect(this.x,this.y,this.width,this.height);}
    }
    offScreen(){return this.x<0||this.x>canvas.width||this.y>canvas.height||this.removed;}
}

class Beam {
    constructor(side){
        this.side=side;
        this.width=350; this.height=250; // half the box
        this.x = side==='left'?50:50+700-350;
        this.y = 300;
        this.warningDuration = 60;    // frames before beam fires (extended warning)
        this.activeDuration = 30;     // frames while damaging
        this.duration = this.warningDuration + this.activeDuration;
        this.active = false;
    }
    update(){
        this.duration--;
        if (this.duration <= this.activeDuration) {
            this.active = true;
        }
    }
    draw(){
        // turn red during warning, blue when active
        ctx.fillStyle = this.active ? 'cyan' : 'red';
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }
    offScreen(){return this.duration<=0;}
    checkPlayer(p){
        // only kill when beam is active
        if (!this.active) return false;
        return collides(this, p);
    }
}

class TinyBall {
    constructor(x,y,target){
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 10;

        this.speed = 6; // slower (was 8)

        this.target = target;

        this.life = 0;
        this.maxLife = 60; // explode after 1 second

        this.collidesWithPlayer = true;

        this.onHitPlayer = () => {
            player.health -= 3;
            attacks.push(new Explosion(this.x, this.y));
        };
    }

    update(){
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const dist = Math.sqrt(dx*dx + dy*dy) || 1;

        this.x += (dx/dist) * this.speed;
        this.y += (dy/dist) * this.speed;

        this.life++;

        if (this.life >= this.maxLife) {
            attacks.push(new Explosion(this.x, this.y));
            this.removed = true;
        }
    }

    draw(){
        ctx.fillStyle = 'orange';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    offScreen(){
        return this.removed || this.x<0 || this.x>canvas.width || this.y<0 || this.y>canvas.height;
    }
}

class Explosion {constructor(x,y){this.x=x;this.y=y;this.radius=0;}update(){this.radius+=2;}draw(){ctx.fillStyle='orange';ctx.beginPath();ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);ctx.fill();}offScreen(){return this.radius>30;}}

function collides(a,b){return a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;}

function resetGame(){
    player.health=100;
    boss.health=boss.maxHealth;
    player.x=400;
    player.y=500;
    respawnLockTimer = 45; // ~0.75 seconds at 60fps
    attacks=[];
    attackCooldown=30;
    currentPhase='safe';
    currentPhaseIndex=0;
    phaseTimer=0;
    updateHealthBars();
    updatePhaseText();}

document.addEventListener('keydown',e=>{keys[e.key]=true;});
document.addEventListener('keyup',e=>{keys[e.key]=false;});
document.addEventListener('keydown',e=>{if(e.key===' '&&currentPhase==='safe'&&attackCooldown===0){boss.health-=5;updateHealthBars();attackCooldown=15;}});
document.addEventListener('keyup',e=>{if(e.key===' ')attackCooldown=0;});
