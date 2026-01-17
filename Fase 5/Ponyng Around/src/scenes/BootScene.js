import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');

        // PONIES
        this.ponies = [
            { key: 'Ache', path: 'assets/ponis/Ache/Ache_Complete.png' },
            { key: 'Haiire', path: 'assets/ponis/Haire/Haire_Complete.png' },
            { key: 'Domdomdadom', path: 'assets/ponis/Dod/Dom_Complete.png' },
            { key: 'Kamil', path: 'assets/ponis/Kamil/Kamil_Complete.png' },
            { key: 'Beersquiviry', path: 'assets/ponis/Beersquiviri/Beer_Complete.png' }
        ];
    }

    preload() {

        const { width, height } = this.scale;

        // OUR LOGO
        // -------------------------------
        this.load.image('logo', 'assets/logo.png');

        // -------------------------------
        // PROGRESS UIO
        // -------------------------------
        const barWidth = 600;
        const barHeight = 30;

        const progressBg = this.add.rectangle(width / 2, height / 2 + 50, barWidth, barHeight, 0x222222)
            .setOrigin(0.5);

        const progressBar = this.add.rectangle(width / 2 - barWidth / 2, height / 2 + 50, 0, barHeight, 0xff69b4)
            .setOrigin(0, 0.5);

        const loadingText = this.add.text(width / 2, height / 2 + 110, 'Loading... 0%', {
            fontFamily: 'Arial Black',
            fontSize: '36px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Our big LOGOO!!!!!!!

        this.load.on('filecomplete-image-logo', () => {
            this.add.image(width / 2, height / 2 - 150, 'logo')
                .setScale(0.7)
                .setAlpha(0.9);
        });

        //Update progress
        this.load.on('progress', value => { //Phaser gives us this!
            progressBar.width = barWidth * value; //Adjust the value of bar, 0 is 0, 100 is 600
            loadingText.setText(`Loading... ${Math.floor(value * 100)}%`); //Convert into a 0-100 scale numebr
        });


        // CHARACTER SELECT SCENE//

        //Background music
        this.load.audio('selectionSong', 'assets/sound/selectionsong.mp3');

        //Click sound
        this.load.audio('clickSound', 'assets/sound/click.mp3');

        // Frame
        this.load.image('Frame', 'assets/Elements/GreenFrame.png');

        this.ponies.forEach(pony => {
            this.load.image(`${pony.key}_static`, pony.path);

        });

        // Bg
        this.load.image('pinkBackground', 'assets/Backgrounds/pinkBackground.png');

        // Character frames
        this.load.image('border1', 'assets/UI/Border1_Selector.png');
        this.load.image('border2', 'assets/UI/Border2_Selector.png');

        // Arrows buttons
        this.load.image('arrowIzq', 'assets/UI/ArrowIzq_Selector.png');
        this.load.image('arrowDer', 'assets/UI/ArrowDer_Selector.png');
        this.load.image('arrowIzqOn', 'assets/UI/ArrowIzqOn_Selector.png');
        this.load.image('arrowDerOn', 'assets/UI/ArrowDerOn_Selector.png');

        // Back button
        this.load.image('bttnBack', 'assets/Buttons/backBttn.PNG');
        this.load.image('bttnBackHover', 'assets/Buttons/backBttn_hover.PNG');

        // CREDITS SCENE//

        // Click sound
        this.load.audio('clickSound', 'assets/sound/click.mp3');

        // Music
        this.load.audio('creditMusic', 'assets/sound/CreditsSong.mp3');

        // Background
        this.load.image('creditsBg', 'assets/Backgrounds/CreditsBg.JPG');

        // Melgarga head
        this.load.image('head', 'assets/Elements/Head.PNG');

        //FINAL PRODUCT SCENE//

        //Click sound
        this.load.audio('tadaSound', 'assets/sound/tada.mp3');

        // ============ Videos ============

        // INTRO VIDEO
        this.load.video('ChargingAnim', 'assets/Animations/ChargingVid.mp4', 'loadeddata', false, true);

        // Ache
        this.load.video('AcheFinal_A', 'assets/Animations/AcheFinal.mp4', 'loadeddata', false, true);

        // Haire
        this.load.video('HaiireFinal_A', 'assets/Animations/HaiireFinal.mp4', 'loadeddata', false, true);

        // Dom
        this.load.video('DomdomdadomFinal_A', 'assets/Animations/DomFinal.mp4', 'loadeddata', false, true);

        // Beer
        this.load.video('BeersquiviryFinal_A', 'assets/Animations/BeerFinal.mp4', 'loadeddata', false, true);

        // Kamil and mayo
        this.load.video('KamilFinal_A', 'assets/Animations/KamilFinal.mp4', 'loadeddata', false, true);

        // ============ JPGS ============
        // Ache
        this.load.image('AcheFinal', 'assets/Backgrounds/AcheFinal.jpg');

        // Haire
        this.load.image('HaiireFinal', 'assets/Backgrounds/HaiireFinal.jpg');

        // Dom
        this.load.image('DomdomdadomFinal', 'assets/Backgrounds/DomFinal.jpg');

        // Beer
        this.load.image('BeersquiviryFinal', 'assets/Backgrounds/BeerFinal.jpg');

        // Kamil and mayo
        this.load.image('KamilFinal', 'assets/Backgrounds/KamilFinal.jpg');


        // Frame
        this.load.image('redFrame', 'assets/Elements/RedFrame.PNG');

        //FINAL SCENE//

        // ============== SOUNDS ==============
        // Chainsaw
        this.load.audio('chainsawSound', 'assets/sound/chainsaw.mp3');

        // Pipeline
        this.load.audio('pipelineSound', 'assets/sound/pipeline.mp3');

        // Crush
        this.load.audio('crushSound', 'assets/sound/crush.mp3');

        // Blood splash
        this.load.audio('bloodSplash', 'assets/sound/bloodSplash.mp3');

        // ============== BG SPRITES ==============
        // Background
        this.load.image('finalBackground', 'assets/Backgrounds/FinalScene_Background.JPG');

        // Frame
        this.load.image('redFrame', 'assets/Elements/RedFrame.PNG');

        // Crusher
        this.load.image('crusher', 'assets/Elements/Trituradora.PNG');

        // Back crusher
        this.load.image('backCrusher', 'assets/Elements/TrituradoraAtras.PNG');

        // Front tube
        this.load.image('frontTube', 'assets/Elements/Tuberia.PNG');

        // Back tube
        this.load.image('backTube', 'assets/Elements/TuberiaAtras.PNG');

        // Final animation video
        this.load.video('tubeVideo', 'assets/Animations/TubeAnim.mp4', 'loadeddata', false, true);

        // ============= PONIS =============
        this.load.image('AcheD', 'assets/ponis/Ache/Ache_Death.PNG');
        this.load.image('HaiireD', 'assets/ponis/Haire/Haire_Death.PNG');
        this.load.image('DomdomdadomD', 'assets/ponis/Dod/Dod_Death.PNG');
        this.load.image('KamilD', 'assets/ponis/Kamil/Kamil_Death.PNG');
        this.load.image('BeersquiviryD', 'assets/ponis/Beersquiviri/Beer_Death.PNG');

        // ============= SPRITES FOR ANIMATIONS =============
        // Wheels
        for (let i = 1; i <= 7; i++) {
            this.load.image(`Wheels${i}`, `assets/Animations/WheelAnim/Rueda${i}.PNG`);

        }

        // Platform
        for (let i = 1; i <= 8; i++) {
            this.load.image(`Platform${i}`, `assets/Animations/AnimCinta/cinta${i}.PNG`);
        }

        // Blood explosion
        for (let i = 1; i <= 10; i++) {
            this.load.image(`Blood${i}`, `assets/Animations/BloodAnim/blood${i}.PNG`);

        }


        // Meat
        for (let i = 1; i <= 12; i++) {
            this.load.image(`Meat${i}`, `assets/Animations/MeatAnim/meat${i}.PNG`);
        }

        //HELP SCENE//

        //Click sound
        this.load.audio('clickSound', 'assets/sound/click.mp3');

        // Background
        this.load.image('helpScreen', 'assets/Backgrounds/helpScreen.JPG');

        //INTRO ANIM SCENE//

        //Wind Sound effect
        this.load.audio('windSound', 'assets/sound/wind.mp3');

        //Creaking wood sound
        this.load.audio('creakSound', 'assets/sound/creaking.mp3');

        // Intro video
        this.load.video('introVideo', 'assets/Animations/Intro.mp4', 'loadeddata', false, true);

        // Newspaper video
        this.load.video('newsVideo', 'assets/Animations/IntroAnim1.mp4', 'loadeddata', false, true);

        // Missing video
        this.load.video('missingVideo', 'assets/Animations/IntroAnim2.mp4', 'loadeddata', false, true);

        //INTRO SCENE//

        //Pony Sound effect
        this.load.audio('pinkieSound', 'assets/sound/pinkie.mp3');


        this.load.image('logo', 'assets/logo.png');

        //MAIN MENU SCENE//

        //Background music
        this.load.audio('selectionSong', 'assets/sound/selectionsong.mp3');

        //Click sound
        this.load.audio('clickSound', 'assets/sound/click.mp3');

        // Background
        this.load.image('menuBackground', 'assets/Backgrounds/StartingMenu.JPG');

        // Buttons
        // Play button
        this.load.image('bttnPlay', 'assets/Buttons/playbttn.png');
        this.load.image('bttnPlayHover', 'assets//Buttons/playbttn_hover.png');

        // Settings button
        this.load.image('bttnSettings', 'assets/Buttons/settingsbttn.png');
        this.load.image('bttnSettingsHover', 'assets/Buttons/settingsbttn_hover.png');

        // Credit button
        this.load.image('bttnCredits', 'assets/Buttons/creditsbttn.png');
        this.load.image('bttnCreditsHover', 'assets/Buttons/creditsbttn_hover.png');

        // Story button
        this.load.image('bttnStory', 'assets/Buttons/loreBttn.PNG');
        this.load.image('bttnStoryHover', 'assets/Buttons/loreBttn_hover.PNG');

        // Exit button
        this.load.image('bttnExit', 'assets/Buttons/crossBttn.png')
        this.load.image('bttnExitHover', 'assets/Buttons/crossBttn_hover.png')

        //PAUSE SCENE

        //Click sound
        this.load.audio('clickSound', 'assets/sound/click.mp3');

        // Blood
        this.load.image('BloodPause', 'assets/Backgrounds/Pause.PNG');

        // Frame
        this.load.image('redFrame', 'assets/Elements/RedFrame.PNG');

        // Resume button
        this.load.image('bttnBackB', 'assets/Buttons/PauseBlood.PNG');
        this.load.image('bttnBackHoverB', 'assets/Buttons/PauseBlood_hover.PNG');

        // Main menu button
        this.load.image('bttnMainMenu', 'assets/Buttons/MainMenuBlood.PNG');
        this.load.image('bttnMainMenuHover', 'assets/Buttons/MainMenuBlood_hover.PNG');

        // Settings button
        this.load.image('bttnSettingsB', 'assets/Buttons/SettingsBlood.PNG');
        this.load.image('bttnSettingsHoverB', 'assets/Buttons/SettingsBlood_hover.PNG');

        // Exit button
        this.load.image('bttnExitB', 'assets/Buttons/crossBlood.PNG');
        this.load.image('bttnExitHoverB', 'assets/Buttons/crossBlood_hover.PNG');

        //RACE SCENE

        const g = this.make.graphics({ x: 0, y: 0, add: false });

        // --------------------- SOUNDS ---------------------

        //Background music
        this.load.audio('runningSong', 'assets/sound/runningsong.mp3');

        //Click sound
        this.load.audio('clickSound', 'assets/sound/click.mp3');

        // CountDown
        this.load.audio('CountSound', 'assets/sound/RaceCountdown.mp3');

        // Jumping sound
        this.load.audio('boingSound', 'assets/sound/jump.mp3');

        // Apple sound
        this.load.audio('appleSound', 'assets/sound/Bit.mp3');

        // Lemon sound
        this.load.audio('lemonSound', 'assets/sound/Lemon.mp3');

        // Kiwi sound
        this.load.audio('kiwiSound', 'assets/sound/Kiwi.mp3');

        // Crash sound
        this.load.audio('bonkSound', 'assets/sound/WoodBonk.mp3');

        // Winner sound
        this.load.audio('winSound', 'assets/sound/winSound.mp3');

        // ------------------------------------------

        // Background (blue)
        this.load.image('ColorBackground', 'assets/Backgrounds/fondoPlano.jpeg');

        // Middle line
        this.load.image('MiddleLine', 'assets/Elements/MiddleLine.PNG');

        // Floor tile
        this.load.image('TileFloor', 'assets/Backgrounds/TileableBackground1.png');

        // Background tile front (plants)
        this.load.image('Plants', 'assets/Backgrounds/TileableForefround.png');

        // Clouds
        this.load.image('Clouds', 'assets/Elements/Clouds.PNG');

        // SUN
        this.load.image('Sun', 'assets/Elements/Sun.PNG');

        // Wood Fence
        this.load.image('WoodFence', 'assets/Elements/WoodFence.PNG');

        // Finish line
        this.load.image('FinishLine', 'assets/Elements/FinishLine.PNG');

        // Frame
        this.load.image('redFrame', 'assets/Elements/RedFrame.PNG');

        // Bar
        this.load.image('iconP1', 'assets/ponis/Ache/Ache_Run1.png');
        this.load.image('iconP2', 'assets/ponis/Haire/Haire_Run1.png');

        // Lifes 
        this.load.image('Lives', 'assets/Elements/Lives_Full.png');
        this.load.image('LivesEmpty', 'assets/Elements/Lives_Empty.png');

        // Visibility reducer animation (poop)
        for (let i = 1; i <= 4; i++) {
            this.load.image(`poop${i}`, `assets/Elements/poopAnim/poop${i}.PNG`);
        }

        // =========== BUTTONS =============
        // Pause button
        this.load.image('bttnPause', 'assets/Buttons/pausebttn.png');
        this.load.image('bttnPauseHover', 'assets/Buttons/pausebttn_hover.png');

        // =========== PONIES =============
        // RUN ANIMATIONS:
        // Ache
        for (let i = 1; i <= 4; i++) {
            this.load.image(`AcheRun${i}`, `assets/ponis/Ache/Ache_Run${i}.PNG`);
        }
        // Haire
        for (let i = 1; i <= 4; i++) {
            this.load.image(`HaiireRun${i}`, `assets/ponis/Haire/Haire_Run${i}.PNG`);
        }
        // Kamil
        for (let i = 1; i <= 4; i++) {
            this.load.image(`KamilRun${i}`, `assets/ponis/Kamil/Kamil_Run${i}.PNG`);
        }
        // Beersquiviri
        for (let i = 1; i <= 4; i++) {
            this.load.image(`BeersquiviryRun${i}`, `assets/ponis/Beersquiviri/Beer_Run${i}.PNG`);
        }
        // Dom
        for (let i = 1; i <= 4; i++) {
            this.load.image(`DomdomdadomRun${i}`, `assets/ponis/Dod/Dod_Run${i}.PNG`);
        }

        // JUMP ANIMATIONS:
        // Ache
        for (let i = 1; i <= 3; i++) {
            this.load.image(`AcheJump${i}`, `assets/ponis/Ache/Ache_Jump${i}.PNG`);
        }
        // Haire
        for (let i = 1; i <= 3; i++) {
            this.load.image(`HaiireJump${i}`, `assets/ponis/Haire/Haire_Jump${i}.PNG`);
        }
        // Kamil
        for (let i = 1; i <= 3; i++) {
            this.load.image(`KamilJump${i}`, `assets/ponis/Kamil/Kamil_Jump${i}.PNG`);
        }
        // Beersquiviri
        for (let i = 1; i <= 3; i++) {
            this.load.image(`BeersquiviryJump${i}`, `assets/ponis/Beersquiviri/Beer_Jump${i}.PNG`);
        }
        // Dom
        for (let i = 1; i <= 3; i++) {
            this.load.image(`DomdomdadomJump${i}`, `assets/ponis/Dod/Dod_Jump${i}.PNG`);
        }

        // PowerUps
        this.load.image('LimeLemon', 'assets/Elements/LimeLemon_PowerUp.png');
        this.load.image('Apple', 'assets/Elements/Apple_PowerUp.png');
        this.load.image('Kawiki', 'assets/Elements/Kakiwi_PowerUp.png');

        //SETTINGS SCENE//

        //Click sound
        this.load.audio('clickSound', 'assets/sound/click.mp3');

        // Background
        this.load.image('BackgroundSet', 'assets/Backgrounds/SettingsBg.JPG');

        // Music icon
        this.load.image('Music', 'assets/Buttons/soundbttn.png');

        // Sound icon
        this.load.image('Sound', 'assets/Buttons/soundLvl.PNG');

        // =========== Buttons ==========

        // Help button
        this.load.image('bttnHelp', 'assets/Buttons/helpBttn.PNG');
        this.load.image('bttnHelpHover', 'assets/Buttons/helpBttn_hover.PNG');

        //STABLE SCENE//

        //Sound effect
        this.load.audio('windSound', 'assets/sound/wind.mp3');

        // Background
        this.load.image('Stable', 'assets/Backgrounds/stable.png');

        // Straw Ball Animation
        this.load.video('strawBall', 'assets/Animations/StableAnim.mp4', 'loadeddata', false, true);

        // Frame
        this.load.image('redFrame', 'assets/Elements/RedFrame.PNG');

        // Names
        this.load.image('Ache', 'assets/Elements/NamesStable/AcheName.png');
        this.load.image('Beersquiviry', 'assets/Elements/NamesStable/BeerName.png');
        this.load.image('Domdomdadom', 'assets/Elements/NamesStable/DomName.png');
        this.load.image('Haiire', 'assets/Elements/NamesStable/HaiireName.png');
        this.load.image('Kamil', 'assets/Elements/NamesStable/KamilMayoName.png');

        //STABLE SCENE//

        //Sound effect
        this.load.audio('windSound', 'assets/sound/wind.mp3');

        // Background
        this.load.image('Stable', 'assets/Backgrounds/stable.png');

        // Straw Ball Animation
        this.load.video('strawBall', 'assets/Animations/StableAnim.mp4', 'loadeddata', false, true);

        // Frame
        this.load.image('redFrame', 'assets/Elements/RedFrame.PNG');

        // Names
        this.load.image('Ache', 'assets/Elements/NamesStable/AcheName.png');
        this.load.image('Beersquiviry', 'assets/Elements/NamesStable/BeerName.png');
        this.load.image('Domdomdadom', 'assets/Elements/NamesStable/DomName.png');
        this.load.image('Haiire', 'assets/Elements/NamesStable/HaiireName.png');
        this.load.image('Kamil', 'assets/Elements/NamesStable/KamilMayoName.png');

        //STORY SCENE//

        //Sound
        this.load.audio('clickSound', 'assets/sound/click.mp3');

        // Background and general frame
        this.load.image('pinkBackground', 'assets/Backgrounds/pinkBackground.png');

        // Selector frame
        this.load.image('border1', 'assets/UI/Border1_Selector.png');

        // Arrows
        this.load.image('arrowIzq', 'assets/UI/ArrowIzq_Selector.png');
        this.load.image('arrowIzq_hover', 'assets/UI/ArrowIzqOn_Selector.png');
        this.load.image('arrowDer', 'assets/UI/ArrowDer_Selector.png');
        this.load.image('arrowDer_hover', 'assets/UI/ArrowDerOn_Selector.png');

        // Poni pic
        this.ponies.forEach(p => {
            this.load.image(`${p.key}_static`, p.path);
        });

    }

    create() {

    this.cameras.main.fadeOut(800, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('IntroScene');
        });
    }
}