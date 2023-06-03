window.addEventListener('load', function() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const CANVAS_WIDTH = canvas.width = 1280;
    const CANVAS_HEIGHT = canvas.height = 720;

    let enemies = [];
    let score = 0; 
    let gameOver = false;


    class InputHandler {
        constructor() {
            this.keys = [];
            this.touchY = '';
            this.touchThreshold = 30;

            window.addEventListener('keydown', (e) => {
                if (( e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' ) && !this.keys.includes(e.key)) {
                    this.keys.push(e.key);
                } else if (e.key === 'Enter' && gameOver) {
                    restartGame();
                }
            });
            window.addEventListener('keyup', (e) => {
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                }
            });
            window.addEventListener('touchstart', (e) => {
                this.touchY = e.changedTouches[0].pageY;
            });
            window.addEventListener('touchmove', (e) => {
                const swipeDistance = e.changedTouches[0].pageY - this.touchY;
                if (swipeDistance < -this.touchThreshold && !this.keys.includes('Swipe Up')) {
                        this.keys.push('Swipe Up');
                } else if (swipeDistance > this.touchThreshold && !this.keys.includes('Swipe Down')) {
                    this.keys.push('Swipe Down');
                    if (gameOver) {
                        restartGame();
                    }
                }
            });
            window.addEventListener('touchend', (e) => {
                this.keys.splice(this.keys.indexOf('Swipe Up'), 1);
                this.keys.splice(this.keys.indexOf('Swipe Down'), 1);
            });
        }
    }



    class Player {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 200;
            this.height = 200;
            this.x = 100;
            this.y = this.gameHeight - this.height;

            this.image = playerImage;
            this.frameX = 0;
            this.maxFrame = 7; // should be 8 frames but is flickering
            this.frameY = 0;

            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000 / this.fps;

            this.speed = 0;
            this.vy = 0;
            this.weight = 1;
        }

        restart() {
            this.x = 100;
            this.y = this.gameHeight - this.height;
            this.maxFrame = 7;
            this.frameY = 0;
        }

        update(input, deltaTime, enemies) {
            // Collision detection
            enemies.forEach(enemy => {
                let dx = (enemy.x + enemy.width / 2 - 20) - (this.x + this.width / 2);
                let dy = (enemy.y + enemy.height / 2) - (this.y + this.height / 2);
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < enemy.width / 3 + this.width / 3) {
                    gameOver = true;
                }
            });

            // Sprite animation
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX > this.maxFrame) {
                    this.frameX = 0;
                } else {
                    this.frameX++;
                }
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }

            // Controls
            if (input.keys.includes('ArrowRight')) {
                this.speed = 5;
            } else if (input.keys.includes('ArrowLeft')) {
                this.speed = -5;
            } else if ((input.keys.includes('ArrowUp') || input.keys.includes('Swipe Up')) && this.onGround()) {
                this.vy -= 32;
            } else {
                this.speed = 0;
            }
            
            this.x += this.speed;
            if (this.x < 0) this.x = 0;
            else if (this.x + this.width > this.gameWidth) this.x = this.gameWidth - this.width;

            this.y += this.vy;
            if (!this.onGround()) {
                this.vy += this.weight;
                this.maxFrame = 5;
                this.frameY = 1;
            } else {
                this.vy = 0;
                this.maxFrame = 7;
                this.frameY = 0;
            }

            if(this.y > this.gameHeight - this.height) {
                this.y = this.gameHeight - this.height;
            }
        }

        onGround() {
            return this.y >= this.gameHeight - this.height;
        }

        draw(ctx) {
            // check colision boxes
            /**
                ctx.strokeStyle = 'white';
                ctx.strokeRect(this.x, this.y, this.width, this.height);
                ctx.beginPath();
                ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 3, 0, Math.PI * 2);
                ctx.stroke();
            */

            // draw sprite
            ctx.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
        }
    }



    class Background {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = backgroundImage;
            this.x = 0;
            this.y = 0;
            this.width = 2400;
            this.height = 720;
            this.speed = 7;
        }

        restart() {
            this.x = 0;
        }

        update() {
            this.x -= this.speed;
            if (this.x < -this.width) this.x = 0;
        }

        draw(ctx) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this.height);
        }
    }



    class Enemy {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 160;
            this.height = 119;
            this.x = this.gameWidth;
            this.y = this.gameHeight - this.height;
            this.speed = 8;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000 / this.fps;
            this.maxFrame = 5;

            this.image = enemyImage;
            this.frameX = 0;

            this.markedForDeletion = false;
        }

        update(deltaTime) {
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.maxFrame) {
                    this.frameX = 0;
                } else {
                    this.frameX++;
                }
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }
            
            this.x -= this.speed;
            if (this.x < 0 - this.width) {
                this.markedForDeletion = true;
                score++;
            }
        }

        draw(ctx) {
            // check colision boxes
            /**
                ctx.strokeStyle = 'white';
                ctx.strokeRect(this.x, this.y, this.width, this.height);
                ctx.beginPath();
                ctx.arc(this.x + this.width / 2 - 20, this.y + this.height / 2, this.width / 3, 0, Math.PI * 2);
                ctx.stroke();
            **/
            
            // draw enemy image
            ctx.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
        }
    }


    let enemyTimer = 0;
    let enemyInterval = 2500;
    let randomEnemyInterval = Math.random() * 2000 - 1000;
    function handleEnemies(deltaTime) {
        if (enemyTimer > enemyInterval + randomEnemyInterval) {
            enemies.push(new Enemy(CANVAS_WIDTH, CANVAS_HEIGHT));
            enemyTimer = 0;
            randomEnemyInterval = Math.random() * 2000 - 1000;
        } else {
            enemyTimer += deltaTime;
        }
        
        enemies.forEach(enemy => {
            enemy.update(deltaTime);
            enemy.draw(ctx);
        });

        enemies = enemies.filter(enemy => !enemy.markedForDeletion);
    }


    function displayStatusText(context) {
        context.textAlign = 'left';
        context.font = '40px Helvetica';
        context.fillStyle = 'black';
        context.fillText('Score: ' + score, 20, 50);
        context.fillStyle = 'white';
        context.fillText('Score: ' + score, 22, 52);

        if (gameOver) {
            context.textAlign = 'center';
            context.fillStyle = 'black';
            context.font = '50px Helvetica';
            context.fillText('GAME OVER! press Enter or swipe down to try again.', CANVAS_WIDTH / 2, 200);
            context.fillStyle = 'white';
            context.fillText('GAME OVER! press Enter or swipe down to try again.', CANVAS_WIDTH / 2 + 2, 202);
        }
    }


    function restartGame() {
        gameOver = false;
        score = 0;
        enemies = [];
        background.restart();
        player.restart();
        animate(0);
    }


    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            canvas
                .requestFullscreen()
                .catch(err => window.alert(`Error attempting to enable full-screen mode: ${err.message}`));
        } else {
            document.exitFullscreen();
        }
    }
    fullScreenButton.addEventListener('click', toggleFullScreen);


    const input = new InputHandler();
    const player = new Player(CANVAS_WIDTH, CANVAS_HEIGHT);
    const background = new Background(CANVAS_WIDTH, CANVAS_HEIGHT);

    let lastTime = 0;
    function animate(timeStamp) {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        let deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        
        //background.update();
        background.draw(ctx);
        
        player.update(input, deltaTime, enemies);
        player.draw(ctx);

        handleEnemies(deltaTime);
        displayStatusText(ctx);

        if (!gameOver) requestAnimationFrame(animate);
    }
    animate(0);
});