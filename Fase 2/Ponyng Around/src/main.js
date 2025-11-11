import IntroScene from './scenes/IntroScene.js';
import IntroAnimScene from './scenes/IntroAnimScene.js';
import MainMenuScene from './scenes/MainMenuScene.js';
import CharacterSelectScene from './scenes/CharacterSelectScene.js';
import RaceScene from './scenes/RaceScene.js';
import FinalScene from './scenes/FinalScene.js';
import SettingsScene from './scenes/SettingsScene.js';
import CreditsScene from './scenes/CreditsScene.js';
import PauseScene from './scenes/PauseScene.js';
import FinalProductScene from './scenes/FinalProductScene.js';


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
    scene: [MainMenuScene, SettingsScene, CreditsScene, CharacterSelectScene, RaceScene, PauseScene, FinalScene, FinalProductScene]
    //scene: [CharacterSelectScene,RaceScene]
    // scene: [CharacterSelectScene,RaceScene, FinalScene, FinalProductScene]
    // scene: [MainMenuScene, CharacterSelectScene, RaceScene, FinalScene]
    //scene: [IntroScene,IntroAnimScene,MainMenuScene, CharacterSelectScene, RaceScene, FinalScene] <- LA BUENA
};

new Phaser.Game(config);


