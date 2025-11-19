import Phaser from 'phaser';

export default class StoryScene extends Phaser.Scene {
    constructor() {
        super('StoryScene');

        //Import all the ponies and add a description
        this.ponies = [
            {
                key: 'Ache',
                path: 'assets/ponis/Ache/Ache_Complete.png',
                story: "Es un poni hipnotizador en aprendizaje que quiere usar sus poderes para vencer a Melgarga."
            },
            {
                key: 'Haiire',
                path: 'assets/ponis/Haire/Haire_Complete.png',
                story: "Se comió una fruta, llamada cuernocuerno fruit, esto provocó que brotase un cuerno de su lóbulo frontal, pudiendo tirar rayos desde ahí y provocando una oleada de bulliyng por parte de los secuaces de Melgarga. Ahora busca venganza salvando a los ponis de sus malvadas garras."
            },
            {
                key: 'Domdomdadom',
                path: 'assets/ponis/Dod/Dom_Complete.png',
                story: "Se comió la fruta después de Haiire, pero a diferencia de ella, es la mascota de Melgarga y por lo tanto no quiere salvar a los ponis."
            },
            {
                key: 'Kamil',
                path: 'assets/ponis/Kamil/Kamil_Complete.png',
                story: "Amante de lo ajeno, corre soltando fanzines por los ojos y patatas de sal y vinagre del ponydona, es acompañada por Mayo, una entidad que a través de la lobotomía que se hizo Kamil se coló en su cuerpo y la controla."
            },
            {
                key: 'Beersquiviry',
                path: 'assets/ponis/Beersquiviri/Beer_Complete.png',
                story: "Un día, después de una larga fiesta se despertó en la villa de los ponis, corre en cada carrera con la esperanza de salir de la villa y poder volver a su casa a tomarse una cerveza."
            }
        ];

        this.currentIndex = 0;
    }

    preload() {

        //Sound
        this.load.audio('clickSound', 'assets/sound/click.mp3');

        // Background and general frame
        this.load.image('background', 'assets/Backgrounds/backgroundColor3.png');
        this.load.image('Frame', 'assets/Elements/GreenFrame.PNG'); // <-- el marco correcto

        // Selector frame
        this.load.image('border1', 'assets/UI/Border1_Selector.png');

        // Arrows
        this.load.image('arrowIzq', 'assets/UI/ArrowIzq_Selector.png');
        this.load.image('arrowDer', 'assets/UI/ArrowDer_Selector.png');

        // Poni pic
        this.ponies.forEach(p => {
            this.load.image(`${p.key}_static`, p.path);
        });
    }

    create() {

        this.music = this.sound.add('clickSound');

        const { width, height } = this.scale;

        this.add.image(width / 2, height / 2, 'background').setDepth(0);
        this.add.image(width / 2, height / 2, 'Frame').setDepth(1);

        // Fit into the frame
        const margin = 0.8;
        const zoomX = (width * margin) / width;
        const zoomY = (height * margin) / height;
        const zoom = Math.min(zoomX, zoomY);

        this.cameras.main.setZoom(zoom);
        this.cameras.main.centerOn(width / 2, height / 2);


        // Back button
        this.backButton = this.add.text(70, 50, '⬅', {
            fontSize: '32px',
            fontFamily: 'Arial Black',
            color: '#ffffff',
            backgroundColor: '#ff69b4',
            padding: { left: 10, right: 10, top: 6, bottom: 6 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setDepth(50);

        this.backButton.on('pointerdown', () => {
            this.music.play();
            this.scene.start('MainMenuScene');
        });

        // Title
        this.title = this.add.text(width / 2, 150, 'Nuestra Historia', {
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



    }

    createSelector() {

        const { width, height } = this.scale;

        const centerX = width * 0.27;
        const centerY = height * 0.52;

        // Frame
        this.ponyBorder = this.add.image(centerX, centerY, 'border1')
            .setOrigin(0.5)
            .setDisplaySize(635, 700)
            .setScale(0.5)
            .setDepth(10);

        // Poni pic inside the frame
        this.ponyImage = this.add.image(centerX, centerY, `${this.ponies[0].key}_static`)
            .setOrigin(0.5)
            .setDisplaySize(580, 600)
            .setScale(0.5)
            .setDepth(20);

        // Arrows
        this.arrowLeft = this.add.image(centerX - 360, centerY, 'arrowIzq')
            .setInteractive({ useHandCursor: true })
            .setScale(0.40)
            .setDepth(30);

        this.arrowLeft.on('pointerdown', () => {
            this.music.play();
            this.changePony(-1);
        });

        this.arrowRight = this.add.image(centerX + 360, centerY, 'arrowDer')
            .setInteractive({ useHandCursor: true })
            .setScale(0.40)
            .setDepth(30);

        this.arrowRight.on('pointerdown', () => {
            this.music.play();
            this.changePony(1);
        });

        //Name of the poni
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

        //  PANEL  
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
        let titleString = `Historia de ${pony.key}`;

        this.storyTitle.setText(titleString);

        // 1) If the width is greater than 500, the font size lows
        if (this.storyTitle.width > 500) {
            this.storyTitle.setFontSize(30);
        }
        if (this.storyTitle.width > 500) {
            this.storyTitle.setFontSize(26);
        }

        // 2) Is is either longer, we put another line
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
