import Phaser from 'phaser';

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('MainMenuScene');
    }

    preload() {

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
        
    }

    create() {

        this.music = this.sound.add('clickSound', {
            });

        const { width, height } = this.scale;

        this.cameras.main.setBackgroundColor('#000000'); 

        const bg = this.add.image(width / 2, height / 2, 'menuBackground');
        bg.setOrigin(0.5);
        bg.setScale(0.8); 

        //Lista de botones
        const buttons = [
            { x: width * 0.5, y: height * 0.2, key: 'bttnPlay', hover: 'bttnPlayHover', action: () => this.scene.start('CharacterSelectScene'), scale: 0.9 },
            { x: width * 0.84, y: height * 0.8, key: 'bttnSettings', hover: 'bttnSettingsHover', action: () => this.scene.start('SettingsScene', { previousScene: this.scene.key }), scale: 1},
            { x: width * 0.24, y: height * 0.35, key: 'bttnCredits', hover: 'bttnCreditsHover', action: () => this.scene.start('CreditsScene'), scale: 0.7},
        ];

        buttons.forEach(btn => {
            const button = this.add.image(btn.x, btn.y, btn.key)
                .setInteractive({ useHandCursor: true })
                .setScale(btn.scale);
            // Hover
            button.on('pointerover', () => {
                button.setTexture(btn.hover);
                button.setScale(btn.scale * 1.05);
            });

            // Salir hover
            button.on('pointerout', () => {
                button.setTexture(btn.key);
                button.setScale(btn.scale);
            });

            // Click + sound
            button.on('pointerdown', () => {
                btn.action();     
                this.music.play(); 
            });
            
        });


        //CAMBIAD ESTO A LA PRIMERA ESCENA QUE SE EJECUTE AL INICIAR EL JUEGO, siempre metido en el create() o el init(), lo que haya
        if (this.game.volumeLevel === undefined) {
            const savedVolume = localStorage.getItem('gameVolume');
            this.game.volumeLevel = savedVolume ? parseInt(savedVolume) : 5;
        }

        // Ajustar el volumen global de Phaser Sound
        this.sound.volume = this.game.volumeLevel / 10;
    }
}
