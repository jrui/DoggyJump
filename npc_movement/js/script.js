/** @type {HTMLCanvasElement} **/
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 800;
const CANVAS_HEIGHT = canvas.height = 700;

const numberOfEnemies = 30;
let enemiesArray = [];
let gameFrame = 0;

class Enemy1 {
    constructor() {
        this.image = new Image();
        this.image.src = 'enemies/enemy1.png';

        this.spriteWidth = 293;
        this.spriteHeight = 155;
        this.width = this.spriteWidth / 2.5;
        this.height = this.spriteHeight / 2.5;

        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);

        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 10 + 5);
        this.numberOfSprites = 6;
    }

    update() {
        this.x += Math.random() * 12 - 6;
        this.y += Math.random() * 12 - 6;

        if (gameFrame % this.flapSpeed === 0) {
            this.frame > 4 ? this.frame = 0 : this.frame++;
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
            this.y,
            this.width,
            this.height
        );
    }
}

class Enemy2 {
    constructor() {
        this.image = new Image();
        this.image.src = 'enemies/enemy2.png';

        this.spriteWidth = 266;
        this.spriteHeight = 188;
        this.width = this.spriteWidth / 2.5;
        this.height = this.spriteHeight / 2.5;

        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);

        this.speed = Math.random() * 4 + 1;
        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 10 + 5);

        this.angle = 0;
        this.angleSpeed = Math.random() * 0.2;
        this.curve = Math.random() * 7;
    }

    update() {
        this.x -= this.speed; 
        this.y += this.curve * Math.sin(this.angle);
        this.angle += this.angleSpeed;

        if (this.x + this.width < 0) {
            this.x = canvas.width;
        }

        if (gameFrame % this.flapSpeed === 0) {
            this.frame > 4 ? this.frame = 0 : this.frame++;
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
            this.y,
            this.width,
            this.height
        );
    }
}

class Enemy3 {
    constructor() {
        this.image = new Image();
        this.image.src = 'enemies/enemy3.png';

        this.spriteWidth = 218;
        this.spriteHeight = 177;
        this.width = this.spriteWidth / 2.5;
        this.height = this.spriteHeight / 2.5;

        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);

        this.speed = Math.random() * 4 + 1;
        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 10 + 5);

        this.angle = Math.random() * 500;
        this.angleSpeed = Math.random() * 0.5 + 0.5;
    }

    update() {
        this.x = (canvas.width / 2) * Math.sin(this.angle * Math.PI / 200) + (canvas.width / 2 - this.width / 2);
        this.y = (canvas.height / 2) * Math.cos(this.angle * Math.PI / 230 ) + (canvas.height / 2 - this.height / 2);
        this.angle += this.angleSpeed;

        if (this.x + this.width < 0) {
            this.x = canvas.width;
        }

        if (gameFrame % this.flapSpeed === 0) {
            this.frame > 4 ? this.frame = 0 : this.frame++;
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
            this.y,
            this.width,
            this.height
        );
    }
}

class Enemy4 {
    constructor() {
        this.image = new Image();
        this.image.src = 'enemies/enemy4.png';

        this.spriteWidth = 213;
        this.spriteHeight = 213;
        this.width = this.spriteWidth / 2.5;
        this.height = this.spriteHeight / 2.5;

        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);
        this.newX = Math.random() * canvas.width;
        this.newY = Math.random() * canvas.height;

        this.speed = Math.random() * 4 + 1;
        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 10 + 5);
        this.interval = Math.floor(Math.random() * 200 + 50);
    }

    update() {
        if (gameFrame % this.interval === 0) {
            this.newX = Math.random() * (canvas.width - this.width);
            this.newY = Math.random() * (canvas.height - this.height);
        }
        let dx = this.x - this.newX;
        let dy = this.y - this.newY;

        this.x -= dx / 70;
        this.y -= dy / 70;

        if (this.x + this.width < 0) {
            this.x = canvas.width;
        }

        if (gameFrame % this.flapSpeed === 0) {
            this.frame > 4 ? this.frame = 0 : this.frame++;
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
            this.y,
            this.width,
            this.height
        );
    }
}


for (let i = 0; i < numberOfEnemies; i++) {
    enemiesArray.push(new Enemy1());
}
const dropdown = document.getElementById('animations');
dropdown.addEventListener('change', function (e) {
    enemiesArray = [];
    for (let i = 0; i < numberOfEnemies; i++) {
        switch(e.target.value) {
            case "enemy1":
                enemiesArray.push(new Enemy1());
                break;
            case "enemy2":
                enemiesArray.push(new Enemy2());
                break;
            case "enemy3":
                enemiesArray.push(new Enemy3());
                break;
            case "enemy4":
                enemiesArray.push(new Enemy4());
                break;
        }
    }
});



function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    for (let i = 0; i < enemiesArray.length; i++) {
        enemiesArray[i].update();
        enemiesArray[i].draw();
    }
    
    gameFrame++;
    requestAnimationFrame(animate);
}


animate();