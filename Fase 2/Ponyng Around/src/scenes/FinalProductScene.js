import Phaser from 'phaser';

export default class FinalProductScene extends Phaser.Scene {
    constructor() {
        super('FinalProductScene');
    }

    preload() {

        // ============ Videos ============
        // Ache
        this.load.video('AcheFinal_A', 'assets/Animations/AcheFinal.mp4', 'loadeddata', false, true);

        // Haire
        this.load.video('HaireFinal_A', 'assets/Animations/HaireFinal.mp4', 'loadeddata', false, true);

        // Dom
        this.load.video('DomdomdadomFinal_A', 'assets/Animations/DomFinal.mp4', 'loadeddata', false, true);

        // Beer
        this.load.video('BeersquiviryFinal_A', 'assets/Animations/BeerFinal.mp4', 'loadeddata', false, true);

        // Kamil and mayo
        this.load.video('KamilFinal_A', 'assets/Animations/KamilFinal.mp4', 'loadeddata', false, true);

        // ============ JPGS ============
        // Ache
        this.load.image('AcheFinal', 'assets/Backgrounds/AcheFinal.jpg');

        // Haire
        this.load.image('HaireFinal', 'assets/Backgrounds/HaireFinal.jpg');

        // Dom
        this.load.image('DomdomdadomFinal', 'assets/Backgrounds/DomFinal.jpg');

        // Beer
        this.load.image('BeersquiviryFinal', 'assets/Backgrounds/BeerFinal.jpg');

        // Kamil and mayo
        this.load.image('KamilFinal', 'assets/Backgrounds/KamilFinal.jpg');

    }


    create() {

        const { width, height } = this.scale;

        this.cameras.main.setBackgroundColor('#000000');

        const looserName = this.registry.get('looser'); // Registry created end of Racescene
        const videoKey = `${looserName}Final_A`;
        const picKey = `${looserName}Final`;

        this.registry.set('looser', looserName); //save name of looser

        // Wait some time to play de video
        this.time.delayedCall(3000, () => {
            const video = this.add.video(width / 2, height / 2, videoKey)
                .setScale(0.8).setDepth(2);

            video.play(false);

            this.time.delayedCall(4000, () => {
                const pic = this.add.image(width / 2, height / 2, picKey)
                    .setScale(0.8).setDepth(3);
            });
        });


    }
}

