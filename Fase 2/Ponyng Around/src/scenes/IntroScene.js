import Phaser from 'phaser';

export default class IntroScene extends Phaser.Scene {
    constructor() {
        super('IntroScene');
    }

    preload() {
        this.cameras.main.setBackgroundColor('#000000');
        this.load.image('studioLogo', 'assets/logo.png');
    }

    create() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        this.add.image(centerX, centerY, 'studioLogo').setOrigin(0.5);

        this.time.delayedCall(2500, () => {
            this.scene.stop('IntroScene');  
            this.scene.start('MainMenuScene'); 

        });
    }
}
