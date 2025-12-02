import Phaser from 'phaser';

export default class IntroAnimScene extends Phaser.Scene {
    constructor() {
        super('IntroAnimScene');
    }

    preload() {

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
    }


    create() {

        const { width, height } = this.scale;

        this.game.windSound = this.sound.add('windSound', {
        });
        this.game.windSound.play();

        this.game.creakSound = this.sound.add('creakSound', {
        });
        this.game.creakSound.play();


        this.cameras.main.setBackgroundColor('#000000');

        const video1 = this.add.video(width / 2, height / 2, 'introVideo');
        video1.setOrigin(0.5);
        video1.setScale(0.8);

        // Reproduccion del video
        video1.play(false);

        // Cambia de escena
        video1.once('complete', () => {
            this.game.creakSound.stop();
            const video2 = this.add.video(width / 2, height / 2, 'newsVideo');
            video2.setOrigin(0.5);
            video2.setScale(0.8);

            video2.play(false);

            video2.once('complete', () => {
                const video3 = this.add.video(width / 2, height / 2, 'missingVideo');
                video3.setOrigin(0.5);
                video3.setScale(0.8);

                video3.play(false);

                video3.once('complete', () => {
                    this.cameras.main.fadeOut(600, 0, 0, 0);
                    this.scene.start('MainMenuScene');
                });
            });
        });
    }
}


