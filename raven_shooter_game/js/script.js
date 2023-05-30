const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = window.innerWidth;
const CANVAS_HEIGHT = canvas.height = window.innerHeight;

const collisionCanvas = document.getElementById('collisionCanvas');
const collisionCtx = collisionCanvas.getContext('2d');
collisionCanvas.width = CANVAS_WIDTH;
collisionCanvas.height = CANVAS_HEIGHT;


let timeToNextRaven = 0;
let ravenIntervalInMillis = 500;
let lastLoopTime = 0;

let score = 0;
let gameOver = false;



let ravens = [];
class Raven {
    constructor() {
        this.image = new Image();
        this.image.src = 'assets/raven.png';
        this.spriteWidth = 271;
        this.spriteHeight = 194;

        this.sizeModifier = Math.random() * 0.6 + 0.4;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;

        this.x = CANVAS_WIDTH;
        this.y = Math.random() * (CANVAS_HEIGHT - this.height);

        this.directionX = Math.random() * 5 + 3;
        this.directionY = Math.random() * 5 - 2.5;

        this.markedForDeletion = false;
        this.frame = 0;
        this.maxFrame = 4;

        this.timeSinceFlap = 0;
        this.flapInterval = Math.random() * 50 + 50;

        this.randomColors = [
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255)
            , 255
        ];
        this.color = 'rgb(' + this.randomColors[0] + ',' + this.randomColors[1] + ',' + this.randomColors[2] + ',' + this.randomColors[3] + ')';

        this.hasTrail = Math.random() > 0.5;
    }

    update(deltaTime) {
        if (this.y < 0 || this.y > CANVAS_HEIGHT - this.height) this.directionY = this.directionY * -1;
        this.y += this.directionY;
        
        this.x -= this.directionX;
        if (this.x < 0 - this.width) this.markedForDeletion = true;

        this.timeSinceFlap += deltaTime;
        if (this.timeSinceFlap > this.flapInterval) {
            if (this.frame > this.maxFrame) this.frame = 0;
            else this.frame++;
            this.timeSinceFlap = 0;

            if (this.hasTrail) {
                for (let i = 0; i < 5; i++) {
                    particles.push(new Particle(this.x, this.y, this.width, this.color));
                }
            }
        }

        if (this.x < 0 - this.width) gameOver = true;
    }

    draw() {
        // Uncomment to show collision boxes
        collisionCtx.fillStyle = this.color;
        collisionCtx.fillRect(this.x, this.y, this.width, this.height);

        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}



let explosions = [];
class Explosion {
    constructor(x, y, sizeModifier) {
        this.image = new Image();
        this.image.src = 'assets/boom.png';
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.size = sizeModifier;
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.sound = new Audio();
        this.sound.src = 'assets/boom.wav';
        this.timeSinceLastFrame = 0;
        this.frameInterval = 200;
        this.markedForDeletion = false;
    }

    update(deltaTime) {
        if (this.frame === 0) this.sound.play();

        this.timeSinceLastFrame += deltaTime;
        if (this.timeSinceLastFrame > this.frameInterval) {
            this.frame++;
            this.timeSinceLastFrame = 0;
            if (this.frame > 5) this.markedForDeletion = true;
        }
    }

    draw() {
        ctx.drawImage(
            this.image,
            this.frame * this.spriteWidth,
            0,
            this.spriteWidth,
            this.spriteHeight,
            this.x,
            this.y - this.size / 4,
            this.size,
            this.size
        );
    }
}



let particles = [];
class Particle {
    constructor(x, y, size, color) {
        this.size = size;
        this.x = x + this.size / 2 + Math.random() * 50 - 25;
        this.y = y + this.size / 3 + Math.random() * 50 - 25;
        this.radius = Math.random() * this.size / 10;
        this.maxRadius = Math.random() * 20 + 35;
        this.markedForDeletion = false;
        this.speedX = Math.random() * 1 + 0.5;
        this.color = color;
    }

    update() {
        this.x += this.speedX;
        this.radius += 0.5;
        if (this.radius > this.maxRadius - 5) this.markedForDeletion = true;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = 1 - this.radius / this.maxRadius;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fill();
        ctx.restore();
    }
}



function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '50px Arial';
    ctx.fillText('Score: ' + score, 50, 75);
    ctx.fillStyle = 'white';
    ctx.font = '50px Arial';
    ctx.fillText('Score: ' + score, 52, 77);
}

function drawGameOver() {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.font = '50px Arial';
    ctx.fillText('GAME OVER, your score is ' + score, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    ctx.fillStyle = 'white';
    ctx.font = '50px Arial';
    ctx.fillText('GAME OVER, your score is ' + score, (CANVAS_WIDTH / 2) + 3, (CANVAS_HEIGHT / 2) + 3);
}


window.addEventListener('click', function(event) {
    const detectPixelColor = collisionCtx.getImageData(event.x, event.y, 1, 1);
    const pixelColor = detectPixelColor.data;

    ravens.forEach(raven => {
        if (raven.randomColors[0] === pixelColor[0] && raven.randomColors[1] === pixelColor[1] && raven.randomColors[2] === pixelColor[2]) {
            raven.markedForDeletion = true;
            ravens.splice(ravens.indexOf(raven), 1);
            score++;
            explosions.push(new Explosion(raven.x, raven.y, raven.width));
        }
    })
});


function animate(timestamp) {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    collisionCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    let deltaTime = timestamp - lastLoopTime;
    lastLoopTime = timestamp;
    timeToNextRaven += deltaTime;
    
    if (timeToNextRaven > ravenIntervalInMillis) {
        ravens.push(new Raven());
        timeToNextRaven = 0;
        ravens.sort(function(a, b) {
            return a.width - b.width;
        });
    }

    [...particles, ...ravens, ...explosions].forEach(object => object.update(deltaTime));
    [...particles, ...ravens, ...explosions].forEach(object => object.draw());
    
    ravens = ravens.filter(object => !object.markedForDeletion);
    explosions = explosions.filter(object => !object.markedForDeletion);
    particles = particles.filter(object => !object.markedForDeletion);

    drawScore();
    if (!gameOver) requestAnimationFrame(animate);
    else drawGameOver();
}
animate(0);