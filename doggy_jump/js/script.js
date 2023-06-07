import { Player } from './player.js';
import { InputHandler } from './input.js';
import { 
    CityBackground,
    ForestBackground,
} from './background.js';
import {
    FlyingEnemy,
    GroundEnemy,
    ClimbingEnemy
} from './enemy.js';
import { UI } from './ui.js';

window.addEventListener('load', function() {
    const ctx = canvas.getContext('2d');
    const CANVAS_WIDTH = canvas.width = window.innerWidth;
    const CANVAS_HEIGHT = canvas.height = 500;



    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.background = Math.random() > 0.5 ? new ForestBackground(this) : new CityBackground(this);
            this.speed = 0;
            this.maxSpeed = 4;
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.fontColor = 'black';

            this.time = 0;
            this.maxTime = 30000;
            this.gameOver = false;
            this.lives = 3;
            this.score = 0;
            this.winningScore = 20;

            this.debug = false;

            this.player = new Player(this)
            this.input = new InputHandler(this);
            this.UI = new UI(this);
            this.enemies = [];
            this.collisions = [];
            this.particles = [];
            this.floatingMessages = [];
            this.maxParticles = 50;

            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();
        }

        update(deltaTime) {
            this.time += deltaTime;
            if (this.time > this.maxTime) {
                this.gameOver = true;
            }

            this.background.update();
            this.player.update(this.input.keys, deltaTime);

            // handle enemies
            if (this.enemyTimer > this.enemyInterval) {
                this.enemyTimer = 0;
                this.addEnemy();
            } else {
                this.enemyTimer += deltaTime;
            }
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
            });
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);

            // handle floating messages
            this.floatingMessages.forEach(message => message.update(deltaTime));
            this.floatingMessages = this.floatingMessages.filter(message => !message.markedForDeletion);

            // handle particles
            this.particles.forEach(particle => particle.update());
            this.particles = this.particles.filter(particle => !particle.markedForDeletion);
            if (this.particles.length > this.maxParticles) this.particles.length = this.maxParticles;

            // handle collisions
            this.collisions.forEach(collision => collision.update(deltaTime))
            this.collisions = this.collisions.filter(collision => !collision.markedForDeletion);
        }

        draw(context) {
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.forEach(enemy => enemy.draw(context));
            this.particles.forEach(particle => particle.draw(context));
            this.collisions.forEach(collision => collision.draw(context));
            this.floatingMessages.forEach(message => message.draw(context));
            this.UI.draw(context);
        }

        addEnemy() {
            if (this.speed > 0 && Math.random() < 0.5) this.enemies.push(new GroundEnemy(this));
            else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
            this.enemies.push(new FlyingEnemy(this));
        }   
    }


    let lastTime = 0;
    const game = new Game(CANVAS_WIDTH, CANVAS_HEIGHT);
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;

        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        game.update(deltaTime);
        game.draw(ctx);

        if(!game.gameOver) requestAnimationFrame(animate);
    }
    animate(0);
});