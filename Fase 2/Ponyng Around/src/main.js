import IntroScene from './scenes/IntroScene.js';
import IntroAnimScene from './scenes/IntroAnimScene.js';
import MainMenuScene from './scenes/MainMenuScene.js';
import CharacterSelectScene from './scenes/CharacterSelectScene.js';
import RaceScene from './scenes/RaceScene.js';
import FinalScene from './scenes/FinalScene.js';


const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,

    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [CharacterSelectScene, RaceScene, FinalScene]
    // scene: [MainMenuScene, CharacterSelectScene, RaceScene, FinalScene]
    //scene: [IntroScene,IntroAnimScene,MainMenuScene, CharacterSelectScene, RaceScene, FinalScene] <- LA BUENA
};

new Phaser.Game(config);


