class Layer {
    constructor(game, width, height, speedModifier, image) {
        this.game = game;
        this.width = width;
        this.height = height;
        this.speedModifier = speedModifier;
        this.image = image;

        this.x = 0;
        this.y = 0;
    }

    update() {
        if (this.x < -this.width) this.x = 0;
        else this.x -= this.game.speed * this.speedModifier;
    }

    draw(context) {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.x + this.width - this.game.speed * this.speedModifier, this.y, this.width, this.height);
    }
}



export class CityBackground {
    constructor(game) {
        this.game = game;
        game.groundMargin = 80;

        this.width = 1667;
        this.height = 500;
        this.layer1Image = cityBackgroundImage1;
        this.layer2Image = cityBackgroundImage2;
        this.layer3Image = cityBackgroundImage3;
        this.layer4Image = cityBackgroundImage4;
        this.layer5Image = cityBackgroundImage5;
        this.layer1 = new Layer(this.game, this.width, this.height, 0, this.layer1Image);
        this.layer2 = new Layer(this.game, this.width, this.height, 0.2, this.layer2Image);
        this.layer3 = new Layer(this.game, this.width, this.height, 0.4, this.layer3Image);
        this.layer4 = new Layer(this.game, this.width, this.height, 0.8, this.layer4Image);
        this.layer5 = new Layer(this.game, this.width, this.height, 1, this.layer5Image);
        
        this.backgroundLayers = [
            this.layer1,
            this.layer2,
            this.layer3,
            this.layer4,
            this.layer5
        ];
    }

    update() {
        this.backgroundLayers.forEach(layer => layer.update());
    }

    draw(context) {
        this.backgroundLayers.forEach(layer => layer.draw(context));
    }
}



export class ForestBackground {
    constructor(game) {
        this.game = game;
        game.groundMargin = 40;

        this.width = 1667;
        this.height = 500;
        this.layer1Image = forestBackgroundImage1;
        this.layer2Image = forestBackgroundImage2;
        this.layer3Image = forestBackgroundImage3;
        this.layer4Image = forestBackgroundImage4;
        this.layer5Image = forestBackgroundImage5;
        this.layer1 = new Layer(this.game, this.width, this.height, 0, this.layer1Image);
        this.layer2 = new Layer(this.game, this.width, this.height, 0.2, this.layer2Image);
        this.layer3 = new Layer(this.game, this.width, this.height, 0.4, this.layer3Image);
        this.layer4 = new Layer(this.game, this.width, this.height, 0.8, this.layer4Image);
        this.layer5 = new Layer(this.game, this.width, this.height, 1, this.layer5Image);
        
        this.backgroundLayers = [
            this.layer1,
            this.layer2,
            this.layer3,
            this.layer4,
            this.layer5
        ];
    }

    update() {
        this.backgroundLayers.forEach(layer => layer.update());
    }

    draw(context) {
        this.backgroundLayers.forEach(layer => layer.draw(context));
    }
}