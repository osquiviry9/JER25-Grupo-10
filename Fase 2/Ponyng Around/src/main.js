import IntroScene from './scenes/IntroScene.js';
import MainMenuScene from './scenes/MainMenuScene.js';
import CharacterSelectScene from './scenes/CharacterSelectScene.js';
import RaceScene from './scenes/RaceScene.js';



const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,

    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },

    scene: [IntroScene, MainMenuScene, CharacterSelectScene, RaceScene]
};

new Phaser.Game(config);


