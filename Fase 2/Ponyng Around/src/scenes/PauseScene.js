import Phaser from 'phaser';

export default class PauseScene extends Phaser.Scene {
    constructor() {
        super('PauseScene');
    }

    preload() {

        // Blood
        this.load.image('BloodPause', 'assets/Backgrounds/Pause.PNG');

        // Frame
        this.load.image('redFrame', 'assets/Elements/RedFrame.PNG');

        // Resume button
        this.load.image('bttnBack', 'assets/Buttons/PauseBlood.PNG');
        this.load.image('bttnBackHover', 'assets/Buttons/PauseBlood_hover.PNG');

        // Main menu button
        this.load.image('bttnExit', 'assets/Buttons/MainMenuBlood.PNG');
        this.load.image('bttnExitHover', 'assets/Buttons/MainMenuBlood_hover.PNG');

        // Settings button
        this.load.image('bttnSettingsB', 'assets/Buttons/SettingsBlood.PNG');
        this.load.image('bttnSettingsHoverB', 'assets/Buttons/SettingsBlood_hover.PNG');
    }

    create() {
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
        const resumeBtn = this.add.image(width / 2 - 510, height / 2 - 10, 'bttnBack')
            .setInteractive({ useHandCursor: true })
            .setScale(1)
            .setDepth(11);

        // Resume hover
        resumeBtn.on('pointerover', () => {
            resumeBtn.setTexture('bttnBackHover');
            resumeBtn.setScale(1.05);
        });
        resumeBtn.on('pointerout', () => {
            resumeBtn.setTexture('bttnBack');
            resumeBtn.setScale(1);
        });
        resumeBtn.on('pointerdown', () => {
            this.scene.stop();               
            this.scene.resume('RaceScene');  // resume race
        });

        // ----------- Main menu button -----------
        const menuBtn = this.add.image(width / 2 + 50, height / 2 - 200, 'bttnExit')
            .setInteractive({ useHandCursor: true })
            .setScale(1)
            .setDepth(11);

        // Hover main menu
        menuBtn.on('pointerover', () => {
            menuBtn.setTexture('bttnExitHover');
            menuBtn.setScale(1.05);
        });
        menuBtn.on('pointerout', () => {
            menuBtn.setTexture('bttnExit');
            menuBtn.setScale(1);
        });
        menuBtn.on('pointerdown', () => {
            // Stops everything and goes back to the main menu
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
            this.scene.pause('PauseScene');              // pauses PauseScene
            this.scene.start('SettingsScene', { previousScene: this.scene.key });
            this.scene.bringToTop('SettingsScene');
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
