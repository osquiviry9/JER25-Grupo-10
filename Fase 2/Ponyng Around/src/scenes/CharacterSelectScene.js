import Phaser from 'phaser';

export default class CharacterSelectScene extends Phaser.Scene {
    constructor() {
        super('CharacterSelectScene');

        this.currentPlayer = 1;
        this.selectedPonies = {
            p1: null,
            p2: null
        };
        this.currentIndex = {
            p1: 0,
            p2: 0
        };

        this.selected = {
            p1: false,
            p2: false
        };

        this.ponies = [
            { key: 'Ache', path: 'assets/ponis/Ache/Ache_Complete.png' },
            { key: 'Haiire', path: 'assets/ponis/Haire/Haire_Complete.png' },
            { key: 'Domdomdadom', path: 'assets/ponis/Dod/Dom_Complete.png' },
            { key: 'Kamil', path: 'assets/ponis/Kamil/Kamil_Complete.png' },
            { key: 'Beersquiviry', path: 'assets/ponis/Beersquiviri/Beer_Complete.png' },
        ];

        

    }

    preload() {


        //Background music
        this.load.audio('selectionSong', 'assets/sound/selectionsong.mp3');

        //Click sound
        this.load.audio('clickSound', 'assets/sound/click.mp3');

        // Frame
        this.load.image('Frame', 'assets/Elements/GreenFrame.PNG');

        this.ponies.forEach(pony => {
            this.load.image(`${pony.key}_static`, pony.path);

        });

        // Bg
        this.load.image('pinkBackground', 'assets/Backgrounds/pinkBackground.png');

        // Character frames
        this.load.image('border1', 'assets/UI/Border1_Selector.png');
        this.load.image('border2', 'assets/UI/Border2_Selector.png');

        // Arrows buttons
        this.load.image('arrowIzq', 'assets/UI/ArrowIzq_Selector.png');
        this.load.image('arrowDer', 'assets/UI/ArrowDer_Selector.png');
        this.load.image('arrowIzqOn', 'assets/UI/ArrowIzqOn_Selector.png');
        this.load.image('arrowDerOn', 'assets/UI/ArrowDerOn_Selector.png');

        // Back button
        this.load.image('bttnBack', 'assets/Buttons/backBttn.png');
        this.load.image('bttnBackHover', 'assets/Buttons/backBttn_hover.png');
    }

    showStartButton() {
        if (!this.startButton.visible) {
            this.startButton.setVisible(true);
            this.tweens.add({
                targets: this.startButton,
                alpha: 1,
                duration: 600
            });
        }
    }

    create() {

        //When the game restarts, no pony is selected
        this.selected = {
            p1: false,
            p2: false
        };


        //BACKGROUND MUSIC

        this.game.bgchMusic = this.sound.add('selectionSong', {
            loop: true,
            volume: (this.game.musicLevel ?? 5) / 10
        });
        this.game.bgchMusic.play();



        const { width, height } = this.scale;

        this.music = this.sound.add('clickSound', {
        });

        // BACK button
        const backBtn = this.add.image((width / 2) - 800, (height / 2) - 400, 'bttnBack')
            .setInteractive({ useHandCursor: true })
            .setScale(1).setDepth(20);

        // Hover
        backBtn.on('pointerover', () => {
            backBtn.setTexture('bttnBackHover');
            backBtn.setScale(1.05);
        });

        backBtn.on('pointerout', () => {
            backBtn.setTexture('bttnBack');
            backBtn.setScale(1);
        });

        // Back to main menu
        backBtn.on('pointerdown', () => {
            this.music.play();
            this.game.bgchMusic.stop();
            this.scene.start('MainMenuScene');
        });

        this.cameras.main.setBackgroundColor('#000000');
        // this.cameras.main.fadeIn(600, 255, 198, 224);

        const bg = this.add.image(width / 2, height / 2, 'pinkBackground');
        bg.setOrigin(0.5);

        // Frame
        this.add.image(width / 2, height / 2, 'Frame')
            .setDepth(10);

        // CHOOSE BUTTON
        const choose = this.title = this.add.text(width / 2, 210, 'Choose your \npony!', {
            fontSize: '40px',
            fontFamily: 'Arial Black',
            color: '#ff69b4',
            stroke: '#ffffff',
            strokeThickness: 6,
            align: 'center'
        })
            .setOrigin(0.5);

        this.tweens.add({
            targets: choose,
            scale: { from: 1, to: 1.05 },
            yoyo: true,
            repeat: -1,
            duration: 800
        });

        // A random value is asigned to each player so the poni in the selector appears random every time, and it's different from each player

        let randomIndexP1 = Phaser.Math.Between(0, this.ponies.length - 1);
        let randomIndexP2 = Phaser.Math.Between(0, this.ponies.length - 1);

        while (randomIndexP2 === randomIndexP1) {
            randomIndexP2 = Phaser.Math.Between(0, this.ponies.length - 1);
        }
        this.currentIndex.p1 = randomIndexP1;
        this.currentIndex.p2 = randomIndexP2;

        // PANELS
        this.createCharacterPanel('p1', width * 0.29, height * 0.55);
        this.createCharacterPanel('p2', width * 0.71, height * 0.55);

        // START BUTTON
        const start = this.startButton = this.add.text(width / 2, height - 200, 'START', {
            fontSize: '50px',
            fontFamily: 'Arial',
            color: '#ff69b4',
            stroke: '#ffffff',
            strokeThickness: 6
        })
            .setOrigin(0.5)
            .setAlpha(0)
            .setInteractive({ useHandCursor: true })
            .setVisible(false);

        this.tweens.add({
            targets: start,
            scale: { from: 1, to: 1.05 },
            yoyo: true,
            repeat: -1,
            duration: 800
        });

        this.startButton.on('pointerdown', () => {
            this.music.play();
            this.registry.set('player1Character', this.selectedPonies.p1);
            this.registry.set('player2Character', this.selectedPonies.p2);


            this.cameras.main.fadeOut(600, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.game.bgchMusic.stop();
                this.scene.start('RaceScene');
            });
        });

        const margin = 0.8;
        const zoomX = (width * margin) / width;
        const zoomY = (height * margin) / height;
        const zoom = Math.min(zoomX, zoomY);

        this.cameras.main.setZoom(zoom);
        this.cameras.main.centerOn(width / 2, height / 2);

        // ----------- KEYBOARD CONTROLS -----------

        this.keysP1 = this.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            jump: Phaser.Input.Keyboard.KeyCodes.W
        });

        this.keysP2 = this.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            jump: Phaser.Input.Keyboard.KeyCodes.UP
        });

        // --- PLAYER 1 ---
        this.keysP1.left.on('down', () => {
            if (!this.selected.p1) {
                this.changePony('p1', -1, this[`ponyImage_p1`], this[`ponyName_p1`]);
            }
        });

        this.keysP1.right.on('down', () => {
            if (!this.selected.p1) {
                this.changePony('p1', 1, this[`ponyImage_p1`], this[`ponyName_p1`]);
            }
        });

        this.keysP1.jump.on('down', () => {
            if (!this.selected.p1) {

                this[`readyButton_p1`].emit('pointerdown');
                this.music.play();
            } else {

                this[`cancelButton_p1`].emit('pointerdown');
                this.music.play();
            }
        });

        // --- PLAYER 2 ---
        this.keysP2.left.on('down', () => {
            if (!this.selected.p2) {
                this.changePony('p2', -1, this[`ponyImage_p2`], this[`ponyName_p2`]);
            }
        });

        this.keysP2.right.on('down', () => {
            if (!this.selected.p2) {
                this.changePony('p2', 1, this[`ponyImage_p2`], this[`ponyName_p2`]);
            }
        });

        this.keysP2.jump.on('down', () => {
            if (!this.selected.p2) {

                this[`readyButton_p2`].emit('pointerdown');
                this.music.play();
            } else {

                this[`cancelButton_p2`].emit('pointerdown');
                this.music.play();
            }
        });


    }

    createCharacterPanel(player, centerX, centerY) {
        // ----------- PONI ASSETS  -----------
        const pony = this.ponies[this.currentIndex[player]];
        const image = this.add.image(centerX, centerY - 40, `${pony.key}_static`)
            .setOrigin(0.5)
            .setDisplaySize(580, 600)
            .setScale(0.5);
        this[`ponyImage_${player}`] = image;


        // ----------- BORDERS  -----------
        const borderKey = player;
        if (borderKey === 'p1') {
            const border = this.add.image(centerX, centerY - 40, 'border1')
                .setOrigin(0.5)
                .setDisplaySize(635, 700)
                .setScale(0.5);
        }
        else {
            const border = this.add.image(centerX, centerY - 40, 'border2')
                .setOrigin(0.5)
                .setDisplaySize(635, 700)
                .setScale(0.5);
        }

        // ----------- NAME TEXT  -----------
        const nameText = this.add.text(centerX, centerY - 380, pony.key, {
            fontSize: '28px',
            fontFamily: 'Arial Black',
            color: '#000'
        }).setOrigin(0.5);
        this[`ponyName_${player}`] = nameText;


        // ----------- JUMPING TEXT  -----------
        const jumpKeyText = (player === 'p1') ? 'Jump with  W!' : 'Jump with  ↑!';
        const jumpKeyColor = (player === 'p1') ? '#ff69b4' : '#67b7ff';

        this.add.text(centerX, centerY + 390, jumpKeyText, {
            fontFamily: 'Arial Black',
            fontSize: '28px',
            color: jumpKeyColor,
            stroke: '#000000',
            strokeThickness: 5,
            shadow: {
                offsetX: 3,
                offsetY: 3,
                color: '#000000',
                blur: 6,
                fill: true
            }
        }).setOrigin(0.5).setDepth(5);

        // ----------- ARROWS  -----------
        const arrows = [
            { x: centerX - 337, y: centerY - 30, key: 'arrowIzq', hover: 'arrowIzqOn', scale: 0.43 },
            { x: centerX + 332, y: centerY - 30, key: 'arrowDer', hover: 'arrowDerOn', scale: 0.41 },
        ];

        arrows.forEach(btn => {
            const button = this.add.image(btn.x, btn.y, btn.key)
                .setInteractive({ useHandCursor: true })
                .setScale(btn.scale);

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

            // Click
            button.on('pointerdown', () => {
                this.music.play();
                if (!this.selected[player]) {
                    this.changePony(player, -1, image, nameText, readyButton);
                }
            });
        })

        const keyLabel = (player === 'p1') ? 'W' : '↑';

        // ----------- DONE BUTTON -----------
        const readyButton = this.add.text(centerX, centerY + 320, `Done (${keyLabel})`, {
            fontSize: '32px',
            fontFamily: 'Arial Black',
            backgroundColor: '#ff69b4',
            color: '#fff',
            padding: { left: 20, right: 20, top: 10, bottom: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        readyButton.on('pointerdown', () => {
            this.music.play();
            if (readyButton.alpha < 1) return;

            this.selected[player] = true;
            readyButton.setStyle({ backgroundColor: '#242121ff' });

            cancelButton.setVisible(true);

            const selectedPony = this.ponies[this.currentIndex[player]];
            this.selectedPonies[player] = selectedPony;
            this.updateReadyButtons();
            this.checkReady();
        });

        // ----------- CANCEL BUTTON -----------
        const cancelButton = this.add.text(centerX, centerY + 320, `Cancel (${keyLabel})`, {
            fontSize: '32px',
            fontFamily: 'Arial Black',
            backgroundColor: '#242121ff',
            color: '#fff',
            padding: { left: 20, right: 20, top: 10, bottom: 10 }
        }).setOrigin(0.5).setVisible(false).setInteractive({ useHandCursor: true });

        cancelButton.on('pointerdown', () => {
            this.music.play();
            this.selected[player] = false;

            cancelButton.setVisible(false);
            readyButton.setStyle({ backgroundColor: '#ff69b4' });

            // Update the ready button so the player can change ponis again
            this.updateReadyButtons();
            if (!(this.selected.p1 && this.selected.p2)) {
                this.startButton.setVisible(false);
                this.startButton.setAlpha(0);
            }
        });


        this[`readyButton_${player}`] = readyButton;
        this[`cancelButton_${player}`] = cancelButton;
    }

    // ----------- CHANGE PONI FROM FRAME -----------
    changePony(player, direction, image, nameText) {
        const total = this.ponies.length;
        this.currentIndex[player] = (this.currentIndex[player] + direction + total) % total;

        const newPony = this.ponies[this.currentIndex[player]];
        image.setTexture(`${newPony.key}_static`);
        nameText.setText(newPony.key);

        this.updateReadyButtons();
    }

    // ----------- UPDATES READY BUTTON SO PLAYER CANT CHOOSE THE SAME PONI -----------
    updateReadyButtons() {
        const p1Index = this.currentIndex.p1;
        const p2Index = this.currentIndex.p2;

        if (p1Index === p2Index && (this.selected.p1 || this.selected.p2)) {
            if (!this.selected.p1)
                this[`readyButton_p1`].setAlpha(0.5).disableInteractive();
            if (!this.selected.p2)
                this[`readyButton_p2`].setAlpha(0.5).disableInteractive();
        } else {
            if (!this.selected.p1)
                this[`readyButton_p1`].setAlpha(1).setInteractive({ useHandCursor: true });
            if (!this.selected.p2)
                this[`readyButton_p2`].setAlpha(1).setInteractive({ useHandCursor: true });
        }
    }

    // ----------- CHECK IF BOTH PLAYERS ARE READY -----------
    checkReady() {
        if (this.selected.p1 && this.selected.p2) {
            this.tweens.add({
                targets: this.startButton,
                alpha: 1,
                duration: 600,
                onStart: () => this.startButton.setVisible(true)
            });
        }
    }


}



