import Phaser from 'phaser';

export default class StableScene extends Phaser.Scene {
    constructor() {
        super('StableScene');

    }

    preload() {/*IN BootScene.js*/ }

    create() {
        const { width, height } = this.scale;

        this.cameras.main.setBackgroundColor('#000000');
        this.cameras.main.fadeIn(2000, 0, 0, 0);

        //Sound
        this.game.windSound = this.sound.add('windSound', {
        });
        this.game.windSound.play();

        // Background room:
        const bg = this.add.image(width/2 , height /2, 'Stable')
            bg.setOrigin(0.5)
            bg.setScale(0.8)
            bg.setDepth(-1);

        // Frame
        this.add.image(width / 2, height / 2, 'redFrame')
            .setDepth(25).setScale(0.8);
        
        // Name of defeated poni
        const looserName = this.registry.get('looser'); // Registry created end of Racescene
        const deathKey = `${looserName}`;
        this.registry.set('looser', looserName); //save name of looser

        const nm = this.add.image((width / 2), (height / 2), deathKey)
            nm.setDepth(16)
            nm.setScale(0.8);

        // Straw Ball Animation
        
        const video = this.add.video(width / 2, height / 2, 'strawBall');
        video.setOrigin(0.5);
        video.setScale(0.8);
        video.setDepth(15);

        video.play(false); // Only plays once

        video.once('complete', () => {
            this.time.delayedCall(500, () => {
            this.game.windSound.stop();
            this.scene.start('FinalScene');
        });
        });
        
    }
}