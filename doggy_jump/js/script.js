import { Player } from './player.js';
import { InputHandler } from './input.js';
import { Background } from './background.js';
import {
    FlyingEnemy,
    GroundEnemy,
    ClimbingEnemy
} from './enemy.js';
import { UI } from './ui.js';

window.addEventListener('load', function() {
    const ctx = canvas.getContext('2d');
    const CANVAS_WIDTH = canvas.width = 500;
    const CANVAS_HEIGHT = canvas.height = 500;



    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;

            this.groundMargin = 80;
            this.speed = 0;
            this.maxSpeed = 4;

            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.score = 0;
            this.fontColor = 'black';

            this.debug = true;

            this.background = new Background(this);
            this.player = new Player(this)
            this.input = new InputHandler(this);
            this.UI = new UI(this);
            this.enemies = [];
            this.particles = [];
            this.maxParticles = 50;

            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();
        }

        update(deltaTime) {
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
                if (enemy.markedForDeletion) this.enemies.splice(this.enemies.indexOf(enemy), 1);
            });

            // handle particles
            this.particles.forEach((particle, index) => {
                particle.update();
                if (particle.markedForDeletion) this.particles.splice(index, 1);
            });
            if (this.particles.length > this.maxParticles) this.particles = this.particles.slice(0, this.maxParticles);
        }

        draw(context) {
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.forEach(enemy => enemy.draw(context));
            this.particles.forEach(particle => particle.draw(context));
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

        requestAnimationFrame(animate);
    }
    animate(0);
});