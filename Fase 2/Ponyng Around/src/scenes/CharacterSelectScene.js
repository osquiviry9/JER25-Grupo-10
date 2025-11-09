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

        // Frame
        this.load.image('Frame', 'assets/Elements/GameFrame.PNG');

        this.ponies.forEach(pony => {
            this.load.image(`${pony.key}_static`, pony.path);

        });
        this.load.image('background', 'assets/Backgrounds/backgroundColor3.png');
        this.load.image('border1', 'assets/UI/Border1_Selector.png');
        this.load.image('border2', 'assets/UI/Border2_Selector.png');
        this.load.image('arrowIzq', 'assets/UI/ArrowsIzq_Selector.png');
        this.load.image('arrowDer', 'assets/UI/ArrowsDer_Selector.png');
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
        this.backButton = this.add.text(40, 40, '⬅', {
            fontSize: '32px',
            fontFamily: 'Arial Black',
            color: '#ffffff',
            backgroundColor: '#ff69b4',
            padding: { left: 10, right: 10, top: 6, bottom: 6 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setDepth(10);

        this.backButton.on('pointerover', () => {
            this.backButton.setStyle({ backgroundColor: '#ff8ac7' });
        });
        this.backButton.on('pointerout', () => {
            this.backButton.setStyle({ backgroundColor: '#ff69b4' });
        });

        this.backButton.on('pointerdown', () => {
            this.cameras.main.fadeOut(400, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('MainMenuScene');
            });
        });


        const { width, height } = this.scale;

        this.cameras.main.setBackgroundColor('#000000');
        // this.cameras.main.fadeIn(600, 255, 198, 224);

        const bg = this.add.image(width / 2, height / 2, 'background');
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
            this.registry.set('player1Character', this.selectedPonies.p1);
            this.registry.set('player2Character', this.selectedPonies.p2);

            this.cameras.main.fadeOut(600, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('RaceScene');
            });
        });

        const margin = 0.8;
        const zoomX = (width * margin) / width;
        const zoomY = (height * margin) / height;
        const zoom = Math.min(zoomX, zoomY);

        this.cameras.main.setZoom(zoom);
        this.cameras.main.centerOn(width / 2, height / 2);
    }

    createCharacterPanel(player, centerX, centerY) {
        // Show actual poni
        const pony = this.ponies[this.currentIndex[player]];
        const image = this.add.image(centerX, centerY - 40, `${pony.key}_static`)
            .setOrigin(0.5)
            .setDisplaySize(580, 600)
            .setScale(0.5);

        // Shows the 2 possible asset for the border
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

        // Shows the name of the poni on sceen
        const nameText = this.add.text(centerX, centerY - 380, pony.key, {
            fontSize: '28px',
            fontFamily: 'Arial Black',
            color: '#000'
        }).setOrigin(0.5);


        // Shows the arrows to change character
        const leftArrow = this.add.image(centerX - 325, centerY - 30, 'arrowIzq'
        ).setOrigin(0.5).setInteractive({ useHandCursor: true }).setScale(0.4);

        const rightArrow = this.add.image(centerX + 320, centerY - 30, 'arrowDer',
        ).setOrigin(0.5).setInteractive({ useHandCursor: true }).setScale(0.38);

        leftArrow.on('pointerdown', () => {
            if (!this.selected[player]) {
                this.changePony(player, -1, image, nameText, readyButton);
            }
        });

        rightArrow.on('pointerdown', () => {
            if (!this.selected[player]) {
                this.changePony(player, 1, image, nameText);
            }
        });


        // Shows the ready button to choose the character
        const readyButton = this.add.text(centerX, centerY + 320, 'Done', {
            fontSize: '32px',
            fontFamily: 'Arial Black',
            backgroundColor: '#ff69b4',
            color: '#fff',
            padding: { left: 20, right: 20, top: 10, bottom: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        // Shows cancel button, so the player can choose another poni once they have pressed the ready button (it's invisible at firt)
        const cancelButton = this.add.text(centerX, centerY + 320, 'Cancel', {
            fontSize: '32px',
            fontFamily: 'Arial Black',
            backgroundColor: '#242121ff',
            color: '#fff',
            padding: { left: 20, right: 20, top: 10, bottom: 10 }
        }).setOrigin(0.5).setVisible(false).setInteractive({ useHandCursor: true });


        readyButton.on('pointerdown', () => {
            if (readyButton.alpha < 1) return;      // checks if the ready button can be pressed (if the poni is selected by the other player)

            this.selected[player] = true;
            readyButton.setStyle({ backgroundColor: '#242121ff' });

            // Shows the cancel button once the ready button is pressed
            cancelButton.setVisible(true);

            // Registers selected poni and calls the methods bellow so hte 'Done0 button is updated and then checks if they are both ready
            const selectedPony = this.ponies[this.currentIndex[player]];
            this.selectedPonies[player] = selectedPony;
            this.updateReadyButtons();
            this.checkReady();
        });

        cancelButton.on('pointerdown', () => {

            this.selected[player] = false;

            // Shows the ready button and restores it's style
            cancelButton.setVisible(false);
            readyButton.setStyle({ backgroundColor: '#ff69b4' });

            // Update the ready button so the player can change ponis again
            this.updateReadyButtons();
            //this.checkReady();
            if (!(this.selected.p1 && this.selected.p2)) {
                this.startButton.setVisible(false);
                this.startButton.setAlpha(0);
            }
        });


        // Saves reference
        this[`readyButton_${player}`] = readyButton;
        this[`cancelButton_${player}`] = cancelButton;
    }

    changePony(player, direction, image, nameText) {
        const total = this.ponies.length;
        this.currentIndex[player] = (this.currentIndex[player] + direction + total) % total;

        const newPony = this.ponies[this.currentIndex[player]];
        image.setTexture(`${newPony.key}_static`);
        nameText.setText(newPony.key);

        this.updateReadyButtons();
    }

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



/*
 /*createPoniesGrid() {
    const { width, height } = this.scale;

    const iconSize = 95;
    const spacing = 120;

    const p1_y = 170;
    const p2_y = 380;

    const nameOffset = 75;

    const totalWidth = spacing * (this.ponies.length - 1);
    const startX = width / 2 - totalWidth / 2;

    this.iconGroups = { p1: [], p2: [] };



    this.ponies.forEach((pony, i) => {
        const x = startX + i * spacing;

        const icon1 = this.add.image(x, p1_y, `${pony.key}_static`)
            .setInteractive({ useHandCursor: true })
            .setData('ponyKey', pony.key)
            .setData('player', 'p1')
            .setOrigin(0.5);

        icon1.setScale(iconSize / icon1.width);
        icon1.on('pointerdown', () => this.selectPony('p1', pony, icon1, p1_y, nameOffset));
        this.iconGroups.p1.push(icon1);

        const icon2 = this.add.image(x, p2_y, `${pony.key}_static`)
            .setInteractive({ useHandCursor: true })
            .setData('ponyKey', pony.key)
            .setData('player', 'p2')
            .setOrigin(0.5);

        icon2.setScale(iconSize / icon2.width);
        icon2.on('pointerdown', () => this.selectPony('p2', pony, icon2, p2_y, nameOffset));
        this.iconGroups.p2.push(icon2);
    });
}

selectPony(player, pony, icon) {
    const nameOffset = 90;
    const videoSize = 95;
    const otherPlayer = player === 'p1' ? 'p2' : 'p1';

    if (this.selectedPonies[otherPlayer]?.key === pony.key) return;

    this.selectedPonies[player] = pony;

    ['Highlight', 'NameText', 'Video'].forEach(type => {
        if (this[player + type]) this[player + type].destroy();
    });

    this[player + 'Highlight'] = this.add.rectangle(icon.x, icon.y, 120, 120)
        .setStrokeStyle(6, 0xff69b4)
        .setOrigin(0.5)
        .setDepth(3);

    const video = this.add.video(icon.x, icon.y, `${pony.key}_anim`)
        .setOrigin(0.5)
        .setDepth(2);
    video.play(true);

    const scale = videoSize / Math.max(video.width, video.height);
    video.setScale(scale);

    const maskGraphics = this.make.graphics({ add: false });
    maskGraphics.fillStyle(0xffffff);
    maskGraphics.fillRect(
        icon.x - videoSize / 2,
        icon.y - videoSize / 2,
        videoSize,
        videoSize
    );
    video.setMask(maskGraphics.createGeometryMask());
    this[player + 'Video'] = video;

    this[player + 'NameText'] = this.add.text(icon.x, icon.y + nameOffset, pony.key.toUpperCase(), {
        fontSize: '24px',
        fontFamily: 'Arial Black',
        color: '#000'
    }).setOrigin(0.5).setDepth(4);

    if (this.selectedPonies.p1 && this.selectedPonies.p2) {
        this.showStartButton();
    }
}



showSelectedVideo(pony, icon) {
    const x = icon.x;
    const y = icon.y;

    icon.destroy();

    const video = this.add.video(x, y, `${pony.key}_anim`);

    const maxSize = 150;

    video.setDisplaySize(
        maxSize,
        maxSize * (video.height / video.width)
    );

    video.setOrigin(0.5);

    const maskShape = this.make.graphics();
    maskShape.fillStyle(0xffffff);
    maskShape.fillRect(
        x - maxSize / 2,
        y - maxSize / 2,
        maxSize,
        maxSize
    );
    const mask = maskShape.createGeometryMask();
    video.setMask(mask);

    video.play(true);
}

*/
