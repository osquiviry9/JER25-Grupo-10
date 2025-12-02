import Phaser from 'phaser';

export default class PauseScene extends Phaser.Scene {
    constructor() {
        super('PauseScene');
    }

    preload() {

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
    }

    create() {

        this.music = this.sound.add('clickSound', {
        });

        const { width, height } = this.scale;

        // Traer esta escena al frente por si acaso se pilla con el depth
        this.scene.bringToTop();

        // Frame
        this.add.image(width / 2, height / 2, 'redFrame').setDepth(11);

        // Overlay semitransparente aunque lo podemos cambiar!!!
        this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6)
            .setDepth(9);

        // Blood splash
        this.add.image(width / 2, height / 2, 'BloodPause')
            //.setAlpha(0.3)
            .setDepth(10);

        // ----------- Resume button -----------
        const resumeBtn = this.add.image(width / 2 - 510, height / 2 - 10, 'bttnBackB')
            .setInteractive({ useHandCursor: true })
            .setScale(1)
            .setDepth(11);

        // Resume hover
        resumeBtn.on('pointerover', () => {
            resumeBtn.setTexture('bttnBackHoverB');
            resumeBtn.setScale(1.05);
        });
        resumeBtn.on('pointerout', () => {
            resumeBtn.setTexture('bttnBackB');
            resumeBtn.setScale(1);
        });
        resumeBtn.on('pointerdown', () => {

            this.music.play();
            this.scene.stop();
            this.scene.resume('RaceScene');  // resume race
        });

        // ----------- Main menu button -----------
        const menuBtn = this.add.image(width / 2 + 50, height / 2 - 200, 'bttnMainMenu')
            .setInteractive({ useHandCursor: true })
            .setScale(1)
            .setDepth(11);

        // Hover main menu
        menuBtn.on('pointerover', () => {
            menuBtn.setTexture('bttnMainMenuHover');
            menuBtn.setScale(1.05);
        });
        menuBtn.on('pointerout', () => {
            menuBtn.setTexture('bttnMainMenu');
            menuBtn.setScale(1);
        });
        menuBtn.on('pointerdown', () => {
            // Stops everything and goes back to the main menu
            this.music.play();
            this.game.bgrsMusic.stop();
            this.scene.stop('PauseScene');
            this.scene.stop('RaceScene');
            this.scene.start('MainMenuScene');
        });

        // ----------- Settings Button -----------
        const optionsBtn = this.add.image(width / 2 + 160, height / 2 + 100, 'bttnSettingsB')
            .setInteractive({ useHandCursor: true })
            .setScale(1)
            .setDepth(11);

        // Hover settings
        optionsBtn.on('pointerover', () => {
            optionsBtn.setTexture('bttnSettingsHoverB');
            optionsBtn.setScale(1.05);
        });
        optionsBtn.on('pointerout', () => {
            optionsBtn.setTexture('bttnSettingsB');
            optionsBtn.setScale(1);
        });
        optionsBtn.on('pointerdown', () => {
            this.music.play();
            this.scene.pause('PauseScene');              // pauses PauseScene
            this.scene.start('SettingsScene', { previousScene: this.scene.key });
            this.scene.bringToTop('SettingsScene');
        });

        // ----------- Exit Button -----------
        const exitBtn = this.add.image(width / 2 - 130, height / 2 + 100, 'bttnExitB')
            .setInteractive({ useHandCursor: true })
            .setScale(1)
            .setDepth(11);
        
        exitBtn.on('pointerover', () => {
            exitBtn.setTexture('bttnExitHoverB');
            exitBtn.setScale(1.05);
        });
        exitBtn.on('pointerout', () => {
            exitBtn.setTexture('bttnExitB');
            exitBtn.setScale(1);
        });
         exitBtn.on('pointerdown', () => {
            this.music.play();
            this.time.delayedCall(50, () => {
                this.game.destroy(true);
            });
            
        });

        // Resume also with esc
        this.input.keyboard.on('keydown-ESCAPE', () => {
            this.scene.stop();
            this.scene.resume('RaceScene');
        });

        const margin = 0.8;
        const zoomX = (width * margin) / width;
        const zoomY = (height * margin) / height;
        const zoom = Math.min(zoomX, zoomY);
        this.cameras.main.setZoom(zoom);
        this.cameras.main.centerOn(width / 2, height / 2);
    }

}
