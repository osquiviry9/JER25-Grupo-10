import Phaser from 'phaser';

export default class IntroScene extends Phaser.Scene {
    constructor() {
        super('IntroScene');
    }

    preload() {/*IN BootScene.js*/   }

    create() {

        this.pinkieSound = this.sound.add('pinkieSound', {
        });
        this.pinkieSound.play();

        const { width, height } = this.scale;

        this.cameras.main.setBackgroundColor('#000000');

        this.cameras.main.fadeIn(1000, 0, 0, 0);

        const logo = this.add.image(width / 2, height / 2, 'logo');
        logo.setOrigin(0.5);
        logo.setScale(0.7);

        this.time.delayedCall(2500, () => {
            this.cameras.main.fadeOut(1000, 0, 0, 0);
        });

        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.stop('IntroScene');
            this.scene.start('IntroAnimScene');
        });
    }
}
