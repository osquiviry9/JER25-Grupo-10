import IntroScene from './scenes/IntroScene.js';
import MainMenuScene from './scenes/MainMenuScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [IntroScene, MainMenuScene]
};

const game = new Phaser.Game(config);
