import Phaser from 'phaser';


const CONFIG = {
    WIDTH: 1920,
    HEIGHT: 1080,

    // Base velocity of the scroll
    BASE_SPEED: 2.5,
    ACCEL_FACTOR: 2.5,
    SLOW_FACTOR: 0.1,
    EFFECT_MS: 1500,

    // Spawner
    MIN_SPAWN: 1000,
    MAX_SPAWN: 3000,
    BOOSTER_PROB: 0.25,

    // Jump
    JUMP_VELOCITY: -800,
    GRAVITY_Y: 1400,

    // Track geometry
    TRACK_HEIGHT: 520,
    RED_OFFSET_FROM_CENTER: 20,
    GROUND_HEIGHT: 16,

    SHOW_FINISH_AT: 0.70, // 70% of the race

    // Total distance to finish line
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
                top: { speed: CONFIG.BASE_SPEED, altered: false, immune: false, lives: 3 },
                bottom: { speed: CONFIG.BASE_SPEED, altered: false, immune: false, lives: 3 }
            }
        };
    }

    init(data) {
        // Si jugamos online o en local
        this.isOnline = data.online || false;

        if (this.isOnline) {
            this.ws = data.ws;         // Socket open
            this.roomId = data.roomId; // ID 
            this.role = data.role;     // 'player1' (Up) o 'player2' (Down)

            //Lane pos
            this.myLane = (this.role === 'player1') ? 'top' : 'bottom';
            this.rivalLane = (this.role === 'player1') ? 'bottom' : 'top';

            console.log(`Iniciando carrera Online. Soy: ${this.role} (${this.myLane})`);
        }
    }

    preload() {/*IN BootScene.js*/ }

    create() {


        // SOUNDS
        this.music = this.sound.add('clickSound', {
        });

        this.crashSound = this.sound.add('bonkSound', {
        });

        this.appleSound = this.sound.add('appleSound', {
        });

        this.lemonSound = this.sound.add('lemonSound', {
        });

        this.kiwiSound = this.sound.add('kiwiSound', {
        });

        this.countSound = this.sound.add('CountSound', {
        });

        this.winSound = this.sound.add('winSound', {
        });

        //BACKGROUND MUSIC
        this.game.bgrsMusic = this.sound.add('runningSong', {
            loop: true,
            volume: (this.game.musicLevel ?? 5) / 10
        });
        this.game.bgrsMusic.play();

        const { width, height } = this.scale;

        this.cameras.main.setBackgroundColor('#000');

        // General color background
        this.add.image(width / 2, height / 2, 'ColorBackground')
            .setOrigin(0.5)
            .setDepth(-1);

        // Middle Line
        this.add.image(width / 2, height / 2, 'MiddleLine')
            .setOrigin(0.5)
            .setDepth(20);

        // Frame
        this.add.image(width / 2, height / 2, 'redFrame')
            .setDepth(25);

        // Sun TOP
        this.add.image((width / 2) + 600, (height / 2) - 430, 'Sun')
            .setScale(0.4)
            .setDepth(0);

        // Sun BOTTOM
        this.add.image((width / 2) + 600, (height / 2) + 130, 'Sun')
            .setScale(0.4)
            .setDepth(0);

        // Lifes TOP
        this.live1Top = this.add.image((width / 2) - 860, (height / 2) - 465, 'Lives')
            .setScale(0.15)
            .setDepth(10);
        this.live2Top = this.add.image((width / 2) - 760, (height / 2) - 465, 'Lives')
            .setScale(0.15)
            .setDepth(10);
        this.live3Top = this.add.image((width / 2) - 660, (height / 2) - 465, 'Lives')
            .setScale(0.15)
            .setDepth(10);

        // Lifes BOTTOM
        this.live1Bottom = this.add.image((width / 2) - 860, (height / 2) + 90, 'Lives')
            .setScale(0.15)
            .setDepth(10);
        this.live2Bottom = this.add.image((width / 2) - 760, (height / 2) + 90, 'Lives')
            .setScale(0.15)
            .setDepth(10);
        this.live3Bottom = this.add.image((width / 2) - 660, (height / 2) + 90, 'Lives')
            .setScale(0.15)
            .setDepth(10);

        //Buttons
        const buttons = [
            {
                x: width * 0.95,
                y: height * 0.1,
                key: 'bttnPause',
                hover: 'bttnPauseHover',
                scale: 0.6,
                depth: 24,
                action: () => {
                    this.scene.launch('PauseScene'); // Opens
                    this.scene.pause();
                }
            },
        ];

        this.input.keyboard.on('keydown-ESC', () => {
            if (!this.scene.isActive('PauseScene')) {
                this.scene.pause(); // pauses actual scene
                this.scene.launch('PauseScene'); // opens pause scene
            }
        });

        buttons.forEach(btn => {
            const button = this.add.image(btn.x, btn.y, btn.key)
                .setInteractive({ useHandCursor: true })
                .setScale(btn.scale)
                .setDepth(btn.depth);

            // Hover
            button.on('pointerover', () => {
                button.setTexture(btn.hover);
                button.setScale(btn.scale * 1.05);
            });

            // Exit hover
            button.on('pointerout', () => {
                button.setTexture(btn.key);
                button.setScale(btn.scale);
            });

            // Click sound
            button.on('pointerdown', () => {
                btn.action();
                this.music.play();
            });
        });

        // PONIS RUN ANIMATION
        const runPonies = ['Ache', 'Haiire', 'Kamil', 'Beersquiviry', 'Domdomdadom'];

        runPonies.forEach(p => {
            const frames = [];
            for (let i = 1; i <= 4; i++) {
                frames.push({ key: `${p}Run${i}` });
            }

            this.anims.create({
                key: `${p}_run`,   // dinamic name
                frames,
                frameRate: 11,
                repeat: -1
            });
        });

        // PONIS JUMP ANIMATION
        const jumpPonies = ['Ache', 'Haiire', 'Kamil', 'Beersquiviry', 'Domdomdadom'];

        jumpPonies.forEach(p => {
            const frames = [];
            for (let i = 1; i <= 3; i++) {
                frames.push({ key: `${p}Jump${i}` });
            }

            this.anims.create({
                key: `${p}_jump`,   // dinamic name
                frames,
                frameRate: 4,
                repeat: -1
            });
        });

        // POOP ANIMATION
        const poopAnim = [];
        for (let i = 1; i <= 8; i++) poopAnim.push({ key: `poop${i}` });

        this.anims.create({
            key: 'poop',
            frames: poopAnim,
            frameRate: 17,
            repeat: 0 // Just once
        });

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

        // Red line (referencia)
        const redTopY = this.laneYTop;
        const redBotY = this.laneYBottom;

        // Previous character selection
        const p1 = this.registry.get('player1Character');
        const p2 = this.registry.get('player2Character');

        const makePony = (x, redLineY, keyOrObj) => {

            const key = (keyOrObj && keyOrObj.key) ? keyOrObj.key : keyOrObj;

            // The first frame is used as the initial texture
            const sprite = this.physics.add.sprite(x, redLineY, `${key}Run4`)
                .setOrigin(0.5, 0.8);

            sprite.name = key;

            const targetHeight = 0;
            sprite.setScale(0.35);

            sprite.body.setAllowGravity(true);
            sprite.body.setGravityY(CONFIG.GRAVITY_Y);
            sprite.body.setAllowRotation(false);
            sprite.body.setBounce(0);

            // Wait 3 secs AT THE BEGGINING
            this.time.delayedCall(3000, () => {
                sprite.play(`${key}_run`);
            });

            return sprite;
        };

        // Invisible platform
        const makeGroundAtRed = (redLineY) => {
            const H = CONFIG.GROUND_HEIGHT;
            const groundCenterY = redLineY + H / 2;

            const rect = this.add.rectangle(width / 2, groundCenterY, width, H, 0x00ff00, 0);
            this.physics.add.existing(rect, true);
            return rect;
        };

        this.playerTop = makePony(300, redTopY, p1).setDepth(3);  //CONTROL THE SPAWN COORDINATES OF PONIS
        this.playerBottom = makePony(300, redBotY, p2).setDepth(3);

        // Fix player hitbox
        this.playerTop.body.setSize(this.playerTop.width * 0.4, this.playerTop.height * 0.8);
        this.playerTop.body.setOffset(this.playerTop.width * 0.2, this.playerTop.height * 0.2);
        this.playerBottom.body.setSize(this.playerTop.width * 0.4, this.playerTop.height * 0.8);
        this.playerBottom.body.setOffset(this.playerTop.width * 0.2, this.playerTop.height * 0.2);

        this.groundTop = makeGroundAtRed(redTopY + 200);  //control the invisible ground coorinates
        this.groundBot = makeGroundAtRed(redBotY + 200);

        this.physics.add.collider(this.playerTop, this.groundTop);
        this.physics.add.collider(this.playerBottom, this.groundBot);

        // Fences:
        this.obstaclesTop = this.physics.add.group();
        this.obstaclesBot = this.physics.add.group();

        // Apples:
        this.boostersTop = this.physics.add.group();
        this.boostersBot = this.physics.add.group();

        // LimeLemon:
        this.lifeBoostersTop = this.physics.add.group();
        this.lifeBoostersBot = this.physics.add.group();

        // Kawikis:
        this.kawikiTop = this.physics.add.group();
        this.kawikiBot = this.physics.add.group();

        const overlapBooster = (player, booster, laneKey) => {
            this.getBooster(laneKey, booster);
        };

        // Fences overlap:
        this.physics.add.overlap(this.playerTop, this.obstaclesTop, (player, obstacle) => this.handleObstacleCollision(player, obstacle, 'top'));
        this.physics.add.overlap(this.playerBottom, this.obstaclesBot, (player, obstacle) => this.handleObstacleCollision(player, obstacle, 'bottom'));

        // Apples overlap:
        this.physics.add.overlap(this.playerTop, this.boostersTop, (p, b) => overlapBooster(p, b, 'top'));
        this.physics.add.overlap(this.playerBottom, this.boostersBot, (p, b) => overlapBooster(p, b, 'bottom'));

        // Limelemon overlap:
        this.physics.add.overlap(this.playerTop, this.lifeBoostersTop, (player, booster) => this.getLifeBooster('top', booster));
        this.physics.add.overlap(this.playerBottom, this.lifeBoostersBot, (player, booster) => this.getLifeBooster('bottom', booster));

        // Kawiki overlap:
        this.physics.add.overlap(this.playerTop, this.kawikiTop, (player, booster) => this.getKawiki('top', booster));
        this.physics.add.overlap(this.playerBottom, this.kawikiBot, (player, booster) => this.getKawiki('bottom', booster));

        // Keys:
        if (!this.registry.list.controls) {
            this.registry.set('controls', {
                jumpTop: 'W',
                jumpBottom: 'UP',
            });
        }

        const controls = this.registry.get('controls');

        this.keys = this.input.keyboard.addKeys({
            jumpTop: controls.jumpTop,
            jumpBottom: controls.jumpBottom,
            accelTop: 'S',
            accelBottom: 'I',
            slowTop: 'NUMPAD_EIGHT',
            slowBottom: 'NUMPAD_TWO'
        });

        this.finishSpawned = false; // Finish line not spawned yet

        this.createProgressUI();

        this.resetRaceState();

        this.startCountdown();

        this.lastSyncTime = 0;

        // Camera adjustment to frame everything without cropping
        const margin = 0.8;
        const zoomX = (width * margin) / width;
        const zoomY = (height * margin) / height;
        const zoom = Math.min(zoomX, zoomY);

        this.cameras.main.setZoom(zoom);
        this.cameras.main.centerOn(width / 2, height / 2);


        this.input.keyboard.on('keydown-ESCAPE', () => {
            this.scene.pause();
            this.scene.launch('PauseScene');
        });

        // ---ONLINE SYNC ---
        if (this.isOnline && this.ws) {
            
            this.ws.onmessage = (event) => {
                const msg = JSON.parse(event.data);

                if (msg.type === 'raceEvent') {
                    this.handleRemoteEvent(msg.payload.event);
                }
                else if (msg.type === 'gameSync') {
                    // MAP OF THE HOST 
                    console.log("Mapa recibido del Host");
                    this.syncedMapData = msg.payload.mapData;
                }
                else if (msg.type === 'playerUpdate') {
                    this.handlePlayerSync(msg.payload);
                }
                else if (msg.type === 'opponentDisconnected') {
                    this.handleOpponentDisconnect();
                }
            };

            // If player 1, send the map
            if (this.role === 'player1') {
                const mapData = this.generateMapData();
                this.syncedMapData = mapData; // Me lo guardo para mí
                
                console.log("Enviando datos de mapa al rival...");
                this.ws.send(JSON.stringify({
                    type: 'gameSync',
                    payload: { roomId: this.roomId, mapData: mapData }
                }));
            }
        } else {
            // If its offline the map is not sended
            this.syncedMapData = this.generateMapData();
        }

        if (this.isOnline && this.state.running && !this.state.finished) {
            if (time - this.lastSyncTime > 50) { // 500ms
                this.lastSyncTime = time;
                
                const myPlayer = (this.myLane === 'top') ? this.playerTop : this.playerBottom;
                const myProgress = this.state.progress[this.myLane];
                const myLives = this.state.lanes[this.myLane].lives;

                // Enviar estado al rival
                this.ws.send(JSON.stringify({
                    type: 'playerUpdate',
                    payload: {
                        roomId: this.roomId,
                        state: {
                            y: myPlayer.y,        
                            progress: myProgress, 
                            lives: myLives        
                        }
                    }
                }));
            }
        }
    }
    // --- LAG FIX ---
    handlePlayerSync(payload) {
        // payload = { from: 'player1', state: { y, progress, lives } }
        const { state } = payload;
        
        // Identify the other pony
        const rivalLane = this.rivalLane; // 'top' or 'bottom'
        const rivalPlayer = (rivalLane === 'top') ? this.playerTop : this.playerBottom;
        
        // If the difference its big (greater than 50px), force 
        // If its small (less tan 50px), we let the pyshics correct the delay
        if (Math.abs(rivalPlayer.y - state.y) > 50) {
            this.tweens.add({
                targets: rivalPlayer,
                y: state.y,
                duration: 100
            });
        }

        //Correct camera
        const currentRivalProgress = this.state.progress[rivalLane];
        if (Math.abs(currentRivalProgress - state.progress) > 200) {
            this.state.progress[rivalLane] = state.progress;
        }
        // Correct lives
        if (this.state.lanes[rivalLane].lives !== state.lives) {
            this.state.lanes[rivalLane].lives = state.lives;
            this.updateLivesVisuals(rivalLane); // Necesitaremos crear este pequeño helper o actualizar a mano
        }
    }

    updateLivesVisuals(laneKey) {
        const lane = this.state.lanes[laneKey];
        const lives = lane.lives;
        
        let l1, l2, l3;
        if (laneKey === 'top') { l1 = this.live1Top; l2 = this.live2Top; l3 = this.live3Top; }
        else { l1 = this.live1Bottom; l2 = this.live2Bottom; l3 = this.live3Bottom; }
        
        if (l1 && l2 && l3) {
            l3.setTexture(lives >= 3 ? 'Lives' : 'LivesEmpty');
            l2.setTexture(lives >= 2 ? 'Lives' : 'LivesEmpty');
            l1.setTexture(lives >= 1 ? 'Lives' : 'LivesEmpty');
        }
    }

    handleRemoteEvent(eventData) {
        const action = (typeof eventData === 'string') ? eventData : eventData.action;

        const rivalPlayer = (this.rivalLane === 'top') ? this.playerTop : this.playerBottom;

        switch (action) {
            case 'jump':
                this.jump(rivalPlayer);
                break;

            case 'accel':
                this.applyAlteration(this.rivalLane, CONFIG.ACCEL_FACTOR);
                break;

            case 'slow':
                this.applyAlteration(this.rivalLane, CONFIG.SLOW_FACTOR);
                break;

        }
    }

    handleOpponentDisconnect() {
        console.log("Rival desconectado");
        this.state.running = false;

        const text = this.add.text(this.scale.width / 2, this.scale.height / 2, "OPPONENT LEFT\nYOU WIN!", {
            fontSize: '64px',
            color: '#ffffff',
            align: 'center',
            backgroundColor: '#000000aa'
        }).setOrigin(0.5).setDepth(100);

        this.time.delayedCall(3000, () => {
            this.scene.start('MainMenuScene');
        });
    }

    // ---------- UI Progress ----------
    createProgressUI() {

        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;


        /* Player 1 up
        this.uiP1Label = this.add.text(centerX, this.laneYTop - 150, 'Progress:',
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
                color: '#b36729ff'
            }).setOrigin(0.5)
            .setDepth(5);
        
        // Player 2 down
        this.uiP2Label = this.add.text(centerX, this.laneYBottom - 150, 'Progress:',
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
        
        */

        // Horizontal bar
        this.progressBar = this.add.rectangle(centerX, centerY, 800, 5, 0x4ca149)
            .setOrigin(0.5)
            .setDepth(20);

        // Get the selected ponis
        const p1 = this.registry.get('player1Character');
        const p2 = this.registry.get('player2Character');

        // Icon of the score of the poni 1
        this.iconP1 = this.add.image(
            this.progressBar.x - this.progressBar.width / 2,
            centerY,
            `${p1.key}Run1`
        )
            .setScale(0.12)
            .setDepth(21);

        // Icon of the score of the poni 2
        this.iconP2 = this.add.image(
            this.progressBar.x - this.progressBar.width / 2,
            centerY,
            `${p2.key}Run1`
        )
            .setScale(0.12)
            .setDepth(21);

    }


    updateProgressUI() {
        const pctTop = Math.min(100, Math.floor((this.state.progress.top / CONFIG.TOTAL_DISTANCE_PX) * 100));
        const pctBot = Math.min(100, Math.floor((this.state.progress.bottom / CONFIG.TOTAL_DISTANCE_PX) * 100));
        //this.uiP1Pct.setText(`${pctTop}%`);
        //this.uiP2Pct.setText(`${pctBot}%`);

        // Move icons across the bar
        const startX = this.progressBar.x - this.progressBar.width / 2;
        const endX = this.progressBar.x + this.progressBar.width / 2;

        this.iconP1.x = startX + (endX - startX) * (pctTop / 100);
        this.iconP2.x = startX + (endX - startX) * (pctBot / 100);

        // ---------- SPAWN DE LA META ----------
        if (!this.finishSpawned && (pctTop >= 80 || pctBot >= 80)) {
            this.finishSpawned = true;
            this.spawnFinishLine();
        }
    }

    // ---------- Countdown -----------
    startCountdown() {
        const steps = ['3', '2', '1', '¡GO!'];
        let i = 0;

        this.countSound.play();

        const label = this.add.text(this.scale.width / 2, this.scale.height / 2, '', {
            fontFamily: 'Arial Black',
            fontSize: '96px',
            color: '#ffffff',
            stroke: '#ff69b4',
            strokeThickness: 8
        }).setOrigin(0.5).setAlpha(0).setDepth(22);

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
                duration: 150,
                yoyo: false,
                onComplete: () => {
                    this.time.delayedCall(500, () => {
                        this.tweens.add({
                            targets: label,
                            alpha: 0,
                            duration: 100,
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

    // ---------- Race logic ----------
    isOnGround(player) {
        return player.body.blocked.down || Math.abs(player.body.velocity.y) < 1;
    }

    jump(player) {
        if (!this.isOnGround(player)) return;

        player.setVelocityY(CONFIG.JUMP_VELOCITY);

        // Jump animation
        if (player.name) {
            player.play(`${player.name}_jump`, true);
            this.music = this.sound.add('boingSound', {
            });
            this.music.play();
        }

        this.time.delayedCall(800, () => {
            if (player.name) {
                player.play(`${player.name}_run`, true);
            }
        });
    }

    resetRaceState() {
        this.state.running = false;
        this.state.finished = false;

        this.state.progress.top = 0;
        this.state.progress.bottom = 0;

        this.state.lanes.top = {
            speed: CONFIG.BASE_SPEED,
            altered: false,
            immune: false,
            lives: 3
        };

        this.state.lanes.bottom = {
            speed: CONFIG.BASE_SPEED,
            altered: false,
            immune: false,
            lives: 3
        };
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

    handleObstacleCollision(player, obstacle, laneKey) {
        // If that obstacle was proccesed, do not do anything
        if (!obstacle || obstacle.hasHit) return;

        // Only if is on the ground
        if (!this.isOnGround(player)) return;

        // Mark as collision
        obstacle.hasHit = true;

        // 
        this.hitObstacle(laneKey, obstacle);
    }


    hitObstacle(laneKey, obstacle) {

        this.crashSound.play();

        const lane = this.state.lanes[laneKey];

        if (lane.immune) {
            obstacle.destroy();
            return;
        }

        this.cameras.main.shake(100, 0.01); // Little camera shake

        lane.lives--;

        // Destroy lives
        if (laneKey === 'top') {
            if (lane.lives === 2) this.live3Top.setTexture('LivesEmpty');
            else if (lane.lives === 1) this.live2Top.setTexture('LivesEmpty');
            else if (lane.lives === 0) {
                this.live1Top.setTexture('LivesEmpty');
                this.finishRace('bottom');
            }

        } else if (laneKey === 'bottom') {
            if (lane.lives === 2) this.live3Bottom.setTexture('LivesEmpty');
            else if (lane.lives === 1) this.live2Bottom.setTexture('LivesEmpty');
            else if (lane.lives === 0) {
                this.live1Bottom.setTexture('LivesEmpty');
                this.finishRace('top');
            }
        }
        obstacle.destroy();

        this.applyAlteration(laneKey, CONFIG.SLOW_FACTOR);
    }

    // Apple
    getBooster(laneKey, booster) {

        this.appleSound.play();

        const player = (laneKey === 'top') ? this.playerTop : this.playerBottom;

        // Little animation
        this.tweens.add({
            targets: player,
            alpha: 0.6,
            duration: 100,
            yoyo: true
        })

        booster.destroy();
        this.applyAlteration(laneKey, CONFIG.ACCEL_FACTOR);
    }

    // Limelemon
    getLifeBooster(laneKey, booster) {

        this.lemonSound.play();

        const player = (laneKey === 'top') ? this.playerTop : this.playerBottom;
        const lane = this.state.lanes[laneKey];

        // Small animation
        this.tweens.add({
            targets: player,
            alpha: 0.4,
            duration: 120,
            yoyo: true
        });

        booster.destroy();

        // --- +1 life ---
        if (lane.lives < 3) {
            lane.lives++;

            if (laneKey === 'top') {
                if (lane.lives === 1) this.live1Top.setTexture('Lives');
                else if (lane.lives === 2) this.live2Top.setTexture('Lives');
                else if (lane.lives === 3) this.live3Top.setTexture('Lives');

            } else {
                if (lane.lives === 1) this.live1Bottom.setTexture('Lives');
                else if (lane.lives === 2) this.live2Bottom.setTexture('Lives');
                else if (lane.lives === 3) this.live3Bottom.setTexture('Lives');
            }
        }
    }

    // Kawiki
    getKawiki(laneKey, booster) {

        const WIDTH = this.game.config.width;
        const HEIGHT = this.game.config.height;

        const spriteHeight = HEIGHT / 2;

        let posX = WIDTH / 2;
        let posY;

        this.kiwiSound.play();
        const player = (laneKey === 'top') ? this.playerTop : this.playerBottom;
        const lane = this.state.lanes[laneKey];

        // Small animation on pony
        this.tweens.add({
            targets: player,
            alpha: 0.4,
            duration: 120,
            yoyo: true
        });

        booster.destroy();

        // Reduce visibility

        if (laneKey === 'top') {
            posY = HEIGHT - (spriteHeight / 2);
        } else if (laneKey === 'bottom') {
            posY = spriteHeight / 2;
        }

        const poop = this.add.sprite(posX, posY, 'poop1')
            .setOrigin(0.5)
            .setDepth(19);

        poop.play('poop');

        poop.on('animationcomplete', () => {

            // Frame 4 stays
            poop.setTexture('poop4');

            // On screen for a while
            this.time.delayedCall(4000, () => {
                poop.destroy();
            });

        });
    }

    spawnFixed(laneKey, type) {

        const isBooster = type === "booster";
        const isLifeBooster = (type === "life");
        const isKawiki = type === "kawiki";

        const group = (laneKey === "top")
            ? (isBooster ? this.boostersTop
                : isLifeBooster ? this.lifeBoostersTop
                    : isKawiki ? this.kawikiTop
                        : this.obstaclesTop)
            : (isBooster ? this.boostersBot
                : isLifeBooster ? this.lifeBoostersBot
                    : isKawiki ? this.kawikiBot
                        : this.obstaclesBot);

        const redY = (laneKey === "top")
            ? (this.laneYTop + CONFIG.RED_OFFSET_FROM_CENTER + 200)
            : (this.laneYBottom + CONFIG.RED_OFFSET_FROM_CENTER + 200);

        const key =
            isBooster ? "Apple"
                : isLifeBooster ? "LimeLemon"
                    : isKawiki ? "Kawiki"
                        : "WoodFence"

        const spawnY = (key === "WoodFence") ? redY : redY - 50; // ups 100px

        const obj = group.create(CONFIG.WIDTH - 40, spawnY, key)
            .setOrigin(0.5, 1)
            .setDepth(3);

        // Scale depending on type
        if (key === "WoodFence") {
            obj.setScale(0.4);

        } else {
            obj.setScale(0.3);
            obj.body.setSize(obj.width * 0.3, obj.height * 0.3); //fix hitbox
        }


        obj.body.setAllowGravity(false);
        obj.body.setImmovable(true);

        const lane = this.state.lanes[laneKey];
        obj.body.setVelocityX(-(lane.speed * 150));
    }

    closeToFinish(laneKey) {
        const progress = this.state.progress[laneKey];
        const pct = progress / CONFIG.TOTAL_DISTANCE_PX;
        return pct >= 0.90; // Not generating anything more when the pony hit 90%
    }

    checkFinishLine(player, finishLine, laneKey) {
        if (this.state.finished) return;
        this.finishRace(laneKey);
    }

    spawnFinishLine() {
        const yTop = this.laneYTop + CONFIG.RED_OFFSET_FROM_CENTER + 250;
        const yBot = this.laneYBottom + CONFIG.RED_OFFSET_FROM_CENTER + 250;

        // TOP
        this.finishTop = this.physics.add.sprite(CONFIG.WIDTH + 50, yTop, 'FinishLine')
            .setOrigin(0.5, 1)
            .setDepth(3)
            .setScale(0.45)
            .setImmovable(true)
            .setVelocityX(-(this.state.lanes.top.speed * 150));

        this.finishTop.body.setAllowGravity(false);
        ;

        // Colision with TOP player
        this.physics.add.overlap(this.playerTop, this.finishTop, () => {
            this.finishRace('top');

        });

        // BOTTOM
        this.finishBottom = this.physics.add.sprite(CONFIG.WIDTH + 50, yBot, 'FinishLine')
            .setOrigin(0.5, 1)
            .setDepth(4)
            .setScale(0.45)
            .setImmovable(true)
            .setVelocityX(-(this.state.lanes.bottom.speed * 150));

        // Colision with BOTTOM player
        this.physics.add.overlap(this.playerBottom, this.finishBottom, () => {
            this.finishRace('bottom');
        });

    }

    // --- GENERATE MAP ---
    generateMapData() {
        const createSequence = () => {
            let seq = ["fence", "fence", "fence", "fence", "fence", "booster", "booster", "life", "kawiki", "kawiki"];
            
            // Shuffle (it is done by P1 and send to the P2)
            Phaser.Utils.Array.Shuffle(seq);
            Phaser.Utils.Array.Shuffle(seq);
            
            let t = 1500;
            return seq.map(type => {
                const delay = t;
                t += Phaser.Math.Between(1800, 2800);
                return { type, delay };
            });
        };

        return {
            top: createSequence(),
            bottom: createSequence()
        };
    }

    startSpawner() {
        if (!this.syncedMapData) {
            console.warn("Esperando datos del mapa...");
            this.time.delayedCall(500, () => this.startSpawner());
            return;
        }

        console.log("Iniciando Spawners con datos sincronizados");
        this.spawnQueue = this.syncedMapData; //We use the data recieved

        // -------- TOP LANE --------
        this.spawnQueue.top.forEach(spawn => {
            this.time.delayedCall(spawn.delay, () => {
                //Bloquea spawn si llegamos al 90%
                if (this.state.running && !this.state.finished && !this.closeToFinish("top")) {
                    this.spawnFixed("top", spawn.type);
                }
            });
        });

        // -------- BOTTOM LANE --------
        this.spawnQueue.bottom.forEach(spawn => {
            this.time.delayedCall(spawn.delay, () => {
                if (this.state.running && !this.state.finished && !this.closeToFinish("bottom")) {
                    this.spawnFixed("bottom", spawn.type);
                }
            });
        });
    }


    finishRace(winner) {

        if (this.state.finished) return;
        this.state.finished = true;
        this.state.running = false;

        // Dark background
        this.overlay = this.add.rectangle(
            this.scale.width / 2,
            this.scale.height / 2,
            this.scale.width,
            this.scale.height,
            0x000000,
            0.55
        ).setDepth(24).setScrollFactor(0);

        // Stop EVERYTHINHG!
        const stopGroup = g => g.children.each(o => {
            if (o && o.body) o.body.setVelocity(0, 0);
        });

        stopGroup(this.obstaclesTop);
        stopGroup(this.boostersTop);
        stopGroup(this.lifeBoostersTop);
        stopGroup(this.kawikiTop);

        stopGroup(this.obstaclesBot);
        stopGroup(this.boostersBot);
        stopGroup(this.lifeBoostersBot);
        stopGroup(this.kawikiBot);

        // Stop ponis
        if (this.playerTop && this.playerTop.anims) this.playerTop.anims.pause();
        if (this.playerBottom && this.playerBottom.anims) this.playerBottom.anims.pause();

        if (this.finishTop && this.finishTop.body)
            this.finishTop.body.setVelocityX(0);

        if (this.finishBottom && this.finishBottom.body)
            this.finishBottom.body.setVelocityX(0);


        // Recover the name of the ponis
        const p1 = this.registry.get('player1Character') || {};
        const p2 = this.registry.get('player2Character') || {};

        // WINNER
        const winnerKey = winner === 'top' ? p1 : p2;
        const winnerName = winnerKey?.key || p1 || 'Jugador';

        // LOOSER
        const looserKey = winner === 'top' ? p2 : p1;
        const looserName = looserKey?.key || p2 || 'Jugador';

        // Saves name for Final Scene
        this.registry.set('looser', looserName);

        // Shows who won
        this.winSound.play();
        const msg = `¡${winnerName} WON!`;

        const label = this.add.text(this.scale.width / 2, this.scale.height / 2, msg, {
            fontFamily: 'Arial Black',
            fontSize: '64px',
            color: '#ffffff',
            stroke: '#ff69b4',
            strokeThickness: 8
        }).setOrigin(0.5)
            .setScale(0.5)
            .setAlpha(0)
            .setDepth(26);

        this.tweens.add({
            targets: label,
            alpha: 1,
            scale: 1,
            duration: 2000,
            ease: 'Back.Out'
        });

        // START FINAL SCENE (after 3 secs): 
        this.time.delayedCall(3000, () => {
            this.game.bgrsMusic.stop();
            this.scene.start('StableScene');
        });

    }


    // ---------- Loop ----------
    update(_, dtMs) {

        this.updateProgressUI();

        if (!this.state.running || this.state.finished) return;

        const dt = dtMs / 1000;
        const topScroll = this.state.lanes.top.speed * 150 * dt;
        const botScroll = this.state.lanes.bottom.speed * 150 * dt;

        // Move floor
        this.trackTop.tilePositionX += topScroll;
        this.trackBot.tilePositionX += botScroll;

        // Clouds (slower -> parallax)
        this.cloudsTop.tilePositionX += topScroll * 0.1;
        this.cloudsBot.tilePositionX += botScroll * 0.1;

        // Plants (faster -> parallax)
        this.plantsTop.tilePositionX += topScroll * 2;
        this.plantsBot.tilePositionX += botScroll * 2;


        if (this.isOnline) {
            // --- ONLINE MODE (WE ONY CONTROL OUR LANE) ---

            //Identiy my keys
            const myJumpKey = (this.myLane === 'top') ? this.keys.jumpTop : this.keys.jumpBottom;
            const myAccelKey = (this.myLane === 'top') ? this.keys.accelTop : this.keys.accelBottom;
            const mySlowKey = (this.myLane === 'top') ? this.keys.slowTop : this.keys.slowBottom;

            const myPlayer = (this.myLane === 'top') ? this.playerTop : this.playerBottom;

            // Jump
            if (Phaser.Input.Keyboard.JustDown(myJumpKey)) {
                this.jump(myPlayer); 
                // Notify the server
                this.ws.send(JSON.stringify({
                    type: 'raceEvent',
                    payload: { roomId: this.roomId, event: 'jump' }
                }));
            }

            // Boosts
            if (Phaser.Input.Keyboard.JustDown(myAccelKey) && !this.state.lanes[this.myLane].altered) {
                this.applyAlteration(this.myLane, CONFIG.ACCEL_FACTOR); // Local
                // Notify the server
                this.ws.send(JSON.stringify({
                    type: 'raceEvent',
                    payload: { roomId: this.roomId, event: 'accel' }
                }));
            }

            // Slow
            if (Phaser.Input.Keyboard.JustDown(mySlowKey) && !this.state.lanes[this.myLane].altered) {
                this.applyAlteration(this.myLane, CONFIG.SLOW_FACTOR);
                // Notify the server
                this.ws.send(JSON.stringify({
                    type: 'raceEvent',
                    payload: { roomId: this.roomId, event: 'slow' }
                }));
            }

        } else {
            // --- LOCAL MODE ---

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
        }
        

        const vxTop = -(this.state.lanes.top.speed * 150); // do NOT touch this, ITS PERFECT!
        const vxBot = -(this.state.lanes.bottom.speed * 150);

        // TOP lane
        this.obstaclesTop.children.iterate(o => o && o.body && o.body.setVelocityX(vxTop));
        this.boostersTop.children.iterate(o => o && o.body && o.body.setVelocityX(vxTop));
        this.lifeBoostersTop.children.iterate(o => o && o.body && o.body.setVelocityX(vxTop));
        this.kawikiTop.children.iterate(o => o && o.body && o.body.setVelocityX(vxTop));

        // BOTTOM lane
        this.obstaclesBot.children.iterate(o => o && o.body && o.body.setVelocityX(vxBot));
        this.boostersBot.children.iterate(o => o && o.body && o.body.setVelocityX(vxBot));
        this.lifeBoostersBot.children.iterate(o => o && o.body && o.body.setVelocityX(vxBot));
        this.kawikiBot.children.iterate(o => o && o.body && o.body.setVelocityX(vxBot));

        // Move finish line
        if (this.finishTop && this.finishTop.body)
            this.finishTop.body.setVelocityX(vxTop);

        if (this.finishBottom && this.finishBottom.body)
            this.finishBottom.body.setVelocityX(vxBot);


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
        clean(this.obstaclesTop);
        clean(this.boostersTop);
        clean(this.lifeBoostersTop);
        clean(this.kawikiTop);

        clean(this.obstaclesBot);
        clean(this.boostersBot);
        clean(this.lifeBoostersBot);
        clean(this.kawikiBot);

        const controls = this.registry.get('controls');
        this.keys = this.input.keyboard.addKeys({
            jumpTop: controls.jumpTop,
            jumpBottom: controls.jumpBottom,
            accelTop: 'S',
            accelBottom: 'I',
            slowTop: 'NUMPAD_EIGHT',
            slowBottom: 'NUMPAD_TWO'
        });
    }
}