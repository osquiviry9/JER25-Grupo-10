import Phaser from 'phaser';

export default class StoryScene extends Phaser.Scene {
    constructor() {
        super('StoryScene');

        //Import all the ponies and add a description
        this.ponies = [
            {
                key: 'Ache',
                path: 'assets/ponis/Ache/Ache_Complete.png',
                story: "She was a pegasus until Melgarga tearded her wings apart. Now she seeks revenge by learning the power of hypnotization and using it on Melgarga to finish these deadly races."
            },
            {
                key: 'Haiire',
                path: 'assets/ponis/Haire/Haire_Complete.png',
                story: "She ate a fruit called the Horn-Horn Fruit, which caused a horn to appear from her frontal lobe, allowing her to shoot lightning bolts and triggering a wave of bullying to Melgarga's henchmen. Now she seeks revenge by saving the ponies from his evil clutches."
            },
            {
                key: 'Domdomdadom',
                path: 'assets/ponis/Dod/Dom_Complete.png',
                story: "He ate the fruit after Haiire, but unlike her, he is Melgarga's pet and therefore does not want to save the other ponies."
            },
            {
                key: 'Kamil',
                path: 'assets/ponis/Kamil/Kamil_Complete.png',
                story: "A lover of other ponies's belongings, she runs around spitting out fanzines and salt & vinegar potato chips from the ponydona, controled by Mayo, a tiny pony that, through the lobotomy Kamil underwent, controls her."
            },
            {
                key: 'Beersquiviry',
                path: 'assets/ponis/Beersquiviri/Beer_Complete.png',
                story: "One day, after a long party, he woke up in the evil Melgarga pony village, running in every race hoping to leave the village and beeing able to go back home for a beer."
            }
        ];

        this.currentIndex = 0;
    }

    preload() {

        //Sound
        this.load.audio('clickSound', 'assets/sound/click.mp3');

        // Background and general frame
        this.load.image('pinkBackground', 'assets/Backgrounds/pinkBackground.png');
        this.load.image('Frame', 'assets/Elements/GreenFrame.PNG'); // <-- el marco correcto

        // Selector frame
        this.load.image('border1', 'assets/UI/Border1_Selector.png');

        // Arrows
        this.load.image('arrowIzq', 'assets/UI/ArrowIzq_Selector.png');
        this.load.image('arrowIzq_hover', 'assets/UI/ArrowIzqOn_Selector.png');
        this.load.image('arrowDer', 'assets/UI/ArrowDer_Selector.png');
        this.load.image('arrowDer_hover', 'assets/UI/ArrowDerOn_Selector.png');

        // Back button
        this.load.image('bttnBack', 'assets/Buttons/backBttn.png');
        this.load.image('bttnBackHover', 'assets/Buttons/backBttn_hover.png');

        // Poni pic
        this.ponies.forEach(p => {
            this.load.image(`${p.key}_static`, p.path);
        });
    }

    create() {

        this.music = this.sound.add('clickSound');

        this.cameras.main.setBackgroundColor('#000000ff');

        this.cameras.main.fadeIn(3000, 0, 0, 0);

        const { width, height } = this.scale;

        this.add.image(width / 2, height / 2, 'pinkBackground').setDepth(0);
        this.add.image(width / 2, height / 2, 'Frame').setDepth(3);

        // Buttons
        const buttons = [
            { x: (width / 2) - 800, y: (height / 2) - 400, key: 'bttnBack', hover: 'bttnBackHover', action: () => this.scene.start('MainMenuScene'), scale: 1 },
        ];

        buttons.forEach(btn => {
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

            // Click + sound
            button.on('pointerdown', () => {
                btn.action();
                this.music.play();
            });

        });

        // Title
        this.title = this.add.text(width / 2, 150, 'The missing ponies', {
            fontSize: '46px',
            fontFamily: 'Arial Black',
            color: '#ff69b4',
            stroke: '#ffffff',
            strokeThickness: 6
        })
            .setOrigin(0.5)
            .setDepth(20);

        // selector
        this.createSelector();

        // story panel
        this.createStoryPanel();

        this.updateStory();

        // Keyboard controls 
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // Fit into the frame
        const margin = 0.8;
        const zoomX = (width * margin) / width;
        const zoomY = (height * margin) / height;
        const zoom = Math.min(zoomX, zoomY);

        this.cameras.main.setZoom(zoom);
        this.cameras.main.centerOn(width / 2, height / 2);

    }

    createSelector() {

        const { width, height } = this.scale;

        const centerX = width * 0.27;
        const centerY = height * 0.52;

        // Frame
        this.ponyBorder = this.add.image(centerX, centerY, 'border1')
            .setDepth(10)
            .setOrigin(0.5)
            .setDisplaySize(635, 700)
            .setScale(0.5);


        // Poni pic inside the frame
        this.ponyImage = this.add.image(centerX, centerY, `${this.ponies[0].key}_static`)
            .setDepth(5)
            .setOrigin(0.5)
            .setDisplaySize(580, 600)
            .setScale(0.5);

        // Arrows
        // LEFT ONE
        this.arrowLeft = this.add.image(centerX - 360, centerY, 'arrowIzq')
            .setInteractive({ useHandCursor: true })
            .setScale(0.40)
            .setDepth(30);

        // Hover
        this.arrowLeft.on('pointerover', () => {
            this.arrowLeft.setTexture('arrowIzq_hover');
            this.arrowLeft.setScale(0.45);
        });

        this.arrowLeft.on('pointerout', () => {
            this.arrowLeft.setTexture('arrowIzq');
            this.arrowLeft.setScale(0.40);
        });

        this.arrowLeft.on('pointerdown', () => {
            this.music.play();
            this.changePony(-1);
        });

        // RIGHT ONE
        this.arrowRight = this.add.image(centerX + 360, centerY, 'arrowDer')
            .setInteractive({ useHandCursor: true })
            .setScale(0.40)
            .setDepth(30);

        // Hover
        this.arrowRight.on('pointerover', () => {
            this.arrowRight.setTexture('arrowDer_hover');
            this.arrowRight.setScale(0.45);
        });

        this.arrowRight.on('pointerout', () => {
            this.arrowRight.setTexture('arrowDer');
            this.arrowRight.setScale(0.40);
        });

        this.arrowRight.on('pointerdown', () => {
            this.music.play();
            this.changePony(1);
        });

        // Pony name
        this.ponyName = this.add.text(centerX, centerY + 350, this.ponies[0].key, {
            fontSize: '40px',
            fontFamily: 'Arial Black',
            color: '#000000',
            stroke: '#ffffff',
            strokeThickness: 6
        })
            .setOrigin(0.5)
            .setDepth(40);
    }

    createStoryPanel() {
        const { width, height } = this.scale;

        const panelX = width * 0.74;
        const panelY = height * 0.53;

        //SHADOW 
        this.storyShadow = this.add.rectangle(panelX + 12, panelY + 12, 700, 500, 0x000000, 0.18)
            .setOrigin(0.5)
            .setDepth(4);

        // PANEL  
        this.storyBg = this.add.rectangle(panelX, panelY, 700, 500, 0xffffff, 0.98)
            .setOrigin(0.5)
            .setDepth(5)
            .setStrokeStyle(6, 0xff69b4);

        // Name Holder
        this.storyRibbon = this.add.rectangle(panelX, panelY - 260, 520, 85, 0xff69b4)
            .setOrigin(0.5)
            .setDepth(6);

        // Title
        this.storyTitle = this.add.text(panelX, panelY - 262, '', {
            fontFamily: 'Arial Black',
            fontSize: '36px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center',
            wordWrap: { width: 500 }
        })
            .setOrigin(0.5)
            .setDepth(10);


        // Story text
        this.storyText = this.add.text(panelX, panelY - 180, '', {
            fontFamily: 'Arial Black',
            fontSize: '24px',
            color: '#000000',
            align: 'left',
            wordWrap: { width: 600 },
            lineSpacing: 16
        })
            .setOrigin(0.5, 0)
            .setDepth(10);

        // Little (mi mi mi mi) animation
        this.tweens.add({
            targets: this.storyBg,
            scaleX: { from: 1, to: 1.015 },
            scaleY: { from: 1, to: 1.015 },
            yoyo: true,
            repeat: -1,
            duration: 1500
        });
    }


    changePony(dir) {
        const total = this.ponies.length;
        this.currentIndex = (this.currentIndex + dir + total) % total;

        const pony = this.ponies[this.currentIndex];

        this.ponyImage.setTexture(`${pony.key}_static`);
        this.ponyName.setText(pony.key);

        this.updateStory();

    }

    updateStory() {

        const pony = this.ponies[this.currentIndex];

        // Principal text
        this.storyText.setText(pony.story);

        // Dinamic title
        let titleString = `${pony.key}'s story`;

        this.storyTitle.setText(titleString);

        // If the width is greater than 500, the font size lows
        if (this.storyTitle.width > 500) {
            this.storyTitle.setFontSize(30);
        }
        if (this.storyTitle.width > 500) {
            this.storyTitle.setFontSize(26);
        }

        // If is either longer, we put another line
        if (this.storyTitle.width > 500) {
            const parts = pony.key.match(/.{1,8}/g);
            const namePart1 = parts[0];
            const namePart2 = parts.slice(1).join('');
            titleString = `Historia de ${namePart1}\n${namePart2}`;
            this.storyTitle.setText(titleString);
            this.storyTitle.setFontSize(26);
        }
    }


    update() {

        //A or LEFT ARROW
        if (Phaser.Input.Keyboard.JustDown(this.cursors.left) ||
            Phaser.Input.Keyboard.JustDown(this.keyA)) {
            this.music.play();
            this.changePony(-1);
        }

        //D or RIGHT ARROW
        if (Phaser.Input.Keyboard.JustDown(this.cursors.right) ||
            Phaser.Input.Keyboard.JustDown(this.keyD)) {
            this.music.play();
            this.changePony(1);
        }
    }


}
