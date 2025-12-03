import Phaser from 'phaser';

export default class FinalScene extends Phaser.Scene {
    constructor() {
        super('FinalScene');

    }

    preload() {/*IN BootScene.js*/}

    create() {

        const { width, height } = this.scale;

        this.cameras.main.setBackgroundColor('#000000');
        this.cameras.main.fadeIn(500, 0, 0, 0);

        // ================== SOUNDS ==================
        // Chainsaw sound
        this.chainsaw = this.sound.add('chainsawSound', {
        });

        // Crush sound
        this.crush = this.sound.add('crushSound', {
        });

        // Blood splash sound
        this.bloodSplash = this.sound.add('bloodSplash', {
            volume: 2.0
        });

        // Pipeline sound
        this.pipeline = this.sound.add('pipelineSound', {
        });

        // ============================================

        // Background room:
        const bg = this.add.image(width / 2, height / 2, 'finalBackground')
            .setOrigin(0.5)
            .setDepth(-1);

        // CRUSHER:
        const crusher = this.add.image(width / 2, height / 2, 'crusher')
            .setOrigin(0.5)
            .setDepth(7);

        const backCrusher = this.add.image(width / 2, height / 2, 'backCrusher')
            .setOrigin(0.5)
            .setDepth(3);

        // Frame
        this.add.image(width / 2, height / 2, 'redFrame')
            .setDepth(25);

        // TUBE:
        const frontTube = this.add.image(width / 2, height / 2, 'frontTube')
            .setOrigin(0.5)
            .setDepth(2);

        const backTube = this.add.image(width / 2, height / 2, 'backTube')
            .setOrigin(0.5)
            .setDepth(0);

        // WHEELS:
        const wheelsFrames = [];
        for (let i = 1; i <= 7; i++) wheelsFrames.push({ key: `Wheels${i}` });

        this.anims.create({
            key: 'wheels',
            frames: wheelsFrames,
            frameRate: 11,
            repeat: -1
        });

        this.wheels = this.physics.add.sprite((width / 2) + 150, (height / 2) - 45, 'Wheels1')
            .setDepth(6);
        this.wheels.play('wheels');

        // PLATFORM:
        const platformFrames = [];
        for (let i = 1; i <= 8; i++) platformFrames.push({ key: `Platform${i}` });

        this.anims.create({
            key: 'platform',
            frames: platformFrames,
            frameRate: 5,
            repeat: -1
        });

        this.platform = this.physics.add.sprite((width / 2), (height / 2), 'Platform1')
            .setDepth(4);
        this.platform.play('platform');

        // BLOOD EXPLOSION only definition, because if not it will start the animation
        const bloodFrames = [];
        for (let i = 1; i <= 10; i++) bloodFrames.push({ key: `Blood${i}` });

        this.anims.create({
            key: 'blood',
            frames: bloodFrames,
            frameRate: 18,
            repeat: 0
        });

        // MEAT only deinition, because if not it will start the animation
        const meatFrames = [];
        for (let i = 1; i <= 12; i++) meatFrames.push({ key: `Meat${i}` });

        this.anims.create({
            key: 'meat',
            frames: meatFrames,
            frameRate: 8,
            repeat: 0
        });

        // ========= PONIS ==========

        // ---------- GET THE LOOSER PONI ----------

        const looserName = this.registry.get('looser'); // Registry created end of Racescene
        const deathKey = `${looserName}D`;

        this.registry.set('looser', looserName); //save name of looser


        const pony = this.physics.add.image((width / 2) - 960, (height / 2), deathKey)
            .setDepth(5)
            .setScale(0.5)
            .setVelocityX(130);

        const crusherZoneX = width / 2 - 100;

        this.hasCrashed = false;

        // Play chainsaw sound
        this.chainsaw.play();

        // ----------- DEATH SEQUENCE -----------
        this.physics.world.on('worldstep', () => {
            if (!this.hasCrashed && pony.x >= crusherZoneX) {
                this.hasCrashed = true;

                this.time.delayedCall(1500, () => {

                    // The pony goes straight for a while
                    pony.setVelocityX(130);

                    // When 1 second pass, the srpite destroys
                    this.time.delayedCall(560, () => {
                        pony.setVisible(false);

                        //Starts the blood animation
                        const blood = this.add.sprite(width / 2, height / 2, 'Blood1')
                            .setDepth(8);

                        blood.play('blood');
                        this.bloodSplash.play();

                        blood.once('animationcomplete', () => {

                            blood.setVisible(false);

                            // Wait before de shake
                            this.time.delayedCall(400, () => {

                                // Stop chainsaw sound
                                this.chainsaw.stop();

                                // Stop wheels
                                this.wheels.stop('wheels');

                                // Shake camera and start crushing sound
                                this.cameras.main.shake(1000, 0.01);

                                this.crush.play();

                            });

                            this.time.delayedCall(1000, () => {
                                //Then the meat
                                this.time.delayedCall(1300, () => {
                                    const meat = this.add.sprite(width / 2, height / 2, 'Meat1') //ajuste porque no se que ha pasado
                                        .setDepth(1);

                                    meat.play('meat');

                                    meat.once('animationcomplete', () => {
                                        meat.setVisible(false);
                                        this.crush.stop();
                                    });
                                });
                            });
                        });
                    });


                    // After 6 seconds play anim
                    this.time.delayedCall(6000, () => {

                        // Pipeline video
                        this.pipeline.play(); // sound
                        this.time.delayedCall(4000, () => {
                            this.pipeline.stop();
                        });
                        const video = this.add.video(width / 2, height / 2, 'tubeVideo');
                        video.setOrigin(0.5);
                        video.setDepth(15);

                        video.play(false); // Only plays once

                        video.once('complete', () => {
                            this.scene.start('FinalProductScene'); //CHANGE SCENE
                        });
                    });
                });
            }
        });

        const margin = 0.8;
        const zoomX = (width * margin) / width;
        const zoomY = (height * margin) / height;
        const zoom = Math.min(zoomX, zoomY);

        this.cameras.main.setZoom(zoom);
        this.cameras.main.centerOn(width / 2, height / 2);

    }
}

