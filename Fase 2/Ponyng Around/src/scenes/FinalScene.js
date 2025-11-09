import Phaser from 'phaser';

export default class FinalScene extends Phaser.Scene {
    constructor() {
        super('FinalScene');

    }

    preload() {

        // Background
        this.load.image('finalBackground', 'assets/Backgrounds/FinalScene_Background.JPG');

        // Crusher
        this.load.image('crusher', 'assets/Elements/Trituradora.PNG');

        // Back crusher
        this.load.image('backCrusher', 'assets/Elements/TrituradoraAtras.PNG');

        // Front tube
        this.load.image('frontTube', 'assets/Elements/Tuberia.PNG');

        // Back tube
        this.load.image('backTube', 'assets/Elements/TuberiaAtras.PNG');

        // ============= PONIS =============
        this.load.image('AcheD', 'assets/ponis/Ache/Ache_Death.PNG');
        this.load.image('HaiireD', 'assets/ponis/Haire/Haire_Death.PNG');
        this.load.image('DomdomdadomD', 'assets/ponis/Dod/Dod_Death.PNG');
        this.load.image('KamilD', 'assets/ponis/Kamil/Kamil_Death.PNG');
        this.load.image('BeersquiviryD', 'assets/ponis/Beersquiviri/Beer_Death.PNG');

        // ============= SPRITES FOR ANIMATIONS =============
        // Wheels
        for (let i = 1; i <= 7; i++) {
            this.load.image(`Wheels${i}`, `assets/Animations/WheelAnim/Rueda${i}.PNG`);
        }

        // Platform
        for (let i = 1; i <= 8; i++) {
            this.load.image(`Platform${i}`, `assets/Animations/AnimCinta/cinta${i}.PNG`);
        }

        // Blood explosion
        for (let i = 1; i <= 10; i++) {
            this.load.image(`Blood${i}`, `assets/Animations/BloodAnim/blood${i}.PNG`);
        }

        // Meat
        for (let i = 1; i <= 12; i++) {
            this.load.image(`Meat${i}`, `assets/Animations/MeatAnim/meat${i}.PNG`);
        }

        // ============= Buttons =============


    }

    create() {

        const { width, height } = this.scale;

        this.cameras.main.setBackgroundColor('#000000');

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
            repeat: -1     
        });

        // MEAT only deinition, because if not it will start the animation
        const meatFrames = [];
        for (let i = 1; i <= 12; i++) meatFrames.push({ key: `Meat${i}` });

        this.anims.create({
            key: 'meat',
            frames: meatFrames,
            frameRate: 15,
            repeat: -1     
        });

        // ========= PONIS ==========

        // ---------- GET THE LOOSER PONI ----------//

        
        const looserName = this.registry.get('looser'); // Registry created end of Racescene
        const deathKey = `${looserName}D`;

        this.registry.set('looser', looserName); //save name of looser


        const pony = this.physics.add.image(width / 2 - 600, height / 2, deathKey) 
            .setDepth(7)
            .setScale(0.4)
            .setVelocityX(150);

        const crusherZoneX = width / 2 - 100;

        this.hasCrashed = false;

        // ----------- DEATH SEQUENCE -----------
        this.physics.world.on('worldstep', () => {
            if (!this.hasCrashed && pony.x >= crusherZoneX) {
                this.hasCrashed = true;

                //The ponie goes straight for a while
                pony.setVelocityX(200);

                // When 0.4 seconds pass, the srpite destroys
                this.time.delayedCall(400, () => {
                    pony.setVisible(false); 
                    
                    //Starts the blood animation
                    const blood = this.add.sprite(width / 2, height / 2, 'Blood1')
                        .setDepth(8)
                        .setScale(0.8);
                    blood.play('blood');

                    //Then the meat
                    this.time.delayedCall(600, () => {
                        const meat = this.add.sprite(width / 2 + 65 , height / 2 + 20 , 'Meat1') //ajuste porque no se que ha pasado
                            .setDepth(9)
                            .setScale(0.9);
                        meat.play('meat');
                    });


                    // After 4 seconds change scene
                    this.time.delayedCall(4000, () => {
                        this.scene.start('CharacterSelectScene'); //CAMBIAR ESTA AL PUBLICAR
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

