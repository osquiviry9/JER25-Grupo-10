import Phaser from 'phaser';

export default class CreditsScene extends Phaser.Scene {
    constructor() {
        super('CreditsScene');
    }

    preload() {

        // Background color
        this.load.image('ColorBackground', 'assets/Backgrounds/fondoPlano.jpeg');

        // Buttons
        // Back button
        this.load.image('bttnBack', 'assets/Buttons/BackTemp.png');
        this.load.image('bttnBackHover', 'assets//Buttons/BackTemp.png');
    }

    create() {

        const { width, height } = this.scale;

        this.cameras.main.setBackgroundColor('#000000ff');

        this.cameras.main.fadeIn(5000, 0, 0, 0);

        // General color background
        this.add.image(width / 2, height / 2, 'ColorBackground');

        this.title = this.add.text(width / 2, height / 2, 'Credits (Completar)', {
            fontFamily: 'Arial',
            fontSize: '64px',
            fontStyle: 'bold',
            color: '#ff69b4',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        const credits = [
        "Game Designer: ETC Studio",
        "Programming: ",
        "Art: ",
        "Music: ",
        "Special Thanks: ",
        "Motor: Phaser 3"
        ];

        let startY = height;

        this.creditTexts = credits.map((line, index) => {
            return this.add.text(width / 2, startY + index * 80, line, {
                fontFamily: 'Arial',
                fontSize: '32px',
                color: '#ffffff'
            }).setOrigin(0.5);
        });

        this.allScrollableTexts = [this.title, ...this.creditTexts];

        this.scrollActive = false;

        this.time.delayedCall(3000, () => { // 3000 ms = 3 s
            this.scrollActive = true;
        }, [], this);

        //Button list
        const buttons = [
            { x: (width / 2) - 800, y: (height / 2) - 300, key: 'bttnBack', hover: 'bttnBackHover', action: () => this.scene.start('MainMenuScene'), scale: 1 },
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

            // Click
            button.on('pointerdown', btn.action);
        });

        // Zoom camera
        const margin = 0.8;
        const zoomX = (width * margin) / width;
        const zoomY = (height * margin) / height;
        const zoom = Math.min(zoomX, zoomY);

        this.cameras.main.setZoom(zoom);
        this.cameras.main.centerOn(width / 2, height / 2);
    }

    update(time, delta) {
        if (this.scrollActive) {
            const speed = 50;
            this.allScrollableTexts.forEach(text => {
                text.y -= speed * delta / 1000;
            });
        }
    }

}
