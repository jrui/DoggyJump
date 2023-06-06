export class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = [];

        window.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowLeft':
                case 'ArrowRight':
                case 'ArrowUp':
                case 'ArrowDown':
                case 'Enter':
                    if (!this.keys.includes(event.key)) this.keys.push(event.key);
                    break;
                case 'd':
                    this.game.debug = !this.game.debug;
                default:
                    break;
            }
        });

        window.addEventListener('keyup', (event) => {
            switch (event.key) {
                case 'ArrowLeft':
                case 'ArrowRight':
                case 'ArrowUp':
                case 'ArrowDown':
                case 'Enter':
                    if (this.keys.includes(event.key)) this.keys.splice(this.keys.indexOf(event.key), 1);
                    break;
                default:
                    break;
            }
        });
    }
}