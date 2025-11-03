import IntroScene from './scenes/IntroScene.js';
import MainMenuScene from './scenes/MainMenuScene.js';
import CharacterSelectScene from './scenes/CharacterSelectScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [IntroScene, MainMenuScene, CharacterSelectScene]
};

const game = new Phaser.Game(config);
