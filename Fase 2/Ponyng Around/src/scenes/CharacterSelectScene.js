import Phaser from 'phaser';

export default class CharacterSelectScene extends Phaser.Scene {
    constructor() {
        super('CharacterSelectScene');

        this.currentPlayer = 1;
        this.selectedPonies = {
            p1: null,
            p2: null
        };

        this.ponies = [
            { key: 'Ache', path: 'assets/ponis/Henar/' },
            { key: 'Haiire', path: 'assets/ponis/Julia/' },
            { key: 'Inigo', path: 'assets/ponis/Inigo/' },
            { key: 'Kamil', path: 'assets/ponis/Silvia/' },
            { key: 'Beersquiviry', path: 'assets/ponis/Oscar/' },
            { key: 'Mayo', path: 'assets/ponis/Maria/' }

        ];
    }

    preload() {
        this.ponies.forEach(pony => {
            this.load.image(`${pony.key}_static`, `${pony.path}static.jpg`);
            this.load.video(`${pony.key}_anim`, `${pony.path}anim.mp4`, 'loadeddata', false, true);
        });
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

        this.cameras.main.setBackgroundColor('#FFC6E0');
        this.cameras.main.fadeIn(600, 255, 198, 224);

        this.title = this.add.text(width / 2, 50, 'Elige tu Poni!!', {
            fontSize: '40px',
            fontFamily: 'Arial Black',
            color: '#ff69b4',
            stroke: '#ffffff',
            strokeThickness: 6
        }).setOrigin(0.5);


        this.createPoniesGrid();

        this.startButton = this.add.text(width / 2, height - 80, 'INICIAR CARRERA', {
            fontSize: '50px',
            fontFamily: 'Arial',
            color: '#000000ff'
        })
            .setOrigin(0.5)
            .setAlpha(0)
            .setInteractive({ useHandCursor: true })
            .setVisible(false);

        this.startButton.on('pointerdown', () => {
            this.registry.set('player1Character', this.selectedPonies.p1);
            this.registry.set('player2Character', this.selectedPonies.p2);

            this.cameras.main.fadeOut(600, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('GameScene');
            });
        });
    }

    createPoniesGrid() {
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


}
