import Phaser from 'phaser';

export default class SettingsScene extends Phaser.Scene {
    constructor() {
        super('SettingsScene');
    }

    preload() {/*IN BootScene.js*/}

    create() {

        this.music = this.sound.add('clickSound', {
        });

        const { width, height } = this.scale;

        // Inicial volume (from 0 to 10)
        this.volumeLevel = this.game.volumeLevel ?? 6;
        this.maxVolume = 10;

        // Music inicial
        this.musicLevel = this.game.musicLevel ?? 2;

        this.cameras.main.setBackgroundColor('#000000ff');

        // Background
        this.add.image(width / 2, height / 2, 'BackgroundSet');

        // Frame
        this.add.image(width / 2, height / 2, 'Frame').setDepth(3);

        // Sound and music icons:
        this.add.image((width / 2) + 150, (height / 2) - 200, 'Music');
        this.add.image((width / 4) - 100, (height / 2) - 200, 'Sound');

        // Save last scene
        this.previousScene = this.scene.settings.data.previousScene;

        // ============== BUTTONS ==============
        // BACK button
        const backBtn = this.add.image((width / 2) - 800, (height / 2) - 400, 'bttnBack')
            .setInteractive({ useHandCursor: true })
            .setScale(1);

        // Hover
        backBtn.on('pointerover', () => {
            backBtn.setTexture('bttnBackHover');
            backBtn.setScale(1.05);
        });

        backBtn.on('pointerout', () => {
            backBtn.setTexture('bttnBack');
            backBtn.setScale(1);
        });

        // Back to previous scene
        backBtn.on('pointerdown', () => {

            this.music.play();
            this.scene.start(this.previousScene);


            //this.scene.stop('SettingsScene');                 // cierra la escena de opciones
            //this.scene.resume(this.previousScene); // vuelve a la escena que la abrió
        });

        // HELP button
        const helpBtn = this.add.image((width / 2), (height / 2) + 300, 'bttnHelp')
            .setInteractive({ useHandCursor: true })
            .setScale(1);

        // Hover
        helpBtn.on('pointerover', () => {
            helpBtn.setTexture('bttnHelpHover');
            helpBtn.setScale(1.05);
        });

        helpBtn.on('pointerout', () => {
            helpBtn.setTexture('bttnHelp');
            helpBtn.setScale(1);
        });

        // Go to HELP scene
        helpBtn.on('pointerdown', () => {

            this.music.play();
            this.scene.start('HelpScene');

        });

        // BARS POSITION
        const barXS = width * 0.5 - 370; // x sound bar
        const barXM = width * 0.5 + 300; // x music bar
        const barY = (height / 2) - 200;

        // Change lvl buttons (+ and -)
        this.soundButtons = this.createVolumeButtons(
            barXS,
            barY,
            () => { this.changeVolume(-1); this.music.play(); }, // if pressed -
            () => { this.changeVolume(1); this.music.play(); }  // if pressed +
        );

        this.musicButtons = this.createVolumeButtons(
            barXM,
            barY,
            () => { this.changeMusicVolume(-1); this.music.play(); },
            () => { this.changeMusicVolume(1); this.music.play(); }
        );

        // SOUND BAR
        this.soundBars = this.createBars(
            barXS,
            barY,
            this.volumeLevel,
            this.maxVolume,
            0x2b6b29,   // dark green -> active
            0xbfe9bd    // light green -> inactive
        );

        // MUSIC BAR 
        this.musicBars = this.createBars(
            barXM,
            barY,
            this.musicLevel,
            this.maxVolume,
            0x2b6b29,
            0xbfe9bd
        );


        // ============== CHANGE CONTROLS ==============
        let controls = this.registry.get('controls');

        const createControlText = (x, y, label, keyVal, waitingId) => {
            const text = this.add.text(x, y, `${label}: ${keyVal}`, {
                fontSize: '32px',
                fontFamily: 'Arial Black',
                color: '#6ccf68ff',
                stroke: '#3f723dff',
                strokeThickness: 6,
                align: 'center'
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

            text.on('pointerover', () => { text.setScale(1.1); text.setColor('#61b45eff'); });
            text.on('pointerout', () => { text.setScale(1); text.setColor('#6ccf68ff'); });
            
            text.on('pointerdown', () => {
                this.music.play();
                if (this.waitingKey) {
                    this.sound.play('clickSound');
                    return;
                }
                this.waitingKey = waitingId;
                text.setText("Press a key...");
            });
            return text;
        };

        // Posiciones
        const col1 = width * 0.35;
        const col2 = width * 0.65;
        const row1 = 550;
        const row2 = 630; 

        // --- PLAYER 1 ---
        const changeKeyTop = createControlText(col1, row1, "P1 Jump", controls.jumpTop, 'jumpTop');
        const changePoopTop = createControlText(col1, row2, "P1 Action", controls.poopTop || 'NUMPAD_8', 'poopTop');

        // --- PLAYER 2 ---
        const changeKeyBottom = createControlText(col2, row1, "P2 Jump", controls.jumpBottom, 'jumpBottom');
        const changePoopBottom = createControlText(col2, row2, "P2 Action", controls.poopBottom || 'NUMPAD_2', 'poopBottom');


        // --- KEYBOARD LISTENER ---
        this.input.keyboard.on('keydown', event => {
            if (!this.waitingKey) return;

            const currentControls = this.registry.get('controls');
            const newKey = event.code.replace('Key', '').replace('Arrow', '').toUpperCase();

            if (this.waitingKey === 'jumpTop') {
                currentControls.jumpTop = newKey;
                changeKeyTop.setText(`P1 Jump: ${newKey}`);
            } 
            else if (this.waitingKey === 'poopTop') {
                currentControls.poopTop = newKey;
                changePoopTop.setText(`P1 Action: ${newKey}`);
            }
            else if (this.waitingKey === 'jumpBottom') {
                currentControls.jumpBottom = newKey;
                changeKeyBottom.setText(`P2 Jump: ${newKey}`);
            }
            else if (this.waitingKey === 'poopBottom') {
                currentControls.poopBottom = newKey;
                changePoopBottom.setText(`P2 Action: ${newKey}`);
            }

            this.registry.set('controls', currentControls);
            this.waitingKey = null;
        });

        // Zoom
        const margin = 0.8;
        const zoomX = (width * margin) / width;
        const zoomY = (height * margin) / height;
        const zoom = Math.min(zoomX, zoomY);

        this.cameras.main.setZoom(zoom);
        this.cameras.main.centerOn(width / 2, height / 2);
    }

    // CREATE BAR FUNC
    createBars(x, y, currentLevel, maxLevel, activeColor, inactiveColor, spacing = 30) {
        const bars = [];

        for (let i = 0; i < maxLevel; i++) {
            const bar = this.add.rectangle(
                x + i * spacing,
                y,
                20,
                40,
                i < currentLevel ? activeColor : inactiveColor
            );
            bars.push(bar);
        }

        return bars;
    }

    createVolumeButtons(x, y, onMinus, onPlus, color = '#4ca149ff') {
        const minusButton = this.add.text(x - 60, y, '–', {
            fontFamily: 'Arial',
            fontSize: '64px',
            color: color,
            stroke: '#000000',
            strokeThickness: 6
        }).setInteractive({ useHandCursor: true })
            .setOrigin(0.5);

        const plusButton = this.add.text(x + this.maxVolume * 30 + 40, y, '+', {
            fontFamily: 'Arial',
            fontSize: '64px',
            color: color,
            stroke: '#000000',
            strokeThickness: 6
        }).setInteractive({ useHandCursor: true })
            .setOrigin(0.5);

        minusButton.on('pointerdown', onMinus);
        plusButton.on('pointerdown', onPlus);

        return { minusButton, plusButton };
    }

    // Update volume
    changeVolume(delta) {
        this.volumeLevel = Phaser.Math.Clamp(this.volumeLevel + delta, 0, this.maxVolume);

        for (let i = 0; i < this.maxVolume; i++) {
            this.soundBars[i].setFillStyle(i < this.volumeLevel ? 0x2b6b29 : 0xbfe9bd);
        }

        this.sound.volume = this.volumeLevel / this.maxVolume;
        this.game.volumeLevel = this.volumeLevel;
    }

    // Update music
    changeMusicVolume(delta) {
        this.musicLevel = Phaser.Math.Clamp(this.musicLevel + delta, 0, this.maxVolume);

        // Updates visually the music bars
        for (let i = 0; i < this.maxVolume; i++) {
            this.musicBars[i].setFillStyle(
                i < this.musicLevel ? 0x2b6b29 : 0xbfe9bd
            );
        }

        // Changes global music (if it is on)
        if (this.game.backgroundMusic) {
            this.game.backgroundMusic.setVolume(this.musicLevel / this.maxVolume);
        }

        // Saves music level for later scenes
        this.game.musicLevel = this.musicLevel;
    }


}


