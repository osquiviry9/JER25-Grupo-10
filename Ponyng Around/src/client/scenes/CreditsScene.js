import Phaser from 'phaser';

export default class CreditsScene extends Phaser.Scene {
    constructor() {
        super('CreditsScene');
    }

    preload() {/*IN BootScene.js*/}

    create() {

        this.music = this.sound.add('clickSound', {
        });

        this.musicCredit = this.sound.add('creditMusic', {
            loop: true
        });

        const { width, height } = this.scale;

        this.cameras.main.setBackgroundColor('#000000ff');

        this.cameras.main.fadeIn(5000, 0, 0, 0, () => {
        });
        // Background
        this.add.image(width / 2, height / 2, 'creditsBg');

        // Frame
        this.add.image(width / 2, height / 2, 'Frame').setDepth(3);
        
        // Melgarga head
        this.head = this.add.image(width / 2, height / 2 + 200, 'head').setScale(0.6);

        const credits = [
            "Game Designer: ETC Studio",
            " ",
            "Programming",
            "ÓSCAR PINADERO",
            "HENAR SAN ROMÁN",
            "SILVIA ÁLVARO",
            "IÑIGO GARCÍA",
            "JULIA MOYA",
            " ",
            "Art",
            "SILVIA ÁLVARO",
            "HENAR SAN ROMAN",
            "JULIA MOYA",
            " ",
            "Music",
            "JULIA MOYA",
            " ",
            "Special Thanks: ",
            "Motor: Phaser3: Arcade Pyshics",
            " ",
            "No ponies were harmed in the making of this video game",
            " ",
            "Well, almost",
            " :) "

        ];


        let startY = height + 10;

        this.creditTexts = credits.map((line, index) => {
            return this.add.text(width / 2, startY + index * 80, line, {
                fontFamily: 'Arial',
                fontSize: '50px',
                color: '#cc4e4eff',
                stroke: '#000000ff', 
                strokeThickness: 6, 
                align: 'center'
            }).setOrigin(0.5);
        });

        this.allScrollableTexts = [this.head, ...this.creditTexts];

        this.scrollActive = false;

        this.time.delayedCall(3000, () => { // 3000 ms = 3 s
            this.scrollActive = true;
            this.musicCredit.play();
        }, [], this);

        //Button list
        const buttons = [
            { x: (width / 2) - 800, y: (height / 2) - 400, key: 'bttnBack', hover: 'bttnBackHover', action: () => this.scene.start('MainMenuScene'), scale: 1 },
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

            // Exit hover
            button.on('pointerout', () => {
                button.setTexture(btn.key);
                button.setScale(btn.scale);
            });

            // Click
            button.on('pointerdown', () => {
                btn.action();
                this.musicCredit.stop(); 
                this.music.play();
            });
        });

        // Zoom camera
        const margin = 0.8;
        const zoomX = (width * margin) / width;
        const zoomY = (height * margin) / height;
        const zoom = Math.min(zoomX, zoomY);

        this.cameras.main.setZoom(zoom);
        this.cameras.main.centerOn(width / 2, height / 2);

        // Click to x2
        this.baseSpeed = 50;
        this.fastSpeed = 200;
        this.currentSpeed = this.baseSpeed;

        this.input.on('pointerdown', (pointer) => {
            if (!pointer.wasTouch && pointer.leftButtonDown()) {

                // Speed Up
                this.currentSpeed = this.fastSpeed;

                if (this.musicCredit) {
                    this.musicCredit.setRate(1.8);
                }
            }
        });

        this.input.on('pointerup', () => {

            // Return to normal speed
            this.currentSpeed = this.baseSpeed;

            if (this.musicCredit) {
                this.musicCredit.setRate(1.0);
            }
        });


    }

    update(time, delta) {
        if (this.scrollActive) {
            const speed = this.currentSpeed;
            this.allScrollableTexts.forEach(text => {
                text.y -= speed * (delta / 1000);
            });
        }
    }


}
