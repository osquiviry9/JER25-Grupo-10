import Phaser from 'phaser';


const CONFIG = {
    WIDTH: 1920,
    HEIGHT: 1080,

    // Velocidad base del scroll
    BASE_SPEED: 2.5,
    ACCEL_FACTOR: 2.5,
    SLOW_FACTOR: 0.1,
    EFFECT_MS: 1500,

    // Spawner
    MIN_SPAWN: 1000,
    MAX_SPAWN: 3000,
    BOOSTER_PROB: 0.25,

    // Salto
    JUMP_VELOCITY: -360,
    GRAVITY_Y: 900,

    // Geometría pista
    TRACK_HEIGHT: 520,
    RED_OFFSET_FROM_CENTER: -20,
    GROUND_HEIGHT: 16,

    // Distancia total a la meta
    TOTAL_DISTANCE_PX: 7500
};

export default class RaceScene extends Phaser.Scene {
    constructor() {
        super('RaceScene');

        this.state = {
            running: false,
            finished: false,
            progress: { top: 0, bottom: 0 },
            lanes: {
                top: { speed: CONFIG.BASE_SPEED, altered: false, immune: false },
                bottom: { speed: CONFIG.BASE_SPEED, altered: false, immune: false }
            }
        };
    }

    preload() {

        const g = this.make.graphics({ x: 0, y: 0, add: false });

        // Background color
        this.load.image('ColorBackground', 'assets/Backgrounds/fondoPlano.jpeg');

        // Floor tile
        this.load.image('TileFloor', 'assets/Backgrounds/TileableBackground1.png');

        // Background tile front (plants)
        this.load.image('Plants', 'assets/Backgrounds/TileableForefround.png');

        // Clouds
        this.load.image('Clouds', 'assets/Elements/Clouds.PNG');

        // SUN
        this.load.image('Sun', 'assets/Elements/Sun.PNG');

        // Red obstacle
        g.fillStyle(0x8b0000, 1); g.fillRect(0, 0, 40, 40);
        g.generateTexture('obstacle', 40, 40);
        g.clear();

        // Green booster 
        /*g.fillStyle(0x32cd32, 1); g.fillRect(0, 0, 40, 40);
        g.generateTexture('booster', 40, 40);
        g.clear();*/

        // =========== PONIES =============
        // RUN ANIMATIONS:
        // Ache
        for (let i = 1; i <= 4; i++) {
            this.load.image(`AcheRun${i}`, `assets/ponis/Ache/Ache_Run${i}.PNG`);
        }
        // Haire
        for (let i = 1; i <= 4; i++) {
            this.load.image(`HaireRun${i}`, `assets/ponis/Haire/Haire_Run${i}.PNG`);
        }
        // Kamil
        for (let i = 1; i <= 4; i++) {
            this.load.image(`KamilRun${i}`, `assets/ponis/Kamil/Kamil_Run${i}.PNG`);
        }
        // Beersquiviri
        for (let i = 1; i <= 4; i++) {
            this.load.image(`BeerRun${i}`, `assets/ponis/Beersquiviri/Beer_Run${i}.PNG`);
        }
        // Dom
        for (let i = 1; i <= 4; i++) {
            this.load.image(`DomRun${i}`, `assets/ponis/Dod/Dod_Run${i}.PNG`);
        }

        // JUMP ANIMATIONS:
        // Ache
        for (let i = 1; i <= 2; i++) {
            this.load.image(`AcheJump${i}`, `assets/ponis/Ache/Ache_Jump${i}.PNG`);
        }
        // Haire
        for (let i = 1; i <= 2; i++) {
            this.load.image(`HaireJump${i}`, `assets/ponis/Haire/Haire_Jump${i}.PNG`);
        }
        // Kamil
        for (let i = 1; i <= 2; i++) {
            this.load.image(`KamilJump${i}`, `assets/ponis/Kamil/Kamil_Jump${i}.PNG`);
        }
        // Beersquiviri
        for (let i = 1; i <= 2; i++) {
            this.load.image(`BeerJump${i}`, `assets/ponis/Beersquiviri/Beer_Jump${i}.PNG`);
        }
        // Dom
        for (let i = 1; i <= 2; i++) {
            this.load.image(`DomJump${i}`, `assets/ponis/Dod/Dod_Jump${i}.PNG`);
        }


        // PowerUps
        //this.load.image('LimeLemon', 'assets/Elements/LimeLemon_PowerUp.png');
        this.load.image('Apple', 'assets/Elements/Apple_PowerUp.png');
    }

    create() {
        const { width, height } = this.scale;

        this.cameras.main.setBackgroundColor('#000');

        // General color background
        this.add.image(width / 2, height / 2, 'ColorBackground')
            .setOrigin(0.5)
            .setDepth(-1);

        // Sun TOP
        this.add.image((width / 2) + 600, (height / 2) - 430, 'Sun')
            .setScale(0.4)
            .setDepth(0);

        // Sun BOTTOM
        this.add.image((width / 2) + 600, (height / 2) + 130, 'Sun')
            .setScale(0.4)
            .setDepth(0);

        // Floors coords
        this.laneYTop = CONFIG.TRACK_HEIGHT / 2;
        this.laneYBottom = height - CONFIG.TRACK_HEIGHT / 2;

        // Clouds
        this.cloudsTop = this.add.tileSprite(width / 2, this.laneYTop, width, CONFIG.TRACK_HEIGHT, 'Clouds')
            .setAlpha(0.8)
            .setDepth(1);
        this.cloudsBot = this.add.tileSprite(width / 2, this.laneYBottom, width, CONFIG.TRACK_HEIGHT, 'Clouds')
            .setAlpha(0.8)
            .setDepth(1);

        // FRONT PLANTS
        this.plantsTop = this.add.tileSprite(width / 2, this.laneYTop + 6.6, width, CONFIG.TRACK_HEIGHT, 'Plants')
            .setDepth(4);
        this.plantsBot = this.add.tileSprite(width / 2, this.laneYBottom + 6.6, width, CONFIG.TRACK_HEIGHT, 'Plants')
            .setDepth(4);

        //Creation of the traks 
        this.trackTop = this.add.tileSprite(width / 2, this.laneYTop, width, CONFIG.TRACK_HEIGHT, 'TileFloor')
            .setDepth(2);
        this.trackBot = this.add.tileSprite(width / 2, this.laneYBottom, width, CONFIG.TRACK_HEIGHT, 'TileFloor')
            .setDepth(2);

        // Middle line
        this.add.rectangle(width / 2, height / 2, width, 3, 0xffffff);

        // Línea roja (referencia)
        const redTopY = this.laneYTop + CONFIG.RED_OFFSET_FROM_CENTER;
        const redBotY = this.laneYBottom + CONFIG.RED_OFFSET_FROM_CENTER;

        // Previous character selection
        const p1 = this.registry.get('player1Character');
        const p2 = this.registry.get('player2Character');


        const makePony = (x, redLineY, keyOrObj) => {
            const key = (keyOrObj && keyOrObj.key) ? keyOrObj.key : keyOrObj;
            const img = this.physics.add.image(x, redLineY, `${key}_static`).setOrigin(0.5, 1);

            const targetHeight = 80;
            img.setScale(targetHeight / img.height);

            img.body.setAllowGravity(true);
            img.body.setGravityY(CONFIG.GRAVITY_Y);
            img.body.setAllowRotation(false);
            img.body.setBounce(0);

            return img;
        };


        /*  PRUEBA QUE NO ME SALE PARA PONER LAS ANIMACIONES
        const makeUpPony = (x, redLineY, keyOrObj) => {
            const ponyKey = keyOrObj.key;

            // Animación dinámica: Ache1, Ache2, Ache3, Ache4
            const RunFrames = [];
            for (let i = 1; i <= 4; i++) {
                RunFrames.push({ key: `${ponyKey}${i}` });
            }

            // Crear animación única para cada pony
            const animKey = `${ponyKey}_run`;

            this.anims.create({
                key: animKey,
                frames: RunFrames,
                frameRate: 10,
                repeat: -1
            });

            // Crear sprite del pony
            const sprite = this.physics.add
                .sprite(x, redLineY, `${ponyKey}1`) // primer frame
                .setDepth(3);

            sprite.play(animKey);

            return sprite;
        };
        */

        const makeGroundAtRed = (redLineY) => {
            const H = CONFIG.GROUND_HEIGHT;
            const groundCenterY = redLineY + H / 2;

            const rect = this.add.rectangle(width / 2, groundCenterY, width, H, 0x00ff00, 0);
            this.physics.add.existing(rect, true);
            return rect;
        };

        this.playerTop = makePony(90, redTopY + 195, p1).setDepth(3);  //CONTORL THE SPAWN COORDINATES OF PONIS
        this.playerBottom = makePony(90, redBotY + 195, p2).setDepth(3);


        this.groundTop = makeGroundAtRed(redTopY + 200);  //control the invisible gorund coorinates
        this.groundBot = makeGroundAtRed(redBotY + 200);

        this.physics.add.collider(this.playerTop, this.groundTop);
        this.physics.add.collider(this.playerBottom, this.groundBot);

        this.obstaclesTop = this.physics.add.group();
        this.obstaclesBot = this.physics.add.group();
        this.boostersTop = this.physics.add.group();
        this.boostersBot = this.physics.add.group();

        const overlapObstacle = (player, obstacle, laneKey) => {
            if (!this.isOnGround(player)) return;
            this.hitObstacle(laneKey, obstacle);
        };
        const overlapBooster = (player, booster, laneKey) => {
            this.getBooster(laneKey, booster);
        };

        this.physics.add.overlap(this.playerTop, this.obstaclesTop, (p, o) => overlapObstacle(p, o, 'top'));
        this.physics.add.overlap(this.playerBottom, this.obstaclesBot, (p, o) => overlapObstacle(p, o, 'bottom'));
        this.physics.add.overlap(this.playerTop, this.boostersTop, (p, b) => overlapBooster(p, b, 'top'));
        this.physics.add.overlap(this.playerBottom, this.boostersBot, (p, b) => overlapBooster(p, b, 'bottom'));

        this.keys = this.input.keyboard.addKeys({
            jumpTop: 'W',
            jumpBottom: 'UP',
            accelTop: 'S',
            accelBottom: 'I',
            slowTop: 'NUMPAD_EIGHT',
            slowBottom: 'NUMPAD_TWO'
        });

        this.createProgressUI();

        this.startCountdown();

        /* BOTON VOLVER 
        this.backButton = this.add.text(
            this.scale.width / 2,
            this.scale.height / 2 + 120,
            '⬅ VOLVER',
            {
                fontFamily: 'Arial Black',
                fontSize: '42px',
                color: '#ff69b4',
                stroke: '#ffffff',
                strokeThickness: 5,
                shadow: {
                    offsetX: 4,
                    offsetY: 4,
                    color: '#000000',
                    blur: 10,
                    fill: true
                }
            }
        )
            .setOrigin(0.5)
            .setAlpha(0)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.start('MainMenuScene');
            })
            .on('pointerover', () => {
                this.backButton.setColor('#ffffff');
                this.backButton.setScale(1.12);
                this.backButton.setShadowBlur(20);
            })
            .on('pointerout', () => {
                this.backButton.setColor('#ff69b4');
                this.backButton.setScale(1);
                this.backButton.setShadowBlur(10);
            });
        */

        // Camera adjustment to frame everything without cropping
        const margin = 0.8;
        const zoomX = (width * margin) / width;
        const zoomY = (height * margin) / height;
        const zoom = Math.min(zoomX, zoomY);

        this.cameras.main.setZoom(zoom);
        this.cameras.main.centerOn(width / 2, height / 2);

    }

    // ---------- UI Progreso ----------
    createProgressUI() {

        const centerX = this.scale.width / 2;

        // Jugador 1 más arriba
        this.uiP1Label = this.add.text(centerX, this.laneYTop - 150, 'Progreso:',
            {
                fontFamily: 'Arial Black',
                fontSize: '20px',
                color: '#070707ff'
            }).setOrigin(0.5)
            .setDepth(5);

        this.uiP1Pct = this.add.text(centerX, this.laneYTop - 120, '0%',
            {
                fontFamily: 'Arial Black',
                fontSize: '26px',
                color: '#ffff66'
            }).setOrigin(0.5)
            .setDepth(5);

        // Jugador 2 más abajo
        this.uiP2Label = this.add.text(centerX, this.laneYBottom - 150, 'Progreso:',
            {
                fontFamily: 'Arial Black',
                fontSize: '20px',
                color: '#000000ff'
            }).setOrigin(0.5)
            .setDepth(5);

        this.uiP2Pct = this.add.text(centerX, this.laneYBottom - 120, '0%',
            {
                fontFamily: 'Arial Black',
                fontSize: '26px',
                color: '#067fffff'
            }).setOrigin(0.5)
            .setDepth(5);
    }


    updateProgressUI() {
        const pctTop = Math.min(100, Math.floor((this.state.progress.top / CONFIG.TOTAL_DISTANCE_PX) * 100));
        const pctBot = Math.min(100, Math.floor((this.state.progress.bottom / CONFIG.TOTAL_DISTANCE_PX) * 100));
        this.uiP1Pct.setText(`${pctTop}%`);
        this.uiP2Pct.setText(`${pctBot}%`);
    }

    // ---------- Countdown ----------
    startCountdown() {
        const steps = ['3', '2', '1', '¡YA!'];
        let i = 0;

        const label = this.add.text(this.scale.width / 2, this.scale.height / 2, '', {
            fontFamily: 'Arial Black',
            fontSize: '96px',
            color: '#ffffff',
            stroke: '#ff69b4',
            strokeThickness: 8
        }).setOrigin(0.5).setAlpha(0).setDepth(6);

        const showNext = () => {
            if (i >= steps.length) {
                label.destroy();
                this.state.running = true;
                this.startSpawner();
                return;
            }
            label.setText(steps[i]);
            label.setScale(0.2).setAlpha(0);
            this.tweens.add({
                targets: label,
                alpha: 1,
                scale: 1,
                duration: 250,
                yoyo: false,
                onComplete: () => {
                    this.time.delayedCall(500, () => {
                        this.tweens.add({
                            targets: label,
                            alpha: 0,
                            duration: 200,
                            onComplete: () => { i += 1; showNext(); }
                        });
                    });
                }
            });
        };

        this.state.running = false;
        this.state.finished = false;
        this.state.progress.top = 0;
        this.state.progress.bottom = 0;

        showNext();
    }

    // ---------- Lógica carrera ----------
    isOnGround(player) {
        return player.body.blocked.down || Math.abs(player.body.velocity.y) < 1;
    }

    jump(player) {
        if (!this.isOnGround(player)) return;
        player.setVelocityY(CONFIG.JUMP_VELOCITY);
    }

    applyAlteration(laneKey, factor) {
        const lane = this.state.lanes[laneKey];
        if (lane.altered) return;

        const accelerating = factor > 1;
        lane.altered = true;
        if (accelerating) lane.immune = true;

        lane.speed = CONFIG.BASE_SPEED * factor;

        this.time.delayedCall(CONFIG.EFFECT_MS, () => {
            lane.speed = CONFIG.BASE_SPEED;
            lane.altered = false;
            if (accelerating) lane.immune = false;
        });
    }

    hitObstacle(laneKey, obstacle) {
        const lane = this.state.lanes[laneKey];
        if (lane.immune) { obstacle.destroy(); return; }
        obstacle.destroy();
        this.applyAlteration(laneKey, CONFIG.SLOW_FACTOR);
    }

    getBooster(laneKey, booster) {
        booster.destroy();
        this.applyAlteration(laneKey, CONFIG.ACCEL_FACTOR);
    }

    spawnOne(laneKey) {
        const isBooster = Math.random() < CONFIG.BOOSTER_PROB;
        const group = (laneKey === 'top')
            ? (isBooster ? this.boostersTop : this.obstaclesTop)
            : (isBooster ? this.boostersBot : this.obstaclesBot);

        const redY = (laneKey === 'top')
            ? (this.laneYTop + CONFIG.RED_OFFSET_FROM_CENTER + 200)
            : (this.laneYBottom + CONFIG.RED_OFFSET_FROM_CENTER + 200);

        const key = isBooster ? 'Apple' : 'obstacle';

        const obj = group.create(CONFIG.WIDTH + 30, redY, key)
            .setOrigin(0.5, 1)
            .setDepth(3);

        if (isBooster) obj.setScale(0.4);

        obj.body.setAllowGravity(false);
        obj.body.setImmovable(true);

        const lane = this.state.lanes[laneKey];
        obj.body.setVelocityX(-(lane.speed * 100));
    }

    startSpawner() {
        const schedule = () => {
            if (!this.state.running || this.state.finished) return;
            const laneKey = Math.random() > 0.5 ? 'top' : 'bottom';
            this.spawnOne(laneKey);
            const next = Phaser.Math.Between(CONFIG.MIN_SPAWN, CONFIG.MAX_SPAWN);
            this.time.delayedCall(next, schedule);
        };
        schedule();
    }

    finishRace(winner) {

        if (this.state.finished) return;
        this.state.finished = true;
        this.state.running = false;

        // Darkm background
        this.overlay = this.add.rectangle(
            this.scale.width / 2,
            this.scale.height / 2,
            this.scale.width,
            this.scale.height,
            0x000000,
            0.55
        ).setDepth(50).setScrollFactor(0);

        // Stop EVERYTHINHG!
        const stopGroup = g => g.children.each(o => {
            if (o && o.body) o.body.setVelocity(0, 0);
        });
        stopGroup(this.obstaclesTop);
        stopGroup(this.boostersTop);
        stopGroup(this.obstaclesBot);
        stopGroup(this.boostersBot);

        // Recover the name of the ponis
        const p1 = this.registry.get('player1Character') || {};
        const p2 = this.registry.get('player2Character') || {};

        // WINNER
        const winnerKey = winner === 'top' ? p1 : p2;
        const winnerName = winnerKey?.key || p1 || 'Jugador';

        // LOOSER
        const looserKey = winner === 'top' ? p2 : p1;
        const looserName = looserKey?.key || p2 || 'Jugador';

        // 🔹 Guarda el nombre del perdedor para la FinalScene
        this.registry.set('looser', looserName);


        // Show who won
        const msg = `¡${winnerName} WON!`;

        /* BOTON DE VOLVER
        this.backButton
            .setAlpha(0)
            .setDepth(51);
 
        this.tweens.add({
            targets: this.backButton,
            alpha: 1,
            duration: 400
        });
        */

        const label = this.add.text(this.scale.width / 2, this.scale.height / 2, msg, {
            fontFamily: 'Arial Black',
            fontSize: '64px',
            color: '#ffffff',
            stroke: '#ff69b4',
            strokeThickness: 8
        }).setOrigin(0.5)
            .setScale(0.5)
            .setAlpha(0)
            .setDepth(51);

        this.tweens.add({
            targets: label,
            alpha: 1,
            scale: 1,
            duration: 400,
            ease: 'Back.Out'
        });

        // START FINAL SCENE (after 5 secs): //ME PARECE MUHCO LE PINGO 3
        this.time.delayedCall(3000, () => {
            this.scene.start('FinalScene');
        });

    }


    // ---------- Loop ----------
    update(_, dtMs) {

        this.updateProgressUI();

        if (!this.state.running || this.state.finished) return;

        const dt = dtMs / 1000;
        const topScroll = this.state.lanes.top.speed * 100 * dt;
        const botScroll = this.state.lanes.bottom.speed * 100 * dt;

        // Move floor
        this.trackTop.tilePositionX += topScroll;
        this.trackBot.tilePositionX += botScroll;

        // Clouds (slower -> parallax)
        this.cloudsTop.tilePositionX += topScroll * 0.1;
        this.cloudsBot.tilePositionX += topScroll * 0.1;

        // Plants (faster -> parallax)
        this.plantsTop.tilePositionX += topScroll * 2;
        this.plantsBot.tilePositionX += topScroll * 2;

        // JUMP
        if (Phaser.Input.Keyboard.JustDown(this.keys.jumpTop)) this.jump(this.playerTop);
        if (Phaser.Input.Keyboard.JustDown(this.keys.jumpBottom)) this.jump(this.playerBottom);

        // BOOSTS
        if (Phaser.Input.Keyboard.JustDown(this.keys.accelTop) && !this.state.lanes.top.altered)
            this.applyAlteration('top', CONFIG.ACCEL_FACTOR);
        if (Phaser.Input.Keyboard.JustDown(this.keys.accelBottom) && !this.state.lanes.bottom.altered)
            this.applyAlteration('bottom', CONFIG.ACCEL_FACTOR);

        if (Phaser.Input.Keyboard.JustDown(this.keys.slowTop) && !this.state.lanes.top.altered)
            this.applyAlteration('top', CONFIG.SLOW_FACTOR);
        if (Phaser.Input.Keyboard.JustDown(this.keys.slowBottom) && !this.state.lanes.bottom.altered)
            this.applyAlteration('bottom', CONFIG.SLOW_FACTOR);

        const vxTop = -(this.state.lanes.top.speed * 100);
        const vxBot = -(this.state.lanes.bottom.speed * 100);

        this.obstaclesTop.children.iterate(o => o && o.body && o.body.setVelocityX(vxTop));
        this.boostersTop.children.iterate(o => o && o.body && o.body.setVelocityX(vxTop));
        this.obstaclesBot.children.iterate(o => o && o.body && o.body.setVelocityX(vxBot));
        this.boostersBot.children.iterate(o => o && o.body && o.body.setVelocityX(vxBot));

        // PROGRESS
        this.state.progress.top += topScroll;
        this.state.progress.bottom += botScroll;

        if (this.state.progress.top >= CONFIG.TOTAL_DISTANCE_PX) {
            this.finishRace('top');
        } else if (this.state.progress.bottom >= CONFIG.TOTAL_DISTANCE_PX) {
            this.finishRace('bottom');
        }

        // CLEAN
        const off = -50;
        const clean = g => g.children.each(o => { if (o && o.x < off) o.destroy(); });
        clean(this.obstaclesTop); clean(this.boostersTop);
        clean(this.obstaclesBot); clean(this.boostersBot);
    }
}
