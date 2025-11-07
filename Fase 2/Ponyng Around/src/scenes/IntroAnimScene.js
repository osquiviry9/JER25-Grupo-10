import Phaser from 'phaser';

// no funciona :(
export default class IntroAnimScene extends Phaser.Scene {
    constructor() {
        super('IntroAnimScene');
    }

    preload() {
        
        this.load.video('introVideo', 'assets/AnimationVideos/Intro.mp4', 'loadeddata', false, true);
    }

    
    create() {
        const { width, height } = this.scale;

        // this.cameras.main.setBackgroundColor('#000000');

        // Video al centro de la pantalla
        const video = this.add.video(width / 2, height / 2, 'introVideo');
        video.setOrigin(0.5);
        video.setScale(0.8); 
        // Escala

        //video.setDisplaySize(width, height);

        // Reproduccion del video
        video.play(false);

        // Cambia de escena
        video.once('complete', () => {
            this.scene.start('MainMenuScene');
        });
    }
}

