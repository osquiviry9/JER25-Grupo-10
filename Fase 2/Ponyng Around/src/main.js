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
import HelpScene from './scenes/HelpScene.js';
import StoryScene from './scenes/storyScene.js';
import StableScene from './scenes/StableScene.js';


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
    ///scene: [MainMenuScene, SettingsScene, HelpScene,StoryScene, CreditsScene, CharacterSelectScene, RaceScene, PauseScene, FinalScene, FinalProductScene]
    // scene: [PauseScene]S
    //scene: [CharacterSelectScene, RaceScene, FinalScene]
   //scene : [StoryScene, MainMenuScene]
    //: [MainMenuScene, CharacterSelectScene, RaceScene, FinalScene]
    scene: [MainMenuScene, CharacterSelectScene,HelpScene,CreditsScene,SettingsScene,StoryScene, RaceScene, StableScene, FinalScene, FinalProductScene] //<- LA BUENA
};

new Phaser.Game(config);


