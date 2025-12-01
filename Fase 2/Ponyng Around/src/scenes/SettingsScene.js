import Phaser from 'phaser';

export default class SettingsScene extends Phaser.Scene {
    constructor() {
        super('SettingsScene');
    }

    preload() {

        //Click sound
        this.load.audio('clickSound', 'assets/sound/click.mp3');

        // Background
        this.load.image('BackgroundSet', 'assets/Backgrounds/SettingsBg.JPG');

        // Frame
        this.load.image('Frame', 'assets/Elements/GreenFrame.PNG');

        // Music icon
        this.load.image('Music', 'assets/Buttons/soundbttn.png');

        // Sound icon
        this.load.image('Sound', 'assets/Buttons/soundLvl.png');

        // =========== Buttons ===========
        // Back button
        this.load.image('bttnBack', 'assets/Buttons/backBttn.png');
        this.load.image('bttnBackHover', 'assets/Buttons/backBttn_hover.png');

        // Help button
        this.load.image('bttnHelp', 'assets/Buttons/helpBttn.PNG');
        this.load.image('bttnHelpHover', 'assets/Buttons/helpBttn_hover.PNG');
    }

    create() {

        this.music = this.sound.add('clickSound', {
        });

        const { width, height } = this.scale;

        // Volume inicial (from 0 to 10)
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

        // MUSIC BAR (no hace nada d momento -> no hay musica)
        this.musicBars = this.createBars(
            barXM,
            barY,
            this.musicLevel,
            this.maxVolume,
            0x2b6b29,
            0xbfe9bd
        );


        // CHANGE CONTROLS
        // Player 1
        let controls = this.registry.get('controls');
        const changeKeyTop = this.add.text(655, 500, `Player 1 Jump Key: ${controls.jumpTop}`, {
            fontSize: '40px',
            fontFamily: 'Arial Black',
            color: '#6ccf68ff',
            stroke: '#3f723dff',
            strokeThickness: 6,
            align: 'center'
        })
            .setScale(1.2)
            .setInteractive({ useHandCursor: true });

        changeKeyTop.on('pointerover', () => {
            changeKeyTop.setScale(1.25);
            changeKeyTop.setColor('#61b45eff');
            changeKeyTop.setStroke('#345e33ff')
        });

        changeKeyTop.on('pointerout', () => {
            changeKeyTop.setScale(1.2);
            changeKeyTop.setColor('#6ccf68ff');
            changeKeyTop.setStroke('#3f723dff');
        });

        changeKeyTop.on('pointerdown', () => {
            this.music.play();
            if (this.waitingKey) {
                this.sound.play('clickSound');
                return
            }
            this.waitingKey = 'jumpTop';
            changeKeyTop.setText("Press a key...");
        })

        // Player 2
        const changeKeyBottom = this.add.text(655, 600, `Player 1 Jump Key: ${controls.jumpBottom}`, {
            fontSize: '40px',
            fontFamily: 'Arial Black',
            color: '#6ccf68ff',
            stroke: '#3f723dff',
            strokeThickness: 6,
            align: 'center'
        })
            .setScale(1.2)
            .setInteractive({ useHandCursor: true });

        changeKeyBottom.on('pointerover', () => {
            changeKeyBottom.setScale(1.25);
            changeKeyBottom.setColor('#61b45eff');
            changeKeyBottom.setStroke('#345e33ff')
        });

        changeKeyBottom.on('pointerout', () => {
            changeKeyBottom.setScale(1.2);
            changeKeyBottom.setColor('#6ccf68ff');
            changeKeyBottom.setStroke('#3f723dff');
        });

        changeKeyBottom.on('pointerdown', () => {
            this.music.play();
            if (this.waitingKey) {
                this.sound.play('clickSound');
                return
            }
            this.waitingKey = 'jumpBottom';
            changeKeyBottom.setText("Press a key...");
        })

        // Keyboard control
        this.input.keyboard.on('keydown', event => {
            if (!this.waitingKey) return;

            const controls = this.registry.get('controls');
            const newKey = event.code.replace('Key', '').replace('Arrow', '').toUpperCase();

            // Player 1
            if (this.waitingKey === "jumpTop") {
                if (newKey === controls.jumpBottom) {
                    console.log("No puedes usar la misma tecla que el jugador 2.");
                    return;
                }

                controls.jumpTop = newKey;
                this.registry.set('controls', controls);

                changeKeyTop.setText(`Player 1 Jump Key: ${newKey}`);
                this.waitingKey = null;
                return;
            }

            // Player 2
            if (this.waitingKey === "jumpBottom") {
                if (newKey === controls.jumpTop) {
                    console.log("No puedes usar la misma tecla que el jugador 1.");
                    return;
                }

                controls.jumpBottom = newKey;
                this.registry.set('controls', controls);

                changeKeyBottom.setText(`Player 2 Jump Key: ${newKey}`);
                this.waitingKey = null;
            }
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

//PARA CAMBIAR ACCEDER AL VOLUMEN EN CUALQUIER ESCENA USAD ESTA LINEA DE CÓDIGO
// this.sound.volume = (this.game.volumeLevel ?? 5) / 10; Inicializa todo el sonido que se reproduzca en la escena a los valores en predeterminados de los ajustes.
//Ponedlo junto con el código que useis para poner la música en cada escena, antes o después eso ya no sé no he probado :o
