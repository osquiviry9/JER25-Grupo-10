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

        // BLOOD EXPLOSION: // ANADIR LOGICA PARA QUE APAREZCA SOLO CUANDO EL PONI LLEGA A LA TRITURADORA, PONER COLLIDER O ALGO
        const bloodFrames = [];
        for (let i = 1; i <= 8; i++) bloodFrames.push({ key: `Blood${i}` });

        this.anims.create({
            key: 'blood',
            frames: bloodFrames,
            frameRate: 15,
            repeat: -1
        });

        this.blood = this.physics.add.sprite((width / 2), (height / 2), 'Blood1')
            .setDepth(8);
        this.blood.play('blood');

        // MEAT: // ANADIR LOGICA PARA QUE APAREZCA SOLO DESPUES DE QUE EL PONI ES TRITURADO, PONER COLLIDER O ALGO
        const meatFrames = [];
        for (let i = 1; i <= 12; i++) meatFrames.push({ key: `Meat${i}` });

        this.anims.create({
            key: 'meat',
            frames: meatFrames,
            frameRate: 15,
            repeat: -1
        });

        this.blood = this.physics.add.sprite((width / 2), (height / 2), 'Meat1')
            .setDepth(1);
        this.blood.play('meat');


        // ========= PONIS ==========

        // SOCORRO NO FUNCIONA AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

        const looserName = this.registry.get('looser'); // <-- lee del registry
        //const looserName = looserKey.name || looserKey.key || 'Jugador';

        if (looserName === 'Ache') {
            this.add.image((width / 2)-200, height / 2, 'AcheD')
                .setDepth(7);
        }

        // Camera adjustment to frame everything without cropping
        const margin = 0.8;
        const zoomX = (width * margin) / width;
        const zoomY = (height * margin) / height;
        const zoom = Math.min(zoomX, zoomY);

        this.cameras.main.setZoom(zoom);
        this.cameras.main.centerOn(width / 2, height / 2);

    }
}

