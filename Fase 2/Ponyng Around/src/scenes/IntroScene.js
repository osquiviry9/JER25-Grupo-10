import Phaser from 'phaser';

export default class IntroScene extends Phaser.Scene {
    constructor() {
        super('IntroScene');
    }

    preload() {
        this.load.image('logo', 'assets/logo.png');
    }

    create() {
        const { width, height } = this.scale;

        // Fondo negro
        this.cameras.main.setBackgroundColor('#000000');

        // Fade IN desde negro
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        const logo = this.add.image(width / 2, height / 2, 'logo');
        logo.setOrigin(0.5);
        logo.setScale(0.7); // Ajusta si lo ves muy grande/pequeño

        // Esperar 2.5s y hacer fade OUT
        this.time.delayedCall(2500, () => {
            this.cameras.main.fadeOut(1000, 0, 0, 0);
        });

        // Cuando termine el fade OUT → cambiar de escena
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.stop('IntroScene');
            this.scene.start('MainMenuScene');
        });
    }
}
