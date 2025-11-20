import Phaser from 'phaser';

export default class HelpScene extends Phaser.Scene {
    constructor() {
        super('HelpScene');
    }

    preload() {

        //Click sound
        this.load.audio('clickSound', 'assets/sound/click.mp3');

        // Background
        this.load.image('helpScreen', 'assets/Backgrounds/helpScreen.JPG');

        // Frame
        this.load.image('Frame', 'assets/Elements/GreenFrame.PNG');

        // =========== Buttons ===========
        // Back button
        this.load.image('bttnBack', 'assets/Buttons/backBttn.png');
        this.load.image('bttnBackHover', 'assets/Buttons/backBttn_hover.png');
        
    }

    create() {

        this.music = this.sound.add('clickSound', {
            });

        const { width, height } = this.scale;

        this.cameras.main.setBackgroundColor('#000000'); 

        // Background
        const bg = this.add.image(width / 2, height / 2, 'helpScreen');
        bg.setOrigin(0.5);

        // Frame
        this.add.image(width / 2, height / 2, 'Frame').setDepth(3);

        // Buttons
        const buttons = [
            { x: (width / 2) - 800, y: (height / 2) - 400, key: 'bttnBack', hover: 'bttnBackHover', action: () => this.scene.start('SettingsScene'), scale: 1 },
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

        // Ajustar el volumen global de Phaser Sound
        this.sound.volume = this.game.volumeLevel / 10;

        // Zoom
        const margin = 0.8;
        const zoomX = (width * margin) / width;
        const zoomY = (height * margin) / height;
        const zoom = Math.min(zoomX, zoomY);

        this.cameras.main.setZoom(zoom);
        this.cameras.main.centerOn(width / 2, height / 2);
    }
}
