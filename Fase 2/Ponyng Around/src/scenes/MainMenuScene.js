import Phaser from 'phaser';

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('MainMenuScene');
    }

    preload() {

        // Background
        this.load.image('menuBackground', 'assets/Backgrounds/StartingMenu.JPG');

        // Buttons
        // Play button
        this.load.image('bttnPlay', 'assets/Buttons/playbttn.png');
        this.load.image('bttnPlayHover', 'assets//Buttons/playbttn_hover.png');

        // Settings button
        this.load.image('bttnSettings', 'assets/Buttons/settingsbttn.png');
        this.load.image('bttnSettingsHover', 'assets/Buttons/settingsbttn_hover.png');

        // Credit button
        this.load.image('bttnCredits', 'assets/Buttons/creditsbttn.png');
        this.load.image('bttnCreditsHover', 'assets/Buttons/creditsbttn_hover.png');
        
    }

    create() {

        const { width, height } = this.scale;

        this.cameras.main.setBackgroundColor('#000000'); // cambiar ?

        const bg = this.add.image(width / 2, height / 2, 'menuBackground');
        bg.setOrigin(0.5);
        bg.setScale(0.8); 

        /* 
        const title = this.add.text(width / 2, height * 0.25, 'PONYNG AROUND', {
            fontFamily: 'Arial',
            fontSize: '64px',
            fontStyle: 'bold',
            color: '#ff69b4',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.tweens.add({
            targets: title,
            scale: { from: 1, to: 1.05 },
            yoyo: true,
            repeat: -1,
            duration: 800
        });
        */

        //Lista de botones
        const buttons = [
            { x: width * 0.5, y: height * 0.2, key: 'bttnPlay', hover: 'bttnPlayHover', action: () => this.scene.start('CharacterSelectScene'), scale: 1 },
            { x: width * 0.84, y: height * 0.8, key: 'bttnSettings', hover: 'bttnSettingsHover', action: () => console.log('Abrir ajustes'), scale: 1},
            { x: width * 0.24, y: height * 0.35, key: 'bttnCredits', hover: 'bttnCreditsHover', action: () => console.log('Mostrar créditos'), scale: 0.8},
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

            // Salir hover
            button.on('pointerout', () => {
                button.setTexture(btn.key);
                button.setScale(btn.scale);
            });

            // Click
            button.on('pointerdown', btn.action);
        });
    }
}

        /*
        const menuItems = [
            { label: 'JUGAR', scene: 'CharacterSelectScene' },
            { label: 'AJUSTES', action: () => console.log('Abrir ajustes') },
            { label: 'CRÉDITOS', action: () => console.log('Mostrar créditos') }
        ];

        let startY = height * 0.45;

        menuItems.forEach((item, i) => {
            const button = this.add.text(width / 2, startY + i * 70, item.label, {
                fontFamily: 'Arial',
                fontSize: '40px',
                color: '#ffffff'
            })
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true });

            button.on('pointerover', () => {
                button.setColor('#ff69b4');
                button.setScale(1.15);
            });

            button.on('pointerout', () => {
                button.setColor('#ffffff');
                button.setScale(1);
            });

            button.on('pointerdown', () => {
                if (item.scene) {
                    this.scene.start(item.scene);
                } else if (item.action) {
                    item.action();
                }
            });
        });
        
    }
}*/
